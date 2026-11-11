import React, { useState } from 'react';
import { Shield, CreditCard, MessageSquare, MapPin, Key, Lock, Activity, CheckCircle2 } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

interface IntegrationModule {
  id: string;
  name: string;
  category: string;
  provider: string;
  status: 'Live' | 'Sandbox' | 'Not configured';
  description: string;
}

const INTEGRATIONS: IntegrationModule[] = [
  { id: 'pay-rzp', name: 'Payment Gateway', category: 'Financial', provider: 'Razorpay Checkout + Edge Functions', status: 'Sandbox', description: 'Server-side order generation and HMAC-SHA256 signature verification.' },
  { id: 'sms-gw', name: 'Email & SMS Dispatch', category: 'Communications', provider: 'Resend / Twilio / MSG91', status: 'Live', description: 'Dispatches booking confirmations, receipts, and cancellation notices via Supabase Edge Functions.' },
  { id: 'wa-biz', name: 'WhatsApp Business API', category: 'Communications', provider: 'Meta Cloud / Webhook', status: 'Sandbox', description: 'Instant appointment alerts and reschedule confirmations.' },
  { id: 'maps-api', name: 'Geo Mapping & Branch Router', category: 'Navigation', provider: 'OpenStreetMap & Google Maps Directions', status: 'Live', description: 'Live branch coordinates, OPD hours, and one-tap navigation links.' },
  { id: 'webrtc-vc', name: 'Encrypted Teleconsultation', category: 'Teleconsultation', provider: 'Jitsi / Daily Adapter', status: 'Not configured', description: 'Remote video outpatient consultations.' },
  { id: 'abdm-abha', name: 'Ayushman Bharat Digital Mission (ABDM)', category: 'Regulatory Health Exchange', provider: 'National Health Authority (NHA)', status: 'Not configured', description: 'ABHA health ID and clinical record federation.' },
];

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'Integrations' | 'Security' | 'Audit'>('Integrations');

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Live': return 'default';
      case 'Sandbox': return 'saffron';
      default: return 'night';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">System Configurations &amp; Integrations</h1>
          <p className="text-ink-soft text-sm">Provider adapter layer, Supabase RLS security policies, and compliance status.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sage-light gap-6 text-sm font-medium">
        {(['Integrations', 'Security', 'Audit'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 transition-colors ${
              activeTab === tab
                ? 'text-verdigris border-b-2 border-verdigris font-semibold'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTEGRATIONS.map(mod => (
            <div key={mod.id} className="card p-5 space-y-3 bg-paper border border-sage-light shadow-warm-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-mono text-sage uppercase tracking-wider">{mod.category}</span>
                  <h3 className="font-display font-semibold text-ink text-lg">{mod.name}</h3>
                </div>
                <Badge variant={getStatusBadgeVariant(mod.status)} size="sm">
                  {mod.status}
                </Badge>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed">{mod.description}</p>
              <div className="pt-3 border-t border-sage-light flex justify-between items-center text-xs">
                <span className="text-ink-soft">Adapter: <strong className="text-ink font-medium">{mod.provider}</strong></span>
                <span className="text-xs font-mono text-verdigris">{mod.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Security' && (
        <div className="bg-paper p-6 rounded-xl border border-sage-light space-y-6 shadow-warm-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-mint text-verdigris">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-ink text-lg">Zero-Trust Healthcare Data Protection</h3>
              <p className="text-sm text-ink-soft leading-relaxed mt-1">
                Firestore security rules enforce RBAC with least privilege. Patient medical files are served exclusively through short-lived signed URLs generated on authenticated requests.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-sage-light text-sm">
            <div className="p-4 bg-bone rounded-xl border border-sage-light space-y-1">
              <span className="text-xs font-mono text-verdigris font-semibold flex items-center gap-1">
                <CheckCircle2 size={14} /> Active
              </span>
              <p className="font-semibold text-ink">Strict Identity Separation</p>
              <p className="text-xs text-ink-soft">Client sessions decoupled from privileged Firebase administrative rules.</p>
            </div>
            <div className="p-4 bg-bone rounded-xl border border-sage-light space-y-1">
              <span className="text-xs font-mono text-verdigris font-semibold flex items-center gap-1">
                <CheckCircle2 size={14} /> Active
              </span>
              <p className="font-semibold text-ink">Cryptographic Verification</p>
              <p className="text-xs text-ink-soft">Receipts generate strictly post-verified transaction hashes.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Audit' && (
        <div className="bg-paper rounded-xl border border-sage-light overflow-hidden shadow-warm-sm">
          <div className="p-4 border-b border-sage-light flex justify-between items-center">
            <h3 className="font-display font-semibold text-ink text-base">Immutable Activity Log</h3>
            <span className="font-mono text-xs text-sage">Showing recent 5 entries</span>
          </div>
          <div className="divide-y divide-sage-light text-xs font-mono">
            <div className="p-3 flex justify-between">
              <span className="text-verdigris font-semibold">[2026-11-12 10:14:02 UTC]</span>
              <span className="text-ink">ADMIN_USER_88 logged in via MFA</span>
              <span className="text-ink-soft">IP: 192.168.1.1</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-verdigris font-semibold">[2026-11-12 10:18:44 UTC]</span>
              <span className="text-ink">DOCTOR_SHARMA viewed Patient Dossier (UHID: RH260192)</span>
              <span className="text-ink-soft">Reason: OPD Consultation</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-verdigris font-semibold">[2026-11-12 10:22:15 UTC]</span>
              <span className="text-ink">QUEUE_SERVER issued Token C-014 (Cardiology)</span>
              <span className="text-ink-soft">Success</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-verdigris font-semibold">[2026-11-12 10:29:30 UTC]</span>
              <span className="text-ink">SANDBOX_PAYMENT verified: TXN_REL_99214</span>
              <span className="text-ink-soft">Amount: ₹500</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-verdigris font-semibold">[2026-11-12 10:30:00 UTC]</span>
              <span className="text-ink">LAB_SYS published CBC test results for RH260192</span>
              <span className="text-ink-soft">AuthToken: Verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

