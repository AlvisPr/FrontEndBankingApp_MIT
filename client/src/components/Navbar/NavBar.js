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

    const handleNavigation = (to) => {
        setIsCollapsed(true);
        if (anchorEl) {
            setAnchorEl(null);
        }
        if (to) {
            navigate(to);
        }
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

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
                <Link className="navbar-brand" to="/">
                    CashConnect
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleCollapse}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ gap: '0', display: 'flex', alignItems: 'center' }}>
                        {currentUser && !currentUser.isAdmin && (
                            <>
                                <li className="nav-item" style={{ marginRight: '-4px' }}>
                                    <Link 
                                        className={`nav-link ${location.pathname === '/balance' ? 'active' : ''}`} 
                                        to="/balance" 
                                        style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}
                                        onClick={() => handleNavigation('/balance')}
                                    >
                                        <AccountBalanceWalletIcon fontSize="small" /> Balance
                                    </Link>
                                </li>
                                <li className="nav-item" style={{ marginRight: '-4px' }}>
                                    <Link 
                                        className={`nav-link ${location.pathname === '/deposit' ? 'active' : ''}`} 
                                        to="/deposit" 
                                        style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}
                                        onClick={() => handleNavigation('/deposit')}
                                    >
                                        <AddCircleOutlineIcon fontSize="small" /> Deposit
                                    </Link>
                                </li>
                                <li className="nav-item" style={{ marginRight: '-4px' }}>
                                    <Link 
                                        className={`nav-link ${location.pathname === '/withdraw' ? 'active' : ''}`} 
                                        to="/withdraw" 
                                        style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}
                                        onClick={() => handleNavigation('/withdraw')}
                                    >
                                        <RemoveCircleOutlineIcon fontSize="small" /> Withdraw
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${location.pathname === '/transfer' ? 'active' : ''}`} 
                                        to="/transfer" 
                                        style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}
                                        onClick={() => handleNavigation('/transfer')}
                                    >
                                        <SwapHorizIcon fontSize="small" /> Transfer
                                    </Link>
                                </li>
                            </>
                        )}
                        {currentUser && currentUser.isAdmin && (
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} 
                                    to="/admin" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}
                                    onClick={() => handleNavigation('/admin')}
                                >
                                    <AdminPanelSettingsIcon fontSize="small" /> Admin Panel
                                </Link>
                            </li>
                        )}
                    </ul>

                    <div className="navbar-nav">
                        {currentUser ? (
                            <div className="d-flex align-items-center">
                                <div className={styles.userProfile}>
                                    <Avatar 
                                        src={currentUser.profilePicture}
                                        alt={currentUser.name}
                                        className={styles.avatar}
                                    />
                                    <span className={styles.userName}>{currentUser.name}</span>
                                </div>
                                <IconButton
                                    size="small"
                                    onClick={() => handleNavigation('/profile')}
                                    sx={{ 
                                        ml: 1,
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                    title="Settings"
                                >
                                    <SettingsIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={onLogout}
                                    sx={{ 
                                        ml: 1,
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                    title="Logout"
                                >
                                    <LogoutIcon />
                                </IconButton>
                            </div>
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

                {/* Mobile Menu */}
                <div className={`${styles.mobileMenu} ${!isCollapsed ? styles.mobileMenuOpen : ''}`}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ gap: '0', display: 'flex', alignItems: 'center' }}>
                        {currentUser && !currentUser.isAdmin && (
                            <>
                                <li className="nav-item" style={{ marginRight: '-4px' }}>
                                    <Link 
                                        className={`nav-link ${location.pathname === '/balance' ? 'active' : ''}`} 
                                        to="/balance" 
                                        style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}
                                        onClick={() => handleNavigation('/balance')}
                                    >
                                        <AccountBalanceWalletIcon fontSize="small" /> Balance
                                    </Link>
                                </li>
                                <li className="nav-item" style={{ marginRight: '-4px' }}>
                                    <Link 
                                        className={`nav-link ${location.pathname === '/deposit' ? 'active' : ''}`} 
                                        to="/deposit" 
                                        style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}
                                        onClick={() => handleNavigation('/deposit')}
                                    >
                                        <AddCircleOutlineIcon fontSize="small" /> Deposit
                                    </Link>
                                </li>
                                <li className="nav-item" style={{ marginRight: '-4px' }}>
                                    <Link 
                                        className={`nav-link ${location.pathname === '/withdraw' ? 'active' : ''}`} 
                                        to="/withdraw" 
                                        style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}
                                        onClick={() => handleNavigation('/withdraw')}
                                    >
                                        <RemoveCircleOutlineIcon fontSize="small" /> Withdraw
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${location.pathname === '/transfer' ? 'active' : ''}`} 
                                        to="/transfer" 
                                        style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}
                                        onClick={() => handleNavigation('/transfer')}
                                    >
                                        <SwapHorizIcon fontSize="small" /> Transfer
                                    </Link>
                                </li>
                            </>
                        )}
                        {currentUser && currentUser.isAdmin && (
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} 
                                    to="/admin" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '8px 4px' }}
                                    onClick={() => handleNavigation('/admin')}
                                >
                                    <AdminPanelSettingsIcon fontSize="small" /> Admin Panel
                                </Link>
                            </li>
                        )}
                    </ul>

                    <div className="navbar-nav mt-auto">
                        {currentUser ? (
                            <div className="d-flex align-items-center justify-content-between w-100 p-3">
                                <div className={styles.userProfile}>
                                    <Avatar 
                                        src={currentUser.profilePicture}
                                        alt={currentUser.name}
                                        className={styles.avatar}
                                    />
                                    <span className={styles.userName}>{currentUser.name}</span>
                                </div>
                                <div>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleNavigation('/profile')}
                                        sx={{ 
                                            ml: 1,
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                            }
                                        }}
                                        title="Settings"
                                    >
                                        <SettingsIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={onLogout}
                                        sx={{ 
                                            ml: 1,
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                            }
                                        }}
                                        title="Logout"
                                    >
                                        <LogoutIcon />
                                    </IconButton>
                                </div>
                            </div>
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