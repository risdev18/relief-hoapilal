// ForgotPasswordPage.tsx — Relif Hospital Password Reset
// TODO: wire to Firebase Auth sendPasswordResetEmail

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';
import { sleep } from '@/utils';
import { ROUTES } from '@/config/constants';

// ── Zod schema ───────────────────────────────────────────────────────────────
const forgotSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

// ── Component ────────────────────────────────────────────────────────────────
export function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (_data: ForgotFormValues) => {
    setIsSubmitting(true);
    // TODO: wire to Firebase Auth
    await sleep(1200);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-bone flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-paper rounded-2xl shadow-warm-md p-8 md:p-10">
          {/* Logo */}
          <div className="mb-8">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-semibold text-ink">relif</span>
            </Link>
            <RelifLine variant="section" className="mt-1 w-14" />
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              /* ── Form state ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <div className="mb-5 w-12 h-12 rounded-xl bg-mint flex items-center justify-center">
                  <Mail size={22} className="text-verdigris" />
                </div>

                <h1 className="font-display text-3xl font-semibold text-ink mb-2">
                  Reset your password.
                </h1>
                <p className="text-ink-soft mb-8">
                  Enter the email address linked to your account and we'll send a reset link.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <Input
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    required
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full bg-saffron text-ink hover:bg-[var(--saffron-deep)] rounded-pill font-semibold"
                  >
                    {isSubmitting ? 'Sending…' : 'Send reset link'}
                  </Button>
                </form>

                <Link
                  to={ROUTES.login}
                  className="mt-6 inline-flex items-center gap-2 text-sm text-verdigris hover:text-verdigris-deep underline underline-offset-2"
                >
                  <ArrowLeft size={14} />
                  Back to login
                </Link>
              </motion.div>
            ) : (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Success icon */}
                <div className="mb-5 w-14 h-14 rounded-full bg-mint flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12L10 17L19 7"
                      stroke="var(--verdigris)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h2 className="font-display text-3xl font-semibold text-ink mb-3">
                  Check your inbox.
                </h2>

                <div className="p-4 rounded-lg bg-[var(--mint-light)] border border-sage text-sm mb-6">
                  <p className="text-ink-soft">
                    If this email is registered, you'll receive a reset link shortly.
                  </p>
                  <p className="mt-2 font-medium text-verdigris text-xs">
                    Demo — no email is actually sent.
                  </p>
                </div>

                <RelifLine variant="section" className="mb-6 opacity-50" />

                <Link
                  to={ROUTES.login}
                  className="inline-flex items-center gap-2 text-sm text-verdigris hover:text-verdigris-deep font-medium underline underline-offset-2"
                >
                  <ArrowLeft size={14} />
                  Back to login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-xs text-ink-soft opacity-60">
            This is a demo. No real authentication occurs.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
