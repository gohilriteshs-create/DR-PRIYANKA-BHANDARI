import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  Stethoscope, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  Download, 
  ArrowUpDown, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Activity,
  X
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { ConsultationRecord, PrescriptionRecord } from '../../types/portal';
import { PrescriptionViewerModal } from './PrescriptionViewerModal';

export const ConsultationsView: React.FC = () => {
  const { consultations, prescriptions, currentPatient, recordAuditLog } = usePortal();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Modal State
  const [activeConsultationDetail, setActiveConsultationDetail] = useState<ConsultationRecord | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionRecord | null>(null);
  const [selectedPrescriptionConsultation, setSelectedPrescriptionConsultation] = useState<ConsultationRecord | null>(null);

  // Filtered & Sorted Consultations
  const filteredConsultations = useMemo(() => {
    return consultations
      .filter((cons) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchDiagnosis = cons.diagnosis.toLowerCase().includes(q);
          const matchComplaint = cons.chiefComplaint.toLowerCase().includes(q);
          const matchNotes = cons.clinicalNotes.toLowerCase().includes(q);
          const matchSymptoms = cons.symptoms.some(s => s.toLowerCase().includes(q));
          if (!matchDiagnosis && !matchComplaint && !matchNotes && !matchSymptoms) {
            return false;
          }
        }

        // Type filter
        if (selectedType !== 'all' && cons.consultationType !== selectedType) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.consultationDate).getTime();
        const timeB = new Date(b.consultationDate).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [consultations, searchQuery, selectedType, sortOrder]);

  const handleOpenPrescription = (cons: ConsultationRecord) => {
    const rx = prescriptions.find(p => p.consultationId === cons.id || p.id === cons.prescriptionId);
    if (rx) {
      setSelectedPrescription(rx);
      setSelectedPrescriptionConsultation(cons);
      recordAuditLog('RECORD_VIEWED', `prescriptions/${rx.id}`, `Patient viewed prescription for ${cons.diagnosis}`);
    }
  };

  const handleOpenDetailModal = (cons: ConsultationRecord) => {
    setActiveConsultationDetail(cons);
    recordAuditLog('RECORD_VIEWED', `consultations/${cons.id}`, `Patient viewed consultation details`);
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            My Consultations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chronological timeline of in-person, tele-consultation, and clinical follow-ups with Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS (Hinduja Hospital).
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-medium self-start sm:self-auto">
          Showing <strong>{filteredConsultations.length}</strong> of {consultations.length} records
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search consultation records by symptom, diagnosis, or advice..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="w-full sm:w-56">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
            >
              <option value="all">All Consultation Types</option>
              <option value="General In-Clinic Consultation">General In-Clinic Consultation</option>
              <option value="Preventive Health Assessment">Preventive Health Assessment</option>
              <option value="Follow-up Consultation">Follow-up Consultation</option>
              <option value="Women's Health Consultation">Women's Health Consultation</option>
              <option value="Online / Tele-Consultation">Online / Tele-Consultation</option>
            </select>
          </div>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="px-3.5 py-2 border border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Consultations Timeline / Card List */}
      <div className="space-y-4">
        {filteredConsultations.length > 0 ? (
          filteredConsultations.map((cons) => {
            const hasRx = prescriptions.some(p => p.consultationId === cons.id || p.id === cons.prescriptionId);
            return (
              <div 
                key={cons.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-sky-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 bg-sky-50 text-sky-800 rounded-md font-bold text-xs border border-sky-100">
                      {cons.consultationType}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {cons.consultationDate} {cons.consultationTime && `· ${cons.consultationTime}`}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                    <Stethoscope className="w-3.5 h-3.5 text-sky-700" />
                    <span>{cons.doctorName}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  {/* Chief Complaint */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Chief Complaint / Reason for Visit
                    </span>
                    <div className="text-slate-800 font-semibold text-sm mt-0.5">
                      {cons.chiefComplaint}
                    </div>
                  </div>

                  {/* Symptoms Tags */}
                  {cons.symptoms && cons.symptoms.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Reported Symptoms
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cons.symptoms.map((sym, idx) => (
                          <span 
                            key={idx}
                            className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]"
                          >
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Diagnosis */}
                  <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl">
                    <span className="text-[10px] font-bold text-sky-900 uppercase tracking-wider block">
                      Diagnosis / Clinical Assessment
                    </span>
                    <div className="font-bold text-sky-950 text-sm mt-0.5">
                      {cons.diagnosis}
                    </div>
                  </div>

                  {/* Doctor Notes & Treatment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-1">
                        Doctor's Clinical Notes:
                      </span>
                      <p className="text-slate-600 leading-relaxed line-clamp-3">
                        {cons.clinicalNotes}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-1">
                        Treatment Plan:
                      </span>
                      <p className="text-slate-600 leading-relaxed line-clamp-3">
                        {cons.treatmentPlan}
                      </p>
                    </div>
                  </div>

                  {/* Vitals Strip */}
                  {cons.vitals && (
                    <div className="flex flex-wrap items-center gap-4 p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-sky-700" />
                        Clinical Vitals:
                      </span>
                      {cons.vitals.bloodPressure && <span>BP: <strong>{cons.vitals.bloodPressure}</strong></span>}
                      {cons.vitals.pulseRate && <span>Pulse: <strong>{cons.vitals.pulseRate}</strong></span>}
                      {cons.vitals.temperature && <span>Temp: <strong>{cons.vitals.temperature}</strong></span>}
                      {cons.vitals.spO2 && <span>SpO2: <strong>{cons.vitals.spO2}</strong></span>}
                      {cons.vitals.weight && <span>Weight: <strong>{cons.vitals.weight}</strong></span>}
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Next Follow-up Scheduled: <strong className="text-slate-800">{cons.followUpDate}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDetailModal(cons)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>View Details</span>
                      </button>

                      {hasRx && (
                        <button
                          onClick={() => handleOpenPrescription(cons)}
                          className="px-3.5 py-1.5 bg-sky-800 hover:bg-sky-900 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Prescription</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 text-xs space-y-2">
            <Search className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No matching consultation records found.</p>
            <p>Try modifying your search query or removing type filters.</p>
          </div>
        )}
      </div>

      {/* Consultation Full Detail Modal */}
      {activeConsultationDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">
                  {activeConsultationDetail.consultationType}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">
                  Consultation Record Detail
                </h3>
              </div>
              <button
                onClick={() => setActiveConsultationDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultation Date</span>
                  <strong className="text-slate-800">{activeConsultationDetail.consultationDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Treating Physician</span>
                  <strong className="text-slate-800">{activeConsultationDetail.doctorName}</strong>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Chief Complaint</span>
                <div className="p-3 bg-slate-50 rounded-xl text-slate-800 font-medium">
                  {activeConsultationDetail.chiefComplaint}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Clinical Assessment / Diagnosis</span>
                <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-100 text-sky-950 font-bold text-sm">
                  {activeConsultationDetail.diagnosis}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Doctor's Clinical Notes</span>
                <div className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed whitespace-pre-line">
                  {activeConsultationDetail.clinicalNotes}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Treatment Plan & Patient Advice</span>
                <div className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed whitespace-pre-line">
                  {activeConsultationDetail.treatmentPlan}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="font-medium text-slate-600">Follow-up Date:</span>
                <strong className="text-slate-900">{activeConsultationDetail.followUpDate}</strong>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => handleOpenPrescription(activeConsultationDetail)}
                className="px-4 py-2 bg-sky-800 text-white rounded-xl font-semibold text-xs hover:bg-sky-900 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Prescription</span>
              </button>
              <button
                onClick={() => setActiveConsultationDetail(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Viewer Modal */}
      {selectedPrescription && (
        <PrescriptionViewerModal
          isOpen={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          prescription={selectedPrescription}
          consultation={selectedPrescriptionConsultation}
          patient={currentPatient}
        />
      )}
    </div>
  );
};
