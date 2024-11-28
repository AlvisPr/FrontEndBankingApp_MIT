import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const TransactionHistory = ({ transactions = [], currentUser }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Function to determine transaction status and color
    const getTransactionStyle = (transaction) => {
        let backgroundColor, iconColor, amountColor, icon;
        
        // Check if this is a transfer and determine if user is sender or receiver
        const isTransfer = transaction.type.toLowerCase() === 'transfer';
        const isSender = isTransfer && transaction.from === currentUser.email;
        const isReceiver = isTransfer && transaction.to === currentUser.accountNumber;

        if (isTransfer) {
            if (isSender) {
                // Outgoing transfer
                backgroundColor = '#FFE5B4'; // light orange
                iconColor = '#FF6347'; // tomato red
                amountColor = '#FF6347';
            } else if (isReceiver) {
                // Incoming transfer
                backgroundColor = '#E6F2E6'; // light green
                iconColor = '#2E8B57'; // sea green
                amountColor = '#2E8B57';
            } else {
                // Default for transfers not involving the current user
                backgroundColor = '#F5F5F5';
                iconColor = '#757575';
                amountColor = '#000';
            }
            icon = <SwapHorizIcon sx={{ color: iconColor, marginLeft: '4px', fontSize: '1rem' }} />;
        } else if (transaction.type.toLowerCase() === 'withdraw') {
            backgroundColor = '#FFEBEE'; // light red
            iconColor = '#D32F2F'; // dark red
            amountColor = '#D32F2F';
            icon = <ArrowUpwardIcon sx={{ color: iconColor, marginLeft: '4px', fontSize: '1rem' }} />;
        } else if (transaction.type.toLowerCase() === 'deposit') {
            backgroundColor = '#C8E6C9'; // light green
            iconColor = '#388E3C'; // dark green
            amountColor = '#388E3C';
            icon = <ArrowDownwardIcon sx={{ color: iconColor, marginLeft: '4px', fontSize: '1rem' }} />;
        } else {
            backgroundColor = '#F5F5F5';
            iconColor = '#757575';
            amountColor = '#000';
            icon = null;
        }

        return { backgroundColor, iconColor, amountColor, icon };
    };

    return (
        <TableContainer component={Paper} sx={{ 
            marginTop: '30px', 
            marginRight: "30px", 
            padding: '0px', 
            height: '60vh', 
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
        }}>
            {!currentUser.isAdmin && (
                <Box sx={{ 
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderBottom: '1px solid #e9ecef'
                }}>
                    <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: '#2c3e50',
                        marginBottom: '4px'
                    }}>
                        Transaction History
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                        View and track all your financial activities
                    </Typography>
                </Box>
            )}
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow sx={{ 
                        backgroundColor: '#388E3C',
                        '& th': {
                            backgroundColor: '#388E3C',
                            borderBottom: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: 'white',
                            padding: '16px 12px',
                            whiteSpace: 'nowrap'
                        }
                    }}>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Transaction ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction, index) => {
                        const { 
                            backgroundColor, 
                            iconColor, 
                            amountColor, 
                            icon 
                        } = getTransactionStyle(transaction);

                        // Determine if current user is sender or receiver for transfers
                        const isTransfer = transaction.type.toLowerCase() === 'transfer';
                        const isSender = isTransfer && transaction.from === currentUser.email;
                        const isReceiver = isTransfer && transaction.to === currentUser.accountNumber;

                        // Format amount based on transaction type and user role
                        let displayAmount = transaction.amount;
                        if (isTransfer) {
                            displayAmount = isSender ? `-${displayAmount}` : `+${displayAmount}`;
                        } else if (transaction.type.toLowerCase() === 'withdraw') {
                            displayAmount = `-${displayAmount}`;
                        } else if (transaction.type.toLowerCase() === 'deposit') {
                            displayAmount = `+${displayAmount}`;
                        }

                        return (
                            <TableRow
                                key={`transaction-${transaction._id || index}`}
                                sx={{
                                    backgroundColor: backgroundColor,
                                    '&:hover': {
                                        filter: 'brightness(0.95)',
                                        transition: 'all 0.2s ease-in-out'
                                    }
                                }}
                            >
                                <TableCell sx={{ 
                                    padding: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '0.875rem',
                                    color: iconColor
                                }}>
                                    {transaction.type}
                                    {icon}
                                </TableCell>
                                <TableCell sx={{ 
                                    padding: '12px', 
                                    fontSize: '0.875rem', 
                                    color: amountColor,
                                    fontWeight: 'bold'
                                }}>
                                    {displayAmount}$
                                </TableCell>
                                <TableCell sx={{ padding: '12px', fontSize: '0.875rem' }}>
                                    {formatDate(transaction.date)}
                                </TableCell>
                                <TableCell sx={{ padding: '12px', fontSize: '0.875rem' }}>
                                    {transaction.from}
                                </TableCell>
                                <TableCell sx={{ padding: '12px', fontSize: '0.875rem' }}>
                                    {transaction.to}
                                </TableCell>
                                <TableCell sx={{ padding: '12px', fontSize: '0.875rem' }}>
                                    {transaction._id}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

TransactionHistory.propTypes = {
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            date: PropTypes.string.isRequired,
            from: PropTypes.string,
            to: PropTypes.string,
            _id: PropTypes.string.isRequired
        })
    ),
    currentUser: PropTypes.shape({
        email: PropTypes.string.isRequired,
        accountNumber: PropTypes.string.isRequired,
        isAdmin: PropTypes.bool.isRequired
    }).isRequired
};

export default TransactionHistory;