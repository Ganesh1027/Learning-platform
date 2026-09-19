import React from 'react';
import { Youtube, Instagram, Code2, Terminal, FileText, CheckCircle, Sparkles, UserCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold border border-brand-500/30">
          <UserCheck className="w-3.5 h-3.5" />
          <span>About the Platform</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white">Coding Content & Practice Hub</h1>
        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          A centralized, creator-managed learning ecosystem built to bridge social media snippets with in-depth video tutorials, PDF documentation, and real coding practice.
        </p>
      </div>

      {/* Core Journey Card */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white text-center">The 5-Step Learning Pathway</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-2xl font-black text-pink-400">1</span>
            <h3 className="font-bold text-sm text-white">Discover</h3>
            <p className="text-xs text-slate-400">Instagram Reels & Short Clips</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-2xl font-black text-brand-400">2</span>
            <h3 className="font-bold text-sm text-white">Watch</h3>
            <p className="text-xs text-slate-400">YouTube Deep-Dives</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-2xl font-black text-blue-400">3</span>
            <h3 className="font-bold text-sm text-white">Read</h3>
            <p className="text-xs text-slate-400">Structured PDF Notes</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-2xl font-black text-emerald-400">4</span>
            <h3 className="font-bold text-sm text-white">Practice</h3>
            <p className="text-xs text-slate-400">LeetCode & Custom Sandbox</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-2xl font-black text-amber-400">5</span>
            <h3 className="font-bold text-sm text-white">Improve</h3>
            <p className="text-xs text-slate-400">Master Concepts & Interviews</p>
          </div>
        </div>
      </div>

      {/* Creator Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-brand-400" />
            <span>Complete Admin Control</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every section, problem, topic, and PDF resource on this hub is completely managed by the creator through a secure Admin Dashboard. Practice headings like DSA, Daily Problems, and JavaScript dynamically re-organize themselves without frontend modifications.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>Interactive Practice</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Users don't just watch videos—they actively solve coding problems. Whether practicing on LeetCode or writing code inside our browser sandbox, learners build real muscle memory.
          </p>
        </div>
      </div>
    </div>
  );
}
