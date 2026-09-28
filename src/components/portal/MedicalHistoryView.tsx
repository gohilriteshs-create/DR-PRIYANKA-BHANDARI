import React from 'react';
import { 
  Activity, 
  Calendar, 
  Stethoscope, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const MedicalHistoryView: React.FC = () => {
  const { medicalHistory } = usePortal();

  // Sort chronological descending
  const sortedHistory = [...medicalHistory].sort(
    (a, b) => new Date(b.diagnosisDate).getTime() - new Date(a.diagnosisDate).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Medical History & Diagnosis Log
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Chronological record of clinical conditions, chronic health assessments, and treatment resolutions documented by Dr. Priyanka Bhandari.
        </p>
      </div>

      {/* Security notice */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
        <span>Medical history entries are maintained by Dr. Priyanka Bhandari and cannot be altered directly by patients to safeguard health record veracity.</span>
      </div>

      {/* Timeline Interface */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-sky-200 space-y-6 ml-3 my-4">
        {sortedHistory.length > 0 ? (
          sortedHistory.map((entry) => {
            const entryDate = new Date(entry.diagnosisDate);
            const monthYear = entryDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            return (
              <div key={entry.id} className="relative group">
                {/* Timeline Bullet Node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-sky-600 group-hover:border-sky-800 transition-colors"></div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-sky-300 transition-all space-y-3 text-xs">
                  {/* Date & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sky-950 text-sm">{monthYear}</span>
                      <span className="text-slate-400">({entry.diagnosisDate})</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      entry.status === 'Active' 
                        ? 'bg-amber-100 text-amber-800' 
                        : entry.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}>
                      {entry.status}
                    </span>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Condition / Clinical Assessment
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {entry.condition}
                    </h3>
                  </div>

                  {/* Notes */}
                  {entry.notes && (
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                      <strong className="block text-slate-900 mb-0.5 font-semibold text-[11px]">
                        Clinical Documentation:
                      </strong>
                      {entry.notes}
                    </div>
                  )}

                  {/* Treatment */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Prescribed Treatment Protocol
                    </span>
                    <p className="text-slate-700 font-medium mt-0.5">
                      {entry.treatment}
                    </p>
                  </div>

                  {/* Meta Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                    {entry.followUp && (
                      <div className="flex items-center gap-1.5 text-sky-800 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Follow-up: {entry.followUp}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                      <span>Documented by: <strong>{entry.doctor}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-slate-500 text-xs">
            No medical history entries recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
