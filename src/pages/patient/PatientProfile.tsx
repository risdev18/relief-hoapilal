// PatientProfile.tsx — Relif Hospital Patient Profile

import React, { useState } from 'react';
import {
  Edit2,
  Save,
  X,
  Plus,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, DemoBadge, Input } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';
import { cn, getInitials } from '@/utils';

// ── Types ─────────────────────────────────────────────────────────────────────
interface PersonalInfo {
  fullName:    string;
  dob:         string;
  gender:      string;
  bloodGroup:  string;
}

interface ContactInfo {
  phone:   string;
  email:   string;
  address: string;
}

interface EmergencyContact {
  name:     string;
  relation: string;
  phone:    string;
}

interface FamilyMember {
  id:       string;
  name:     string;
  relation: string;
  dob:      string;
}

// ── Demo data ─────────────────────────────────────────────────────────────────
const DEMO_PERSONAL: PersonalInfo = {
  fullName:   'Rahul Mehta',
  dob:        '1985-06-15',
  gender:     'Male',
  bloodGroup: 'B+',
};

const DEMO_CONTACT: ContactInfo = {
  phone:   '+91 98765 43210',
  email:   'rahul.mehta@example.com',
  address: '14, Green Park Colony, Andheri West, Mumbai 400053',
};

const DEMO_EMERGENCY: EmergencyContact = {
  name:     'Sunita Mehta',
  relation: 'Spouse',
  phone:    '+91 98765 11223',
};

const DEMO_FAMILY: FamilyMember[] = [
  { id: 'FM-001', name: 'Sunita Mehta', relation: 'Wife',  dob: '1988-03-20' },
  { id: 'FM-002', name: 'Aryan Mehta',  relation: 'Son',   dob: '2012-09-10' },
];

// ── Toast helper ──────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  function show(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(null), 3000);
  }
  return { msg, show };
}

// ── Editable section wrapper ──────────────────────────────────────────────────
function SectionCard({
  title,
  icon,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  children,
}: {
  title:     string;
  icon:      React.ReactNode;
  isEditing: boolean;
  onEdit:    () => void;
  onSave:    () => void;
  onCancel:  () => void;
  children:  React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-verdigris">{icon}</span>
          <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        </div>
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-verdigris hover:text-verdigris-deep border border-sage rounded-pill px-2.5 py-1 hover:border-verdigris transition-colors"
          >
            <Edit2 size={11} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-verdigris text-white rounded-pill px-2.5 py-1 hover:bg-verdigris-deep transition-colors"
            >
              <Save size={11} />
              Save
            </button>
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft hover:text-ink border border-sage-light rounded-pill px-2.5 py-1 hover:border-sage transition-colors"
            >
              <X size={11} />
              Cancel
            </button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function PatientProfile() {
  const { msg: toastMsg, show: showToast } = useToast();

  // Form states
  const [personal,   setPersonal]   = useState<PersonalInfo>(DEMO_PERSONAL);
  const [contact,    setContact]    = useState<ContactInfo>(DEMO_CONTACT);
  const [emergency,  setEmergency]  = useState<EmergencyContact>(DEMO_EMERGENCY);

  // Edit modes
  const [editPersonal,  setEditPersonal]  = useState(false);
  const [editContact,   setEditContact]   = useState(false);
  const [editEmergency, setEditEmergency] = useState(false);

  // Draft states
  const [draftPersonal,  setDraftPersonal]  = useState<PersonalInfo>(DEMO_PERSONAL);
  const [draftContact,   setDraftContact]   = useState<ContactInfo>(DEMO_CONTACT);
  const [draftEmergency, setDraftEmergency] = useState<EmergencyContact>(DEMO_EMERGENCY);

  function handleSave(section: 'personal' | 'contact' | 'emergency') {
    if (section === 'personal')  { setPersonal(draftPersonal);   setEditPersonal(false);  }
    if (section === 'contact')   { setContact(draftContact);     setEditContact(false);   }
    if (section === 'emergency') { setEmergency(draftEmergency); setEditEmergency(false); }
    showToast('Demo — changes are not persisted. Data resets on refresh.');
  }

  function handleCancel(section: 'personal' | 'contact' | 'emergency') {
    if (section === 'personal')  { setDraftPersonal(personal);   setEditPersonal(false);  }
    if (section === 'contact')   { setDraftContact(contact);     setEditContact(false);   }
    if (section === 'emergency') { setDraftEmergency(emergency); setEditEmergency(false); }
  }

  const uhid = 'RH26847231';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-4 right-4 z-toast bg-mint border border-sage text-ink text-sm px-4 py-3 rounded-lg shadow-warm-md max-w-sm"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-semibold text-ink">Your profile.</h1>
        <p className="text-ink-soft mt-1">Manage your personal and medical information.</p>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* ── Left: Profile summary card ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 flex flex-col items-center text-center h-fit"
        >
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-verdigris flex items-center justify-center mb-4 text-white font-display text-3xl font-semibold shadow-verdigris">
            {getInitials(personal.fullName)}
          </div>

          <h2 className="font-display text-2xl font-semibold text-ink">{personal.fullName}</h2>

          {/* UHID */}
          <span className="font-mono text-sm text-verdigris mt-1 tracking-wider">{uhid}</span>
          <DemoBadge className="mt-1" />

          <RelifLine variant="section" className="my-4 opacity-40" />

          {/* Blood group */}
          <div className="flex items-center gap-2 mb-2">
            <Heart size={14} className="text-signal" />
            <span className="text-sm text-ink-soft">Blood Group</span>
            <Badge variant="signal" size="sm">{personal.bloodGroup}</Badge>
          </div>

          {/* Joined date */}
          <p className="text-xs text-ink-soft mt-2">
            Member since <span className="font-medium text-ink">Jan 2026</span>
          </p>
        </motion.div>

        {/* ── Right: form sections ── */}
        <div className="space-y-5">
          {/* Personal info */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SectionCard
              title="Personal information"
              icon={<User size={18} />}
              isEditing={editPersonal}
              onEdit={() => { setDraftPersonal(personal); setEditPersonal(true); }}
              onSave={() => handleSave('personal')}
              onCancel={() => handleCancel('personal')}
            >
              {editPersonal ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={draftPersonal.fullName}
                    onChange={e => setDraftPersonal(d => ({ ...d, fullName: e.target.value }))}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={draftPersonal.dob}
                    onChange={e => setDraftPersonal(d => ({ ...d, dob: e.target.value }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Gender</label>
                    <select
                      className="input w-full"
                      value={draftPersonal.gender}
                      onChange={e => setDraftPersonal(d => ({ ...d, gender: e.target.value }))}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Blood Group</label>
                    <select
                      className="input w-full"
                      value={draftPersonal.bloodGroup}
                      onChange={e => setDraftPersonal(d => ({ ...d, bloodGroup: e.target.value }))}
                    >
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <dl className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name',    value: personal.fullName },
                    { label: 'Date of Birth',value: new Date(personal.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
                    { label: 'Gender',       value: personal.gender },
                    { label: 'Blood Group',  value: personal.bloodGroup },
                  ].map(f => (
                    <div key={f.label}>
                      <dt className="text-xs text-ink-soft font-medium uppercase tracking-wide">{f.label}</dt>
                      <dd className="text-sm text-ink mt-0.5 font-medium">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </SectionCard>
          </motion.div>

          {/* Contact info */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <SectionCard
              title="Contact information"
              icon={<Phone size={18} />}
              isEditing={editContact}
              onEdit={() => { setDraftContact(contact); setEditContact(true); }}
              onSave={() => handleSave('contact')}
              onCancel={() => handleCancel('contact')}
            >
              {editContact ? (
                <div className="space-y-4">
                  <Input
                    label="Mobile Number"
                    type="tel"
                    value={draftContact.phone}
                    onChange={e => setDraftContact(d => ({ ...d, phone: e.target.value }))}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={draftContact.email}
                    onChange={e => setDraftContact(d => ({ ...d, email: e.target.value }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Address</label>
                    <textarea
                      className="input w-full resize-none"
                      rows={2}
                      value={draftContact.address}
                      onChange={e => setDraftContact(d => ({ ...d, address: e.target.value }))}
                    />
                  </div>
                </div>
              ) : (
                <dl className="space-y-3">
                  {[
                    { label: 'Mobile',  value: contact.phone,   icon: <Phone size={13} /> },
                    { label: 'Email',   value: contact.email,   icon: <Mail size={13} />  },
                    { label: 'Address', value: contact.address, icon: <MapPin size={13} /> },
                  ].map(f => (
                    <div key={f.label} className="flex gap-3 items-start">
                      <span className="mt-0.5 text-ink-soft flex-shrink-0">{f.icon}</span>
                      <div>
                        <dt className="text-xs text-ink-soft">{f.label}</dt>
                        <dd className="text-sm text-ink font-medium">{f.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              )}
            </SectionCard>
          </motion.div>

          {/* Emergency contact */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SectionCard
              title="Emergency contact"
              icon={<Heart size={18} />}
              isEditing={editEmergency}
              onEdit={() => { setDraftEmergency(emergency); setEditEmergency(true); }}
              onSave={() => handleSave('emergency')}
              onCancel={() => handleCancel('emergency')}
            >
              {editEmergency ? (
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input
                    label="Name"
                    value={draftEmergency.name}
                    onChange={e => setDraftEmergency(d => ({ ...d, name: e.target.value }))}
                  />
                  <Input
                    label="Relation"
                    value={draftEmergency.relation}
                    onChange={e => setDraftEmergency(d => ({ ...d, relation: e.target.value }))}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={draftEmergency.phone}
                    onChange={e => setDraftEmergency(d => ({ ...d, phone: e.target.value }))}
                  />
                </div>
              ) : (
                <dl className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Name',     value: emergency.name },
                    { label: 'Relation', value: emergency.relation },
                    { label: 'Phone',    value: emergency.phone },
                  ].map(f => (
                    <div key={f.label}>
                      <dt className="text-xs text-ink-soft">{f.label}</dt>
                      <dd className="text-sm text-ink font-medium mt-0.5">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </SectionCard>
          </motion.div>

          {/* Family profiles */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-verdigris" />
                  <h3 className="font-display text-lg font-semibold text-ink">Family profiles</h3>
                </div>
                <button
                  onClick={() => showToast('Add family member — Coming soon!')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft border border-sage-light rounded-pill px-2.5 py-1 cursor-not-allowed opacity-70"
                >
                  <Plus size={11} />
                  Add family member
                  <span className="ml-1 bg-[var(--saffron-light)] text-[var(--saffron-deep)] border border-[var(--clay)] text-xs px-1.5 py-0.5 rounded-pill">
                    Soon
                  </span>
                </button>
              </div>

              <div className="space-y-3">
                {DEMO_FAMILY.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-bone hover:bg-mint/40 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-mint flex items-center justify-center text-verdigris-deep font-semibold text-sm flex-shrink-0">
                      {getInitials(member.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-ink">{member.name}</p>
                      <p className="text-xs text-ink-soft">{member.relation}</p>
                    </div>
                    <span className="text-xs text-ink-soft hidden sm:block">
                      DOB: {new Date(member.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <DemoBadge />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
