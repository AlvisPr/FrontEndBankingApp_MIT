import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { createUser, setShowLogin } = useUser();

    const handleCreate = async (e) => {
        e.preventDefault();
        
        // Debug log
        const userData = {
            email: email.trim(),
            password: password
        };
        
        console.log('About to send this data:', userData);

        if (!email || !password) {
            alert('Please fill in both email and password');
            return;
        }

        try {
            await createUser(userData);
            setShowLogin(true);
        } catch (error) {
            const errorMessage = error.error || 'Failed to create account';
            alert(errorMessage);
            console.error('Full error:', error);
        }
    };

    return (
        <form onSubmit={handleCreate}>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Create Account</button>
        </form>
    );
};

export default CreateAccount; 