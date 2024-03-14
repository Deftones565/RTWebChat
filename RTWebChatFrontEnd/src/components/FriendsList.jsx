// @format

import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import {
  Avatar,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
} from "@mui/material";

const FriendsListContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "300px", // Adjust the width as needed
  borderRight: "1px solid #ddd",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  overflow: "hidden",
});

const FriendsListHeader = styled("div")({
  padding: "16px",
  borderBottom: "1px solid #ddd",
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center",
  color: "#1877f2",
  background: "#f6f7f9",
});

const FriendsListView = styled(List)({
  overflowY: "auto",
  flex: 1,
});

const FriendListItem = styled(ListItem)({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#f0f2f5",
  },
});

const FriendAvatar = styled(Avatar)({
  width: "40px",
  height: "40px",
  marginRight: "12px",
});

const FriendsList = ({ onFriendClick, userList }) => {
  const friends = userList;

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState(null);

  useEffect(() => {
    if (friends) {
      const filtered = Object.values(friends).filter((item) =>
        item.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [friends, searchQuery]);

  return (
    <FriendsListContainer>
      {!filteredFriends ? (
        <CircularProgress />
      ) : (
        <>
          <FriendsListHeader>Friends</FriendsListHeader>
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ margin: "8px" }}
          />
          <FriendsListView>
            {filteredFriends.map((friend) => (
              <FriendListItem
                key={friend.id}
                onClick={() => {
                  onFriendClick(friend);
                }}
              >
                <ListItemAvatar>
                  <FriendAvatar alt={friend.username} src={friend.avatar} />
                </ListItemAvatar>
                <ListItemText primary={friend.username} />
              </FriendListItem>
            ))}
          </FriendsListView>
        </>
      )}
    </FriendsListContainer>
  );
};

export default FriendsList;
