import React, { useState, useContext } from 'react';
import Card from '../../components/Card/Card';
import UserContext from '../../context/UserContext';
import TooltipIcon from '../../components/Tooltip/Tooltip';
import ClipLoader from 'react-spinners/ClipLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bankImg from '../../assets/salary.png';
import sharedLogos from '../../Styles/sharedlogos.module.css';

function Deposit() {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const ctx = useContext(UserContext);

    async function handleDeposit() {
        if (isNaN(amount) || amount <= 0) {
            toast.error('Error: Invalid amount');
            return;
        }
        if (amount.length > 6) {
            toast.error('Error: Amount exceeds 6 digits');
            return;
        }

        setLoading(true);
        try {
            await ctx.logTransaction('deposit', parseFloat(amount));
            setAmount('');
            toast.success(`Success: Deposited $${amount}`);
        } catch (error) {
            console.error('Deposit error:', error);
            toast.error(`Error: ${error.error || 'Transaction failed'}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Card
                bgcolor="success"
                header="Deposit"
                balance={ctx.currentUser ? ` Balance |  $${ctx.currentUser.balance}` : ''}
                body={
                    ctx.currentUser ? (
                        <>
                            <input 
                                type="input" 
                                className="form-control" 
                                id="amount" 
                                placeholder="Enter amount" 
                                value={amount} 
                                onChange={e => setAmount(e.currentTarget.value)} 
                            /><br />
                            <button 
                                type="submit" 
                                className="btn btn-light" 
                                onClick={handleDeposit} 
                                disabled={!amount || loading}
                            >
                                {loading ? (
                                    <ClipLoader color="#000000" size={20} />
                                ) : (
                                    'Deposit'
                                )}
                            </button>
                            <br />
                            <br />
                            <div className={sharedLogos.centeredImage}>
                                <img src={bankImg} alt="deposit-img" className="img-fluid mb-3" style={{height:"180px"}}/>
                            </div>
                        </>
                    ) : (
                        <p>Please log in to make deposits</p>
                    )
                }
            />
            <ToastContainer />
        </>
    );
}

export default Deposit;