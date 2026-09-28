import React from 'react';
import { useMedicalData } from '../context/MedicalDataContext';
import { DynamicMedicalIcon } from './DynamicMedicalIcon';

export const SpecializationsSection: React.FC = () => {
  const { specializations } = useMedicalData();
  const activeSpecializations = specializations.filter(s => s.enabled);

  return (
    <section id="specializations" className="py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Comprehensive Clinical Practice
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Areas of Medical Care
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Primary healthcare guidance, routine health assessments, and ongoing medical support delivered with professional responsibility and clinical precision.
          </p>
        </div>

        {/* Areas Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSpecializations.map((spec) => (
            <div
              key={spec.id}
              className="bg-slate-50/60 hover:bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-sky-200 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-100/70 text-sky-800 flex items-center justify-center mb-5">
                <DynamicMedicalIcon name={spec.iconName} className="w-6 h-6 stroke-[1.8]" />
              </div>

              <h3 className="text-lg font-bold tracking-tight text-slate-900">
                {spec.title}
              </h3>

              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {spec.description}
              </p>

              {/* Key Aspects list */}
              {spec.keyAspects && spec.keyAspects.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-200/60">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Care Components
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {spec.keyAspects.map((aspect, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-slate-700 bg-white border border-slate-200/90 rounded-md px-2.5 py-1"
                      >
                        {aspect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
