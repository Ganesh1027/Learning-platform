import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  categoryId: { type: String, required: true },
  categoryName: { type: String, default: '' },
  categorySlug: { type: String, default: '' },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  youtubeUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  pdfUrl: { type: String, default: '' },
  pdfName: { type: String, default: '' },
  tags: [String],
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Topic || mongoose.model('Topic', topicSchema);
