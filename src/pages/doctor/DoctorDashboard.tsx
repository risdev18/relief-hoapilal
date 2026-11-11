import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Video, User, CheckCircle, XCircle, PhoneCall,
  Calendar, TrendingUp, Coffee, ChevronRight, Star,
  AlertCircle, FileText, CalendarDays
} from 'lucide-react';
import { cn } from '@/utils';
import { Badge, Button } from '@/components/ui';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ScheduleSlot {
  time: string;
  endTime?: string;
  patient?: string;
  type?: 'in-person' | 'video';
  status?: 'completed' | 'current' | 'upcoming' | 'break' | 'empty';
  id: string;
}

interface QueuePatient {
  token: string;
  name: string;
  time: string;
  status: 'waiting' | 'called' | 'in_consultation' | 'completed';
}

// ─── Demo Data ─────────────────────────────────────────────────────────────
const SCHEDULE_SLOTS: ScheduleSlot[] = [
  { id: 's1', time: '9:00 AM',  endTime: '9:15 AM',  patient: 'Patient R.K.', type: 'in-person', status: 'completed' },
  { id: 's2', time: '9:15 AM',  endTime: '9:30 AM',  patient: 'Patient M.S.', type: 'in-person', status: 'completed' },
  { id: 's3', time: '9:30 AM',  endTime: '9:45 AM',  patient: 'Patient P.T.', type: 'video',     status: 'completed' },
  { id: 's4', time: '9:45 AM',  endTime: '10:00 AM', patient: 'Patient A.J.', type: 'in-person', status: 'completed' },
  { id: 's5', time: '10:00 AM', endTime: '10:15 AM', patient: 'Patient S.N.', type: 'in-person', status: 'completed' },
  { id: 's6', time: '10:15 AM', endTime: '10:30 AM', patient: 'Patient B.L.', type: 'video',     status: 'completed' },
  { id: 's7', time: '10:30 AM', endTime: '10:45 AM', patient: 'Patient A.M.', type: 'in-person', status: 'current'   },
  { id: 's8', time: '10:45 AM', endTime: '11:00 AM', patient: 'Patient D.R.', type: 'in-person', status: 'upcoming'  },
  { id: 's9', time: '11:00 AM', endTime: '11:15 AM', patient: 'Patient K.P.', type: 'video',     status: 'upcoming'  },
  { id: 's10',time: '11:15 AM', endTime: '11:30 AM', status: 'empty' },
  { id: 's11',time: '11:30 AM', endTime: '11:45 AM', patient: 'Patient V.G.', type: 'in-person', status: 'upcoming'  },
  { id: 's12',time: '12:00 PM', endTime: '12:15 PM', patient: 'Patient N.T.', type: 'video',     status: 'upcoming'  },
  { id: 's13',time: '12:15 PM', endTime: '1:00 PM',  status: 'empty' },
  { id: 's14',time: '1:00 PM',  endTime: '2:00 PM',  status: 'break'  },
  { id: 's15',time: '2:00 PM',  endTime: '2:15 PM',  patient: 'Patient L.M.', type: 'in-person', status: 'upcoming'  },
  { id: 's16',time: '2:15 PM',  endTime: '2:30 PM',  patient: 'Patient F.A.', type: 'video',     status: 'upcoming'  },
  { id: 's17',time: '3:00 PM',  endTime: '6:00 PM',  status: 'empty'  },
];

const QUEUE_PATIENTS: QueuePatient[] = [
  { token: 'C-011', name: 'Patient R.K.', time: '9:00 AM',  status: 'completed'      },
  { token: 'C-012', name: 'Patient M.S.', time: '9:15 AM',  status: 'completed'      },
  { token: 'C-013', name: 'Patient P.T.', time: '9:30 AM',  status: 'completed'      },
  { token: 'C-014', name: 'Patient A.M.', time: '10:30 AM', status: 'in_consultation'},
  { token: 'C-015', name: 'Patient D.R.', time: '10:45 AM', status: 'called'         },
  { token: 'C-016', name: 'Patient K.P.', time: '11:00 AM', status: 'waiting'        },
  { token: 'C-017', name: 'Patient V.G.', time: '11:30 AM', status: 'waiting'        },
  { token: 'C-018', name: 'Patient N.T.', time: '12:00 PM', status: 'waiting'        },
];

const UPCOMING_APPOINTMENTS = [
  { date: 'Tomorrow, Nov 11', count: 8, firstSlot: '9:00 AM' },
  { date: 'Thu, Nov 12',      count: 6, firstSlot: '9:30 AM' },
  { date: 'Fri, Nov 13',      count: 7, firstSlot: '9:00 AM' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatusChip({ status }: { status: QueuePatient['status'] }) {
  const map = {
    waiting:         { label: 'Waiting',         cls: 'bg-mint text-verdigris-deep border border-sage' },
    called:          { label: 'Called',           cls: 'bg-[var(--saffron-light)] text-[var(--saffron-deep)] border border-[var(--clay)]' },
    in_consultation: { label: 'In Consultation',  cls: 'bg-verdigris text-white' },
    completed:       { label: 'Completed',        cls: 'bg-bone text-ink-soft border border-sage' },
  };
  const { label, cls } = map[status];
  return (
    <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-pill', cls)}>
      {label}
    </span>
  );
}

function ScheduleCard({ slot }: { slot: ScheduleSlot }) {
  if (slot.status === 'empty') {
    return (
      <div className="flex items-center gap-3 py-2">
        <span className="font-mono text-xs text-ink-soft w-20 flex-shrink-0">{slot.time}</span>
        <div className="flex-1 h-px bg-sage opacity-30" />
      </div>
    );
  }

  if (slot.status === 'break') {
    return (
      <div className="flex items-center gap-3 py-2">
        <span className="font-mono text-xs text-ink-soft w-20 flex-shrink-0">{slot.time}</span>
        <div className="flex-1 flex items-center gap-2 bg-bone rounded-lg px-3 py-2 border border-sage opacity-70">
          <Coffee size={14} className="text-ink-soft" />
          <span className="text-sm text-ink-soft font-medium">Break — 1:00 PM to 2:00 PM</span>
        </div>
      </div>
    );
  }

  const isCurrent = slot.status === 'current';
  const isCompleted = slot.status === 'completed';

  return (
    <motion.div
      layout
      className="flex items-center gap-3 py-1.5"
    >
      <span className="font-mono text-xs text-ink-soft w-20 flex-shrink-0">{slot.time}</span>
      <div className={cn(
        'flex-1 flex items-center justify-between rounded-lg px-3 py-2.5 border transition-all',
        isCurrent
          ? 'bg-[var(--saffron-light)] border-[var(--saffron)] shadow-saffron'
          : isCompleted
            ? 'bg-bone border-sage opacity-60'
            : 'bg-paper border-sage-light hover:border-sage',
      )}>
        <div className="flex items-center gap-2">
          {slot.type === 'video'
            ? <Video size={14} className={isCurrent ? 'text-[var(--saffron-deep)]' : 'text-ink-soft'} />
            : <User size={14} className={isCurrent ? 'text-[var(--saffron-deep)]' : 'text-ink-soft'} />
          }
          <span className={cn('text-sm font-medium', isCurrent ? 'text-ink' : isCompleted ? 'text-ink-soft' : 'text-ink')}>
            {slot.patient}
          </span>
          {isCurrent && (
            <span className="text-xs font-mono bg-saffron text-ink px-2 py-0.5 rounded-pill font-bold animate-pulse">
              NOW
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-soft font-mono">{slot.endTime}</span>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-pill',
            slot.type === 'video' ? 'bg-mint text-verdigris-deep' : 'bg-bone text-ink-soft border border-sage'
          )}>
            {slot.type === 'video' ? 'Video' : 'In-person'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function DoctorDashboard() {
  const [queuePatients, setQueuePatients] = useState<QueuePatient[]>(QUEUE_PATIENTS);

  const callNext = () => {
    setQueuePatients(prev => {
      const nextWaiting = prev.find(p => p.status === 'waiting');
      if (!nextWaiting) return prev;
      return prev.map(p => p.token === nextWaiting.token ? { ...p, status: 'called' as const } : p);
    });
  };

  const markComplete = (token: string) => {
    setQueuePatients(prev =>
      prev.map(p => p.token === token ? { ...p, status: 'completed' as const } : p)
    );
  };

  const markNoShow = (token: string) => {
    setQueuePatients(prev => prev.filter(p => p.token !== token));
  };

  const patientsServed = queuePatients.filter(p => p.status === 'completed').length;
  const patientsRemaining = queuePatients.filter(p => p.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-night px-6 py-4 flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-xl font-semibold text-[#E8F4EF]">
            Good evening, Dr. Sharma.
          </h1>
          <p className="text-sm text-sage mt-0.5 font-mono">Monday, 10 November 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 bg-[var(--night-soft)] px-3 py-1.5 rounded-pill border border-[var(--night-muted)]">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse-dot" />
            <span className="text-sm text-mint font-medium">On duty</span>
          </span>
        </div>
      </motion.div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6 max-w-screen-2xl mx-auto">

        {/* LEFT: Today's Schedule (flex-2) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-paper rounded-xl border border-sage-light shadow-warm"
        >
          <div className="flex items-center justify-between p-5 border-b border-sage-light">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-verdigris" />
              <h2 className="font-display text-lg font-semibold text-ink">Today's Schedule</h2>
            </div>
            <span className="font-mono text-xs text-ink-soft bg-bone px-2.5 py-1 rounded-pill">9AM–6PM</span>
          </div>
          <div className="p-4 space-y-0.5 max-h-[600px] overflow-y-auto">
            {SCHEDULE_SLOTS.map(slot => (
              <ScheduleCard key={slot.id} slot={slot} />
            ))}
          </div>
        </motion.div>

        {/* MIDDLE: Patient Queue (flex-2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-paper rounded-xl border border-sage-light shadow-warm"
        >
          <div className="flex items-center justify-between p-5 border-b border-sage-light">
            <div className="flex items-center gap-2">
              <User size={18} className="text-verdigris" />
              <h2 className="font-display text-lg font-semibold text-ink">Patient Queue</h2>
            </div>
            <span className="font-mono text-xs text-ink-soft bg-bone px-2.5 py-1 rounded-pill">
              {patientsRemaining} remaining
            </span>
          </div>

          <div className="p-4 space-y-2 max-h-[480px] overflow-y-auto">
            <AnimatePresence>
              {queuePatients.map((patient, idx) => (
                <motion.div
                  key={patient.token}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-lg border',
                    patient.status === 'in_consultation' ? 'bg-mint border-verdigris' :
                    patient.status === 'called' ? 'bg-[var(--saffron-light)] border-[var(--clay)]' :
                    patient.status === 'completed' ? 'bg-bone border-sage opacity-60' :
                    'bg-paper border-sage-light hover:border-sage'
                  )}
                >
                  <div className="flex-shrink-0 text-center w-14">
                    <span className="font-mono text-xl font-bold text-ink leading-none block">{patient.token}</span>
                    <span className="font-mono text-xs text-ink-soft">{patient.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{patient.name}</p>
                    <StatusChip status={patient.status} />
                  </div>
                  {patient.status !== 'completed' && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {patient.status === 'in_consultation' && (
                        <button
                          onClick={() => markComplete(patient.token)}
                          className="p-1.5 rounded-pill bg-verdigris text-white hover:bg-verdigris-deep transition-colors"
                          title="Mark Complete"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {patient.status === 'called' && (
                        <button
                          onClick={() => markComplete(patient.token)}
                          className="p-1.5 rounded-pill bg-verdigris text-white hover:bg-verdigris-deep transition-colors"
                          title="Mark Complete"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => markNoShow(patient.token)}
                        className="p-1.5 rounded-pill border border-signal text-signal hover:bg-signal hover:text-white transition-colors"
                        title="No Show"
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-sage-light flex gap-2">
            <Button variant="primary" size="sm" className="flex-1" leftIcon={<PhoneCall size={14} />} onClick={callNext}>
              Call Next
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<CheckCircle size={14} />}
              onClick={() => {
                const current = queuePatients.find(p => p.status === 'in_consultation' || p.status === 'called');
                if (current) markComplete(current.token);
              }}
            >
              Mark Complete
            </Button>
          </div>
        </motion.div>

        {/* RIGHT: Stats + Leave + Upcoming (flex-1) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1 space-y-4"
        >
          {/* My Stats Today */}
          <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-verdigris" />
                <h3 className="font-display text-sm font-semibold text-ink">My Stats Today</h3>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Patients seen',       value: patientsServed.toString(), unit: '' },
                { label: 'Remaining',           value: patientsRemaining.toString(), unit: '' },
                { label: 'Avg consultation',    value: '14',   unit: 'min' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between py-2 border-b border-sage-light last:border-0">
                  <span className="text-sm text-ink-soft">{stat.label}</span>
                  <span className="font-display font-bold text-lg text-ink">
                    {stat.value}
                    {stat.unit && <span className="text-xs text-ink-soft ml-1 font-sans">{stat.unit}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Leave Requests */}
          <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-verdigris" />
                <h3 className="font-display text-sm font-semibold text-ink">Leave Requests</h3>
              </div>
            </div>
            <div className="bg-[var(--saffron-light)] border border-[var(--clay)] rounded-lg p-3 mb-3">
              <div className="flex items-start gap-2">
                <AlertCircle size={14} className="text-[var(--saffron-deep)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-ink">Nov 20–21, 2026</p>
                  <p className="text-xs text-ink-soft">Personal — 2 days</p>
                  <span className="text-xs bg-[var(--saffron-light)] text-[var(--saffron-deep)] border border-[var(--clay)] px-2 py-0.5 rounded-pill font-medium">
                    Pending
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full border border-sage-light">
              Request Leave
            </Button>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={16} className="text-verdigris" />
              <h3 className="font-display text-sm font-semibold text-ink">Upcoming</h3>
            </div>
            <div className="space-y-2">
              {UPCOMING_APPOINTMENTS.map(appt => (
                <div key={appt.date} className="flex items-center justify-between py-2 border-b border-sage-light last:border-0">
                  <div>
                    <p className="text-xs font-semibold text-ink">{appt.date}</p>
                    <p className="text-xs text-ink-soft font-mono">From {appt.firstSlot}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm font-bold text-ink">{appt.count}</span>
                    <span className="text-xs text-ink-soft">pts</span>
                    <ChevronRight size={12} className="text-ink-soft" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
