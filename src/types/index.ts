export type ConsultationType = 
  | 'General In-Clinic Consultation'
  | 'Preventive Health Assessment'
  | 'Follow-up Consultation'
  | 'Women\'s Health Consultation'
  | 'Family & Child Health Guidance'
  | 'Lifestyle & Nutrition Guidance'
  | 'Online / Tele-Consultation';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface DoctorProfile {
  name: string;
  qualification: string;
  designation?: string;
  hospitalAffiliation?: string;
  subheading: string;
  shortBio: string;
  fullBio: string[];
  registrationNumber: string;
  experienceSummary: string;
  approachToCare: string;
  philosophy: string;
  photoUrl: string;
  languages: string[];
  areasOfInterest: string[];
}

export interface MedicalService {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  whatToExpect: string[];
  preparationTips: string[];
  estimatedDuration: string;
  iconName: string;
  enabled: boolean;
  imageUrl?: string;
}

export interface MedicalSpecialization {
  id: string;
  title: string;
  description: string;
  iconName: string;
  keyAspects: string[];
  enabled: boolean;
}

export interface WhyChooseBenefit {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface PatientJourneyStep {
  step: string;
  title: string;
  description: string;
  details: string;
}

export interface PatientTestimonial {
  id: string;
  patientName: string;
  initials: string;
  location?: string;
  review: string;
  rating: number;
  date: string;
  consultationType: string;
  enabled: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'booking' | 'consultation' | 'general' | 'followup';
}

export interface DaySchedule {
  day: string;
  isOpen: boolean;
  morningSlot: string;
  eveningSlot: string;
}

export interface ClinicContactInfo {
  clinicName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateZip: string;
  phone: string;
  whatsapp: string;
  email: string;
  emergencyNumber: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  schedule: DaySchedule[];
}

export type ReminderChannel = 'whatsapp' | 'sms' | 'both' | 'none';

export interface AppointmentRecord {
  id: string;
  referenceNumber: string;
  patientName: string;
  mobileNumber: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  consultationType: ConsultationType;
  message: string;
  status: AppointmentStatus;
  createdAt: string;
  adminNotes?: string;
  reminderOptIn?: boolean;
  reminderChannel?: ReminderChannel;
}

export interface WebsiteSettings {
  announcementNotice: string;
  showAnnouncement: boolean;
  enableTestimonials: boolean;
  enableOnlineBooking: boolean;
  emergencyNoticeActive: boolean;
  enableWhatsAppReminders?: boolean;
  enableSmsReminders?: boolean;
  reminderTimingPreference?: '2_hours' | '24_hours' | 'morning_of';
  reminderTemplate?: string;
}
