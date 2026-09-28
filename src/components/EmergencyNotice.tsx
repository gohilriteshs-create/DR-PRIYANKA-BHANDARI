import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';

export const EmergencyNotice: React.FC = () => {
  const { clinicContact, settings } = useMedicalData();

  if (!settings.emergencyNoticeActive) return null;

  return (
    <section className="bg-amber-50/70 border-y border-amber-200/80 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Medical Emergency Notice
              </h4>
              <p className="text-xs text-amber-800/95 leading-relaxed mt-0.5">
                For urgent, acute, or life-threatening medical situations, please contact your local emergency medical service (108 / 112) or visit the nearest hospital emergency department immediately.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <a
              href="tel:112"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-200/70 hover:bg-amber-300 text-amber-950 font-bold rounded-lg text-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 112 / 108</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
