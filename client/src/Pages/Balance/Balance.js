import React, { useContext, useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import UserContext from '../../context/UserContext';
import TooltipIcon from '../../components/Tooltip/Tooltip';
import bankImg from '../../assets/money-bag.png';
import sharedLogos from '../../Styles/sharedlogos.module.css';
import TransactionHistory from '../../components/TransactionHistory/TransactionHistory';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../../config';
import { useMediaQuery, Dialog, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Balance() {
    const [show] = useState(true);
    const [showTransactions, setShowTransactions] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const ctx = useContext(UserContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleToggleTransactions = async () => {
        if (!showTransactions && ctx.currentUser) {
            try {
                const userId = ctx.currentUser._id || ctx.currentUser.id;
                if (!userId) {
                    throw new Error('User ID is not available');
                }
                
                // console.log('Fetching transactions for user:', ctx.currentUser);
                const response = await axios.get(`${API_URL}/users/${userId}/transactions`);
                // console.log('Fetched transactions:', response.data); 
                setTransactions(response.data);
            } catch (error) {
                // console.error('Error fetching transactions:', error.response?.data || error.message);
                toast.error('Failed to load transaction history');
            }
        }
        setShowTransactions(!showTransactions);
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            justifyContent: 'space-between', 
            position: 'relative',
            minHeight: '100%'
        }}>
            <div style={{ 
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: 2,
                maxWidth: isMobile ? '100%' : '400px'
            }}>
                <Card
                    bgcolor="primary"
                    header={ctx.currentUser ? null : "Balance"}
                    body={
                        ctx.currentUser ? (
                            <>
                                <h1 style={{
                                    display: "flex", 
                                    justifyContent: "center", 
                                    fontSize: isMobile ? "2rem" : "2.5rem",
                                    margin: isMobile ? "10px 0" : "20px 0"
                                }}> 
                                    ${ctx.currentUser.balance}
                                </h1>
                                <div className={sharedLogos.centeredImage}>
                                    <img 
                                        src={bankImg} 
                                        alt='balance-img'  
                                        style={{
                                            height: isMobile ? "120px" : "180px",
                                            margin: isMobile ? "10px 0" : "20px 0"
                                        }}
                                    />
                                </div>
                                <button 
                                    onClick={handleToggleTransactions} 
                                    style={{ 
                                        marginTop: '10px', 
                                        borderRadius: "15px", 
                                        padding: "10px 20px", 
                                        backgroundColor: "#388e3c", 
                                        color: "white", 
                                        cursor: "pointer",
                                        transition: "background-color 0.3s ease",
                                        border: "1px solid #388e3c",
                                        width: '100%'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = "#2e7d32"}
                                    onMouseOut={(e) => e.target.style.backgroundColor = "#388e3c"}
                                >
                                    {showTransactions ? 'Hide Transaction History' : 'Show Transaction History'}
                                </button>
                            </>
                        ) : (
                            <h3>Please log in to view your balance</h3>
                        )
                    }
                />
            </div>
            {showTransactions && ctx.currentUser && transactions.length > 0 && (
                <Dialog
                    open={showTransactions}
                    onClose={() => setShowTransactions(false)}
                    fullScreen={isMobile}
                    maxWidth={false}
                    disableEscapeKeyDown
                    onBackdropClick={() => {}}
                    PaperProps={{
                        style: isMobile ? {
                            width: '100%',
                            height: '100%',
                            margin: 0,
                            padding: 0,
                            overflow: 'hidden',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1300,
                            background: 'none',
                            boxShadow: 'none'
                        } : {
                            width: 'calc(100% - 480px)', 
                            maxWidth: '1200px',
                            marginTop: '110px',
                            marginLeft: '480px',
                            padding: 0,
                            overflow: 'hidden',
                            background: 'none',
                            boxShadow: 'none'
                        }
                    }}
                    sx={{
                        '& .MuiDialog-container': {
                            alignItems: isMobile ? 'stretch' : 'flex-start'
                        },
                        '& .MuiBackdrop-root': {
                            display: 'none'
                        },
                        '& .MuiPaper-root': {
                            background: 'none',
                            boxShadow: 'none',
                            margin: isMobile ? 0 : undefined
                        },
                        '@media (max-width: 960px)': {
                            '& .MuiDialog-paper': {
                                width: '100%',
                                height: '100%',
                                margin: 0,
                                maxHeight: 'none'
                            }
                        }
                    }}
                >
                    <TransactionHistory 
                        transactions={transactions} 
                        currentUser={ctx.currentUser}
                        isMobile={isMobile}
                        onClose={() => setShowTransactions(false)}
                    />
                </Dialog>
            )}
        </div>
    );
}

export default Balance;