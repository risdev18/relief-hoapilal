// PatientProfile.tsx — Authenticated Patient Dossier synced with Supabase profiles table

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, User, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { AuthService, PatientUser } from '@/services/authService';

export function PatientProfile() {
  const [patient, setPatient] = useState<PatientUser | null>(() => AuthService.getActivePatient());
  const [fullName, setFullName] = useState(patient?.fullName || '');
  const [phone, setPhone] = useState(patient?.phone || '');
  const [dob, setDob] = useState(patient?.dob || '');
  const [gender, setGender] = useState(patient?.gender || '');
  const [bloodGroup, setBloodGroup] = useState(patient?.bloodGroup || '');
  const [emergencyContact, setEmergencyContact] = useState(patient?.emergencyContact || '');
  const [address, setAddress] = useState(patient?.address || '');

  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    void AuthService.syncSession().then(u => {
      if (!u) return;
      setPatient(u);
      setFullName(u.fullName);
      setPhone(u.phone);
      setDob(u.dob);
      setGender(u.gender);
      setBloodGroup(u.bloodGroup);
      setEmergencyContact(u.emergencyContact);
      setAddress(u.address || '');
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const updated = await AuthService.updatePatientProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      dob,
      gender,
      bloodGroup,
      emergencyContact: emergencyContact.trim(),
      address: address.trim(),
    });
    if (updated) setPatient(updated);
    setSaving(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card p-6 bg-paper flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-mint flex items-center justify-center text-verdigris-deep font-display text-2xl font-bold">
            {(patient?.fullName || 'P')[0]}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">{patient?.fullName || 'Patient Profile'}</h1>
            <p className="font-mono text-xs text-verdigris-deep font-semibold mt-0.5">
              UHID: {patient?.uhid} {patient?.abhaId ? `· ABHA: ${patient.abhaId}` : ''}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-bone border border-sage-light text-ink-soft">
          <ShieldCheck size={14} className="text-verdigris" />
          Role: {patient?.role || 'patient'}
        </span>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-mint/60 border border-verdigris text-verdigris-deep text-xs font-medium flex items-center gap-2">
          <CheckCircle2 size={15} />
          Profile saved to Supabase successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="card p-6 sm:p-8 bg-paper space-y-5">
        <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
          <User size={18} className="text-verdigris" /> Personal &amp; Emergency Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            value={patient?.email || ''}
            disabled
            hint="Managed via Supabase Auth"
          />
          <Input
            label="Mobile Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            leftElement={<Phone size={15} />}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Gender</label>
            <select value={gender} onChange={e => setGender(e.target.value)} className="input text-sm">
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Blood Group</label>
            <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="input text-sm">
              <option value="">Select…</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Emergency Contact Name & Phone"
          value={emergencyContact}
          onChange={e => setEmergencyContact(e.target.value)}
          placeholder="e.g. Spouse / Parent (+91 98XXXXXXXX)"
        />

        <Input
          label="Residential Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="City, PIN Code"
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md" isLoading={saving} leftIcon={<Save size={15} />}>
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
