// PatientAppointments.tsx — Relif Hospital Patient Appointments

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  QrCode,
  RefreshCw,
  X,
  FileText,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, DemoBadge, EmptyState, QRCard } from '@/components/ui';
import { cn, getStatusLabel } from '@/utils';
import { ROUTES } from '@/config/constants';
import { SupabaseService, SupabaseAppointmentRecord } from '@/services/supabaseService';

// ── Types ────────────────────────────────────────────────────────────────────
type AppointmentStatus = 'confirmed' | 'booked' | 'completed' | 'cancelled' | 'rescheduled';

interface Appointment {
  id:         string;
  doctor:     string;
  department: string;
  date:       string;
  time:       string;
  branch:     string;
  status:     AppointmentStatus;
}

// ── Demo data ────────────────────────────────────────────────────────────────
const UPCOMING: Appointment[] = [
  {
    id:         'REL-2026-000147',
    doctor:     'Dr. Priya Sharma',
    department: 'Cardiology',
    date:       '14 Nov 2026',
    time:       '10:30 AM',
    branch:     'Andheri West',
    status:     'confirmed',
  },
  {
    id:         'REL-2026-000152',
    doctor:     'Dr. Rohit Nair',
    department: 'Dermatology',
    date:       '20 Nov 2026',
    time:       '11:00 AM',
    branch:     'Bandra',
    status:     'booked',
  },
  {
    id:         'REL-2026-000160',
    doctor:     'Dr. Meena Kapoor',
    department: 'General Medicine',
    date:       '28 Nov 2026',
    time:       '9:00 AM',
    branch:     'Andheri West',
    status:     'booked',
  },
];

const PAST: Appointment[] = [
  {
    id:         'REL-2026-000110',
    doctor:     'Dr. Suresh Kulkarni',
    department: 'Cardiology',
    date:       '01 Nov 2026',
    time:       '3:00 PM',
    branch:     'Andheri West',
    status:     'completed',
  },
  {
    id:         'REL-2026-000098',
    doctor:     'Dr. Priya Sharma',
    department: 'Cardiology',
    date:       '15 Oct 2026',
    time:       '10:30 AM',
    branch:     'Andheri West',
    status:     'completed',
  },
  {
    id:         'REL-2026-000083',
    doctor:     'Dr. Anjali Desai',
    department: 'Dermatology',
    date:       '01 Oct 2026',
    time:       '12:00 PM',
    branch:     'Bandra',
    status:     'completed',
  },
  {
    id:         'REL-2026-000071',
    doctor:     'Dr. Meena Kapoor',
    department: 'General Medicine',
    date:       '12 Sep 2026',
    time:       '9:30 AM',
    branch:     'Andheri West',
    status:     'rescheduled',
  },
];

// ── Status chip helper ────────────────────────────────────────────────────────
function StatusChip({ status }: { status: AppointmentStatus }) {
  const styles: Record<AppointmentStatus, string> = {
    confirmed:   'bg-mint text-verdigris-deep border border-sage-light',
    booked:      'bg-mint text-verdigris-deep border border-sage-light',
    completed:   'bg-bone text-ink-soft border border-sage-light',
    cancelled:   'bg-[var(--signal-light)] text-[var(--signal-deep)] border border-[var(--signal-light)]',
    rescheduled: 'bg-[var(--saffron-light)] text-[var(--saffron-deep)] border border-[var(--clay)]',
  };

  return (
    <span className={cn('inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-pill', styles[status])}>
      {status === 'confirmed' && <span className="w-1.5 h-1.5 rounded-full bg-verdigris mr-1.5" />}
      {getStatusLabel(status)}
    </span>
  );
}

// ── QR Modal ─────────────────────────────────────────────────────────────────
function QRModal({
  open,
  appt,
  onClose,
}: {
  open:    boolean;
  appt:    Appointment | null;
  onClose: () => void;
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
          <motion.div
            className="absolute inset-0 bg-night/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative z-10"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-paper flex items-center justify-center shadow-warm z-10 text-ink-soft hover:text-signal"
            >
              <X size={16} />
            </button>
            <QRCard
              appointmentId={appt.id}
              patientName="Rahul Mehta"
              date={appt.date}
              time={appt.time}
              doctor={appt.doctor}
              department={appt.department}
              qrValue={appt.id}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Appointment Row ───────────────────────────────────────────────────────────
function AppointmentRow({
  appt,
  tab,
  onViewQR,
  onCancel,
  onReschedule,
}: {
  appt:         Appointment;
  tab:          'upcoming' | 'past' | 'cancelled';
  onViewQR:     (appt: Appointment) => void;
  onCancel?:    (id: string) => void;
  onReschedule?:(appt: Appointment) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-paper rounded-xl p-4 border border-sage-light hover:border-sage transition-colors"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-ink-soft">{appt.id}</span>
            <DemoBadge />
          </div>
          <p className="font-semibold text-ink">{appt.doctor}</p>
          <p className="text-sm text-ink-soft mt-0.5">
            {appt.department} · {appt.branch}
          </p>
          <p className="text-sm text-ink mt-1 font-medium">
            {appt.date} &nbsp;·&nbsp; {appt.time}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <StatusChip status={appt.status} />

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {tab === 'upcoming' && (
              <>
                <button
                  onClick={() => onViewQR(appt)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-verdigris hover:text-verdigris-deep border border-sage rounded-pill px-2.5 py-1 hover:border-verdigris transition-colors"
                >
                  <QrCode size={12} />
                  View QR
                </button>
                <button
                  onClick={() => onReschedule?.(appt)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft hover:text-ink border border-sage-light rounded-pill px-2.5 py-1 hover:border-sage transition-colors"
                >
                  <RefreshCw size={12} />
                  Reschedule
                </button>
                <button
                  onClick={() => onCancel?.(appt.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-signal hover:text-[var(--signal-deep)] border border-[var(--signal-light)] rounded-pill px-2.5 py-1 hover:border-signal transition-colors"
                >
                  <X size={12} />
                  Cancel
                </button>
              </>
            )}
            {tab === 'past' && (
              <button
                onClick={() => onViewQR(appt)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-verdigris hover:text-verdigris-deep border border-sage rounded-pill px-2.5 py-1 hover:border-verdigris transition-colors"
              >
                <FileText size={12} />
                View OPD Summary
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export function PatientAppointments() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [qrAppt, setQrAppt]     = useState<Appointment | null>(null);
  const [upcomingList, setUpcomingList] = useState<Appointment[]>(UPCOMING);
  const [cancelledList, setCancelledList] = useState<Appointment[]>([]);
  const [rescheduleAppt, setRescheduleAppt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('11:00 AM');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchLiveList = async () => {
    try {
      const records = await SupabaseService.getAppointments();
      if (records && records.length > 0) {
        const liveUpcoming: Appointment[] = [];
        const liveCancelled: Appointment[] = [];

        records.forEach((r: SupabaseAppointmentRecord) => {
          const item: Appointment = {
            id: r.appointment_id,
            doctor: r.doctor_name,
            department: r.department_name,
            date: r.appointment_date,
            time: r.appointment_time,
            branch: r.branch_name || 'Andheri West',
            status: (r.status.toLowerCase() as any) || 'confirmed',
          };
          if (r.status.toLowerCase() === 'cancelled') {
            liveCancelled.push(item);
          } else {
            liveUpcoming.push(item);
          }
        });

        // Merge with defaults
        const upMap = new Map<string, Appointment>();
        liveUpcoming.forEach(a => upMap.set(a.id, a));
        UPCOMING.forEach(a => {
          if (!upMap.has(a.id)) upMap.set(a.id, a);
        });
        setUpcomingList(Array.from(upMap.values()));
        setCancelledList(liveCancelled);
      }
    } catch {
      // Keep static list
    }
  };

  useEffect(() => {
    fetchLiveList();
    const handleCreated = () => fetchLiveList();
    window.addEventListener('relif_appointment_created', handleCreated);
    return () => window.removeEventListener('relif_appointment_created', handleCreated);
  }, []);

  const handleCancelAppointment = async (id: string) => {
    if (confirm('Are you sure you wish to cancel this appointment? (Demo cancellation)')) {
      await SupabaseService.updateAppointmentStatus(id, 'cancelled');
      setToastMsg(`Appointment ${id} has been cancelled.`);
      fetchLiveList();
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const handleSaveReschedule = async () => {
    if (!rescheduleAppt) return;
    await SupabaseService.updateAppointmentStatus(rescheduleAppt.id, 'confirmed');
    setToastMsg(`Appointment ${rescheduleAppt.id} successfully rescheduled to ${rescheduleDate} at ${rescheduleSlot}.`);
    setRescheduleAppt(null);
    fetchLiveList();
    setTimeout(() => setToastMsg(null), 5000);
  };

  const tabs: { key: 'upcoming' | 'past' | 'cancelled'; label: string; count?: number }[] = [
    { key: 'upcoming',  label: 'Upcoming',  count: upcomingList.length },
    { key: 'past',      label: 'Past',      count: PAST.length },
    { key: 'cancelled', label: 'Cancelled', count: cancelledList.length },
  ];

  const listMap = {
    upcoming:  upcomingList,
    past:      PAST,
    cancelled: cancelledList,
  };

  const list = listMap[activeTab];

  return (
    <>
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-mint border border-sage p-4 rounded-xl shadow-warm-lg text-ink text-sm flex items-center gap-2">
          <RefreshCw size={16} className="text-verdigris" />
          <span>{toastMsg}</span>
        </div>
      )}

      <QRModal
        open={!!qrAppt}
        appt={qrAppt}
        onClose={() => setQrAppt(null)}
      />

      {/* Reschedule Modal */}
      {rescheduleAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-paper max-w-md w-full rounded-2xl border border-sage p-6 shadow-warm-lg space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xl text-ink">Reschedule Appointment</h3>
              <button onClick={() => setRescheduleAppt(null)} className="text-ink-soft hover:text-ink">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-ink-soft">
              Rescheduling for <strong className="text-ink">{rescheduleAppt.doctor}</strong> ({rescheduleAppt.department})
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-ink font-semibold mb-1">New Appointment Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={rescheduleDate || new Date().toISOString().split('T')[0]}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="input text-sm"
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Preferred OPD Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'].map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setRescheduleSlot(slot)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        rescheduleSlot === slot
                          ? 'bg-saffron border-saffron text-ink font-bold'
                          : 'border-sage-light hover:border-verdigris'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="primary"
                className="flex-1 justify-center bg-saffron text-ink hover:bg-[var(--saffron-deep)]"
                onClick={handleSaveReschedule}
              >
                Confirm Reschedule
              </Button>
              <Button
                variant="secondary"
                className="flex-1 justify-center"
                onClick={() => setRescheduleAppt(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-semibold text-ink">
              Your appointments.
            </h1>
            <p className="text-ink-soft mt-1">View, reschedule, and manage your hospital visits.</p>
          </motion.div>

          <Link to={ROUTES.book}>
            <Button
              variant="primary"
              size="sm"
              className="bg-saffron text-ink hover:bg-[var(--saffron-deep)] rounded-pill"
              leftIcon={<Plus size={15} />}
            >
              Book new appointment
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-bone rounded-xl w-fit">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === t.key
                  ? 'bg-paper text-ink shadow-warm-sm'
                  : 'text-ink-soft hover:text-ink'
              )}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={cn(
                  'ml-1.5 text-xs px-1.5 py-0.5 rounded-full',
                  activeTab === t.key ? 'bg-mint text-verdigris-deep' : 'bg-sage-light text-ink-soft'
                )}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {list.length === 0 ? (
              <EmptyState
                title="No appointments"
                description={`You have no ${activeTab} appointments.`}
                icon={<Calendar size={40} className="text-sage" />}
              />
            ) : (
              list.map(appt => (
                <AppointmentRow
                  key={appt.id}
                  appt={appt}
                  tab={activeTab}
                  onViewQR={setQrAppt}
                  onCancel={handleCancelAppointment}
                  onReschedule={setRescheduleAppt}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
