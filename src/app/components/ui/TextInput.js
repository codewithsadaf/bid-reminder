import React from 'react';

const TextInput = ({ label, name, register, errors, ...rest }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            {...register(name)}
            {...rest}
            className="mt-1 p-2 block w-full rounded-md border border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors[name] && (
            <p className="mt-1 text-sm text-red-600">{errors[name]?.message}</p>
        )}
    </div>
);

export default TextInput;