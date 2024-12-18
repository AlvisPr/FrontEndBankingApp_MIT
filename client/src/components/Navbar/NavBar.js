import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import styles from './Navbar.module.css';
import { FaUsers } from 'react-icons/fa';
import { Avatar, Menu, MenuItem, IconButton, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useUser();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false);
    };

    const onLogout = () => {
        handleClose();
        logout();
        navigate('/');
    };

    const handleSettings = () => {
        handleClose();
        navigate('/profile');
    };

    return (
        <nav className="navbar navbar-expand-lg bg-success sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" onClick={() => setIsCollapsed(true)}>
                    CashConnect
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ gap: '0', display: 'flex', alignItems: 'center' }}>
                        {currentUser && !currentUser.isAdmin && (
                            <>
                                <li className="nav-item" style={{ marginRight: '-4px' }}>
                                    <Link className={`nav-link ${location.pathname === '/balance' ? 'active' : ''}`} to="/balance" style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}>
                                        <AccountBalanceWalletIcon fontSize="small" /> Balance
                                    </Link>
                                </li>
                                <li className="nav-item" style={{ marginRight: '-4px' }}>
                                    <Link className={`nav-link ${location.pathname === '/deposit' ? 'active' : ''}`} to="/deposit" style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}>
                                        <AddCircleOutlineIcon fontSize="small" /> Deposit
                                    </Link>
                                </li>
                                <li className="nav-item" style={{ marginRight: '-4px' }}>
                                    <Link className={`nav-link ${location.pathname === '/withdraw' ? 'active' : ''}`} to="/withdraw" style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}>
                                        <RemoveCircleOutlineIcon fontSize="small" /> Withdraw
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === '/transfer' ? 'active' : ''}`} to="/transfer" style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}>
                                        <SwapHorizIcon fontSize="small" /> Transfer
                                    </Link>
                                </li>
                            </>
                        )}
                        {currentUser && currentUser.isAdmin && (
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}>
                                    <AdminPanelSettingsIcon fontSize="small" /> Admin Panel
                                </Link>
                            </li>
                        )}
                    </ul>

                    <div className="navbar-nav">
                        {currentUser ? (
                            <>
                                <div className={styles.userProfile} onClick={handleClick}>
                                    <Avatar 
                                        src={currentUser.profilePicture}
                                        alt={currentUser.name}
                                        className={styles.avatar}
                                    />
                                    <span className={styles.userName}>{currentUser.name}</span>
                                    <IconButton
                                        size="small"
                                        sx={{ 
                                            ml: 1,
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                            }
                                        }}
                                    >
                                        <AccountCircleIcon />
                                    </IconButton>
                                </div>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    PaperProps={{
                                        elevation: 3,
                                        sx: {
                                            mt: 1.5,
                                            backgroundColor: '#198754',
                                            color: 'white',
                                            minWidth: '200px',
                                            '& .MuiMenuItem-root': {
                                                padding: '10px 20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                                }
                                            }
                                        }
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={handleSettings}>
                                        <SettingsIcon /> Settings
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={onLogout}>
                                        <LogoutIcon /> Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">
                                        <LoginIcon className="me-1" /> Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/createaccount" className="nav-link">
                                        <PersonAddIcon className="me-1" /> Create Account
                                    </Link>
                                </li>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.navbarLine}></div>
        </nav>
    );
}

export default NavBar;