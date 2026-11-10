// PatientBilling.tsx — Relif Hospital Patient Billing & Payments

import React, { useState } from 'react';
import {
  Receipt,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  X,
  IndianRupee,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, DemoBadge, StatCard } from '@/components/ui';
import { cn } from '@/utils';
import { AuthService } from '@/services/authService';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';

// ── Types ────────────────────────────────────────────────────────────────────
type InvoiceStatus = 'paid' | 'pending' | 'cancelled';

interface Invoice {
  id:          string;
  date:        string;
  description: string;
  amount:      number;
  status:      InvoiceStatus;
}

// ── Demo data ─────────────────────────────────────────────────────────────────
const DEMO_INVOICES: Invoice[] = [
  {
    id:          'INV-2026-001',
    date:        '01 Nov 2026',
    description: 'OPD Consultation — Cardiology',
    amount:      500,
    status:      'paid',
  },
  {
    id:          'INV-2026-002',
    date:        '15 Oct 2026',
    description: 'Echocardiography',
    amount:      3500,
    status:      'paid',
  },
  {
    id:          'INV-2026-003',
    date:        '15 Oct 2026',
    description: 'Lab Tests — Lipid Profile, CBC',
    amount:      4500,
    status:      'paid',
  },
  {
    id:          'INV-2026-005',
    date:        '12 Nov 2026',
    description: 'OPD Consultation — Follow-up',
    amount:      2400,
    status:      'pending',
  },
];

// ── Status chip ───────────────────────────────────────────────────────────────
function InvoiceStatusChip({ status }: { status: InvoiceStatus }) {
  const styles: Record<InvoiceStatus, string> = {
    paid:      'bg-mint text-verdigris-deep border border-sage-light',
    pending:   'bg-[var(--saffron-light)] text-[var(--saffron-deep)] border border-[var(--clay)]',
    cancelled: 'bg-[var(--signal-light)] text-[var(--signal-deep)] border border-[var(--signal-light)]',
  };
  const icons: Record<InvoiceStatus, React.ReactNode> = {
    paid:      <CheckCircle2 size={11} />,
    pending:   <Clock size={11} />,
    cancelled: <X size={11} />,
  };
  const labels: Record<InvoiceStatus, string> = {
    paid:      'Paid',
    pending:   'Pending',
    cancelled: 'Cancelled',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-pill', styles[status])}>
      {icons[status]}
      {labels[status]}
    </span>
  );
}

// ── Payment Modal ─────────────────────────────────────────────────────────────
function PaymentModal({
  open,
  invoice,
  onClose,
  onSuccess,
}: {
  open:      boolean;
  invoice:   Invoice | null;
  onClose:   () => void;
  onSuccess: (id: string) => void;
}) {
  const [paying, setPaying] = useState(false);

  if (!invoice) return null;

  async function handlePay() {
    if (!invoice) return;
    setPaying(true);
    await new Promise(r => setTimeout(r, 1000));
    setPaying(false);
    onSuccess(invoice.id);
    onClose();
  }

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
            className="relative z-10 bg-paper rounded-2xl shadow-warm-xl p-6 max-w-sm w-full"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-ink-soft hover:text-signal transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-5">
              <div className="w-10 h-10 rounded-lg bg-[var(--saffron-light)] flex items-center justify-center mb-3">
                <CreditCard size={20} className="text-[var(--saffron-deep)]" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-ink">Demo Payment</h2>
              <p className="text-sm text-ink-soft mt-1">
                This is a sandbox. No real payment will be processed.
              </p>
            </div>

            {/* Invoice summary */}
            <div className="bg-bone rounded-lg p-4 mb-5 space-y-1.5">
              <p className="text-xs font-mono text-ink-soft">{invoice.id}</p>
              <p className="font-medium text-ink">{invoice.description}</p>
              <p className="font-display text-2xl font-semibold text-ink">₹{invoice.amount.toLocaleString('en-IN')}</p>
            </div>

            {/* Fake Razorpay-style button */}
            <button
              onClick={handlePay}
              disabled={paying}
              className={cn(
                'w-full py-3 rounded-pill font-semibold text-sm flex items-center justify-center gap-2 transition-all',
                paying
                  ? 'bg-sage text-ink-soft cursor-not-allowed'
                  : 'bg-saffron text-ink hover:bg-[var(--saffron-deep)] shadow-saffron hover:shadow-none'
              )}
            >
              {paying ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <IndianRupee size={15} />
                  Pay ₹{invoice.amount.toLocaleString('en-IN')} (Sandbox)
                </>
              )}
            </button>

            <p className="text-center text-xs text-ink-soft opacity-60 mt-4">
              Powered by Razorpay Sandbox · Demo only
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function PatientBilling() {
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const [toastMsg, setToastMsg]     = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  function handlePaySuccess(id: string) {
    showToast(`Payment for invoice ${id} completed successfully.`);
  }

  const activePatient = AuthService.getActivePatient();
  const isDemo = activePatient?.email?.toLowerCase().includes('rahul');
  const invoices = isDemo ? DEMO_INVOICES : [];

  const totalPaid    = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);

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

      <PaymentModal
        open={!!payInvoice}
        invoice={payInvoice}
        onClose={() => setPayInvoice(null)}
        onSuccess={handlePaySuccess}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-semibold text-ink">
          Billing & Payments
        </h1>
        <p className="text-ink-soft mt-1">
          {activePatient ? `UHID: ${activePatient.uhid} · ${activePatient.fullName}` : 'View invoices and manage payments'}
        </p>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Paid" value={`₹${totalPaid.toLocaleString('en-IN')}`} />
        <StatCard label="Pending Due" value={`₹${totalPending.toLocaleString('en-IN')}`} />
        <StatCard label="Invoices Issued" value={invoices.length} />
      </div>

      {/* Invoice table or Clean Zero State */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="card overflow-hidden"
      >
        {invoices.length > 0 ? (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_120px_2fr_100px_120px_140px] gap-3 px-5 py-3 bg-bone border-b border-sage-light text-xs font-medium text-ink-soft uppercase tracking-wide">
              <span>Invoice #</span>
              <span>Date</span>
              <span>Description</span>
              <span className="text-right">Amount</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
            <ul className="divide-y divide-sage-light">
              {invoices.map(inv => (
                <li key={inv.id} className="p-4 md:grid md:grid-cols-[1fr_120px_2fr_100px_120px_140px] gap-3 items-center">
                  <span className="font-mono text-xs font-bold text-ink">{inv.id}</span>
                  <span className="text-xs text-ink-soft">{inv.date}</span>
                  <span className="text-sm font-medium text-ink">{inv.description}</span>
                  <span className="font-mono text-sm font-bold text-ink md:text-right">₹{inv.amount.toLocaleString('en-IN')}</span>
                  <div><InvoiceStatusChip status={inv.status} /></div>
                  <div className="md:text-right">
                    {inv.status === 'pending' && (
                      <Button size="sm" onClick={() => setPayInvoice(inv)} className="bg-saffron text-ink">Pay Now</Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Receipt size={32} className="mx-auto text-sage" />
            <h3 className="font-display text-lg font-bold text-ink">No Pending or Past Invoices</h3>
            <p className="text-sm text-ink-soft max-w-md mx-auto">
              Your hospital account balance is completely clear. Any upcoming OPD consultation fees, lab investigations, or pharmacy orders will generate transparent, downloadable GST receipts here.
            </p>
            <div className="pt-2">
              <Link to={ROUTES.book}>
                <Button size="sm" variant="primary" className="bg-verdigris text-white">Book Consultation</Button>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
