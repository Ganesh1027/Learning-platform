import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Plus, Edit, Trash2, Youtube, Instagram, FileText, Upload, Check, X, Search, Image as ImageIcon } from 'lucide-react';

export default function AdminContentPage() {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    thumbnailUrl: '',
    youtubeUrl: '',
    instagramUrl: '',
    pdfUrl: '',
    pdfName: '',
    tags: ''
  });
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const fetchContent = () => {
    Promise.all([
      fetch('/api/learn/categories').then(r => r.json()),
      fetch('/api/learn/topics').then(r => r.json())
    ])
    .then(([catData, topicData]) => {
      setCategories(catData || []);
      setTopics(topicData || []);
      if (catData && catData.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: catData[0].id }));
      }
    })
    .catch(err => console.error('Error fetching content:', err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleOpenModal = (topicToEdit = null) => {
    if (topicToEdit) {
      setEditingTopic(topicToEdit);
      setFormData({
        title: topicToEdit.title || '',
        categoryId: topicToEdit.categoryId || (categories[0]?.id || ''),
        description: topicToEdit.description || '',
        thumbnailUrl: topicToEdit.thumbnailUrl || '',
        youtubeUrl: topicToEdit.youtubeUrl || '',
        instagramUrl: topicToEdit.instagramUrl || '',
        pdfUrl: topicToEdit.pdfUrl || '',
        pdfName: topicToEdit.pdfName || '',
        tags: Array.isArray(topicToEdit.tags) ? topicToEdit.tags.join(', ') : (topicToEdit.tags || '')
      });
    } else {
      setEditingTopic(null);
      setFormData({
        title: '',
        categoryId: categories[0]?.id || '',
        description: '',
        thumbnailUrl: '',
        youtubeUrl: '',
        instagramUrl: '',
        pdfUrl: '',
        pdfName: '',
        tags: ''
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  // PDF File Upload Handler
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    if (type === 'pdf') setUploadingPdf(true);
    if (type === 'image') setUploadingImage(true);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      if (type === 'pdf') {
        setFormData(prev => ({ ...prev, pdfUrl: json.url, pdfName: file.name }));
      } else if (type === 'image') {
        setFormData(prev => ({ ...prev, thumbnailUrl: json.url }));
      }
    } catch (err) {
      alert(err.message || 'File upload error');
    } finally {
      if (type === 'pdf') setUploadingPdf(false);
      if (type === 'image') setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.categoryId) {
      setError('Title and Category are required');
      return;
    }

    const method = editingTopic ? 'PUT' : 'POST';
    const url = editingTopic ? `/api/learn/admin/topics/${editingTopic.id}` : '/api/learn/admin/topics';

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
      if (!res.ok) throw new Error(json.error || 'Failed to save topic');

      setIsModalOpen(false);
      fetchContent();
    } catch (err) {
      setError(err.message || 'Error saving topic');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this topic?')) return;

    try {
      const res = await fetch(`/api/learn/admin/topics/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete topic');
      fetchContent();
    } catch (err) {
      alert(err.message || 'Error deleting topic');
    }
  };

  const filteredTopics = topics.filter(t => 
    !searchQuery || 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-400" />
            <span>Manage Learn Content</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Upload tutorials, Instagram reels, and PDF notes under topics</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 rounded-xl gradient-button text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Educational Topic</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Topic Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Attached Resources</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredTopics.map((topic) => (
                <tr key={topic.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-white max-w-xs">
                    <div className="flex items-center gap-2">
                      <img src={topic.thumbnailUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0 bg-slate-800" />
                      <span className="line-clamp-1">{topic.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {topic.categoryName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {topic.youtubeUrl && <span className="p-1 rounded bg-red-500/20 text-red-400" title="YouTube"><Youtube className="w-3.5 h-3.5" /></span>}
                      {topic.instagramUrl && <span className="p-1 rounded bg-pink-500/20 text-pink-400" title="Instagram Reel"><Instagram className="w-3.5 h-3.5" /></span>}
                      {topic.pdfUrl && <span className="p-1 rounded bg-blue-500/20 text-blue-400" title="PDF Notes"><FileText className="w-3.5 h-3.5" /></span>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(topic)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Edit Topic"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(topic.id)}
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition-colors"
                      title="Delete Topic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTopics.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-slate-500 italic">
                    No topics found. Click "Add Educational Topic" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-dark-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-dark-900">
              <h3 className="font-bold text-base text-white">
                {editingTopic ? 'Edit Educational Topic' : 'Add Educational Topic'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {error && <div className="p-3 rounded-lg bg-rose-500/20 text-rose-300">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Topic Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. JavaScript Functions"
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed explanation of what this topic covers..."
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              {/* Thumbnail URL & Upload */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Thumbnail Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="Image URL or upload file..."
                    className="flex-1 px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer flex items-center gap-1 font-semibold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                  </label>
                </div>
              </div>

              {/* YouTube & Instagram Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 flex items-center gap-1">
                    <Youtube className="w-3.5 h-3.5 text-red-400" />
                    <span>YouTube Video URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 flex items-center gap-1">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>Instagram Reel URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://www.instagram.com/reel/..."
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* PDF Notes Upload */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>PDF Notes File / URL</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.pdfUrl}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    placeholder="/uploads/file.pdf or external link"
                    className="flex-1 px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer flex items-center gap-1 font-semibold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingPdf ? 'Uploading...' : 'Upload PDF'}</span>
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'pdf')} />
                  </label>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Functions, Closures, ES6"
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              {/* Submit Buttons */}
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
                  {editingTopic ? 'Save Changes' : 'Create Topic'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
