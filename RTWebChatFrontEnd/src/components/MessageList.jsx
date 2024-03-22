import { Paper, Typography, Box, CardMedia } from "@mui/material";
import { useEffect } from "react";

const MessageList = ({ messages, username }) => {
  useEffect(() => {
    console.log(messages);
    console.log(username);
  }, [messages, username]);

  return (
    <Box
      p={1}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      {messages.map((msg) => {
        const message = msg.message || msg;

        // Determine the alignment of the message bubble
        const align = message.sender && message.sender.username === username ? 'left' : 'right';

        // Define styles for the message bubble
        const bubbleStyles = {
          maxWidth: '70%',
          padding: '10px',
          borderRadius: '10px',
          backgroundColor: align === 'right' ? '#DCF8C6' : '#E0E0E0',
          alignSelf: align === 'right' ? 'flex-end' : 'flex-start',
          marginTop: '10px',
        };

        // Define styles for the username
        const usernameStyles = {
          fontSize: '0.8rem',
          color: align === 'right' ? '#888' : '#444',
          marginBottom: '5px',
        };
        
        return message.type === "image" ? (
          <CardMedia
            key={message.id}
            component="img"
            image={message.text}
            alt="Uploaded"
            sx={{
              maxWidth: "100%",
              maxHeight: "500px",
              height: "auto",
              width: "auto",
            }}
          />
        ) : (
          <Paper key={message.id} sx={bubbleStyles}>
            <Typography sx={usernameStyles}>
              {message.sender && message.sender.username ? message.sender.username : username}
            </Typography>
            <Typography sx={{ wordBreak: "break-word" }}>{message.text}</Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

export default MessageList;
