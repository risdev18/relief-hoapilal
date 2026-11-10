import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, UserPlus, ChevronDown, CheckCircle, XCircle,
  PhoneCall, Bell, Keyboard, Users, Clock, TrendingUp
} from 'lucide-react';
import { cn } from '@/utils';
import { DemoBadge, Button, Input } from '@/components/ui';
import { DEPARTMENTS } from '@/config/constants';

// ─── Types ───────────────────────────────────────────────────────────────────
type QueueStatus = 'waiting' | 'called' | 'in_consultation' | 'done';

interface QueueToken {
  token: string;
  patientName: string;
  status: QueueStatus;
  time: string;
}

interface SearchResult {
  uhid: string;
  name: string;
  phone: string;
  appointmentId: string;
  doctor: string;
  time: string;
}

interface WalkInForm {
  name: string;
  phone: string;
  department: string;
  doctor: string;
  type: 'in-person' | 'video';
}

// ─── Demo Data ─────────────────────────────────────────────────────────────
const INITIAL_QUEUE: QueueToken[] = [
  { token: 'C-010', patientName: 'Patient S.R.',  status: 'done',            time: '10:00 AM' },
  { token: 'C-011', patientName: 'Patient M.K.',  status: 'done',            time: '10:15 AM' },
  { token: 'C-012', patientName: 'Patient T.P.',  status: 'done',            time: '10:30 AM' },
  { token: 'C-013', patientName: 'Patient A.L.',  status: 'done',            time: '10:45 AM' },
  { token: 'C-014', patientName: 'Patient R.V.',  status: 'in_consultation', time: '11:00 AM' },
  { token: 'C-015', patientName: 'Patient B.G.',  status: 'called',          time: '11:15 AM' },
  { token: 'C-016', patientName: 'Patient N.J.',  status: 'waiting',         time: '11:30 AM' },
  { token: 'C-017', patientName: 'Patient F.D.',  status: 'waiting',         time: '11:45 AM' },
  { token: 'C-018', patientName: 'Patient Y.W.',  status: 'waiting',         time: '12:00 PM' },
  { token: 'C-019', patientName: 'Patient Z.A.',  status: 'waiting',         time: '12:15 PM' },
];

const DEMO_SEARCH_RESULTS: SearchResult[] = [
  { uhid: 'RH2612345', name: 'Rahul Verma',    phone: '+91 98765 43210', appointmentId: 'REL-2026-000234', doctor: 'Dr. Sharma',  time: '11:30 AM' },
  { uhid: 'RH2698765', name: 'Priya Mehta',    phone: '+91 87654 32109', appointmentId: 'REL-2026-000235', doctor: 'Dr. Sharma',  time: '11:45 AM' },
];

// ─── Status helpers ───────────────────────────────────────────────────────────
function statusChip(status: QueueStatus) {
  const map: Record<QueueStatus, { label: string; cls: string }> = {
    waiting:         { label: 'Waiting',         cls: 'bg-mint text-verdigris-deep' },
    called:          { label: 'Called',           cls: 'bg-[var(--saffron-light)] text-[var(--saffron-deep)]' },
    in_consultation: { label: 'In Consultation',  cls: 'bg-verdigris text-white' },
    done:            { label: 'Done',             cls: 'bg-bone text-ink-soft border border-sage' },
  };
  const { label, cls } = map[status];
  return <span className={cn('text-xs font-medium px-2 py-0.5 rounded-pill', cls)}>{label}</span>;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function ReceptionDashboard() {
  const [queue, setQueue] = useState<QueueToken[]>(INITIAL_QUEUE);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showWalkInForm, setShowWalkInForm] = useState(false);
  const [selectedDept, setSelectedDept] = useState('Cardiology · Dr. Sharma');
  const [walkIn, setWalkIn] = useState<WalkInForm>({ name: '', phone: '', department: '', doctor: '', type: 'in-person' });
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F1') { e.preventDefault(); callNext(); }
    if (e.key === 'F2') { e.preventDefault(); markServed(); }
    if (e.key === 'F3') { e.preventDefault(); markNoShow(); }
    if (e.key === '/') {
      e.preventDefault();
      (document.getElementById('checkin-search') as HTMLInputElement)?.focus();
    }
  }, [queue]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const callNext = () => {
    setQueue(prev => {
      const idx = prev.findIndex(t => t.status === 'waiting');
      if (idx < 0) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], status: 'called' };
      showToast(`Called ${next[idx].token} — ${next[idx].patientName}`);
      return next;
    });
  };

  const markServed = () => {
    setQueue(prev => {
      const idx = prev.findIndex(t => t.status === 'in_consultation' || t.status === 'called');
      if (idx < 0) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], status: 'done' };
      showToast(`Marked ${next[idx].token} as served`);
      return next;
    });
  };

  const markNoShow = () => {
    setQueue(prev => {
      const idx = prev.findIndex(t => t.status === 'called');
      if (idx < 0) return prev;
      const next = prev.filter((_, i) => i !== idx);
      showToast('Marked as No Show');
      return next;
    });
  };

  const generateToken = () => {
    const nextNum = queue.length + 1;
    const token = `C-0${nextNum}`;
    setGeneratedToken(token);
    setQueue(prev => [...prev, {
      token,
      patientName: `Patient ${walkIn.name.split(' ')[0] || 'Walk-in'}`,
      status: 'waiting',
      time: 'Now',
    }]);
    showToast(`Token ${token} generated!`);
  };

  const serving = queue.find(t => t.status === 'in_consultation');
  const calledTokens = queue.filter(t => t.status === 'called');
  const waitingTokens = queue.filter(t => t.status === 'waiting');
  const doneTokens = queue.filter(t => t.status === 'done');

  const totalToday = 23;
  const servedCount = doneTokens.length + 14;
  const waitingCount = waitingTokens.length;
  const noShowCount = 3;

  return (
    <div className="min-h-screen bg-paper">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-toast bg-verdigris text-white px-4 py-3 rounded-xl shadow-warm-lg font-medium text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Queue Board */}
      <div className="bg-night p-6 border-b border-[var(--night-muted)]">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl font-semibold text-[#E8F4EF]">
                  Live Queue
                </h1>
                <span className="text-sage">·</span>
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="bg-[var(--night-soft)] text-[#E8F4EF] border border-[var(--night-muted)] rounded-pill px-3 py-1.5 text-sm font-medium focus:outline-none"
                >
                  <option>Cardiology · Dr. Sharma</option>
                  <option>Neurology · Dr. Kapoor</option>
                  <option>Orthopedics · Dr. Patel</option>
                </select>
              </div>
              <p className="text-sage text-sm font-mono mt-1">Monday, 10 Nov 2026 · 10:30 AM</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 bg-[var(--night-soft)] px-3 py-1.5 rounded-pill border border-[var(--night-muted)]">
                <span className="w-2 h-2 rounded-full bg-mint animate-pulse-dot" />
                <span className="text-sm text-mint font-medium">Live</span>
              </span>
              <DemoBadge />
            </div>
          </div>

          {/* Token Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Currently serving */}
            {serving && (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="col-span-1 bg-[var(--night-soft)] border-2 border-verdigris rounded-xl p-5 flex flex-col items-center justify-center"
              >
                <p className="text-xs text-sage font-mono uppercase tracking-widest mb-1">Now Serving</p>
                <motion.p
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="font-mono text-5xl font-bold text-white leading-none"
                >
                  {serving.token}
                </motion.p>
                <p className="text-xs text-sage mt-2">{serving.patientName}</p>
                {statusChip(serving.status)}
              </motion.div>
            )}

            {/* Called (next up) */}
            {calledTokens.map((t, i) => (
              <div key={t.token} className="bg-[var(--night-soft)] border border-[var(--saffron-deep)] rounded-xl p-4 flex flex-col items-center justify-center">
                <p className="text-xs text-sage font-mono uppercase tracking-widest mb-1">Next Up</p>
                <p className="font-mono text-3xl font-bold text-[var(--saffron)] leading-none">{t.token}</p>
                <p className="text-xs text-sage mt-1">{t.patientName}</p>
                {statusChip(t.status)}
              </div>
            ))}

            {/* Waiting tokens */}
            {waitingTokens.slice(0, 4).map((t, i) => (
              <div key={t.token} className="bg-[var(--night-soft)] border border-[var(--night-muted)] rounded-xl p-3 flex flex-col items-center justify-center">
                <p className="text-xs text-[var(--night-muted)] font-mono uppercase tracking-widest mb-1">Waiting</p>
                <p className="font-mono text-2xl font-bold text-[#E8F4EF] leading-none">{t.token}</p>
                <p className="text-xs text-sage mt-1">{t.time}</p>
                {statusChip(t.status)}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Bell size={16} />}
              onClick={callNext}
              className="flex-1 md:flex-none"
            >
              Call Next Token <span className="ml-2 opacity-60 text-xs font-mono">F1</span>
            </Button>
            <button
              onClick={markServed}
              className="flex-1 md:flex-none flex items-center gap-2 px-5 py-3 rounded-pill border-2 border-verdigris text-verdigris hover:bg-verdigris hover:text-white transition-all font-medium"
            >
              <CheckCircle size={16} />
              Mark Served
              <span className="ml-1 opacity-60 text-xs font-mono">F2</span>
            </button>
            <button
              onClick={markNoShow}
              className="flex-1 md:flex-none flex items-center gap-2 px-5 py-3 rounded-pill border-2 border-signal text-signal hover:bg-signal hover:text-white transition-all font-medium"
            >
              <XCircle size={16} />
              No Show
              <span className="ml-1 opacity-60 text-xs font-mono">F3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Management tools */}
      <div className="max-w-screen-xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Check In Patient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-paper rounded-xl border border-sage-light shadow-warm"
        >
          <div className="flex items-center gap-2 p-5 border-b border-sage-light">
            <Search size={18} className="text-verdigris" />
            <h2 className="font-display text-lg font-semibold text-ink">Check In Patient</h2>
          </div>
          <div className="p-5">
            <Input
              id="checkin-search"
              placeholder="Search by name, UHID, or Appointment ID"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              leftElement={<Search size={16} />}
              rightElement={<span className="text-xs text-ink-soft font-mono bg-bone px-1.5 py-0.5 rounded">/</span>}
            />

            <AnimatePresence>
              {showSearchResults && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="mt-3 space-y-2"
                >
                  {DEMO_SEARCH_RESULTS.map(result => (
                    <div
                      key={result.uhid}
                      className="flex items-center justify-between p-3 rounded-lg border border-sage-light bg-bone hover:border-verdigris transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-sm text-ink">{result.name}</span>
                          <span className="font-mono text-xs text-ink-soft">{result.uhid}</span>
                          <DemoBadge />
                        </div>
                        <p className="text-xs text-ink-soft">{result.phone} · {result.doctor} · {result.time}</p>
                        <p className="font-mono text-xs text-verdigris">{result.appointmentId}</p>
                      </div>
                      <Button
                        variant="verdigris"
                        size="sm"
                        onClick={() => {
                          showToast(`${result.name} checked in!`);
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                      >
                        Check In
                      </Button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Register Walk-in */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-paper rounded-xl border border-sage-light shadow-warm"
        >
          <div className="flex items-center justify-between p-5 border-b border-sage-light">
            <div className="flex items-center gap-2">
              <UserPlus size={18} className="text-verdigris" />
              <h2 className="font-display text-lg font-semibold text-ink">Register Walk-in</h2>
            </div>
            <button
              onClick={() => setShowWalkInForm(v => !v)}
              className="flex items-center gap-1 text-sm text-verdigris font-medium"
            >
              {showWalkInForm ? 'Hide' : 'Open form'}
              <ChevronDown size={14} className={cn('transition-transform', showWalkInForm && 'rotate-180')} />
            </button>
          </div>

          <AnimatePresence>
            {showWalkInForm ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Patient Name" required
                      value={walkIn.name}
                      onChange={e => setWalkIn(w => ({ ...w, name: e.target.value }))}
                      placeholder="Full name"
                    />
                    <Input
                      label="Phone" required
                      value={walkIn.phone}
                      onChange={e => setWalkIn(w => ({ ...w, phone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">Department</label>
                      <select
                        className="input w-full"
                        value={walkIn.department}
                        onChange={e => setWalkIn(w => ({ ...w, department: e.target.value }))}
                      >
                        <option value="">Select department</option>
                        {DEPARTMENTS.slice(0, 10).map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">Doctor</label>
                      <select className="input w-full" value={walkIn.doctor} onChange={e => setWalkIn(w => ({ ...w, doctor: e.target.value }))}>
                        <option value="">Select doctor</option>
                        <option value="sharma">Dr. Sharma</option>
                        <option value="kapoor">Dr. Kapoor</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Consultation Type</label>
                    <div className="flex gap-3">
                      {(['in-person', 'video'] as const).map(t => (
                        <label key={t} className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors flex-1 justify-center',
                          walkIn.type === t ? 'border-verdigris bg-mint text-verdigris-deep' : 'border-sage-light bg-bone text-ink-soft'
                        )}>
                          <input
                            type="radio"
                            name="consult-type"
                            value={t}
                            checked={walkIn.type === t}
                            onChange={() => setWalkIn(w => ({ ...w, type: t }))}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium capitalize">{t.replace('-', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {generatedToken && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center bg-mint border border-sage rounded-xl p-4"
                      >
                        <p className="text-xs text-verdigris-deep font-medium mb-1">Token Generated</p>
                        <p className="font-mono text-4xl font-bold text-verdigris">{generatedToken}</p>
                        <p className="text-xs text-verdigris-deep mt-1 font-medium">Demo — not persisted</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={generateToken}
                    leftIcon={<Users size={14} />}
                  >
                    Generate Token
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="p-5 text-center text-ink-soft text-sm">
                <p>Click "Open form" to register a walk-in patient and generate a queue token.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Stats summary */}
      <div className="max-w-screen-xl mx-auto px-6 pb-6">
        <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-verdigris" />
            <h3 className="font-display text-sm font-semibold text-ink">Today's Summary</h3>
            <DemoBadge />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total tokens',  value: totalToday,  color: 'text-ink'            },
              { label: 'Served',        value: servedCount,  color: 'text-verdigris'      },
              { label: 'Waiting',       value: waitingCount, color: 'text-[var(--saffron-deep)]' },
              { label: 'No-show',       value: noShowCount,  color: 'text-signal'         },
            ].map(stat => (
              <div key={stat.label} className="text-center py-3 px-4 bg-bone rounded-lg">
                <p className={cn('font-display text-3xl font-bold', stat.color)}>{stat.value}</p>
                <p className="text-xs text-ink-soft mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard shortcuts */}
        <div className="mt-4 flex items-center gap-2 text-xs text-ink-soft bg-bone rounded-xl px-4 py-2.5 border border-sage-light">
          <Keyboard size={14} className="text-sage" />
          <span className="font-mono font-semibold">F1:</span><span>Call next</span>
          <span className="text-sage mx-1">|</span>
          <span className="font-mono font-semibold">F2:</span><span>Mark served</span>
          <span className="text-sage mx-1">|</span>
          <span className="font-mono font-semibold">F3:</span><span>No show</span>
          <span className="text-sage mx-1">|</span>
          <span className="font-mono font-semibold">/:</span><span>Search</span>
        </div>
      </div>
    </div>
  );
}
