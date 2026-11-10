// Doctors Directory Page
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { ROUTES, DEPARTMENTS } from '@/config/constants';
import { Badge, DemoBadge, AvailabilityDot } from '@/components/ui';
import { cn } from '@/utils';

const DEMO_DOCTORS = [
  { id: '1', name: 'Dr. Priya Sharma', slug: 'priya-sharma', specialty: 'Interventional Cardiologist', department: 'Cardiology', experience: 15, languages: ['English', 'Hindi', 'Marathi'], availability: 'available' as const, nextSlot: 'Today 4:30 PM', consultationTypes: ['in-person', 'video'], gender: 'female', rating: 4.9, reviews: 124 },
  { id: '2', name: 'Dr. Rajesh Kulkarni', slug: 'rajesh-kulkarni', specialty: 'Orthopedic Surgeon', department: 'Orthopedics', experience: 20, languages: ['English', 'Marathi', 'Hindi'], availability: 'available' as const, nextSlot: 'Today 3:00 PM', consultationTypes: ['in-person'], gender: 'male', rating: 4.8, reviews: 98 },
  { id: '3', name: 'Dr. Ananya Joshi', slug: 'ananya-joshi', specialty: 'Pediatrician', department: 'Pediatrics', experience: 12, languages: ['English', 'Hindi'], availability: 'available' as const, nextSlot: 'Today 5:00 PM', consultationTypes: ['in-person', 'video'], gender: 'female', rating: 4.9, reviews: 213 },
  { id: '4', name: 'Dr. Meera Patel', slug: 'meera-patel', specialty: 'Dermatologist', department: 'Dermatology', experience: 10, languages: ['English', 'Gujarati', 'Hindi'], availability: 'soon' as const, nextSlot: 'Tomorrow 11:30 AM', consultationTypes: ['in-person', 'video'], gender: 'female', rating: 4.7, reviews: 76 },
  { id: '5', name: 'Dr. Arun Nair', slug: 'arun-nair', specialty: 'General Physician', department: 'General Medicine', experience: 18, languages: ['English', 'Malayalam', 'Hindi'], availability: 'available' as const, nextSlot: 'Today 2:30 PM', consultationTypes: ['in-person', 'video'], gender: 'male', rating: 4.8, reviews: 167 },
  { id: '6', name: 'Dr. Sunita Desai', slug: 'sunita-desai', specialty: 'Neurologist', department: 'Neurology', experience: 16, languages: ['English', 'Marathi', 'Hindi'], availability: 'away' as const, nextSlot: 'Next week', consultationTypes: ['in-person'], gender: 'female', rating: 4.9, reviews: 89 },
  { id: '7', name: 'Dr. Vikram Rao', slug: 'vikram-rao', specialty: 'Electrophysiologist', department: 'Cardiology', experience: 14, languages: ['English', 'Telugu', 'Hindi'], availability: 'soon' as const, nextSlot: 'Tomorrow 10:00 AM', consultationTypes: ['in-person', 'video'], gender: 'male', rating: 4.8, reviews: 55 },
  { id: '8', name: 'Dr. Deepa Krishnan', slug: 'deepa-krishnan', specialty: 'Gynecologist', department: 'Gynecology', experience: 13, languages: ['English', 'Tamil', 'Hindi'], availability: 'available' as const, nextSlot: 'Today 4:00 PM', consultationTypes: ['in-person', 'video'], gender: 'female', rating: 4.8, reviews: 142 },
];

export function DoctorsPage() {
  const [query, setQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [availFilter, setAvailFilter] = useState('');
  const [videoFilter, setVideoFilter] = useState(false);

  const filtered = DEMO_DOCTORS.filter(d => {
    if (query && !d.name.toLowerCase().includes(query.toLowerCase()) && !d.specialty.toLowerCase().includes(query.toLowerCase())) return false;
    if (deptFilter && d.department !== deptFilter) return false;
    if (availFilter === 'today' && d.availability !== 'available') return false;
    if (videoFilter && !d.consultationTypes.includes('video')) return false;
    return true;
  });

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone border-b border-sage-light py-16">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Our Doctors</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">Meet the people.</h1>
          <p className="text-ink-soft text-lg max-w-xl">40+ specialists across 20 departments. Find the right doctor for you.</p>
          <DemoBadge className="mt-3" />
        </div>
      </div>

      <div className="section-container py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" size={16} />
            <input type="search" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search doctors…" className="input pl-9 py-2.5 w-56" />
          </div>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input py-2.5 w-48">
            <option value="">All departments</option>
            {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
          <button
            onClick={() => setAvailFilter(availFilter === 'today' ? '' : 'today')}
            className={cn('chip cursor-pointer transition-all', availFilter === 'today' ? 'bg-verdigris text-white border-verdigris' : '')}
          >
            Available today
          </button>
          <button
            onClick={() => setVideoFilter(v => !v)}
            className={cn('chip cursor-pointer transition-all', videoFilter ? 'bg-verdigris text-white border-verdigris' : '')}
          >
            Video consult
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((doc, i) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}>
              <Link to={ROUTES.doctor(doc.slug)} className="group block card overflow-hidden hover:shadow-warm-md transition-all duration-300">
                {/* Arch portrait */}
                <div className="h-48 bg-gradient-to-b from-mint-light to-bone flex items-end justify-center pb-4"
                     style={{ borderRadius: '0 0 0 0 / 0' }}>
                  <div className="w-20 h-24 bg-mint rounded-t-full flex items-end justify-center pb-2 opacity-50">
                    <span className="font-display font-bold text-2xl text-verdigris">{doc.name.split(' ')[1][0]}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-display font-semibold text-lg text-ink group-hover:text-verdigris transition-colors leading-tight">{doc.name}</h3>
                    <AvailabilityDot status={doc.availability} />
                  </div>
                  <p className="text-sm text-ink-soft mb-1">{doc.specialty}</p>
                  <p className="text-xs text-ink-soft mb-3">{doc.experience} yrs · {doc.languages[0]}{doc.languages[1] ? `, ${doc.languages[1]}` : ''}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-verdigris">{doc.nextSlot}</span>
                    <div className="flex gap-1">
                      {doc.consultationTypes.includes('video') && <Badge variant="default" size="sm">📹</Badge>}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-sage-light">
                    <span className="btn btn-primary btn-sm w-full justify-center block text-center">Book slot</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-ink-soft text-lg">No doctors match your filters.</p>
            <button onClick={() => { setQuery(''); setDeptFilter(''); setAvailFilter(''); setVideoFilter(false); }}
              className="mt-4 text-sm font-medium text-verdigris hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

