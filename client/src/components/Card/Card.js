import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';
import styles from './Card.module.css';

function Card(props) {
    const getCardColor = () => {
        if (props.transparent) return 'transparent';
        
        // Professional financial color scheme
        switch(props.bgcolor) {
            case 'success':
                return '#4527A0'; // Deep Purple
            case 'primary':
                return '#283593'; // Indigo
            case 'info':
                return '#512DA8'; // Deep Purple (lighter)
            case 'warning':
                return '#5E35B1'; // Deep Purple (accent)
            case 'danger':
                return '#311B92'; // Deep Purple (darker)
            default:
                return 'rgba(69, 39, 160, 0.95)'; // Default Deep Purple with transparency
        }
    };

    const getHeaderColor = () => {
        if (props.transparent) return 'transparent';
        return 'rgba(255, 255, 255, 0.1)';
    };

    return (
        <div className={styles.cardContainer}>
            <BootstrapCard 
                className={`text-white ${styles.card}`} 
                style={{ 
                    backgroundColor: getCardColor(),
                    boxShadow: props.transparent ? 'none' : '0 4px 15px rgba(69, 39, 160, 0.3)',
                    border: 'none'
                }}
            >
                {(props.header || props.balance) && (
                    <BootstrapCard.Header
                        className={styles.cardHeader}
                        style={{ 
                            backgroundColor: getHeaderColor(),
                            borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
                        }}
                    >
                        {props.header}
                        <span id="balance">{props.balance}</span>
                    </BootstrapCard.Header>
                )}
                <BootstrapCard.Body className={styles.cardBody}>
                    {props.title && <BootstrapCard.Title className={styles.cardTitle}>{props.title}</BootstrapCard.Title>}
                    {props.text && <BootstrapCard.Text className={styles.cardText}>{props.text}</BootstrapCard.Text>}
                    {props.body}
                    {props.status && <div id="createStatus" className="mt-3 text-center">{props.status}</div>}
                </BootstrapCard.Body>
                <div className={`d-flex justify-content-center align-items-center my-3 ${styles.socialIcons}`}>
                    {props.socialIcons && props.socialIcons.map((icon, index) => (
                        <a key={index} href={icon.link} target="_blank" rel="noopener noreferrer" aria-label={icon.alt} className="text-white mx-3">
                            <div className={styles.socialIcon}>
                                {icon.icon}
                            </div>
                        </a>
                    ))}
                </div>
            </BootstrapCard>
        </div>
    );
}

export default Card;