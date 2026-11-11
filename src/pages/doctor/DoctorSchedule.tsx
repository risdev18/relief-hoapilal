import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Plus, Edit2, Trash2,
  Video, User, Clock, Calendar, AlertCircle, X, Check
} from 'lucide-react';
import { cn } from '@/utils';
import { Badge, Button, Input } from '@/components/ui';

// ─── Types ───────────────────────────────────────────────────────────────────
interface DaySlot {
  time: string;
  patient?: string;
  type: 'booked' | 'available' | 'blocked';
  appointmentType?: 'in-person' | 'video';
}

interface DayData {
  name: string;
  date: string;
  dateNum: number;
  isToday: boolean;
  slots: DaySlot[];
}

interface RecurringSchedule {
  id: string;
  days: string;
  startTime: string;
  endTime: string;
  type: 'in-person' | 'video';
  branch: string;
  active: boolean;
}

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

// ─── Demo Data ─────────────────────────────────────────────────────────────
const WEEK_DAYS: DayData[] = [
  {
    name: 'Mon', date: 'Nov 10', dateNum: 10, isToday: true,
    slots: [
      { time: '9:00',  patient: 'Patient R.K.', type: 'booked',    appointmentType: 'in-person' },
      { time: '9:15',  patient: 'Patient M.S.', type: 'booked',    appointmentType: 'in-person' },
      { time: '9:30',  patient: 'Patient P.T.', type: 'booked',    appointmentType: 'video'     },
      { time: '9:45',  type: 'available' },
      { time: '10:00', patient: 'Patient S.N.', type: 'booked',    appointmentType: 'in-person' },
      { time: '11:00', type: 'blocked' },
      { time: '11:15', patient: 'Patient A.M.', type: 'booked',    appointmentType: 'in-person' },
    ],
  },
  {
    name: 'Tue', date: 'Nov 11', dateNum: 11, isToday: false,
    slots: [
      { time: '9:00',  patient: 'Patient T.V.', type: 'booked',    appointmentType: 'in-person' },
      { time: '9:30',  type: 'available' },
      { time: '10:00', type: 'available' },
      { time: '10:30', patient: 'Patient L.K.', type: 'booked',    appointmentType: 'video'     },
      { time: '11:00', type: 'blocked' },
    ],
  },
  {
    name: 'Wed', date: 'Nov 12', dateNum: 12, isToday: false,
    slots: [
      { time: '9:00',  patient: 'Patient P.R.', type: 'booked',    appointmentType: 'in-person' },
      { time: '9:15',  patient: 'Patient S.D.', type: 'booked',    appointmentType: 'in-person' },
      { time: '9:45',  type: 'available' },
      { time: '10:00', patient: 'Patient N.A.', type: 'booked',    appointmentType: 'video'     },
      { time: '3:00',  patient: 'Patient F.L.', type: 'booked',    appointmentType: 'video'     },
      { time: '3:15',  type: 'available' },
    ],
  },
  {
    name: 'Thu', date: 'Nov 13', dateNum: 13, isToday: false,
    slots: [
      { time: '9:00',  patient: 'Patient G.R.', type: 'booked',    appointmentType: 'in-person' },
      { time: '9:30',  type: 'available' },
      { time: '10:00', type: 'available' },
      { time: '11:00', type: 'blocked' },
    ],
  },
  {
    name: 'Fri', date: 'Nov 14', dateNum: 14, isToday: false,
    slots: [
      { time: '9:00',  patient: 'Patient W.P.', type: 'booked',    appointmentType: 'in-person' },
      { time: '9:15',  type: 'available' },
      { time: '3:00',  patient: 'Patient Q.B.', type: 'booked',    appointmentType: 'video'     },
      { time: '3:30',  type: 'available' },
    ],
  },
  {
    name: 'Sat', date: 'Nov 15', dateNum: 15, isToday: false,
    slots: [
      { time: '10:00', type: 'blocked' },
    ],
  },
  {
    name: 'Sun', date: 'Nov 16', dateNum: 16, isToday: false,
    slots: [],
  },
];

const RECURRING_SCHEDULES: RecurringSchedule[] = [
  { id: 'rs1', days: 'Mon–Fri',       startTime: '9:00 AM', endTime: '1:00 PM', type: 'in-person', branch: 'Andheri Branch', active: true  },
  { id: 'rs2', days: 'Mon/Wed/Fri',   startTime: '3:00 PM', endTime: '6:00 PM', type: 'video',     branch: 'Online',         active: true  },
];

const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'lr1', startDate: 'Nov 20, 2026', endDate: 'Nov 21, 2026', reason: 'Personal', status: 'pending'  },
  { id: 'lr2', startDate: 'Dec 25, 2026', endDate: 'Dec 26, 2026', reason: 'Holiday',  status: 'approved' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function SlotChip({ slot }: { slot: DaySlot }) {
  const [tooltip, setTooltip] = useState(false);

  if (slot.type === 'blocked') {
    return (
      <div className="text-xs px-2 py-1 rounded bg-bone border border-sage text-ink-soft line-through font-mono">
        {slot.time} Block
      </div>
    );
  }

  if (slot.type === 'available') {
    return (
      <div className="text-xs px-2 py-1 rounded border border-dashed border-mint text-verdigris font-mono bg-[var(--mint-light)] hover:bg-mint cursor-pointer transition-colors">
        {slot.time} Free
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className="text-xs px-2 py-1 rounded bg-verdigris text-white font-mono flex items-center gap-1 hover:bg-verdigris-deep transition-colors w-full text-left"
        onClick={() => setTooltip(!tooltip)}
      >
        {slot.appointmentType === 'video' ? <Video size={10} /> : <User size={10} />}
        {slot.time} · {slot.patient?.split(' ')[1]}
      </button>
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute z-50 bottom-full left-0 mb-1 w-44 bg-night text-[#E8F4EF] rounded-lg p-3 shadow-warm-lg border border-[var(--night-muted)]"
          >
            <p className="text-xs font-semibold">{slot.patient}</p>
            <p className="text-xs text-sage font-mono">{slot.time}</p>
            <p className="text-xs text-sage capitalize">{slot.appointmentType?.replace('-', ' ')}</p>
            <button onClick={() => setTooltip(false)} className="absolute top-1 right-1 text-sage hover:text-white">
              <X size={10} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LeaveStatusChip({ status }: { status: LeaveRequest['status'] }) {
  const map = {
    pending:  'bg-[var(--saffron-light)] text-[var(--saffron-deep)] border border-[var(--clay)]',
    approved: 'bg-mint text-verdigris-deep border border-sage',
    rejected: 'bg-[var(--signal-light)] text-[var(--signal-deep)] border border-[var(--signal-light)]',
  };
  return (
    <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-pill capitalize', map[status])}>
      {status}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function DoctorSchedule() {
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  return (
    <div className="min-h-screen bg-paper p-6">
      <div className="max-w-screen-xl mx-auto space-y-6">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">My Schedule</h1>
            <p className="text-ink-soft mt-1">Manage your appointments and availability</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}>
              Add Availability
            </Button>
          </div>
        </motion.div>

        {/* Week navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-paper rounded-xl border border-sage-light shadow-warm overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-sage-light">
            <button
              onClick={() => setWeekOffset(w => w - 1)}
              className="p-2 rounded-pill hover:bg-bone transition-colors"
            >
              <ChevronLeft size={18} className="text-ink" />
            </button>
            <div className="flex items-center gap-4">
              <span className="font-display text-lg font-semibold text-ink">Nov 10–16, 2026</span>
              <button
                onClick={() => setWeekOffset(0)}
                className="text-xs text-verdigris border border-verdigris px-3 py-1 rounded-pill hover:bg-mint transition-colors font-medium"
              >
                Today
              </button>
            </div>
            <button
              onClick={() => setWeekOffset(w => w + 1)}
              className="p-2 rounded-pill hover:bg-bone transition-colors"
            >
              <ChevronRight size={18} className="text-ink" />
            </button>
          </div>

          {/* 7-day grid */}
          <div className="grid grid-cols-7 divide-x divide-sage-light">
            {WEEK_DAYS.map((day, i) => (
              <motion.div
                key={day.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className={cn('p-3 min-h-[200px]', day.isToday ? 'bg-[var(--mint-light)]' : 'bg-paper')}
              >
                <div className="text-center mb-3">
                  <p className="text-xs text-ink-soft font-medium">{day.name}</p>
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center mx-auto mt-1 text-sm font-bold',
                    day.isToday ? 'bg-verdigris text-white' : 'text-ink'
                  )}>
                    {day.dateNum}
                  </div>
                </div>
                <div className="space-y-1">
                  {day.slots.length === 0 ? (
                    <p className="text-xs text-ink-soft text-center italic">Off day</p>
                  ) : (
                    day.slots.map((slot, si) => (
                      <SlotChip key={si} slot={slot} />
                    ))
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 p-3 border-t border-sage-light bg-bone">
            <span className="text-xs text-ink-soft font-medium">Legend:</span>
            {[
              { color: 'bg-verdigris', label: 'Booked' },
              { color: 'border border-dashed border-mint bg-[var(--mint-light)]', label: 'Available' },
              { color: 'bg-bone border border-sage', label: 'Blocked' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={cn('w-3 h-3 rounded', l.color)} />
                <span className="text-xs text-ink-soft">{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Manage Availability */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-paper rounded-xl border border-sage-light shadow-warm"
        >
          <div className="flex items-center justify-between p-5 border-b border-sage-light">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-verdigris" />
              <h2 className="font-display text-lg font-semibold text-ink">Manage Availability</h2>
            </div>
            <Button variant="ghost" size="sm" leftIcon={<Plus size={14} />}>
              Add Schedule
            </Button>
          </div>
          <div className="p-4 space-y-3">
            {RECURRING_SCHEDULES.map(schedule => (
              <div
                key={schedule.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-sage-light bg-bone"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-ink text-sm">{schedule.days}</span>
                    <span className="font-mono text-xs text-ink-soft">
                      {schedule.startTime} – {schedule.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-pill font-medium flex items-center gap-1',
                      schedule.type === 'video'
                        ? 'bg-mint text-verdigris-deep'
                        : 'bg-bone border border-sage text-ink-soft'
                    )}>
                      {schedule.type === 'video' ? <Video size={10} /> : <User size={10} />}
                      {schedule.type === 'video' ? 'Video' : 'In-person'}
                    </span>
                    <span className="text-xs text-ink-soft">{schedule.branch}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {schedule.active && (
                    <span className="text-xs bg-mint text-verdigris-deep px-2 py-0.5 rounded-pill font-medium">Active</span>
                  )}
                  <button className="p-1.5 hover:bg-bone rounded-pill transition-colors" title="Edit">
                    <Edit2 size={14} className="text-ink-soft" />
                  </button>
                  <button className="p-1.5 hover:bg-[var(--signal-light)] rounded-pill transition-colors" title="Deactivate">
                    <Trash2 size={14} className="text-signal" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leave Requests */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-paper rounded-xl border border-sage-light shadow-warm"
        >
          <div className="flex items-center justify-between p-5 border-b border-sage-light">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-verdigris" />
              <h2 className="font-display text-lg font-semibold text-ink">Leave Requests</h2>
            </div>
            <Button variant="ghost" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowLeaveForm(v => !v)}>
              Request new leave
            </Button>
          </div>

          <AnimatePresence>
            {showLeaveForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-sage-light"
              >
                <div className="p-5 bg-bone grid grid-cols-2 gap-4">
                  <Input label="From date" type="date" />
                  <Input label="To date" type="date" />
                  <div className="col-span-2">
                    <Input label="Reason" placeholder="Brief reason for leave" />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <Button variant="primary" size="sm">Submit Request</Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowLeaveForm(false)}>Cancel</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-sage-light">
                    {['Date Range', 'Reason', 'Status'].map(h => (
                      <th key={h} className="pb-2 text-xs font-semibold text-ink-soft uppercase tracking-wider pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEAVE_REQUESTS.map(req => (
                    <tr key={req.id} className="border-b border-sage-light last:border-0">
                      <td className="py-3 pr-4">
                        <span className="font-mono text-sm text-ink">{req.startDate} – {req.endDate}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm text-ink">{req.reason}</span>
                      </td>
                      <td className="py-3">
                        <LeaveStatusChip status={req.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
