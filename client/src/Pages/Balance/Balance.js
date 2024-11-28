import React, { useContext, useState } from 'react';
import Card from '../../components/Card/Card';
import UserContext from '../../context/UserContext';
import TooltipIcon from '../../components/Tooltip/Tooltip';
import bankImg from '../../assets/money-bag.png';
import sharedLogos from '../../Styles/sharedlogos.module.css';
import TransactionHistory from '../../components/TransactionHistory/TransactionHistory';
import axios from 'axios';

function Balance() {
    const ctx = useContext(UserContext);
    const [showTransactions, setShowTransactions] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const handleToggleTransactions = async () => {
        if (!showTransactions) {
            try {
                const response = await axios.get(`http://localhost:3001/api/users/${ctx.currentUser._id}/transactions`);
                console.log('Fetched transactions:', response.data); // Debugging line
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error.response?.data || error.message);
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
            {showTransactions && ctx.currentUser && (
                <TransactionHistory 
                    transactions={transactions} 
                    currentUser={ctx.currentUser}
                />
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