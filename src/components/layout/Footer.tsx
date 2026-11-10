// Footer — Full-width massive "relif" wordmark with calm Relif Line underline

import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, ExternalLink } from 'lucide-react';
import { RelifLine } from '@/components/ui/RelifLine';
import { ROUTES, APP_CONFIG, LANGUAGES } from '@/config/constants';

const FOOTER_LINKS = {
  'Patient Services': [
    { label: 'Book Appointment',   href: ROUTES.book },
    { label: 'Download Reports',   href: ROUTES.patientRecords },
    { label: 'Pay Bill',           href: ROUTES.patientBilling },
    { label: 'Teleconsult',        href: '#teleconsult' },
    { label: 'Second Opinion',     href: '#second-opinion' },
    { label: 'Home Sample',        href: '#home-sample' },
  ],
  'Hospital': [
    { label: 'About Relif',        href: ROUTES.about },
    { label: 'Departments',        href: ROUTES.departments },
    { label: 'Doctors',            href: ROUTES.doctors },
    { label: 'Centres of Excellence', href: ROUTES.coe },
    { label: 'Facilities',         href: ROUTES.facilities },
    { label: 'Gallery',            href: ROUTES.gallery },
  ],
  'Information': [
    { label: 'Insurance & Billing',href: ROUTES.insurance },
    { label: 'Emergency',          href: ROUTES.emergency },
    { label: 'Health Library',     href: ROUTES.healthLibrary },
    { label: 'FAQs',               href: ROUTES.faqs },
    { label: 'Visitor Info',       href: ROUTES.visitorInfo },
    { label: 'Careers',            href: ROUTES.careers },
  ],
  'Legal': [
    { label: 'Privacy Policy',     href: ROUTES.legal('privacy') },
    { label: 'Terms of Use',       href: ROUTES.legal('terms') },
    { label: 'Disclaimer',         href: ROUTES.legal('disclaimer') },
    { label: 'Patient Rights',     href: ROUTES.legal('patient-rights') },
    { label: 'Grievance Redressal',href: ROUTES.legal('grievance') },
    { label: 'Cookie Policy',      href: ROUTES.legal('cookies') },
  ],
};

const BRANCHES = [
  {
    name:    'Relif Andheri',
    address: 'Versova Road, Andheri West, Mumbai 400 053',
    phone:   '+91-XXXX-XXXXXX',
    isMain:  true,
  },
  {
    name:    'Relif Thane',
    address: 'Majiwada Junction, Thane West 400 601',
    phone:   '+91-XXXX-XXXXXX',
    isMain:  false,
  },
  {
    name:    'Relif Pune',
    address: 'Baner Road, Pune 411 045',
    phone:   '+91-XXXX-XXXXXX',
    isMain:  false,
  },
];

export function Footer() {
  return (
    <footer
      className="section-verdigris"
      style={{ background: 'var(--verdigris-deep)' }}
      role="contentinfo"
    >
      {/* Top: Link columns */}
      <div className="section-container section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-mono text-xs font-medium tracking-widest uppercase mb-4"
                  style={{ color: 'var(--sage)' }}>
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm font-medium transition-colors"
                      style={{ color: 'rgba(207,230,219,0.75)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#CFE6DB')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(207,230,219,0.75)')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Branches */}
        <div className="border-t mb-16 pt-12" style={{ borderColor: 'var(--verdigris)' }}>
          <h3 className="font-mono text-xs font-medium tracking-widest uppercase mb-6"
              style={{ color: 'var(--sage)' }}>
            Our Branches — Demo Data
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BRANCHES.map(branch => (
              <div key={branch.name} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-display font-semibold" style={{ color: '#CFE6DB' }}>
                    {branch.name}
                  </h4>
                  {branch.isMain && (
                    <span className="font-mono text-xs px-2 py-0.5 rounded-pill"
                          style={{ background: 'var(--verdigris)', color: '#CFE6DB' }}>
                      Main
                    </span>
                  )}
                </div>
                <p className="text-sm mb-3" style={{ color: 'rgba(207,230,219,0.65)' }}>
                  {branch.address}
                </p>
                <a
                  href={`tel:${branch.phone}`}
                  className="flex items-center gap-1.5 text-sm transition-colors"
                  style={{ color: 'rgba(207,230,219,0.75)' }}
                >
                  <Phone size={13} />
                  <span>{branch.phone} [Demo]</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency number */}
        <div
          className="rounded-xl p-5 mb-16 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: 'rgba(209,67,47,0.15)', borderColor: 'rgba(209,67,47,0.3)' }}
        >
          <div>
            <p className="font-mono text-xs font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--signal)' }}>
              Emergency 24/7 [Demo — Not a real number]
            </p>
            <p className="font-display text-2xl font-bold" style={{ color: '#E8F4EF' }}>
              {APP_CONFIG.emergencyNumber}
            </p>
          </div>
          <a
            href={ROUTES.emergency}
            className="btn btn-sm"
            style={{ background: 'var(--signal)', color: 'white' }}
          >
            Emergency Info
          </a>
        </div>

        {/* Accessibility & language */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs" style={{ color: 'var(--sage)' }}>Language:</span>
            {LANGUAGES.map((lang, i) => (
              <React.Fragment key={lang.code}>
                <button className="font-mono text-sm font-medium transition-colors" style={{ color: 'rgba(207,230,219,0.75)' }}>
                  {lang.name}
                </button>
                {i < LANGUAGES.length - 1 && (
                  <span style={{ color: 'var(--sage)' }}>·</span>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs" style={{ color: 'var(--sage)' }}>Text size:</span>
            {['A-', 'A', 'A+'].map(size => (
              <button
                key={size}
                className="font-mono text-sm px-2 py-1 rounded transition-colors"
                style={{ color: 'rgba(207,230,219,0.75)', background: 'rgba(255,255,255,0.05)' }}
                aria-label={`Text size: ${size}`}
              >
                {size}
              </button>
            ))}
            <button
              className="font-mono text-xs px-3 py-1 rounded transition-colors ml-1"
              style={{ color: 'rgba(207,230,219,0.75)', background: 'rgba(255,255,255,0.05)' }}
              aria-label="Toggle high contrast"
            >
              High Contrast
            </button>
          </div>
        </div>

        {/* Giant wordmark + calm Relif Line */}
        <div className="border-t pt-12" style={{ borderColor: 'var(--verdigris)' }}>
          <div className="relative overflow-hidden">
            {/* Giant "relif" wordmark */}
            <span
              className="font-display font-bold leading-none select-none"
              style={{
                fontSize: 'clamp(5rem, 15vw, 14rem)',
                color: 'rgba(31,122,107,0.25)',
                display: 'block',
                lineHeight: 0.85,
              }}
              aria-hidden="true"
            >
              relif
            </span>
            
            {/* Calm Relif Line as footer underline */}
            <RelifLine
              variant="footer"
              color="var(--sage)"
              strokeWidth={1.5}
              className="absolute bottom-4 w-full"
            />
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-6"
               style={{ borderTop: '1px solid rgba(31,122,107,0.3)' }}>
            <div className="space-y-1">
              <p className="text-xs" style={{ color: 'var(--sage)' }}>
                © {new Date().getFullYear()} Relif Hospital. All rights reserved.
              </p>
              <p className="text-xs font-medium" style={{ color: 'rgba(209,67,47,0.8)' }}>
                ⚠ Demo project. All data is fictional. Not for real medical use.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to={ROUTES.demoGuide}
                className="text-xs font-mono transition-colors"
                style={{ color: 'var(--sage)' }}
              >
                Demo Guide
              </Link>
              <Link
                to={ROUTES.designSystem}
                className="text-xs font-mono transition-colors"
                style={{ color: 'var(--sage)' }}
              >
                Design System
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

