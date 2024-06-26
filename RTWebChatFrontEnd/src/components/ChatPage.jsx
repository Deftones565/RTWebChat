import { useState, useEffect } from 'react'
import FriendsList from './FriendsList'
import MessagingComponent from './MessagingComponent'
import { Outlet, useNavigate } from 'react-router-dom'
import { Container, Box, CircularProgress } from '@mui/material'
import userService from '../services/user'
import NavBar from './NavBar'

const ChatPage = ({ user, setUser }) => {
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [userList, setUserList] = useState(null)
  const [isWideScreen, setIsWideScreen] = useState(true)
  const [isFriendButtonClicked, setIsFriendButtonClicked] = useState(false)
  const [isInitial, setIsInitial] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const updateScreenSize = () => {
      setIsWideScreen(mediaQuery.matches)
    }

    updateScreenSize() // Call the function once to set the initial state

    mediaQuery.addEventListener('change', updateScreenSize) // Add event listener for changes

    return () => {
      // Clean up event listener
      mediaQuery.removeEventListener('change', updateScreenSize)
    }
  }, [])

  useEffect(() => {
    console.log('isWideScreen =', isWideScreen)
    console.log('isFriendButtonClicked =', isFriendButtonClicked)
    console.log('isItinial =', isInitial)
    console.log(
      'friendsList result:',
      isWideScreen ? 2 : isInitial ? 2 : isFriendButtonClicked ? 0 : 2,
      '\nMessagingComponent Result:',
      isWideScreen ? 8 : isInitial ? 0 : isFriendButtonClicked ? 8 : 0
    )
  }, [isWideScreen, isFriendButtonClicked, isInitial])

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend)
    setIsInitial(false)
    if (!isWideScreen) {
      setIsFriendButtonClicked(!isFriendButtonClicked)
    }
  }

  const handleBackButton = () => {
    setIsInitial(true)
    if (!isWideScreen) {
      setIsFriendButtonClicked(!isFriendButtonClicked)
    }
  }

  useEffect(() => {
    // Fetch the user list if the user is logged in
    const loadUserList = async () => {
      try {
        const users = await userService.getUsers()
        setUserList(users)
      } catch (error) {
        // Handle error
        console.log('this is error', error)
        if (error.response.status === 401) {
          // User is not authenticated, redirect to login page
          navigate('/')
        } else {
          // Display an error message or handle the error in another way
          console.error('Error fetching user list:', error)
        }
      }
    }
    loadUserList()
  }, [navigate])

  return (
    <Box style={{ display: 'flex', width: '100vw', height: isWideScreen ? '100vh' : '93vh' }}>
      {!userList || !user.token ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ height: '100%' }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          style={{
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <NavBar
            user={user}
            setUser={setUser}
            handleBackButton={handleBackButton}
            isWideScreen={isWideScreen}
          />
          <Box
            style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <Box
              style={{
                flex: isWideScreen || isInitial ? 2 : isFriendButtonClicked ? 0 : 2,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
              }}
            >
              <FriendsList
                onFriendClick={handleFriendClick}
                userList={userList}
              />
            </Box>
            <Box
              style={{
                flex: isWideScreen || isFriendButtonClicked ? 8 : isInitial ? 0 : 0,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                overflow: 'auto'
              }}
            >
              {selectedFriend && (
                <MessagingComponent
                  user={user}
                  setUser={setUser}
                  id={selectedFriend.id}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ChatPage
