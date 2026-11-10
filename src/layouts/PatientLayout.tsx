// Patient Portal Layout
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, CreditCard, User, LogOut, ChevronRight, Bell } from 'lucide-react';
import { DemoBanner } from '@/components/layout/DemoBanner';
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
  const [patient, setPatient] = useState<PatientUser | null>(null);

  useEffect(() => {
    setPatient(AuthService.getActivePatient());
  }, []);

  const handleLogout = async () => {
    await AuthService.logoutPatient();
    navigate(ROUTES.home);
  };

  return (
    <div className="min-h-screen bg-bone flex flex-col">
      <DemoBanner />
      {/* Top bar */}
      <header className="bg-paper border-b border-sage-light sticky top-0 z-header">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display font-semibold text-lg text-ink">
              relif <span className="text-ink-soft font-sans font-normal text-sm">· patient</span>
            </Link>
            {patient && (
              <span className="hidden sm:inline-flex items-center text-xs font-mono font-medium text-verdigris bg-mint px-2 py-0.5 rounded-full border border-verdigris/20">
                UHID: {patient.uhid}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {patient && (
              <span className="text-xs font-semibold text-ink hidden md:inline">
                {patient.fullName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1 rounded-full hover:bg-bone transition-colors text-ink-soft hover:text-signal text-xs font-semibold border border-transparent hover:border-signal/30"
              aria-label="Logout"
              title="Sign Out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — desktop */}
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

        {/* Main content */}
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
              isActive ? 'text-verdigris font-bold' : 'text-ink-soft'
            )}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
