import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, FileText, ArrowRight, Tag } from 'lucide-react';

export default function ContentCard({ topic, onOpenPdf }) {
  const { title, slug, categorySlug, description, thumbnailUrl, youtubeUrl, instagramUrl, pdfUrl, pdfName, tags } = topic;

  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full group border border-slate-800">
      {/* Card Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        <img
          src={thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
        
        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-dark-900/80 backdrop-blur-md text-brand-300 border border-brand-500/30">
          {topic.categoryName || 'Topic'}
        </span>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/learn/${categorySlug || 'topic'}/${slug}`} className="group-hover:text-brand-300 transition-colors">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{title}</h3>
        </Link>

        <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50">
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Available Resources Toolbar - PRD Section 5: ONLY show when existing! */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* YouTube Badge */}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium hover:bg-red-500/20 hover:scale-105 transition-all"
                title="Watch YouTube Tutorial"
              >
                <Youtube className="w-3.5 h-3.5 fill-current" />
                <span>YouTube</span>
              </a>
            )}

            {/* Instagram Badge */}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 text-xs font-medium hover:bg-pink-500/20 hover:scale-105 transition-all"
                title="View Instagram Reel"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Reel</span>
              </a>
            )}

            {/* PDF Notes Badge */}
            {pdfUrl && (
              <button
                onClick={() => onOpenPdf ? onOpenPdf(pdfUrl, pdfName || title) : window.open(pdfUrl, '_blank')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium hover:bg-blue-500/20 hover:scale-105 transition-all"
                title="Read PDF Notes"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes</span>
              </button>
            )}
          </div>

          <Link
            to={`/learn/${categorySlug || 'topic'}/${slug}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="View Topic Details"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
