import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Stethoscope, 
  X,
  Phone
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { PortalAppointment, PortalAppointmentStatus } from '../../types/portal';
import { ConsultationType } from '../../types';
import { AnimatedSuccessCheckmark } from '../AnimatedSuccessCheckmark';

export const AppointmentsView: React.FC = () => {
  const { 
    appointments, 
    currentPatient, 
    bookAppointment, 
    updateAppointmentStatus, 
    recordAuditLog 
  } = usePortal();

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('10:30 AM');
  const [bookType, setBookType] = useState<ConsultationType>('General In-Clinic Consultation');
  const [bookNotes, setBookNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookSuccess, setBookSuccess] = useState(false);

  // Group upcoming vs previous
  const upcomingList = appointments.filter(
    a => a.status === 'Requested' || a.status === 'Confirmed' || a.status === 'Rescheduled'
  );

  const previousList = appointments.filter(
    a => a.status === 'Completed' || a.status === 'Cancelled'
  );

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookDate || !currentPatient) return;

    setIsBooking(true);
    try {
      await bookAppointment({
        patientId: currentPatient.id,
        doctorId: 'doc-priyanka',
        appointmentDate: bookDate,
        appointmentTime: bookTime,
        appointmentType: bookType,
        notes: bookNotes.trim() || undefined
      });

      setBookSuccess(true);
      setTimeout(() => {
        setIsBookModalOpen(false);
        setBookSuccess(false);
        setBookNotes('');
      }, 1600);
    } catch {
      // error
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelAppointment = async (aptId: string) => {
    if (window.confirm('Are you sure you want to cancel this scheduled consultation?')) {
      await updateAppointmentStatus(aptId, 'Cancelled');
      recordAuditLog('RECORD_VIEWED', `appointments/${aptId}`, 'Patient cancelled appointment');
    }
  };

  const getStatusBadge = (status: PortalAppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Confirmed</span>;
      case 'Requested':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Requested</span>;
      case 'Completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Completed</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">Cancelled</span>;
      case 'Rescheduled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">Rescheduled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            My Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your in-clinic and tele-consultation appointments with Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS (Hinduja Hospital).
          </p>
        </div>
        <button
          onClick={() => setIsBookModalOpen(true)}
          className="px-4 py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Request Appointment</span>
        </button>
      </div>

      {/* Upcoming Visits */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-700" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Upcoming Consultations ({upcomingList.length})
          </h2>
        </div>

        {upcomingList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingList.map((apt) => (
              <div 
                key={apt.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">{apt.appointmentType}</span>
                    {getStatusBadge(apt.status)}
                  </div>

                  <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl space-y-1.5 text-sky-950 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-sky-700" />
                      <strong>{apt.appointmentDate}</strong>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.appointmentTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.doctorName}</span>
                    </div>
                  </div>

                  {apt.notes && (
                    <p className="text-[11px] text-slate-500 italic">
                      Notes: "{apt.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Clinic Desk: +91 98765 43210
                  </span>
                  {apt.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleCancelAppointment(apt.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold"
                    >
                      Cancel Visit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500 space-y-2">
            <Calendar className="w-6 h-6 text-slate-300 mx-auto" />
            <p>You have no upcoming consultations scheduled.</p>
          </div>
        )}
      </div>

      {/* Previous Visits */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Past Consultations ({previousList.length})
          </h2>
        </div>

        {previousList.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {previousList.map((apt) => (
              <div key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-sm">{apt.appointmentDate}</strong>
                    <span className="text-slate-400">· {apt.appointmentTime}</span>
                    {getStatusBadge(apt.status)}
                  </div>
                  <div className="text-slate-600 mt-0.5">{apt.appointmentType}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[11px]">{apt.doctorName}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500">
            No previous consultation history found.
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  Request Consultation Appointment
                </h3>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookSuccess ? (
              <div className="py-8 px-6 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-center">
                  <AnimatedSuccessCheckmark size="lg" variant="teal" withHalo={true} />
                </div>
                <div className="font-bold text-base text-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  Appointment Requested!
                </div>
                <p className="text-xs text-slate-600 max-w-xs mx-auto animate-in fade-in slide-in-from-bottom-2 duration-400">
                  Dr. Priyanka Bhandari's clinic desk will review the slot and confirm your consultation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Consultation Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bookType}
                    onChange={(e) => setBookType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden font-medium"
                  >
                    <option value="General In-Clinic Consultation">General In-Clinic Consultation</option>
                    <option value="Preventive Health Assessment">Preventive Health Assessment</option>
                    <option value="Follow-up Consultation">Follow-up Consultation</option>
                    <option value="Women's Health Consultation">Women's Health Consultation</option>
                    <option value="Online / Tele-Consultation">Online / Tele-Consultation</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Preferred Time Slot <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={bookTime}
                      onChange={(e) => setBookTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden"
                    >
                      <option value="09:30 AM">09:30 AM (Morning)</option>
                      <option value="10:30 AM">10:30 AM (Morning)</option>
                      <option value="11:30 AM">11:30 AM (Morning)</option>
                      <option value="04:30 PM">04:30 PM (Evening)</option>
                      <option value="05:30 PM">05:30 PM (Evening)</option>
                      <option value="06:30 PM">06:30 PM (Evening)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Symptoms or Reason for Visit (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={bookNotes}
                    onChange={(e) => setBookNotes(e.target.value)}
                    placeholder="Brief description for Dr. Priyanka Bhandari..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsBookModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBooking}
                    className="px-4 py-2 bg-sky-800 text-white rounded-xl font-semibold hover:bg-sky-900 disabled:opacity-50"
                  >
                    {isBooking ? 'Submitting...' : 'Confirm Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
