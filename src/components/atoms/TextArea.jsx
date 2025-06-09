import React from 'react';

const TextArea = ({ className, rows = 4, ...props }) => {
    return (
        <textarea
            rows={rows}
            className={`py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md ${className || ''}`}
            {...props}
        ></textarea>
    );
};

export default TextArea;