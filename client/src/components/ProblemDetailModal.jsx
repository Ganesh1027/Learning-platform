import React, { useState } from 'react';
import { X, Code2, ExternalLink, Copy, Check, FileCode, Terminal, Sparkles } from 'lucide-react';

export default function ProblemDetailModal({ problem, onClose }) {
  if (!problem) return null;

  const [selectedLang, setSelectedLang] = useState('javascript');
  const [copied, setCopied] = useState(false);

  // Starter code templates per language
  const starterSnippets = {
    javascript: (p) => {
      if (typeof p.starterCode === 'object' && p.starterCode?.javascript) return p.starterCode.javascript;
      if (typeof p.starterCode === 'string' && p.starterCode.length > 0) return p.starterCode;
      const fnName = p.slug ? p.slug.replace(/-([a-z])/g, g => g[1].toUpperCase()) : 'solution';
      return `function ${fnName}(input) {\n  // Write your solution here\n  \n}`;
    },
    python: (p) => {
      if (typeof p.starterCode === 'object' && p.starterCode?.python) return p.starterCode.python;
      const fnName = p.slug ? p.slug.replace(/-([a-z])/g, g => g[1].toUpperCase()) : 'solution';
      return `def ${fnName}(input):\n    # Write your solution here\n    pass`;
    },
    cpp: (p) => {
      if (typeof p.starterCode === 'object' && p.starterCode?.cpp) return p.starterCode.cpp;
      return `#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Write your solution here\n`;
    },
    java: (p) => {
      if (typeof p.starterCode === 'object' && p.starterCode?.java) return p.starterCode.java;
      return `public class Solution {\n    // Write your solution here\n}`;
    }
  };

  const currentSnippet = (starterSnippets[selectedLang] || starterSnippets.javascript)(problem);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-dark-800 border border-slate-700/80 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-700/80 flex items-center justify-between bg-dark-900/90">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-brand-500/20 text-brand-300">
              <Code2 className="w-6 h-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-xl text-white">{problem.title}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  problem.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {problem.difficulty}
                </span>
                <span className="text-xs text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">
                  {problem.topic}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Section: {problem.headingName || 'Practice'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-dark-900/40">
          
          {/* Problem Statement */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-brand-400" />
              <span>Problem Statement</span>
            </h4>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {problem.statement}
            </div>
          </div>

          {/* Constraints */}
          {problem.constraints && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Constraints</h4>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">{problem.constraints}</pre>
              </div>
            </div>
          )}

          {/* Examples */}
          {problem.examples && problem.examples.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Examples & Expected Output</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="text-slate-400">
                      <span className="text-brand-400 font-bold block mb-0.5">Example #{i + 1} Input:</span>
                      <code className="text-slate-200 bg-slate-950 px-2 py-1 rounded block">{ex.input}</code>
                    </div>
                    <div className="text-slate-400">
                      <span className="text-emerald-400 font-bold block mb-0.5">Expected Output:</span>
                      <code className="text-emerald-300 bg-slate-950 px-2 py-1 rounded block">{ex.output}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Starter Code Snippets per Language */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span>Starter Code Snippet</span>
              </h4>

              {/* Language Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: 'javascript', label: 'JavaScript' },
                  { id: 'python', label: 'Python 3' },
                  { id: 'cpp', label: 'C++' },
                  { id: 'java', label: 'Java' }
                ].map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLang(lang.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      selectedLang === lang.id
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Box */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  {selectedLang.toUpperCase()} Template
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Template'}</span>
                </button>
              </div>

              <pre className="p-4 font-mono text-sm text-slate-200 overflow-x-auto whitespace-pre-wrap">
                {currentSnippet}
              </pre>
            </div>
          </div>

          {/* LeetCode Button if applicable */}
          {problem.type === 'leetcode' && (
            <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h5 className="font-bold text-orange-300 text-sm">LeetCode Problem #{problem.leetcodeNumber}</h5>
                <p className="text-xs text-slate-400">Open on LeetCode to submit solutions and run online test cases.</p>
              </div>
              <a
                href={problem.leetcodeUrl || `https://leetcode.com/problemset/all/?search=${encodeURIComponent(problem.title)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition-all shadow-lg shrink-0"
              >
                <span>Solve on LeetCode</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
