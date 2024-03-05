const handleTextMessage = (ws, _, message, roomMap) => {
    const room = ws.room;
    console.log(`Received message: ${JSON.stringify(message)}`);
    console.log(`Received message for room: ${room}`);
    console.log(`Contents of roomMap when handling text message in room: ${room}`, roomMap);

    if (roomMap.has(room)) {
        const clientsInRoom = roomMap.get(room);
        console.log(`Found room ${room} in roomMap`);
        console.log(`Number of clients in room ${room}: ${clientsInRoom.size}`);
        console.log(`Broadcasting messages to clients in room ${room}`);

        roomMap.get(room).forEach((client) => {
            console.log(`Checking client ${client._socket.remoteAddress}`);
            if (client !== ws && client.readyState === ws.OPEN) {
                console.log(`Broadcasting message to ${client._socket.remoteAddress}`);
                client.send(JSON.stringify(message));
            }
        });
        console.log(`Finished broadcasting messages`);
    }
};

module.exports = {
    handleTextMessage,
};