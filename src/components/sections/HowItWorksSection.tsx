// "A visit, in six calm steps" — aligned step-by-step walkthrough matching the 6-step Booking Wizard

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RelifLine } from '@/components/ui/RelifLine';
import { SectionHeader, QRCard, Stepper } from '@/components/ui';
import { ROUTES } from '@/config/constants';

const STEPS = [
  {
    number: '01',
    title: 'Department',
    description: 'Choose the right specialty or let symptom guidance route you straight to our 8 clinical departments.',
    ui: <DeptStepPreview />,
    lineVariant: 'hero' as const,
  },
  {
    number: '02',
    title: 'Doctor',
    description: 'Browse every specialist in that department with qualifications, languages spoken, patient ratings and upfront fees.',
    ui: <DoctorStepPreview />,
    lineVariant: 'section' as const,
  },
  {
    number: '03',
    title: 'Branch & Visit Type',
    description: 'Pick Andheri West, Thane West, or Baner Pune — for an in-clinic visit or a secure video consultation.',
    ui: <BranchStepPreview />,
    lineVariant: 'section' as const,
  },
  {
    number: '04',
    title: 'Date & Time Slot',
    description: 'Real-time calendar locks your chosen slot against double-booking as soon as you confirm.',
    ui: <SlotStepPreview />,
    lineVariant: 'section' as const,
  },
  {
    number: '05',
    title: 'Patient Details',
    description: 'Your signed-in profile auto-fills name, phone, and UHID so you can review everything effortlessly.',
    ui: <DetailsStepPreview />,
    lineVariant: 'section' as const,
  },
  {
    number: '06',
    title: 'Transparent Pay & QR Pass',
    description: 'Pay online via UPI/Cards or pay at the hospital desk, then download your instant PDF receipt & QR pass.',
    ui: <PayStepPreview />,
    lineVariant: 'cta' as const,
  },
];

function DeptStepPreview() {
  return (
    <div className="card p-5 w-full max-w-xs space-y-3">
      <Stepper
        steps={[
          { label: 'Dept' },
          { label: 'Doc' },
          { label: 'Branch' },
          { label: 'Slot' },
          { label: 'Info' },
          { label: 'Pay' },
        ]}
        currentStep={0}
      />
      <div className="grid grid-cols-2 gap-2 pt-2">
        {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'].map((d, i) => (
          <div
            key={d}
            className={`p-2.5 rounded-xl border text-xs font-semibold ${
              i === 0 ? 'bg-mint border-verdigris text-verdigris-deep' : 'bg-bone border-sage-light text-ink-soft'
            }`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorStepPreview() {
  return (
    <div className="card p-5 w-full max-w-xs space-y-3">
      <div className="rounded-xl bg-bone p-3 border border-sage-light flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm text-ink">Dr. Priya Sharma</p>
          <p className="text-xs text-ink-soft">Cardiology · 15 yrs · 4.9★</p>
        </div>
        <span className="font-mono text-xs font-bold text-verdigris-deep bg-mint px-2.5 py-1 rounded-full">
          ₹1,200
        </span>
      </div>
      <div className="rounded-xl bg-paper p-3 border border-sage-light flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm text-ink">Dr. Vikram Rao</p>
          <p className="text-xs text-ink-soft">Cardiology · 14 yrs · 4.8★</p>
        </div>
        <span className="font-mono text-xs font-bold text-ink-soft bg-bone px-2.5 py-1 rounded-full">
          ₹1,100
        </span>
      </div>
    </div>
  );
}

function BranchStepPreview() {
  return (
    <div className="card p-5 w-full max-w-xs space-y-2.5">
      <p className="text-xs font-mono uppercase tracking-wider text-verdigris">Select Centre</p>
      <div className="p-3 rounded-xl border-2 border-verdigris bg-mint/30">
        <p className="text-sm font-semibold text-ink">Andheri West Flagship</p>
        <p className="text-xs text-ink-soft">In-Clinic Visit · ₹1,200</p>
      </div>
      <div className="p-3 rounded-xl border border-sage-light bg-bone">
        <p className="text-sm font-medium text-ink">Video Tele-Consultation</p>
        <p className="text-xs text-ink-soft">Secure HD Video · ₹1,000</p>
      </div>
    </div>
  );
}

function SlotStepPreview() {
  return (
    <div className="card p-5 w-full max-w-xs space-y-3">
      <p className="text-xs text-ink-soft">Live Slot Availability</p>
      <div className="grid grid-cols-3 gap-2">
        {['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'].map((time, i) => (
          <div
            key={time}
            className={`text-[11px] py-2 text-center rounded-lg border ${
              i === 1
                ? 'bg-saffron border-saffron text-ink font-semibold'
                : i === 3
                ? 'bg-sage-light border-sage-light text-ink-soft line-through'
                : 'bg-paper border-sage-light text-ink'
            }`}
          >
            {time}
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailsStepPreview() {
  return (
    <div className="card p-5 w-full max-w-xs space-y-2.5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-verdigris">Price Summary Before Commit</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-ink-soft">Consultation Fee</span>
          <span className="font-mono font-semibold text-ink">₹1,200</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-soft">GST (Exempt)</span>
          <span className="font-mono text-ink-soft">₹0</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-sage-light font-semibold text-sm">
          <span className="text-ink">Total Payable</span>
          <span className="font-mono text-verdigris-deep">₹1,200</span>
        </div>
      </div>
      <p className="text-[11px] text-ink-soft bg-bone p-2 rounded-lg">
        Free cancellation &ge; 24 hrs · 50% refund between 2–24 hrs.
      </p>
    </div>
  );
}

function PayStepPreview() {
  return (
    <QRCard
      appointmentId="REL-2026-104829"
      patientName="Outpatient Check-In"
      date="Tomorrow"
      time="10:00 AM"
      doctor="Dr. Priya Sharma"
      department="Cardiology"
      qrValue="REL-2026-104829"
      className="max-w-xs"
    />
  );
}

export function HowItWorksSection() {
  return (
    <section className="section-padding bg-bone" aria-label="How a visit works">
      <div className="section-container">
        <SectionHeader
          eyebrow="A visit, in six calm steps"
          title="No confusion. No surprise fees."
          subtitle="From selecting a department to downloading your GST receipt and QR check-in pass — six clear steps."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-between p-6 rounded-2xl bg-paper border border-sage-light shadow-warm-xs"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display text-3xl font-bold text-verdigris">
                    {step.number}
                  </span>
                  <div className="flex-1">
                    <RelifLine
                      variant={step.lineVariant}
                      color="var(--verdigris)"
                      strokeWidth={1.8}
                      animated={false}
                      className="w-full"
                    />
                  </div>
                </div>
                <h3 className="font-display text-2xl font-semibold text-ink mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed mb-5">
                  {step.description}
                </p>
              </div>
              <div className="flex justify-center pt-2">
                {step.ui}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to={ROUTES.book} className="btn btn-primary btn-lg">
            Start 6-Step Booking →
          </Link>
        </div>
      </div>
    </section>
  );
}
