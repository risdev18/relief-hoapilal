// LoginPage.tsx — Relif Hospital Patient Portal Authentication
// Direct Supabase Auth Integration + New Patient Registration Link + Demo Access

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { AuthService, PatientUser } from '@/services/authService';

// ── Zod schema ──────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().min(1, 'Email or UHID is required'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activePatient, setActivePatient] = useState<PatientUser | null>(null);

  useEffect(() => {
    const patient = AuthService.getActivePatient();
    setActivePatient(patient);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await AuthService.signInWithSupabase(data.email, data.password);

    if (result.success) {
      setIsSubmitting(false);
      navigate(ROUTES.patientDashboard);
    } else {
      setIsSubmitting(false);
      setErrorMessage(
        result.error || 'Authentication failed. Please verify your Supabase email and password, or register as a new patient.'
      );
    }
  };

  const handleDemoLogin = () => {
    AuthService.loginAsDemo();
    navigate(ROUTES.patientDashboard);
  };

  return (
    <div className="min-h-screen flex bg-paper">
      {/* ── Left: Hospital Branding & Reassurance ────────────────────── */}
      <div
        className="hidden lg:flex flex-1 relative overflow-hidden bg-bone items-center justify-center p-12 border-r border-sage-light"
        aria-hidden="true"
      >
        <div className="max-w-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-mint mx-auto flex items-center justify-center text-verdigris shadow-warm-md">
            <ShieldCheck size={32} />
          </div>
          <h2 className="font-display text-3xl font-bold text-ink">
            Your Health Records, <br />
            <em className="italic font-normal text-verdigris">always with you.</em>
          </h2>
          <p className="text-sm text-ink-soft leading-relaxed">
            Access NABL-verified pathology reports, active medication protocols, doctor appointments, and hospital invoices under ABDM privacy standards.
          </p>
          <div className="pt-4 flex justify-center gap-6 text-xs text-ink-soft font-mono">
            <span>✓ 256-Bit SSL Encrypted</span>
            <span>✓ ABHA Integrated</span>
            <span>✓ Verified UHID</span>
          </div>

          <div className="p-4 rounded-2xl bg-paper/70 border border-sage-light text-left text-xs text-ink-soft space-y-1.5 mt-8">
            <p className="font-semibold text-ink flex items-center gap-1.5">
              <Sparkles size={13} className="text-saffron" />
              Supabase Auth Integrated
            </p>
            <p>
              Log in with any email and password registered in your Supabase project. If you haven't registered yet, click <strong>"New Patient Registration"</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: Login Form ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link to={ROUTES.home} className="inline-block mb-4">
              <span className="font-display font-bold text-2xl text-ink">relif</span>
              <span className="font-mono text-xs text-saffron uppercase ml-1 font-bold">Care</span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-ink mb-1">Patient Portal Login</h1>
            <p className="text-sm text-ink-soft">Sign in with your registered Supabase email, mobile, or UHID.</p>
          </div>

          {/* New Patient Registration Banner */}
          <div className="p-4 rounded-2xl bg-bone border border-sage flex items-center justify-between gap-3 shadow-warm-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <UserPlus size={14} className="text-verdigris" />
                Are you a new patient?
              </span>
              <p className="text-[11px] text-ink-soft">Create your official UHID and patient dossier in 1 minute.</p>
            </div>
            <Link
              to={ROUTES.register}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-verdigris text-white hover:bg-verdigris-deep transition-all shadow-xs flex-shrink-0"
            >
              Register Now →
            </Link>
          </div>

          {/* Error Message Alert */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 rounded-xl bg-signal/10 border border-signal/30 text-signal text-xs flex items-start gap-2.5"
              >
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{errorMessage}</p>
                  <p className="text-ink-soft">
                    Tip: If you haven't registered this email in Supabase yet, use{' '}
                    <Link to={ROUTES.register} className="text-verdigris underline font-semibold">
                      New Patient Registration
                    </Link>{' '}
                    or try the Instant Demo Account below.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Standard Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                label="Supabase Email / Registered ID"
                type="email"
                placeholder="e.g. patient@example.com"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-signal mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your security password"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-ink-soft hover:text-ink transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-signal mt-1">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center bg-verdigris text-white hover:bg-verdigris-deep font-semibold py-3 shadow-warm-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in via Supabase…' : 'Sign In to Patient Portal'}
            </Button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-sage-light"></div>
              <span className="flex-shrink mx-3 text-[11px] font-mono uppercase text-ink-soft/70">Or One-Click Test</span>
              <div className="flex-grow border-t border-sage-light"></div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-sage/80 bg-paper hover:bg-bone transition-all text-xs text-ink group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-saffron/20 text-ink flex items-center justify-center font-bold text-xs">
                  RM
                </div>
                <div className="text-left">
                  <span className="font-semibold block text-ink">Explore with Rahul Mehta's Record</span>
                  <span className="text-[10px] text-ink-soft font-mono">UHID: RH26-00192 · Active Prescriptions & Lab Results</span>
                </div>
              </div>
              <span className="text-verdigris font-semibold group-hover:translate-x-1 transition-transform">Enter →</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-ink-soft">
              Are you a hospital doctor or staff?{' '}
              <Link to="/doctor/dashboard" className="text-verdigris font-semibold hover:underline">
                Doctor Portal
              </Link>{' '}
              ·{' '}
              <Link to="/reception/dashboard" className="text-verdigris font-semibold hover:underline">
                Reception Desk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
