import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, BookOpen, Terminal, User, Menu, X, Sparkles, Flame, LogIn, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Header() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const navLinks = [
    { name: 'Home', path: '/', icon: Code2 },
    { name: 'Learn', path: '/learn', icon: BookOpen },
    { name: 'Practice', path: '/practice', icon: Terminal },
    { name: 'About', path: '/about', icon: User },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              Coding<span className="text-brand-glow">Hub</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">v1.1</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-brand-400' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Daily Streak Badge */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm animate-pulse">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{user?.streak || 1} {user?.streak === 1 ? 'Day' : 'Days'} Streak</span>
            </div>
          ) : (
            <button
              onClick={() => openAuth('register')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Start Streak 🔥</span>
            </button>
          )}

          {/* Today's Challenge Quick Link */}
          <Link
            to="/practice"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-500/20 to-purple-500/20 border border-brand-500/30 text-brand-300 text-xs font-medium hover:scale-105 transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Today's Challenge</span>
          </Link>

          {/* User Account / Auth Actions */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 text-white font-bold flex items-center justify-center text-[10px] uppercase">
                  {user?.name ? user.name[0] : (user?.username ? user.username[0] : 'U')}
                </div>
                <span className="font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                  {user?.name || user?.username}
                </span>
                {user?.solvedProblems && user.solvedProblems.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" />
                    {user.solvedProblems.length}
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuth('login')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => openAuth('register')}
                className="hidden sm:flex px-3.5 py-1.5 rounded-xl gradient-button text-white text-xs font-bold transition-all shadow-sm"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-dark-900/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  active
                    ? 'bg-brand-500/20 text-white border border-brand-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-brand-400' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
}
