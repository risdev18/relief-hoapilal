// Header — International Luxury Multispecialty Healthcare Navigation
// Refined typography, glassmorphism surface, organic brandmark, champagne gold accents

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, Calendar, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/utils';
import { DEPARTMENTS, LANGUAGES, ROUTES } from '@/config/constants';

// ── Relif Luxury Wordmark ─────────────────────────────────────────────────
function RelifWordmark({ className }: { className?: string }) {
  return (
    <Link
      to={ROUTES.home}
      className={cn('inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-verdigris rounded-xl p-1', className)}
      aria-label="Relif International Hospital — Home"
    >
      {/* Handcrafted Emblem with botanical vein + cross */}
      <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-verdigris to-verdigris-deep flex items-center justify-center shadow-warm-sm border border-verdigris/30 group-hover:shadow-verdigris transition-all duration-300">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white transform group-hover:scale-105 transition-transform duration-300">
          <path
            d="M12 4V20M4 12H20"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3" fill="#F0A22E" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display font-bold text-2xl tracking-tight text-ink group-hover:text-verdigris-deep transition-colors">
            relif
          </span>
          <span className="font-mono text-[9px] tracking-widest text-saffron uppercase font-bold px-1.5 py-0.2 rounded bg-saffron/10 border border-saffron/20">
            Care
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/80 -mt-1 font-medium">
          Multispecialty
        </span>
      </div>
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
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-0 w-screen max-w-4xl bg-paper/98 backdrop-blur-xl border border-sage-light/80 rounded-2xl shadow-warm-xl mt-3 overflow-hidden z-dropdown"
    >
      <div className="p-7">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-sage-light/60">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-verdigris">
              Clinical Index
            </span>
            <h3 className="font-display text-xl font-bold text-ink">
              Clinical Departments & Centres
            </h3>
          </div>
          <Link
            to={ROUTES.departments}
            className="group flex items-center gap-1.5 text-xs font-semibold text-verdigris hover:text-verdigris-deep transition-colors px-3 py-1.5 rounded-full bg-mint/50 hover:bg-mint"
            onClick={onClose}
          >
            <span>Explore full index (20 specialties)</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
          {[col1, col2].map((col, ci) => (
            <div key={ci} className="space-y-0.5">
              {col.map(dept => (
                <Link
                  key={dept.id}
                  to={ROUTES.department(dept.slug)}
                  onClick={onClose}
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-bone transition-all duration-200 group"
                >
                  <span className="text-sm font-medium text-ink-soft group-hover:text-ink group-hover:translate-x-1 transition-all">
                    {dept.name}
                  </span>
                  <span className="text-[11px] font-mono text-sage opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Navigation Configuration ──────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Departments', href: ROUTES.departments, hasMegaMenu: true },
  { label: 'Doctors',     href: ROUTES.doctors,     hasMegaMenu: false },
  { label: 'Centres of Excellence', href: ROUTES.coe, hasMegaMenu: false },
  { label: 'Treatments',  href: ROUTES.treatments,  hasMegaMenu: false },
  { label: 'Diagnostics', href: ROUTES.diagnostics, hasMegaMenu: false },
  { label: 'Health Library', href: ROUTES.healthLibrary, hasMegaMenu: false },
  { label: 'About',       href: ROUTES.about,       hasMegaMenu: false },
  { label: 'Contact',     href: ROUTES.contact,     hasMegaMenu: false },
] as const;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setActiveMegaMenu(null);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-header w-full transition-all duration-300',
        isScrolled
          ? 'bg-paper/95 backdrop-blur-md border-b border-sage-light shadow-warm-sm py-2'
          : 'bg-paper/80 backdrop-blur-sm border-b border-sage-light/40 py-3'
      )}
    >
      <div className="section-container">
        <div className="flex items-center justify-between">
          {/* Brand Identity */}
          <RelifWordmark />

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-bone/70 backdrop-blur-sm p-1 rounded-full border border-sage-light/60 shadow-sm" aria-label="Main navigation">
            {NAV_ITEMS.map(item => (
              <div key={item.label} className="relative">
                {item.hasMegaMenu ? (
                  <button
                    className={cn(
                      'flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200',
                      activeMegaMenu === item.label
                        ? 'bg-paper text-verdigris shadow-warm-sm'
                        : 'text-ink-soft hover:text-ink hover:bg-paper/60'
                    )}
                    onClick={() => setActiveMegaMenu(activeMegaMenu === item.label ? null : item.label)}
                    aria-expanded={activeMegaMenu === item.label}
                    aria-haspopup="true"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={13}
                      className={cn('transition-transform duration-200 opacity-60', {
                        'rotate-180 opacity-100 text-verdigris': activeMegaMenu === item.label,
                      })}
                    />
                  </button>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => cn(
                      'px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 block',
                      isActive
                        ? 'bg-paper text-verdigris shadow-warm-sm font-semibold'
                        : 'text-ink-soft hover:text-ink hover:bg-paper/60'
                    )}
                  >
                    {item.label}
                  </NavLink>
                )}

                {/* Mega-menu popup */}
                <AnimatePresence>
                  {item.hasMegaMenu && activeMegaMenu === item.label && (
                    <DepartmentsMegaMenu onClose={() => setActiveMegaMenu(null)} />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Action Suite: Language + Patient Portal + Primary Booking CTA */}
          <div className="flex items-center gap-2.5">
            {/* Language Switch */}
            <div className="hidden lg:flex items-center bg-bone/60 border border-sage-light/70 rounded-full px-2 py-1 text-xs">
              {LANGUAGES.map((lang, i) => (
                <React.Fragment key={lang.code}>
                  <button
                    onClick={() => {
                      localStorage.setItem('relif_language', lang.code);
                    }}
                    className="font-mono text-[11px] font-semibold text-ink-soft hover:text-verdigris px-1.5 py-0.5 rounded transition-colors"
                  >
                    {lang.label}
                  </button>
                  {i < LANGUAGES.length - 1 && (
                    <span className="text-sage-light text-[10px]">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Patient Login Portal */}
            <Link
              to={ROUTES.login}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-verdigris transition-colors px-3 py-2 rounded-full hover:bg-bone"
            >
              <User size={15} className="text-verdigris" />
              <span>Portal</span>
            </Link>

            {/* Luxury Primary CTA: Champagne / Saffron Gold Elevation */}
            <Link
              to={ROUTES.book}
              className="relative group inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-warm hover:shadow-saffron hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #F0A22E 0%, #D4861A 100%)',
                color: '#10261F',
              }}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Calendar size={14} className="opacity-80" />
                <span>Book Appointment</span>
              </span>
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              className="xl:hidden p-2 rounded-xl text-ink hover:bg-bone transition-colors ml-1"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-paper/98 backdrop-blur-2xl flex flex-col overflow-y-auto z-modal pt-20"
          >
            <div className="section-container flex-1 py-6 space-y-6">
              <nav aria-label="Mobile navigation" className="divide-y divide-sage-light/60">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center justify-between py-4 text-ink hover:text-verdigris transition-colors"
                    >
                      <span className="font-display text-2xl font-semibold">
                        {item.label}
                      </span>
                      <ArrowRight size={18} className="text-sage" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="pt-4 space-y-3">
                <Link
                  to={ROUTES.book}
                  className="btn btn-primary btn-lg w-full justify-center shadow-warm"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Book Inpatient / OPD Appointment
                </Link>
                <Link
                  to={ROUTES.login}
                  className="btn btn-secondary btn-lg w-full justify-center"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Sign In to Patient Portal
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
