/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MedicalDataProvider, useMedicalData } from './context/MedicalDataContext';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutDoctor } from './components/AboutDoctor';
import { ServicesSection } from './components/ServicesSection';
import { SpecializationsSection } from './components/SpecializationsSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { PatientJourneySection } from './components/PatientJourneySection';
import { AppointmentSection } from './components/AppointmentSection';
import { EmergencyNotice } from './components/EmergencyNotice';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ServiceDetailModal, DoctorProfileModal, TextModal } from './components/Modals';
import { AdminModal } from './components/AdminModal';
import { PortalLayout } from './components/portal/PortalLayout';
import { PortalAuth } from './components/portal/PortalAuth';
import { PortalAuthModal } from './components/portal/PortalAuthModal';
import { MedicalService } from './types';
import { ArrowLeft } from 'lucide-react';

interface MainContentProps {
  onOpenPatientPortal: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ onOpenPatientPortal }) => {
  const { profile } = useMedicalData();

  // Modal States
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Preselected service for booking
  const [bookingService, setBookingService] = useState<string>('');

  const handleSelectService = (service: MedicalService) => {
    setSelectedService(service);
  };

  const handleBookService = (serviceName: string) => {
    setBookingService(serviceName);
    const appointmentElement = document.querySelector('#appointment');
    if (appointmentElement) {
      const topOffset = 80;
      const elementPosition = appointmentElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToAppointment = () => {
    const appointmentElement = document.querySelector('#appointment');
    if (appointmentElement) {
      const topOffset = 80;
      const elementPosition = appointmentElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToContact = () => {
    const contactElement = document.querySelector('#contact');
    if (contactElement) {
      const topOffset = 80;
      const elementPosition = contactElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* 1. Sticky Navigation with Patient Portal CTA */}
      <Navbar 
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenPatientPortal={onOpenPatientPortal}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 sm:pb-0">
        
        {/* 2. Hero Section */}
        <Hero
          onOpenAppointment={scrollToAppointment}
          onOpenContact={scrollToContact}
        />

        {/* 3. Emergency Medical Notice */}
        <EmergencyNotice />

        {/* 4. About Doctor */}
        <AboutDoctor onLearnMore={() => setIsDoctorModalOpen(true)} />

        {/* 5. Medical Services */}
        <ServicesSection
          onSelectService={handleSelectService}
          onBookService={handleBookService}
        />

        {/* 6. Specializations / Areas of Medical Care */}
        <SpecializationsSection />

        {/* 7. Why Choose Dr. Priyanka Bhandari */}
        <WhyChooseSection />

        {/* 8. Patient Consultation Journey */}
        <PatientJourneySection onStartBooking={scrollToAppointment} />

        {/* 9. Appointment Booking Form with Patient Portal badge */}
        <AppointmentSection 
          preselectedService={bookingService} 
          onOpenPatientPortal={onOpenPatientPortal}
        />

        {/* 10. Patient Testimonials */}
        <TestimonialsSection />

        {/* 11. FAQ Section */}
        <FAQSection />

        {/* 12. Contact & Clinic Timings */}
        <ContactSection />

      </main>

      {/* 13. Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenPatientPortal={onOpenPatientPortal}
      />

      {/* Floating WhatsApp and Mobile Quick Contact Bar with Patient Portal link */}
      <FloatingActions 
        onOpenAppointment={scrollToAppointment} 
        onOpenPatientPortal={onOpenPatientPortal}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBookService={handleBookService}
      />

      {/* Doctor Deep Dive Profile Modal */}
      <DoctorProfileModal
        profile={profile}
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onBookAppointment={scrollToAppointment}
      />

      {/* Admin Management Dashboard Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Privacy Policy Modal */}
      <TextModal
        title="Patient Privacy Policy"
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      >
        <p className="font-semibold text-slate-800">
          Last Updated: 2026 · Dr. Priyanka Bhandari Clinic
        </p>
        <p>
          At Dr. Priyanka Bhandari’s medical practice, protecting our patients’ privacy and health information confidentiality is paramount. This Privacy Policy describes how we handle information submitted through our website.
        </p>
        <h4 className="font-bold text-slate-800 text-sm mt-3">1. Information We Collect</h4>
        <p>
          When you register for our secure Patient Portal or request an appointment, we collect basic contact details (name, date of birth, phone number, email) and clinical records created by Dr. Priyanka Bhandari. We do not solicit or store unencrypted medical records.
        </p>
        <h4 className="font-bold text-slate-800 text-sm mt-3">2. Use of Information</h4>
        <p>
          Your information is strictly utilized to provide ongoing healthcare, schedule visits, issue prescriptions, and maintain your confidential health dossier. We never sell, rent, or distribute patient contact details to commercial third parties.
        </p>
        <h4 className="font-bold text-slate-800 text-sm mt-3">3. Medical Confidentiality</h4>
        <p>
          All clinical discussions, examination notes, and medical records are governed by statutory doctor-patient confidentiality and applicable healthcare privacy regulations.
        </p>
        <h4 className="font-bold text-slate-800 text-sm mt-3">4. Security</h4>
        <p>
          We employ HTTPS transport security, salted cryptographic hashing for passwords, and industry-standard digital access controls. You may export or inspect your health record at any time through the Patient Portal.
        </p>
      </TextModal>

      {/* Terms & Conditions Modal */}
      <TextModal
        title="Terms of Service & Clinical Notice"
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      >
        <p className="font-semibold text-slate-800">
          General Clinical Notice & Website Terms
        </p>
        <h4 className="font-bold text-slate-800 text-sm mt-3">1. Informational Nature of Website</h4>
        <p>
          Content published on this website is for general educational and healthcare communication purposes. It does not replace in-person diagnostic evaluation by a registered medical practitioner.
        </p>
        <h4 className="font-bold text-slate-800 text-sm mt-3">2. Appointment Requests</h4>
        <p>
          Submitting an appointment request does not constitute an emergency medical service. Our clinic coordinator will review schedule availability and confirm your consultation slot.
        </p>
        <h4 className="font-bold text-slate-800 text-sm mt-3">3. Emergency Situations</h4>
        <p>
          This portal is not monitored 24/7 for acute medical crises. In case of chest pain, severe shortness of breath, acute trauma, or any life-threatening condition, immediately proceed to the nearest emergency department or dial 112 / 108.
        </p>
        <h4 className="font-bold text-slate-800 text-sm mt-3">4. Professional Ethics</h4>
        <p>
          Dr. Priyanka Bhandari adheres to ethical medical practice as stipulated by the National Medical Commission (NMC) and clinical regulatory frameworks.
        </p>
      </TextModal>

    </div>
  );
};

const AppShell: React.FC = () => {
  const { isAuthenticated, session } = usePortal();
  const [currentView, setCurrentView] = useState<'website' | 'portal'>('website');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenPatientPortal = () => {
    if (isAuthenticated) {
      setCurrentView('portal');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setCurrentView('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'portal') {
    if (isAuthenticated) {
      return (
        <PortalLayout 
          onBackToWebsite={() => {
            setCurrentView('website');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      );
    }

    // Portal screen for unauthenticated visitors
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 py-8">
        <div className="w-full max-w-2xl mb-4 flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentView('website');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-slate-700 hover:text-sky-950 flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-sky-700" />
            <span>Return to Dr. Priyanka Bhandari Clinic</span>
          </button>
        </div>

        <PortalAuth
          onSuccess={handleAuthSuccess}
          onClose={() => {
            setCurrentView('website');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  return (
    <>
      <MainContent onOpenPatientPortal={handleOpenPatientPortal} />

      {/* Auth Modal Overlay when clicked from website */}
      <PortalAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default function App() {
  return (
    <MedicalDataProvider>
      <PortalProvider>
        <AppShell />
      </PortalProvider>
    </MedicalDataProvider>
  );
}
