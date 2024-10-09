import cron from 'node-cron';
import nodemailer from 'nodemailer';
import connectToDatabase from './db';
import { Reminder } from '@/app/models/reminder';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

    const sendEmail = async (to, subject, candidateName, searchQuery) => {
        const emailContent = `
    Hello!

    This is ${candidateName}. You’ve requested notifications about ${searchQuery}.

    Have a great day,

    ${candidateName}
    `;

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                text: emailContent,
            });
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

const getCronExpression = (frequency, day, time) => {
    const [hour, minute] = time.split(':').map(Number);

    if (frequency === 'daily') {
        return `${minute} ${hour} * * *`;
    }

    if (frequency === 'weekly') {
        const daysOfWeek = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
        };
        return `${minute} ${hour} * * ${daysOfWeek[day]}`;
    }

    return '';
};

const scheduleEmails = async () => {
    try {
        await connectToDatabase();
        const allReminders = await Reminder.find().exec();
        console.log("allReminders >>>>>", allReminders);

        allReminders.forEach((notification) => {
            const { recipients, frequency, day, time, searchQuery, candidateName } = notification;
            const cronExpression = getCronExpression(frequency, day, time);

            if (cronExpression) {
                recipients.forEach((email) => {
                    cron.schedule(cronExpression, async () => {
                        await sendEmail(email, 'Notification Update', candidateName, searchQuery);
                    });

                    console.log(`Scheduled email for ${email} with cron expression: ${cronExpression}`);
                });
            } else {
                console.error(`Invalid cron expression for notification: ${notification}`);
            }
        });
    } catch (error) {
        console.error('Error scheduling emails:', error);
    }
};

scheduleEmails();