import React from 'react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';

export default function PdfViewerModal({ pdfUrl, pdfTitle, onClose }) {
  if (!pdfUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-dark-800 border border-slate-700/80 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/80 flex items-center justify-between bg-dark-900/60">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-white">{pdfTitle || 'PDF Notes'}</h3>
              <p className="text-xs text-slate-400">Educational Notes & Cheatsheet</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Frame / Embed view */}
        <div className="flex-1 bg-slate-900 relative">
          <iframe
            src={pdfUrl}
            title={pdfTitle}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
