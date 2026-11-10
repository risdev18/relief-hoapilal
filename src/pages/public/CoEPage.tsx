import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HeartPulse, Brain, Bone, Sparkles, Activity, ArrowRight } from 'lucide-react';
import { Button, DemoBadge, Badge } from '@/components/ui';

export function CoEPage() {
  const { slug } = useParams<{ slug: string }>();

  const COES = [
    {
      id: 'cardiac-sciences',
      name: 'Centre of Excellence in Cardiac Sciences',
      lead: 'Dr. Priya Sharma (Interventional Cardiologist)',
      highlight: 'Door-to-Balloon in < 60 mins',
      desc: 'Dedicated electrophysiology laboratories, advanced coronary interventions, structural heart valve replacements, and round-the-clock cardiac trauma triage.',
      procedures: ['Primary Coronary Angioplasty', 'Transcatheter Aortic Valve Replacement (TAVR)', 'Pacemaker & ICD Implantation', 'Coronary Artery Bypass Graft (CABG)'],
      icon: HeartPulse,
    },
    {
      id: 'neuro-sciences',
      name: 'Centre of Excellence in Neuro & Spine Care',
      lead: 'Dr. Sunita Desai (Senior Neurologist)',
      highlight: 'Dedicated Acute Stroke Care Pathway',
      desc: 'Multidisciplinary treatment for acute ischemic stroke, neuro-oncology, complex spinal deformities, epilepsy surgery, and neuro-rehabilitation.',
      procedures: ['Endovascular Mechanical Thrombectomy', 'Minimally Invasive Spine Surgery', 'Deep Brain Stimulation (DBS)', 'Complex Cranial Surgery'],
      icon: Brain,
    },
    {
      id: 'orthopedics-sports',
      name: 'Centre of Excellence in Orthopedics & Sports Medicine',
      lead: 'Dr. Rajesh Kulkarni (Joint Replacement Specialist)',
      highlight: 'Robotic Unicompartmental Knee Surgery',
      desc: 'Sub-millimeter prosthetic positioning for total knee and hip replacements alongside arthroscopic ligament reconstructive surgery for elite sports athletes.',
      procedures: ['Robotic Total Knee Replacement', 'Total Hip Arthroplasty', 'ACL & Meniscal Repair', 'Cartilage Resurfacing'],
      icon: Bone,
    },
  ];

  const currentCoE = slug ? COES.find(c => c.id === slug) : null;

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-night py-16 text-white border-b border-night-soft">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris-light tracking-widest uppercase mb-3">Pinnacle Clinical Disciplines</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 text-[#E8F4EF]">
            Centres of Excellence
          </h1>
          <p className="text-lg text-sage max-w-2xl leading-relaxed">
            Concentrated clinical mastery where senior surgical boards, cutting-edge technology, and intensive care converge.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding space-y-12">
        <div className="grid grid-cols-1 gap-8">
          {COES.map(coe => (
            <div key={coe.id} className="card p-8 bg-paper border border-sage-light shadow-warm-md grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-mint text-verdigris flex items-center justify-center">
                    <coe.icon size={24} />
                  </div>
                  <div>
                    <Badge variant="saffron" size="sm">{coe.highlight}</Badge>
                    <h2 className="font-display font-bold text-ink text-2xl mt-1">{coe.name}</h2>
                  </div>
                </div>

                <p className="text-xs text-ink-soft font-medium">Head of Department: <strong className="text-ink">{coe.lead}</strong></p>
                <p className="text-sm text-ink-soft leading-relaxed">{coe.desc}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {coe.procedures.map(p => (
                    <span key={p} className="chip text-xs">{p}</span>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-bone rounded-2xl border border-sage-light flex flex-col justify-between h-full space-y-4 text-center">
                <span className="text-xs font-mono text-sage uppercase tracking-wider">Fast-Track Referral</span>
                <p className="text-xs text-ink-soft">Direct coordination with the department specialist coordinator.</p>
                <Link to="/book" className="btn btn-primary btn-md justify-center">
                  Book Specialist Slot
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

