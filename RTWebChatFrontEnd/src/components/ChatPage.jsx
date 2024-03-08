import React, { useState } from 'react';
import FriendsList from './FriendsList';
import MessagingComponent from './MessagingComponent';
import { Outlet } from 'react-router-dom';
import {Paper, Container, Box } from '@mui/material'

const ChatPage = ({ user }) => {
    const [selectedFriend, setSelectedFriend] = useState(null);

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
    };

    return (
        <Container style={{ display: 'flex', height: '100vh' }}>
            <FriendsList onFriendClick={handleFriendClick} />
            <Box style={{ flex: '1', overflow: 'scroll', display: 'flex', flexDirection: 'column'  }}>
                <Outlet />
                {selectedFriend && <MessagingComponent user={user} id={selectedFriend.id} style={{ flexGrow: 1, height: '100%' }}/>}
            </Box>
        </Container>
    );
};

export default ChatPage;
