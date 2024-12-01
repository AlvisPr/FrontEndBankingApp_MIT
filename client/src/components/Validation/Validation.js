export const validateField = (fieldName, value, ctx, context) => {
    let errors = {};
    switch (fieldName) {
        case 'name':
            if (context === 'createAccount') {
                if (!value) {
                    errors.name = 'Name is required';
                } else if (value.length < 2) {
                    errors.name = 'Name should be at least 2 characters long';
                }
            }
            break;
        case 'email':
            if (!value) {
                errors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors.email = 'Invalid email format';
            } else if (context === 'createAccount' && ctx.users.some(user => user.email === value)) {
                errors.email = 'This email is already in use';
            }
            break;
        case 'password':
            if (!value) {
                errors.password = 'Password is required';
            } else if (value.length < 8) {
                errors.password = 'Password should be at least 8 characters long';
            } else if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
                errors.password = 'Password should contain both letters and numbers';
            }
            break;
        case 'phoneNumber':
            if (value && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
                errors.phoneNumber = 'Invalid phone number format (e.g., 123-456-7890)';
            }
            break;
        case 'zipCode':
            if (value && !/^[0-9]{5}(?:-[0-9]{4})?$/.test(value)) {
                errors.zipCode = 'Invalid ZIP code format (e.g., 12345 or 12345-6789)';
            }
            break;
        case 'city':
            if (value && value.length < 2) {
                errors.city = 'City should be at least 2 characters long';
            }
            break;
        case 'state':
            if (value && value.length < 2) {
                errors.state = 'Please enter a valid state';
            }
            break;
        case 'preferredName':
            if (value && value.length < 2) {
                errors.preferredName = 'Preferred name should be at least 2 characters long';
            }
            break;
        case 'street':
            if (value && value.length < 2) {
                errors.street = 'Street address should be at least 2 characters long';
            }
            break;
        case 'accountNumber':
            if (!value) {
                errors.accountNumber = 'Account number is required';
            } else if (!/^\d{10}$/.test(value)) {
                errors.accountNumber = 'Account number must be 10 digits';
            }
            break;
        case 'routingNumber':
            if (!value) {
                errors.routingNumber = 'Routing number is required';
            } else if (!/^\d{9}$/.test(value)) {
                errors.routingNumber = 'Routing number must be 9 digits';
            }
            break;
        case 'amount':
            if (!value) {
                errors.amount = 'Amount is required';
            } else if (isNaN(value) || parseFloat(value) <= 0) {
                errors.amount = 'Amount must be a positive number';
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
    if (!data.phoneNumber || data.phoneNumber.trim() === '') {
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
    if (!data.address.zipCode || data.address.zipCode.trim() === '') {
        errors.zipCode = 'ZIP code is required';
    }
    if (!data.preferredName || data.preferredName.trim() === '') {
        errors.preferredName = 'Preferred name is required';
    }

    // Format validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Invalid email format';
    }
    if (data.phoneNumber && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(data.phoneNumber)) {
        errors.phoneNumber = 'Invalid phone number format (e.g., 123-456-7890)';
    }
    if (data.address.zipCode && !/^\d{5}(-\d{4})?$/.test(data.address.zipCode)) {
        errors.zipCode = 'Invalid ZIP code format (e.g., 12345 or 12345-6789)';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};