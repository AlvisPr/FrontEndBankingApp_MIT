import React from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Typography 
} from '@mui/material';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

function TransactionHistory({ transactions = [], currentUser, userEmail }) {
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

    const getDisplayValue = (transaction, field) => {
        if (transaction.type === 'withdraw' || 
            (transaction.type === 'deposit' && (!transaction.from && !transaction.to))) {
            return '-';
        }
        return transaction[field] || 'N/A';
    };

    const getRowStyle = (type) => {
        switch (type) {
            case 'deposit':
                return { backgroundColor: 'rgba(46, 125, 50, 0.1)' }; // Light green
            case 'withdraw':
                return { backgroundColor: 'rgba(211, 47, 47, 0.1)' }; // Light red
            case 'transfer':
                return { backgroundColor: 'rgba(25, 118, 210, 0.1)' }; // Light blue
            default:
                return {};
        }
    };

    return (
        <TableContainer 
            component={Paper} 
            sx={{ 
                maxHeight: '60vh',
                overflow: 'auto',
                marginRight: '30px',
                marginTop: '20px',
                '& .MuiTableCell-root': {
                    padding: '8px 16px',
                    whiteSpace: 'nowrap',
                    fontSize: '0.875rem'
                }
            }}
        >
            <Table stickyHeader size="small" aria-label="transaction history table">
                <TableHead>
                    <TableRow>
                        <TableCell 
                            sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#2e7d32 !important',
                                color: 'white'
                            }}
                        >
                            Type
                        </TableCell>
                        <TableCell 
                            sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#2e7d32 !important',
                                color: 'white'
                            }}
                        >
                            Amount
                        </TableCell>
                        <TableCell 
                            sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#2e7d32 !important',
                                color: 'white'
                            }}
                        >
                            Date
                        </TableCell>
                        <TableCell 
                            sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#2e7d32 !important',
                                color: 'white'
                            }}
                        >
                            From
                        </TableCell>
                        <TableCell 
                            sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#2e7d32 !important',
                                color: 'white'
                            }}
                        >
                            To
                        </TableCell>
                        <TableCell 
                            sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#2e7d32 !important',
                                color: 'white'
                            }}
                        >
                            Transaction ID
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction, index) => (
                        <TableRow 
                            key={transaction._id || index}
                            sx={{
                                ...getRowStyle(transaction.type),
                                '&:hover': { 
                                    filter: 'brightness(0.95)',
                                    transition: 'all 0.2s ease-in-out'
                                }
                            }}
                        >
                            <TableCell 
                                sx={{ 
                                    color: transaction.type === 'deposit' ? '#2e7d32' : 
                                           transaction.type === 'withdraw' ? '#d32f2f' : '#1976d2',
                                    fontWeight: '500'
                                }}
                            >
                                {transaction.type?.charAt(0).toUpperCase() + transaction.type?.slice(1) || 'N/A'}
                                {transaction.type === 'deposit' && <ArrowDownwardIcon sx={{ color: '#2e7d32', marginLeft: '4px', fontSize: '1rem' }} />}
                                {transaction.type === 'withdraw' && <ArrowUpwardIcon sx={{ color: '#d32f2f', marginLeft: '4px', fontSize: '1rem' }} />}
                                {transaction.type === 'transfer' && <SwapHorizIcon sx={{ color: '#1976d2', marginLeft: '4px', fontSize: '1rem' }} />}
                            </TableCell>
                            <TableCell>
                                {transaction.amount ? `$${Number(transaction.amount).toFixed(2)}` : '$0.00'}
                            </TableCell>
                            <TableCell>
                                {transaction.date ? formatDate(transaction.date) : 'N/A'}
                            </TableCell>
                            <TableCell sx={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {getDisplayValue(transaction, 'from')}
                            </TableCell>
                            <TableCell sx={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {getDisplayValue(transaction, 'to')}
                            </TableCell>
                            <TableCell sx={{ 
                                maxWidth: '100px', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                color: '#666'
                            }}>
                                {transaction._id || 'N/A'}
                            </TableCell>
                        </TableRow>
                    ))}
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