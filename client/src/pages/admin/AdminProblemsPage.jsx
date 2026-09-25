import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Terminal, Plus, Edit, Trash2, Sparkles, Code2, ExternalLink, Search, X, Check, ListPlus, FileCode } from 'lucide-react';

export default function AdminProblemsPage() {
  const { token } = useAuth();

  const [sections, setSections] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'leetcode',
    leetcodeNumber: '',
    leetcodeUrl: '',
    difficulty: 'Easy',
    topic: 'Arrays',
    headingId: '',
    learnTopicId: '',
    statement: '',
    constraints: '',
    starterCodeJs: '',
    starterCodePy: '',
    youtubeUrl: '',
    instagramUrl: '',
    pdfUrl: '',
    pdfName: '',
    notes: '',
    isTodaysChallenge: false,
    examples: [
      { input: 'n = 5', rawInput: '5', output: '0 2 4' }
    ]
  });
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [error, setError] = useState('');

  const fetchProblemsData = () => {
    Promise.all([
      fetch('/api/practice/sections?admin=true').then(r => r.json()),
      fetch('/api/practice/problems').then(r => r.json())
    ])
    .then(([sectionsData, problemsData]) => {
      setSections(sectionsData || []);
      setProblems(problemsData || []);
      if (sectionsData && sectionsData.length > 0 && !formData.headingId) {
        setFormData(prev => ({ ...prev, headingId: sectionsData[0].id }));
      }
    })
    .catch(err => console.error('Error fetching practice problems:', err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProblemsData();
  }, []);

  const handleOpenModal = (problemToEdit = null) => {
    if (problemToEdit) {
      setEditingProblem(problemToEdit);
      
      const jsCode = typeof problemToEdit.starterCode === 'object' ? (problemToEdit.starterCode?.javascript || '') : (problemToEdit.starterCode || '');
      const pyCode = typeof problemToEdit.starterCode === 'object' ? (problemToEdit.starterCode?.python || '') : '';

      setFormData({
        title: problemToEdit.title || '',
        type: problemToEdit.type || 'leetcode',
        leetcodeNumber: problemToEdit.leetcodeNumber || '',
        leetcodeUrl: problemToEdit.leetcodeUrl || '',
        difficulty: problemToEdit.difficulty || 'Easy',
        topic: problemToEdit.topic || 'Arrays',
        headingId: problemToEdit.headingId || (sections[0]?.id || ''),
        learnTopicId: problemToEdit.learnTopicId || '',
        statement: problemToEdit.statement || '',
        constraints: problemToEdit.constraints || '',
        starterCodeJs: jsCode,
        starterCodePy: pyCode,
        youtubeUrl: problemToEdit.youtubeUrl || '',
        instagramUrl: problemToEdit.instagramUrl || '',
        pdfUrl: problemToEdit.pdfUrl || '',
        pdfName: problemToEdit.pdfName || '',
        notes: problemToEdit.notes || '',
        isTodaysChallenge: Boolean(problemToEdit.isTodaysChallenge),
        examples: Array.isArray(problemToEdit.examples) && problemToEdit.examples.length > 0 ? problemToEdit.examples : [
          { input: 'n = 5', rawInput: '5', output: '0 2 4' }
        ]
      });
    } else {
      setEditingProblem(null);
      setFormData({
        title: '',
        type: 'leetcode',
        leetcodeNumber: '',
        leetcodeUrl: '',
        difficulty: 'Easy',
        topic: 'Arrays',
        headingId: sections[0]?.id || '',
        learnTopicId: '',
        statement: '',
        constraints: '',
        starterCodeJs: '',
        starterCodePy: '',
        youtubeUrl: '',
        instagramUrl: '',
        pdfUrl: '',
        pdfName: '',
        notes: '',
        isTodaysChallenge: false,
        examples: [
          { input: 'n = 5', rawInput: '5', output: '0 2 4' }
        ]
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  // Dynamic Test Case Handlers
  const handleAddTestCase = () => {
    setFormData(prev => ({
      ...prev,
      examples: [
        ...prev.examples,
        { input: '', rawInput: '', output: '' }
      ]
    }));
  };

  const handleRemoveTestCase = (index) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    setUploadingPdf(true);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setFormData(prev => ({ ...prev, pdfUrl: json.url, pdfName: file.name }));
    } catch (err) {
      alert(err.message || 'PDF upload failed');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleTestCaseChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.examples];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, examples: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.headingId) {
      setError('Title and Heading Section are required');
      return;
    }

    // Format starterCode object with both JS and Python templates
    const fnSlug = formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'solution';
    const firstParam = formData.examples[0]?.input ? (formData.examples[0].input.match(/([a-zA-Z0-9_$]+)\s*=/)?.[1] || 'n') : 'n';

    const starterCodeObj = {
      javascript: formData.starterCodeJs || `function ${fnSlug}(${firstParam}) {\n  // Write your solution here\n  \n}`,
      python: formData.starterCodePy || `def ${fnSlug}(${firstParam}):\n    # Write your solution here\n    pass`
    };

    const payload = {
      ...formData,
      starterCode: starterCodeObj
    };

    const method = editingProblem ? 'PUT' : 'POST';
    const url = editingProblem ? `/api/practice/admin/practice-problems/${editingProblem.id}` : '/api/practice/admin/practice-problems';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save problem');

      setIsModalOpen(false);
      fetchProblemsData();
    } catch (err) {
      setError(err.message || 'Error saving problem');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;

    try {
      const res = await fetch(`/api/practice/admin/practice-problems/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete problem');
      fetchProblemsData();
    } catch (err) {
      alert(err.message || 'Error deleting problem');
    }
  };

  const handleSetTodaysChallenge = async (id) => {
    try {
      const res = await fetch('/api/practice/admin/todays-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problemId: id })
      });

      if (!res.ok) throw new Error('Failed to set Today\'s Challenge');
      fetchProblemsData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredProblems = problems.filter(p =>
    !searchQuery ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.headingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Terminal className="w-6 h-6 text-emerald-400" />
            <span>Manage Practice Problems</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add LeetCode & Custom problems. Define function signatures and test case inputs/outputs.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 rounded-xl gradient-button text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Practice Problem</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search practice problems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Problem Title</th>
                <th className="px-4 py-3">Heading Section</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Test Cases</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Today's Challenge</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-white">
                    <div className="space-y-0.5">
                      <div>{problem.title}</div>
                      <div className="text-[11px] font-normal text-slate-400">Topic: {problem.topic}</div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-brand-500/15 text-brand-300 border border-brand-500/30 font-medium">
                      {problem.headingName || 'Unassigned'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    {problem.type === 'leetcode' ? (
                      <span className="px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 font-mono">
                        LeetCode #{problem.leetcodeNumber || ''}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 font-mono">
                        Custom
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-[11px] border border-slate-700">
                      {problem.examples ? problem.examples.length : 0} Test Cases
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${
                      problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                      problem.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    {problem.isTodaysChallenge ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center gap-1 w-max border border-amber-500/40">
                        <Sparkles className="w-3 h-3 text-amber-400 fill-current" />
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetTodaysChallenge(problem.id)}
                        className="text-slate-500 hover:text-amber-400 transition-colors"
                        title="Set as Today's Challenge"
                      >
                        Set Active
                      </button>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(problem)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Edit Problem & Function Templates"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(problem.id)}
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition-colors"
                      title="Delete Problem"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProblems.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500 italic">
                    No problems found. Click "Add Practice Problem" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Problem Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-dark-800 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-dark-900">
              <h3 className="font-bold text-base text-white">
                {editingProblem ? 'Edit Practice Problem & Starter Templates' : 'Add Practice Problem & Starter Templates'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {error && <div className="p-3 rounded-lg bg-rose-500/20 text-rose-300">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Problem Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Even Integers"
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  />
                </div>

                {/* HEADING DROPDOWN */}
                <div className="space-y-1">
                  <label className="font-bold text-amber-300 flex items-center gap-1">
                    <span>Heading / Section Dropdown *</span>
                  </label>
                  <select
                    required
                    value={formData.headingId}
                    onChange={(e) => setFormData({ ...formData, headingId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-amber-500/50 text-white font-semibold focus:outline-none focus:border-amber-400"
                  >
                    {sections.map(sec => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name} ({sec.status === 'active' ? 'Active' : 'Disabled'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Problem Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  >
                    <option value="leetcode">LeetCode</option>
                    <option value="custom">Custom Problem</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Difficulty *</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Topic</label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g. Arrays, Loops, Math"
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* LeetCode Specific Fields */}
              {formData.type === 'leetcode' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <div className="space-y-1">
                    <label className="font-semibold text-orange-300">LeetCode Number</label>
                    <input
                      type="number"
                      value={formData.leetcodeNumber}
                      onChange={(e) => setFormData({ ...formData, leetcodeNumber: e.target.value })}
                      placeholder="e.g. 238"
                      className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-orange-300">LeetCode URL</label>
                    <input
                      type="url"
                      value={formData.leetcodeUrl}
                      onChange={(e) => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                      placeholder="https://leetcode.com/problems/..."
                      className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>
              )}

              {/* Problem Statement */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Problem Statement</label>
                <textarea
                  rows="3"
                  value={formData.statement}
                  onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                  placeholder="Given n, print 0 to n Even integers."
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              {/* Constraints */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Constraints</label>
                <input
                  type="text"
                  value={formData.constraints}
                  onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                  placeholder="e.g. 0 <= n <= 1000"
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              {/* DYNAMIC TEST CASES INPUT MANAGER SECTION */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListPlus className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">Compiler Test Cases (Input & Expected Output)</h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTestCase}
                    className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1 text-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Test Case</span>
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  {formData.examples.map((ex, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 relative group">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 text-xs">Test Case #{idx + 1}</span>
                        {formData.examples.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTestCase(idx)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                            title="Remove Test Case"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Display Input Label</label>
                          <input
                            type="text"
                            value={ex.input || ''}
                            onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                            placeholder='e.g. n = 5'
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Raw Input Argument</label>
                          <input
                            type="text"
                            value={ex.rawInput || ''}
                            onChange={(e) => handleTestCaseChange(idx, 'rawInput', e.target.value)}
                            placeholder='e.g. 5'
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-emerald-400 font-semibold block mb-0.5">Expected Output *</label>
                          <input
                            type="text"
                            required
                            value={ex.output || ex.expected || ''}
                            onChange={(e) => handleTestCaseChange(idx, 'output', e.target.value)}
                            placeholder='e.g. 0 2 4'
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/50 text-white font-mono text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STARTER FUNCTION CODE TEMPLATES FOR BOTH PYTHON & JAVASCRIPT */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-purple-400" />
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Custom Language Starter Code Templates</h4>
                </div>
                <p className="text-[11px] text-slate-400">
                  Enter starter template signatures for Python and JavaScript. Leave blank to auto-generate from Title and Parameters.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-purple-300">Python Template (e.g. def even_integers(n):)</label>
                    <textarea
                      rows="3"
                      value={formData.starterCodePy}
                      onChange={(e) => setFormData({ ...formData, starterCodePy: e.target.value })}
                      placeholder={"def even_integers(n):\n    # Write your solution here\n    pass"}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-brand-300">JavaScript Template (e.g. function even_integers(n))</label>
                    <textarea
                      rows="3"
                      value={formData.starterCodeJs}
                      onChange={(e) => setFormData({ ...formData, starterCodeJs: e.target.value })}
                      placeholder={"function even_integers(n) {\n  // Write your solution here\n  \n}"}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-white"
                    />
                  </div>
                </div>
              </div>
              {/* PROBLEM SOLUTION MEDIA & NOTES (YouTube, Instagram, PDF Notes, Notes) */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Solution Media & Notes (YouTube, Instagram, PDF)</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-red-400 text-xs">YouTube Solution Video URL</label>
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-pink-400 text-xs">Instagram Reel Solution URL</label>
                    <input
                      type="url"
                      value={formData.instagramUrl}
                      onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                      placeholder="https://www.instagram.com/reel/..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-blue-400 text-xs">PDF Notes / Editorial Document</label>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold text-xs cursor-pointer transition-colors flex items-center gap-1.5 border border-blue-500/40">
                        <span>{uploadingPdf ? 'Uploading...' : 'Upload PDF'}</span>
                        <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
                      </label>
                      {formData.pdfUrl && (
                        <span className="text-xs text-emerald-400 truncate max-w-[200px]" title={formData.pdfName || formData.pdfUrl}>
                          ✓ {formData.pdfName || 'PDF Uploaded'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300 text-xs">Solution / Editorial Notes</label>
                    <textarea
                      rows="2"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Key takeaways, time complexity analysis, or approach notes..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Today's Challenge Flag */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="todaysChallenge"
                  checked={formData.isTodaysChallenge}
                  onChange={(e) => setFormData({ ...formData, isTodaysChallenge: e.target.checked })}
                  className="w-4 h-4 rounded bg-dark-900 border-slate-700 text-brand-600 focus:ring-0"
                />
                <label htmlFor="todaysChallenge" className="font-semibold text-amber-300 cursor-pointer flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Set as Today's Challenge on Homepage Spotlight</span>
                </label>
              </div>

              {/* Submit Actions */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gradient-button text-white font-bold"
                >
                  {editingProblem ? 'Save Problem & Templates' : 'Publish Problem & Templates'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
