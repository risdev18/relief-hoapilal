// LoginPage.tsx — Relif Hospital Patient Auth
// Dual persistence: Supabase Auth ready + Local Patient Profile (Rahul Vinod Mehta)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { sleep } from '@/utils';
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
      email: 'rahul.mehta@email.com',
      password: '••••••••',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    AuthService.loginPatient(data.email);
    await sleep(600);
    setIsSubmitting(false);
    navigate(ROUTES.patientDashboard);
  };

  const handleQuickRevisit = () => {
    AuthService.loginPatient(activePatient?.email || 'rahul.mehta@email.com');
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
            <p className="text-sm text-ink-soft">Enter your registered Email, Mobile, or Hospital UHID.</p>
          </div>

          {/* Returning Customer Saved Details Card */}
          {activePatient && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-bone rounded-2xl border border-sage space-y-3 shadow-warm-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-verdigris bg-mint px-2 py-0.5 rounded-full">
                  Returning Patient Recognized
                </span>
                <span className="text-xs font-mono text-ink-soft font-medium">UHID: {activePatient.uhid}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-verdigris/10 text-verdigris flex items-center justify-center font-bold text-sm">
                  {activePatient.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink">{activePatient.fullName}</h4>
                  <p className="text-xs text-ink-soft">{activePatient.email} · {activePatient.phone}</p>
                </div>
              </div>
              <div className="text-xs text-ink-soft bg-paper/80 p-2.5 rounded-xl border border-sage-light flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-verdigris" />
                  Blood: <strong className="text-ink">{activePatient.bloodGroup}</strong> | ABHA: <strong className="text-ink">{activePatient.abhaId}</strong>
                </span>
                <span className="font-mono text-[11px] text-verdigris font-semibold">3 Active Records</span>
              </div>
              <Button
                type="button"
                onClick={handleQuickRevisit}
                className="w-full justify-center bg-saffron text-ink hover:bg-saffron-deep font-semibold shadow-warm-xs"
              >
                <span>Continue as {activePatient.fullName.split(' ')[0]} →</span>
              </Button>
            </motion.div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                label="Registered Email / UHID / Mobile"
                placeholder="e.g. rahul.mehta@email.com or RH26-00192"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-signal mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Password / Access Pin"
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
              className="w-full justify-center bg-verdigris text-white hover:bg-verdigris-deep font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Access Patient Portal'}
            </Button>
          </form>

          <p className="text-center text-xs text-ink-soft">
            Don't have an account or UHID?{' '}
            <Link to={ROUTES.register} className="text-verdigris font-semibold hover:underline">
              Register as New Patient
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
