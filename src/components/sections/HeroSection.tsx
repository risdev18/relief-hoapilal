// Hero section — "The Care Concierge"
// Asymmetric editorial layout, giant Fraunces headline, care concierge input

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ChevronRight } from 'lucide-react';
import { RelifLine } from '@/components/ui/RelifLine';
import { AvailabilityDot, DemoBadge } from '@/components/ui';
import { ROUTES, DEPARTMENTS } from '@/config/constants';
import { cn } from '@/utils';

const CONCIERGE_PLACEHOLDERS = [
  'My child has had a fever for two days…',
  'Knee pain when climbing stairs…',
  'I need a health checkup…',
  'Chest discomfort after exercise…',
  "Skin rash that won't go away…",
  'Looking for a good cardiologist…',
];

const QUICK_CHIPS = [
  { label: 'Heart & chest',   dept: 'cardiology' },
  { label: 'Bones & joints',  dept: 'orthopedics' },
  { label: 'Child health',    dept: 'pediatrics' },
  { label: 'Women\'s health', dept: 'gynecology' },
  { label: 'Skin',            dept: 'dermatology' },
  { label: 'General checkup', dept: 'general-medicine' },
];

const QUICK_LINKS = [
  { label: 'Find a Doctor',      href: ROUTES.doctors },
  { label: 'Book a Checkup',     href: ROUTES.book },
  { label: 'Download Reports',   href: ROUTES.patientRecords },
  { label: 'Pay Bill',           href: ROUTES.patientBilling },
];

// Live demo panel data
const LIVE_PANEL = {
  erStatus:        'Open 24/7',
  nextOpdSlot:     'Today 4:30 PM',
  queueToken:      'Cardiology — Token 14 serving now',
};

// Suggested result when user types
interface SearchResult {
  department: string;
  slug: string;
  doctor: string;
  slot: string;
}

function getSuggestion(query: string): SearchResult | null {
  if (!query || query.length < 3) return null;
  const q = query.toLowerCase();
  
  if (q.includes('heart') || q.includes('chest') || q.includes('cardio')) {
    return { department: 'Cardiology', slug: 'cardiology', doctor: 'Dr. Priya Sharma', slot: 'Today 4:30 PM' };
  }
  if (q.includes('knee') || q.includes('bone') || q.includes('joint') || q.includes('ortho')) {
    return { department: 'Orthopedics', slug: 'orthopedics', doctor: 'Dr. Rajesh Kulkarni', slot: 'Tomorrow 10:00 AM' };
  }
  if (q.includes('fever') || q.includes('child') || q.includes('kid') || q.includes('baby')) {
    return { department: 'Pediatrics', slug: 'pediatrics', doctor: 'Dr. Ananya Joshi', slot: 'Today 5:00 PM' };
  }
  if (q.includes('skin') || q.includes('rash') || q.includes('derma')) {
    return { department: 'Dermatology', slug: 'dermatology', doctor: 'Dr. Meera Patel', slot: 'Tomorrow 11:30 AM' };
  }
  if (q.includes('checkup') || q.includes('general') || q.includes('routine')) {
    return { department: 'General Medicine', slug: 'general-medicine', doctor: 'Dr. Arun Nair', slot: 'Today 3:00 PM' };
  }
  
  return { department: 'General Medicine', slug: 'general-medicine', doctor: 'Dr. Arun Nair', slot: 'Today 3:00 PM' };
}

export function HeroSection() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [query, setQuery]                        = useState('');
  const [suggestion, setSuggestion]              = useState<SearchResult | null>(null);
  const navigate                                 = useNavigate();

  // Rotate placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(i => (i + 1) % CONCIERGE_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update suggestion as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuggestion(getSuggestion(query));
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleChipClick = (dept: string) => {
    navigate(ROUTES.department(dept));
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" aria-label="Hero">
      {/* Background — warm paper with subtle grain */}
      <div className="absolute inset-0 bg-paper" />
      
      {/* Decorative botanical line art — top right */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 400 800" fill="none" className="w-full h-full">
          <path d="M200 0 C200 100 300 150 350 200 C400 250 380 350 300 400 C220 450 180 500 200 600 C220 700 350 750 400 800"
                stroke="var(--verdigris)" strokeWidth="1" fill="none" opacity="0.5"/>
          <path d="M300 100 C280 150 200 160 180 200 C160 240 220 280 200 320"
                stroke="var(--verdigris)" strokeWidth="0.8" fill="none" opacity="0.3"/>
        </svg>
      </div>

      <div className="section-container relative w-full pt-16 pb-24 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          
          {/* Left column — 60% — Headline + Concierge Input */}
          <div className="lg:col-span-3">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase">
                The Care Concierge
              </span>
              <DemoBadge />
            </motion.div>

            {/* Giant headline — mixed weight/style Fraunces */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="display-heading text-balance mb-6"
              style={{ color: 'var(--ink)' }}
            >
              Tell us what's wrong.{' '}
              <em className="display-heading-em" style={{ color: 'var(--verdigris)' }}>
                We'll show you where to begin.
              </em>
            </motion.h1>

            {/* Subcopy */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-ink-soft max-w-xl mb-8"
            >
              Describe what you're experiencing and we'll guide you to the right department and doctor. No medical jargon. No dead ends.
            </motion.p>

            {/* Concierge input */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4"
            >
              <div className="relative rounded-2xl bg-white border border-sage-light shadow-warm-md overflow-visible">
                <div className="flex items-start gap-3 p-4">
                  <Search className="mt-1 flex-shrink-0 text-ink-soft" size={20} />
                  <textarea
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="flex-1 bg-transparent text-ink placeholder:text-ink-muted text-base leading-relaxed resize-none focus:outline-none min-h-[60px]"
                    placeholder={CONCIERGE_PLACEHOLDERS[placeholderIndex]}
                    rows={2}
                    aria-label="Describe your concern to find the right department"
                  />
                </div>
                
                {/* Disclaimer */}
                <div className="px-4 pb-3">
                  <p className="text-xs text-ink-soft">
                    This guide helps you find the right department. It is not medical advice.
                    In an emergency,{' '}
                    <a href="/emergency" className="text-signal font-medium hover:underline">call emergency</a>.
                  </p>
                </div>

                {/* Search result suggestion */}
                <AnimatePresence>
                  {suggestion && query.length >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-paper border border-sage-light rounded-2xl shadow-warm-lg overflow-hidden"
                      style={{ zIndex: 'var(--z-dropdown)' }}
                    >
                      <div className="p-4">
                        <p className="text-xs font-mono font-medium text-ink-soft uppercase tracking-widest mb-3">
                          Suggested Department
                        </p>
                        <div className="flex items-center justify-between p-3 bg-bone rounded-xl">
                          <div>
                            <p className="font-semibold text-ink">{suggestion.department}</p>
                            <p className="text-sm text-ink-soft">{suggestion.doctor}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <AvailabilityDot status="available" />
                              <span className="text-sm font-medium text-verdigris">Next: {suggestion.slot}</span>
                            </div>
                          </div>
                          <Link
                            to={ROUTES.book}
                            className="btn btn-primary btn-sm"
                          >
                            Book slot
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Quick chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {QUICK_CHIPS.map(chip => (
                <button
                  key={chip.dept}
                  onClick={() => handleChipClick(chip.dept)}
                  className="chip hover:bg-verdigris hover:text-white hover:border-verdigris transition-all duration-300"
                >
                  {chip.label}
                </button>
              ))}
            </motion.div>

            {/* Quick text links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap gap-6"
            >
              {QUICK_LINKS.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="link-arrow"
                >
                  {link.label}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Right column — 40% — Arch photo + Live panel */}
          <div className="lg:col-span-2 relative">
            {/* Arch-masked photo placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Arch image frame */}
              <div
                className="relative overflow-hidden bg-gradient-to-b from-bone to-mint-light"
                style={{
                  borderRadius: '48% 48% 0 0 / 32% 32% 0 0',
                  aspectRatio: '0.75',
                  maxHeight: '520px',
                }}
              >
                {/* Placeholder botanical illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 300" fill="none" className="w-3/4 opacity-20">
                    <path d="M100 280 C100 280 100 100 100 20" stroke="var(--verdigris)" strokeWidth="2"/>
                    <path d="M100 200 C100 200 60 160 40 140 C20 120 40 100 60 120 C80 140 100 180 100 200" fill="var(--mint)" stroke="var(--verdigris)" strokeWidth="1.5"/>
                    <path d="M100 160 C100 160 140 120 160 100 C180 80 160 60 140 80 C120 100 100 140 100 160" fill="var(--mint)" stroke="var(--verdigris)" strokeWidth="1.5"/>
                    <path d="M100 230 C100 230 70 210 55 195 C40 180 55 165 70 180 C85 195 100 220 100 230" fill="var(--sage)" stroke="var(--verdigris)" strokeWidth="1.2" opacity="0.6"/>
                  </svg>
                </div>
                
                {/* Demo label */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <span className="demo-badge">Demo · Warm photography</span>
                </div>

                {/* The Relif Line threading down through the image */}
                <div className="absolute inset-x-0 top-0 h-full pointer-events-none">
                  <RelifLine variant="hero" color="rgba(31,122,107,0.3)" strokeWidth={1.5} className="h-full" />
                </div>
              </div>

              {/* Live at Relif panel — floating */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-6 -left-6 bg-paper border border-sage-light rounded-2xl shadow-warm-lg p-4 w-56"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-xs font-medium text-ink-soft uppercase tracking-widest">
                    Live at Relif
                  </span>
                  <DemoBadge />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-soft">Emergency Room</span>
                    <span className="text-xs font-medium text-green-600">{LIVE_PANEL.erStatus}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-soft">Next OPD slot</span>
                    <span className="text-xs font-medium text-saffron">{LIVE_PANEL.nextOpdSlot}</span>
                  </div>
                  <div className="pt-2 border-t border-sage-light">
                    <p className="text-xs text-ink-soft leading-relaxed">{LIVE_PANEL.queueToken}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Relif Line at bottom of hero */}
      <div className="absolute bottom-0 left-0 right-0">
        <RelifLine variant="hero" animated className="opacity-20" />
      </div>
    </section>
  );
}

