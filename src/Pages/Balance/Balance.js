import React, { useContext } from 'react';
import Card from '../../components/Card/Card';
import UserContext from '../../context/UserContext';
import TooltipIcon from '../../components/Tooltip/Tooltip';
import bankImg from '../../assets/money-bag.png';
import sharedLogos from '../../Styles/sharedlogos.module.css';

function Balance() {
    const ctx = useContext(UserContext);

    return (
        <>
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