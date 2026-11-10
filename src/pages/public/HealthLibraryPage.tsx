import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, Calculator, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, DemoBadge, Badge } from '@/components/ui';

interface ArticleItem {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  reviewer: string;
  summary: string;
}

const ARTICLES: ArticleItem[] = [
  { slug: 'understanding-cardiac-risk', title: 'Understanding Your True Cardiovascular Risk Factors', category: 'Cardiology', readTime: '5 min read', reviewer: 'Dr. Priya Sharma', summary: 'Hypertension and cholesterol are not silent enemies if tracked methodically. A guide to lipid parameters and preventive screening.' },
  { slug: 'when-to-seek-ortho-consult', title: 'Persistent Knee Discomfort: Osteoarthritis or Ligament Injury?', category: 'Orthopedics', readTime: '4 min read', reviewer: 'Dr. Rajesh Kulkarni', summary: 'Why waiting out persistent knee swelling can accelerate cartilage degeneration. Early interventions versus surgical arthroplasty.' },
  { slug: 'childhood-fever-red-flags', title: 'A Parent’s Clinical Roadmap to Toddler Fevers and Dehydration', category: 'Pediatrics', readTime: '6 min read', reviewer: 'Dr. Ananya Joshi', summary: 'When a spike in body temperature is a benign immune reaction, and the exact clinical signs that mandate emergency evaluation.' },
  { slug: 'monsoon-dermatology-care', title: 'Guarding Your Skin Barrier in Humid Monsoon Climes', category: 'Dermatology', readTime: '3 min read', reviewer: 'Dr. Meera Patel', summary: 'Fungal flare-ups and bacterial folliculitis surge during monsoons. Practical dermatological steps to keep skin dry and protected.' },
];

export function HealthLibraryPage() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  // Interactive Health Tool: BMI
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [bmi, setBmi] = useState<number | null>(22.9);

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      setBmi(parseFloat((w / (h * h)).toFixed(1)));
    }
  };

  const filtered = ARTICLES.filter(a => {
    const matchesCat = activeCat === 'All' ? true : a.category === activeCat;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Physician-Reviewed Library</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Answers worth reading.
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Written by senior clinicians in plain language. Zero algorithmic sensationalism, zero medical jargon.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding space-y-16">
        {/* Search & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-paper p-4 rounded-xl border border-sage-light">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              placeholder="Search health library..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology'].map(c => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`chip text-xs transition-colors ${
                  activeCat === c
                    ? 'bg-verdigris text-white border-verdigris'
                    : 'bg-paper text-ink hover:bg-bone'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map(art => (
            <div key={art.slug} className="card p-6 bg-paper border border-sage-light shadow-warm-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <Badge variant="default" size="sm">{art.category}</Badge>
                  <span className="flex items-center gap-1 text-ink-soft"><Clock size={12} /> {art.readTime}</span>
                </div>
                <h3 className="font-display font-bold text-ink text-xl hover:text-verdigris transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-ink-soft leading-relaxed">{art.summary}</p>
              </div>

              <div className="pt-4 border-t border-sage-light flex justify-between items-center text-xs">
                <span className="text-verdigris font-medium flex items-center gap-1">
                  <CheckCircle2 size={13} /> Reviewed by {art.reviewer}
                </span>
                <span className="text-ink font-semibold hover:underline cursor-pointer">Read Guide →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Clinical Calculator: BMI */}
        <div className="bg-bone p-8 rounded-2xl border border-sage-light grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="text-verdigris" size={22} />
              <h2 className="font-display text-2xl font-bold text-ink">Body Mass Index (BMI) Clinical Gauge</h2>
            </div>
            <p className="text-xs text-ink-soft mb-6 leading-relaxed">
              Standard clinical ratio of mass to height. Used by our internal medicine department as a baseline wellness metric.
            </p>

            <form onSubmit={calculateBMI} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  className="input text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="input text-sm"
                />
              </div>
              <Button variant="primary" type="submit" className="col-span-2">
                Recalculate
              </Button>
            </form>
          </div>

          <div className="p-6 bg-paper rounded-2xl border border-sage-light text-center space-y-2">
            <span className="text-xs font-mono text-sage uppercase tracking-wider">Calculated BMI Score</span>
            <span className="font-display text-5xl font-bold text-verdigris block">{bmi}</span>
            <p className="text-xs font-semibold text-ink">
              {bmi && bmi < 18.5 ? 'Underweight' : bmi && bmi < 25 ? 'Normal Weight (Optimal)' : 'Overweight Baseline'}
            </p>
            <p className="text-[11px] text-ink-soft italic pt-2">
              * Informational only. Consult Dr. Arun Nair (General Medicine) for an individualized metabolic evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

