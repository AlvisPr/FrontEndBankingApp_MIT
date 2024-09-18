import React, { useState, useContext, useEffect } from 'react';
import Card from '../../components/Card/Card';
import UserContext from '../../context/UserContext';
import TooltipIcon from '../../components/Tooltip/Tooltip';
import styles from "../../Styles/spinner.module.css";
import { ClipLoader } from 'react-spinners';
import FormInput from '../../components/FormInput/FormInput';
import { validateField } from '../../components/Validation/Validation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserCircle } from 'react-icons/fa';

function Login() {
    const [status, setStatus] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [userType, setUserType] = useState('user'); 
    const { showLogin, setShowLogin, users, setCurrentUser, currentUser, adminCredentials, setUserType: setContextUserType } = useContext(UserContext);

    useEffect(() => {
        setIsFormValid(
            !validationErrors.email &&
            !validationErrors.password &&
            email &&
            password
        );
    }, [validationErrors, email, password]);

    useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

  

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'email') setEmail(value);
        if (id === 'password') setPassword(value);
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, 'login');
        setValidationErrors(errors);
        if (errors[id]) {
            toast.error(errors[id]);
        }
    };

    const handleLogin = () => {
        setLoading(true);
        setTimeout(() => {
            if (userType === 'admin') {
                if (email === adminCredentials.email && password === adminCredentials.password) {
                    setCurrentUser({ name: 'Admin', email: adminCredentials.email });
                    setContextUserType('admin');
                    setStatus('');
                    setShowLogin(false);
                    toast.success('Welcome Admin');
                    setLoading(false);
                    return;
                } else {
                    toast.error('Invalid admin credentials.');
                    setEmail('');
                    setPassword('');
                    setLoading(false);
                    return;
                }
            }
    
            const user = users.find(user => user.email === email);
            if (!user) {
                toast.error('Email or password not found.');
                setEmail('');
                setPassword('');
                setLoading(false);
                return;
            }
            if (user.password === password) {
                setCurrentUser(user);
                setContextUserType('user');
                setStatus('');
                setShowLogin(false); 
                toast.success(`Welcome ${user.name}`); 
            } else {
                toast.error('Error: Invalid login');
                setEmail('');
                setPassword('');
            }
            setLoading(false);
        }, 700);
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && isFormValid) {
            handleLogin();
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <>
            <Card
                bgcolor="success"
                header="Login"
                status={status}
                body={showLogin ? (
                    <form id="login-form" style={{ textAlign: 'left' }}>
                        <FormInput
                            id="email"
                            type="input"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyPress={handleKeyPress}
                            validationError={validationErrors.email}
                            placeholder="Email"
                        />
                        <br />
                        <FormInput
                            id="password"
                            type={passwordVisible ? 'text' : 'password'}
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyPress={handleKeyPress}
                            validationError={validationErrors.password}
                            togglePasswordVisibility={togglePasswordVisibility}
                            passwordVisible={passwordVisible}
                            placeholder="Password"
                        />
                        <br />
                        <div style={{ marginBottom: '15px' }}>
                            <label>
                                <input
                                    type="radio"
                                    value="user"
                                    checked={userType === 'user'}
                                    onChange={() => setUserType('user')}
                                />
                                User
                            </label>
                            <label style={{ marginLeft: '20px' }}>
                                <input
                                    type="radio"
                                    value="admin"
                                    checked={userType === 'admin'}
                                    onChange={() => setUserType('admin')}
                                />
                                Admin
                            </label>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleLogin} disabled={userType === 'user' && !isFormValid}>Login</button>
                    </form>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                        <FaUserCircle size={150} color="white" style={{ marginBottom: '10px' }} />
                        <h3>{currentUser.name}</h3>
                        <p>{currentUser.email}</p>
                        
                    </div>
                )}
            />
            {loading && (
                <div className={styles.spinner}>
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                </div>
            )}
            <TooltipIcon 
                text={`
                    Here we are displaying the login form. 
                    If the user is not logged in, they will be prompted to log in.
                `}
            />
            <ToastContainer style={{ top: '80px' }}/>
        </>
    );
}

export default Login;