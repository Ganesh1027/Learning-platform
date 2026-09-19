import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import TopicDetailPage from './pages/TopicDetailPage';
import PracticePage from './pages/PracticePage';
import AboutPage from './pages/AboutPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminProblemsPage from './pages/admin/AdminProblemsPage';
import AdminSectionsPage from './pages/admin/AdminSectionsPage';
import AdminMediaPage from './pages/admin/AdminMediaPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn/:categorySlug" element={<LearnPage />} />
          <Route path="/learn/:categorySlug/:topicSlug" element={<TopicDetailPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Admin Login Route */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Suite */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="problems" element={<AdminProblemsPage />} />
        <Route path="practice-sections" element={<AdminSectionsPage />} />
        <Route path="media" element={<AdminMediaPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Public Pages Layout */}
      <Route path="/*" element={<PublicLayout />} />
    </Routes>
  );
}
