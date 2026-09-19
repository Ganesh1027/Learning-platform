import express from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public: Get all categories
router.get('/categories', (req, res) => {
  const categories = db.getCategories();
  res.json(categories);
});

// Public: Get all topics with optional search/category filter
router.get('/topics', (req, res) => {
  const { category, search } = req.query;
  let topics = db.getTopics();

  if (category && category !== 'all') {
    topics = topics.filter(t => t.categorySlug.toLowerCase() === category.toLowerCase() || t.categoryId === category);
  }

  if (search) {
    const q = search.toLowerCase();
    topics = topics.filter(t => 
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  }

  res.json(topics);
});

// Public: Get single topic by slug with related practice problems
router.get('/topics/:slug', (req, res) => {
  const { slug } = req.params;
  const topic = db.findTopicBySlug(slug);

  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' });
  }

  // Get related practice problems
  const allProblems = db.getProblems();
  const allSections = db.getSections();

  const relatedProblems = allProblems.filter(p => 
    p.learnTopicId === topic.id || 
    p.topic.toLowerCase() === topic.title.toLowerCase() ||
    (topic.tags && topic.tags.some(t => t.toLowerCase() === p.topic.toLowerCase()))
  ).map(p => {
    const section = allSections.find(s => s.id === p.headingId);
    return {
      ...p,
      headingName: section ? section.name : 'Practice'
    };
  });

  res.json({
    topic,
    relatedProblems
  });
});

// Protected Admin Routes
router.post('/admin/topics', authMiddleware, (req, res) => {
  const { title, categoryId, description, thumbnailUrl, youtubeUrl, instagramUrl, pdfUrl, pdfName, tags } = req.body;
  if (!title || !categoryId) {
    return res.status(400).json({ error: 'Title and category are required' });
  }

  const topic = db.addTopic({
    title,
    categoryId,
    description,
    thumbnailUrl,
    youtubeUrl,
    instagramUrl,
    pdfUrl,
    pdfName,
    tags
  });

  res.status(201).json(topic);
});

router.put('/admin/topics/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const updated = db.updateTopic(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  res.json(updated);
});

router.delete('/admin/topics/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const success = db.deleteTopic(id);
  if (!success) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  res.json({ message: 'Topic deleted successfully' });
});

export default router;
