import React, { useState } from 'react';
import { Phone, MapPin, AlertTriangle, ShieldAlert, HeartPulse, Activity } from 'lucide-react';
import { Button, DemoBadge } from '@/components/ui';
import { APP_CONFIG } from '@/config/constants';

export function EmergencyPage() {
  const [donorName, setDonorName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [donorPhone, setDonorPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="bg-paper min-h-screen">
      {/* Signal Emergency Alert Bar */}
      <div className="bg-signal text-white py-3 px-4">
        <div className="section-container flex items-center justify-between text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} />
            <span>CRITICAL EMERGENCY NOTICE — DEMO MODE. Numbers below are simulated placeholders.</span>
          </div>
          <span className="demo-badge bg-white/20 text-white border-white/30">Demo Only</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-night py-16 text-white border-b border-night-soft">
        <div className="section-container">
          <span className="font-mono text-xs tracking-widest uppercase text-signal font-bold block mb-3">24/7 Rapid Response Centre</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 text-[#E8F4EF]">Emergency & Trauma Care</h1>
          <p className="text-lg text-sage max-w-2xl leading-relaxed">
            Zero-delay triage protocol. Dedicated cardiac cath-lab, stroke neurologists, and poly-trauma operating theatres on standby 24 hours a day, 365 days a year.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`tel:${APP_CONFIG.emergencyNumber}`}
              className="btn btn-emergency btn-lg flex items-center gap-2 shadow-warm-lg"
            >
              <Phone size={20} />
              <span>Call Emergency {APP_CONFIG.emergencyNumber}</span>
            </a>
            <a
              href={`tel:${APP_CONFIG.ambulanceNumber}`}
              className="btn bg-night-soft text-white hover:bg-night-muted border border-sage btn-lg flex items-center gap-2"
            >
              <span>🚑 Dispatch Ambulance</span>
            </a>
          </div>
        </div>
      </div>

      <div className="section-container section-padding space-y-16">
        {/* Triage Protocol Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 border-l-4 border-l-signal space-y-3 bg-paper">
            <div className="flex items-center gap-2 text-signal font-display font-bold text-lg">
              <HeartPulse size={20} />
              <span>Chest Pain & Cardiac Triage</span>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Immediate 12-lead ECG completed within 5 minutes of arrival. Direct transfer to cath-lab for door-to-balloon angioplasty under 60 minutes.
            </p>
          </div>
          <div className="card p-6 border-l-4 border-l-signal space-y-3 bg-paper">
            <div className="flex items-center gap-2 text-signal font-display font-bold text-lg">
              <Activity size={20} />
              <span>Acute Stroke Code</span>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Rapid CT/MRI brain screening protocol. On-site thrombolytic therapy within the golden window for acute ischemic stroke.
            </p>
          </div>
          <div className="card p-6 border-l-4 border-l-signal space-y-3 bg-paper">
            <div className="flex items-center gap-2 text-signal font-display font-bold text-lg">
              <AlertTriangle size={20} />
              <span>Major Poly-Trauma</span>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Level-1 multi-disciplinary trauma surgical response. Resuscitation bays equipped with fluid warmers and instant cross-matched blood supply.
            </p>
          </div>
        </div>

        {/* Live Ambulance Tracking Demo */}
        <div className="bg-bone p-8 rounded-2xl border border-sage-light space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="demo-badge">Simulation Mode</span>
              <h2 className="font-display text-2xl font-bold text-ink mt-2">Ambulance GPS Dispatch Simulation</h2>
              <p className="text-xs text-ink-soft">Simulated real-time vehicle telemetry along emergency corridor.</p>
            </div>
          </div>

          <div className="w-full h-44 rounded-xl bg-night relative overflow-hidden flex items-center justify-center border border-night-soft">
            <div className="absolute inset-0 opacity-15">
              <svg width="100%" height="100%">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8FB5A3" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            <div className="relative text-center space-y-2">
              <div className="inline-block p-3 rounded-full bg-signal text-white animate-pulse">
                🚑
              </div>
              <p className="text-xs font-mono text-white">Ambulance Unit #RH-04 En-route (Demo Telemetry)</p>
              <p className="text-[11px] text-sage">Estimated Transit: 7 mins to Andheri Trauma Bay</p>
            </div>
          </div>
          <p className="text-[11px] text-ink-soft italic">
            * Disclaimer: This visual tracker is an architectural demo. Do not rely on this web application for live patient dispatch.
          </p>
        </div>

        {/* Blood Bank Donation Registry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold text-ink">Emergency Blood Reserve</h2>
            <p className="text-ink-soft text-sm leading-relaxed">
              Our in-house transfusion medicine unit maintains 24/7 cold-chain supply for critical surgeries. Voluntary donors form the backbone of trauma survival.
            </p>
            <div className="grid grid-cols-4 gap-2 pt-2">
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                <div key={b} className="p-3 bg-bone rounded-xl border border-sage-light text-center">
                  <span className="font-mono text-base font-bold text-ink">{b}</span>
                  <p className="text-[10px] text-verdigris font-semibold mt-0.5">Available</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-paper p-6 rounded-2xl border border-sage-light shadow-warm-sm space-y-4">
            <h3 className="font-display font-semibold text-ink text-lg">Voluntary Donor Registration</h3>
            <p className="text-xs text-ink-soft">Get contacted solely when your specific blood subgroup is desperately needed.</p>

            {submitted ? (
              <div className="p-4 bg-mint border border-sage text-verdigris-deep rounded-xl text-sm font-medium">
                Thank you! Your demo voluntary registration has been recorded in our simulated blood directory.
              </div>
            ) : (
              <form onSubmit={handleDonorSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Donor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={donorName}
                    onChange={e => setDonorName(e.target.value)}
                    className="input text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={e => setBloodGroup(e.target.value)}
                      className="input text-sm"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={donorPhone}
                      onChange={e => setDonorPhone(e.target.value)}
                      className="input text-sm"
                    />
                  </div>
                </div>
                <Button variant="primary" className="w-full" type="submit">
                  Enroll in Donor Registry (Demo)
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

