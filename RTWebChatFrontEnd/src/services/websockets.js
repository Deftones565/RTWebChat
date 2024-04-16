const connectWebSocket = (user, room, setMessages) => {
  const ws = new WebSocket('ws://192.168.3.164:8081/', [user.token])

  ws.addEventListener('open', () => {
    console.log('WebSocket Connection Open')
    ws.send(JSON.stringify({ join: room }))
  })

  ws.addEventListener('message', (event) => {
    try {
      console.log('does message even hit', event.data)
      const parsedResult = JSON.parse(event.data)
      setMessages((oldMessages) => [...oldMessages, parsedResult])
    } catch (error) {
      console.error('Error parsing received JSON:', error)
    }
  })

  ws.addEventListener('error', (event) => {
    console.error('WebSocket error:', event)
  })

  ws.addEventListener('close', (event) => {
    console.log('The connection has been closed successfully', event)
    ws.close()
  })

  return ws

}

export default { connectWebSocket }
