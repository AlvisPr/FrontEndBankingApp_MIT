import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

function PasswordPromptDialog({ open, password, handlePasswordChange, handleClose, handleConfirm }) {
    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            BackdropProps={{ style: { backgroundColor: 'transparent' } }}
            sx={{ 
                '& .MuiDialog-paper': {
                    backgroundColor: '#f5f5f5', 
                    padding: '20px',
                    borderRadius: '8px',
                    width: '400px',
                    maxWidth: '90vw',
                    height: 'auto',
                    maxHeight: '30vh'
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Enter Password</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ marginBottom: '10px' }}>
                    To remove this user, please enter your password.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Password"
                    type="password"
                    fullWidth
                    size="small"
                    value={password}
                    onChange={handlePasswordChange}
                    sx={{ marginBottom: '10px' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PasswordPromptDialog;