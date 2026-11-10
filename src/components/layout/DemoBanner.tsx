// Demo Banner — shown in demo mode, links to demo guide

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/config/constants';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!APP_CONFIG.isDemoMode || !isVisible) return null;
  
  return (
    <div
      className="w-full text-center py-2 px-4"
      style={{ background: 'var(--night)', color: 'rgba(207,230,219,0.9)' }}
      role="note"
      aria-label="Demo mode notice"
    >
      <div className="flex items-center justify-center gap-3 max-w-screen-xl mx-auto text-xs">
        <span className="font-mono font-bold tracking-widest uppercase" style={{ color: 'var(--saffron)' }}>
          DEMO MODE
        </span>
        <span>·</span>
        <span>All data is fictional. This is a portfolio project.</span>
        <Link
          to={ROUTES.demoGuide}
          className="font-medium underline underline-offset-2"
          style={{ color: 'var(--sage)' }}
        >
          View Demo Guide
        </Link>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss demo notice"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

