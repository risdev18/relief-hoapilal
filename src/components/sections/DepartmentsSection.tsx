// Departments section — "The Index" — a typographic list, NOT a card grid

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { DEPARTMENTS, ROUTES } from '@/config/constants';
import { SectionHeader, AvailabilityDot } from '@/components/ui';
import { cn } from '@/utils';

// Demo data for each department
const DEPT_DATA: Record<string, { doctorCount: number; nextSlot: string; availability: 'available' | 'soon' | 'away' }> = {
  'cardiology':         { doctorCount: 8,  nextSlot: 'Today 4:30 PM',    availability: 'available' },
  'neurology':          { doctorCount: 6,  nextSlot: 'Tomorrow 10:00 AM', availability: 'soon' },
  'orthopedics':        { doctorCount: 7,  nextSlot: 'Today 3:00 PM',    availability: 'available' },
  'oncology':           { doctorCount: 5,  nextSlot: 'Tomorrow 9:30 AM', availability: 'soon' },
  'pediatrics':         { doctorCount: 9,  nextSlot: 'Today 5:00 PM',    availability: 'available' },
  'gynecology':         { doctorCount: 6,  nextSlot: 'Today 4:00 PM',    availability: 'available' },
  'general-medicine':   { doctorCount: 12, nextSlot: 'Today 2:30 PM',   availability: 'available' },
  'general-surgery':    { doctorCount: 7,  nextSlot: 'Tomorrow 11:00 AM',availability: 'soon' },
  'gastroenterology':   { doctorCount: 4,  nextSlot: 'Today 6:00 PM',    availability: 'available' },
  'dermatology':        { doctorCount: 5,  nextSlot: 'Tomorrow 10:30 AM',availability: 'soon' },
  'ent':                { doctorCount: 4,  nextSlot: 'Today 3:30 PM',    availability: 'available' },
  'ophthalmology':      { doctorCount: 5,  nextSlot: 'Today 5:30 PM',    availability: 'available' },
  'urology':            { doctorCount: 4,  nextSlot: 'Tomorrow 9:00 AM', availability: 'soon' },
  'nephrology':         { doctorCount: 3,  nextSlot: 'Tomorrow 2:00 PM', availability: 'away' },
  'pulmonology':        { doctorCount: 4,  nextSlot: 'Today 4:00 PM',    availability: 'available' },
  'emergency-medicine': { doctorCount: 15, nextSlot: 'Walk-in 24/7',    availability: 'available' },
  'radiology':          { doctorCount: 6,  nextSlot: 'Today 2:00 PM',    availability: 'available' },
  'physiotherapy':      { doctorCount: 8,  nextSlot: 'Today 3:00 PM',    availability: 'available' },
  'dentistry':          { doctorCount: 5,  nextSlot: 'Tomorrow 10:00 AM',availability: 'soon' },
  'critical-care':      { doctorCount: 10, nextSlot: 'Walk-in 24/7',    availability: 'available' },
};

const DEPT_DESCRIPTIONS: Record<string, string> = {
  'cardiology':         'Heart, blood vessels, and circulatory health',
  'neurology':          'Brain, spine, and nervous system conditions',
  'orthopedics':        'Bones, joints, muscles, and sports injuries',
  'oncology':           'Cancer diagnosis and treatment',
  'pediatrics':         'Child health from newborn to adolescence',
  'gynecology':         'Women\'s reproductive and maternal health',
  'general-medicine':   'Primary care and internal medicine',
  'general-surgery':    'Surgical procedures for a wide range of conditions',
  'gastroenterology':   'Digestive system and liver conditions',
  'dermatology':        'Skin, hair, and nail conditions',
  'ent':                'Ear, nose, throat, and head & neck conditions',
  'ophthalmology':      'Eye health and vision care',
  'urology':            'Urinary tract and male reproductive health',
  'nephrology':         'Kidney disease and renal care',
  'pulmonology':        'Lungs, breathing, and respiratory conditions',
  'emergency-medicine': '24/7 emergency and trauma care',
  'radiology':          'Imaging: X-ray, MRI, CT, ultrasound',
  'physiotherapy':      'Rehabilitation, mobility, and pain management',
  'dentistry':          'Oral health, dental care and surgery',
  'critical-care':      'ICU and intensive care for critical patients',
};

export function DepartmentsSection() {
  const [searchQuery, setSearchQuery]   = useState('');
  const [hoveredDept, setHoveredDept]   = useState<string | null>(null);
  const [cursorPos, setCursorPos]       = useState({ x: 0, y: 0 });
  const sectionRef                      = useRef<HTMLDivElement>(null);

  const springX = useSpring(0, { stiffness: 150, damping: 25 });
  const springY = useSpring(0, { stiffness: 150, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    springX.set(e.clientX - rect.left);
    springY.set(e.clientY - rect.top);
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const filtered = DEPARTMENTS.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (DEPT_DESCRIPTIONS[d.id] || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-paper relative overflow-hidden"
      onMouseMove={handleMouseMove}
      aria-label="Departments"
    >
      <div className="section-container">
        <SectionHeader
          eyebrow="All Departments"
          title={<>The Index.</>}
          subtitle="Twenty specialties. One place. Find the right department and the right doctor."
        />

        {/* Search */}
        <div className="relative max-w-sm mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" size={18} />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search departments…"
            className="input pl-10 pr-4"
            aria-label="Search departments"
          />
        </div>

        {/* Typographic department list */}
        <div className="border-t border-sage-light">
          <AnimatePresence>
            {filtered.map((dept, i) => {
              const data  = DEPT_DATA[dept.id];
              const isActive = hoveredDept === dept.id;
              
              return (
                <motion.div
                  key={dept.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={ROUTES.department(dept.slug)}
                    className={cn(
                      'group flex items-center justify-between py-4 md:py-5 px-2 border-b border-sage-light',
                      'transition-all duration-300 rounded-lg -mx-2',
                      {
                        'bg-bone px-4 -mx-2 shadow-warm-sm': isActive,
                      }
                    )}
                    onMouseEnter={() => setHoveredDept(dept.id)}
                    onMouseLeave={() => setHoveredDept(null)}
                  >
                    {/* Left: index + name */}
                    <div className="flex items-baseline gap-5 md:gap-8 flex-1 min-w-0">
                      <span className="font-mono text-xs text-ink-soft w-6 flex-shrink-0">
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span
                          className={cn(
                            'font-display font-semibold text-xl md:text-2xl transition-colors duration-300',
                            {
                              'text-verdigris': isActive,
                              'text-ink':       !isActive,
                            }
                          )}
                        >
                          {dept.name}
                        </span>
                        <p className="text-sm text-ink-soft mt-0.5 hidden md:block">
                          {DEPT_DESCRIPTIONS[dept.id]}
                        </p>
                      </div>
                    </div>

                    {/* Right: doctor count + availability + arrow */}
                    <div className="flex items-center gap-4 md:gap-6 flex-shrink-0 ml-4">
                      {data && (
                        <>
                          <span className="hidden sm:block text-sm text-ink-soft">
                            {data.doctorCount} doctors
                          </span>
                          <div className="flex items-center gap-1.5">
                            <AvailabilityDot status={data.availability} />
                            <span className="text-sm font-medium text-verdigris hidden md:block">
                              {data.nextSlot}
                            </span>
                          </div>
                        </>
                      )}
                      <ChevronRight
                        size={18}
                        className={cn('transition-all duration-300', {
                          'translate-x-1 text-verdigris': isActive,
                          'text-sage':                    !isActive,
                        })}
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-ink-soft">No departments found for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-sm font-medium text-verdigris hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* View all CTA */}
        <div className="mt-8 flex justify-center">
          <Link to={ROUTES.departments} className="btn btn-secondary btn-md">
            Explore all departments
          </Link>
        </div>
      </div>

      {/* Cursor-following arch preview — desktop only */}
      <AnimatePresence>
        {hoveredDept && (
          <motion.div
            className="absolute pointer-events-none hidden lg:block"
            style={{
              x: springX,
              y: springY,
              transform: 'translate(-50%, -120%)',
              zIndex: 'var(--z-above)',
            }}
          >
            <div className="bg-paper border border-sage-light rounded-2xl shadow-warm-xl p-5 w-56">
              <div
                className="w-full h-28 rounded-xl mb-3 overflow-hidden"
                style={{ background: 'var(--bone)' }}
              >
                {/* Botanical illustration for each dept */}
                <div className="flex items-center justify-center h-full">
                  <svg viewBox="0 0 60 60" fill="none" className="w-16 opacity-30">
                    <circle cx="30" cy="30" r="20" stroke="var(--verdigris)" strokeWidth="1.5" fill="none"/>
                    <path d="M30 10 C30 10 40 20 40 30 C40 40 30 50 30 50 C30 50 20 40 20 30 C20 20 30 10 30 10" fill="var(--mint)" stroke="var(--verdigris)" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
              <p className="font-semibold text-ink text-sm">{DEPARTMENTS.find(d => d.id === hoveredDept)?.name}</p>
              <p className="text-xs text-ink-soft mt-1">{DEPT_DESCRIPTIONS[hoveredDept]}</p>
              <p className="text-xs font-medium text-verdigris mt-2">
                {DEPT_DATA[hoveredDept]?.doctorCount} specialists
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

