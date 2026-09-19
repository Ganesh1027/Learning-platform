import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ultimate-coding-hub-secret-key-2026';

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

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

router.get('/me', authMiddleware, (req, res) => {
  return res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      name: req.user.name,
      role: req.user.role
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
