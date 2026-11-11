import React, { useState } from 'react';
import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

// ============================================================
// Button Component
// ============================================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'emergency' | 'verdigris';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}, ref) => {
  const base = 'btn';
  
  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };
  
  const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
    emergency: 'btn-emergency',
    verdigris: 'bg-verdigris text-white hover:bg-verdigris-deep shadow-verdigris transition-all duration-300',
  };
  
  return (
    <button
      ref={ref}
      className={cn(base, sizes[size], variants[variant], {
        'opacity-60 cursor-not-allowed': disabled || isLoading,
      }, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <RelifSpinner size="sm" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

// ============================================================
// Input Component
// ============================================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftElement,
  rightElement,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink mb-1.5">
          {label}
          {props.required && <span className="text-signal ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftElement && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft">
            {leftElement}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('input', {
            'pl-10': !!leftElement,
            'pr-10': !!rightElement,
            'input-error': !!error,
          }, className)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          aria-invalid={!!error}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-signal">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// ============================================================
// Badge / Chip Component
// ============================================================
interface BadgeProps {
  variant?: 'default' | 'saffron' | 'signal' | 'night' | 'verdigris';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', size = 'md', children, className }: BadgeProps) {
  const variants = {
    default:  'bg-mint text-verdigris-deep border border-sage-light',
    saffron:  'bg-[var(--saffron-light)] text-[var(--saffron-deep)] border border-[var(--clay)]',
    signal:   'bg-[var(--signal-light)] text-[var(--signal-deep)] border border-[var(--signal-light)]',
    night:    'bg-night text-[#E8F4EF] border border-[var(--night-muted)]',
    verdigris:'bg-verdigris text-white border border-verdigris-deep',
  };
  
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 font-medium rounded-pill',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
}

// ============================================================
// Availability Dot
// ============================================================
interface AvailabilityDotProps {
  status: 'available' | 'soon' | 'away' | 'leave';
  withLabel?: boolean;
  className?: string;
}

export function AvailabilityDot({ status, withLabel, className }: AvailabilityDotProps) {
  const dots = {
    available: { dot: 'dot-available', label: 'Available today' },
    soon:      { dot: 'dot-soon',      label: 'Next: tomorrow' },
    away:      { dot: 'dot-away',      label: 'On leave' },
    leave:     { dot: 'dot-away',      label: 'On leave' },
  };
  
  const { dot, label } = dots[status];
  
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={cn(dot, 'animate-pulse-dot')} aria-hidden="true" />
      {withLabel && <span className="text-sm text-ink-soft">{label}</span>}
    </span>
  );
}

// ============================================================
// Skeleton Loader
// ============================================================
interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn('skeleton rounded h-4', {
              'w-full': i < lines - 1,
              'w-3/4':  i === lines - 1,
            }, className)}
          />
        ))}
      </div>
    );
  }
  
  return <div className={cn('skeleton rounded h-4', className)} />;
}

// ============================================================
// Empty State
// ============================================================
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon ? (
        <div className="mb-6 text-sage">{icon}</div>
      ) : (
        <div className="mb-6">
          <RelifLineIllustration />
        </div>
      )}
      <h3 className="font-display text-2xl font-semibold text-ink mb-2">{title}</h3>
      {description && <p className="text-ink-soft max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}

// ============================================================
// Relif Line Spinner (loading state)
// ============================================================
interface RelifSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RelifSpinner({ size = 'md', className }: RelifSpinnerProps) {
  const sizes = { sm: 16, md: 24, lg: 40 };
  const s = sizes[size];
  
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 40 40"
      fill="none"
      className={cn('animate-spin', className)}
      style={{ animationDuration: '1s', animationTimingFunction: 'linear' }}
      aria-label="Loading"
    >
      <circle
        cx="20" cy="20" r="16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="80"
        strokeDashoffset="60"
        opacity="0.3"
      />
      <circle
        cx="20" cy="20" r="16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="20"
        strokeDashoffset="0"
      />
    </svg>
  );
}

// ============================================================
// Relif Line Illustration (empty states)
// ============================================================
function RelifLineIllustration() {
  return (
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" aria-hidden="true">
      <path
        d="M4 20 C10 20 12 8 20 8 C28 8 28 32 36 32 C44 32 44 12 52 12 C60 12 60 28 68 28 C76 28 76 16 84 16 C92 16 92 24 100 24 C108 24 108 20 116 20"
        stroke="var(--sage)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ============================================================
// Section Header
// ============================================================
interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'left', className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12', {
      'text-center': align === 'center',
    }, className)}>
      {eyebrow && (
        <span className="inline-block font-mono text-sm font-medium text-verdigris mb-3 tracking-widest uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="section-heading text-balance mb-4">{title}</h2>
      {subtitle && (
        <p className={cn('section-subheading max-w-2xl', align === 'center' && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ============================================================
// Stat Card
// ============================================================
interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { value: number; isPositive: boolean };
  isDemo?: boolean;
  className?: string;
}

export function StatCard({ label, value, unit, trend, className }: StatCardProps) {
  return (
    <div className={cn('card p-6', className)}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-ink-soft">{label}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="stat-number">{value}</span>
        {unit && <span className="text-ink-soft font-sans text-lg">{unit}</span>}
      </div>
      {trend && (
        <p className={cn('text-sm mt-2', {
          'text-[#22C55E]': trend.isPositive,
          'text-signal':    !trend.isPositive,
        })}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% this month
        </p>
      )}
    </div>
  );
}

// ============================================================
// Token Card (Queue)
// ============================================================
interface TokenCardProps {
  token: string;
  department: string;
  doctor: string;
  position: number;
  estimatedWait: number;
  status: 'waiting' | 'called' | 'in_consultation' | 'completed';
  className?: string;
}

export function TokenCard({ token, department, doctor, position, estimatedWait, status, className }: TokenCardProps) {
  const statusColors = {
    waiting:         'bg-mint text-verdigris-deep',
    called:          'bg-[var(--saffron-light)] text-[var(--saffron-deep)]',
    in_consultation: 'bg-[var(--saffron-light)] text-[var(--saffron-deep)]',
    completed:       'bg-mint text-verdigris-deep',
  };

  const statusLabels = {
    waiting:         'Waiting',
    called:          'Called — Please proceed',
    in_consultation: 'In Consultation',
    completed:       'Completed',
  };
  
  return (
    <div className={cn('card p-6 border-2', {
      'border-sage-light':  status === 'waiting' || status === 'completed',
      'border-saffron':     status === 'called' || status === 'in_consultation',
    }, className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-mono text-ink-soft uppercase tracking-widest mb-1">Queue Token</p>
          <p className="font-mono text-5xl font-bold text-ink leading-none">{token}</p>
        </div>
        <span className={cn('text-xs font-medium px-3 py-1 rounded-pill', statusColors[status])}>
          {statusLabels[status]}
        </span>
      </div>
      
      <div className="border-t border-sage-light pt-4 space-y-2">
        <p className="text-sm"><span className="text-ink-soft">Department:</span> <span className="text-ink font-medium">{department}</span></p>
        <p className="text-sm"><span className="text-ink-soft">Doctor:</span> <span className="text-ink font-medium">{doctor}</span></p>
        {status === 'waiting' && (
          <>
            <p className="text-sm"><span className="text-ink-soft">Position:</span> <span className="text-ink font-medium">#{position}</span></p>
            <p className="text-sm"><span className="text-ink-soft">Est. wait:</span> <span className="text-saffron font-medium">~{estimatedWait} min</span></p>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Doctor 4:5 Portrait with Skeleton & Designed Green-Gradient Initials Fallback
// ============================================================
interface DoctorAvatarProps {
  name: string;
  photoUrl?: string | null;
  alt?: string;
  className?: string;
  aspect?: '4/5' | 'square';
  rounded?: 'arch' | 'card' | 'circle';
  priority?: boolean;
}

function getDoctorInitials(name: string): string {
  const clean = name.replace(/^Dr\.?\s+/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'DR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function DoctorAvatar({
  name,
  photoUrl,
  alt,
  className,
  aspect = '4/5',
  rounded = 'card',
  priority = false,
}: DoctorAvatarProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const shapeClass =
    rounded === 'arch'
      ? 'rounded-t-full rounded-b-xl'
      : rounded === 'circle'
      ? 'rounded-full'
      : 'rounded-2xl';

  const aspectStyle = aspect === '4/5' ? { aspectRatio: '4 / 5' } : { aspectRatio: '1 / 1' };
  const initials = getDoctorInitials(name);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-b from-mint to-verdigris-deep/85 border border-sage-light flex items-center justify-center select-none',
        shapeClass,
        className
      )}
      style={aspectStyle}
    >
      {/* Skeleton pulse while photo loads */}
      {photoUrl && !errored && !loaded && (
        <div className="absolute inset-0 skeleton" aria-hidden="true" />
      )}

      {photoUrl && !errored ? (
        <img
          src={photoUrl}
          alt={alt || `Portrait of ${name}`}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            'w-full h-full object-cover object-top transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center text-white"
          style={{
            background: 'linear-gradient(155deg, #1F7A6B 0%, #10261F 100%)',
          }}
        >
          <span className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-paper">
            {initials}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-mint/80 mt-1">
            Relif Faculty
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Stepper (Relif Line — Compact Mobile + Full Tooltip Labels)
// ============================================================
interface StepperProps {
  steps: { label: string; shortLabel?: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 100;

  return (
    <div className={cn('w-full', className)}>
      {/* Compact mobile indicator */}
      <div className="flex sm:hidden items-center justify-between mb-2">
        <span className="font-mono text-xs font-semibold text-verdigris uppercase tracking-wider">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="text-xs font-semibold text-ink">
          {steps[currentStep]?.label}
        </span>
      </div>

      {/* Relif Line progress bar */}
      <div className="relative mb-4 sm:mb-6 h-5">
        <svg
          viewBox="0 0 400 24"
          fill="none"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M4 12 C60 12 80 4 120 4 C160 4 180 20 220 20 C260 20 280 8 320 8 C360 8 380 12 396 12"
            stroke="var(--sage-light)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M4 12 C60 12 80 4 120 4 C160 4 180 20 220 20 C260 20 280 8 320 8 C360 8 380 12 396 12"
            stroke="var(--verdigris)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="600"
            strokeDashoffset={600 - (600 * progress) / 100}
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </svg>
      </div>

      {/* Step labels */}
      <div className="hidden sm:flex justify-between">
        {steps.map((step, i) => (
          <div
            key={i}
            title={step.label}
            className="flex flex-col items-center text-center flex-1 min-w-0 px-1"
          >
            <div className={cn(
              'w-6 h-6 rounded-full border-2 mb-1.5 flex items-center justify-center transition-colors',
              {
                'bg-verdigris border-verdigris text-white': i < currentStep,
                'bg-saffron border-saffron text-ink':       i === currentStep,
                'bg-paper border-sage-light text-ink-soft': i > currentStep,
              }
            )}>
              {i < currentStep ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span className="text-xs font-mono font-bold">{i + 1}</span>
              )}
            </div>
            <p className={cn('text-xs font-medium leading-tight truncate max-w-full', {
              'text-verdigris': i < currentStep,
              'text-ink font-semibold': i === currentStep,
              'text-ink-soft':  i > currentStep,
            })}>
              {step.shortLabel || step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Toast / Notification
// ============================================================
interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  onClose?: () => void;
}

export function Toast({ type = 'info', title, description, onClose }: ToastProps) {
  const styles = {
    success: { bg: 'bg-mint', border: 'border-sage', icon: '✓', iconColor: 'text-verdigris' },
    error:   { bg: 'bg-[var(--signal-light)]', border: 'border-signal', icon: '✕', iconColor: 'text-signal' },
    warning: { bg: 'bg-[var(--saffron-light)]', border: 'border-[var(--clay)]', icon: '!', iconColor: 'text-[var(--saffron-deep)]' },
    info:    { bg: 'bg-mint', border: 'border-sage', icon: 'i', iconColor: 'text-verdigris' },
  };
  
  const s = styles[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, x: '100%' }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        'shadow-warm-md max-w-sm w-full',
        s.bg, s.border
      )}
      role="alert"
    >
      <span className={cn('w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5', s.iconColor)}>
        {s.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-ink text-sm">{title}</p>
        {description && <p className="text-ink-soft text-sm mt-0.5">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-ink-soft hover:text-ink transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </motion.div>
  );
}

// ============================================================
// QR Card
// ============================================================
interface QRCardProps {
  appointmentId: string;
  patientName: string;
  date: string;
  time: string;
  doctor: string;
  department: string;
  qrValue: string;
  className?: string;
}

export function QRCard({ appointmentId, patientName, date, time, doctor, department, qrValue, className }: QRCardProps) {
  return (
    <div className={cn('card p-6 max-w-sm', className)}>
      <div className="text-center mb-4">
        <p className="font-mono text-xs text-ink-soft uppercase tracking-widest mb-1">Appointment</p>
        <p className="id-mono text-lg">{appointmentId}</p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-paper rounded-xl border border-sage-light shadow-warm-xs">
          <QRCodeSVG
            value={qrValue || appointmentId}
            size={128}
            bgColor="#FAF6EE"
            fgColor="#10261F"
            level="M"
          />
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <p><span className="text-ink-soft">Patient:</span> <span className="font-medium text-ink">{patientName}</span></p>
        <p><span className="text-ink-soft">Date:</span> <span className="font-medium text-ink">{date}</span></p>
        <p><span className="text-ink-soft">Time:</span> <span className="font-medium text-ink">{time}</span></p>
        <p><span className="text-ink-soft">Doctor:</span> <span className="font-medium text-ink">{doctor}</span></p>
        <p><span className="text-ink-soft">Dept:</span> <span className="font-medium text-ink">{department}</span></p>
      </div>
      
      <p className="text-center text-xs text-ink-soft mt-4 pt-4 border-t border-sage-light">
        Show this QR at reception for quick check-in
      </p>
    </div>
  );
}

