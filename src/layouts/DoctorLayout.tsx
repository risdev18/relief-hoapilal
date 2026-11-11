// Doctor Portal Layout
import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, LogOut, Bell } from 'lucide-react';
import { cn } from '@/utils';

const NAV = [
  { label: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
  { label: 'Schedule',  href: '/doctor/schedule',  icon: Calendar },
  { label: 'Patients',  href: '/doctor/patients',  icon: Users },
];

export function DoctorLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bone)' }}>
      <header className="bg-paper border-b border-sage-light sticky top-0 z-header">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <Link to="/" className="font-display font-semibold text-lg text-ink">
            relif <span className="text-ink-soft font-sans font-normal text-sm">· doctor</span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-bone transition-colors" aria-label="Notifications">
              <Bell size={18} className="text-ink-soft" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-signal" />
            </button>
            <button className="p-2 rounded-lg hover:bg-bone transition-colors text-ink-soft" aria-label="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <nav className="hidden md:flex flex-col w-56 bg-paper border-r border-sage-light p-3 gap-1 sticky top-14 h-[calc(100vh-3.5rem)]" aria-label="Doctor navigation">
          {NAV.map(item => (
            <NavLink key={item.href} to={item.href}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive ? 'bg-mint text-verdigris-deep' : 'text-ink-soft hover:bg-bone hover:text-ink'
              )}>
              <item.icon size={18} />{item.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 overflow-auto p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}

