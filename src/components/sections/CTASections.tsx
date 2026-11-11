// Homepage CTA, Patient Services, Centres Map & FAQ Sections

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, ChevronDown } from 'lucide-react';
import { RelifLine } from '@/components/ui/RelifLine';
import { SectionHeader } from '@/components/ui';
import { ROUTES, APP_CONFIG } from '@/config/constants';
import { SupabaseService } from '@/services/supabaseService';
import type { MasterBranch } from '@/data/masterCatalog';

export function ClosingCTASection() {
  return (
    <section
      className="section-verdigris py-24 md:py-32 relative overflow-hidden"
      aria-label="Book appointment"
    >
      <div className="absolute top-0 left-0 right-0 opacity-20">
        <RelifLine variant="cta" color="var(--sage)" strokeWidth={1.5} animated={false} />
      </div>

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2
            className="font-display font-semibold leading-tight text-balance mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
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

          <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: 'rgba(207,230,219,0.78)' }}>
            Upfront consultation fees, instant slots and digital records — book in six calm steps.
          </p>

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
              style={{ color: 'rgba(207,230,219,0.9)', borderRadius: '999px', padding: '1rem 2rem', border: '1.5px solid rgba(207,230,219,0.35)' }}
            >
              <Phone size={18} />
              Call Helpline
            </a>
            <a
              href="https://wa.me/919820110660"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium transition-opacity hover:opacity-80"
              style={{ color: 'rgba(207,230,219,0.9)', borderRadius: '999px', padding: '1rem 2rem', border: '1.5px solid rgba(207,230,219,0.35)' }}
            >
              <MessageCircle size={18} />
              WhatsApp Desk
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 opacity-30">
        <RelifLine variant="footer" color="var(--verdigris)" strokeWidth={2} animated={false} />
      </div>
    </section>
  );
}

// ── Patient Services ──────────────────────────────────────────────────────────
export function PatientServicesSection() {
  const SERVICES = [
    { label: 'My Appointments & Reschedule', href: ROUTES.patientAppointments, description: 'Reschedule slots or cancel with clear refund tracking' },
    { label: 'Download Lab Reports',         href: ROUTES.patientRecords,      description: 'Verified pathology & imaging PDFs in your portal' },
    { label: 'Billing & GST Receipts',       href: ROUTES.patientBilling,      description: 'Online payments, hospital receipts and refund history' },
    { label: 'Video Consultation',           href: `${ROUTES.book}`,           description: 'Consult senior specialists remotely across Maharashtra' },
    { label: 'Diagnostics & Packages',       href: ROUTES.diagnostics,         description: 'NABL pathology panels & imaging tariffs upfront' },
    { label: 'Insurance & Cashless TPA',     href: ROUTES.insurance,           description: 'Supported empanelments and pre-authorisation desk' },
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
              From transparent booking to instant digital receipts, every step respects your time.
            </p>
          </div>
          <div className="border-t border-sage-light">
            {SERVICES.map((service) => (
              <Link
                key={service.label}
                to={service.href}
                className="group flex items-center justify-between py-4 border-b border-sage-light hover:pl-2 transition-all duration-200"
              >
                <div>
                  <span className="font-semibold text-ink group-hover:text-verdigris transition-colors">
                    {service.label}
                  </span>
                  <p className="text-sm text-ink-soft mt-0.5">{service.description}</p>
                </div>
                <svg
                  width="20" height="20" viewBox="0 0 20 20" fill="none"
                  className="text-sage group-hover:text-verdigris transition-all duration-200 group-hover:translate-x-1 flex-shrink-0 ml-4"
                >
                  <path d="M4 10H16M12 6L16 10L12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Centres & Map Section ─────────────────────────────────────────────────────
export function CentresMapSection() {
  const [branches, setBranches] = useState<MasterBranch[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('andheri');

  useEffect(() => {
    void SupabaseService.getBranches().then(list => {
      setBranches(list);
      if (list[0]) setSelectedSlug(list[0].slug);
    });
  }, []);

  const activeBranch = branches.find(b => b.slug === selectedSlug) || branches[0];
  const mapSrc = activeBranch
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${activeBranch.lng - 0.02}%2C${activeBranch.lat - 0.015}%2C${activeBranch.lng + 0.02}%2C${activeBranch.lat + 0.015}&layer=mapnik&marker=${activeBranch.lat}%2C${activeBranch.lng}`
    : '';

  return (
    <section className="section-padding bg-bone" aria-label="Hospital Centres & Locations">
      <div className="section-container">
        <SectionHeader
          eyebrow="Our Centres"
          title="Three Hospitals Across Maharashtra."
          subtitle="Walk in 24/7 for emergencies or book scheduled OPD visits across Andheri West, Thane West, and Baner Pune."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 space-y-3">
            {branches.map(branch => {
              const active = branch.slug === selectedSlug;
              return (
                <button
                  key={branch.slug}
                  type="button"
                  onClick={() => setSelectedSlug(branch.slug)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    active
                      ? 'bg-paper border-verdigris shadow-warm-sm'
                      : 'bg-paper/70 border-sage-light hover:border-sage'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-display font-bold text-lg text-ink">{branch.name}</h3>
                    {branch.isMain && (
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-mint text-verdigris-deep font-semibold">
                        Flagship
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-soft mb-2 flex items-start gap-1.5">
                    <MapPin size={13} className="text-verdigris flex-shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-sage-light/60">
                    <span className="font-mono text-verdigris-deep font-semibold">{branch.phone}</span>
                    <span className="text-ink-soft">{branch.timings}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            <div className="card h-full min-h-[320px] flex flex-col bg-paper">
              {mapSrc && (
                <iframe
                  title={activeBranch?.name || 'Relif Care Location Map'}
                  src={mapSrc}
                  className="w-full flex-1 min-h-[280px] border-0"
                  loading="lazy"
                />
              )}
              {activeBranch && (
                <div className="p-4 border-t border-sage-light flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-ink font-medium">{activeBranch.address}</span>
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${activeBranch.lat},${activeBranch.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-verdigris hover:underline"
                    >
                      Open Directions →
                    </a>
                    <Link
                      to={`${ROUTES.book}`}
                      className="btn btn-primary btn-sm"
                    >
                      Book at {activeBranch.shortName}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Home FAQ Accordion ────────────────────────────────────────────────────────
const HOME_FAQS = [
  {
    q: 'Can I see the exact consultation fee before confirming my slot?',
    a: 'Yes. Every doctor card, specialist profile and every step of the 6-step booking flow displays the exact in-clinic or video fee and total payable amount before you commit.',
  },
  {
    q: 'What is the cancellation and refund policy?',
    a: 'Cancellations made 24 hours or more before your appointment receive a 100% refund. Cancellations between 2 to 24 hours receive a 50% refund. No refund applies within 2 hours of the scheduled slot.',
  },
  {
    q: 'Can I pay at the hospital instead of paying online?',
    a: 'Yes. On step 6 you can choose between Pay Online (UPI, Cards, Netbanking via Razorpay) or Pay at Hospital Desk with your booking confirmation.',
  },
  {
    q: 'How does double-booking protection work?',
    a: 'Each slot is locked atomically in PostgreSQL. Once reserved or paid, that time slot immediately closes and is struck out across all calendars until cancelled or freed.',
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="section-padding bg-bone" aria-label="Frequently Asked Questions">
      <div className="section-container max-w-3xl">
        <SectionHeader
          eyebrow="Common Questions"
          title="Clear Answers Before You Visit."
          subtitle="Pricing, cancellation refunds, rescheduling and slot protection explained plainly."
          align="center"
        />

        <div className="space-y-3">
          {HOME_FAQS.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={item.q} className="card bg-paper border-sage-light">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-semibold text-base text-ink">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-verdigris flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-ink-soft leading-relaxed border-t border-sage-light/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
