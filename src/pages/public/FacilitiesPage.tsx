import React from 'react';
import { Microscope, Stethoscope, HeartPulse, Shield, Wind, Sparkles, Building2, Flame } from 'lucide-react';
import { DemoBadge } from '@/components/ui';

export function FacilitiesPage() {
  const FACILITIES = [
    {
      title: 'Laminar Flow Modular OTs',
      desc: '6 state-of-the-art modular surgical suites with HEPA class-100 positive pressure airflow to ensure absolute sterility for neuro and cardiac surgeries.',
      icon: Microscope,
    },
    {
      title: '3-Tesla Wide-Bore MRI & 128-Slice CT',
      desc: 'Ultra-low radiation multi-slice computed tomography and high-field magnetic resonance imaging ensuring sub-millimeter diagnostic accuracy.',
      icon: HeartPulse,
    },
    {
      title: 'Level-3 Adult & Neonatal ICUs',
      desc: '24/7 dedicated intensivist coverage, advanced mechanical ventilation, invasive hemodynamic monitoring, and ECMO readiness.',
      icon: Wind,
    },
    {
      title: 'Robotic & Laparoscopic Surgical Suites',
      desc: 'Minimally invasive keyhole surgical systems enabling shorter hospital stays, micro-incisions, and expedited postoperative rehabilitation.',
      icon: Sparkles,
    },
    {
      title: 'Automated 24/7 Pathology & Blood Bank',
      desc: 'Fully robotic clinical biochemistry, molecular PCR analysis, and continuous temperature-tracked cold chain blood component storage.',
      icon: Stethoscope,
    },
    {
      title: 'Daycare Chemotherapy & Dialysis Pods',
      desc: 'Ergonomic infusion bays with private entertainment terminals and dedicated nephrology and oncology nursing support.',
      icon: Building2,
    },
  ];

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Clinical Infrastructure</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            World-class tools, <em className="italic font-normal text-verdigris">calm</em> execution.
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Every square foot of our hospital is designed around infection control, patient dignity, and technological precision.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACILITIES.map(f => (
            <div key={f.title} className="card p-6 bg-paper border border-sage-light shadow-warm-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-mint text-verdigris flex items-center justify-center">
                <f.icon size={22} />
              </div>
              <h3 className="font-display font-bold text-ink text-lg">{f.title}</h3>
              <p className="text-xs text-ink-soft leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

