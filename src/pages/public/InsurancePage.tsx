import React, { useState } from 'react';
import { Calculator, Download, CheckCircle, FileText, HelpCircle, Shield } from 'lucide-react';
import { Button, DemoBadge, Badge } from '@/components/ui';

export function InsurancePage() {
  const [procedure, setProcedure] = useState('Angioplasty (Single Stent)');
  const [roomType, setRoomType] = useState('Semi-Private (Twin Sharing)');
  const [estimate, setEstimate] = useState<number | null>(null);

  const calculateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    let base = 75000;
    if (procedure.includes('Angioplasty')) base = 160000;
    if (procedure.includes('Knee Replacement')) base = 210000;
    if (procedure.includes('Normal Delivery')) base = 55000;
    if (procedure.includes('Appendectomy')) base = 65000;

    let roomMultiplier = 1.0;
    if (roomType.includes('Private Single')) roomMultiplier = 1.35;
    if (roomType.includes('Deluxe Suite')) roomMultiplier = 1.8;

    setEstimate(Math.round(base * roomMultiplier));
  };

  return (
    <div className="bg-paper min-h-screen">
      {/* Hero */}
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Transparency & Empanelment</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Know the cost <em className="italic font-normal text-verdigris">before</em> you walk in.
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Financial ambiguity has no place in healing. Transparent package pricing, cashless TPA assistance desks, and verified insurance estimates.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding space-y-16">
        {/* Cost Estimator */}
        <div className="bg-paper p-8 rounded-2xl border border-sage-light shadow-warm-md grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="text-verdigris" size={20} />
              <h2 className="font-display text-2xl font-bold text-ink">Treatment Cost Estimator</h2>
            </div>
            <p className="text-sm text-ink-soft mb-6 leading-relaxed">
              Calculate indicative charges for planned procedures including standard surgeon fees, theatre charges, and bed tariffs.
            </p>

            <form onSubmit={calculateEstimate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1">Select Procedure</label>
                <select
                  value={procedure}
                  onChange={e => setProcedure(e.target.value)}
                  className="input text-sm"
                >
                  <option>Angioplasty (Single Stent)</option>
                  <option>Total Knee Replacement (Unilateral)</option>
                  <option>Laparoscopic Appendectomy</option>
                  <option>Normal Maternity Delivery</option>
                  <option>C-Section Maternity Delivery</option>
                  <option>Cataract Micro-Surgery (Phaco)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1">Room Category</label>
                <select
                  value={roomType}
                  onChange={e => setRoomType(e.target.value)}
                  className="input text-sm"
                >
                  <option>General Ward (4-bed)</option>
                  <option>Semi-Private (Twin Sharing)</option>
                  <option>Private Single Room</option>
                  <option>Deluxe Suite</option>
                </select>
              </div>

              <Button variant="primary" type="submit" className="w-full">
                Calculate Indicative Cost
              </Button>
            </form>
          </div>

          <div className="p-6 bg-bone rounded-2xl border border-sage-light flex flex-col items-center justify-center text-center space-y-4">
            {estimate ? (
              <>
                <span className="text-xs font-mono text-sage uppercase tracking-wider">Indicative Package Total</span>
                <span className="font-display text-4xl sm:text-5xl font-bold text-ink">
                  ₹{estimate.toLocaleString('en-IN')}
                </span>
                <p className="text-xs text-ink-soft max-w-sm">
                  Includes 3-day admission, nursing, standard consumable allowance and clinical consultant rounds.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download size={14} />}
                  onClick={() => alert('Demo PDF cost breakdown sheet generated.')}
                >
                  Download PDF Estimate
                </Button>
                <p className="text-[10px] text-ink-soft italic">
                  * Note: Estimates are illustrative benchmarks only. High-risk implants or comorbid ICU days are billed at actual tariff.
                </p>
              </>
            ) : (
              <div className="py-12 space-y-2">
                <Shield className="text-sage mx-auto" size={40} />
                <p className="text-sm text-ink-soft font-medium">Select your clinical variables and calculate.</p>
              </div>
            )}
          </div>
        </div>

        {/* Empanelled TPA & Insurance Grid */}
        <div>
          <h2 className="font-display text-3xl font-bold text-ink mb-2">Empanelled TPA & Insurers</h2>
          <p className="text-sm text-ink-soft mb-8">Cashless desk on 1st Floor operates 24/7 for planned and emergency authorizations.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Star Health Allied', status: 'Cashless Active' },
              { name: 'HDFC ERGO General', status: 'Cashless Active' },
              { name: 'ICICI Lombard', status: 'Cashless Active' },
              { name: 'New India Assurance', status: 'Cashless Active' },
              { name: 'Medi Assist TPA', status: 'Cashless Active' },
              { name: 'Vidal Health TPA', status: 'Cashless Active' },
              { name: 'Paramount TPA', status: 'Cashless Active' },
              { name: 'PM-JAY Ayushman', status: 'Empanelled (Demo)' },
            ].map(ins => (
              <div key={ins.name} className="p-4 bg-paper rounded-xl border border-sage-light flex flex-col justify-between h-24">
                <span className="font-semibold text-ink text-sm">{ins.name}</span>
                <span className="text-[11px] font-mono text-verdigris font-medium flex items-center gap-1">
                  <CheckCircle size={12} /> {ins.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cashless Process 4-Steps */}
        <div className="bg-bone p-8 rounded-2xl border border-sage-light space-y-6">
          <h3 className="font-display font-bold text-ink text-2xl">The 4-Step Cashless Workflow</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <span className="font-display text-3xl font-bold text-verdigris">01</span>
              <h4 className="font-semibold text-ink text-sm mt-1">Pre-Authorization Request</h4>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">Present TPA card & Government Photo ID at least 48h prior to planned admission.</p>
            </div>
            <div>
              <span className="font-display text-3xl font-bold text-verdigris">02</span>
              <h4 className="font-semibold text-ink text-sm mt-1">Hospital Desk Submission</h4>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">Our coordinators transmit doctor consultation notes and diagnosis ICD codes directly.</p>
            </div>
            <div>
              <span className="font-display text-3xl font-bold text-verdigris">03</span>
              <h4 className="font-semibold text-ink text-sm mt-1">Initial Sanction Guarantee</h4>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">Insurer issues eligibility approval letter. Zero deposit admission for covered amount.</p>
            </div>
            <div>
              <span className="font-display text-3xl font-bold text-verdigris">04</span>
              <h4 className="font-semibold text-ink text-sm mt-1">Final Settlement at Discharge</h4>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">Direct settlement between insurer and hospital. Patient settles only non-medical items.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

