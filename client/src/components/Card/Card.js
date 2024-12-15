import { Card as BootstrapCard } from 'react-bootstrap';
import styles from './Card.module.css';

function Card(props) {


    return (
        <div className={styles.cardContainer}>
            <BootstrapCard 
                className={`text-white ${styles.card}`} 
                style={{ 
                    backgroundColor: '#2e7d32', // Set the background color here
                    boxShadow: props.transparent ? 'none' : '0 4px 15px rgba(46, 125, 50, 0.3)',
                    border: 'none'
                }}
            >
                {(props.header || props.balance) && (
                    <BootstrapCard.Header
                        className={styles.cardHeader}
                        style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
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