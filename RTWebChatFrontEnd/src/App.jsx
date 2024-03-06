import { Container } from '@mui/material';
import MessagingComponent from './components/MessagingComponent';
import { Route, Routes } from 'react-router-dom'
import FriendsList from './components/FriendsList';
import { useEffect, useState } from 'react';
import roomService from './services/room'
import SignInForm from './components/SignInForm';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedChatAppUser');
      if (loggedUserJSON) {
        const loggedUser = JSON.parse(loggedUserJSON);
        console.log(loggedUser);
        setUser(loggedUser);
        roomService.setToken(loggedUser);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <Container>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Routes>
          <Route path='/' element={<FriendsList />}></Route>
          <Route path='/friends' element={<FriendsList />}></Route>
          <Route path='/friends/:id' element={<MessagingComponent user={user}/>}></Route>
          <Route path='/login' element={<SignInForm setLoading={setLoading}/>}></Route>
        </Routes>
      )}
    </Container>
  );
}

export default App;

