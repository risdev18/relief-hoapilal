// LegalPage.tsx — Hospital Regulatory, Terms of Use & Privacy Governance
// Comprehensive Indian Healthcare Compliance (DPDP Act, NABH & Clinical Establishment Standards)

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, FileText, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/config/constants';

export function LegalPage() {
  const { page: rawPage } = useParams<{ page: string }>();
  const page = (rawPage || 'terms').toLowerCase();

  const isPrivacy = page.includes('privac');
  const isRefund = page.includes('refund') || page.includes('cancel');
  const isTerms = page.includes('term');
  const isDisclaimer = page.includes('disclaim');
  const isRights = page.includes('right');
  const isGrievance = page.includes('grievanc');

  const title = isPrivacy
    ? 'Privacy Policy & Patient Data Protection (DPDP)'
    : isRefund
    ? 'Refund & Cancellation Policy'
    : isDisclaimer
    ? 'Healthcare Disclaimer & Emergency Protocols'
    : isRights
    ? 'Patient Rights & Responsibilities Charter'
    : isGrievance
    ? 'Grievance Redressal Mechanism & Ombudsman'
    : 'Terms of Use & Clinical Services Agreement';

  const subtitle = isPrivacy
    ? 'How Relif Care Multispecialty safeguards your electronic health records, diagnostic imaging, and personal health identifiers under the Digital Personal Data Protection (DPDP) Act.'
    : isRefund
    ? 'Clear, transparent cancellation windows, complimentary rescheduling terms, and refund timelines for OPD and Video consultations.'
    : isDisclaimer
    ? 'Important medical guidelines regarding digital triage guidance, online consultations, and emergency protocols.'
    : isRights
    ? 'Our institutional pledge to patient dignity, informed consent, transparent pricing, and quality care standards.'
    : isGrievance
    ? 'Dedicated mechanisms for patients and families to submit clinical, billing, or operational feedback and obtain resolution.'
    : 'Terms and conditions governing clinical consultations, patient portal usage, appointment scheduling, and hospital services.';

  return (
    <div className="bg-paper min-h-screen">
      {/* Editorial Header */}
      <div className="bg-bone py-14 lg:py-18 border-b border-sage-light">
        <div className="section-container max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-verdigris" />
            <span className="font-mono text-xs font-semibold text-verdigris tracking-widest uppercase">
              Hospital Governance & Compliance
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-base text-ink-soft leading-relaxed max-w-3xl">
            {subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink-soft mt-6 pt-4 border-t border-sage-light/60">
            <span>Effective Date: 01 November 2026</span>
            <span>·</span>
            <span>Version: 2.4 (ABDM / NABH Compliant)</span>
            <span>·</span>
            <span className="text-verdigris font-semibold">NABH Accredited Protocol</span>
          </div>
        </div>
      </div>

      {/* Main Legal Content */}
      <div className="section-container max-w-4xl py-12 lg:py-16">
        <div className="space-y-10 text-ink leading-relaxed text-sm">
          {/* Quick Tabs to Other Policies */}
          <div className="flex flex-wrap gap-2 pb-6 border-b border-sage-light">
            {[
              { label: 'Terms of Use', path: '/legal/terms', active: isTerms },
              { label: 'Privacy Policy', path: '/legal/privacy', active: isPrivacy },
              { label: 'Refund & Cancellation', path: '/legal/refund', active: isRefund },
              { label: 'Patient Rights', path: '/legal/patient-rights', active: isRights },
              { label: 'Medical Disclaimer', path: '/legal/disclaimer', active: isDisclaimer },
              { label: 'Grievance Redressal', path: '/legal/grievance', active: isGrievance },
            ].map(tab => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  tab.active
                    ? 'bg-verdigris text-white font-semibold shadow-xs'
                    : 'bg-bone text-ink-soft hover:text-ink hover:bg-mint/40 border border-sage-light'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* ── Terms of Use Content ─────────────────────────────────── */}
          {isTerms && (
            <div className="space-y-8">
              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">1. Acceptance of Terms</h2>
                <p>
                  By accessing or registering with Relif Care Multispecialty ("Relif Hospital"), creating a Patient Portal account, or booking inpatient or outpatient appointments, you acknowledge and agree to be bound by these Terms of Use and all applicable healthcare regulations in India.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">2. Medical Care & Emergency Limitation</h2>
                <p>
                  Online booking, the Care Concierge symptom routing tool, and informational pages provided on this website are for clinical guidance only. They do not constitute emergency medical response. In the event of acute cardiac symptoms, stroke signs, severe trauma, or acute respiratory distress, please call our 24/7 Emergency Helpline immediately at <strong>{APP_CONFIG.emergencyNumber}</strong> or proceed to the nearest emergency room.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">3. Patient Identification & UHID</h2>
                <p>
                  Every registered patient is issued a Unique Hospital Identification (UHID) adhering to Indian National Health Authority (NHA) standards. Patients are responsible for providing authentic identity details (Full Name, Date of Birth, Mobile Number) to ensure safety of medication records and diagnostic report matching.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">4. Appointment Scheduling, Cancellation & Rescheduling</h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>OPD appointments can be scheduled online up to 30 days in advance.</li>
                  <li>Rescheduling or cancellation is permitted up to 2 hours before the scheduled slot without penalty.</li>
                  <li>In the event an attending consultant is urgently called to emergency surgery, the hospital will immediately notify the patient and offer prioritized rescheduling.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">5. Billing, Tariffs & Insurance (TPA)</h2>
                <p>
                  Consultation tariffs and diagnostic investigation charges are transparently displayed in Indian National Rupees (INR). Final inpatient billing adheres to itemized billing norms certified under NABH standards. Cashless mediclaim facilities are subject to pre-authorization approval from the respective TPA / Insurance underwriter.
                </p>
              </section>
            </div>
          )}

          {/* ── Refund & Cancellation Content ────────────────────────────── */}
          {isRefund && (
            <div className="space-y-8">
              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">1. Cancellation & Refund Schedule</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-mint/40 border border-sage">
                    <p className="font-mono text-xs text-verdigris-deep font-bold uppercase">24+ Hours Prior</p>
                    <p className="font-display text-2xl font-bold text-ink mt-1">100% Refund</p>
                    <p className="text-xs text-ink-soft mt-1">Free cancellation with automatic refund initiation.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[var(--saffron-light)] border border-[var(--clay)]">
                    <p className="font-mono text-xs text-[var(--saffron-deep)] font-bold uppercase">2 – 24 Hours Prior</p>
                    <p className="font-display text-2xl font-bold text-ink mt-1">50% Refund</p>
                    <p className="text-xs text-ink-soft mt-1">Half consultation fee refunded to original source.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-bone border border-sage-light">
                    <p className="font-mono text-xs text-ink-soft font-bold uppercase">Under 2 Hours</p>
                    <p className="font-display text-2xl font-bold text-ink mt-1">0% Refund</p>
                    <p className="text-xs text-ink-soft mt-1">Slot held exclusively for your visit; non-refundable.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">2. Complimentary Rescheduling</h2>
                <p>
                  Patients may reschedule any active consultation to another available time slot with the same doctor directly from <strong>My Appointments</strong> at no extra charge.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">3. Settlement Timeline</h2>
                <p>
                  Online Razorpay refunds are initiated immediately upon cancellation and reflect in the patient&apos;s UPI, bank account, or card statement within 5–7 business days.
                </p>
              </section>
            </div>
          )}

          {/* ── Privacy Policy Content ─────────────────────────────────── */}
          {isPrivacy && (
            <div className="space-y-8">
              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">1. Scope of Data Collection</h2>
                <p>
                  Relif Hospital collects and maintains electronic health records (EHR) strictly necessary for patient care:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Demographic and contact identifiers (Name, Mobile, Email, Date of Birth).</li>
                  <li>Clinical history, allergy registries, and prescription protocols.</li>
                  <li>Pathology, radiology imaging metadata, and consultation notes.</li>
                  <li>Ayushman Bharat Health Account (ABHA) IDs when voluntarily linked.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">2. Digital Personal Data Protection (DPDP) Compliance</h2>
                <p>
                  In accordance with the Digital Personal Data Protection Act of India, patient consent is explicit and purpose-limited. Diagnostic reports and health records are stored with 256-bit AES encryption at rest and TLS 1.3 in transit. Relif Hospital will never sell, monetize, or disclose your clinical records to third-party advertisers.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">3. Access to Health Dossiers</h2>
                <p>
                  Patients retain the absolute right to view, download, and export their NABL-certified laboratory reports and prescriptions through the secure Patient Portal using their verified UHID and login credentials.
                </p>
              </section>
            </div>
          )}

          {/* ── Patient Rights Content ─────────────────────────────────── */}
          {isRights && (
            <div className="space-y-8">
              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">Charter of Patient Rights & Responsibilities</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Right to Respect & Dignity:</strong> Every patient receives considerate care regardless of gender, faith, caste, or background.</li>
                  <li><strong>Right to Informed Consent:</strong> Complete clinical explanation of diagnosis, proposed procedures, and alternatives before treatment.</li>
                  <li><strong>Right to Confidentiality:</strong> Privacy during examinations and confidential handling of all clinical data.</li>
                  <li><strong>Right to Itemized Billing:</strong> Clear breakdown of consultation, pharmacy, and hospital bed charges.</li>
                </ul>
              </section>
            </div>
          )}

          {/* ── Disclaimer Content ────────────────────────────────────── */}
          {isDisclaimer && (
            <div className="space-y-8">
              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">Medical Advice Disclaimer</h2>
                <p>
                  Content on this portal, including symptoms guidance in the Care Concierge, is for educational and administrative routing purposes. It does not replace a physical clinical consultation or diagnostic assessment by a registered medical practitioner. In emergency scenarios, call our 24/7 Trauma Helpline: <strong>{APP_CONFIG.emergencyNumber}</strong>.
                </p>
              </section>
            </div>
          )}

          {/* ── Grievance Redressal Content ────────────────────────────── */}
          {isGrievance && (
            <div className="space-y-8">
              <section className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-ink">Patient Experience & Grievance Redressal</h2>
                <p>
                  For any concerns regarding clinical service, nursing care, billing clarity, or hospital facilities:
                </p>
                <div className="p-5 rounded-2xl bg-bone border border-sage space-y-2 font-mono text-xs">
                  <p><strong>Patient Experience Officer:</strong> Mrs. Radhika Desai</p>
                  <p><strong>Email:</strong> ombudsman@relifcare.in</p>
                  <p><strong>Hospital Desk:</strong> +91 22 2630 8000 (Ext. 104)</p>
                  <p><strong>Location:</strong> Ground Floor Administrative Wing, Versova Road, Andheri West, Mumbai</p>
                </div>
              </section>
            </div>
          )}

          {/* Institutional Contact Strip */}
          <div className="p-6 rounded-2xl bg-bone border border-sage-light flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-12">
            <div className="space-y-1">
              <h4 className="font-display font-bold text-ink text-base">Have legal or compliance questions?</h4>
              <p className="text-xs text-ink-soft">Our Clinical Governance Secretariat responds within 24 business hours.</p>
            </div>
            <Link
              to={ROUTES.contact}
              className="px-4 py-2 rounded-full bg-verdigris text-white text-xs font-semibold hover:bg-verdigris-deep transition-colors shadow-xs"
            >
              Contact Hospital Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
