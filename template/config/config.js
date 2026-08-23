import dotenv from 'dotenv'
dotenv.config({ quiet: true })

export default {
    port: Number(process.env.PORT || 8200),
    token_sceret: process.env.TOKEN_SECRET || ""
}