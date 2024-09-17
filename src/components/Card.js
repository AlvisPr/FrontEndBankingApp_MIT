import React from 'react';
import styles from './Card.module.css'; // Import the CSS module
import CanvasAnimation from './CanvasAnimation'; 


function Card(props) {
    function classes() {
        const bg = props.bgcolor ? 'bg-' + props.bgcolor : '';
        const txt = props.txtcolor ? ' text-' + props.txtcolor : ' text-white';
        return bg + txt;
    }

    const cardStyle = {
        backgroundColor: props.transparent ? 'transparent' : 'rgba(255, 255, 255, 0.8)',
        boxShadow: props.transparent ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const headerStyle = {
        backgroundColor: props.transparent ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
    };

    return (
        <div className={styles.cardContainer}>
            <div className={`card ${classes()} ${styles.card}`} style={cardStyle}>
                <div className={`card-header ${styles.cardHeader}`} style={headerStyle}>
                    {props.header}
                </div>
                <div className={`card-body ${styles.cardBody}`}>
                    {props.title && <h5 className={`card-title ${styles.cardTitle}`}>{props.title}</h5>}
                    {props.text && <p className={`card-text ${styles.cardText}`}>{props.text}</p>}
                    {props.body}
                    {props.status && <div id="createStatus" className="mt-3 text-center">{props.status}</div>}
                </div>
                <div className={`d-flex justify-content-center align-items-center my-3 ${styles.socialIcons}`}>
                    {props.socialIcons && props.socialIcons.map((icon, index) => (
                        <a key={index} href={icon.link} target="_blank" rel="noopener noreferrer" aria-label={icon.alt} className="text-white mx-3">
                            <div className={styles.socialIcon}>
                                {icon.icon}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Card;