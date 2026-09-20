import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Lock, Flame, Sparkles, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  if (!isOpen) return null;

  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register(username, password, name);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-dark-800 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-brand-500 to-purple-500 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
            <Flame className="w-7 h-7 text-white animate-bounce" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {mode === 'login' ? 'Welcome Back, Learner!' : 'Join CodingHub & Track Progress'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Log in to sync your streak 🔥 and solved problem status.'
              : 'Create an account to build daily coding habits and earn solved ticks ✓.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`py-2 rounded-lg transition-all ${mode === 'login' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`py-2 rounded-lg transition-all ${mode === 'register' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Display Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Code"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Username</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-button text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{loading ? 'Please wait...' : mode === 'login' ? 'Log In to Account' : 'Register & Start Streak'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
