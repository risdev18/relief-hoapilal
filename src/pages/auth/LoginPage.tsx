// LoginPage.tsx — Relif Hospital Patient Auth
// TODO: wire to Firebase Auth

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, RelifSpinner } from '@/components/ui';
import { RelifLine } from '@/components/ui/RelifLine';
import { cn, sleep } from '@/utils';
import { ROUTES } from '@/config/constants';

// ── Zod schema ──────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ── Botanical SVG placeholder ────────────────────────────────────────────────
function BotanicalSVG() {
  return (
    <svg
      viewBox="0 0 400 600"
      fill="none"
      className="w-full h-full opacity-20"
      aria-hidden="true"
    >
      {/* Stems */}
      <path d="M200 580 Q200 400 180 300" stroke="var(--verdigris)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M200 580 Q210 420 230 320" stroke="var(--verdigris)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M200 580 Q185 430 160 350" stroke="var(--sage)" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Leaves */}
      <ellipse cx="160" cy="280" rx="40" ry="18" fill="var(--verdigris)" transform="rotate(-30 160 280)" opacity="0.7" />
      <ellipse cx="240" cy="300" rx="38" ry="16" fill="var(--sage)" transform="rotate(25 240 300)" opacity="0.6" />
      <ellipse cx="175" cy="230" rx="30" ry="13" fill="var(--verdigris)" transform="rotate(-15 175 230)" opacity="0.5" />
      <ellipse cx="225" cy="250" rx="28" ry="12" fill="var(--mint)" transform="rotate(20 225 250)" opacity="0.8" />
      <ellipse cx="150" cy="350" rx="35" ry="14" fill="var(--sage)" transform="rotate(-40 150 350)" opacity="0.5" />

      {/* Flower */}
      <circle cx="180" cy="200" r="20" fill="var(--saffron)" opacity="0.4" />
      <circle cx="180" cy="200" r="10" fill="var(--saffron)" opacity="0.7" />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <ellipse
          key={i}
          cx={180 + Math.cos((deg * Math.PI) / 180) * 24}
          cy={200 + Math.sin((deg * Math.PI) / 180) * 24}
          rx="10"
          ry="6"
          fill="var(--clay)"
          transform={`rotate(${deg} ${180 + Math.cos((deg * Math.PI) / 180) * 24} ${200 + Math.sin((deg * Math.PI) / 180) * 24})`}
          opacity="0.5"
        />
      ))}

      {/* Soil / base line */}
      <path d="M100 580 Q200 570 300 580" stroke="var(--sage)" strokeWidth="2" fill="none" />
    </svg>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (_data: LoginFormValues) => {
    setIsSubmitting(true);
    // TODO: wire to Firebase Auth
    // Simulate network delay
    await sleep(1500);
    navigate(ROUTES.patientDashboard);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left: photo placeholder ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-1 relative overflow-hidden bg-bone items-end justify-center"
        aria-hidden="true"
      >
        {/* Arch mask via CSS clip-path */}
        <div
          className="absolute inset-0"
          style={{ clipPath: 'ellipse(100% 100% at 50% 100%)' }}
        >
          <div className="w-full h-full bg-gradient-to-b from-[var(--mint-light)] to-[var(--bone)] flex items-center justify-center">
            <BotanicalSVG />
          </div>
        </div>

        {/* Tagline overlay */}
        <motion.div
          className="relative z-10 p-12 pb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-display text-3xl font-semibold text-ink leading-tight max-w-xs">
            "Care that feels like relief."
          </p>
          <RelifLine variant="section" className="mt-4 max-w-xs" />
        </motion.div>
      </div>

      {/* ── Right: login form ────────────────────────────────────────────── */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex flex-col justify-center px-6 py-12 lg:px-16 bg-paper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm mx-auto"
        >
          {/* Logo */}
          <div className="mb-10">
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl font-semibold text-ink">relif</span>
            </Link>
            <RelifLine variant="section" className="mt-1 w-16" />
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl font-semibold text-ink mb-2">
            Welcome back.
          </h1>
          <p className="text-ink-soft mb-8">
            Sign in to access your health records and appointments.
          </p>

          {/* Demo notice */}
          <div className="mb-6 p-4 rounded-lg bg-[var(--mint-light)] border border-sage text-sm">
            <p className="font-medium text-verdigris mb-1">Demo mode</p>
            <p className="text-ink-soft">
              Use <code className="font-mono bg-mint px-1 rounded text-verdigris-deep">test@relif.demo</code> /{' '}
              <code className="font-mono bg-mint px-1 rounded text-verdigris-deep">Demo1234</code> to sign in as patient.{' '}
              <Link to="/demo-guide" className="underline hover:text-verdigris">See /demo-guide</Link> for all role logins.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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

            <div className="flex justify-end">
              <Link
                to={ROUTES.forgotPassword}
                className="text-sm text-verdigris hover:text-verdigris-deep underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full bg-saffron text-ink hover:bg-[var(--saffron-deep)] rounded-pill font-semibold"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-ink-soft">
            New patient?{' '}
            <Link
              to={ROUTES.register}
              className="text-verdigris hover:text-verdigris-deep font-medium underline underline-offset-2"
            >
              Register →
            </Link>
          </p>

          {/* Disclaimer */}
          <p className="mt-8 text-center text-xs text-ink-soft opacity-60">
            This is a demo. No real authentication occurs.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
