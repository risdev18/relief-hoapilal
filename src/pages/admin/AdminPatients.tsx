import React, { useState } from 'react';
import { Search, Eye, X, FileText, Calendar, ShieldCheck } from 'lucide-react';
import { Button, Badge, DemoBadge } from '@/components/ui';

interface PatientRecord {
  uhid: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  bloodGroup: string;
  lastVisit: string;
  registeredDate: string;
  appointmentsCount: number;
}

const DEMO_PATIENTS: PatientRecord[] = [
  { uhid: 'RH260192', name: 'Rahul Mehta', age: 38, gender: 'Male', phone: '+91 98201 12345', bloodGroup: 'B+', lastVisit: '2026-11-12', registeredDate: '2025-04-10', appointmentsCount: 5 },
  { uhid: 'RH260481', name: 'Sunita Patil', age: 52, gender: 'Female', phone: '+91 98202 23456', bloodGroup: 'O+', lastVisit: '2026-11-12', registeredDate: '2024-11-15', appointmentsCount: 8 },
  { uhid: 'RH260599', name: 'Amit Saxena', age: 29, gender: 'Male', phone: '+91 98203 34567', bloodGroup: 'A+', lastVisit: '2026-11-10', registeredDate: '2026-01-20', appointmentsCount: 2 },
  { uhid: 'RH260312', name: 'Sneha Deshmukh', age: 34, gender: 'Female', phone: '+91 98204 45678', bloodGroup: 'AB+', lastVisit: '2026-10-28', registeredDate: '2025-08-04', appointmentsCount: 4 },
  { uhid: 'RH260718', name: 'Farhan Khan', age: 45, gender: 'Male', phone: '+91 98205 56789', bloodGroup: 'O-', lastVisit: '2026-11-05', registeredDate: '2023-12-12', appointmentsCount: 12 },
  { uhid: 'RH260844', name: 'Kavita Rao', age: 61, gender: 'Female', phone: '+91 98206 67890', bloodGroup: 'B-', lastVisit: '2026-09-14', registeredDate: '2024-03-30', appointmentsCount: 7 },
  { uhid: 'RH260901', name: 'Vikram Seth', age: 41, gender: 'Male', phone: '+91 98207 78901', bloodGroup: 'A-', lastVisit: '2026-11-01', registeredDate: '2026-06-18', appointmentsCount: 3 },
  { uhid: 'RH260124', name: 'Pooja Hegde', age: 26, gender: 'Female', phone: '+91 98208 89012', bloodGroup: 'O+', lastVisit: '2026-11-08', registeredDate: '2026-09-02', appointmentsCount: 1 },
];

export function AdminPatients() {
  const [patients] = useState<PatientRecord[]>(DEMO_PATIENTS);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.uhid.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold text-ink">Patient Registry</h1>
            <DemoBadge />
          </div>
          <p className="text-ink-soft text-sm">Master Patient Index (MPI), UHID records, and authorized privacy access.</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-paper p-3 rounded-xl border border-sage-light">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Search by UHID, patient name, or phone number..."
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
                <th className="py-3 px-4">UHID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Last Visit</th>
                <th className="py-3 px-4">Total Visited</th>
                <th className="py-3 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.uhid}>
                  <td className="py-3 px-4">
                    <span className="id-mono text-xs">{p.uhid}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-ink text-sm">
                    {p.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-ink-soft">
                    {p.age} yrs · {p.gender} · <strong className="text-verdigris font-mono">{p.bloodGroup}</strong>
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-ink-soft">
                    {p.phone}
                  </td>
                  <td className="py-3 px-4 text-sm text-ink-soft">
                    {p.lastVisit}
                  </td>
                  <td className="py-3 px-4 text-sm text-ink">
                    {p.appointmentsCount} visits
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedPatient(p)}
                      className="p-1.5 rounded-lg text-ink-soft hover:bg-bone hover:text-ink transition-colors"
                      title="View medical dossier"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Drawer */}
      {selectedPatient && (
        <div className="fixed inset-0 z-modal flex justify-end bg-night/30 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper h-full shadow-warm-xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sage-light mb-6">
                <div>
                  <span className="id-mono text-xs">{selectedPatient.uhid}</span>
                  <h2 className="font-display text-2xl font-bold text-ink mt-1">{selectedPatient.name}</h2>
                </div>
                <button onClick={() => setSelectedPatient(null)} className="p-1 text-ink-soft hover:text-ink">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-bone rounded-xl border border-sage-light space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-soft">Age & Gender:</span>
                    <span className="font-medium text-ink">{selectedPatient.age} yrs, {selectedPatient.gender}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-soft">Blood Group:</span>
                    <span className="font-mono font-bold text-verdigris">{selectedPatient.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-soft">Registered On:</span>
                    <span className="text-ink">{selectedPatient.registeredDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-soft">Consent Status:</span>
                    <span className="inline-flex items-center gap-1 text-xs text-verdigris font-medium">
                      <ShieldCheck size={14} /> Explicit Verified
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-ink text-base mb-3">Clinical Dossier (Demo)</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-paper rounded-xl border border-sage-light flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-verdigris" />
                        <span className="text-sm font-medium text-ink">Comprehensive Health Checkup</span>
                      </div>
                      <span className="text-xs text-ink-soft">Nov 2026</span>
                    </div>
                    <div className="p-3 bg-paper rounded-xl border border-sage-light flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-verdigris" />
                        <span className="text-sm font-medium text-ink">Echocardiogram 2D Doppler</span>
                      </div>
                      <span className="text-xs text-ink-soft">Aug 2026</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-sage p-4 text-xs text-ink-soft leading-relaxed">
                  <p><strong>DPDP Act Compliance Mode:</strong> Record decryption requires tokenized clinician approval. Full electronic medical audit logged under session #DEMO-AUDIT-992.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-sage-light flex gap-3">
              <Button variant="primary" className="w-full" onClick={() => setSelectedPatient(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

