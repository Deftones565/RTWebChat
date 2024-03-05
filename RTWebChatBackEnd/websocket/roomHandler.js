const handleJoinRoom = (ws, currentRoom, newRoom, roomMap) => {

    if (ws.room) {
        roomMap.get(ws.room).delete(ws);
    }

    if (!roomMap.has(newRoom)) {
        roomMap.set(newRoom, new Set());
    }

    ws.room = newRoom;
    roomMap.get(newRoom).add(ws);
    console.log(`User joined room: ${newRoom}`);
    console.log(`Contents of roomMap after joining room: ${newRoom}`, roomMap);
}

module.exports = {
    handleJoinRoom,
};