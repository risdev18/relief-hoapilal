// PatientBilling.tsx — Real Supabase Payments, Refund Status & Downloadable GST PDF Receipts (Zero Demo Data)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Download, CreditCard } from 'lucide-react';
import { Button, Badge, EmptyState, Skeleton } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { SupabaseService, PaymentRecord } from '@/services/supabaseService';
import { AuthService } from '@/services/authService';
import { PaymentService } from '@/services/paymentService';

export function PatientBilling() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const patient = AuthService.getActivePatient();

  useEffect(() => {
    void SupabaseService.getPatientPayments().then(list => {
      setPayments(list);
      setLoading(false);
    });
  }, []);

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefundedOrPending = payments
    .filter(p => p.refund_amount > 0)
    .reduce((sum, p) => sum + p.refund_amount, 0);

  const handleDownloadPdf = (p: PaymentRecord) => {
    PaymentService.downloadReceiptPDF({
      bookingRef: p.appointment_ref || p.appointment_id,
      receiptNumber: p.receipt_number,
      patientName: patient?.fullName || 'Patient',
      patientUhid: patient?.uhid,
      patientPhone: patient?.phone || '',
      patientEmail: patient?.email || '',
      doctorName: p.doctor_name || 'Relif Care Specialist',
      departmentName: p.department_name || 'Consultation',
      branchName: p.branch_name || 'Relif Care Hospital',
      consultationType: p.consultation_type || 'in-person',
      date: p.appointment_date || p.created_at.slice(0, 10),
      time: p.appointment_time || 'Scheduled OPD',
      consultationFee: p.consultation_fee,
      taxAmount: p.tax_amount,
      totalAmount: p.amount,
      paymentMode: p.gateway === 'razorpay' ? 'online' : 'pay_at_hospital',
      paymentStatus: p.status,
      razorpayPaymentId: p.razorpay_payment_id,
      refundAmount: p.refund_amount,
      refundStatus: p.refund_status,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Billing &amp; Payments</h1>
          <p className="text-sm text-ink-soft mt-1">
            Official consultation receipts, hospital desk dues, and cancellation refund status.
          </p>
        </div>
        <Link to={ROUTES.legal('refund')} className="text-xs font-mono text-verdigris hover:underline">
          View Refund Policy →
        </Link>
      </div>

      {/* Real Balance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 bg-paper">
          <p className="text-xs font-medium text-ink-soft">Total Paid Online</p>
          <p className="font-display text-3xl font-bold text-verdigris-deep mt-1">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="card p-5 bg-paper">
          <p className="text-xs font-medium text-ink-soft">Payable at Hospital</p>
          <p className="font-display text-3xl font-bold text-ink mt-1">
            ₹{totalPending.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="card p-5 bg-paper">
          <p className="text-xs font-medium text-ink-soft">Refunds Initiated</p>
          <p className="font-display text-3xl font-bold text-saffron-deep mt-1">
            ₹{totalRefundedOrPending.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Invoices List */}
      {loading ? (
        <Skeleton lines={5} />
      ) : payments.length === 0 ? (
        <div className="card p-8 bg-paper">
          <EmptyState
            icon={<CreditCard size={26} />}
            title="No payment receipts yet"
            description="Once you book a consultation online or select Pay at Hospital, your itemized receipt will appear here."
            action={
              <Link to={ROUTES.book} className="btn btn-primary btn-md">
                Book an Appointment →
              </Link>
            }
          />
        </div>
      ) : (
        <div className="card overflow-hidden bg-paper divide-y divide-sage-light">
          {payments.map(pay => (
            <div key={pay.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-ink flex items-center gap-1">
                    <Receipt size={13} className="text-verdigris" />
                    {pay.receipt_number}
                  </span>
                  <Badge
                    variant={
                      pay.status === 'paid'
                        ? 'verdigris'
                        : pay.status === 'refund_pending' || pay.status === 'refunded'
                        ? 'saffron'
                        : pay.status === 'failed'
                        ? 'signal'
                        : 'default'
                    }
                    size="sm"
                  >
                    {pay.status.replace('_', ' ')}
                  </Badge>
                  {pay.refund_amount > 0 && (
                    <span className="font-mono text-xs text-saffron-deep font-semibold">
                      Refund ₹{pay.refund_amount} ({pay.refund_status})
                    </span>
                  )}
                </div>
                <p className="font-semibold text-sm text-ink">
                  {pay.doctor_name || 'Consultation'} · {pay.department_name || 'OPD'}
                </p>
                <p className="text-xs text-ink-soft font-mono">
                  Ref: {pay.appointment_ref || '—'} · {pay.appointment_date || pay.created_at.slice(0, 10)} ·{' '}
                  {pay.gateway === 'razorpay' ? 'Razorpay Online' : 'Hospital Desk'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-lg font-bold text-ink">
                  ₹{pay.amount.toLocaleString('en-IN')}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download size={14} />}
                  onClick={() => handleDownloadPdf(pay)}
                >
                  PDF Receipt
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
