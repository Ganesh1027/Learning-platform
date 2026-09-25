import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password_hash: { type: String, default: '' },
  name: { type: String, default: '' },
  role: { type: String, default: 'user' },
  googleId: { type: String, default: '' },
  email: { type: String, default: '' },
  streak: { type: Number, default: 1 },
  lastActiveDate: { type: String, default: '' },
  solvedProblems: [String],
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
