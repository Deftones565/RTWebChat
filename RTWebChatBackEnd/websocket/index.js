const { WebSocketServer } = require('ws')
const { handleTextMessage } = require('./messageHandler')
const { handleJoinRoom } = require('./roomHandler')
const jwt = require('jsonwebtoken')

const roomMap = new Map()

const createWebSocketServer = (httpServer) => {

    const wss = new WebSocketServer({ server: httpServer })

    wss.on('connection', (ws, request) => {
        console.log('A user connected');

        // Extract room information from the request URL
        const { pathname } = new URL(request.url, `http://${request.headers.host}`);
        console.log('this is ws on connection duh:', ws)
        let room = 'default'
        console.log('this is room init: ', room)
        console.log(`User connected to room: ${room}`);

        const token = request.headers['sec-websocket-protocol'];

        // Verify the token
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                // Token verification failed
                console.error('Token verification failed:', err);
                // Send a specific error message to the client or handle it appropriately
                ws.send(JSON.stringify({ error: 'Authentication failed' }));
                ws.close(1000, 'Authentication failed'); // Close the connection with proper code and reason
                return;
            }

            // Token verification succeeded
            console.log('User authenticated:', decoded);

            // Store the user information in the WebSocket connection object if needed
            ws.user = decoded;
            console.log('ws.user isss', ws.user)

            ws.on('message', (data) => {
                const message = JSON.parse(data);
                console.log('this is message on server:', message)

                if (message.join) {
                    room = message.join
                    // Handle joining a room
                    handleJoinRoom(ws, room, message.join, roomMap);
                } else {
                    // Handle regular messages
                    handleTextMessage(ws, room, message, roomMap);
                }
            });

            // Handle disconnection
            ws.on('close', (code, reason) => {

                console.log('User disconnected with code:', code, 'and reason:', reason);


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

        })

        // Handle messages from the client
    }, console.log("WebSockets started"));
}

module.exports = {
    createWebSocketServer
}
