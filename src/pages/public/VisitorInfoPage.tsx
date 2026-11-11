import React from 'react';
import { Clock, Shield, Users, Coffee, Car, Map, Info } from 'lucide-react';

export function VisitorInfoPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Hospital Guidelines</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Visitor Information
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Essential guidelines for visiting relatives and attendants to ensure patient comfort, healing rest, and infection prevention.
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
              <p><strong>General Inpatient:</strong> 4:30 PM - 7:00 PM</p>
              <p><strong>ICU / CCU:</strong> 11:00 AM - 12:00 PM & 5:00 PM - 6:00 PM</p>
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
            <h3 className="font-display font-bold text-ink text-lg">Cafeteria & Dining</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Nutritious vegetarian & non-vegetarian dining located on Lower Ground level. Open from 06:30 AM to 11:00 PM. Outside cooked meals strictly restricted in ICU.
            </p>
          </div>
        </div>

        {/* Floor Map Plan */}
        <div className="bg-bone p-8 rounded-2xl border border-sage-light space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">Hospital Floor Layout (Andheri Main)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-paper rounded-xl border border-sage-light space-y-1">
              <span className="font-mono text-verdigris font-bold">Level 0 (Ground)</span>
              <p className="font-semibold text-ink">Emergency & Diagnostics</p>
              <p className="text-ink-soft">Trauma Bay, Triage, Radiology, 24/7 Pharmacy, Central Reception</p>
            </div>
            <div className="p-4 bg-paper rounded-xl border border-sage-light space-y-1">
              <span className="font-mono text-verdigris font-bold">Level 1</span>
              <p className="font-semibold text-ink">Outpatient OPD & TPA</p>
              <p className="text-ink-soft">Doctor Consultation Pods, Cashless Insurance Desk, Phlebotomy</p>
            </div>
            <div className="p-4 bg-paper rounded-xl border border-sage-light space-y-1">
              <span className="font-mono text-verdigris font-bold">Level 2</span>
              <p className="font-semibold text-ink">Surgical & Critical</p>
              <p className="text-ink-soft">Modular Operation Theatres, Cath-Lab, Post-Op Recovery, Adult ICU</p>
            </div>
            <div className="p-4 bg-paper rounded-xl border border-sage-light space-y-1">
              <span className="font-mono text-verdigris font-bold">Level 3 - 5</span>
              <p className="font-semibold text-ink">Inpatient Rooms</p>
              <p className="text-ink-soft">Twin Sharing, Private Suites, Pediatric Ward, Daycare Oncology</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

