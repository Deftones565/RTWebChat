import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import NavBar from "./NavBar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useWhatChanged } from "@simbathesailor/use-what-changed";
import roomService from "../services/room";

const MessagingComponent = ({ user, id }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const socket = useRef(null);

  //useWhatChanged([id, user])

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
    if (user) {
      try {
        // Check if the user is already connected
        if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
          const newSocket = new WebSocket(`ws://127.0.0.1:8080`, [user]);
          socket.current = newSocket;

          newSocket.addEventListener("error", (event) => {
            console.error("WebSocket Error:", event);
          });

          //newSocket.addEventListener("open", () => {
          //  console.log("WebSocket Connection Open");
          //  if (newSocket && newSocket.readyState === WebSocket.OPEN) {
          //    console.log("this happened");
          //    newSocket.send(JSON.stringify({ join: id }));
          //  }
          //});
        }
      } catch (error) {
        console.error("Error initializing WebSocket:", error);
      }
    }

    return () => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        console.log("umount brah");
        socket.current.close();
      }
    };
  }, [id, user]);

  //useWhatChanged([id, user])
  // Handle messages from the server
  useEffect(() => {
    if (user) {
      if (socket.current) {
        console.log(`id is ${id}`);
        socket.current.addEventListener("open", () => {
          console.log("WebSocket Connection Open");
          if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            console.log("this happened");
            socket.current.send(JSON.stringify({ join: id }));
          }
        });

        const handleSocketClose = (event) => {
          console.log(
            "WebSocket closed with code:",
            event.code,
            "and reason:",
            event.reason
          );
          console.log("Full close event:", event);
        };

        const handleSocketMessage = (event) => {
          console.log("Received message from server:", event.data);
          console.log(typeof event.data);

          try {
            const parsedResult = JSON.parse(event.data);
            setMessages((oldMessages) => [...oldMessages, parsedResult]);
          } catch (error) {
            console.error("Error parsing received JSON:", error);
          }
        };

        const handleSocketError = (event) => {
          console.error("WebSocket error:", event);
        };

        socket.current.addEventListener("message", handleSocketMessage);
        socket.current.addEventListener("error", handleSocketError);
        socket.current.addEventListener("close", handleSocketClose);
        return () => {
          // Cleanup: remove event listeners when the component unmounts
          socket.current.removeEventListener("message", handleSocketMessage);
          socket.current.removeEventListener("error", handleSocketError);
          socket.current.removeEventListener("close", handleSocketClose); // Add this line
          if (socket.current.readyState === WebSocket.OPEN) {
            console.log("Component is unmounting");
            socket.current.close();
          }
        };
      }
    }
  }, [user, id]);

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
      const newMessage = { text: message, timestamp: Date.now(), id: Date.now()};

      // Update the local state using the functional form of setMessages
      setMessages((oldMessages) => [...oldMessages, newMessage]);

      // Send the new text message through the WebSocket
      sendMessage(newMessage);

      // Clear the message input
      setMessage("");
    }
  };

  if (!user) {
    return <div>loading</div>;
  }

  return (
    <Box style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <NavBar user={user} />
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <MessageList messages={messages} />
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
