import { Container } from '@mui/material';
import MessagingComponent from './components/MessagingComponent';
import { Route, Routes } from 'react-router-dom'
import FriendsList from './components/FriendsList';
import { useEffect, useState } from 'react';
import roomService from './services/room'


function App() {
  const [user, setUser] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedChatAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      roomService.setToken(user.token)
    }
  }, [])

  return (
    <Container>
      <Routes>
        <Route path='/' element={<MessagingComponent></MessagingComponent>}></Route>
        <Route path='/friends' element={<FriendsList></FriendsList>} />
        <Route path='/friends/:id' element={<MessagingComponent></MessagingComponent>}></Route>
      </Routes>
    </Container>
  );
}

export default App;
