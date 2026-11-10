import React, { useState } from 'react';
import { Plus, Search, Edit2, UserCheck, UserX, X } from 'lucide-react';
import { DEPARTMENTS } from '@/config/constants';
import { Badge, DemoBadge, Button } from '@/components/ui';

interface DoctorData {
  id: string;
  name: string;
  qualifications: string;
  specialty: string;
  department: string;
  branch: string;
  status: 'Active' | 'Inactive';
  experience: number;
}

const INITIAL_DOCTORS: DoctorData[] = [
  { id: '1', name: 'Dr. Priya Sharma', qualifications: 'MBBS, MD, DM', specialty: 'Cardiologist', department: 'Cardiology', branch: 'Andheri', status: 'Active', experience: 15 },
  { id: '2', name: 'Dr. Rajesh Kulkarni', qualifications: 'MBBS, MS (Ortho)', specialty: 'Joint Replacement', department: 'Orthopedics', branch: 'Andheri', status: 'Active', experience: 20 },
  { id: '3', name: 'Dr. Ananya Joshi', qualifications: 'MBBS, DCH, DNB', specialty: 'Pediatric Care', department: 'Pediatrics', branch: 'Thane', status: 'Active', experience: 12 },
  { id: '4', name: 'Dr. Meera Patel', qualifications: 'MBBS, MD (Derm)', specialty: 'Cosmetology', department: 'Dermatology', branch: 'Andheri', status: 'Active', experience: 10 },
  { id: '5', name: 'Dr. Arun Nair', qualifications: 'MBBS, MD (Gen Med)', specialty: 'Internal Medicine', department: 'General Medicine', branch: 'Pune', status: 'Active', experience: 18 },
  { id: '6', name: 'Dr. Sunita Desai', qualifications: 'MBBS, DM (Neuro)', specialty: 'Neurologist', department: 'Neurology', branch: 'Andheri', status: 'Inactive', experience: 16 },
  { id: '7', name: 'Dr. Vikram Rao', qualifications: 'MBBS, DM (Cardio)', specialty: 'Electrophysiology', department: 'Cardiology', branch: 'Thane', status: 'Active', experience: 14 },
  { id: '8', name: 'Dr. Deepa Krishnan', qualifications: 'MBBS, MS (OBGYN)', specialty: 'High-risk Pregnancy', department: 'Gynecology', branch: 'Pune', status: 'Active', experience: 13 },
];

export function AdminDoctors() {
  const [doctors, setDoctors] = useState<DoctorData[]>(INITIAL_DOCTORS);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [dept, setDept] = useState('Cardiology');
  const [branch, setBranch] = useState('Andheri');
  const [exp, setExp] = useState(5);

  const filtered = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter ? doc.department === deptFilter : true;
    return matchesSearch && matchesDept;
  });

  const handleToggleStatus = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d));
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newDoc: DoctorData = {
      id: String(Date.now()),
      name,
      qualifications,
      specialty,
      department: dept,
      branch,
      status: 'Active',
      experience: Number(exp)
    };
    setDoctors([newDoc, ...doctors]);
    setDrawerOpen(false);
    setName('');
    setQualifications('');
    setSpecialty('');
    setToastMsg(`Doctor ${newDoc.name} added successfully (Demo)`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-mint border border-sage p-4 rounded-xl shadow-warm-md text-ink text-sm">
          {toastMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold text-ink">Doctors Management</h1>
            <DemoBadge />
          </div>
          <p className="text-ink-soft text-sm">Manage medical staff, schedules, and clinical privileges.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setDrawerOpen(true)}>
          Add Doctor
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-paper p-3 rounded-xl border border-sage-light">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Search doctor or specialty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2 text-sm"
          />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="input py-2 text-sm w-48"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-paper rounded-xl border border-sage-light overflow-hidden shadow-warm-sm">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Specialty & Dept</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center text-verdigris font-display font-semibold">
                        {doc.name.split(' ')[1]?.[0] || 'D'}
                      </div>
                      <div>
                        <p className="font-semibold text-ink text-sm">{doc.name}</p>
                        <p className="text-xs text-ink-soft">{doc.qualifications}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <p className="font-medium text-ink">{doc.specialty}</p>
                    <p className="text-xs text-ink-soft">{doc.department}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-ink-soft">{doc.branch}</td>
                  <td className="py-3 px-4 text-sm text-ink">{doc.experience} yrs</td>
                  <td className="py-3 px-4">
                    <Badge variant={doc.status === 'Active' ? 'default' : 'night'} size="sm">
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(doc.id)}
                        className="p-1.5 rounded-lg text-ink-soft hover:bg-bone hover:text-ink transition-colors"
                        title={doc.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {doc.status === 'Active' ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-modal flex justify-end bg-night/30 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper h-full shadow-warm-xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sage-light mb-6">
                <h2 className="font-display text-2xl font-bold text-ink">Add New Doctor</h2>
                <button onClick={() => setDrawerOpen(false)} className="p-1 text-ink-soft hover:text-ink">
                  <X size={20} />
                </button>
              </div>
              <form id="doc-form" onSubmit={handleSaveDoctor} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Qualifications</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, MD"
                    value={qualifications}
                    onChange={e => setQualifications(e.target.value)}
                    className="input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Specialty</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pediatric Cardiology"
                    value={specialty}
                    onChange={e => setSpecialty(e.target.value)}
                    className="input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Department</label>
                  <select
                    value={dept}
                    onChange={e => setDept(e.target.value)}
                    className="input text-sm"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Branch</label>
                  <select
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    className="input text-sm"
                  >
                    <option value="Andheri">Andheri</option>
                    <option value="Thane">Thane</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="1"
                    value={exp}
                    onChange={e => setExp(Number(e.target.value))}
                    className="input text-sm"
                  />
                </div>
              </form>
            </div>
            <div className="pt-6 border-t border-sage-light flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" type="submit" form="doc-form">
                Save Doctor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

