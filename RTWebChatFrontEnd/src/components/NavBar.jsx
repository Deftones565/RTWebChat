import { useState, useEffect } from 'react'
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import loginService from '../services/login'
import roomService from '../services/room'
import userService from '../services/user'
import { useNavigate } from 'react-router-dom'

const NavBar = ({ user, setUser, handleBackButton, isInital, isWideScreen }) => {
  const [openSignInDialog, setOpenSignInDialog] = useState(false)
  const [password, setPassword] = useState('')
  const [isCreateAccount, setIsCreateAccount] = useState(false)
  const [username, setUsername] = useState('')
  const navigate = useNavigate('/login')

  const createUser = async () => {
    const newUser = {
      username,
      password,
    }
    try {
      await userService.create(newUser)
      setPassword('')
      setUsername('')
    } catch (error) {
      console.error(error)
    }
  }

  const signOut = () => {
    console.log('signOut Happening')
    window.localStorage.clear()
    window.location.reload()
    setUser(null)
  }
  const signIn = async () => {
    const res = await loginService.login({
      username: username,
      password: password,
    })
    console.log(res.token)
    if (res.token) {
      window.localStorage.setItem(
        'loggedChatAppUser',
        JSON.stringify(res.token)
      )
    } else {
      console.log('no token')
    }
    setPassword('')
    setUsername('')
  }

  const handleOpenSignInDialog = () => {
    setOpenSignInDialog(true)
    setIsCreateAccount(false)
  }

  const handleOpenCreateAccountDialog = () => {
    setOpenSignInDialog(true)
    setIsCreateAccount(true)
  }

  const handleCloseSignInDialog = () => {
    setOpenSignInDialog(false)
    setIsCreateAccount(false)
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">My NavBar</Typography>
          {!user.token ? (
            <>
              <Button color="inherit" onClick={handleOpenSignInDialog}>
                Sign In
              </Button>
              <Button color="inherit" onClick={handleOpenCreateAccountDialog}>
                Create Account
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={signOut}>
              Sign Out
            </Button>
          )}
          {!isWideScreen ? (
            <Button color='inherit' onClick={handleBackButton}>
              Back
            </Button>
          ): (
            null
          )

          }
        </Toolbar>
      </AppBar>

      <Dialog open={openSignInDialog} onClose={handleCloseSignInDialog}>
        <DialogTitle>
          {isCreateAccount ? 'Create Account' : 'Sign In'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
              label="Username"
              type="username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSignInDialog}>Cancel</Button>
          <Button
            color="primary"
            onClick={isCreateAccount ? createUser : signIn}
          >
            {isCreateAccount ? 'Create Account' : 'Sign In'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default NavBar
