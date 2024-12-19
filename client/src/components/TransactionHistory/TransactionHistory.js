import React from 'react';
import PropTypes from 'prop-types';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Box,
    Typography,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getTransactionEmails, formatDate, getTransactionIcon, formatTransactionType, getTypeColor, getRowStyle } from './transactionUtils';

const TransactionHistory = ({ transactions, onClose, isMobile }) => {
    const containerStyles = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div style={{...containerStyles, background: 'none'}}>
            {isMobile && (
                <Box sx={{ 
                    bgcolor: '#208454',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500 }}>
                        Transaction History
                    </Typography>
                    {onClose && (
                        <IconButton
                            onClick={onClose}
                            sx={{ 
                                color: 'white',
                                padding: '4px'
                            }}
                            size="small"
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            )}
            <TableContainer 
                component={Paper}
                sx={{
                    ...(isMobile ? {
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        width: '100%',
                        position: 'relative',
                        zIndex: 1,
                        borderRadius: 0,
                        margin: 0,
                        padding: 0,
                        left: 0,
                        right: 0,
                        '& .MuiTableCell-root': {
                            padding: '4px 6px',
                            fontSize: '0.75rem',
                            lineHeight: '1',
                            height: '32px',
                            whiteSpace: 'normal',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }
                    } : {
                        maxHeight: '500px',
                        minWidth: '300px',
                        width: '100%',
                        position: 'relative',
                        borderRadius: '12px',
                        '& .MuiTableCell-root': {
                            padding: '8px 16px',
                            fontSize: '0.875rem',
                            lineHeight: '1.2',
                            height: '40px',
                            whiteSpace: 'nowrap'
                        }
                    }),
                    overflowY: 'auto',
                    overflowX: 'auto',
                    boxShadow: 'none',
                    backgroundColor: 'white',
                    WebkitOverflowScrolling: 'touch',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                    '& .MuiTable-root': {
                        borderRadius: 'inherit',
                        overflow: 'visible',
                        width: '100%',
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                        tableLayout: 'fixed'
                    },
                    '& .MuiTableHead-root': {
                        '& .MuiTableCell-root:first-of-type': {
                            borderTopLeftRadius: isMobile ? 0 : '12px'
                        },
                        '& .MuiTableCell-root:last-child': {
                            borderTopRightRadius: isMobile ? 0 : '12px'
                        }
                    },
                    '& .MuiTableBody-root': {
                        backgroundColor: 'white'
                    }
                }}
            >
                <Table stickyHeader size="small" sx={{ 
                    minWidth: isMobile ? '100%' : '800px',
                    height: isMobile ? '100%' : 'auto',
                    tableLayout: 'fixed',
                    '& .MuiTableCell-stickyHeader': {
                        backgroundColor: '#208454 !important',
                        color: 'white',
                        fontWeight: 500,
                        padding: isMobile ? '4px 6px' : '8px 16px',
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        height: isMobile ? '32px' : '40px',
                        borderBottom: 'none'
                    }
                }}>
                    <TableHead sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: '#208454',
                        zIndex: 2,
                        '& th': {
                            position: 'sticky',
                            top: 0,
                            backgroundColor: '#208454',
                            color: 'white',
                            fontWeight: 500,
                            padding: isMobile ? '4px 6px' : '8px 16px',
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            height: isMobile ? '32px' : '40px',
                            borderBottom: 'none'
                        }
                    }}>
                        <TableRow>
                            <TableCell width={isMobile ? "15%" : "15%"} sx={{ position: 'sticky', top: 0, zIndex: 2 }}>Type</TableCell>
                            <TableCell width={isMobile ? "15%" : "10%"} sx={{ position: 'sticky', top: 0, zIndex: 2 }}>Amount</TableCell>
                            <TableCell width={isMobile ? "15%" : "15%"} sx={{ position: 'sticky', top: 0, zIndex: 2 }}>Date</TableCell>
                            <TableCell width={isMobile ? "20%" : "20%"} sx={{ position: 'sticky', top: 0, zIndex: 2 }}>From</TableCell>
                            <TableCell width={isMobile ? "20%" : "20%"} sx={{ position: 'sticky', top: 0, zIndex: 2 }}>To</TableCell>
                            <TableCell width={isMobile ? "15%" : "20%"} sx={{ position: 'sticky', top: 0, zIndex: 2 }}>Transaction ID</TableCell>
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
                                        height: isMobile ? '32px' : '40px'
                                    }}
                                >
                                    <TableCell>
                                        <Box sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: typeColor,
                                            fontWeight: 500,
                                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                                            height: '100%'
                                        }}>
                                            {formatTransactionType(transaction.type)}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ 
                                        fontWeight: 500, 
                                        color: typeColor,
                                        fontSize: isMobile ? '0.75rem' : '0.875rem'
                                    }}>
                                        ${transaction.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell sx={{
                                        fontSize: isMobile ? '0.75rem' : '0.875rem'
                                    }}>
                                        {formatDate(transaction.date)}
                                    </TableCell>
                                    <TableCell sx={{ 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                                        ...(isMobile && {
                                            maxWidth: 0,
                                            wordBreak: 'break-word'
                                        })
                                    }}>
                                        {from}
                                    </TableCell>
                                    <TableCell sx={{ 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                                        ...(isMobile && {
                                            maxWidth: 0,
                                            wordBreak: 'break-word'
                                        })
                                    }}>
                                        {to}
                                    </TableCell>
                                    <TableCell sx={{ 
                                        color: '#666',
                                        fontSize: '0.75rem',
                                        maxWidth: '100px',
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
        </div>
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
    onClose: PropTypes.func,
    isMobile: PropTypes.bool
};

export default TransactionHistory;