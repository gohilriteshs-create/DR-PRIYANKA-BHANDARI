import React, { useState, useMemo } from 'react';
import { 
  Pill, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Filter, 
  AlertTriangle,
  Stethoscope
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { PrescribedMedicine } from '../../types/portal';

export const MedicinesView: React.FC = () => {
  const { activeMedicines } = usePortal();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Completed' | 'Discontinued'>('all');

  const filteredMedicines = useMemo(() => {
    return activeMedicines.filter((med) => {
      if (statusFilter !== 'all' && med.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          med.medicineName.toLowerCase().includes(q) ||
          med.instructions.toLowerCase().includes(q) ||
          med.strength.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeMedicines, searchQuery, statusFilter]);

  const activeCount = activeMedicines.filter(m => m.status === 'Active').length;

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            My Prescribed Medicines
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Doctor-authorized medications, strengths, dosage frequencies, and dietary consumption guidelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
            {activeCount} Active Medications
          </span>
        </div>
      </div>

      {/* Clinical Advisory Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Important Patient Safety Advisory:</strong> All medication courses, strengths, and regimens are entered directly by Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS (General Physician Consultant, Hinduja Hospital). Do not self-alter dosages or abruptly discontinue prescribed antimicrobial/cardiovascular therapies without consulting your doctor.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medications by brand name, strength, or instructions..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden font-medium"
          >
            <option value="all">All Statuses ({activeMedicines.length})</option>
            <option value="Active">Active Only ({activeCount})</option>
            <option value="Completed">Completed Past Courses</option>
            <option value="Discontinued">Discontinued</option>
          </select>
        </div>
      </div>

      {/* Medicines Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredMedicines.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Medicine & Strength</th>
                    <th className="py-3 px-4">Dosage</th>
                    <th className="py-3 px-4">Frequency</th>
                    <th className="py-3 px-4">Route</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Instructions</th>
                    <th className="py-3 px-4">Prescribed Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMedicines.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 block text-sm font-bold">
                          {med.medicineName}
                        </strong>
                        <span className="text-[11px] text-sky-800 font-semibold">
                          {med.strength}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {med.dosage}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-sky-50 text-sky-900 font-semibold rounded text-[11px] border border-sky-100">
                          {med.frequency}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {med.route}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {med.duration}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 italic max-w-xs">
                        {med.instructions}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {med.consultationDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          med.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : med.status === 'Completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {med.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100 p-4 space-y-4">
              {filteredMedicines.map((med) => (
                <div key={med.id} className="pt-3 first:pt-0 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <strong className="text-slate-900 text-sm font-bold block">{med.medicineName}</strong>
                      <span className="text-sky-800 font-semibold">{med.strength} · {med.dosage}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      med.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {med.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Frequency:</span>
                      <strong className="text-slate-700">{med.frequency}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Duration:</span>
                      <strong className="text-slate-700">{med.duration}</strong>
                    </div>
                  </div>

                  <div className="text-slate-600 italic">
                    <strong>Instructions:</strong> {med.instructions}
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Prescribed: {med.consultationDate}</span>
                    <span>Route: {med.route}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-slate-500 text-xs">
            No medication records match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
