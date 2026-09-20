import React from 'react';
import { ExternalLink, Code2, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProblemCard({ problem, onSelectProblem }) {
  const { user } = useAuth();
  const { id, title, type, leetcodeNumber, leetcodeUrl, difficulty, topic, headingName, isTodaysChallenge } = problem;

  const isSolved = user?.solvedProblems?.includes(id);

  const difficultyStyles = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  };

  const badgeClass = difficultyStyles[difficulty] || difficultyStyles.Easy;

  return (
    <div className={`glass-card glass-card-hover rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border relative group transition-all ${
      isSolved ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
    }`}>
      
      {/* Today's Challenge Accent Indicator */}
      {isTodaysChallenge && (
        <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
          <Sparkles className="w-3 h-3 fill-current" />
          Today's Challenge
        </div>
      )}

      <div className="space-y-1.5 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Solved Tick Badge */}
          {isSolved && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Solved</span>
            </span>
          )}

          {/* Problem Type Tag */}
          {type === 'leetcode' ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30 flex items-center gap-1">
              LeetCode #{leetcodeNumber || ''}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-brand-500/15 text-brand-300 border border-brand-500/30 flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              Custom Problem
            </span>
          )}

          {/* Difficulty Badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
            {difficulty}
          </span>

          {/* Topic Pill */}
          <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400 border border-slate-700/50">
            {topic}
          </span>

          {/* Section Heading Tag */}
          {headingName && (
            <span className="text-xs text-slate-500 hidden md:inline">
              in <span className="text-slate-400 font-medium">{headingName}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors cursor-pointer flex items-center gap-2" onClick={() => onSelectProblem(problem)}>
          <span>{title}</span>
          {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        </h4>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
        {type === 'leetcode' ? (
          <a
            href={leetcodeUrl || `https://leetcode.com/problemset/all/?search=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-orange-500/20 hover:text-orange-300 hover:border-orange-500/40 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
          >
            <span>Open LeetCode</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            onClick={() => onSelectProblem(problem)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-button text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span>Solve Challenge</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
