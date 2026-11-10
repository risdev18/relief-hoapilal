// PatientDashboard.tsx — Relif Hospital Patient Portal Dashboard

import React, { useState } from 'react';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, DemoBadge, StatCard, QRCard } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';
import { cn, formatDate } from '@/utils';
import { ROUTES } from '@/config/constants';

// ── Demo data ────────────────────────────────────────────────────────────────
const DEMO_NEXT_APPOINTMENT = {
  id:         'REL-2026-000147',
  doctor:     'Dr. Priya Sharma',
  department: 'Cardiology',
  date:       'Thursday, 14 Nov 2026',
  time:       '10:30 AM',
  branch:     'Andheri West',
  status:     'confirmed' as const,
};

const DEMO_TIMELINE = [
  {
    id: 1,
    icon: <FlaskConical size={16} />,
    title: 'Lab report ready — CBC',
    sub:   'Complete Blood Count results are available',
    time:  '2h ago',
    hasDownload: true,
  },
  {
    id: 2,
    icon: <CheckCircle2 size={16} />,
    title: 'Appointment confirmed — Dr. Sharma, Cardiology',
    sub:   'Nov 14, 10:30 AM · Andheri West',
    time:  '1d ago',
    hasDownload: false,
  },
  {
    id: 3,
    icon: <Receipt size={16} />,
    title: 'Payment received — ₹500',
    sub:   'OPD consultation fee · Invoice #INV-2026-003',
    time:  '2d ago',
    hasDownload: false,
  },
  {
    id: 4,
    icon: <Pill size={16} />,
    title: 'Prescription uploaded — Dr. Kulkarni',
    sub:   'Cardiac medication protocol',
    time:  '5d ago',
    hasDownload: true,
  },
  {
    id: 5,
    icon: <Calendar size={16} />,
    title: 'Appointment booked — Dermatology',
    sub:   'Nov 20 · 11:00 AM',
    time:  '1w ago',
    hasDownload: false,
  },
];

const DEMO_NOTIFICATIONS = [
  {
    id:   1,
    type: 'lab',
    icon: <FlaskConical size={16} className="text-verdigris" />,
    title: 'Lab report ready',
    body:  'Your CBC report is now available for download.',
    time:  '2h ago',
  },
  {
    id:   2,
    type: 'appointment',
    icon: <Calendar size={16} className="text-verdigris" />,
    title: 'Appointment reminder',
    body:  'Dr. Sharma tomorrow at 10:30 AM — Cardiology, Andheri West.',
    time:  '10h ago',
  },
  {
    id:   3,
    type: 'billing',
    icon: <Receipt size={16} className="text-[var(--saffron-deep)]" />,
    title: 'Bill pending',
    body:  'Invoice #INV-2026-005 for ₹2,400 is awaiting payment.',
    time:  '1d ago',
  },
];

// ── QR Modal ─────────────────────────────────────────────────────────────────
function QRModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
              appointmentId={DEMO_NEXT_APPOINTMENT.id}
              patientName="Rahul Mehta"
              date={DEMO_NEXT_APPOINTMENT.date}
              time={DEMO_NEXT_APPOINTMENT.time}
              doctor={DEMO_NEXT_APPOINTMENT.doctor}
              department={DEMO_NEXT_APPOINTMENT.department}
              qrValue={DEMO_NEXT_APPOINTMENT.id}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export function PatientDashboard() {
  const [qrOpen, setQrOpen] = useState(false);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  });

  return (
    <>
      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── Greeting ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-display text-4xl font-semibold text-ink">
            {greeting}, Rahul.
          </h1>
          <p className="text-ink-soft mt-1">{today}</p>
          <RelifLine variant="section" className="mt-3 max-w-xs opacity-50" />
        </motion.div>

        {/* ── Main grid: content + notifications ── */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* ── Left column ── */}
          <div className="space-y-6">
            {/* Hero: Next appointment card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="card p-6 bg-paper border border-sage-light relative overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-mint rounded-full -translate-y-16 translate-x-16 opacity-40" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-mono font-medium text-ink-soft uppercase tracking-widest">
                    Next up
                  </span>
                  <DemoBadge />
                </div>

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-ink-soft mb-1">
                      {DEMO_NEXT_APPOINTMENT.id}
                    </p>
                    <h2 className="font-display text-2xl font-semibold text-ink">
                      {DEMO_NEXT_APPOINTMENT.doctor}
                    </h2>
                    <p className="text-ink-soft mt-1">
                      {DEMO_NEXT_APPOINTMENT.department} · {DEMO_NEXT_APPOINTMENT.branch}
                    </p>
                    <p className="text-ink font-medium mt-1">
                      {DEMO_NEXT_APPOINTMENT.date} &nbsp;·&nbsp; {DEMO_NEXT_APPOINTMENT.time}
                    </p>
                  </div>

                  <Badge variant="default" className="mt-1">
                    <span className="w-2 h-2 rounded-full bg-verdigris inline-block" />
                    Confirmed
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-3 mt-5">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-saffron text-ink hover:bg-[var(--saffron-deep)] rounded-pill gap-2"
                    onClick={() => setQrOpen(true)}
                    leftIcon={<QrCode size={15} />}
                  >
                    View QR
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-pill border border-sage-light text-ink-soft hover:text-ink hover:border-sage"
                  >
                    Reschedule
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <StatCard label="Total appointments" value={12} isDemo />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <StatCard label="Reports ready" value={3} isDemo />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <StatCard label="Pending bills" value="₹2,400" isDemo />
              </motion.div>
            </div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h2 className="font-display text-xl font-semibold text-ink mb-5">
                Recent activity
              </h2>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-mint" />

                <ul className="space-y-5">
                  {DEMO_TIMELINE.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.08 }}
                      className="flex gap-4 pl-10 relative"
                    >
                      {/* Dot */}
                      <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-mint border-2 border-verdigris flex items-center justify-center text-verdigris flex-shrink-0">
                        {item.icon}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-ink leading-snug">{item.title}</p>
                        <p className="text-xs text-ink-soft mt-0.5">{item.sub}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs text-ink-soft">{item.time}</span>
                        {item.hasDownload && (
                          <button className="text-xs text-verdigris hover:text-verdigris-deep underline flex items-center gap-1">
                            <Download size={11} /> Download (Demo)
                          </button>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="card p-5"
            >
              <h2 className="font-display text-lg font-semibold text-ink mb-4">
                Quick actions
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link to={ROUTES.book}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-saffron text-ink hover:bg-[var(--saffron-deep)] rounded-pill"
                    rightIcon={<ArrowRight size={15} />}
                  >
                    Book Appointment
                  </Button>
                </Link>
                {[
                  { label: 'View Records',      to: ROUTES.patientRecords },
                  { label: 'Pay Bill',          to: ROUTES.patientBilling },
                  { label: 'Download Report',   to: ROUTES.patientRecords },
                ].map(a => (
                  <Link key={a.label} to={a.to}>
                    <button className="inline-flex items-center gap-1.5 text-sm font-medium text-verdigris hover:text-verdigris-deep underline underline-offset-2">
                      {a.label} <ArrowRight size={13} />
                    </button>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Notifications panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-1">
                <Bell size={16} className="text-verdigris" />
                <h2 className="font-display text-lg font-semibold text-ink">
                  Notifications
                </h2>
                <DemoBadge className="ml-auto" />
              </div>

              {/* Simulated banner */}
              <p className="text-xs text-ink-soft mb-4 p-2 rounded bg-bone border border-sage-light">
                Notification outbox (Simulated) — Demo mode: no real messages are sent.
              </p>

              <ul className="space-y-3">
                {DEMO_NOTIFICATIONS.map(n => (
                  <li key={n.id} className="flex gap-3 p-3 rounded-lg bg-bone hover:bg-mint/40 transition-colors">
                    <span className="mt-0.5 w-7 h-7 rounded-full bg-mint flex items-center justify-center flex-shrink-0">
                      {n.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink leading-snug">{n.title}</p>
                      <p className="text-xs text-ink-soft mt-0.5">{n.body}</p>
                      <p className="text-xs text-ink-soft opacity-60 mt-1">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
