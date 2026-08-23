import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/** Ensure a directory exists, then write a file and log the result. */
function writeFile(filePath, content, cwd) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
    const relative = path.relative(cwd, filePath);
    console.log(`  ${chalk.green('✔')}  Created  ${chalk.cyan(relative)}`);
}

/** Patch a file in-place and log what changed. */
function patchFile(filePath, patches, cwd) {
    let content = fs.readFileSync(filePath, 'utf8');
    const relative = path.relative(cwd, filePath);
    const added = [];

    for (const { marker, line, position } of patches) {
        if (content.includes(line)) continue;   // already present

        if (position === 'after-last-import') {
            const lastImportIdx = content.lastIndexOf('import ');
            if (lastImportIdx !== -1) {
                const eol = content.indexOf('\n', lastImportIdx);
                content = content.slice(0, eol + 1) + line + '\n' + content.slice(eol + 1);
            } else {
                content = line + '\n' + content;
            }
        } else if (position === 'before-router-export') {
            // insert before `export default router` in index.routes.js
            const exportIdx = content.lastIndexOf('export default router');
            if (exportIdx !== -1) {
                content = content.slice(0, exportIdx) + line + '\n' + content.slice(exportIdx);
            } else {
                content += '\n' + line + '\n';
            }
        }

        added.push(line.trim());
    }

    fs.writeFileSync(filePath, content, 'utf8');

    if (added.length) {
        console.log(`  ${chalk.yellow('↪')}  Updated  ${chalk.cyan(relative)}`);
        added.forEach((l) => console.log(`           ${chalk.dim('+')} ${l}`));
    }
}

// ─── File Templates ───────────────────────────────────────────────────────────

function buildController(name) {
    return `import ${name}Model from '../models/${name}.model.js'

export default {
    // TODO: add controller methods
    // example: async (req, res, next) => { }
}
`;
}

function buildRoutes(name) {
    return `import express from 'express'
import ${name}Controller from '../controllers/${name}.controller.js'

const router = express.Router({ caseSensitive: true })

// TODO: register routes
// router.get('/', ${name}Controller.example)

export default router
`;
}

function buildModel(name, dbType) {
    const Name = capitalize(name);

    if (dbType === 'sequelize') {
        return `import { DataTypes } from 'sequelize'
import sequelize from '../config/db.config.js'

const ${Name} = sequelize.define('${name}', {
    // TODO: define columns
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { timestamps: true })

export default ${Name}
`;
    }

    // Default: mongoose
    return `import mongoose from 'mongoose'

const ${name}Schema = new mongoose.Schema({
    // TODO: define fields

}, { timestamps: true })

export default mongoose.model('${Name}', ${name}Schema)
`;
}

// ─── Main Command ─────────────────────────────────────────────────────────────

export async function createServiceCommand(serviceName, targetDir = process.cwd()) {
    if (!serviceName) {
        console.error(chalk.red('Please provide a service name.  Example: xpresso-cli generate auth'));
        process.exit(1);
    }

    const cwd = targetDir;
    const packageJsonPath = path.join(cwd, 'package.json');

    // ── detect DB ──────────────────────────────────────────────────────────────
    let dbType = 'none';
    if (fs.existsSync(packageJsonPath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            if (deps.mongoose)   dbType = 'mongoose';
            else if (deps.sequelize) dbType = 'sequelize';
        } catch {
            console.warn(chalk.yellow('⚠  Could not parse package.json — defaulting to mongoose model.'));
        }
    } else {
        console.warn(chalk.yellow('⚠  No package.json found — generating service without DB dependencies.'));
    }

    // ── destination paths ──────────────────────────────────────────────────────
    const controllerPath  = path.join(cwd, 'controllers', `${serviceName}.controller.js`);
    const routesPath      = path.join(cwd, 'routes',      `${serviceName}.routes.js`);
    const modelPath       = path.join(cwd, 'models',      `${serviceName}.model.js`);
    const indexRoutesPath = path.join(cwd, 'routes',      'index.routes.js');

    const spinner = ora(`Generating ${chalk.bold(serviceName)} service…`).start();

    try {
        spinner.stop();   // stop so our per-file logs are visible

        console.log('');
        console.log(chalk.bold(`📂  Scaffolding "${serviceName}" service`));
        console.log('');

        // ── create files ───────────────────────────────────────────────────────
        writeFile(controllerPath, buildController(serviceName), cwd);
        writeFile(routesPath,     buildRoutes(serviceName),     cwd);
        writeFile(modelPath,      buildModel(serviceName, dbType), cwd);

        // ── patch routes/index.routes.js ───────────────────────────────────────
        if (fs.existsSync(indexRoutesPath)) {
            console.log('');

            const importLine = `import ${serviceName}Routes from './${serviceName}.routes.js'`;
            const useLine    = `router.use('/api/${serviceName}', ${serviceName}Routes)`;

            patchFile(indexRoutesPath, [
                { line: importLine, position: 'after-last-import' },
                { line: useLine,    position: 'before-router-export' },
            ], cwd);
        }

        // ── summary ────────────────────────────────────────────────────────────
        console.log('');
        console.log(chalk.bold.green('✅  Done!'));
        console.log('');
        console.log(`  ${chalk.dim('controllers/')}${serviceName}.controller.js`);
        console.log(`  ${chalk.dim('routes/'     )}${serviceName}.routes.js`);
        console.log(`  ${chalk.dim('models/'     )}${serviceName}.model.js`);

        if (!fs.existsSync(indexRoutesPath)) {
            console.log('');
            console.log(chalk.yellow("  routes/index.routes.js not found — register the route manually:"));
            console.log(`    ${chalk.cyan(`import ${serviceName}Routes from './${serviceName}.routes.js'`)}`);
            console.log(`    ${chalk.cyan(`router.use('/api/${serviceName}', ${serviceName}Routes)`)}`);
        }

        console.log('');

    } catch (err) {
        spinner.fail(chalk.red(`Failed to create "${serviceName}" service.`));
        console.error(err);
        process.exit(1);
    }
}