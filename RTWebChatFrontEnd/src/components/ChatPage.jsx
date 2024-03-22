import { useState, useEffect } from "react";
import FriendsList from "./FriendsList";
import MessagingComponent from "./MessagingComponent";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Box, CircularProgress } from "@mui/material";
import userService from "../services/user";

const ChatPage = ({ user, setUser }) => {
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [userList, setUserList] = useState(null);
    const navigate = useNavigate();

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
    };

    useEffect(() => {
        // Fetch the user list if the user is logged in
        const loadUserList = async () => {
                try {
                    const users = await userService.getUsers();
                    setUserList(users);
                } catch (error) {
                    // Handle error
                    console.log('this is error', error)
                    if (error.response.status === 401) {
                        // User is not authenticated, redirect to login page
                        navigate("/");
                    } else {
                        // Display an error message or handle the error in another way
                        console.error("Error fetching user list:", error);
                    }
                }
        };
        loadUserList();
    }, [navigate]);

    return (
        <Container style={{ display: "flex", height: "100vh" }}>
            {!userList || !user.token ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh"
                >
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <FriendsList
                        onFriendClick={handleFriendClick}
                        userList={userList}
                    />
                    <Box
                        style={{
                            flex: "1",
                            overflow: "scroll",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Outlet />
                        {selectedFriend && (
                            <MessagingComponent
                                user={user}
                                setUser={setUser}
                                id={selectedFriend.id}
                                style={{ flexGrow: 1, height: "100%" }}
                            />
                        )}
                    </Box>
                </>
            )}
        </Container>
    );
};

export default ChatPage;
