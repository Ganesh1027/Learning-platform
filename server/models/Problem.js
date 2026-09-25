import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  input: String,
  output: String,
  rawInput: String,
  expected: String
}, { _id: false });

const problemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  type: { type: String, default: 'leetcode' },
  leetcodeNumber: { type: Number, default: null },
  leetcodeUrl: { type: String, default: '' },
  difficulty: { type: String, default: 'Easy' },
  topic: { type: String, default: 'General' },
  headingId: { type: String, required: true },
  learnTopicId: { type: String, default: '' },
  statement: { type: String, default: '' },
  constraints: { type: String, default: '' },
  examples: [exampleSchema],
  starterCode: { type: mongoose.Schema.Types.Mixed, default: {} },
  compilerLang: { type: String, default: 'javascript' },
  youtubeUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  pdfUrl: { type: String, default: '' },
  pdfName: { type: String, default: '' },
  notes: { type: String, default: '' },
  isTodaysChallenge: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Problem || mongoose.model('Problem', problemSchema);
