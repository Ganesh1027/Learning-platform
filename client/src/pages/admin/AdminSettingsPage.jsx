import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, User, Lock, KeyRound, Check, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, token } = useAuth();

  const [username, setUsername] = useState(user?.username || 'admin');
  const [name, setName] = useState(user?.name || 'Creator Admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials');

      if (data.token) {
        localStorage.setItem('hub_admin_token', data.token);
      }

      setSuccessMsg('Admin username and security credentials updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-400" />
          <span>Admin Security & Account Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Change your admin login username, display name, and password securely.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6 text-xs">
        
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 font-semibold">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Profile Information Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-brand-400" />
            <span>Account Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Creator Admin"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-purple-300">Admin Login Username *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or mycustomuser"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-purple-500/50 text-white font-semibold focus:outline-none focus:border-purple-400 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Password Security Section */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Change Admin Password (Optional)</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Current Password (Required only if changing password)</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Action */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl gradient-button text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Settings & Credentials'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
