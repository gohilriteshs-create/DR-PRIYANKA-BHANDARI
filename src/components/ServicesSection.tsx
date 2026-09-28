import React, { useState } from 'react';
import { ArrowRight, Clock, Info } from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';
import { MedicalService } from '../types';
import { DynamicMedicalIcon } from './DynamicMedicalIcon';

interface ServicesSectionProps {
  onSelectService: (service: MedicalService) => void;
  onBookService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  onSelectService,
  onBookService 
}) => {
  const { services } = useMedicalData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter only enabled services
  const enabledServices = services.filter(s => s.enabled);
  
  // Extract distinct categories
  const categories = ['All', ...Array.from(new Set(enabledServices.map(s => s.category)))];

  const filteredServices = selectedCategory === 'All' 
    ? enabledServices 
    : enabledServices.filter(s => s.category === selectedCategory);

  return (
    <section id="services" className="py-20 bg-slate-50/70 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Clinical Offerings
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Medical Services
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Carefully structured medical consultations focused on accurate evaluation, clear communication, and personalized recovery plans.
          </p>

          {/* Interactive Category Filter - Section 1.A DO: interactive button segmented controls */}
          {categories.length > 2 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs max-w-xl mx-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-sky-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Services Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Visual Service Image Banner */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                  <img
                    src={service.imageUrl || `/services/${service.id}.svg`}
                    alt={`${service.name} - Dr. Priyanka Bhandari, Hinduja Hospital`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/services/general-consultation.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/10" />

                  {/* Category Pill Top Left */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 backdrop-blur-xs text-sky-900 shadow-xs border border-white/40">
                      <DynamicMedicalIcon name={service.iconName} className="w-3.5 h-3.5 text-sky-700" />
                      <span>{service.category}</span>
                    </span>
                  </div>

                  {/* Estimated Duration Top Right */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/80 backdrop-blur-xs text-white shadow-xs border border-white/10">
                      <Clock className="w-3 h-3 text-sky-300" />
                      <span>{service.estimatedDuration}</span>
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6">
                  {/* Service Name */}
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-sky-900 transition-colors">
                    {service.name}
                  </h3>

                  {/* Short Description */}
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>

                  {/* Quiet Category Metadata */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="text-sky-800 font-semibold">Hinduja Hospital</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>In-Clinic &amp; Follow-up</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onSelectService(service)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-800 hover:text-sky-950 transition-colors group/btn cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => onBookService(service.name)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-sky-900 bg-slate-50 hover:bg-sky-50 border border-slate-200/80 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Book This
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Informational Guidance Note */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-2xl mx-auto">
          Need guidance on which consultation type is appropriate for your symptoms?{' '}
          <a href="#contact" className="text-sky-800 font-semibold underline underline-offset-2 hover:text-sky-950">
            Contact our clinic coordinator
          </a>{' '}
          for assistance.
        </div>

      </div>
    </section>
  );
};
