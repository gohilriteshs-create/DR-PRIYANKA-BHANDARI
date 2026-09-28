import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, Lock, ShieldCheck, User } from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';
import { usePortal } from '../context/PortalContext';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenAppointmentModal?: () => void;
  onOpenPatientPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenPatientPortal }) => {
  const { profile, clinicContact, settings } = useMedicalData();
  const { session, role, currentPatient } = usePortal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Doctor', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Specializations', href: '#specializations' },
    { label: 'Patient Care', href: '#patient-care' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const topOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToAppointment = () => {
    setMobileMenuOpen(false);
    const target = document.querySelector('#appointment');
    if (target) {
      const topOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Optional Top Announcement Strip */}
      {settings.showAnnouncement && settings.announcementNotice && (
        <div className="bg-sky-900 text-sky-100 text-xs py-1.5 px-4 text-center border-b border-sky-800/50">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-teal-400 shrink-0" />
            <p className="font-medium tracking-wide truncate max-w-4xl">
              {settings.announcementNotice}
            </p>
          </div>
        </div>
      )}

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-slate-200/80 py-3'
            : 'bg-white border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Zone 1: Single text element wordmark with clean medical icon */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-2.5 group text-slate-900 focus-visible:outline-2 focus-visible:outline-sky-600 rounded-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center shadow-xs group-hover:bg-sky-800 transition-colors">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 4v16m-8-8h16" />
                </svg>
              </div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-sky-950 transition-colors whitespace-nowrap">
                {profile.name}, {profile.qualification}
              </span>
            </a>

            {/* Zone 2: Clean text navigation links */}
            <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-slate-600">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="hover:text-sky-800 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-sky-700 hover:after:w-full after:transition-all whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Zone 3: Primary Actions */}
            <div className="flex items-center gap-2.5">
              {/* Patient Portal CTA */}
              <button
                type="button"
                onClick={onOpenPatientPortal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Access Confidential Patient Health Portal"
              >
                <ShieldCheck className="w-4 h-4 text-sky-700" />
                <span>
                  {session 
                    ? (role === 'doctor' ? 'Doctor Portal' : role === 'admin' ? 'Admin Portal' : 'My Health Portal') 
                    : 'Patient Portal'}
                </span>
                {session && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenAdmin}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                title="Practice Staff & Admin Settings"
                aria-label="Staff and Admin Portal"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="font-medium">Settings</span>
              </button>

              <button
                type="button"
                onClick={scrollToAppointment}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-800 hover:bg-sky-900 active:bg-sky-950 rounded-lg shadow-xs hover:shadow transition-all duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus-visible:outline-2 focus-visible:outline-sky-600"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in duration-150">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900 rounded-md transition-colors"
                >
                  {link.label}
                </a>
              ))}

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPatientPortal?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-sky-950 bg-sky-100 hover:bg-sky-200 border border-sky-300 rounded-lg shadow-xs transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-sky-700" />
                  <span>
                    {session 
                      ? (role === 'doctor' ? 'Access Doctor Portal' : 'Access My Health Portal') 
                      : 'Patient Portal (Sign In / Register)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={scrollToAppointment}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-sky-800 hover:bg-sky-900 rounded-lg shadow-xs transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>

                <div className="flex items-center justify-between pt-2">
                  <a
                    href={`tel:${clinicContact.phone.replace(/[^+\d]/g, '')}`}
                    className="flex items-center gap-2 text-xs font-semibold text-sky-800 px-3 py-2 bg-sky-50 rounded-lg"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Clinic Desk</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Staff Portal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
