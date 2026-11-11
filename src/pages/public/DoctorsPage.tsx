// Doctors Directory Page — Complete Specialist Directory backed by Supabase
// Consistent 4:5 studio portraits, skeleton loaders, fee transparency, and rich search + filters.

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, Video, MapPin, Globe, IndianRupee } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { AvailabilityDot, DoctorAvatar, EmptyState, Skeleton } from '@/components/ui';
import { SupabaseService } from '@/services/supabaseService';
import type { MasterBranch, MasterDepartment, MasterDoctor } from '@/data/masterCatalog';
import { cn } from '@/utils';

export function DoctorsPage() {
  const [searchParams] = useSearchParams();
  const initialDept = searchParams.get('department') || '';

  const [doctors, setDoctors] = useState<MasterDoctor[]>([]);
  const [departments, setDepartments] = useState<MasterDepartment[]>([]);
  const [branches, setBranches] = useState<MasterBranch[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [maxFee, setMaxFee] = useState<string>('');
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);

  useEffect(() => {
    void Promise.all([
      SupabaseService.getDoctors(),
      SupabaseService.getDepartments(),
      SupabaseService.getBranches(),
    ]).then(([docs, depts, brs]) => {
      setDoctors(docs);
      setDepartments(depts);
      setBranches(brs);
      setLoading(false);
    });
  }, []);

  const allLanguages = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach(d => d.languages.forEach(l => set.add(l)));
    return Array.from(set).sort();
  }, [doctors]);

  const filtered = useMemo(() => {
    return doctors.filter(d => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.designation.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.departmentName.toLowerCase().includes(q);

      const matchesDept = !selectedDept || d.departmentSlug === selectedDept;
      const matchesBranch = !selectedBranch || d.branchSlug === selectedBranch;
      const matchesLanguage = !selectedLanguage || d.languages.includes(selectedLanguage);
      const matchesFee = !maxFee || d.feeInClinic <= Number(maxFee);
      const matchesAvail = !availableTodayOnly || d.availability === 'available';

      return (
        matchesSearch &&
        matchesDept &&
        matchesBranch &&
        matchesLanguage &&
        matchesFee &&
        matchesAvail
      );
    });
  }, [doctors, search, selectedDept, selectedBranch, selectedLanguage, maxFee, availableTodayOnly]);

  const clearFilters = () => {
    setSearch('');
    setSelectedDept('');
    setSelectedBranch('');
    setSelectedLanguage('');
    setMaxFee('');
    setAvailableTodayOnly(false);
  };

  return (
    <div className="bg-paper min-h-screen">
      {/* Header */}
      <div className="bg-bone border-b border-sage-light py-14">
        <div className="section-container">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-verdigris block mb-2">
            Medical Faculty · {doctors.length} Specialists
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink mb-3">
            Find your doctor.
          </h1>
          <p className="text-ink-soft max-w-2xl text-base leading-relaxed">
            Inspect verified qualifications, languages spoken, real consultation fees in INR, and available clinic or video slots before booking.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-paper border-b border-sage-light sticky top-14 z-sticky">
        <div className="section-container py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="relative lg:col-span-2">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search doctor name or specialty…"
                className="input pl-10 text-sm"
                aria-label="Search doctors"
              />
            </div>

            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="input text-sm"
              aria-label="Filter by department"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="input text-sm"
              aria-label="Filter by branch"
            >
              <option value="">All Branches</option>
              {branches.map(b => (
                <option key={b.slug} value={b.slug}>
                  {b.shortName}
                </option>
              ))}
            </select>

            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="input text-sm"
              aria-label="Filter by language"
            >
              <option value="">Any Language</option>
              {allLanguages.map(l => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <select
              value={maxFee}
              onChange={e => setMaxFee(e.target.value)}
              className="input text-sm"
              aria-label="Filter by max consultation fee"
            >
              <option value="">Any Fee</option>
              <option value="800">Up to ₹800</option>
              <option value="1000">Up to ₹1,000</option>
              <option value="1200">Up to ₹1,200</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAvailableTodayOnly(v => !v)}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-colors',
                  availableTodayOnly
                    ? 'bg-verdigris text-white border-verdigris'
                    : 'bg-bone text-ink-soft border-sage-light hover:border-verdigris'
                )}
              >
                <AvailabilityDot status="available" />
                Available today only
              </button>
              <span className="text-xs font-mono text-ink-soft">
                Showing {filtered.length} {filtered.length === 1 ? 'doctor' : 'doctors'}
              </span>
            </div>

            {(search || selectedDept || selectedBranch || selectedLanguage || maxFee || availableTodayOnly) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-verdigris hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="section-container py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="card p-5 space-y-4">
                <Skeleton className="w-full h-72 rounded-2xl" />
                <Skeleton lines={4} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No specialists match those filters"
            description="Try clearing a language, fee cap, or branch filter to view more doctors."
            action={
              <button onClick={clearFilters} className="btn btn-primary btn-md">
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doc, idx) => (
              <motion.article
                key={doc.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.25), duration: 0.35 }}
                className="card p-5 flex flex-col justify-between bg-paper"
              >
                <div>
                  <div className="relative mb-4">
                    <DoctorAvatar
                      name={doc.name}
                      photoUrl={doc.photoUrl}
                      alt={`${doc.name} portrait`}
                      className="w-full"
                    />
                    <div className="absolute top-3 left-3 bg-paper/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-sage-light text-[11px] font-medium flex items-center gap-1.5">
                      <AvailabilityDot status={doc.availability} />
                      <span className="text-ink">{doc.nextSlotLabel}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-ink text-paper px-2.5 py-1 rounded-full font-mono text-xs font-bold flex items-center gap-0.5">
                      <IndianRupee size={11} />
                      <span>{doc.feeInClinic}</span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-verdigris">
                        {doc.departmentName}
                      </span>
                      <h2 className="font-display text-xl font-bold text-ink">
                        <Link to={ROUTES.doctor(doc.slug)} className="hover:text-verdigris transition-colors">
                          {doc.name}
                        </Link>
                      </h2>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-bone px-2 py-1 rounded-lg border border-sage-light text-xs font-semibold text-ink flex-shrink-0">
                      <Star size={12} className="fill-saffron text-saffron" />
                      <span>{doc.rating}</span>
                      <span className="text-ink-soft font-normal">({doc.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-ink-soft mb-3">{doc.designation}</p>

                  <div className="space-y-1.5 text-xs text-ink-soft border-t border-sage-light/70 pt-3 mb-4">
                    <p>{doc.experienceYears} years experience · {doc.qualifications.join(', ')}</p>
                    <p className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-verdigris flex-shrink-0" />
                      <span>{doc.branchName} · OPD ₹{doc.feeInClinic}</span>
                    </p>
                    {doc.consultationTypes.includes('video') && (
                      <p className="flex items-center gap-1.5">
                        <Video size={12} className="text-verdigris flex-shrink-0" />
                        <span>Video Consult ₹{doc.feeVideo}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-1.5">
                      <Globe size={12} className="text-verdigris flex-shrink-0" />
                      <span>{doc.languages.join(', ')}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to={ROUTES.doctor(doc.slug)}
                    className="btn btn-secondary btn-sm justify-center"
                  >
                    Full Profile
                  </Link>
                  <Link
                    to={`${ROUTES.book}?department=${doc.departmentSlug}&doctor=${doc.slug}`}
                    className="btn btn-primary btn-sm justify-center"
                  >
                    Book · ₹{doc.feeInClinic}
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
