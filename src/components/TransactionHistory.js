import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const TransactionHistory = ({ transactions }) => {
    console.log(transactions);
    return (
        <TableContainer component={Paper} style={{ marginTop: '10px', padding: '10px' }}>
            <Table size="small">
                <TableHead>
                    <TableRow style={{ backgroundColor: '#388e3c', color: 'white' }}>
                        <TableCell style={{ color: 'white', padding: '6px', fontSize: '0.875rem' }}>Type</TableCell>
                        <TableCell style={{ color: 'white', padding: '6px', fontSize: '0.875rem' }}>Amount</TableCell>
                        <TableCell style={{ color: 'white', padding: '6px', fontSize: '0.875rem' }}>Date</TableCell>
                        <TableCell style={{ color: 'white', padding: '6px', fontSize: '0.875rem' }}>Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction, index) => (
                        <TableRow
                            key={index}
                            style={{
                                backgroundColor: transaction.type === 'Withdraw' ? '#ffcccb' : index % 2 === 0 ? '#e8f5e9' : '#c8e6c9',
                                color: '#333'
                            }}
                        >
                            <TableCell style={{ padding: '6px', fontSize: '0.875rem' }}>{transaction.type}</TableCell>
                            <TableCell style={{ padding: '6px', fontSize: '0.875rem' }}>${transaction.amount}</TableCell>
                            <TableCell style={{ padding: '6px', fontSize: '0.875rem' }}>{transaction.date}</TableCell>
                            <TableCell style={{ padding: '6px', fontSize: '0.875rem' }}>{transaction.time}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TransactionHistory;