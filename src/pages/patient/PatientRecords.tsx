// PatientRecords.tsx — Real Supabase Pathology Reports, Prescriptions & Discharge Summaries (Zero Demo Data)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Pill, FileText, Scan } from 'lucide-react';
import { Badge, EmptyState, Skeleton } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { SupabaseService, PatientReportRecord } from '@/services/supabaseService';
import { cn } from '@/utils';

export function PatientRecords() {
  const [reports, setReports] = useState<PatientReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'lab' | 'prescription' | 'discharge' | 'imaging'>('all');

  useEffect(() => {
    void SupabaseService.getPatientReports().then(list => {
      setReports(list);
      setLoading(false);
    });
  }, []);

  const visible = reports.filter(r => filterType === 'all' || r.report_type === filterType);

  const iconFor = (t: PatientReportRecord['report_type']) => {
    if (t === 'lab') return FlaskConical;
    if (t === 'prescription') return Pill;
    if (t === 'imaging') return Scan;
    return FileText;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Medical Records</h1>
        <p className="text-sm text-ink-soft mt-1">
          NABL-verified laboratory reports, digital prescriptions and discharge summaries linked to your UHID.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Records' },
          { id: 'lab', label: 'Lab Reports' },
          { id: 'prescription', label: 'Prescriptions' },
          { id: 'imaging', label: 'Imaging' },
          { id: 'discharge', label: 'Discharge Summaries' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id as any)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors',
              filterType === tab.id
                ? 'bg-verdigris text-white border-verdigris'
                : 'bg-paper text-ink-soft border-sage-light hover:border-verdigris'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Skeleton lines={4} />
      ) : visible.length === 0 ? (
        <div className="card p-8 bg-paper">
          <EmptyState
            icon={<FileText size={28} />}
            title="No medical records available yet"
            description="Completed consultation prescriptions and verified NABL pathology reports issued by your clinician will appear here automatically."
            action={
              <Link to={ROUTES.book} className="btn btn-primary btn-md">
                Schedule a Consultation →
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(rep => {
            const Icon = iconFor(rep.report_type);
            return (
              <div key={rep.id} className="card p-5 bg-paper flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center text-verdigris-deep flex-shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-ink text-base">{rep.title}</h2>
                      <Badge variant={rep.status === 'ready' ? 'verdigris' : 'saffron'} size="sm">
                        {rep.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-ink-soft mt-0.5">
                      {rep.doctor_name} · {rep.department_name} · {new Date(rep.issued_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                {rep.file_url && (
                  <a
                    href={rep.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm flex-shrink-0"
                  >
                    Open Report →
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
