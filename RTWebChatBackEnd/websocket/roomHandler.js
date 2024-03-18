const Room = require('../models/room')

const handleJoinRoom = async (ws, currentRoom, newRoom, roomMap) => {
   try {
      if (ws.room) {
         const currentRoomDoc = await Room.findOne({ name: ws.room })
         currentRoomDoc.users = currentRoomDoc.users.filter(user => user.toString()) !== ws.user._id.toString()
         await currentRoomDoc.save()
         roomMap.get(ws.room).delete(ws)
      }

      let roomDoc = await Room.findOne({ name: newRoom })
      if(!roomDoc) {
         roomDoc = new Room({ name: newRoom, users: [ws.user.id]})
         await roomDoc.save()
         roomMap.set(newRoom, new Set())
      } else {
         if(!roomDoc.users.includes(ws.user.id)) {
            roomDoc.users.push(ws.user.id)
            await roomDoc.save()
         }
         if (!roomMap.has(newRoom)) {
            roomMap.set(newRoom, new Set())
         }
      }

      ws.room = newRoom;
      roomMap.get(newRoom).add(ws);
      console.log(`User ${ws.user.username} joined room: ${newRoom}`);
      console.log(
         `Contents of roomMap after joining room: ${newRoom}`,
         roomMap
      );
   } catch (error) {
      console.log(`Error handling room join:`, error);
   }
};
module.exports = {
   handleJoinRoom,
};
