import React, { useEffect, useState } from 'react';
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
    weeklyNotificationDay: yup.string().oneOf(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 'Invalid day').required('Weekly notification day is required'),
    notificationTime: yup.string().required('Notification time is required'),
    searchQuery: yup.string().required('Search query is required'),
    relevancyScore: yup.number().min(0).max(100).required('Relevancy score is required'),
});

const BidForm = () => {
    const { register, control, reset, formState: { errors } } = useForm({
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


    useEffect(() => {
        if (!emailsList?.length) {
            setEmailsListError("*At least one email required*")
        }else{
        setEmailsListError("")
        }
    }, [emailsList])

    const handleSubmit = async (data) => {
        setLoading(true);
        setSubmitError(null);
        try {
            console.log("data >>>>>>", data);
            const payLoad = {
                "recipients": data?.emailsList,
                "frequency": data?.relevancyScore,
                "day": data?.weeklyNotificationDay,
                "time": data?.notificationTime,
                "searchQuery": data?.searchQuery,
                "candidateName": "Jhon Doe",
                "interval":data?.notificationInterval
            }
            console.log("payLoad handleSubmit >>>>>>>", payLoad);
            const response = await axios.post('/api/email', payLoad, { headers: {
                'Content-Type': 'application/json',
            }} );
            console.log("response >>>>>>>>>",response);
            alert("Form submitted successfully!");
            reset();
        } catch (error) {
            setSubmitError("An error occurred while submitting the form. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        reset();
    };

    return (
        <div className="p-2">
            <h2 className="text-2xl font-bold mb-4">Manage Bid Notification</h2>
            <h5 className="text-lg mb-4">Configure your email notification settings for relevant business bids</h5>
            {submitError && <p className="text-red-500">{submitError}</p>}
            <Form onSubmit={handleSubmit} validationSchema={yupResolver(schema)}>
                <TextInput
                    label="Notification Interval"
                    name="notificationInterval"
                    placeholder="Notification Interval here"
                    register={register}
                    error={errors.notificationInterval}
                />
                <SelectInput
                    label="Weekly Notification Day"
                    name="weeklyNotificationDay"
                    options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
                    defaultValue={''}
                    control={control}
                    error={errors.weeklyNotificationDay}
                />
                <TextInput
                    label="Notification Time"
                    name="notificationTime"
                    placeholder="Notification Time"
                    type="time"
                    register={register}
                    error={errors.notificationTime}
                />
                <TextInput
                    label="Search Query"
                    name="searchQuery"
                    placeholder="Search Query here"
                    register={register}
                    error={errors.searchQuery}
                />
                <MultiEmailSelector label={"Email list"} emailsListError={emailsListError} emailsList={emailsList} setEmailsList={setEmailsList} />
                <TextInput
                    label="Relevancy Score"
                    name="relevancyScore"
                    placeholder="Relevancy Score here"
                    register={register}
                    error={errors.relevancyScore}
                />
                <Button type="submit" className='m-2' variant="primary" size="md" disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </Button>
                <Button onClick={handleCancel} className='m-2' variant="secondary" size="md">
                    Cancel
                </Button>
            </Form>
        </div>
    );
};

export default BidForm;