import React, { useState } from 'react';
import { Clock, Shield, Coffee, Car, MapPin, Accessibility } from 'lucide-react';
import { cn } from '@/utils';

interface CampusWayfinding {
  slug: string;
  name: string;
  gates: { gate: string; label: string; detail: string }[];
  parking: { zone: string; closestWings: string; notes: string }[];
  floors: { level: string; title: string; wings: string }[];
}

const CAMPUSES: CampusWayfinding[] = [
  {
    slug: 'andheri',
    name: 'Andheri West (Flagship)',
    gates: [
      { gate: 'Gate 1', label: 'Emergency & Ambulance Bay', detail: 'Zero-step ramp direct into Ground Floor Triage & Cardiac Cath-Lab.' },
      { gate: 'Gate 2', label: 'Main OPD & Wheelchair Drop-Off', detail: 'Dedicated attendant wheelchair bay beside Central Reception & Elevators.' },
      { gate: 'Gate 3', label: 'Maternity & Pediatric Entrance', detail: 'Quiet north-side covered portico with priority lift to NICU & LDRP.' },
    ],
    parking: [
      { zone: 'Basement P1 (Lift Core A)', closestWings: 'Emergency, Radiology (MRI/CT) & Cardiology OPD', notes: 'Valet & 8 Reserved Handicap Bays adjacent to Lift Core A.' },
      { zone: 'Basement P2 (Lift Core B)', closestWings: 'Surgical Floors, Maternity Suites & Inpatient Wards', notes: 'Direct elevator access without crossing ambulance driveway.' },
    ],
    floors: [
      { level: 'Level 0 (Ground)', title: 'Emergency, Radiology & 24/7 Pharmacy', wings: 'Trauma Bay, 3T MRI, 128-Slice CT, Blood Bank, Central Reception' },
      { level: 'Level 1', title: 'Outpatient OPD & Insurance TPA Desk', wings: 'Cardiology, Neurology, Orthopedics, Phlebotomy, Cashless Helpdesk' },
      { level: 'Level 2', title: 'Surgical Theatres & Critical Care', wings: 'Modular OTs, Bi-plane Cath-Lab, Post-Op Recovery, Adult ICU' },
      { level: 'Levels 3 – 5', title: 'Inpatient Wards & Maternity', wings: 'Private Suites, Twin Sharing, Pediatric Ward, Level-3 NICU' },
    ],
  },
  {
    slug: 'thane',
    name: 'Thane West (Majiwada)',
    gates: [
      { gate: 'East Gate', label: 'Main OPD & Highway Approach', detail: 'Direct service-road access from Eastern Express Highway with covered drop-off.' },
      { gate: 'South Bay', label: 'Oncology Daycare & Wheelchair Entry', detail: 'Step-free gentle ramp straight to Ground Floor Oncology & Dialysis Pods.' },
    ],
    parking: [
      { zone: 'Surface Parking Bay A', closestWings: 'Outpatient OPD & Health Checkup Lounge', notes: '4 Priority Senior-Citizen & Accessibility bays near Entrance.' },
      { zone: 'Side Lot B', closestWings: 'Daycare Chemotherapy & Dialysis Wing', notes: 'Short 25m level walk to South Bay lifts.' },
    ],
    floors: [
      { level: 'Level 0 (Ground)', title: 'Urgent Triage, Daycare Oncology & Pharmacy', wings: 'Infusion Pods, Phlebotomy, 24/7 Pharmacy, Express Reception' },
      { level: 'Level 1', title: 'Preventive Health & Specialist OPD', wings: 'Executive Health Checkup, Cardiology, Pediatrics, Gynecology' },
      { level: 'Level 2', title: 'Dialysis & Diagnostic Imaging', wings: 'Renal Dialysis Suite, Digital X-Ray, 4D Ultrasound, 2D Echo' },
    ],
  },
  {
    slug: 'pune',
    name: 'Baner, Pune',
    gates: [
      { gate: 'North Atrium Gate', label: 'Orthopedics & Mobility Drop-Off', detail: 'Extra-wide wheelchair curb and complimentary mobility scooters on standby.' },
      { gate: 'Emergency Bay', label: '24/7 Trauma & Urgent Care', detail: 'Dedicated ground resuscitation entry off Baner High Street.' },
    ],
    parking: [
      { zone: 'Covered Stilt Parking', closestWings: 'Orthopedic Spine Clinic & Hydrotherapy Rehab', notes: 'Valet assistance free for post-op knee/hip follow-up visits.' },
      { zone: 'Rear Basement Lot', closestWings: 'Diagnostics (DEXA/MRI) & Inpatient Suites', notes: 'Direct hydraulic lift to Level 1 & Level 2 clinics.' },
    ],
    floors: [
      { level: 'Level 0 (Ground)', title: 'Emergency, Ortho Cast Room & Radiology', wings: 'Trauma Triage, DEXA Scan, X-Ray, Physiotherapy & Orthotics Shop' },
      { level: 'Level 1', title: 'Multispecialty OPD & Maternity Care', wings: 'Joint Replacement Clinic, Neurology, OBGYN, General Medicine' },
      { level: 'Level 2', title: 'Day-Surgery & Stepdown Care', wings: 'Arthroscopy Suite, Post-Op Stepdown, Discharge Lounge' },
    ],
  },
];

export function VisitorInfoPage() {
  const [selectedCampusSlug, setSelectedCampusSlug] = useState('andheri');
  const activeCampus = CAMPUSES.find(c => c.slug === selectedCampusSlug) || CAMPUSES[0];

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">
            Hospital Guidelines &amp; Campus Wayfinding
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Visitor &amp; Parking Guide
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Visiting hours, wheelchair drop-off bays, closest wing parking, and floor directories across all three Relif Care centres.
          </p>
        </div>
      </div>

      <div className="section-container section-padding space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 bg-paper border border-sage-light space-y-3">
            <div className="w-10 h-10 rounded-full bg-mint text-verdigris flex items-center justify-center">
              <Clock size={20} />
            </div>
            <h3 className="font-display font-bold text-ink text-lg">Visiting Hours</h3>
            <div className="text-xs text-ink-soft space-y-1 leading-relaxed">
              <p><strong>General Inpatient:</strong> 4:30 PM – 7:00 PM</p>
              <p><strong>ICU / CCU:</strong> 11:00 AM – 12:00 PM &amp; 5:00 PM – 6:00 PM</p>
              <p className="text-verdigris font-semibold pt-1">Only 1 visitor at bedside in ICU.</p>
            </div>
          </div>

          <div className="card p-6 bg-paper border border-sage-light space-y-3">
            <div className="w-10 h-10 rounded-full bg-mint text-verdigris flex items-center justify-center">
              <Shield size={20} />
            </div>
            <h3 className="font-display font-bold text-ink text-lg">Infection Prevention</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Hand sanitization stations are mandatory before entering any patient cubicle. Children under 12 are discouraged in sterile critical areas.
            </p>
          </div>

          <div className="card p-6 bg-paper border border-sage-light space-y-3">
            <div className="w-10 h-10 rounded-full bg-mint text-verdigris flex items-center justify-center">
              <Coffee size={20} />
            </div>
            <h3 className="font-display font-bold text-ink text-lg">Cafeteria &amp; Dining</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Nutritious vegetarian &amp; non-vegetarian dining located on Lower Ground level. Open from 06:30 AM to 11:00 PM. Outside cooked meals restricted in ICU.
            </p>
          </div>
        </div>

        {/* Interactive Campus Wayfinding & Parking Selector */}
        <div className="bg-bone p-6 sm:p-8 rounded-2xl border border-sage-light space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-verdigris">
                Indoor &amp; Parking Wayfinding
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-1">
                {activeCampus.name}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {CAMPUSES.map(c => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setSelectedCampusSlug(c.slug)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                    selectedCampusSlug === c.slug
                      ? 'bg-verdigris text-white border-verdigris'
                      : 'bg-paper text-ink-soft border-sage-light hover:border-verdigris'
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Drop-Off Gates & Parking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-verdigris-deep flex items-center gap-1.5">
                <Accessibility size={14} /> Entry Gates &amp; Wheelchair Drop-Off Zones
              </p>
              {activeCampus.gates.map(g => (
                <div key={g.gate} className="p-4 rounded-xl bg-paper border border-sage-light space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-mint text-verdigris-deep">
                      {g.gate}
                    </span>
                    <span className="font-semibold text-sm text-ink">{g.label}</span>
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed">{g.detail}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-verdigris-deep flex items-center gap-1.5">
                <Car size={14} /> Nearest Parking Lot by Wing
              </p>
              {activeCampus.parking.map(p => (
                <div key={p.zone} className="p-4 rounded-xl bg-paper border border-sage-light space-y-1">
                  <p className="font-semibold text-sm text-ink">{p.zone}</p>
                  <p className="text-xs text-verdigris-deep font-medium">
                    Closest to: {p.closestWings}
                  </p>
                  <p className="text-xs text-ink-soft leading-relaxed">{p.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Floor Directory */}
          <div className="pt-2 space-y-3">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-verdigris-deep flex items-center gap-1.5">
              <MapPin size={14} /> Wing &amp; Floor Directory
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {activeCampus.floors.map(fl => (
                <div key={fl.level} className="p-4 bg-paper rounded-xl border border-sage-light space-y-1">
                  <span className="font-mono text-verdigris font-bold">{fl.level}</span>
                  <p className="font-semibold text-ink">{fl.title}</p>
                  <p className="text-ink-soft leading-relaxed">{fl.wings}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
