const roomRouter = require('express').Router()
const Room = require('../models/room')
const Message = require('../models/message');
const logger = require('../utils/logger')
const userExtractor = require('../utils/middleware').userExtractor

roomRouter.get('/:id', userExtractor, async (request, response) => {
    try {
        console.log('this is request.params.id', request.params.id)
        const room = await Room.find({name: request.params.id}).populate({ path: 'messages' });
        response.json(room);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});

roomRouter.get('/', async (request, response) => {
    try{
        const rooms = await Room.find({})
        response.json(rooms)
    } catch(error) {
        console.log(error)
    }
})

roomRouter.post('/create', userExtractor, async (request, response) => {
    try {
        const { name, sender, users } = request.body

        const room = new Room({
            name,
            sender,
            users
        })

        const savedRoom = await room.save()
        response.status(201).json(savedRoom)
    } catch (error) {
        logger.error('error creating room on POST:', error.message)
        response.status(500).json({
            error: 'Error creating room'
        })
    }

})

// Assuming 'Message' and 'Room' models are imported and defined

roomRouter.put('/:id', userExtractor, async (request, response) => {
    const { id } = request.params;
    const { text, sender } = request.body

    const newMessage = new Message({
        text,
        sender,
    })

    newMessage.save();

    const updatedRoom = await Room.findByIdAndUpdate(
        id,
        {
            $push: { messages: newMessage },
        },
        { new: true }
    ).populate({ path: 'users' }).populate({ path: 'messages' }).exec()

    response.json(updatedRoom);
});



module.exports = roomRouter
