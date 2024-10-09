import React, { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Form from '../components/ui/Form';
import TextInput from '../components/ui/TextInput';
import SelectInput from '../components/ui/SelectInput';
import Button from '../components/ui/Button';
import axios from 'axios';
import MultiEmailSelector from '../components/ui/MultiEmailSelector';

const schema = yup.object().shape({
    notificationInterval: yup.string().required('Notification interval is required'),
    weeklyNotificationDay: yup.string()
        .oneOf(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 'Invalid day')
        .required('Weekly notification day is required'),
    notificationTime: yup.string().required('Notification time is required'),
    searchQuery: yup.string().required('Search query is required'),
    relevancyScore: yup.number().min(0).max(100).required('Relevancy score is required'),
});

const BidForm = ({ onClose }) => {
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            notificationInterval: '',
            weeklyNotificationDay: '',
            notificationTime: '',
            searchQuery: '',
            relevancyScore: '',
        },
        resolver: yupResolver(schema),
    });

    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [emailsList, setEmailsList] = useState([]);
    const [emailsListError, setEmailsListError] = useState("");

    const onSubmit = async (data) => {
        if (emailsList.length === 0) {
            setEmailsListError("*At least one email required*");
            return;
        }
        setEmailsListError(""); 

        setLoading(true);
        setSubmitError(null);
        try {
            const payLoad = {
                recipients: emailsList,
                frequency: data.notificationInterval,
                day: data.weeklyNotificationDay,
                time: data.notificationTime,
                searchQuery: data.searchQuery,
                candidateName: "John Doe",
                relevancyScore: data.relevancyScore,
            };

            await axios.post('/api/email', payLoad, { headers: { 'Content-Type': 'application/json' } });
            alert("Email Notification reminder set successfully!");
            reset();
            onClose();
        } catch (error) {
            setSubmitError("An error occurred while submitting the form. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Bid Notification</h2>
            <h5 className="text-lg mb-6">Configure your email notification settings for relevant business bids</h5>
            {submitError && <p className="text-red-500 mb-4">{submitError}</p>}
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                        label="Notification Interval"
                        name="notificationInterval"
                        placeholder="e.g., daily, weekly"
                        register={register}
                        error={errors.notificationInterval}
                    />
                    <SelectInput
                        label="Weekly Notification Day"
                        name="weeklyNotificationDay"
                        options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
                        defaultValue=""
                        control={control}
                        error={errors.weeklyNotificationDay}
                    />
                    <TextInput
                        label="Notification Time"
                        name="notificationTime"
                        placeholder="HH:MM"
                        type="time"
                        register={register}
                        error={errors.notificationTime}
                    />
                    <TextInput
                        label="Search Query"
                        name="searchQuery"
                        placeholder="e.g., Product Name or Keyword"
                        register={register}
                        error={errors.searchQuery}
                    />
                    <TextInput
                        label="Relevancy Score (0-100)"
                        name="relevancyScore"
                        placeholder="e.g., 75"
                        type="number"
                        register={register}
                        error={errors.relevancyScore}
                    />
                </div>
                <MultiEmailSelector 
                    label={"Email List"} 
                    emailsListError={emailsListError} 
                    emailsList={emailsList} 
                    setEmailsList={setEmailsList} 
                />

                <div className="flex justify-between mt-6">
                    <Button type="submit" variant="primary" size="md" disabled={loading}>
                        {loading ? "Creating..." : "Create Reminder"}
                    </Button>
                    <Button onClick={handleCancel} variant="secondary" size="md">
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default BidForm;