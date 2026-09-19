import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Filter, FileText, Youtube, Instagram } from 'lucide-react';
import ContentCard from '../components/ContentCard';
import PdfViewerModal from '../components/PdfViewerModal';

export default function LearnPage() {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePdf, setActivePdf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/learn/categories').then(r => r.json()),
      fetch('/api/learn/topics').then(r => r.json())
    ])
    .then(([catData, topicData]) => {
      setCategories(catData || []);
      setTopics(topicData || []);
    })
    .catch(err => console.error('Error fetching learn data:', err))
    .finally(() => setLoading(false));
  }, []);

  // Filter topics dynamically
  const filteredTopics = topics.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.categorySlug.toLowerCase() === selectedCategory.toLowerCase() || t.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold border border-brand-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Educational Resources</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Learn Coding Topics</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Comprehensive learning modules featuring curated YouTube tutorials, Instagram reels, and downloadable PDF notes organized by language and framework.
        </p>
      </div>

      {/* Filter & Search Bar Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topics by keyword, tag, or title (e.g., Functions, Async, Promises)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            All Categories ({topics.length})
          </button>

          {categories.map((cat) => {
            const count = topics.filter(t => t.categorySlug === cat.slug || t.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <ContentCard
              key={topic.id}
              topic={topic}
              onOpenPdf={(url, name) => setActivePdf({ url, name })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No topics found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category filter.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* PDF Modal */}
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
