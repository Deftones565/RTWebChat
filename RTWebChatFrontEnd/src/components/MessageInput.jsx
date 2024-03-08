import { Box, Button, Grid, TextField } from '@mui/material';
import PhonePictureUpload from './PhonePictureUpload';

const MessageInput = ({ message, onMessageChange, onSendMessage, onSendImage }) => {
  return (
    <Box p={2}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ width: '40px', height: '40px' }}>
            <PhonePictureUpload onDrop={onSendImage} />
          </Box>
        </Grid>
        <Grid item xs={8}>
          <TextField
            value={message}
            onChange={onMessageChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onSendMessage();
              }
            }}
            label="Type a message"    
            fullWidth
          />
        </Grid>
        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button variant="contained" color="primary" onClick={onSendMessage} sx={{ height: '100%', width: '100%' }}>
            Send
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessageInput;