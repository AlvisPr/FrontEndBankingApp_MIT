import React from 'react';
import { Card as BootstrapCard} from 'react-bootstrap';
import styles from './Card.module.css'; 

function Card(props) {
    const cardClasses = `${props.bgcolor ? 'bg-' + props.bgcolor : ''} ${props.txtcolor ? 'text-' + props.txtcolor : 'text-white'}`;

    return (
        <div className={styles.cardContainer}>
            <BootstrapCard className={`${cardClasses} ${styles.card}`} style={{ backgroundColor: props.transparent ? 'transparent' : 'rgba(255, 255, 255, 0.8)', boxShadow: props.transparent ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <BootstrapCard.Header className={styles.cardHeader} style={{ backgroundColor: props.transparent ? 'transparent' : 'rgba(0, 0, 0, 0.1)' }}>
                    {props.header}
                </BootstrapCard.Header>
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