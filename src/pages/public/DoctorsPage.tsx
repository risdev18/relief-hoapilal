// Doctors Directory Page
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Globe, Award, Calendar, Video, CheckCircle2 } from 'lucide-react';
import { ROUTES, DEPARTMENTS } from '@/config/constants';
import { Badge, DemoBadge, AvailabilityDot, Button } from '@/components/ui';
import { cn } from '@/utils';

export interface DoctorProfile {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  department: string;
  qualifications: string;
  experience: number;
  languages: string[];
  opdTimings: string;
  opdDays: string;
  consultationFee: number;
  videoFee: number;
  availability: 'available' | 'soon' | 'away';
  nextSlot: string;
  consultationTypes: ('in-person' | 'video')[];
  rating: number;
  reviews: number;
  branch: string;
}

export const DEMO_DOCTORS: DoctorProfile[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    slug: 'priya-sharma',
    specialty: 'Senior Interventional Cardiologist',
    department: 'Cardiology',
    qualifications: 'MBBS, MD (Med), DM (Cardiology), FESC',
    experience: 15,
    languages: ['English', 'Hindi', 'Marathi'],
    opdTimings: '10:00 AM – 02:00 PM',
    opdDays: 'Mon – Sat',
    consultationFee: 1200,
    videoFee: 1000,
    availability: 'available',
    nextSlot: 'Today 4:30 PM',
    consultationTypes: ['in-person', 'video'],
    rating: 4.9,
    reviews: 142,
    branch: 'Andheri Flagship',
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kulkarni',
    slug: 'rajesh-kulkarni',
    specialty: 'Chief Robotic Joint Replacement Surgeon',
    department: 'Orthopedics',
    qualifications: 'MBBS, MS (Ortho), MCh, Fellowship in Arthroplasty (UK)',
    experience: 20,
    languages: ['English', 'Marathi', 'Hindi'],
    opdTimings: '11:00 AM – 03:30 PM',
    opdDays: 'Mon, Wed, Fri',
    consultationFee: 1500,
    videoFee: 1200,
    availability: 'available',
    nextSlot: 'Today 3:00 PM',
    consultationTypes: ['in-person'],
    rating: 4.8,
    reviews: 128,
    branch: 'Andheri Flagship',
  },
  {
    id: '3',
    name: 'Dr. Ananya Joshi',
    slug: 'ananya-joshi',
    specialty: 'Senior Consultant Pediatrician & Neonatologist',
    department: 'Pediatrics',
    qualifications: 'MBBS, MD (Pediatrics), DNB, Fellowship in Neonatology',
    experience: 12,
    languages: ['English', 'Hindi', 'Marathi'],
    opdTimings: '09:00 AM – 01:00 PM',
    opdDays: 'Mon – Sat',
    consultationFee: 900,
    videoFee: 800,
    availability: 'available',
    nextSlot: 'Today 5:00 PM',
    consultationTypes: ['in-person', 'video'],
    rating: 4.9,
    reviews: 215,
    branch: 'Thane Center',
  },
  {
    id: '4',
    name: 'Dr. Meera Patel',
    slug: 'meera-patel',
    specialty: 'Consultant Dermatologist & Cosmetologist',
    department: 'Dermatology',
    qualifications: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    experience: 10,
    languages: ['English', 'Gujarati', 'Hindi'],
    opdTimings: '02:00 PM – 06:00 PM',
    opdDays: 'Tue, Thu, Sat',
    consultationFee: 850,
    videoFee: 800,
    availability: 'soon',
    nextSlot: 'Tomorrow 11:30 AM',
    consultationTypes: ['in-person', 'video'],
    rating: 4.7,
    reviews: 94,
    branch: 'Andheri Flagship',
  },
  {
    id: '5',
    name: 'Dr. Arun Nair',
    slug: 'arun-nair',
    specialty: 'Director & Senior Consultant Physician',
    department: 'General Medicine',
    qualifications: 'MBBS, MD (Internal Medicine), FACP',
    experience: 18,
    languages: ['English', 'Malayalam', 'Hindi'],
    opdTimings: '09:00 AM – 02:00 PM',
    opdDays: 'Mon – Sat',
    consultationFee: 800,
    videoFee: 700,
    availability: 'available',
    nextSlot: 'Today 2:30 PM',
    consultationTypes: ['in-person', 'video'],
    rating: 4.8,
    reviews: 184,
    branch: 'Pune Center',
  },
  {
    id: '6',
    name: 'Dr. Sunita Desai',
    slug: 'sunita-desai',
    specialty: 'Chief of Neurosciences & Stroke Specialist',
    department: 'Neurology',
    qualifications: 'MBBS, MD (Med), DM (Neurology), FINR',
    experience: 16,
    languages: ['English', 'Marathi', 'Hindi'],
    opdTimings: '10:30 AM – 02:30 PM',
    opdDays: 'Mon, Tue, Thu, Fri',
    consultationFee: 1400,
    videoFee: 1200,
    availability: 'available',
    nextSlot: 'Tomorrow 10:00 AM',
    consultationTypes: ['in-person'],
    rating: 4.9,
    reviews: 112,
    branch: 'Andheri Flagship',
  },
  {
    id: '7',
    name: 'Dr. Vikram Rao',
    slug: 'vikram-rao',
    specialty: 'Cardiac Electrophysiologist & Pacing',
    department: 'Cardiology',
    qualifications: 'MBBS, MD (Med), DM (Cardiology), Fellowship in Electrophysiology',
    experience: 14,
    languages: ['English', 'Telugu', 'Hindi'],
    opdTimings: '01:00 PM – 05:00 PM',
    opdDays: 'Mon – Fri',
    consultationFee: 1200,
    videoFee: 1000,
    availability: 'soon',
    nextSlot: 'Tomorrow 10:00 AM',
    consultationTypes: ['in-person', 'video'],
    rating: 4.8,
    reviews: 67,
    branch: 'Andheri Flagship',
  },
  {
    id: '8',
    name: 'Dr. Deepa Krishnan',
    slug: 'deepa-krishnan',
    specialty: 'Senior Obstetrician & Gynecological Surgeon',
    department: 'Gynecology',
    qualifications: 'MBBS, MS (Obstetrics & Gynecology), DNB, FICOG',
    experience: 15,
    languages: ['English', 'Tamil', 'Hindi', 'Marathi'],
    opdTimings: '10:00 AM – 03:00 PM',
    opdDays: 'Mon – Sat',
    consultationFee: 1100,
    videoFee: 950,
    availability: 'available',
    nextSlot: 'Today 4:00 PM',
    consultationTypes: ['in-person', 'video'],
    rating: 4.8,
    reviews: 168,
    branch: 'Andheri Flagship',
  },
];

export function DoctorsPage() {
  const [query, setQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [availFilter, setAvailFilter] = useState('');
  const [videoFilter, setVideoFilter] = useState(false);

  const filtered = DEMO_DOCTORS.filter(d => {
    if (query && !d.name.toLowerCase().includes(query.toLowerCase()) &&
        !d.specialty.toLowerCase().includes(query.toLowerCase()) &&
        !d.qualifications.toLowerCase().includes(query.toLowerCase())) return false;
    if (deptFilter && d.department !== deptFilter) return false;
    if (langFilter && !d.languages.includes(langFilter)) return false;
    if (availFilter === 'today' && d.availability !== 'available') return false;
    if (videoFilter && !d.consultationTypes.includes('video')) return false;
    return true;
  });

  return (
    <div className="bg-paper min-h-screen">
      {/* Hero */}
      <div className="bg-bone border-b border-sage-light py-16">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">
            Consultant Faculty Directory
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Specialist Doctors
          </h1>
          <p className="text-ink-soft text-lg max-w-2xl">
            Senior clinical faculty, surgeons, and pediatricians with verified Medical Council credentials, explicit OPD schedules, and transparent consultation fees.
          </p>
          <DemoBadge className="mt-3" />
        </div>
      </div>

      <div className="section-container py-10 space-y-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-paper p-4 rounded-xl border border-sage-light shadow-warm-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" size={16} />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by doctor, qualification or specialty…"
              className="input pl-9 py-2 text-sm w-full"
            />
          </div>

          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="input py-2 text-sm w-44"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          <select
            value={langFilter}
            onChange={e => setLangFilter(e.target.value)}
            className="input py-2 text-sm w-36"
          >
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Tamil">Tamil</option>
          </select>

          <button
            onClick={() => setAvailFilter(availFilter === 'today' ? '' : 'today')}
            className={cn(
              'chip text-xs font-medium cursor-pointer transition-all',
              availFilter === 'today' ? 'bg-verdigris text-white border-verdigris shadow-warm-xs' : 'bg-paper text-ink'
            )}
          >
            Available Today
          </button>

          <button
            onClick={() => setVideoFilter(v => !v)}
            className={cn(
              'chip text-xs font-medium cursor-pointer transition-all',
              videoFilter ? 'bg-verdigris text-white border-verdigris shadow-warm-xs' : 'bg-paper text-ink'
            )}
          >
            Video Consult (Tele-OPD)
          </button>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="card bg-paper border border-sage-light rounded-2xl overflow-hidden hover:shadow-warm-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Portrait Header */}
                <div className="h-40 bg-gradient-to-b from-mint to-bone flex items-end justify-center pb-2 relative">
                  <div className="w-20 h-24 bg-paper/60 backdrop-blur-sm rounded-t-full flex items-end justify-center pb-2 border border-sage-light">
                    <span className="font-display font-bold text-2xl text-verdigris">
                      {doc.name.split(' ')[1][0]}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <AvailabilityDot status={doc.availability} />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" size="sm" className="bg-paper/90 border-sage-light text-xs font-mono">
                      {doc.department}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div>
                    <h3 className="font-display font-bold text-lg text-ink leading-tight hover:text-verdigris transition-colors">
                      <Link to={ROUTES.doctor(doc.slug)}>{doc.name}</Link>
                    </h3>
                    <p className="text-xs text-ink-soft font-mono mt-0.5">{doc.qualifications}</p>
                    <p className="text-xs font-semibold text-verdigris mt-1">{doc.specialty}</p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-sage-light text-xs text-ink-soft">
                    <p className="flex items-center gap-1.5">
                      <Award size={13} className="text-verdigris flex-shrink-0" />
                      <span>{doc.experience} Years Experience</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock size={13} className="text-verdigris flex-shrink-0" />
                      <span>OPD: <strong>{doc.opdTimings}</strong> ({doc.opdDays})</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Globe size={13} className="text-verdigris flex-shrink-0" />
                      <span>{doc.languages.join(', ')}</span>
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-ink-soft uppercase tracking-wider block">OPD Fee</span>
                      <span className="font-display text-base font-bold text-ink">₹{doc.consultationFee}</span>
                    </div>
                    {doc.consultationTypes.includes('video') && (
                      <div className="text-right">
                        <span className="text-[10px] text-ink-soft uppercase tracking-wider block">Video OPD</span>
                        <span className="font-mono text-xs font-semibold text-verdigris">₹{doc.videoFee}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-sage-light grid grid-cols-2 gap-2 mt-2">
                <Link
                  to={ROUTES.doctor(doc.slug)}
                  className="btn btn-ghost btn-sm justify-center border border-sage-light text-xs"
                >
                  View Profile
                </Link>
                <Link
                  to={`/book?doctorId=${doc.id}&doctorName=${encodeURIComponent(doc.name)}&department=${encodeURIComponent(doc.department)}`}
                  className="btn btn-primary btn-sm justify-center bg-saffron text-ink hover:bg-[var(--saffron-deep)] text-xs font-semibold"
                >
                  Book Slot
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-ink-soft text-lg">No doctors match your filters.</p>
            <button
              onClick={() => { setQuery(''); setDeptFilter(''); setLangFilter(''); setAvailFilter(''); setVideoFilter(false); }}
              className="mt-4 text-sm font-medium text-verdigris hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

