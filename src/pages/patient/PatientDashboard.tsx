// PatientDashboard.tsx — Clean Real-Data Dashboard with Proper Empty States (Zero Demo Data)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, FileText, CreditCard, ArrowRight, QrCode, ShieldCheck, X, Plus
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, QRCard, Skeleton, EmptyState } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import {
  SupabaseService,
  SupabaseAppointmentRecord,
  PaymentRecord,
  PatientReportRecord,
} from '@/services/supabaseService';
import { AuthService, PatientUser } from '@/services/authService';

function QRModal({
  open,
  onClose,
  appt,
  patientName,
}: {
  open: boolean;
  onClose: () => void;
  appt: SupabaseAppointmentRecord | null;
  patientName: string;
}) {
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
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
          >
            <button
              onClick={onClose}
              aria-label="Close QR modal"
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-paper flex items-center justify-center shadow-warm text-ink-soft hover:text-signal z-10"
            >
              <X size={16} />
            </button>
            <QRCard
              appointmentId={appt.booking_ref}
              patientName={patientName}
              date={appt.appointment_date}
              time={appt.appointment_time}
              doctor={appt.doctor_name}
              department={appt.department_name}
              qrValue={appt.booking_ref}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PatientDashboard() {
  const [patient, setPatient] = useState<PatientUser | null>(() => AuthService.getActivePatient());
  const [appointments, setAppointments] = useState<SupabaseAppointmentRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [reports, setReports] = useState<PatientReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrAppt, setQrAppt] = useState<SupabaseAppointmentRecord | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const user = await AuthService.syncSession();
      if (!active) return;
      setPatient(user);

      if (user) {
        const [appts, pays, reps] = await Promise.all([
          SupabaseService.getPatientAppointments(),
          SupabaseService.getPatientPayments(),
          SupabaseService.getPatientReports(),
        ]);
        if (!active) return;
        setAppointments(appts);
        setPayments(pays);
        setReports(reps);
      }
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, []);

  const upcomingAppts = appointments.filter(a => a.status === 'booked' || a.status === 'confirmed' || a.status === 'checked_in');
  const nextAppt = upcomingAppts[0] || null;
  const pendingBillsTotal = payments
    .filter(p => p.status === 'pending')
    .reduce((acc, p) => acc + p.amount, 0);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Greeting Banner */}
      <div className="card p-6 bg-paper flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-verdigris font-semibold">
            <ShieldCheck size={13} /> Patient Portal · UHID {patient?.uhid}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-1">
            Welcome back, {patient?.fullName || 'Patient'}
          </h1>
          <p className="text-sm text-ink-soft mt-0.5">
            {patient?.email} {patient?.phone ? `· ${patient.phone}` : ''}
          </p>
        </div>

        <Link to={ROUTES.book} className="btn btn-primary btn-md flex-shrink-0">
          <Plus size={16} /> Book Appointment
        </Link>
      </div>

      {/* Stat Cards (Derived 100% from real DB rows — zero invented numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 bg-paper">
          <div className="flex items-center justify-between text-ink-soft text-xs font-medium mb-2">
            <span>Upcoming Visits</span>
            <Calendar size={15} className="text-verdigris" />
          </div>
          <p className="font-display text-3xl font-bold text-ink">{upcomingAppts.length}</p>
          <Link to={ROUTES.patientAppointments} className="text-xs text-verdigris font-semibold mt-2 inline-flex items-center gap-1 hover:underline">
            Manage appointments <ArrowRight size={12} />
          </Link>
        </div>

        <div className="card p-5 bg-paper">
          <div className="flex items-center justify-between text-ink-soft text-xs font-medium mb-2">
            <span>Available Reports</span>
            <FileText size={15} className="text-verdigris" />
          </div>
          <p className="font-display text-3xl font-bold text-ink">{reports.length}</p>
          <Link to={ROUTES.patientRecords} className="text-xs text-verdigris font-semibold mt-2 inline-flex items-center gap-1 hover:underline">
            View medical records <ArrowRight size={12} />
          </Link>
        </div>

        <div className="card p-5 bg-paper">
          <div className="flex items-center justify-between text-ink-soft text-xs font-medium mb-2">
            <span>Pending Balance</span>
            <CreditCard size={15} className="text-verdigris" />
          </div>
          <p className="font-display text-3xl font-bold text-ink">
            ₹{pendingBillsTotal.toLocaleString('en-IN')}
          </p>
          <Link to={ROUTES.patientBilling} className="text-xs text-verdigris font-semibold mt-2 inline-flex items-center gap-1 hover:underline">
            View receipts &amp; billing <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Next Upcoming Appointment OR Clean Empty State */}
      {nextAppt ? (
        <div className="card p-6 bg-paper border-verdigris/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-mint text-verdigris-deep font-semibold">
              Next Confirmed Visit · {nextAppt.booking_ref}
            </span>
            <h2 className="font-display text-xl font-bold text-ink pt-1">
              {nextAppt.doctor_name} · {nextAppt.department_name}
            </h2>
            <p className="text-sm text-ink-soft">
              {nextAppt.appointment_date} at {nextAppt.appointment_time} · {nextAppt.branch_name} ({nextAppt.consultation_type === 'video' ? 'Video' : 'In-Clinic'})
            </p>
            <p className="font-mono text-xs text-verdigris-deep font-semibold">
              Fee: ₹{nextAppt.total_amount} · Status: {nextAppt.payment_status === 'paid' ? 'Paid Online' : 'Pay at Hospital'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="primary" size="sm" leftIcon={<QrCode size={15} />} onClick={() => setQrAppt(nextAppt)}>
              Show QR Pass
            </Button>
            <Link to={ROUTES.patientAppointments} className="btn btn-secondary btn-sm">
              Reschedule / Cancel
            </Link>
          </div>
        </div>
      ) : (
        <div className="card p-8 bg-paper">
          <EmptyState
            icon={<Calendar size={28} />}
            title="No appointments yet. Book your first visit."
            description="Your consultation bookings, check-in QR codes, prescriptions, and GST receipts will appear right here."
            action={
              <Link to={ROUTES.book} className="btn btn-primary btn-md">
                Book Your First Visit →
              </Link>
            }
          />
        </div>
      )}

      <QRModal
        open={Boolean(qrAppt)}
        onClose={() => setQrAppt(null)}
        appt={qrAppt}
        patientName={patient?.fullName || 'Patient'}
      />
    </div>
  );
}
