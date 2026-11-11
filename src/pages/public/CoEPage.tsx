import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HeartPulse,
  Brain,
  Bone,
  Sparkles,
  Activity,
  ArrowRight,
  ShieldAlert,
  Baby,
  Dna,
  Syringe,
  Microscope,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export function CoEPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const COES = [
    {
      id: 'cardiac-sciences',
      category: 'cardiology',
      name: 'Centre of Excellence in Cardiac Sciences',
      lead: 'Dr. Priya Sharma (Interventional Cardiologist)',
      highlight: 'Door-to-Balloon in < 55 mins',
      bedCount: '45 Intensive Cardiac Beds',
      desc: 'Dedicated bi-plane electrophysiology catheterization laboratories, advanced coronary interventions, transcatheter aortic valve replacements (TAVR), and round-the-clock primary emergency cardiac triage.',
      procedures: [
        'Primary Coronary Angioplasty (24/7 STEMI)',
        'Transcatheter Aortic Valve Replacement (TAVR)',
        '3D Electro-anatomical Mapping & RFA',
        'Minimally Invasive CABG',
        'Permanent Pacemaker & AICD Implantation',
      ],
      icon: HeartPulse,
      tech: 'Philips Azurion Bi-plane Cath Lab · Rotablator · IVUS / OCT',
    },
    {
      id: 'neuro-sciences',
      category: 'neurology',
      name: 'Centre of Excellence in Neuro & Spine Care',
      lead: 'Dr. Sunita Desai (Senior Neurologist)',
      highlight: 'Dedicated Hyper-Acute Stroke Pathway',
      bedCount: '24 Neuro-ICU Beds',
      desc: 'Comprehensive multi-disciplinary care for ischemic stroke, complex cerebral aneurysms, neuro-oncology, spine disc deformities, epilepsy surgery, and neuro-rehabilitation.',
      procedures: [
        'Endovascular Mechanical Thrombectomy',
        'Micro-Neurosurgical Cranial Tumor Resection',
        'Endoscopic Minimally Invasive Spine Surgery',
        'Deep Brain Stimulation (DBS) for Parkinson’s',
        'Stereotactic Radiosurgery',
      ],
      icon: Brain,
      tech: 'Carl Zeiss KINEVO 900 Surgical Microscope · StealthStation Neuronavigation · 3T MRI',
    },
    {
      id: 'oncology-care',
      category: 'oncology',
      name: 'Comprehensive Cancer Centre (Oncology)',
      lead: 'Dr. Sameer Sen (Senior Surgical Oncologist)',
      highlight: 'Multi-Disciplinary Tumor Board',
      bedCount: '35 Specialized Oncology Beds',
      desc: 'Organ-specific cancer surgical care, targeted immunotherapy, clinical chemotherapy infusion suites, and organ-preserving reconstructive oncology under stringent international guidelines.',
      procedures: [
        'Organ-Preserving Breast Oncoplasty',
        'HIPEC Cytoreductive Abdominal Surgery',
        'Day-Care Precision Chemotherapy & Immunotherapy',
        'Head & Neck Microvascular Free Flap Reconstructions',
        'Palliative Pain & Supportive Care',
      ],
      icon: Microscope,
      tech: 'HEPA-Filtered Chemotherapy Preparation Suite · Genetic Oncology Profiling',
    },
    {
      id: 'orthopedics-sports',
      category: 'orthopedics',
      name: 'Centre of Excellence in Orthopedics & Sports Medicine',
      lead: 'Dr. Rajesh Kulkarni (Joint Replacement Specialist)',
      highlight: 'Robotic Sub-Millimeter Arthroplasty',
      bedCount: '40 Orthopedic & Rehab Beds',
      desc: 'Computer-assisted robotic total knee and hip resurfacing, arthroscopic ligament reconstructive surgery for elite sports athletes, and geriatric fracture rehabilitation.',
      procedures: [
        'Robotic Total Knee Replacement (TKR)',
        'Anterior Approach Muscle-Sparing Total Hip Arthroplasty',
        'Arthroscopic ACL & Meniscal Reconstructive Repair',
        'Shoulder Rotator Cuff & Labral Repair',
        'Complex Pelvic-Acetabular Trauma Fixation',
      ],
      icon: Bone,
      tech: 'MAKO Stryker Robotic Arm · High-Definition Storz Arthroscopy Suite',
    },
    {
      id: 'mother-child',
      category: 'mother-child',
      name: 'Institute of Mother & Child Care',
      lead: 'Dr. Deepa Krishnan (Obstetrician & Gynecologist) & Dr. Ananya Joshi (Pediatrician)',
      highlight: 'Level-III Tertiary Neonatal ICU (NICU)',
      bedCount: '20 NICU / PICU Suites',
      desc: 'High-risk pregnancy triage, pain-managed labor suites (LDRP), minimally invasive laparoscopic gynecology, and round-the-clock neonatal intensive care for extremely low birth weight infants.',
      procedures: [
        'High-Risk Pregnancy & Twin Gestation Delivery',
        'Level-III Tertiary Neonatal Resuscitation & Ventilation',
        'Laparoscopic Hysterectomy & Myomectomy',
        'Pediatric Minimally Invasive Surgery',
        'Developmental Pediatric Screening & Vaccinations',
      ],
      icon: Baby,
      tech: 'Giraffe Omnibed Carestations · Nitric Oxide Inhaled Ventilation · Advanced Fetal Monitors',
    },
    {
      id: 'kidney-care',
      category: 'kidney',
      name: 'Institute of Kidney Care & Nephrology',
      lead: 'Dr. Arvind Joshi (Senior Nephrologist & Transplant Physician)',
      highlight: '24/7 Automated Hemodialysis & CRRT',
      bedCount: '16 Dialysis Stations & Dedicated Renal ICU',
      desc: 'Expert medical management for chronic kidney disease (CKD), glomerulonephritis, diabetic nephropathy, biocompatible continuous dialysis, and kidney transplant workup.',
      procedures: [
        'Hemodialysis & Online Hemodiafiltration (HDF)',
        'Continuous Renal Replacement Therapy (CRRT) for Sepsis',
        'AV Fistula Creation & PermCath Placement',
        'Ultrasound-Guided Percutaneous Renal Biopsy',
        'Renal Transplant Donor & Recipient Evaluation',
      ],
      icon: Activity,
      tech: 'Fresenius 5008S Dialysis Systems with Endotoxin Water Filters · Bedside CRRT Machines',
    },
  ];

  const filteredCoEs = selectedCategory === 'all'
    ? COES
    : COES.filter(c => c.category === selectedCategory);

  return (
    <div className="bg-paper min-h-screen">
      {/* Hero */}
      <div className="bg-night py-16 text-white border-b border-night-soft">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris-light tracking-widest uppercase mb-3">
            Pinnacle Clinical Disciplines
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 text-[#E8F4EF]">
            Centres of Excellence
          </h1>
          <p className="text-lg text-sage max-w-3xl leading-relaxed">
            Six high-acuity tertiary disciplines uniting senior medical boards, specialized ICUs, robotic operating theaters, and evidence-guided outcomes.
          </p>
        </div>
      </div>

      <div className="section-container section-padding space-y-10">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-sage-light">
          {[
            { id: 'all', label: 'All 6 Centres' },
            { id: 'cardiology', label: 'Cardiac Sciences' },
            { id: 'neurology', label: 'Neuro & Spine' },
            { id: 'oncology', label: 'Oncology' },
            { id: 'orthopedics', label: 'Orthopedics & Sports' },
            { id: 'mother-child', label: 'Mother & Child' },
            { id: 'kidney', label: 'Kidney Care' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`chip text-xs font-medium transition-all ${
                selectedCategory === tab.id
                  ? 'bg-verdigris text-white border-verdigris shadow-warm-sm'
                  : 'bg-paper text-ink hover:bg-bone border-sage-light'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CoE Cards */}
        <div className="grid grid-cols-1 gap-8">
          {filteredCoEs.map(coe => (
            <div
              key={coe.id}
              className="card p-8 bg-paper border border-sage-light shadow-warm-md grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            >
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-mint text-verdigris flex items-center justify-center flex-shrink-0">
                    <coe.icon size={28} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant="saffron" size="sm">{coe.highlight}</Badge>
                      <span className="text-xs font-mono text-ink-soft bg-bone px-2 py-0.5 rounded-md border border-sage-light">
                        {coe.bedCount}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-ink text-2xl">{coe.name}</h2>
                  </div>
                </div>

                <p className="text-xs text-ink-soft font-medium">
                  Lead Clinical Director: <strong className="text-ink">{coe.lead}</strong>
                </p>
                <p className="text-sm text-ink-soft leading-relaxed">{coe.desc}</p>

                <div>
                  <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                    Key Procedures & Programs:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {coe.procedures.map(p => (
                      <span key={p} className="chip text-xs bg-bone border-sage-light text-ink font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-mint/30 rounded-xl border border-sage/50 text-xs text-ink-soft">
                  <span className="font-semibold text-ink">Advanced Technology: </span>
                  {coe.tech}
                </div>
              </div>

              {/* Action Box */}
              <div className="p-6 bg-bone rounded-2xl border border-sage-light flex flex-col justify-between h-full space-y-4 text-center">
                <div>
                  <span className="text-xs font-mono text-verdigris font-bold uppercase tracking-wider block mb-1">
                    Direct Coordination
                  </span>
                  <h3 className="font-display font-semibold text-ink text-base">Dedicated Case Coordinator</h3>
                  <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                    Prioritized OPD scheduling, pre-surgical financial counseling, and insurance pre-authorization.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    to={`/book?department=${encodeURIComponent(coe.name)}`}
                    className="btn btn-primary btn-md w-full justify-center bg-saffron text-ink hover:bg-[var(--saffron-deep)]"
                  >
                    Book Specialist OPD
                  </Link>
                  <Link
                    to="/contact"
                    className="btn btn-ghost btn-sm w-full justify-center border border-sage-light text-xs"
                  >
                    Request Callback
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

