import React, { useState, useContext } from 'react';
import Card from '../../components/Card/Card';
import UserContext from '../../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import styles from '../../Styles/formStyles.module.css';
import { validateField } from '../../components/Validation/Validation';
import ClipLoader from 'react-spinners/ClipLoader';
import spinnerStyles from "../../Styles/spinner.module.css";
import TooltipIcon from '../../components/Tooltip/Tooltip';

function Transfer() {
    const [amount, setAmount] = useState('');
    const [toAccountNumber, setToAccountNumber] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { currentUser, setCurrentUser } = useContext(UserContext);

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'accountNumber') setToAccountNumber(value);
        if (id === 'amount') setAmount(value);

        // Clear validation error when user starts typing
        if (validationErrors[id]) {
            setValidationErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value);
        setValidationErrors(prev => ({ ...prev, ...errors }));
        if (errors[id]) {
            toast.error(errors[id]);
        }
    };

    const handleTransfer = async () => {
        // Validate all fields before submission
        const accountErrors = validateField('accountNumber', toAccountNumber);
        const amountErrors = validateField('amount', amount);
        const errors = { ...accountErrors, ...amountErrors };
        const API_URL = process.env.NODE_ENV === 'development'
            ? process.env.REACT_APP_DEVELOP
            : process.env.REACT_APP_DEPLOY;

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            Object.values(errors).forEach(error => toast.error(error));
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post( API_URL , {
                fromEmail: currentUser.email,
                toAccountNumber,
                amount: parseFloat(amount)
            });

            toast.success(response.data.message);
            setCurrentUser(prev => ({ ...prev, balance: prev.balance - parseFloat(amount) }));
            setAmount('');
            setToAccountNumber('');
            setValidationErrors({});
        } catch (error) {
            toast.error(error.response?.data?.error || 'Transfer failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card
                bgcolor="success"
                header="Transfer"
                balance={currentUser ? ` Balance |  $${currentUser.balance}` : ''}
                body={
                    currentUser ? (
                        <>
                            <input
                                type="text"
                                className="form-control"
                                id="accountNumber"
                                placeholder="Enter recipient account number"
                                value={toAccountNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <br />
                            <input
                                type="number"
                                className="form-control"
                                id="amount"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <br />
                            <button
                                type="submit"
                                className="btn btn-light"
                                onClick={handleTransfer}
                                disabled={!amount || !toAccountNumber || Object.keys(validationErrors).length > 0}
                            >
                                Transfer
                            </button>
                        </>
                    ) : (
                        <h3>Please log in to transfer money</h3>
                    )
                }
            />
            {loading && (
                <div className={spinnerStyles.spinner}>
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                </div>
            )}
            <TooltipIcon
                text={`
                Here you can transfer money to another account.
                Enter the recipient's account number and the amount you wish to transfer.
                If the user is not logged in, they will be prompted to log in.
            `}
            />
            <ToastContainer style={{ top: '20px' }} />
        </>
    );
}

export default Transfer;
