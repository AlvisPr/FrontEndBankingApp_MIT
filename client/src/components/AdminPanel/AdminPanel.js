import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Chip,
    InputAdornment,
    Typography,
    Collapse,
    Tooltip,
    Snackbar,
    CircularProgress
} from '@mui/material';
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    Search as SearchIcon,
    LockReset as LockResetIcon,
    PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import styles from './AdminPanel.module.css';

function Row({ user, onDelete, onPasswordChange, currentUserId }) {
    const [open, setOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async () => {
        if (!open) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/api/users/${user._id}/transactions`);
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTransactions();
    }, [open]);

    return (
        <>
            <TableRow 
                className={styles.userRow}
                sx={{ 
                    '& > *': { borderBottom: 'unset' },
                    backgroundColor: user.isAdmin ? 'rgba(32, 132, 84, 0.08)' : 'inherit'
                }}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: user.balance >= 0 ? '#4caf50' : '#f44336',
                            fontWeight: 500
                        }}
                    >
                        ${user.balance.toFixed(2)}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Chip 
                        label={user.isAdmin ? 'Admin' : 'User'}
                        color={user.isAdmin ? 'success' : 'default'}
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Change Password">
                            <IconButton 
                                onClick={() => onPasswordChange(user)}
                                disabled={currentUserId === user._id}
                                color="primary"
                            >
                                <LockResetIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                            <IconButton
                                onClick={() => onDelete(user)}
                                disabled={currentUserId === user._id}
                                sx={{ 
                                    color: '#757575',
                                    '&:hover': {
                                        color: '#ef5350'
                                    }
                                }}
                            >
                                <PersonRemoveIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div" sx={{ color: '#208454' }}>
                                Transaction History
                            </Typography>
                            {loading ? (
                                <Typography>Loading transactions...</Typography>
                            ) : transactions.length > 0 ? (
                                <Table size="small" aria-label="transactions">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ minWidth: 180 }}>Date</TableCell>
                                            <TableCell sx={{ minWidth: 120 }}>Type</TableCell>
                                            <TableCell sx={{ minWidth: 120 }}>Amount</TableCell>
                                            <TableCell sx={{ minWidth: 200 }}>Details</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transactions.map((transaction, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{new Date(transaction.date).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={transaction.type}
                                                        size="small"
                                                        sx={{ 
                                                            backgroundColor: transaction.type === 'deposit' ? '#4caf50' : 
                                                                           transaction.type === 'withdraw' ? '#f44336' : '#2196f3',
                                                            color: 'white',
                                                            textTransform: 'capitalize'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        sx={{
                                                            color: transaction.type === 'deposit' ? '#4caf50' : 
                                                                   transaction.type === 'withdraw' ? '#f44336' : '#2196f3',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        ${transaction.amount.toFixed(2)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{transaction.description || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Typography color="textSecondary">No transactions found</Typography>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [notification, setNotification] = useState({ 
        open: false, 
        message: '', 
        title: '',
        severity: 'success' 
    });
    const [actionLoading, setActionLoading] = useState({
        password: false,
        delete: false
    });

    const { currentUser } = useUser();
    const okButtonRef = useRef(null);

    const showNotification = (message, title, severity = 'success') => {
        setNotification({
            open: true,
            message,
            title,
            severity
        });
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            handleCloseNotification();
        }
    };

    useEffect(() => {
        if (notification.open && okButtonRef.current) {
            okButtonRef.current.focus();
        }
    }, [notification.open]);

    const handlePasswordClick = (user) => {
        setSelectedUser(user);
        setPasswordDialogOpen(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handlePasswordChange = async () => {
        setActionLoading(prev => ({ ...prev, password: true }));
        try {
            await axios.put(`http://localhost:3001/api/users/${selectedUser._id}/password`, { newPassword });
            showNotification(
                'The password has been successfully updated.',
                'Password Updated',
                'success'
            );
            setNewPassword('');
            setPasswordDialogOpen(false);
        } catch (err) {
            showNotification(
                err.response?.data?.error || 'There was an error updating the password.',
                'Error',
                'error'
            );
        } finally {
            setActionLoading(prev => ({ ...prev, password: false }));
        }
    };

    const handleDeleteConfirm = async () => {
        setActionLoading(prev => ({ ...prev, delete: true }));
        try {
            await axios.delete(`http://localhost:3001/api/users/${selectedUser._id}`);
            showNotification(
                'The user has been successfully deleted from the system.',
                'User Deleted',
                'success'
            );
            fetchUsers();
            setDeleteDialogOpen(false);
        } catch (err) {
            showNotification(
                err.response?.data?.error || 'There was an error deleting the user.',
                'Error',
                'error'
            );
        } finally {
            setActionLoading(prev => ({ ...prev, delete: false }));
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const searchLower = searchQuery.toLowerCase();
        return user.name.toLowerCase().includes(searchLower) ||
               user.email.toLowerCase().includes(searchLower);
    });

    if (!currentUser?.isAdmin) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" color="error">
                    Access Denied. Admin privileges required.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}
            
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#e0e0e0',
                            },
                            '&:hover fieldset': {
                                borderColor: '#208454',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#208454',
                            },
                        },
                    }}
                />
            </Box>

            <Paper 
                elevation={3} 
                sx={{ 
                    width: '100%',
                    height: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                <TableContainer 
                    sx={{ 
                        flex: 1,
                        overflow: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                            height: '6px'
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'rgba(0, 0, 0, 0.05)',
                            borderRadius: '8px',
                            margin: '8px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#208454',
                            borderRadius: '8px',
                            '&:hover': {
                                background: '#1a6b44'
                            }
                        },
                        '&::-webkit-scrollbar-corner': {
                            background: 'transparent'
                        }
                    }}
                >
                    <Table stickyHeader sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#208454' }}>
                                <TableCell sx={{ width: '50px', color: 'white', bgcolor: '#208454' }} />
                                <TableCell sx={{ minWidth: 150, color: 'white', bgcolor: '#208454', fontWeight: 500 }}>Name</TableCell>
                                <TableCell sx={{ minWidth: 200, color: 'white', bgcolor: '#208454', fontWeight: 500 }}>Email</TableCell>
                                <TableCell sx={{ minWidth: 120, color: 'white', bgcolor: '#208454', fontWeight: 500 }}>Balance</TableCell>
                                <TableCell sx={{ minWidth: 100, color: 'white', bgcolor: '#208454', fontWeight: 500 }}>Role</TableCell>
                                <TableCell sx={{ minWidth: 120, color: 'white', bgcolor: '#208454', fontWeight: 500 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        {searchQuery ? 'No users found matching your search' : 'No users found'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <Row 
                                        key={user._id} 
                                        user={user} 
                                        onDelete={handleDeleteClick}
                                        onPasswordChange={handlePasswordClick}
                                        currentUserId={currentUser._id}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Password Dialog */}
            <Dialog 
                open={passwordDialogOpen} 
                onClose={() => !actionLoading.password && setPasswordDialogOpen(false)}
            >
                <DialogTitle sx={{ 
                    bgcolor: 'success.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <LockResetIcon />
                    Change Password
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={actionLoading.password}
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setPasswordDialogOpen(false)}
                        disabled={actionLoading.password}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePasswordChange}
                        variant="contained"
                        color="success"
                        disabled={!newPassword || actionLoading.password}
                        startIcon={actionLoading.password ? <CircularProgress size={20} color="inherit" /> : <LockResetIcon />}
                    >
                        {actionLoading.password ? 'Updating...' : 'Update Password'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog 
                open={deleteDialogOpen} 
                onClose={() => !actionLoading.delete && setDeleteDialogOpen(false)}
            >
                <DialogTitle sx={{ 
                    bgcolor: 'error.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <PersonRemoveIcon />
                    Delete User
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography>
                        Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={actionLoading.delete}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        disabled={actionLoading.delete}
                        startIcon={actionLoading.delete ? <CircularProgress size={20} color="inherit" /> : <PersonRemoveIcon />}
                    >
                        {actionLoading.delete ? 'Deleting...' : 'Delete User'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Dialog */}
            <Dialog
                open={notification.open}
                onClose={handleCloseNotification}
                aria-labelledby="notification-dialog-title"
                aria-describedby="notification-dialog-description"
                disablePortal={false}
                keepMounted={false}
                onKeyDown={handleKeyDown}
                PaperProps={{
                    style: {
                        minWidth: '300px',
                        maxWidth: '400px'
                    }
                }}
            >
                <DialogTitle 
                    id="notification-dialog-title"
                    sx={{ 
                        bgcolor: notification.severity === 'success' ? 'success.main' : 'error.main',
                        color: 'white',
                        py: 1.5
                    }}
                >
                    {notification.title}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography id="notification-dialog-description">
                        {notification.message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        ref={okButtonRef}
                        onClick={handleCloseNotification} 
                        variant="contained"
                        autoFocus
                        sx={{ 
                            bgcolor: notification.severity === 'success' ? 'success.main' : 'error.main',
                            '&:hover': {
                                bgcolor: notification.severity === 'success' ? 'success.dark' : 'error.dark',
                            }
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AdminPanel;
