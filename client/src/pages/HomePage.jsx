import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Terminal, Code2, Youtube, Instagram, FileText, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import ContentCard from '../components/ContentCard';
import ProblemCard from '../components/ProblemCard';
import CodeCompilerModal from '../components/CodeCompilerModal';
import PdfViewerModal from '../components/PdfViewerModal';

export default function HomePage() {
  const [topics, setTopics] = useState([]);
  const [todaysChallenge, setTodaysChallenge] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [activePdf, setActivePdf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/learn/topics').then(r => r.json()),
      fetch('/api/todays-challenge').then(r => r.json()),
      fetch('/api/practice/sections').then(r => r.json())
    ])
    .then(([topicsData, challengeData, sectionsData]) => {
      setTopics(topicsData || []);
      setTodaysChallenge(challengeData.error ? null : challengeData);
      setSections(sectionsData || []);
    })
    .catch(err => console.error('Error loading homepage data:', err))
    .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Discover · Learn · Read · Watch · Practice</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Master Coding with <br />
            <span className="gradient-text">Structured Content & Real Problems</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Centralized platform bringing together Instagram reels, YouTube tutorials, PDF notes, and admin-curated practice problems in one seamless hub.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/practice"
              className="px-6 py-3.5 rounded-xl gradient-button text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Terminal className="w-4 h-4" />
              <span>Start Practicing</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              to="/learn"
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm border border-slate-700/80 flex items-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4 text-brand-400" />
              <span>Explore Learn Content</span>
            </Link>
          </div>

          {/* Key Stats Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-xl text-center">
              <span className="block text-2xl font-bold text-white">100%</span>
              <span className="text-xs text-slate-400">Creator Managed</span>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <span className="block text-2xl font-bold text-brand-300">YouTube + Reels</span>
              <span className="text-xs text-slate-400">Connected Media</span>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <span className="block text-2xl font-bold text-emerald-400">LeetCode + Custom</span>
              <span className="text-xs text-slate-400">Dual Problem Types</span>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <span className="block text-2xl font-bold text-amber-400">Dynamic</span>
              <span className="text-xs text-slate-400">Section Headings</span>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Challenge Section */}
      {todaysChallenge && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-brand-500/10 border border-amber-500/30 overflow-hidden backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span>Today's Featured Challenge</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{todaysChallenge.title}</h2>
                <p className="text-sm text-slate-300 max-w-2xl line-clamp-2">
                  {todaysChallenge.statement}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${
                    todaysChallenge.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    todaysChallenge.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {todaysChallenge.difficulty}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    Topic: {todaysChallenge.topic}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    Section: {todaysChallenge.headingName || 'Practice'}
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                {todaysChallenge.type === 'leetcode' ? (
                  <a
                    href={todaysChallenge.leetcodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-orange-500/20"
                  >
                    <span>Practice Now on LeetCode</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    onClick={() => setSelectedProblem(todaysChallenge)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-button text-white font-bold text-sm transition-all shadow-lg"
                  >
                    <span>Solve Challenge</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Educational Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Latest Learning Topics</h2>
            <p className="text-sm text-slate-400">Explore tutorials, reels, and downloadable PDF notes</p>
          </div>
          <Link
            to="/learn"
            className="text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Topics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topics.slice(0, 3).map((topic) => (
            <ContentCard
              key={topic.id}
              topic={topic}
              onOpenPdf={(url, name) => setActivePdf({ url, name })}
            />
          ))}
        </div>
      </section>

      {/* Practice Sections Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Practice Categories</h2>
            <p className="text-sm text-slate-400">Organized into creator-defined headings</p>
          </div>
          <Link
            to="/practice"
            className="text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            <span>Go to Practice Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sections.map((sec) => (
            <Link
              key={sec.id}
              to={`/practice?heading=${sec.id}`}
              className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 flex items-center justify-between group"
            >
              <div>
                <h3 className="font-bold text-white group-hover:text-brand-300 transition-colors">{sec.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{sec.description || 'Practice problems collection'}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* Code Compiler Modal */}
      {selectedProblem && (
        <CodeCompilerModal
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
