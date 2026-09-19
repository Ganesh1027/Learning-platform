import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Terminal, Search, Filter, Sparkles, Code2, Flame, Layers, ChevronDown } from 'lucide-react';
import ProblemCard from '../components/ProblemCard';
import CodeCompilerModal from '../components/CodeCompilerModal';

export default function PracticePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialHeadingFilter = searchParams.get('heading') || 'all';

  const [sections, setSections] = useState([]);
  const [problems, setProblems] = useState([]);
  const [selectedHeading, setSelectedHeading] = useState(initialHeadingFilter);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/practice/sections').then(r => r.json()),
      fetch('/api/practice/problems').then(r => r.json())
    ])
    .then(([sectionsData, problemsData]) => {
      setSections(sectionsData || []);
      setProblems(problemsData || []);
    })
    .catch(err => console.error('Error loading practice page:', err))
    .finally(() => setLoading(false));
  }, []);

  const filteredProblems = problems.filter(p => {
    const matchesHeading = selectedHeading === 'all' || p.headingId === selectedHeading;
    const matchesDifficulty = selectedDifficulty === 'all' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesType = selectedType === 'all' || p.type.toLowerCase() === selectedType.toLowerCase();
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.statement.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesHeading && matchesDifficulty && matchesType && matchesSearch;
  });

  const sectionsWithProblems = sections.map(sec => {
    const secProblems = filteredProblems.filter(p => p.headingId === sec.id);
    return {
      ...sec,
      problems: secProblems
    };
  }).filter(sec => {
    if (selectedHeading !== 'all') return sec.id === selectedHeading;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
          <Terminal className="w-3.5 h-3.5" />
          <span>Practice Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Coding Practice Problems</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Sharpen your problem-solving skills with curated LeetCode challenges and custom problems organized into creator-defined sections.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="🔍 Search problems by title, topic, or statement (e.g. Array, Two Sum, Reverse)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          
          {/* Section / Heading Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Heading Section</label>
            <select
              value={selectedHeading}
              onChange={(e) => {
                setSelectedHeading(e.target.value);
                setSearchParams(e.target.value === 'all' ? {} : { heading: e.target.value });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-white text-xs font-medium focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Headings ({sections.length})</option>
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-white text-xs font-medium focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Problem Type Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Problem Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-white text-xs font-medium focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Types (LeetCode & Custom)</option>
              <option value="leetcode">LeetCode Only</option>
              <option value="custom">Custom Problems Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Practice Sections rendering */}
      <div className="space-y-10">
        {sectionsWithProblems.map((section) => (
          <div key={section.id} className="space-y-4">
            
            {/* Section Heading Title */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-pulse" />
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  {section.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {section.problems.length} {section.problems.length === 1 ? 'problem' : 'problems'}
                </span>
              </div>
              
              {section.description && (
                <p className="text-xs text-slate-400 hidden md:block italic">{section.description}</p>
              )}
            </div>

            {/* Section Problems List */}
            {section.problems.length > 0 ? (
              <div className="space-y-3">
                {section.problems.map((prob) => (
                  <ProblemCard
                    key={prob.id}
                    problem={prob}
                    onSelectProblem={(p) => setSelectedProblem(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center text-slate-500 text-xs italic">
                No problems currently assigned under "{section.name}".
              </div>
            )}
          </div>
        ))}

        {sectionsWithProblems.length === 0 && (
          <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 space-y-3">
            <Terminal className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No practice problems match your search</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or resetting filters to view all practice headings.
            </p>
            <button
              onClick={() => {
                setSelectedHeading('all');
                setSelectedDifficulty('all');
                setSelectedType('all');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Code Compiler Modal */}
      {selectedProblem && (
        <CodeCompilerModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}
    </div>
  );
}
