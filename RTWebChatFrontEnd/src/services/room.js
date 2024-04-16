import axios from 'axios'
const baseUrl = '/api/rooms/'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getRoomMessagesById = async (id) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.get(`${baseUrl}${id}`, config)
  return response.data
}

const createRoom = async (name, sender, users) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(`${baseUrl}create`, { name, sender, users }, config)
  return response.data
}

const sendMessageById = async (id, name, message, sender, users) => {
  const response = await axios.put(`${baseUrl}${id}`, { name, message, sender, users })
  return response.data
}

export default { getRoomMessagesById, createRoom, sendMessageById, setToken }
