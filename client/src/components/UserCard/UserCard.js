import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';
import styles from './UserCard.module.css';

function UserCard({ user }) {
    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format transaction count
    const getTransactionCount = (transactions) => {
        if (!transactions) return 0;
        return Array.isArray(transactions) ? transactions.length : 0;
    };

    // Safely get user name
    const getUserName = (user) => {
        if (!user) return 'User';
        return user.name || user.displayName || 'User';
    };

    // Safely get user email
    const getUserEmail = (user) => {
        return user?.email || 'No email provided';
    };

    // Safely get account number
    const getAccountNumber = (user) => {
        return user?.accountNumber || 'Not assigned';
    };

    // Safely get balance
    const getBalance = (user) => {
        const balance = user?.balance;
        if (typeof balance === 'number') {
            return balance.toFixed(2);
        }
        return '0.00';
    };

    return (
        <div className={styles.cardContainer}>
            <BootstrapCard className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>User Profile</h2>
                    <div className={styles.balance}>
                        Balance: ${getBalance(user)}
                    </div>
                </div>
                <BootstrapCard.Body className={styles.cardBody}>
                    <div className={styles.avatarSection}>
                        {user?.photoURL ? (
                            <img 
                                src={user.photoURL} 
                                alt={getUserName(user)} 
                                className={styles.avatar}
                            />
                        ) : (
                            <div className={styles.avatarInitials}>
                                {getInitials(getUserName(user))}
                            </div>
                        )}
                    </div>
                    
                    <div className={styles.userInfo}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Name:</span>
                            <span className={styles.value}>{getUserName(user)}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Email:</span>
                            <span className={styles.value}>{getUserEmail(user)}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Account:</span>
                            <span className={styles.value}>{getAccountNumber(user)}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Member Since:</span>
                            <span className={styles.value}>
                                {formatDate(user?.createdAt)}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Transactions:</span>
                            <span className={styles.value}>{getTransactionCount(user?.transactions)}</span>
                        </div>
                    </div>
                </BootstrapCard.Body>
            </BootstrapCard>
        </div>
    );
}

export default UserCard;
