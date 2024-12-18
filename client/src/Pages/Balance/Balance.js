import React, { useContext, useState } from 'react';
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

function Balance() {
    const ctx = useContext(UserContext);
    const [showTransactions, setShowTransactions] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const handleToggleTransactions = async () => {
        if (!showTransactions && ctx.currentUser) {
            try {
                const userId = ctx.currentUser._id || ctx.currentUser.id;
                if (!userId) {
                    throw new Error('User ID is not available');
                }
                
                console.log('Fetching transactions for user:', ctx.currentUser);
                const response = await axios.get(`${API_URL}/users/${userId}/transactions`);
                console.log('Fetched transactions:', response.data); 
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error.response?.data || error.message);
                toast.error('Failed to load transaction history');
            }
        }
        setShowTransactions(!showTransactions);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Card
                bgcolor="primary"
                header={ctx.currentUser ? null : "Balance"}
                body={
                    ctx.currentUser ? (
                        <>
                            <h1 style={{display: "flex" , justifyContent: "center"}}> ${ctx.currentUser.balance}</h1>
                            <div className={sharedLogos.centeredImage}>
                                <img src={bankImg} alt='balance-img'  style={{height:"180px"}}/>
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
                                    border: "1px solid #388e3c"
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
            {showTransactions && ctx.currentUser && transactions.length > 0 && (
                <div style={{ marginTop: '20px', width: '100%' }}>
                    <TransactionHistory 
                        transactions={transactions} 
                        currentUser={ctx.currentUser}
                    />
                </div>
            )}
            <TooltipIcon 
                text={`
                    Here we are displaying the current user's balance. 
                    If the user is not logged in, they will be prompted to log in.
                `}
            />
        </div>
    );
}

export default Balance;