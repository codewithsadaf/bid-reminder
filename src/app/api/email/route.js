import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectToDatabase from '@/lib/db';
import { Reminder } from '../../models/reminder';
import "../../../lib/scheduler"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

const sendNotificationEmail = async ({ recipient, candidateName, searchQuery }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'Notification from Bid Reminder',
        text: `Hello!\n\nThis is ${candidateName}. You’ve requested notifications about ${searchQuery}.\n\nHave a great day,\n\n${candidateName}`,
    };

    try {
        const sendMailResp = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipient}`);
        console.log(`sendMailResp >>>>>>>`, sendMailResp);
    } catch (error) {
        console.error(`Error sending email to ${recipient}:`, error);
        throw new Error(`Failed to send email to ${recipient}`);
    }
};

export async function POST(req) {
    try {
        await connectToDatabase();

        const { recipients, candidateName, searchQuery, frequency, day, time, relevancyScore } = await req.json();

        if (!recipients || !candidateName || !searchQuery || !Array.isArray(recipients)) {
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }
        if (typeof relevancyScore !== 'number' || relevancyScore < 0 || relevancyScore > 100) {
            return NextResponse.json({ error: 'Invalid relevancy score' }, { status: 400 });
        }
        console.log("payload >>>>>>>>>", {
            recipients,
            candidateName,
            searchQuery,
            frequency,
            day,
            time,
            relevancyScore,
        });
        await Reminder.create({
            recipients,
            candidateName,
            searchQuery,
            frequency,
            relevancyScore,
            day,
            time,
        });

        if (relevancyScore >= 100) { 
            for (const recipient of recipients) {
                await sendNotificationEmail({ recipient, candidateName, searchQuery });
            }
        }

        return NextResponse.json({ success: true, message: 'Notifications sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error handling POST request:', error.message);
        return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
    }
}
