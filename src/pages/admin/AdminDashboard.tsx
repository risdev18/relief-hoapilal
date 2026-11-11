// Admin Dashboard Overview — Real-time Metrics & Activity Computed Strictly from Supabase
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Users, Stethoscope, TrendingUp,
  Activity, RefreshCw, IndianRupee
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Link } from 'react-router-dom';
import { SupabaseService, type SupabaseAppointmentRecord } from '@/services/supabaseService';
import type { MasterDoctor } from '@/data/masterCatalog';
import { Badge, Button, DoctorAvatar } from '@/components/ui';
import { cn, formatDate, formatINR } from '@/utils';

const PIE_COLORS = ['#1F7A6B', '#F0A22E', '#8FB5A3', '#CFE6DB', '#10261F', '#E7C9A9'];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-night text-[#E8F4EF] rounded-lg px-3 py-2 text-xs shadow-warm-lg">
      <p className="font-semibold">{label}</p>
      <p className="text-sage">{payload[0].value} appointments</p>
    </div>
  );
}

export function AdminDashboard() {
  const [appointments, setAppointments] = useState<SupabaseAppointmentRecord[]>([]);
  const [doctors, setDoctors] = useState<MasterDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const [appts, docs] = await Promise.all([
        SupabaseService.adminGetAllAppointments(),
        SupabaseService.getDoctors(true),
      ]);
      setAppointments(appts);
      setDoctors(docs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayAppts = appointments.filter(a => a.appointment_date === today && a.status !== 'cancelled');
    const uniquePatients = new Set(appointments.map(a => a.patient_id)).size;
    const paidRevenue = appointments
      .filter(a => a.payment_status === 'paid')
      .reduce((sum, a) => sum + Number(a.total_amount || 0), 0);
    const activeDocs = doctors.filter(d => d.isActive && d.availability === 'available').length;
    return {
      todayCount: todayAppts.length,
      totalBookings: appointments.length,
      uniquePatients,
      paidRevenue,
      activeDocs,
      totalDocs: doctors.length,
    };
  }, [appointments, doctors]);

  const weeklyChartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map = new Map(days.map(d => [d, 0]));
    appointments.forEach(a => {
      if (a.status === 'cancelled') return;
      const d = new Date(a.appointment_date);
      if (!Number.isNaN(d.getTime())) {
        const label = days[d.getDay()];
        map.set(label, (map.get(label) || 0) + 1);
      }
    });
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      count: map.get(day) || 0,
    }));
  }, [appointments]);

  const deptPieData = useMemo(() => {
    const counts = new Map<string, number>();
    appointments.forEach(a => {
      const dept = a.department_name || 'General';
      counts.set(dept, (counts.get(dept) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, value], i) => ({
      name,
      value,
      color: PIE_COLORS[i % PIE_COLORS.length],
    }));
  }, [appointments]);

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Hospital Overview</h1>
          <p className="text-ink-soft text-sm mt-1">
            Live clinical operations metrics synced from Supabase.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadOverview}
          leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
        >
          Refresh Metrics
        </Button>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5">
          <div className="flex items-center gap-2 text-verdigris text-xs font-medium mb-2">
            <Calendar size={16} /> Today&apos;s Appointments
          </div>
          <p className="font-display text-3xl font-bold text-ink">{stats.todayCount}</p>
          <p className="text-xs text-ink-soft mt-1">{stats.totalBookings} total recorded</p>
        </div>

        <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5">
          <div className="flex items-center gap-2 text-verdigris text-xs font-medium mb-2">
            <Users size={16} /> Active Patients
          </div>
          <p className="font-display text-3xl font-bold text-ink">{stats.uniquePatients}</p>
          <p className="text-xs text-ink-soft mt-1">Unique UHID bookings</p>
        </div>

        <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5">
          <div className="flex items-center gap-2 text-verdigris text-xs font-medium mb-2">
            <Stethoscope size={16} /> Specialists Available
          </div>
          <p className="font-display text-3xl font-bold text-ink">{stats.activeDocs}</p>
          <p className="text-xs text-ink-soft mt-1">of {stats.totalDocs} in master catalog</p>
        </div>

        <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5">
          <div className="flex items-center gap-2 text-verdigris text-xs font-medium mb-2">
            <IndianRupee size={16} /> Collected Online
          </div>
          <p className="font-display text-3xl font-bold text-ink">{formatINR(stats.paidRevenue)}</p>
          <p className="text-xs text-ink-soft mt-1">Verified Razorpay payments</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
              <TrendingUp size={16} className="text-verdigris" /> Bookings by Weekday
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#3E5249' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6B8077' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" fill="#1F7A6B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-paper rounded-xl border border-sage-light shadow-warm p-5">
          <h3 className="font-display text-base font-semibold text-ink mb-4">Department Share</h3>
          {deptPieData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-sm text-ink-soft">
              No appointment distribution yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={deptPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {deptPieData.map((entry, i) => (
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
          )}
        </div>
      </div>

      {/* Recent Bookings & Active Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-paper rounded-xl border border-sage-light shadow-warm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-sage-light">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-verdigris" />
              <h2 className="font-display text-lg font-semibold text-ink">Recent Appointments</h2>
            </div>
            <Link to="/admin/appointments" className="text-xs font-medium text-verdigris hover:underline">
              Manage all →
            </Link>
          </div>
          {appointments.length === 0 ? (
            <div className="p-10 text-center text-sm text-ink-soft">
              No appointments booked yet. Real bookings appear here immediately after checkout.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-bone border-b border-sage-light">
                    {['Ref', 'Patient', 'Doctor', 'Schedule', 'Status'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-ink-soft uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 8).map(appt => (
                    <tr key={appt.id} className="border-b border-sage-light last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-verdigris">{appt.booking_ref}</td>
                      <td className="px-4 py-3 text-sm font-medium text-ink">{appt.patient_name}</td>
                      <td className="px-4 py-3 text-sm text-ink-soft">{appt.doctor_name}</td>
                      <td className="px-4 py-3 text-xs text-ink-soft">
                        {formatDate(appt.appointment_date)} · {appt.appointment_time}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={appt.status === 'cancelled' ? 'signal' : 'default'} size="sm">
                          {appt.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-paper rounded-xl border border-sage-light shadow-warm">
          <div className="flex items-center justify-between p-5 border-b border-sage-light">
            <h3 className="font-display text-base font-semibold text-ink">Specialist Roster</h3>
            <Link to="/admin/doctors" className="text-xs font-medium text-verdigris hover:underline">
              Edit fees →
            </Link>
          </div>
          <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto">
            {doctors.slice(0, 8).map(doc => (
              <div key={doc.id} className="flex items-center gap-3 py-1.5 border-b border-sage-light last:border-0">
                <DoctorAvatar name={doc.name} photoUrl={doc.photoUrl} className="w-9 h-11 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{doc.name}</p>
                  <p className="text-xs text-ink-soft truncate">{doc.departmentName} · {doc.branchName}</p>
                </div>
                <span className={cn('text-xs font-mono text-ink')}>
                  {formatINR(doc.feeInClinic)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
