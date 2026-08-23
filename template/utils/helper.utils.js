import { deleteFile } from './removeFile.utils.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import config from '../config/config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logErrorToFile = (message) => {
    try {
        const date = new Date();
        const dateString = date.toISOString().split('T')[0];
        const timeString = date.toISOString().replace('T', ' ').split('.')[0];
        
        const logsDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
        
        const logFilePath = path.join(logsDir, `${dateString}.log`);
        const logMessage = `[${timeString}] ${message}\n`;
        
        fs.appendFileSync(logFilePath, logMessage, 'utf8');
    } catch (err) {
        console.error('Failed to log error to file:', err.message);
    }
}

export const ApiError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    error.success = false
    return error
}

export const asyncHandler = (fn, name = 'UnknownController') => {

    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            const errorMsg = `Error in ${name} : ${err.message}`;
            console.error(`🔥 ${errorMsg}`)
            // Add name to error for globalErrorHandler if needed, though simple enough to just pass err
            err.message = `${name} - ${err.message}`;
            if (req.file?.filename) deleteFile(req.file?.path)
            if (req.files && req.files?.length > 0) req.files?.forEach(file => deleteFile(file.path))
            next(err)
        })
    }
}

export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    // Log error to file
    const errorMessage = err.message || 'Something went wrong';
    logErrorToFile(`Global Error: ${errorMessage}`);

    // For API requests (JSON response)
    return res.status(statusCode).json(
        {
            success: false,
            message: errorMessage,
        }
    )
}

const getDerivedKey = () => {
    const secret = config.token_sceret;
    if (!secret) {
        console.warn('⚠️  TOKEN_SECRET is not set. Using a random key — tokens will NOT survive process restarts!')
        return crypto.randomBytes(32)
    }
    return crypto.createHash('sha256').update(secret).digest()
}

export const encryptToken = (data, ttlSec) => {
    const key      = getDerivedKey()
    const iv       = crypto.randomBytes(16)
    const cipher   = crypto.createCipheriv('aes-256-gcm', key, iv)

    const payload  = JSON.stringify({
        data,
        ...(ttlSec && { expiresAt: Date.now() + ttlSec * 1_000 }),
    })

    const encrypted = Buffer.concat([
        cipher.update(payload, 'utf8'),
        cipher.final(),
    ])

    const authTag = cipher.getAuthTag()

    // Format: iv:authTag:ciphertext  (all hex-encoded, colon-separated)
    return [
        iv.toString('hex'),
        authTag.toString('hex'),
        encrypted.toString('hex'),
    ].join(':')
}

export const decryptToken = (token) => {
    try {
        const parts = token.split(':')
        if (parts.length !== 3) throw new Error('Invalid token format')

        const [ivHex, authTagHex, ciphertextHex] = parts
        const key       = getDerivedKey()
        const iv        = Buffer.from(ivHex, 'hex')
        const authTag   = Buffer.from(authTagHex, 'hex')
        const encrypted = Buffer.from(ciphertextHex, 'hex')

        const decipher  = crypto.createDecipheriv('aes-256-gcm', key, iv)
        decipher.setAuthTag(authTag)        // GCM auth — throws if tampered

        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]).toString('utf8')

        const { data, expiresAt } = JSON.parse(decrypted)

        if (Date.now() > expiresAt) throw ApiError('Token has expired', 401)

        return data
    } catch (err) {
        // Re-throw ApiError instances directly; wrap everything else
        if (err.statusCode) throw err
        throw ApiError('Invalid or expired token', 401)
    }
}