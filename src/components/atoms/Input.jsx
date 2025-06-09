import React from 'react';

const Input = ({ className, ...props }) => {
    return (
        <input
            className={`py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md ${className || ''}`}
            {...props}
        />
    );
};

export default Input;