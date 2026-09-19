import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layers, Plus, Edit, Trash2, ArrowUp, ArrowDown, Check, X, AlertCircle } from 'lucide-react';

export default function AdminSectionsPage() {
  const { token } = useAuth();

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    displayOrder: 1,
    status: 'active'
  });
  const [error, setError] = useState('');

  const fetchSections = () => {
    fetch('/api/practice/sections?admin=true')
      .then(r => r.json())
      .then(data => setSections(data || []))
      .catch(err => console.error('Error fetching practice sections:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleOpenModal = (secToEdit = null) => {
    if (secToEdit) {
      setEditingSection(secToEdit);
      setFormData({
        name: secToEdit.name || '',
        description: secToEdit.description || '',
        displayOrder: secToEdit.displayOrder || 1,
        status: secToEdit.status || 'active'
      });
    } else {
      setEditingSection(null);
      setFormData({
        name: '',
        description: '',
        displayOrder: sections.length + 1,
        status: 'active'
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name) {
      setError('Section name is required');
      return;
    }

    const method = editingSection ? 'PUT' : 'POST';
    const url = editingSection ? `/api/practice/admin/practice-sections/${editingSection.id}` : '/api/practice/admin/practice-sections';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save section');

      setIsModalOpen(false);
      fetchSections();
    } catch (err) {
      setError(err.message || 'Error saving section');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    try {
      const res = await fetch(`/api/practice/admin/practice-sections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete section');
      fetchSections();
    } catch (err) {
      alert(err.message || 'Error deleting section');
    }
  };

  const handleToggleStatus = async (sec) => {
    const newStatus = sec.status === 'active' ? 'disabled' : 'active';
    try {
      const res = await fetch(`/api/practice/admin/practice-sections/${sec.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');
      fetchSections();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReorder = async (index, direction) => {
    const newArr = [...sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newArr.length) return;

    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;

    const orderedIds = newArr.map(s => s.id);

    try {
      const res = await fetch('/api/practice/admin/practice-sections/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderedIds })
      });

      if (!res.ok) throw new Error('Failed to reorder sections');
      fetchSections();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" />
            <span>Manage Practice Sections / Headings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, order, and toggle practice headings dynamically stored in database (PRD Section 14, 15, 16).
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 rounded-xl gradient-button text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Practice Section</span>
        </button>
      </div>

      {/* Sections Table - PRD Section 14 */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Display Order</th>
                <th className="px-4 py-3">Section Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {sections.map((sec, idx) => (
                <tr key={sec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white w-6">{sec.displayOrder}</span>
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleReorder(idx, 'up')}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={idx === sections.length - 1}
                          onClick={() => handleReorder(idx, 'down')}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3.5 font-bold text-white">
                    {sec.name}
                  </td>

                  <td className="px-4 py-3.5 text-slate-400 max-w-xs truncate">
                    {sec.description || 'No description provided.'}
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleToggleStatus(sec)}
                      className={`px-2.5 py-0.5 rounded-full font-semibold border text-xs transition-colors ${
                        sec.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {sec.status === 'active' ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(sec)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Edit Section"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sec.id)}
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition-colors"
                      title="Delete Section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Section Modal - PRD Section 15 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-dark-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-dark-900">
              <h3 className="font-bold text-base text-white">
                {editingSection ? 'Edit Practice Section' : 'Add Practice Section'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {error && <div className="p-3 rounded-lg bg-rose-500/20 text-rose-300">{error}</div>}

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Section Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React, SQL, Interview Problems"
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief overview of problems in this section..."
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gradient-button text-white font-bold"
                >
                  {editingSection ? 'Save Section Changes' : 'Create Section'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
