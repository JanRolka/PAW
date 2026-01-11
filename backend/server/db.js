import mongoose from 'mongoose';

const MONGO_URL = 'mongodb://127.0.0.1:27017/myapp';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
