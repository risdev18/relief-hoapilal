// Admin Dashboard Layout — Role-guarded (role === 'admin'), collapsible sidebar
import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Stethoscope, Building2, Calendar,
  BarChart2, Settings, LogOut, Menu, X, Globe, ShieldAlert, ArrowLeft
} from 'lucide-react';
import { AuthService, type PatientUser } from '@/services/authService';
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
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<PatientUser | null>(null);

  useEffect(() => {
    let mounted = true;
    AuthService.syncSession().then((sessionUser) => {
      if (!mounted) return;
      if (!sessionUser) {
        navigate('/auth/login?redirect=/admin/dashboard', { replace: true });
        return;
      }
      setUser(sessionUser);
      setCheckingAuth(false);
    });
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    await AuthService.logoutPatient();
    navigate('/auth/login', { replace: true });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center p-6">
        <div className="bg-paper rounded-2xl border border-sage-light p-8 shadow-warm text-center max-w-sm w-full">
          <div className="w-8 h-8 rounded-full border-2 border-verdigris border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-ink-soft">Verifying administrator credentials…</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center p-6">
        <div className="bg-paper rounded-2xl border border-sage-light p-8 shadow-warm-lg max-w-lg w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[var(--signal-light)] text-[var(--signal-deep)] flex items-center justify-center mx-auto">
            <ShieldAlert size={24} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">Administrator Access Required</h1>
          <p className="text-sm text-ink-soft leading-relaxed">
            Signed in as <span className="font-medium text-ink">{user?.email || 'guest'}</span> (role:{' '}
            <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-bone">{user?.role || 'patient'}</span>).
            Only hospital staff with <span className="font-mono text-xs">admin</span> privileges may manage doctors, fees, slots, and patient schedules.
          </p>
          <div className="bg-bone rounded-xl p-3 text-left text-xs font-mono text-ink-soft border border-sage-light overflow-x-auto">
            UPDATE public.profiles SET role = 'admin' WHERE email = '{user?.email}';
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/patient/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-verdigris text-white text-sm font-medium hover:bg-verdigris-deep transition-colors"
            >
              <ArrowLeft size={14} /> Go to Patient Portal
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-pill border border-sage-light text-sm text-ink-soft hover:text-ink transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('min-h-screen flex flex-col', isDark ? 'dark' : '')}
      style={{ background: isDark ? 'var(--night)' : 'var(--bone)' }}
    >
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
          <span className="hidden sm:inline-block font-mono text-xs px-2.5 py-1 rounded-pill bg-mint text-verdigris-deep">
            {user.name} · Admin
          </span>
          <button
            onClick={() => setIsDark(d => !d)}
            className="text-xs font-mono px-3 py-1.5 rounded-pill border transition-colors"
            style={{ borderColor: 'var(--sage-light)', color: 'var(--ink-soft)' }}
          >
            {isDark ? '☀ Light' : '☾ Night'}
          </button>
          <Link
            to="/"
            className="text-xs font-medium px-3 py-1.5 rounded-pill border transition-colors"
            style={{ borderColor: 'var(--sage-light)', color: 'var(--ink-soft)' }}
          >
            Public site
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-ink-soft hover:bg-bone hover:text-signal transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Collapsible sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.nav
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 224, opacity: 1 }}
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
                  <p
                    className="font-mono text-xs font-medium tracking-widest uppercase px-3 mb-1"
                    style={{ color: 'var(--sage)' }}
                  >
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
