import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, HelpCircle, Star, FileText } from 'lucide-react';
import { Button, Badge, DemoBadge } from '@/components/ui';

export function AdminCMS() {
  const [section, setSection] = useState<'Banners' | 'Articles' | 'Testimonials' | 'FAQs'>('Banners');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold text-ink">Content Management System</h1>
            <DemoBadge />
          </div>
          <p className="text-ink-soft text-sm">Review, moderate and publish editorial health resources and portal content.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />}>
          Add New Entry
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sage-light gap-6 text-sm font-medium">
        {(['Banners', 'Articles', 'Testimonials', 'FAQs'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSection(tab)}
            className={`pb-3 transition-colors ${
              section === tab
                ? 'text-verdigris border-b-2 border-verdigris font-semibold'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {section === 'Banners' && (
        <div className="space-y-4">
          {[
            { id: 1, title: 'Cardiac Care Centre of Excellence', subtitle: 'Leading heart surgeons with 24/7 cath-lab capabilities', active: true },
            { id: 2, title: 'Annual Preventive Health Checkup Packages', subtitle: 'Know your comprehensive parameters before winter onset', active: true },
            { id: 3, title: '24/7 Emergency Trauma Unit', subtitle: 'Immediate response team with zero turnaround triage', active: false },
          ].map(b => (
            <div key={b.id} className="p-4 bg-paper rounded-xl border border-sage-light flex justify-between items-center shadow-warm-sm">
              <div>
                <h4 className="font-display font-semibold text-ink text-base">{b.title}</h4>
                <p className="text-xs text-ink-soft mt-0.5">{b.subtitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={b.active ? 'default' : 'night'} size="sm">
                  {b.active ? 'Active' : 'Draft'}
                </Badge>
                <button className="p-1.5 text-ink-soft hover:text-ink">
                  <Edit2 size={16} />
                </button>
                <button className="p-1.5 text-signal hover:text-signal-deep">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'Articles' && (
        <div className="bg-paper rounded-xl border border-sage-light overflow-hidden shadow-warm-sm">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Peer Reviewed</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: 'Understanding Your Heart Disease Risk Factors', author: 'Dr. Priya Sharma', cat: 'Cardiology', reviewed: true },
                { title: 'Knee Pain: When is it Time for Joint Replacement?', author: 'Dr. Rajesh Kulkarni', cat: 'Orthopedics', reviewed: true },
                { title: 'A Parent\'s Clinical Guide to Fever in Toddlers', author: 'Dr. Ananya Joshi', cat: 'Pediatrics', reviewed: true },
                { title: 'Managing Monsoon Skin Flare-ups and Infections', author: 'Dr. Meera Patel', cat: 'Dermatology', reviewed: false },
              ].map((art, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-4 font-medium text-ink text-sm">{art.title}</td>
                  <td className="py-3 px-4 text-xs text-ink-soft">{art.author}</td>
                  <td className="py-3 px-4"><Badge variant="default" size="sm">{art.cat}</Badge></td>
                  <td className="py-3 px-4 text-xs font-semibold text-verdigris">{art.reviewed ? '✓ Doctor Reviewed' : 'Pending'}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-xs text-verdigris hover:underline font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section === 'Testimonials' && (
        <div className="space-y-4">
          <div className="p-4 bg-bone rounded-xl border border-sage-light flex justify-between items-center">
            <div>
              <span className="demo-badge mb-1 inline-block">Moderation Queue</span>
              <p className="font-semibold text-ink text-sm">"The nursing staff at Andheri ICU took relentless care of my father."</p>
              <p className="text-xs text-ink-soft mt-1">— Anonymous Patient Family (Verified OPD ID #REL-2026-000412)</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Reject</Button>
              <Button variant="primary" size="sm">Approve & Publish</Button>
            </div>
          </div>
        </div>
      )}

      {section === 'FAQs' && (
        <div className="space-y-3">
          {[
            { q: 'What documents are required for Cashless TPA admission?', a: 'Valid photo ID, TPA card, and prescribing specialist pre-authorization certificate.' },
            { q: 'How do I download diagnostic radiology scans digitally?', a: 'Scans are populated to the Patient Portal Records section immediately post-radiologist signoff.' },
          ].map((f, i) => (
            <div key={i} className="p-4 bg-paper rounded-xl border border-sage-light">
              <h4 className="font-semibold text-ink text-sm">{f.q}</h4>
              <p className="text-xs text-ink-soft mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

