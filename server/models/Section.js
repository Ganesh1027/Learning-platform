import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, default: '' },
  displayOrder: { type: Number, default: 1 },
  status: { type: String, default: 'active' },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Section || mongoose.model('Section', sectionSchema);
