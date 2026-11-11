// Hero section — "The Care Concierge"
// Real symptom-to-department & doctor matcher backed by Supabase, single focus ring search pill, editorial hospital portrait.

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, CheckCircle2, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AvailabilityDot, DoctorAvatar } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { SupabaseService } from '@/services/supabaseService';
import type { MasterDepartment, MasterDoctor } from '@/data/masterCatalog';

const CONCIERGE_PLACEHOLDERS = [
  'Child has persistent fever since yesterday…',
  'Tightness or pain in chest on exertion…',
  'Lower back pain when lifting or sitting…',
  'Routine health checkup or skin rash…',
];

const QUICK_CHIPS = [
  { key: 'fever', labelKey: 'hero.chips.fever', query: 'Fever' },
  { key: 'chestPain', labelKey: 'hero.chips.chestPain', query: 'Chest pain' },
  { key: 'backPain', labelKey: 'hero.chips.backPain', query: 'Back pain' },
  { key: 'childHealth', labelKey: 'hero.chips.childHealth', query: 'Child health' },
] as const;

const QUICK_LINKS = [
  { label: 'Consult Our Specialists', href: ROUTES.doctors },
  { label: 'Diagnostics & Packages',  href: ROUTES.diagnostics },
  { label: 'Patient Reports Portal',  href: ROUTES.patientRecords },
  { label: 'Refund & Fee Policy',     href: ROUTES.legal('refund') },
];

export function HeroSection() {
  const { t } = useTranslation();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [departments, setDepartments] = useState<MasterDepartment[]>([]);
  const [doctors, setDoctors] = useState<MasterDoctor[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(i => (i + 1) % CONCIERGE_PLACEHOLDERS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    void Promise.all([
      SupabaseService.getDepartments(),
      SupabaseService.getDoctors(),
    ]).then(([depts, docs]) => {
      setDepartments(depts);
      setDoctors(docs);
    });
  }, []);

  const searchResult = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2 || departments.length === 0) return null;

    // Score departments by symptom keywords, name, and description
    let bestDept = departments.find(d => d.slug === 'general-medicine') || departments[0];
    let topScore = 0;

    for (const dept of departments) {
      let score = 0;
      if (dept.name.toLowerCase().includes(q)) score += 6;
      if (dept.description.toLowerCase().includes(q)) score += 2;
      for (const kw of dept.symptomKeywords || []) {
        if (q.includes(kw.toLowerCase()) || kw.toLowerCase().includes(q)) {
          score += 5;
        }
      }
      if (score > topScore) {
        topScore = score;
        bestDept = dept;
      }
    }

    // Also allow direct doctor search by name or specialty
    const matchedDoctors = doctors.filter(doc =>
      doc.name.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.departmentSlug === bestDept.slug
    );

    const recommendedDoctors = (matchedDoctors.length > 0 ? matchedDoctors : doctors).slice(0, 2);

    return {
      department: bestDept,
      doctors: recommendedDoctors,
    };
  }, [query, departments, doctors]);

  return (
    <section className="relative overflow-hidden bg-paper" aria-label="Hero Section">
      <div className="absolute inset-0 bg-[radial-gradient(#1F7A6B_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-mint/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-bone blur-2xl pointer-events-none" />

      <div className="section-container relative w-full pt-10 pb-20 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-bone border border-sage-light/70 shadow-warm-sm"
            >
              <span className="w-2 h-2 rounded-full bg-verdigris animate-pulse" />
              <span className="font-mono text-[11px] font-semibold tracking-widest text-verdigris-deep uppercase">
                {t('hero.concierge')}
              </span>
              <span className="text-sage text-xs">·</span>
              <span className="text-ink-soft text-xs font-medium">
                NABH &amp; NABL Accredited Care
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-ink leading-[1.08]">
                {t('hero.headline')}{' '}
                <span className="block mt-1 font-normal italic text-verdigris">
                  {t('hero.subheadline')}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-ink-soft/90 max-w-xl font-normal leading-relaxed pt-1">
                {t('hero.description')}
              </p>
            </motion.div>

            {/* Single Clean Focus-Ring Search Pill (no double inner outline) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-2xl"
            >
              <div className="relative rounded-2xl bg-paper border border-sage shadow-warm-md p-2 transition-all focus-within:border-verdigris focus-within:ring-2 focus-within:ring-verdigris/25">
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <div className="p-2.5 rounded-xl bg-mint/60 text-verdigris flex-shrink-0">
                    <Search size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label htmlFor="concierge-input" className="sr-only">
                      Describe symptoms, department, or doctor name
                    </label>
                    <input
                      id="concierge-input"
                      type="search"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      className="w-full bg-transparent border-0 p-0 text-ink placeholder:text-ink-muted text-base leading-relaxed focus:outline-none focus:ring-0"
                      placeholder={CONCIERGE_PLACEHOLDERS[placeholderIndex]}
                    />
                  </div>
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="text-xs font-mono text-ink-soft hover:text-ink px-2 py-1 rounded-lg hover:bg-bone"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-1.5 pt-2 border-t border-sage-light/50 text-xs">
                  <span className="text-[11px] text-ink-soft/80 flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-verdigris flex-shrink-0" />
                    {t('hero.disclaimer')}
                  </span>
                  <Link
                    to={ROUTES.book}
                    className="font-semibold text-verdigris hover:text-verdigris-deep underline underline-offset-2 inline-flex items-center gap-1"
                  >
                    Direct Booking <ArrowRight size={11} />
                  </Link>
                </div>

                {/* Live Specialty & Specialist Routing Flyout */}
                <AnimatePresence>
                  {searchResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-paper border border-sage rounded-2xl shadow-warm-xl p-4 z-dropdown space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-verdigris uppercase tracking-wider">
                            Suggested Department
                          </span>
                          <p className="font-display font-bold text-ink text-lg leading-tight">
                            {searchResult.department.name}
                          </p>
                        </div>
                        <Link
                          to={ROUTES.department(searchResult.department.slug)}
                          className="text-xs font-semibold text-verdigris hover:underline"
                        >
                          View Dept →
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {searchResult.doctors.map(doc => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-3 p-2.5 bg-bone/85 rounded-xl border border-sage-light/70"
                          >
                            <DoctorAvatar
                              name={doc.name}
                              photoUrl={doc.photoUrl}
                              className="w-12 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-xs text-ink truncate">{doc.name}</p>
                              <p className="text-[11px] text-ink-soft truncate">{doc.specialty}</p>
                              <div className="flex items-center gap-2 mt-1 text-[11px]">
                                <span className="font-mono font-semibold text-verdigris-deep">
                                  ₹{doc.feeInClinic}
                                </span>
                                <span className="text-sage">·</span>
                                <span className="inline-flex items-center gap-0.5 text-ink-soft">
                                  <Star size={10} className="fill-saffron text-saffron" />
                                  {doc.rating}
                                </span>
                              </div>
                            </div>
                            <Link
                              to={`${ROUTES.book}?department=${doc.departmentSlug}&doctor=${doc.slug}`}
                              className="btn btn-primary btn-sm px-3 py-1.5 text-xs flex-shrink-0"
                            >
                              {t('common.book')}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Symptom Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3.5">
                <span className="text-[11px] font-mono text-sage uppercase tracking-wider mr-1">
                  Quick triage:
                </span>
                {QUICK_CHIPS.map(chip => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => setQuery(chip.query)}
                    className="chip text-xs hover:bg-verdigris hover:text-white hover:border-verdigris transition-all duration-200 cursor-pointer"
                  >
                    {t(chip.labelKey)}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Secondary Action Pathway Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.45 }}
              className="flex flex-wrap gap-y-3 gap-x-7 pt-2 border-t border-sage-light/60"
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

          {/* Right Column: Editorial Hospital & Senior Clinician Portrait in Soft Arch */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              <div
                className="relative overflow-hidden shadow-warm-xl border border-sage-light/70 bg-bone"
                style={{
                  borderRadius: '160px 160px 32px 32px',
                  aspectRatio: '0.82',
                }}
              >
                <img
                  src="/images/hero-hospital.jpg"
                  alt="Senior physician at Relif Care Multispecialty Hospital atrium"
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-36 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(16,38,31,0) 0%, rgba(16,38,31,0.82) 100%)',
                  }}
                />
                <div className="absolute bottom-5 inset-x-0 flex flex-col items-center justify-center text-center px-4">
                  <span className="font-display font-semibold text-lg text-paper">
                    Relif Care Multispecialty
                  </span>
                  <span className="text-[11px] font-mono tracking-widest text-mint uppercase mt-0.5">
                    Andheri West · Thane West · Pune
                  </span>
                </div>
              </div>

              {/* Floating Operational Desk Card */}
              <motion.div
                initial={{ opacity: 0, x: -16, y: 12 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="hidden sm:block absolute -bottom-6 -left-4 lg:-left-8 bg-paper/95 backdrop-blur-xl border border-sage rounded-2xl shadow-warm-xl p-4 max-w-[260px]"
              >
                <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-sage-light/60">
                  <div className="flex items-center gap-2">
                    <AvailabilityDot status="available" />
                    <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-verdigris-deep">
                      {t('hero.liveTitle')}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-sage uppercase font-bold">24/7</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft">Emergency Triage:</span>
                    <span className="font-semibold text-verdigris-deep flex items-center gap-1">
                      <CheckCircle2 size={11} /> {t('hero.erStatus')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft">{t('hero.nextSlot')}:</span>
                    <span className="font-mono font-semibold text-saffron-deep">Same-day OPD</span>
                  </div>
                  <div className="pt-1 border-t border-sage-light/40">
                    <p className="text-[11px] text-ink-soft font-mono leading-tight">
                      {t('hero.queueNow')}
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
