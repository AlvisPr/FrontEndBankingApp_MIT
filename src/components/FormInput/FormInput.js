// FormInput.js
import React from 'react';
import { FaCheck, FaTimes, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import styles from './FormInput.module.css';



function FormInput({ id, type, value, onChange, onBlur, onKeyPress, validationError, togglePasswordVisibility, passwordVisible }) {
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
                placeholder={`Enter ${id}`}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onKeyPress={onKeyPress}
                style={{ paddingLeft: '50px', borderColor: validationError ? 'red' : '' }}
            />
            {id === 'password' && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
            )}
            {validationError ? (
                <FaTimes style={{ color: 'red', position: 'absolute', right: '-30px', top: '50%', transform: 'translateY(-50%)', borderRadius: '50%', backgroundColor: 'white', padding: '5px' }} />
            ) : (
                value && <FaCheck style={{ color: 'green', position: 'absolute', right: '-30px', top: '50%', transform: 'translateY(-50%)', borderRadius: '50%', backgroundColor: 'white', padding: '5px' }} />
            )}
        </div>
    );
}

export default FormInput;