import React from 'react';

function Footer() {
    return (
        <footer style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            textAlign: 'center', 
            padding: '1em 0', 
            backgroundColor: '#f8f9fa', 
            position: 'fixed', 
            width: '100%', 
            height: '20px', 
            bottom: 0 
        }}>
            <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} CryprtoWire. All rights reserved. Alvis Prieditis.</p>
        </footer>
    );
}

export default Footer;