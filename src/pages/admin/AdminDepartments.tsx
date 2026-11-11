import React, { useState } from 'react';
import { GripVertical, Edit3, Check, Plus, AlertCircle } from 'lucide-react';
import { DEPARTMENTS } from '@/config/constants';
import { Badge, Button } from '@/components/ui';

interface DepartmentItem {
  id: string;
  name: string;
  slug: string;
  head: string;
  doctorsCount: number;
  status: 'Active' | 'Inactive';
}

const INITIAL_DATA: DepartmentItem[] = DEPARTMENTS.map((d, i) => ({
  id: d.id,
  name: d.name,
  slug: d.slug,
  head: i === 0 ? 'Dr. Priya Sharma' : i === 1 ? 'Dr. Sunita Desai' : 'Dr. Specialist',
  doctorsCount: 4 + (i % 5),
  status: 'Active'
}));

export function AdminDepartments() {
  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHead, setEditHead] = useState('');

  const handleEditClick = (dept: DepartmentItem) => {
    setEditingId(dept.id);
    setEditHead(dept.head);
  };

  const handleSave = (id: string) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, head: editHead } : d));
    setEditingId(null);
  };

  const toggleStatus = (id: string) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Departments</h1>
          <p className="text-ink-soft text-sm">Configure hospital specialties, clinical heads, and operational status.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />}>
          Add Department
        </Button>
      </div>

      <div className="bg-paper rounded-xl border border-sage-light overflow-hidden shadow-warm-sm">
        <div className="divide-y divide-sage-light">
          {departments.map((dept, index) => (
            <div key={dept.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-bone transition-colors">
              <div className="flex items-center gap-3">
                <span className="cursor-grab text-sage hover:text-ink">
                  <GripVertical size={18} />
                </span>
                <span className="font-mono text-xs text-sage w-6">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-display font-semibold text-ink text-base">{dept.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-ink-soft mt-0.5">
                    {editingId === dept.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editHead}
                          onChange={e => setEditHead(e.target.value)}
                          className="input py-0.5 px-2 text-xs"
                        />
                        <button onClick={() => handleSave(dept.id)} className="p-1 text-verdigris hover:text-verdigris-deep">
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <span>Head: <strong className="text-ink font-medium">{dept.head}</strong></span>
                    )}
                    <span>•</span>
                    <span>{dept.doctorsCount} Specialists</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <Badge variant={dept.status === 'Active' ? 'default' : 'night'} size="sm">
                  {dept.status}
                </Badge>
                <button
                  onClick={() => handleEditClick(dept)}
                  className="p-1.5 rounded-lg text-ink-soft hover:bg-paper hover:text-ink transition-colors"
                  title="Edit Department"
                >
                  <Edit3 size={16} />
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStatus(dept.id)}
                  className="text-xs"
                >
                  {dept.status === 'Active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

