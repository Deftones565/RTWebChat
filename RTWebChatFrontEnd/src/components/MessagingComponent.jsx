import { useState, useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import NavBar from './NavBar'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { useWhatChanged } from '@simbathesailor/use-what-changed'
import roomService from '../services/room'
import webSocketService from '../services/websockets'

const MessagingComponent = ({ user, id, setUser }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)
  const socket = useRef(null)

  useEffect(() => {
    const getOldMessages = async (id) => {
      setMessages([])
      const oldMessages = await roomService.getRoomMessagesById(id)
      if(oldMessages[0].messages) {
        setMessages((currentMessages) => [...currentMessages, ...oldMessages[0].messages])
      }
    }
    getOldMessages(id)
  }, [id])

  useEffect(() => {
    if (user.token) {
      try {
        if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
          socket.current = webSocketService.connectWebSocket(user, id, setMessages)
        }
      } catch (error) {
        console.error('Error initializing WebSocket:', error)
      }
    }

    return () => {
      if (socket.current) {
        console.log('unmounting component')
        socket.current.close()
      }
    }
  }, [id, user.token, user])

  const sendMessage = (message) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      try {
        socket.current.send(JSON.stringify({ message }))
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  useEffect(() => {
    if (socket.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length])

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = { text: message, sender: { username: user.username }, timestamp: Date.now(), id: Date.now() }

      setMessages((oldMessages) => [...oldMessages, newMessage])

      sendMessage(newMessage)

      setMessage('')
    }
  }

  if (!user.token) {
    return <div>loading</div>
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <MessageList username={user.username} messages={messages} />
        <Box ref={bottomRef} />
      </Box>
      <MessageInput
        message={message}
        onMessageChange={handleMessageChange}
        onSendMessage={handleSendMessage}
      />
    </Box>
  )
}

export default MessagingComponent
