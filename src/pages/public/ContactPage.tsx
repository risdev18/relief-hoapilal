import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { Button, DemoBadge } from '@/components/ui';
import { APP_CONFIG } from '@/config/constants';
import { supabase } from '@/config/supabase';

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: 'General Hospital Query',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await supabase.from('enquiries').insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          department: formData.department,
          message: formData.message,
          created_at: new Date().toISOString(),
        }
      ]);
    } catch {
      // Offline fallback
    } finally {
      setIsSubmitting(false);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    }
  };

  return (
    <div className="bg-paper min-h-screen">
      {/* Hero */}
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Reach Our Desk</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            We are here to listen.
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            Whether inquiring about doctor availability, treatment costs, international medical travel, or providing feedback—our coordination team is accessible across multiple channels.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-ink mb-4">Branch Directory</h2>
              <p className="text-ink-soft text-sm mb-6 leading-relaxed">
                Walk-ins welcomed for emergency triage and diagnostic testing. Specialist OPD slots require prior booking.
              </p>

              <div className="space-y-4">
                <div className="p-5 bg-bone rounded-xl border border-sage-light space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-display font-semibold text-ink text-base">Relif Hospital — Andheri (Main Multispecialty)</h3>
                    <span className="demo-badge">24/7 ER</span>
                  </div>
                  <p className="text-xs text-ink-soft flex items-center gap-1.5">
                    <MapPin size={14} className="text-verdigris" /> Versova Link Road, Andheri West, Mumbai, MH 400053
                  </p>
                  <p className="text-xs text-ink-soft flex items-center gap-1.5">
                    <Phone size={14} className="text-verdigris" /> +91 22 2630 XXXX (Demo)
                  </p>
                </div>

                <div className="p-5 bg-bone rounded-xl border border-sage-light space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-display font-semibold text-ink text-base">Relif Day-Care & Oncology — Thane</h3>
                    <span className="text-xs font-mono text-sage">08:00 - 20:00</span>
                  </div>
                  <p className="text-xs text-ink-soft flex items-center gap-1.5">
                    <MapPin size={14} className="text-verdigris" /> Majiwada Junction, Eastern Express Highway, Thane West 400601
                  </p>
                  <p className="text-xs text-ink-soft flex items-center gap-1.5">
                    <Phone size={14} className="text-verdigris" /> +91 22 2540 XXXX (Demo)
                  </p>
                </div>

                <div className="p-5 bg-bone rounded-xl border border-sage-light space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-display font-semibold text-ink text-base">Relif Orthopedics & Rehab — Pune</h3>
                    <span className="text-xs font-mono text-sage">08:00 - 20:00</span>
                  </div>
                  <p className="text-xs text-ink-soft flex items-center gap-1.5">
                    <MapPin size={14} className="text-verdigris" /> Baner High Street, Baner, Pune 411045
                  </p>
                  <p className="text-xs text-ink-soft flex items-center gap-1.5">
                    <Phone size={14} className="text-verdigris" /> +91 20 2720 XXXX (Demo)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-mint/40 rounded-xl border border-sage flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink text-sm">Need a Callback?</p>
                <p className="text-xs text-ink-soft">Leave your contact and a patient care executive will call within 15 minutes.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => alert('Demo: Callback queued.')}>
                Request Call
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-paper p-8 rounded-2xl border border-sage-light shadow-warm-md space-y-4">
            <h2 className="font-display text-2xl font-bold text-ink">Send an Enquiry</h2>
            <p className="text-xs text-ink-soft leading-relaxed">
              For general clinical enquiries or feedback. In medical emergencies, call the emergency line directly.
            </p>

            {sent ? (
              <div className="p-4 bg-mint border border-sage text-verdigris-deep rounded-xl text-sm font-medium">
                Thank you! Your enquiry has been received in demo mode.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="input text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="input text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Target Department / Enquiry Nature</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="input text-sm"
                  >
                    <option>General Hospital Query</option>
                    <option>Doctor Consultation / Appointment</option>
                    <option>Cashless Insurance & Cost Estimates</option>
                    <option>International Patient Medical Desk</option>
                    <option>Feedback or Grievance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Message</label>
                  <textarea
                    rows={4}
                    placeholder="How can we assist your visit?"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="input text-sm resize-none"
                  />
                </div>
                <Button variant="primary" type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Submitting to Supabase...' : 'Submit Enquiry (Demo)'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

