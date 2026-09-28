import React, { useState } from 'react';
import { 
  Activity, 
  Calendar, 
  Pill, 
  FileText, 
  Clock, 
  ChevronRight, 
  Download, 
  ShieldCheck, 
  Stethoscope, 
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  FileCheck,
  Heart
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { PrescriptionViewerModal } from './PrescriptionViewerModal';
import { ConsultationRecord, PrescriptionRecord } from '../../types/portal';

interface PatientDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenBookingModal: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onNavigateTab,
  onOpenBookingModal
}) => {
  const { 
    currentPatient, 
    consultations, 
    prescriptions, 
    activeMedicines, 
    medicalHistory, 
    documents, 
    appointments,
    exportHealthSummary 
  } = usePortal();

  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionRecord | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRecord | null>(null);

  // Latest Consultation
  const latestConsultation = consultations.length > 0 ? consultations[0] : null;

  // Upcoming Appointment
  const upcomingAppointment = appointments.find(
    a => a.status === 'Confirmed' || a.status === 'Requested'
  );

  // Filter Active Medicines
  const activeMedsList = activeMedicines.filter(m => m.status === 'Active');

  // Handle Export Health Dossier
  const handleExportRecords = () => {
    const { htmlReport } = exportHealthSummary();
    const blob = new Blob([htmlReport], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Health_Record_${currentPatient?.patientNumber || 'Summary'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openPrescriptionFromLatest = () => {
    if (!latestConsultation) return;
    const rx = prescriptions.find(p => p.consultationId === latestConsultation.id || p.id === latestConsultation.prescriptionId);
    if (rx) {
      setSelectedPrescription(rx);
      setSelectedConsultation(latestConsultation);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>CONFIDENTIAL PATIENT PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, {currentPatient?.fullName || 'Patient'}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-sky-100 font-medium">
              <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10 font-mono">
                Patient ID: {currentPatient?.patientNumber || 'PB-2026-N/A'}
              </span>
              {currentPatient?.bloodGroup && (
                <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
                  Blood Group: {currentPatient.bloodGroup}
                </span>
              )}
              <span className="flex items-center gap-1 text-sky-200">
                <Stethoscope className="w-3.5 h-3.5" />
                Primary Physician: Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS (Hinduja Hospital)
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenBookingModal}
              className="px-4 py-2.5 bg-white text-sky-900 font-bold text-xs rounded-xl shadow-xs hover:bg-sky-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-sky-700" />
              <span>Book Consultation</span>
            </button>
            <button
              onClick={handleExportRecords}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-200" />
              <span>Download My Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Consultations */}
        <div 
          onClick={() => onNavigateTab('consultations')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Consultations
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {consultations.length}
          </div>
          <div className="mt-1 text-xs text-sky-700 flex items-center gap-1 font-medium">
            <span>View timeline</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Active Medicines */}
        <div 
          onClick={() => onNavigateTab('medicines')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Medicines
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {activeMedsList.length}
          </div>
          <div className="mt-1 text-xs text-teal-700 flex items-center gap-1 font-medium">
            <span>View prescription dosages</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Medical History Diagnoses */}
        <div 
          onClick={() => onNavigateTab('history')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Diagnoses on Record
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {medicalHistory.length}
          </div>
          <div className="mt-1 text-xs text-indigo-700 flex items-center gap-1 font-medium">
            <span>Clinical history</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Reports & Documents */}
        <div 
          onClick={() => onNavigateTab('documents')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Reports & Documents
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {documents.length}
          </div>
          <div className="mt-1 text-xs text-purple-700 flex items-center gap-1 font-medium">
            <span>Access lab results</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Latest Consultation & Upcoming Visit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Consultation Card (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-600"></div>
              <h2 className="font-bold text-slate-900 text-base">Latest Clinical Consultation</h2>
            </div>
            <button
              onClick={() => onNavigateTab('consultations')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900"
            >
              All Consultations ({consultations.length}) →
            </button>
          </div>

          {latestConsultation ? (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="px-2.5 py-1 bg-sky-50 text-sky-800 rounded-md font-semibold border border-sky-100">
                  {latestConsultation.consultationType}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {latestConsultation.consultationDate} {latestConsultation.consultationTime && `at ${latestConsultation.consultationTime}`}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Diagnosis / Clinical Assessment
                </span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {latestConsultation.diagnosis}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <span className="font-semibold text-slate-700 block">
                  Doctor's Notes & Advice:
                </span>
                <p className="text-slate-600 leading-relaxed line-clamp-3">
                  {latestConsultation.clinicalNotes}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-600">
                  Follow-up Scheduled: <strong className="text-slate-900">{latestConsultation.followUpDate}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openPrescriptionFromLatest}
                    className="px-3 py-1.5 bg-sky-800 hover:bg-sky-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Prescription</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('consultations')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Full Details
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              No consultation records found. Schedule your first appointment with Dr. Priyanka Bhandari.
            </div>
          )}
        </div>

        {/* Upcoming Appointment Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base">Next Appointment</h2>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                upcomingAppointment?.status === 'Confirmed' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {upcomingAppointment ? upcomingAppointment.status : 'None Scheduled'}
              </span>
            </div>

            {upcomingAppointment ? (
              <div className="mt-4 space-y-4 text-xs">
                <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
                    <Calendar className="w-4 h-4 text-sky-700" />
                    <span>{upcomingAppointment.appointmentDate}</span>
                  </div>
                  <div className="text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{upcomingAppointment.appointmentTime}</span>
                  </div>
                  <div className="text-slate-700 font-medium pt-1">
                    {upcomingAppointment.appointmentType}
                  </div>
                  {upcomingAppointment.notes && (
                    <p className="text-[11px] text-slate-500 italic">
                      "{upcomingAppointment.notes}"
                    </p>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Please arrive 10 minutes before your slot or test your camera if you opted for a tele-consultation.
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs space-y-3">
                <p>You have no pending or upcoming consultations scheduled.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={onOpenBookingModal}
              className="w-full py-2.5 px-3 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule New Consultation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Active Medications Quick Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-700" />
            <h2 className="font-bold text-slate-900 text-base">Current Prescribed Medications</h2>
          </div>
          <button
            onClick={() => onNavigateTab('medicines')}
            className="text-xs font-semibold text-teal-800 hover:text-teal-950"
          >
            Manage Medications →
          </button>
        </div>

        {activeMedsList.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeMedsList.slice(0, 3).map((med) => (
              <div key={med.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold text-sm">{med.medicineName}</strong>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    Active
                  </span>
                </div>
                <div className="text-sky-800 font-semibold">{med.strength} · {med.dosage}</div>
                <div className="text-slate-600 font-medium">{med.frequency} ({med.route})</div>
                <div className="text-[11px] text-slate-500 italic">{med.instructions}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500 text-xs">
            No active prescriptions on record.
          </div>
        )}
      </div>

      {/* Prescription Viewer Modal */}
      {selectedPrescription && (
        <PrescriptionViewerModal
          isOpen={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          prescription={selectedPrescription}
          consultation={selectedConsultation}
          patient={currentPatient}
        />
      )}
    </div>
  );
};
