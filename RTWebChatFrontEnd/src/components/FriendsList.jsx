import { useState } from "react";
import { Link } from "react-router-dom";

const FriendsList = () => {
    const initialState = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Joe" },
    ];

    const [friends, setFriends] = useState(initialState);
    
    return (
        <div>
        <h2>Friends List</h2>
        <ul>
            {friends.map((friend) => (
            <li key={friend.id}><Link to={`/friends/${friend.id}`}>{friend.name}</Link></li>
            ))}
        </ul>
        </div>
    );
    };

export default FriendsList;