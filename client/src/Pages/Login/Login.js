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
import { FcGoogle } from 'react-icons/fc';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const GoogleButton = styled(Button)(({ theme }) => ({
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#757575',
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': {
        backgroundColor: '#f5f5f5',
        borderColor: '#a8a8a8',
    },
    '& .icon': {
        marginRight: '10px',
    }
}));

function Login() {
    const [status, setStatus] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();
    const { showLogin, setShowLogin, loginUser, currentUser } = useContext(UserContext);

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
        setValidationErrors(prev => ({ ...prev, [id]: errors[id] }));
        if (errors[id]) {
            toast.error(errors[id]);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const result = await loginUser({
                email,
                password,
                isGoogleUser: false
            });
            
            if (result.success) {
                setShowLogin(false);
                toast.success('Successfully logged in!');
                navigate('/');
            } else {
                toast.error(result.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, googleProvider);
            const { user } = result;
            
            const loginResult = await loginUser({
                email: user.email,
                googleId: user.uid,
                name: user.displayName,
                photoURL: user.photoURL,
                isGoogleUser: true
            });
            
            if (loginResult.success) {
                setShowLogin(false);
                toast.success('Successfully logged in with Google!');
                navigate('/');
            } else {
                toast.error(loginResult.error || 'Google login failed');
            }
        } catch (error) {
            console.error('Google login error:', error);
            toast.error(error.message || 'Failed to login with Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card
                bgcolor="success"
                header="Login"
                status={status}
                body={showLogin ? (
                    <form>
                        <FormInput
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={validationErrors.email}
                            placeholder="Email"
                        />
                        <br />
                        <FormInput
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={validationErrors.password}
                            placeholder="Password"
                        />
                        <br />
                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary w-100 mb-3"
                                disabled={!isFormValid || loading}
                                onClick={handleLogin}
                            >
                                {loading ? (
                                    <div className={styles.spinnerContainer}>
                                        <ClipLoader color="#ffffff" loading={loading} size={20} />
                                    </div>
                                ) : (
                                    'Login'
                                )}
                            </button>

                            <GoogleButton
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                startIcon={<FcGoogle />}
                            >
                                Sign in with Google
                            </GoogleButton>
                        </div>
                    </form>
                ) : (
                    currentUser && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                            <FaUserCircle size={150} color="white" style={{ marginBottom: '10px' }} />
                            <h3>{currentUser.name}</h3>
                            <p>{currentUser.email}</p>
                        </div>
                    )
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
                If they are logged in, we display their information.
            `}
            />
            <ToastContainer />
        </>
    );
}

export default Login;