// FormInput.js
import React from 'react';
import { FaCheck, FaTimes, FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

function FormInput({ id, type, value, onChange, onBlur, onKeyPress, validationError, togglePasswordVisibility, passwordVisible }) {
    return (
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', width: '40px', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #ccc' }}>
                {id === 'email' && <FaEnvelope style={{ color: 'black' }} />}
                {id === 'password' && <FaLock style={{ color: 'black' }} />}
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