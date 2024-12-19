import React from 'react';
import styles from './UserCard.module.css';
import { Card as BootstrapCard } from 'react-bootstrap';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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

    // Get member since date
    const getMemberSince = (user) => {
        // console.log('User data for member since:', {
        //     metadata: user?.metadata,
        //     createdAt: user?.createdAt,
        //     user: user
        // });
        // Firebase auth stores the creation time in metadata
        const creationTime = user?.metadata?.creationTime;
        if (creationTime) {
            return formatDate(creationTime);
        }
        // Fallback to createdAt if available
        if (user?.createdAt) {
            return formatDate(user.createdAt);
        }
        return formatDate(new Date().toISOString()); // Use current date as fallback
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
                    <h2>Account Details</h2>
                </div>
                <BootstrapCard.Body className={styles.cardBody}>
                    <div className={styles.avatarSection}>
                        {user?.photoURL ? (
                            <img 
                                src={user.photoURL} 
                                alt="User avatar" 
                                className={styles.avatar}
                            />
                        ) : (
                            <AccountCircleIcon 
                                className={styles.avatar}
                                sx={{ 
                                    fontSize: 150,
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '50%',
                                    border: '3px solid rgba(255, 255, 255, 0.3)',
                                    padding: '8px'
                                }} 
                            />
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
                            <span className={styles.value}>{getMemberSince(user)}</span>
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
