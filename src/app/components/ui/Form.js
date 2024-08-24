import React from 'react';
import { useForm } from 'react-hook-form';

const Form = ({ defaultValues = {}, onSubmit, children, validationSchema, mode = 'onSubmit' }) => {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues,
        resolver: validationSchema,
        mode,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.props.name) {
                    return React.cloneElement(child, {
                        register,
                        control,
                        errors,
                    });
                }
                return child;
            })}
        </form>
    );
};

export default Form;
