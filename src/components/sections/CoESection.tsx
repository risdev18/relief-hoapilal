// Centres of Excellence — horizontal scroll-snap cinematic panels on --night

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RelifLine } from '@/components/ui/RelifLine';
import { ROUTES } from '@/config/constants';
import { DemoBadge } from '@/components/ui';

const COE_PANELS = [
  {
    id: 'cardiac-sciences',
    title: 'Cardiac Sciences',
    promise: 'Precision heart care, from first beat to recovery.',
    treatments: ['Angioplasty', 'Bypass Surgery', 'Electrophysiology', 'Heart Failure'],
    specialists: ['Dr. Priya Sharma', 'Dr. Vikram Rao'],
    color: 'from-[#1A3D35] to-night',
    accentColor: 'var(--verdigris)',
  },
  {
    id: 'neuro-sciences',
    title: 'Neuro Sciences',
    promise: 'Brains, spines, nerves — with steady, careful hands.',
    treatments: ['Neurosurgery', 'Stroke Care', 'Spine Surgery', 'Epilepsy'],
    specialists: ['Dr. Sunita Desai', 'Dr. Kiran Mehta'],
    color: 'from-night to-[#1E3D35]',
    accentColor: 'var(--saffron)',
  },
  {
    id: 'oncology-center',
    title: 'Cancer Care Centre',
    promise: 'Comprehensive cancer care with dignity at every step.',
    treatments: ['Chemotherapy', 'Radiation', 'Surgical Oncology', 'Palliative Care'],
    specialists: ['Dr. Anjali Khanna', 'Dr. Rohit Verma'],
    color: 'from-[#152E28] to-[#0B1F1B]',
    accentColor: 'var(--clay)',
  },
  {
    id: 'orthopedics-sports',
    title: 'Orthopedics & Sports',
    promise: 'Back on your feet. Faster than you think.',
    treatments: ['Joint Replacement', 'Arthroscopy', 'Sports Injury', 'Spine'],
    specialists: ['Dr. Rajesh Kulkarni', 'Dr. Pooja Shah'],
    color: 'from-[#1A3D35] to-night',
    accentColor: 'var(--mint)',
  },
  {
    id: 'women-health',
    title: 'Women\'s Health',
    promise: 'Care built around women, at every life stage.',
    treatments: ['Obstetrics', 'Fertility', 'Gynae Oncology', 'Menopause'],
    specialists: ['Dr. Deepa Nair', 'Dr. Swati Joshi'],
    color: 'from-night to-[#152E28]',
    accentColor: 'var(--saffron)',
  },
];

export function CoESection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const p = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    setProgress(Math.min(1, Math.max(0, p)));
  };

  return (
    <section
      className="section-night py-24 md:py-32 overflow-hidden"
      aria-label="Centres of Excellence"
    >
      {/* Header */}
      <div className="section-container mb-10">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-xs font-medium tracking-widest uppercase block mb-3"
                  style={{ color: 'var(--sage)' }}>
              Centres of Excellence
            </span>
            <h2
              className="font-display font-semibold text-balance"
              style={{
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                color: '#E8F4EF',
                letterSpacing: '-0.03em',
              }}
            >
              Where expertise
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--verdigris-light)' }}>
                runs deepest.
              </em>
            </h2>
          </div>
          <DemoBadge className="mb-2" />
        </div>

        {/* Relif Line progress bar */}
        <div className="mt-8 relative h-5 overflow-hidden">
          <svg viewBox="0 0 400 20" fill="none" className="w-full h-full">
            <path
              d="M4 10 C60 10 80 3 120 3 C160 3 180 17 220 17 C260 17 280 6 320 6 C360 6 380 10 396 10"
              stroke="rgba(207,230,219,0.15)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M4 10 C60 10 80 3 120 3 C160 3 180 17 220 17 C260 17 280 6 320 6 C360 6 380 10 396 10"
              stroke="var(--verdigris)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="600"
              strokeDashoffset={600 - 600 * progress}
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>
        </div>
      </div>

      {/* Horizontal scroll panels */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pl-4 md:pl-8 pr-4 md:pr-8 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {COE_PANELS.map((panel, i) => (
          <motion.div
            key={panel.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`flex-shrink-0 snap-start w-80 md:w-96 rounded-3xl overflow-hidden relative`}
            style={{
              background: `linear-gradient(135deg, ${panel.color.includes('from-[') ? panel.color.match(/from-\[([^\]]+)\]/)?.[1] : '#1A3D35'}, var(--night))`,
              minHeight: '480px',
            }}
          >
            {/* Gradient background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${panel.color} opacity-80`}
            />

            {/* Content */}
            <div className="relative p-8 h-full flex flex-col">
              {/* Centre number */}
              <span
                className="font-mono text-xs font-bold tracking-widest uppercase mb-6 block"
                style={{ color: 'rgba(207,230,219,0.5)' }}
              >
                0{i + 1}
              </span>

              {/* Title */}
              <h3
                className="font-display font-semibold mb-3 leading-tight"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: '#E8F4EF',
                }}
              >
                {panel.title}
              </h3>

              {/* Promise */}
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(207,230,219,0.7)' }}>
                {panel.promise}
              </p>

              {/* Treatments */}
              <div className="flex flex-wrap gap-2 mb-6">
                {panel.treatments.map(t => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-pill font-medium"
                    style={{ background: 'rgba(207,230,219,0.1)', color: 'rgba(207,230,219,0.8)', border: '1px solid rgba(207,230,219,0.15)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Specialists */}
              <div className="flex flex-wrap gap-2 mb-auto">
                {panel.specialists.map(s => (
                  <div
                    key={s}
                    className="flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: 'rgba(207,230,219,0.75)' }}
                  >
                    <div className="w-5 h-5 rounded-full" style={{ background: panel.accentColor, opacity: 0.6 }} />
                    {s}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                to={ROUTES.coeDetail(panel.id)}
                className="btn btn-sm mt-6"
                style={{
                  background: 'transparent',
                  color: '#E8F4EF',
                  border: `1.5px solid ${panel.accentColor}`,
                }}
              >
                Talk to the centre
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

