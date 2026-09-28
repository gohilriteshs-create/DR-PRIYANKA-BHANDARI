import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Printer, 
  MessageCircle, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Download,
  Bell,
  Loader2
} from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';
import { ConsultationType, AppointmentRecord, ReminderChannel } from '../types';
import { ToastNotification, ToastData } from './ToastNotification';
import { AnimatedSuccessCheckmark } from './AnimatedSuccessCheckmark';

interface AppointmentSectionProps {
  preselectedService?: string;
  onOpenPatientPortal?: () => void;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({ 
  preselectedService,
  onOpenPatientPortal
}) => {
  const { clinicContact, bookAppointment, settings } = useMedicalData();

  const [patientName, setPatientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:30 AM');
  const [consultationType, setConsultationType] = useState<ConsultationType>('General In-Clinic Consultation');
  const [message, setMessage] = useState('');

  // Reminder Opt-In State (Configurable in Admin Settings)
  const isWhatsAppEnabled = settings.enableWhatsAppReminders ?? true;
  const isSmsEnabled = settings.enableSmsReminders ?? true;
  const isRemindersConfigured = isWhatsAppEnabled || isSmsEnabled;

  const [reminderOptIn, setReminderOptIn] = useState(true);
  const [reminderChannel, setReminderChannel] = useState<ReminderChannel>(() => {
    if (isWhatsAppEnabled && isSmsEnabled) return 'both';
    if (isWhatsAppEnabled) return 'whatsapp';
    if (isSmsEnabled) return 'sms';
    return 'none';
  });

  // Keep reminder channel synced if admin settings change
  useEffect(() => {
    if (isWhatsAppEnabled && isSmsEnabled) {
      setReminderChannel(prev => prev === 'none' ? 'both' : prev);
    } else if (isWhatsAppEnabled) {
      setReminderChannel('whatsapp');
    } else if (isSmsEnabled) {
      setReminderChannel('sms');
    } else {
      setReminderChannel('none');
    }
  }, [isWhatsAppEnabled, isSmsEnabled]);

  const timingText = settings.reminderTimingPreference === '24_hours' 
    ? '24 hours prior to consultation'
    : settings.reminderTimingPreference === 'morning_of'
    ? 'on the morning of your visit at 08:00 AM'
    : '2 hours prior to your scheduled time';

  const [submittedBooking, setSubmittedBooking] = useState<AppointmentRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Toast Notification State
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState<ToastData | null>(null);

  // Sync preselected service from parent if passed
  useEffect(() => {
    if (preselectedService) {
      if (preselectedService.includes('Preventive')) {
        setConsultationType('Preventive Health Assessment');
      } else if (preselectedService.includes('Women')) {
        setConsultationType('Women\'s Health Consultation');
      } else if (preselectedService.includes('Child') || preselectedService.includes('Family')) {
        setConsultationType('Family & Child Health Guidance');
      } else if (preselectedService.includes('Lifestyle') || preselectedService.includes('Wellness')) {
        setConsultationType('Lifestyle & Nutrition Guidance');
      } else if (preselectedService.includes('Follow-up')) {
        setConsultationType('Follow-up Consultation');
      } else {
        setConsultationType('General In-Clinic Consultation');
      }
    }
  }, [preselectedService]);

  // Set default minimum date to today
  const todayStr = new Date().toISOString().split('T')[0];

  const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM'
  ];

  const consultationTypes: ConsultationType[] = [
    'General In-Clinic Consultation',
    'Preventive Health Assessment',
    'Follow-up Consultation',
    'Women\'s Health Consultation',
    'Family & Child Health Guidance',
    'Lifestyle & Nutrition Guidance',
    'Online / Tele-Consultation'
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!patientName.trim()) {
      setErrorMessage('Please enter the patient’s full name.');
      return;
    }

    if (!mobileNumber.trim() || mobileNumber.trim().length < 8) {
      setErrorMessage('Please enter a valid mobile phone number for appointment confirmation.');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address or leave blank.');
      return;
    }

    if (!preferredDate) {
      setErrorMessage('Please select a preferred consultation date.');
      return;
    }

    setIsSubmitting(true);

    try {
      const record = bookAppointment({
        patientName: patientName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim(),
        preferredDate,
        preferredTime,
        consultationType,
        message: message.trim() || 'General medical consultation request.',
        reminderOptIn: isRemindersConfigured ? reminderOptIn : false,
        reminderChannel: isRemindersConfigured && reminderOptIn ? reminderChannel : 'none'
      });

      // Subtle processing delay to give tactile feedback before showing the growing checkmark
      setTimeout(() => {
        setSubmittedBooking(record);
        setToastData({
          referenceNumber: record.referenceNumber,
          patientName: record.patientName,
          consultationType: record.consultationType,
          dateTime: `${record.preferredDate} at ${record.preferredTime}`
        });
        setShowToast(true);
        setIsSubmitting(false);

        // Smoothly bring the appointment slip into focus
        const el = document.getElementById('appointment');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 350);
    } catch {
      setErrorMessage('An unexpected error occurred while booking. Please try WhatsApp or phone.');
      setIsSubmitting(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const cleanWhatsAppNumber = clinicContact.whatsapp.replace(/[^+\d]/g, '');

  const generateWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hello Dr. Priyanka Bhandari Clinic,\n\nI would like to book a medical consultation.\n\n` +
      `• Patient Name: ${patientName || '[Your Name]'}\n` +
      `• Preferred Date: ${preferredDate || '[Preferred Date]'}\n` +
      `• Preferred Slot: ${preferredTime}\n` +
      `• Consultation Type: ${consultationType}\n` +
      (message ? `• Health Concern: ${message}\n` : '') +
      `\nPlease let me know slot availability. Thank you.`
    );
    return `https://wa.me/${cleanWhatsAppNumber.replace('+', '')}?text=${text}`;
  };

  const handleReset = () => {
    setSubmittedBooking(null);
    setShowToast(false);
    setToastData(null);
    setPatientName('');
    setMobileNumber('');
    setEmail('');
    setMessage('');
    setErrorMessage('');
  };

  return (
    <>
      <ToastNotification
        show={showToast}
        data={toastData}
        onClose={() => setShowToast(false)}
        onViewSlip={() => {
          const el = document.getElementById('appointment');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      <section id="appointment" className="py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Convenient Scheduling
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Book Your Consultation
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Request an in-clinic or tele-consultation with Dr. Priyanka Bhandari. Our clinic desk will review and confirm your slot promptly.
          </p>

          {onOpenPatientPortal && (
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs text-sky-900 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
              <span>Already a registered patient?</span>
              <button
                type="button"
                onClick={onOpenPatientPortal}
                className="font-bold underline hover:text-sky-950 cursor-pointer"
              >
                Access Patient Portal & Records →
              </button>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          
          {/* If Booking is Submitted: Rich Confirmation Slip with Subtle Success Animation */}
          {submittedBooking ? (
            <div className="bg-sky-50/50 rounded-2xl p-6 sm:p-10 border border-sky-200/90 shadow-sm animate-in fade-in zoom-in-98 duration-300">
              
              <div className="text-center pb-6 border-b border-sky-100">
                <div className="flex justify-center mb-4">
                  <AnimatedSuccessCheckmark size="lg" variant="teal" withHalo={true} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  Appointment Request Received
                </h3>
                <p className="mt-1 text-sm text-slate-600 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-400">
                  Your consultation request has been queued. Our clinic coordinator will contact you via phone/WhatsApp to confirm.
                </p>

                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-xs font-mono font-bold text-sky-900 shadow-2xs animate-in fade-in zoom-in-95 duration-500">
                  <span>Booking Reference:</span>
                  <span className="text-sky-700">{submittedBooking.referenceNumber}</span>
                </div>
              </div>

              {/* Consultation Details Slip */}
              <div className="mt-6 bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900">Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS</h4>
                    <p className="text-xs text-slate-500">General Physician Consultant · Hinduja Hospital</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                    Pending Confirmation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block font-medium">Patient Name</span>
                    <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{submittedBooking.patientName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block font-medium">Contact Mobile</span>
                    <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{submittedBooking.mobileNumber}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block font-medium">Requested Date & Time</span>
                    <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                      {submittedBooking.preferredDate} at {submittedBooking.preferredTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block font-medium">Consultation Type</span>
                    <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{submittedBooking.consultationType}</span>
                  </div>
                </div>

                {submittedBooking.message && (
                  <div className="pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 uppercase tracking-wider block font-medium">Health Note</span>
                    <p className="text-slate-700 mt-1 italic">{submittedBooking.message}</p>
                  </div>
                )}

                {/* Reminder Opt-In Status on Slip */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="text-slate-400 uppercase tracking-wider font-medium">Automated Reminders</span>
                  <div>
                    {submittedBooking.reminderOptIn ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          Active via {submittedBooking.reminderChannel === 'both' ? 'WhatsApp & SMS' : submittedBooking.reminderChannel === 'sms' ? 'SMS Text' : 'WhatsApp'} ({timingText})
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal italic">
                        Not opted in
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    Clinic Location: {clinicContact.addressLine1}, {clinicContact.addressLine2}, {clinicContact.city}. Please arrive 10 minutes prior with previous reports.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
                >
                  ← Request Another Appointment
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintSlip}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>

                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Confirm via WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          ) : (
            /* Booking Form Container */
            <div className="bg-slate-50/70 rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
              
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Row 1: Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="patientName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Patient Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="patientName"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Ramesh Chandra"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mobileNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        id="mobileNumber"
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Email & Consultation Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. patient@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="consultationType" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Consultation Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="consultationType"
                      value={consultationType}
                      onChange={(e) => setConsultationType(e.target.value as ConsultationType)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent transition-all"
                    >
                      {consultationTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: Date & Preferred Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="preferredDate" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Preferred Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        id="preferredDate"
                        required
                        min={todayStr}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Preferred Time Slot <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <select
                        id="preferredTime"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent transition-all"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row 4: Health Concern / Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Brief Health Concern or Symptoms
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Briefly state symptoms, duration, or if this is a routine checkup / report discussion..."
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent transition-all resize-y"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Your medical information is held in strict clinical confidentiality.
                  </p>
                </div>

                {/* Automated Appointment Reminders Opt-In (Configurable in Admin Settings) */}
                {isRemindersConfigured && (
                  <div className="p-4 sm:p-4.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          id="reminderOptIn"
                          checked={reminderOptIn}
                          onChange={(e) => setReminderOptIn(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-sky-800 focus:ring-sky-700 cursor-pointer mt-0.5"
                        />
                      </div>
                      <label htmlFor="reminderOptIn" className="text-xs text-slate-800 font-semibold cursor-pointer select-none">
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                          <span>Send automated appointment reminders & confirmation updates</span>
                        </div>
                        <span className="block text-[11px] font-normal text-slate-500 mt-1 leading-relaxed">
                          Receive an automated reminder notification with clinic directions, consultation preparation notes, and token details {timingText}.
                        </span>
                      </label>
                    </div>

                    {reminderOptIn && (
                      <div className="pt-2.5 border-t border-slate-200/70 pl-7 space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Receive reminder via:
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {isWhatsAppEnabled && (
                            <button
                              type="button"
                              onClick={() => setReminderChannel('whatsapp')}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                reminderChannel === 'whatsapp'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-1 ring-emerald-400'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </button>
                          )}

                          {isSmsEnabled && (
                            <button
                              type="button"
                              onClick={() => setReminderChannel('sms')}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                reminderChannel === 'sms'
                                  ? 'bg-sky-50 border-sky-300 text-sky-900 ring-1 ring-sky-400'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <Phone className="w-3.5 h-3.5 text-sky-600" />
                              <span>SMS Text</span>
                            </button>
                          )}

                          {isWhatsAppEnabled && isSmsEnabled && (
                            <button
                              type="button"
                              onClick={() => setReminderChannel('both')}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                reminderChannel === 'both'
                                  ? 'bg-indigo-50 border-indigo-300 text-indigo-950 ring-1 ring-indigo-400'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Both (WhatsApp & SMS)</span>
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Dispatched directly to {mobileNumber.trim() ? <span className="font-mono text-slate-700 font-semibold">{mobileNumber}</span> : 'your mobile number'}. Strictly confidential, no promotional messages.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Form Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  
                  {/* Primary Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-sky-800 hover:bg-sky-900 active:bg-sky-950 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 text-sky-200 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 text-sky-200" />
                        <span>Request Appointment</span>
                      </>
                    )}
                  </button>

                  {/* Configurable WhatsApp Action */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Or</span>
                    <a
                      href={generateWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-700" />
                      <span>Book via WhatsApp</span>
                    </a>
                  </div>

                </div>

              </form>
            </div>
          )}

        </div>

      </div>
    </section>
  </>
  );
};
