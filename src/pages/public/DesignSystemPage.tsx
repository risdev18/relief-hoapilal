import React from 'react';
import { Button, Badge, StatCard, AvailabilityDot, TokenCard, QRCard, Stepper } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';

export function DesignSystemPage() {
  const COLOR_TOKENS = [
    { name: '--paper', hex: '#FAF6EE', role: 'Main Background' },
    { name: '--bone', hex: '#F1EADC', role: 'Alternate Sections' },
    { name: '--ink', hex: '#10261F', role: 'Primary Typography' },
    { name: '--ink-soft', hex: '#3E5249', role: 'Secondary Typography' },
    { name: '--verdigris', hex: '#1F7A6B', role: 'Primary Brand / Links' },
    { name: '--verdigris-deep', hex: '#135247', role: 'Hover / Dark Sections' },
    { name: '--mint', hex: '#CFE6DB', role: 'Soft Fills / Chips' },
    { name: '--sage', hex: '#8FB5A3', role: 'Borders / Illustrations' },
    { name: '--saffron', hex: '#F0A22E', role: 'Sole Primary Action (CTA)' },
    { name: '--clay', hex: '#E7C9A9', role: 'Warm Secondary Fill' },
    { name: '--signal', hex: '#D1432F', role: 'EMERGENCY ONLY' },
    { name: '--night', hex: '#0B1F1B', role: 'Dark Surfaces / Night' },
  ];

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Living Styleguide</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Relif Design System
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Strict Zero-Blue enforcement. Every UI atom, color variable, and organic curve tells the story: <em>"From Strain to Relief"</em>.
          </p>
        </div>
      </div>

      <div className="section-container section-padding space-y-20">
        {/* Colors */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-ink">1. Strict Color Tokens (No Blue)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {COLOR_TOKENS.map(c => (
              <div key={c.name} className="p-4 bg-paper rounded-2xl border border-sage-light shadow-warm-sm space-y-2">
                <div className="h-16 rounded-xl border border-sage-light" style={{ backgroundColor: c.hex }} />
                <p className="font-mono text-xs font-bold text-ink">{c.name}</p>
                <p className="font-mono text-[11px] text-sage">{c.hex}</p>
                <p className="text-[11px] text-ink-soft leading-tight">{c.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Signature Relif Line */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-ink">2. The Signature "Relif Line" Motif</h2>
          <p className="text-xs text-ink-soft max-w-xl">
            Smooth organic pulse line that relaxes in amplitude from chaotic stress (at hero) to calm breathing wave (at footer).
          </p>
          <div className="bg-bone p-6 rounded-2xl border border-sage-light space-y-6">
            <div>
              <span className="text-xs font-mono text-verdigris font-semibold block mb-2">Variant: Hero (Agitated Pulse)</span>
              <RelifLine variant="hero" color="var(--verdigris)" strokeWidth={2} />
            </div>
            <div>
              <span className="text-xs font-mono text-verdigris font-semibold block mb-2">Variant: Mid-Section (Softening)</span>
              <RelifLine variant="section" color="var(--verdigris)" strokeWidth={2} />
            </div>
            <div>
              <span className="text-xs font-mono text-verdigris font-semibold block mb-2">Variant: Footer (Calm Resting Breath)</span>
              <RelifLine variant="footer" color="var(--verdigris)" strokeWidth={2} />
            </div>
          </div>
        </section>

        {/* Buttons & CTAs */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-ink">3. Button Variants</h2>
          <div className="flex flex-wrap items-center gap-4 p-6 bg-bone rounded-2xl border border-sage-light">
            <Button variant="primary">Primary (Saffron Action)</Button>
            <Button variant="secondary">Secondary (Verdigris Outline)</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="emergency">Emergency Signal</Button>
            <Button variant="primary" isLoading>Loading State</Button>
          </div>
        </section>

        {/* Indicators, Chips & Badges */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-ink">4. Badges, Chips & Live Availability</h2>
          <div className="flex flex-wrap items-center gap-6 p-6 bg-bone rounded-2xl border border-sage-light">
            <Badge variant="default">Default Mint</Badge>
            <Badge variant="saffron">Saffron Attention</Badge>
            <Badge variant="signal">Emergency Alert</Badge>
            <Badge variant="night">Night Mode</Badge>
            <div className="flex items-center gap-3">
              <AvailabilityDot status="available" withLabel />
              <AvailabilityDot status="soon" withLabel />
              <AvailabilityDot status="away" withLabel />
            </div>
          </div>
        </section>

        {/* Complex Components */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-ink">5. Cards, Queue Tokens & Slips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Live Waiting OPD Tokens"
              value="14"
              unit="patients"
              trend={{ value: 12, isPositive: true }}
            />
            <TokenCard
              token="C-014"
              department="Cardiology"
              doctor="Dr. Priya Sharma"
              position={2}
              estimatedWait={12}
              status="called"
            />
            <QRCard
              appointmentId="REL-2026-000847"
              patientName="Verified Patient"
              date="Nov 12, 2026"
              time="10:30 AM"
              doctor="Dr. Priya Sharma"
              department="Cardiology"
              qrValue="REL-2026-000847"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

