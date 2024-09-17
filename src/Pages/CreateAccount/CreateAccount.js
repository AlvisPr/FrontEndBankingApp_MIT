// CreateAccount.js
import React, { useState, useContext, useEffect } from 'react';
import Card from '../../components/Card/Card';
import UserContext from '../../context/UserContext';
import FormInput from '../../components/FormInput/FormInput';
import { validateField } from '../../components/Validation/Validation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../components/sharedStyles.css";

function CreateAccount() {
    const [show, setShow] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const ctx = useContext(UserContext);

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

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'name') setName(value);
        if (id === 'email') setEmail(value);
        if (id === 'password') setPassword(value);
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, ctx, 'createAccount');
        setValidationErrors(errors);
        if (errors[id]) {
            toast.error(errors[id]);
        }
    };

    const handleCreate = () => {
        const errors = {
            ...validateField('name', name, ctx, 'createAccount'),
            ...validateField('email', email, ctx, 'createAccount'),
            ...validateField('password', password, ctx, 'createAccount')
        };

        if (Object.keys(errors).length === 0) {
            ctx.users.push({ name, email, password, balance: 100 });
            setShow(false);
            toast.success('Account created successfully');
        } else {
            Object.values(errors).forEach(error => toast.error(error));
        }
    };

    const clearForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setValidationErrors({});
        setShow(true);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && isFormValid) {
            handleCreate();
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <>
            <Card
                bgcolor="success"
                header="Create Account"
                body={show ? (
                    <>
                        <FormInput
                            id="name"
                            type="input"
                            value={name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyPress={handleKeyPress}
                            validationError={validationErrors.name}
                        />
                        <br />
                        <FormInput
                            id="email"
                            type="input"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyPress={handleKeyPress}
                            validationError={validationErrors.email}
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
                        />
                        <br />
                        <button type="submit" className="btn btn-light" onClick={handleCreate} disabled={!isFormValid}>Create Account</button>
                    </>
                ) : (
                    <>
                        <h5>Success</h5>
                        <button type="submit" className="btn btn-light" onClick={clearForm}>Add another account</button>
                    </>
                )}
            />
            <ToastContainer style={{ top: '80px' }}/>
        </>
    );
}

export default CreateAccount;