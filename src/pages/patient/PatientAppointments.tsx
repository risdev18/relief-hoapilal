// PatientAppointments.tsx — Real Supabase Appointments with Upcoming/Completed/Cancelled Tabs, Reschedule, Cancel & Refund Calculation + PDF Receipt

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, QrCode, RefreshCw, X, FileText, Plus, AlertCircle, CheckCircle2, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, EmptyState, QRCard, Skeleton } from '@/components/ui';
import { cn } from '@/utils';
import { ROUTES } from '@/config/constants';
import {
  SupabaseService,
  SupabaseAppointmentRecord,
  SlotRecord,
} from '@/services/supabaseService';
import { AuthService } from '@/services/authService';
import { PaymentService } from '@/services/paymentService';

const CANCEL_REASONS = [
  'Schedule conflict',
  'Feeling better / symptom resolved',
  'Prefer a different branch or timing',
  'Personal or family emergency',
  'Booked another slot by mistake',
];

const UPCOMING_RESCHEDULE_DATES = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  const iso = d.toISOString().split('T')[0];
  const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
  return { date: iso, label };
});

function estimateRefundRule(dateStr: string, timeStr: string) {
  try {
    const dt = new Date(`${dateStr} ${timeStr}`);
    const diffHrs = (dt.getTime() - Date.now()) / (1000 * 60 * 60);
    if (isNaN(diffHrs) || diffHrs >= 24) {
      return { pct: 100, label: 'Free cancellation (>= 24 hrs): 100% refund' };
    }
    if (diffHrs >= 2) {
      return { pct: 50, label: '2–24 hrs before visit: 50% refund' };
    }
    return { pct: 0, label: 'Less than 2 hrs before slot: Non-refundable' };
  } catch {
    return { pct: 100, label: 'Free cancellation (>= 24 hrs): 100% refund' };
  }
}

export function PatientAppointments() {
  const [appointments, setAppointments] = useState<SupabaseAppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Modals
  const [qrAppt, setQrAppt] = useState<SupabaseAppointmentRecord | null>(null);
  const [cancelAppt, setCancelAppt] = useState<SupabaseAppointmentRecord | null>(null);
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0]);
  const [rescheduleAppt, setRescheduleAppt] = useState<SupabaseAppointmentRecord | null>(null);
  const [newDate, setNewDate] = useState(UPCOMING_RESCHEDULE_DATES[1].date);
  const [newTime, setNewTime] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState<SlotRecord[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const patient = AuthService.getActivePatient();

  const loadAppointments = async () => {
    setLoading(true);
    const list = await SupabaseService.getPatientAppointments();
    setAppointments(list);
    setLoading(false);
  };

  useEffect(() => {
    void loadAppointments();
    const onCreated = () => void loadAppointments();
    window.addEventListener('relif_appointment_created', onCreated);
    return () => window.removeEventListener('relif_appointment_created', onCreated);
  }, []);

  useEffect(() => {
    if (!rescheduleAppt) return;
    setSlotsLoading(true);
    setNewTime('');
    void SupabaseService.getDoctorSlots(
      rescheduleAppt.doctor_id,
      rescheduleAppt.branch_id,
      newDate,
      rescheduleAppt.consultation_type
    ).then(list => {
      setRescheduleSlots(list);
      setSlotsLoading(false);
    });
  }, [rescheduleAppt, newDate]);

  const upcomingList = appointments.filter(a => ['booked', 'confirmed', 'checked_in'].includes(a.status));
  const completedList = appointments.filter(a => a.status === 'completed');
  const cancelledList = appointments.filter(a => a.status === 'cancelled');

  const visibleList =
    activeTab === 'upcoming'
      ? upcomingList
      : activeTab === 'completed'
      ? completedList
      : cancelledList;

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  const handleConfirmCancel = async () => {
    if (!cancelAppt) return;
    setBusy(true);
    try {
      const res = await SupabaseService.cancelAppointment(cancelAppt, cancelReason);
      setCancelAppt(null);
      await loadAppointments();
      showToast(
        'success',
        res.refundAmount > 0
          ? `Appointment cancelled. Refund of ₹${res.refundAmount} (${res.refundPercentage}%) is ${res.refundStatus}. Slot released.`
          : 'Appointment cancelled and slot released immediately.'
      );
    } catch (err: any) {
      showToast('error', err?.message || 'Unable to cancel appointment.');
    } finally {
      setBusy(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleAppt || !newTime) return;
    setBusy(true);
    try {
      await SupabaseService.rescheduleAppointment(rescheduleAppt, newDate, newTime);
      setRescheduleAppt(null);
      await loadAppointments();
      showToast('success', `Rescheduled to ${newDate} at ${newTime} with no extra charge.`);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to reschedule slot.');
    } finally {
      setBusy(false);
    }
  };

  const handleDownloadPdf = (appt: SupabaseAppointmentRecord) => {
    PaymentService.downloadReceiptPDF({
      bookingRef: appt.booking_ref,
      receiptNumber: appt.payment?.receipt_number || `RCPT-${appt.booking_ref}`,
      patientName: appt.patient_name,
      patientUhid: patient?.uhid,
      patientPhone: appt.patient_phone,
      patientEmail: appt.patient_email,
      doctorName: appt.doctor_name,
      departmentName: appt.department_name,
      branchName: appt.branch_name,
      consultationType: appt.consultation_type,
      date: appt.appointment_date,
      time: appt.appointment_time,
      consultationFee: appt.consultation_fee,
      taxAmount: appt.tax_amount,
      totalAmount: appt.total_amount,
      paymentMode: appt.payment_mode,
      paymentStatus: appt.payment_status,
      razorpayPaymentId: appt.payment?.razorpay_payment_id,
      refundAmount: appt.cancellation?.refund_amount || appt.payment?.refund_amount,
      refundStatus: appt.cancellation?.refund_status || appt.payment?.refund_status,
    });
  };

  const refundRulePreview = cancelAppt
    ? estimateRefundRule(cancelAppt.appointment_date, cancelAppt.appointment_time)
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">My Appointments</h1>
          <p className="text-sm text-ink-soft mt-1">
            Manage your bookings, reschedule slots, download GST PDF receipts, or cancel with instant slot release.
          </p>
        </div>
        <Link to={ROUTES.book} className="btn btn-primary btn-sm flex-shrink-0">
          <Plus size={15} /> Book New Visit
        </Link>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              'p-4 rounded-xl border text-xs flex items-center gap-2.5',
              toast.type === 'success'
                ? 'bg-mint/60 border-verdigris text-verdigris-deep'
                : 'bg-[var(--signal-light)] border-signal text-signal-deep'
            )}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span className="font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs: Upcoming | Completed | Cancelled */}
      <div className="flex gap-2 p-1 rounded-xl bg-paper border border-sage-light w-fit">
        {[
          { id: 'upcoming', label: 'Upcoming', count: upcomingList.length },
          { id: 'completed', label: 'Completed', count: completedList.length },
          { id: 'cancelled', label: 'Cancelled', count: cancelledList.length },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2',
              activeTab === tab.id
                ? 'bg-verdigris text-white shadow-xs'
                : 'text-ink-soft hover:text-ink'
            )}
          >
            <span>{tab.label}</span>
            <span className={cn(
              'font-mono text-[11px] px-1.5 py-0.5 rounded-full',
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-bone text-ink-soft'
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      ) : visibleList.length === 0 ? (
        <div className="card p-8 bg-paper">
          <EmptyState
            icon={<Calendar size={26} />}
            title={
              activeTab === 'upcoming'
                ? 'No appointments yet. Book your first visit.'
                : activeTab === 'completed'
                ? 'No completed visits yet.'
                : 'No cancelled appointments.'
            }
            description={
              activeTab === 'upcoming'
                ? 'Select a department, see upfront consultation fees, and lock your time slot in six steps.'
                : undefined
            }
            action={
              activeTab === 'upcoming' ? (
                <Link to={ROUTES.book} className="btn btn-primary btn-md">
                  Book Your First Visit →
                </Link>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {visibleList.map(appt => {
            const refundInfo = appt.cancellation || appt.payment;
            return (
              <div key={appt.id} className="card p-5 bg-paper flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink bg-bone px-2.5 py-0.5 rounded-full border border-sage-light">
                      {appt.booking_ref}
                    </span>
                    <Badge
                      variant={
                        appt.status === 'cancelled'
                          ? 'signal'
                          : appt.status === 'completed'
                          ? 'verdigris'
                          : 'default'
                      }
                      size="sm"
                    >
                      {appt.status.replace('_', ' ')}
                    </Badge>
                    {appt.payment_status === 'paid' && (
                      <Badge variant="verdigris" size="sm">Paid Online ₹{appt.total_amount}</Badge>
                    )}
                    {appt.payment_status === 'pending' && appt.status !== 'cancelled' && (
                      <Badge variant="saffron" size="sm">Pay at Hospital ₹{appt.total_amount}</Badge>
                    )}
                    {(appt.payment_status === 'refund_pending' || appt.payment_status === 'refunded') && (
                      <Badge variant="saffron" size="sm">
                        {appt.payment_status === 'refunded' ? 'Refunded' : 'Refund Pending'} ₹{refundInfo?.refund_amount || 0}
                      </Badge>
                    )}
                  </div>

                  <h2 className="font-display text-xl font-bold text-ink">
                    {appt.doctor_name}{' '}
                    <span className="text-sm font-sans font-normal text-verdigris">
                      · {appt.department_name}
                    </span>
                  </h2>

                  <p className="text-sm text-ink-soft">
                    {appt.appointment_date} at {appt.appointment_time} · {appt.branch_name} ({appt.consultation_type === 'video' ? 'Video Consult' : 'In-Clinic'})
                  </p>

                  {appt.cancel_reason && (
                    <p className="text-xs text-ink-soft font-mono">
                      Reason: {appt.cancel_reason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<FileText size={14} />}
                    onClick={() => handleDownloadPdf(appt)}
                  >
                    PDF Receipt
                  </Button>

                  {activeTab === 'upcoming' && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<QrCode size={14} />}
                        onClick={() => setQrAppt(appt)}
                      >
                        QR Pass
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<RefreshCw size={14} />}
                        onClick={() => setRescheduleAppt(appt)}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-signal hover:bg-[var(--signal-light)]"
                        onClick={() => setCancelAppt(appt)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}

                  {activeTab === 'completed' && appt.doctor_slug && (
                    <Link
                      to={ROUTES.doctor(appt.doctor_slug)}
                      className="btn btn-primary btn-sm"
                    >
                      <Star size={14} /> Write Verified Review
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Modal */}
      <AnimatePresence>
        {qrAppt && (
          <motion.div
            className="fixed inset-0 z-modal flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setQrAppt(null)} />
            <div className="relative z-10">
              <button
                onClick={() => setQrAppt(null)}
                aria-label="Close QR"
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-paper flex items-center justify-center shadow-warm text-ink"
              >
                <X size={16} />
              </button>
              <QRCard
                appointmentId={qrAppt.booking_ref}
                patientName={qrAppt.patient_name}
                date={qrAppt.appointment_date}
                time={qrAppt.appointment_time}
                doctor={qrAppt.doctor_name}
                department={qrAppt.department_name}
                qrValue={qrAppt.booking_ref}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleAppt && (
          <motion.div
            className="fixed inset-0 z-modal flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setRescheduleAppt(null)} />
            <div className="relative z-10 w-full max-w-lg bg-paper rounded-2xl border border-sage p-6 space-y-5 shadow-warm-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs uppercase text-verdigris font-semibold">
                    Complimentary Reschedule
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink">
                    {rescheduleAppt.doctor_name}
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Current: {rescheduleAppt.appointment_date} · {rescheduleAppt.appointment_time}
                  </p>
                </div>
                <button onClick={() => setRescheduleAppt(null)} className="text-ink-soft hover:text-ink">
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {UPCOMING_RESCHEDULE_DATES.map(d => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setNewDate(d.date)}
                    className={cn(
                      'px-3 py-2 rounded-xl border text-xs font-medium flex-shrink-0',
                      newDate === d.date
                        ? 'border-verdigris bg-mint/40 text-verdigris-deep font-semibold'
                        : 'border-sage-light bg-bone text-ink-soft'
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {slotsLoading ? (
                <Skeleton lines={3} />
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {rescheduleSlots.map(s => {
                    const disabled = s.isBooked || s.isBlocked;
                    return (
                      <button
                        key={s.time}
                        type="button"
                        disabled={disabled}
                        onClick={() => setNewTime(s.time)}
                        className={cn(
                          'py-2 px-2 rounded-lg border text-xs font-mono',
                          disabled
                            ? 'bg-bone text-ink-muted line-through cursor-not-allowed'
                            : newTime === s.time
                            ? 'bg-saffron border-saffron text-ink font-bold'
                            : 'bg-paper border-sage-light text-ink hover:border-verdigris'
                        )}
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setRescheduleAppt(null)}>
                  Keep Original
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={busy}
                  disabled={!newTime}
                  onClick={handleConfirmReschedule}
                >
                  Confirm New Slot (No Extra Fee)
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelAppt && (
          <motion.div
            className="fixed inset-0 z-modal flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setCancelAppt(null)} />
            <div className="relative z-10 w-full max-w-md bg-paper rounded-2xl border border-sage p-6 space-y-5 shadow-warm-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs uppercase text-signal font-bold">Cancel Appointment</span>
                  <h3 className="font-display text-xl font-bold text-ink mt-0.5">
                    {cancelAppt.doctor_name}
                  </h3>
                  <p className="text-xs text-ink-soft">
                    {cancelAppt.appointment_date} at {cancelAppt.appointment_time} · Ref {cancelAppt.booking_ref}
                  </p>
                </div>
                <button onClick={() => setCancelAppt(null)} className="text-ink-soft hover:text-ink">
                  <X size={18} />
                </button>
              </div>

              {refundRulePreview && (
                <div className="p-3.5 rounded-xl bg-bone border border-sage-light text-xs space-y-1">
                  <p className="font-semibold text-ink">Applicable Refund Policy:</p>
                  <p className="text-verdigris-deep font-medium">{refundRulePreview.label}</p>
                  {cancelAppt.payment_status === 'paid' && (
                    <p className="font-mono text-ink">
                      Estimated refund: ₹{Math.round((cancelAppt.total_amount * refundRulePreview.pct) / 100)}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="input text-sm"
                >
                  {CANCEL_REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setCancelAppt(null)}>
                  Keep Visit
                </Button>
                <Button
                  variant="emergency"
                  size="sm"
                  isLoading={busy}
                  onClick={handleConfirmCancel}
                >
                  Confirm Cancellation
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
