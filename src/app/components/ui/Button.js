import React from 'react';
import classNames from 'classnames';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
}) => {
    const baseStyles = 'font-semibold rounded focus:outline-none';

    const variants = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
        warning: 'bg-yellow-500 text-black hover:bg-yellow-600',
    };

    const sizes = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-md',
        lg: 'px-6 py-3 text-lg',
    };

    const classes = classNames(
        baseStyles,
        variants[variant],
        sizes[size],
        {
            'opacity-50 cursor-not-allowed': disabled,
        },
        className
    );

    return (
        <button
            type={type}
            onClick={onClick}
            className={classes}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
export default Button;