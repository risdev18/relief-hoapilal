import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export function GalleryPage() {
  const [filter, setFilter] = useState('All');

  const IMAGES = [
    { title: 'Modular Laminar Operation Suite', cat: 'Surgical Suites' },
    { title: 'Natural-Light Inpatient Recovery Room', cat: 'Wards & Rooms' },
    { title: 'Level-3 Pediatric Intensive Care Unit', cat: 'ICU & Critical' },
    { title: '3-Tesla MRI Diagnostic Terminal', cat: 'Diagnostics' },
    { title: 'Emergency Trauma Resuscitation Bay', cat: 'Emergency' },
    { title: 'Patient Waiting Lounge & Concierge', cat: 'Hospital Corridors' },
  ];

  const filtered = filter === 'All' ? IMAGES : IMAGES.filter(img => img.cat === filter);

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Visual Tour</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Hospital Gallery
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            A visual overview of our infection-controlled clinical spaces, patient wards, and state-of-the-art diagnostic machinery.
          </p>
        </div>
      </div>

      <div className="section-container section-padding">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Surgical Suites', 'Wards & Rooms', 'ICU & Critical', 'Diagnostics', 'Emergency'].map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`chip text-xs transition-colors ${
                filter === c
                  ? 'bg-verdigris text-white border-verdigris'
                  : 'bg-paper text-ink hover:bg-bone'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div key={idx} className="card bg-paper rounded-2xl overflow-hidden border border-sage-light shadow-warm-sm group">
              <div className="h-56 bg-gradient-to-br from-mint-light via-bone to-mint flex items-center justify-center relative">
                <ImageIcon size={40} className="text-sage opacity-40 group-hover:scale-105 transition-transform" />
                <span className="chip text-[11px] absolute top-3 right-3">{item.cat}</span>
              </div>
              <div className="p-5">
                <span className="text-[11px] font-mono text-verdigris font-semibold">{item.cat}</span>
                <h3 className="font-display font-semibold text-ink text-base mt-1">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

