import { deleteFile } from './removeFile.utils.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
