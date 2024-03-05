const { WebSocketServer } = require('ws')
const { handleTextMessage } = require('./messageHandler')
const { handleJoinRoom } = require('./roomHandler')
const roomMap = new Map()

const createWebSocketServer = (httpServer) => {
    
    const wss = new WebSocketServer({ server: httpServer })

    wss.on('connection', (ws, request) => {
        console.log('A user connected');

        // Extract room information from the request URL
        const { pathname } = new URL(request.url, `http://${request.headers.host}`);
        const room = pathname.substring(pathname.lastIndexOf('/') + 1) || 'default';
        console.log(`User connected to room: ${room}`);


        // Handle messages from the client
        ws.on('message', (data) => {
            const message = JSON.parse(data);
            console.log(message)

            if (message.join) {
                // Handle joining a room
                handleJoinRoom(ws, room, message.join, roomMap);
            } else {
                // Handle regular messages
                handleTextMessage(ws, room, message, roomMap);
            }
        });

        // Handle disconnection
        ws.on('close', () => {
            console.log('User disconnected');

            if (ws.room && roomMap.has(ws.room)) {
                // Check if the connection is present before trying to delete it
                if (roomMap.get(ws.room).has(ws)) {
                    roomMap.get(ws.room).delete(ws);
                }

                // If the room is empty after the disconnection, you may want to remove the room entry
                if (roomMap.get(ws.room).size === 0) {
                    roomMap.delete(ws.room);
                }
            }
            console.log(`Contents of roomMap after user disconnection:`, roomMap);
        });
    });
}

module.exports = {
    createWebSocketServer
}