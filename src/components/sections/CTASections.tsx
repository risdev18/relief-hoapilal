// Closing CTA section — full-bleed verdigris-deep, giant serif + calm Relif Line

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { RelifLine } from '@/components/ui/RelifLine';
import { ROUTES, APP_CONFIG } from '@/config/constants';

export function ClosingCTASection() {
  return (
    <section
      className="section-verdigris py-24 md:py-32 relative overflow-hidden"
      aria-label="Book appointment"
    >
      {/* Calm Relif Line wave at top */}
      <div className="absolute top-0 left-0 right-0 opacity-20">
        <RelifLine variant="cta" color="var(--sage)" strokeWidth={1.5} animated={false} />
      </div>

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          {/* Giant serif headline */}
          <h2
            className="font-display font-semibold leading-tight text-balance mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              color: '#E8F4EF',
              letterSpacing: '-0.03em',
            }}
          >
            Feeling better
            <br />
            <em style={{ color: 'var(--saffron)', fontStyle: 'italic', fontWeight: 400 }}>
              starts here.
            </em>
          </h2>

          <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: 'rgba(207,230,219,0.75)' }}>
            One tap to book. We'll handle the rest.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={ROUTES.book}
              className="btn btn-lg"
              style={{ background: 'var(--saffron)', color: 'var(--ink)' }}
            >
              Book Appointment
            </Link>
            <a
              href={`tel:${APP_CONFIG.emergencyNumber}`}
              className="flex items-center gap-2 font-medium transition-opacity hover:opacity-80"
              style={{ color: 'rgba(207,230,219,0.85)', borderRadius: '999px', padding: '1rem 2rem', border: '1.5px solid rgba(207,230,219,0.3)' }}
            >
              <Phone size={18} />
              Call Us [Demo]
            </a>
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium transition-opacity hover:opacity-80"
              style={{ color: 'rgba(207,230,219,0.85)', borderRadius: '999px', padding: '1rem 2rem', border: '1.5px solid rgba(207,230,219,0.3)' }}
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      {/* Calm Relif Line wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 opacity-30">
        <RelifLine variant="footer" color="var(--verdigris)" strokeWidth={2} animated={false} />
      </div>
    </section>
  );
}

// ── Patient Services section ───────────────────────────────────────────────
export function PatientServicesSection() {
  const SERVICES = [
    { label: 'Download Lab Reports',   href: ROUTES.patientRecords,  description: 'PDF reports available instantly' },
    { label: 'Pay Your Bill',          href: ROUTES.patientBilling,  description: 'Secure online payments' },
    { label: 'Video Consultation',     href: ROUTES.book,            description: 'Consult from home' },
    { label: 'Second Opinion',         href: '#second-opinion',      description: 'Get expert review' },
    { label: 'Home Sample Collection', href: '#home-sample',         description: 'Lab tests at your doorstep' },
    { label: 'International Desk',     href: ROUTES.international,   description: 'Medical travel support' },
  ];

  return (
    <section className="section-padding bg-paper" aria-label="Patient services">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase block mb-3">
              Patient Services
            </span>
            <h2 className="section-heading mb-4">
              Everything you need,
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--verdigris)' }}>
                on your terms.
              </em>
            </h2>
            <p className="section-subheading">
              From booking to billing, we've made every step as easy as possible.
            </p>
          </div>
          <div className="border-t border-sage-light">
            {SERVICES.map((service, i) => (
              <motion.a
                key={service.label}
                href={service.href}
                className="group flex items-center justify-between py-4 border-b border-sage-light hover:pl-2 transition-all duration-300"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <div>
                  <span className="font-semibold text-ink group-hover:text-verdigris transition-colors">
                    {service.label}
                  </span>
                  <p className="text-sm text-ink-soft mt-0.5">{service.description}</p>
                </div>
                <svg
                  width="20" height="20" viewBox="0 0 20 20" fill="none"
                  className="text-sage group-hover:text-verdigris transition-all duration-300 group-hover:translate-x-1 flex-shrink-0 ml-4"
                >
                  <path d="M4 10H16M12 6L16 10L12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Trust section ─────────────────────────────────────────────────────────
export function TrustSection() {
  const TESTIMONIALS = [
    {
      quote: "The booking process was so simple. I found the right doctor in minutes and my reports were on my phone the same day.",
      patient: "R.M., Mumbai",
      service: "Cardiology",
    },
    {
      quote: "Dr. Kulkarni took the time to explain everything clearly. I didn't feel rushed. That made all the difference.",
      patient: "S.D., Thane",
      service: "Orthopedics",
    },
    {
      quote: "My daughter was seen within the hour. The staff was calm and kind. Exactly what you need when you're worried.",
      patient: "P.J., Pune",
      service: "Pediatrics",
    },
  ];

  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setCurrent(c => (c + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-padding" style={{ background: 'var(--bone)' }} aria-label="Patient stories">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Accreditations placeholder */}
          <div>
            <span className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase block mb-6">
              Trust, Honestly
            </span>
            <h2 className="section-heading mb-6">What we can show you.</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                'JCI Accreditation',
                'NABH Certification',
                'ISO 9001:2015',
                'State Awards 2024',
              ].map(item => (
                <div key={item} className="p-4 rounded-xl border border-dashed border-sage bg-paper">
                  <p className="text-sm font-medium text-ink-soft">{item}</p>
                  <p className="text-xs text-sage mt-1">
                    Placeholder — add verified credentials
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-soft mt-4">
              ⚠ Demo project. All accreditations shown are placeholders only.
            </p>
          </div>

          {/* Testimonials */}
          <div>
            <div className="relative overflow-hidden">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i === current ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className={`${i === current ? 'block' : 'hidden'}`}
                >
                  <blockquote className="mb-6">
                    <p
                      className="font-display font-semibold text-ink leading-relaxed mb-4"
                      style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
                    >
                      "{t.quote}"
                    </p>
                    <footer className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center">
                        <span className="text-xs font-bold text-verdigris">{t.patient[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{t.patient}</p>
                        <p className="text-xs text-ink-soft">{t.service}</p>
                      </div>
                    </footer>
                  </blockquote>
                </motion.div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? 'w-6 h-2 bg-verdigris'
                      : 'w-2 h-2 bg-sage'
                  }`}
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={i === current}
                />
              ))}
              <button
                onClick={() => setCurrent(c => (c === 0 ? TESTIMONIALS.length - 1 : c - 1))}
                className="ml-auto text-ink-soft hover:text-ink transition-colors"
                aria-label="Pause auto-advance"
              >
                ⏸
              </button>
            </div>
            <p className="text-xs text-ink-soft mt-3">Demo — fictional patient stories</p>
          </div>
        </div>
      </div>
    </section>
  );
}

