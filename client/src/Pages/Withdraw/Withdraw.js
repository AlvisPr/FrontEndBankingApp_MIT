import React, { useState, useContext } from 'react';
import Card from '../../components/Card/Card';
import UserContext from '../../context/UserContext';
import TooltipIcon from '../../components/Tooltip/Tooltip';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from "../../Styles/spinner.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bankImg from '../../assets/atm.png';
import sharedLogos from '../../Styles/sharedlogos.module.css';

function Withdraw() {
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const ctx = useContext(UserContext);

    function handleWithdraw() {
        if (isNaN(amount) || amount <= 0) {
            toast.error('Error: Invalid amount');
            return;
        }
        if (amount > ctx.currentUser.balance) {
            toast.error('Error: Insufficient funds');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            ctx.logTransaction('Withdraw', parseFloat(amount));
            setStatus('');
            setAmount('');
            setLoading(false);
            toast.success(`Success: Withdrew $${amount}`);
        }, 700);
    }

    return (
        <>
            <Card
                bgcolor="danger"
                header="Withdraw"
                balance={ctx.currentUser ? ` Balance |  $${ctx.currentUser.balance}` : ''}
                status={status}
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
                                onClick={handleWithdraw} 
                                disabled={!amount}
                            >
                                Withdraw
                            </button>
                            <br />
                            <br />
                            <div className={sharedLogos.centeredImage}>
                                <img src={bankImg} alt="withdraw-img" className="img-fluid mb-3" style={{height:"180px"}}/>
                            </div>
                        </>
                    ) : (
                        <h3>Please log in to withdraw money</h3>
                    )
                }
            />
            {loading && (
                <div className={styles.spinner}>
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                </div>
            )}
            <TooltipIcon
                text={`
                Here we are displaying the withdraw form. 
                If the user is not logged in, they will be prompted to log in.
            `}
            />
            <ToastContainer style={{ top: '20px' }}/>
        </>
    );
}

export default Withdraw;