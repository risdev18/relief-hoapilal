import React, { useState } from 'react';
import { Search, ArrowRight, HeartPulse, Brain, Bone, Baby, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, DemoBadge, Badge } from '@/components/ui';

interface TreatmentItem {
  id: string;
  name: string;
  dept: string;
  desc: string;
  recovery: string;
  type: string;
}

const TREATMENTS_DATA: TreatmentItem[] = [
  { id: 'angioplasty', name: 'Coronary Angioplasty & Stenting', dept: 'Cardiology', desc: 'Minimally invasive catheter technique to widen blocked coronary arteries and restore vital myocardial blood supply.', recovery: '1-2 Days Inpatient', type: 'Interventional' },
  { id: 'knee-replacement', name: 'Total Knee Arthroplasty (TKR)', dept: 'Orthopedics', desc: 'Computer-assisted resurfacing of arthritic joint surfaces using titanium bio-compatible implants.', recovery: '3-4 Days Inpatient', type: 'Surgical' },
  { id: 'stroke-thrombolysis', name: 'Acute Stroke Thrombolysis', dept: 'Neurology', desc: 'Emergency clot-dissolving intravenous medication administered within the 4.5-hour golden window.', recovery: 'ICU Triage', type: 'Emergency' },
  { id: 'lap-appendectomy', name: 'Laparoscopic Appendectomy', dept: 'General Surgery', desc: 'Keyhole surgical removal of acute appendicitis with minimal abdominal tissue trauma.', recovery: '24 Hours Daycare', type: 'Minimally Invasive' },
  { id: 'cataract-phaco', name: 'Micro-Incision Cataract Surgery', dept: 'Ophthalmology', desc: 'Ultrasound phacoemulsification with foldable intraocular lens implantation.', recovery: 'Same-day Discharge', type: 'Daycare' },
  { id: 'pediatric-asthma', name: 'Pediatric Asthma & Allergy Management', dept: 'Pediatrics', desc: 'Comprehensive pulmonary function screening, individualized inhaler titration, and environmental trigger mitigation.', recovery: 'OPD Protocol', type: 'Clinical' },
];

export function TreatmentsPage() {
  const [search, setSearch] = useState('');
  const [activeDept, setActiveDept] = useState('All');

  const filtered = TREATMENTS_DATA.filter(t => {
    const matchesDept = activeDept === 'All' ? true : t.dept === activeDept;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Clinical Specialties</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Advanced Treatments & Procedures
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Evidence-backed surgical and medical treatments conducted under stringent infection-controlled protocols.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-paper p-3 rounded-xl border border-sage-light mb-8">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              placeholder="Search treatment or surgical procedure..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['All', 'Cardiology', 'Orthopedics', 'Neurology', 'General Surgery', 'Pediatrics'].map(d => (
              <button
                key={d}
                onClick={() => setActiveDept(d)}
                className={`chip text-xs transition-colors ${
                  activeDept === d
                    ? 'bg-verdigris text-white border-verdigris'
                    : 'bg-paper text-ink hover:bg-bone'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(t => (
            <div key={t.id} className="card p-6 bg-paper border border-sage-light shadow-warm-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="default" size="sm">{t.dept}</Badge>
                  <span className="text-[11px] font-mono text-sage">{t.type}</span>
                </div>
                <h3 className="font-display font-bold text-ink text-lg mb-2">{t.name}</h3>
                <p className="text-xs text-ink-soft leading-relaxed">{t.desc}</p>
              </div>

              <div className="pt-4 border-t border-sage-light flex justify-between items-center text-xs">
                <span className="text-ink-soft">Stay: <strong className="text-ink font-medium">{t.recovery}</strong></span>
                <Link to="/book" className="link-arrow text-verdigris font-semibold flex items-center gap-1">
                  Book Consult <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

