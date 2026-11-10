// Application configuration constants
// All secrets are in environment variables — never hardcode keys here

export const APP_CONFIG = {
  name: 'Relif Hospital',
  tagline: 'Care that feels like relief.',
  version: '1.0.0-demo',
  isDemoMode: import.meta.env.VITE_DEMO_MODE !== 'false',
  
  // Emergency contact (configurable — always labeled Demo)
  emergencyNumber: import.meta.env.VITE_EMERGENCY_NUMBER || '+91-XXXX-XXXXXX',
  ambulanceNumber: import.meta.env.VITE_AMBULANCE_NUMBER || '+91-XXXX-XXXXXX',
  
  // Branches
  defaultBranchId: 'branch-andheri',
  
  // Appointment ID format
  appointmentIdPrefix: 'REL',
  
  // Booking rules
  maxAdvanceBookingDays: 30,
  cancelCutoffHours: 2,
  rescheduleCutoffHours: 4,
  
  // Queue settings
  avgConsultationMinutes: 15,
  
  // Session
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
  career: (id: string) => `/careers/${id}`,
  legal: (page: string) => `/legal/${page}`,
  faqs: '/faqs',
  designSystem: '/design-system',
  demoGuide: '/demo-guide',
  
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  verifyOtp: '/auth/verify-otp',
  
  // Booking
  book: '/book',
  
  // Patient portal
  patientDashboard: '/patient/dashboard',
  patientAppointments: '/patient/appointments',
  patientRecords: '/patient/records',
  patientBilling: '/patient/billing',
  patientProfile: '/patient/profile',
  patientFamily: '/patient/family',
  
  // Doctor portal
  doctorDashboard: '/doctor/dashboard',
  doctorSchedule: '/doctor/schedule',
  doctorPatients: '/doctor/patients',
  
  // Reception portal
  receptionDashboard: '/reception/dashboard',
  receptionRegister: '/reception/register',
  
  // Admin
  adminDashboard: '/admin/dashboard',
  adminDoctors: '/admin/doctors',
  adminDepartments: '/admin/departments',
  adminAppointments: '/admin/appointments',
  adminPatients: '/admin/patients',
  adminCms: '/admin/cms',
  adminAnalytics: '/admin/analytics',
  adminSettings: '/admin/settings',
} as const;

export const DEPARTMENTS = [
  { id: 'cardiology',         name: 'Cardiology',          slug: 'cardiology',         icon: 'heart' },
  { id: 'neurology',          name: 'Neurology',           slug: 'neurology',          icon: 'brain' },
  { id: 'orthopedics',        name: 'Orthopedics',         slug: 'orthopedics',        icon: 'bone' },
  { id: 'oncology',           name: 'Oncology',            slug: 'oncology',           icon: 'ribbon' },
  { id: 'pediatrics',         name: 'Pediatrics',          slug: 'pediatrics',         icon: 'baby' },
  { id: 'gynecology',         name: 'Gynecology',          slug: 'gynecology',         icon: 'stethoscope' },
  { id: 'general-medicine',   name: 'General Medicine',    slug: 'general-medicine',   icon: 'pill' },
  { id: 'general-surgery',    name: 'General Surgery',     slug: 'general-surgery',    icon: 'scissors' },
  { id: 'gastroenterology',   name: 'Gastroenterology',    slug: 'gastroenterology',   icon: 'activity' },
  { id: 'dermatology',        name: 'Dermatology',         slug: 'dermatology',        icon: 'sun' },
  { id: 'ent',                name: 'ENT',                 slug: 'ent',                icon: 'ear' },
  { id: 'ophthalmology',      name: 'Ophthalmology',       slug: 'ophthalmology',      icon: 'eye' },
  { id: 'urology',            name: 'Urology',             slug: 'urology',            icon: 'droplet' },
  { id: 'nephrology',         name: 'Nephrology',          slug: 'nephrology',         icon: 'activity' },
  { id: 'pulmonology',        name: 'Pulmonology',         slug: 'pulmonology',        icon: 'wind' },
  { id: 'emergency-medicine', name: 'Emergency Medicine',  slug: 'emergency-medicine', icon: 'alert-circle' },
  { id: 'radiology',          name: 'Radiology',           slug: 'radiology',          icon: 'scan' },
  { id: 'physiotherapy',      name: 'Physiotherapy',       slug: 'physiotherapy',      icon: 'activity' },
  { id: 'dentistry',          name: 'Dentistry',           slug: 'dentistry',          icon: 'smile' },
  { id: 'critical-care',      name: 'Critical Care',       slug: 'critical-care',      icon: 'monitor' },
] as const;

export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'हिं', name: 'Hindi' },
  { code: 'mr', label: 'मरा', name: 'Marathi' },
] as const;

export const USER_ROLES = {
  SUPER_ADMIN:  'super_admin',
  ADMIN:        'admin',
  DOCTOR:       'doctor',
  RECEPTIONIST: 'receptionist',
  LAB_STAFF:    'lab_staff',
  HR_STAFF:     'hr_staff',
  MARKETING:    'marketing_staff',
  PATIENT:      'patient',
} as const;

export const APPOINTMENT_STATUS = {
  BOOKED:          'booked',
  CONFIRMED:       'confirmed',
  CHECKED_IN:      'checked_in',
  IN_CONSULTATION: 'in_consultation',
  COMPLETED:       'completed',
  CANCELLED:       'cancelled',
  NO_SHOW:         'no_show',
  RESCHEDULED:     'rescheduled',
} as const;

export const QUEUE_STATUS = {
  WAITING:        'waiting',
  CALLED:         'called',
  IN_CONSULTATION:'in_consultation',
  COMPLETED:      'completed',
  NO_SHOW:        'no_show',
} as const;

