import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FolderArchive, Upload, Copy, Check, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function AdminMediaPage() {
  const { token } = useAuth();
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchMedia = () => {
    fetch('/api/admin/media')
      .then(r => r.json())
      .then(data => setMediaFiles(data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      fetchMedia();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url, id) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FolderArchive className="w-6 h-6 text-blue-400" />
            <span>Media Library & Notes Storage</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Upload and manage PDFs and image thumbnails</p>
        </div>

        <label className="px-4 py-2 rounded-xl gradient-button text-white text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload File (PDF / Image)'}</span>
          <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mediaFiles.map((file) => (
          <div key={file.id} className="glass-card p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {file.fileType === 'pdf' ? (
                  <span className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><FileText className="w-4 h-4" /></span>
                ) : (
                  <span className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><ImageIcon className="w-4 h-4" /></span>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{file.originalName}</h4>
                  <p className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>

              <a href={file.fileUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white" title="Open file">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[10px] truncate max-w-[180px]">{file.fileUrl}</span>
              <button
                onClick={() => handleCopy(file.fileUrl, file.id)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 text-[11px]"
              >
                {copiedId === file.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === file.id ? 'Copied' : 'Copy URL'}</span>
              </button>
            </div>
          </div>
        ))}

        {mediaFiles.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 italic glass-card rounded-2xl">
            No media files uploaded yet. Click "Upload File" above to add PDF notes or images.
          </div>
        )}
      </div>

    </div>
  );
}
