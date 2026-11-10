// Department Detail Page
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar } from 'lucide-react';
import { DEPARTMENTS, ROUTES } from '@/config/constants';
import { Badge, DemoBadge, AvailabilityDot, SectionHeader } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';

const DEPT_DATA: Record<string, {
  description: string; conditions: string[]; procedures: string[];
  doctors: { name: string; specialty: string; nextSlot: string; availability: 'available' | 'soon' | 'away' }[];
  faqs: { q: string; a: string }[];
}> = {
  'cardiology': {
    description: 'Comprehensive tertiary care for cardiovascular, valvular, and coronary disorders. Featuring bi-plane catheterization labs, 24/7 primary angioplasty, and advanced heart failure pathways.',
    conditions: ['Coronary Artery Disease', 'Acute Myocardial Infarction', 'Arrhythmias & Heart Block', 'Congestive Heart Failure', 'Valvular Heart Disease', 'Refractory Hypertension'],
    procedures: ['Primary Coronary Angioplasty (PTCA)', 'Transcatheter Aortic Valve Replacement (TAVR)', 'Permanent Pacemaker & AICD Implantation', '3D Cardiac Electrophysiology (EP)', 'Color Doppler Echocardiography'],
    doctors: [
      { name: 'Dr. Priya Sharma', specialty: 'Senior Interventional Cardiologist', nextSlot: 'Today 4:30 PM', availability: 'available' },
      { name: 'Dr. Vikram Rao', specialty: 'Cardiac Electrophysiologist', nextSlot: 'Tomorrow 10:00 AM', availability: 'soon' },
    ],
    faqs: [
      { q: 'When should I see a cardiologist immediately?', a: 'Any sudden heavy chest constriction radiating to the left arm or jaw, accompanied by breathlessness or diaphoresis, demands emergency ER triage (Door-to-balloon < 60 mins).' },
      { q: 'What tests should I carry for my first consultation?', a: 'Please bring recent lipid panels, fasting blood sugar, previous ECG strips, and 2D Echo reports.' },
    ],
  },
  'orthopedics': {
    description: 'Robotic-assisted joint reconstructions, sports arthroscopy, spine instrumentation, and geriatric fracture trauma units designed for rapid postoperative mobilization.',
    conditions: ['End-Stage Knee Osteoarthritis', 'Avascular Necrosis of the Hip', 'ACL & Meniscal Sports Tears', 'Rotator Cuff Pathology', 'Cervical & Lumbar Spondylosis'],
    procedures: ['Robotic Total Knee Replacement (TKR)', 'Minimally Invasive Hip Arthroplasty', 'Arthroscopic Shoulder & Knee Repair', 'Complex Fracture Fixation', 'Joint Infiltration Injections'],
    doctors: [
      { name: 'Dr. Rajesh Kulkarni', specialty: 'Chief Robotic Joint Replacement Surgeon', nextSlot: 'Today 3:00 PM', availability: 'available' },
    ],
    faqs: [
      { q: 'How soon can a patient walk following robotic knee replacement?', a: 'Under our muscle-sparing protocols, patients take assisted steps within 6 to 12 hours following surgery.' },
    ],
  },
  'neurology': {
    description: 'Hyper-acute ischemic stroke intervention, neuro-critical monitoring, epilepsy mapping, migraine treatment, and Parkinson’s movement disorder clinics.',
    conditions: ['Acute Ischemic Stroke', 'Epilepsy & Refractory Seizures', 'Parkinson’s Disease', 'Multiple Sclerosis', 'Intractable Migraines'],
    procedures: ['Mechanical Thrombectomy', 'Digital Video EEG & Polysomnography', 'Nerve Conduction Studies & EMG', 'Botox Injections for Spasticity'],
    doctors: [
      { name: 'Dr. Sunita Desai', specialty: 'Chief of Neurosciences & Stroke', nextSlot: 'Tomorrow 10:00 AM', availability: 'available' },
    ],
    faqs: [
      { q: 'What is the golden window for stroke thrombolysis?', a: 'Intravenous clot-busting therapy must be administered within 4.5 hours from the exact onset of symptoms.' },
    ],
  },
  'pediatrics': {
    description: 'Tertiary newborn intensive care (Level-3 NICU), child immunization, growth screening, adolescent wellness, and pediatric respiratory allergy clinics.',
    conditions: ['Childhood Asthma & Bronchiolitis', 'Neonatal Jaundice', 'Pediatric Fevers & Infections', 'Growth & Developmental Delays', 'Nutritional Deficiencies'],
    procedures: ['Tertiary Neonatal Ventilation', 'Vaccination Schedule Administration', 'Pediatric Spirometry & Allergy Panels', 'Well-Baby Health Tracking'],
    doctors: [
      { name: 'Dr. Ananya Joshi', specialty: 'Senior Consultant Pediatrician & Neonatologist', nextSlot: 'Today 5:00 PM', availability: 'available' },
    ],
    faqs: [
      { q: 'What vaccination charts are followed at Relif Hospital?', a: 'We follow the Indian Academy of Pediatrics (IAP) alongside WHO recommended universal immunization guidelines.' },
    ],
  },
  'oncology': {
    description: 'Multi-disciplinary tumor boards, organ-preserving surgical resections, modern systemic chemotherapy, targeted biological therapies, and compassionate palliative support.',
    conditions: ['Breast Carcinoma', 'Head & Neck Malignancies', 'Gastrointestinal & Colorectal Cancer', 'Lung Cancer', 'Gynecological Tumors'],
    procedures: ['Breast Oncoplasty', 'Cytoreductive Surgery & HIPEC', 'Chemotherapy Day-Care Infusion', 'Minimally Invasive Onco-Surgery'],
    doctors: [
      { name: 'Dr. Sameer Sen', specialty: 'Senior Surgical Oncologist', nextSlot: 'Tomorrow 9:30 AM', availability: 'available' },
    ],
    faqs: [
      { q: 'How does the Relif Tumor Board operate?', a: 'Every oncology case is collectively reviewed by surgical oncologists, medical oncologists, radiologists, and pathologists to agree on an evidence-based roadmap.' },
    ],
  },
  'gynecology': {
    description: 'Comprehensive women’s health encompassing pain-managed birthing suites (LDRP), minimally invasive laparoscopic gynecological surgery, fertility workup, and menopausal care.',
    conditions: ['High-Risk Pregnancies', 'Uterine Fibroids & Endometriosis', 'Polycystic Ovarian Syndrome (PCOS)', 'Cervical & Uterine Dysplasia', 'Pelvic Organ Prolapse'],
    procedures: ['Laparoscopic Hysterectomy & Myomectomy', 'Normal & Cesarean Deliveries in LDRP Suites', 'Diagnostic & Operative Hysteroscopy', 'Cervical Pap Smear & Colposcopy'],
    doctors: [
      { name: 'Dr. Deepa Krishnan', specialty: 'Senior Obstetrician & Gynecologist', nextSlot: 'Today 4:00 PM', availability: 'available' },
    ],
    faqs: [
      { q: 'Are epidural painless delivery services available around the clock?', a: 'Yes, our obstetric anesthesia team is stationed 24/7 on our labor and delivery floor.' },
    ],
  },
};

const DEFAULT_DATA = {
  description: 'Our specialists provide expert care using the latest evidence-based treatments. Book an appointment to speak with our team.',
  conditions: ['Condition 1', 'Condition 2', 'Condition 3', 'Condition 4'],
  procedures: ['Procedure 1', 'Procedure 2', 'Procedure 3'],
  doctors: [{ name: 'Dr. Specialist', specialty: 'Specialist', nextSlot: 'Today 4:00 PM', availability: 'available' as const }],
  faqs: [{ q: 'When should I see this specialist?', a: 'If you are experiencing symptoms related to this specialty, speak to your GP about a referral or contact us directly.' }],
};

export function DepartmentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dept = DEPARTMENTS.find(d => d.slug === slug);
  const data = (slug && DEPT_DATA[slug]) ? DEPT_DATA[slug] : DEFAULT_DATA;

  if (!dept) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center">
          <p className="font-mono text-verdigris mb-2">404</p>
          <h1 className="font-display text-4xl font-bold text-ink mb-4">Department not found</h1>
          <Link to={ROUTES.departments} className="btn btn-secondary btn-md">View all departments</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-bone border-b border-sage-light">
        <div className="section-container py-3">
          <nav className="flex items-center gap-2 text-sm text-ink-soft" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-verdigris transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to={ROUTES.departments} className="hover:text-verdigris transition-colors">Departments</Link>
            <ChevronRight size={14} />
            <span className="text-ink font-medium">{dept.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-bone py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Department</p>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">{dept.name}</h1>
              <p className="text-lg text-ink-soft mb-8 max-w-lg">{data.description}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/book?department=${encodeURIComponent(dept.name)}`}
                  className="btn btn-primary btn-md bg-saffron text-ink hover:bg-[var(--saffron-deep)] font-semibold"
                >
                  Book OPD Appointment
                </Link>
                <Link to={ROUTES.doctors} className="btn btn-secondary btn-md">Meet our doctors</Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-mint-light to-bone rounded-3xl h-64 flex items-center justify-center">
                <DemoBadge />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Conditions */}
            <section>
              <h2 className="font-display text-3xl font-semibold text-ink mb-6">Conditions we treat</h2>
              <div className="flex flex-wrap gap-2">
                {data.conditions.map(c => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </div>
            </section>

            {/* Procedures */}
            <section>
              <h2 className="font-display text-3xl font-semibold text-ink mb-6">Procedures & services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.procedures.map(p => (
                  <div key={p} className="flex items-center gap-2 p-3 bg-bone rounded-xl border border-sage-light">
                    <span className="w-2 h-2 rounded-full bg-verdigris flex-shrink-0" />
                    <span className="text-sm font-medium text-ink">{p}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Doctors */}
            <section>
              <h2 className="font-display text-3xl font-semibold text-ink mb-6">Our specialists</h2>
              <div className="space-y-4">
                {data.doctors.map(doc => (
                  <div key={doc.name} className="card p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center flex-shrink-0">
                        <span className="font-display font-bold text-verdigris">{doc.name.split(' ')[1]?.[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{doc.name}</p>
                        <p className="text-sm text-ink-soft">{doc.specialty}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <AvailabilityDot status={doc.availability} />
                          <span className="text-sm font-medium text-verdigris">{doc.nextSlot}</span>
                        </div>
                      </div>
                    </div>
                    <Link to={ROUTES.book} className="btn btn-primary btn-sm flex-shrink-0">Book slot</Link>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="font-display text-3xl font-semibold text-ink mb-6">Frequently asked questions</h2>
              <div className="space-y-4">
                {data.faqs.map((faq, i) => (
                  <details key={i} className="card p-5 group">
                    <summary className="font-semibold text-ink cursor-pointer list-none flex items-center justify-between">
                      {faq.q}
                      <ChevronRight size={18} className="text-sage group-open:rotate-90 transition-transform flex-shrink-0 ml-3" />
                    </summary>
                    <p className="mt-3 text-ink-soft leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6 sticky top-24">
              <h3 className="font-display text-xl font-semibold text-ink mb-4">Book an appointment</h3>
              <RelifLine variant="section" color="var(--verdigris)" strokeWidth={1.5} className="mb-4" />
              <p className="text-sm text-ink-soft mb-5">Speak with one of our {dept.name} specialists. Slots available today.</p>
              <Link to={ROUTES.book} className="btn btn-primary btn-md w-full justify-center">Book Appointment</Link>
              <div className="mt-4 pt-4 border-t border-sage-light">
                <p className="text-xs text-ink-soft">Need urgent care?</p>
                <a href="/emergency" className="text-sm font-medium text-signal hover:underline">Go to Emergency →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

