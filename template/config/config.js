import dotenv from 'dotenv'
dotenv.config({ quiet: true })

export default {
    port: Number(process.env.PORT || 8200),
}