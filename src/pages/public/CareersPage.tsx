import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, DemoBadge, Badge } from '@/components/ui';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  branch: string;
  type: string;
  experience: string;
}

const JOBS: JobPosting[] = [
  { id: 'job-1', title: 'Consultant Interventional Cardiologist', department: 'Cardiology', branch: 'Andheri', type: 'Full-time', experience: '5+ years post-DM' },
  { id: 'job-2', title: 'Senior ICU Staff Nurse', department: 'Critical Care', branch: 'Andheri', type: 'Full-time (Rotational)', experience: '3+ years ICU/CCU' },
  { id: 'job-3', title: 'Resident Medical Officer (Emergency)', department: 'Emergency Medicine', branch: 'Thane', type: 'Full-time', experience: '1-3 years post-MBBS' },
  { id: 'job-4', title: 'Lead Diagnostic Radiographer (MRI/CT)', department: 'Radiology', branch: 'Andheri', type: 'Full-time', experience: '4+ years' },
  { id: 'job-5', title: 'Patient Experience Coordinator', department: 'Administration', branch: 'Pune', type: 'Full-time', experience: '2+ years healthcare front-office' },
];

export function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [applied, setApplied] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setSelectedJob(null);
    }, 3000);
  };

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-bone py-16 border-b border-sage-light">
        <div className="section-container">
          <p className="font-mono text-xs font-medium text-verdigris tracking-widest uppercase mb-3">Join the Care Team</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-4">
            Practice medicine with <em className="italic font-normal text-verdigris">dignity</em>.
          </h1>
          <p className="text-lg text-ink-soft max-w-2xl leading-relaxed">
            We offer our clinical and non-clinical team members an environment anchored in safety protocols, academic growth, and humane patient engagement.
          </p>
          <DemoBadge className="mt-4" />
        </div>
      </div>

      <div className="section-container section-padding max-w-4xl space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold text-ink">Active Career Openings</h2>
          <span className="font-mono text-xs text-sage">{JOBS.length} positions open</span>
        </div>

        <div className="space-y-4">
          {JOBS.map(job => (
            <div key={job.id} className="p-6 bg-paper rounded-xl border border-sage-light shadow-warm-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default" size="sm">{job.department}</Badge>
                  <span className="text-xs font-mono text-ink-soft">· {job.type}</span>
                </div>
                <h3 className="font-display font-semibold text-ink text-lg">{job.title}</h3>
                <div className="flex items-center gap-4 text-xs text-ink-soft mt-1">
                  <span className="flex items-center gap-1"><MapPin size={12} className="text-verdigris" /> {job.branch} Branch</span>
                  <span>Exp: {job.experience}</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setSelectedJob(job)}>
                Apply Now
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-night/40 backdrop-blur-sm p-4">
          <div className="bg-paper rounded-2xl max-w-md w-full p-6 border border-sage-light shadow-warm-lg">
            <h3 className="font-display text-xl font-bold text-ink mb-1">Apply: {selectedJob.title}</h3>
            <p className="text-xs text-ink-soft mb-4">Location: {selectedJob.branch} Branch · {selectedJob.department}</p>

            {applied ? (
              <div className="p-4 bg-mint border border-sage text-verdigris-deep rounded-xl text-sm font-medium flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span>Demo application submitted to HR registry.</span>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Full Name</label>
                  <input type="text" required placeholder="Dr. / Mr. / Ms." className="input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Email</label>
                  <input type="email" required placeholder="contact@email.com" className="input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Phone</label>
                  <input type="tel" required placeholder="+91 XXXXX XXXXX" className="input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Medical Registration / Council Number</label>
                  <input type="text" placeholder="Optional for non-clinical roles" className="input text-sm" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" className="flex-1" type="button" onClick={() => setSelectedJob(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1" type="submit">
                    Send Application (Demo)
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

