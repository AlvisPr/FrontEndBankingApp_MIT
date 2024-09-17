import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([
        { name: "Abdul", email: "abdul@mit.edu", password: "secret", balance: 100, transactions: [] }
    ]);
    const [currentUser, setCurrentUser] = useState(null);
    const [showLogin, setShowLogin] = useState(true);
    const [logout, setLogout] = useState(false);
    const adminCredentials = { email: "admin@system.lv", password: "admin2024" };
    const [userType, setUserType] = useState('user'); // 'user' or 'admin'

    useEffect(() => {
        setUsers(prevUsers => 
            prevUsers.map(user => ({
                ...user,
                balance: user.balance !== undefined ? user.balance : 100,
                transactions: Array.isArray(user.transactions) ? user.transactions : []
            }))
        );
    }, []);

    const logTransaction = (type, amount) => {
        if (!currentUser) {
            throw new Error('User must be logged in to perform a transaction');
        }

        const date = new Date();
        const transaction = {
            type,
            amount,
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
        };

        setCurrentUser(prevUser => {
            const newBalance = type === 'Deposit' ? prevUser.balance + amount : prevUser.balance - amount;
            const updatedUser = {
                ...prevUser,
                balance: newBalance,
                transactions: [...(prevUser.transactions || []), transaction]
            };

            // Update the user in the users array
            setUsers(prevUsers => prevUsers.map(user => 
                user.email === prevUser.email ? updatedUser : user
            ));

            return updatedUser;
        });
    };

    return (
        <UserContext.Provider value={{ users, setUsers, currentUser, setCurrentUser, showLogin, setShowLogin, logout, setLogout, adminCredentials, userType, setUserType, logTransaction }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};

export default UserContext;