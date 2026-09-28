import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  ArrowUp, 
  Home, 
  Stethoscope, 
  Calendar, 
  Phone, 
  User,
  ShieldCheck
} from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';

interface FloatingActionsProps {
  onOpenAppointment: () => void;
  onOpenPatientPortal?: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ 
  onOpenAppointment,
  onOpenPatientPortal
}) => {
  const { clinicContact } = useMedicalData();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      // Section tracking for bottom navigation bar
      const sections = ['contact', 'appointment', 'services', 'about', 'home'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      const topOffset = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const cleanWhatsApp = clinicContact.whatsapp.replace(/[^+\d]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.replace('+', '')}?text=Hello%20Dr.%20Priyanka%20Bhandari%20Clinic,%20I%20would%20like%20to%20inquire%20about%20a%20consultation%20appointment.`;

  return (
    <>
      {/* Floating WhatsApp & Back to Top (Desktop & Tablet: Bottom Right; Mobile: Above Bottom Bar) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-sky-800 shadow-md border border-slate-200 transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-sky-700 animate-in fade-in"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* Patient Portal Floating Shortcut */}
        {onOpenPatientPortal && (
          <button
            type="button"
            onClick={onOpenPatientPortal}
            aria-label="Open Patient Health Portal"
            className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-full bg-sky-900 hover:bg-sky-950 text-white shadow-lg border border-sky-700/60 transition-all hover:scale-105 active:scale-95 text-xs font-bold animate-in fade-in"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Patient Portal</span>
          </button>
        )}

        {/* WhatsApp Floating Action */}
        <div className="relative pointer-events-auto flex items-center group">
          
          {/* Pop tooltip for desktop */}
          {showTooltip && (
            <div className="hidden sm:flex items-center gap-1.5 mr-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-md animate-in slide-in-from-right-2">
              <span>Chat on WhatsApp</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-slate-400 hover:text-white ml-1 text-xs"
                aria-label="Dismiss tooltip"
              >
                ×
              </button>
            </div>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Dr. Priyanka Bhandari Clinic on WhatsApp"
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
          </a>
        </div>

      </div>

      {/* Mobile App-Style Bottom Navigation Bar (Under 15% Mobile Sticky Cap) */}
      <nav 
        aria-label="Mobile Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-around pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]"
      >
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => scrollToSection('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-lg transition-colors ${
            activeSection === 'home'
              ? 'text-sky-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${activeSection === 'home' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* 2. Services */}
        <button
          type="button"
          onClick={() => scrollToSection('services')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-lg transition-colors ${
            activeSection === 'services'
              ? 'text-sky-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Stethoscope className={`w-5 h-5 ${activeSection === 'services' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Services</span>
        </button>

        {/* 3. Book Consultation (Elevated Center Action) */}
        <button
          type="button"
          onClick={onOpenAppointment}
          className="flex flex-col items-center justify-center min-w-[62px] -mt-3.5 group"
          aria-label="Book an Appointment"
        >
          <div className="w-11 h-11 rounded-full bg-sky-800 text-white flex items-center justify-center shadow-md border-2 border-white group-active:scale-95 group-hover:bg-sky-900 transition-transform">
            <Calendar className="w-5 h-5 text-sky-100" />
          </div>
          <span className={`text-[10px] mt-1 font-bold ${activeSection === 'appointment' ? 'text-sky-900' : 'text-slate-700'}`}>
            Book
          </span>
        </button>

        {/* 4. About Doctor */}
        <button
          type="button"
          onClick={() => scrollToSection('about')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-lg transition-colors ${
            activeSection === 'about'
              ? 'text-sky-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <User className={`w-5 h-5 ${activeSection === 'about' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Doctor</span>
        </button>

        {/* 5. Contact */}
        <button
          type="button"
          onClick={() => scrollToSection('contact')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-lg transition-colors ${
            activeSection === 'contact'
              ? 'text-sky-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Phone className={`w-5 h-5 ${activeSection === 'contact' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Contact</span>
        </button>
      </nav>
    </>
  );
};
