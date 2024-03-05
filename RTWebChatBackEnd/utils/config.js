require ('dotenv').config()

const PORT = process.env.PORT
const WSPORT = process.env.WSPORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
    MONGODB_URI,
    PORT,
    WSPORT
}