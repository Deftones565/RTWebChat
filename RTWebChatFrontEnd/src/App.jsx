import { Container } from '@mui/material'
import MessagingComponent from './components/MessagingComponent'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import roomService from './services/room'
import SignInForm from './components/SignInForm'
import ChatPage from './components/ChatPage'
import CreateUserForm from './components/CreateUserForm'
import userService from './services/user'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState(null)
  const navigate = useNavigate()
  
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

  useEffect(() => {
    const fetchUserList = async (user) => {
      if (user) {
       try {
        console.log('Getting all users')
        setUserList(await userService.getUsers())
       } catch(error) {
          console.log(error.response.status)
          if(error.response.status === 401) {
            console.log(error.response.statusText)
            //navigate('/login')
          }
        }
      }
    }
      fetchUserList(user)
  }, [user, navigate])
  
  useEffect(() => {
      if(userList) {
        console.log('This is the current userList', userList)
      }

  }, [userList])

  return (
        <Container>
        <Routes>
          <Route path='/login' element={<SignInForm setLoading={setLoading}/>}></Route>
          <Route path='/create' element={<CreateUserForm setLoading={setLoading}></CreateUserForm>} />
        </Routes>

      {loading || !userList ? (
        <div>Loading...</div>
      ) : (
        <Routes>
          <Route path='/' element={<ChatPage user={user} userList={userList}/>}></Route>
          <Route path='/friends/:id' element={<MessagingComponent user={user}/>}></Route>
          <Route path='/login' element={<SignInForm setLoading={setLoading}/>}></Route>
          <Route path='/create' element={<CreateUserForm setLoading={setLoading}></CreateUserForm>} />
        </Routes>
      )}
    </Container>
  );
}

export default App;
