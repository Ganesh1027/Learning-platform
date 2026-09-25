import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import Problem from './models/Problem.js';
import Topic from './models/Topic.js';
import Section from './models/Section.js';
import User from './models/User.js';
import Media from './models/Media.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Default initial data
const getInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('admin123', salt);

  return {
    users: [
      {
        id: 'usr_admin_1',
        username: 'admin',
        password_hash: passwordHash,
        name: 'Creator Admin',
        role: 'admin',
        created_at: new Date().toISOString()
      }
    ],
    practice_sections: [
      {
        id: 'sec_daily',
        name: 'Daily Problems',
        slug: 'daily-problems',
        description: 'Daily fresh coding challenges to stay sharp.',
        displayOrder: 1,
        status: 'active',
        created_at: new Date().toISOString()
      },
      {
        id: 'sec_dsa',
        name: 'DSA',
        slug: 'dsa',
        description: 'Core Data Structures and Algorithms interview problems.',
        displayOrder: 2,
        status: 'active',
        created_at: new Date().toISOString()
      },
      {
        id: 'sec_js',
        name: 'JavaScript',
        slug: 'javascript',
        description: 'Modern JavaScript coding challenges and DOM questions.',
        displayOrder: 3,
        status: 'active',
        created_at: new Date().toISOString()
      },
      {
        id: 'sec_python',
        name: 'Python',
        slug: 'python',
        description: 'Python syntax, algorithms, and data processing problems.',
        displayOrder: 4,
        status: 'active',
        created_at: new Date().toISOString()
      },
      {
        id: 'sec_random',
        name: 'Random Problems',
        slug: 'random-problems',
        description: 'Fun mixed problems from various topics and contests.',
        displayOrder: 5,
        status: 'active',
        created_at: new Date().toISOString()
      }
    ],
    learn_categories: [
      { id: 'cat_js', name: 'JavaScript', slug: 'javascript', icon: 'FileCode', displayOrder: 1 },
      { id: 'cat_python', name: 'Python', slug: 'python', icon: 'Terminal', displayOrder: 2 },
      { id: 'cat_react', name: 'React', slug: 'react', icon: 'Atom', displayOrder: 3 },
      { id: 'cat_sql', name: 'SQL', slug: 'sql', icon: 'Database', displayOrder: 4 },
      { id: 'cat_dsa', name: 'DSA', slug: 'dsa', icon: 'Binary', displayOrder: 5 },
      { id: 'cat_html_css', name: 'HTML & CSS', slug: 'html-css', icon: 'Layout', displayOrder: 6 },
      { id: 'cat_other', name: 'Other', slug: 'other', icon: 'Folder', displayOrder: 7 }
    ],
    learn_topics: [],
    practice_problems: [],
    media_files: [],
    todays_challenge_id: null
  };
};

class Database {
  constructor() {
    this.data = null;
    this.isMongoConnected = false;
    this.init();
    this.connectMongo();
  }

  async connectMongo() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learning-platform';
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      });
      this.isMongoConnected = true;
      console.log(`🍃 Connected to MongoDB successfully (${mongoUri.includes('127.0.0.1') ? 'Local MongoDB' : 'Cloud MongoDB'})`);
      await this.loadFromMongo();
    } catch (err) {
      console.warn('⚠️ MongoDB connection deferred/offline, using local JSON database:', err.message);
      this.isMongoConnected = false;
    }
  }

  async loadFromMongo() {
    if (!this.isMongoConnected) return;

    try {
      const dbProblems = await Problem.find().lean();
      const dbTopics = await Topic.find().lean();
      const dbSections = await Section.find().lean();
      const dbUsers = await User.find().lean();
      const dbMedia = await Media.find().lean();

      if (dbProblems.length > 0) {
        this.data.practice_problems = dbProblems.map(p => ({ ...p, created_at: p.created_at ? new Date(p.created_at).toISOString() : new Date().toISOString() }));
      }
      if (dbTopics.length > 0) {
        this.data.learn_topics = dbTopics.map(t => ({ ...t, created_at: t.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString() }));
      }
      if (dbSections.length > 0) {
        this.data.practice_sections = dbSections.map(s => ({ ...s, created_at: s.created_at ? new Date(s.created_at).toISOString() : new Date().toISOString() }));
      }
      if (dbUsers.length > 0) {
        this.data.users = dbUsers.map(u => ({ ...u, created_at: u.created_at ? new Date(u.created_at).toISOString() : new Date().toISOString() }));
      }
      if (dbMedia.length > 0) {
        this.data.media_files = dbMedia.map(m => ({ ...m, created_at: m.created_at ? new Date(m.created_at).toISOString() : new Date().toISOString() }));
      }

      this.save();
    } catch (err) {
      console.error('Error loading data from MongoDB:', err);
    }
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.data = getInitialData();
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        const initial = getInitialData();
        for (const key of Object.keys(initial)) {
          if (!this.data[key]) {
            this.data[key] = initial[key];
          }
        }
        // Ensure user fields exist
        const todayStr = new Date().toISOString().split('T')[0];
        (this.data.users || []).forEach(u => {
          if (u.streak === undefined) u.streak = 1;
          if (!u.lastActiveDate) u.lastActiveDate = todayStr;
          if (!Array.isArray(u.solvedProblems)) u.solvedProblems = [];
        });
      } catch (err) {
        console.error('Error reading db.json, creating new database file:', err);
        this.data = getInitialData();
        this.save();
      }
    }
  }

  save() {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  // Force reseed DB
  resetSeedData() {
    this.data = getInitialData();
    this.save();
  }

  syncProblemMongo(problemData, isDelete = false) {
    if (!this.isMongoConnected) return;
    if (isDelete) {
      Problem.deleteOne({ id: problemData.id }).catch(e => console.error('Mongo sync error:', e));
    } else {
      Problem.findOneAndUpdate({ id: problemData.id }, problemData, { upsert: true, new: true }).catch(e => console.error('Mongo sync error:', e));
    }
  }

  syncTopicMongo(topicData, isDelete = false) {
    if (!this.isMongoConnected) return;
    if (isDelete) {
      Topic.deleteOne({ id: topicData.id }).catch(e => console.error('Mongo sync error:', e));
    } else {
      Topic.findOneAndUpdate({ id: topicData.id }, topicData, { upsert: true, new: true }).catch(e => console.error('Mongo sync error:', e));
    }
  }

  syncSectionMongo(sectionData, isDelete = false) {
    if (!this.isMongoConnected) return;
    if (isDelete) {
      Section.deleteOne({ id: sectionData.id }).catch(e => console.error('Mongo sync error:', e));
    } else {
      Section.findOneAndUpdate({ id: sectionData.id }, sectionData, { upsert: true, new: true }).catch(e => console.error('Mongo sync error:', e));
    }
  }

  syncUserMongo(userData, isDelete = false) {
    if (!this.isMongoConnected) return;
    if (isDelete) {
      User.deleteOne({ id: userData.id }).catch(e => console.error('Mongo sync error:', e));
    } else {
      User.findOneAndUpdate({ id: userData.id }, userData, { upsert: true, new: true }).catch(e => console.error('Mongo sync error:', e));
    }
  }

  syncMediaMongo(mediaData, isDelete = false) {
    if (!this.isMongoConnected) return;
    if (isDelete) {
      Media.deleteOne({ id: mediaData.id }).catch(e => console.error('Mongo sync error:', e));
    } else {
      Media.findOneAndUpdate({ id: mediaData.id }, mediaData, { upsert: true, new: true }).catch(e => console.error('Mongo sync error:', e));
    }
  }

  // User Operations
  findUserByUsername(username) {
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  registerUser({ username, password, name }) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const todayStr = new Date().toISOString().split('T')[0];

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      username: username.trim(),
      password_hash: passwordHash,
      name: name ? name.trim() : username.trim(),
      role: 'user',
      streak: 1,
      lastActiveDate: todayStr,
      solvedProblems: [],
      created_at: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.save();
    this.syncUserMongo(newUser);
    return newUser;
  }

  findOrCreateGoogleUser({ email, name, uid }) {
    const todayStr = new Date().toISOString().split('T')[0];
    let user = this.data.users.find(u => u.email === email || u.googleId === uid || u.username.toLowerCase() === (email ? email.split('@')[0].toLowerCase() : ''));

    if (user) {
      if (!user.googleId) user.googleId = uid;
      if (!user.email) user.email = email;
      this.updateUserStreak(user.id);
      this.save();
      this.syncUserMongo(user);
      return user;
    }

    const username = email ? email.split('@')[0] : `user_${Date.now().toString(36)}`;
    user = {
      id: `usr_g_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      googleId: uid,
      email: email || '',
      username: username,
      password_hash: '',
      name: name || username,
      role: 'user',
      streak: 1,
      lastActiveDate: todayStr,
      solvedProblems: [],
      created_at: new Date().toISOString()
    };

    this.data.users.push(user);
    this.save();
    this.syncUserMongo(user);
    return user;
  }

  updateUserStreak(id) {
    const user = this.findUserById(id);
    if (!user) return null;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayDate = new Date(todayStr);
    const lastDate = new Date(user.lastActiveDate || todayStr);

    const diffTime = Math.abs(todayDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (user.lastActiveDate === todayStr) {
      // Already active today, streak remains same
    } else if (diffDays === 1) {
      // Active yesterday, increment streak
      user.streak = (user.streak || 0) + 1;
    } else if (diffDays > 1) {
      // Missed a day or more, reset streak to 1
      user.streak = 1;
    }
    user.lastActiveDate = todayStr;
    this.save();
    this.syncUserMongo(user);
    return user;
  }

  markProblemSolved(userId, problemId) {
    const user = this.findUserById(userId);
    if (!user) return null;

    if (!Array.isArray(user.solvedProblems)) {
      user.solvedProblems = [];
    }

    if (!user.solvedProblems.includes(problemId)) {
      user.solvedProblems.push(problemId);
    }

    this.updateUserStreak(userId);
    this.save();
    this.syncUserMongo(user);
    return user;
  }

  updateUserPassword(id, newHash) {
    const user = this.findUserById(id);
    if (user) {
      user.password_hash = newHash;
      this.save();
      this.syncUserMongo(user);
      return true;
    }
    return false;
  }

  updateUserProfile(id, updates) {
    const user = this.findUserById(id);
    if (user) {
      if (updates.username) user.username = updates.username.trim();
      if (updates.name) user.name = updates.name.trim();
      if (updates.password_hash) user.password_hash = updates.password_hash;
      this.save();
      this.syncUserMongo(user);
      return user;
    }
    return null;
  }

  // Practice Sections Operations
  getSections() {
    return [...this.data.practice_sections].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getActiveSections() {
    return this.getSections().filter(s => s.status === 'active');
  }

  findSectionById(id) {
    return this.data.practice_sections.find(s => s.id === id);
  }

  addSection(sectionData) {
    const newSection = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: sectionData.name,
      slug: sectionData.slug || sectionData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: sectionData.description || '',
      displayOrder: Number(sectionData.displayOrder) || (this.data.practice_sections.length + 1),
      status: sectionData.status || 'active',
      created_at: new Date().toISOString()
    };
    this.data.practice_sections.push(newSection);
    this.save();
    this.syncSectionMongo(newSection);
    return newSection;
  }

  updateSection(id, updates) {
    const idx = this.data.practice_sections.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.practice_sections[idx] = {
        ...this.data.practice_sections[idx],
        ...updates,
        displayOrder: updates.displayOrder !== undefined ? Number(updates.displayOrder) : this.data.practice_sections[idx].displayOrder
      };
      this.save();
      this.syncSectionMongo(this.data.practice_sections[idx]);
      return this.data.practice_sections[idx];
    }
    return null;
  }

  deleteSection(id) {
    const idx = this.data.practice_sections.findIndex(s => s.id === id);
    if (idx !== -1) {
      const removed = this.data.practice_sections.splice(idx, 1)[0];
      this.save();
      this.syncSectionMongo(removed, true);
      return true;
    }
    return false;
  }

  reorderSections(orderedIds) {
    orderedIds.forEach((id, index) => {
      const sec = this.data.practice_sections.find(s => s.id === id);
      if (sec) {
        sec.displayOrder = index + 1;
        this.syncSectionMongo(sec);
      }
    });
    this.save();
    return this.getSections();
  }

  // Learn Categories
  getCategories() {
    return [...this.data.learn_categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  // Learn Topics Operations
  getTopics() {
    return [...this.data.learn_topics].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  findTopicBySlug(slug) {
    return this.data.learn_topics.find(t => t.slug === slug);
  }

  findTopicById(id) {
    return this.data.learn_topics.find(t => t.id === id);
  }

  addTopic(topicData) {
    const category = this.data.learn_categories.find(c => c.id === topicData.categoryId) || this.data.learn_categories[0];
    const newTopic = {
      id: `top_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      categoryId: category.id,
      categoryName: category.name,
      categorySlug: category.slug,
      title: topicData.title,
      slug: topicData.slug || topicData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: topicData.description || '',
      thumbnailUrl: topicData.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      youtubeUrl: topicData.youtubeUrl || '',
      instagramUrl: topicData.instagramUrl || '',
      pdfUrl: topicData.pdfUrl || '',
      pdfName: topicData.pdfName || '',
      tags: Array.isArray(topicData.tags) ? topicData.tags : (topicData.tags ? topicData.tags.split(',').map(t => t.trim()) : []),
      created_at: new Date().toISOString()
    };
    this.data.learn_topics.unshift(newTopic);
    this.save();
    this.syncTopicMongo(newTopic);
    return newTopic;
  }

  updateTopic(id, updates) {
    const idx = this.data.learn_topics.findIndex(t => t.id === id);
    if (idx !== -1) {
      if (updates.categoryId) {
        const cat = this.data.learn_categories.find(c => c.id === updates.categoryId);
        if (cat) {
          updates.categoryName = cat.name;
          updates.categorySlug = cat.slug;
        }
      }
      if (typeof updates.tags === 'string') {
        updates.tags = updates.tags.split(',').map(t => t.trim()).filter(Boolean);
      }
      this.data.learn_topics[idx] = {
        ...this.data.learn_topics[idx],
        ...updates
      };
      this.save();
      this.syncTopicMongo(this.data.learn_topics[idx]);
      return this.data.learn_topics[idx];
    }
    return null;
  }

  deleteTopic(id) {
    const idx = this.data.learn_topics.findIndex(t => t.id === id);
    if (idx !== -1) {
      const removed = this.data.learn_topics.splice(idx, 1)[0];
      this.save();
      this.syncTopicMongo(removed, true);
      return true;
    }
    return false;
  }

  // Practice Problems Operations
  getProblems() {
    return [...this.data.practice_problems].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  findProblemById(id) {
    return this.data.practice_problems.find(p => p.id === id);
  }

  findProblemBySlug(slug) {
    return this.data.practice_problems.find(p => p.slug === slug);
  }

  addProblem(problemData) {
    const newProblem = {
      id: `prob_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: problemData.title,
      slug: problemData.slug || problemData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: problemData.type || 'leetcode',
      leetcodeNumber: problemData.type === 'leetcode' ? (Number(problemData.leetcodeNumber) || null) : null,
      leetcodeUrl: problemData.type === 'leetcode' ? (problemData.leetcodeUrl || '') : '',
      difficulty: problemData.difficulty || 'Easy',
      topic: problemData.topic || 'General',
      headingId: problemData.headingId,
      learnTopicId: problemData.learnTopicId || '',
      statement: problemData.statement || '',
      constraints: problemData.constraints || '',
      examples: Array.isArray(problemData.examples) ? problemData.examples : [],
      starterCode: typeof problemData.starterCode === 'object' ? problemData.starterCode : {
        javascript: problemData.starterCode || `function solution() {\n  // Write your code here\n  \n}`,
        python: `def solution():\n    # Write your code here\n    pass`
      },
      compilerLang: problemData.compilerLang || 'javascript',
      youtubeUrl: problemData.youtubeUrl || '',
      instagramUrl: problemData.instagramUrl || '',
      pdfUrl: problemData.pdfUrl || '',
      pdfName: problemData.pdfName || '',
      notes: problemData.notes || '',
      isTodaysChallenge: Boolean(problemData.isTodaysChallenge),
      created_at: new Date().toISOString()
    };

    if (newProblem.isTodaysChallenge) {
      this.data.practice_problems.forEach(p => {
        p.isTodaysChallenge = false;
        this.syncProblemMongo(p);
      });
      this.data.todays_challenge_id = newProblem.id;
    }

    this.data.practice_problems.unshift(newProblem);
    this.save();
    this.syncProblemMongo(newProblem);
    return newProblem;
  }

  updateProblem(id, updates) {
    const idx = this.data.practice_problems.findIndex(p => p.id === id);
    if (idx !== -1) {
      if (updates.isTodaysChallenge) {
        this.data.practice_problems.forEach(p => {
          p.isTodaysChallenge = false;
          this.syncProblemMongo(p);
        });
        this.data.todays_challenge_id = id;
      }
      this.data.practice_problems[idx] = {
        ...this.data.practice_problems[idx],
        ...updates
      };
      this.save();
      this.syncProblemMongo(this.data.practice_problems[idx]);
      return this.data.practice_problems[idx];
    }
    return null;
  }

  deleteProblem(id) {
    const idx = this.data.practice_problems.findIndex(p => p.id === id);
    if (idx !== -1) {
      const removed = this.data.practice_problems.splice(idx, 1)[0];
      if (removed && removed.id === this.data.todays_challenge_id) {
        this.data.todays_challenge_id = this.data.practice_problems[0]?.id || null;
        if (this.data.todays_challenge_id) {
          const newToday = this.data.practice_problems.find(p => p.id === this.data.todays_challenge_id);
          if (newToday) {
            newToday.isTodaysChallenge = true;
            this.syncProblemMongo(newToday);
          }
        }
      }
      this.save();
      this.syncProblemMongo(removed, true);
      return true;
    }
    return false;
  }

  setTodaysChallenge(problemId) {
    const problem = this.findProblemById(problemId);
    if (!problem) return null;

    this.data.practice_problems.forEach(p => {
      p.isTodaysChallenge = (p.id === problemId);
      this.syncProblemMongo(p);
    });
    this.data.todays_challenge_id = problemId;
    this.save();
    return problem;
  }

  getTodaysChallenge() {
    let problem = this.data.practice_problems.find(p => p.id === this.data.todays_challenge_id);
    if (!problem && this.data.practice_problems.length > 0) {
      problem = this.data.practice_problems[0];
    }
    return problem || null;
  }

  // Media Operations
  addMedia(mediaData) {
    const newMedia = {
      id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      filename: mediaData.filename,
      originalName: mediaData.originalName,
      fileType: mediaData.fileType,
      fileUrl: mediaData.fileUrl,
      size: mediaData.size,
      created_at: new Date().toISOString()
    };
    this.data.media_files.unshift(newMedia);
    this.save();
    this.syncMediaMongo(newMedia);
    return newMedia;
  }

  getMediaFiles() {
    return [...this.data.media_files].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

export const db = new Database();
