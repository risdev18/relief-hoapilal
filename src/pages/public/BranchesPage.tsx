import React from 'react';
import { MapPin, Phone, Clock, Navigation, CheckCircle2 } from 'lucide-react';

export function BranchesPage() {
  const BRANCHES = [
    {
      name: 'Relif Hospital — Andheri West (Flagship)',
      type: '150-Bed Tertiary Multispecialty',
      address: 'Plot 42, Versova Link Road, Andheri West, Mumbai, Maharashtra 400053',
      phone: '+91 22 2630 1100',
      emergency: '+91 22 2630 9999',
      hours: '24/7 Emergency & Inpatient · OPD: 08:00 - 20:00',
      features: ['Level-1 Emergency Trauma Bay', 'Cardiac Cath-Lab Suite', '3T MRI & 128-Slice CT', 'Valet Parking Available'],
    },
    {
      name: 'Relif Daycare & Oncology Care — Thane',
      type: 'Specialized Oncology & Outpatient Hub',
      address: 'Majiwada Junction, Eastern Express Highway, Thane West, Maharashtra 400601',
      phone: '+91 22 2540 2200',
      emergency: '+91 22 2540 9999',
      hours: 'OPD & Daycare: 08:00 - 20:00 Daily',
      features: ['Daycare Chemotherapy Pods', 'Preventive Health Checkup Wing', 'Digital Dialysis Suite', 'Direct Highway Access'],
    },
    {
      name: 'Relif Orthopedics & Joint Spine — Pune',
      type: 'Center for Orthopedics & Sports Medicine',
      address: 'Baner High Street, Baner Road, Pune, Maharashtra 411045',
      phone: '+91 20 2720 3300',
      emergency: '+91 20 2720 9999',
      hours: 'OPD & Minor Procedures: 08:00 - 20:00 Daily',
      features: ['Robotic Joint Replacement Clinic', 'Sports Injury Hydrotherapy', 'Digital Bone Densitometry (DEXA)', 'In-house Orthotic Shop'],
    },
  ];

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Regional Network</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Hospital Branches
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Consistently regulated clinical protocols and interconnected digital records across Mumbai, Thane, and Pune.
          </p>
        </div>
      </div>

      <div className="section-container section-padding space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {BRANCHES.map(b => (
            <div key={b.name} className="card p-6 bg-paper border border-sage-light shadow-warm-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono text-verdigris font-semibold">{b.type}</span>
                  <h3 className="font-display font-bold text-ink text-xl mt-1">{b.name}</h3>
                </div>

                <div className="space-y-2 text-xs text-ink-soft">
                  <p className="flex items-start gap-2">
                    <MapPin size={15} className="text-verdigris flex-shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={15} className="text-verdigris flex-shrink-0" />
                    <span>{b.hours}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={15} className="text-signal flex-shrink-0" />
                    <span className="font-mono text-signal font-semibold">ER: {b.emergency}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-sage-light space-y-1.5">
                  {b.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-ink">
                      <CheckCircle2 size={13} className="text-verdigris flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(b.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm w-full inline-flex items-center justify-center gap-2"
              >
                <Navigation size={14} /> Get Directions
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

