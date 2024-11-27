import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaCog } from 'react-icons/fa';
import UserContext from '../../context/UserContext';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from './Navbar.module.css'; 
import spinner from '../../Styles/spinner.module.css';

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, setCurrentUser, setShowLogin, setLogout } = useContext(UserContext);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [loading, setLoading] = useState(false);

    const highlightStyle = {
        backgroundColor: 'yellow',
        borderRadius: '5px',
        padding: '5px',
        color: "black",
        border: '3px solid darkviolet'
    };

    const getLinkStyle = (path) => {
        return location.pathname === path ? highlightStyle : {};
    };

    const handleLogout = () => {
        setLoading(true);
        setTimeout(() => {
            setCurrentUser(null);
            setShowLogin(true); 
            setLogout(true); 
            navigate('/login'); 
            setIsCollapsed(true); 
            setLoading(false);
        }, 700);
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
                    {currentUser && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/balance" style={getLinkStyle('/balance')} onClick={handleLinkClick}>Balance</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/deposit" style={getLinkStyle('/deposit')} onClick={handleLinkClick}>Deposit</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/withdraw" style={getLinkStyle('/withdraw')} onClick={handleLinkClick}>Withdraw</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/transfer" style={getLinkStyle('/transfer')} onClick={handleLinkClick}>Transfer</Link>
                            </li>
                        </>
                    )}
                </ul>
                <div className={styles.navbarButtons}>
                    <ul className={`navbar-nav ${styles.navbarNav}`}>
                        {!currentUser && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/createaccount" style={getLinkStyle('/createaccount')} onClick={handleLinkClick}>
                                    <FaUserPlus style={{ marginRight: '5px' }} />Create Account
                                </Link>
                            </li>
                        )}
                        {currentUser && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile" style={getLinkStyle('/profile')} onClick={handleLinkClick}>
                                    <FaCog style={{ marginRight: '5px' }} />
                                </Link>
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
            {loading && (
                <div className={spinner.spinner}>
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                </div>
            )}
        </nav>
    );
}

export default NavBar;