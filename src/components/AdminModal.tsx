import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User, 
  Briefcase, 
  Calendar, 
  Phone, 
  Clock, 
  MessageSquare, 
  HelpCircle, 
  Settings, 
  Plus, 
  Trash2, 
  Check, 
  Edit3, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Save,
  RotateCcw,
  Bell,
  Send,
  MessageCircle,
  CheckCircle2,
  Search,
  CalendarCheck,
  PhoneCall,
  AlertTriangle,
  Filter,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';
import { MedicalService, AppointmentRecord, FAQItem, PatientTestimonial, AppointmentStatus } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    profile,
    updateProfile,
    services,
    addService,
    updateService,
    deleteService,
    toggleService,
    appointments,
    pendingAppointments,
    pastAppointments,
    pendingCount,
    updateAppointmentStatus,
    approveAppointment,
    cancelAppointment,
    rescheduleAppointment,
    deleteAppointment,
    clearPastAppointments,
    clinicContact,
    updateClinicContact,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonial,
    faqs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    settings,
    updateSettings,
    resetToDefaults
  } = useMedicalData();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'pending' | 'appointments' | 'profile' | 'services' | 'contact' | 'testimonials' | 'faqs' | 'settings'
  >('pending');

  // Search in Pending Requests
  const [pendingSearch, setPendingSearch] = useState('');

  // Reschedule Dialog State
  const [reschedulingApt, setReschedulingApt] = useState<AppointmentRecord | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleTime, setNewRescheduleTime] = useState('10:30 AM');
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Approval Note Dialog State (e.g. token assignment)
  const [approvingApt, setApprovingApt] = useState<AppointmentRecord | null>(null);
  const [tokenNote, setTokenNote] = useState('');

  // Appointment filter for "All Appointments" tab
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | AppointmentStatus>('all');

  // Edit Service State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('');
  const [newServiceShortDesc, setNewServiceShortDesc] = useState('');

  // Add FAQ State
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Add Testimonial State
  const [newTestimonialName, setNewTestimonialName] = useState('');
  const [newTestimonialReview, setNewTestimonialReview] = useState('');

  // Notification Banner
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const showSaveSuccess = (msg: string = 'Changes updated successfully.') => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleSendReminder = (apt: AppointmentRecord) => {
    const template = settings.reminderTemplate || 
      "Hello {patientName}, this is a reminder for your upcoming medical consultation with Dr. Priyanka Bhandari on {date} at {time}. Clinic: Shop No. 3, Divya CHS LTD, Malad East, Mumbai. Ref: {referenceNumber}.";
    
    const formatted = template
      .replace('{patientName}', apt.patientName)
      .replace('{date}', apt.preferredDate)
      .replace('{time}', apt.preferredTime)
      .replace('{referenceNumber}', apt.referenceNumber)
      .replace('{clinicAddress}', `${clinicContact.addressLine1}, ${clinicContact.city}`);

    const cleanNum = apt.mobileNumber.replace(/[^+\d]/g, '');
    const url = `https://wa.me/${cleanNum.replace('+', '')}?text=${encodeURIComponent(formatted)}`;
    window.open(url, '_blank');
    showSaveSuccess(`Reminder draft dispatched for ${apt.patientName}.`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === '1234' || passcode.trim() === 'clinic' || passcode.trim() === 'admin' || passcode === '') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. Hint: Use 1234 or leave blank for demo preview.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-sm">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Clinic Staff & Administration Portal
              </h2>
              <p className="text-xs text-slate-400">
                Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS · General Physician Consultant, Hinduja Hospital
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close Admin Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Authenticated Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-sky-50 text-sky-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Staff Authentication
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Authorized medical practice staff and administrator login.
              </p>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter Staff Passcode (Default: 1234)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-center text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-700"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-xs text-rose-600 mt-2 font-medium">{authError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-sky-800 hover:bg-sky-900 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors"
                >
                  Enter Portal
                </button>
                <button
                  type="button"
                  onClick={() => setIsAuthenticated(true)}
                  className="text-xs text-slate-500 hover:text-sky-800 underline"
                >
                  Quick Demo Access (Skip Passcode)
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
            
            {/* Left Sidebar Navigation */}
            <div className="w-full md:w-60 bg-slate-50 border-r border-slate-200 p-3 sm:p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap text-left ${
                  activeTab === 'pending'
                    ? 'bg-amber-600 text-white shadow-2xs font-bold'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Pending Requests</span>
                </div>
                {pendingCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === 'pending'
                      ? 'bg-white text-amber-900'
                      : 'bg-amber-100 text-amber-950 border border-amber-300'
                  }`}>
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap text-left ${
                  activeTab === 'appointments'
                    ? 'bg-sky-800 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>All Appointments</span>
                </div>
                <span className={`text-[11px] font-mono ${activeTab === 'appointments' ? 'text-sky-200' : 'text-slate-400'}`}>
                  {appointments.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap text-left ${
                  activeTab === 'profile'
                    ? 'bg-sky-800 text-white'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>Doctor Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap text-left ${
                  activeTab === 'services'
                    ? 'bg-sky-800 text-white'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>Services ({services.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap text-left ${
                  activeTab === 'contact'
                    ? 'bg-sky-800 text-white'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>Contact & Timings</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('testimonials')}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap text-left ${
                  activeTab === 'testimonials'
                    ? 'bg-sky-800 text-white'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Testimonials ({testimonials.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('faqs')}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap text-left ${
                  activeTab === 'faqs'
                    ? 'bg-sky-800 text-white'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>FAQs ({faqs.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap text-left ${
                  activeTab === 'settings'
                    ? 'bg-sky-800 text-white'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Site Settings</span>
              </button>

              <div className="mt-auto pt-4 hidden md:block">
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-medium text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Data</span>
                </button>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-white">
              
              {saveSuccessMsg && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* TAB 0: PENDING APPOINTMENT REQUESTS (DOCTOR REVIEW SECTION) */}
              {activeTab === 'pending' && (
                <div className="space-y-6">
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          Pending Patient Appointment Requests
                        </h3>
                        {pendingCount > 0 ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                            {pendingCount} Awaiting Review
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            All Caught Up
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Incoming consultation requests submitted via the clinic website requiring Dr. Priyanka Bhandari's slot confirmation.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('appointments')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-sky-800" />
                        <span>All & Past Records ({appointments.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70 block">
                        Action Required
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-black text-amber-900">{pendingCount}</span>
                        <span className="text-xs text-amber-800 font-medium">Pending Requests</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900/70 block">
                        Confirmed / Scheduled
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-black text-teal-900">
                          {appointments.filter(a => a.status === 'confirmed').length}
                        </span>
                        <span className="text-xs text-teal-800 font-medium">Active Bookings</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Completed Past Visits
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-black text-slate-800">
                          {appointments.filter(a => a.status === 'completed').length}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">Consultations</span>
                      </div>
                    </div>
                  </div>

                  {/* Search bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search pending requests by patient name, phone, reference number, or health concern..."
                      value={pendingSearch}
                      onChange={(e) => setPendingSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-700"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>

                  {/* List of pending requests */}
                  {pendingAppointments.filter(apt => {
                    if (!pendingSearch.trim()) return true;
                    const q = pendingSearch.toLowerCase();
                    return apt.patientName.toLowerCase().includes(q) ||
                      apt.referenceNumber.toLowerCase().includes(q) ||
                      apt.mobileNumber.includes(q) ||
                      apt.message.toLowerCase().includes(q) ||
                      apt.consultationType.toLowerCase().includes(q);
                  }).length === 0 ? (
                    <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                      <h4 className="font-bold text-slate-900 text-sm">
                        {pendingCount === 0 ? 'No Pending Appointment Requests' : 'No matching pending requests'}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {pendingCount === 0 
                          ? 'All incoming patient appointment requests have been approved or processed. You can review confirmed visits in the All Appointments tab.'
                          : `No pending requests match "${pendingSearch}".`}
                      </p>
                      {pendingSearch && (
                        <button
                          type="button"
                          onClick={() => setPendingSearch('')}
                          className="text-xs text-sky-800 font-semibold hover:underline"
                        >
                          Clear Search Filter
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingAppointments
                        .filter(apt => {
                          if (!pendingSearch.trim()) return true;
                          const q = pendingSearch.toLowerCase();
                          return apt.patientName.toLowerCase().includes(q) ||
                            apt.referenceNumber.toLowerCase().includes(q) ||
                            apt.mobileNumber.includes(q) ||
                            apt.message.toLowerCase().includes(q) ||
                            apt.consultationType.toLowerCase().includes(q);
                        })
                        .map((apt) => (
                          <div
                            key={apt.id}
                            className="p-5 rounded-2xl border-2 border-amber-200/90 bg-amber-50/20 hover:bg-white transition-all shadow-2xs space-y-4"
                          >
                            {/* Card Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-slate-900 text-base">
                                    {apt.patientName}
                                  </h4>
                                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                    {apt.referenceNumber}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                    Pending Review
                                  </span>
                                </div>
                                <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                                  <span className="inline-flex items-center gap-1 font-semibold text-sky-950">
                                    <Calendar className="w-3.5 h-3.5 text-sky-700" />
                                    <span>Requested: <strong>{apt.preferredDate}</strong> at <strong>{apt.preferredTime}</strong></span>
                                  </span>
                                  <span>·</span>
                                  <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-900 border border-sky-200 text-[11px] font-medium">
                                    {apt.consultationType}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right text-[11px] text-slate-400 font-mono">
                                Submitted: {apt.createdAt ? apt.createdAt.split('T')[0] : 'Recently'}
                              </div>
                            </div>

                            {/* Patient Health Concern / Medical Reason */}
                            <div className="p-3.5 rounded-xl bg-white border border-amber-200/80 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Briefcase className="w-3 h-3 text-amber-700" />
                                <span>Patient Stated Health Concern / Symptoms:</span>
                              </span>
                              <p className="text-xs text-slate-800 font-medium italic leading-relaxed">
                                "{apt.message || 'General medical consultation requested.'}"
                              </p>
                            </div>

                            {/* Patient Contact & Reminder Opt-In Strip */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
                              <div>
                                <span className="font-bold text-slate-400 block text-[10px] uppercase">Patient Contact Info</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <a href={`tel:${apt.mobileNumber}`} className="font-bold text-sky-800 hover:underline">
                                    {apt.mobileNumber}
                                  </a>
                                  {apt.email && <span className="text-slate-500 font-mono text-[11px]">({apt.email})</span>}
                                </div>
                              </div>

                              <div>
                                <span className="font-bold text-slate-400 block text-[10px] uppercase">Automated Reminder</span>
                                <div className="mt-0.5">
                                  {apt.reminderOptIn ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                                      <Bell className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Opted in via {apt.reminderChannel === 'both' ? 'WhatsApp & SMS' : apt.reminderChannel === 'sms' ? 'SMS Text' : 'WhatsApp'}</span>
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 italic text-[11px]">No automated reminder opted</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Doctor Action Controls */}
                            <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    approveAppointment(apt.id, 'Confirmed by doctor. Token issued.');
                                    showSaveSuccess(`Approved and confirmed slot for ${apt.patientName}.`);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Approve & Confirm Slot</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setReschedulingApt(apt);
                                    setNewRescheduleDate(apt.preferredDate);
                                    setNewRescheduleTime(apt.preferredTime);
                                    setRescheduleReason('');
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs shadow-2xs transition-colors"
                                >
                                  <Calendar className="w-3.5 h-3.5 text-sky-700" />
                                  <span>Reschedule Slot</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSendReminder(apt)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold text-xs transition-colors"
                                  title="Dispatch WhatsApp Confirmation"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>WhatsApp Confirmation</span>
                                </button>

                                <a
                                  href={`tel:${apt.mobileNumber.replace(/[^+\d]/g, '')}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                                >
                                  <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                                  <span>Call Patient</span>
                                </a>
                              </div>

                              <div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Decline appointment request for ${apt.patientName}?`)) {
                                      cancelAppointment(apt.id, 'Declined by clinic due to schedule conflict');
                                      showSaveSuccess(`Request for ${apt.patientName} was declined.`);
                                    }
                                  }}
                                  className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>

                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 1: ALL APPOINTMENTS & PAST RECORDS */}
              {activeTab === 'appointments' && (
                <div className="space-y-6">
                  {/* Pending Alert Banner in All Appointments */}
                  {pendingCount > 0 && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 text-amber-950">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                          <span className="font-bold block">
                            Doctor Action Required: You have {pendingCount} pending consultation request(s).
                          </span>
                          <span className="text-amber-800">
                            Patients are waiting for slot confirmation and token allocation.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('pending')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0 self-start sm:self-auto shadow-2xs"
                      >
                        Review Pending Requests →
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        All Patient Appointment Records
                      </h3>
                      <p className="text-xs text-slate-500">
                        Full local history of pending, confirmed, completed, and cancelled consultation bookings.
                      </p>
                    </div>

                    {/* Filter segmented buttons */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
                      {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setAppointmentFilter(status)}
                          className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                            appointmentFilter === status
                              ? 'bg-white text-slate-900 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {status} {status === 'pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  {appointments
                    .filter(a => appointmentFilter === 'all' || a.status === appointmentFilter)
                    .length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-sm">
                      No {appointmentFilter !== 'all' ? appointmentFilter : ''} appointments found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {appointments
                        .filter(a => appointmentFilter === 'all' || a.status === appointmentFilter)
                        .map((apt) => (
                          <div
                            key={apt.id}
                            className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-slate-900 text-sm">
                                    {apt.patientName}
                                  </h4>
                                  <span className="text-xs font-mono text-slate-400">
                                    ({apt.referenceNumber})
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  {apt.consultationType} · Requested for <strong className="text-slate-700">{apt.preferredDate}</strong> at <strong className="text-slate-700">{apt.preferredTime}</strong>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                                    apt.status === 'confirmed'
                                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                      : apt.status === 'completed'
                                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                      : apt.status === 'cancelled'
                                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}
                                >
                                  {apt.status}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-100">
                              <div>
                                <span className="font-medium text-slate-400">Contact:</span>{' '}
                                <a href={`tel:${apt.mobileNumber}`} className="text-sky-800 hover:underline">
                                  {apt.mobileNumber}
                                </a>
                                {apt.email && ` · ${apt.email}`}
                              </div>
                              <div>
                                <span className="font-medium text-slate-400">Health Concern:</span>{' '}
                                <span className="italic">{apt.message || 'None stated'}</span>
                              </div>
                              <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-slate-400">Automated Reminder:</span>
                                  {apt.reminderOptIn ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                                      <Bell className="w-3 h-3 text-emerald-600" />
                                      {apt.reminderChannel === 'both' ? 'WhatsApp & SMS' : apt.reminderChannel === 'sms' ? 'SMS Text' : 'WhatsApp'}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 italic text-[11px]">Not Opted In</span>
                                  )}
                                </div>

                                {apt.reminderOptIn && (
                                  <button
                                    type="button"
                                    onClick={() => handleSendReminder(apt)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold transition-colors"
                                  >
                                    <Send className="w-3 h-3 text-sky-600" />
                                    <span>Send Reminder Now</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Status Changer Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateAppointmentStatus(apt.id, 'confirmed');
                                    showSaveSuccess(`Appointment for ${apt.patientName} confirmed.`);
                                  }}
                                  className="px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-md transition-colors border border-teal-200"
                                >
                                  Approve / Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateAppointmentStatus(apt.id, 'completed');
                                    showSaveSuccess(`Marked appointment as completed.`);
                                  }}
                                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-md transition-colors border border-blue-200"
                                >
                                  Mark Completed
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateAppointmentStatus(apt.id, 'cancelled');
                                    showSaveSuccess(`Appointment marked cancelled.`);
                                  }}
                                  className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-md transition-colors border border-rose-200"
                                >
                                  Cancel
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete record for ${apt.patientName}?`)) {
                                    deleteAppointment(apt.id);
                                    showSaveSuccess('Appointment record removed.');
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Delete appointment record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: DOCTOR PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Edit Doctor Profile</h3>
                    <p className="text-xs text-slate-500">
                      Configure credentials, biography, clinical philosophy, and custom photo URL.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Doctor Name</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => updateProfile({ name: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Medical Qualification</label>
                        <input
                          type="text"
                          value={profile.qualification}
                          onChange={(e) => updateProfile({ qualification: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Subheading / Banner Slogan</label>
                      <input
                        type="text"
                        value={profile.subheading}
                        onChange={(e) => updateProfile({ subheading: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Short Introduction</label>
                      <textarea
                        rows={2}
                        value={profile.shortBio}
                        onChange={(e) => updateProfile({ shortBio: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Doctor Photo URL (Optional, fallback provided if empty)
                      </label>
                      <input
                        type="url"
                        value={profile.photoUrl}
                        onChange={(e) => updateProfile({ photoUrl: e.target.value })}
                        placeholder="https://example.com/doctor-portrait.jpg"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Clinical Approach</label>
                      <textarea
                        rows={2}
                        value={profile.approachToCare}
                        onChange={(e) => updateProfile({ approachToCare: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Professional Philosophy</label>
                      <textarea
                        rows={2}
                        value={profile.philosophy}
                        onChange={(e) => updateProfile({ philosophy: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => showSaveSuccess('Doctor profile updated.')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-800 text-white font-semibold rounded-lg text-xs"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Profile Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SERVICES */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Manage Medical Services</h3>
                    <p className="text-xs text-slate-500">
                      Enable, disable, edit or add services displayed on the public site.
                    </p>
                  </div>

                  {/* Add Service Section */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add New Service</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <input
                        type="text"
                        placeholder="Service Name (e.g. Senior Health Assessment)"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Category (e.g. Geriatric Care)"
                        value={newServiceCategory}
                        onChange={(e) => setNewServiceCategory(e.target.value)}
                        className="p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Short description for card..."
                      value={newServiceShortDesc}
                      onChange={(e) => setNewServiceShortDesc(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newServiceName.trim()) {
                          addService({
                            name: newServiceName.trim(),
                            category: newServiceCategory.trim() || 'General',
                            shortDescription: newServiceShortDesc.trim() || 'Professional consultation service.',
                            fullDescription: newServiceShortDesc.trim() || 'Comprehensive medical evaluation.',
                            whatToExpect: ['Detailed symptom review', 'Clinical vitals check'],
                            preparationTips: ['Bring previous records'],
                            estimatedDuration: '20–30 mins',
                            iconName: 'Stethoscope',
                            imageUrl: '/services/general-consultation.svg',
                            enabled: true
                          });
                          setNewServiceName('');
                          setNewServiceCategory('');
                          setNewServiceShortDesc('');
                          showSaveSuccess('New service added.');
                        }
                      }}
                      className="px-4 py-2 bg-sky-800 text-white rounded-lg text-xs font-semibold"
                    >
                      + Add Service
                    </button>
                  </div>

                  {/* Existing Services List */}
                  <div className="space-y-3">
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
                          svc.enabled ? 'bg-white border-slate-200' : 'bg-slate-100/70 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={svc.imageUrl || `/services/${svc.id}.svg`}
                            alt={svc.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-11 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/services/general-consultation.svg';
                            }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900 truncate">{svc.name}</h4>
                              <span className="text-[11px] px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 font-medium shrink-0">
                                {svc.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{svc.shortDescription}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              toggleService(svc.id);
                              showSaveSuccess(`Toggled ${svc.name}`);
                            }}
                            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                              svc.enabled
                                ? 'bg-teal-50 border-teal-200 text-teal-800'
                                : 'bg-slate-200 border-slate-300 text-slate-600'
                            }`}
                          >
                            {svc.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{svc.enabled ? 'Active' : 'Hidden'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete service ${svc.name}?`)) {
                                deleteService(svc.id);
                                showSaveSuccess('Service deleted.');
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CONTACT & TIMINGS */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Clinic Contact & Hours</h3>
                    <p className="text-xs text-slate-500">
                      Update phone numbers, WhatsApp, clinic address, and consultation schedule.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Clinic Phone</label>
                        <input
                          type="text"
                          value={clinicContact.phone}
                          onChange={(e) => updateClinicContact({ phone: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">WhatsApp Number (with country code)</label>
                        <input
                          type="text"
                          value={clinicContact.whatsapp}
                          onChange={(e) => updateClinicContact({ whatsapp: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={clinicContact.email}
                          onChange={(e) => updateClinicContact({ email: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Emergency Helpline</label>
                        <input
                          type="text"
                          value={clinicContact.emergencyNumber}
                          onChange={(e) => updateClinicContact({ emergencyNumber: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Clinic Address Line 1</label>
                      <input
                        type="text"
                        value={clinicContact.addressLine1}
                        onChange={(e) => updateClinicContact({ addressLine1: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">City</label>
                        <input
                          type="text"
                          value={clinicContact.city}
                          onChange={(e) => updateClinicContact({ city: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">State & Zip</label>
                        <input
                          type="text"
                          value={clinicContact.stateZip}
                          onChange={(e) => updateClinicContact({ stateZip: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => showSaveSuccess('Contact details updated.')}
                        className="px-5 py-2.5 bg-sky-800 text-white font-semibold rounded-lg text-xs"
                      >
                        Save Contact Details
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Manage Patient Testimonials</h3>
                      <p className="text-xs text-slate-500">
                        Enable/disable, review, or add patient feedback.
                      </p>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableTestimonials}
                        onChange={(e) => updateSettings({ enableTestimonials: e.target.checked })}
                        className="rounded text-sky-800"
                      />
                      <span>Show Testimonials on Website</span>
                    </label>
                  </div>

                  {/* Add Testimonial */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <h4 className="font-bold uppercase tracking-wider text-slate-700">Add Testimonial</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Patient Initials / Name (e.g. S. Sharma)"
                        value={newTestimonialName}
                        onChange={(e) => setNewTestimonialName(e.target.value)}
                        className="p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Review text..."
                        value={newTestimonialReview}
                        onChange={(e) => setNewTestimonialReview(e.target.value)}
                        className="p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (newTestimonialName.trim() && newTestimonialReview.trim()) {
                          addTestimonial({
                            patientName: newTestimonialName.trim(),
                            initials: newTestimonialName.trim().substring(0, 2).toUpperCase(),
                            review: newTestimonialReview.trim(),
                            rating: 5,
                            date: 'Just now',
                            consultationType: 'General Consultation',
                            enabled: true
                          });
                          setNewTestimonialName('');
                          setNewTestimonialReview('');
                          showSaveSuccess('Testimonial added.');
                        }
                      }}
                      className="px-4 py-2 bg-sky-800 text-white rounded-lg font-semibold"
                    >
                      + Add Testimonial
                    </button>
                  </div>

                  {/* Testimonial List */}
                  <div className="space-y-3">
                    {testimonials.map((t) => (
                      <div key={t.id} className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                        <div className="text-xs space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{t.patientName}</span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">
                              ★ {t.rating}.0
                            </span>
                            {t.consultationType && (
                              <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-medium text-[10px]">
                                {t.consultationType}
                              </span>
                            )}
                            {t.isDirectSubmission && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                Direct Patient Review
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 italic mt-0.5 line-clamp-2">"{t.review}"</p>
                          <div className="text-[10px] text-slate-400">
                            {t.date} {t.location ? `· ${t.location}` : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleTestimonial(t.id)}
                            className={`px-2 py-1 text-xs rounded-md font-semibold border ${
                              t.enabled
                                ? 'bg-teal-50 border-teal-200 text-teal-800'
                                : 'bg-slate-100 border-slate-300 text-slate-500'
                            }`}
                          >
                            {t.enabled ? 'Active' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete review from ${t.patientName}?`)) {
                                deleteTestimonial(t.id);
                                showSaveSuccess('Review deleted.');
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: FAQS */}
              {activeTab === 'faqs' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Manage FAQs</h3>
                    <p className="text-xs text-slate-500">
                      Add, update or remove frequently asked questions.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <h4 className="font-bold uppercase tracking-wider text-slate-700">Add New FAQ</h4>
                    <input
                      type="text"
                      placeholder="Question..."
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                    <textarea
                      rows={2}
                      placeholder="Answer..."
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newFaqQuestion.trim() && newFaqAnswer.trim()) {
                          addFAQ({
                            question: newFaqQuestion.trim(),
                            answer: newFaqAnswer.trim(),
                            category: 'general'
                          });
                          setNewFaqQuestion('');
                          setNewFaqAnswer('');
                          showSaveSuccess('FAQ added.');
                        }
                      }}
                      className="px-4 py-2 bg-sky-800 text-white rounded-lg font-semibold"
                    >
                      + Add Question
                    </button>
                  </div>

                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <div key={faq.id} className="p-4 bg-white rounded-xl border border-slate-200 flex items-start justify-between gap-4">
                        <div className="text-xs space-y-1">
                          <h4 className="font-bold text-slate-900">{faq.question}</h4>
                          <p className="text-slate-600">{faq.answer}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteFAQ(faq.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: SITE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Website Global Settings</h3>
                    <p className="text-xs text-slate-500">
                      Announcement bars, emergency banners, and portal options.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="flex items-center gap-2 font-bold text-slate-700 mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.showAnnouncement}
                          onChange={(e) => updateSettings({ showAnnouncement: e.target.checked })}
                          className="rounded text-sky-800"
                        />
                        <span>Enable Announcement Banner at Top of Page</span>
                      </label>
                      <input
                        type="text"
                        value={settings.announcementNotice}
                        onChange={(e) => updateSettings({ announcementNotice: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                      />
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emergencyNoticeActive}
                          onChange={(e) => updateSettings({ emergencyNoticeActive: e.target.checked })}
                          className="rounded text-sky-800"
                        />
                        <span>Show Emergency Medical Notice Banner</span>
                      </label>
                    </div>

                    {/* Automated Reminders Configuration Section */}
                    <div className="pt-5 border-t border-slate-200 space-y-4">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-sky-800" />
                        <h4 className="font-bold uppercase tracking-wider text-slate-800">
                          Automated Appointment Reminders (WhatsApp & SMS)
                        </h4>
                      </div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Configure reminder channels available to patients during appointment booking, dispatch schedule, and message template.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <label className="flex items-center gap-2.5 font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableWhatsAppReminders ?? true}
                            onChange={(e) => updateSettings({ enableWhatsAppReminders: e.target.checked })}
                            className="rounded text-emerald-700 w-4 h-4"
                          />
                          <div className="flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Enable WhatsApp Reminders</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-2.5 font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableSmsReminders ?? true}
                            onChange={(e) => updateSettings({ enableSmsReminders: e.target.checked })}
                            className="rounded text-sky-800 w-4 h-4"
                          />
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-sky-600" />
                            <span>Enable SMS Reminders</span>
                          </div>
                        </label>
                      </div>

                      {/* Reminder Timing Selector */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5">
                          Automated Reminder Dispatch Schedule
                        </label>
                        <select
                          value={settings.reminderTimingPreference || '2_hours'}
                          onChange={(e) => updateSettings({ reminderTimingPreference: e.target.value as any })}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs"
                        >
                          <option value="2_hours">2 hours prior to scheduled consultation</option>
                          <option value="24_hours">24 hours before consultation</option>
                          <option value="morning_of">Morning of appointment (at 08:00 AM)</option>
                        </select>
                      </div>

                      {/* Reminder Message Template */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <label className="block font-bold text-slate-700">
                            Reminder Notification Template
                          </label>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Placeholders: {'{patientName}'}, {'{date}'}, {'{time}'}, {'{clinicAddress}'}, {'{referenceNumber}'}
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={settings.reminderTemplate || "Hello {patientName}, this is a reminder for your upcoming medical consultation with Dr. Priyanka Bhandari on {date} at {time}. Clinic: Shop No. 3, Divya CHS LTD, Malad East, Mumbai. Ref: {referenceNumber}."}
                          onChange={(e) => updateSettings({ reminderTemplate: e.target.value })}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-sans leading-relaxed"
                        />
                      </div>

                      {/* Live Template Preview */}
                      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Patient Message Preview</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-2.5 rounded-lg border border-emerald-100">
                          "{(settings.reminderTemplate || "Hello {patientName}, this is a reminder for your upcoming medical consultation with Dr. Priyanka Bhandari on {date} at {time}. Clinic: Shop No. 3, Divya CHS LTD, Malad East, Mumbai. Ref: {referenceNumber}.")
                            .replace('{patientName}', 'Rajesh Kumar')
                            .replace('{date}', '28 Sep 2026')
                            .replace('{time}', '10:30 AM')
                            .replace('{referenceNumber}', 'PB-2026-0814')
                            .replace('{clinicAddress}', `${clinicContact.addressLine1}, ${clinicContact.city}`)}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={resetToDefaults}
                        className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold hover:bg-rose-100"
                      >
                        Reset All Demo Data
                      </button>

                      <button
                        type="button"
                        onClick={() => showSaveSuccess('Settings saved successfully.')}
                        className="px-5 py-2.5 bg-sky-800 text-white font-semibold rounded-lg text-xs"
                      >
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
