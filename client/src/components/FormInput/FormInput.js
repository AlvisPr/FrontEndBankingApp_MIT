import React from 'react';
import { FaCheck, FaTimes, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import styles from './FormInput.module.css';

function FormInput({ 
    id, 
    type, 
    value, 
    onChange, 
    onBlur, 
    onKeyPress, 
    error, 
    placeholder,
    togglePasswordVisibility,
    passwordVisible 
}) {
    return (
        <div className={styles.formInputContainer}>
            <div className={styles.iconContainer}>
                {id === 'email' && <FaEnvelope style={{ color: 'black' }} />}
                {id === 'password' && <FaLock style={{ color: 'black' }} />}
                {id === 'name' && <FaUser style={{ color: 'black' }} />}
            </div>
            <input
                type={type}
                className="form-control"
                id={id}
                placeholder={placeholder || `Enter ${id}`}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onKeyPress={onKeyPress}
                style={{ paddingLeft: '50px', paddingRight: id === 'password' ? '40px' : '10px', borderColor: error ? 'red' : '' }}
            />
            {id === 'password' && togglePasswordVisibility && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={styles.passwordToggle}
                >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
            )}
            {error ? (
                <FaTimes className={styles.validationIcon} style={{ color: 'red' }} />
            ) : (
                value && <FaCheck className={styles.validationIcon} style={{ color: 'green' }} />
            )}
        </div>
    );
}

export default FormInput;