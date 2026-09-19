import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Youtube, Instagram, FileText, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-dark-900/80 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Coding Content & Practice Hub</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Your centralized personal coding ecosystem connecting Instagram reels, YouTube in-depth tutorials, PDF notes, and curated coding practice problems.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors"
                title="YouTube Channel"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-pink-500/20 hover:text-pink-400 text-slate-300 transition-colors"
                title="Instagram Reels"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300 mb-4">Ecosystem</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-300 transition-colors">Home Spotlight</Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-brand-300 transition-colors">Learn & Topics</Link>
              </li>
              <li>
                <Link to="/practice" className="hover:text-brand-300 transition-colors">Practice Problems</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-300 transition-colors">Creator Bio</Link>
              </li>
            </ul>
          </div>

          {/* Core Philosophy */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300 mb-4">Learning Path</h4>
            <div className="text-xs space-y-2 text-slate-400">
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-400 shrink-0" />
                <span>Watch Tutorials</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Read PDF Notes</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Solve Practice Problems</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Coding Content & Practice Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
