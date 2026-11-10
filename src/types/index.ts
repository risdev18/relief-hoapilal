// Core TypeScript types for Relif Hospital

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  timings: { day: string; hours: string }[];
  isOpen24x7: boolean;
  coordinates: { lat: number; lng: number };
  departments: string[]; // department IDs
  facilities: string[];
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  imageUrl?: string;
  conditions: string[];
  procedures: string[];
  equipment: string[];
  doctorIds: string[];
  branchIds: string[];
  order: number;
  isActive: boolean;
  faqs?: FAQ[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id: string;
  uid?: string; // Firebase Auth UID
  name: string;
  slug: string;
  title: string; // Dr., Prof., etc.
  qualifications: string[];
  specialty: string;
  subSpecialty?: string;
  departmentId: string;
  branchIds: string[];
  bio: string;
  experience: number; // years
  languages: string[];
  consultationTypes: ('in-person' | 'video')[];
  photoUrl?: string;
  medicalRegistrationNumber?: string;
  registrationVerified: boolean;
  treatments: string[];
  rating?: number;
  reviewCount?: number;
  isAvailableToday: boolean;
  nextAvailableSlot?: string; // ISO datetime
  isActive: boolean;
  isOnLeave: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  branchId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  slotDurationMinutes: number;
  capacity: number; // per slot
  breaks: { startTime: string; endTime: string }[];
  isActive: boolean;
}

export interface DoctorLeave {
  id: string;
  doctorId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface Patient {
  id: string;
  uid: string; // Firebase Auth UID
  uhid: string; // Unique Hospital ID
  name: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone: string;
  email: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  bloodGroup?: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  familyProfileIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyProfile {
  id: string;
  primaryPatientId: string;
  name: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  relation: string;
  bloodGroup?: string;
  consentGrantedAt: Date;
}

export interface Appointment {
  id: string;
  appointmentId: string; // REL-2026-000123
  patientId: string;
  doctorId: string;
  departmentId: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  slot: string; // "10:00"
  consultationType: 'in-person' | 'video';
  status: AppointmentStatus;
  statusHistory: { status: AppointmentStatus; at: Date; by: string }[];
  notes?: string;
  visitReason?: string;
  isNewPatient: boolean;
  videoMeetingLink?: string;
  invoiceId?: string;
  queueTokenId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentStatus =
  | 'booked'
  | 'confirmed'
  | 'checked_in'
  | 'in_consultation'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export interface QueueToken {
  id: string;
  tokenNumber: number;
  displayToken: string; // "C-014"
  appointmentId: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  branchId: string;
  date: string;
  position: number;
  estimatedWaitMinutes: number;
  status: 'waiting' | 'called' | 'in_consultation' | 'completed' | 'no_show';
  checkedInAt?: Date;
  calledAt?: Date;
  createdAt: Date;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: 'report' | 'prescription' | 'discharge_summary' | 'vaccination' | 'document';
  title: string;
  description?: string;
  date: Date;
  doctorId?: string;
  appointmentId?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  isConfidential: boolean;
  accessibleTo: string[]; // doctorIds
  uploadedBy: string; // userId
  createdAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // INV-2026-000123
  patientId: string;
  appointmentId?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'partially_paid' | 'cancelled' | 'refunded';
  paymentId?: string;
  paidAt?: Date;
  dueDate: Date;
  createdAt: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: 'consultation' | 'lab' | 'radiology' | 'pharmacy' | 'room' | 'procedure' | 'other';
}

export interface Payment {
  id: string;
  invoiceId: string;
  patientId: string;
  amount: number;
  currency: string;
  status: 'created' | 'pending' | 'captured' | 'failed' | 'refunded';
  provider: 'razorpay' | 'payu' | 'manual';
  providerOrderId?: string;
  providerPaymentId?: string;
  providerSignature?: string;
  isVerified: boolean; // only true after server-side webhook verification
  method?: string;
  createdAt: Date;
  verifiedAt?: Date;
}

export interface HealthPackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number;
  tests: string[]; // labTestIds
  targetGender?: 'male' | 'female' | 'all';
  ageRange?: { min: number; max: number };
  imageUrl?: string;
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface LabTest {
  id: string;
  name: string;
  slug: string;
  description: string;
  preparation: string;
  sampleType: string;
  turnaroundHours: number;
  price?: number;
  category: string;
  tags: string[];
  isActive: boolean;
}

export interface LabBooking {
  id: string;
  bookingId: string;
  patientId: string;
  testIds: string[];
  healthPackageId?: string;
  branchId: string;
  date: string;
  slot: string;
  status: 'booked' | 'sample_collected' | 'processing' | 'ready' | 'cancelled';
  reportIds: string[];
  invoiceId?: string;
  createdAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  departmentId?: string;
  order: number;
  isPublished: boolean;
}

export interface Testimonial {
  id: string;
  patientName: string; // anonymized or consented
  rating: number;
  serviceRating: number;
  facilityRating: number;
  doctorRating: number;
  comment: string;
  departmentId?: string;
  doctorId?: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
  isDemo: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  authorId: string; // doctorId
  authorName: string;
  departmentId?: string;
  categories: string[];
  tags: string[];
  readingTimeMinutes: number;
  isDoctorReviewed: boolean;
  reviewedById?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobListing {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  branchId: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  category: 'clinical' | 'nursing' | 'admin' | 'tech' | 'other';
  description: string;
  requirements: string[];
  responsibilities: string[];
  experience?: { min: number; max: number };
  isActive: boolean;
  postedAt: Date;
  deadline?: Date;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  type: 'general' | 'appointment' | 'international' | 'insurance' | 'complaint' | 'feedback';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  branchId?: string;
  departmentId?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface Notification {
  id: string;
  recipientId: string;
  type: 'appointment_confirmation' | 'appointment_reminder' | 'queue_call' | 'report_ready' | 'payment_receipt' | 'general';
  channel: 'email' | 'sms' | 'whatsapp' | 'push';
  subject?: string;
  body: string;
  status: 'pending' | 'simulated' | 'sent' | 'failed';
  isSimulated: boolean; // always true in demo mode
  sentAt?: Date;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  userRole: string;
  action: string;
  entity: string;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  patientId?: string;
  doctorId?: string;
  branchIds?: string[];
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

// UI Types
export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

