/**
 * sync-env.js
 *
 * Watches the environment-specific `.env` file for changes and auto-generates
 * `config/config.js` with matching entries.
 *
 * - NODE_ENV=development  →  watches `.env.development`
 * - NODE_ENV=production   →  watches `.env.production`
 *
 * Runs alongside nodemon via `npm run dev`.
 *
 * Usage:  node scripts/sync-env.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = path.resolve(__dirname, '..')
const NODE_ENV = process.env.NODE_ENV || 'development'
const ENV_FILE = `.env.${NODE_ENV}`
const ENV_PATH = path.join(ROOT_DIR, ENV_FILE)
const CONFIG_PATH = path.join(ROOT_DIR, 'config', 'config.js')

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Patterns that indicate a numeric env value */
const NUMERIC_PATTERNS = [/^PORT$/i, /_PORT$/i, /_TIMEOUT$/i, /_TTL$/i, /_SIZE$/i, /_LIMIT$/i, /_MAX$/i, /_MIN$/i]

/** Check if a key should be wrapped in Number() */
function isNumericKey(key) {
    return NUMERIC_PATTERNS.some((pattern) => pattern.test(key))
}

/** Check if a raw value looks numeric */
function isNumericValue(value) {
    return /^\d+(\.\d+)?$/.test(value)
}

/**
 * Parse a `.env` file into an ordered array of { key, value } objects.
 * Strips comments, empty lines, quotes from values.
 */
function parseEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return []

    const content = fs.readFileSync(filePath, 'utf8')
    const entries = []

    for (const line of content.split('\n')) {
        const trimmed = line.trim()

        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) continue

        const eqIndex = trimmed.indexOf('=')
        if (eqIndex === -1) continue

        const key = trimmed.slice(0, eqIndex).trim()
        let value = trimmed.slice(eqIndex + 1).trim()

        // Strip surrounding quotes (single or double)
        if ((value.startsWith("'") && value.endsWith("'")) ||
            (value.startsWith('"') && value.endsWith('"'))) {
            value = value.slice(1, -1)
        }

        if (key) entries.push({ key, value })
    }

    return entries
}

/**
 * Convert an env key to a config object key.
 * Uses lowercase snake_case to match the existing convention.
 */
function toConfigKey(envKey) {
    // Preserve NODE_ENV as-is (conventional)
    if (envKey === 'NODE_ENV') return 'NODE_ENV'
    return envKey.toLowerCase()
}

/**
 * Build the config entry line for a given env variable.
 * Applies smart type inference based on key pattern and value.
 */
function buildConfigEntry(key, value) {
    const configKey = toConfigKey(key)

    // Determine if the value should be wrapped in Number()
    const shouldWrapNumber = isNumericKey(key) || isNumericValue(value)

    // Escape single quotes in value for safe string default
    const escapedValue = value.replace(/'/g, "\\'")

    if (shouldWrapNumber) {
        // Use the raw numeric value as default (no quotes)
        const numDefault = isNumericValue(value) ? value : `'${escapedValue}'`
        return `    ${configKey}: Number(env('${key}', ${numDefault}))`
    }

    return `    ${configKey}: env('${key}', '${escapedValue}')`
}

/**
 * Generate the full config.js file content from parsed env entries.
 */
function generateConfigContent(entries) {
    // Build config entries from .env file
    const configLines = entries.map(({ key, value }) => buildConfigEntry(key, value))

    // Always include NODE_ENV if not already in .env
    const hasNodeEnv = entries.some(({ key }) => key === 'NODE_ENV')
    if (!hasNodeEnv) {
        configLines.push(`    NODE_ENV: env('NODE_ENV', '${NODE_ENV}')`)
    }

    return `// Auto-generated from ${ENV_FILE} — do not edit manually.
// Run \`npm run dev\` to start the file watcher.

import dotenv from 'dotenv'
dotenv.config({ path: '${ENV_FILE}', quiet: true })

const env = (key, def) => {
    const val = process.env[key]
    if (!val && !def) throw new Error(\`Missing environment variable: \${key}\`)
    return val ?? def
}

export default {
${configLines.join(',\n')}
}
`
}

// ─── Sync Logic ───────────────────────────────────────────────────────────────

/** Last written content — used to avoid unnecessary writes */
let lastContent = ''

function syncEnvToConfig() {
    try {
        const entries = parseEnvFile(ENV_PATH)
        const content = generateConfigContent(entries)

        // Only write if content actually changed
        if (content === lastContent) return

        // Ensure config directory exists
        fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true })
        fs.writeFileSync(CONFIG_PATH, content, 'utf8')
        lastContent = content

        const timestamp = new Date().toLocaleTimeString()
        console.log(`\x1b[32m✔\x1b[0m  \x1b[36mconfig/config.js\x1b[0m synced with \x1b[36m${ENV_FILE}\x1b[0m  \x1b[90m${timestamp}\x1b[0m`)
    } catch (err) {
        console.error(`\x1b[31m✖\x1b[0m  Failed to sync config:`, err.message)
    }
}

// ─── Initial Sync + Watch ─────────────────────────────────────────────────────

// Run initial sync on startup
syncEnvToConfig()

// Debounce timer to handle rapid file changes
let debounceTimer = null

function debouncedSync() {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(syncEnvToConfig, 100)
}

// Watch the env file for changes
if (fs.existsSync(ENV_PATH)) {
    fs.watch(ENV_PATH, (eventType) => {
        if (eventType === 'change' || eventType === 'rename') {
            debouncedSync()
        }
    })
    console.log(`\x1b[90m👀 Watching ${ENV_FILE} for changes... (NODE_ENV=${NODE_ENV})\x1b[0m\n`)
} else {
    console.log(`\x1b[33m⚠\x1b[0m  ${ENV_FILE} not found — config/config.js will be generated when ${ENV_FILE} is created.`)

    // Watch the directory for the env file creation
    fs.watch(ROOT_DIR, (eventType, filename) => {
        if (filename === ENV_FILE) {
            syncEnvToConfig()

            // Now start watching the file itself
            if (fs.existsSync(ENV_PATH)) {
                fs.watch(ENV_PATH, (eventType) => {
                    if (eventType === 'change' || eventType === 'rename') {
                        debouncedSync()
                    }
                })
                console.log(`\x1b[90m👀 Now watching ${ENV_FILE} for changes...\x1b[0m\n`)
            }
        }
    })
}