import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Users, Stethoscope, MessageSquare, TrendingUp,
  Activity, Clock, CheckCircle, AlertCircle, ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { cn, formatCurrency, getStatusLabel, getStatusColor } from '@/utils';
import { DemoBadge, Badge, StatCard } from '@/components/ui';

// ─── Types ───────────────────────────────────────────────────────────────────
interface KPICard {
  label: string;
  value: string;
  sparkline: number[];
  icon: React.ReactNode;
  trend: string;
  trendPositive: boolean;
}

interface RecentAppointment {
  id: string;
  patient: string;
  doctor: string;
  dept: string;
  time: string;
  status: string;
}

interface DoctorAvail {
  name: string;
  specialty: string;
  seen: number;
  remaining: number;
  available: boolean;
}

interface PendingTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
}

// ─── Demo Data ─────────────────────────────────────────────────────────────
const WEEK_APPOINTMENTS = [
  { day: 'Mon', count: 42 },
  { day: 'Tue', count: 38 },
  { day: 'Wed', count: 51 },
  { day: 'Thu', count: 45 },
  { day: 'Fri', count: 47 },
  { day: 'Sat', count: 29 },
  { day: 'Sun', count: 12 },
];

const DEPT_PIE_DATA = [
  { name: 'Cardiology',       value: 12, color: '#1F7A6B' },
  { name: 'Neurology',        value: 8,  color: '#F0A22E' },
  { name: 'Orthopedics',      value: 7,  color: '#E7C9A9' },
  { name: 'Pediatrics',       value: 10, color: '#8FB5A3' },
  { name: 'General Medicine', value: 10, color: '#CFE6DB' },
];

const RECENT_APPOINTMENTS: RecentAppointment[] = [
  { id: 'REL-2026-000234', patient: 'Rahul V.',     doctor: 'Dr. Sharma',  dept: 'Cardiology',  time: '9:00 AM',  status: 'completed'      },
  { id: 'REL-2026-000235', patient: 'Priya M.',     doctor: 'Dr. Kapoor',  dept: 'Neurology',   time: '9:15 AM',  status: 'completed'      },
  { id: 'REL-2026-000236', patient: 'Ankit S.',     doctor: 'Dr. Patel',   dept: 'Orthopedics', time: '9:30 AM',  status: 'completed'      },
  { id: 'REL-2026-000237', patient: 'Meera D.',     doctor: 'Dr. Sharma',  dept: 'Cardiology',  time: '10:00 AM', status: 'in_consultation'},
  { id: 'REL-2026-000238', patient: 'Sanjay K.',    doctor: 'Dr. Verma',   dept: 'Pediatrics',  time: '10:15 AM', status: 'checked_in'     },
  { id: 'REL-2026-000239', patient: 'Fatima A.',    doctor: 'Dr. Kapoor',  dept: 'Neurology',   time: '10:30 AM', status: 'booked'         },
  { id: 'REL-2026-000240', patient: 'Rohan G.',     doctor: 'Dr. Joshi',   dept: 'ENT',         time: '10:45 AM', status: 'booked'         },
  { id: 'REL-2026-000241', patient: 'Lata T.',      doctor: 'Dr. Sharma',  dept: 'Cardiology',  time: '11:00 AM', status: 'booked'         },
  { id: 'REL-2026-000242', patient: 'Nikhil P.',    doctor: 'Dr. Patel',   dept: 'Orthopedics', time: '11:15 AM', status: 'cancelled'      },
  { id: 'REL-2026-000243', patient: 'Kavya R.',     doctor: 'Dr. Nair',    dept: 'Gynecology',  time: '11:30 AM', status: 'no_show'        },
];

const DOCTOR_AVAIL: DoctorAvail[] = [
  { name: 'Dr. Sharma',  specialty: 'Cardiology',       seen: 6,  remaining: 4, available: true  },
  { name: 'Dr. Kapoor',  specialty: 'Neurology',        seen: 5,  remaining: 3, available: true  },
  { name: 'Dr. Patel',   specialty: 'Orthopedics',      seen: 4,  remaining: 5, available: true  },
  { name: 'Dr. Verma',   specialty: 'Pediatrics',       seen: 7,  remaining: 2, available: true  },
  { name: 'Dr. Joshi',   specialty: 'ENT',              seen: 3,  remaining: 1, available: false  },
  { name: 'Dr. Nair',    specialty: 'Gynecology',       seen: 4,  remaining: 2, available: true  },
];

const PENDING_TASKS: PendingTask[] = [
  { id: 't1', title: 'Approve Dr. Sharma leave request (Nov 20–21)',  priority: 'high'   },
  { id: 't2', title: 'Respond to patient enquiry #ENQ-089',            priority: 'high'   },
  { id: 't3', title: 'Review and publish Cardiology department page',   priority: 'medium' },
  { id: 't4', title: 'Update Dr. Kapoor schedule for December',        priority: 'medium' },
  { id: 't5', title: 'Review testimonials pending moderation (3)',     priority: 'low'    },
];

// ─── Inline Sparkline SVG ─────────────────────────────────────────────────
function Sparkline({ data, color = '#1F7A6B' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 80;
  const H = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="opacity-60">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Big KPI Card ─────────────────────────────────────────────────────────
function KPICard({ label, value, sparkline, icon, trend, trendPositive }: KPICard) {
  return (
    <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-verdigris">
          {icon}
          <span className="text-xs text-ink-soft font-medium">{label}</span>
        </div>
        <DemoBadge />
      </div>
      <div className="flex items-end justify-between">
        <span className="font-display text-3xl font-bold text-ink leading-none">{value}</span>
        <Sparkline data={sparkline} />
      </div>
      <p className={cn('text-xs font-medium', trendPositive ? 'text-verdigris' : 'text-signal')}>
        {trendPositive ? '↑' : '↓'} {trend}
      </p>
    </div>
  );
}

function PriorityChip({ priority }: { priority: PendingTask['priority'] }) {
  const map = {
    high:   'bg-[var(--signal-light)] text-[var(--signal-deep)] border border-[var(--signal-light)]',
    medium: 'bg-[var(--saffron-light)] text-[var(--saffron-deep)] border border-[var(--clay)]',
    low:    'bg-mint text-verdigris-deep border border-sage',
  };
  return <span className={cn('text-xs font-medium px-2 py-0.5 rounded-pill capitalize', map[priority])}>{priority}</span>;
}

// ─── Custom Tooltip for recharts ──────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-night text-[#E8F4EF] rounded-lg px-3 py-2 text-xs shadow-warm-lg">
      <p className="font-semibold">{label}</p>
      <p className="text-sage">{payload[0].value} appointments</p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-paper p-6">
      <div className="max-w-screen-xl mx-auto space-y-6">

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-semibold text-ink">Overview</h1>
              <DemoBadge />
            </div>
            <p className="text-ink-soft text-sm mt-1 font-mono">Monday, 10 November 2026</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-soft">Last updated</p>
            <p className="text-sm font-mono text-ink">10:30 AM</p>
          </div>
        </motion.div>

        {/* KPI Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <KPICard
            label="Appointments Today"
            value="47"
            sparkline={[30, 38, 42, 35, 47, 44, 47]}
            icon={<Calendar size={16} />}
            trend="+12% vs yesterday"
            trendPositive
          />
          <KPICard
            label="Active Patients"
            value="1,842"
            sparkline={[1700, 1750, 1780, 1800, 1830, 1842, 1842]}
            icon={<Users size={16} />}
            trend="+24 this week"
            trendPositive
          />
          <KPICard
            label="Doctors on Duty"
            value="12"
            sparkline={[10, 11, 12, 10, 12, 11, 12]}
            icon={<Stethoscope size={16} />}
            trend="of 18 total"
            trendPositive
          />
          <KPICard
            label="Pending Enquiries"
            value="8"
            sparkline={[5, 7, 6, 9, 8, 10, 8]}
            icon={<MessageSquare size={16} />}
            trend="+3 since morning"
            trendPositive={false}
          />
          <KPICard
            label="Today's Revenue"
            value="₹1,24,500"
            sparkline={[80000, 95000, 110000, 105000, 118000, 124500, 124500]}
            icon={<TrendingUp size={16} />}
            trend="+8% vs target"
            trendPositive
          />
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Bar chart: Appointments this week */}
          <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-ink">Appointments this week</h3>
              <DemoBadge />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={WEEK_APPOINTMENTS} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#3E5249' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B8077' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" fill="#1F7A6B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart: Department-wise */}
          <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-ink">Department-wise today</h3>
              <DemoBadge />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={DEPT_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {DEPT_PIE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: '#3E5249', fontSize: 11 }}>{value}</span>}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [`${value} appts`, name]}
                  contentStyle={{ background: '#0B1F1B', border: 'none', borderRadius: 8, color: '#E8F4EF', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent appointments table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-paper rounded-xl border border-sage-light shadow-warm overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-sage-light">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-verdigris" />
              <h2 className="font-display text-lg font-semibold text-ink">Recent Activity</h2>
            </div>
            <DemoBadge />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bone border-b border-sage-light">
                  {['ID', 'Patient', 'Doctor', 'Dept', 'Time', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink-soft uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_APPOINTMENTS.map((appt, i) => (
                  <tr key={appt.id} className={cn('border-b border-sage-light hover:bg-bone transition-colors', i % 2 === 0 ? '' : 'bg-paper')}>
                    <td className="px-4 py-3 font-mono text-xs text-verdigris">{appt.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-ink">{appt.patient}</td>
                    <td className="px-4 py-3 text-sm text-ink-soft">{appt.doctor}</td>
                    <td className="px-4 py-3 text-sm text-ink-soft">{appt.dept}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-soft">{appt.time}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-medium px-2.5 py-1 rounded-pill', getStatusColor(appt.status))}>
                        {getStatusLabel(appt.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Bottom panels */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Doctor availability */}
          <div className="bg-paper rounded-xl border border-sage-light shadow-warm">
            <div className="flex items-center gap-2 p-5 border-b border-sage-light">
              <Stethoscope size={18} className="text-verdigris" />
              <h3 className="font-display text-base font-semibold text-ink">Doctor Availability Today</h3>
            </div>
            <div className="p-4 space-y-3">
              {DOCTOR_AVAIL.map(doc => (
                <div key={doc.name} className="flex items-center gap-3 py-2 border-b border-sage-light last:border-0">
                  <span className={cn('w-2 h-2 rounded-full flex-shrink-0', doc.available ? 'bg-mint' : 'bg-sage')} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">{doc.name}</p>
                    <p className="text-xs text-ink-soft">{doc.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-soft font-mono">{doc.seen} seen / {doc.remaining} left</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending tasks */}
          <div className="bg-paper rounded-xl border border-sage-light shadow-warm">
            <div className="flex items-center gap-2 p-5 border-b border-sage-light">
              <CheckCircle size={18} className="text-verdigris" />
              <h3 className="font-display text-base font-semibold text-ink">Pending Tasks</h3>
            </div>
            <div className="p-4 space-y-2">
              {PENDING_TASKS.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-sage-light bg-bone hover:border-verdigris transition-colors cursor-pointer"
                >
                  <AlertCircle size={14} className={cn(
                    task.priority === 'high' ? 'text-signal' :
                    task.priority === 'medium' ? 'text-[var(--saffron-deep)]' : 'text-sage'
                  )} />
                  <span className="flex-1 text-sm text-ink">{task.title}</span>
                  <PriorityChip priority={task.priority} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
