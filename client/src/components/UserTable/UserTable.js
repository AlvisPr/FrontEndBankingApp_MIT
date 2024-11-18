import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Menu, MenuItem} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, MoreVert as MoreVertIcon } from '@mui/icons-material';
import TransactionHistory from '../TransactionHistory/TransactionHistory';
import PasswordPromptDialog from '../PasswordPromtDialog/PasswordPromptDialog';

function UserTable({ users, open, handleToggle, handleMenuOpen, menuAnchorEl, handleMenuClose, openPasswordPrompt, handleChangePassword, currentUser, removeUser }) {
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [selectedUserIndex, setSelectedUserIndex] = useState(null);
    const [adminPassword, setAdminPassword] = useState('');

    const handleDeleteUser = (index) => {
        setSelectedUserIndex(index);
        setPasswordDialogOpen(true);
    };

    const handlePasswordChange = (event) => {
        setAdminPassword(event.target.value);
    };

    const handlePasswordConfirm = () => {
        if (selectedUserIndex !== null) {
            const user = users[selectedUserIndex];
            removeUser(user.email, adminPassword)
                .catch(error => {
                    console.error('Failed to delete user:', error);
                    alert('Failed to delete user. Please check the console for more details.');
                });
        }
        setPasswordDialogOpen(false);
        setAdminPassword('');
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#343a40', color: 'white' }}>
                            <TableCell sx={{ color: 'white' }}>ID</TableCell>
                            <TableCell sx={{ color: 'white' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white' }}>Password</TableCell>
                            <TableCell sx={{ color: 'white' }}>Balance</TableCell>
                            <TableCell sx={{ color: 'white' }}>Admin</TableCell>
                            <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                            <TableCell sx={{ color: 'white' }}>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <React.Fragment key={index}>
                                <TableRow sx={{ backgroundColor: user.isAdmin ? '#d4edda' : index % 2 === 0 ? '#e9ecef' : '#dee2e6', color: '#333' }}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.password}</TableCell>
                                    <TableCell>{user.isAdmin ? '' : `$${user.balance}`}</TableCell>
                                    <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>
                                        {user.isAdmin ? '' : (
                                            <IconButton onClick={() => handleToggle(index)}>
                                                {open[index] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                            </IconButton>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {currentUser && currentUser.email !== user.email && !user.isAdmin && (
                                            <>
                                                <IconButton onClick={(event) => handleMenuOpen(event, index)}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={menuAnchorEl?.anchorEl}
                                                    open={menuAnchorEl?.index === index}
                                                    onClose={handleMenuClose}
                                                >
                                                    <MenuItem onClick={() => handleDeleteUser(index)}>Delete Account</MenuItem>
                                                    <MenuItem onClick={() => handleChangePassword(index)}>Change Password</MenuItem>
                                                </Menu>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                        <Collapse in={open[index]} timeout="auto" unmountOnExit>
                                            <TransactionHistory transactions={user.transactions} />
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <PasswordPromptDialog
                open={passwordDialogOpen}
                password={adminPassword}
                handlePasswordChange={handlePasswordChange}
                handleClose={() => setPasswordDialogOpen(false)}
                handleConfirm={handlePasswordConfirm}
            />
        </>
    );
}

export default UserTable;