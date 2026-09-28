import React from 'react';
import { useMedicalData } from '../context/MedicalDataContext';
import { Calendar, Stethoscope, FileText, RefreshCw, ArrowRight } from 'lucide-react';

interface PatientJourneySectionProps {
  onStartBooking: () => void;
}

export const PatientJourneySection: React.FC<PatientJourneySectionProps> = ({ onStartBooking }) => {
  const { patientJourney } = useMedicalData();

  const stepIcons = [Calendar, Stethoscope, FileText, RefreshCw];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Care Pathway
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Your Consultation Journey
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From your first appointment request to follow-up review, experience a seamless, organized, and reassuring healthcare process.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {patientJourney.map((step, idx) => {
            const Icon = stepIcons[idx] || Stethoscope;
            return (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between relative group"
              >
                <div>
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black font-mono tracking-tight text-sky-800">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-700 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Details note */}
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 italic">
                  {step.details}
                </div>
              </div>
            );
          })}

        </div>

        {/* Action strip */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onStartBooking}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-sky-800 hover:bg-sky-900 shadow-xs hover:shadow transition-all focus-visible:outline-2 focus-visible:outline-sky-700"
          >
            <span>Begin Your Appointment Request</span>
            <ArrowRight className="w-4 h-4 text-sky-200" />
          </button>
        </div>

      </div>
    </section>
  );
};
