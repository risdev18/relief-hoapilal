import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui';

const APPOINTMENTS_TREND = [
  { day: 'Nov 01', appointments: 34 },
  { day: 'Nov 03', appointments: 42 },
  { day: 'Nov 05', appointments: 40 },
  { day: 'Nov 07', appointments: 48 },
  { day: 'Nov 09', appointments: 52 },
  { day: 'Nov 11', appointments: 61 },
  { day: 'Nov 13', appointments: 58 },
];

const REVENUE_BY_DEPT = [
  { name: 'Cardiology', revenue: 450000 },
  { name: 'Orthopedics', revenue: 380000 },
  { name: 'Neurology', revenue: 310000 },
  { name: 'Pediatrics', revenue: 190000 },
  { name: 'Dermatology', revenue: 140000 },
  { name: 'Gen Medicine', revenue: 120000 },
];

const CONSULTATION_TYPES = [
  { name: 'In-person OPD', value: 72 },
  { name: 'Video Teleconsult', value: 28 },
];

// ZERO BLUE POLICY: Tokens strictly applied
const PIE_COLORS = ['#1F7A6B', '#F0A22E'];

export function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Clinical & Financial Analytics</h1>
          <p className="text-ink-soft text-sm">Aggregated operational metrics, bed occupancy rates, and transaction velocity.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="input py-2 text-sm w-40"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
          <Button variant="secondary" size="sm" leftIcon={<Download size={14} />} onClick={() => window.print()}>
            Print Report
          </Button>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Line */}
        <div className="bg-paper p-6 rounded-xl border border-sage-light shadow-warm-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display font-semibold text-ink text-lg">Patient Consultations Trend</h3>
              <p className="text-xs text-ink-soft">Daily verified check-ins and appointments</p>
            </div>
            <span className="text-xs font-mono text-verdigris font-semibold">+18.4% vs last period</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={APPOINTMENTS_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8FB5A3" opacity={0.3} />
                <XAxis dataKey="day" stroke="#3E5249" fontSize={11} />
                <YAxis stroke="#3E5249" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAF6EE', borderColor: '#8FB5A3', borderRadius: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#1F7A6B"
                  strokeWidth={3}
                  dot={{ fill: '#1F7A6B', r: 4 }}
                  activeDot={{ r: 6, fill: '#F0A22E' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Bars */}
        <div className="bg-paper p-6 rounded-xl border border-sage-light shadow-warm-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display font-semibold text-ink text-lg">Departmental Revenue (₹)</h3>
              <p className="text-xs text-ink-soft">Recorded transactions via verified payment orders</p>
            </div>
            <span className="chip text-xs font-mono">Verified Ledger</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_BY_DEPT}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8FB5A3" opacity={0.3} />
                <XAxis dataKey="name" stroke="#3E5249" fontSize={10} />
                <YAxis stroke="#3E5249" fontSize={10} />
                <Tooltip
                  formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#FAF6EE', borderColor: '#8FB5A3', borderRadius: '12px' }}
                />
                <Bar dataKey="revenue" fill="#1F7A6B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Pie */}
        <div className="bg-paper p-6 rounded-xl border border-sage-light shadow-warm-sm space-y-4">
          <div>
            <h3 className="font-display font-semibold text-ink text-lg">Consultation Mode Breakdown</h3>
            <p className="text-xs text-ink-soft">Physical OPD check-in vs Encrypted WebRTC Teleconsult</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CONSULTATION_TYPES}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CONSULTATION_TYPES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#FAF6EE', borderColor: '#8FB5A3', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-verdigris" />
              <span className="text-ink">In-person OPD (72%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-saffron" />
              <span className="text-ink">Teleconsultation (28%)</span>
            </div>
          </div>
        </div>

        {/* Clinical Quality Indicators */}
        <div className="bg-paper p-6 rounded-xl border border-sage-light shadow-warm-sm space-y-4">
          <div>
            <h3 className="font-display font-semibold text-ink text-lg">Quality & Safety Indices</h3>
            <p className="text-xs text-ink-soft">Standard healthcare operational benchmarks</p>
          </div>
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-ink-soft">Bed Occupancy Rate (ICU + Inpatient)</span>
                <span className="text-ink font-mono font-bold">84%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-bone overflow-hidden">
                <div className="h-full bg-verdigris rounded-full" style={{ width: '84%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-ink-soft">Average OPD Turnaround Time</span>
                <span className="text-ink font-mono font-bold">22 mins</span>
              </div>
              <div className="w-full h-2 rounded-full bg-bone overflow-hidden">
                <div className="h-full bg-saffron rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-ink-soft">Lab Turnaround Time (TAT) Adherence</span>
                <span className="text-ink font-mono font-bold">96.2%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-bone overflow-hidden">
                <div className="h-full bg-verdigris rounded-full" style={{ width: '96.2%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

