import React, { useContext, useState } from 'react';
import Card from '../../components/Card/Card';
import UserContext from '../../context/UserContext';
import { toast } from 'react-hot-toast';
import styles from '../../Styles/formStyles.module.css';

function Profile() {
    const { currentUser, updateUserProfile } = useContext(UserContext);
    const [name, setName] = useState(currentUser?.name || '');
    const [contactInfo, setContactInfo] = useState(currentUser?.contactInfo || '');

    const handleUpdateProfile = async () => {
        try {
            await updateUserProfile({ name, contactInfo });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    return (
        <Card
            bgcolor="warning"
            header="Update Profile"
            body={
                currentUser ? (
                    <div className={styles.formContainer}>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Name" 
                            className="form-control mb-3"
                        />
                        <input 
                            type="text" 
                            value={contactInfo} 
                            onChange={e => setContactInfo(e.target.value)} 
                            placeholder="Contact Info" 
                            className="form-control mb-3"
                        />
                        <button 
                            onClick={handleUpdateProfile} 
                            className="btn btn-light"
                            style={{ width: '100%' }}
                        >
                            Update
                        </button>
                    </div>
                ) : (
                    <h3>Please log in to update your profile</h3>
                )
            }
        />
    );
}

export default Profile; 