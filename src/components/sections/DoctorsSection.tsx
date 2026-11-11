// Doctors section — "Meet the Specialists" — real Supabase doctors with 4:5 photos, fees, experience, ratings & Book CTAs

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Globe, MapPin } from 'lucide-react';
import { SectionHeader, AvailabilityDot, DoctorAvatar, Skeleton } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { SupabaseService } from '@/services/supabaseService';
import type { MasterDoctor } from '@/data/masterCatalog';
import { cn } from '@/utils';

const FILTER_PILLS = [
  { label: 'All Specialists', value: 'all' },
  { label: 'Available Today', value: 'available' },
  { label: 'Video Consult',   value: 'video' },
  { label: 'Cardiology',      value: 'dept-cardiology' },
  { label: 'Orthopedics',     value: 'dept-orthopedics' },
  { label: 'Pediatrics',      value: 'dept-pediatrics' },
];

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<MasterDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    void SupabaseService.getDoctors().then(list => {
      setDoctors(list);
      setLoading(false);
    });
  }, []);

  const filtered = doctors.filter(d => {
    if (activeFilter === 'available') return d.availability === 'available';
    if (activeFilter === 'video') return d.consultationTypes.includes('video');
    if (activeFilter.startsWith('dept-')) {
      return d.departmentSlug === activeFilter.replace('dept-', '');
    }
    return true;
  }).slice(0, 6);

  return (
    <section className="section-padding bg-bone" aria-label="Featured Doctors">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <SectionHeader
            eyebrow="Our Specialists"
            title="Meet our doctors."
            subtitle="Transparent consultation fees, verified qualifications and same-day OPD or video slots."
            className="mb-0"
          />
          <Link
            to={ROUTES.doctors}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-verdigris hover:text-verdigris-deep whitespace-nowrap"
          >
            View all {doctors.length || 14} doctors <ChevronRight size={16} />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTER_PILLS.map(pill => (
            <button
              key={pill.value}
              type="button"
              onClick={() => setActiveFilter(pill.value)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                activeFilter === pill.value
                  ? 'bg-verdigris text-white border-verdigris shadow-xs'
                  : 'bg-paper text-ink-soft border-sage-light hover:border-verdigris hover:text-ink'
              )}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="card p-5 space-y-4">
                <Skeleton className="w-full h-64 rounded-2xl" />
                <Skeleton lines={3} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doctor, index) => (
              <motion.article
                key={doctor.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.45 }}
                className="card p-5 flex flex-col justify-between bg-paper"
              >
                <div>
                  <div className="relative mb-4">
                    <DoctorAvatar
                      name={doctor.name}
                      photoUrl={doctor.photoUrl}
                      alt={`${doctor.name} — ${doctor.designation}`}
                      className="w-full"
                    />
                    <div className="absolute top-3 left-3 bg-paper/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-sage-light text-[11px] font-medium flex items-center gap-1.5 shadow-warm-xs">
                      <AvailabilityDot status={doctor.availability} />
                      <span className="text-ink">{doctor.nextSlotLabel}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-ink text-paper px-2.5 py-1 rounded-full font-mono text-xs font-bold shadow-warm-xs">
                      ₹{doctor.feeInClinic}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-verdigris">
                        {doctor.departmentName}
                      </span>
                      <h3 className="font-display text-xl font-bold text-ink">
                        <Link to={ROUTES.doctor(doctor.slug)} className="hover:text-verdigris transition-colors">
                          {doctor.name}
                        </Link>
                      </h3>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-bone px-2 py-1 rounded-lg border border-sage-light text-xs font-semibold text-ink flex-shrink-0">
                      <Star size={12} className="fill-saffron text-saffron" />
                      <span>{doctor.rating}</span>
                      <span className="text-ink-soft font-normal">({doctor.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-ink-soft mb-3">{doctor.designation}</p>

                  <div className="space-y-1.5 text-xs text-ink-soft border-t border-sage-light/70 pt-3 mb-4">
                    <p>{doctor.experienceYears} years experience · {doctor.qualifications.slice(0, 3).join(', ')}</p>
                    <p className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-verdigris flex-shrink-0" />
                      <span>{doctor.branchName} · OPD ₹{doctor.feeInClinic} / Video ₹{doctor.feeVideo}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Globe size={12} className="text-verdigris flex-shrink-0" />
                      <span>{doctor.languages.join(', ')}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to={ROUTES.doctor(doctor.slug)}
                    className="btn btn-secondary btn-sm justify-center"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`${ROUTES.book}?department=${doctor.departmentSlug}&doctor=${doctor.slug}`}
                    className="btn btn-primary btn-sm justify-center"
                  >
                    Book · ₹{doctor.feeInClinic}
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
