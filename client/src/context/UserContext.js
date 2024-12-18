import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

const API_URL = 'http://localhost:3001/api';

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [showLogin, setShowLogin] = useState(true);
    const [userType, setUserType] = useState('user');
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        console.log('Token from localStorage:', storedToken);
        
        if (storedToken) {
            setToken(storedToken);
            // Set up axios interceptor for all requests
            const interceptor = axios.interceptors.request.use(
                (config) => {
                    config.headers.Authorization = `Bearer ${storedToken}`;
                    console.log('Request headers:', config.headers);
                    return config;
                },
                (error) => {
                    console.error('Interceptor error:', error);
                    return Promise.reject(error);
                }
            );

            const userData = JSON.parse(localStorage.getItem('user'));
            console.log('User data from localStorage:', userData);
            
            if (userData) {
                setCurrentUser(userData);
                setUserType(userData.isAdmin ? 'admin' : 'user');
            }

            // Clean up interceptor on unmount
            return () => {
                axios.interceptors.request.eject(interceptor);
            };
        } else {
            console.log('No token found in localStorage');
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const loginUser = async (userData) => {
        try {
            console.log('Attempting login for:', userData);
            const endpoint = userData.isGoogleUser ? 'google-auth' : 'login';
            
            const response = await axios.post(`${API_URL}/users/${endpoint}`, userData);
            console.log('Login response:', response.data);

            if (response.data.success) {
                const { user, token } = response.data;
                console.log('Setting token:', token);
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setToken(token);
                setCurrentUser(user);
                setShowLogin(false);
                setUserType(user.isAdmin ? 'admin' : 'user');
                return { success: true, user };
            }
            return { success: false, error: 'Invalid credentials' };
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            throw error.response?.data || { message: 'Invalid email or password' };
        }
    };

    const logTransaction = async (type, amount) => {
        if (!currentUser) {
            throw new Error('User must be logged in to perform a transaction');
        }
    
        try {
            console.log('Starting transaction:', { type, amount, currentUser });
            
            const userId = currentUser._id || currentUser.id;
            if (!userId) {
                throw new Error('User ID is not available');
            }

            const response = await axios.post(`${API_URL}/users/${userId}/transaction`, {
                type: type.toLowerCase(),
                amount: parseFloat(amount)
            });

            if (response.data.success) {
                const updatedUser = {
                    ...currentUser,
                    balance: response.data.newBalance,
                    transactions: [...(currentUser.transactions || []), response.data.transaction]
                };
                
                setCurrentUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                return {
                    success: true,
                    newBalance: response.data.newBalance,
                    transaction: response.data.transaction
                };
            } else {
                throw new Error(response.data.error || 'Transaction failed');
            }
        } catch (error) {
            console.error('Transaction failed:', error);
            throw {
                error: error.response?.data?.error || error.message,
                details: error.response?.data?.details || 'Transaction failed'
            };
        }
    };

    const createUser = async (userData) => {
        try {
            const endpoint = userData.isGoogleUser ? 'google-auth' : 'register';
            const response = await axios.post(`${API_URL}/users/${endpoint}`, userData);
            
            if (response.data.success) {
                const { user, token } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setToken(token);
                setCurrentUser(user);
                setShowLogin(false);
                setUserType(user.isAdmin ? 'admin' : 'user');
                return { success: true, user };
            }
            return { success: false, error: 'Failed to create account' };
        } catch (error) {
            console.error('Create user error:', error.response?.data || error);
            throw error.response?.data || { message: 'Failed to create account' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setCurrentUser(null);
        setShowLogin(true);
        setUserType('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <UserContext.Provider value={{
            users,
            currentUser,
            showLogin,
            setShowLogin,
            userType,
            setUserType,
            loginUser,
            createUser,
            logTransaction,
            logout,
            setCurrentUser
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

export default UserContext;