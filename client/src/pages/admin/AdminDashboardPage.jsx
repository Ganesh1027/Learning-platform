import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Terminal, Layers, FolderArchive, Sparkles, Plus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching admin stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-slate-400">Loading dashboard stats...</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage educational topics, practice problem sections, media notes, and platform structure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/problems"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Practice Problem</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Educational Topics</span>
            <BookOpen className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.topicsCount || 0}</div>
          <Link to="/admin/content" className="text-xs text-brand-400 hover:underline flex items-center gap-1">
            <span>Manage Topics</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Practice Problems</span>
            <Terminal className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.problemsCount || 0}</div>
          <Link to="/admin/problems" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
            <span>Manage Problems</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Practice Sections</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.sectionsCount || 0}</div>
          <Link to="/admin/practice-sections" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
            <span>Manage Headings</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Media & PDFs</span>
            <FolderArchive className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.mediaCount || 0}</div>
          <Link to="/admin/media" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
            <span>View Library</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Today's Challenge Info */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Current Today's Challenge</span>
          </h3>
          <Link to="/admin/problems" className="text-xs text-slate-400 hover:text-white">Change Challenge</Link>
        </div>

        {stats?.todaysChallenge ? (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-base">{stats.todaysChallenge.title}</h4>
              <p className="text-xs text-slate-400">Topic: {stats.todaysChallenge.topic} · Difficulty: {stats.todaysChallenge.difficulty}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              Active Challenge
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No Today's Challenge currently selected.</p>
        )}
      </div>

      {/* Quick Creator Guidance */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 to-brand-900/30 border border-purple-500/30 space-y-3">
        <h3 className="font-bold text-white text-sm">PRD Rule Reminder: Dropdown Categorization</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          When adding practice problems, always select from the dynamic Heading Dropdown (loaded from database). Problems automatically appear under their assigned section on the public site!
        </p>
      </div>

    </div>
  );
}
