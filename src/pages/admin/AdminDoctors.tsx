// Admin Doctors Management — Live Supabase CRUD, Portrait Upload to 'doctor-photos', Fee & Slot Generation
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus, Search, Edit2, UserCheck, UserX, X,
  Upload, CalendarPlus, RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';
import { SupabaseService } from '@/services/supabaseService';
import type { MasterBranch, MasterDepartment, MasterDoctor } from '@/data/masterCatalog';
import { Badge, Button, DoctorAvatar } from '@/components/ui';
import { formatINR } from '@/utils';

interface DoctorFormState {
  id?: string;
  slug: string;
  name: string;
  designation: string;
  specialty: string;
  departmentId: string;
  branchId: string;
  qualifications: string;
  specialities: string;
  languages: string;
  experienceYears: number;
  feeInClinic: number;
  feeVideo: number;
  opdTimings: string;
  opdDays: string;
  availability: 'available' | 'soon' | 'away';
  registrationNumber: string;
  bio: string;
  photoUrl: string;
  isActive: boolean;
}

const EMPTY_FORM: DoctorFormState = {
  slug: '',
  name: '',
  designation: 'Consultant',
  specialty: '',
  departmentId: '',
  branchId: '',
  qualifications: 'MBBS, MD',
  specialities: '',
  languages: 'English, Hindi, Marathi',
  experienceYears: 8,
  feeInClinic: 900,
  feeVideo: 700,
  opdTimings: '09:30 AM – 01:30 PM',
  opdDays: 'Mon – Sat',
  availability: 'available',
  registrationNumber: 'MMC-2026-0000',
  bio: '',
  photoUrl: '',
  isActive: true,
};

export function AdminDoctors() {
  const [doctors, setDoctors] = useState<MasterDoctor[]>([]);
  const [departments, setDepartments] = useState<MasterDepartment[]>([]);
  const [branches, setBranches] = useState<MasterBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<DoctorFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [generatingSlots, setGeneratingSlots] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [docs, depts, brs] = await Promise.all([
        SupabaseService.getDoctors(true),
        SupabaseService.getDepartments(),
        SupabaseService.getBranches(),
      ]);
      setDoctors(docs);
      setDepartments(depts);
      setBranches(brs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateDrawer = () => {
    setForm({
      ...EMPTY_FORM,
      departmentId: departments[0]?.id || '',
      branchId: branches[0]?.id || '',
    });
    setDrawerOpen(true);
  };

  const openEditDrawer = (doc: MasterDoctor) => {
    setForm({
      id: doc.id,
      slug: doc.slug,
      name: doc.name,
      designation: doc.designation,
      specialty: doc.specialty,
      departmentId: doc.departmentId,
      branchId: doc.branchId,
      qualifications: doc.qualifications.join(', '),
      specialities: doc.specialities.join(', '),
      languages: doc.languages.join(', '),
      experienceYears: doc.experienceYears,
      feeInClinic: doc.feeInClinic,
      feeVideo: doc.feeVideo,
      opdTimings: doc.opdTimings,
      opdDays: doc.opdDays,
      availability: doc.availability,
      registrationNumber: doc.registrationNumber,
      bio: doc.bio,
      photoUrl: doc.photoUrl,
      isActive: doc.isActive,
    });
    setDrawerOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setFeedback(null);
    try {
      const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'doctor';
      const url = await SupabaseService.adminUploadDoctorPhoto(file, slug);
      setForm(prev => ({ ...prev, photoUrl: url }));
      setFeedback({ type: 'success', message: 'Portrait uploaded to Supabase Storage (doctor-photos).' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Could not upload portrait.' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.specialty.trim() || !form.departmentId || !form.branchId) return;
    setSaving(true);
    setFeedback(null);
    try {
      const generatedSlug =
        form.slug.trim() ||
        form.name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

      await SupabaseService.adminUpsertDoctor({
        id: form.id,
        slug: generatedSlug,
        name: form.name.trim(),
        designation: form.designation.trim() || 'Consultant',
        specialty: form.specialty.trim(),
        department_id: form.departmentId,
        branch_id: form.branchId,
        bio: form.bio.trim() || `${form.designation} in ${form.specialty} at Relif Care Multispecialty.`,
        qualifications: form.qualifications.split(',').map(s => s.trim()).filter(Boolean),
        specialities: form.specialities.split(',').map(s => s.trim()).filter(Boolean),
        languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
        experience_years: Number(form.experienceYears) || 1,
        photo_url: form.photoUrl.trim(),
        registration_number: form.registrationNumber.trim() || 'MMC-REG',
        fee_in_clinic: Number(form.feeInClinic) || 800,
        fee_video: Number(form.feeVideo) || 600,
        opd_timings: form.opdTimings.trim() || '09:30 AM – 01:30 PM',
        opd_days: form.opdDays.trim() || 'Mon – Sat',
        availability: form.availability,
        is_active: form.isActive,
      });
      setDrawerOpen(false);
      setFeedback({ type: 'success', message: `${form.name} saved to Supabase.` });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save doctor record.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (doc: MasterDoctor) => {
    setFeedback(null);
    try {
      await SupabaseService.adminUpsertDoctor({
        id: doc.id,
        slug: doc.slug,
        name: doc.name,
        designation: doc.designation,
        specialty: doc.specialty,
        department_id: doc.departmentId,
        branch_id: doc.branchId,
        bio: doc.bio,
        qualifications: doc.qualifications,
        specialities: doc.specialities,
        languages: doc.languages,
        experience_years: doc.experienceYears,
        photo_url: doc.photoUrl,
        registration_number: doc.registrationNumber,
        fee_in_clinic: doc.feeInClinic,
        fee_video: doc.feeVideo,
        opd_timings: doc.opdTimings,
        opd_days: doc.opdDays,
        availability: doc.isActive ? 'away' : 'available',
        is_active: !doc.isActive,
      });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to update doctor status.' });
    }
  };

  const handleGenerateSlots = async () => {
    setGeneratingSlots(true);
    setFeedback(null);
    try {
      const count = await SupabaseService.adminGenerateSlots(14);
      setFeedback({
        type: 'success',
        message: `Generated ${count} consultation slots across active schedules for the next 14 days.`,
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Slot generation failed. Ensure generate_doctor_slots() RPC is installed.' });
    } finally {
      setGeneratingSlots(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return doctors.filter(d => {
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.departmentName.toLowerCase().includes(q);
      const matchDept = !deptFilter || d.departmentId === deptFilter;
      return matchSearch && matchDept;
    });
  }, [doctors, search, deptFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Doctors &amp; Fees Management</h1>
          <p className="text-ink-soft text-sm">
            Manage medical specialists, INR consultation fees, Storage portraits, and 14-day OPD slots.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleGenerateSlots}
            isLoading={generatingSlots}
            leftIcon={<CalendarPlus size={15} />}
          >
            Generate 14-Day Slots
          </Button>
          <Button onClick={openCreateDrawer} leftIcon={<Plus size={16} />}>
            Add Doctor
          </Button>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl border text-sm ${
            feedback.type === 'success'
              ? 'bg-mint/40 border-sage text-verdigris-deep'
              : 'bg-[var(--signal-light)] border-[var(--signal)] text-[var(--signal-deep)]'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span className="flex-1">{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs underline">Dismiss</button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-3 bg-paper p-3 rounded-xl border border-sage-light">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Search doctor, specialty, or department…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2 text-sm"
          />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="input py-2 text-sm w-52"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <Button variant="ghost" size="sm" onClick={loadData} leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}>
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="bg-paper rounded-xl border border-sage-light overflow-hidden shadow-warm-sm">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left">Doctor</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Branch</th>
                <th className="py-3 px-4 text-left">In-Clinic / Video</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-ink-soft">
                    Loading doctors directory…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-ink-soft">
                    No doctors matched your filter.
                  </td>
                </tr>
              ) : (
                filtered.map(doc => (
                  <tr key={doc.id}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <DoctorAvatar name={doc.name} photoUrl={doc.photoUrl} className="w-10 h-12 rounded-lg" />
                        <div>
                          <p className="font-semibold text-ink text-sm">{doc.name}</p>
                          <p className="text-xs text-ink-soft">{doc.qualifications.join(', ')} · {doc.experienceYears} yrs</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="font-medium text-ink">{doc.departmentName}</p>
                      <p className="text-xs text-ink-soft">{doc.specialty}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-ink-soft">{doc.branchName}</td>
                    <td className="py-3 px-4 text-sm font-mono text-ink">
                      {formatINR(doc.feeInClinic)} / {formatINR(doc.feeVideo)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={doc.isActive ? 'default' : 'saffron'} size="sm">
                        {doc.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditDrawer(doc)}
                          className="p-1.5 rounded-lg text-ink-soft hover:bg-bone hover:text-verdigris transition-colors"
                          title="Edit doctor & fees"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(doc)}
                          className="p-1.5 rounded-lg text-ink-soft hover:bg-bone hover:text-ink transition-colors"
                          title={doc.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {doc.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-modal flex justify-end bg-night/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-paper h-full shadow-warm-xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sage-light mb-5">
                <h2 className="font-display text-2xl font-bold text-ink">
                  {form.id ? 'Edit Specialist' : 'Add New Specialist'}
                </h2>
                <button onClick={() => setDrawerOpen(false)} className="p-1 text-ink-soft hover:text-ink">
                  <X size={20} />
                </button>
              </div>

              <form id="doc-form" onSubmit={handleSaveDoctor} className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-bone border border-sage-light">
                  <DoctorAvatar name={form.name || 'Doctor'} photoUrl={form.photoUrl} className="w-16 h-20 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill border border-sage text-xs font-medium text-ink bg-paper hover:bg-mint/40 cursor-pointer transition-colors">
                      <Upload size={13} />
                      {uploadingPhoto ? 'Uploading portrait…' : 'Upload Portrait to doctor-photos'}
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploadingPhoto} />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste Supabase Storage / local portrait URL"
                      value={form.photoUrl}
                      onChange={e => setForm(f => ({ ...f, photoUrl: e.target.value }))}
                      className="input text-xs py-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Dr. Ananya Joshi"
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Designation *</label>
                    <input
                      type="text"
                      required
                      value={form.designation}
                      onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                      placeholder="Senior Consultant"
                      className="input text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Department *</label>
                    <select
                      value={form.departmentId}
                      onChange={e => setForm(f => ({ ...f, departmentId: e.target.value }))}
                      className="input text-sm"
                      required
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Primary Branch *</label>
                    <select
                      value={form.branchId}
                      onChange={e => setForm(f => ({ ...f, branchId: e.target.value }))}
                      className="input text-sm"
                      required
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.shortName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Specialty Focus *</label>
                  <input
                    type="text"
                    required
                    value={form.specialty}
                    onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
                    placeholder="Interventional Cardiology"
                    className="input text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">In-Clinic Fee (₹)</label>
                    <input
                      type="number"
                      min={100}
                      step={50}
                      value={form.feeInClinic}
                      onChange={e => setForm(f => ({ ...f, feeInClinic: Number(e.target.value) }))}
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Video Fee (₹)</label>
                    <input
                      type="number"
                      min={100}
                      step={50}
                      value={form.feeVideo}
                      onChange={e => setForm(f => ({ ...f, feeVideo: Number(e.target.value) }))}
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Experience (yrs)</label>
                    <input
                      type="number"
                      min={1}
                      value={form.experienceYears}
                      onChange={e => setForm(f => ({ ...f, experienceYears: Number(e.target.value) }))}
                      className="input text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">OPD Timings</label>
                    <input
                      type="text"
                      value={form.opdTimings}
                      onChange={e => setForm(f => ({ ...f, opdTimings: e.target.value }))}
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Languages (comma-sep)</label>
                    <input
                      type="text"
                      value={form.languages}
                      onChange={e => setForm(f => ({ ...f, languages: e.target.value }))}
                      className="input text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Qualifications (comma-sep)</label>
                  <input
                    type="text"
                    value={form.qualifications}
                    onChange={e => setForm(f => ({ ...f, qualifications: e.target.value }))}
                    className="input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Specialities / Procedures (comma-sep)</label>
                  <input
                    type="text"
                    value={form.specialities}
                    onChange={e => setForm(f => ({ ...f, specialities: e.target.value }))}
                    placeholder="Echocardiography, Preventive Cardiology"
                    className="input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Clinical Bio</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    className="input text-sm resize-none"
                  />
                </div>
              </form>
            </div>

            <div className="pt-5 border-t border-sage-light flex items-center justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button type="submit" form="doc-form" isLoading={saving}>Save to Supabase</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
