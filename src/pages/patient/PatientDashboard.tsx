// PatientDashboard.tsx — Relif Hospital Patient Portal Dashboard
// Real User Identity & Real Appointments via Supabase + Clean Zero-Demo State for New Patients

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  FileText,
  CreditCard,
  Download,
  ArrowRight,
  Bell,
  CheckCircle2,
  FlaskConical,
  Receipt,
  Pill,
  X,
  QrCode,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, QRCard } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';
import { cn, formatDate } from '@/utils';
import { ROUTES, APP_CONFIG } from '@/config/constants';
import { SupabaseService, SupabaseAppointmentRecord } from '@/services/supabaseService';
import { AuthService, PatientUser } from '@/services/authService';

// ── QR Modal ─────────────────────────────────────────────────────────────────
function QRModal({ open, onClose, appt, patientName }: { open: boolean; onClose: () => void; appt?: any; patientName: string }) {
  if (!appt) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-modal flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-night/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Card */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              aria-label="Close QR modal"
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-paper flex items-center justify-center shadow-warm z-10 text-ink-soft hover:text-signal transition-colors"
            >
              <X size={16} />
            </button>
            <QRCard
              appointmentId={appt.id || appt.appointment_id}
              patientName={patientName}
              date={appt.date || appt.appointment_date}
              time={appt.time || appt.appointment_time}
              doctor={appt.doctor || appt.doctor_name}
              department={appt.department || appt.department_name}
              qrValue={appt.id || appt.appointment_id}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export function PatientDashboard() {
  const [activePatient, setActivePatient] = useState<PatientUser | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [userAppointments, setUserAppointments] = useState<SupabaseAppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (patient: PatientUser | null) => {
    if (!patient) return;
    try {
      const records = await SupabaseService.getAppointments();
      const patientEmail = (patient.email || '').toLowerCase();
      const patientPhone = (patient.phone || '').replace(/\D/g, '');
      const patientName = (patient.fullName || patient.name || '').toLowerCase();

      // Filter real appointments belonging to this user
      const matched = records.filter(r => {
        const rEmail = (r.patient_email || '').toLowerCase();
        const rPhone = (r.patient_phone || '').replace(/\D/g, '');
        const rName = (r.patient_name || '').toLowerCase();

        return (
          (patientEmail && rEmail === patientEmail) ||
          (patientPhone && rPhone && (rPhone.includes(patientPhone) || patientPhone.includes(rPhone))) ||
          (patientName && rName === patientName)
        );
      });

      setUserAppointments(matched);
    } catch {
      setUserAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const p = AuthService.getActivePatient();
    setActivePatient(p);
    fetchUserData(p);

    const handleCreated = () => {
      const updatedP = AuthService.getActivePatient();
      setActivePatient(updatedP);
      fetchUserData(updatedP);
    };

    window.addEventListener('relif_appointment_created', handleCreated);
    window.addEventListener('relif_auth_state_changed', handleCreated);
    return () => {
      window.removeEventListener('relif_appointment_created', handleCreated);
      window.removeEventListener('relif_auth_state_changed', handleCreated);
    };
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  });

  const nextAppt = userAppointments.length > 0 ? userAppointments[0] : null;
  const isDemoAccount = activePatient?.email?.toLowerCase().includes('rahul');

  const displayName = activePatient?.fullName || activePatient?.name || 'Valued Patient';
  const displayFirstName = displayName.split(' ')[0];

  return (
    <>
      <QRModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        appt={nextAppt}
        patientName={displayName}
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── Greeting ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
              {greeting}, {displayFirstName}.
            </h1>
            <p className="text-ink-soft text-sm mt-1">
              {today} · Electronic Health Record (EHR) Active
            </p>
            <RelifLine variant="section" className="mt-3 max-w-xs opacity-50" />
          </div>

          {activePatient && (
            <div className="bg-bone px-4 py-2.5 rounded-2xl border border-sage-light text-xs font-mono space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-ink">UHID: {activePatient.uhid}</span>
              </div>
              <p className="text-ink-soft text-[11px]">ABHA: {activePatient.abhaId}</p>
            </div>
          )}
        </motion.div>

        {/* ── Main grid: content + notifications ── */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* ── Left column ── */}
          <div className="space-y-6">
            {/* Hero: Active appointment or Welcome Banner */}
            {nextAppt ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="card p-6 bg-paper border border-sage-light relative overflow-hidden shadow-warm-xs"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-mint rounded-full -translate-y-16 translate-x-16 opacity-40" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-verdigris uppercase tracking-widest bg-mint px-2 py-0.5 rounded-full">
                      Next Consultation
                    </span>
                    <span className="text-xs font-mono text-ink-soft font-medium">Token: {nextAppt.appointment_id}</span>
                  </div>

                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-ink">
                        {nextAppt.doctor_name}
                      </h2>
                      <p className="text-ink-soft mt-1 text-sm">
                        {nextAppt.department_name} · {nextAppt.branch_name || 'Main Hospital Campus'}
                      </p>
                      <p className="text-ink font-medium mt-1 text-sm flex items-center gap-1.5">
                        <Clock size={13} className="text-verdigris" />
                        {nextAppt.appointment_date} · {nextAppt.appointment_time}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setQrOpen(true)}
                        className="bg-saffron text-ink hover:bg-saffron-deep font-semibold shadow-warm-xs flex items-center gap-1.5"
                      >
                        <QrCode size={14} />
                        <span>View Check-In QR</span>
                      </Button>
                      <Link to={ROUTES.book}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full border border-sage-light text-ink-soft hover:text-ink hover:border-sage text-xs"
                        >
                          Book Another
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-paper to-bone border border-sage space-y-4 shadow-warm-xs"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-verdigris bg-mint px-2 py-0.5 rounded-full inline-block">
                      Dossier Initialized
                    </span>
                    <h2 className="font-display text-2xl font-bold text-ink">
                      Welcome to Relif Care Multispecialty
                    </h2>
                    <p className="text-sm text-ink-soft leading-relaxed max-w-xl">
                      Your hospital health file is ready. All consultations, verified lab reports, and doctor prescriptions will automatically synchronize here under your UHID.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-mint flex items-center justify-center text-verdigris flex-shrink-0 shadow-xs">
                    <ShieldCheck size={26} />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-sage-light">
                  <Link to={ROUTES.book}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-saffron text-ink hover:bg-saffron-deep font-semibold shadow-warm-xs flex items-center gap-1.5"
                    >
                      <Calendar size={14} />
                      <span>Book OPD or Video Consultation →</span>
                    </Button>
                  </Link>
                  <Link to={ROUTES.doctors}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full border border-sage-light text-ink-soft hover:text-ink text-xs"
                    >
                      Explore Specialists
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Stat cards (Real User Metrics) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card p-5 bg-paper border border-sage-light rounded-2xl">
                <span className="text-xs text-ink-soft block font-medium">Total Appointments</span>
                <span className="font-display text-3xl font-bold text-ink mt-1 block">
                  {userAppointments.length}
                </span>
                <span className="text-[11px] font-mono text-sage mt-1 block">
                  {userAppointments.length > 0 ? 'Active scheduled visits' : 'No upcoming visits'}
                </span>
              </div>

              <div className="card p-5 bg-paper border border-sage-light rounded-2xl">
                <span className="text-xs text-ink-soft block font-medium">Reports Ready</span>
                <span className="font-display text-3xl font-bold text-ink mt-1 block">
                  {isDemoAccount ? 3 : 0}
                </span>
                <span className="text-[11px] font-mono text-sage mt-1 block">
                  {isDemoAccount ? 'Pathology results' : 'Updated post-consultation'}
                </span>
              </div>

              <div className="card p-5 bg-paper border border-sage-light rounded-2xl">
                <span className="text-xs text-ink-soft block font-medium">Pending Invoices</span>
                <span className="font-display text-3xl font-bold text-ink mt-1 block text-emerald-700">
                  {isDemoAccount ? '₹2,400' : '₹0'}
                </span>
                <span className="text-[11px] font-mono text-sage mt-1 block">
                  {isDemoAccount ? 'Awaiting payment' : 'Zero balance / Cleared'}
                </span>
              </div>
            </div>

            {/* Activity List: Real User History */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="card p-6 bg-paper border border-sage-light rounded-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-semibold text-ink">
                  Recent Clinical Activity
                </h2>
                <Link to={ROUTES.book} className="text-xs font-semibold text-verdigris hover:underline">
                  + New Booking
                </Link>
              </div>

              {userAppointments.length > 0 ? (
                <ul className="space-y-4">
                  {userAppointments.map((appt, i) => (
                    <li
                      key={appt.appointment_id || i}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-bone border border-sage-light/60 hover:bg-mint/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-mint text-verdigris flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-ink">
                            {appt.department_name} — {appt.doctor_name}
                          </h4>
                          <p className="text-xs text-ink-soft">
                            {appt.appointment_date} at {appt.appointment_time} · {appt.consultation_type === 'video' ? 'Tele-OPD' : 'In-person'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                          {appt.status || 'Confirmed'}
                        </span>
                        <p className="font-mono text-[11px] text-ink-soft mt-0.5">{appt.appointment_id}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-8 text-center space-y-2 border border-dashed border-sage rounded-xl bg-bone/50">
                  <Calendar size={28} className="mx-auto text-sage" />
                  <h4 className="text-sm font-semibold text-ink">No recorded consultations yet</h4>
                  <p className="text-xs text-ink-soft max-w-sm mx-auto">
                    When you book an in-person or video consultation, your digital prescription, OPD token, and check-in QR code will be recorded here.
                  </p>
                  <div className="pt-2">
                    <Link to={ROUTES.book}>
                      <Button variant="primary" size="sm" className="bg-verdigris text-white hover:bg-verdigris-deep">
                        Schedule First Visit
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Quick actions */}
            <div className="card p-5 bg-paper border border-sage-light rounded-2xl space-y-3">
              <h3 className="font-display text-base font-semibold text-ink">
                Healthcare Quick Actions
              </h3>
              <div className="flex flex-wrap gap-2.5">
                <Link to={ROUTES.book}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-saffron text-ink hover:bg-saffron-deep font-semibold rounded-full"
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Book Appointment
                  </Button>
                </Link>
                <Link to={ROUTES.patientRecords}>
                  <Button variant="ghost" size="sm" className="rounded-full border border-sage text-ink-soft hover:text-ink text-xs">
                    Health Records
                  </Button>
                </Link>
                <Link to={ROUTES.patientBilling}>
                  <Button variant="ghost" size="sm" className="rounded-full border border-sage text-ink-soft hover:text-ink text-xs">
                    Billing & Receipts
                  </Button>
                </Link>
                <Link to={ROUTES.doctors}>
                  <Button variant="ghost" size="sm" className="rounded-full border border-sage text-ink-soft hover:text-ink text-xs">
                    Doctor Roster
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Right: Official Notifications panel ── */}
          <div className="space-y-4">
            <div className="card p-5 bg-paper border border-sage-light rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Bell size={16} className="text-verdigris" />
                <h2 className="font-display text-lg font-semibold text-ink">
                  Account Notifications
                </h2>
              </div>

              <ul className="space-y-3">
                <li className="p-3 rounded-xl bg-bone border border-sage-light text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-verdigris" />
                      Account Verified
                    </span>
                    <span className="font-mono text-[10px] text-sage">Active</span>
                  </div>
                  <p className="text-ink-soft text-[11px]">
                    Official Hospital UHID <strong>{activePatient?.uhid || 'RH26-00000'}</strong> issued under ABDM protocol.
                  </p>
                </li>

                <li className="p-3 rounded-xl bg-bone border border-sage-light text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink flex items-center gap-1.5">
                      <Receipt size={13} className="text-verdigris" />
                      Billing Clearance
                    </span>
                    <span className="font-mono text-[10px] text-emerald-700">₹0 Due</span>
                  </div>
                  <p className="text-ink-soft text-[11px]">
                    No outstanding hospital fees or pending OPD dues on this file.
                  </p>
                </li>

                <li className="p-3 rounded-xl bg-bone border border-sage-light text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink flex items-center gap-1.5">
                      <Pill size={13} className="text-verdigris" />
                      24/7 Clinical Support
                    </span>
                    <span className="font-mono text-[10px] text-sage">Desk</span>
                  </div>
                  <p className="text-ink-soft text-[11px]">
                    Need immediate assistance? Contact our trauma concierge at <strong>{APP_CONFIG.emergencyNumber}</strong>.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
