import { useEffect, useState } from 'react';
import { TextField, Button, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import loginService from '../services/login';

const SignInForm = ({ setLoading }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        const res = await loginService.login({ username, password });
        if (res.token) {
            window.localStorage.setItem('loggedChatAppUser', JSON.stringify(res.token));
            setIsLoggedIn(true);
        } else {
            console.log('no token');
        }
        setPassword('');
        setUsername('');
    };

    useEffect(() => {
        if (isLoggedIn) {
            setLoading(false);
            navigate('/');
        }
    }, [setLoading, isLoggedIn, navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleLogin();
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormControl>
                <TextField
                    label="Username"
                    variant="outlined"
                    type="username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button variant="contained" color="primary" type="submit">
                    Sign In
                </Button>
            </FormControl>
        </form>
    );
};

export default SignInForm;
