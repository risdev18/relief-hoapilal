// Admin Patients Registry — Derived Strictly from Real Authenticated Supabase Appointments (Zero Demo Data)
import React, { useEffect, useMemo, useState } from 'react';
import { Search, Eye, X, Calendar, ShieldCheck, Users } from 'lucide-react';
import { SupabaseService, type SupabaseAppointmentRecord } from '@/services/supabaseService';
import { Button } from '@/components/ui';
import { formatDate } from '@/utils';

interface PatientSummary {
  patientId: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  appointmentsCount: number;
  departments: string[];
  recentBookings: SupabaseAppointmentRecord[];
}

export function AdminPatients() {
  const [appointments, setAppointments] = useState<SupabaseAppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);

  useEffect(() => {
    let mounted = true;
    SupabaseService.adminGetAllAppointments()
      .then((rows) => {
        if (mounted) setAppointments(rows);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const patients = useMemo<PatientSummary[]>(() => {
    const map = new Map<string, PatientSummary>();
    appointments.forEach((a) => {
      const key = a.patient_id || a.patient_email || a.booking_ref;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          patientId: key,
          name: a.patient_name,
          email: a.patient_email,
          phone: a.patient_phone,
          lastVisit: a.appointment_date,
          appointmentsCount: 1,
          departments: [a.department_name],
          recentBookings: [a],
        });
      } else {
        existing.appointmentsCount += 1;
        if (a.appointment_date > existing.lastVisit) existing.lastVisit = a.appointment_date;
        if (a.department_name && !existing.departments.includes(a.department_name)) {
          existing.departments.push(a.department_name);
        }
        existing.recentBookings.push(a);
      }
    });
    return Array.from(map.values());
  }, [appointments]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.includes(search)
    );
  }, [patients, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Patient Registry</h1>
        <p className="text-ink-soft text-sm">
          Authenticated patient index synchronized from live Supabase appointments and clinical visits.
        </p>
      </div>

      {/* Search */}
      <div className="bg-paper p-3 rounded-xl border border-sage-light">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Search by patient name, email, or phone number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-paper rounded-xl border border-sage-light overflow-hidden shadow-warm-sm">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left">Patient</th>
                <th className="py-3 px-4 text-left">Contact</th>
                <th className="py-3 px-4 text-left">Departments Visited</th>
                <th className="py-3 px-4 text-left">Latest Date</th>
                <th className="py-3 px-4 text-left">Bookings</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-ink-soft">
                    Loading patient registry…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <Users size={28} className="mx-auto text-sage mb-2" />
                    <p className="text-sm font-medium text-ink">No patient visits recorded yet</p>
                    <p className="text-xs text-ink-soft mt-1">
                      Registered patients appear here once they book an appointment.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.patientId}>
                    <td className="py-3 px-4 font-semibold text-ink text-sm">{p.name}</td>
                    <td className="py-3 px-4 text-xs font-mono text-ink-soft">
                      <div>{p.phone || '—'}</div>
                      <div>{p.email}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-ink-soft">{p.departments.join(', ')}</td>
                    <td className="py-3 px-4 text-sm text-ink-soft">{formatDate(p.lastVisit)}</td>
                    <td className="py-3 px-4 text-sm text-ink">{p.appointmentsCount}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedPatient(p)}
                        className="p-1.5 rounded-lg text-ink-soft hover:bg-bone hover:text-ink transition-colors"
                        title="Inspect patient bookings"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-night/40 backdrop-blur-sm p-4">
          <div className="bg-paper rounded-2xl max-w-lg w-full p-6 border border-sage-light shadow-warm-lg space-y-5">
            <div className="flex justify-between items-start pb-4 border-b border-sage-light">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink">{selectedPatient.name}</h2>
                <p className="text-xs font-mono text-ink-soft mt-0.5">
                  {selectedPatient.email} · {selectedPatient.phone}
                </p>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="p-1 text-ink-soft hover:text-ink">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <p className="text-xs font-mono uppercase tracking-wider text-verdigris">Visit History</p>
              {selectedPatient.recentBookings.map(b => (
                <div key={b.id} className="p-3 bg-bone rounded-xl border border-sage-light flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-ink">{b.doctor_name} · {b.department_name}</p>
                    <p className="text-ink-soft flex items-center gap-1 mt-0.5">
                      <Calendar size={12} /> {formatDate(b.appointment_date)} at {b.appointment_time}
                    </p>
                  </div>
                  <span className="font-mono text-verdigris uppercase">{b.status}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-mint/40 rounded-xl border border-sage text-xs text-verdigris-deep flex items-start gap-2">
              <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
              <p>
                <strong>DPDP Act &amp; Row-Level Security:</strong> Patient records are protected by Supabase RLS policies scoped to clinical and admin authorization.
              </p>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedPatient(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
