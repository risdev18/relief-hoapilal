// Patient Portal Layout
import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, CreditCard, User, LogOut, ChevronRight, Bell } from 'lucide-react';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { cn } from '@/utils';

const NAV = [
  { label: 'Dashboard',    href: '/patient/dashboard',    icon: LayoutDashboard },
  { label: 'Appointments', href: '/patient/appointments', icon: Calendar },
  { label: 'Records',      href: '/patient/records',      icon: FileText },
  { label: 'Billing',      href: '/patient/billing',      icon: CreditCard },
  { label: 'Profile',      href: '/patient/profile',      icon: User },
];

export function PatientLayout() {
  return (
    <div className="min-h-screen bg-bone flex flex-col">
      <DemoBanner />
      {/* Top bar */}
      <header className="bg-paper border-b border-sage-light sticky top-0 z-header">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <Link to="/" className="font-display font-semibold text-lg text-ink">
            relif <span className="text-ink-soft font-sans font-normal text-sm">· patient</span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-bone transition-colors" aria-label="Notifications">
              <Bell size={18} className="text-ink-soft" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-signal" />
            </button>
            <button className="p-2 rounded-lg hover:bg-bone transition-colors text-ink-soft hover:text-signal" aria-label="Logout">
              <LogOut size={18} />
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
                  ? 'bg-mint text-verdigris-deep'
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-paper border-t border-sage-light flex" aria-label="Mobile patient navigation">
        {NAV.map(item => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => cn(
              'flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors',
              isActive ? 'text-verdigris' : 'text-ink-soft'
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

