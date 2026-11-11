// Main App Router
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { RelifSpinner } from '@/components/ui';

// ── Eagerly loaded primary navigation pages (instant top-nav switching) ───
import { LandingPage } from '@/pages/public/LandingPage';
import { DepartmentsPage } from '@/pages/public/DepartmentsPage';
import { DepartmentDetailPage } from '@/pages/public/DepartmentDetailPage';
import { DoctorsPage } from '@/pages/public/DoctorsPage';
import { DoctorProfilePage } from '@/pages/public/DoctorProfilePage';
import { CoEPage } from '@/pages/public/CoEPage';
import { TreatmentsPage } from '@/pages/public/TreatmentsPage';
import { DiagnosticsPage } from '@/pages/public/DiagnosticsPage';
import { HealthLibraryPage } from '@/pages/public/HealthLibraryPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { EmergencyPage } from '@/pages/public/EmergencyPage';
import { BranchesPage } from '@/pages/public/BranchesPage';

// ── Lazy-loaded secondary public pages ────────────────────────────────────
const InsurancePage        = lazy(() => import('@/pages/public/InsurancePage').then(m => ({ default: m.InsurancePage })));
const FacilitiesPage       = lazy(() => import('@/pages/public/FacilitiesPage').then(m => ({ default: m.FacilitiesPage })));
const CareersPage          = lazy(() => import('@/pages/public/CareersPage').then(m => ({ default: m.CareersPage })));
const FAQsPage             = lazy(() => import('@/pages/public/FAQsPage').then(m => ({ default: m.FAQsPage })));
const LegalPage            = lazy(() => import('@/pages/public/LegalPage').then(m => ({ default: m.LegalPage })));
const GalleryPage          = lazy(() => import('@/pages/public/GalleryPage').then(m => ({ default: m.GalleryPage })));
const PharmacyPage         = lazy(() => import('@/pages/public/PharmacyPage').then(m => ({ default: m.PharmacyPage })));
const InternationalPage    = lazy(() => import('@/pages/public/InternationalPage').then(m => ({ default: m.InternationalPage })));
const VisitorInfoPage      = lazy(() => import('@/pages/public/VisitorInfoPage').then(m => ({ default: m.VisitorInfoPage })));
const DesignSystemPage     = lazy(() => import('@/pages/public/DesignSystemPage').then(m => ({ default: m.DesignSystemPage })));

// ── Booking ───────────────────────────────────────────────────────────────
const BookingWizard = lazy(() => import('@/pages/booking/BookingWizard').then(m => ({ default: m.BookingWizard })));

// ── Auth ──────────────────────────────────────────────────────────────────
const LoginPage         = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage      = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage= lazy(() => import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));

// ── Patient portal ────────────────────────────────────────────────────────
const PatientDashboard    = lazy(() => import('@/pages/patient/PatientDashboard').then(m => ({ default: m.PatientDashboard })));
const PatientAppointments = lazy(() => import('@/pages/patient/PatientAppointments').then(m => ({ default: m.PatientAppointments })));
const PatientRecords      = lazy(() => import('@/pages/patient/PatientRecords').then(m => ({ default: m.PatientRecords })));
const PatientBilling      = lazy(() => import('@/pages/patient/PatientBilling').then(m => ({ default: m.PatientBilling })));
const PatientProfile      = lazy(() => import('@/pages/patient/PatientProfile').then(m => ({ default: m.PatientProfile })));

// ── Doctor portal ─────────────────────────────────────────────────────────
const DoctorDashboard  = lazy(() => import('@/pages/doctor/DoctorDashboard').then(m => ({ default: m.DoctorDashboard })));
const DoctorSchedule   = lazy(() => import('@/pages/doctor/DoctorSchedule').then(m => ({ default: m.DoctorSchedule })));

// ── Reception portal ──────────────────────────────────────────────────────
const ReceptionDashboard = lazy(() => import('@/pages/reception/ReceptionDashboard').then(m => ({ default: m.ReceptionDashboard })));

// ── Admin dashboard ───────────────────────────────────────────────────────
const AdminDashboard    = lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminDoctors      = lazy(() => import('@/pages/admin/AdminDoctors').then(m => ({ default: m.AdminDoctors })));
const AdminDepartments  = lazy(() => import('@/pages/admin/AdminDepartments').then(m => ({ default: m.AdminDepartments })));
const AdminAppointments = lazy(() => import('@/pages/admin/AdminAppointments').then(m => ({ default: m.AdminAppointments })));
const AdminPatients     = lazy(() => import('@/pages/admin/AdminPatients').then(m => ({ default: m.AdminPatients })));
const AdminAnalytics    = lazy(() => import('@/pages/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminSettings     = lazy(() => import('@/pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminCMS          = lazy(() => import('@/pages/admin/AdminCMS').then(m => ({ default: m.AdminCMS })));

// ── Layouts ───────────────────────────────────────────────────────────────
const PatientLayout    = lazy(() => import('@/layouts/PatientLayout').then(m => ({ default: m.PatientLayout })));
const DoctorLayout     = lazy(() => import('@/layouts/DoctorLayout').then(m => ({ default: m.DoctorLayout })));
const ReceptionLayout  = lazy(() => import('@/layouts/ReceptionLayout').then(m => ({ default: m.ReceptionLayout })));
const AdminLayout      = lazy(() => import('@/layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));

// ── Loading fallback ──────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="flex flex-col items-center gap-4">
        <RelifSpinner size="lg" className="text-verdigris" />
        <p className="text-sm text-ink-soft font-medium">Loading…</p>
      </div>
    </div>
  );
}

// ── 404 ───────────────────────────────────────────────────────────────────
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="text-center px-4">
        <p className="font-mono text-sm text-verdigris mb-2">404</p>
        <h1 className="font-display text-5xl font-bold text-ink mb-4">
          Page not found
        </h1>
        <p className="text-ink-soft mb-8">
          The page you're looking for doesn't exist or has moved.
        </p>
        <a href="/" className="btn btn-primary btn-md">
          Back to home
        </a>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public pages ── */}
          <Route element={<PublicLayout />}>
            <Route path="/"                            element={<LandingPage />} />
            <Route path="/departments"                 element={<DepartmentsPage />} />
            <Route path="/departments/:slug"           element={<DepartmentDetailPage />} />
            <Route path="/centres-of-excellence"       element={<CoEPage />} />
            <Route path="/centres-of-excellence/:slug" element={<CoEPage />} />
            <Route path="/doctors"                     element={<DoctorsPage />} />
            <Route path="/doctors/:slug"               element={<DoctorProfilePage />} />
            <Route path="/treatments"                  element={<TreatmentsPage />} />
            <Route path="/treatments/:slug"            element={<TreatmentsPage />} />
            <Route path="/facilities"                  element={<FacilitiesPage />} />
            <Route path="/gallery"                     element={<GalleryPage />} />
            <Route path="/branches"                    element={<BranchesPage />} />
            <Route path="/branches/:slug"              element={<BranchesPage />} />
            <Route path="/emergency"                   element={<EmergencyPage />} />
            <Route path="/insurance"                   element={<InsurancePage />} />
            <Route path="/diagnostics"                 element={<DiagnosticsPage />} />
            <Route path="/diagnostics/book"            element={<DiagnosticsPage />} />
            <Route path="/pharmacy"                    element={<PharmacyPage />} />
            <Route path="/international"               element={<InternationalPage />} />
            <Route path="/visitor-information"         element={<VisitorInfoPage />} />
            <Route path="/health-library"              element={<HealthLibraryPage />} />
            <Route path="/health-library/:slug"        element={<HealthLibraryPage />} />
            <Route path="/health-tools/:tool"          element={<HealthLibraryPage />} />
            <Route path="/about"                       element={<AboutPage />} />
            <Route path="/contact"                     element={<ContactPage />} />
            <Route path="/careers"                     element={<CareersPage />} />
            <Route path="/careers/:id"                 element={<CareersPage />} />
            <Route path="/legal/:page"                 element={<LegalPage />} />
            <Route path="/legal"                       element={<LegalPage />} />
            <Route path="/terms"                       element={<LegalPage />} />
            <Route path="/terms-of-use"                element={<LegalPage />} />
            <Route path="/terms-and-conditions"        element={<LegalPage />} />
            <Route path="/privacy"                     element={<LegalPage />} />
            <Route path="/privacy-policy"              element={<LegalPage />} />
            <Route path="/disclaimer"                  element={<LegalPage />} />
            <Route path="/patient-rights"              element={<LegalPage />} />
            <Route path="/grievance"                   element={<LegalPage />} />
            <Route path="/faqs"                        element={<FAQsPage />} />
            <Route path="/design-system"               element={<DesignSystemPage />} />
          </Route>

          {/* ── Booking wizard (standalone, no nav) ── */}
          <Route path="/book" element={<BookingWizard />} />

          {/* ── Auth ── */}
          <Route path="/login"                element={<Navigate to="/auth/login" replace />} />
          <Route path="/register"             element={<Navigate to="/auth/register" replace />} />
          <Route path="/auth/login"           element={<LoginPage />} />
          <Route path="/auth/register"        element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

          {/* ── Patient portal ── */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<Navigate to="/patient/dashboard" replace />} />
            <Route path="dashboard"    element={<PatientDashboard />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="records"      element={<PatientRecords />} />
            <Route path="billing"      element={<PatientBilling />} />
            <Route path="profile"      element={<PatientProfile />} />
          </Route>

          {/* ── Doctor portal ── */}
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route index element={<Navigate to="/doctor/dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="schedule"  element={<DoctorSchedule />} />
          </Route>

          {/* ── Reception ── */}
          <Route path="/reception" element={<ReceptionLayout />}>
            <Route index element={<Navigate to="/reception/dashboard" replace />} />
            <Route path="dashboard" element={<ReceptionDashboard />} />
          </Route>

          {/* ── Admin ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"    element={<AdminDashboard />} />
            <Route path="doctors"      element={<AdminDoctors />} />
            <Route path="departments"  element={<AdminDepartments />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="patients"     element={<AdminPatients />} />
            <Route path="analytics"    element={<AdminAnalytics />} />
            <Route path="settings"     element={<AdminSettings />} />
            <Route path="cms"          element={<AdminCMS />} />
          </Route>

          {/* ── 404 ── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
