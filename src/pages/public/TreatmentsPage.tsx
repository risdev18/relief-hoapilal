import React, { useState } from 'react';
import { Search, ArrowRight, HeartPulse, Brain, Bone, Baby, Shield, Activity, User, Building, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, DemoBadge, Badge } from '@/components/ui';

interface TreatmentItem {
  id: string;
  name: string;
  dept: string;
  desc: string;
  conditionsTreated: string[];
  specialist: string;
  facility: string;
  recovery: string;
  type: string;
  approxCost: string;
}

const TREATMENTS_DATA: TreatmentItem[] = [
  {
    id: 'angioplasty',
    name: 'Primary & Complex Coronary Angioplasty (PTCA)',
    dept: 'Cardiology',
    desc: 'Catheter-guided balloon expansion and drug-eluting stent placement to open occluded coronary arteries during acute myocardial infarction or chronic angina.',
    conditionsTreated: ['Acute Myocardial Infarction', 'Triple Vessel Disease', 'Unstable Angina', 'Coronary Stenosis'],
    specialist: 'Dr. Priya Sharma & Dr. Vikram Rao',
    facility: 'Philips Azurion Bi-plane Cath Lab with IVUS',
    recovery: '1-2 Days Inpatient',
    type: 'Interventional Cardiology',
    approxCost: '₹1,40,000 – ₹2,20,000 (Insurance Empaneled)',
  },
  {
    id: 'knee-replacement',
    name: 'Robotic Sub-Millimeter Total Knee Arthroplasty (TKR)',
    dept: 'Orthopedics',
    desc: 'Precision robotic-assisted resurfacing of degenerated knee joints using bio-inert cobalt-chromium implants with minimal soft tissue disruption.',
    conditionsTreated: ['End-Stage Osteoarthritis', 'Rheumatoid Arthritis', 'Post-Traumatic Knee Deformity'],
    specialist: 'Dr. Rajesh Kulkarni',
    facility: 'MAKO Stryker Robotic Surgical Suite with Laminar Flow',
    recovery: '3-4 Days Inpatient (Mobilization Day 1)',
    type: 'Robotic Joint Surgery',
    approxCost: '₹1,75,000 – ₹2,60,000',
  },
  {
    id: 'stroke-thrombolysis',
    name: 'Acute Ischemic Stroke Thrombolysis & Mechanical Thrombectomy',
    dept: 'Neurology',
    desc: 'Rapid administration of IV rtPA within 4.5 hours or endovascular clot extraction within 24 hours to reverse neurological ischemic deficits.',
    conditionsTreated: ['Acute Ischemic Stroke', 'Large Vessel Occlusion', 'Transient Ischemic Attack (TIA)'],
    specialist: 'Dr. Sunita Desai',
    facility: '24/7 Stroke Unit with 3T MRI & Neuro-Interventional Cath Lab',
    recovery: '3-5 Days Neuro-ICU & Stepdown',
    type: 'Emergency Neurovascular',
    approxCost: 'Variable / Covered by Cashless Mediclaim',
  },
  {
    id: 'lap-cholecystectomy',
    name: 'Advanced Laparoscopic Cholecystectomy & Hernia Repair',
    dept: 'General Surgery',
    desc: 'High-definition 4K keyhole gallbladder extraction and 3D mesh anatomical hernia repair with minimal scar formation.',
    conditionsTreated: ['Symptomatic Gallstones', 'Cholecystitis', 'Inguinal & Ventral Hernias'],
    specialist: 'Dr. Arun Nair & Surgical Board',
    facility: 'Karl Storz 4K Integrated Minimal Access OT',
    recovery: '24 Hours Day-Care Stay',
    type: 'Minimally Invasive Surgery',
    approxCost: '₹65,000 – ₹95,000',
  },
  {
    id: 'breast-oncoplasty',
    name: 'Comprehensive Cancer Resection & Breast Oncoplasty',
    dept: 'Oncology',
    desc: 'Oncologically safe malignant tumor excision paired with cosmetic tissue rearrangement and sentinel lymph node biopsy.',
    conditionsTreated: ['Early & Locally Advanced Breast Carcinoma', 'Fibroadenoma with Atypia'],
    specialist: 'Dr. Sameer Sen (Onco-Surgeon)',
    facility: 'Tumor Board Integrated Suite & Chemotherapy Day Care',
    recovery: '2-3 Days Inpatient',
    type: 'Surgical Oncology',
    approxCost: 'Empaneled under PM-JAY & Private TPAs',
  },
  {
    id: 'pediatric-asthma',
    name: 'Pediatric Asthma, Allergy & Respiratory Protocol',
    dept: 'Pediatrics',
    desc: 'Pulmonary function testing (oscillometry), allergen panel skin-prick mapping, individualized metered-dose titration, and parental emergency action planning.',
    conditionsTreated: ['Childhood Asthma', 'Allergic Rhinitis', 'Recurrent Bronchiolitis', 'Atopic Dermatitis'],
    specialist: 'Dr. Ananya Joshi',
    facility: 'Child-Friendly Pulmonary Function Lab',
    recovery: 'Day OPD Consultation',
    type: 'Pediatric Pulmonology',
    approxCost: '₹800 Consultation + Diagnostic Tests',
  },
  {
    id: 'kidney-dialysis',
    name: 'High-Flux Hemodialysis & Renal Care Pathway',
    dept: 'Nephrology',
    desc: 'Biocompatible polysulfone dialyzer filtration with ultra-pure RO water systems to manage end-stage renal disease and fluid overload.',
    conditionsTreated: ['Chronic Kidney Disease (CKD Stage 5)', 'Acute Kidney Injury (AKI)', 'Diabetic Nephropathy'],
    specialist: 'Dr. Arvind Joshi',
    facility: '16-Bed Negative-Pressure Dialysis Suite',
    recovery: '4-Hour Outpatient Session',
    type: 'Nephrology Renal Replacement',
    approxCost: '₹1,800 – ₹2,500 per session',
  },
  {
    id: 'high-risk-obstetrics',
    name: 'High-Risk Pregnancy & Painless Labor Delivery (LDRP)',
    dept: 'Gynecology',
    desc: 'Combined epidural analgesia, continuous fetal telemetry, and immediate access to on-site neonatologists in state-of-the-art Birthing Suites.',
    conditionsTreated: ['Gestational Diabetes', 'Preeclampsia', 'Previous Cesarean Section', 'Twin Gestations'],
    specialist: 'Dr. Deepa Krishnan',
    facility: 'Private LDRP (Labor-Delivery-Recovery-Postpartum) Suites & Level 3 NICU',
    recovery: '2-3 Days Inpatient',
    type: 'Obstetrics & Neonatology',
    approxCost: '₹60,000 – ₹1,20,000 Package',
  },
];

export function TreatmentsPage() {
  const [search, setSearch] = useState('');
  const [activeDept, setActiveDept] = useState('All');

  const DEPARTMENTS_LIST = ['All', 'Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'General Surgery', 'Pediatrics', 'Nephrology', 'Gynecology'];

  const filtered = TREATMENTS_DATA.filter(t => {
    const matchesDept = activeDept === 'All' ? true : t.dept === activeDept;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                          t.desc.toLowerCase().includes(search.toLowerCase()) ||
                          t.conditionsTreated.some(c => c.toLowerCase().includes(search.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="bg-paper min-h-screen">
      {/* Hero */}
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">
            Evidence-Based Clinical Procedures
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Advanced Treatments & Procedures
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Multispecialty surgical, interventional, and medical treatments adhering to NABH infection-control protocols with transparent pricing guidance.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding space-y-8">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-paper p-4 rounded-xl border border-sage-light shadow-warm-xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              placeholder="Search by treatment or medical condition (e.g., Angioplasty, Knee, Stroke)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
            {DEPARTMENTS_LIST.map(d => (
              <button
                key={d}
                onClick={() => setActiveDept(d)}
                className={`chip text-xs font-medium whitespace-nowrap transition-colors ${
                  activeDept === d
                    ? 'bg-verdigris text-white border-verdigris'
                    : 'bg-paper text-ink hover:bg-bone border-sage-light'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Treatment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(t => (
            <div
              key={t.id}
              className="card p-6 bg-paper border border-sage-light rounded-2xl shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="default" size="sm">{t.dept}</Badge>
                  <span className="text-[11px] font-mono text-sage">{t.type}</span>
                </div>
                <h3 className="font-display font-bold text-ink text-xl mb-2">{t.name}</h3>
                <p className="text-xs text-ink-soft leading-relaxed mb-3">{t.desc}</p>

                {/* Conditions Treated */}
                <div className="mb-3">
                  <p className="text-[11px] font-semibold text-ink uppercase tracking-wider mb-1.5">
                    Conditions Treated:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {t.conditionsTreated.map(c => (
                      <span key={c} className="text-[11px] px-2 py-0.5 rounded-md bg-bone text-ink-soft border border-sage-light">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specialist & Facility */}
                <div className="space-y-1.5 text-xs text-ink-soft pt-2 border-t border-sage-light">
                  <p className="flex items-center gap-1.5">
                    <User size={13} className="text-verdigris flex-shrink-0" />
                    <span>Specialist: <strong className="text-ink">{t.specialist}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Building size={13} className="text-verdigris flex-shrink-0" />
                    <span>Facility: <span className="text-ink font-medium">{t.facility}</span></span>
                  </p>
                </div>
              </div>

              {/* Bottom details & action */}
              <div className="pt-4 border-t border-sage-light space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-soft">Hospital Stay: <strong className="text-ink">{t.recovery}</strong></span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] font-mono font-semibold text-verdigris">
                    {t.approxCost}
                  </span>
                  <Link
                    to={`/book?department=${encodeURIComponent(t.dept)}`}
                    className="btn btn-primary btn-sm bg-saffron text-ink hover:bg-[var(--saffron-deep)] flex items-center gap-1 text-xs"
                  >
                    Consult Doctor <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

