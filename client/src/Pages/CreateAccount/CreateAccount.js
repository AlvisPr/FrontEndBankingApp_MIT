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
import { ClipLoader } from 'react-spinners';
import styles from "../../Styles/spinner.module.css";
import UserCard from '../../components/UserCard/UserCard';

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
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const { createUser, currentUser } = useContext(UserContext);

    useEffect(() => {
        // Validate form whenever inputs change
        const errors = {};
        if (name) {
            const nameErrors = validateField('name', name);
            if (nameErrors.name) errors.name = nameErrors.name;
        }
        if (email) {
            const emailErrors = validateField('email', email);
            if (emailErrors.email) errors.email = emailErrors.email;
        }
        if (password) {
            const passwordErrors = validateField('password', password);
            if (passwordErrors.password) errors.password = passwordErrors.password;
        }
        
        setValidationErrors(errors);
        setIsFormValid(
            !Object.keys(errors).length &&
            name &&
            email &&
            password
        );
    }, [name, email, password]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'name') setName(value);
        if (id === 'email') setEmail(value);
        if (id === 'password') setPassword(value);

        // Clear validation error when user starts typing
        if (validationErrors[id]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value);
        if (errors[id]) {
            setValidationErrors(prev => ({
                ...prev,
                [id]: errors[id]
            }));
            toast.error(errors[id]);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        // Final validation before submission
        const nameErrors = validateField('name', name);
        const emailErrors = validateField('email', email);
        const passwordErrors = validateField('password', password);

        const allErrors = {
            ...nameErrors,
            ...emailErrors,
            ...passwordErrors
        };

        if (Object.keys(allErrors).length > 0) {
            setValidationErrors(allErrors);
            Object.values(allErrors).forEach(error => {
                if (error) toast.error(error);
            });
            return;
        }

        try {
            setLoading(true);
            await createUser({
                name,
                email,
                password,
                isGoogleUser: false
            });
            toast.success('Account created successfully!');
            // Clear form
            setName('');
            setEmail('');
            setPassword('');
            setValidationErrors({});
        } catch (error) {
            console.error('Create account error:', error);
            toast.error(error.message || 'Failed to create account. Please try again.');
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
            
            toast.success('Account created successfully with Google!');
        } catch (error) {
            console.error('Google sign up error:', error);
            toast.error(error.message || 'Failed to create account with Google');
        } finally {
            setLoading(false);
        }
    };

    if (currentUser) {
        return <UserCard user={currentUser} />;
    }

    return (
        <>
            <Card
                bgcolor="primary"
                header="Create Account"
                body={
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
                }
            />
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export default CreateAccount;