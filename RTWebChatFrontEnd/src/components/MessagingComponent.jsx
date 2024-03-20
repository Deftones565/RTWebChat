import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import NavBar from "./NavBar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useWhatChanged } from "@simbathesailor/use-what-changed";
import roomService from "../services/room";
import webSocketService from '../services/websockets'

const MessagingComponent = ({ user, id }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    const getOldMessages = async (id) => {
      setMessages([])
      const oldMessages = await roomService.getRoomMessagesById(id);
      if(oldMessages[0].messages) {
        setMessages((currentMessages) => [...currentMessages, ...oldMessages[0].messages]);
      }
    };
    getOldMessages(id)
  }, [id]);

  useEffect(() => {
    if (user.token) {
      try {
        // Check if the user is already connected
        if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
          socket.current = webSocketService.connectWebSocket(user, id, setMessages)
        }
      } catch (error) {
        console.error("Error initializing WebSocket:", error);
      }
    }

    return () => {
      if (socket.current) {
        console.log("umount brah");
        socket.current.close();
      }
    };
  }, [id, user.token]);

  // Send messages to the server
  const sendMessage = (message) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      try {
        socket.current.send(JSON.stringify({ message }));
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    if (socket.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, bottomRef.current]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = { text: message, sender: {username: user.username}, timestamp: Date.now(), id: Date.now()};

      // Update the local state using the functional form of setMessages
      setMessages((oldMessages) => [...oldMessages, newMessage]);

      // Send the new text message through the WebSocket
      sendMessage(newMessage);

      // Clear the message input
      setMessage("");
    }
  };

  if (!user.token) {
    return <div>loading</div>;
  }

  return (
    <Box style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <NavBar user={user.token} />
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <MessageList username={user.username} messages={messages} />
        <Box ref={bottomRef} />
      </Box>
      <Box sx={{ flexShrink: 0 }}>
        <MessageInput
          message={message}
          onMessageChange={handleMessageChange}
          onSendMessage={handleSendMessage}
        />
      </Box>
    </Box>
  );
};

export default MessagingComponent;
