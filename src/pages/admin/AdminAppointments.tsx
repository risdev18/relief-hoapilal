import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, Video, MapPin, Eye, X, RefreshCw } from 'lucide-react';
import { Button, Badge, DemoBadge } from '@/components/ui';
import { SupabaseService, SupabaseAppointmentRecord } from '@/services/supabaseService';

interface AppointmentRecord {
  id: string;
  patientName: string;
  uhid: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
  status: 'Booked' | 'Confirmed' | 'Checked-in' | 'Completed' | 'Cancelled';
  branch: string;
}

const DEMO_APPOINTMENTS: AppointmentRecord[] = [
  { id: 'REL-2026-000841', patientName: 'Rahul Mehta', uhid: 'RH260192', doctorName: 'Dr. Priya Sharma', department: 'Cardiology', date: '2026-11-12', time: '10:30 AM', type: 'in-person', status: 'Confirmed', branch: 'Andheri' },
  { id: 'REL-2026-000842', patientName: 'Sunita Patil', uhid: 'RH260481', doctorName: 'Dr. Rajesh Kulkarni', department: 'Orthopedics', date: '2026-11-12', time: '11:00 AM', type: 'in-person', status: 'Checked-in', branch: 'Andheri' },
  { id: 'REL-2026-000843', patientName: 'Amit Saxena', uhid: 'RH260599', doctorName: 'Dr. Ananya Joshi', department: 'Pediatrics', date: '2026-11-12', time: '11:30 AM', type: 'video', status: 'Confirmed', branch: 'Online' },
  { id: 'REL-2026-000844', patientName: 'Sneha Deshmukh', uhid: 'RH260312', doctorName: 'Dr. Meera Patel', department: 'Dermatology', date: '2026-11-12', time: '12:00 PM', type: 'in-person', status: 'Booked', branch: 'Thane' },
  { id: 'REL-2026-000845', patientName: 'Farhan Khan', uhid: 'RH260718', doctorName: 'Dr. Arun Nair', department: 'General Medicine', date: '2026-11-12', time: '02:00 PM', type: 'in-person', status: 'Completed', branch: 'Pune' },
  { id: 'REL-2026-000846', patientName: 'Kavita Rao', uhid: 'RH260844', doctorName: 'Dr. Priya Sharma', department: 'Cardiology', date: '2026-11-12', time: '02:30 PM', type: 'video', status: 'Cancelled', branch: 'Online' },
  { id: 'REL-2026-000847', patientName: 'Vikram Seth', uhid: 'RH260901', doctorName: 'Dr. Sunita Desai', department: 'Neurology', date: '2026-11-13', time: '10:00 AM', type: 'in-person', status: 'Confirmed', branch: 'Andheri' },
  { id: 'REL-2026-000848', patientName: 'Pooja Hegde', uhid: 'RH260124', doctorName: 'Dr. Deepa Krishnan', department: 'Gynecology', date: '2026-11-13', time: '10:30 AM', type: 'in-person', status: 'Confirmed', branch: 'Pune' },
];

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(DEMO_APPOINTMENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAppt, setSelectedAppt] = useState<AppointmentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with Supabase Cloud & Local Persistence
  const loadLiveAppointments = async () => {
    setIsLoading(true);
    try {
      const records = await SupabaseService.getAppointments();
      if (records && records.length > 0) {
        const mapped: AppointmentRecord[] = records.map((r: SupabaseAppointmentRecord, idx: number) => ({
          id: r.appointment_id,
          patientName: r.patient_name || 'Patient',
          uhid: `RH260${(idx + 100).toString()}`,
          doctorName: r.doctor_name,
          department: r.department_name,
          date: r.appointment_date,
          time: r.appointment_time,
          type: r.consultation_type || 'in-person',
          status: (r.status as any) || 'Confirmed',
          branch: r.branch_name || 'Andheri',
        }));

        // Merge with demo ensuring unique ids
        const map = new Map<string, AppointmentRecord>();
        mapped.forEach(a => map.set(a.id, a));
        DEMO_APPOINTMENTS.forEach(a => {
          if (!map.has(a.id)) map.set(a.id, a);
        });
        setAppointments(Array.from(map.values()));
      }
    } catch (err) {
      console.warn('Sync error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLiveAppointments();

    const handleCreated = () => {
      loadLiveAppointments();
    };
    window.addEventListener('relif_appointment_created', handleCreated);
    return () => window.removeEventListener('relif_appointment_created', handleCreated);
  }, []);

  const filtered = appointments.filter(a => {
    const matchesSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) ||
                          a.id.toLowerCase().includes(search.toLowerCase()) ||
                          a.doctorName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? a.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'default';
      case 'Checked-in': return 'saffron';
      case 'Completed': return 'verdigris';
      case 'Cancelled': return 'signal';
      default: return 'night';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold text-ink">Appointments</h1>
            <DemoBadge />
          </div>
          <p className="text-ink-soft text-sm">Real-time scheduling overview, consultations, and status tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadLiveAppointments}
            leftIcon={<RefreshCw size={14} className={isLoading ? 'animate-spin text-verdigris' : ''} />}
          >
            {isLoading ? 'Syncing...' : 'Sync Supabase'}
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<Download size={14} />} onClick={() => alert('Demo Export: PDF summary created.')}>
            Export PDF
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<Download size={14} />} onClick={() => alert('Demo Export: Excel spreadsheet created.')}>
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-paper p-3 rounded-xl border border-sage-light">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Search by Patient, ID or Doctor..."
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
          <option value="Booked">Booked</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Checked-in">Checked-in</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-paper rounded-xl border border-sage-light overflow-hidden shadow-warm-sm">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="py-3 px-4">Appt ID & Type</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Doctor & Dept</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {a.type === 'video' ? (
                        <span className="p-1.5 rounded-lg bg-mint text-verdigris" title="Video Consult">
                          <Video size={14} />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-lg bg-bone text-ink-soft" title="In-person Visit">
                          <MapPin size={14} />
                        </span>
                      )}
                      <div>
                        <span className="id-mono text-xs block">{a.id}</span>
                        <span className="text-[11px] text-ink-soft capitalize">{a.branch}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-ink text-sm">{a.patientName}</p>
                    <p className="font-mono text-xs text-ink-soft">{a.uhid}</p>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <p className="font-medium text-ink">{a.doctorName}</p>
                    <p className="text-xs text-ink-soft">{a.department}</p>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <p className="text-ink font-medium">{a.time}</p>
                    <p className="text-xs text-ink-soft">{a.date}</p>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusVariant(a.status)} size="sm">
                      {a.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedAppt(a)}
                      className="p-1.5 rounded-lg text-ink-soft hover:bg-bone hover:text-ink transition-colors"
                      title="Inspect record"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Details Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-night/40 backdrop-blur-sm p-4">
          <div className="bg-paper rounded-2xl max-w-md w-full p-6 border border-sage-light shadow-warm-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="id-mono text-xs">{selectedAppt.id}</span>
                <h3 className="font-display text-xl font-bold text-ink mt-1">Appointment Details</h3>
              </div>
              <button onClick={() => setSelectedAppt(null)} className="p-1 text-ink-soft hover:text-ink">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-sm border-t border-b border-sage-light py-4 mb-4">
              <div className="flex justify-between">
                <span className="text-ink-soft">Patient:</span>
                <span className="font-medium text-ink">{selectedAppt.patientName} ({selectedAppt.uhid})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Consultant:</span>
                <span className="font-medium text-ink">{selectedAppt.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Department:</span>
                <span className="font-medium text-ink">{selectedAppt.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Date & Time:</span>
                <span className="font-medium text-ink">{selectedAppt.date} at {selectedAppt.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Mode & Location:</span>
                <span className="font-medium text-ink capitalize">{selectedAppt.type} · {selectedAppt.branch}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-soft">Status:</span>
                <Badge variant={getStatusVariant(selectedAppt.status)} size="sm">
                  {selectedAppt.status}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setSelectedAppt(null)}>
                Dismiss
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => { alert('Demo action: Status updated.'); setSelectedAppt(null); }}>
                Update Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

