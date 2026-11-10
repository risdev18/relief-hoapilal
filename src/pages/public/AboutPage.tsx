import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Award, Users, Clock, Building } from 'lucide-react';
import { DemoBadge, Button } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';

export function AboutPage() {
  return (
    <div className="bg-paper min-h-screen">
      {/* Hero */}
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">About Relif Hospital</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Care that feels like <em className="italic font-normal text-verdigris">relief</em>.
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Founded with a conviction that hospital visits should replace anxiety with calm clarity. Built on transparent protocols, humane clinical guidance, and uncompromised medical excellence.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding space-y-20">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink mb-4">The Philosophy of De-escalation</h2>
            <p className="text-ink-soft leading-relaxed mb-4">
              Healthcare often overwhelms families with clinical ambiguity, fragmented billing, and cold corridors. At Relif, our systems—from our organic architectural spaces to our transparent digitized patient portals—are engineered to lower blood pressure, not raise it.
            </p>
            <p className="text-ink-soft leading-relaxed mb-6">
              Every procedure has a clearly communicated clinical necessity. Every bill is itemized without hidden fees. Every specialist consult leaves you with actionable understanding rather than fear.
            </p>
            <div className="flex gap-4">
              <div className="p-4 bg-bone rounded-xl border border-sage-light">
                <span className="font-display text-3xl font-bold text-verdigris">150+</span>
                <p className="text-xs text-ink-soft mt-1">Multi-specialty Beds</p>
              </div>
              <div className="p-4 bg-bone rounded-xl border border-sage-light">
                <span className="font-display text-3xl font-bold text-verdigris">40+</span>
                <p className="text-xs text-ink-soft mt-1">Senior Clinicians</p>
              </div>
              <div className="p-4 bg-bone rounded-xl border border-sage-light">
                <span className="font-display text-3xl font-bold text-verdigris">24/7</span>
                <p className="text-xs text-ink-soft mt-1">Emergency Trauma</p>
              </div>
            </div>
          </div>

          <div className="bg-bone p-8 rounded-2xl border border-sage-light relative space-y-6">
            <h3 className="font-display font-semibold text-ink text-xl">Our Journey (Demo Timeline)</h3>
            <div className="space-y-4 border-l-2 border-sage pl-4">
              <div>
                <span className="font-mono text-xs text-verdigris font-bold">2018</span>
                <p className="font-medium text-ink text-sm">Founded in Andheri West</p>
                <p className="text-xs text-ink-soft">Commenced operations with 60 beds and comprehensive cardiac surgery.</p>
              </div>
              <div>
                <span className="font-mono text-xs text-verdigris font-bold">2021</span>
                <p className="font-medium text-ink text-sm">Thane & Pune Specialized OPD Centers</p>
                <p className="text-xs text-ink-soft">Expanded outpatient oncology and sports physiotherapy care.</p>
              </div>
              <div>
                <span className="font-mono text-xs text-verdigris font-bold">2024</span>
                <p className="font-medium text-ink text-sm">Digital Transparency Platform Launch</p>
                <p className="text-xs text-ink-soft">Instant mobile medical records and real-time waiting token queue boards.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div>
          <h2 className="font-display text-3xl font-bold text-ink text-center mb-10">Our Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 space-y-3 bg-paper border border-sage-light">
              <div className="w-10 h-10 rounded-full bg-mint text-verdigris flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-display font-semibold text-ink text-lg">Integrity First</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Zero commissions, zero unnecessary interventions. We recommend surgical admissions strictly on evidence-based global standards.
              </p>
            </div>
            <div className="card p-6 space-y-3 bg-paper border border-sage-light">
              <div className="w-10 h-10 rounded-full bg-mint text-verdigris flex items-center justify-center">
                <Heart size={20} />
              </div>
              <h3 className="font-display font-semibold text-ink text-lg">Empathy by Design</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Hospital environments devoid of stark fluorescent panic. Warm natural tones, quiet consultation pods, and humane support.
              </p>
            </div>
            <div className="card p-6 space-y-3 bg-paper border border-sage-light">
              <div className="w-10 h-10 rounded-full bg-mint text-verdigris flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h3 className="font-display font-semibold text-ink text-lg">Respect for Time</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Predictable queue tracking. Patients are informed of real wait-times rather than stranded in waiting rooms without guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Accreditations & Quality Benchmarks */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase block mb-2">
              National & Global Quality Standards
            </span>
            <h2 className="font-display text-3xl font-bold text-ink">
              Accredited Clinical Rigor
            </h2>
            <p className="text-xs text-ink-soft mt-1">
              Independent benchmarks governing patient safety, infection control, and diagnostic accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'NABH Accredited Hospital',
                desc: 'National Accreditation Board for Hospitals & Healthcare Providers (5th Edition)',
                badge: 'Patient Safety & Rights',
              },
              {
                title: 'NABL Certified Diagnostics',
                desc: 'ISO 15189:2012 certified molecular pathology and robotic automated biochemistry',
                badge: 'Testing Precision',
              },
              {
                title: 'ISO 9001:2015 Quality',
                desc: 'Standardized administrative workflows, sterile supply tracking, and clinical audits',
                badge: 'Management Systems',
              },
              {
                title: 'ABDM & ABHA Aligned',
                desc: 'Ayushman Bharat Digital Health Ecosystem interoperable electronic medical records',
                badge: 'Digital Health Ready',
              },
            ].map(item => (
              <div key={item.title} className="p-6 bg-paper rounded-2xl border border-sage-light shadow-warm-xs space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-verdigris bg-mint px-2 py-0.5 rounded-full inline-block">
                  {item.badge}
                </span>
                <h3 className="font-display font-bold text-ink text-lg">{item.title}</h3>
                <p className="text-xs text-ink-soft leading-relaxed">{item.desc}</p>
                <p className="text-[11px] text-sage pt-2 border-t border-sage-light">
                  Demo certification indicator
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div>
          <h2 className="font-display text-3xl font-bold text-ink mb-8">Clinical & Administrative Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Dr. Priya Sharma', role: 'Medical Director & Chief of Cardiology', qual: 'MBBS, MD, DM (Cardiology), FESC' },
              { name: 'Dr. Rajesh Kulkarni', role: 'Chairman, Surgical Services & Robotic OT', qual: 'MBBS, MS, MCh (Orthopedics)' },
              { name: 'Dr. Arun Nair', role: 'Chief Medical Officer & Clinical Governance', qual: 'MBBS, MD (Internal Medicine), FACP' },
            ].map(l => (
              <div key={l.name} className="card-bone p-5 rounded-2xl border border-sage-light">
                <div className="h-40 bg-mint rounded-xl mb-4 flex items-center justify-center text-verdigris font-display text-4xl font-bold opacity-40">
                  {l.name.split(' ')[1][0]}
                </div>
                <h4 className="font-display font-bold text-ink text-lg">{l.name}</h4>
                <p className="text-xs font-semibold text-verdigris">{l.role}</p>
                <p className="text-xs text-ink-soft mt-1">{l.qual}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

