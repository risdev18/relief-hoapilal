// Emergency Strip — Sophisticated Deep Forest Green & Warm Champagne Luxury Aesthetic
// Replaces stark alert styling with quiet, prestigious international hospital elegance

import React from 'react';
import { APP_CONFIG, ROUTES } from '@/config/constants';
import { Phone, MapPin, Shield, ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmergencyStrip() {
  return (
    <div
      role="banner"
      aria-label="Emergency and immediate critical care contact"
      className="w-full relative border-b border-night-muted transition-colors duration-300"
      style={{
        background: 'linear-gradient(90deg, #071613 0%, #0B1F1B 50%, #0D2621 100%)',
        color: '#E8F4EF',
      }}
    >
      <div className="section-container">
        <div className="flex items-center justify-between py-2 text-xs tracking-wide">
          {/* Left: Prestigious Status & Emergency Hotline */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] font-semibold tracking-widest uppercase text-sage">
                Trauma & Emergency 24/7
              </span>
            </div>

            <span className="hidden sm:inline text-white/20">|</span>

            {/* Direct Telephone Access */}
            <a
              href={`tel:${APP_CONFIG.emergencyNumber}`}
              className="group flex items-center gap-1.5 text-xs text-white/90 hover:text-white transition-colors"
              aria-label={`Call emergency: ${APP_CONFIG.emergencyNumber}`}
            >
              <Phone size={12} className="text-saffron opacity-90 group-hover:scale-110 transition-transform" />
              <span className="font-mono font-medium tracking-tight text-[#FAF6EE]">{APP_CONFIG.emergencyNumber}</span>
              <span className="text-[10px] text-sage/70 font-mono tracking-wider ml-0.5">· Immediate Triage</span>
            </a>

            <span className="hidden lg:inline text-white/20">|</span>

            {/* Ambulance dispatch */}
            <a
              href={`tel:${APP_CONFIG.ambulanceNumber}`}
              className="hidden lg:flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors"
            >
              <Clock size={12} className="text-sage" />
              <span className="text-white/90">Ambulance Dispatch:</span>
              <span className="font-mono text-saffron">{APP_CONFIG.ambulanceNumber}</span>
            </a>
          </div>

          {/* Right: Hospital Campus Directions & Live Status */}
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-sage/80 font-mono">
              <Shield size={11} className="text-verdigris" />
              NABH & JCI Accredited Protocols
            </span>

            <Link
              to={ROUTES.emergency}
              className="group inline-flex items-center gap-1 text-[11px] font-medium text-saffron hover:text-saffron-light transition-colors py-0.5"
            >
              <MapPin size={12} className="opacity-80" />
              <span>Campus Directions</span>
              <ArrowUpRight size={11} className="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
