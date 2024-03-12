import React, { useState } from 'react';
import FriendsList from './FriendsList';
import MessagingComponent from './MessagingComponent';
import { Outlet } from 'react-router-dom';
import { Container, Box } from '@mui/material'

const ChatPage = ({ user, userList }) => {
    const [selectedFriend, setSelectedFriend] = useState(null);

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
    };

    return (
        <Container style={{ display: 'flex', height: '100vh' }}>
            <FriendsList onFriendClick={handleFriendClick} userList={userList} />
            <Box style={{ flex: '1', overflow: 'scroll', display: 'flex', flexDirection: 'column'  }}>
                <Outlet />
                {selectedFriend && <MessagingComponent user={user} id={selectedFriend.id} style={{ flexGrow: 1, height: '100%' }}/>}
            </Box>
        </Container>
    );
};

export default ChatPage;
