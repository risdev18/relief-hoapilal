// Header — Sticky, transparent over hero, blurs on scroll
// No blue. Verdigris brand. Saffron CTA.

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown, User } from 'lucide-react';
import { cn } from '@/utils';
import { DEPARTMENTS, LANGUAGES, ROUTES } from '@/config/constants';
import { Button } from '@/components/ui';

// ── Relif Wordmark SVG ────────────────────────────────────────────────────
function RelifWordmark({ className }: { className?: string }) {
  return (
    <Link
      to={ROUTES.home}
      className={cn('inline-flex flex-col items-start group', className)}
      aria-label="Relif Hospital — Home"
    >
      <span
        className="font-display font-semibold tracking-tight leading-none"
        style={{ fontSize: 'clamp(1.25rem, 1.5vw, 1.5rem)' }}
      >
        relif
      </span>
      {/* The Relif Line forms the underline/crossbar */}
      <svg
        viewBox="0 0 60 8"
        fill="none"
        className="w-14 -mt-0.5"
        aria-hidden="true"
      >
        <motion.path
          d="M2,4 C8,4 10,1 15,1 C20,1 22,7 27,7 C32,7 34,2 39,2 C44,2 46,5 51,5 C56,5 58,4 60,4"
          stroke="var(--verdigris)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span
        className="font-mono text-xs text-ink-soft group-hover:text-verdigris transition-colors -mt-0.5"
        style={{ letterSpacing: '0.15em' }}
      >
        hospital
      </span>
    </Link>
  );
}

// ── Departments Mega-Menu ─────────────────────────────────────────────────
function DepartmentsMegaMenu({ onClose }: { onClose: () => void }) {
  const half = Math.ceil(DEPARTMENTS.length / 2);
  const col1 = DEPARTMENTS.slice(0, half);
  const col2 = DEPARTMENTS.slice(half);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-0 w-screen max-w-3xl bg-paper border border-sage-light rounded-xl shadow-warm-xl mt-2 overflow-hidden"
      style={{ zIndex: 'var(--z-dropdown)' }}
    >
      <div className="p-6">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="font-display text-xl font-semibold text-ink">All Departments</h3>
          <Link
            to={ROUTES.departments}
            className="text-sm font-medium text-verdigris hover:text-verdigris-deep transition-colors"
            onClick={onClose}
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-8">
          {[col1, col2].map((col, ci) => (
            <div key={ci} className="space-y-1">
              {col.map(dept => (
                <Link
                  key={dept.id}
                  to={ROUTES.department(dept.slug)}
                  onClick={onClose}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-bone transition-colors group"
                >
                  <span className="text-sm font-medium text-ink-soft group-hover:text-verdigris transition-colors">
                    {dept.name}
                  </span>
                  <ChevronDown
                    size={12}
                    className="rotate-[-90deg] text-sage group-hover:text-verdigris transition-colors opacity-0 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Departments', href: ROUTES.departments, hasMegaMenu: true },
  { label: 'Doctors',     href: ROUTES.doctors,     hasMegaMenu: false },
  { label: 'Treatments',  href: ROUTES.treatments,  hasMegaMenu: false },
  { label: 'Services',    href: ROUTES.visitorInfo, hasMegaMenu: false },
  { label: 'Health Library', href: ROUTES.healthLibrary, hasMegaMenu: false },
  { label: 'About',       href: ROUTES.about,       hasMegaMenu: false },
  { label: 'Contact',     href: ROUTES.contact,     hasMegaMenu: false },
] as const;

export function Header() {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileOpen, setIsMobileOpen]     = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  // Track scroll for transparency toggle
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setActiveMegaMenu(null);
  }, [location]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHeroPage = location.pathname === '/';

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-header w-full transition-all duration-500',
        {
          'bg-transparent':                              !isScrolled && isHeroPage,
          'bg-paper/95 backdrop-blur-md border-b border-sage-light shadow-warm-sm':
                                                         isScrolled || !isHeroPage,
        }
      )}
      style={{ zIndex: 'var(--z-header)' }}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Wordmark */}
          <RelifWordmark />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map(item => (
              <div key={item.label} className="relative">
                {item.hasMegaMenu ? (
                  <button
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      {
                        'text-verdigris': activeMegaMenu === item.label,
                        'text-ink-soft hover:text-ink hover:bg-bone': activeMegaMenu !== item.label,
                      }
                    )}
                    onClick={() => setActiveMegaMenu(
                      activeMegaMenu === item.label ? null : item.label
                    )}
                    aria-expanded={activeMegaMenu === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={cn('transition-transform duration-200', {
                        'rotate-180': activeMegaMenu === item.label,
                      })}
                    />
                  </button>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      {
                        'text-verdigris bg-mint':          isActive,
                        'text-ink-soft hover:text-ink hover:bg-bone': !isActive,
                      }
                    )}
                  >
                    {item.label}
                  </NavLink>
                )}

                {/* Mega menu */}
                <AnimatePresence>
                  {item.hasMegaMenu && activeMegaMenu === item.label && (
                    <DepartmentsMegaMenu onClose={() => setActiveMegaMenu(null)} />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right side: Language + Auth + CTA */}
          <div className="flex items-center gap-2">
            {/* Language switch */}
            <div className="hidden md:flex items-center gap-1 border border-sage-light rounded-pill px-2 py-1">
              {LANGUAGES.map((lang, i) => (
                <React.Fragment key={lang.code}>
                  <button className="text-xs font-mono font-medium text-ink-soft hover:text-verdigris transition-colors px-1 py-0.5">
                    {lang.label}
                  </button>
                  {i < LANGUAGES.length - 1 && (
                    <span className="text-sage-light text-xs">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Patient login */}
            <Link
              to={ROUTES.login}
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors px-3 py-2"
            >
              <User size={16} />
              <span>Login</span>
            </Link>

            {/* Primary CTA — saffron Book Appointment */}
            <Link
              to={ROUTES.book}
              className="btn btn-primary btn-sm hidden sm:inline-flex"
            >
              Book Appointment
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-ink-soft hover:text-ink hover:bg-bone transition-colors"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-paper flex flex-col overflow-y-auto"
            style={{ zIndex: 'var(--z-modal)', top: 0, paddingTop: '5rem' }}
          >
            <div className="section-container flex-1 py-8">
              {/* Large serif mobile nav links */}
              <nav aria-label="Mobile navigation" className="space-y-2">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="block py-3 border-b border-sage-light"
                    >
                      <span className="font-display text-3xl font-semibold text-ink hover:text-verdigris transition-colors">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile auth + CTA */}
              <div className="mt-8 space-y-3">
                <Link
                  to={ROUTES.book}
                  className="btn btn-primary btn-lg w-full justify-center"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Book Appointment
                </Link>
                <Link
                  to={ROUTES.login}
                  className="btn btn-secondary btn-lg w-full justify-center"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Patient Login
                </Link>
              </div>

              {/* Language switch */}
              <div className="mt-6 flex gap-4">
                {LANGUAGES.map(lang => (
                  <button key={lang.code} className="text-sm font-mono text-ink-soft hover:text-verdigris transition-colors">
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

