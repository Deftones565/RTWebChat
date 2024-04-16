import { useState, useEffect } from 'react'
import {
  Avatar,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Box,
} from '@mui/material'

const FriendsList = ({ onFriendClick, userList }) => {
  const friends = userList

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFriends, setFilteredFriends] = useState(null)

  useEffect(() => {
    if (friends) {
      const filtered = Object.values(friends).filter((item) =>
        item.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredFriends(filtered)
    }
  }, [friends, searchQuery])

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderRight="1px solid #ddd"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      borderRadius="8px"
      overflow="hidden"
      flexGrow="1"
    >
      {!filteredFriends ? (
        <CircularProgress />
      ) : (
        <>
          <Box
            padding="16px"
            borderBottom="1px solid #ddd"
            fontSize="20px"
            fontWeight="bold"
            textAlign="center"
            color="#1877f2"
            background="#f6f7f9"
          >
            Friends
          </Box>
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ margin: '8px' }}
          />
          <List style={{ overflowY: 'auto', flex: 1, flexGrow: 1 }}>
            {filteredFriends.map((friend) => (
              <ListItem
                key={friend.id}
                onClick={() => {
                  onFriendClick(friend)
                }}
                style={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f0f2f5',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={friend.username}
                    src={friend.avatar}
                    style={{
                      width: '40px',
                      height: '40px',
                      marginRight: '12px',
                    }}
                  />
                </ListItemAvatar>
                <ListItemText primary={friend.username} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  )
}
export default FriendsList
