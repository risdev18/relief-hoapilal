// RegisterPage.tsx — Relif Care Multispecialty Patient Registration
// Strict Supabase Auth Registration with UHID assignment and clean error/confirmation handling.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';
import { cn } from '@/utils';
import { ROUTES } from '@/config/constants';
import { AuthService } from '@/services/authService';

const registerSchema = z
  .object({
    fullName:        z.string().min(2, 'Full name must be at least 2 characters'),
    email:           z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phone:           z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    password:        z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    dateOfBirth:     z.string().min(1, 'Date of birth is required'),
    gender:          z.string().min(1, 'Please select a gender'),
    agreeToTerms:    z.boolean().refine(val => val === true, {
      message: 'You must agree to the Privacy Policy and Terms',
    }),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailConfirmSentTo, setEmailConfirmSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    const res = await AuthService.signUpWithSupabase({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      dob: data.dateOfBirth,
      gender: data.gender,
    });

    setIsSubmitting(false);

    if (!res.success) {
      setServerError(res.error || 'Could not complete registration. Please try again.');
      return;
    }

    if (res.needsEmailConfirm) {
      setEmailConfirmSentTo(data.email);
      return;
    }

    navigate(ROUTES.patientDashboard);
  };

  return (
    <div className="min-h-screen flex bg-paper">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-1 relative overflow-hidden bg-bone flex-col items-center justify-center border-r border-sage-light"
        aria-hidden="true"
      >
        <div className="p-12 max-w-sm">
          <RelifLine variant="section" className="mb-6 opacity-70" />
          <p className="font-display text-4xl font-semibold text-ink leading-tight">
            Your health, your story.
          </p>
          <p className="mt-4 text-ink-soft text-lg">
            Join patients managing specialist visits, digital prescriptions and transparent billing with Relif Care.
          </p>
          <div className="mt-8 space-y-3">
            {[
              'Verified digital UHID on registration',
              'Transparent OPD & Video consultation fees',
              'Downloadable GST receipts & reports',
              'Easy rescheduling & cancellation refunds',
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-mint flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="var(--verdigris-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-ink-soft text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Registration form */}
      <div className="flex-1 lg:max-w-lg xl:max-w-xl flex flex-col justify-center px-6 py-12 lg:px-16 bg-paper overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-8">
            <Link to={ROUTES.home} className="inline-flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold text-ink">relif</span>
              <span className="font-mono text-xs text-saffron uppercase font-bold">Care</span>
            </Link>
            <RelifLine variant="section" className="mt-1 w-14" />
          </div>

          <h1 className="font-display text-4xl font-semibold text-ink mb-2">
            Create your account.
          </h1>
          <p className="text-ink-soft mb-6">
            Register once to book appointments, access medical reports and track billing.
          </p>

          {emailConfirmSentTo ? (
            <div className="p-6 rounded-2xl bg-mint/40 border border-verdigris/30 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-verdigris flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h2 className="font-display font-bold text-lg text-ink">Verify your email to continue</h2>
                  <p className="text-sm text-ink-soft mt-1">
                    We sent a verification link to <strong>{emailConfirmSentTo}</strong>. Open the link in your inbox, then sign in.
                  </p>
                </div>
              </div>
              <Link to={ROUTES.login} className="btn btn-primary btn-md w-full justify-center">
                Proceed to Sign In →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {serverError && (
                <div className="p-3.5 rounded-xl bg-[var(--signal-light)] border border-signal/30 text-signal-deep text-xs flex items-start gap-2.5" role="alert">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-signal" />
                  <p className="font-medium">{serverError}</p>
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                autoComplete="name"
                required
                error={errors.fullName?.message}
                {...register('fullName')}
              />

              <Input
                label="Email Address"
                type="email"
                autoComplete="email"
                required
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Mobile Number"
                type="tel"
                autoComplete="tel"
                required
                hint="10-digit Indian mobile number (e.g. 9876543210)"
                error={errors.phone?.message}
                {...register('phone')}
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                error={errors.password?.message}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="text-ink-soft hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                error={errors.confirmPassword?.message}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(p => !p)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="text-ink-soft hover:text-ink"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                {...register('confirmPassword')}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  required
                  error={errors.dateOfBirth?.message}
                  {...register('dateOfBirth')}
                />

                <div className="w-full">
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Gender <span className="text-signal ml-1">*</span>
                  </label>
                  <select
                    className={cn('input w-full', { 'input-error': !!errors.gender })}
                    {...register('gender')}
                  >
                    <option value="">Select…</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1.5 text-sm text-signal">{errors.gender.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 accent-[var(--verdigris)] rounded"
                    {...register('agreeToTerms')}
                  />
                  <span className="text-sm text-ink-soft">
                    I agree to the{' '}
                    <Link to={ROUTES.legal('privacy')} className="text-verdigris underline hover:text-verdigris-deep">
                      Privacy Policy
                    </Link>
                    ,{' '}
                    <Link to={ROUTES.legal('refund')} className="text-verdigris underline hover:text-verdigris-deep">
                      Refund Policy
                    </Link>{' '}
                    and{' '}
                    <Link to={ROUTES.legal('terms')} className="text-verdigris underline hover:text-verdigris-deep">
                      Terms of Use
                    </Link>
                    .
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1.5 text-sm text-signal">{errors.agreeToTerms.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full justify-center bg-saffron text-ink hover:bg-[var(--saffron-deep)] rounded-pill font-semibold"
              >
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-ink-soft">
            Already have an account?{' '}
            <Link
              to={ROUTES.login}
              className="text-verdigris hover:text-verdigris-deep font-medium underline underline-offset-2"
            >
              Sign in →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
