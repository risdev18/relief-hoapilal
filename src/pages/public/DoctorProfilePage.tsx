import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Video, MapPin, Clock, Award, Globe, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/config/constants';
import { Badge, DemoBadge, AvailabilityDot, Button } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';
import { DEMO_DOCTORS } from './DoctorsPage';

export function DoctorProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');

  // Match doctor by slug or fallback to Dr. Priya Sharma
  const foundDoctor = DEMO_DOCTORS.find(d => d.slug === slug);
  const doctor = {
    name: foundDoctor?.name || 'Dr. Priya Sharma',
    slug: foundDoctor?.slug || 'priya-sharma',
    specialty: foundDoctor?.specialty || 'Senior Interventional Cardiologist',
    department: foundDoctor?.department || 'Cardiology',
    qualifications: foundDoctor?.qualifications ? foundDoctor.qualifications.split(', ') : ['MBBS', 'MD (Med)', 'DM (Cardiology)', 'FESC'],
    experience: foundDoctor?.experience || 15,
    languages: foundDoctor?.languages || ['English', 'Hindi', 'Marathi'],
    opdTimings: foundDoctor?.opdTimings || '10:00 AM – 02:00 PM',
    opdDays: foundDoctor?.opdDays || 'Mon – Sat',
    consultationFee: foundDoctor?.consultationFee || 1200,
    videoFee: foundDoctor?.videoFee || 1000,
    availability: foundDoctor?.availability || 'available',
    nextSlot: foundDoctor?.nextSlot || 'Today 4:30 PM',
    rating: foundDoctor?.rating || 4.9,
    reviews: foundDoctor?.reviews || 142,
    branch: foundDoctor?.branch || 'Andheri Flagship',
    registrationNumber: 'MCI/MMC-2011/04/0982 (Verified)',
    bio: `${foundDoctor?.name || 'Dr. Priya Sharma'} is a senior faculty clinician with over ${foundDoctor?.experience || 15} years of advanced surgical and clinical experience. Trained at AIIMS and premier global medical centres, with special focus on evidence-based de-escalation of patient anxiety and meticulous clinical follow-up.`,
    treatments: ['Coronary Angiography', 'Primary Angioplasty & Stenting', 'Echocardiography (2D Echo)', 'Preventive Cardiovascular Protocol', 'Hypertension Management'],
    weeklySchedule: [
      { day: 'Monday', slots: foundDoctor?.opdTimings || '10:00 AM – 02:00 PM', type: 'In-person OPD', branch: foundDoctor?.branch || 'Andheri Flagship' },
      { day: 'Tuesday', slots: foundDoctor?.opdTimings || '10:00 AM – 02:00 PM', type: 'In-person OPD', branch: foundDoctor?.branch || 'Andheri Flagship' },
      { day: 'Wednesday', slots: '03:00 PM – 06:00 PM', type: 'Video Tele-OPD', branch: 'Online / ABHA Portal' },
      { day: 'Thursday', slots: foundDoctor?.opdTimings || '10:00 AM – 02:00 PM', type: 'In-person OPD', branch: foundDoctor?.branch || 'Andheri Flagship' },
      { day: 'Friday', slots: foundDoctor?.opdTimings || '10:00 AM – 02:00 PM', type: 'In-person OPD', branch: foundDoctor?.branch || 'Andheri Flagship' },
      { day: 'Saturday', slots: '10:00 AM – 01:00 PM', type: 'Emergency Rounds', branch: foundDoctor?.branch || 'Andheri Flagship' },
      { day: 'Sunday', slots: 'Closed / Emergency on-call', type: '', branch: '' },
    ],
    feedbackSamples: [
      { patient: 'R. Mehta, Mumbai', rating: 5, comment: 'Dr. Sharma explained everything calmly without rushed jargon. I felt thoroughly looked after.', date: 'Nov 2026' },
      { patient: 'S. Kulkarni, Pune', rating: 5, comment: 'Exceptional clinical diagnostics and caring bedside manner.', date: 'Oct 2026' },
      { patient: 'A. Patil, Thane', rating: 4, comment: 'Very reassuring consultation. The OPD queue was smooth.', date: 'Oct 2026' },
    ],
  };

  const AVAILABLE_SLOTS = ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'];

  return (
    <div className="bg-paper min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-bone border-b border-sage-light">
        <div className="section-container py-3">
          <nav className="flex items-center gap-2 text-sm text-ink-soft" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-verdigris transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to={ROUTES.doctors} className="hover:text-verdigris transition-colors">Doctors</Link>
            <ChevronRight size={14} />
            <span className="text-ink font-medium">{doctor.name}</span>
          </nav>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Profile */}
          <div className="lg:col-span-2 space-y-10">
            {/* Doctor header */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Arch portrait */}
              <div className="w-32 h-44 bg-gradient-to-b from-mint to-bone rounded-t-full flex items-end justify-center pb-3 flex-shrink-0 border border-sage-light">
                <span className="font-display font-bold text-4xl text-verdigris opacity-60">
                  {doctor.name.split(' ')[1]?.[0] || 'D'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <DemoBadge />
                  <AvailabilityDot status={doctor.availability} withLabel />
                </div>
                <h1 className="font-display text-4xl font-bold text-ink mb-1">{doctor.name}</h1>
                <p className="text-ink-soft text-sm font-mono mb-1">{doctor.qualifications.join(' · ')}</p>
                <p className="text-verdigris font-semibold mb-3">{doctor.specialty}</p>

                <div className="flex flex-wrap gap-3 text-sm text-ink-soft mb-3">
                  <span>{doctor.experience} years clinical practice</span>
                  <span>·</span>
                  <span>{doctor.languages.join(', ')}</span>
                  <span>·</span>
                  <span className="font-medium text-ink">{doctor.branch}</span>
                </div>

                <p className="text-xs text-verdigris font-mono font-medium bg-mint/50 py-1 px-2.5 rounded-pill w-fit border border-sage/40">
                  ✓ Verified Council Reg: {doctor.registrationNumber}
                </p>

                <div className="flex items-center gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(doctor.rating) ? 'text-saffron fill-saffron' : 'text-sage'} />
                  ))}
                  <span className="text-sm font-medium text-ink ml-1">{doctor.rating}</span>
                  <span className="text-sm text-ink-soft">({doctor.reviews} verified patient reviews)</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <section className="bg-bone/60 p-6 rounded-2xl border border-sage-light space-y-3">
              <h2 className="font-display text-2xl font-bold text-ink">Clinical Profile & Philosophy</h2>
              <p className="text-sm text-ink-soft leading-relaxed">{doctor.bio}</p>
            </section>

            {/* Weekly schedule */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-semibold text-ink">OPD Timings & Schedule</h2>
                <span className="text-xs font-mono text-ink-soft">Current Week (Demo)</span>
              </div>
              <div className="border border-sage-light rounded-2xl overflow-hidden bg-paper shadow-warm-xs">
                {doctor.weeklySchedule.map((day, i) => (
                  <div
                    key={day.day}
                    className={`flex items-center justify-between p-4 text-sm ${
                      i < doctor.weeklySchedule.length - 1 ? 'border-b border-sage-light' : ''
                    } ${day.slots.includes('Closed') ? 'opacity-40 bg-bone/30' : ''}`}
                  >
                    <span className="font-semibold text-ink w-28">{day.day}</span>
                    <span className="text-ink-soft flex-1">{day.slots}</span>
                    {day.type && (
                      <Badge variant="default" size="sm">
                        {day.type} · {day.branch}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Key Procedures */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink mb-4">Focus Procedures & Conditions</h2>
              <div className="flex flex-wrap gap-2">
                {doctor.treatments.map(t => (
                  <span key={t} className="chip bg-paper text-ink border-sage-light font-medium text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {/* Patient feedback */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink mb-2">Patient Feedback</h2>
              <p className="text-xs text-ink-soft mb-5">Demo — authentic experiences from verified hospital visits</p>
              <div className="space-y-4">
                {doctor.feedbackSamples.map((f, i) => (
                  <div key={i} className="card-bone p-5 rounded-xl border border-sage-light space-y-2">
                    <div className="flex items-center gap-2">
                      {[...Array(f.rating)].map((_, j) => (
                        <Star key={j} size={14} className="text-saffron fill-saffron" />
                      ))}
                      <span className="text-xs text-ink-soft ml-auto font-mono">{f.date}</span>
                    </div>
                    <p className="text-ink-soft italic text-sm">"{f.comment}"</p>
                    <p className="text-xs font-medium text-ink">— {f.patient}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Booking sidebar */}
          <div>
            <div className="card p-6 rounded-2xl border border-sage-light shadow-warm-md sticky top-24 space-y-5 bg-paper">
              <div>
                <h3 className="font-display text-xl font-bold text-ink mb-1">
                  Book Consultation
                </h3>
                <p className="text-xs text-ink-soft">With {doctor.name}</p>
                <RelifLine variant="section" color="var(--verdigris)" strokeWidth={1.5} className="my-3" />
              </div>

              {/* Consultation Fees Box */}
              <div className="p-4 bg-bone rounded-xl border border-sage-light space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-ink-soft">In-Person OPD Fee</span>
                  <span className="font-display text-lg font-bold text-ink">₹{doctor.consultationFee}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-soft">Video Tele-Consult</span>
                  <span className="font-mono font-semibold text-verdigris">₹{doctor.videoFee}</span>
                </div>
              </div>

              {/* Slot Picker */}
              <div>
                <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-2.5">
                  Available Slots Today ({doctor.nextSlot})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_SLOTS.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`text-xs py-2 px-3 rounded-lg border transition-all ${
                        selectedSlot === slot
                          ? 'bg-saffron border-saffron text-ink font-bold shadow-warm-xs'
                          : 'border-sage-light text-ink hover:border-verdigris hover:bg-mint/20'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking CTA Button */}
              <Link
                to={`/book?doctorId=${foundDoctor?.id || '1'}&doctorName=${encodeURIComponent(doctor.name)}&department=${encodeURIComponent(doctor.department)}&slot=${encodeURIComponent(selectedSlot)}`}
                className="btn btn-primary btn-md w-full justify-center bg-saffron text-ink hover:bg-[var(--saffron-deep)] font-semibold"
              >
                Proceed to Book ({selectedSlot})
              </Link>

              <div className="text-[11px] text-ink-soft space-y-1 text-center">
                <p>✓ Instant SMS & WhatsApp Confirmation (Demo)</p>
                <p>✓ Free reschedule or cancellation up to 2 hours prior</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

