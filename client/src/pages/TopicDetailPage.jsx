import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Youtube, Instagram, FileText, ArrowLeft, BookOpen, Terminal, Sparkles, ExternalLink } from 'lucide-react';
import ProblemCard from '../components/ProblemCard';
import ProblemDetailModal from '../components/ProblemDetailModal';
import PdfViewerModal from '../components/PdfViewerModal';

export default function TopicDetailPage() {
  const { categorySlug, topicSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [activePdf, setActivePdf] = useState(null);

  useEffect(() => {
    fetch(`/api/learn/topics/${topicSlug}`)
      .then(res => {
        if (!res.ok) throw new Error('Topic not found');
        return res.json();
      })
      .then(resData => {
        setData(resData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [topicSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading topic details...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Topic Not Found</h2>
        <p className="text-sm text-slate-400">The requested learning topic could not be found.</p>
        <Link to="/learn" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" />
          Back to Learn Hub
        </Link>
      </div>
    );
  }

  const { topic, relatedProblems } = data;

  const getEmbedYoutubeUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getEmbedYoutubeUrl(topic.youtubeUrl);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button & Category Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link to="/learn" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Learn
        </Link>

        <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/30">
          {topic.categoryName || 'Category'}
        </span>
      </div>

      {/* Main Topic Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{topic.title}</h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
          {topic.description}
        </p>

        {/* Tags */}
        {topic.tags && topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {topic.tags.map((t, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-md text-xs bg-slate-800 text-slate-400 border border-slate-700/60">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Resources Bar */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          Available Topic Resources
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          {topic.youtubeUrl && (
            <a
              href={topic.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 text-red-300 border border-red-500/30 text-xs font-semibold hover:bg-red-500/25 transition-all"
            >
              <Youtube className="w-4 h-4 fill-current" />
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          )}

          {topic.instagramUrl && (
            <a
              href={topic.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500/15 text-pink-300 border border-pink-500/30 text-xs font-semibold hover:bg-pink-500/25 transition-all"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram Reel</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          )}

          {topic.pdfUrl && (
            <button
              onClick={() => setActivePdf({ url: topic.pdfUrl, name: topic.pdfName || topic.title })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30 text-xs font-semibold hover:bg-blue-500/25 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Read PDF Notes</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Video / Image Display */}
      {embedUrl ? (
        <div className="rounded-2xl overflow-hidden aspect-video border border-slate-800 bg-slate-900 shadow-2xl">
          <iframe
            src={embedUrl}
            title={topic.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : topic.thumbnailUrl ? (
        <div className="rounded-2xl overflow-hidden aspect-video max-h-[400px] border border-slate-800 bg-slate-900 shadow-2xl">
          <img
            src={topic.thumbnailUrl}
            alt={topic.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}

      {/* Related Practice Section */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>Related Practice Problems</span>
            </h3>
            <p className="text-xs text-slate-400">Practice questions associated with this topic</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {relatedProblems.length} Problems
          </span>
        </div>

        {relatedProblems.length > 0 ? (
          <div className="space-y-3">
            {relatedProblems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onSelectProblem={(p) => setSelectedProblem(p)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-sm">
            No practice problems directly linked to this topic yet. Check out the general Practice Hub.
          </div>
        )}
      </div>

      {/* Problem Detail Modal */}
      {selectedProblem && (
        <ProblemDetailModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}

      {/* PDF Viewer Modal */}
      {activePdf && (
        <PdfViewerModal
          pdfUrl={activePdf.url}
          pdfTitle={activePdf.name}
          onClose={() => setActivePdf(null)}
        />
      )}
    </div>
  );
}
