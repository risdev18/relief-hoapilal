// Admin Appointments — Live Supabase View, Status Controls & CSV Export (Zero Demo Data)
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search, Download, Video, MapPin, Eye, X, RefreshCw, CalendarX
} from 'lucide-react';
import { SupabaseService, type SupabaseAppointmentRecord } from '@/services/supabaseService';
import { Badge, Button } from '@/components/ui';
import { formatDate, formatINR } from '@/utils';

const STATUS_BADGE: Record<SupabaseAppointmentRecord['status'], 'default' | 'saffron' | 'signal' | 'night'> = {
  booked: 'default',
  confirmed: 'default',
  checked_in: 'saffron',
  completed: 'night',
  cancelled: 'signal',
  rescheduled: 'saffron',
};

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<SupabaseAppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAppt, setSelectedAppt] = useState<SupabaseAppointmentRecord | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await SupabaseService.adminGetAllAppointments();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleStatusChange = async (id: string, status: SupabaseAppointmentRecord['status']) => {
    setUpdatingId(id);
    try {
      await SupabaseService.adminUpdateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
      setSelectedAppt(prev => (prev?.id === id ? { ...prev, status } : prev));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Booking Ref', 'Patient Name', 'Email', 'Phone', 'Doctor',
      'Department', 'Branch', 'Date', 'Time', 'Type', 'Total INR', 'Payment Mode', 'Status',
    ];
    const rows = filtered.map(a => [
      a.booking_ref,
      a.patient_name,
      a.patient_email,
      a.patient_phone,
      a.doctor_name,
      a.department_name,
      a.branch_name,
      a.appointment_date,
      a.appointment_time,
      a.consultation_type,
      a.total_amount,
      a.payment_mode,
      a.status,
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relif-appointments-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return appointments.filter(a => {
      const matchSearch =
        !q ||
        a.booking_ref.toLowerCase().includes(q) ||
        a.patient_name.toLowerCase().includes(q) ||
        a.patient_email.toLowerCase().includes(q) ||
        a.doctor_name.toLowerCase().includes(q);
      const matchStatus = !statusFilter || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [appointments, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Appointments</h1>
          <p className="text-ink-soft text-sm">
            Live hospital appointment queue, check-in progression, and payment verification from Supabase.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadAppointments}
            leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin text-verdigris' : ''} />}
          >
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-paper p-3 rounded-xl border border-sage-light">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Search by booking ref, patient, email, or doctor…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input py-2 text-sm w-44"
        >
          <option value="">All Statuses</option>
          <option value="booked">Booked</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked-in</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-paper rounded-xl border border-sage-light overflow-hidden shadow-warm-sm">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left">Ref &amp; Mode</th>
                <th className="py-3 px-4 text-left">Patient</th>
                <th className="py-3 px-4 text-left">Doctor &amp; Dept</th>
                <th className="py-3 px-4 text-left">Schedule</th>
                <th className="py-3 px-4 text-left">Fee</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-ink-soft">
                    Loading live appointments…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <CalendarX size={28} className="mx-auto text-sage mb-2" />
                    <p className="text-sm font-medium text-ink">No appointments found</p>
                    <p className="text-xs text-ink-soft mt-1">
                      Patient bookings created through the booking wizard appear here in real time.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map(a => (
                  <tr key={a.id}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {a.consultation_type === 'video' ? (
                          <span className="p-1.5 rounded-lg bg-mint text-verdigris" title="Video Consult">
                            <Video size={14} />
                          </span>
                        ) : (
                          <span className="p-1.5 rounded-lg bg-bone text-ink-soft" title="In-clinic Visit">
                            <MapPin size={14} />
                          </span>
                        )}
                        <div>
                          <span className="id-mono text-xs block">{a.booking_ref}</span>
                          <span className="text-[11px] text-ink-soft">{a.branch_name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-ink text-sm">{a.patient_name}</p>
                      <p className="font-mono text-xs text-ink-soft">{a.patient_phone || a.patient_email}</p>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="font-medium text-ink">{a.doctor_name}</p>
                      <p className="text-xs text-ink-soft">{a.department_name}</p>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="text-ink font-medium">{a.appointment_time}</p>
                      <p className="text-xs text-ink-soft">{formatDate(a.appointment_date)}</p>
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-ink">
                      {formatINR(a.total_amount)}
                      <span className="block text-[10px] text-ink-soft">
                        {a.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={STATUS_BADGE[a.status]} size="sm">
                        {a.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedAppt(a)}
                        className="p-1.5 rounded-lg text-ink-soft hover:bg-bone hover:text-ink transition-colors"
                        title="Inspect & update status"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection & Status Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-night/40 backdrop-blur-sm p-4">
          <div className="bg-paper rounded-2xl max-w-md w-full p-6 border border-sage-light shadow-warm-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="id-mono text-xs">{selectedAppt.booking_ref}</span>
                <h3 className="font-display text-xl font-bold text-ink mt-1">Appointment Details</h3>
              </div>
              <button onClick={() => setSelectedAppt(null)} className="p-1 text-ink-soft hover:text-ink">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2.5 text-sm border-t border-b border-sage-light py-4 mb-4">
              <div className="flex justify-between">
                <span className="text-ink-soft">Patient</span>
                <span className="font-medium text-ink">{selectedAppt.patient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Contact</span>
                <span className="font-mono text-xs text-ink">{selectedAppt.patient_phone || selectedAppt.patient_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Doctor</span>
                <span className="font-medium text-ink">{selectedAppt.doctor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Schedule</span>
                <span className="font-medium text-ink">
                  {formatDate(selectedAppt.appointment_date)} · {selectedAppt.appointment_time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Payment</span>
                <span className="font-mono text-ink">
                  {formatINR(selectedAppt.total_amount)} ({selectedAppt.payment_mode.replace('_', ' ')} · {selectedAppt.payment_status})
                </span>
              </div>
              {selectedAppt.symptoms && (
                <div className="pt-2 border-t border-sage-light">
                  <span className="text-xs text-ink-soft block mb-1">Symptoms / Notes</span>
                  <p className="text-xs text-ink bg-bone rounded-lg p-2">{selectedAppt.symptoms}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-ink-soft">Update Visit Status</label>
              <div className="flex flex-wrap gap-2">
                {(['booked', 'confirmed', 'checked_in', 'completed', 'cancelled'] as const).map(st => (
                  <button
                    key={st}
                    disabled={updatingId === selectedAppt.id}
                    onClick={() => handleStatusChange(selectedAppt.id, st)}
                    className={`px-3 py-1.5 rounded-pill text-xs font-medium border transition-colors ${
                      selectedAppt.status === st
                        ? 'bg-verdigris text-white border-verdigris'
                        : 'bg-bone text-ink border-sage-light hover:border-verdigris'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
