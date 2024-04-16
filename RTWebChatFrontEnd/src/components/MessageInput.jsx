import { Box, Button, Grid, TextField } from '@mui/material'

const MessageInput = ({ message, onMessageChange, onSendMessage }) => {
  return (
    <Box p={2} style={{}}>
      <Grid container spacing={2} justifyContent="center" justifyItems='center'>
        <Grid item xs={8}>
          <TextField
            value={message}
            onChange={onMessageChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                onSendMessage()
              }
            }}
            label="Type a message"
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <Button variant="contained" color="primary" onClick={onSendMessage} fullWidth>
            Send
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default MessageInput
