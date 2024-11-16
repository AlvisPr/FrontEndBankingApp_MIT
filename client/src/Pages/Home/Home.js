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
                <DialogTitle></DialogTitle>
                <DialogContent className={styles.dialogContent}>
                    <div>
                        <h4 className={styles.heading}><FaReact className={styles.heading} /> User-Friendly Banking Application with React</h4>
                        <p className={styles.textBlock}>As a part of MIT Full Stack Development with MERN concluding week 20 from 32, I had to work on a front-end banking app using React. This project was an individual chance to dive deeper into React’s potential for handling complex, state-heavy applications, while ensuring the app remains secure and intuitive for financial management. In this write-up, I’ll break down the key features and design decisions that shaped this project.</p>
                        <h4 className={styles.heading}><FaReact className={styles.heading} /> The Foundation: React and Context API</h4>
                        <p className={styles.textBlock}>The backbone of this app is React, chosen for its ability to break the UI into reusable components and efficiently manage re-renders. Early on, I decided to use React’s Context API for state management instead of passing props through multiple levels (prop drilling). This was essential since I needed to keep track of user data and authentication across various components.</p>
                        <p className={styles.textBlock}>At the core of the state management is the UserContext, which holds key data like the current user, all users (for admin use), login status, and user type. Using this context made it possible to ensure that components like the balance display, deposit, and withdrawal forms always had the most up-to-date user information, providing a smooth, seamless experience.</p>
                        <h4 className={styles.heading}><FaLock className={styles.heading} /> User Management and Security</h4>
                        <p className={styles.textBlock}>Security was a top priority for me. The app's user management system includes robust signup and login functionalities, which are handled by the CreateAccount and Login components. I used custom form validation in Validation.js to make sure that data is clean and secure right from the point of entry.</p>
                        <p className={styles.textBlock}>One of the standout features of this app is the dual-mode authentication, which allows both regular users and admins to log in with different levels of access. Handling these roles required some careful planning, especially to ensure that components like the AllData view are restricted to admin users only. Admin email and password are pre established. Please enter:  admin@system.lv for email and admin2024 for password so that you have access to the database which holds all registered user data.</p>
                        <h4 className={styles.heading}><FaDatabase className={styles.heading} /> Core Banking Functions</h4>
                        <p className={styles.textBlock}>The core of the app is its banking features, allowing users to check their balance, make deposits, and withdraw funds. Each of these functions is encapsulated in its own component (Balance, Deposit, and Withdraw), and they interact with the UserContext to access and update account data.</p>
                        <p className={styles.textBlock}>In designing these components, I paid close attention to the user experience. The deposit and withdrawal forms include real-time validation, giving users immediate feedback on whether their input is valid. I also added loading states to keep users informed about the status of their transactions, which helps prevent confusion during processing.</p>
                        <h4 className={styles.heading}><FaUserShield className={styles.heading} /> Enhancing the User Experience</h4>
                        <p className={styles.textBlock}>Functionality was a major focus, but I also wanted the app to feel nice to use. This led me to create some reusable UI components that enhance the user experience:</p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}><strong>Card component</strong>: Provides a clean, consistent container for displaying various sections.</li>
                            <li className={styles.listItem}><strong>FormInput component</strong>: Standardizes input fields across the app, including cool features like toggling password visibility.</li>
                            <li className={styles.listItem}><strong>Tooltip component</strong>: Offers users extra information when needed without cluttering the UI.</li>
                            <li className={styles.listItem}><strong>Responsive NavBar</strong>: Simplifies navigation with a clean, modern look.</li>
                        </ul>
                        <p className={styles.textBlock}>To add a bit of flair, I built a CanvasAnimation component, which renders an animated background of moving squares. It’s a small touch, but it adds a modern, dynamic feel to the app.</p>
                        <h4 className={styles.heading}><FaReact className={styles.heading} /> Challenges and Key Learnings</h4>
                        <p className={styles.textBlock}>This project wasn’t without its challenges. One of the biggest hurdles was balancing security with user experience, especially when it came to sensitive features like the admin’s ability to view all user data. I also spent quite a bit of time optimizing the app to prevent unnecessary re-renders, ensuring the Context API was used efficiently.</p>
                        <p className={styles.textBlock}>A key takeaway from this project was the importance of considering the entire user journey. Each step, from account creation to performing transactions, needed to be intuitive and secure. This often meant revisiting features to refine and improve them as I went along.</p>
                    </div>
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