import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DoctorProfile,
  MedicalService,
  MedicalSpecialization,
  WhyChooseBenefit,
  PatientJourneyStep,
  PatientTestimonial,
  FAQItem,
  ClinicContactInfo,
  AppointmentRecord,
  WebsiteSettings,
  AppointmentStatus
} from '../types';
import {
  initialDoctorProfile,
  initialServices,
  initialSpecializations,
  initialWhyChoose,
  initialPatientJourney,
  initialTestimonials,
  initialFAQs,
  initialClinicContact,
  initialAppointments,
  initialWebsiteSettings
} from '../data/initialData';

interface MedicalDataContextType {
  profile: DoctorProfile;
  updateProfile: (updated: Partial<DoctorProfile>) => void;

  services: MedicalService[];
  addService: (service: Omit<MedicalService, 'id'>) => void;
  updateService: (id: string, updated: Partial<MedicalService>) => void;
  deleteService: (id: string) => void;
  toggleService: (id: string) => void;

  specializations: MedicalSpecialization[];
  updateSpecialization: (id: string, updated: Partial<MedicalSpecialization>) => void;

  whyChoose: WhyChooseBenefit[];
  patientJourney: PatientJourneyStep[];

  testimonials: PatientTestimonial[];
  addTestimonial: (test: Omit<PatientTestimonial, 'id'>) => void;
  updateTestimonial: (id: string, updated: Partial<PatientTestimonial>) => void;
  deleteTestimonial: (id: string) => void;
  toggleTestimonial: (id: string) => void;

  faqs: FAQItem[];
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, updated: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  clinicContact: ClinicContactInfo;
  updateClinicContact: (updated: Partial<ClinicContactInfo>) => void;

  appointments: AppointmentRecord[];
  pendingAppointments: AppointmentRecord[];
  pastAppointments: AppointmentRecord[];
  pendingCount: number;
  bookAppointment: (apt: Omit<AppointmentRecord, 'id' | 'referenceNumber' | 'status' | 'createdAt'>) => AppointmentRecord;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, adminNotes?: string) => void;
  approveAppointment: (id: string, adminNotes?: string) => void;
  cancelAppointment: (id: string, adminNotes?: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string, adminNotes?: string) => void;
  deleteAppointment: (id: string) => void;
  clearPastAppointments: () => void;

  settings: WebsiteSettings;
  updateSettings: (updated: Partial<WebsiteSettings>) => void;

  resetToDefaults: () => void;
}

const MedicalDataContext = createContext<MedicalDataContextType | undefined>(undefined);

const STORAGE_KEY = 'dr_priyanka_bhandari_medical_data_v2';

export const MedicalDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<DoctorProfile>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_profile`) ||
        localStorage.getItem('dr_priyanka_bhandari_medical_data_v1_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.qualification || parsed.qualification.includes('MBBS') || !parsed.hospitalAffiliation) {
          const updated = {
            ...parsed,
            qualification: initialDoctorProfile.qualification,
            designation: initialDoctorProfile.designation,
            hospitalAffiliation: initialDoctorProfile.hospitalAffiliation,
            subheading: initialDoctorProfile.subheading,
            shortBio: initialDoctorProfile.shortBio,
            fullBio: initialDoctorProfile.fullBio,
            experienceSummary: initialDoctorProfile.experienceSummary,
            areasOfInterest: initialDoctorProfile.areasOfInterest
          };
          localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(updated));
          return updated;
        }
        return parsed;
      }
      return initialDoctorProfile;
    } catch {
      return initialDoctorProfile;
    }
  });

  const [services, setServices] = useState<MedicalService[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_services`) ||
        localStorage.getItem('dr_priyanka_bhandari_medical_data_v1_services');
      if (stored) {
        const parsed: MedicalService[] = JSON.parse(stored);
        // Automatically inject imageUrl if missing from previous cache
        const updated = parsed.map(svc => {
          const defaultMatch = initialServices.find(s => s.id === svc.id);
          return {
            ...svc,
            imageUrl: svc.imageUrl || defaultMatch?.imageUrl || `/services/${svc.id}.svg`
          };
        });
        return updated;
      }
      return initialServices;
    } catch {
      return initialServices;
    }
  });

  const [specializations, setSpecializations] = useState<MedicalSpecialization[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_specializations`) ||
        localStorage.getItem('dr_priyanka_bhandari_medical_data_v1_specializations');
      return stored ? JSON.parse(stored) : initialSpecializations;
    } catch {
      return initialSpecializations;
    }
  });

  const [whyChoose] = useState<WhyChooseBenefit[]>(initialWhyChoose);
  const [patientJourney] = useState<PatientJourneyStep[]>(initialPatientJourney);

  const [testimonials, setTestimonials] = useState<PatientTestimonial[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_testimonials`) ||
        localStorage.getItem('dr_priyanka_bhandari_medical_data_v1_testimonials');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t: PatientTestimonial) => ({
            ...t,
            verified: t.verified !== undefined ? t.verified : true
          }));
        }
      }
      return initialTestimonials;
    } catch {
      return initialTestimonials;
    }
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_faqs`) ||
        localStorage.getItem('dr_priyanka_bhandari_medical_data_v1_faqs');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((f: FAQItem) => {
          if (f.id === 'faq-6' || (f.answer && f.answer.includes('09:00 AM'))) {
            return {
              ...f,
              answer: "Our standard consultation hours are Monday to Saturday: 10:00 AM – 01:00 PM & 06:00 PM – 09:00 PM. Sunday consultation timings are 10:00 AM – 01:00 PM (Morning session only)."
            };
          }
          if (f.answer && f.answer.includes('98765')) {
            return {
              ...f,
              answer: f.answer
                .replace('+91 98765 43210', '+91 75066 51415')
                .replace('dr.priyankabhandari@example.com', 'info@priyankabhandari.com')
            };
          }
          return f;
        });
      }
      return initialFAQs;
    } catch {
      return initialFAQs;
    }
  });

  const [clinicContact, setClinicContact] = useState<ClinicContactInfo>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_contact`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.phone && parsed.phone.includes('98765')) {
          return initialClinicContact;
        }
        if (parsed.schedule && parsed.schedule[0]?.morningSlot?.includes('09:00 AM')) {
          return {
            ...parsed,
            schedule: initialClinicContact.schedule
          };
        }
        return parsed;
      }
      return initialClinicContact;
    } catch {
      return initialClinicContact;
    }
  });

  const [appointments, setAppointments] = useState<AppointmentRecord[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_appointments`) ||
        localStorage.getItem('dr_priyanka_bhandari_medical_data_v1_appointments');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          return parsed;
        }
      }
      return initialAppointments;
    } catch {
      return initialAppointments;
    }
  });

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const pastAppointments = appointments.filter(a => a.status !== 'pending');
  const pendingCount = pendingAppointments.length;

  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_settings`) ||
        localStorage.getItem('dr_priyanka_bhandari_medical_data_v1_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...initialWebsiteSettings,
          ...parsed,
          enableWhatsAppReminders: parsed.enableWhatsAppReminders !== undefined ? parsed.enableWhatsAppReminders : true,
          enableSmsReminders: parsed.enableSmsReminders !== undefined ? parsed.enableSmsReminders : true,
          reminderTimingPreference: parsed.reminderTimingPreference || '2_hours',
          reminderTemplate: parsed.reminderTemplate || initialWebsiteSettings.reminderTemplate
        };
      }
      return initialWebsiteSettings;
    } catch {
      return initialWebsiteSettings;
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_services`, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_specializations`, JSON.stringify(specializations));
  }, [specializations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_testimonials`, JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_faqs`, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_contact`, JSON.stringify(clinicContact));
  }, [clinicContact]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_appointments`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  const updateProfile = (updated: Partial<DoctorProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const addService = (newService: Omit<MedicalService, 'id'>) => {
    const id = `service-${Date.now()}`;
    setServices(prev => [
      ...prev,
      {
        ...newService,
        id,
        imageUrl: newService.imageUrl || '/services/general-consultation.svg'
      }
    ]);
  };

  const updateService = (id: string, updated: Partial<MedicalService>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const toggleService = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const updateSpecialization = (id: string, updated: Partial<MedicalSpecialization>) => {
    setSpecializations(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const addTestimonial = (test: Omit<PatientTestimonial, 'id'>) => {
    const id = `test-${Date.now()}`;
    setTestimonials(prev => [
      { ...test, id },
      ...prev
    ]);
  };

  const updateTestimonial = (id: string, updated: Partial<PatientTestimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const toggleTestimonial = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const addFAQ = (faq: Omit<FAQItem, 'id'>) => {
    const id = `faq-${Date.now()}`;
    setFaqs(prev => [...prev, { ...faq, id }]);
  };

  const updateFAQ = (id: string, updated: Partial<FAQItem>) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...updated } : f));
  };

  const deleteFAQ = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  const updateClinicContact = (updated: Partial<ClinicContactInfo>) => {
    setClinicContact(prev => ({ ...prev, ...updated }));
  };

  const bookAppointment = (apt: Omit<AppointmentRecord, 'id' | 'referenceNumber' | 'status' | 'createdAt'>): AppointmentRecord => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `PB-2026-${randomSuffix}`;
    const newRecord: AppointmentRecord = {
      ...apt,
      id: `apt-${Date.now()}`,
      referenceNumber,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newRecord, ...prev]);
    return newRecord;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, adminNotes?: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { 
      ...a, 
      status, 
      ...(adminNotes !== undefined ? { adminNotes } : {}) 
    } : a));
  };

  const approveAppointment = (id: string, adminNotes?: string) => {
    updateAppointmentStatus(id, 'confirmed', adminNotes || 'Confirmed by doctor');
  };

  const cancelAppointment = (id: string, adminNotes?: string) => {
    updateAppointmentStatus(id, 'cancelled', adminNotes || 'Cancelled by clinic');
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string, adminNotes?: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? {
      ...a,
      preferredDate: newDate,
      preferredTime: newTime,
      status: 'confirmed',
      adminNotes: adminNotes || `Rescheduled to ${newDate} at ${newTime}`
    } : a));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const clearPastAppointments = () => {
    setAppointments(prev => prev.filter(a => a.status === 'pending'));
  };

  const updateSettings = (updated: Partial<WebsiteSettings>) => {
    setSettings(prev => ({ ...prev, ...updated }));
  };

  const resetToDefaults = () => {
    if (window.confirm("Reset all medical data and settings to clinic initial defaults?")) {
      setProfile(initialDoctorProfile);
      setServices(initialServices);
      setSpecializations(initialSpecializations);
      setTestimonials(initialTestimonials);
      setFaqs(initialFAQs);
      setClinicContact(initialClinicContact);
      setAppointments(initialAppointments);
      setSettings(initialWebsiteSettings);
      localStorage.clear();
    }
  };

  return (
    <MedicalDataContext.Provider
      value={{
        profile,
        updateProfile,
        services,
        addService,
        updateService,
        deleteService,
        toggleService,
        specializations,
        updateSpecialization,
        whyChoose,
        patientJourney,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        toggleTestimonial,
        faqs,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        clinicContact,
        updateClinicContact,
        appointments,
        pendingAppointments,
        pastAppointments,
        pendingCount,
        bookAppointment,
        updateAppointmentStatus,
        approveAppointment,
        cancelAppointment,
        rescheduleAppointment,
        deleteAppointment,
        clearPastAppointments,
        settings,
        updateSettings,
        resetToDefaults
      }}
    >
      {children}
    </MedicalDataContext.Provider>
  );
};

export const useMedicalData = () => {
  const context = useContext(MedicalDataContext);
  if (!context) {
    throw new Error('useMedicalData must be used within a MedicalDataProvider');
  }
  return context;
};
