import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Navigation, CheckCircle2, Car } from 'lucide-react';
import { SupabaseService, type BranchQueueMetric } from '@/services/supabaseService';
import { ROUTES } from '@/config/constants';

const BRANCH_EXTRAS: Record<string, { type: string; features: string[]; parking: string }> = {
  andheri: {
    type: '150-Bed Tertiary Multispecialty',
    features: ['Level-1 Emergency Trauma Bay', 'Cardiac Cath-Lab Suite', '3T MRI & 128-Slice CT', '24/7 Pharmacy & Blood Bank'],
    parking: 'Gate 2 Basement P1/P2 + Zero-Step Wheelchair Drop-Off at Gate 1 ER',
  },
  thane: {
    type: 'Specialty Outpatient & Oncology Daycare',
    features: ['Daycare Chemotherapy Pods', 'Preventive Health Checkup Wing', 'Dialysis Suite', 'Direct Eastern Express Highway Access'],
    parking: 'Ground Level Visitor Bay B + Dedicated Oncology Drop-Off',
  },
  pune: {
    type: 'Orthopedics, Spine & Multispecialty',
    features: ['Robotic Joint Replacement Clinic', 'Sports Injury Rehab', 'Digital Bone Densitometry (DEXA)', 'In-house Orthotic Desk'],
    parking: 'Baner High Street Covered Valet + Ground Mobility Ramp',
  },
};

export function BranchesPage() {
  const [branchMetrics, setBranchMetrics] = useState<BranchQueueMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void SupabaseService.getBranchQueueMetrics().then(data => {
      setBranchMetrics(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Regional Network</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Hospital Branches
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Connected clinical protocols, live urgent-care wait visibility, parking guidance, and unified digital records across Mumbai, Thane, and Pune.
          </p>
        </div>
      </div>

      <div className="section-container section-padding space-y-8">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="card p-6 h-80 bg-bone animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {branchMetrics.map(b => {
              const extra = BRANCH_EXTRAS[b.branchSlug] || BRANCH_EXTRAS.andheri;
              return (
                <div key={b.branchId} className="card p-6 bg-paper border border-sage-light shadow-warm-sm flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-verdigris font-semibold">{extra.type}</span>
                        <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-mint text-verdigris-deep">
                          ER ~{b.erTriageMinutes}m
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-ink text-xl mt-1">{b.branchName}</h3>
                    </div>

                    <div className="space-y-2 text-xs text-ink-soft">
                      <p className="flex items-start gap-2">
                        <MapPin size={15} className="text-verdigris flex-shrink-0 mt-0.5" />
                        <span>{b.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock size={15} className="text-verdigris flex-shrink-0" />
                        <span>{b.timings}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={15} className="text-saffron-deep flex-shrink-0" />
                        <span className="font-mono text-ink font-semibold">ER: {b.emergencyPhone}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Car size={15} className="text-verdigris flex-shrink-0 mt-0.5" />
                        <span>{extra.parking}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-sage-light space-y-1.5">
                      {extra.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-ink">
                          <CheckCircle2 size={13} className="text-verdigris flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(b.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm justify-center inline-flex items-center gap-1.5"
                    >
                      <Navigation size={13} /> Directions
                    </a>
                    <Link
                      to={ROUTES.visitorInfo}
                      className="btn btn-primary btn-sm justify-center"
                    >
                      Campus Map
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
