import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { X, Play, RefreshCw, CheckCircle, ExternalLink, Code2, AlertTriangle, Sparkles, Terminal, Check, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

import { useAuth } from '../context/AuthContext';

export default function CodeCompilerModal({ problem, onClose }) {
  if (!problem) return null;

  const { markProblemAsSolved } = useAuth();

  // Selected language state
  const [selectedLang, setSelectedLang] = useState(problem.compilerLang || 'python');

  // Extract parameter names dynamically from problem test case inputs (e.g. 'n = 5' -> 'n')
  const getParamNames = (p) => {
    if (p.examples && p.examples.length > 0) {
      const inputStr = p.examples[0].input || '';
      const params = [];
      const regex = /([a-zA-Z0-9_$]+)\s*=/g;
      let m;
      while ((m = regex.exec(inputStr)) !== null) {
        params.push(m[1]);
      }
      if (params.length > 0) return params.join(', ');
    }
    return 'n';
  };

  // Extract or format clean function name
  const getFnName = (p) => {
    if (p.slug) {
      return p.slug.replace(/-/g, '_');
    }
    return 'solution';
  };

  const defaultTemplates = {
    python: (p) => {
      if (typeof p.starterCode === 'object' && p.starterCode?.python) return p.starterCode.python;
      const fnName = getFnName(p);
      const params = getParamNames(p);
      return `def ${fnName}(${params}):\n    # Write your solution here\n    pass`;
    },
    javascript: (p) => {
      if (typeof p.starterCode === 'object' && p.starterCode?.javascript) return p.starterCode.javascript;
      if (typeof p.starterCode === 'string' && p.starterCode.length > 0 && !p.starterCode.includes('printEvenNumbers')) return p.starterCode;
      const fnName = getFnName(p);
      const params = getParamNames(p);
      return `function ${fnName}(${params}) {\n  // Write your solution here\n  \n}`;
    },
    cpp: (p) => {
      if (typeof p.starterCode === 'object' && p.starterCode?.cpp) return p.starterCode.cpp;
      const fnName = getFnName(p);
      const params = getParamNames(p);
      return `#include <iostream>\nusing namespace std;\n\nvoid ${fnName}(int ${params}) {\n    // Write your solution here\n}\n`;
    },
    java: (p) => {
      if (typeof p.starterCode === 'object' && p.starterCode?.java) return p.starterCode.java;
      const fnName = getFnName(p);
      const params = getParamNames(p);
      return `public class Solution {\n    public void ${fnName}(int ${params}) {\n        // Write your solution here\n    }\n}`;
    }
  };

  const [code, setCode] = useState(() => (defaultTemplates[selectedLang] || defaultTemplates.python)(problem));
  const [testResults, setTestResults] = useState([]);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [allPassed, setAllPassed] = useState(false);
  const [summary, setSummary] = useState('');

  // Switch language template dynamically
  useEffect(() => {
    const template = (defaultTemplates[selectedLang] || defaultTemplates.python)(problem);
    setCode(template);
    setTestResults([]);
    setConsoleOutput('');
    setAllPassed(false);
    setSummary('');
  }, [selectedLang, problem]);

  // Execute Code via Backend Compiler API
  const handleRunCode = async () => {
    setIsRunning(true);
    setTestResults([]);
    setConsoleOutput('');
    setAllPassed(false);
    setSummary('');

    try {
      const res = await fetch('/api/practice/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: selectedLang,
          problemId: problem.id,
          fnName: getFnName(problem)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Compilation failed');

      setTestResults(data.results || []);
      setAllPassed(Boolean(data.allPassed));
      setSummary(data.summary || '');

      const combinedLogs = (data.results || [])
        .map(r => r.logs)
        .filter(Boolean)
        .join('\n');
      setConsoleOutput(combinedLogs);

      if (data.allPassed) {
        if (problem?.id && markProblemAsSolved) {
          markProblemAsSolved(problem.id);
        }
        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.7 }
          });
        } catch (e) {}
      }

    } catch (err) {
      setSummary(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    const template = (defaultTemplates[selectedLang] || defaultTemplates.python)(problem);
    setCode(template);
    setTestResults([]);
    setConsoleOutput('');
    setAllPassed(false);
    setSummary('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-dark-800 border border-slate-700/80 rounded-2xl w-full max-w-6xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Bar */}
        <div className="px-6 py-3.5 border-b border-slate-700/80 flex items-center justify-between bg-dark-900/90">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-brand-500/20 text-brand-300">
              <Code2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">{problem.title}</h3>
                <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                  problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                  problem.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {problem.difficulty}
                </span>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {problem.topic}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/80 overflow-hidden">
          
          {/* Left Column: Problem Details & Examples */}
          <div className="p-6 overflow-y-auto space-y-6 bg-dark-900/40">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Problem Statement</h4>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {problem.statement}
              </p>
            </div>

            {/* Constraints */}
            {problem.constraints && (
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Constraints</h5>
                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">{problem.constraints}</pre>
              </div>
            )}

            {/* Test Case Examples */}
            {problem.examples && problem.examples.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Target Test Cases</h4>
                <div className="space-y-3">
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs space-y-1">
                      <div className="text-slate-400"><span className="text-brand-400 font-bold">Input:</span> {ex.input}</div>
                      <div className="text-slate-400"><span className="text-emerald-400 font-bold">Expected Output:</span> {ex.output}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LeetCode Direct Button */}
            {problem.type === 'leetcode' && (
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 space-y-2">
                <p>This is an official LeetCode problem. You can solve it directly on LeetCode or test your logic here.</p>
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-slate-950 font-bold hover:bg-orange-400 transition-colors"
                >
                  <span>Open LeetCode #{problem.leetcodeNumber}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Language Selector, Code Mirror Editor, Test Results */}
          <div className="flex flex-col h-full bg-slate-950/60 overflow-hidden">
            
            {/* Editor Toolbar with Language Selector */}
            <div className="px-4 py-2 bg-dark-900 border-b border-slate-800 flex items-center justify-between">
              
              {/* Language Selector Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-semibold">Language:</label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs font-semibold focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="python">Python 3</option>
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="cpp">C++ (GCC)</option>
                  <option value="java">Java 17</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
                  title="Reset Code Template"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-lg gradient-button text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isRunning ? 'Running Compiler...' : 'Run & Check Tests'}
                </button>
              </div>
            </div>

            {/* CodeMirror Code Area */}
            <div className="flex-1 overflow-auto font-mono text-sm">
              <CodeMirror
                value={code}
                height="100%"
                theme={vscodeDark}
                extensions={selectedLang === 'python' ? [python()] : [javascript({ jsx: true })]}
                onChange={(value) => setCode(value)}
                className="h-full"
              />
            </div>

            {/* Output & Strict Test Case Verification Results */}
            <div className="h-56 border-t border-slate-800 bg-dark-900 flex flex-col">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-brand-400" />
                  Compiler Execution & Test Case Output Checking
                </span>
                {allPassed ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle className="w-4 h-4" /> All Test Cases Passed!
                  </span>
                ) : summary ? (
                  <span className="text-rose-400 font-bold">{summary}</span>
                ) : null}
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-3 font-mono text-xs">
                {testResults.length > 0 ? (
                  <div className="space-y-2">
                    {testResults.map((res) => (
                      <div
                        key={res.testNum}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          res.passed
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            {res.passed ? <Check className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                            <span>Test Case #{res.testNum}: {res.passed ? 'PASSED' : 'FAILED'}</span>
                          </div>
                          <div className="text-[11px] text-slate-300 mt-1">
                            Input: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-white">{res.input}</code>
                          </div>
                        </div>

                        <div className="text-right text-[11px] space-y-0.5">
                          <div>Expected: <span className="text-emerald-400 font-bold">{res.expected}</span></div>
                          <div>Actual Output: <span className={res.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{res.actual}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 italic text-center py-6">
                    Write your solution code above and click <span className="text-brand-300 font-semibold">"Run & Check Tests"</span> to execute real compilation and verify return/print outputs.
                  </div>
                )}

                {consoleOutput && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Execution Log Output:</div>
                    <pre className="text-slate-300 text-xs whitespace-pre-wrap bg-slate-950 p-2 rounded">{consoleOutput}</pre>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
