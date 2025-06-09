import React from 'react';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';

const FormField = ({ label, id, name, isTextArea, required, ...inputProps }) => {
    return (
        <>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1">
                {isTextArea ? (
                    <TextArea
                        id={id}
                        name={name}
                        required={required}
                        {...inputProps}
                    />
                ) : (
                    <Input
                        id={id}
                        name={name}
                        required={required}
                        {...inputProps}
                    />
                )}
            </div>
        </>
    );
};

export default FormField;