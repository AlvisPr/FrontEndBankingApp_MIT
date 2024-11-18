import React, { useContext, useState, useCallback } from 'react';
import UserContext from '../../context/UserContext';
import TooltipIcon from '../Tooltip/Tooltip';
import UserTable from '../UserTable/UserTable';
import PasswordPromptDialog from '../PasswordPromtDialog/PasswordPromptDialog';
import ChangePasswordDialog from '../ChangePasswordDialog/ChangePasswordDialog';
import { Box, Typography } from '@mui/material';

function AllData() {
    const { users, setUsers, adminCredentials, removeUser, currentUser } = useContext(UserContext);
    const [open, setOpen] = useState({});
    const [passwordPromptOpen, setPasswordPromptOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [userToRemove, setUserToRemove] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleToggle = useCallback((index) => {
        setOpen(prevOpen => ({ ...prevOpen, [index]: !prevOpen[index] }));
    }, []);

    const handleRemoveUser = useCallback(() => {
        if (password === adminCredentials.password) {
            removeUser(users[userToRemove].email);
            setPasswordPromptOpen(false);
            setPassword('');
            setUserToRemove(null);
        } else {
            alert('Incorrect password');
        }
    }, [password, adminCredentials.password, removeUser, users, userToRemove]);

    const openPasswordPrompt = useCallback((index) => {
        console.log('openPasswordPrompt called:', index);
        setUserToRemove(index);
        setPasswordPromptOpen(true);
    }, []);

    const handleMenuOpen = useCallback((event, index) => {
        setMenuAnchorEl({ anchorEl: event.currentTarget, index });
        console.log('Menu opened for user index:', index);
    }, []);

    const handleMenuClose = useCallback(() => {
        setMenuAnchorEl(null);
    }, []);

    const handleChangePassword = useCallback((index) => {
        setSelectedUser(index);
        setChangePasswordOpen(true);
        handleMenuClose();
        console.log('Change password for user index:', index);
    }, [handleMenuClose]);

    const handleSaveNewPassword = useCallback(() => {
        console.log('handleSaveNewPassword called');
        console.log('selectedUser:', selectedUser);
        console.log('Password:', newPassword);

        if (selectedUser !== null && selectedUser >= 0 && selectedUser < users.length) {
            setUsers(prevUsers => {
                const updatedUsers = [...prevUsers];
                updatedUsers[selectedUser] = {
                    ...updatedUsers[selectedUser],
                    password: newPassword
                };
                console.log('Password updated for user:', updatedUsers[selectedUser]);
                return updatedUsers;
            });
            setChangePasswordOpen(false);
            setNewPassword('');
            setSelectedUser(null);
        } else {
            console.error('Invalid selected user index:', selectedUser);
        }
    }, [selectedUser, newPassword, users.length, setUsers]);

    const handleClickShowPassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    return (
        <Box sx={{ width: '100%', padding: '20px' }}>
            <Typography variant="h4" gutterBottom sx={{ backgroundColor: "yellow", color: "black", fontSize: "18px", padding: "5px" }}>
                USER DATABASE
            </Typography>
            <UserTable 
                users={users}
                open={open}
                handleToggle={handleToggle}
                handleMenuOpen={handleMenuOpen}
                menuAnchorEl={menuAnchorEl}
                handleMenuClose={handleMenuClose}
                openPasswordPrompt={openPasswordPrompt}
                handleChangePassword={handleChangePassword}
                currentUser={currentUser}
                adminCredentials={adminCredentials}
            />
            <TooltipIcon 
                text={`
                    Here we are mimicking users database. Once we add a new user to the database, 
                    it appears here together with all the credentials. 
                `}
            />
            <PasswordPromptDialog 
                open={passwordPromptOpen}
                password={password}
                handlePasswordChange={(e) => setPassword(e.target.value)}
                handleClose={() => setPasswordPromptOpen(false)}
                handleConfirm={handleRemoveUser}
            />
            <ChangePasswordDialog 
                open={changePasswordOpen}
                newPassword={newPassword}
                handlePasswordChange={(e) => setNewPassword(e.target.value)}
                handleClose={() => {
                    setChangePasswordOpen(false);
                    setSelectedUser(null);
                }}
                handleSave={handleSaveNewPassword}
                showPassword={showPassword}
                handleClickShowPassword={handleClickShowPassword}
            />
        </Box>
    );
}

export default AllData;