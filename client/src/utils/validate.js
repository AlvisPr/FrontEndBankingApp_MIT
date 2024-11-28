export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const validatePhoneNumber = (phoneNumber) => {
    const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return re.test(String(phoneNumber));
};

export const validateZipCode = (zipCode) => {
    const re = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return re.test(String(zipCode));
};

export const validateProfileData = (formData) => {
    const errors = {};

    // Validate email
    if (!formData.email || !validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Validate phone number if provided
    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
        errors.phoneNumber = 'Please enter a valid phone number (e.g., 123-456-7890)';
    }

    // Validate address fields if any address field is provided
    if (formData.address) {
        const { street, city, state, zipCode } = formData.address;
        
        if (zipCode && !validateZipCode(zipCode)) {
            errors.zipCode = 'Please enter a valid ZIP code';
        }

        if (city && city.length < 2) {
            errors.city = 'City name must be at least 2 characters long';
        }

        if (state && state.length < 2) {
            errors.state = 'Please enter a valid state';
        }
    }

    // Validate preferred name if provided
    if (formData.preferredName && formData.preferredName.length < 2) {
        errors.preferredName = 'Preferred name must be at least 2 characters long';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
