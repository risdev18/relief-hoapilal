// LoginPage.tsx — Relif Care Multispecialty Portal Authentication
// Strict Supabase Auth (Password + Email OTP + Mobile Phone OTP), ZERO demo accounts.

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, AlertCircle, UserPlus, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/config/constants';
import { AuthService } from '@/services/authService';
import { cn } from '@/utils';

type AuthMode = 'password' | 'email_otp' | 'phone_otp';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const [mode, setMode] = useState<AuthMode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    const active = AuthService.getActivePatient();
    if (active?.isLoggedIn) {
      navigate(
        redirectPath ||
          (active.role === 'admin' ? ROUTES.adminDashboard : ROUTES.patientDashboard),
        { replace: true }
      );
    }
  }, [navigate, redirectPath]);

  const handleSuccessRedirect = (role: string) => {
    if (redirectPath) {
      navigate(redirectPath);
      return;
    }
    navigate(role === 'admin' ? ROUTES.adminDashboard : ROUTES.patientDashboard);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!email.trim() || password.length < 6) {
      setErrorMessage('Enter your registered email and password (minimum 6 characters).');
      return;
    }

    setIsSubmitting(true);
    const result = await AuthService.signInWithSupabase(email, password);
    setIsSubmitting(false);

    if (result.success && result.user) {
      handleSuccessRedirect(result.user.role);
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    if (mode === 'email_otp') {
      if (!email.trim() || !email.includes('@')) {
        setIsSubmitting(false);
        setErrorMessage('Enter a valid email address to receive your one-time code.');
        return;
      }
      const res = await AuthService.sendEmailOtp(email);
      setIsSubmitting(false);
      if (res.success) {
        setOtpSent(true);
        setInfoMessage(`A 6-digit verification code has been sent to ${email}.`);
      } else {
        setErrorMessage(res.error || 'Could not dispatch email OTP.');
      }
    } else {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 10) {
        setIsSubmitting(false);
        setErrorMessage('Enter a valid 10-digit Indian mobile number.');
        return;
      }
      const res = await AuthService.sendPhoneOtp(phone);
      setIsSubmitting(false);
      if (res.success) {
        setOtpSent(true);
        setInfoMessage(`An SMS OTP has been sent to +91 ${digits.slice(-10)}.`);
      } else {
        setErrorMessage(res.error || 'Phone OTP delivery is not configured on this Supabase project yet. Use Email OTP or Password login.');
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (otpCode.trim().length < 6) {
      setErrorMessage('Enter the 6-digit code sent to your inbox/phone.');
      return;
    }

    setIsSubmitting(true);
    const res =
      mode === 'email_otp'
        ? await AuthService.verifyEmailOtp(email, otpCode)
        : await AuthService.verifyPhoneOtp(phone, otpCode);
    setIsSubmitting(false);

    if (res.success && res.user) {
      handleSuccessRedirect(res.user.role);
    } else {
      setErrorMessage(res.error || 'Verification code invalid or expired.');
    }
  };

  return (
    <div className="min-h-screen flex bg-paper">
      {/* Left: Hospital Clinical Trust Panel */}
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
            Access NABL-verified pathology reports, appointments, GST receipts, and prescriptions protected by ABDM &amp; DPDP healthcare standards.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4 text-xs text-ink-soft font-mono">
            <span>256-Bit TLS Encrypted</span>
            <span>·</span>
            <span>ABHA Integrated</span>
            <span>·</span>
            <span>Verified UHID</span>
          </div>
        </div>
      </div>

      {/* Right: Auth Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div>
            <Link to={ROUTES.home} className="inline-flex items-baseline gap-1.5 mb-4">
              <span className="font-display font-bold text-2xl text-ink">relif</span>
              <span className="font-mono text-xs text-saffron uppercase font-bold">Care</span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-ink mb-1">Patient Portal Sign In</h1>
            <p className="text-sm text-ink-soft">
              Sign in securely with Email OTP, Password, or Mobile OTP.
            </p>
          </div>

          {/* New Patient CTA */}
          <div className="p-4 rounded-2xl bg-bone border border-sage flex items-center justify-between gap-3 shadow-warm-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <UserPlus size={14} className="text-verdigris" />
                New to Relif Care?
              </span>
              <p className="text-[11px] text-ink-soft">Create your UHID patient profile in under a minute.</p>
            </div>
            <Link
              to={ROUTES.register}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-verdigris text-white hover:bg-verdigris-deep transition-all flex-shrink-0"
            >
              Register →
            </Link>
          </div>

          {/* Auth Mode Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-bone rounded-xl border border-sage-light">
            {[
              { id: 'password', label: 'Password', icon: Lock },
              { id: 'email_otp', label: 'Email OTP', icon: Mail },
              { id: 'phone_otp', label: 'Mobile OTP', icon: Phone },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setMode(tab.id as AuthMode);
                    setOtpSent(false);
                    setOtpCode('');
                    setErrorMessage(null);
                    setInfoMessage(null);
                  }}
                  className={cn(
                    'flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all',
                    active
                      ? 'bg-paper text-verdigris-deep shadow-warm-xs border border-sage-light'
                      : 'text-ink-soft hover:text-ink'
                  )}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback banners */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 rounded-xl bg-[var(--signal-light)] border border-signal/30 text-signal-deep text-xs flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-signal" />
                <p className="font-medium leading-relaxed">{errorMessage}</p>
              </motion.div>
            )}
            {infoMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 rounded-xl bg-mint/60 border border-sage text-verdigris-deep text-xs flex items-start gap-2.5"
              >
                <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{infoMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Body */}
          {mode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-ink-soft hover:text-ink"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
              </div>

              <div className="flex justify-end">
                <Link
                  to={ROUTES.forgotPassword}
                  className="text-xs font-medium text-verdigris hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full justify-center bg-verdigris text-white hover:bg-verdigris-deep"
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
          ) : !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {mode === 'email_otp' ? (
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              ) : (
                <Input
                  label="Indian Mobile Number (+91)"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  hint="Enter 10-digit mobile number"
                  required
                />
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full justify-center bg-verdigris text-white hover:bg-verdigris-deep"
              >
                {isSubmitting ? 'Sending Code…' : 'Send 6-Digit OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input
                label="Enter 6-Digit OTP"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full justify-center bg-verdigris text-white hover:bg-verdigris-deep"
              >
                {isSubmitting ? 'Verifying…' : 'Verify & Sign In'}
              </Button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-center text-xs text-ink-soft hover:text-verdigris"
              >
                Change {mode === 'email_otp' ? 'email' : 'mobile number'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
