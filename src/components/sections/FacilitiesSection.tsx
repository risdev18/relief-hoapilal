import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Scan, ShieldCheck, Activity, Baby, Pill, ArrowRight } from 'lucide-react';
import { SectionHeader, Badge, DemoBadge } from '@/components/ui';
import { ROUTES } from '@/config/constants';

const FACILITIES = [
  {
    id: 'cath-lab',
    icon: Activity,
    title: 'Bi-Plane Interventional Cath Lab',
    spec: 'Philips Azurion 7 · IVUS / FFR Integrated',
    desc: 'Ultra-low radiation real-time cardiovascular imaging for primary emergency angioplasties and complex valve repairs.',
    tag: 'Cardiac Sciences',
  },
  {
    id: 'mri-3t',
    icon: Scan,
    title: '3-Tesla Wide-Bore Digital MRI',
    spec: 'Siemens Magnetom Vida with BioMatrix',
    desc: '70cm wide bore reducing claustrophobia, generating sub-millimeter neurovascular and orthopedic tissue resolution.',
    tag: 'Radiology',
  },
  {
    id: 'robotic-ot',
    icon: Building,
    title: 'Robotic Arthroplasty Surgical Suite',
    spec: 'MAKO Stryker SmartRobotics · Class-100 Laminar Air',
    desc: 'Sub-millimeter prosthetic bone alignment for joint replacements with minimal surrounding muscle trauma.',
    tag: 'Orthopedics',
  },
  {
    id: 'nicu-level3',
    icon: Baby,
    title: 'Level-3 Tertiary Neonatal ICU (NICU)',
    spec: 'Giraffe Omnibed Carestations · Inhaled Nitric Oxide',
    desc: 'Sterile high-acuity suites staffed 24/7 by neonatologists for pre-term and critical newborn resuscitation.',
    tag: 'Mother & Child',
  },
  {
    id: 'dialysis-unit',
    icon: ShieldCheck,
    title: 'Hemodialysis & CRRT Renal Wing',
    spec: 'Fresenius 5008S with Online Endotoxin Filters',
    desc: 'Individualized ultra-pure water filtration stations with round-the-clock intensive care bedside support.',
    tag: 'Kidney Care',
  },
  {
    id: 'pharmacy-247',
    icon: Pill,
    title: '24/7 Automated Clinical Pharmacy',
    spec: 'Temperature-Controlled Cold Chain Barcode Verification',
    desc: 'Fully stocked hospital formulary guaranteeing anti-counterfeit pharmaceutical supply directly to OPD and wards.',
    tag: 'Hospital Support',
  },
];

export function FacilitiesSection() {
  return (
    <section className="section-padding bg-paper relative overflow-hidden" aria-label="Hospital Facilities">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-xs font-semibold text-verdigris tracking-widest uppercase block mb-2">
              Advanced Clinical Infrastructure
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight">
              World-Class Technology. <br />
              <em className="italic font-normal text-verdigris">Engineered for healing.</em>
            </h2>
          </div>
          <Link to={ROUTES.facilities} className="link-arrow flex-shrink-0 text-verdigris font-semibold flex items-center gap-1">
            Explore all facilities <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACILITIES.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="card p-6 bg-paper border border-sage-light rounded-2xl shadow-warm-xs hover:shadow-warm-md hover:border-sage transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-xl bg-mint text-verdigris flex items-center justify-center">
                    <f.icon size={24} />
                  </div>
                  <Badge variant="default" size="sm">{f.tag}</Badge>
                </div>
                <h3 className="font-display font-bold text-ink text-xl mb-1">{f.title}</h3>
                <p className="font-mono text-xs text-verdigris font-semibold mb-2">{f.spec}</p>
                <p className="text-xs text-ink-soft leading-relaxed">{f.desc}</p>
              </div>

              <div className="pt-3 border-t border-sage-light flex justify-between items-center text-xs">
                <span className="text-sage font-mono">NABH Compliant</span>
                <Link to={ROUTES.facilities} className="text-verdigris font-semibold hover:underline flex items-center gap-1">
                  Learn more <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
