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
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="d-flex align-items-center">
                        <Link className="navbar-brand px-3" to="/">
                            CashConnect
                        </Link>
                        
                        {currentUser && !currentUser.isAdmin && (
                            <div className="d-none d-lg-flex">
                                <Link 
                                    className={`nav-link ${location.pathname === '/balance' ? 'active' : ''}`} 
                                    to="/balance" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <AccountBalanceWalletIcon /> Balance
                                </Link>
                                <Link 
                                    className={`nav-link ${location.pathname === '/deposit' ? 'active' : ''}`} 
                                    to="/deposit" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <AddCircleOutlineIcon /> Deposit
                                </Link>
                                <Link 
                                    className={`nav-link ${location.pathname === '/withdraw' ? 'active' : ''}`} 
                                    to="/withdraw" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <RemoveCircleOutlineIcon /> Withdraw
                                </Link>
                                <Link 
                                    className={`nav-link ${location.pathname === '/transfer' ? 'active' : ''}`} 
                                    to="/transfer" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <SwapHorizIcon /> Transfer
                                </Link>
                            </div>
                        )}
                    </div>

                    <button
                        className="navbar-toggler mx-3"
                        type="button"
                        onClick={toggleCollapse}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ gap: '0', display: 'flex', alignItems: 'center' }}>
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
                <div 
                    className={`${styles.mobileOverlay} ${!isCollapsed ? styles.mobileOverlayVisible : ''}`} 
                    onClick={toggleCollapse}
                ></div>
                <div className={`${styles.mobileMenu} ${!isCollapsed ? styles.mobileMenuOpen : ''}`}>
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <Link className="navbar-brand" to="/" onClick={() => handleNavigation('/')}>
                            CashConnect
                        </Link>
                        <button
                            className="btn-close btn-close-white"
                            onClick={toggleCollapse}
                            aria-label="Close menu"
                        ></button>
                    </div>
                    
                    <ul className="navbar-nav">
                        {currentUser ? (
                            <>
                                <div className="banking-actions">
                                    {!currentUser.isAdmin && (
                                        <>
                                            <li className="nav-item">
                                                <Link 
                                                    className={`nav-link ${location.pathname === '/balance' ? 'active' : ''}`} 
                                                    to="/balance" 
                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                                    onClick={() => handleNavigation('/balance')}
                                                >
                                                    <AccountBalanceWalletIcon /> Balance
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link 
                                                    className={`nav-link ${location.pathname === '/deposit' ? 'active' : ''}`} 
                                                    to="/deposit" 
                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                                    onClick={() => handleNavigation('/deposit')}
                                                >
                                                    <AddCircleOutlineIcon /> Deposit
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link 
                                                    className={`nav-link ${location.pathname === '/withdraw' ? 'active' : ''}`} 
                                                    to="/withdraw" 
                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                                    onClick={() => handleNavigation('/withdraw')}
                                                >
                                                    <RemoveCircleOutlineIcon /> Withdraw
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link 
                                                    className={`nav-link ${location.pathname === '/transfer' ? 'active' : ''}`} 
                                                    to="/transfer" 
                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                                    onClick={() => handleNavigation('/transfer')}
                                                >
                                                    <SwapHorizIcon /> Transfer
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    {currentUser.isAdmin && (
                                        <li className="nav-item">
                                            <Link 
                                                className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} 
                                                to="/admin" 
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                                onClick={() => handleNavigation('/admin')}
                                            >
                                                <AdminPanelSettingsIcon /> Admin Panel
                                            </Link>
                                        </li>
                                    )}
                                </div>
                                <div className="user-actions mt-auto">
                                    <li className="nav-item">
                                        <Link 
                                            className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                                            to="/profile"
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                            onClick={() => handleNavigation('/profile')}
                                        >
                                            <SettingsIcon /> Update Profile
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className="nav-link text-danger w-100 border-0 bg-transparent"
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                            onClick={onLogout}
                                        >
                                            <LogoutIcon /> Logout
                                        </button>
                                    </li>
                                </div>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                                        to="/login" 
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                        onClick={() => handleNavigation('/login')}
                                    >
                                        <LoginIcon /> Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${location.pathname === '/createaccount' ? 'active' : ''}`}
                                        to="/createaccount" 
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                        onClick={() => handleNavigation('/createaccount')}
                                    >
                                        <PersonAddIcon /> Create Account
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {currentUser && (
                        <div className="mt-auto p-3 border-top">
                            <div className="d-flex align-items-center">
                                <Avatar 
                                    src={currentUser.profilePicture}
                                    alt={currentUser.name}
                                    className={styles.avatar}
                                />
                                <span className={`${styles.userName} ms-2`}>{currentUser.name}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.navbarLine}></div>
        </nav>
    );
}

export default NavBar;