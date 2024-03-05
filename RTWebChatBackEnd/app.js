const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const roomRouter = require('./controllers/room')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const middleWare = require('./utils/middleware')


const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use(middleWare.requestLogger)

app.use(middleWare.tokenExtractor)
app.use('/api/users', usersRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/login', loginRouter)
app.use(middleWare.errorHandler)

module.exports = app