import { useState, useEffect, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paper } from '@mui/material';
import NavBar from './NavBar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useParams } from 'react-router-dom'

const MessagingComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const socket = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    const newSocket = new WebSocket(`ws://127.0.0.1:8080`);
    socket.current = newSocket;

    return () => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.close();
      }
    };
  }, [socket]);

  // Handle messages from the server
  useEffect(() => {
    if (socket.current) {
      console.log(`id is ${id}`)

      socket.current.addEventListener('open', () => {
        console.log('WebSocket Connection Open')
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
          console.log('this happened')
          socket.current.send(JSON.stringify({ 'join': id }));
        }
      })

      const handleSocketMessage = (event) => {
        console.log('Received message from server:', event.data);
        console.log(typeof event.data);

        try {
          const parsedResult = JSON.parse(event.data);
          setMessages((oldMessages) => [...oldMessages, parsedResult]);
        } catch (error) {
          console.error('Error parsing received JSON:', error);
        }
      };


      const handleSocketError = (event) => {
        console.error('WebSocket error:', event);
      };

      socket.current.addEventListener('message', handleSocketMessage);
      socket.current.addEventListener('error', handleSocketError);

      return () => {
        // Cleanup: remove event listeners when the component unmounts
        socket.current.removeEventListener('message', handleSocketMessage);
        socket.current.removeEventListener('error', handleSocketError);
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
          socket.current.close();
        }
      };
    }
  }, [socket.current, id]);


  // Send messages to the server
  const sendMessage = (message) => {
    if (socket.current) {
      socket.current.send(JSON.stringify({ message }));
    }
  }

  useEffect(() => {
    if (socket.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, bottomRef.current]);


  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      // File size limit
      if (file.size > 2 * 1024 * 1024) {
        alert('File is too large. Please select a file smaller than 2MB.');
        continue;
      }

      // File type validation
      if (!file.type.startsWith('image/')) {
        alert('File is not an image. Please select an image file.');
        continue;
      }

      try {
        const dataUrl = await readAsDataURL(file);
        const newMessage = { type: 'image', content: dataUrl, id: Date.now() };
        setMessages((oldMessages) => [...oldMessages, newMessage]);
        // Send the new image message through the WebSocket
        sendMessage(newMessage);
      } catch (error) {
        alert('An error occurred while reading the file.');
      }
    }
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = { type: 'text', content: message, id: Date.now() };

      // Update the local state using the functional form of setMessages
      setMessages((oldMessages) => [...oldMessages, newMessage]);

      // Send the new text message through the WebSocket
      sendMessage(newMessage);

      // Clear the message input
      setMessage('');
    }
  };


  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Paper {...getRootProps()}>
      <NavBar />
      {isDragActive ? <input {...getInputProps()} /> : null}
      <MessageList messages={messages} />
      <div ref={bottomRef} />
      <MessageInput
        message={message}
        onMessageChange={handleMessageChange}
        onSendMessage={handleSendMessage}
        onSendImage={onDrop}
      />
    </Paper>
  );
};

export default MessagingComponent;
