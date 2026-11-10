// RegisterPage.tsx — Relif Hospital Patient Registration
// TODO: wire to Firebase Auth

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';
import { cn, sleep } from '@/utils';
import { ROUTES } from '@/config/constants';
import { AuthService } from '@/services/authService';

// ── Zod schema ───────────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    fullName:         z.string().min(2, 'Full name must be at least 2 characters'),
    email:            z.string().min(1, 'Email is required').email('Enter a valid email'),
    phone:            z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    password:         z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword:  z.string().min(1, 'Please confirm your password'),
    dateOfBirth:      z.string().min(1, 'Date of birth is required'),
    gender:           z.string().min(1, 'Please select a gender'),
    agreeToTerms:     z.boolean().refine(val => val === true, {
      message: 'You must agree to the Privacy Policy and Terms',
    }),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path:    ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// ── Component ────────────────────────────────────────────────────────────────
export function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirm]   = useState(false);
  const [isSubmitting, setIsSubmitting]         = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    await AuthService.signUpWithSupabase({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      dob: data.dateOfBirth,
      gender: data.gender,
    });
    setIsSubmitting(false);
    navigate(ROUTES.patientDashboard);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left decorative panel ────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-1 relative overflow-hidden bg-bone flex-col items-center justify-center"
        aria-hidden="true"
      >
        <div className="p-12 max-w-sm">
          <RelifLine variant="section" className="mb-6 opacity-70" />
          <p className="font-display text-4xl font-semibold text-ink leading-tight">
            Your health, your story.
          </p>
          <p className="mt-4 text-ink-soft text-lg">
            Join thousands of patients who manage their care with Relif.
          </p>
          <div className="mt-8 space-y-3">
            {['Secure medical records', 'Easy appointment booking', 'Digital prescriptions', 'Family health profiles'].map(f => (
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

      {/* ── Right: registration form ─────────────────────────────────────── */}
      <div className="flex-1 lg:max-w-lg xl:max-w-xl flex flex-col justify-center px-6 py-12 lg:px-16 bg-paper overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md mx-auto"
        >
          {/* Logo */}
          <div className="mb-8">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-semibold text-ink">relif</span>
            </Link>
            <RelifLine variant="section" className="mt-1 w-14" />
          </div>

          <h1 className="font-display text-4xl font-semibold text-ink mb-2">
            Create your account.
          </h1>
          <p className="text-ink-soft mb-8">
            Fill in your details to get started with Relif Hospital.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              autoComplete="name"
              required
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            {/* Email */}
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Phone */}
            <Input
              label="Mobile Number"
              type="tel"
              autoComplete="tel"
              required
              hint="10-digit Indian mobile number (e.g. 9876543210)"
              error={errors.phone?.message}
              {...register('phone')}
            />

            {/* Password */}
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
                  className="text-ink-soft hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              {...register('password')}
            />

            {/* Confirm Password */}
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
                  className="text-ink-soft hover:text-ink transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              {...register('confirmPassword')}
            />

            {/* Date of Birth + Gender row */}
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

            {/* Terms checkbox */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 accent-[var(--verdigris)] rounded"
                  {...register('agreeToTerms')}
                />
                <span className="text-sm text-ink-soft">
                  I have read and agree to the{' '}
                  <a
                    href="/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-verdigris underline hover:text-verdigris-deep"
                  >
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a
                    href="/legal/terms-of-use"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-verdigris underline hover:text-verdigris-deep"
                  >
                    Terms of Use
                  </a>
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
              className="w-full bg-saffron text-ink hover:bg-[var(--saffron-deep)] rounded-pill font-semibold"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Already have an account?{' '}
            <Link
              to={ROUTES.login}
              className="text-verdigris hover:text-verdigris-deep font-medium underline underline-offset-2"
            >
              Sign in →
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-ink-soft opacity-60">
            This is a demo. No real authentication occurs.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
