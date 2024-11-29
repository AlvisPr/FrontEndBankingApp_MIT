import React, { useContext, useState } from 'react';
import { 
    Card as MuiCard, 
    CardContent, 
    Typography, 
    TextField, 
    Button, 
    Box,
    Divider,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    useTheme
} from '@mui/material';
import UserContext from '../../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from "../../Styles/spinner.module.css";
import { validateProfileData } from '../../components/Validation/Validation';

function Profile() {
    const theme = useTheme();
    const { currentUser, updateUserProfile } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const initialFormData = {
        phoneNumber: '',
        email: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
        },
        preferredName: '',
        language: 'English',
        communicationPreferences: {
            emailNotifications: true,
            smsNotifications: true,
            paperlessStatements: false,
        }
    };

    const [formData, setFormData] = useState({
        phoneNumber: currentUser?.phoneNumber || '',
        email: currentUser?.email || '',
        address: {
            street: currentUser?.address?.street || '',
            city: currentUser?.address?.city || '',
            state: currentUser?.address?.state || '',
            zipCode: currentUser?.address?.zipCode || '',
        },
        preferredName: currentUser?.preferredName || '',
        language: currentUser?.language || 'English',
        communicationPreferences: {
            emailNotifications: currentUser?.communicationPreferences?.emailNotifications ?? true,
            smsNotifications: currentUser?.communicationPreferences?.smsNotifications ?? true,
            paperlessStatements: currentUser?.communicationPreferences?.paperlessStatements ?? false,
        }
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error for the field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleAddressChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: value
            }
        }));
        // Clear error for the address field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleCommunicationPrefChange = (field) => {
        setFormData(prev => ({
            ...prev,
            communicationPreferences: {
                ...prev.communicationPreferences,
                [field]: !prev.communicationPreferences[field]
            }
        }));
    };

    const handleUpdateProfile = async () => {
        // Validate all fields
        const validation = validateProfileData(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            // Show error toast for missing fields
            toast.error('Please fill in all required fields correctly', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        setLoading(true);
        try {
            await updateUserProfile(formData);
            toast.success('Profile updated successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            toast.error(error.message || 'Failed to update profile', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Custom green theme colors matching Bootstrap's success color
    const greenTheme = {
        primary: {
            main: 'var(--bs-success)',      // Using Bootstrap's success color
            light: 'var(--bs-success)',      // Using the same color for consistency
            lighter: 'var(--bs-success)',    // Using the same color for consistency
            border: 'var(--bs-success)'      // Using the same color for borders
        }
    };

    if (!currentUser) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">Please log in to update your profile</Alert>
            </Box>
        );
    }

    return (
        <>
            <ToastContainer
                style={{ top: '80px' }}
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            {loading && (
                <div className={styles.spinner}>
                    <ClipLoader color="#2e7d32" loading={loading} size={50} />
                </div>
            )}
            <Box sx={{ 
                maxWidth: 380,
                ml: 3,
                mt: 2
            }}>
                <MuiCard sx={{ 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderRadius: '6px',
                    border: `1px solid ${greenTheme.primary.border}`,
                    backgroundColor: '#ffffff',
                    '& .MuiCardHeader-root': {
                        backgroundColor: greenTheme.primary.main,
                        color: 'white'
                    }
                }}>
                    <Box sx={{ 
                        borderBottom: `1px solid ${greenTheme.primary.border}`,
                        bgcolor: greenTheme.primary.main,
                        color: 'white',
                        py: 1,
                        px: 2,
                        borderRadius: '6px 6px 0 0'
                    }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            Account Settings
                        </Typography>
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                        {/* Contact Information Section */}
                        <Box sx={{ mb: 1.5 }}>
                            <Typography variant="caption" sx={{ 
                                color: greenTheme.primary.main,
                                fontWeight: 600,
                                mb: 0.5,
                                display: 'block'
                            }}>
                                Contact Information
                            </Typography>
                            <Box sx={{ display: 'grid', gap: 1 }}>
                                <TextField
                                    size="small"
                                    label="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    fullWidth
                                    required
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber}
                                    sx={{ 
                                        maxWidth: 320,
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: greenTheme.primary.light,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: greenTheme.primary.main,
                                            },
                                            '&.Mui-error fieldset': {
                                                borderColor: 'red',
                                            }
                                        },
                                        '& .MuiFormLabel-root.Mui-focused': {
                                            color: greenTheme.primary.main,
                                        }
                                    }}
                                />
                                <TextField
                                    size="small"
                                    label="Email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    fullWidth
                                    required
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    sx={{ 
                                        maxWidth: 320,
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: greenTheme.primary.light,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: greenTheme.primary.main,
                                            },
                                            '&.Mui-error fieldset': {
                                                borderColor: 'red',
                                            }
                                        },
                                        '& .MuiFormLabel-root.Mui-focused': {
                                            color: greenTheme.primary.main,
                                        }
                                    }}
                                />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {/* Address Section */}
                        <Box sx={{ mb: 1.5 }}>
                            <Typography variant="caption" sx={{ 
                                color: greenTheme.primary.main,
                                fontWeight: 600,
                                mb: 0.5,
                                display: 'block'
                            }}>
                                Mailing Address
                            </Typography>
                            <Box sx={{ display: 'grid', gap: 1 }}>
                                <TextField
                                    size="small"
                                    label="Street Address"
                                    value={formData.address.street}
                                    onChange={(e) => handleAddressChange('street', e.target.value)}
                                    fullWidth
                                    required
                                    error={!!errors.street}
                                    helperText={errors.street}
                                    sx={{ 
                                        maxWidth: 320,
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: greenTheme.primary.light,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: greenTheme.primary.main,
                                            },
                                            '&.Mui-error fieldset': {
                                                borderColor: 'red',
                                            }
                                        },
                                        '& .MuiFormLabel-root.Mui-focused': {
                                            color: greenTheme.primary.main,
                                        }
                                    }}
                                />
                                <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: '160px 75px 75px' }}>
                                    <TextField
                                        size="small"
                                        label="City"
                                        value={formData.address.city}
                                        onChange={(e) => handleAddressChange('city', e.target.value)}
                                        error={!!errors.city}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': {
                                                    borderColor: greenTheme.primary.light,
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: greenTheme.primary.main,
                                                },
                                                '&.Mui-error fieldset': {
                                                    borderColor: 'red',
                                                }
                                            },
                                            '& .MuiFormLabel-root.Mui-focused': {
                                                color: greenTheme.primary.main,
                                            }
                                        }}
                                    />
                                    <TextField
                                        size="small"
                                        label="State"
                                        value={formData.address.state}
                                        onChange={(e) => handleAddressChange('state', e.target.value)}
                                        error={!!errors.state}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': {
                                                    borderColor: greenTheme.primary.light,
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: greenTheme.primary.main,
                                                },
                                                '&.Mui-error fieldset': {
                                                    borderColor: 'red',
                                                }
                                            },
                                            '& .MuiFormLabel-root.Mui-focused': {
                                                color: greenTheme.primary.main,
                                            }
                                        }}
                                    />
                                    <TextField
                                        size="small"
                                        label="ZIP"
                                        value={formData.address.zipCode}
                                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                                        error={!!errors.zipCode}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': {
                                                    borderColor: greenTheme.primary.light,
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: greenTheme.primary.main,
                                                },
                                                '&.Mui-error fieldset': {
                                                    borderColor: 'red',
                                                }
                                            },
                                            '& .MuiFormLabel-root.Mui-focused': {
                                                color: greenTheme.primary.main,
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {/* Preferences Section */}
                        <Box sx={{ mb: 1.5 }}>
                            <Typography variant="caption" sx={{ 
                                color: greenTheme.primary.main,
                                fontWeight: 600,
                                mb: 0.5,
                                display: 'block'
                            }}>
                                Account Preferences
                            </Typography>
                            <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: '160px 150px' }}>
                                <TextField
                                    size="small"
                                    label="Preferred Name"
                                    value={formData.preferredName}
                                    onChange={(e) => handleInputChange('preferredName', e.target.value)}
                                    error={!!errors.preferredName}
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: greenTheme.primary.light,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: greenTheme.primary.main,
                                            },
                                            '&.Mui-error fieldset': {
                                                borderColor: 'red',
                                            }
                                        },
                                        '& .MuiFormLabel-root.Mui-focused': {
                                            color: greenTheme.primary.main,
                                        }
                                    }}
                                />
                                <FormControl size="small">
                                    <InputLabel>Language</InputLabel>
                                    <Select
                                        value={formData.language}
                                        onChange={(e) => handleInputChange('language', e.target.value)}
                                        label="Language"
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': {
                                                    borderColor: greenTheme.primary.light,
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: greenTheme.primary.main,
                                                },
                                                '&.Mui-error fieldset': {
                                                    borderColor: 'red',
                                                }
                                            },
                                            '& .MuiFormLabel-root.Mui-focused': {
                                                color: greenTheme.primary.main,
                                            }
                                        }}
                                    >
                                        <MenuItem value="English">English</MenuItem>
                                        <MenuItem value="Spanish">Spanish</MenuItem>
                                        <MenuItem value="French">French</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {/* Communication Preferences Section */}
                        <Box sx={{ mb: 1.5 }}>
                            <Typography variant="caption" sx={{ 
                                color: greenTheme.primary.main,
                                fontWeight: 600,
                                mb: 0.5,
                                display: 'block'
                            }}>
                                Communication Preferences
                            </Typography>
                            <Box sx={{ display: 'grid', gap: 0.25 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={formData.communicationPreferences.emailNotifications}
                                            onChange={() => handleCommunicationPrefChange('emailNotifications')}
                                        />
                                    }
                                    label={
                                        <Typography variant="caption">
                                            Email notifications for account activity
                                        </Typography>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={formData.communicationPreferences.smsNotifications}
                                            onChange={() => handleCommunicationPrefChange('smsNotifications')}
                                        />
                                    }
                                    label={
                                        <Typography variant="caption">
                                            SMS alerts for important updates
                                        </Typography>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={formData.communicationPreferences.paperlessStatements}
                                            onChange={() => handleCommunicationPrefChange('paperlessStatements')}
                                        />
                                    }
                                    label={
                                        <Typography variant="caption">
                                            Enroll in paperless statements
                                        </Typography>
                                    }
                                />
                            </Box>
                        </Box>

                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end',
                            borderTop: `1px solid ${greenTheme.primary.border}`,
                            pt: 1.5,
                            mt: 1.5
                        }}>
                            <Button
                                variant="contained"
                                onClick={handleUpdateProfile}
                                size="small"
                                sx={{ 
                                    minWidth: 90,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    py: 0.5,
                                    bgcolor: greenTheme.primary.main,
                                    '&:hover': {
                                        bgcolor: greenTheme.primary.light,
                                    }
                                }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </CardContent>
                </MuiCard>
            </Box>
        </>
    );
}

export default Profile;