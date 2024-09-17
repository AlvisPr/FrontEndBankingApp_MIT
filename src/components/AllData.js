import React, { useContext, useState } from 'react';
import UserContext from '../context/UserContext';
import TooltipIcon from './Tooltip';
import TransactionHistory from './TransactionHistory';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

function AllData() {
    const ctx = useContext(UserContext);
    const [open, setOpen] = useState({});

    const handleToggle = (index) => {
        setOpen(prevOpen => ({ ...prevOpen, [index]: !prevOpen[index] }));
    };

 

    return (
        <div style={{ width: '100%', padding: '20px' }}>
            <Typography variant="h4" gutterBottom style={{ color: 'white', backgroundColor: "yellow", color: "black", fontSize: "18px", padding: "5px" }}>
                USER DATABASE
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#343a40', color: 'white' }}>
                            <TableCell style={{ color: 'white' }}>ID</TableCell>
                            <TableCell style={{ color: 'white' }}>Name</TableCell>
                            <TableCell style={{ color: 'white' }}>Email</TableCell>
                            <TableCell style={{ color: 'white' }}>Password</TableCell>
                            <TableCell style={{ color: 'white' }}>Balance</TableCell>
                            <TableCell style={{ color: 'white' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ctx.users.map((user, index) => (
                            <React.Fragment key={index}>
                                <TableRow style={{ backgroundColor: index % 2 === 0 ? '#e9ecef' : '#dee2e6', color: '#333' }}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.password}</TableCell>
                                    <TableCell>${user.balance}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleToggle(index)}>
                                            {open[index] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={open[index]} timeout="auto" unmountOnExit>
                                            <TransactionHistory transactions={user.transactions} />
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TooltipIcon 
                text={`
                    Here we are mimicking users database. Once we add a new user to the database, 
                    it appears here together with all the credentials. 
                `}
            />
        </div>
    );
}

export default AllData;