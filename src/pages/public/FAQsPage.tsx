import React, { useState } from 'react';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  category: string;
  q: string;
  a: string;
}

const FAQS_DATA: FAQItem[] = [
  { category: 'Appointments', q: 'How do I book an OPD appointment?', a: 'You can book via our digital booking wizard online, or by calling our hospital helpline. You will receive an instant appointment ID and QR code token.' },
  { category: 'Appointments', q: 'Can I reschedule or cancel my appointment?', a: 'Yes, appointments can be freely rescheduled up to 2 hours prior to the slot through your Patient Portal dashboard.' },
  { category: 'Billing', q: 'Is cashless hospitalization available with private health insurance?', a: 'Yes, our 24/7 TPA Desk assists with pre-authorization across all major insurers and TPAs including Star Health, HDFC ERGO, ICICI Lombard, and Vidal.' },
  { category: 'Billing', q: 'Do you offer cost estimates before surgical admission?', a: 'Yes. Our online Cost Estimator provides indicative tariffs, and our front-desk counselors issue formal financial estimates.' },
  { category: 'Records', q: 'How soon are diagnostic and pathology test reports ready?', a: 'Routine biochemistry and blood counts are available within 3 to 4 hours digitally in your Patient Portal. Advanced imaging is signed off within 12 hours.' },
  { category: 'Visiting', q: 'What are the visiting hours for inpatient wards?', a: 'General wards allow visitors from 4:30 PM to 7:00 PM daily. Only one authorized attendant pass is permitted overnight per patient.' },
  { category: 'Visiting', q: 'Is parking available at all branches?', a: 'Yes, multi-level and valet parking are available at our Andheri Main branch and designated parking bays at Thane and Pune.' },
];

export function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = ['All', 'Appointments', 'Billing', 'Records', 'Visiting'];

  const filtered = FAQS_DATA.filter(item => {
    const matchesCat = activeCategory === 'All' ? true : item.category === activeCategory;
    const matchesSearch = item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Frequently Asked Questions</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Answers, <em className="italic font-normal text-verdigris">clearly</em> stated.
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Find answers to common questions regarding admissions, insurance approvals, appointment rescheduling, and hospital protocols.
          </p>
        </div>
      </div>

      <div className="section-container section-padding max-w-3xl">
        {/* Search */}
        <div className="bg-paper p-3 rounded-xl border border-sage-light mb-6">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9 py-2 text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`chip transition-colors ${
                activeCategory === c
                  ? 'bg-verdigris text-white border-verdigris'
                  : 'bg-paper text-ink hover:bg-bone'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {filtered.map((item, idx) => (
            <div key={idx} className="bg-paper rounded-xl border border-sage-light overflow-hidden shadow-warm-sm">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-5 font-display font-semibold text-ink flex justify-between items-center hover:bg-bone transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-verdigris transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-5 pb-5 text-sm text-ink-soft leading-relaxed border-t border-sage-light pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

