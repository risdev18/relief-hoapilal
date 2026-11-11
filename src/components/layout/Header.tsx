// Header — International Luxury Multispecialty Healthcare Navigation
// Refined typography, glassmorphism surface, organic brandmark, champagne gold accents
// Multilingual reactive switching (EN, HI, MR) + Returning Patient recognition + Supabase Auth controls

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Menu, X, User, Calendar, ArrowRight, LogOut, LogIn,
  ChevronDown, FileText, ShieldCheck, ClipboardList
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/i18n';
import { cn } from '@/utils';
import { LANGUAGES, ROUTES } from '@/config/constants';
import { AuthService, PatientUser } from '@/services/authService';

// ── Relif Luxury Wordmark ─────────────────────────────────────────────────
function RelifWordmark({ className }: { className?: string }) {
  return (
    <Link
      to={ROUTES.home}
      className={cn('inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-verdigris rounded-xl p-0.5 flex-shrink-0', className)}
      aria-label="Relif International Hospital — Home"
    >
      {/* Handcrafted Emblem with botanical vein + cross */}
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-verdigris to-verdigris-deep flex items-center justify-center shadow-warm-sm border border-verdigris/30 group-hover:shadow-verdigris transition-all duration-300">
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white transform group-hover:scale-105 transition-transform duration-300">
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
        <div className="flex items-baseline gap-1">
          <span className="font-display font-bold text-xl tracking-tight text-ink group-hover:text-verdigris-deep transition-colors">
            relif
          </span>
          <span className="font-mono text-[8px] tracking-widest text-saffron uppercase font-bold px-1 py-0.2 rounded bg-saffron/10 border border-saffron/20">
            Care
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-soft/80 -mt-1 font-medium">
          Multispecialty
        </span>
      </div>
    </Link>
  );
}

// ── Navigation Configuration ──────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'departments',    href: ROUTES.departments },
  { key: 'doctors',        href: ROUTES.doctors },
  { key: 'coe',            href: ROUTES.coe },
  { key: 'treatments',     href: ROUTES.treatments },
  { key: 'diagnostics',    href: ROUTES.diagnostics },
  { key: 'healthLibrary',  href: ROUTES.healthLibrary },
  { key: 'about',          href: ROUTES.about },
  { key: 'contact',        href: ROUTES.contact },
] as const;

export function Header() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activePatient, setActivePatient] = useState<PatientUser | null>(null);
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem('relif_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
    }
    try {
      localStorage.setItem('relif_high_contrast', String(highContrast));
    } catch {
      // ignore storage failure
    }
  }, [highContrast]);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setActivePatient(AuthService.getActivePatient());
    void AuthService.syncSession().then(u => {
      if (u) setActivePatient(u);
    });
    const handleAuthChange = () => {
      setActivePatient(AuthService.getActivePatient());
    };
    window.addEventListener('relif_auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('relif_auth_state_changed', handleAuthChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const handleLanguageChange = (code: 'en' | 'hi' | 'mr') => {
    changeLanguage(code);
  };

  const handleSignOut = async () => {
    await AuthService.logoutPatient();
    setActivePatient(null);
    navigate(ROUTES.home);
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-header w-full transition-all duration-300',
        isScrolled
          ? 'bg-paper/95 backdrop-blur-md border-b border-sage-light shadow-warm-sm py-1.5'
          : 'bg-paper/90 backdrop-blur-sm border-b border-sage-light/40 py-2.5'
      )}
    >
      <div className="section-container">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Identity */}
          <RelifWordmark />

          {/* Desktop Navigation Links (Compact & Beautiful) */}
          <nav className="hidden xl:flex items-center gap-0.5 bg-bone/80 backdrop-blur-sm p-1 rounded-full border border-sage-light/70 shadow-sm" aria-label="Main navigation">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.key}
                to={item.href}
                className={({ isActive }) => cn(
                  'px-2 2xl:px-2.5 py-1 rounded-full text-[12px] 2xl:text-[12.5px] font-medium transition-all duration-200 block whitespace-nowrap',
                  isActive
                    ? 'bg-paper text-verdigris shadow-warm-xs font-semibold'
                    : 'text-ink-soft hover:text-ink hover:bg-paper/60'
                )}
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Suite: Language + Sign In / User Profile + Primary Booking CTA */}
          <div className="flex items-center gap-1 2xl:gap-2 flex-shrink-0">
            {/* Language Switch (Reactive i18n) */}
            <div className="hidden lg:flex items-center bg-bone border border-sage-light/80 rounded-full p-0.5 text-xs shadow-warm-xs">
              {LANGUAGES.map((lang) => {
                const isActive = (i18n.language || 'en').startsWith(lang.code);
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code as 'en' | 'hi' | 'mr')}
                    className={cn(
                      'font-mono text-[10px] font-semibold px-1.5 2xl:px-2 py-0.5 rounded-full transition-all duration-200',
                      isActive
                        ? 'bg-verdigris text-white shadow-xs'
                        : 'text-ink-soft hover:text-verdigris'
                    )}
                    aria-label={`Switch to ${lang.label}`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>

            {/* High Contrast Accessibility Toggle */}
            <button
              type="button"
              onClick={() => setHighContrast(v => !v)}
              aria-pressed={highContrast}
              aria-label={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
              title="Toggle high contrast accessibility mode"
              className={cn(
                'hidden sm:inline-flex items-center justify-center font-mono text-[10px] font-bold px-1.5 2xl:px-2 py-1 rounded-full border transition-colors whitespace-nowrap',
                highContrast
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-bone text-ink-soft border-sage-light/80 hover:text-ink hover:border-verdigris'
              )}
            >
              Aa+
            </button>

            {/* Unified Account Dropdown (My Appointments, Reports, Profile, Logout) */}
            {activePatient ? (
              <div className="hidden sm:flex items-center">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-verdigris-deep bg-mint/60 hover:bg-mint transition-colors px-3 py-1.5 rounded-full border border-verdigris/30 shadow-warm-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-verdigris"
                      aria-label="Account menu"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <User size={13} className="text-verdigris" />
                      <span className="max-w-[110px] truncate">{activePatient.fullName.split(' ')[0]}</span>
                      <ChevronDown size={13} className="text-verdigris-deep/80" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      sideOffset={8}
                      className="z-dropdown min-w-[220px] rounded-2xl bg-paper border border-sage-light shadow-warm-xl p-1.5 text-sm text-ink animate-in fade-in-0 zoom-in-95"
                    >
                      <div className="px-3 py-2 border-b border-sage-light/70 mb-1">
                        <p className="font-semibold text-xs text-ink truncate">{activePatient.fullName}</p>
                        <p className="font-mono text-[10px] text-ink-soft mt-0.5">UHID: {activePatient.uhid}</p>
                      </div>

                      <DropdownMenu.Item asChild>
                        <Link
                          to={ROUTES.patientAppointments}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-ink hover:bg-mint/50 hover:text-verdigris-deep focus:bg-mint/50 focus:outline-none cursor-pointer"
                        >
                          <ClipboardList size={14} className="text-verdigris" />
                          <span>{t('nav.myAppointments')}</span>
                        </Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item asChild>
                        <Link
                          to={ROUTES.patientRecords}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-ink hover:bg-mint/50 hover:text-verdigris-deep focus:bg-mint/50 focus:outline-none cursor-pointer"
                        >
                          <FileText size={14} className="text-verdigris" />
                          <span>{t('nav.reports')}</span>
                        </Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item asChild>
                        <Link
                          to={ROUTES.patientProfile}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-ink hover:bg-mint/50 hover:text-verdigris-deep focus:bg-mint/50 focus:outline-none cursor-pointer"
                        >
                          <User size={14} className="text-verdigris" />
                          <span>{t('nav.profile')}</span>
                        </Link>
                      </DropdownMenu.Item>

                      {activePatient.role === 'admin' && (
                        <DropdownMenu.Item asChild>
                          <Link
                            to={ROUTES.adminDashboard}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-verdigris-deep hover:bg-mint/50 focus:bg-mint/50 focus:outline-none cursor-pointer"
                          >
                            <ShieldCheck size={14} className="text-saffron-deep" />
                            <span>{t('nav.adminConsole')}</span>
                          </Link>
                        </DropdownMenu.Item>
                      )}

                      <DropdownMenu.Separator className="h-px bg-sage-light/70 my-1" />

                      <DropdownMenu.Item
                        onSelect={handleSignOut}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-signal hover:bg-[var(--signal-light)] focus:bg-[var(--signal-light)] focus:outline-none cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>{t('nav.logout')}</span>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  to={ROUTES.login}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-ink hover:text-verdigris transition-colors px-2 2xl:px-2.5 py-1.5 rounded-full hover:bg-bone border border-sage-light/70 shadow-warm-xs whitespace-nowrap"
                >
                  <LogIn size={13} className="text-verdigris" />
                  <span>{t('nav.login')}</span>
                </Link>
                <Link
                  to={ROUTES.register}
                  className="inline-flex items-center text-[11px] font-semibold text-verdigris-deep bg-mint/50 hover:bg-mint px-2 2xl:px-2.5 py-1.5 rounded-full border border-verdigris/25 transition-colors whitespace-nowrap"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Luxury Primary CTA: Champagne / Saffron Gold Elevation */}
            <Link
              to={ROUTES.book}
              className="relative group inline-flex items-center gap-1.5 text-xs font-bold px-3 2xl:px-4 py-2 rounded-full transition-all duration-300 shadow-warm hover:shadow-saffron hover:-translate-y-0.5 active:translate-y-0 overflow-hidden flex-shrink-0 whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #F0A22E 0%, #D4861A 100%)',
                color: '#10261F',
              }}
            >
              <Calendar size={13} className="opacity-90" />
              <span className="whitespace-nowrap">{t('nav.bookAppointment')}</span>
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              className="xl:hidden p-1.5 rounded-xl text-ink hover:bg-bone transition-colors ml-0.5"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
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
              {/* Language switcher inside mobile menu */}
              <div className="flex items-center justify-between pb-4 border-b border-sage-light">
                <span className="text-xs font-mono text-ink-soft uppercase font-semibold">Language</span>
                <div className="flex items-center bg-bone border border-sage-light rounded-full p-1 text-xs">
                  {LANGUAGES.map((lang) => {
                    const isActive = (i18n.language || 'en').startsWith(lang.code);
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code as 'en' | 'hi' | 'mr')}
                        className={cn(
                          'font-mono text-xs font-semibold px-3 py-1 rounded-full transition-all',
                          isActive
                            ? 'bg-verdigris text-white shadow-xs'
                            : 'text-ink-soft hover:text-verdigris'
                        )}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <nav aria-label="Mobile navigation" className="divide-y divide-sage-light/60">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center justify-between py-3.5 text-ink hover:text-verdigris transition-colors"
                    >
                      <span className="font-display text-xl font-semibold">
                        {t(`nav.${item.key}`)}
                      </span>
                      <ArrowRight size={16} className="text-sage" />
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
                  {t('nav.bookAppointment')}
                </Link>
                {activePatient ? (
                  <div className="space-y-2">
                    <Link
                      to={ROUTES.patientDashboard}
                      className="btn btn-secondary btn-lg w-full justify-center flex items-center gap-2"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <User size={16} className="text-verdigris" />
                      <span>My Portal: {activePatient.fullName}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileOpen(false);
                      }}
                      className="w-full text-center text-xs text-signal font-semibold py-2 hover:underline"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={ROUTES.login}
                      className="btn btn-secondary btn-lg justify-center text-sm font-semibold"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to={ROUTES.register}
                      className="btn btn-outline btn-lg justify-center text-sm border-verdigris text-verdigris font-semibold"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      New Patient
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
