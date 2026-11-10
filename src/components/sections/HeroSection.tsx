// Hero section — "The Care Concierge"
// International Luxury Multispecialty Healthcare Proportions & Aesthetic
// Balanced whitespace, refined serif rhythm, champagne gold highlights, calm confidence

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Clock, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RelifLine } from '@/components/ui/RelifLine';
import { AvailabilityDot } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { cn } from '@/utils';

const CONCIERGE_PLACEHOLDERS = [
  'Child has had persistent fever for two days…',
  'Deep knee joint discomfort when taking stairs…',
  'Comprehensive executive health checkup…',
  'Intermittent chest heaviness after exertion…',
  'Unexplained skin rash and inflammation…',
  'Seeking second opinion for coronary intervention…',
];

const QUICK_CHIPS = [
  { label: 'Cardiology & Chest',   dept: 'cardiology' },
  { label: 'Orthopedics & Spine',  dept: 'orthopedics' },
  { label: 'Pediatrics & Neonatal',dept: 'pediatrics' },
  { label: 'Women’s Health & Gynae',dept: 'gynecology' },
  { label: 'Neurology & Brain',    dept: 'neurology' },
  { label: 'Preventive Health',    dept: 'general-medicine' },
];

const QUICK_LINKS = [
  { label: 'Consult Our Specialists', href: ROUTES.doctors },
  { label: 'Health Packages & Scans',  href: ROUTES.diagnostics },
  { label: 'Instant Inpatient Records',href: ROUTES.patientRecords },
  { label: 'Cost Estimator & TPA',     href: ROUTES.insurance },
];

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
  if (q.includes('knee') || q.includes('bone') || q.includes('joint') || q.includes('ortho') || q.includes('spine')) {
    return { department: 'Orthopedics', slug: 'orthopedics', doctor: 'Dr. Rajesh Kulkarni', slot: 'Today 3:00 PM' };
  }
  if (q.includes('fever') || q.includes('child') || q.includes('kid') || q.includes('baby') || q.includes('pediatric')) {
    return { department: 'Pediatrics', slug: 'pediatrics', doctor: 'Dr. Ananya Joshi', slot: 'Today 5:00 PM' };
  }
  if (q.includes('brain') || q.includes('neuro') || q.includes('headache') || q.includes('stroke')) {
    return { department: 'Neurology', slug: 'neurology', doctor: 'Dr. Sunita Desai', slot: 'Tomorrow 10:00 AM' };
  }
  if (q.includes('skin') || q.includes('rash') || q.includes('derma')) {
    return { department: 'Dermatology', slug: 'dermatology', doctor: 'Dr. Meera Patel', slot: 'Tomorrow 11:30 AM' };
  }
  if (q.includes('checkup') || q.includes('general') || q.includes('routine')) {
    return { department: 'General Medicine', slug: 'general-medicine', doctor: 'Dr. Arun Nair', slot: 'Today 2:30 PM' };
  }
  
  return { department: 'General Medicine', slug: 'general-medicine', doctor: 'Dr. Arun Nair', slot: 'Today 2:30 PM' };
}

export function HeroSection() {
  const { t } = useTranslation();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [suggestion, setSuggestion] = useState<SearchResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(i => (i + 1) % CONCIERGE_PLACEHOLDERS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuggestion(getSuggestion(query));
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  const handleChipClick = (dept: string) => {
    navigate(ROUTES.department(dept));
  };

  return (
    <section className="relative overflow-hidden bg-paper" aria-label="Hero Section">
      {/* Background Soft Grain & Ambient Radiance */}
      <div className="absolute inset-0 bg-[radial-gradient(#1F7A6B_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-mint/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-bone blur-2xl pointer-events-none" />

      <div className="section-container relative w-full pt-10 pb-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column (7 cols): Editorial Typography & Interactive Concierge */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Accreditation Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-bone border border-sage-light/70 shadow-warm-sm"
            >
              <span className="w-2 h-2 rounded-full bg-verdigris animate-pulse" />
              <span className="font-mono text-[11px] font-semibold tracking-widest text-verdigris-deep uppercase">
                {t('hero.concierge')}
              </span>
              <span className="text-sage text-xs">·</span>
              <span className="text-ink-soft text-xs font-medium">
                NABH & JCI Standard Care
              </span>
            </motion.div>

            {/* Headline with Fraunces Serif & Italic Rhythms */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-ink leading-[1.08]">
                {t('hero.headline')}{' '}
                <span className="block mt-1 font-normal italic text-verdigris">
                  {t('hero.subheadline')}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-ink-soft/90 max-w-xl font-normal leading-relaxed pt-2">
                {t('hero.description')}
              </p>
            </motion.div>

            {/* The Intelligent Concierge Input Surface */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-2xl"
            >
              <div className="relative rounded-2xl bg-paper border border-sage shadow-warm-md p-2 transition-all focus-within:shadow-warm-lg focus-within:border-verdigris">
                <div className="flex items-start gap-3 p-3">
                  <div className="p-2.5 rounded-xl bg-mint/50 text-verdigris flex-shrink-0 mt-0.5">
                    <Search size={19} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label htmlFor="concierge-input" className="sr-only">
                      Describe your medical concern or symptom
                    </label>
                    <textarea
                      id="concierge-input"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      className="w-full bg-transparent text-ink placeholder:text-ink-muted text-base leading-relaxed resize-none focus:outline-none min-h-[58px]"
                      placeholder={CONCIERGE_PLACEHOLDERS[placeholderIndex]}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 pb-2 pt-1 border-t border-sage-light/50 text-xs">
                  <span className="text-[11px] text-ink-soft/80 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-verdigris" />
                    Clinical triage guide · Not a final medical diagnosis
                  </span>
                  <Link
                    to={ROUTES.book}
                    className="font-medium text-verdigris hover:text-verdigris-deep underline underline-offset-2 flex items-center gap-1"
                  >
                    Direct Booking <ArrowRight size={11} />
                  </Link>
                </div>

                {/* Instant Specialty Routing Flyout */}
                <AnimatePresence>
                  {suggestion && query.length >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-paper/98 backdrop-blur-xl border border-sage-light rounded-2xl shadow-warm-xl p-4 z-dropdown"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] font-bold text-verdigris uppercase tracking-wider">
                          Recommended Clinical Department
                        </span>
                        <span className="text-[11px] text-sage">Immediate Match</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-bone/80 rounded-xl border border-sage-light/60">
                        <div>
                          <p className="font-display font-bold text-ink text-base">
                            Department of {suggestion.department}
                          </p>
                          <p className="text-xs text-ink-soft">
                            Senior Specialist: <span className="text-ink font-medium">{suggestion.doctor}</span>
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <AvailabilityDot status="available" />
                            <span className="text-xs font-semibold text-verdigris">
                              Next Open Slot: {suggestion.slot}
                            </span>
                          </div>
                        </div>
                        <Link
                          to={ROUTES.book}
                          className="btn btn-primary btn-sm flex-shrink-0"
                        >
                          Book Slot Now
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Symptom Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3.5">
                <span className="text-[11px] font-mono text-sage uppercase tracking-wider mr-1">
                  Frequent:
                </span>
                {QUICK_CHIPS.map(chip => (
                  <button
                    key={chip.dept}
                    onClick={() => handleChipClick(chip.dept)}
                    className="chip text-xs hover:bg-verdigris hover:text-white hover:border-verdigris transition-all duration-200"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Secondary Action Pathway Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex flex-wrap gap-y-3 gap-x-7 pt-1 border-t border-sage-light/60"
            >
              {QUICK_LINKS.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-verdigris transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowRight size={12} className="text-sage group-hover:translate-x-1 group-hover:text-verdigris transition-transform" />
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Right Column (5 cols): Elegant Hospital Architectural Portrait & Realtime Operational Status */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Grand Arch Architectural Frame */}
              <div
                className="relative overflow-hidden shadow-warm-xl border border-sage-light/70"
                style={{
                  borderRadius: '160px 160px 32px 32px',
                  aspectRatio: '0.8',
                  background: 'linear-gradient(180deg, #F1EADC 0%, #CFE6DB 60%, #8FB5A3 100%)',
                }}
              >
                {/* Botanical & Anatomical Geometric Artistry */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <svg viewBox="0 0 280 380" fill="none" className="w-full h-full p-8 text-verdigris">
                    <circle cx="140" cy="140" r="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="140" cy="140" r="60" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M140 40 V240 M40 140 H240" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                    <path
                      d="M140 140 C140 200 90 260 70 320 C110 320 170 300 210 240 C170 200 140 180 140 140 Z"
                      fill="var(--mint)"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* Relif Continuous Signature Thread */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
                  <RelifLine variant="hero" color="#1F7A6B" strokeWidth={2.2} />
                </div>

                {/* Badge Center Base */}
                <div className="absolute bottom-6 inset-x-0 flex flex-col items-center justify-center text-center p-4">
                  <span className="font-display font-semibold text-lg text-ink">
                    Relif Multispecialty Hospital
                  </span>
                  <span className="text-[11px] font-mono tracking-widest text-ink-soft uppercase mt-0.5">
                    Mumbai · Thane · Pune
                  </span>
                </div>
              </div>

              {/* Floating Real-Time Operational Ticker Surface */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 15 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-6 -left-4 sm:-left-8 bg-paper/95 backdrop-blur-xl border border-sage rounded-2xl shadow-warm-xl p-5 max-w-[270px]"
              >
                <div className="flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-sage-light/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-verdigris-deep">
                      Live Hospital Desk
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-sage uppercase font-bold">24/7</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft">Emergency Triage:</span>
                    <span className="font-medium text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Open / Zero Wait
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft">Next OPD Opening:</span>
                    <span className="font-mono font-semibold text-saffron">Today 2:30 PM</span>
                  </div>
                  <div className="pt-1.5 border-t border-sage-light/40">
                    <p className="text-[11px] text-ink-soft font-mono leading-tight">
                      Queue: <strong className="text-ink">Cardiology #C-014</strong> serving
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
