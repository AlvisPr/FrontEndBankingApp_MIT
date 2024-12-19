export const validateField = (fieldId, value) => {
    const errors = {};

    switch (fieldId) {
        case 'amount':
            if (!value) {
                errors[fieldId] = 'Amount is required';
            } else if (isNaN(value) || parseFloat(value) <= 0) {
                errors[fieldId] = 'Please enter a valid positive number';
            } else if (value.length > 6) {
                errors[fieldId] = 'Amount cannot exceed 6 digits';
            } else if (value.includes('.') && value.split('.')[1].length > 2) {
                errors[fieldId] = 'Amount cannot have more than 2 decimal places';
            }
            break;

        case 'accountNumber':
            if (!value) {
                errors[fieldId] = 'Account number is required';
            } else if (!/^\d{17}$/.test(value)) {
                errors[fieldId] = 'Account number must be 17 digits';
            }
            break;

        case 'email':
            if (!value) {
                errors[fieldId] = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                errors[fieldId] = 'Please enter a valid email address';
            }
            break;

        case 'password':
            if (!value) {
                errors[fieldId] = 'Password is required';
            } else if (value.length < 8) {
                errors[fieldId] = 'Password must be at least 8 characters';
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                errors[fieldId] = 'Password must contain uppercase, lowercase and numbers';
            }
            break;

        case 'name':
            if (!value) {
                errors[fieldId] = 'Name is required';
            } else if (value.length < 2) {
                errors[fieldId] = 'Name must be at least 2 characters';
            } else if (!/^[a-zA-Z\s]*$/.test(value)) {
                errors[fieldId] = 'Name can only contain letters and spaces';
            }
            break;

        default:
            break;
    }

    return errors;
};

export const validateProfileData = (data) => {
    const errors = {};

    // Required field validation
    if (!data.email || data.email.trim() === '') {
        errors.email = 'Email is required';
    }
    if (data.phoneNumber && data.phoneNumber.trim() === '') {
        errors.phoneNumber = 'Phone number is required';
    }
    if (!data.address.street || data.address.street.trim() === '') {
        errors.street = 'Street address is required';
    }
    if (!data.address.city || data.address.city.trim() === '') {
        errors.city = 'City is required';
    }
    if (!data.address.state || data.address.state.trim() === '') {
        errors.state = 'State is required';
    }
    if (data.address && data.address.zipCode && data.address.zipCode.trim() === '') {
        errors.zipCode = 'ZIP code is required';
    }
    if (!data.preferredName || data.preferredName.trim() === '') {
        errors.preferredName = 'Preferred name is required';
    }

    // Format validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Invalid email format';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};