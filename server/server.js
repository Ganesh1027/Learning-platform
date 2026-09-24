import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import learnRoutes from './routes/learnRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import { db } from './database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/admin', uploadRoutes);

// Direct shortcut route for Today's Challenge
app.get('/api/todays-challenge', (req, res) => {
  const problem = db.getTodaysChallenge();
  if (!problem) return res.status(404).json({ error: 'No challenge set' });
  const sections = db.getSections();
  const sec = sections.find(s => s.id === problem.headingId);
  res.json({ ...problem, headingName: sec ? sec.name : 'Practice' });
});

// General stats endpoint for Admin Dashboard
app.get('/api/admin/stats', (req, res) => {
  res.json({
    topicsCount: db.getTopics().length,
    problemsCount: db.getProblems().length,
    sectionsCount: db.getSections().length,
    activeSectionsCount: db.getActiveSections().length,
    mediaCount: db.getMediaFiles().length,
    todaysChallenge: db.getTodaysChallenge()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend dist build if present
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Coding Content & Practice Hub server running on http://localhost:${PORT}`);
});
