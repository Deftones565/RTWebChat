import { Container, CircularProgress } from "@mui/material";
import MessagingComponent from "./components/MessagingComponent";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import roomService from "./services/room";
import SignInForm from "./components/SignInForm";
import ChatPage from "./components/ChatPage";
import CreateUserForm from "./components/CreateUserForm";
import userService from "./services/user";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    // Load the user from local storage on component mount
    const loadUser = async () => {
      const loggedUserJSON = window.localStorage.getItem("loggedChatAppUser");
      const usernameJSON = window.localStorage.getItem("username");
      if (loggedUserJSON && usernameJSON) {
        const loggedUser = JSON.parse(loggedUserJSON);
        const username = JSON.parse(usernameJSON);
        setUser((oldData) => ({
          username: username,
          token: loggedUser,
        }));
        roomService.setToken(loggedUser);
        userService.setToken(loggedUser);

      setLoading(false);
      }
    };
    loadUser();
  }, []);

  return (
    <Container>
      {loading && !user ? (
        <>
          <Routes>
            <Route path="/" element={<SignInForm setLoading={setLoading} />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<ChatPage user={user} />} />
          <Route
            path="/friends/:id"
            element={<MessagingComponent user={user.token} />}
          />
          <Route
            path="/login"
            element={<SignInForm setLoading={setLoading} />}
          />
          <Route
            path="/create"
            element={
              <CreateUserForm setUser={setUser} setLoading={setLoading} />
            }
          />
        </Routes>
      )}
    </Container>
  );
}

export default App;
