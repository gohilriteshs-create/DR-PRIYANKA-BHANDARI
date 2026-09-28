import React, { useState } from 'react';
import { 
  GraduationCap, 
  Heart, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Stethoscope,
  Clock,
  Languages
} from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';

interface AboutDoctorProps {
  onLearnMore: () => void;
}

export const AboutDoctor: React.FC<AboutDoctorProps> = ({ onLearnMore }) => {
  const { profile } = useMedicalData();

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Lead */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Professional Background
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Meet Dr. Priyanka Bhandari
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
            <span className="text-sky-800 font-bold">{profile.name}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{profile.qualification}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600 font-medium">General Physician Consultant</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-sky-700 font-semibold">Hinduja Hospital</span>
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Portrait & Clinical Credentials Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-1 shadow-md">
              <div className="rounded-[14px] bg-slate-900 overflow-hidden relative text-white">
                
                {/* Doctor Visual Area */}
                <div className="relative aspect-4/5 w-full bg-slate-800 flex flex-col justify-end p-6">
                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={`Dr. Priyanka Bhandari, ${profile.qualification}`}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Fallback Graphic */}
                  <div className="absolute inset-0 bg-radial from-sky-800/40 via-slate-900/90 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-28 h-28 rounded-full bg-sky-900/60 border border-sky-400/30 flex items-center justify-center mb-4 shadow-xl">
                      <Stethoscope className="w-14 h-14 text-teal-300 stroke-[1.7]" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-800/50 border border-sky-400/20 text-xs text-teal-200 font-medium">
                      <span>General Physician Consultant · Hinduja Hospital</span>
                    </div>
                    <p className="mt-3 text-xs text-slate-300 max-w-xs leading-relaxed">
                      Dedicated to thorough, compassionate and personalized medical consultations.
                    </p>
                  </div>

                  {/* Bottom overlay with quick facts */}
                  <div className="relative z-10 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 mt-auto">
                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-400">Medical Degree</div>
                        <div className="text-sm font-bold text-white mt-0.5">{profile.qualification}</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-400">Consultation Languages</div>
                        <div className="text-sm font-semibold text-white mt-0.5">
                          {profile.languages.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Bio, Philosophy & Practice Tenets */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Bio Paragraphs */}
            <div className="space-y-4 text-base text-slate-600 leading-relaxed">
              {profile.fullBio.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Approach to Care & Philosophy Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5 text-sky-900 font-semibold text-sm mb-2">
                  <Heart className="w-4 h-4 text-sky-700 shrink-0" />
                  <span>Approach to Patient Care</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {profile.approachToCare}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5 text-sky-900 font-semibold text-sm mb-2">
                  <Compass className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Professional Philosophy</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {profile.philosophy}
                </p>
              </div>

            </div>

            {/* Areas of Interest */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Key Areas of Clinical Focus
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.areasOfInterest.map((interest, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-900 border border-sky-100 text-xs font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-700" />
                    <span>{interest}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action to Learn More Modal */}
            <div className="pt-4">
              <button
                type="button"
                onClick={onLearnMore}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 transition-colors focus-visible:outline-2 focus-visible:outline-sky-700"
              >
                <span>Learn More About the Doctor</span>
                <ArrowRight className="w-4 h-4 text-sky-700" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
