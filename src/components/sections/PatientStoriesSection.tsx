// Compact Homepage "Patient Stories" Strip + Accessible Swipeable Modal Stack
// 100% live Supabase reviews (zero demo data) with verified-patient-only review composer.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion';
import {
  Star,
  ShieldCheck,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  UserCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  SupabaseService,
  type VerifiedReviewRecord,
  type ReviewsSummary,
  type SupabaseAppointmentRecord,
} from '@/services/supabaseService';
import { AuthService, type PatientUser } from '@/services/authService';
import type { MasterDepartment } from '@/data/masterCatalog';
import { ROUTES } from '@/config/constants';
import { cn } from '@/utils';

const PAGE_SIZE = 6;

function formatPatientFirstInitial(rawName: string): string {
  const parts = (rawName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Verified Patient';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0].toUpperCase()}.`;
}

function getInitials(rawName: string): string {
  const parts = (rawName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'VP';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatIndianDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function AnimatedStars({
  rating,
  reducedMotion,
  animateKey,
}: {
  rating: number;
  reducedMotion: boolean;
  animateKey: string;
}) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value, idx) => {
        const filled = value <= rating;
        return (
          <motion.span
            key={`${animateKey}-${value}`}
            initial={
              reducedMotion
                ? false
                : { opacity: filled ? 0.2 : 0.4, scale: filled ? 0.45 : 0.9 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    delay: idx * 0.07,
                    duration: 0.24,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
            className="inline-flex"
          >
            <Star
              size={16}
              className={
                filled
                  ? 'fill-saffron text-saffron'
                  : 'fill-transparent text-sage'
              }
            />
          </motion.span>
        );
      })}
    </div>
  );
}

export function PatientStoriesSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const triggerBtnRef = useRef<HTMLButtonElement>(null);

  const [summary, setSummary] = useState<ReviewsSummary>({
    averageRating: 0,
    totalCount: 0,
    recentAuthors: [],
  });
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const refreshSummary = useCallback(async () => {
    setLoadingSummary(true);
    const data = await SupabaseService.getReviewsSummary();
    setSummary(data);
    setLoadingSummary(false);
  }, []);

  useEffect(() => {
    void refreshSummary();
  }, [refreshSummary]);

  const avatarSlots = useMemo(() => {
    const slots: Array<{ key: string; initials: string | null }> = [];
    for (let i = 0; i < 3; i += 1) {
      const author = summary.recentAuthors[i];
      slots.push({
        key: `avatar-${i}-${author || 'empty'}`,
        initials: author ? getInitials(author) : null,
      });
    }
    return slots;
  }, [summary.recentAuthors]);

  const avatarTones = [
    'bg-verdigris text-white border-paper',
    'bg-verdigris-deep text-bone border-paper',
    'bg-saffron text-ink border-paper',
  ];

  return (
    <>
      <section
        className="py-8 md:py-10 bg-paper border-y border-sage-light"
        aria-label="Patient stories summary"
      >
        <div className="section-container">
          <div className="rounded-2xl bg-bone border border-sage-light px-5 py-4 md:px-7 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-warm-xs">
            {/* Left: compact title, 3 avatars, rating & total count */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {/* 3 small patient avatars */}
              <div className="flex -space-x-2.5" aria-hidden="true">
                {loadingSummary ? (
                  [0, 1, 2].map(idx => (
                    <div
                      key={idx}
                      className="w-9 h-9 rounded-full border-2 border-paper bg-sage-light animate-pulse"
                    />
                  ))
                ) : (
                  avatarSlots.map((slot, idx) => (
                    <div
                      key={slot.key}
                      className={cn(
                        'w-9 h-9 rounded-full border-2 flex items-center justify-center text-[11px] font-mono font-bold shadow-warm-xs',
                        avatarTones[idx % avatarTones.length]
                      )}
                    >
                      {slot.initials ? (
                        <span>{slot.initials}</span>
                      ) : (
                        <UserCheck size={14} />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] uppercase tracking-widest font-semibold text-verdigris">
                    Patient Stories
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-mint text-verdigris-deep">
                    <ShieldCheck size={12} /> Verified Visits Only
                  </span>
                </div>

                {loadingSummary ? (
                  <div className="mt-1.5 h-5 w-52 rounded bg-sage-light/80 animate-pulse" />
                ) : (
                  <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                    <div className="inline-flex items-center gap-1 font-display font-bold text-lg text-ink">
                      <Star
                        size={17}
                        className={
                          summary.totalCount > 0
                            ? 'fill-saffron text-saffron'
                            : 'text-sage'
                        }
                      />
                      <span>
                        {summary.totalCount > 0
                          ? summary.averageRating.toFixed(1)
                          : '—'}
                      </span>
                    </div>
                    <span className="text-sm text-ink-soft">
                      {summary.totalCount > 0
                        ? `from ${summary.totalCount} verified patient ${
                            summary.totalCount === 1 ? 'review' : 'reviews'
                          }`
                        : 'No reviews yet · Verified feedback from completed visits'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Trigger button */}
            <div className="flex items-center gap-3 self-start md:self-center">
              <button
                ref={triggerBtnRef}
                type="button"
                onClick={() => setModalOpen(true)}
                className="btn btn-primary btn-sm whitespace-nowrap inline-flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>Read patient stories</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && (
          <PatientStoriesModal
            onClose={() => {
              setModalOpen(false);
              requestAnimationFrame(() => triggerBtnRef.current?.focus());
            }}
            onReviewAdded={() => {
              void refreshSummary();
            }}
            reducedMotion={shouldReduceMotion}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Swipeable Stack Modal ─────────────────────────────────────────────────────
function PatientStoriesModal({
  onClose,
  onReviewAdded,
  reducedMotion,
}: {
  onClose: () => void;
  onReviewAdded: () => void;
  reducedMotion: boolean;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [departments, setDepartments] = useState<MasterDepartment[]>([]);
  const [reviews, setReviews] = useState<VerifiedReviewRecord[]>([]);
  const [totalMatching, setTotalMatching] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [fiveStarOnly, setFiveStarOnly] = useState<boolean>(false);

  // Card stack position & swipe direction
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<1 | -1>(1);

  // Logged-in patient & composer state
  const [activePatient, setActivePatient] = useState<PatientUser | null>(() =>
    AuthService.getActivePatient()
  );
  const [composerOpen, setComposerOpen] = useState(false);
  const [loadingEligible, setLoadingEligible] = useState(false);
  const [eligibleVisits, setEligibleVisits] = useState<SupabaseAppointmentRecord[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [draftRating, setDraftRating] = useState(5);
  const [draftComment, setDraftComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    setActiveIndex(0);
    const res = await SupabaseService.getReviewsPage({
      offset: 0,
      limit: PAGE_SIZE,
      departmentId: selectedDeptId || undefined,
      fiveStarOnly,
    });
    setReviews(res.items);
    setTotalMatching(res.totalMatching);
    setHasMore(res.hasMore);
    setLoading(false);
  }, [selectedDeptId, fiveStarOnly]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const res = await SupabaseService.getReviewsPage({
      offset: reviews.length,
      limit: PAGE_SIZE,
      departmentId: selectedDeptId || undefined,
      fiveStarOnly,
    });
    setReviews(prev => {
      const seen = new Set(prev.map(item => item.id));
      const merged = [...prev];
      res.items.forEach(item => {
        if (!seen.has(item.id)) merged.push(item);
      });
      return merged;
    });
    setTotalMatching(res.totalMatching);
    setHasMore(res.hasMore);
    setLoadingMore(false);
  };

  useEffect(() => {
    void SupabaseService.getDepartments().then(setDepartments);
    void AuthService.syncSession().then(setActivePatient);
  }, []);

  useEffect(() => {
    void loadFirstPage();
  }, [loadFirstPage]);

  // Body scroll lock + Esc + Focus trap
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusTimer = window.setTimeout(() => {
      const firstFocusable =
        modalRef.current?.querySelector<HTMLElement>(focusableSelector);
      firstFocusable?.focus();
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const nodes = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(focusableSelector)
        ).filter(el => el.offsetParent !== null);

        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOpenComposer = async () => {
    setComposerOpen(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setLoadingEligible(true);
    const visits = await SupabaseService.getEligibleCompletedVisitsForReview();
    setEligibleVisits(visits);
    setSelectedAppointmentId(visits[0]?.id || '');
    setLoadingEligible(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const visit = eligibleVisits.find(v => v.id === selectedAppointmentId);
    if (!visit || !draftComment.trim() || !activePatient) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await SupabaseService.submitVerifiedReview({
        doctorId: visit.doctor_id,
        appointmentId: visit.id,
        patientDisplayName: activePatient.fullName || 'Verified Patient',
        rating: draftRating,
        comment: draftComment.trim(),
      });
      setSubmitSuccess(true);
      setDraftComment('');
      setDraftRating(5);
      onReviewAdded();
      await loadFirstPage();
      const remaining = await SupabaseService.getEligibleCompletedVisitsForReview();
      setEligibleVisits(remaining);
      setSelectedAppointmentId(remaining[0]?.id || '');
    } catch (err: any) {
      setSubmitError(
        err?.message || 'Only patients with a completed appointment can submit a review.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goNextCard = useCallback(() => {
    if (reviews.length <= 1) return;
    setExitDirection(-1);
    setActiveIndex(prev => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const goPrevCard = useCallback(() => {
    if (reviews.length <= 1) return;
    setExitDirection(1);
    setActiveIndex(prev => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (reviews.length <= 1) return;
    if (info.offset.x < -70 || info.velocity.x < -420) {
      goNextCard();
    } else if (info.offset.x > 70 || info.velocity.x > 420) {
      goPrevCard();
    }
  };

  const visibleStack = useMemo(() => {
    if (reviews.length === 0) return [];
    const stackCount = Math.min(3, reviews.length);
    return Array.from({ length: stackCount }).map((_, layer) => {
      const idx = (activeIndex + layer) % reviews.length;
      return { review: reviews[idx], layer };
    });
  }, [reviews, activeIndex]);

  const modalTransition = reducedMotion
    ? { duration: 0.01 }
    : { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={modalTransition}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-modal flex items-end sm:items-center justify-center bg-[#10261F]/60 backdrop-blur-md p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="patient-stories-modal-title"
    >
      <motion.div
        ref={modalRef}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.98 }}
        transition={modalTransition}
        className="w-full sm:max-w-xl bg-bone border border-sage-light rounded-t-3xl sm:rounded-3xl shadow-warm-xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 border-b border-sage-light bg-paper flex items-start justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest font-semibold text-verdigris flex items-center gap-1.5">
              <ShieldCheck size={13} /> Verified Patient Stories
            </span>
            <h2
              id="patient-stories-modal-title"
              className="font-display text-xl sm:text-2xl font-bold text-ink mt-0.5"
            >
              Real Post-Visit Reviews
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {activePatient && !composerOpen && (
              <button
                type="button"
                onClick={() => void handleOpenComposer()}
                className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 text-xs"
              >
                <MessageSquarePlus size={14} />
                <span>Write a review</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close patient stories modal"
              className="p-2 rounded-full text-ink-soft hover:text-ink hover:bg-bone transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-verdigris"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 sm:px-6 border-b border-sage-light/80 bg-paper/70 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedDeptId('');
              setFiveStarOnly(false);
            }}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              !selectedDeptId && !fiveStarOnly
                ? 'bg-verdigris text-white border-verdigris'
                : 'bg-paper text-ink-soft border-sage-light hover:text-ink'
            )}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setFiveStarOnly(prev => !prev)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border inline-flex items-center gap-1 transition-colors',
              fiveStarOnly
                ? 'bg-saffron text-ink border-saffron font-semibold'
                : 'bg-paper text-ink-soft border-sage-light hover:text-ink'
            )}
          >
            <Star
              size={12}
              className={fiveStarOnly ? 'fill-ink text-ink' : 'fill-saffron text-saffron'}
            />
            <span>5★ only</span>
          </button>

          <select
            aria-label="Filter reviews by department"
            value={selectedDeptId}
            onChange={e => setSelectedDeptId(e.target.value)}
            className="input py-1.5 px-3 text-xs w-auto min-w-[165px] rounded-full bg-paper"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          {!loading && totalMatching > 0 && (
            <span className="ml-auto font-mono text-[11px] text-ink-soft">
              {reviews.length} of {totalMatching} loaded
            </span>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Verified-patient composer (when logged in and opened) */}
          {composerOpen && (
            <div className="rounded-2xl bg-paper border border-sage p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display font-bold text-base text-ink flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-verdigris" />
                  Share Your Verified Visit Experience
                </p>
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="text-xs font-medium text-ink-soft hover:text-ink underline"
                >
                  Back to stories
                </button>
              </div>

              {loadingEligible ? (
                <div className="space-y-2 py-2">
                  <div className="h-4 w-48 bg-sage-light rounded animate-pulse" />
                  <div className="h-10 w-full bg-sage-light/70 rounded-xl animate-pulse" />
                </div>
              ) : eligibleVisits.length === 0 ? (
                <div className="rounded-xl bg-bone border border-sage-light p-3.5 text-xs text-ink-soft space-y-2">
                  <p className="font-semibold text-ink">
                    Completed appointment required
                  </p>
                  <p className="leading-relaxed">
                    Only verified patients with a completed consultation can post a review. Once your visit is marked completed, you can review it right here.
                  </p>
                  <Link
                    to={ROUTES.patientAppointments}
                    onClick={onClose}
                    className="inline-flex font-semibold text-verdigris hover:underline"
                  >
                    View My Appointments →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">
                      Select Completed Consultation
                    </label>
                    <select
                      value={selectedAppointmentId}
                      onChange={e => setSelectedAppointmentId(e.target.value)}
                      className="input text-xs py-2"
                      required
                    >
                      {eligibleVisits.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.doctor_name} · {v.department_name} ({formatIndianDate(v.appointment_date)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="block text-xs font-medium text-ink mb-1">Rating</span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map(starVal => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setDraftRating(starVal)}
                          aria-label={`Rate ${starVal} stars`}
                          className="p-1 rounded hover:scale-110 transition-transform"
                        >
                          <Star
                            size={20}
                            className={
                              starVal <= draftRating
                                ? 'fill-saffron text-saffron'
                                : 'text-sage'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink mb-1">
                      Your Review
                    </label>
                    <textarea
                      rows={3}
                      value={draftComment}
                      onChange={e => setDraftComment(e.target.value)}
                      placeholder="How was your consultation, doctor explanation, and care experience?"
                      className="input text-sm"
                      required
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs text-[var(--signal-deep)] flex items-center gap-1.5">
                      <AlertCircle size={14} /> {submitError}
                    </p>
                  )}

                  {submitSuccess && (
                    <p className="text-xs text-verdigris-deep flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={14} /> Verified review published!
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting || !draftComment.trim()}
                      className="btn btn-primary btn-sm"
                    >
                      {submitting ? 'Publishing…' : 'Submit Verified Review'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Main Card Stack / Skeleton / Empty State */}
          {loading ? (
            <div className="space-y-3" aria-label="Loading patient reviews">
              <div className="rounded-2xl bg-paper border border-sage-light p-6 space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-28 bg-sage-light rounded" />
                  <div className="h-5 w-24 bg-mint rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-sage-light/80 rounded" />
                  <div className="h-4 w-5/6 bg-sage-light/80 rounded" />
                  <div className="h-4 w-2/3 bg-sage-light/60 rounded" />
                </div>
                <div className="pt-3 border-t border-sage-light/60 flex justify-between">
                  <div className="h-4 w-32 bg-sage-light rounded" />
                  <div className="h-4 w-20 bg-sage-light rounded" />
                </div>
              </div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl bg-paper border border-sage-light p-8 text-center space-y-3">
              <div className="w-11 h-11 rounded-full bg-mint text-verdigris mx-auto flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">
                No reviews yet
              </h3>
              <p className="text-sm text-ink-soft max-w-sm mx-auto leading-relaxed">
                {selectedDeptId || fiveStarOnly
                  ? 'No verified patient reviews match the selected filters yet.'
                  : 'Only verified patients who complete an appointment can publish reviews here.'}
              </p>
              {(selectedDeptId || fiveStarOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDeptId('');
                    setFiveStarOnly(false);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Swipeable Stack */}
              <div className="relative h-[292px] sm:h-[298px] select-none">
                <AnimatePresence initial={false} mode="popLayout">
                  {[...visibleStack].reverse().map(({ review, layer }) => {
                    const isTop = layer === 0;
                    const stackScale = 1 - layer * 0.05;
                    const stackY = layer * 12;
                    const stackOpacity = layer === 0 ? 1 : layer === 1 ? 0.88 : 0.65;

                    return (
                      <motion.article
                        key={review.id}
                        style={{
                          zIndex: 10 - layer,
                          originY: 1,
                        }}
                        initial={
                          reducedMotion
                            ? { opacity: 0 }
                            : {
                                scale: 0.92,
                                y: 20,
                                opacity: 0,
                              }
                        }
                        animate={{
                          scale: stackScale,
                          y: stackY,
                          opacity: stackOpacity,
                          x: 0,
                          rotate: 0,
                        }}
                        exit={
                          reducedMotion
                            ? { opacity: 0 }
                            : {
                                x: exitDirection * 280,
                                opacity: 0,
                                rotate: exitDirection * 8,
                                transition: { duration: 0.26, ease: 'easeOut' },
                              }
                        }
                        transition={
                          reducedMotion
                            ? { duration: 0.01 }
                            : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                        }
                        drag={isTop && reviews.length > 1 && !reducedMotion ? 'x' : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.45}
                        onDragEnd={isTop ? handleDragEnd : undefined}
                        whileDrag={isTop ? { rotate: 2, cursor: 'grabbing' } : undefined}
                        className={cn(
                          'absolute inset-x-0 top-0 rounded-2xl bg-paper border p-5 sm:p-6 shadow-warm-md flex flex-col justify-between h-[260px] sm:h-[266px]',
                          isTop
                            ? 'border-sage cursor-grab active:cursor-grabbing'
                            : 'border-sage-light pointer-events-none'
                        )}
                      >
                        <div>
                          {/* Top metadata row: Stars + Verified badge */}
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <AnimatedStars
                              rating={review.rating}
                              reducedMotion={reducedMotion}
                              animateKey={`${review.id}-${activeIndex}`}
                            />
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-mint text-verdigris-deep">
                              <ShieldCheck size={12} /> Verified patient
                            </span>
                          </div>

                          {/* Review body */}
                          <p className="font-display text-lg sm:text-xl font-semibold text-ink leading-relaxed line-clamp-4">
                            &ldquo;{review.comment}&rdquo;
                          </p>
                        </div>

                        {/* Bottom author + doctor/dept + date */}
                        <div className="pt-4 mt-4 border-t border-sage-light flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-ink truncate">
                              {formatPatientFirstInitial(review.patient_display_name)}
                            </p>
                            <p className="text-xs text-ink-soft truncate mt-0.5">
                              {review.doctor_name || 'Relif Care Specialist'}
                              {review.department_name ? ` · ${review.department_name}` : ''}
                            </p>
                          </div>
                          <span className="font-mono text-[11px] text-ink-soft flex-shrink-0">
                            {formatIndianDate(review.created_at)}
                          </span>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Stack Controls + Load More */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrevCard}
                    disabled={reviews.length <= 1}
                    aria-label="Previous review"
                    className="p-2 rounded-full border border-sage-light bg-paper text-ink hover:border-verdigris disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-mono text-xs text-ink-soft px-1.5">
                    {activeIndex + 1} / {reviews.length}
                  </span>
                  <button
                    type="button"
                    onClick={goNextCard}
                    disabled={reviews.length <= 1}
                    aria-label="Next review"
                    className="p-2 rounded-full border border-sage-light bg-paper text-ink hover:border-verdigris disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                  {reviews.length > 1 && (
                    <span className="text-[11px] text-ink-soft hidden sm:inline ml-1">
                      Swipe or use arrows
                    </span>
                  )}
                </div>

                {hasMore && (
                  <button
                    type="button"
                    onClick={() => void handleLoadMore()}
                    disabled={loadingMore}
                    className="btn btn-secondary btn-sm text-xs"
                  >
                    {loadingMore ? 'Loading more…' : 'Load more'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
