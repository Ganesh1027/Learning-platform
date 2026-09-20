import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ultimate-coding-hub-secret-key-2026';

// Learner Registration Endpoint
router.post('/register', (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  const existing = db.findUserByUsername(username);
  if (existing) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  const newUser = db.registerUser({ username, password, name });
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      role: newUser.role,
      streak: newUser.streak || 1,
      solvedProblems: newUser.solvedProblems || []
    }
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = db.findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValid = bcrypt.compareSync(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Update streak on login
  const updatedUser = db.updateUserStreak(user.id) || user;

  const token = jwt.sign(
    { id: updatedUser.id, username: updatedUser.username, role: updatedUser.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return res.json({
    token,
    user: {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role,
      streak: updatedUser.streak || 1,
      solvedProblems: updatedUser.solvedProblems || []
    }
  });
});

router.get('/me', authMiddleware, (req, res) => {
  // Update streak on token check
  const updatedUser = db.updateUserStreak(req.user.id) || req.user;

  return res.json({
    user: {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role,
      streak: updatedUser.streak || 1,
      solvedProblems: updatedUser.solvedProblems || []
    }
  });
});

// Learner: Mark problem as solved & update streak
router.post('/solve-problem', authMiddleware, (req, res) => {
  const { problemId } = req.body;
  if (!problemId) {
    return res.status(400).json({ error: 'problemId is required' });
  }

  const updatedUser = db.markProblemSolved(req.user.id, problemId);
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    message: 'Problem marked as solved!',
    user: {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role,
      streak: updatedUser.streak || 1,
      solvedProblems: updatedUser.solvedProblems || []
    }
  });
});

// Update Profile & Change Admin Credentials (Username, Password, Name)
router.post('/update-profile', authMiddleware, (req, res) => {
  const { username, name, currentPassword, newPassword } = req.body;

  // If changing password, verify current password first
  let passwordHash = undefined;
  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required to set a new password' });
    }
    const isValid = bcrypt.compareSync(currentPassword, req.user.password_hash);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    const salt = bcrypt.genSaltSync(10);
    passwordHash = bcrypt.hashSync(newPassword, salt);
  }

  // Check if username is changing and is already taken by another account
  if (username && username.toLowerCase() !== req.user.username.toLowerCase()) {
    const existing = db.findUserByUsername(username);
    if (existing && existing.id !== req.user.id) {
      return res.status(400).json({ error: 'Username is already taken' });
    }
  }

  const updatedUser = db.updateUserProfile(req.user.id, {
    username,
    name,
    password_hash: passwordHash
  });

  // Re-issue JWT token with updated username if changed
  const newToken = jwt.sign(
    { id: updatedUser.id, username: updatedUser.username, role: updatedUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    message: 'Profile credentials updated successfully',
    token: newToken,
    user: {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role
    }
  });
});

export default router;
