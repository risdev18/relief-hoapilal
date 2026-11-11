// Patient Portal Layout — Authenticated Patient Shell backed by Supabase Session

import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, CreditCard, User, LogOut, Plus } from 'lucide-react';
import { cn } from '@/utils';
import { AuthService, PatientUser } from '@/services/authService';
import { ROUTES } from '@/config/constants';

const NAV = [
  { label: 'Dashboard',    href: '/patient/dashboard',    icon: LayoutDashboard },
  { label: 'Appointments', href: '/patient/appointments', icon: Calendar },
  { label: 'Records',      href: '/patient/records',      icon: FileText },
  { label: 'Billing',      href: '/patient/billing',      icon: CreditCard },
  { label: 'Profile',      href: '/patient/profile',      icon: User },
];

export function PatientLayout() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientUser | null>(() => AuthService.getActivePatient());
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    void AuthService.syncSession().then(u => {
      setPatient(u);
      setChecking(false);
    });
    const onAuth = () => setPatient(AuthService.getActivePatient());
    window.addEventListener('relif_auth_state_changed', onAuth);
    return () => window.removeEventListener('relif_auth_state_changed', onAuth);
  }, []);

  const handleLogout = async () => {
    await AuthService.logoutPatient();
    navigate(ROUTES.home);
  };

  if (!checking && !patient) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center p-6">
        <div className="card max-w-md w-full p-8 text-center space-y-5 bg-paper">
          <Link to={ROUTES.home} className="inline-flex items-baseline gap-1 font-display text-2xl font-bold text-ink">
            relif <span className="font-mono text-xs text-saffron uppercase">Care</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-ink">Sign in to access Patient Portal</h1>
          <p className="text-sm text-ink-soft">
            Your appointments, prescriptions, lab reports and GST receipts are protected per patient account.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link to={ROUTES.login} className="btn btn-primary btn-md justify-center">
              Sign In to Portal
            </Link>
            <Link to={ROUTES.register} className="btn btn-secondary btn-md justify-center">
              New Patient Registration
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone flex flex-col">
      <header className="bg-paper border-b border-sage-light sticky top-0 z-header">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <Link to={ROUTES.home} className="font-display font-bold text-lg text-ink">
              relif <span className="text-ink-soft font-sans font-normal text-sm">· patient</span>
            </Link>
            {patient && (
              <span className="hidden sm:inline-flex items-center text-xs font-mono font-medium text-verdigris-deep bg-mint px-2.5 py-0.5 rounded-full border border-verdigris/20">
                UHID: {patient.uhid}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to={ROUTES.book} className="btn btn-primary btn-sm hidden sm:inline-flex">
              <Plus size={14} /> Book Visit
            </Link>
            {patient && (
              <span className="text-xs font-semibold text-ink hidden md:inline">
                {patient.fullName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-bone transition-colors text-ink-soft hover:text-signal text-xs font-semibold border border-sage-light"
              aria-label="Logout"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="hidden md:flex flex-col w-56 bg-paper border-r border-sage-light p-3 gap-1 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto" aria-label="Patient navigation">
          {NAV.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-mint text-verdigris-deep font-semibold shadow-xs'
                  : 'text-ink-soft hover:bg-bone hover:text-ink'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-paper border-t border-sage-light flex z-drawer" aria-label="Mobile patient navigation">
        {NAV.map(item => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => cn(
              'flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors',
              isActive ? 'text-verdigris font-semibold' : 'text-ink-soft'
            )}
          >
            <item.icon size={18} />
            <span className="text-[11px]">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
