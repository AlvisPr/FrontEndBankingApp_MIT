import React, { useContext } from 'react';
import Card from './Card';
import UserContext from '../context/UserContext';
import TooltipIcon from './Tooltip';

function Balance() {
    const ctx = useContext(UserContext);
    console.log(ctx);

    return (
        <>
        <Card
            bgcolor="primary"
            header="Balance"
            body={
                ctx.currentUser ? (
                    <>
                        <h4>Your current balance is: ${ctx.currentUser.balance}</h4>
                    </>
                ) : (
                    <h3>Please log in to view your balance</h3>
                )
            }
        />
        <TooltipIcon 
            text={`
                Here we are displaying the current user's balance. 
                If the user is not logged in, they will be prompted to log in.
            `}
            />
        </>
    );
}

export default Balance;
