import React, { useState } from 'react';
import { Search, FlaskConical, Scan, Calendar, Download, CheckCircle2, ShieldCheck, Heart, User, Activity, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, DemoBadge, Badge } from '@/components/ui';

interface DiagnosticTest {
  id: string;
  name: string;
  category: 'Pathology' | 'Radiology';
  prep: string;
  sample: string;
  tat: string;
  price: number;
}

const TESTS: DiagnosticTest[] = [
  { id: 't-1', name: 'Complete Blood Count (CBC) with ESR & Platelets', category: 'Pathology', prep: 'No fasting required', sample: 'Whole Blood (EDTA)', tat: '3 Hours', price: 450 },
  { id: 't-2', name: 'Lipid Profile Comprehensive (Cholesterol, Triglycerides, HDL, LDL)', category: 'Pathology', prep: '10-12 hours overnight fasting mandatory', sample: 'Serum', tat: '4 Hours', price: 950 },
  { id: 't-3', name: 'HbA1c Glycated Hemoglobin & Average Blood Glucose', category: 'Pathology', prep: 'No fasting required', sample: 'Whole Blood', tat: '3 Hours', price: 600 },
  { id: 't-4', name: 'Thyroid Profile Comprehensive (T3, T4, Ultrasensitive TSH)', category: 'Pathology', prep: 'Early morning sample preferred', sample: 'Serum', tat: '4 Hours', price: 800 },
  { id: 't-5', name: 'Liver Function Test (LFT) with Enzymes & Bilirubin', category: 'Pathology', prep: '8 hours fasting recommended', sample: 'Serum', tat: '4 Hours', price: 850 },
  { id: 't-6', name: 'Kidney Function Test (KFT) with Creatinine, BUN & Electrolytes', category: 'Pathology', prep: 'Standard hydration', sample: 'Serum', tat: '4 Hours', price: 900 },
  { id: 't-7', name: 'Vitamin D3 (25-OH) & Vitamin B12 Quantitative', category: 'Pathology', prep: 'Overnight fasting', sample: 'Serum', tat: '6 Hours', price: 1600 },
  { id: 't-8', name: 'High-Field 3-Tesla Brain MRI with DWI / MR Angiography', category: 'Radiology', prep: 'Remove metallic implants/jewelry. 4h fasting if contrast is indicated', sample: 'Imaging Scan', tat: '6 Hours', price: 7500 },
  { id: 't-9', name: 'Ultra-Fast 128-Slice High-Resolution Chest CT (HRCT)', category: 'Radiology', prep: 'Loose cotton attire. Breath hold instructions provided', sample: 'Imaging Scan', tat: '4 Hours', price: 4200 },
  { id: 't-10', name: 'High-Resolution 4D Ultrasound Abdomen & Pelvis (USG)', category: 'Radiology', prep: 'Full urinary bladder required (drink 1L water 1h prior)', sample: 'Imaging Scan', tat: 'Immediate', price: 1800 },
  { id: 't-11', name: 'Digital Chest X-Ray (PA & Lateral Views)', category: 'Radiology', prep: 'No prior preparation required', sample: 'Digital Radiography', tat: '1 Hour', price: 650 },
  { id: 't-12', name: 'Color Doppler Echocardiography (2D Echo) with Tissue Imaging', category: 'Radiology', prep: 'Rest 15 mins prior to scan', sample: 'Cardiac Ultrasound', tat: 'Same Day', price: 2400 },
];

const HEALTH_PACKAGES = [
  {
    id: 'pkg-executive',
    name: 'Executive Full Body Health Checkup',
    tag: 'Most Recommended',
    testCount: '68 Parameters',
    testsIncluded: ['Complete Hemogram (CBC)', 'Lipid Profile', 'Liver & Kidney Panels', 'HbA1c & Fasting Glucose', 'Thyroid TSH', 'ECG & Digital Chest X-Ray', 'Physician Consultation'],
    tat: 'Same Day Comprehensive Report',
    price: 3499,
    originalPrice: 6500,
  },
  {
    id: 'pkg-cardiac',
    name: 'Comprehensive Heart Wellness Package',
    tag: 'Cardiac Protection',
    testCount: '45 Parameters',
    testsIncluded: ['High-Sensitivity Troponin-I', 'Lipid Fractionation', '2D Color Doppler Echo', 'Treadmill Stress Test (TMT)', 'hs-CRP & Homocysteine', 'Senior Cardiologist Review'],
    tat: '24 Hours with Diet Advice',
    price: 4999,
    originalPrice: 9200,
  },
  {
    id: 'pkg-senior',
    name: 'Senior Citizen Comprehensive Care (60+)',
    tag: 'Geriatric Focus',
    testCount: '72 Parameters',
    testsIncluded: ['Full Blood & Metabolic Panels', 'Bone Mineral Density (DEXA Scan)', 'Serum Calcium & Vitamin D3', 'Urine Microalbumin', 'USG Whole Abdomen', 'Audiometry & Vision Screen'],
    tat: 'Same Day with Geriatric Counseling',
    price: 3999,
    originalPrice: 7800,
  },
  {
    id: 'pkg-women',
    name: 'Well-Woman Preventive Wellness',
    tag: 'Women’s Health',
    testCount: '58 Parameters',
    testsIncluded: ['Cervical Pap Smear Cytology', 'Bilateral Breast Ultrasound / Mammography', 'Complete Thyroid Profile', 'Iron & Ferritin Binding', 'Pelvic USG & Vitamin Levels', 'Gynecologist Consultation'],
    tat: 'Same Day with Confidential Portal Access',
    price: 3899,
    originalPrice: 7200,
  },
];

export function DiagnosticsPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Pathology' | 'Radiology'>('All');
  const [search, setSearch] = useState('');
  const [bookedMsg, setBookedMsg] = useState<string | null>(null);

  const filtered = TESTS.filter(t => {
    const matchesTab = activeTab === 'All' ? true : t.category === activeTab;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                          t.sample.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleBookTest = (name: string, price: number) => {
    setBookedMsg(`Slot reserved for "${name}" (Demo — ₹${price}). Token registered with NABL sample desk.`);
    setTimeout(() => setBookedMsg(null), 5000);
  };

  return (
    <div className="bg-paper min-h-screen">
      {bookedMsg && (
        <div className="fixed top-20 right-6 z-50 bg-mint border border-sage p-4 rounded-xl shadow-warm-lg text-ink text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="text-verdigris flex-shrink-0" />
          <span className="font-medium">{bookedMsg}</span>
        </div>
      )}

      {/* Hero */}
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">
            NABL-Accredited Pathology & 3-Tesla Imaging
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Diagnostics & Health Packages
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Robotic clinical biochemistry, 128-slice CT, and high-field 3T MRI scans. Direct digital reports linked to your UHID patient records.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding space-y-16">
        {/* Quick Report Access Card */}
        <div className="bg-gradient-to-r from-mint/40 via-bone to-paper p-6 sm:p-8 rounded-2xl border border-sage flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-warm-sm">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-verdigris animate-pulse" />
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-verdigris-deep">
                Patient Report Access (ABHA & UHID)
              </p>
            </div>
            <h2 className="font-display text-2xl font-bold text-ink">
              Already gave a diagnostic sample or scan?
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
              Lab results and digital imaging DICOM files are published to your encrypted Patient Portal as soon as verified by our pathologist.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/patient/records"
              className="btn btn-primary btn-md bg-verdigris text-white hover:bg-verdigris-deep flex items-center gap-2"
            >
              <FileText size={16} />
              View My Reports
            </Link>
            <Link
              to="/patient/login"
              className="btn btn-ghost btn-md border border-sage-light text-xs"
            >
              Patient Login
            </Link>
          </div>
        </div>

        {/* ── Preventive Health Packages ─────────────────────────────── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-1">
                Preventive Care
              </p>
              <h2 className="font-display text-3xl font-bold text-ink">
                Annual Health Screening Packages
              </h2>
            </div>
            <p className="text-xs text-ink-soft max-w-sm">
              Comprehensive doctor-designed wellness panels with overnight fasting guidelines and post-checkup physician review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HEALTH_PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                className="card p-6 bg-paper border border-sage-light rounded-2xl shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="saffron" size="sm">{pkg.tag}</Badge>
                    <span className="text-xs font-mono font-semibold text-verdigris">{pkg.testCount}</span>
                  </div>
                  <h3 className="font-display font-bold text-ink text-lg mb-2">{pkg.name}</h3>
                  <p className="text-xs font-mono text-sage mb-4">{pkg.tat}</p>

                  <div className="space-y-1.5 pt-2 border-t border-sage-light">
                    <p className="text-[11px] font-semibold text-ink uppercase tracking-wider mb-2">Key Inclusions:</p>
                    {pkg.testsIncluded.map(item => (
                      <div key={item} className="flex items-center gap-1.5 text-xs text-ink-soft">
                        <CheckCircle2 size={13} className="text-verdigris flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-sage-light space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-ink">₹{pkg.price}</span>
                    <span className="text-xs text-sage line-through">₹{pkg.originalPrice}</span>
                    <span className="text-xs font-semibold text-verdigris ml-auto">Save {Math.round((1 - pkg.price/pkg.originalPrice) * 100)}%</span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center bg-saffron text-ink hover:bg-[var(--saffron-deep)]"
                    onClick={() => handleBookTest(pkg.name, pkg.price)}
                  >
                    Book Package
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Individual Diagnostic Tests ─────────────────────────────── */}
        <div>
          <div className="mb-6">
            <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-1">
              Individual Tariff
            </p>
            <h2 className="font-display text-3xl font-bold text-ink">
              Pathology & Radiology Test Directory
            </h2>
          </div>

          {/* Search & Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-paper p-4 rounded-xl border border-sage-light mb-6 shadow-warm-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                type="text"
                placeholder="Search test name (e.g., MRI, CBC, Thyroid, CT)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-9 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              {(['All', 'Pathology', 'Radiology'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`chip text-xs font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-verdigris text-white border-verdigris'
                      : 'bg-paper text-ink hover:bg-bone'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Table */}
          <div className="bg-paper rounded-xl border border-sage-light overflow-hidden shadow-warm-sm">
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th className="py-3.5 px-4 text-left">Test Name & Discipline</th>
                    <th className="py-3.5 px-4 text-left">Preparation Instructions</th>
                    <th className="py-3.5 px-4 text-left">Sample / Modality</th>
                    <th className="py-3.5 px-4 text-left">Turnaround</th>
                    <th className="py-3.5 px-4 text-left">Fee (INR)</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-light text-sm">
                  {filtered.map(test => (
                    <tr key={test.id} className="hover:bg-bone/40 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-ink">{test.name}</p>
                        <Badge variant="default" size="sm" className="mt-1">{test.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-ink-soft max-w-xs">{test.prep}</td>
                      <td className="py-3 px-4 text-xs text-ink">{test.sample}</td>
                      <td className="py-3 px-4 text-xs font-mono text-verdigris font-semibold">{test.tat}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-ink">₹{test.price}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleBookTest(test.name, test.price)}
                        >
                          Book Test
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

