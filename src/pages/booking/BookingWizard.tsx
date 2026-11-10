// Booking Wizard — Full-screen focused flow, no site nav
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Calendar, Video, MapPin, Printer, AlertCircle, FileText } from 'lucide-react';
import { Stepper, Button, Badge, DemoBadge, QRCard } from '@/components/ui';
import { RelifLine, SuccessRelifLine } from '@/components/ui/RelifLine';
import { DEPARTMENTS, ROUTES } from '@/config/constants';
import { cn, formatDate, generateAppointmentId } from '@/utils';
import { SupabaseService } from '@/services/supabaseService';
import confetti from 'canvas-confetti';

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

const DEMO_DOCTORS_BY_DEPT: Record<string, { id: string; name: string; specialty: string; nextSlot: string; fee: number }[]> = {
  'cardiology': [
    { id: '1', name: 'Dr. Priya Sharma', specialty: 'Senior Interventional Cardiologist', nextSlot: 'Today 4:30 PM', fee: 1200 },
    { id: '7', name: 'Dr. Vikram Rao', specialty: 'Cardiac Electrophysiologist', nextSlot: 'Tomorrow 10:00 AM', fee: 1200 },
  ],
  'orthopedics': [
    { id: '2', name: 'Dr. Rajesh Kulkarni', specialty: 'Chief Robotic Joint Replacement Surgeon', nextSlot: 'Today 3:00 PM', fee: 1500 },
  ],
  'pediatrics': [
    { id: '3', name: 'Dr. Ananya Joshi', specialty: 'Senior Consultant Pediatrician', nextSlot: 'Today 5:00 PM', fee: 900 },
  ],
  'dermatology': [
    { id: '4', name: 'Dr. Meera Patel', specialty: 'Consultant Dermatologist', nextSlot: 'Tomorrow 11:30 AM', fee: 850 },
  ],
  'general-medicine': [
    { id: '5', name: 'Dr. Arun Nair', specialty: 'Senior Consultant Physician', nextSlot: 'Today 2:30 PM', fee: 800 },
  ],
  'neurology': [
    { id: '6', name: 'Dr. Sunita Desai', specialty: 'Chief of Neurosciences & Stroke', nextSlot: 'Tomorrow 10:00 AM', fee: 1400 },
  ],
  'gynecology': [
    { id: '8', name: 'Dr. Deepa Krishnan', specialty: 'Senior Obstetrician & Gynecologist', nextSlot: 'Today 4:00 PM', fee: 1100 },
  ],
};

const BRANCHES = [
  { id: 'andheri', name: 'Relif Hospital — Andheri (Main Flagship)', address: 'Versova Link Road, Andheri West, Mumbai', isMain: true },
  { id: 'thane', name: 'Relif Day-Care & Oncology — Thane', address: 'Majiwada Junction, Eastern Express Highway, Thane West' },
  { id: 'pune', name: 'Relif Orthopedics & Rehab — Pune', address: 'Baner High Street, Baner, Pune' },
];

const AVAILABLE_SLOTS = [
  { time: '09:00 AM', available: true }, { time: '09:30 AM', available: false },
  { time: '10:00 AM', available: true }, { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: false }, { time: '11:30 AM', available: true },
  { time: '02:00 PM', available: true }, { time: '02:30 PM', available: true },
  { time: '03:00 PM', available: false }, { time: '03:30 PM', available: true },
  { time: '04:00 PM', available: true }, { time: '04:30 PM', available: true },
];

interface BookingData {
  departmentId: string; departmentName: string;
  doctorId: string; doctorName: string; doctorSpecialty: string;
  branchId: string; branchName: string;
  consultationType: ConsultationType;
  date: string; slot: string;
  patientName: string; patientPhone: string; patientEmail: string;
  visitReason: string; isNewPatient: boolean;
  uhid: string;
  fee: number;
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
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<BookingData>>({
    branchId: 'andheri',
    branchName: 'Relif Hospital — Andheri (Main Flagship)',
    consultationType: 'in-person',
    uhid: `RH26-${Math.floor(1000 + Math.random() * 9000)}`,
    fee: 1000,
    isNewPatient: true,
  });
  const [appointmentId] = useState(generateAppointmentId(Math.floor(Math.random() * 999) + 1));
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Pre-fill from URL query parameters if available
  useEffect(() => {
    const urlDept = searchParams.get('department');
    const urlDoctorId = searchParams.get('doctorId');
    const urlDoctorName = searchParams.get('doctorName');
    const urlSlot = searchParams.get('slot');

    if (urlDept || urlDoctorName) {
      setData(prev => ({
        ...prev,
        departmentName: urlDept || prev.departmentName || 'Cardiology',
        doctorId: urlDoctorId || '1',
        doctorName: urlDoctorName ? decodeURIComponent(urlDoctorName) : 'Dr. Priya Sharma',
        slot: urlSlot ? decodeURIComponent(urlSlot) : '10:00 AM',
        date: new Date().toISOString().split('T')[0],
      }));
      // Jump to date & slot or details if doctor is already chosen
      if (urlDoctorName) {
        setStep(3);
      }
    }
  }, [searchParams]);

  const steps: BookingStep[] = ['department', 'doctor', 'branch', 'date', 'details', 'confirm'];
  const totalSteps = WIZARD_STEPS.length;

  const next = () => setStep(s => Math.min(s + 1, totalSteps));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const deptKey = data.departmentId || (data.departmentName ? data.departmentName.toLowerCase().replace(/\s+/g, '-') : 'cardiology');
  const deptDoctors = DEMO_DOCTORS_BY_DEPT[deptKey] || DEMO_DOCTORS_BY_DEPT['cardiology'];

  // Indian phone validation (+91 10 digits starting with 6-9)
  const validateIndianPhone = (phone: string) => {
    const cleaned = phone.replace(/[\s\-\+]/g, '');
    const nationalNumber = cleaned.startsWith('91') && cleaned.length === 12 ? cleaned.slice(2) : cleaned;
    const isValid = /^[6-9]\d{9}$/.test(nationalNumber);
    if (!isValid) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number (e.g., 98201 12345).');
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handleConfirmBooking = async () => {
    // 1. Double-booking protection: check for slot conflicts
    const existing = SupabaseService.getLocalAppointments();
    const isConflict = existing.some(
      a => a.doctor_name.toLowerCase() === (data.doctorName || '').toLowerCase() &&
           a.appointment_date === data.date &&
           a.appointment_time === data.slot &&
           a.status !== 'Cancelled'
    );

    if (isConflict) {
      setConflictError(
        `Slot ${data.slot} on ${data.date} with ${data.doctorName} was just reserved by another patient. Please pick an alternative time slot.`
      );
      setStep(3); // Navigate back to slot selection
      return;
    }

    try {
      await SupabaseService.createAppointment({
        patient_name: data.patientName || 'Anonymous Patient',
        patient_phone: data.patientPhone || '+91 98201 00000',
        patient_email: data.patientEmail,
        doctor_name: data.doctorName || 'Assigned Specialist',
        department_name: data.departmentName || 'General Medicine',
        branch_name: data.branchName || 'Andheri Flagship',
        appointment_date: data.date || new Date().toISOString().split('T')[0],
        appointment_time: data.slot || '10:00 AM',
        consultation_type: data.consultationType || 'in-person',
        status: 'Confirmed',
        visit_reason: data.visitReason,
        is_new_patient: Boolean(data.isNewPatient),
      });

      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.warn('Non-fatal sync:', e);
    }
    next();
  };

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
            <h2 className="font-display text-3xl font-bold text-ink mb-2">Pick a date & slot</h2>
            <p className="text-xs text-ink-soft mb-6">OPD consultations run from 09:00 AM to 05:00 PM</p>

            {conflictError && (
              <div className="p-3 mb-6 bg-[var(--signal-light)] text-[var(--signal-deep)] border border-signal/30 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={16} className="text-signal flex-shrink-0" />
                <span>{conflictError}</span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <p className="font-medium text-ink mb-2 text-sm">Appointment Date (DD/MM/YYYY)</p>
                <input
                  type="date"
                  value={data.date || ''}
                  onChange={e => {
                    setConflictError(null);
                    setData(d => ({ ...d, date: e.target.value }));
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="input max-w-xs text-sm"
                  aria-label="Appointment date"
                />
              </div>

              {data.date && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-ink text-sm">Available OPD Slots</p>
                    <span className="text-[11px] font-mono text-verdigris">15-min intervals</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {AVAILABLE_SLOTS.map(s => (
                      <button
                        key={s.time}
                        disabled={!s.available}
                        onClick={() => {
                          setConflictError(null);
                          setData(d => ({ ...d, slot: s.time }));
                        }}
                        className={cn(
                          'py-2.5 px-3 text-xs font-medium rounded-lg border transition-all',
                          !s.available
                            ? 'border-sage-light text-sage line-through cursor-not-allowed opacity-50 bg-bone/30'
                            : data.slot === s.time
                            ? 'border-saffron bg-saffron text-ink font-bold shadow-warm-xs'
                            : 'border-sage-light hover:border-verdigris text-ink bg-paper'
                        )}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                className="w-full justify-center bg-saffron text-ink hover:bg-[var(--saffron-deep)]"
                disabled={!data.date || !data.slot}
                onClick={next}
              >
                Continue to Patient Details
              </Button>
            </div>
          </div>
        );

      // ── Step 4: Patient details ─────────────────────────────────────────
      case 4:
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-3xl font-bold text-ink">Patient Details</h2>
              <span className="font-mono text-xs bg-bone px-2 py-1 rounded-md border border-sage-light text-ink-soft">
                UHID: {data.uhid}
              </span>
            </div>
            <p className="text-xs text-ink-soft mb-6">
              Compliant with Ayushman Bharat Digital Mission (ABDM) identification.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                  Registration Category
                </label>
                <div className="flex gap-3">
                  {[
                    { label: 'New Patient (Auto-UHID)', val: true },
                    { label: 'Existing Hospital Patient', val: false },
                  ].map(opt => (
                    <button
                      key={String(opt.val)}
                      onClick={() => setData(d => ({ ...d, isNewPatient: opt.val }))}
                      className={cn(
                        'flex-1 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all',
                        data.isNewPatient === opt.val
                          ? 'border-verdigris bg-mint text-verdigris-deep'
                          : 'border-sage-light hover:border-verdigris text-ink'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1 uppercase tracking-wider">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  value={data.patientName || ''}
                  onChange={e => setData(d => ({ ...d, patientName: e.target.value }))}
                  className="input text-sm"
                  placeholder="e.g., Rahul Vinod Mehta"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1 uppercase tracking-wider">
                  Indian Mobile Number (10 digits) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-ink-soft">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={data.patientPhone || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setData(d => ({ ...d, patientPhone: val }));
                      if (phoneError) validateIndianPhone(val);
                    }}
                    className="input pl-12 text-sm font-mono"
                    placeholder="98201 12345"
                    required
                  />
                </div>
                {phoneError && (
                  <p className="text-xs text-signal mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {phoneError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1 uppercase tracking-wider">
                  Email Address (Optional for Digital Report Dispatch)
                </label>
                <input
                  type="email"
                  value={data.patientEmail || ''}
                  onChange={e => setData(d => ({ ...d, patientEmail: e.target.value }))}
                  className="input text-sm"
                  placeholder="rahul.mehta@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1 uppercase tracking-wider">
                  Chief Medical Complaint / Purpose of Visit
                </label>
                <textarea
                  value={data.visitReason || ''}
                  onChange={e => setData(d => ({ ...d, visitReason: e.target.value }))}
                  className="input resize-none text-sm"
                  rows={3}
                  placeholder="e.g., Routine cardiac follow-up, knee pain while walking..."
                />
              </div>

              <Button
                variant="primary"
                className="w-full justify-center bg-saffron text-ink hover:bg-[var(--saffron-deep)] font-semibold"
                disabled={!data.patientName || !data.patientPhone}
                onClick={() => {
                  if (validateIndianPhone(data.patientPhone || '')) {
                    next();
                  }
                }}
              >
                Review & Confirm Appointment
              </Button>
            </div>
          </div>
        );

      // ── Step 5: Confirm ─────────────────────────────────────────────────
      case 5:
        return (
          <div>
            <h2 className="font-display text-3xl font-bold text-ink mb-2">Review & Confirm</h2>
            <p className="text-xs text-ink-soft mb-6">
              Please verify your appointment and hospital reporting details.
            </p>

            <div className="card p-6 mb-6 space-y-4 bg-paper border border-sage-light shadow-warm-xs">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Assigned UHID</p>
                  <p className="font-mono font-bold text-verdigris">{data.uhid}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">OPD Tariff (INR)</p>
                  <p className="font-display font-bold text-ink">₹{data.fee || 1200}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Department</p>
                  <p className="font-medium text-ink">{data.departmentName}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Consultant Doctor</p>
                  <p className="font-medium text-ink">{data.doctorName}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Hospital Center</p>
                  <p className="font-medium text-ink text-xs">{data.branchName}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Consultation Mode</p>
                  <p className="font-medium text-ink capitalize">{data.consultationType}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Appointment Date</p>
                  <p className="font-medium text-ink">{data.date}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Time Slot</p>
                  <p className="font-medium text-ink">{data.slot}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Patient Name</p>
                  <p className="font-medium text-ink">{data.patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-0.5">Contact Phone</p>
                  <p className="font-mono text-ink text-xs">{data.patientPhone}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-bone border border-sage-light p-4 mb-6">
              <p className="text-xs text-ink-soft leading-relaxed">
                <strong>Hospital Reporting Note:</strong> Please report to the Ground Floor OPD registration desk 15 minutes before your scheduled slot with your government photo ID or ABHA card.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center bg-saffron text-ink hover:bg-[var(--saffron-deep)] font-bold"
              onClick={handleConfirmBooking}
            >
              Confirm Appointment Booking
            </Button>
          </div>
        );

      // ── Step 6: Success ─────────────────────────────────────────────────
      case 6:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center">
                <Check size={32} className="text-verdigris" />
              </div>
            </div>
            <SuccessRelifLine className="mb-4 max-w-xs mx-auto" />
            <h2 className="font-display text-4xl font-bold text-ink mb-1">Appointment Confirmed</h2>
            <p className="text-sm text-ink-soft mb-6">
              Token registered with Supabase Cloud & Hospital Desk (Demo).
            </p>

            <div className="flex justify-center mb-6">
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
              <Button
                variant="primary"
                className="bg-verdigris text-white hover:bg-verdigris-deep flex items-center gap-2"
                onClick={() => setShowReceiptModal(true)}
              >
                <Printer size={16} />
                Print / View OPD Slip
              </Button>
              <Button variant="secondary" onClick={() => navigate(ROUTES.patientAppointments)}>
                View in My Appointments
              </Button>
              <Button variant="ghost" onClick={() => { setStep(0); setData({}); }}>
                Book Another
              </Button>
            </div>

            <p className="text-xs text-ink-soft mt-6">
              Demo — simulated appointment token. No actual SMS will be dispatched.
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
      {/* Printable Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-paper max-w-lg w-full rounded-2xl border border-sage p-6 sm:p-8 shadow-warm-lg space-y-6 relative">
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 text-ink-soft hover:text-ink p-1 rounded-lg"
              aria-label="Close receipt"
            >
              <X size={20} />
            </button>

            {/* Receipt Header */}
            <div className="border-b-2 border-dashed border-sage-light pb-4 text-center space-y-1">
              <span className="font-display font-bold text-2xl text-ink">RELIF HOSPITAL</span>
              <p className="text-xs text-ink-soft font-mono">
                Multispecialty Healthcare & Research Institute · NABH Accredited
              </p>
              <p className="text-[11px] text-sage">
                Versova Link Road, Andheri West, Mumbai 400053 · 24/7 Helpline: 1066
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-mint text-verdigris-deep">
                OFFICIAL OPD CONSULTATION SLIP (DEMO)
              </span>
            </div>

            {/* Receipt Body */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-sage-light">
                <div>
                  <span className="text-ink-soft block text-[10px] uppercase">Token / Booking ID</span>
                  <span className="font-mono font-bold text-ink text-sm">{appointmentId}</span>
                </div>
                <div className="text-right">
                  <span className="text-ink-soft block text-[10px] uppercase">Patient UHID</span>
                  <span className="font-mono font-bold text-verdigris text-sm">{data.uhid}</span>
                </div>
                <div>
                  <span className="text-ink-soft block text-[10px] uppercase">Patient Name</span>
                  <span className="font-bold text-ink">{data.patientName}</span>
                </div>
                <div className="text-right">
                  <span className="text-ink-soft block text-[10px] uppercase">Contact Number</span>
                  <span className="font-mono text-ink">{data.patientPhone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-sage-light">
                <div>
                  <span className="text-ink-soft block text-[10px] uppercase">Consultant Doctor</span>
                  <span className="font-bold text-ink">{data.doctorName}</span>
                  <span className="text-ink-soft block">{data.departmentName}</span>
                </div>
                <div className="text-right">
                  <span className="text-ink-soft block text-[10px] uppercase">Reporting OPD Room</span>
                  <span className="font-bold text-ink">Room #204 (2nd Floor)</span>
                </div>
                <div>
                  <span className="text-ink-soft block text-[10px] uppercase">Appointment Date & Slot</span>
                  <span className="font-bold text-ink">{data.date} · {data.slot}</span>
                </div>
                <div className="text-right">
                  <span className="text-ink-soft block text-[10px] uppercase">Consultation Mode</span>
                  <span className="font-medium text-ink capitalize">{data.consultationType}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 bg-bone px-3 rounded-lg border border-sage-light">
                <span className="font-semibold text-ink">Consultation Tariff (Net Payable)</span>
                <span className="font-display font-bold text-base text-ink">₹{data.fee || 1200}.00</span>
              </div>
            </div>

            <div className="text-[11px] text-ink-soft space-y-1">
              <p>• Please present this slip along with your Aadhaar / ABHA card at Counter 3.</p>
              <p>• Emergency triage operates 24/7 independently of OPD token queues.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                className="flex-1 justify-center bg-saffron text-ink hover:bg-[var(--saffron-deep)]"
                onClick={() => window.print()}
              >
                <Printer size={16} className="mr-1.5" /> Print Slip
              </Button>
              <Button
                variant="secondary"
                className="flex-1 justify-center"
                onClick={() => setShowReceiptModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

