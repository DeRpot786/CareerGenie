import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { useDevToolsDeterrent } from './hooks/useDevToolsDeterrent';

// Layout
import { PublicLayout } from './layouts/PublicLayout';

// Public & Direct CV Builder Pages
import { LandingPage } from './pages/LandingPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { TemplatesGalleryPage } from './pages/TemplatesGalleryPage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CareerMatchPage } from './pages/CareerMatchPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Robust Error Boundary to gracefully recover and prevent blank screen crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            background: 'var(--bg-main, #0f172a)',
            color: 'var(--text-main, #f8fafc)',
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              padding: '2.5rem',
              borderRadius: '16px',
              background: 'var(--bg-surface, #1e293b)',
              border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Something went wrong
            </h2>
            <p
              style={{
                color: 'var(--text-muted, #94a3b8)',
                fontSize: '0.95rem',
                marginBottom: '1.5rem',
                lineHeight: 1.5,
              }}
            >
              {this.state.error?.message || 'An unexpected error occurred while loading this page.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('careergenie_profile');
                  } catch {}
                  window.location.href = '/builder';
                }}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--primary-600, #6366f1)',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset &amp; Open Builder
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
                  background: 'transparent',
                  color: 'var(--text-main, #fff)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Wraps page content with a fade-up animation on every route change
function PageWrapper({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter" style={{ minHeight: '100%' }}>
      {children}
    </div>
  );
}

export function App() {
  // Deter casual DevTools access (F12, Ctrl+Shift+I/J/C, Ctrl+U, right-click)
  useDevToolsDeterrent();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <PageWrapper>
              <Routes>
                {/* Account-Free, 100% Free Public Layout Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/builder" element={<ResumeBuilderPage />} />
                  <Route path="/resume-builder" element={<ResumeBuilderPage />} />
                  <Route path="/templates" element={<TemplatesGalleryPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/career-match" element={<CareerMatchPage />} />
                  <Route path="/job-analyzer" element={<CareerMatchPage />} />
                  <Route path="/skill-gap" element={<SkillGapPage />} />
                  <Route path="/roadmap" element={<RoadmapPage />} />
                  <Route path="/interview-prep" element={<InterviewPrepPage />} />
                  <Route path="/ats-score" element={<ResumeBuilderPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/career-goal" element={<ProfilePage />} />

                  {/* Legacy Auth & Admin Redirects -> Direct CV Builder */}
                  <Route path="/login" element={<Navigate to="/builder" replace />} />
                  <Route path="/register" element={<Navigate to="/builder" replace />} />
                  <Route path="/settings" element={<Navigate to="/builder" replace />} />
                  <Route path="/admin" element={<Navigate to="/" replace />} />
                  <Route path="/admin/*" element={<Navigate to="/" replace />} />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </PageWrapper>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
