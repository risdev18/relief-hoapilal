// Reception Portal Layout
import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Monitor, UserPlus, Calendar, LogOut } from 'lucide-react';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { cn } from '@/utils';

const NAV = [
  { label: 'Queue Board', href: '/reception/dashboard', icon: Monitor },
  { label: 'Register',    href: '/reception/register',  icon: UserPlus },
  { label: 'Appointments',href: '/reception/appointments', icon: Calendar },
];

export function ReceptionLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bone">
      <DemoBanner />
      <header className="bg-paper border-b border-sage-light sticky top-0 z-header">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <Link to="/" className="font-display font-semibold text-lg text-ink">
            relif <span className="text-ink-soft font-sans font-normal text-sm">· reception</span>
          </Link>
          <button className="p-2 rounded-lg hover:bg-bone transition-colors text-ink-soft" aria-label="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <div className="flex flex-1">
        <nav className="hidden md:flex flex-col w-56 bg-paper border-r border-sage-light p-3 gap-1 sticky top-14 h-[calc(100vh-3.5rem)]">
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

