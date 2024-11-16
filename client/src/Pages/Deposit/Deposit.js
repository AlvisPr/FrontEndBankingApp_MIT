import React, { useState, useContext } from 'react';
import Card from '../../components/Card/Card';
import UserContext from '../../context/UserContext';
import TooltipIcon from '../../components/Tooltip/Tooltip';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from "../../Styles/spinner.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bankImg from '../../assets/salary.png';
import sharedLogos from '../../Styles/sharedlogos.module.css';

function Deposit() {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const ctx = useContext(UserContext);

    function handleDeposit() {
        if (isNaN(amount) || amount <= 0) {
            toast.error('Error: Invalid amount');
            return;
        }
        if (amount.length > 6) {
            toast.error('Error: Amount exceeds 6 digits');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            ctx.logTransaction('Deposit', parseFloat(amount));
            setAmount('');
            setLoading(false);
            toast.success(`Success: Deposited $${amount}`);
        }, 700);
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
                             
                            <input type="input" className="form-control" id="amount" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.currentTarget.value)} /><br />
                            <button type="submit" className="btn btn-light" onClick={handleDeposit} disabled={!amount}>Deposit</button>
                            <br />
                            <br />
                            <div className={sharedLogos.centeredImage}>
                                <img src={bankImg} alt="deposit-img" className="img-fluid mb-3" style={{height:"180px"}}/>
                            </div>

                        </>
                    ) : (
                        <h3>Please log in to deposit money</h3>
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
                Here we are displaying the deposit form. 
                If the user is not logged in, they will be prompted to log in.
            `}
            />
            <ToastContainer style={{ top: '80px' }}/>
        </>
    );
}

export default Deposit;