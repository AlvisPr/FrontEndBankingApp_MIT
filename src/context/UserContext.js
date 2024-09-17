import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([
        { name: "Abdul", email: "abdul@mit.edu", password: "secret", balance: 100, transactions: [] }
    ]);
    const [showLogin, setShowLogin] = useState(true);
    const [logout, setLogout] = useState(false);
    const adminCredentials = { email: "admin@system.lv", password: "admin2024" };
    const [userType, setUserType] = useState('user'); // 'user' or 'admin'

    const logTransaction = (type, amount) => {
        if (!currentUser) {
            throw new Error('User must be logged in to send an email');
        }

        const date = new Date();
        const transaction = {
            type,
            amount,
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
        };

        setCurrentUser(prevUser => {
            if (!prevUser.transactions) {
                prevUser.transactions = [];
            }
            return {
                ...prevUser,
                transactions: [...prevUser.transactions, transaction]
            };
        });

        // Update the user in the users array
        setUsers(prevUsers => prevUsers.map(user => 
            user.email === currentUser.email ? { ...user, transactions: [...user.transactions, transaction] } : user
        ));
    };

    return (
        <UserContext.Provider value={{ 
            currentUser, 
            setCurrentUser, 
            users, 
            setUsers, 
            showLogin, 
            setShowLogin, 
            logout, 
            setLogout, 
            adminCredentials, 
            userType, 
            setUserType,
            logTransaction
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserContext;