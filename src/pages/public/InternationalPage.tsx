import React from 'react';
import { Globe, Plane, FileCheck, Languages, Building, HeartHandshake } from 'lucide-react';
import { Button, DemoBadge } from '@/components/ui';

export function InternationalPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-night py-16 text-white border-b border-night-soft">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris-light tracking-widest uppercase mb-3">Global Healthcare Gateway</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 text-[#E8F4EF]">
            International Patient Desk
          </h1>
          <p className="text-lg text-sage max-w-2xl leading-relaxed">
            Personalized clinical coordination, medical visa documentation assistance, language interpreters, and seamless airport reception.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 bg-paper border border-sage-light space-y-3">
            <div className="w-10 h-10 rounded-full bg-mint text-verdigris flex items-center justify-center">
              <FileCheck size={20} />
            </div>
            <h3 className="font-display font-bold text-ink text-lg">Medical Visa Facilitation</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Expedited issuance of formal hospital invitation letters to facilitate rapid Medical Visa approval for patients and attendants.
            </p>
          </div>
          <div className="card p-6 bg-paper border border-sage-light space-y-3">
            <div className="w-10 h-10 rounded-full bg-mint text-verdigris flex items-center justify-center">
              <Languages size={20} />
            </div>
            <h3 className="font-display font-bold text-ink text-lg">Interpreter Services</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Arabic, French, Swahili, and Russian translators ensuring medical clarity across every specialist and nursing interaction.
            </p>
          </div>
          <div className="card p-6 bg-paper border border-sage-light space-y-3">
            <div className="w-10 h-10 rounded-full bg-mint text-verdigris flex items-center justify-center">
              <Plane size={20} />
            </div>
            <h3 className="font-display font-bold text-ink text-lg">Airport & Transit Concierge</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Direct airport tarmac ambulance or private car reception from Mumbai Chhatrapati Shivaji Maharaj International Airport (BOM).
            </p>
          </div>
        </div>

        {/* Query Desk */}
        <div className="bg-bone p-8 rounded-2xl border border-sage-light text-center max-w-2xl mx-auto space-y-4">
          <HeartHandshake size={36} className="text-verdigris mx-auto" />
          <h2 className="font-display text-2xl font-bold text-ink">Request a Complimentary Second Opinion</h2>
          <p className="text-xs text-ink-soft leading-relaxed">
            Send your current medical reports, scans, and physician notes. Our senior medical board will evaluate your case and reply with a treatment plan within 24 hours.
          </p>
          <Button variant="primary" onClick={() => alert('Demo action: International consultation initiated.')}>
            Connect with International Coordinator (Demo)
          </Button>
        </div>
      </div>
    </div>
  );
}

