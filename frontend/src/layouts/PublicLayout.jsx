import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Logo } from '../components/ui/Logo';

export const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Create CV', path: '/builder' },
    { name: 'Templates', path: '/templates' },
    { name: 'About', path: '/about' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Background Orbs */}
      <div className="bg-glow-orb bg-glow-orb-1" />
      <div className="bg-glow-orb bg-glow-orb-2" />

      {/* Header / Navbar */}
      <header
        className="no-print"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--navbar-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-color)',
          transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
        }}
      >
        <div
          className="container-max"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '74px',
          }}
        >
          {/* Logo */}
          <Logo variant="full" size="md" linkTo="/" />

          {/* Desktop Nav */}
          <nav
            style={{
              display: 'none',
              gap: '2.5rem',
              alignItems: 'center',
            }}
            className="md-flex"
          >
            {navLinks.map((link) => {
              const active = location.pathname === link.path || (link.path === '/builder' && location.pathname === '/resume-builder');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: active ? 'var(--primary-400)' : 'var(--text-muted)',
                    transition: 'color 0.2s',
                    position: 'relative',
                    padding: '6px 0',
                  }}
                >
                  {link.name}
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--grad-primary)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <ThemeToggle size="md" />

            <Link to="/builder">
              <Button variant="primary" size="sm" icon={Sparkles}>
                Create My CV
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                padding: '8px',
                cursor: 'pointer',
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1.5rem',
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: location.pathname === link.path ? 'var(--primary-500)' : 'var(--text-main)',
                }}
              >
                {link.name}
              </Link>
            ))}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Theme</span>
              <ThemeToggle variant="pill" size="sm" />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="no-print"
        style={{
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-color)',
          padding: '4rem 0 2rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="container-max">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '3rem',
              marginBottom: '3rem',
            }}
          >
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <Logo variant="full" size="sm" linkTo="/" />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                "Create your professional CV for free — no account required." Instant ATS-friendly resume generation, truthful AI optimization, and clean PDF downloads for everyone.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                CV Builder Tools
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <li><Link to="/builder">Create New CV</Link></li>
                <li><Link to="/templates">Browse 8 CV Templates</Link></li>
                <li><Link to="/features">AI Bullet Rewriter</Link></li>
                <li><Link to="/features">ATS Formatting Scanner</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Direct Access
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <li><Link to="/builder">Create My CV (Instant)</Link></li>
                <li><Link to="/templates">CV Templates Gallery</Link></li>
                <li><Link to="/how-it-works">How It Works</Link></li>
                <li><Link to="/about">AI Transparency & Ethics</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Free & Open Access
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                No registration, passwords, or subscriptions required. Enter your details, customize your template, polish with AI, and download your clean PDF immediately.
              </p>
            </div>
          </div>

          <div
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              fontSize: '0.85rem',
              color: 'var(--text-dim)',
            }}
          >
            <div>© 2026 Career Genie. Free CV Builder for Students & Professionals.</div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/about">Privacy & Ethics</Link>
              <Link to="/about">System Architecture</Link>
              <Link to="/templates">Templates</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default PublicLayout;
