// Application configuration constants
// All secrets are in environment variables — never hardcode secret keys here

export const APP_CONFIG = {
  name: 'Relif Care Multispecialty',
  shortName: 'Relif Care',
  tagline: 'Care that feels like relief.',
  version: '2.0.0',

  // Emergency & hospital contact numbers
  emergencyNumber: import.meta.env.VITE_EMERGENCY_NUMBER || '+91 22 6900 1066',
  ambulanceNumber: import.meta.env.VITE_AMBULANCE_NUMBER || '+91 22 6900 1088',
  supportEmail: 'care@relifcare.in',

  // Branches
  defaultBranchSlug: 'andheri',

  // Appointment & refund policy rules
  appointmentIdPrefix: 'REL',
  maxAdvanceBookingDays: 14,
  fullRefundHours: 24,
  halfRefundHours: 2,
  rescheduleCutoffHours: 4,

  // Queue settings
  avgConsultationMinutes: 15,
  sessionTimeoutMinutes: 60,
} as const;

export const ROUTES = {
  home: '/',
  departments: '/departments',
  department: (slug: string) => `/departments/${slug}`,
  coe: '/centres-of-excellence',
  coeDetail: (slug: string) => `/centres-of-excellence/${slug}`,
  doctors: '/doctors',
  doctor: (slug: string) => `/doctors/${slug}`,
  treatments: '/treatments',
  treatment: (slug: string) => `/treatments/${slug}`,
  facilities: '/facilities',
  gallery: '/gallery',
  branches: '/branches',
  branch: (slug: string) => `/branches/${slug}`,
  emergency: '/emergency',
  insurance: '/insurance',
  diagnostics: '/diagnostics',
  diagnosticsBook: '/diagnostics/book',
  pharmacy: '/pharmacy',
  international: '/international',
  visitorInfo: '/visitor-information',
  healthLibrary: '/health-library',
  healthArticle: (slug: string) => `/health-library/${slug}`,
  healthTool: (tool: string) => `/health-tools/${tool}`,
  about: '/about',
  contact: '/contact',
  careers: '/careers',
  legal: (page: string) => `/legal/${page}`,
  faqs: '/faqs',
  designSystem: '/design-system',
  book: '/book',

  // Auth
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',

  // Patient portal
  patientDashboard: '/patient/dashboard',
  patientAppointments: '/patient/appointments',
  patientRecords: '/patient/records',
  patientBilling: '/patient/billing',
  patientProfile: '/patient/profile',

  // Doctor portal
  doctorDashboard: '/doctor/dashboard',
  doctorSchedule: '/doctor/schedule',

  // Reception
  receptionDashboard: '/reception/dashboard',

  // Admin
  adminDashboard: '/admin/dashboard',
  adminDoctors: '/admin/doctors',
  adminDepartments: '/admin/departments',
  adminAppointments: '/admin/appointments',
  adminPatients: '/admin/patients',
  adminAnalytics: '/admin/analytics',
  adminSettings: '/admin/settings',
  adminCMS: '/admin/cms',
} as const;

export const DEPARTMENTS = [
  { id: 'cardiology',       name: 'Cardiology',              slug: 'cardiology',       icon: 'Heart' },
  { id: 'neurology',        name: 'Neurology',               slug: 'neurology',        icon: 'Brain' },
  { id: 'orthopedics',      name: 'Orthopedics',             slug: 'orthopedics',      icon: 'Bone' },
  { id: 'pediatrics',       name: 'Pediatrics',              slug: 'pediatrics',       icon: 'Baby' },
  { id: 'gynecology',       name: 'Gynecology & Obstetrics', slug: 'gynecology',       icon: 'HeartHandshake' },
  { id: 'dermatology',      name: 'Dermatology',             slug: 'dermatology',      icon: 'Sparkles' },
  { id: 'general-medicine', name: 'General Medicine',        slug: 'general-medicine', icon: 'Stethoscope' },
  { id: 'ophthalmology',    name: 'Ophthalmology',           slug: 'ophthalmology',    icon: 'Eye' },
] as const;

export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'हिं', name: 'Hindi' },
  { code: 'mr', label: 'मरा', name: 'Marathi' },
] as const;

export const USER_ROLES = {
  ADMIN:        'admin',
  DOCTOR:       'doctor',
  RECEPTIONIST: 'reception',
  PATIENT:      'patient',
} as const;

export const APPOINTMENT_STATUS = {
  BOOKED:      'booked',
  CONFIRMED:   'confirmed',
  CHECKED_IN:  'checked_in',
  COMPLETED:   'completed',
  CANCELLED:   'cancelled',
  RESCHEDULED: 'rescheduled',
} as const;

export const QUEUE_STATUS = {
  WAITING:         'waiting',
  CALLED:          'called',
  IN_CONSULTATION: 'in_consultation',
  COMPLETED:       'completed',
  NO_SHOW:         'no_show',
} as const;
