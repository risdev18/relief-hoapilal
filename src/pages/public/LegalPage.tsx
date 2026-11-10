import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import { DemoBadge } from '@/components/ui';

export function LegalPage() {
  const { page } = useParams<{ page: string }>();

  const title = page === 'privacy' ? 'Privacy Policy & Data Protection (DPDP)' :
                page === 'terms' ? 'Terms of Use & Clinical Protocols' :
                page === 'disclaimer' ? 'Healthcare Disclaimer' :
                page === 'patient-rights' ? 'Patient Rights & Responsibilities Charter' :
                page === 'grievance' ? 'Grievance Redressal Mechanism' : 'Website Cookie Notice';

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Regulatory & Compliance</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">{title}</h1>
          <p className="text-sm text-ink-soft max-w-2xl leading-relaxed">
            Legal, clinical, and data governance policies governing Relif Hospital systems.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding max-w-4xl space-y-8 text-ink-soft leading-relaxed text-sm">
        <div className="p-4 bg-mint border border-sage rounded-xl flex items-start gap-3">
          <AlertCircle className="text-verdigris flex-shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-ink leading-relaxed">
            <strong>Demonstration Notice:</strong> All hospital policies, grievance contacts, and medical disclaimers on this portal are mock architectural specifications for portfolio purposes. No real legally binding charter is constituted.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. Purpose and Scope</h2>
          <p>
            Relif Hospital operates multi-specialty healthcare facilities committed to patient confidentiality and informed consent. This charter adheres to modern digital data governance principles including the Digital Personal Data Protection (DPDP) Act frameworks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. Patient Rights</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Right to humane, considerate, and respectful clinical care.</li>
            <li>Right to complete, understandable information regarding diagnosis, prognosis, and treatment options.</li>
            <li>Right to informed consent prior to any non-emergency surgical procedure.</li>
            <li>Right to privacy during clinical examinations and full confidentiality of medical dossiers.</li>
            <li>Right to receive an itemized, transparent final bill with standard tariff reconciliation.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Data Retention & Electronic Health Records</h2>
          <p>
            Clinical lab data, imaging metadata, and consultation notes are safeguarded through end-to-end encryption. Decryption of sensitive diagnostic archives is permitted strictly to credentialed treating physicians and the authorized patient via OTP authentication.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">4. Grievance Redressal Officer</h2>
          <p>
            Patients or their authorized representatives may file queries with our designated Patient Experience Ombudsperson at <code>grievance@relif.demo</code>.
          </p>
        </section>
      </div>
    </div>
  );
}

