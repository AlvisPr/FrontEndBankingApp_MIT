import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const TransactionHistory = ({ transactions = [], currentUser, userEmail }) => {
    // If no transactions, show a message
    if (!transactions || transactions.length === 0) {
        return (
            <Box sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                    No transactions found
                </Typography>
            </Box>
        );
    }

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
        
        const isTransfer = transaction.type?.toLowerCase() === 'transfer';
        const isSender = isTransfer && transaction.from === userEmail;

        if (isTransfer) {
            if (isSender) {
                backgroundColor = '#FFE5B4'; // light orange
                iconColor = '#FF6347'; // tomato red
                amountColor = '#FF6347';
            } else {
                backgroundColor = '#E6F2E6'; // light green
                iconColor = '#2E8B57'; // sea green
                amountColor = '#2E8B57';
            }
            icon = <SwapHorizIcon sx={{ color: iconColor, marginLeft: '4px', fontSize: '1rem' }} />;
        } else if (transaction.type?.toLowerCase() === 'withdraw') {
            backgroundColor = '#FFEBEE'; // light red
            iconColor = '#D32F2F'; // dark red
            amountColor = '#D32F2F';
            icon = <ArrowUpwardIcon sx={{ color: iconColor, marginLeft: '4px', fontSize: '1rem' }} />;
        } else if (transaction.type?.toLowerCase() === 'deposit') {
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

    // Format amount with 2 decimal places, handling undefined/null cases
    const formatAmount = (amount) => {
        if (amount === undefined || amount === null) return '$0.00';
        return `$${Number(amount).toFixed(2)}`;
    };

    return (
        <TableContainer component={Paper} sx={{ 
            marginTop: '20px', 
            marginRight: "30px", 
            padding: '0px', 
            maxHeight: '400px', 
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
        }}>
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
                        const style = getTransactionStyle(transaction);
                        const isTransfer = transaction.type?.toLowerCase() === 'transfer';

                        // Format amount based on transaction type
                        let displayAmount = transaction.amount;
                        if (isTransfer && transaction.from === userEmail) {
                            displayAmount = `-${displayAmount}`;
                        } else if (transaction.type?.toLowerCase() === 'withdraw') {
                            displayAmount = `-${displayAmount}`;
                        }

                        return (
                            <TableRow key={transaction._id || index} sx={{ 
                                backgroundColor: style.backgroundColor,
                                '&:hover': {
                                    filter: 'brightness(0.95)',
                                    transition: 'all 0.2s ease-in-out'
                                }
                            }}>
                                <TableCell sx={{ 
                                    padding: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '0.875rem',
                                    color: style.iconColor
                                }}>
                                    {transaction.type}
                                    {style.icon}
                                </TableCell>
                                <TableCell sx={{ 
                                    padding: '12px', 
                                    fontSize: '0.875rem', 
                                    color: style.amountColor,
                                    fontWeight: 'bold'
                                }}>
                                    {formatAmount(displayAmount)}
                                </TableCell>
                                <TableCell sx={{ padding: '12px', fontSize: '0.875rem' }}>
                                    {formatDate(transaction.date)}
                                </TableCell>
                                <TableCell sx={{ padding: '12px', fontSize: '0.875rem' }}>
                                    {transaction.from || '-'}
                                </TableCell>
                                <TableCell sx={{ padding: '12px', fontSize: '0.875rem' }}>
                                    {transaction.to || '-'}
                                </TableCell>
                                <TableCell sx={{ padding: '12px', fontSize: '0.875rem' }}>
                                    {transaction._id || `TR-${index + 1}`}
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
            type: PropTypes.string,
            amount: PropTypes.number,
            date: PropTypes.string,
            from: PropTypes.string,
            to: PropTypes.string,
            _id: PropTypes.string
        })
    ),
    currentUser: PropTypes.shape({
        email: PropTypes.string,
        accountNumber: PropTypes.string,
        isAdmin: PropTypes.bool
    }),
    userEmail: PropTypes.string
};

export default TransactionHistory;