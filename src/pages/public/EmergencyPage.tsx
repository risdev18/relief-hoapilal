import React, { useEffect, useState } from 'react';
import { Phone, AlertTriangle, ShieldAlert, HeartPulse, Activity, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui';
import { APP_CONFIG } from '@/config/constants';
import { SupabaseService, type BranchQueueMetric } from '@/services/supabaseService';

export function EmergencyPage() {
  const [branchQueues, setBranchQueues] = useState<BranchQueueMetric[]>([]);
  const [donorName, setDonorName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [donorPhone, setDonorPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void SupabaseService.getBranchQueueMetrics().then(setBranchQueues);
  }, []);

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await SupabaseService.submitEnquiry({
        name: donorName.trim(),
        phone: donorPhone.trim(),
        subject: `Blood Donor Registry — ${bloodGroup}`,
        message: `Voluntary blood donor registration for group ${bloodGroup}.`,
      });
      setSubmitted(true);
      setDonorName('');
      setDonorPhone('');
      setTimeout(() => setSubmitted(false), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-paper min-h-screen">
      {/* Signal Emergency Alert Bar */}
      <div className="bg-signal text-white py-3 px-4">
        <div className="section-container flex items-center justify-between text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} />
            <span>24/7 EMERGENCY &amp; TRAUMA DESK — Direct triage hotline {APP_CONFIG.emergencyNumber} · Ambulance {APP_CONFIG.ambulanceNumber}</span>
          </div>
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
        {/* Live ER & Urgent Care Triage Wait Times */}
        {branchQueues.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-verdigris block mb-1">
                  Live Queue &amp; Urgent Care Estimate
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  Emergency Triage Wait Times by Centre
                </h2>
              </div>
              <span className="font-mono text-xs text-ink-soft bg-bone px-3 py-1 rounded-full border border-sage-light">
                Updated from live branch slot load · Life-threatening cases seen immediately
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {branchQueues.map(bq => (
                <div key={bq.branchId} className="card p-5 bg-bone border-sage-light space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-bold text-lg text-ink">{bq.shortName}</p>
                      <p className="text-xs text-ink-soft flex items-start gap-1 mt-0.5">
                        <MapPin size={12} className="text-verdigris flex-shrink-0 mt-0.5" />
                        <span>{bq.address}</span>
                      </p>
                    </div>
                    <span className="font-mono text-[11px] font-bold uppercase px-2.5 py-1 rounded-full bg-mint text-verdigris-deep flex-shrink-0">
                      {bq.erStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-sage-light">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-saffron-deep" />
                      <div>
                        <p className="text-xs text-ink-soft">Est. Urgent Triage</p>
                        <p className="font-mono font-bold text-base text-ink">~{bq.erTriageMinutes} mins</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-ink-soft">Open OPD Today</p>
                      <p className="font-mono font-semibold text-sm text-verdigris-deep">
                        {bq.openSlotsToday} {bq.openSlotsToday === 1 ? 'slot' : 'slots'}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${bq.emergencyPhone}`}
                    className="btn btn-secondary btn-sm w-full justify-center text-xs"
                  >
                    <Phone size={13} /> ER Desk: {bq.emergencyPhone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Ambulance Dispatch Coverage */}
        <div className="bg-bone p-8 rounded-2xl border border-sage-light space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">ALS Ambulance Coverage Across MMR &amp; Pune</h2>
              <p className="text-xs text-ink-soft">GPS-equipped cardiac life-support ambulances stationed at Andheri West, Thane, and Baner.</p>
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
              <p className="text-xs font-mono text-white">24/7 Dispatch Desk · {APP_CONFIG.ambulanceNumber}</p>
              <p className="text-[11px] text-sage">Immediate roadside paramedic &amp; ACLS stabilization</p>
            </div>
          </div>
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
                Thank you! Your voluntary donor registration has been recorded with our blood bank desk.
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
                <Button variant="primary" className="w-full" type="submit" isLoading={submitting}>
                  Enroll in Donor Registry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

