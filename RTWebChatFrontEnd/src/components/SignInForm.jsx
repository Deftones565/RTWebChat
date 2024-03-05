import React from 'react';
import { TextField, Button, FormControl } from '@mui/material';

const SignInForm = () => {

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    return (
        <FormControl  onSubmit={handleSubmit}>
            <TextField
       
                label="Email"
                variant="outlined"
                type="email"
                required
            />
            <TextField
   
                label="Password"
                variant="outlined"
                type="password"
                required
            />
            <Button
  
                variant="contained"
                color="primary"
                type="submit"
            >
                Sign In
            </Button>
        </FormControl>
    );
};

export default SignInForm;
