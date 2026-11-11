import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  {
    number: '150+',
    label: 'Tertiary Care Beds',
    sub: 'ICU, HDU, NICU & Day-Care',
  },
  {
    number: '45,000+',
    label: 'Annual OPD Visits',
    sub: 'Across 20 Clinical Specialties',
  },
  {
    number: '< 18 Min',
    label: 'Door-to-Triage Time',
    sub: 'Emergency & Trauma Center',
  },
  {
    number: '99.4%',
    label: 'Procedural Success',
    sub: 'Strict NABH Surgical Audits',
  },
  {
    number: '40+',
    label: 'Senior Faculty',
    sub: 'AIIMS & Global Fellowship Trained',
  },
  {
    number: '3',
    label: 'Regional Centers',
    sub: 'Mumbai, Thane & Pune',
  },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-bone border-y border-sage-light" aria-label="Hospital Statistics">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <span className="font-mono text-xs font-semibold text-verdigris tracking-widest uppercase block mb-1">
              Clinical Performance & Scale
            </span>
            <h2 className="font-display text-3xl font-bold text-ink">
              Excellence Measured in Patient Outcomes
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="p-5 bg-paper rounded-2xl border border-sage-light shadow-warm-xs text-center flex flex-col justify-between"
            >
              <span className="font-display text-3xl lg:text-4xl font-bold text-verdigris block mb-1">
                {s.number}
              </span>
              <div>
                <p className="font-semibold text-ink text-sm leading-tight mb-1">{s.label}</p>
                <p className="text-[11px] text-ink-soft">{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

