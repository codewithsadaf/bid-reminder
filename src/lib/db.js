import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error('Failed to connect to MongoDB');
    }
};

export default connectToDatabase;