// Demo Banner — Refined, unobtrusive, modern badge format

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/config/constants';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!APP_CONFIG.isDemoMode || !isVisible) return null;
  
  return (
    <div
      className="w-full text-center py-1.5 px-4 border-b border-night/40"
      style={{
        background: 'linear-gradient(90deg, #0B1F1B 0%, #10261F 50%, #0B1F1B 100%)',
        color: '#E8F4EF'
      }}
      role="note"
      aria-label="Portfolio demonstration mode notice"
    >
      <div className="flex items-center justify-center gap-2.5 max-w-screen-xl mx-auto text-[11px] font-sans">
        <span className="inline-flex items-center gap-1 font-mono font-semibold tracking-widest text-[10px] text-saffron uppercase px-2 py-0.5 rounded-full bg-saffron/10 border border-saffron/20">
          <Sparkles size={10} />
          Portfolio Project
        </span>
        <span className="text-sage/70 hidden sm:inline">·</span>
        <span className="text-bone/80 text-[11px] hidden sm:inline">
          Fictional demonstration. Connected to Supabase real-time cloud data.
        </span>
        <Link
          to={ROUTES.demoGuide}
          className="font-medium text-mint hover:text-white underline underline-offset-4 transition-colors ml-1"
        >
          Explore Demo Guide →
        </Link>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-3 text-sage hover:text-white transition-opacity p-0.5 rounded"
          aria-label="Dismiss notice"
        >
          <X size={11} />
        </button>
      </div>
    </div>
  );
}
