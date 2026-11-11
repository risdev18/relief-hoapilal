// Doctor Profile Page — Full specialist dossier backed by Supabase + verified patient reviews

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Video, MapPin, Award, Globe, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { AvailabilityDot, Button, DoctorAvatar, EmptyState, Skeleton } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';
import { SupabaseService, VerifiedReviewRecord, SupabaseAppointmentRecord } from '@/services/supabaseService';
import { AuthService } from '@/services/authService';
import type { MasterDoctor } from '@/data/masterCatalog';

export function DoctorProfilePage() {
  const { slug } = useParams<{ slug: string }>();

  const [doctor, setDoctor] = useState<MasterDoctor | null>(null);
  const [reviews, setReviews] = useState<VerifiedReviewRecord[]>([]);
  const [eligibleCompletedAppt, setEligibleCompletedAppt] = useState<SupabaseAppointmentRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedVisitType, setSelectedVisitType] = useState<'in-person' | 'video'>('in-person');

  // Verified review composer state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const found = await SupabaseService.getDoctorBySlug(slug || '');
      if (!active) return;
      setDoctor(found);

      if (found) {
        const [revList, myAppts] = await Promise.all([
          SupabaseService.getReviews(found.id),
          AuthService.getActivePatient() ? SupabaseService.getPatientAppointments() : Promise.resolve([]),
        ]);
        if (!active) return;
        setReviews(revList);
        const completed = myAppts.find(a => a.doctor_id === found.id && a.status === 'completed');
        setEligibleCompletedAppt(completed || null);
      }
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, [slug]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || !eligibleCompletedAppt || !comment.trim()) return;
    setReviewError(null);
    setSubmittingReview(true);
    try {
      const patient = AuthService.getActivePatient();
      await SupabaseService.submitVerifiedReview({
        doctorId: doctor.id,
        appointmentId: eligibleCompletedAppt.id,
        patientDisplayName: patient?.fullName || 'Verified Patient',
        rating,
        comment,
      });
      setReviewSuccess(true);
      setComment('');
      const refreshed = await SupabaseService.getReviews(doctor.id);
      setReviews(refreshed);
    } catch (err: any) {
      setReviewError(err?.message || 'Unable to submit verified review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-paper min-h-screen py-16">
        <div className="section-container grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-52 w-full rounded-2xl" />
            <Skeleton lines={6} />
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="bg-paper min-h-screen py-20">
        <EmptyState
          title="Doctor profile not found"
          description="The requested specialist profile could not be located."
          action={
            <Link to={ROUTES.doctors} className="btn btn-primary btn-md">
              Browse All Doctors
            </Link>
          }
        />
      </div>
    );
  }

  const activeFee = selectedVisitType === 'video' ? doctor.feeVideo : doctor.feeInClinic;
  const weeklySchedule = [
    { day: 'Monday – Friday', slots: doctor.opdTimings, type: 'In-Clinic OPD', branch: doctor.branchName },
    { day: 'Monday – Saturday (Evening)', slots: '04:00 PM – 06:30 PM', type: 'Video Tele-OPD', branch: 'Online Portal' },
    { day: 'Saturday Morning', slots: '09:30 AM – 01:00 PM', type: 'In-Clinic OPD', branch: doctor.branchName },
    { day: 'Sunday', slots: 'Closed · Emergency On-Call 24/7', type: 'Emergency Desk', branch: doctor.branchName },
  ];

  return (
    <div className="bg-paper min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-bone border-b border-sage-light">
        <div className="section-container py-3">
          <nav className="flex items-center gap-2 text-sm text-ink-soft" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-verdigris transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to={ROUTES.doctors} className="hover:text-verdigris transition-colors">Doctors</Link>
            <ChevronRight size={14} />
            <span className="text-ink font-medium">{doctor.name}</span>
          </nav>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Main Clinical Profile */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <DoctorAvatar
                name={doctor.name}
                photoUrl={doctor.photoUrl}
                alt={`${doctor.name} portrait`}
                rounded="arch"
                priority
                className="w-40 flex-shrink-0 shadow-warm-md"
              />
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-mint text-verdigris-deep font-semibold">
                    {doctor.departmentName}
                  </span>
                  <AvailabilityDot status={doctor.availability} withLabel />
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">{doctor.name}</h1>
                <p className="text-sm font-mono text-ink-soft">{doctor.qualifications.join(' · ')}</p>
                <p className="text-verdigris font-semibold text-base">{doctor.designation}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-ink-soft pt-1">
                  <span>{doctor.experienceYears} years experience</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-ink">
                    <Star size={14} className="fill-saffron text-saffron" />
                    {doctor.rating} ({doctor.reviewCount} reviews)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} className="text-verdigris" />
                    {doctor.branchName}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Globe size={14} className="text-verdigris" />
                    {doctor.languages.join(', ')}
                  </span>
                </div>

                <p className="text-xs text-verdigris-deep font-mono bg-mint/50 py-1 px-3 rounded-pill w-fit border border-sage/40 mt-2">
                  Verified Medical Council Reg: {doctor.registrationNumber}
                </p>
              </div>
            </div>

            <RelifLine variant="section" color="var(--sage-light)" animated={false} />

            {/* About */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink mb-3">About</h2>
              <p className="text-ink-soft leading-relaxed text-base">{doctor.bio}</p>
            </section>

            {/* Qualifications & Clinical Focus */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-5 bg-bone/70">
                <h3 className="font-display text-lg font-semibold text-ink mb-3 flex items-center gap-2">
                  <Award size={18} className="text-verdigris" /> Qualifications
                </h3>
                <ul className="space-y-2 text-sm text-ink-soft">
                  {doctor.qualifications.map(q => (
                    <li key={q} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-verdigris flex-shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-5 bg-bone/70">
                <h3 className="font-display text-lg font-semibold text-ink mb-3">Clinical Specialities</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.specialities.map(sp => (
                    <span key={sp} className="chip text-xs">{sp}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* Weekly OPD Schedule */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-ink mb-4">Weekly Consultation Schedule</h2>
              <div className="card overflow-hidden">
                <div className="divide-y divide-sage-light">
                  {weeklySchedule.map(row => (
                    <div key={row.day} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                      <div>
                        <p className="font-semibold text-ink">{row.day}</p>
                        <p className="text-xs text-ink-soft">{row.type} · {row.branch}</p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-verdigris-deep bg-mint/40 px-3 py-1 rounded-full w-fit">
                        {row.slots}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Verified Patient Reviews */}
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold text-ink">
                  Verified Patient Reviews ({reviews.length})
                </h2>
              </div>

              {eligibleCompletedAppt && !reviewSuccess && (
                <form onSubmit={handleReviewSubmit} className="card p-5 bg-bone space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <MessageSquarePlus size={16} className="text-verdigris" />
                    <span>Share verified feedback from your completed visit ({eligibleCompletedAppt.appointment_date})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-soft">Rating:</span>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        className="p-1"
                        aria-label={`Rate ${n} stars`}
                      >
                        <Star
                          size={18}
                          className={n <= rating ? 'fill-saffron text-saffron' : 'text-sage'}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Describe your consultation experience…"
                    rows={3}
                    required
                    className="input text-sm"
                  />
                  {reviewError && <p className="text-xs text-signal">{reviewError}</p>}
                  <Button type="submit" variant="primary" size="sm" isLoading={submittingReview}>
                    Publish Verified Review
                  </Button>
                </form>
              )}

              {reviews.length === 0 ? (
                <div className="card p-6 bg-bone/60 text-sm text-ink-soft">
                  No written reviews submitted yet for {doctor.name}. Verified patients can post a review after their visit is completed.
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map(r => (
                    <div key={r.id} className="card p-5 bg-paper">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-ink">{r.patient_display_name}</span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-mint text-verdigris-deep font-semibold">
                            Verified Visit
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: r.rating }).map((_, idx) => (
                            <Star key={idx} size={13} className="fill-saffron text-saffron" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-ink-soft leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Sticky Fee & Direct Booking Card */}
          <aside className="lg:sticky lg:top-24 card p-6 bg-paper border-sage space-y-5 shadow-warm-md">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-verdigris">
                Transparent Consultation Fee
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-4xl font-bold text-ink">
                  ₹{activeFee.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-ink-soft">per visit · GST exempt</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedVisitType('in-person')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedVisitType === 'in-person'
                    ? 'border-verdigris bg-mint/40 font-semibold'
                    : 'border-sage-light bg-bone text-ink-soft'
                }`}
              >
                <p className="text-xs text-ink">In-Clinic</p>
                <p className="font-mono text-sm font-bold text-verdigris-deep">₹{doctor.feeInClinic}</p>
              </button>

              {doctor.consultationTypes.includes('video') && (
                <button
                  type="button"
                  onClick={() => setSelectedVisitType('video')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedVisitType === 'video'
                      ? 'border-verdigris bg-mint/40 font-semibold'
                      : 'border-sage-light bg-bone text-ink-soft'
                  }`}
                >
                  <p className="text-xs text-ink flex items-center gap-1">
                    <Video size={12} /> Video
                  </p>
                  <p className="font-mono text-sm font-bold text-verdigris-deep">₹{doctor.feeVideo}</p>
                </button>
              )}
            </div>

            <div className="text-xs text-ink-soft space-y-1.5 bg-bone p-3.5 rounded-xl border border-sage-light">
              <p className="font-semibold text-ink">Pay online or at hospital desk</p>
              <p>Free cancellation &ge; 24 hrs (100% refund) · 50% refund between 2–24 hrs.</p>
            </div>

            <Link
              to={`${ROUTES.book}?department=${doctor.departmentSlug}&doctor=${doctor.slug}&type=${selectedVisitType}`}
              className="btn btn-primary btn-lg w-full justify-center"
            >
              Book Consultation · ₹{activeFee}
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
