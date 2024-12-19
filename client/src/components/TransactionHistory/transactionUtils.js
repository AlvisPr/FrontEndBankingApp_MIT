import { format } from 'date-fns';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import React from 'react';

export const formatTransactionType = (type) => {
    switch (type) {
        case 'deposit':
            return 'Deposit';
        case 'withdraw':
            return 'Withdraw';
        case 'transfer-sent':
            return 'Transfer Sent';
        case 'transfer-received':
            return 'Transfer Received';
        default:
            return type.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
    }
};

export const getTransactionIcon = (type) => {
    switch (type) {
        case 'deposit':
            return <ArrowUpwardIcon sx={{ color: '#4caf50', fontSize: '1.2rem' }} />;
        case 'withdraw':
            return <ArrowDownwardIcon sx={{ color: '#f44336', fontSize: '1.2rem' }} />;
        case 'transfer-sent':
            return <SwapHorizIcon sx={{ color: '#2196f3', fontSize: '1.2rem', transform: 'rotate(90deg)' }} />;
        case 'transfer-received':
            return <SwapHorizIcon sx={{ color: '#2196f3', fontSize: '1.2rem', transform: 'rotate(-90deg)' }} />;
        default:
            return null;
    }
};

export const getTypeColor = (type) => {
    switch (type) {
        case 'deposit':
            return '#4caf50'; // Green
        case 'withdraw':
            return '#f44336'; // Red
        case 'transfer-sent':
        case 'transfer-received':
            return '#2196f3'; // Blue
        default:
            return 'inherit';
    }
};

export const getRowStyle = (type) => {
    switch (type) {
        case 'deposit':
            return { backgroundColor: 'rgba(76, 175, 80, 0.04)' };
        case 'withdraw':
            return { backgroundColor: 'rgba(244, 67, 54, 0.04)' };
        case 'transfer-sent':
        case 'transfer-received':
            return { backgroundColor: 'rgba(33, 150, 243, 0.04)' };
        default:
            return { backgroundColor: 'transparent' };
    }
};

export const formatDate = (dateString) => {
    return format(new Date(dateString), 'MM/dd/yyyy HH:mm');
};

export const getTransactionEmails = (transaction) => {
    if (transaction.type === 'deposit' || transaction.type === 'withdraw') {
        return {
            from: '-',
            to: '-'
        };
    }
    return {
        from: transaction.fromEmail || '-',
        to: transaction.toEmail || '-'
    };
};
