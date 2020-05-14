const dotenvFlow = require('dotenv-flow')
dotenvFlow.config() // read appropriate .env file

const WALLET_PROTOCOL = 'http'
const WALLET_HOST = 'localhost'
const CREATOR_PORT = '8000'
const CONVERTOR_PORT = '8001'
const DECOMPOSER_PORT = '8002'

const CREATOR_WALLET = process.env.REACT_APP_WALLET_URL || `${WALLET_PROTOCOL}://${WALLET_HOST}:${CREATOR_PORT}/wallet`
const CONVERTOR_WALLET = process.env.REACT_APP_WALLET_URL || `${WALLET_PROTOCOL}://${WALLET_HOST}:${CONVERTOR_PORT}/wallet`
const DECOMPOSER_WALLET = process.env.REACT_APP_WALLET_URL || `${WALLET_PROTOCOL}://${WALLET_HOST}:${DECOMPOSER_PORT}/wallet`

export { CREATOR_WALLET, CONVERTOR_WALLET, DECOMPOSER_WALLET }