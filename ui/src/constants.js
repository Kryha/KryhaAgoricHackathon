const dotenvFlow = require('dotenv-flow')
dotenvFlow.config() // read appropriate .env file

const WALLET_PROTOCOL = 'http'
const WALLET_HOST = 'localhost'
const WALLET_PORT = '8000'


const WALLET_URL = process.env.REACT_APP_WALLET_URL || `${WALLET_PROTOCOL}://${WALLET_HOST}:${WALLET_PORT}`

export { WALLET_URL }
