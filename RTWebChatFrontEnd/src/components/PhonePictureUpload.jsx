import React, { useState, useRef } from 'react';
import { IconButton, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const PhonePictureUpload = ({ onDrop }) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    onDrop(event.target.files);
    event.target.value = '';
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <IconButton color="primary" aria-label="upload picture" component="span" onClick={handleFileInputClick} sx={{ fontSize: 'auto' }}>
        <PhotoCamera sx={{ fontSize: 'inherit' }}/>
      </IconButton>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default PhonePictureUpload;