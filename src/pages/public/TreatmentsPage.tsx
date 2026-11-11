import React, { useState } from 'react';
import {
  Search, ArrowRight, User, Building,
  ClipboardCheck, Download, X, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui';

interface PrepChecklist {
  before48h: string[];
  whatToBring: string[];
  postOpHome: string[];
  redFlags: string[];
}

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
  checklist: PrepChecklist;
}

const DEFAULT_CHECKLIST = (name: string): PrepChecklist => ({
  before48h: [
    `Complete prescribed pre-procedure blood panels (CBC, RFT, ECG) 24–48 hours prior to ${name}.`,
    'Review anticoagulants, aspirin, or diabetes tablets with your consultant before fasting.',
    'Follow strict nil-per-oral (nothing by mouth) fasting window of 6–8 hours if sedation/anaesthesia is planned.',
  ],
  whatToBring: [
    'Government photo ID + Relif Care UHID & booking confirmation.',
    'Previous diagnostic CDs/reports, echocardiogram or MRI film, and current medication strip list.',
    'Cashless TPA health card or policy copy (if claiming insurance).',
  ],
  postOpHome: [
    'Keep discharge summary, SOS pain medication schedule, and follow-up date handy on phone.',
    'Keep wound dressing dry and clean; avoid lifting heavy objects until cleared in OPD review.',
    'Maintain hydration and light nutrition as advised by your clinical nutritionist.',
  ],
  redFlags: [
    'Persistent fever above 100.4°F (38°C), chest discomfort, sudden breathlessness, or wound oozing — call ER 24/7 immediately.',
  ],
});

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
    checklist: {
      before48h: [
        'Never stop dual antiplatelets (Aspirin/Clopidogrel/Ticagrelor) without explicit cardiologist direction.',
        'Pause Metformin 24 hours prior if contrast dye angioplasty is scheduled (confirm with physician).',
        'Fast 6 hours prior for planned elective angiogram/angioplasty.',
      ],
      whatToBring: [
        'Prior Coronary Angiogram CD, 2D Echo, ECG strips, and serum Creatinine report.',
        'Active insurance TPA e-card + PAN/Aadhaar for cashless pre-authorisation.',
        'Comfortable front-open cotton garments.',
      ],
      postOpHome: [
        'If radial wrist access was used, avoid lifting >2 kg with that arm for 5 days.',
        'Take antiplatelet medication at the exact same time daily — never skip a dose.',
        'Attend 7-day wound & lipid review in Cardiology OPD.',
      ],
      redFlags: [
        'New chest heaviness, cold sweats, wrist/groin swelling, or breathlessness — call Relif ER +91 22 6900 1066 immediately.',
      ],
    },
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
    checklist: {
      before48h: [
        'Stop herbal supplements, Vitamin E, and blood thinners as instructed during pre-anaesthesia check (PAC).',
        'Shower with antiseptic chlorhexidine wash the night before and morning of surgery.',
        'Complete pre-op 3D CT knee mapping if scheduled for robotic alignment.',
      ],
      whatToBring: [
        'Flat non-slip walking shoes for Day-1 physiotherapy ambulation.',
        'All knee X-rays, bone density (DEXA) scans, and current diabetes/BP medicine list.',
      ],
      postOpHome: [
        'Arrange a raised commode seat, bedside grab bar, and front-wheeled walker before discharge.',
        'Perform ankle pumps and prescribed ice-pack elevation 3 times daily to control swelling.',
        'Continue DVT prophylaxis and physiotherapy schedule strictly.',
      ],
      redFlags: [
        'Calf tightness/redness, fever >100.4°F, or soaking wound drainage — contact Orthopedic Desk immediately.',
      ],
    },
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
    checklist: DEFAULT_CHECKLIST('Neurovascular Stroke Care'),
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
    checklist: DEFAULT_CHECKLIST('Laparoscopic Keyhole Surgery'),
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
    checklist: DEFAULT_CHECKLIST('Oncoplastic Surgery'),
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
    checklist: DEFAULT_CHECKLIST('Pediatric Allergy & Spirometry Visit'),
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
    checklist: DEFAULT_CHECKLIST('Dialysis Session'),
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
    checklist: {
      before48h: [
        'Confirm pre-delivery CBC, Blood Group Crossmatch, Viral Screen & Anaesthesia review are uploaded.',
        'Discuss epidural preference or planned C-section fasting timing with Obstetrician.',
      ],
      whatToBring: [
        'Complete Antenatal File, all anomaly/growth ultrasound scans, and TPA Maternity Card.',
        '2–3 front-button nursing gowns for mother + 4 soft cotton baby wraps, newborn caps, and diapers.',
      ],
      postOpHome: [
        'Arrange postpartum pelvic support belt (if C-section) and follow infant feeding/jaundice check schedule.',
        'Attend newborn vaccination & Day-7 postnatal checkup.',
      ],
      redFlags: [
        'Decreased fetal movement, severe headache/blurred vision, leaking fluid, or heavy bleeding — proceed directly to Gate 3 Maternity ER.',
      ],
    },
  },
];

async function downloadChecklistPDF(item: TreatmentItem) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  let y = 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(16, 38, 31);
  doc.text('RELIF CARE MULTISPECIALTY HOSPITAL', 14, y);
  y += 7;
  doc.setFontSize(11);
  doc.setTextColor(31, 122, 107);
  doc.text(`Pre-Op & Recovery Checklist: ${item.name}`, 14, y, { maxWidth: 180 });
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 75, 68);
  doc.text(`Department: ${item.dept}   |   Lead Specialist: ${item.specialist}   |   Stay: ${item.recovery}`, 14, y, { maxWidth: 180 });
  y += 10;

  const sections: { title: string; lines: string[] }[] = [
    { title: '1. Before Admission (24–48 Hours Prior)', lines: item.checklist.before48h },
    { title: '2. What to Pack & Bring', lines: item.checklist.whatToBring },
    { title: '3. Post-Op Home Recovery Guide', lines: item.checklist.postOpHome },
    { title: '4. When to Call Emergency (+91 22 6900 1066)', lines: item.checklist.redFlags },
  ];

  sections.forEach(sec => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(16, 38, 31);
    doc.text(sec.title, 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(45, 58, 52);
    sec.lines.forEach(line => {
      const wrapped = doc.splitTextToSize(`• ${line}`, 176);
      doc.text(wrapped, 18, y);
      y += wrapped.length * 5 + 1.5;
    });
    y += 4;
  });

  doc.save(`RelifCare-Checklist-${item.id}.pdf`);
}

export function TreatmentsPage() {
  const [search, setSearch] = useState('');
  const [activeDept, setActiveDept] = useState('All');
  const [activeChecklistItem, setActiveChecklistItem] = useState<TreatmentItem | null>(null);

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
              <div className="pt-4 border-t border-sage-light space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-soft">Hospital Stay: <strong className="text-ink">{t.recovery}</strong></span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] font-mono font-semibold text-verdigris">
                    {t.approxCost}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveChecklistItem(t)}
                    className="btn btn-secondary btn-sm justify-center inline-flex items-center gap-1 text-xs"
                  >
                    <ClipboardCheck size={13} /> Prep Checklist
                  </button>
                  <Link
                    to={`/book?department=${encodeURIComponent(t.dept)}`}
                    className="btn btn-primary btn-sm bg-saffron text-ink hover:bg-[var(--saffron-deep)] justify-center inline-flex items-center gap-1 text-xs"
                  >
                    Consult <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-Op & Post-Op Checklist Modal */}
      {activeChecklistItem && (
        <div
          className="fixed inset-0 z-modal bg-[#10261F]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checklist-modal-title"
          onMouseDown={e => {
            if (e.target === e.currentTarget) setActiveChecklistItem(null);
          }}
        >
          <div className="w-full sm:max-w-2xl bg-paper border border-sage-light rounded-t-3xl sm:rounded-3xl shadow-warm-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-bone border-b border-sage-light flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-verdigris">
                  Pre-Op &amp; Discharge Preparation Guide
                </span>
                <h2 id="checklist-modal-title" className="font-display text-xl font-bold text-ink mt-0.5">
                  {activeChecklistItem.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveChecklistItem(null)}
                aria-label="Close checklist modal"
                className="p-2 rounded-full text-ink-soft hover:bg-paper hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="space-y-2">
                <p className="font-mono font-bold uppercase tracking-wider text-verdigris-deep">
                  1. 24–48 Hours Before Procedure
                </p>
                {activeChecklistItem.checklist.before48h.map(line => (
                  <p key={line} className="flex items-start gap-2 text-ink leading-relaxed">
                    <CheckCircle2 size={14} className="text-verdigris flex-shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </p>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-sage-light">
                <p className="font-mono font-bold uppercase tracking-wider text-verdigris-deep">
                  2. Hospital Bag &amp; Documents to Carry
                </p>
                {activeChecklistItem.checklist.whatToBring.map(line => (
                  <p key={line} className="flex items-start gap-2 text-ink leading-relaxed">
                    <CheckCircle2 size={14} className="text-verdigris flex-shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </p>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-sage-light">
                <p className="font-mono font-bold uppercase tracking-wider text-verdigris-deep">
                  3. Post-Op Home Recovery Plan
                </p>
                {activeChecklistItem.checklist.postOpHome.map(line => (
                  <p key={line} className="flex items-start gap-2 text-ink leading-relaxed">
                    <CheckCircle2 size={14} className="text-verdigris flex-shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </p>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--signal-light)] border border-[var(--signal)] space-y-1">
                <p className="font-bold text-[var(--signal-deep)] flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Urgent Warning Signs After Discharge
                </p>
                {activeChecklistItem.checklist.redFlags.map(line => (
                  <p key={line} className="text-[var(--signal-deep)] leading-relaxed">{line}</p>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-bone border-t border-sage-light flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => downloadChecklistPDF(activeChecklistItem)}
                className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
              >
                <Download size={14} /> Download Printable PDF Checklist
              </button>
              <Link
                to={`/book?department=${encodeURIComponent(activeChecklistItem.dept)}`}
                className="btn btn-secondary btn-sm"
              >
                Consult {activeChecklistItem.dept} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

