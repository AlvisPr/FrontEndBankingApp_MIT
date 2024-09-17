import React from 'react';
import { Tooltip } from 'react-tooltip';
import { FaQuestionCircle } from 'react-icons/fa';

const TooltipIcon = ({ text }) => {
    return (
        <div>
             <FaQuestionCircle 
                data-tooltip-id="tooltip" 
                data-tooltip-content={text} 
                style={{ 
                    cursor: 'pointer', 
                    fontSize: '1.5em', 
                    color: '#007bff',
                    position: 'absolute',
                    zIndex: 1000,
                    bottom: '60px',
                    right: '40px',
                }} 
            />
            <Tooltip id="tooltip" place="top" type="dark" effect="solid" />
        </div>
    );
};

export default TooltipIcon;
