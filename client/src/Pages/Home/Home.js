import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import bankImg from '../../assets/logo-no-background.png';
import bankImage2 from '../../assets/confident-good-looking-female-entrepreneur-pointing-her-credit-card-against-isolated-background.jpg';
import secureTransaction from '../../assets/hand-pushing-button-touch-screen.jpg';
import businessMan from '../../assets/smiling-middle-aged-businessman-cafe-counter.jpg';
import { FaFacebook, FaTwitter, FaInstagram, FaReact, FaDatabase, FaLock, FaUserShield, FaTimes } from 'react-icons/fa';
import { Dialog, DialogContent } from '@mui/material';
import { Carousel } from 'react-bootstrap';
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



    const carouselItems = [
        {
            image: bankImage2,
            caption: 'Experience Modern Online Banking',
            description: 'Manage your finances anytime, anywhere with our secure online platform.'
        },
        {
            image: businessMan,
            caption: 'Empower Your Business',
            description: 'Easily manage your finances and operations with our intuitive and user-friendly interface.'
            
        },
        {
            image: secureTransaction,
            caption: 'Your Security is Our Priority',
            description: 'Rest easy with our advanced encryption and security measures.'
        }
    ]

    const socialIcons = [
        { icon: <FaFacebook />, link: 'https://www.facebook.com', alt: 'Facebook' },
        { icon: <FaTwitter />, link: 'https://www.twitter.com', alt: 'Twitter' },
        { icon: <FaInstagram />, link: 'https://www.instagram.com', alt: 'Instagram' },
    ];

    const dialogContent = [
        {
            icon: <FaReact className={styles.sectionIcon} />,
            title: "Modern React Banking",
            text: "Experience seamless banking with our React-powered platform. Built with the latest web technologies for optimal performance and user experience."
        },
        {
            icon: <FaDatabase className={styles.sectionIcon} />,
            title: "Secure Data Management",
            text: "Your data is protected by industry-leading security protocols. Access your information quickly and safely, with real-time updates and reliable storage."
        },
        {
            icon: <FaLock className={styles.sectionIcon} />,
            title: "Advanced Security",
            text: "Rest easy with our state-of-the-art security measures, including encrypted transactions and multi-factor authentication."
        },
        {
            icon: <FaUserShield className={styles.sectionIcon} />,
            title: "Smart Access Control",
            text: "Customized access levels ensure you have the right permissions while maintaining the highest security standards."
        }
    ];

    return (
        <div className={styles.homeContainer}>
            <div className={styles.cardSection}>
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
                <button 
                    onClick={handleClickOpen} 
                    className={styles.learnMoreButton}
                    aria-label="Learn more about our features"
                >
                    Learn More
                </button>
            </div>

            <div className={styles.carouselSection}>
                <Carousel fade interval={10000} className={styles.customCarousel}>
                    {carouselItems.map((item, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={item.image}
                                alt={item.caption}
                            />
                            <Carousel.Caption className={styles.carouselCaption}>
                                <div className={styles.captionContent}>
                                    <h3>{item.caption}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
            

            <Dialog
                open={open}
                onClose={handleClose}
                className={styles.dialog}
                PaperProps={{
                    className: styles.dialogPaper
                }}
                BackdropProps={{
                    style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
                }}
                aria-labelledby="features-dialog-title"
            >
                <div className={styles.dialogHeader}>
                    <h2 id="features-dialog-title" className={styles.dialogTitle}>
                        Banking Features
                    </h2>
                    <button 
                        onClick={handleClose} 
                        className={styles.closeButton}
                        aria-label="Close dialog"
                    >
                        <FaTimes />
                    </button>
                </div>
                <DialogContent className={styles.dialogContent}>
                    <div className={styles.contentWrapper}>
                        {dialogContent.map((section, index) => (
                            <div 
                                key={index} 
                                className={styles.section}
                                tabIndex={0}
                                role="article"
                                aria-labelledby={`section-title-${index}`}
                            >
                                <div className={styles.sectionHeader}>
                                    {section.icon}
                                    <h3 id={`section-title-${index}`}>{section.title}</h3>
                                </div>
                                <p className={styles.textBlock}>{section.text}</p>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Home;