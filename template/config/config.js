import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, quiet: true })

const env = (key, def = null) => {
    const val = process.env[key]
    if (!val && !def) throw new Error(`Missing environment variable: ${key}`)
    return val ?? def
}

export default {
    port: Number(env('PORT', 8200)),
    token_secret: env('TOKEN_SECRET'),
    NODE_ENV: env('NODE_ENV', 'development')
}