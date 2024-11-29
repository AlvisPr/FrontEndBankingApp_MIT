import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card/Card';
import FormInput from '../FormInput/FormInput';
import UserContext from '../../context/UserContext';
import styles from './CreateAccount.module.css';

function CreateAccount() {
    const navigate = useNavigate();
    const { createAccount } = useContext(UserContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            await createAccount(formData);
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Failed to create account');
        }
    };

    return (
        <Card
            bgcolor="success"
            header="Create Account"
            body={
                <>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <FormInput
                            label="Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-light w-100">Create Account</button>
                    </form>
                </>
            }
        />
    );
}

export default CreateAccount;
