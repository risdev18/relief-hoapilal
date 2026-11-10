// PatientRecords.tsx — Relif Hospital Patient Medical Records

import React, { useState } from 'react';
import {
  FlaskConical,
  Pill,
  FileText,
  Syringe,
  Download,
  Upload,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, DemoBadge, EmptyState, Button } from '@/components/ui';
import { cn } from '@/utils';
import { AuthService } from '@/services/authService';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';

// ── Types ────────────────────────────────────────────────────────────────────
type RecordType = 'lab' | 'prescription' | 'discharge' | 'vaccination';
type RecordStatus = 'ready' | 'processing';

interface MedicalRecord {
  id:         string;
  type:       RecordType;
  title:      string;
  date:       string;
  doctor?:    string;
  status:     RecordStatus;
  fileSize?:  string;
}

// ── Demo records ─────────────────────────────────────────────────────────────
const DEMO_RECORDS: MedicalRecord[] = [
  {
    id:       'REC-2026-001',
    type:     'lab',
    title:    'CBC Report',
    date:     '12 Nov 2026',
    doctor:   'Dr. Priya Sharma',
    status:   'ready',
    fileSize: '245 KB',
  },
  {
    id:       'REC-2026-002',
    type:     'lab',
    title:    'Lipid Profile',
    date:     '10 Nov 2026',
    status:   'processing',
  },
  {
    id:       'REC-2026-003',
    type:     'prescription',
    title:    'Cardiac Medication — Prescription',
    date:     '12 Nov 2026',
    doctor:   'Dr. Priya Sharma',
    status:   'ready',
    fileSize: '78 KB',
  },
  {
    id:       'REC-2026-004',
    type:     'discharge',
    title:    'Discharge Summary',
    date:     '15 Oct 2026',
    doctor:   'Dr. Suresh Kulkarni',
    status:   'ready',
    fileSize: '512 KB',
  },
  {
    id:       'REC-2026-005',
    type:     'vaccination',
    title:    'Flu Shot — Vaccination Record',
    date:     '01 Nov 2026',
    status:   'ready',
    fileSize: '32 KB',
  },
];

// ── Filter tabs ───────────────────────────────────────────────────────────────
const FILTERS: { key: 'all' | RecordType; label: string }[] = [
  { key: 'all',          label: 'All' },
  { key: 'lab',         label: 'Lab Reports' },
  { key: 'prescription', label: 'Prescriptions' },
  { key: 'discharge',    label: 'Discharge Summaries' },
  { key: 'vaccination',  label: 'Vaccinations' },
];

// ── Icons + colors per type ───────────────────────────────────────────────────
const TYPE_CONFIG: Record<RecordType, { icon: React.ReactNode; bg: string; iconColor: string; label: string }> = {
  lab:          { icon: <FlaskConical size={20} />, bg: 'bg-mint',                     iconColor: 'text-verdigris',               label: 'Lab Report' },
  prescription: { icon: <Pill size={20} />,         bg: 'bg-[var(--saffron-light)]',   iconColor: 'text-[var(--saffron-deep)]',   label: 'Prescription' },
  discharge:    { icon: <FileText size={20} />,     bg: 'bg-bone',                     iconColor: 'text-ink-soft',                label: 'Discharge Summary' },
  vaccination:  { icon: <Syringe size={20} />,      bg: 'bg-[var(--mint-light)]',      iconColor: 'text-verdigris-deep',          label: 'Vaccination' },
};

// ── Toast state (simple inline) ───────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);

  function show(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(null), 3000);
  }

  return { msg, show };
}

// ── Record Card ───────────────────────────────────────────────────────────────
function RecordCard({
  record,
  onDownload,
}: {
  record:     MedicalRecord;
  onDownload: (title: string) => void;
}) {
  const cfg = TYPE_CONFIG[record.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5 flex flex-col gap-4 hover:shadow-warm-md transition-shadow"
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', cfg.bg, cfg.iconColor)}>
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-ink-soft">{record.id}</span>
            <DemoBadge />
          </div>
          <h3 className="font-semibold text-ink mt-0.5 leading-snug">{record.title}</h3>
          <p className="text-sm text-ink-soft mt-0.5">{record.date}</p>
          {record.doctor && (
            <p className="text-xs text-ink-soft mt-0.5">{record.doctor}</p>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-3 border-t border-sage-light">
        <div className="flex items-center gap-2">
          <Badge
            variant={record.status === 'ready' ? 'default' : 'saffron'}
            size="sm"
          >
            {record.status === 'ready' ? (
              <><CheckCircle2 size={11} /> Ready</>
            ) : (
              <><Clock size={11} /> Processing</>
            )}
          </Badge>
          <span className="text-xs text-ink-soft">{cfg.label}</span>
        </div>

        {record.status === 'ready' && (
          <button
            onClick={() => onDownload(record.title)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-verdigris hover:text-verdigris-deep border border-sage rounded-pill px-2.5 py-1 hover:border-verdigris transition-colors"
          >
            <Download size={12} />
            Download
            {record.fileSize && <span className="text-ink-soft">({record.fileSize})</span>}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function PatientRecords() {
  const [activeFilter, setActiveFilter] = useState<'all' | RecordType>('all');
  const { msg: toastMsg, show: showToast } = useToast();
  const activePatient = AuthService.getActivePatient();
  const isDemo = activePatient?.email?.toLowerCase().includes('rahul');
  const baseRecords = isDemo ? DEMO_RECORDS : [];

  const filtered = activeFilter === 'all'
    ? baseRecords
    : baseRecords.filter(r => r.type === activeFilter);

  function handleDownload(title: string) {
    showToast(`Downloading secure PDF for "${title}"...`);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-4 right-4 z-toast bg-mint border border-sage text-ink text-sm px-4 py-3 rounded-lg shadow-warm-md max-w-sm"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-semibold text-ink">
          Your medical records.
        </h1>
        <p className="text-ink-soft mt-1">
          View and download your health documents.
        </p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              'px-3 py-1.5 rounded-pill text-sm font-medium transition-all',
              activeFilter === f.key
                ? 'bg-verdigris text-white shadow-verdigris'
                : 'bg-bone text-ink-soft hover:bg-mint hover:text-verdigris-deep'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid sm:grid-cols-2 gap-4"
        >
          {filtered.length === 0 ? (
            <div className="col-span-2">
              <div className="card p-8 text-center space-y-3 bg-bone/60 border border-sage-light">
                <FileText size={36} className="mx-auto text-sage" />
                <h3 className="font-display text-lg font-bold text-ink">No Medical Records Uploaded Yet</h3>
                <p className="text-xs text-ink-soft max-w-md mx-auto">
                  Your electronic health records, prescription archives, and NABL-certified pathology reports will appear here automatically following your hospital consultation.
                </p>
                <div className="pt-2">
                  <Link to={ROUTES.diagnostics}>
                    <Button size="sm" variant="primary" className="bg-verdigris text-white">
                      Explore Diagnostic Packages
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            filtered.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <RecordCard record={r} onDownload={handleDownload} />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Upload section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card p-6 border-2 border-dashed border-sage-light"
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-bone flex items-center justify-center">
            <Upload size={22} className="text-ink-soft" />
          </div>
          <div>
            <p className="font-semibold text-ink">Upload a document</p>
            <p className="text-sm text-ink-soft mt-0.5">
              Drag and drop a file here, or click to browse
            </p>
          </div>
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-pill bg-[var(--saffron-light)] text-[var(--saffron-deep)] border border-[var(--clay)]">
            Demo — uploads are not saved
          </span>
        </div>
      </motion.div>
    </div>
  );
}
