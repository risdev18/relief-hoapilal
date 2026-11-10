// Doctor Profile Page
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Video, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/config/constants';
import { Badge, DemoBadge, AvailabilityDot } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';

const DEMO_DOCTOR = {
  name: 'Dr. Priya Sharma', slug: 'priya-sharma', title: 'Dr.',
  qualifications: ['MBBS', 'MD (Cardiology)', 'DM (Cardiology)', 'FESC'],
  specialty: 'Interventional Cardiologist', subSpecialty: 'Complex Coronary Interventions',
  department: 'Cardiology', departmentSlug: 'cardiology',
  experience: 15, languages: ['English', 'Hindi', 'Marathi'],
  consultationTypes: ['in-person', 'video'],
  bio: 'Dr. Priya Sharma is a senior interventional cardiologist with 15 years of experience in complex coronary interventions, structural heart disease, and electrophysiology. She trained at AIIMS Delhi and completed her fellowship at the Cleveland Clinic, USA. She believes in clear communication and shared decision-making with her patients.',
  registrationVerified: true,
  registrationNumber: 'MCI-XXXXX',
  availability: 'available' as const,
  nextSlot: 'Today 4:30 PM',
  rating: 4.9, reviews: 124,
  branches: ['Andheri Branch (Main)', 'Thane Branch'],
  treatments: ['Coronary Angiography', 'Angioplasty & Stenting', 'PTCA', 'Echocardiography', 'Stress Testing'],
  weeklySchedule: [
    { day: 'Monday',    slots: '9:00 AM – 1:00 PM',  type: 'In-person', branch: 'Andheri' },
    { day: 'Tuesday',   slots: '3:00 PM – 7:00 PM',  type: 'In-person', branch: 'Thane' },
    { day: 'Wednesday', slots: '9:00 AM – 1:00 PM',  type: 'In-person', branch: 'Andheri' },
    { day: 'Thursday',  slots: '3:00 PM – 6:00 PM',  type: 'Video',     branch: 'Online' },
    { day: 'Friday',    slots: '9:00 AM – 12:00 PM', type: 'In-person', branch: 'Andheri' },
    { day: 'Saturday',  slots: 'On leave',            type: '',          branch: '' },
    { day: 'Sunday',    slots: 'Closed',              type: '',          branch: '' },
  ],
  feedbackSamples: [
    { patient: 'R.M.', rating: 5, comment: 'Dr. Sharma was thorough and explained everything clearly. I felt reassured.', date: 'Nov 2026' },
    { patient: 'S.K.', rating: 5, comment: 'Very professional and caring. The best cardiologist I have visited.', date: 'Oct 2026' },
    { patient: 'A.P.', rating: 4, comment: 'Good experience overall. The wait time was a bit long but the consultation was excellent.', date: 'Oct 2026' },
  ],
};

export function DoctorProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const doctor = DEMO_DOCTOR; // In production: fetch by slug
  const [selectedDay, setSelectedDay] = useState('Monday');

  const AVAILABLE_SLOTS = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'];

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
              <div className="w-32 h-40 bg-gradient-to-b from-mint-light to-bone rounded-t-full flex items-end justify-center pb-3 flex-shrink-0">
                <span className="font-display font-bold text-4xl text-verdigris opacity-40">{doctor.name.split(' ')[1][0]}</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <DemoBadge />
                  <AvailabilityDot status={doctor.availability} withLabel />
                </div>
                <h1 className="font-display text-4xl font-bold text-ink mb-1">{doctor.name}</h1>
                <p className="text-ink-soft font-medium mb-1">{doctor.qualifications.join(' · ')}</p>
                <p className="text-verdigris font-semibold mb-3">{doctor.specialty}</p>
                {doctor.subSpecialty && <p className="text-sm text-ink-soft mb-3">{doctor.subSpecialty}</p>}
                <div className="flex flex-wrap gap-3 text-sm text-ink-soft mb-4">
                  <span>{doctor.experience} years experience</span>
                  <span>·</span>
                  <span>{doctor.languages.join(', ')}</span>
                </div>
                {doctor.registrationVerified && (
                  <p className="text-xs text-verdigris font-medium">✓ Verified registration — {doctor.registrationNumber}</p>
                )}
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(doctor.rating) ? 'text-saffron fill-saffron' : 'text-sage'} />
                  ))}
                  <span className="text-sm font-medium text-ink ml-1">{doctor.rating}</span>
                  <span className="text-sm text-ink-soft">({doctor.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink mb-4">About Dr. {doctor.name.split(' ')[1]}</h2>
              <p className="text-ink-soft leading-relaxed">{doctor.bio}</p>
            </section>

            {/* Consultation types */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink mb-4">Consultation types</h2>
              <div className="flex gap-3">
                {doctor.consultationTypes.includes('in-person') && (
                  <div className="card-bone p-4 flex items-center gap-3 flex-1">
                    <MapPin size={20} className="text-verdigris" />
                    <div>
                      <p className="font-semibold text-ink text-sm">In-person</p>
                      <p className="text-xs text-ink-soft">{doctor.branches[0]}</p>
                    </div>
                  </div>
                )}
                {doctor.consultationTypes.includes('video') && (
                  <div className="card-bone p-4 flex items-center gap-3 flex-1">
                    <Video size={20} className="text-verdigris" />
                    <div>
                      <p className="font-semibold text-ink text-sm">Video consult</p>
                      <p className="text-xs text-ink-soft">From anywhere</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Weekly schedule */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink mb-4">Schedule</h2>
              <div className="border border-sage-light rounded-xl overflow-hidden">
                {doctor.weeklySchedule.map((day, i) => (
                  <div key={day.day} className={`flex items-center justify-between p-4 ${i < doctor.weeklySchedule.length - 1 ? 'border-b border-sage-light' : ''} ${day.slots === 'Closed' || day.slots === 'On leave' ? 'opacity-50' : ''}`}>
                    <span className="font-medium text-ink w-28">{day.day}</span>
                    <span className="text-ink-soft text-sm flex-1">{day.slots}</span>
                    {day.type && <Badge variant="default" size="sm">{day.type} · {day.branch}</Badge>}
                  </div>
                ))}
              </div>
            </section>

            {/* Treatments */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink mb-4">Treatments & procedures</h2>
              <div className="flex flex-wrap gap-2">
                {doctor.treatments.map(t => <span key={t} className="chip">{t}</span>)}
              </div>
            </section>

            {/* Patient feedback */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink mb-2">Patient feedback</h2>
              <p className="text-xs text-ink-soft mb-5">Demo — fictional patient reviews</p>
              <div className="space-y-4">
                {doctor.feedbackSamples.map((f, i) => (
                  <div key={i} className="card-bone p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(f.rating)].map((_, j) => <Star key={j} size={14} className="text-saffron fill-saffron" />)}
                      <span className="text-xs text-ink-soft ml-auto">{f.date}</span>
                    </div>
                    <p className="text-ink-soft italic">"{f.comment}"</p>
                    <p className="text-xs font-medium text-ink mt-2">— {f.patient}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Booking sidebar */}
          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="font-display text-xl font-semibold text-ink mb-2">Book with Dr. {doctor.name.split(' ')[1]}</h3>
              <RelifLine variant="section" color="var(--verdigris)" strokeWidth={1.5} className="mb-4" />
              <div className="flex items-center gap-2 mb-4">
                <AvailabilityDot status={doctor.availability} />
                <span className="text-sm font-medium text-verdigris">{doctor.nextSlot}</span>
              </div>

              {/* Quick slot picker */}
              <p className="text-sm font-medium text-ink mb-3">Available slots (Demo)</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {AVAILABLE_SLOTS.slice(0, 6).map((slot, i) => (
                  <button key={slot} className={`text-xs py-2 px-3 rounded-lg border transition-all ${i === 1 ? 'bg-saffron border-saffron text-ink font-semibold' : 'border-sage-light text-ink hover:border-verdigris hover:text-verdigris'}`}>
                    {slot}
                  </button>
                ))}
              </div>
              <Link to={ROUTES.book} className="btn btn-primary btn-md w-full justify-center block text-center">
                Book Appointment
              </Link>
              <p className="text-xs text-ink-soft text-center mt-3">Free cancellation up to 2 hours before</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

