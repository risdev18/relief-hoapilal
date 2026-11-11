// BookingWizard.tsx — Six-Step Clinical Appointment Booking with Live Fee Summary, Razorpay Checkout & PDF Receipt

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Video,
  Phone, Download, Search, Star, ShieldCheck, CreditCard, Building2, AlertCircle, BookmarkCheck, X
} from 'lucide-react';
import { Stepper, Button, Input, AvailabilityDot, QRCard, DoctorAvatar, Skeleton } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { cn } from '@/utils';
import { SupabaseService, SlotRecord } from '@/services/supabaseService';
import { AuthService, PatientUser } from '@/services/authService';
import { PaymentService, PriceQuote, RazorpaySuccessPayload } from '@/services/paymentService';
import type { MasterBranch, MasterDepartment, MasterDoctor } from '@/data/masterCatalog';

const WIZARD_STEPS = [
  { label: 'Department',        shortLabel: 'Dept' },
  { label: 'Choose a Doctor',   shortLabel: 'Doctor' },
  { label: 'Branch & Type',     shortLabel: 'Branch' },
  { label: 'Date & Time Slot',  shortLabel: 'Slot' },
  { label: 'Patient Details',   shortLabel: 'Details' },
  { label: 'Review & Pay',      shortLabel: 'Pay' },
];

const DRAFT_KEY = 'relif_booking_draft_v2';

const UPCOMING_DATES = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  const iso = d.toISOString().split('T')[0];
  const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' });
  const day = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  return { date: iso, label, day };
});

export function BookingWizard() {
  const [searchParams] = useSearchParams();

  // Catalog state
  const [departments, setDepartments] = useState<MasterDepartment[]>([]);
  const [branches, setBranches] = useState<MasterBranch[]>([]);
  const [doctors, setDoctors] = useState<MasterDoctor[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [activeUser, setActiveUser] = useState<PatientUser | null>(() => AuthService.getActivePatient());

  // Wizard step & saved selection
  const [step, setStep] = useState(0);
  const [selectedDeptSlug, setSelectedDeptSlug] = useState(searchParams.get('department') || '');
  const [selectedDoctorSlug, setSelectedDoctorSlug] = useState(searchParams.get('doctor') || '');
  const [selectedBranchSlug, setSelectedBranchSlug] = useState('');
  const [visitType, setVisitType] = useState<'in-person' | 'video'>(
    searchParams.get('type') === 'video' ? 'video' : 'in-person'
  );
  const [selectedDate, setSelectedDate] = useState(UPCOMING_DATES[0].date);
  const [selectedSlot, setSelectedSlot] = useState('');

  // Step 2 (Doctor) filters
  const [docSearch, setDocSearch] = useState('');
  const [docBranchFilter, setDocBranchFilter] = useState('');
  const [docLangFilter, setDocLangFilter] = useState('');
  const [docMaxFee, setDocMaxFee] = useState('');
  const [docAvailToday, setDocAvailToday] = useState(false);

  // Slots
  const [slots, setSlots] = useState<SlotRecord[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Patient form
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [symptoms, setSymptoms] = useState('');

  // Payment & Quote
  const [paymentMode, setPaymentMode] = useState<'online' | 'pay_at_hospital'>('online');
  const [quote, setQuote] = useState<PriceQuote | null>(null);
  const [rzpModalOpen, setRzpModalOpen] = useState(false);
  const [rzpMethod, setRzpMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [rzpUpiId, setRzpUpiId] = useState('patient@okaxis');

  // Booking Outcome
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftSavedNotice, setDraftSavedNotice] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    appointmentId: string;
    bookingRef: string;
    receiptNumber: string;
    consultationFee: number;
    taxAmount: number;
    totalAmount: number;
    paymentStatus: string;
    razorpayPaymentId?: string;
  } | null>(null);

  // Load master catalog & sync auth
  useEffect(() => {
    void Promise.all([
      SupabaseService.getDepartments(),
      SupabaseService.getBranches(),
      SupabaseService.getDoctors(),
      AuthService.syncSession(),
    ]).then(([depts, brs, docs, user]) => {
      setDepartments(depts);
      setBranches(brs);
      setDoctors(docs);
      if (user) {
        setActiveUser(user);
        setPatientName(prev => prev || user.fullName);
        setPatientPhone(prev => prev || user.phone);
        setPatientEmail(prev => prev || user.email);
      }

      // Apply URL params or saved draft
      const urlDocSlug = searchParams.get('doctor');
      const urlDeptSlug = searchParams.get('department');
      if (urlDocSlug) {
        const matchedDoc = docs.find(d => d.slug === urlDocSlug);
        if (matchedDoc) {
          setSelectedDeptSlug(matchedDoc.departmentSlug);
          setSelectedDoctorSlug(matchedDoc.slug);
          setSelectedBranchSlug(matchedDoc.branchSlug);
          setStep(3);
        }
      } else if (urlDeptSlug && depts.some(d => d.slug === urlDeptSlug)) {
        setSelectedDeptSlug(urlDeptSlug);
        setStep(1);
      } else {
        try {
          const rawDraft = sessionStorage.getItem(DRAFT_KEY);
          if (rawDraft) {
            const draft = JSON.parse(rawDraft);
            if (draft.selectedDeptSlug) setSelectedDeptSlug(draft.selectedDeptSlug);
            if (draft.selectedDoctorSlug) setSelectedDoctorSlug(draft.selectedDoctorSlug);
            if (draft.selectedBranchSlug) setSelectedBranchSlug(draft.selectedBranchSlug);
            if (draft.visitType) setVisitType(draft.visitType);
            if (draft.selectedDate) setSelectedDate(draft.selectedDate);
            if (draft.selectedSlot) setSelectedSlot(draft.selectedSlot);
            if (draft.symptoms) setSymptoms(draft.symptoms);
            if (typeof draft.step === 'number') setStep(Math.min(draft.step, 5));
          }
        } catch {
          // ignore draft parse issues
        }
      }
      setCatalogLoading(false);
    });
  }, [searchParams]);

  const selectedDepartment = useMemo(
    () => departments.find(d => d.slug === selectedDeptSlug) || null,
    [departments, selectedDeptSlug]
  );

  const selectedDoctor = useMemo(
    () => doctors.find(d => d.slug === selectedDoctorSlug) || null,
    [doctors, selectedDoctorSlug]
  );

  const selectedBranch = useMemo(() => {
    if (selectedBranchSlug) {
      return branches.find(b => b.slug === selectedBranchSlug) || branches[0] || null;
    }
    if (selectedDoctor) {
      return branches.find(b => b.slug === selectedDoctor.branchSlug) || branches[0] || null;
    }
    return branches[0] || null;
  }, [branches, selectedBranchSlug, selectedDoctor]);

  // All doctors in selected department + filters
  const deptDoctors = useMemo(() => {
    const base = selectedDeptSlug
      ? doctors.filter(d => d.departmentSlug === selectedDeptSlug)
      : doctors;
    return base.filter(d => {
      const q = docSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.qualifications.join(' ').toLowerCase().includes(q);
      const matchBranch = !docBranchFilter || d.branchSlug === docBranchFilter;
      const matchLang = !docLangFilter || d.languages.includes(docLangFilter);
      const matchFee = !docMaxFee || d.feeInClinic <= Number(docMaxFee);
      const matchAvail = !docAvailToday || d.availability === 'available';
      return matchSearch && matchBranch && matchLang && matchFee && matchAvail;
    });
  }, [doctors, selectedDeptSlug, docSearch, docBranchFilter, docLangFilter, docMaxFee, docAvailToday]);

  const availableLanguages = useMemo(() => {
    const s = new Set<string>();
    doctors.forEach(d => d.languages.forEach(l => s.add(l)));
    return Array.from(s).sort();
  }, [doctors]);

  // Keep quote refreshed whenever doctor or visitType changes
  useEffect(() => {
    if (!selectedDoctor) {
      setQuote(null);
      return;
    }
    void PaymentService.getVerifiedQuote(selectedDoctor, visitType).then(setQuote);
  }, [selectedDoctor, visitType]);

  // Load slots when doctor/date/type changes
  useEffect(() => {
    if (!selectedDoctor || !selectedBranch || !selectedDate) return;
    setSlotsLoading(true);
    void SupabaseService.getDoctorSlots(
      selectedDoctor.id,
      selectedBranch.id,
      selectedDate,
      visitType
    ).then(list => {
      setSlots(list);
      setSlotsLoading(false);
    });
  }, [selectedDoctor, selectedBranch, selectedDate, visitType]);

  const handleSaveDraft = () => {
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        step,
        selectedDeptSlug,
        selectedDoctorSlug,
        selectedBranchSlug,
        visitType,
        selectedDate,
        selectedSlot,
        symptoms,
      })
    );
    setDraftSavedNotice(true);
    setTimeout(() => setDraftSavedNotice(false), 3000);
  };

  const canProceed = () => {
    if (step === 0) return Boolean(selectedDeptSlug);
    if (step === 1) return Boolean(selectedDoctorSlug);
    if (step === 2) return Boolean(selectedBranch);
    if (step === 3) return Boolean(selectedDate && selectedSlot);
    if (step === 4) {
      return Boolean(activeUser && patientName.trim().length >= 2 && patientPhone.replace(/\D/g, '').length >= 10);
    }
    return true;
  };

  const finalizeBooking = async (rzpPayload?: RazorpaySuccessPayload) => {
    if (!selectedDoctor || !selectedBranch) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await SupabaseService.createBooking({
        doctor: selectedDoctor,
        branch: selectedBranch,
        date: selectedDate,
        time: selectedSlot,
        consultationType: visitType,
        patientName: patientName.trim(),
        patientEmail: patientEmail.trim(),
        patientPhone: patientPhone.trim(),
        symptoms: symptoms.trim(),
        paymentMode,
        razorpayOrderId: rzpPayload?.razorpay_order_id,
        razorpayPaymentId: rzpPayload?.razorpay_payment_id,
        razorpaySignature: rzpPayload?.razorpay_signature,
      });

      sessionStorage.removeItem(DRAFT_KEY);
      setConfirmation({
        ...result,
        razorpayPaymentId: rzpPayload?.razorpay_payment_id,
      });
    } catch (err: any) {
      setSubmitError(err?.message || 'Could not confirm appointment. Please check your selected slot.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommitPayment = async () => {
    setSubmitError(null);
    if (!selectedDoctor || !selectedBranch) return;
    if (!activeUser) {
      setSubmitError('Please sign in first so your appointment is saved to your Patient Portal.');
      return;
    }

    if (paymentMode === 'pay_at_hospital') {
      await finalizeBooking();
      return;
    }

    // Pay Online via Razorpay
    const order = await PaymentService.createServerOrder(selectedDoctor.id, visitType);
    if (PaymentService.hasLiveRazorpayKey()) {
      try {
        setSubmitting(true);
        const res = await PaymentService.openNativeRazorpay({
          orderId: order?.orderId || `order_${Date.now()}`,
          amountPaise: order?.amountPaise || (quote?.totalAmount || selectedDoctor.feeInClinic) * 100,
          keyId: order?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
          patientName,
          patientEmail,
          patientPhone,
          description: `${selectedDoctor.name} — ${selectedDoctor.departmentName}`,
        });
        await finalizeBooking(res);
      } catch (err: any) {
        setSubmitting(false);
        setSubmitError(err?.message || 'Razorpay checkout cancelled.');
      }
    } else {
      // Open Interactive Razorpay Test Mode Checkout Sheet
      setRzpModalOpen(true);
    }
  };

  const handleCompleteTestPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    setRzpModalOpen(false);
    const order = await PaymentService.createServerOrder(selectedDoctor.id, visitType);
    const payload: RazorpaySuccessPayload = {
      razorpay_order_id: order?.orderId || `order_test_${Date.now()}`,
      razorpay_payment_id: `pay_test_${Math.random().toString(36).slice(2, 11)}`,
      razorpay_signature: `sig_test_${Date.now()}`,
      method: rzpMethod,
    };
    await finalizeBooking(payload);
  };

  const handleDownloadPdf = () => {
    if (!confirmation || !selectedDoctor || !selectedBranch) return;
    PaymentService.downloadReceiptPDF({
      bookingRef: confirmation.bookingRef,
      receiptNumber: confirmation.receiptNumber,
      patientName,
      patientUhid: activeUser?.uhid,
      patientPhone,
      patientEmail,
      doctorName: selectedDoctor.name,
      departmentName: selectedDoctor.departmentName,
      branchName: selectedBranch.shortName,
      consultationType: visitType,
      date: selectedDate,
      time: selectedSlot,
      consultationFee: confirmation.consultationFee,
      taxAmount: confirmation.taxAmount,
      totalAmount: confirmation.totalAmount,
      paymentMode,
      paymentStatus: confirmation.paymentStatus,
      razorpayPaymentId: confirmation.razorpayPaymentId,
    });
  };

  // ── Booking Confirmation Receipt Screen ────────────────────────────────────
  if (confirmation && selectedDoctor && selectedBranch) {
    return (
      <div className="min-h-screen bg-bone py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-paper rounded-2xl border border-sage-light shadow-warm-lg overflow-hidden">
            <div className="bg-ink text-paper p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-verdigris text-white text-xs font-mono uppercase mb-3">
                  <Check size={14} /> Appointment Confirmed
                </div>
                <h1 className="font-display text-3xl font-bold text-paper">
                  {selectedDoctor.name}
                </h1>
                <p className="text-mint/85 text-sm mt-1">
                  {selectedDoctor.departmentName} · {selectedBranch.shortName} ·{' '}
                  {visitType === 'video' ? 'Video Consultation' : 'In-Clinic OPD'}
                </p>
              </div>
              <div className="text-left sm:text-right font-mono">
                <p className="text-[11px] uppercase tracking-wider text-sage">Booking Ref</p>
                <p className="text-lg font-bold text-saffron">{confirmation.bookingRef}</p>
                <p className="text-[11px] text-mint/80 mt-0.5">Receipt: {confirmation.receiptNumber}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-7 space-y-5">
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-bone border border-sage-light text-sm">
                  <div>
                    <p className="text-xs text-ink-soft">Date</p>
                    <p className="font-semibold text-ink">{selectedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-soft">Slot Time</p>
                    <p className="font-semibold text-ink">{selectedSlot}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-soft">Patient</p>
                    <p className="font-semibold text-ink">{patientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-soft">Payment Status</p>
                    <p className="font-mono font-bold text-verdigris-deep uppercase">
                      {confirmation.paymentStatus === 'paid' ? 'Paid Online' : 'Pay at Hospital'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-sage-light space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Consultation Fee</span>
                    <span className="font-mono font-semibold text-ink">₹{confirmation.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Taxes (GST Exempt)</span>
                    <span className="font-mono text-ink-soft">₹{confirmation.taxAmount}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-sage-light font-bold text-base">
                    <span className="text-ink">Total</span>
                    <span className="font-mono text-verdigris-deep">₹{confirmation.totalAmount}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button variant="primary" size="md" leftIcon={<Download size={16} />} onClick={handleDownloadPdf}>
                    Download PDF Receipt
                  </Button>
                  <Link to={ROUTES.patientAppointments} className="btn btn-secondary btn-md">
                    View in My Appointments →
                  </Link>
                </div>
              </div>

              <div className="md:col-span-5 flex justify-center">
                <QRCard
                  appointmentId={confirmation.bookingRef}
                  patientName={patientName}
                  date={selectedDate}
                  time={selectedSlot}
                  doctor={selectedDoctor.name}
                  department={selectedDoctor.departmentName}
                  qrValue={confirmation.bookingRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const feeDisplay = quote?.consultationFee ?? (selectedDoctor ? (visitType === 'video' ? selectedDoctor.feeVideo : selectedDoctor.feeInClinic) : null);
  const taxDisplay = quote?.taxAmount ?? 0;
  const totalDisplay = quote?.totalAmount ?? feeDisplay;

  return (
    <div className="min-h-screen bg-bone pb-20">
      {/* Top Bar with Navigation & Save Progress */}
      <header className="bg-paper border-b border-sage-light sticky top-0 z-header">
        <div className="section-container py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to={ROUTES.home} className="font-display font-bold text-xl text-ink hover:text-verdigris">
              relif <span className="font-mono text-xs text-saffron uppercase">Care</span>
            </Link>
            <span className="hidden sm:inline text-xs font-mono text-ink-soft border-l border-sage-light pl-3">
              Appointment Booking · 6 Calm Steps
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {draftSavedNotice && (
              <span className="text-xs font-mono text-verdigris-deep bg-mint px-2.5 py-1 rounded-full">
                Progress saved
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-verdigris px-3 py-1.5 rounded-full border border-sage-light bg-bone transition-colors"
            >
              <BookmarkCheck size={14} />
              <span>Save Progress</span>
            </button>
            <Link
              to={ROUTES.home}
              onClick={handleSaveDraft}
              className="text-xs font-semibold text-ink hover:text-signal px-3 py-1.5 rounded-full border border-sage-light hover:bg-bone transition-colors"
            >
              Save &amp; Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Upfront Payment & Policy Disclosure Banner */}
      <div className="bg-mint/45 border-b border-sage-light">
        <div className="section-container py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-verdigris-deep">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck size={14} className="text-verdigris flex-shrink-0" />
            Pay online (UPI / Cards / Netbanking) or pay at hospital desk — transparent consultation fee shown upfront.
          </span>
          <Link to={ROUTES.legal('refund')} className="font-mono underline hover:text-ink">
            Free cancellation &ge; 24 hrs · Refund Policy
          </Link>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-paper border-b border-sage-light">
        <div className="section-container py-4">
          <Stepper steps={WIZARD_STEPS} currentStep={step} />
        </div>
      </div>

      {/* Main Content + Persistent Live Fee Summary */}
      <div className="section-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Step Workspace */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-paper rounded-2xl border border-sage-light p-6 sm:p-8 shadow-warm-xs"
              >
                {/* STEP 1: DEPARTMENT */}
                {step === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                        1. Choose a clinical department
                      </h1>
                      <p className="text-sm text-ink-soft mt-1">
                        Every specialist listed shows their upfront consultation fee in INR.
                      </p>
                    </div>

                    {catalogLoading ? (
                      <Skeleton lines={6} />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {departments.map(dept => {
                          const count = doctors.filter(d => d.departmentSlug === dept.slug).length;
                          const minFee = Math.min(
                            ...doctors.filter(d => d.departmentSlug === dept.slug).map(d => d.feeInClinic),
                            800
                          );
                          const active = selectedDeptSlug === dept.slug;
                          return (
                            <button
                              key={dept.slug}
                              type="button"
                              onClick={() => {
                                setSelectedDeptSlug(dept.slug);
                                setSelectedDoctorSlug('');
                                setSelectedSlot('');
                              }}
                              className={cn(
                                'p-4 rounded-2xl border-2 text-left transition-all',
                                active
                                  ? 'border-verdigris bg-mint/35 shadow-warm-xs'
                                  : 'border-sage-light bg-paper hover:border-sage'
                              )}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-display font-bold text-lg text-ink">{dept.name}</span>
                                <span className="font-mono text-xs font-semibold text-verdigris-deep bg-bone px-2 py-0.5 rounded-full border border-sage-light">
                                  From ₹{minFee}
                                </span>
                              </div>
                              <p className="text-xs text-ink-soft line-clamp-2 mb-2">{dept.description}</p>
                              <p className="font-mono text-[11px] text-verdigris">
                                {count} {count === 1 ? 'Specialist' : 'Specialists'} available
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: DOCTOR (Lists ALL doctors of chosen department + search & filters) */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                        2. Choose a specialist in {selectedDepartment?.name || 'Department'}
                      </h2>
                      <p className="text-sm text-ink-soft mt-1">
                        Showing all {deptDoctors.length} specialists in this department. Filter by branch, language, fee, or today&apos;s availability.
                      </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-bone border border-sage-light">
                      <div className="relative sm:col-span-2 lg:col-span-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                        <input
                          type="search"
                          value={docSearch}
                          onChange={e => setDocSearch(e.target.value)}
                          placeholder="Search doctor…"
                          className="input pl-8 py-2 text-xs"
                        />
                      </div>
                      <select
                        value={docBranchFilter}
                        onChange={e => setDocBranchFilter(e.target.value)}
                        className="input py-2 text-xs"
                        aria-label="Filter by branch"
                      >
                        <option value="">All Branches</option>
                        {branches.map(b => (
                          <option key={b.slug} value={b.slug}>{b.shortName}</option>
                        ))}
                      </select>
                      <select
                        value={docLangFilter}
                        onChange={e => setDocLangFilter(e.target.value)}
                        className="input py-2 text-xs"
                        aria-label="Filter by language"
                      >
                        <option value="">Any Language</option>
                        {availableLanguages.map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                      <select
                        value={docMaxFee}
                        onChange={e => setDocMaxFee(e.target.value)}
                        className="input py-2 text-xs"
                        aria-label="Filter by max fee"
                      >
                        <option value="">Any Fee</option>
                        <option value="800">Up to ₹800</option>
                        <option value="1000">Up to ₹1,000</option>
                        <option value="1200">Up to ₹1,200</option>
                      </select>

                      <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-1">
                        <label className="inline-flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                          <input
                            type="checkbox"
                            checked={docAvailToday}
                            onChange={e => setDocAvailToday(e.target.checked)}
                            className="accent-[var(--verdigris)]"
                          />
                          Available today only
                        </label>
                        {(docSearch || docBranchFilter || docLangFilter || docMaxFee || docAvailToday) && (
                          <button
                            type="button"
                            onClick={() => {
                              setDocSearch('');
                              setDocBranchFilter('');
                              setDocLangFilter('');
                              setDocMaxFee('');
                              setDocAvailToday(false);
                            }}
                            className="text-xs font-semibold text-verdigris hover:underline"
                          >
                            Reset filters
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Doctor List */}
                    <div className="space-y-3">
                      {deptDoctors.length === 0 ? (
                        <div className="p-6 text-center bg-bone rounded-xl text-sm text-ink-soft">
                          No doctors match the active filter combination. Reset filters to view all specialists.
                        </div>
                      ) : (
                        deptDoctors.map(doc => {
                          const active = selectedDoctorSlug === doc.slug;
                          return (
                            <button
                              key={doc.id}
                              type="button"
                              onClick={() => {
                                setSelectedDoctorSlug(doc.slug);
                                setSelectedBranchSlug(doc.branchSlug);
                                setSelectedSlot('');
                              }}
                              className={cn(
                                'w-full p-4 rounded-2xl border-2 text-left flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-stretch sm:items-center transition-all',
                                active
                                  ? 'border-verdigris bg-mint/30 shadow-warm-xs'
                                  : 'border-sage-light bg-paper hover:border-sage'
                              )}
                            >
                              <div className="flex items-start gap-3.5 sm:contents">
                                <DoctorAvatar
                                  name={doc.name}
                                  photoUrl={doc.photoUrl}
                                  className="w-16 sm:w-20 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                                    <h3 className="font-display font-bold text-base sm:text-lg text-ink leading-snug">{doc.name}</h3>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink bg-bone px-2 py-0.5 rounded-full border border-sage-light">
                                      <Star size={11} className="fill-saffron text-saffron" />
                                      {doc.rating} ({doc.reviewCount})
                                    </span>
                                  </div>
                                  <p className="text-xs font-medium text-verdigris mb-1">{doc.designation}</p>
                                  <p className="text-xs text-ink-soft leading-relaxed">
                                    {doc.experienceYears} yrs exp · {doc.qualifications.join(', ')} · {doc.branchName}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-ink-soft">
                                    <span>Languages: {doc.languages.join(', ')}</span>
                                    <span className="hidden sm:inline-flex items-center gap-1">
                                      <AvailabilityDot status={doc.availability} />
                                      {doc.nextSlotLabel}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="pt-2.5 border-t border-sage-light/70 sm:pt-0 sm:border-t-0 flex items-center justify-between sm:block sm:text-right flex-shrink-0">
                                <span className="sm:hidden inline-flex items-center gap-1.5 text-xs text-ink-soft">
                                  <AvailabilityDot status={doc.availability} />
                                  {doc.nextSlotLabel}
                                </span>
                                <div className="text-right">
                                  <p className="font-mono text-[11px] sm:text-xs text-ink-soft">Consultation Fee</p>
                                  <p className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight">
                                    ₹{doc.feeInClinic}
                                    <span className="sm:block font-mono text-[11px] font-normal text-verdigris ml-1.5 sm:ml-0">
                                      Video ₹{doc.feeVideo}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3: BRANCH & CONSULTATION TYPE */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                        3. Branch &amp; consultation type
                      </h2>
                      <p className="text-sm text-ink-soft mt-1">
                        Fees adjust live in the summary panel when switching between In-Clinic and Video visits.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="font-mono text-xs uppercase tracking-wider text-verdigris font-semibold">
                        Consultation Mode
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setVisitType('in-person')}
                          className={cn(
                            'p-4 rounded-2xl border-2 text-left transition-all',
                            visitType === 'in-person'
                              ? 'border-verdigris bg-mint/35'
                              : 'border-sage-light bg-paper hover:border-sage'
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="inline-flex items-center gap-2 font-semibold text-ink">
                              <MapPin size={16} className="text-verdigris" /> In-Clinic OPD Visit
                            </span>
                            <span className="font-mono font-bold text-verdigris-deep">
                              ₹{selectedDoctor?.feeInClinic || 800}
                            </span>
                          </div>
                          <p className="text-xs text-ink-soft">Physical examination at the hospital branch.</p>
                        </button>

                        {selectedDoctor?.consultationTypes.includes('video') && (
                          <button
                            type="button"
                            onClick={() => setVisitType('video')}
                            className={cn(
                              'p-4 rounded-2xl border-2 text-left transition-all',
                              visitType === 'video'
                                ? 'border-verdigris bg-mint/35'
                                : 'border-sage-light bg-paper hover:border-sage'
                            )}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="inline-flex items-center gap-2 font-semibold text-ink">
                                <Video size={16} className="text-verdigris" /> Video Tele-Consultation
                              </span>
                              <span className="font-mono font-bold text-verdigris-deep">
                                ₹{selectedDoctor?.feeVideo || 650}
                              </span>
                            </div>
                            <p className="text-xs text-ink-soft">Secure HD video consult from home.</p>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="font-mono text-xs uppercase tracking-wider text-verdigris font-semibold">
                        Hospital Branch
                      </p>
                      <div className="space-y-2.5">
                        {branches.map(br => {
                          const active = selectedBranch?.slug === br.slug;
                          return (
                            <button
                              key={br.slug}
                              type="button"
                              onClick={() => setSelectedBranchSlug(br.slug)}
                              className={cn(
                                'w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all',
                                active
                                  ? 'border-verdigris bg-mint/30'
                                  : 'border-sage-light bg-paper hover:border-sage'
                              )}
                            >
                              <div>
                                <p className="font-semibold text-sm text-ink">{br.name}</p>
                                <p className="text-xs text-ink-soft">{br.address}</p>
                              </div>
                              {selectedDoctor?.branchSlug === br.slug && (
                                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-mint text-verdigris-deep font-semibold flex-shrink-0">
                                  Doctor&apos;s Primary
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: DATE & TIME SLOT */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                          4. Pick date &amp; live time slot
                        </h2>
                        <p className="text-sm text-ink-soft mt-1">
                          Already-reserved slots are struck out and locked against double-booking.
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-bone border border-sage-light text-ink">
                        Fee: ₹{feeDisplay}
                      </span>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {UPCOMING_DATES.map(d => (
                        <button
                          key={d.date}
                          type="button"
                          onClick={() => {
                            setSelectedDate(d.date);
                            setSelectedSlot('');
                          }}
                          className={cn(
                            'flex-shrink-0 px-4 py-3 rounded-xl border-2 text-center min-w-[92px] transition-all',
                            selectedDate === d.date
                              ? 'border-verdigris bg-mint/40'
                              : 'border-sage-light bg-paper hover:border-sage'
                          )}
                        >
                          <p className="text-xs text-ink-soft">{d.label}</p>
                          <p className="font-semibold text-sm text-ink">{d.day}</p>
                        </button>
                      ))}
                    </div>

                    {slotsLoading ? (
                      <Skeleton lines={3} />
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {slots.map(slot => {
                          const unavailable = slot.isBooked || slot.isBlocked;
                          const picked = selectedSlot === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={unavailable}
                              onClick={() => setSelectedSlot(slot.time)}
                              className={cn(
                                'py-3 px-2 rounded-xl border text-xs font-mono transition-all',
                                unavailable
                                  ? 'bg-bone border-sage-light text-ink-muted line-through cursor-not-allowed opacity-60'
                                  : picked
                                  ? 'bg-saffron border-saffron text-ink font-bold shadow-warm-xs'
                                  : 'bg-paper border-sage-light text-ink hover:border-verdigris'
                              )}
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 5: PATIENT DETAILS */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                        5. Patient contact &amp; reason for visit
                      </h2>
                      <p className="text-sm text-ink-soft mt-1">
                        Booking must be attached to an authenticated Patient Portal account for receipts and refunds.
                      </p>
                    </div>

                    {!activeUser ? (
                      <div className="p-6 rounded-2xl bg-bone border border-sage space-y-4">
                        <h3 className="font-display font-bold text-lg text-ink">
                          Sign in or register to lock this slot
                        </h3>
                        <p className="text-sm text-ink-soft">
                          Save your progress automatically, sign in with Email OTP or Password, and you will return right here with your selection intact.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <Link
                            to={`${ROUTES.login}?redirect=/book`}
                            onClick={handleSaveDraft}
                            className="btn btn-primary btn-md"
                          >
                            Sign In to Continue →
                          </Link>
                          <Link
                            to={ROUTES.register}
                            onClick={handleSaveDraft}
                            className="btn btn-secondary btn-md"
                          >
                            New Patient Registration
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-3.5 rounded-xl bg-mint/40 border border-sage flex items-center justify-between text-xs">
                          <span>
                            Signed in as <strong>{activeUser.fullName}</strong> ({activeUser.uhid})
                          </span>
                          <span className="font-mono text-verdigris-deep font-semibold">Verified UHID</span>
                        </div>

                        <Input
                          label="Patient Full Name"
                          required
                          value={patientName}
                          onChange={e => setPatientName(e.target.value)}
                          placeholder="Full legal name"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Mobile Number"
                            type="tel"
                            required
                            value={patientPhone}
                            onChange={e => setPatientPhone(e.target.value)}
                            placeholder="10-digit Indian mobile"
                          />
                          <Input
                            label="Email Address"
                            type="email"
                            value={patientEmail}
                            onChange={e => setPatientEmail(e.target.value)}
                            placeholder="Receipt & reminder email"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-ink mb-1.5">
                            Symptoms / Clinical Notes (Optional)
                          </label>
                          <textarea
                            rows={3}
                            value={symptoms}
                            onChange={e => setSymptoms(e.target.value)}
                            placeholder="Briefly mention duration of symptoms or medications…"
                            className="input text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 6: PAYMENT & FINAL COMMIT */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                        6. Choose payment mode &amp; confirm
                      </h2>
                      <p className="text-sm text-ink-soft mt-1">
                        Server-verified consultation total: <strong>₹{totalDisplay}</strong>
                      </p>
                    </div>

                    {submitError && (
                      <div className="p-4 rounded-xl bg-[var(--signal-light)] border border-signal text-signal-deep text-xs flex items-start gap-2.5" role="alert">
                        <AlertCircle size={16} className="flex-shrink-0 text-signal mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-semibold">{submitError}</p>
                          <button
                            type="button"
                            onClick={() => { setStep(3); setSubmitError(null); }}
                            className="underline font-semibold text-verdigris-deep"
                          >
                            Pick another time slot
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMode('online')}
                        className={cn(
                          'p-5 rounded-2xl border-2 text-left transition-all',
                          paymentMode === 'online'
                            ? 'border-verdigris bg-mint/35 shadow-warm-xs'
                            : 'border-sage-light bg-paper hover:border-sage'
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center gap-2 font-bold text-sm text-ink">
                            <CreditCard size={16} className="text-verdigris" /> Pay Online (Razorpay)
                          </span>
                          <span className="font-mono text-sm font-bold text-verdigris-deep">
                            ₹{totalDisplay}
                          </span>
                        </div>
                        <p className="text-xs text-ink-soft">
                          UPI, Credit/Debit Cards, or Netbanking in Razorpay Test Mode. Instant GST receipt PDF.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMode('pay_at_hospital')}
                        className={cn(
                          'p-5 rounded-2xl border-2 text-left transition-all',
                          paymentMode === 'pay_at_hospital'
                            ? 'border-verdigris bg-mint/35 shadow-warm-xs'
                            : 'border-sage-light bg-paper hover:border-sage'
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center gap-2 font-bold text-sm text-ink">
                            <Building2 size={16} className="text-verdigris" /> Pay at Hospital
                          </span>
                          <span className="font-mono text-sm font-bold text-ink">
                            ₹{totalDisplay}
                          </span>
                        </div>
                        <p className="text-xs text-ink-soft">
                          Reserve your slot now and pay at the OPD reception desk on arrival.
                        </p>
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-bone border border-sage-light text-xs text-ink-soft space-y-1.5">
                      <p className="font-semibold text-ink">Cancellation &amp; Refund Guarantee</p>
                      <p>
                        {quote?.cancellationPolicySummary ||
                          'Free cancellation >= 24 hrs (100% refund) · 50% refund between 2–24 hrs · No refund within 2 hrs of slot.'}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      isLoading={submitting}
                      onClick={handleCommitPayment}
                      className="w-full justify-center"
                    >
                      {paymentMode === 'online'
                        ? `Pay ₹${totalDisplay} & Confirm Slot`
                        : `Confirm Booking · Pay ₹${totalDisplay} at Hospital`}
                    </Button>
                  </div>
                )}

                {/* Navigation Controls */}
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-sage-light">
                  {step > 0 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      leftIcon={<ChevronLeft size={16} />}
                      onClick={() => setStep(s => s - 1)}
                    >
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {step < 5 && (
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      rightIcon={<ChevronRight size={16} />}
                      disabled={!canProceed()}
                      onClick={() => setStep(s => s + 1)}
                    >
                      Continue to {WIZARD_STEPS[step + 1]?.shortLabel}
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Persistent Live Price & Appointment Summary Panel */}
          <aside className="lg:col-span-4 lg:sticky lg:top-20">
            <div className="card p-6 bg-paper border-sage space-y-4 shadow-warm-md">
              <div className="flex items-center justify-between border-b border-sage-light pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-verdigris">
                  Live Fee &amp; Visit Summary
                </span>
                <span className="font-mono text-[11px] text-ink-soft">
                  Step {step + 1}/6
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-ink-soft">Department</span>
                  <span className="font-semibold text-ink text-right">
                    {selectedDepartment?.name || 'Not selected'}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-ink-soft">Doctor</span>
                  <span className="font-semibold text-ink text-right">
                    {selectedDoctor?.name || 'Not selected'}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-ink-soft">Branch</span>
                  <span className="font-medium text-ink text-right">
                    {selectedBranch?.shortName || 'Andheri West'}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-ink-soft">Visit Type</span>
                  <span className="font-medium text-ink text-right">
                    {visitType === 'video' ? 'Video Consult' : 'In-Clinic Visit'}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-ink-soft">Date &amp; Time</span>
                  <span className="font-mono font-medium text-ink text-right">
                    {selectedSlot ? `${selectedDate} · ${selectedSlot}` : 'Not selected'}
                  </span>
                </div>
              </div>

              <div className="border-t border-sage-light pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Consultation Fee</span>
                  <span className="font-mono font-semibold text-ink">
                    {feeDisplay !== null ? `₹${feeDisplay}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Taxes (GST Exempt)</span>
                  <span className="font-mono text-ink-soft">₹{taxDisplay}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-sage-light text-base font-bold">
                  <span className="text-ink">Total Payable</span>
                  <span className="font-mono text-verdigris-deep text-lg">
                    {totalDisplay !== null ? `₹${totalDisplay}` : '—'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-bone border border-sage-light text-[11px] text-ink-soft space-y-1">
                <p className="font-semibold text-ink">
                  {paymentMode === 'online' ? 'Pay Online or Pay at Hospital' : 'Pay at Hospital Desk Selected'}
                </p>
                <p>100% refund &ge; 24 hrs · 50% refund 2–24 hrs · 0% &lt; 2 hrs.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Razorpay Test Mode Checkout Modal (runs cleanly when sandbox key active) */}
      <AnimatePresence>
        {rzpModalOpen && selectedDoctor && (
          <motion.div
            className="fixed inset-0 z-modal flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setRzpModalOpen(false)} />
            <motion.form
              onSubmit={handleCompleteTestPayment}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-paper rounded-2xl border border-sage shadow-warm-xl overflow-hidden"
            >
              <div className="bg-ink text-paper p-5 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-saffron font-bold">
                    Razorpay Test Checkout
                  </span>
                  <h3 className="font-display font-bold text-lg text-paper">Relif Care Multispecialty</h3>
                  <p className="text-xs text-mint/80">{selectedDoctor.name} · {selectedSlot}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xl font-bold text-saffron">₹{totalDisplay}</p>
                  <button
                    type="button"
                    onClick={() => setRzpModalOpen(false)}
                    className="text-xs text-mint/70 hover:text-white mt-1 inline-flex items-center gap-1"
                  >
                    <X size={13} /> Cancel
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / QR' },
                    { id: 'card', label: 'Card' },
                    { id: 'netbanking', label: 'Netbanking' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setRzpMethod(m.id as any)}
                      className={cn(
                        'py-2 rounded-xl border text-xs font-semibold transition-all',
                        rzpMethod === m.id
                          ? 'border-verdigris bg-mint/40 text-verdigris-deep'
                          : 'border-sage-light bg-bone text-ink-soft'
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {rzpMethod === 'upi' && (
                  <Input
                    label="Test UPI ID"
                    value={rzpUpiId}
                    onChange={e => setRzpUpiId(e.target.value)}
                    hint="Razorpay test mode processes immediately and records your payment in Supabase."
                    required
                  />
                )}
                {rzpMethod === 'card' && (
                  <div className="p-3.5 rounded-xl bg-bone border border-sage-light text-xs text-ink-soft space-y-1">
                    <p className="font-mono font-semibold text-ink">Test Visa Card: 4111 •••• •••• 1111</p>
                    <p>Expiry 12/28 · CVV 123 (Sandbox Authorization)</p>
                  </div>
                )}
                {rzpMethod === 'netbanking' && (
                  <div className="p-3.5 rounded-xl bg-bone border border-sage-light text-xs text-ink-soft">
                    Razorpay Test Netbanking Bank selected (Instant Sandbox Settlement).
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" isLoading={submitting} className="w-full justify-center">
                  Authorize Test Payment · ₹{totalDisplay}
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
