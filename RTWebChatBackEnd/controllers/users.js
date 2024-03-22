const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const logger = require('../utils/logger')
const userExtractor = require('../utils/middleware').userExtractor

usersRouter.post('/', async (request, response) => {

    const { username, password } = request.body

    try {
        if(password.length >= 3) {
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(password, saltRounds)
    
            const user = new User({
                username,
                passwordHash
            })
    
            const savedUser = await user.save()
    
            response.status(201).json(savedUser)
        } else {
            response.status(403).json({ error: 'Password must be at least 3 characters long' })
        }
    } catch (error) {
        logger.error('Create User failed on POST: ', error.message)
        if(error.message === 'User validation failed: username: Error, expected `username` to be unique. Value: `test2`')
        response.status(403).json({ error: 'Username has been taken' })
    }

});

usersRouter.get('/', userExtractor, async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.get('/:id', userExtractor, async (request, response) => {
    const user = await User.findById(request.headers.params)
    response.json(user)
})

module.exports = usersRouter;
