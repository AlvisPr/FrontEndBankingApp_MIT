import React from 'react';
import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <p className={styles.title}>&copy; {new Date().getFullYear()} CashConnect. All rights reserved. Alvis Prieditis.</p>
        </footer>
    );
}

export default Footer;