import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  surname: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
