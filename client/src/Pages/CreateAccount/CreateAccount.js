import React, { useState, useContext, useEffect } from 'react';
import UserContext from '../../context/UserContext';
import Card from '../../components/Card/Card';
import FormInput from '../../components/FormInput/FormInput';
import { validateField } from '../../components/Validation/Validation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcGoogle } from 'react-icons/fc';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import styles from "../../Styles/spinner.module.css";

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

function CreateAccount() {
    const [show, setShow] = useState(true);
    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const { createUser } = useContext(UserContext);

    useEffect(() => {
        setIsFormValid(
            !validationErrors.name &&
            !validationErrors.email &&
            !validationErrors.password &&
            name &&
            email &&
            password
        );
    }, [validationErrors, name, email, password]);

    const clearForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setValidationErrors({});
        setShow(true);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'name') setName(value);
        if (id === 'email') setEmail(value);
        if (id === 'password') setPassword(value);
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value);
        setValidationErrors(prev => ({
            ...prev,
            [id]: errors[id]
        }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createUser({
                name,
                email,
                password,
                isGoogleUser: false
            });
            clearForm();
            setShow(false);
            toast.success('Account created successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, googleProvider);
            const { user } = result;
            
            await createUser({
                email: user.email,
                googleId: user.uid,
                name: user.displayName,
                isGoogleUser: true
            });

            clearForm();
            setShow(false);
            toast.success('Account created successfully with Google!');
        } catch (error) {
            console.error('Google signup error:', error);
            toast.error(error.message || 'Failed to create account with Google. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card
                bgcolor="primary"
                header="Create Account"
                status={status}
                body={show ? (
                    <>
                        <FormInput
                            type="input"
                            id="name"
                            value={name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={validationErrors.name}
                            placeholder="Name"
                        />
                        <FormInput
                            type="input"
                            id="email"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={validationErrors.email}
                            placeholder="Email"
                        />
                        <FormInput
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={validationErrors.password}
                            placeholder="Password"
                            togglePasswordVisibility={() => setPasswordVisible(!passwordVisible)}
                            passwordVisible={passwordVisible}
                        />
                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary w-100 mb-3"
                                disabled={!isFormValid || loading}
                                onClick={handleCreate}
                            >
                                {loading ? (
                                    <div className={styles.spinnerContainer}>
                                        <ClipLoader color="#ffffff" loading={loading} size={20} />
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                            <GoogleButton
                                onClick={handleGoogleSignUp}
                                disabled={loading}
                                startIcon={<FcGoogle />}
                            >
                                Sign up with Google
                            </GoogleButton>
                        </div>
                    </>
                ) : (
                    <>
                        <h5>Success</h5>
                        <button type="submit" className="btn btn-light" onClick={clearForm}>Add another account</button>
                    </>
                )}
            />
            <ToastContainer position="bottom-right" />
        </>
    );
}

export default CreateAccount;