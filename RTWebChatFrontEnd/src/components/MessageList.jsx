import { WrapText } from '@mui/icons-material';
import { Box, Chip, CardMedia } from '@mui/material';
import { useEffect } from 'react';

const MessageList = ({ messages }) => {

  useEffect(() => {
    console.log(messages)
  }, [messages])

  return (
    <Box p={1} display="flex" flexDirection="column" alignItems="flex-start" justifyContent="flex-start">
      {messages.map((msg) => {
        const message = msg.message || msg;

        return message.type === 'image' ? (
          <CardMedia
            key={message.id}
            component="img"
            image={message.text}
            alt="Uploaded"
            sx={{ maxWidth: '100%', maxHeight: '500px', height: 'auto', width: 'auto' }}
          />
        ) : (
          <Chip key={message.id} label={`${message.text}`} />
        );
      })}
    </Box>
  );
};


export default MessageList;
