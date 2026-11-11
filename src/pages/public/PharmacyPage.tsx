import React, { useState } from 'react';
import { Pill, Clock, Phone, AlertCircle, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';

export function PharmacyPage() {
  const [requested, setRequested] = useState(false);

  const handleRefill = (e: React.FormEvent) => {
    e.preventDefault();
    setRequested(true);
    setTimeout(() => setRequested(false), 4000);
  };

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">24/7 Dispensary</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Hospital Pharmacy
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Temperature-controlled clinical dispensary dispensing authentic formulations, emergency cardiac drugs, and oncology injectables.
          </p>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold text-ink">Dispensing Standards</h2>
            <p className="text-sm text-ink-soft leading-relaxed">
              Every prescription undergoes a double-check pharmacist verification to safeguard against contraindications and duplicate therapy.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-bone rounded-xl border border-sage-light flex items-center gap-3">
                <Clock className="text-verdigris" size={24} />
                <div>
                  <p className="font-semibold text-ink text-sm">24/7 Inpatient & Outpatient Service</p>
                  <p className="text-xs text-ink-soft">Located at Ground Floor, adjacent to Emergency Trauma bay.</p>
                </div>
              </div>
              <div className="p-4 bg-bone rounded-xl border border-sage-light flex items-center gap-3">
                <AlertCircle className="text-signal" size={24} />
                <div>
                  <p className="font-semibold text-ink text-sm">Strict Prescription Mandate</p>
                  <p className="text-xs text-ink-soft">Schedule H and X drugs dispensed exclusively upon valid registered physician prescription.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Refill Form */}
          <div className="bg-paper p-8 rounded-2xl border border-sage-light shadow-warm-md space-y-4">
            <h3 className="font-display font-bold text-ink text-xl">Prescription Refill Request</h3>
            <p className="text-xs text-ink-soft">Reserve your repeat chronic medications before visiting the dispensary counter.</p>

            {requested ? (
              <div className="p-4 bg-mint border border-sage text-verdigris-deep rounded-xl text-sm font-medium flex items-center gap-2">
                <CheckCircle size={18} />
                <span>Refill request forwarded to hospital dispensary desk.</span>
              </div>
            ) : (
              <form onSubmit={handleRefill} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Patient Name</label>
                  <input type="text" required placeholder="Full Name" className="input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">UHID / Patient ID</label>
                  <input type="text" required placeholder="e.g. RH260192" className="input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Prescription Medication Names</label>
                  <textarea rows={3} required placeholder="List medicines and dosages..." className="input text-sm resize-none" />
                </div>
                <Button variant="primary" className="w-full" type="submit">
                  Submit Refill Order
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

