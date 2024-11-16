
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
        default:
            break;
    }
    return errors;
};