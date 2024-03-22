const Room = require('../models/room')
const Message = require('../models/message')

const handleTextMessage = async (ws, room, message, roomMap) => {
    try {
        console.log('this is room in handleTextMessage', room)
        const roomDoc = await Room.findOne({ name: room });
        if (!roomDoc) {
            console.error(`Room "${room}" not found`);
            return;
        }

        console.log('this is the message data', message.message.text)

        const newMessage = new Message({
            text: message.message.text,
            sender: ws.user.id,
        });
        await newMessage.save();

        roomDoc.messages.push(newMessage._id);
        await roomDoc.save();

        const messageSummary = {
            id: newMessage._id,
            text: newMessage.text,
            sender: {username: ws.user.username},
            timestamp: newMessage.timestamp,
        };

        roomMap.get(room).forEach((client) => {
            if (client !== ws) {
                client.send(JSON.stringify(messageSummary));
            }
        });
    } catch (err) {
        console.error("Error handling text message:", err);
    }
};
module.exports = {
    handleTextMessage,
};
