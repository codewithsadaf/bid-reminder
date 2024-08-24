import React from 'react';
import { useController } from 'react-hook-form';

const SelectInput = ({ label, name, options, defaultValue, control, error }) => {
    const {
        field: { onChange, onBlur, value, name: fieldName },
    } = useController({
        name,
        control,
    });

    return (
        <div className="mb-4">
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <select
                id={fieldName}
                name={fieldName}
                onChange={onChange}
                defaultValue={defaultValue}
                onBlur={onBlur}
                value={value}
                className="mt-1 p-2 block w-full rounded-md border border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                <option value="" disabled>Select an option</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
    );
};

export default SelectInput;