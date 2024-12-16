import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box
} from '@mui/material';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

function TransactionHistory({ transactions = [], currentUser }) {
    if (!transactions || transactions.length === 0) {
        return (
            <Typography variant="body1" style={{ padding: '20px', textAlign: 'center' }}>
                No transactions to display
            </Typography>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'MM/dd/yyyy HH:mm');
    };

    const getTransactionEmails = (transaction) => {
        switch (transaction.type) {
            case 'transfer-sent':
                return {
                    from: transaction.fromEmail || 'N/A',
                    to: transaction.toEmail || 'N/A'
                };
            case 'transfer-received':
                return {
                    from: transaction.fromEmail || 'N/A',
                    to: transaction.toEmail || 'N/A'
                };
            case 'deposit':
            case 'withdraw':
                return {
                    from: '-',
                    to: '-'
                };
            default:
                return {
                    from: 'N/A',
                    to: 'N/A'
                };
        }
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'deposit':
                return <ArrowDownwardIcon sx={{ color: '#2e7d32', fontSize: '1rem' }} />;
            case 'withdraw':
                return <ArrowUpwardIcon sx={{ color: '#d32f2f', fontSize: '1rem' }} />;
            case 'transfer-sent':
                return <SwapHorizIcon sx={{ color: '#1976d2', fontSize: '1rem', transform: 'rotate(90deg)' }} />;
            case 'transfer-received':
                return <SwapHorizIcon sx={{ color: '#1976d2', fontSize: '1rem', transform: 'rotate(-90deg)' }} />;
            default:
                return null;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'deposit':
                return '#2e7d32';
            case 'withdraw':
                return '#d32f2f';
            case 'transfer-sent':
            case 'transfer-received':
                return '#1976d2';
            default:
                return 'inherit';
        }
    };

    const getRowStyle = (type) => {
        switch (type) {
            case 'deposit':
                return { backgroundColor: 'rgba(46, 125, 50, 0.1)' }; // Light green
            case 'withdraw':
                return { backgroundColor: 'rgba(211, 47, 47, 0.1)' }; // Light red
            case 'transfer-sent':
            case 'transfer-received':
                return { backgroundColor: 'rgba(25, 118, 210, 0.1)' }; // Light blue
            default:
                return {};
        }
    };

    const formatTransactionType = (type) => {
        return type.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <TableContainer
            component={Paper}
            sx={{
                maxHeight: '60vh',
                overflowY: 'auto',
                overflowX: 'auto',
                marginRight: '30px',
                marginTop: '20px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                '& .MuiTableCell-root': {
                    padding: '12px 16px',
                    whiteSpace: 'nowrap',
                    fontSize: '0.875rem'
                },
                '& .MuiPaper-root': {
                    borderRadius: '16px',
                },
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                '&::-webkit-scrollbar': {
                    display: 'none'
                }
            }}
        >
            <Table stickyHeader size="small" aria-label="transaction history table">
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#208454 !important',
                                color: 'white',
                                '&:first-of-type': {
                                    borderTopLeftRadius: '16px',
                                }
                            }}
                        >
                            Type
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#208454 !important',
                                color: 'white'
                            }}
                        >
                            Amount
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#208454 !important',
                                color: 'white'
                            }}
                        >
                            Date
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#208454 !important',
                                color: 'white'
                            }}
                        >
                            From
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#208454 !important',
                                color: 'white'
                            }}
                        >
                            To
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#208454 !important',
                                color: 'white',
                                '&:last-child': {
                                    borderTopRightRadius: '16px',
                                }
                            }}
                        >
                            Transaction ID
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction, index) => {
                        const { from, to } = getTransactionEmails(transaction);
                        const typeColor = getTypeColor(transaction.type);
                        return (
                            <TableRow
                                key={index}
                                sx={{
                                    ...getRowStyle(transaction.type),
                                    '&:hover': {
                                        filter: 'brightness(0.95)',
                                        transition: 'all 0.3s ease-in-out'
                                    },
                                    '&:last-child td, &:last-child th': { border: 0 }
                                }}
                            >
                                <TableCell>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1,
                                        color: typeColor,
                                        fontWeight: 500
                                    }}>
                                        {formatTransactionType(transaction.type)}
                                        {getTransactionIcon(transaction.type)}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500, color: typeColor }}>
                                    ${transaction.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    {formatDate(transaction.date)}
                                </TableCell>
                                <TableCell sx={{ 
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {from}
                                </TableCell>
                                <TableCell sx={{ 
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {to}
                                </TableCell>
                                <TableCell sx={{
                                    color: '#666',
                                    fontSize: '0.8rem',
                                    maxWidth: '150px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {transaction._id}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

TransactionHistory.propTypes = {
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
            amount: PropTypes.number,
            date: PropTypes.string,
            fromEmail: PropTypes.string,
            toEmail: PropTypes.string,
            _id: PropTypes.string
        })
    ),
    currentUser: PropTypes.object
};

export default TransactionHistory;