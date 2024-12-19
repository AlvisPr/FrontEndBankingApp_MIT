import React, { useState } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    IconButton, 
    Collapse, 
    Menu, 
    MenuItem, 
    Box, 
    Typography,
    useTheme
} from '@mui/material';
import { 
    KeyboardArrowDown, 
    KeyboardArrowUp, 
    MoreVert as MoreVertIcon,
    Delete as DeleteIcon,
    Lock as LockIcon,
    LockOutlined as LockOutlinedIcon
} from '@mui/icons-material';
import TransactionHistory from '../TransactionHistory/TransactionHistory';
import PasswordPromptDialog from '../PasswordPromtDialog/PasswordPromptDialog';

function UserTable({ users, open, handleToggle, handleMenuOpen, menuAnchorEl, handleMenuClose, openPasswordPrompt, handleChangePassword, currentUser, removeUser }) {
    const theme = useTheme();
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
                    // console.error('Failed to delete user:', error);
                    alert('Failed to delete user. Please check the console for more details.');
                });
        }
        setPasswordDialogOpen(false);
        setAdminPassword('');
    };

    return (
        <Box sx={{ width: '100%', mb: 3 }}>
            <TableContainer 
                component={Paper} 
                sx={{ 
                    boxShadow: 3,
                    borderRadius: 2,
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ 
                            backgroundColor: '#208454',
                        }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Password</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Balance</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Admin</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <React.Fragment key={index}>
                                <TableRow 
                                    sx={{ 
                                        backgroundColor: user.isAdmin 
                                            ? 'rgba(46, 125, 50, 0.1)'
                                            : index % 2 === 0 
                                                ? 'rgba(0, 0, 0, 0.02)'
                                                : 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        },
                                    }}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {user.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            color: 'text.secondary'
                                        }}>
                                            <LockOutlinedIcon fontSize="small" />
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                Encrypted
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                fontWeight: 500,
                                                color: user.isAdmin ? 'text.secondary' : 'success.main'
                                            }}
                                        >
                                            {user.isAdmin ? '-' : `$${user.balance.toFixed(2)}`}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: user.isAdmin ? 'primary.main' : 'text.secondary',
                                                fontWeight: user.isAdmin ? 500 : 400
                                            }}
                                        >
                                            {user.isAdmin ? 'Yes' : 'No'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {!user.isAdmin && (
                                            <IconButton 
                                                onClick={() => handleToggle(index)}
                                                size="small"
                                                sx={{ 
                                                    color: 'primary.main',
                                                    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                                                }}
                                            >
                                                {open[index] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                            </IconButton>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {currentUser && currentUser.email !== user.email && !user.isAdmin && (
                                            <>
                                                <IconButton 
                                                    onClick={(event) => handleMenuOpen(event, index)}
                                                    size="small"
                                                    sx={{ 
                                                        color: 'action.active',
                                                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                                                    }}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={menuAnchorEl?.anchorEl}
                                                    open={menuAnchorEl?.index === index}
                                                    onClose={handleMenuClose}
                                                    PaperProps={{
                                                        elevation: 3,
                                                        sx: { borderRadius: 1 }
                                                    }}
                                                >
                                                    <MenuItem 
                                                        onClick={() => handleDeleteUser(index)}
                                                        sx={{ 
                                                            color: 'error.main',
                                                            gap: 1
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                        Delete Account
                                                    </MenuItem>
                                                    <MenuItem 
                                                        onClick={() => handleChangePassword(index)}
                                                        sx={{ gap: 1 }}
                                                    >
                                                        <LockIcon fontSize="small" />
                                                        Change Password
                                                    </MenuItem>
                                                </Menu>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                        <Collapse in={open[index]} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 2 }}>
                                                <Typography variant="h6" gutterBottom component="div" sx={{ color: 'primary.main' }}>
                                                    
                                                </Typography>
                                                <TransactionHistory transactions={user.transactions || []} userEmail={user.email} />
                                            </Box>
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
                onClose={() => setPasswordDialogOpen(false)}
                onConfirm={handlePasswordConfirm}
                password={adminPassword}
                onPasswordChange={handlePasswordChange}
            />
        </Box>
    );
}

export default UserTable;