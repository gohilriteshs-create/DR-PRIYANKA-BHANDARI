import React from 'react';
import { useMedicalData } from '../context/MedicalDataContext';
import { DynamicMedicalIcon } from './DynamicMedicalIcon';

export const WhyChooseSection: React.FC = () => {
  const { whyChoose } = useMedicalData();

  return (
    <section id="patient-care" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle backdrop geometry */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-300">
            Care Values & Standards
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Why Choose Dr. Priyanka Bhandari
          </h2>
          <p className="mt-3.5 text-base text-slate-300 leading-relaxed">
            Healthcare grounded in open consultation, ethical clinical responsibility, and genuine empathy for every individual who walks through our clinic doors.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {whyChoose.map((benefit, idx) => (
            <div
              key={benefit.id}
              className={`p-6 sm:p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-teal-400/40 hover:bg-white/[0.07] transition-all duration-200 flex flex-col ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-400/20 text-teal-300 flex items-center justify-center mb-5 shrink-0">
                <DynamicMedicalIcon name={benefit.iconName} className="w-6 h-6 stroke-[1.8]" />
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                {benefit.title}
              </h3>

              <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
                {benefit.description}
              </p>

              {/* Clean index indicator */}
              <div className="mt-auto pt-6 text-[11px] font-mono text-slate-500">
                Principle 0{idx + 1}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
