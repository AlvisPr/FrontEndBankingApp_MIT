import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();
const API_URL = 'http://localhost:3001/api';

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [showLogin, setShowLogin] = useState(true);
    const [logout, setLogout] = useState(false);
    const [userType, setUserType] = useState('user');

    // Fetch all users (for admin view)
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const logTransaction = async (type, amount) => {
        if (!currentUser) {
            throw new Error('User must be logged in to perform a transaction');
        }

        try {
            const normalizedType = type.toLowerCase();
            console.log('Starting transaction:', { 
                type: normalizedType, 
                amount, 
                userId: currentUser._id 
            });

            // Validate transaction type
            if (!['deposit', 'withdraw'].includes(normalizedType)) {
                throw new Error(`Invalid transaction type: ${type}. Must be 'deposit' or 'withdraw'`);
            }

            // Validate amount
            const numericAmount = parseFloat(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                throw new Error('Amount must be a positive number');
            }

            const response = await axios.post(`${API_URL}/users/${currentUser._id}/transaction`, {
                type: normalizedType,
                amount: numericAmount
            });

            console.log('Transaction successful:', response.data);
            
            setCurrentUser(response.data);
            await fetchUsers();
            
            return response.data;

        } catch (error) {
            console.error('Transaction failed:', {
                error: error.response?.data || error.message,
                details: error.response?.data?.details || error.message
            });
            
            throw error.response?.data?.error || 
                  error.response?.data?.message || 
                  error.message || 
                  'Transaction failed';
        }
    };

    const removeUser = async (email) => {
        try {
            const userToDelete = users.find(user => user.email === email);
            if (userToDelete) {
                if (!currentUser || !currentUser.isAdmin) {
                    throw new Error('Admin user must be logged in to remove a user');
                }

                console.log('Sending admin password:', currentUser.password);
                await axios.delete(`${API_URL}/users/${userToDelete._id}`, {
                    headers: { 
                        'Admin-Password': currentUser.password,
                        'Content-Type': 'application/json',
                        'user-id': currentUser._id // Ensure the current user ID is sent
                    }
                });
                setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
            }
        } catch (error) {
            console.error('Error removing user:', error.response?.data || error.message);
            throw error.response?.data?.error || error.message;
        }
    };

    const createUser = async (name, email, password) => {
        try {
            // Add debug logs
            console.log('Starting createUser with:', { name, email, password });

            if (!email || !password) {
                console.error('Invalid user data: email and password are required');
                throw new Error('Email and password are required');
            }

            // Log the exact request we're about to make
            console.log('Making request to:', `${API_URL}/users/register`);
            
            const userData = {
                name,
                email,
                password
            };

            console.log('With data:', userData);

            const response = await axios.post(`${API_URL}/users/register`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 5000,
                validateStatus: (status) => status >= 200 && status < 500
            });

            console.log('Server response:', response);
            
            if (response.data) {
                setUsers(prevUsers => [...prevUsers, response.data]);
                return response.data;
            } else {
                throw new Error('No data received from server');
            }
        } catch (error) {
            console.error('Detailed error information:', {
                message: error.message,
                response: error.response,
                request: error.request,
                config: error.config
            });

            throw {
                error: error.response?.data?.error || error.message,
                details: error.response?.data?.details || 'Unknown error occurred'
            };
        }
    };

    const loginUser = async (email, password) => {
        try {
            console.log('Attempting login for:', email);
            
            const response = await axios.post(`${API_URL}/users/login`, {
                email: email.toLowerCase(),
                password
            });
    
            console.log('Login successful');
            const loggedInUser = response.data;
            const isAdmin = loggedInUser.isAdmin;
    
            // Set the current user, including password if it's an admin
            const currentUserData = isAdmin
                ? { ...loggedInUser, password, isAdmin }
                : { ...loggedInUser, isAdmin };
    
            setCurrentUser(currentUserData);
            setShowLogin(false);
            setUserType(isAdmin ? 'admin' : 'user');
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Login error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
    
            throw {
                message: error.response?.data?.error || 
                        error.response?.data?.message || 
                        'Invalid email or password'
            };
        }
    };
    
    const changeUserPassword = async (userId, newPassword) => {
        try {
            const response = await axios.patch(`${API_URL}/users/${userId}/password`, { newPassword });
            return response.data;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    };

    return (
        <UserContext.Provider value={{
            users,
            setUsers,
            currentUser,
            setCurrentUser,
            showLogin,
            setShowLogin,
            logout,
            setLogout,
            userType,
            setUserType,
            removeUser,
            logTransaction,
            createUser,
            loginUser,
            changeUserPassword
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};

export default UserContext;