import React, { useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import TooltipIcon from '../Tooltip/Tooltip';
import UserTable from '../UserTable/UserTable';
import PasswordPromptDialog from '../PasswordPromtDialog/PasswordPromptDialog';
import ChangePasswordDialog from '../ChangePasswordDialog/ChangePasswordDialog';
import { Box, Typography } from '@mui/material';

function AllData() {
    const { users, setUsers, removeUser, changeUserPassword, currentUser } = useContext(UserContext);
    const [open, setOpen] = useState({});
    const [passwordPromptOpen, setPasswordPromptOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [userToRemove, setUserToRemove] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser || !currentUser.isAdmin) {
            navigate('/'); // Redirect to home or another appropriate page
        }
    }, [currentUser, navigate]);

    const handleToggle = useCallback((index) => {
        setOpen(prevOpen => ({ ...prevOpen, [index]: !prevOpen[index] }));
    }, []);

    const handleRemoveUser = useCallback(() => {
        if (currentUser) {
            removeUser(users[userToRemove].email, password)
                .then(() => {
                    setPasswordPromptOpen(false);
                    setPassword('');
                    setUserToRemove(null);
                })
                .catch(error => {
                    alert('Incorrect password');
                    console.error('Error removing user:', error);
                });
        }
    }, [password, currentUser, removeUser, users, userToRemove]);

    const openPasswordPrompt = useCallback((index) => {
        setUserToRemove(index);
        setPasswordPromptOpen(true);
    }, []);

    const handleMenuOpen = useCallback((event, index) => {
        setMenuAnchorEl({ anchorEl: event.currentTarget, index });
    }, []);

    const handleMenuClose = useCallback(() => {
        setMenuAnchorEl(null);
    }, []);

    const handleChangePassword = useCallback((index) => {
        setSelectedUser(index);
        setChangePasswordOpen(true);
        handleMenuClose();
    }, [handleMenuClose]);

    const handleSaveNewPassword = useCallback(() => {
        if (selectedUser !== null && selectedUser >= 0 && selectedUser < users.length) {
            changeUserPassword(users[selectedUser]._id, newPassword)
                .then(() => {
                    setUsers(prevUsers => {
                        const updatedUsers = [...prevUsers];
                        updatedUsers[selectedUser] = {
                            ...updatedUsers[selectedUser],
                            password: newPassword
                        };
                        return updatedUsers;
                    });
                    setChangePasswordOpen(false);
                    setNewPassword('');
                    setSelectedUser(null);
                })
                .catch(error => console.error('Error updating password:', error));
        }
    }, [selectedUser, newPassword, users, changeUserPassword, setUsers]);

    const handleClickShowPassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    return (
        <Box sx={{ width: '100%', padding: '20px' }}>
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
                removeUser={removeUser}
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