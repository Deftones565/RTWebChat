import { Container, CircularProgress } from '@mui/material'
import MessagingComponent from './components/MessagingComponent'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import roomService from './services/room'
import SignInForm from './components/SignInForm'
import ChatPage from './components/ChatPage'
import CreateUserForm from './components/CreateUserForm'
import userService from './services/user'
import ChatPageMobile from './components/ChatPageMobile'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Load the user from local storage on component mount
    const loadUser = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedChatAppUser')
      const usernameJSON = window.localStorage.getItem('username')
      if (loggedUserJSON && usernameJSON) {
        const loggedUser = JSON.parse(loggedUserJSON)
        const username = JSON.parse(usernameJSON)
        setUser((oldData) => ({
          username: username,
          token: loggedUser,
        }))
        roomService.setToken(loggedUser)
        userService.setToken(loggedUser)
        setIsLoggedIn(true)
      }

      setLoading(false)
    }
    loadUser()
  }, [])

  useEffect(() => {
    if (isLoggedIn && !loading) {
      navigate('/chat')
    }
  }, [isLoggedIn, navigate, loading])

  if (isLoggedIn && !user) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container style={{ minWidth: '100vw', minHeight: '100', padding: 0 }}>
      <Routes>
        <Route
          path="/"
          element={
            <SignInForm
              setLoading={setLoading}
              setIsLoggedIn={setIsLoggedIn}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/chat"
          element={<ChatPage user={user} setUser={setUser} />}
        />
        <Route
          path="/create"
          element={<CreateUserForm setUser={setUser} setLoading={setLoading} />}
        />
      </Routes>
    </Container>
  )
}

export default App
