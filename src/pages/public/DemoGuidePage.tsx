// Demo Guide Page — explains all demo accounts and features
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { DemoBadge, Badge } from '@/components/ui';

const DEMO_ACCOUNTS = [
  { role: 'Patient', email: 'test@relif.demo', password: 'Demo1234', portal: '/patient/dashboard', note: 'Full patient portal access' },
  { role: 'Doctor', email: 'doctor@relif.demo', password: 'Demo1234', portal: '/doctor/dashboard', note: 'Dr. Priya Sharma — Cardiology' },
  { role: 'Receptionist', email: 'reception@relif.demo', password: 'Demo1234', portal: '/reception/dashboard', note: 'Andheri branch reception' },
  { role: 'Admin', email: 'admin@relif.demo', password: 'Demo1234', portal: '/admin/dashboard', note: 'Full admin access' },
  { role: 'Super Admin', email: 'superadmin@relif.demo', password: 'Demo1234', portal: '/admin/dashboard', note: 'All permissions' },
];

const PITCH_STEPS = [
  { time: '0:00', label: 'Landing page', desc: 'Hero concierge, Relif Line, departments list, doctors strip' },
  { time: '0:45', label: 'Book an appointment', desc: 'Full 6-step booking wizard with slot picker and QR confirmation' },
  { time: '1:30', label: 'Patient portal', desc: 'Dashboard, appointment timeline, records, billing' },
  { time: '2:15', label: 'Doctor portal', desc: 'Day timeline, patient queue, schedule management' },
  { time: '3:00', label: 'Reception portal', desc: 'Live queue board, QR check-in, walk-in registration' },
  { time: '3:45', label: 'Admin dashboard', desc: 'KPIs, analytics charts, doctor/department CRUD, CMS' },
  { time: '4:30', label: 'Design system', desc: 'Color tokens, components, Relif Line, typography' },
  { time: '5:00', label: 'Emergency & public pages', desc: 'All public pages, multilingual structure, accessibility' },
];

export function DemoGuidePage() {
  return (
    <div className="bg-paper min-h-screen">
      {/* Hero */}
      <div className="bg-night py-16">
        <div className="section-container">
          <DemoBadge className="mb-4" />
          <h1 className="font-display text-5xl font-bold mb-4" style={{ color: '#E8F4EF' }}>
            Demo Guide
          </h1>
          <p className="text-lg max-w-xl" style={{ color: 'var(--sage)' }}>
            Everything you need to explore the Relif Hospital demo in 5 minutes.
          </p>
        </div>
      </div>

      <div className="section-container section-padding space-y-16">
        {/* Important disclaimer */}
        <div className="rounded-2xl border-2 border-signal p-6" style={{ background: 'var(--signal-light)' }}>
          <h2 className="font-display text-2xl font-bold text-signal mb-3">⚠ Demo Project</h2>
          <ul className="space-y-1 text-sm text-ink">
            <li>• All data is completely fictional. No real patients, doctors, or transactions.</li>
            <li>• No real authentication — login with demo accounts below.</li>
            <li>• Notifications go to a simulated outbox — no SMS, email, or WhatsApp is sent.</li>
            <li>• Payment buttons show sandbox UI — no real money is charged.</li>
            <li>• Emergency numbers shown are fictional placeholders — do not call them.</li>
            <li>• Ambulance tracking is a simulation — not real dispatch.</li>
            <li>• Accreditations shown are placeholders only.</li>
          </ul>
        </div>

        {/* Demo accounts */}
        <section>
          <h2 className="font-display text-3xl font-bold text-ink mb-6">Demo Accounts</h2>
          <p className="text-ink-soft mb-6">Use these credentials to explore each portal. No real authentication occurs.</p>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="data-table th">Role</th>
                  <th className="data-table th">Email</th>
                  <th className="data-table th">Password</th>
                  <th className="data-table th">Portal</th>
                  <th className="data-table th">Note</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_ACCOUNTS.map(acc => (
                  <tr key={acc.role}>
                    <td className="data-table td"><Badge variant="default" size="sm">{acc.role}</Badge></td>
                    <td className="data-table td"><span className="font-mono text-sm">{acc.email}</span></td>
                    <td className="data-table td"><span className="font-mono text-sm">{acc.password}</span></td>
                    <td className="data-table td"><Link to={acc.portal} className="text-verdigris hover:underline text-sm font-medium">{acc.portal}</Link></td>
                    <td className="data-table td text-ink-soft text-sm">{acc.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-soft mt-3">
            These accounts only work with Firebase Emulator Suite running locally, or in demo simulation mode.
          </p>
        </section>

        {/* 5-minute pitch walkthrough */}
        <section>
          <h2 className="font-display text-3xl font-bold text-ink mb-6">5-Minute Pitch Walkthrough</h2>
          <div className="space-y-4">
            {PITCH_STEPS.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="font-mono text-sm font-bold text-verdigris w-12 flex-shrink-0 pt-0.5">{step.time}</div>
                <div className="flex-1 p-4 card-bone">
                  <p className="font-semibold text-ink">{step.label}</p>
                  <p className="text-sm text-ink-soft mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick navigation */}
        <section>
          <h2 className="font-display text-3xl font-bold text-ink mb-6">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: 'Landing Page', href: '/' },
              { label: 'Book Appointment', href: '/book' },
              { label: 'All Departments', href: '/departments' },
              { label: 'All Doctors', href: '/doctors' },
              { label: 'Emergency', href: '/emergency' },
              { label: 'Design System', href: '/design-system' },
              { label: 'Patient Portal', href: '/patient/dashboard' },
              { label: 'Doctor Portal', href: '/doctor/dashboard' },
              { label: 'Reception', href: '/reception/dashboard' },
              { label: 'Admin Dashboard', href: '/admin/dashboard' },
              { label: 'Health Library', href: '/health-library' },
              { label: 'Insurance & Cost', href: '/insurance' },
            ].map(item => (
              <Link key={item.href} to={item.href}
                className="p-3 card text-sm font-medium text-verdigris hover:bg-mint hover:shadow-warm transition-all duration-200">
                {item.label} →
              </Link>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section>
          <h2 className="font-display text-3xl font-bold text-ink mb-6">Tech Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              'React 18 + Vite', 'TypeScript', 'Tailwind CSS', 'React Router v6',
              'Framer Motion', 'Firebase Auth + Firestore', 'Firebase Storage', 'Firebase Functions',
              'Recharts', 'Lucide Icons', 'i18next', 'React Hook Form + Zod',
              'Radix UI Primitives', 'GSAP (Relif Line)', 'Lenis (smooth scroll)', 'Firebase Emulator Suite',
            ].map(tech => (
              <div key={tech} className="chip justify-center text-center">{tech}</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

