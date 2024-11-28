import React, { useState, useContext } from 'react';
import Card from '../../components/Card/Card';
import UserContext from '../../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import styles from '../../Styles/formStyles.module.css';

function Transfer() {
    const [amount, setAmount] = useState('');
    const [toAccountNumber, setToAccountNumber] = useState('');
    const { currentUser, setCurrentUser } = useContext(UserContext);

    const handleTransfer = async () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast.error('Amount must be a positive number');
            return;
        }
        if (!toAccountNumber) {
            toast.error('Recipient account number is required');
            return;
        }
        try {
            console.log('Initiating transfer:', {
                fromEmail: currentUser.email,
                toAccountNumber,
                amount: numericAmount
            });

            const response = await axios.post('http://localhost:3001/api/users/transfer', {
                fromEmail: currentUser.email,
                toAccountNumber,
                amount: numericAmount
            });

            console.log('Transfer successful:', response.data);
            toast.success(response.data.message);
            setCurrentUser(prev => ({ ...prev, balance: prev.balance - numericAmount }));
            setAmount('');
            setToAccountNumber('');
        } catch (error) {
            console.error('Transfer failed:', error.response?.data || error.message);
            toast.error(error.response?.data?.error || 'Transfer failed');
        }
    };

    return (
        <Card
            bgcolor="success"
            header="Transfer"
            balance={currentUser ? ` Balance |  $${currentUser.balance}` : ''}
            body={
                currentUser ? (
                    <div className={styles.formContainer}>
                        <input 
                            type="text" 
                            value={toAccountNumber} 
                            onChange={e => setToAccountNumber(e.target.value)} 
                            placeholder="Recipient Account Number" 
                            className="form-control mb-3"
                        />
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            placeholder="Amount" 
                            className="form-control mb-3"
                        />
                        <button 
                            onClick={handleTransfer} 
                            className="btn btn-light"
                            disabled={!amount || !toAccountNumber}
                            style={{ width: '100%' }}
                        >
                            Transfer
                        </button>
                    </div>
                ) : (
                    <h3>Please log in to transfer money</h3>
                )
            }
        />
    );
}

export default Transfer; 
