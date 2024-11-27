import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const TransactionHistory = ({ transactions = [] }) => {
    return (
        <TableContainer component={Paper} sx={{ marginTop: '10px', marginRight: "30px", padding: '10px' }}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#388e3c', color: 'white', width: "100%" }}>
                        <TableCell sx={{ color: 'white', padding: '6px', fontSize: '0.875rem' }}>Type</TableCell>
                        <TableCell sx={{ color: 'white', padding: '6px', fontSize: '0.875rem' }}>Amount</TableCell>
                        <TableCell sx={{ color: 'white', padding: '6px', fontSize: '0.875rem' }}>Date</TableCell>
                        <TableCell sx={{ color: 'white', padding: '6px', fontSize: '0.875rem' }}>From</TableCell>
                        <TableCell sx={{ color: 'white', padding: '6px', fontSize: '0.875rem' }}>To</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                backgroundColor: transaction.type.toLowerCase() === 'withdraw' ? '#ffcccb' : index % 2 === 0 ? '#e8f5e9' : '#c8e6c9',
                                color: '#333',
                                width: '100%'
                            }}
                        >
                            <TableCell sx={{ padding: '6px', fontSize: '0.875rem' }}>{transaction.type}</TableCell>
                            <TableCell sx={{ padding: '6px', fontSize: '0.875rem' }}>${transaction.amount}</TableCell>
                            <TableCell sx={{ padding: '6px', fontSize: '0.875rem' }}>{transaction.date}</TableCell>
                            <TableCell sx={{ padding: '6px', fontSize: '0.875rem' }}>{transaction.from}</TableCell>
                            <TableCell sx={{ padding: '6px', fontSize: '0.875rem' }}>{transaction.to}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TransactionHistory;