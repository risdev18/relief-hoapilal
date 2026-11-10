// Doctors section — "Meet the people" — tall portrait strip with arch masks

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronRight } from 'lucide-react';
import { SectionHeader, AvailabilityDot, DemoBadge, Badge } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { cn } from '@/utils';

// Demo doctors
const DEMO_DOCTORS = [
  {
    id: 'dr-priya-sharma',
    name: 'Dr. Priya Sharma',
    slug: 'priya-sharma',
    specialty: 'Cardiologist',
    department: 'Cardiology',
    experience: 15,
    languages: ['English', 'Hindi', 'Marathi'],
    availability: 'available' as const,
    nextSlot: 'Today 4:30 PM',
    consultationTypes: ['in-person', 'video'],
    photoColor: 'from-mint to-sage',
    rating: 4.9,
  },
  {
    id: 'dr-rajesh-kulkarni',
    name: 'Dr. Rajesh Kulkarni',
    slug: 'rajesh-kulkarni',
    specialty: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    experience: 20,
    languages: ['English', 'Marathi', 'Hindi'],
    availability: 'available' as const,
    nextSlot: 'Today 3:00 PM',
    consultationTypes: ['in-person'],
    photoColor: 'from-clay to-[var(--saffron-light)]',
    rating: 4.8,
  },
  {
    id: 'dr-ananya-joshi',
    name: 'Dr. Ananya Joshi',
    slug: 'ananya-joshi',
    specialty: 'Pediatrician',
    department: 'Pediatrics',
    experience: 12,
    languages: ['English', 'Hindi'],
    availability: 'available' as const,
    nextSlot: 'Today 5:00 PM',
    consultationTypes: ['in-person', 'video'],
    photoColor: 'from-[var(--saffron-light)] to-clay',
    rating: 4.9,
  },
  {
    id: 'dr-meera-patel',
    name: 'Dr. Meera Patel',
    slug: 'meera-patel',
    specialty: 'Dermatologist',
    department: 'Dermatology',
    experience: 10,
    languages: ['English', 'Gujarati', 'Hindi'],
    availability: 'soon' as const,
    nextSlot: 'Tomorrow 11:30 AM',
    consultationTypes: ['in-person', 'video'],
    photoColor: 'from-mint-light to-mint',
    rating: 4.7,
  },
  {
    id: 'dr-arun-nair',
    name: 'Dr. Arun Nair',
    slug: 'arun-nair',
    specialty: 'General Physician',
    department: 'General Medicine',
    experience: 18,
    languages: ['English', 'Malayalam', 'Hindi'],
    availability: 'available' as const,
    nextSlot: 'Today 2:30 PM',
    consultationTypes: ['in-person', 'video'],
    photoColor: 'from-sage to-[var(--verdigris-deep)]',
    rating: 4.8,
  },
  {
    id: 'dr-sunita-desai',
    name: 'Dr. Sunita Desai',
    slug: 'sunita-desai',
    specialty: 'Neurologist',
    department: 'Neurology',
    experience: 16,
    languages: ['English', 'Marathi', 'Hindi'],
    availability: 'away' as const,
    nextSlot: 'Next week',
    consultationTypes: ['in-person'],
    photoColor: 'from-[var(--night-soft)] to-[var(--night-muted)]',
    rating: 4.9,
  },
];

const FILTER_PILLS = [
  { label: 'All',           value: 'all' },
  { label: 'Available today', value: 'available' },
  { label: 'Video consult',  value: 'video' },
  { label: 'Cardiology',    value: 'dept-cardiology' },
  { label: 'Orthopedics',   value: 'dept-orthopedics' },
  { label: 'Pediatrics',    value: 'dept-pediatrics' },
];

interface DoctorCardProps {
  doctor: typeof DEMO_DOCTORS[0];
  index: number;
}

function DoctorCard({ doctor, index }: DoctorCardProps) {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group flex-shrink-0 w-56 md:w-64"
      onMouseEnter={() => setShowBooking(true)}
      onMouseLeave={() => setShowBooking(false)}
    >
      {/* Portrait arch mask */}
      <div
        className="relative mb-4 overflow-hidden"
        style={{
          borderRadius: '48% 48% 0 0 / 32% 32% 0 0',
          aspectRatio: '0.75',
          background: `linear-gradient(to bottom, var(--mint-light), var(--bone))`,
        }}
      >
        {/* Photo placeholder — botanical anatomical illustration */}
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <svg viewBox="0 0 80 120" fill="none" className="w-3/4 opacity-25">
            {/* Simplified human silhouette */}
            <ellipse cx="40" cy="20" rx="16" ry="18" stroke="var(--verdigris)" strokeWidth="1.5" fill="var(--mint)"/>
            <path d="M24 38 C20 50 18 80 20 110 L60 110 C62 80 60 50 56 38 Z" stroke="var(--verdigris)" strokeWidth="1.5" fill="var(--mint)" opacity="0.5"/>
          </svg>
        </div>

        {/* Demo badge */}
        <div className="absolute top-3 left-3">
          <DemoBadge />
        </div>

        {/* Hover: Book slot overlay */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: showBooking ? 1 : 0, y: showBooking ? 0 : 8 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-0 left-0 right-0 bg-saffron p-3 text-center"
          style={{ background: 'var(--saffron)' }}
        >
          <Link
            to={ROUTES.book}
            className="text-sm font-semibold text-ink"
          >
            Book next slot: {doctor.nextSlot}
          </Link>
        </motion.div>
      </div>

      {/* Info */}
      <div className="px-2">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-display font-semibold text-lg text-ink leading-tight">
            {doctor.name}
          </h3>
          <AvailabilityDot status={doctor.availability} />
        </div>
        
        <p className="text-sm text-ink-soft mb-1">{doctor.specialty}</p>
        
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs text-ink-soft">{doctor.experience} yrs exp.</span>
          <span className="text-sage">·</span>
          <span className="text-xs text-ink-soft">{doctor.languages.slice(0, 2).join(', ')}</span>
        </div>

        <div className="flex items-center justify-between pt-2 mt-2 border-t border-sage-light">
          <div className="flex items-center gap-1.5 flex-wrap">
            {doctor.consultationTypes.includes('video') && (
              <Badge variant="default" size="sm">📹 Video</Badge>
            )}
            <span className="text-xs font-medium text-verdigris">{doctor.nextSlot}</span>
          </div>
          <span className="font-display font-bold text-sm text-ink">₹1,200</span>
        </div>

        <Link
          to={`/book?doctorId=${doctor.id}&doctorName=${encodeURIComponent(doctor.name)}&department=${encodeURIComponent(doctor.department)}`}
          className="btn btn-primary btn-sm w-full justify-center bg-saffron text-ink hover:bg-[var(--saffron-deep)] font-semibold text-xs mt-2"
        >
          Book Consultation
        </Link>
      </div>
    </motion.div>
  );
}

export function DoctorsSection() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = DEMO_DOCTORS.filter(d => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'available') return d.availability === 'available';
    if (activeFilter === 'video') return d.consultationTypes.includes('video');
    if (activeFilter.startsWith('dept-')) {
      return d.department.toLowerCase() === activeFilter.replace('dept-', '');
    }
    return true;
  });

  return (
    <section className="section-padding" style={{ background: 'var(--bone)' }} aria-label="Doctors">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeader
            eyebrow="Our Doctors"
            title="Meet the people."
            subtitle="The specialists who will listen first."
            className="mb-0"
          />
          <Link to={ROUTES.doctors} className="link-arrow flex-shrink-0">
            All doctors <ChevronRight size={16} />
          </Link>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter doctors">
          {FILTER_PILLS.map(pill => (
            <button
              key={pill.value}
              onClick={() => setActiveFilter(pill.value)}
              className={cn(
                'chip transition-all duration-200',
                {
                  'bg-verdigris text-white border-verdigris': activeFilter === pill.value,
                }
              )}
              aria-pressed={activeFilter === pill.value}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Horizontal scroll strip */}
        <div
          className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 md:-mx-8 md:px-8 scrollbar-thin"
          role="list"
          aria-label="Doctor cards"
        >
          {filtered.map((doctor, i) => (
            <div key={doctor.id} role="listitem">
              <DoctorCard doctor={doctor} index={i} />
            </div>
          ))}
          
          {/* View all card */}
          <div className="flex-shrink-0 w-56 md:w-64">
            <Link
              to={ROUTES.doctors}
              className="flex flex-col items-center justify-center h-full min-h-[300px] rounded-2xl border-2 border-dashed border-sage hover:border-verdigris hover:bg-mint-light transition-all duration-300 group"
            >
              <div className="text-center p-6">
                <p className="font-display text-5xl font-bold text-sage group-hover:text-verdigris transition-colors mb-2">
                  40+
                </p>
                <p className="text-sm font-medium text-ink-soft">More doctors</p>
                <p className="text-xs text-ink-soft mt-1">View full directory</p>
                <ChevronRight size={20} className="mx-auto mt-3 text-sage group-hover:text-verdigris transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

