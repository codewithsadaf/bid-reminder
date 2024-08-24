import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
    recipients: [String],
    candidateName: String,
    searchQuery: String,
    frequency: String,
    day: String,
    time: String,
}, {
    timestamps: true,
});

export const Reminder = mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);
