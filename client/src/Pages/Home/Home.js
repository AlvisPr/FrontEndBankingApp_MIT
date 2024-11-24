import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import bankImg from '../../assets/logo-no-background.png';
import { FaFacebook, FaTwitter, FaInstagram, FaReact,  FaDatabase, FaLock, FaUserShield } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './Home.module.css'; 

function Home() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(true);
        }, 2000); 

        return () => clearTimeout(timer); 
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const socialIcons = [
        { icon: <FaFacebook />, link: 'https://www.facebook.com', alt: 'Facebook' },
        { icon: <FaTwitter />, link: 'https://www.twitter.com', alt: 'Twitter' },
        { icon: <FaInstagram />, link: 'https://www.instagram.com', alt: 'Instagram' },
    ];

    const dialogContent = [
        {
            icon: <FaReact />,
            title: "Advanced Banking Application with React",
            text: "I have leveraged the power of React to deliver a seamless and responsive user experience. With a component-based architecture, I ensure that the application is both scalable and maintainable. This approach allows me to efficiently manage complex state and UI updates, providing users with a smooth and intuitive interface."
        },
        {
            icon: <FaDatabase />,
            title: "Efficient Data Management",
            text: "Utilizing MongoDB, I provide robust data management capabilities. Users can access their account information and transaction history swiftly, thanks to optimized database queries and indexing. This ensures that data retrieval is fast and reliable, even as the database grows in size."
        },
        {
            icon: <FaLock />,
            title: "Enhanced Security Protocols",
            text: "Security is paramount. I've implemented state-of-the-art security measures, including bcrypt for password hashing and role-based access control, to safeguard user data and ensure privacy. My security protocols are designed to protect against unauthorized access and data breaches, providing peace of mind to users."
        },
        {
            icon: <FaUserShield />,
            title: "Role-Based Access Control",
            text: "The system supports multiple user roles, including admin and regular users. Admins have the ability to manage user accounts and oversee transactions, ensuring a secure and controlled environment. This role-based access control allows me to tailor the user experience and permissions based on the user's role."
        },
        {
            icon: <FaReact />,
            title: "Modern Technology Stack",
            text: "The application is built on a modern technology stack, including the latest versions of React, Node.js, and Express. This ensures high performance, reliability, and the ability to quickly adapt to new requirements. My choice of technology allows me to leverage the latest advancements in web development."
        },
        {
            icon: <FaReact />,
            title: "User-Centric Design",
            text: "I've focused on creating a user-friendly interface that is both intuitive and accessible. My design principles prioritize ease of use, ensuring that users can navigate the application effortlessly. I have incorporated feedback from user testing to continuously improve the user experience."
        },
        {
            icon: <FaDatabase />,
            title: "Comprehensive Transaction Management",
            text: "Users can perform a variety of transactions, including deposits and withdrawals, with real-time updates to their account balance. My transaction history feature provides a detailed overview of all activities, allowing users to track their financial activities with ease and accuracy."
        }
    ];

    return (
        <div >
            <Card
            bgcolor="success"
            txtcolor="white"
            header="Home"
            title=""
            text=""
            body={(
                <img 
                src={bankImg} 
                className="img-fluid" 
                alt="Bank" 
                style={{ filter: 'brightness(0) invert(1)' }}
            />
            )}
            socialIcons={socialIcons}
        />
            <Button variant="outlined" color="primary" onClick={handleClickOpen} style={{marginLeft:"30px", zIndex: 1}}>
                Learn More
            </Button>
            <Dialog className={styles.dialogPaper}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    paper: styles.dialogPaper
                    
                }}
                BackdropProps={{
                    className: styles.dialogBackdrop,
                    style: { backgroundColor: 'transparent' }

                }}
            >
                <DialogTitle>Application Overview</DialogTitle>
                <DialogContent className={styles.dialogContent}>
                    {dialogContent.map((section, index) => (
                        <div key={index}>
                            <h4 className={styles.heading}>{section.icon} {section.title}</h4>
                            <p className={styles.textBlock}>{section.text}</p>
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="danger" >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        
        </div>
    );
}

export default Home;