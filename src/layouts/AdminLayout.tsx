// Admin Dashboard Layout — Collapsible sidebar, dark mode optional
import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Stethoscope, Building2, Calendar,
  BarChart2, Settings, FileText, LogOut, Menu, X, Bell,
  ChevronDown, Package, FlaskConical, Heart, Briefcase,
  MessageSquare, Image, Globe
} from 'lucide-react';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { cn } from '@/utils';

const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { label: 'Dashboard',     href: '/admin/dashboard',    icon: LayoutDashboard },
      { label: 'Appointments',  href: '/admin/appointments', icon: Calendar },
      { label: 'Analytics',     href: '/admin/analytics',    icon: BarChart2 },
    ]
  },
  {
    label: 'People',
    items: [
      { label: 'Doctors',       href: '/admin/doctors',      icon: Stethoscope },
      { label: 'Patients',      href: '/admin/patients',     icon: Users },
    ]
  },
  {
    label: 'Content',
    items: [
      { label: 'Departments',   href: '/admin/departments',  icon: Building2 },
      { label: 'CMS',           href: '/admin/cms',          icon: Globe },
    ]
  },
  {
    label: 'Settings',
    items: [
      { label: 'Settings',      href: '/admin/settings',     icon: Settings },
    ]
  },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={cn('min-h-screen flex flex-col', isDark ? 'dark' : '')}
         style={{ background: isDark ? 'var(--night)' : 'var(--bone)' }}>
      <DemoBanner />

      {/* Top bar */}
      <header
        className="sticky top-0 z-header border-b flex items-center justify-between px-4 h-14"
        style={{
          background: isDark ? 'var(--night-soft)' : 'var(--paper)',
          borderColor: isDark ? 'var(--night-muted)' : 'var(--sage-light)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--ink-soft)' }}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="font-display font-semibold text-lg" style={{ color: 'var(--ink)' }}>
            relif <span className="font-sans font-normal text-sm" style={{ color: 'var(--ink-soft)' }}>· admin</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDark(d => !d)}
            className="text-xs font-mono px-3 py-1.5 rounded-pill border transition-colors"
            style={{ borderColor: 'var(--sage-light)', color: 'var(--ink-soft)' }}
          >
            {isDark ? '☀ Light' : '☽ Dark'}
          </button>
          <button className="relative p-2 rounded-lg transition-colors" style={{ color: 'var(--ink-soft)' }} aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-signal" />
          </button>
          <button className="p-2 rounded-lg transition-colors" style={{ color: 'var(--ink-soft)' }} aria-label="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.nav
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0 overflow-y-auto overflow-x-hidden border-r sticky top-14 h-[calc(100vh-3.5rem)] p-3"
              style={{
                background: isDark ? 'var(--night-soft)' : 'var(--paper)',
                borderColor: isDark ? 'var(--night-muted)' : 'var(--sage-light)',
              }}
              aria-label="Admin navigation"
            >
              {NAV_GROUPS.map(group => (
                <div key={group.label} className="mb-4">
                  <p className="font-mono text-xs font-medium tracking-widest uppercase px-3 mb-1"
                     style={{ color: 'var(--sage)' }}>
                    {group.label}
                  </p>
                  {group.items.map(item => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) => cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap mb-0.5',
                        isActive
                          ? 'bg-mint text-verdigris-deep'
                          : 'text-ink-soft hover:bg-bone hover:text-ink'
                      )}
                      style={({ isActive }) => ({
                        background: isActive ? 'var(--mint)' : undefined,
                        color: isActive ? 'var(--verdigris-deep)' : 'var(--ink-soft)',
                      })}
                    >
                      <item.icon size={17} className="flex-shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

