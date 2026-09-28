import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, settings } = useMedicalData();

  if (!settings.enableTestimonials) return null;

  const activeTestimonials = testimonials.filter(t => t.enabled);
  if (activeTestimonials.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50/70 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Patient Experience
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Patient Feedback & Reflections
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Observations from patients who have consulted with Dr. Priyanka Bhandari for general health and preventive medical guidance.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Quote */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-200 stroke-[1.5]" />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{item.review}"
                </p>
              </div>

              {/* Patient Attribution - Clean unboxed text metadata */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-900 font-bold text-xs flex items-center justify-center">
                    {item.initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{item.patientName}</div>
                    <div className="text-[11px] text-slate-400 font-normal">
                      {item.consultationType}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  {item.date}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Ethical Transparency Note */}
        <div className="mt-10 text-center text-xs text-slate-500 max-w-xl mx-auto flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          <span>Patient reviews are collected with consent and managed responsibly. Individual health outcomes vary.</span>
        </div>

      </div>
    </section>
  );
};
