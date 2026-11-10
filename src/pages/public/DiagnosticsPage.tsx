import React, { useState } from 'react';
import { Search, FlaskConical, Scan, Calendar, Download, CheckCircle2 } from 'lucide-react';
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
  { id: 't-1', name: 'Complete Blood Count (CBC) with ESR', category: 'Pathology', prep: 'No fasting required', sample: 'Whole Blood (EDTA)', tat: '3 Hours', price: 450 },
  { id: 't-2', name: 'Lipid Profile Comprehensive', category: 'Pathology', prep: '10-12 hours overnight fasting mandatory', sample: 'Serum', tat: '4 Hours', price: 950 },
  { id: 't-3', name: 'HbA1c Glycated Hemoglobin', category: 'Pathology', prep: 'No fasting required', sample: 'Whole Blood', tat: '3 Hours', price: 600 },
  { id: 't-4', name: 'Thyroid Profile Total (T3, T4, TSH)', category: 'Pathology', prep: 'Morning sample preferred', sample: 'Serum', tat: '4 Hours', price: 800 },
  { id: 't-5', name: 'MRI Brain with Contrast (3-Tesla)', category: 'Radiology', prep: 'Remove metallic items. 4h fasting for contrast', sample: 'Imaging', tat: '6 Hours', price: 7500 },
  { id: 't-6', name: 'High-Resolution Chest CT (HRCT)', category: 'Radiology', prep: 'Wear loose clothing. No fasting', sample: 'Imaging', tat: '4 Hours', price: 4200 },
  { id: 't-7', name: 'Ultrasound Abdomen & Pelvis (USG)', category: 'Radiology', prep: 'Full urinary bladder required', sample: 'Imaging', tat: 'Immediate', price: 1800 },
  { id: 't-8', name: 'Digital Chest X-Ray (PA View)', category: 'Radiology', prep: 'No preparation', sample: 'Imaging', tat: '1 Hour', price: 600 },
];

export function DiagnosticsPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Pathology' | 'Radiology'>('All');
  const [search, setSearch] = useState('');
  const [bookedMsg, setBookedMsg] = useState<string | null>(null);

  const filtered = TESTS.filter(t => {
    const matchesTab = activeTab === 'All' ? true : t.category === activeTab;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleBookTest = (name: string) => {
    setBookedMsg(`Slot reserved for ${name} (Demo). Report will populate Patient Portal.`);
    setTimeout(() => setBookedMsg(null), 4000);
  };

  return (
    <div className="bg-paper min-h-screen">
      {bookedMsg && (
        <div className="fixed top-20 right-6 z-50 bg-mint border border-sage p-4 rounded-xl shadow-warm-md text-ink text-sm flex items-center gap-2">
          <CheckCircle2 size={16} className="text-verdigris" />
          <span>{bookedMsg}</span>
        </div>
      )}

      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Pathology & Imaging Services</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Diagnostics Directory
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            NABL-accredited robotic clinical pathology and high-field 3T radiology scans. Precision sampling with rapid digital turnaround.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding space-y-8">
        {/* Search & Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-paper p-4 rounded-xl border border-sage-light">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              placeholder="Search lab test or radiology procedure..."
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
                className={`chip text-xs transition-colors ${
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
                  <th className="py-3 px-4">Test Name & Category</th>
                  <th className="py-3 px-4">Patient Preparation</th>
                  <th className="py-3 px-4">Sample Specimen</th>
                  <th className="py-3 px-4">Turnaround</th>
                  <th className="py-3 px-4">Tariff</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(test => (
                  <tr key={test.id}>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-ink text-sm">{test.name}</p>
                      <Badge variant="default" size="sm" className="mt-0.5">{test.category}</Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-ink-soft max-w-xs">{test.prep}</td>
                    <td className="py-3 px-4 text-xs text-ink">{test.sample}</td>
                    <td className="py-3 px-4 text-xs font-mono text-verdigris font-semibold">{test.tat}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-ink">₹{test.price}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="secondary" size="sm" onClick={() => handleBookTest(test.name)}>
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
  );
}

