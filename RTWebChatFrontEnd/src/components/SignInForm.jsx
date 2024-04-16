import { useEffect, useState } from 'react'
import { TextField, Button, FormControl } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import roomService from '../services/room'
import userService from '../services/user'
import Avatar from '@mui/material/Avatar'
import CssBaseline from '@mui/material/CssBaseline'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
				Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const SignInForm = ({ setLoading, setIsLoggedIn, isLoggedIn, setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const defaultTheme = createTheme()

  const handleLogin = async () => {
    try {
      const res = await loginService.login({ username, password })
      if (res.token) {
        window.localStorage.setItem(
          'loggedChatAppUser',
          JSON.stringify(res.token)
        )
        window.localStorage.setItem(
          'username',
          JSON.stringify(res.username)
        )
        console.log(
          'username and token',
          JSON.stringify(res.username),
          JSON.stringify(res.token)
        )
        setUser({
          username: res.username,
          token: res.token,
        })
        const loggedUser = res.token

        roomService.setToken(loggedUser)
        userService.setToken(loggedUser)
        setIsLoggedIn(true)
      } else {
        console.log('no token')
      }
      setPassword('')
      setUsername('')
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin()
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
						Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="username"
              name="username"
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={
                <Checkbox value="remember" color="primary" />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
							Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
									Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/create" variant="body2">
                  {'Don\'t have an account? Sign Up'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}

export default SignInForm
