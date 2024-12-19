import React, { useState, useContext } from 'react';
import Card from '../../components/Card/Card';
import UserContext from '../../context/UserContext';
import TooltipIcon from '../../components/Tooltip/Tooltip';
import ClipLoader from 'react-spinners/ClipLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bankImg from '../../assets/salary.png';
import sharedLogos from '../../Styles/sharedlogos.module.css';
import { validateField } from '../../components/Validation/Validation';

function Deposit() {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const ctx = useContext(UserContext);

    const handleChange = (e) => {
        const { value } = e.target;
        setAmount(value);
        // Clear validation error when user starts typing
        if (validationErrors.amount) {
            setValidationErrors({});
        }
    };

    const handleBlur = () => {
        const errors = validateField('amount', amount);
        setValidationErrors(errors);
        if (errors.amount) {
            toast.error(errors.amount);
        }
    };

    const handleDeposit = async () => {
        // Validate amount
        const errors = validateField('amount', amount);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            toast.error(errors.amount);
            return;
        }

        setLoading(true);
        try {
            await ctx.logTransaction('deposit', parseFloat(amount));
            setAmount('');
            setValidationErrors({});
            toast.success(`Successfully deposited $${amount}`);
        } catch (error) {
            // console.error('Deposit error:', error);
            toast.error(error.message || 'Deposit failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                                type="number"
                                className={`form-control ${validationErrors.amount ? 'is-invalid' : ''}`}
                                id="amount" 
                                placeholder="Enter amount" 
                                value={amount} 
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min="0"
                                step="0.01"
                            /><br />
                            <button 
                                type="submit" 
                                className="btn btn-light" 
                                onClick={handleDeposit} 
                                disabled={!amount || loading || Object.keys(validationErrors).length > 0}
                            >
                                {loading ? (
                                    <ClipLoader size={20} color={"#000000"} loading={loading} />
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
            <TooltipIcon
                text="Here we are displaying the deposit form. If the user is not logged in, they will be prompted to log in."
            />
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export default Deposit;