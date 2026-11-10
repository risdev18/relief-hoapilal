// Emergency Strip — always visible, never hidden on mobile
// SIGNAL color only — this element is exclusively for emergency use

import React from 'react';
import { APP_CONFIG } from '@/config/constants';
import { Phone, MapPin, Ambulance } from 'lucide-react';

export function EmergencyStrip() {
  return (
    <div
      role="banner"
      aria-label="Emergency services"
      className="w-full z-emergency relative"
      style={{
        background: 'var(--signal)',
        color: 'white',
      }}
    >
      <div className="section-container">
        <div className="flex items-center justify-between gap-4 py-2 flex-wrap">
          {/* Left: Emergency label */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-mono text-xs font-bold tracking-widest uppercase opacity-90">
              Emergency 24/7
            </span>
            
            <span className="hidden sm:inline text-white/30">|</span>

            {/* Call to action */}
            <a
              href={`tel:${APP_CONFIG.emergencyNumber}`}
              className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
              aria-label={`Call emergency: ${APP_CONFIG.emergencyNumber}`}
            >
              <Phone size={14} aria-hidden="true" />
              <span>{APP_CONFIG.emergencyNumber}</span>
              <span className="font-mono text-xs opacity-70 ml-1">[Demo]</span>
            </a>
            
            <span className="hidden md:inline text-white/30">|</span>
            
            <a
              href={`tel:${APP_CONFIG.ambulanceNumber}`}
              className="hidden md:flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
              aria-label={`Call ambulance: ${APP_CONFIG.ambulanceNumber}`}
            >
              <span>🚑</span>
              <span>Ambulance</span>
              <span className="font-mono text-xs opacity-70 ml-1">[Demo]</span>
            </a>
          </div>
          
          {/* Right: Directions */}
          <div className="flex items-center gap-3">
            <a
              href="/emergency"
              className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
              aria-label="Get directions to emergency"
            >
              <MapPin size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Directions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

