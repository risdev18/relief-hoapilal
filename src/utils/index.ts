// Utility: class name merger (clsx + tailwind-merge)
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to display string
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', options ?? {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });
}

// Format time
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// Generate appointment ID
export function generateAppointmentId(sequential: number): string {
  const year = new Date().getFullYear();
  return `REL-${year}-${sequential.toString().padStart(6, '0')}`;
}

// Generate UHID
export function generateUHID(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `RH${year}${random}`;
}

// Slugify string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '…';
}

// Get initials
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

// Format currency (INR)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Calculate reading time
export function readingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Demo data label check
export function isDemoData(): boolean {
  return import.meta.env.VITE_DEMO_MODE !== 'false';
}

// Wait helper
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get status color class
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    booked:          'chip',
    confirmed:       'chip',
    checked_in:      'chip-saffron',
    in_consultation: 'chip-saffron',
    completed:       'bg-mint text-verdigris-deep border-sage-light',
    cancelled:       'chip-signal',
    no_show:         'chip-signal',
    rescheduled:     'chip',
    waiting:         'chip',
    called:          'chip-saffron',
  };
  return map[status] || 'chip';
}

// Get status display label
export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    booked:          'Booked',
    confirmed:       'Confirmed',
    checked_in:      'Checked In',
    in_consultation: 'In Consultation',
    completed:       'Completed',
    cancelled:       'Cancelled',
    no_show:         'No Show',
    rescheduled:     'Rescheduled',
    waiting:         'Waiting',
    called:          'Called',
  };
  return map[status] || status;
}

// Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

