// Departments section — 8 Clinical Departments with icons, live Supabase specialist counts, and instant booking links

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ChevronRight, Heart, Brain, Bone, Baby, HeartHandshake, Sparkles, Stethoscope, Eye
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/constants';
import { SectionHeader } from '@/components/ui';
import { SupabaseService } from '@/services/supabaseService';
import type { MasterDepartment, MasterDoctor } from '@/data/masterCatalog';

const ICON_MAP: Record<string, React.ElementType> = {
  Heart,
  Brain,
  Bone,
  Baby,
  HeartHandshake,
  Sparkles,
  Stethoscope,
  Eye,
};

export function DepartmentsSection() {
  const { i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState<MasterDepartment[]>([]);
  const [doctors, setDoctors] = useState<MasterDoctor[]>([]);

  useEffect(() => {
    void Promise.all([
      SupabaseService.getDepartments(),
      SupabaseService.getDoctors(),
    ]).then(([depts, docs]) => {
      setDepartments(depts);
      setDoctors(docs);
    });
  }, []);

  const lang = (i18n.language || 'en').slice(0, 2);

  const filtered = departments.filter(d => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      (d.symptomKeywords || []).some(k => k.toLowerCase().includes(q))
    );
  });

  return (
    <section className="section-padding bg-paper" aria-label="Departments">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeader
            eyebrow="Clinical Specialties"
            title="Eight Multispecialty Departments."
            subtitle="Choose any department to inspect specialist qualifications, transparent INR fees, and today's schedule."
            className="mb-0"
          />

          <div className="relative w-full md:w-72 flex-shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" size={16} />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search department or symptom…"
              className="input pl-10 text-sm"
              aria-label="Filter clinical departments"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((dept, i) => {
            const Icon = ICON_MAP[dept.icon] || Heart;
            const deptDocs = doctors.filter(doc => doc.departmentSlug === dept.slug);
            const minFee =
              deptDocs.length > 0
                ? Math.min(...deptDocs.map(d => d.feeInClinic))
                : 700;
            const localizedName =
              lang === 'hi' ? dept.nameHi : lang === 'mr' ? dept.nameMr : dept.name;

            return (
              <motion.div
                key={dept.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="card p-6 flex flex-col justify-between hover:border-verdigris transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-mint flex items-center justify-center text-verdigris-deep group-hover:bg-verdigris group-hover:text-white transition-colors">
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-bone border border-sage-light text-ink-soft">
                      {deptDocs.length} {deptDocs.length === 1 ? 'Doctor' : 'Doctors'}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-ink mb-1">
                    {localizedName}
                  </h3>
                  {lang !== 'en' && (
                    <p className="font-mono text-[11px] text-verdigris mb-1.5">{dept.name}</p>
                  )}
                  <p className="text-sm text-ink-soft leading-relaxed mb-4">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-sage-light flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-verdigris-deep">
                    From ₹{minFee}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      to={ROUTES.department(dept.slug)}
                      className="text-ink-soft hover:text-ink font-medium"
                    >
                      Explore
                    </Link>
                    <Link
                      to={`${ROUTES.book}?department=${dept.slug}`}
                      className="inline-flex items-center gap-0.5 font-semibold text-verdigris hover:text-verdigris-deep"
                    >
                      Book <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
