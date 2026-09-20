import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

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
    learn_topics: [
      {
        id: 'top_js_func',
        categoryId: 'cat_js',
        categoryName: 'JavaScript',
        categorySlug: 'javascript',
        title: 'JavaScript Functions',
        slug: 'functions',
        description: 'Master function declarations, arrow functions, closures, scopes, and higher-order functions in modern JavaScript.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80',
        youtubeUrl: 'https://www.youtube.com/watch?v=gigtS1aC5GE',
        instagramUrl: 'https://www.instagram.com/reel/C3_sample_js_funcs/',
        pdfUrl: '/uploads/sample-js-functions.pdf',
        pdfName: 'JS_Functions_Complete_Guide.pdf',
        tags: ['Functions', 'Closures', 'Arrow Functions', 'ES6'],
        created_at: new Date().toISOString()
      },
      {
        id: 'top_js_async',
        categoryId: 'cat_js',
        categoryName: 'JavaScript',
        categorySlug: 'javascript',
        title: 'Async JavaScript & Promises',
        slug: 'async-javascript',
        description: 'Understand the Event Loop, Call Stack, Promises, async/await, and fetching API data cleanly.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80',
        youtubeUrl: 'https://www.youtube.com/watch?v=PoRJizFvM7s',
        instagramUrl: 'https://www.instagram.com/reel/C3_sample_async/',
        pdfUrl: '/uploads/sample-async-js.pdf',
        pdfName: 'Async_JS_Event_Loop.pdf',
        tags: ['Async', 'Promises', 'Event Loop', 'API'],
        created_at: new Date().toISOString()
      },
      {
        id: 'top_py_ds',
        categoryId: 'cat_python',
        categoryName: 'Python',
        categorySlug: 'python',
        title: 'Python Data Structures',
        slug: 'data-structures',
        description: 'Deep dive into Python Lists, Dictionaries, Sets, Tuples, list comprehensions, and memory efficiency.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        youtubeUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        instagramUrl: 'https://www.instagram.com/reel/C3_sample_py_ds/',
        pdfUrl: '/uploads/sample-python-ds.pdf',
        pdfName: 'Python_Data_Structures_CheatSheet.pdf',
        tags: ['Lists', 'Dicts', 'Comprehensions', 'Data Structures'],
        created_at: new Date().toISOString()
      },
      {
        id: 'top_react_state',
        categoryId: 'cat_react',
        categoryName: 'React',
        categorySlug: 'react',
        title: 'React State & Hooks',
        slug: 'state-and-hooks',
        description: 'Learn useState, useEffect, useRef, useMemo, custom hooks, and state management patterns.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        youtubeUrl: 'https://www.youtube.com/watch?v=TNhaISOUy68',
        instagramUrl: '',
        pdfUrl: '/uploads/sample-react-hooks.pdf',
        pdfName: 'React_Hooks_Handbook.pdf',
        tags: ['Hooks', 'useState', 'useEffect', 'Frontend'],
        created_at: new Date().toISOString()
      },
      {
        id: 'top_dsa_arrays',
        categoryId: 'cat_dsa',
        categoryName: 'DSA',
        categorySlug: 'dsa',
        title: 'Arrays & Two Pointers Pattern',
        slug: 'arrays-and-two-pointers',
        description: 'Master sliding window, two pointers, prefix sums, and array manipulation techniques for coding interviews.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516116211223-4c71418704ce?auto=format&fit=crop&w=800&q=80',
        youtubeUrl: 'https://www.youtube.com/watch?v=On03HWe2tZM',
        instagramUrl: 'https://www.instagram.com/reel/C3_sample_dsa/',
        pdfUrl: '/uploads/sample-two-pointers.pdf',
        pdfName: 'Two_Pointers_Patterns.pdf',
        tags: ['Arrays', 'Two Pointers', 'Sliding Window', 'Algorithms'],
        created_at: new Date().toISOString()
      },
      {
        id: 'top_sql_joins',
        categoryId: 'cat_sql',
        categoryName: 'SQL',
        categorySlug: 'sql',
        title: 'SQL Joins & Grouping',
        slug: 'joins-and-grouping',
        description: 'INNER JOIN, LEFT JOIN, FULL JOIN, GROUP BY, HAVING, and window functions explained step by step.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        youtubeUrl: 'https://www.youtube.com/watch?v=9yeOJ0ZMUYw',
        instagramUrl: '',
        pdfUrl: '/uploads/sample-sql-joins.pdf',
        pdfName: 'SQL_Joins_Mastery.pdf',
        tags: ['SQL', 'Database', 'Joins', 'Queries'],
        created_at: new Date().toISOString()
      }
    ],
    practice_problems: [
      {
        id: 'prob_1',
        title: 'Two Sum',
        slug: 'two-sum',
        type: 'leetcode',
        leetcodeNumber: 1,
        leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
        difficulty: 'Easy',
        topic: 'Arrays',
        headingId: 'sec_dsa',
        learnTopicId: 'top_dsa_arrays',
        statement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', rawInput: '[2,7,11,15], 9', expected: '[0,1]' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]', rawInput: '[3,2,4], 6', expected: '[1,2]' }
        ],
        starterCode: {
          javascript: 'function twoSum(nums, target) {\n  // Write your solution here\n  \n}',
          python: 'def twoSum(nums, target):\n    # Write your solution here\n    pass',
          cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n    return {};\n}',
          java: 'public int[] twoSum(int[] nums, int target) {\n    // Write your solution here\n    return new int[]{};\n}'
        },
        compilerLang: 'javascript',
        isTodaysChallenge: false,
        created_at: new Date().toISOString()
      },
      {
        id: 'prob_2',
        title: 'Product of Array Except Self',
        slug: 'product-of-array-except-self',
        type: 'leetcode',
        leetcodeNumber: 238,
        leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/',
        difficulty: 'Medium',
        topic: 'Arrays',
        headingId: 'sec_dsa',
        learnTopicId: 'top_dsa_arrays',
        statement: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. Must run in O(n) time and without using division operator.',
        constraints: '2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30',
        examples: [
          { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', rawInput: '[1,2,3,4]', expected: '[24,12,8,6]' },
          { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]', rawInput: '[-1,1,0,-3,3]', expected: '[0,0,9,0,0]' }
        ],
        starterCode: {
          javascript: 'function productExceptSelf(nums) {\n  // Write your solution here\n  \n}',
          python: 'def productExceptSelf(nums):\n    # Write your solution here\n    pass',
          cpp: 'vector<int> productExceptSelf(vector<int>& nums) {\n    // Write your solution here\n    return {};\n}',
          java: 'public int[] productExceptSelf(int[] nums) {\n    // Write your solution here\n    return new int[]{};\n}'
        },
        compilerLang: 'javascript',
        isTodaysChallenge: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'prob_3',
        title: 'Reverse a String',
        slug: 'reverse-a-string',
        type: 'custom',
        leetcodeNumber: null,
        leetcodeUrl: '',
        difficulty: 'Easy',
        topic: 'Strings',
        headingId: 'sec_js',
        learnTopicId: 'top_js_func',
        statement: 'Write a function `reverseString(str)` that takes a string input and returns the string reversed. Do not use built-in .reverse() array method!',
        constraints: '1 <= str.length <= 1000\nString contains alphanumeric characters and spaces.',
        examples: [
          { input: 'str = "hello"', output: '"olleh"', rawInput: '"hello"', expected: '"olleh"' },
          { input: 'str = "JavaScript"', output: '"tpircSavaJ"', rawInput: '"JavaScript"', expected: '"tpircSavaJ"' }
        ],
        starterCode: {
          javascript: 'function reverseString(str) {\n  // Write your solution here\n  \n}',
          python: 'def reverseString(str):\n    # Write your solution here\n    pass',
          cpp: 'string reverseString(string str) {\n    // Write your solution here\n    return "";\n}',
          java: 'public String reverseString(String str) {\n    // Write your solution here\n    return "";\n}'
        },
        compilerLang: 'javascript',
        isTodaysChallenge: false,
        created_at: new Date().toISOString()
      },
      {
        id: 'prob_4',
        title: 'Valid Anagram',
        slug: 'valid-anagram',
        type: 'leetcode',
        leetcodeNumber: 242,
        leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
        difficulty: 'Easy',
        topic: 'Strings',
        headingId: 'sec_daily',
        learnTopicId: '',
        statement: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
        constraints: '1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.',
        examples: [
          { input: 's = "anagram", t = "nagaram"', output: 'true', rawInput: '"anagram", "nagaram"', expected: 'true' },
          { input: 's = "rat", t = "car"', output: 'false', rawInput: '"rat", "car"', expected: 'false' }
        ],
        starterCode: {
          javascript: 'function isAnagram(s, t) {\n  // Write your solution here\n  \n}',
          python: 'def isAnagram(s: str, t: str) -> bool:\n    # Write your solution here\n    pass',
          cpp: 'bool isAnagram(string s, string t) {\n    // Write your solution here\n    return false;\n}',
          java: 'public boolean isAnagram(String s, String t) {\n    // Write your solution here\n    return false;\n}'
        },
        compilerLang: 'javascript',
        isTodaysChallenge: false,
        created_at: new Date().toISOString()
      },
      {
        id: 'prob_5',
        title: 'FizzBuzz Classic',
        slug: 'fizzbuzz-classic',
        type: 'custom',
        leetcodeNumber: null,
        leetcodeUrl: '',
        difficulty: 'Easy',
        topic: 'Basics',
        headingId: 'sec_python',
        learnTopicId: 'top_py_ds',
        statement: 'Write a function `fizzBuzz(n)` that returns an array of strings from 1 to n where multiples of 3 are "Fizz", multiples of 5 are "Buzz", and multiples of both are "FizzBuzz".',
        constraints: '1 <= n <= 100',
        examples: [
          { input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]', rawInput: '5', expected: '["1","2","Fizz","4","Buzz"]' }
        ],
        starterCode: {
          javascript: 'function fizzBuzz(n) {\n  // Write your solution here\n  \n}',
          python: 'def fizzBuzz(n):\n    # Write your solution here\n    pass',
          cpp: 'vector<string> fizzBuzz(int n) {\n    // Write your solution here\n    return {};\n}',
          java: 'public List<String> fizzBuzz(int n) {\n    // Write your solution here\n    return new ArrayList<>();\n}'
        },
        compilerLang: 'javascript',
        isTodaysChallenge: false,
        created_at: new Date().toISOString()
      }
    ],
    media_files: [],
    todays_challenge_id: 'prob_2'
  };
};

class Database {
  constructor() {
    this.data = null;
    this.init();
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
    return newUser;
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
    return user;
  }

  updateUserPassword(id, newHash) {
    const user = this.findUserById(id);
    if (user) {
      user.password_hash = newHash;
      this.save();
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
      return this.data.practice_sections[idx];
    }
    return null;
  }

  deleteSection(id) {
    const idx = this.data.practice_sections.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.practice_sections.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  reorderSections(orderedIds) {
    orderedIds.forEach((id, index) => {
      const sec = this.data.practice_sections.find(s => s.id === id);
      if (sec) {
        sec.displayOrder = index + 1;
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
      return this.data.learn_topics[idx];
    }
    return null;
  }

  deleteTopic(id) {
    const idx = this.data.learn_topics.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.data.learn_topics.splice(idx, 1);
      this.save();
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
      isTodaysChallenge: Boolean(problemData.isTodaysChallenge),
      created_at: new Date().toISOString()
    };

    if (newProblem.isTodaysChallenge) {
      this.data.practice_problems.forEach(p => p.isTodaysChallenge = false);
      this.data.todays_challenge_id = newProblem.id;
    }

    this.data.practice_problems.unshift(newProblem);
    this.save();
    return newProblem;
  }

  updateProblem(id, updates) {
    const idx = this.data.practice_problems.findIndex(p => p.id === id);
    if (idx !== -1) {
      if (updates.isTodaysChallenge) {
        this.data.practice_problems.forEach(p => p.isTodaysChallenge = false);
        this.data.todays_challenge_id = id;
      }
      this.data.practice_problems[idx] = {
        ...this.data.practice_problems[idx],
        ...updates
      };
      this.save();
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
          if (newToday) newToday.isTodaysChallenge = true;
        }
      }
      this.save();
      return true;
    }
    return false;
  }

  setTodaysChallenge(problemId) {
    const problem = this.findProblemById(problemId);
    if (!problem) return null;

    this.data.practice_problems.forEach(p => {
      p.isTodaysChallenge = (p.id === problemId);
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
    return newMedia;
  }

  getMediaFiles() {
    return [...this.data.media_files].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

export const db = new Database();
