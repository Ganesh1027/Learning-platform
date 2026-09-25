import express from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../middleware/auth.js';
import { executeJavaScript, executePython } from '../compilerEngine.js';

const router = express.Router();

// Public: Code Compilation & Output Verification Endpoint
router.post('/run-code', async (req, res) => {
  const { code, language = 'javascript', problemId, fnName } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const problem = db.findProblemById(problemId);
  const examples = problem?.examples && problem.examples.length > 0 ? problem.examples : [
    { input: 'str = "hello"', rawInput: '"hello"', output: '"olleh"' },
    { input: 'str = "JavaScript"', rawInput: '"JavaScript"', output: '"tpircSavaJ"' }
  ];

  const results = [];
  let passedCount = 0;

  for (let i = 0; i < examples.length; i++) {
    const ex = examples[i];
    const rawInput = ex.rawInput || (ex.input ? ex.input.replace(/^[a-zA-Z0-9_$]+\s*=\s*/, '') : '""');
    const expected = ex.output || ex.expected || '';

    let resEval;
    if (language === 'python') {
      resEval = await executePython(code, fnName, rawInput, expected);
    } else {
      resEval = executeJavaScript(code, fnName, rawInput, expected);
    }

    if (resEval.passed) passedCount++;

    results.push({
      testNum: i + 1,
      input: ex.input,
      expected: expected,
      actual: resEval.actual,
      passed: resEval.passed,
      logs: resEval.logs
    });
  }

  const allPassed = passedCount === examples.length && examples.length > 0;

  res.json({
    results,
    allPassed,
    summary: `Passed ${passedCount} of ${examples.length} test cases`,
    passedCount,
    totalCount: examples.length
  });
});

// Public: Get practice sections (headings)
router.get('/sections', (req, res) => {
  const isAdmin = req.query.admin === 'true';
  const sections = isAdmin ? db.getSections() : db.getActiveSections();
  res.json(sections);
});

// Admin: Add new practice section (heading)
router.post('/admin/practice-sections', authMiddleware, (req, res) => {
  const { name, description, displayOrder, status } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Section name is required' });
  }

  const section = db.addSection({
    name,
    description,
    displayOrder,
    status
  });

  res.status(201).json(section);
});

// Admin: Update practice section
router.put('/admin/practice-sections/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const updated = db.updateSection(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Section not found' });
  }
  res.json(updated);
});

// Admin: Delete practice section
router.delete('/admin/practice-sections/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const success = db.deleteSection(id);
  if (!success) {
    return res.status(404).json({ error: 'Section not found' });
  }
  res.json({ message: 'Section deleted successfully' });
});

// Admin: Reorder sections
router.post('/admin/practice-sections/reorder', authMiddleware, (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array required' });
  }

  const sections = db.reorderSections(orderedIds);
  res.json(sections);
});

// Public: Get Today's Challenge
router.get('/todays-challenge', (req, res) => {
  const problem = db.getTodaysChallenge();
  if (!problem) {
    return res.status(404).json({ error: 'No Today\'s Challenge set' });
  }

  const sections = db.getSections();
  const sec = sections.find(s => s.id === problem.headingId);

  res.json({
    ...problem,
    headingName: sec ? sec.name : 'Practice'
  });
});

// Public: Get practice problems with optional filters
router.get('/problems', (req, res) => {
  const { headingId, difficulty, type, topic, search } = req.query;
  let problems = db.getProblems();
  const sections = db.getSections();

  if (headingId && headingId !== 'all') {
    problems = problems.filter(p => p.headingId === headingId);
  }

  if (difficulty && difficulty !== 'all') {
    problems = problems.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (type && type !== 'all') {
    problems = problems.filter(p => p.type.toLowerCase() === type.toLowerCase());
  }

  if (topic && topic !== 'all') {
    problems = problems.filter(p => p.topic.toLowerCase() === topic.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    problems = problems.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.topic.toLowerCase().includes(q) ||
      p.statement.toLowerCase().includes(q)
    );
  }

  const enrichedProblems = problems.map(p => {
    const sec = sections.find(s => s.id === p.headingId);
    return {
      ...p,
      headingName: sec ? sec.name : 'Unassigned',
      headingSlug: sec ? sec.slug : 'unassigned'
    };
  });

  res.json(enrichedProblems);
});

// Public: Get single problem by ID or slug
router.get('/problems/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  let problem = db.findProblemById(idOrSlug) || db.findProblemBySlug(idOrSlug);

  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  const sections = db.getSections();
  const sec = sections.find(s => s.id === problem.headingId);

  res.json({
    ...problem,
    headingName: sec ? sec.name : 'Unassigned',
    headingSlug: sec ? sec.slug : 'unassigned'
  });
});

// Admin: Add practice problem
router.post('/admin/practice-problems', authMiddleware, (req, res) => {
  const { title, type, leetcodeNumber, leetcodeUrl, difficulty, topic, headingId, learnTopicId, statement, constraints, examples, starterCode, compilerLang, youtubeUrl, instagramUrl, pdfUrl, pdfName, notes, isTodaysChallenge } = req.body;

  if (!title || !headingId) {
    return res.status(400).json({ error: 'Title and Practice Section Heading are required' });
  }

  const problem = db.addProblem({
    title,
    type,
    leetcodeNumber,
    leetcodeUrl,
    difficulty,
    topic,
    headingId,
    learnTopicId,
    statement,
    constraints,
    examples,
    starterCode,
    compilerLang,
    youtubeUrl,
    instagramUrl,
    pdfUrl,
    pdfName,
    notes,
    isTodaysChallenge
  });

  res.status(201).json(problem);
});

// Admin: Update practice problem
router.put('/admin/practice-problems/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const updated = db.updateProblem(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Problem not found' });
  }
  res.json(updated);
});

// Admin: Delete practice problem
router.delete('/admin/practice-problems/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const success = db.deleteProblem(id);
  if (!success) {
    return res.status(404).json({ error: 'Problem not found' });
  }
  res.json({ message: 'Problem deleted successfully' });
});

// Admin: Set Today's Challenge
router.post('/admin/todays-challenge', authMiddleware, (req, res) => {
  const { problemId } = req.body;
  if (!problemId) {
    return res.status(400).json({ error: 'problemId is required' });
  }

  const updated = db.setTodaysChallenge(problemId);
  if (!updated) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  res.json({ message: 'Today\'s Challenge updated successfully', problem: updated });
});

export default router;
