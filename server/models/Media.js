import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  filename: { type: String, required: true },
  originalName: { type: String, default: '' },
  fileType: { type: String, default: 'image' },
  fileUrl: { type: String, required: true },
  size: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Media || mongoose.model('Media', mediaSchema);
