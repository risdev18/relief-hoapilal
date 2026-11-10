// Departments index page
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { DEPARTMENTS, ROUTES } from '@/config/constants';
import { Badge, SectionHeader, AvailabilityDot } from '@/components/ui';
import { cn } from '@/utils';

const DEPT_DOCTOR_COUNTS: Record<string, number> = {
  'cardiology': 8, 'neurology': 6, 'orthopedics': 7, 'oncology': 5,
  'pediatrics': 9, 'gynecology': 6, 'general-medicine': 12, 'general-surgery': 7,
  'gastroenterology': 4, 'dermatology': 5, 'ent': 4, 'ophthalmology': 5,
  'urology': 4, 'nephrology': 3, 'pulmonology': 4, 'emergency-medicine': 15,
  'radiology': 6, 'physiotherapy': 8, 'dentistry': 5, 'critical-care': 10,
};

const DEPT_NEXT_SLOT: Record<string, string> = {
  'cardiology': 'Today 4:30 PM', 'neurology': 'Tomorrow 10:00 AM', 'orthopedics': 'Today 3:00 PM',
  'oncology': 'Tomorrow 9:30 AM', 'pediatrics': 'Today 5:00 PM', 'gynecology': 'Today 4:00 PM',
  'general-medicine': 'Today 2:30 PM', 'general-surgery': 'Tomorrow 11:00 AM',
  'gastroenterology': 'Today 6:00 PM', 'dermatology': 'Tomorrow 10:30 AM',
  'ent': 'Today 3:30 PM', 'ophthalmology': 'Today 5:30 PM', 'urology': 'Tomorrow 9:00 AM',
  'nephrology': 'Next week', 'pulmonology': 'Today 4:00 PM', 'emergency-medicine': 'Walk-in 24/7',
  'radiology': 'Today 2:00 PM', 'physiotherapy': 'Today 3:00 PM',
  'dentistry': 'Tomorrow 10:00 AM', 'critical-care': 'Walk-in 24/7',
};

const DEPT_DESCRIPTIONS: Record<string, string> = {
  'cardiology': 'Heart, blood vessels, and circulatory health',
  'neurology': 'Brain, spine, and nervous system conditions',
  'orthopedics': 'Bones, joints, muscles, and sports injuries',
  'oncology': 'Cancer diagnosis and treatment',
  'pediatrics': 'Child health from newborn to adolescence',
  'gynecology': "Women's reproductive and maternal health",
  'general-medicine': 'Primary care and internal medicine',
  'general-surgery': 'Surgical procedures for a wide range of conditions',
  'gastroenterology': 'Digestive system and liver conditions',
  'dermatology': 'Skin, hair, and nail conditions',
  'ent': 'Ear, nose, throat, and head & neck conditions',
  'ophthalmology': 'Eye health and vision care',
  'urology': 'Urinary tract and male reproductive health',
  'nephrology': 'Kidney disease and renal care',
  'pulmonology': 'Lungs, breathing, and respiratory conditions',
  'emergency-medicine': '24/7 emergency and trauma care',
  'radiology': 'Imaging: X-ray, MRI, CT, ultrasound',
  'physiotherapy': 'Rehabilitation, mobility, and pain management',
  'dentistry': 'Oral health, dental care and surgery',
  'critical-care': 'ICU and intensive care for critical patients',
};

export function DepartmentsPage() {
  const [query, setQuery] = useState('');

  const filtered = DEPARTMENTS.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    (DEPT_DESCRIPTIONS[d.id] || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-paper min-h-screen">
      {/* Page header */}
      <div className="bg-bone border-b border-sage-light py-16">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">All Departments</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">The Index.</h1>
          <p className="text-ink-soft text-lg max-w-xl">Twenty specialties. Find the right department and book directly.</p>
        </div>
      </div>

      <div className="section-container py-12">
        {/* Search */}
        <div className="relative max-w-sm mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" size={18} />
          <input
            type="search" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search departments…" className="input pl-10 pr-4" aria-label="Search departments"
          />
        </div>

        {/* List */}
        <div className="border-t border-sage-light">
          {filtered.map((dept, i) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.3 }}
            >
              <Link
                to={ROUTES.department(dept.slug)}
                className="group flex items-center justify-between py-5 px-3 border-b border-sage-light hover:bg-bone rounded-xl transition-all duration-200 -mx-3"
              >
                <div className="flex items-baseline gap-6 flex-1 min-w-0">
                  <span className="font-mono text-xs text-sage w-6 flex-shrink-0">{String(i+1).padStart(2,'0')}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-display text-2xl font-semibold text-ink group-hover:text-verdigris transition-colors">{dept.name}</span>
                    <p className="text-sm text-ink-soft mt-0.5 hidden md:block">{DEPT_DESCRIPTIONS[dept.id]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-6 flex-shrink-0 ml-4">
                  <span className="hidden sm:block text-sm text-ink-soft">{DEPT_DOCTOR_COUNTS[dept.id]} doctors</span>
                  <div className="flex items-center gap-1.5">
                    <AvailabilityDot status={DEPT_NEXT_SLOT[dept.id] === 'Next week' ? 'away' : 'available'} />
                    <span className="text-sm font-medium text-verdigris hidden md:block">{DEPT_NEXT_SLOT[dept.id]}</span>
                  </div>
                  <ChevronRight size={18} className="text-sage group-hover:text-verdigris group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-ink-soft">No departments found for "{query}"</p>
              <button onClick={() => setQuery('')} className="mt-3 text-sm font-medium text-verdigris hover:underline">Clear search</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

