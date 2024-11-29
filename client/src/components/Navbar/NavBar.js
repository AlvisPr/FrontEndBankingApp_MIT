import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import styles from './Navbar.module.css';
import { FaUsers } from 'react-icons/fa';
import { Avatar, Menu, MenuItem, IconButton, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SettingsIcon from '@mui/icons-material/Settings';

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useContext(UserContext);
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

    const handleLogout = () => {
        handleClose();
        logout();
    };

    const handleProfile = () => {
        handleClose();
        navigate('/profile');
    };

    const handleSettings = () => {
        handleClose();
        navigate('/settings');
    };

    return (
        <nav className="navbar navbar-expand-lg bg-success">
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
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {currentUser && !currentUser.isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === '/balance' ? 'active' : ''}`} to="/balance">
                                        <AccountBalanceWalletIcon /> Balance
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === '/deposit' ? 'active' : ''}`} to="/deposit">
                                        <AddCircleOutlineIcon /> Deposit
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === '/withdraw' ? 'active' : ''}`} to="/withdraw">
                                        <RemoveCircleOutlineIcon /> Withdraw
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === '/transfer' ? 'active' : ''}`} to="/transfer">
                                        <SwapHorizIcon /> Transfer
                                    </Link>
                                </li>
                            </>
                        )}
                        {currentUser && currentUser.isAdmin && (
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/alldata' ? 'active' : ''}`} to="/alldata">
                                    <FaUsers /> All Data
                                </Link>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex align-items-center">
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
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: 'white'
                                                }
                                            },
                                            '& .MuiDivider-root': {
                                                borderColor: 'rgba(255, 255, 255, 0.2)'
                                            }
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={handleProfile}>
                                        <PersonIcon /> Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleSettings}>
                                        <SettingsIcon /> Settings
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleLogout}>
                                        <LogoutIcon /> Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;