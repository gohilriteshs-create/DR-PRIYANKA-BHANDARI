import React from 'react';
import { ShieldCheck, Heart, Lock, ArrowUp } from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAdmin: () => void;
  onOpenPatientPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdmin,
  onOpenPatientPortal
}) => {
  const { profile, clinicContact } = useMedicalData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Doctor', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Areas of Care', href: '#specializations' },
    { label: 'Book Consultation', href: '#appointment' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact & Clinic', href: '#contact' }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-base shadow-xs">
                +
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {profile.name}, {profile.qualification}
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Professional healthcare with a patient-first approach. Providing dedicated primary care, proactive preventive evaluations, and compassionate clinical attention.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div><span className="text-slate-500">Qualifications:</span> BAMS · CGO · PGDEMS</div>
              <div><span className="text-slate-500">Designation:</span> General Physician Consultant · Hinduja Hospital</div>
              <div><span className="text-slate-500">Registration:</span> {profile.registrationNumber}</div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Consultation Hours & Direct Contact */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Clinic Consultation Hours
            </h4>
            <div className="text-xs text-slate-400 space-y-1.5">
              <p><span className="text-white font-medium">Mon – Sat:</span> 10:00 AM – 01:00 PM & 06:00 PM – 09:00 PM</p>
              <p><span className="text-white font-medium">Sunday:</span> 10:00 AM – 01:00 PM (Morning Only)</p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs">
              <p className="text-slate-400">
                Clinic Desk: <a href={`tel:${clinicContact.phone.replace(/[^+\d]/g, '')}`} className="text-sky-400 hover:underline">{clinicContact.phone}</a>
              </p>
            </div>
          </div>

        </div>

        {/* Section 15: Mandatory Medical Disclaimer Box */}
        <div className="my-8 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Medical Disclaimer: </span>
              Information provided on this website is for general informational purposes and does not replace professional medical consultation, clinical diagnosis, or personalized treatment. Always seek the advice of a qualified physician with any questions you may have regarding a medical condition.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policy Links */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={onOpenPatientPortal}
              className="text-sky-400 font-bold hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Patient Portal (Records & Rx)</span>
            </button>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={onOpenTerms}
              className="hover:text-slate-300 transition-colors"
            >
              Terms & Conditions
            </button>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 hover:text-slate-300 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Staff Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
