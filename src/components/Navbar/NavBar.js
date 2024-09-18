import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaDatabase, FaUserPlus, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import UserContext from '../../context/UserContext';
import styles from './Navbar.module.css'; 

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, setCurrentUser, setShowLogin, setLogout, userType } = useContext(UserContext);
    const [isCollapsed, setIsCollapsed] = useState(true);

    const highlightStyle = {
        backgroundColor: 'yellow',
        borderRadius: '5px',
        padding: '7px',
        color: "black",
        border: '3px solid darkviolet'
    };

    const getLinkStyle = (path) => {
        return location.pathname === path ? highlightStyle : {};
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setShowLogin(true); 
        setLogout(true); 
        navigate('/login'); 
        setIsCollapsed(true); 
    };

    const handleLinkClick = () => {
        setIsCollapsed(true); 
    };

    return (
        <nav className={`navbar navbar-expand-lg navbar-light bg-light fixed-top ${styles.navbar}`}>
            <div className={styles.navbarHeader}>
                <Link className="navbar-brand" to="/" style={{ marginRight: '60px', marginLeft: "30px" }}>CashConnect</Link>
                <button className="navbar-toggler" type="button" onClick={() => setIsCollapsed(!isCollapsed)} aria-controls="navbarNav" aria-expanded={!isCollapsed} aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>
            <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''} ${styles.navbarCollapse}`} id="navbarNav">
                <ul className={`navbar-nav ${styles.navbarNav}`}>
                    {currentUser && userType === 'user' && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/deposit" style={getLinkStyle('/deposit')} onClick={handleLinkClick}>Deposit</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/withdraw" style={getLinkStyle('/withdraw')} onClick={handleLinkClick}>Withdraw</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/balance" style={getLinkStyle('/balance')} onClick={handleLinkClick}>Balance</Link>
                            </li>
                        </>
                    )}
                    {currentUser && userType === 'admin' && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/alldata" style={getLinkStyle('/alldata')} onClick={handleLinkClick}><FaDatabase style={{ marginRight: '5px', fontSize: "25px" }} /></Link>
                        </li>
                    )}
                </ul>
                <div className={styles.navbarButtons}>
                    <ul className={`navbar-nav ${styles.navbarNav}`}>
                        {!currentUser && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/CreateAccount" style={getLinkStyle('/CreateAccount')} onClick={handleLinkClick}><FaUserPlus style={{ marginRight: '5px' }} />Create Account</Link>
                            </li>
                        )}
                        <li className="nav-item">
                            {currentUser ? (
                                <button className="nav-link btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center' }}>
                                    <FaSignOutAlt style={{ marginRight: '5px' }} />Logout
                                </button>
                            ) : (
                                <Link className="nav-link" to="/login" style={getLinkStyle('/login')} onClick={handleLinkClick}><FaSignInAlt style={{ marginRight: '5px' }} />Login</Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;