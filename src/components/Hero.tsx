import React from 'react';
import { Calendar, PhoneCall, ShieldCheck, Heart, UserCheck, Stethoscope, Clock, MapPin } from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';

interface HeroProps {
  onOpenAppointment: () => void;
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAppointment, onOpenContact }) => {
  const { profile, clinicContact } = useMedicalData();

  const trustIndicators = [
    { label: 'BAMS, CGO, PGDEMS', icon: ShieldCheck },
    { label: 'Hinduja Hospital Consultant', icon: Stethoscope },
    { label: 'Patient-Centred Care', icon: Heart },
    { label: 'Personalized Attention', icon: UserCheck }
  ];

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50/40 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/60">
      {/* Subtle background medical cross pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0369a1 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subheading, CTAs & Trust Indicators */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Quiet status kicker */}
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold tracking-wide text-sky-800 uppercase">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>General Physician Consultant</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium">Hinduja Hospital</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-normal capitalize">In-Clinic & Consultations</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-[1.15]">
              {profile.name}, <span className="text-sky-800 font-bold">{profile.qualification}</span>
            </h1>

            {/* Subheading */}
            <p className="mt-3.5 text-lg sm:text-xl font-medium text-slate-700 leading-snug text-balance">
              {profile.subheading}
            </p>

            {/* Short Introduction */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {profile.shortBio}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onOpenAppointment}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-base font-semibold text-white bg-sky-800 hover:bg-sky-900 active:bg-sky-950 rounded-lg shadow-sm hover:shadow transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
              >
                <Calendar className="w-5 h-5 text-sky-200" />
                <span>Book an Appointment</span>
              </button>

              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs hover:shadow-xs transition-all duration-150 focus-visible:outline-2 focus-visible:outline-slate-600"
              >
                <PhoneCall className="w-4 h-4 text-sky-700" />
                <span>Contact Doctor</span>
              </button>
            </div>

            {/* Trust Indicators - Clean unboxed text with subtle typographic separators */}
            <div className="mt-10 pt-6 border-t border-slate-200/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Core Clinical Practice Standards
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {trustIndicators.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-700 leading-snug">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Professional Doctor Portrait / Presentation Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Decorative background aura */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-sky-200/40 via-teal-100/30 to-sky-100/20 rounded-2xl filter blur-xl opacity-70" />

              <div className="relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm overflow-hidden">
                
                {/* Visual Banner / Avatar Area */}
                <div className="relative aspect-4/3 sm:aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-sky-900 via-sky-800 to-slate-900 flex flex-col justify-end p-6 text-white shadow-inner">
                  
                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={`Portrait of ${profile.name}, ${profile.qualification}`}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      onError={(e) => {
                        // Resilient fallback if custom URL fails
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* High fidelity medical visual backdrop */}
                  <div className="absolute inset-0 bg-radial from-sky-700/40 via-sky-900/80 to-slate-950 pointer-events-none" />
                  
                  {/* Subtle medical cross icon graphic in background */}
                  <div className="absolute top-4 right-4 text-sky-400/20 pointer-events-none">
                    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2v20M2 12h20" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Stylized Doctor Clinician Illustration Representation */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-4">
                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center mb-3 shadow-lg">
                      <Stethoscope className="w-12 h-12 text-teal-300 stroke-[1.8]" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-teal-200 font-semibold">
                      General Physician Consultant
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-white mt-1">
                      {profile.name}
                    </h3>
                    <p className="text-xs text-sky-200 mt-0.5">
                      {profile.qualification} · Hinduja Hospital
                    </p>
                  </div>

                  {/* Bottom info band inside card */}
                  <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                      <span>Accepting Consultations</span>
                    </div>
                    <span>Mumbai Practice</span>
                  </div>
                </div>

                {/* Quick Consultation Timings & Location Strip */}
                <div className="mt-5 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <Clock className="w-4 h-4 text-sky-700 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">Consultation: </span>
                      <span>Mon – Sat (10:00 AM – 01:00 PM & 06:00 PM – 09:00 PM) · Sun (10:00 AM – 01:00 PM)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <MapPin className="w-4 h-4 text-sky-700 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-800">Clinic: </span>
                      <span>{clinicContact.addressLine1}, {clinicContact.city}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
