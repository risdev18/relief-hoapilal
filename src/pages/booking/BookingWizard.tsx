// Booking Wizard — Full-screen focused flow, no site nav
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Calendar, Video, MapPin } from 'lucide-react';
import { Stepper, Button, Badge, DemoBadge, QRCard } from '@/components/ui';
import { RelifLine, SuccessRelifLine } from '@/components/ui/RelifLine';
import { DEPARTMENTS, ROUTES } from '@/config/constants';
import { cn, formatDate, generateAppointmentId } from '@/utils';

type ConsultationType = 'in-person' | 'video';
type BookingStep = 'department' | 'doctor' | 'branch' | 'type' | 'date' | 'slot' | 'details' | 'confirm' | 'success';

const WIZARD_STEPS = [
  { label: 'Department' },
  { label: 'Doctor' },
  { label: 'Branch & Type' },
  { label: 'Date & Slot' },
  { label: 'Details' },
  { label: 'Confirm' },
];

const DEMO_DOCTORS_BY_DEPT: Record<string, { id: string; name: string; specialty: string; nextSlot: string }[]> = {
  'cardiology': [
    { id: '1', name: 'Dr. Priya Sharma', specialty: 'Interventional Cardiologist', nextSlot: 'Today 4:30 PM' },
    { id: '2', name: 'Dr. Vikram Rao', specialty: 'Electrophysiologist', nextSlot: 'Tomorrow 10:00 AM' },
  ],
  'orthopedics': [
    { id: '3', name: 'Dr. Rajesh Kulkarni', specialty: 'Orthopedic Surgeon', nextSlot: 'Today 3:00 PM' },
  ],
  'pediatrics': [
    { id: '4', name: 'Dr. Ananya Joshi', specialty: 'Pediatrician', nextSlot: 'Today 5:00 PM' },
  ],
};

const BRANCHES = [
  { id: 'andheri', name: 'Relif Andheri (Main)', address: 'Versova Road, Andheri West, Mumbai', isMain: true },
  { id: 'thane', name: 'Relif Thane', address: 'Majiwada Junction, Thane West' },
  { id: 'pune', name: 'Relif Pune', address: 'Baner Road, Pune' },
];

const AVAILABLE_SLOTS = [
  { time: '09:00', available: true }, { time: '09:30', available: false },
  { time: '10:00', available: true }, { time: '10:30', available: true },
  { time: '11:00', available: false }, { time: '11:30', available: true },
  { time: '14:00', available: true }, { time: '14:30', available: true },
  { time: '15:00', available: false }, { time: '15:30', available: true },
  { time: '16:00', available: true }, { time: '16:30', available: true },
];

interface BookingData {
  departmentId: string; departmentName: string;
  doctorId: string; doctorName: string; doctorSpecialty: string;
  branchId: string; branchName: string;
  consultationType: ConsultationType;
  date: string; slot: string;
  patientName: string; patientPhone: string; patientEmail: string;
  visitReason: string; isNewPatient: boolean;
}

function StepHeader({ step, total, onClose }: { step: number; total: number; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <span className="font-mono text-xs text-ink-soft">Step {step + 1} of {total}</span>
      <button onClick={onClose} className="p-2 rounded-lg text-ink-soft hover:bg-bone hover:text-ink transition-colors" aria-label="Close booking">
        <X size={20} />
      </button>
    </div>
  );
}

export function BookingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<BookingData>>({});
  const [appointmentId] = useState(generateAppointmentId(Math.floor(Math.random() * 999) + 1));

  const steps: BookingStep[] = ['department', 'doctor', 'branch', 'date', 'details', 'confirm'];
  const totalSteps = WIZARD_STEPS.length;

  const next = () => setStep(s => Math.min(s + 1, totalSteps));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const deptDoctors = data.departmentId ? (DEMO_DOCTORS_BY_DEPT[data.departmentId] || DEMO_DOCTORS_BY_DEPT['cardiology']) : [];

  const renderStep = () => {
    switch (step) {
      // ── Step 0: Department ──────────────────────────────────────────────
      case 0:
        return (
          <div>
            <h2 className="font-display text-3xl font-bold text-ink mb-2">Which department?</h2>
            <p className="text-ink-soft mb-6">Choose the specialty you need.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => { setData(d => ({ ...d, departmentId: dept.id, departmentName: dept.name })); next(); }}
                  className={cn(
                    'text-left p-4 rounded-xl border transition-all duration-200',
                    data.departmentId === dept.id
                      ? 'border-verdigris bg-mint text-verdigris-deep'
                      : 'border-sage-light bg-paper hover:border-verdigris hover:bg-mint-light text-ink'
                  )}
                >
                  <span className="font-medium">{dept.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      // ── Step 1: Doctor ──────────────────────────────────────────────────
      case 1:
        return (
          <div>
            <h2 className="font-display text-3xl font-bold text-ink mb-2">Choose a doctor</h2>
            <p className="text-ink-soft mb-6">In <span className="font-medium text-verdigris">{data.departmentName}</span></p>
            <div className="space-y-3">
              {deptDoctors.map(doc => (
                <button key={doc.id} onClick={() => { setData(d => ({ ...d, doctorId: doc.id, doctorName: doc.name, doctorSpecialty: doc.specialty })); next(); }}
                  className={cn('w-full text-left p-5 rounded-xl border transition-all duration-200',
                    data.doctorId === doc.id ? 'border-verdigris bg-mint' : 'border-sage-light bg-paper hover:border-verdigris hover:bg-mint-light'
                  )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink">{doc.name}</p>
                      <p className="text-sm text-ink-soft">{doc.specialty}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-verdigris font-medium block">Next: {doc.nextSlot}</span>
                      <ChevronRight size={16} className="text-sage ml-auto mt-1" />
                    </div>
                  </div>
                </button>
              ))}
              <button onClick={() => { setData(d => ({ ...d, doctorId: 'any', doctorName: 'Any available doctor', doctorSpecialty: data.departmentName || '' })); next(); }}
                className="w-full text-left p-5 rounded-xl border border-dashed border-sage hover:border-verdigris hover:bg-mint-light transition-all">
                <p className="font-medium text-ink-soft">Any available doctor</p>
                <p className="text-sm text-ink-soft">We'll assign the first available specialist</p>
              </button>
            </div>
          </div>
        );

      // ── Step 2: Branch + Consultation type ─────────────────────────────
      case 2:
        return (
          <div>
            <h2 className="font-display text-3xl font-bold text-ink mb-6">Branch & consultation type</h2>
            <div className="space-y-6">
              <div>
                <p className="font-medium text-ink mb-3">Choose a branch</p>
                <div className="space-y-3">
                  {BRANCHES.map(branch => (
                    <button key={branch.id} onClick={() => setData(d => ({ ...d, branchId: branch.id, branchName: branch.name }))}
                      className={cn('w-full text-left p-4 rounded-xl border transition-all',
                        data.branchId === branch.id ? 'border-verdigris bg-mint' : 'border-sage-light bg-paper hover:border-verdigris')}>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-verdigris flex-shrink-0" />
                        <div>
                          <p className="font-medium text-ink text-sm">{branch.name}</p>
                          <p className="text-xs text-ink-soft">{branch.address}</p>
                        </div>
                        {branch.isMain && <Badge variant="default" size="sm" className="ml-auto">Main</Badge>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-ink mb-3">Consultation type</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setData(d => ({ ...d, consultationType: 'in-person' }))}
                    className={cn('p-4 rounded-xl border transition-all text-left',
                      data.consultationType === 'in-person' ? 'border-verdigris bg-mint' : 'border-sage-light hover:border-verdigris')}>
                    <MapPin size={20} className="text-verdigris mb-2" />
                    <p className="font-medium text-ink text-sm">In-person</p>
                    <p className="text-xs text-ink-soft">Visit the branch</p>
                  </button>
                  <button onClick={() => setData(d => ({ ...d, consultationType: 'video' }))}
                    className={cn('p-4 rounded-xl border transition-all text-left',
                      data.consultationType === 'video' ? 'border-verdigris bg-mint' : 'border-sage-light hover:border-verdigris')}>
                    <Video size={20} className="text-verdigris mb-2" />
                    <p className="font-medium text-ink text-sm">Video consult</p>
                    <p className="text-xs text-ink-soft">From home</p>
                  </button>
                </div>
              </div>
              <Button variant="primary" className="w-full justify-center"
                disabled={!data.branchId || !data.consultationType} onClick={next}>
                Continue
              </Button>
            </div>
          </div>
        );

      // ── Step 3: Date + Slot ─────────────────────────────────────────────
      case 3:
        return (
          <div>
            <h2 className="font-display text-3xl font-bold text-ink mb-6">Pick a date & slot</h2>
            <div className="space-y-6">
              <div>
                <p className="font-medium text-ink mb-3">Date</p>
                <input type="date" value={data.date || ''} onChange={e => setData(d => ({ ...d, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]} className="input max-w-xs" aria-label="Appointment date" />
                <p className="text-xs text-ink-soft mt-1">Demo — calendar heat map not shown</p>
              </div>
              {data.date && (
                <div>
                  <p className="font-medium text-ink mb-3">Available slots</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {AVAILABLE_SLOTS.map(s => (
                      <button key={s.time} disabled={!s.available} onClick={() => setData(d => ({ ...d, slot: s.time }))}
                        className={cn('py-2.5 px-3 text-sm rounded-lg border transition-all',
                          !s.available ? 'border-sage-light text-sage line-through cursor-not-allowed opacity-50' :
                          data.slot === s.time ? 'border-saffron bg-saffron text-ink font-semibold' :
                          'border-sage-light hover:border-verdigris text-ink')}>
                        {s.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Button variant="primary" className="w-full justify-center" disabled={!data.date || !data.slot} onClick={next}>
                Continue
              </Button>
            </div>
          </div>
        );

      // ── Step 4: Patient details ─────────────────────────────────────────
      case 4:
        return (
          <div>
            <h2 className="font-display text-3xl font-bold text-ink mb-6">Your details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Are you a new patient?</label>
                <div className="flex gap-3">
                  {[{ label: 'New patient', val: true }, { label: 'Existing patient', val: false }].map(opt => (
                    <button key={String(opt.val)} onClick={() => setData(d => ({ ...d, isNewPatient: opt.val }))}
                      className={cn('flex-1 py-3 rounded-xl border text-sm font-medium transition-all',
                        data.isNewPatient === opt.val ? 'border-verdigris bg-mint text-verdigris-deep' : 'border-sage-light hover:border-verdigris text-ink')}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Full name *</label>
                <input type="text" value={data.patientName || ''} onChange={e => setData(d => ({ ...d, patientName: e.target.value }))}
                  className="input" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Phone *</label>
                <input type="tel" value={data.patientPhone || ''} onChange={e => setData(d => ({ ...d, patientPhone: e.target.value }))}
                  className="input" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
                <input type="email" value={data.patientEmail || ''} onChange={e => setData(d => ({ ...d, patientEmail: e.target.value }))}
                  className="input" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Reason for visit</label>
                <textarea value={data.visitReason || ''} onChange={e => setData(d => ({ ...d, visitReason: e.target.value }))}
                  className="input resize-none" rows={3} placeholder="Briefly describe your concern…" />
              </div>
              <Button variant="primary" className="w-full justify-center"
                disabled={!data.patientName || !data.patientPhone} onClick={next}>
                Review appointment
              </Button>
            </div>
          </div>
        );

      // ── Step 5: Confirm ─────────────────────────────────────────────────
      case 5:
        return (
          <div>
            <h2 className="font-display text-3xl font-bold text-ink mb-6">Review & confirm</h2>
            <div className="card p-6 mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-ink-soft mb-0.5">Department</p>
                  <p className="font-medium text-ink">{data.departmentName}</p>
                </div>
                <div>
                  <p className="text-ink-soft mb-0.5">Doctor</p>
                  <p className="font-medium text-ink">{data.doctorName}</p>
                </div>
                <div>
                  <p className="text-ink-soft mb-0.5">Branch</p>
                  <p className="font-medium text-ink">{data.branchName}</p>
                </div>
                <div>
                  <p className="text-ink-soft mb-0.5">Type</p>
                  <p className="font-medium text-ink capitalize">{data.consultationType}</p>
                </div>
                <div>
                  <p className="text-ink-soft mb-0.5">Date</p>
                  <p className="font-medium text-ink">{data.date}</p>
                </div>
                <div>
                  <p className="text-ink-soft mb-0.5">Slot</p>
                  <p className="font-medium text-ink">{data.slot}</p>
                </div>
                <div>
                  <p className="text-ink-soft mb-0.5">Patient</p>
                  <p className="font-medium text-ink">{data.patientName}</p>
                </div>
                <div>
                  <p className="text-ink-soft mb-0.5">Phone</p>
                  <p className="font-medium text-ink">{data.patientPhone}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-bone border border-sage-light p-4 mb-6">
              <p className="text-xs text-ink-soft">
                <strong>Demo mode:</strong> No real appointment will be booked. No SMS/email will be sent. 
                Clicking "Confirm" will show a demo confirmation only.
              </p>
            </div>
            <Button variant="primary" size="lg" className="w-full justify-center" onClick={next}>
              Confirm Appointment
            </Button>
          </div>
        );

      // ── Step 6: Success ─────────────────────────────────────────────────
      case 6:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center">
                <Check size={28} className="text-verdigris" />
              </div>
            </div>
            <SuccessRelifLine className="mb-6 max-w-xs mx-auto" />
            <h2 className="font-display text-4xl font-bold text-ink mb-2">You're booked.</h2>
            <p className="text-ink-soft mb-6">Your appointment has been confirmed (Demo).</p>
            
            <div className="flex justify-center mb-8">
              <QRCard
                appointmentId={appointmentId}
                patientName={data.patientName || 'Patient'}
                date={data.date || ''}
                time={data.slot || ''}
                doctor={data.doctorName || ''}
                department={data.departmentName || ''}
                qrValue={appointmentId}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="secondary" onClick={() => navigate(ROUTES.patientDashboard)}>
                Go to dashboard
              </Button>
              <Button variant="ghost" onClick={() => { setStep(0); setData({}); }}>
                Book another
              </Button>
              <Link to="/" className="btn btn-ghost btn-md">Back to home</Link>
            </div>

            <p className="text-xs text-ink-soft mt-6">
              Demo — no real appointment created. No notifications sent.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Top bar */}
      <div className="bg-paper border-b border-sage-light">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-display font-semibold text-lg text-ink">relif</Link>
          <DemoBadge />
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left: Stepper (Relif Line fills as steps complete) */}
        <div className="hidden lg:flex flex-col w-72 bg-bone border-r border-sage-light p-8">
          <div className="mb-10">
            <RelifLine variant={step >= 4 ? 'cta' : step >= 2 ? 'section' : 'hero'}
              color="var(--verdigris)" strokeWidth={2} className="mb-6" />
            <Stepper steps={WIZARD_STEPS} currentStep={Math.min(step, WIZARD_STEPS.length - 1)} />
          </div>
          <div className="mt-auto">
            <p className="text-xs text-ink-soft leading-relaxed">
              Your booking is secure. Appointment details will be sent to your phone and email (Demo — no real messages sent).
            </p>
          </div>
        </div>

        {/* Right: Step content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-xl mx-auto px-4 py-8">
            {step < 6 && (
              <>
                {/* Mobile stepper */}
                <div className="lg:hidden mb-6">
                  <Stepper steps={WIZARD_STEPS} currentStep={Math.min(step, WIZARD_STEPS.length - 1)} />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-ink-soft">Step {step + 1} of {WIZARD_STEPS.length}</span>
                  <Link to="/" className="p-2 rounded-lg text-ink-soft hover:bg-bone hover:text-ink transition-colors" aria-label="Close booking">
                    <X size={20} />
                  </Link>
                </div>
              </>
            )}

            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Back button */}
            {step > 0 && step < 6 && (
              <button onClick={prev} className="mt-6 flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink transition-colors">
                <ChevronLeft size={16} /> Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

