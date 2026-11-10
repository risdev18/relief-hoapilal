// "A visit, in four calm steps" — scroll-pinned story section

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RelifLine } from '@/components/ui/RelifLine';
import { SectionHeader, QRCard, TokenCard, Stepper } from '@/components/ui';

const STEPS = [
  {
    number: '01',
    title: 'Book',
    description: 'Choose a department, pick a doctor, select a slot that works for you. Done in under two minutes.',
    ui: <BookingUI />,
    lineVariant: 'hero' as const,
  },
  {
    number: '02',
    title: 'Arrive',
    description: "Scan your QR at reception or the kiosk. You're checked in. No forms, no queues at the desk.",
    ui: <ArrivalUI />,
    lineVariant: 'section' as const,
  },
  {
    number: '03',
    title: 'Meet your doctor',
    description: "Your queue token updates in real time. When it's your turn, you'll know.",
    ui: <QueueUI />,
    lineVariant: 'section' as const,
  },
  {
    number: '04',
    title: 'Reports on your phone',
    description: 'Lab reports, prescriptions, and discharge summaries — available digitally. No lost papers.',
    ui: <ReportUI />,
    lineVariant: 'cta' as const,
  },
];

function BookingUI() {
  return (
    <div className="card p-5 w-full max-w-xs">
      <Stepper
        steps={[
          { label: 'Department' },
          { label: 'Doctor' },
          { label: 'Date & Slot' },
          { label: 'Confirm' },
        ]}
        currentStep={2}
      />
      <div className="mt-5 space-y-3">
        <div className="rounded-xl bg-bone p-3 border border-sage-light">
          <p className="text-xs text-ink-soft mb-1">Selected doctor</p>
          <p className="font-semibold text-sm text-ink">Dr. Priya Sharma</p>
          <p className="text-xs text-ink-soft">Cardiology · Andheri Branch</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['10:00', '10:30', '11:00', '11:30', '14:00', '14:30'].map((time, i) => (
            <button
              key={time}
              className={`text-xs py-2 rounded-lg border transition-all ${
                i === 1
                  ? 'bg-saffron border-saffron text-ink font-semibold'
                  : i === 3
                  ? 'bg-sage-light border-sage-light text-ink-soft line-through'
                  : 'bg-paper border-sage-light text-ink hover:border-verdigris'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
        <button className="btn btn-primary btn-sm w-full justify-center">
          Confirm Slot
        </button>
      </div>
    </div>
  );
}

function ArrivalUI() {
  return (
    <QRCard
      appointmentId="REL-2026-000847"
      patientName="Rahul M."
      date="Tue, 12 Nov 2026"
      time="10:30 AM"
      doctor="Dr. Priya Sharma"
      department="Cardiology"
      qrValue="REL-2026-000847"
      className="max-w-xs"
    />
  );
}

function QueueUI() {
  return (
    <TokenCard
      token="C-014"
      department="Cardiology"
      doctor="Dr. Priya Sharma"
      position={2}
      estimatedWait={12}
      status="called"
      className="max-w-xs"
    />
  );
}

function ReportUI() {
  return (
    <div className="card p-5 w-full max-w-xs">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-sm text-ink">Medical Records</p>
        <span className="demo-badge">Demo</span>
      </div>
      <div className="space-y-2">
        {[
          { type: 'Lab Report', name: 'Complete Blood Count', date: 'Nov 12, 2026', ready: true },
          { type: 'Prescription', name: 'Dr. Sharma — Cardiac', date: 'Nov 12, 2026', ready: true },
          { type: 'Lab Report', name: 'Lipid Profile', date: 'Nov 12, 2026', ready: false },
        ].map((record, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-bone border border-sage-light">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                 style={{ background: record.ready ? 'var(--mint)' : 'var(--bone)' }}>
              <span className="text-xs">{record.type === 'Lab Report' ? '🧪' : '📄'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-ink truncate">{record.name}</p>
              <p className="text-xs text-ink-soft">{record.date}</p>
            </div>
            {record.ready ? (
              <span className="text-xs font-medium text-verdigris flex-shrink-0">Download</span>
            ) : (
              <span className="text-xs text-ink-soft flex-shrink-0">Processing</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section className="section-padding bg-bone" aria-label="How a visit works">
      <div className="section-container">
        <SectionHeader
          eyebrow="A visit, in four calm steps"
          title="No confusion. No running around."
          subtitle="From booking to discharge — everything is designed to feel easy."
          align="center"
        />

        <div className="space-y-24 md:space-y-32">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? 'lg:direction-rtl' : ''
              }`}
              style={{ direction: i % 2 === 1 ? 'rtl' : 'ltr' }}
            >
              {/* Text side */}
              <div style={{ direction: 'ltr' }}>
                {/* Large serif step number */}
                <div className="flex items-baseline gap-4 mb-4">
                  <span
                    className="font-display font-bold leading-none"
                    style={{
                      fontSize: 'clamp(5rem, 10vw, 9rem)',
                      color: 'var(--sage-light)',
                      lineHeight: 0.85,
                    }}
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  {/* Relif Line at the step — relaxes as steps progress */}
                  <div className="flex-1">
                    <RelifLine
                      variant={step.lineVariant}
                      color="var(--verdigris)"
                      strokeWidth={2}
                      className="w-full"
                    />
                  </div>
                </div>
                <h3 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-ink-soft leading-relaxed max-w-md">
                  {step.description}
                </p>
              </div>

              {/* UI Fragment side */}
              <div
                className="flex justify-center"
                style={{ direction: 'ltr' }}
              >
                <div className="relative">
                  {/* Soft background blob */}
                  <div
                    className="absolute inset-0 rounded-3xl -rotate-3 scale-105"
                    style={{ background: 'var(--mint-light)' }}
                    aria-hidden="true"
                  />
                  <div className="relative">
                    {step.ui}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

