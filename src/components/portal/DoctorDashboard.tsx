import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  UserCheck, 
  Stethoscope, 
  PlusCircle, 
  FileText, 
  Activity, 
  Calendar, 
  Pill, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Eye,
  Download,
  Trash2,
  Lock,
  History
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { PatientAccount, ConsultationRecord, PrescribedMedicine, AuditLogEntry, MedicalDocumentType } from '../../types/portal';
import { ConsultationType } from '../../types';
import { PrescriptionViewerModal } from './PrescriptionViewerModal';
import { getLocalDateString } from '../../utils/security';

export const DoctorDashboard: React.FC = () => {
  const { 
    allPatients, 
    consultations, 
    prescriptions, 
    medicalHistory, 
    documents, 
    appointments, 
    auditLogs, 
    createConsultation, 
    uploadDocument,
    updateAppointmentStatus,
    recordAuditLog,
    role
  } = usePortal();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'roster' | 'audit' | 'appointments'>('roster');

  // Search patients
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(allPatients[0]?.id || 'pat-101');

  // Selected Patient
  const activePatient = allPatients.find(p => p.id === selectedPatientId) || allPatients[0];

  // Modals
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [viewingPrescription, setViewingPrescription] = useState<any>(null);

  // New Consultation Form State
  const [consType, setConsType] = useState<ConsultationType>('General In-Clinic Consultation');
  const [consDate, setConsDate] = useState(getLocalDateString());
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  
  // Vitals
  const [bp, setBp] = useState('120/80 mmHg');
  const [pulse, setPulse] = useState('74 bpm');
  const [temp, setTemp] = useState('98.4 °F');
  const [spO2, setSpO2] = useState('99%');
  const [weight, setWeight] = useState('70 kg');

  // Medicines List for Prescription
  const [rxItems, setRxItems] = useState<Omit<PrescribedMedicine, 'id' | 'prescriptionId' | 'consultationDate' | 'prescribedBy'>[]>([
    {
      medicineName: 'Paracetamol Tablet',
      strength: '650 mg',
      dosage: '1 Tablet',
      frequency: 'SOS (As needed)',
      route: 'Oral',
      duration: '3 Days',
      instructions: 'After meals',
      startDate: getLocalDateString(),
      endDate: getLocalDateString(new Date(Date.now() + 3 * 86400000)),
      status: 'Active'
    }
  ]);

  const [isSavingCons, setIsSavingCons] = useState(false);
  const [consSuccess, setConsSuccess] = useState(false);

  // Upload Doc Form
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<MedicalDocumentType>('Lab Report');
  const [docSummary, setDocSummary] = useState('');

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return allPatients.filter(p => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.fullName.toLowerCase().includes(q) ||
        p.patientNumber.toLowerCase().includes(q) ||
        p.mobile.includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    });
  }, [allPatients, searchQuery]);

  // Selected patient's records
  const patientConsultations = consultations.filter(c => c.patientId === selectedPatientId);
  const patientPrescriptions = prescriptions.filter(p => p.patientId === selectedPatientId);
  const patientDocs = documents.filter(d => d.patientId === selectedPatientId);
  const patientAppointments = appointments.filter(a => a.patientId === selectedPatientId);

  // Add Medicine Item
  const handleAddMedicine = () => {
    setRxItems(prev => [
      ...prev,
      {
        medicineName: '',
        strength: '',
        dosage: '1 Tablet',
        frequency: 'Twice Daily',
        route: 'Oral',
        duration: '5 Days',
        instructions: 'After food',
        startDate: consDate,
        endDate: '',
        status: 'Active'
      }
    ]);
  };

  const handleUpdateMedicine = (index: number, field: string, value: string) => {
    setRxItems(prev => {
      const copy = [...prev];
      // @ts-expect-error field assignment
      copy[index][field] = value;
      return copy;
    });
  };

  const handleRemoveMedicine = (index: number) => {
    setRxItems(prev => prev.filter((_, i) => i !== index));
  };

  // Save Consultation
  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim() || !chiefComplaint.trim() || !activePatient) return;

    setIsSavingCons(true);
    try {
      const symptomsList = symptomsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const validMedicines = rxItems.filter(m => m.medicineName.trim().length > 0);

      await createConsultation(
        {
          patientId: activePatient.id,
          doctorId: 'doc-priyanka',
          doctorName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
          consultationDate: consDate,
          consultationType: consType,
          chiefComplaint: chiefComplaint.trim(),
          symptoms: symptomsList.length > 0 ? symptomsList : ['Clinical evaluation'],
          diagnosis: diagnosis.trim(),
          clinicalNotes: clinicalNotes.trim() || 'Clinical evaluation performed; instructions given.',
          treatmentPlan: treatmentPlan.trim() || 'Symptomatic medical management.',
          followUpDate: followUpDate || 'As needed',
          vitals: {
            bloodPressure: bp,
            pulseRate: pulse,
            temperature: temp,
            spO2,
            weight
          }
        },
        validMedicines.length > 0 ? validMedicines : undefined
      );

      setConsSuccess(true);
      setTimeout(() => {
        setIsConsultationModalOpen(false);
        setConsSuccess(false);
        setChiefComplaint('');
        setDiagnosis('');
        setClinicalNotes('');
        setTreatmentPlan('');
      }, 1200);
    } catch {
      // error
    } finally {
      setIsSavingCons(false);
    }
  };

  // Handle Upload Doc Submit
  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !activePatient) return;

    await uploadDocument({
      patientId: activePatient.id,
      documentType: docType,
      documentName: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
      uploadedBy: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
      fileSize: '320 KB',
      summaryNotes: docSummary.trim() || undefined,
      mockContent: `Official Clinical Document - Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS (Hinduja Hospital). Patient: ${activePatient.fullName} (${activePatient.patientNumber}).`
    });

    setIsUploadDocModalOpen(false);
    setDocName('');
    setDocSummary('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <Stethoscope className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-2">
              <span>PHYSICIAN & CLINICAL PORTAL</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                GENERAL PHYSICIAN CONSULTANT
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS · Hinduja Hospital
            </h1>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-white/10 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'roster' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Patient Roster</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail Log</span>
          </button>
        </div>
      </div>

      {/* ===================== VIEW 1: PATIENT ROSTER & CLINICAL DOSSIER ===================== */}
      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Patient Search & Roster (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Registered Patients ({allPatients.length})
                </h2>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Live DB
                </span>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, ID, or phone..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden"
                />
              </div>

              {/* Patient List */}
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pt-1">
                {filteredPatients.map((p) => {
                  const isSelected = p.id === selectedPatientId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPatientId(p.id);
                        recordAuditLog('RECORD_VIEWED', `patients/${p.id}`, `Doctor accessed clinical records for ${p.fullName}`);
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between ${
                        isSelected 
                          ? 'bg-sky-50/90 border-sky-400 shadow-xs' 
                          : 'bg-white hover:bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>{p.fullName}</span>
                          {p.bloodGroup && (
                            <span className="text-[10px] px-1.5 bg-slate-100 text-slate-700 rounded font-semibold">
                              {p.bloodGroup}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-sky-800 font-semibold">
                          {p.patientNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {p.gender} · {p.mobile}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-sky-700' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Selected Patient Dossier (8 Cols) */}
          <div className="lg:col-span-8 space-y-5">
            {activePatient ? (
              <>
                {/* Patient Summary Header Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">{activePatient.fullName}</h2>
                        <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                          {activePatient.patientNumber}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-3">
                        <span>DOB: {activePatient.dateOfBirth} ({activePatient.gender})</span>
                        <span>Phone: {activePatient.mobile}</span>
                        <span>Blood: <strong>{activePatient.bloodGroup || 'Not Recorded'}</strong></span>
                      </div>
                    </div>

                    {/* Action Buttons for Doctor */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setIsConsultationModalOpen(true)}
                        className="px-3.5 py-2 bg-sky-800 hover:bg-sky-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>New Consultation & Rx</span>
                      </button>

                      <button
                        onClick={() => setIsUploadDocModalOpen(true)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Upload Lab/Report</span>
                      </button>
                    </div>
                  </div>

                  {/* Medical Highlights Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
                      <span className="font-bold text-red-900 block text-[10px] uppercase">
                        Known Drug Allergies
                      </span>
                      <p className="text-red-800 font-semibold">
                        {activePatient.allergies?.join(', ') || 'No known allergies'}
                      </p>
                    </div>

                    <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl space-y-1">
                      <span className="font-bold text-sky-900 block text-[10px] uppercase">
                        Current Clinical Diagnoses Under Care
                      </span>
                      <p className="text-sky-800 font-semibold">
                        {activePatient.existingConditions?.join(', ') || 'None documented'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consultations History for Patient */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-sky-700" />
                      <span>Consultation Records ({patientConsultations.length})</span>
                    </h3>
                  </div>

                  {patientConsultations.length > 0 ? (
                    <div className="space-y-3">
                      {patientConsultations.map((cons) => {
                        const rx = prescriptions.find(p => p.consultationId === cons.id || p.id === cons.prescriptionId);
                        return (
                          <div key={cons.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <strong className="text-slate-900 font-bold">{cons.consultationDate}</strong>
                                <span className="text-sky-800 font-semibold">· {cons.consultationType}</span>
                              </div>
                              <span className="text-slate-500 font-mono text-[11px]">{cons.id}</span>
                            </div>

                            <div className="text-slate-800 font-bold text-sm">
                              {cons.diagnosis}
                            </div>

                            <p className="text-slate-600 line-clamp-2">
                              {cons.clinicalNotes}
                            </p>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-slate-500">
                                Follow-up: <strong>{cons.followUpDate}</strong>
                              </span>
                              {rx && (
                                <button
                                  onClick={() => setViewingPrescription({ prescription: rx, consultation: cons })}
                                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:text-sky-900 font-semibold text-[11px] flex items-center gap-1"
                                >
                                  <FileText className="w-3 h-3 text-sky-700" />
                                  <span>View Rx ({rx.items.length} items)</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      No consultations on file for this patient. Click "New Consultation & Rx" to create the first record.
                    </div>
                  )}
                </div>

                {/* Patient Documents */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-sky-700" />
                      <span>Uploaded Reports & Documents ({patientDocs.length})</span>
                    </h3>
                  </div>

                  {patientDocs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {patientDocs.map((doc) => (
                        <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[10px] font-bold text-sky-800 uppercase block">{doc.documentType}</span>
                            <strong className="text-slate-900 block truncate">{doc.documentName}</strong>
                            <div className="text-[11px] text-slate-400 mt-1">Uploaded by: {doc.uploadedBy}</div>
                          </div>
                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">{doc.fileSize}</span>
                            <span className="text-sky-800 font-medium">Secured Reference</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      No documents uploaded for this patient.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
                Select a patient from the roster to inspect clinical records.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== VIEW 2: AUDIT TRAIL LOG (Section 18) ===================== */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Security Audit Trail & Access Log</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory regulatory audit log recording authentication events, patient record views, prescription issuance, and data exports.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {auditLogs.length} Events Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Actor / Role</th>
                  <th className="py-2.5 px-3">Resource</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 font-sans">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · {new Date(log.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action.includes('SUCCESS') || log.action.includes('CREATED')
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action.includes('FAILURE') || log.action.includes('BLOCKED')
                          ? 'bg-red-100 text-red-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-sans text-slate-800 font-medium">
                      {log.userIdentifier}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                      {log.resource}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-700 max-w-md">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== NEW CONSULTATION & PRESCRIPTION MODAL ===================== */}
      {isConsultationModalOpen && activePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-sky-700" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    New Clinical Consultation & Prescription Entry
                  </h3>
                  <div className="text-xs text-slate-500">
                    Patient: <strong>{activePatient.fullName}</strong> ({activePatient.patientNumber})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsConsultationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {consSuccess ? (
              <div className="p-8 text-center text-xs space-y-2 text-emerald-800">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <div className="font-bold text-base">Consultation & Prescription Sealed</div>
                <p>The record is now encrypted, stored, and visible to the patient on their dashboard.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveConsultation} className="space-y-4 text-xs">
                {/* Row 1: Type and Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Consultation Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={consType}
                      onChange={(e) => setConsType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden font-medium"
                    >
                      <option value="General In-Clinic Consultation">General In-Clinic Consultation</option>
                      <option value="Preventive Health Assessment">Preventive Health Assessment</option>
                      <option value="Follow-up Consultation">Follow-up Consultation</option>
                      <option value="Women's Health Consultation">Women's Health Consultation</option>
                      <option value="Online / Tele-Consultation">Online / Tele-Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Consultation Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={consDate}
                      onChange={(e) => setConsDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden"
                    />
                  </div>
                </div>

                {/* Vitals Strip */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-2 text-[10px] uppercase">
                    Patient Clinical Vitals
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-500 block">Blood Pressure</label>
                      <input
                        type="text"
                        value={bp}
                        onChange={(e) => setBp(e.target.value)}
                        placeholder="120/80"
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Pulse (bpm)</label>
                      <input
                        type="text"
                        value={pulse}
                        onChange={(e) => setPulse(e.target.value)}
                        placeholder="74 bpm"
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Temp (°F)</label>
                      <input
                        type="text"
                        value={temp}
                        onChange={(e) => setTemp(e.target.value)}
                        placeholder="98.4 °F"
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">SpO2 (%)</label>
                      <input
                        type="text"
                        value={spO2}
                        onChange={(e) => setSpO2(e.target.value)}
                        placeholder="99%"
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Weight</label>
                      <input
                        type="text"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="70 kg"
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Chief Complaint & Symptoms */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Chief Complaint / Reason for Visit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder="e.g. Severe throbbing headache, blurred vision, dizziness for 2 days"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Reported Symptoms (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={symptomsInput}
                    onChange={(e) => setSymptomsInput(e.target.value)}
                    placeholder="e.g. Headache, Photophobia, Nausea"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden"
                  />
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Diagnosis / Clinical Assessment <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Migraine without Aura / Tension-type Exacerbation"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden font-bold"
                  />
                </div>

                {/* Doctor Notes & Treatment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Doctor's Clinical Notes
                    </label>
                    <textarea
                      rows={3}
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      placeholder="Examination findings, neurological reflexes normal, fundoscopy intact..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Treatment Plan & Advice
                    </label>
                    <textarea
                      rows={3}
                      value={treatmentPlan}
                      onChange={(e) => setTreatmentPlan(e.target.value)}
                      placeholder="Dark room rest, hydration, avoidance of screen time..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden resize-none"
                    />
                  </div>
                </div>

                {/* Prescription Section (Section 11 / 14) */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-sky-700" />
                      <span>Electronic Prescription Items (Rx)</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddMedicine}
                      className="px-2.5 py-1 bg-sky-800 text-white rounded font-semibold text-[11px] hover:bg-sky-900"
                    >
                      + Add Medicine
                    </button>
                  </div>

                  <div className="space-y-2">
                    {rxItems.map((med, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-900 text-[11px]">Item #{idx + 1}</span>
                          {rxItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMedicine(idx)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            placeholder="Medicine Name (e.g. Naproxen)"
                            value={med.medicineName}
                            onChange={(e) => handleUpdateMedicine(idx, 'medicineName', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs col-span-2 sm:col-span-1"
                          />
                          <input
                            type="text"
                            placeholder="Strength (e.g. 250 mg)"
                            value={med.strength}
                            onChange={(e) => handleUpdateMedicine(idx, 'strength', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Dosage (e.g. 1 Tab)"
                            value={med.dosage}
                            onChange={(e) => handleUpdateMedicine(idx, 'dosage', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Frequency (e.g. BD / Twice Daily)"
                            value={med.frequency}
                            onChange={(e) => handleUpdateMedicine(idx, 'frequency', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Duration (e.g. 3 Days)"
                            value={med.duration}
                            onChange={(e) => handleUpdateMedicine(idx, 'duration', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Instructions (e.g. After food)"
                            value={med.instructions}
                            onChange={(e) => handleUpdateMedicine(idx, 'instructions', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs col-span-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Follow up date */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Scheduled Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsConsultationModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingCons}
                    className="px-4 py-2 bg-sky-800 text-white rounded-xl font-semibold hover:bg-sky-900 disabled:opacity-50"
                  >
                    {isSavingCons ? 'Sealing Records...' : 'Authorize & Sign Consultation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===================== UPLOAD MEDICAL DOC MODAL ===================== */}
      {isUploadDocModalOpen && activePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">
                Upload Diagnostic Record for {activePatient.fullName}
              </h3>
              <button
                onClick={() => setIsUploadDocModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Fasting Lipid Profile & Renal Function Test"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden"
                >
                  <option value="Lab Report">Lab Report</option>
                  <option value="Scan/Imaging Report">Scan/Imaging Report</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Medical Certificate">Medical Certificate</option>
                  <option value="Consultation Summary">Consultation Summary</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Clinical Summary Findings
                </label>
                <textarea
                  rows={2}
                  value={docSummary}
                  onChange={(e) => setDocSummary(e.target.value)}
                  placeholder="Key investigative values, e.g. Hb 12.8, TSH 2.4 mIU/L"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-hidden resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadDocModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-800 text-white rounded-xl font-semibold hover:bg-sky-900"
                >
                  Upload & Secure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Viewer Modal */}
      {viewingPrescription && (
        <PrescriptionViewerModal
          isOpen={!!viewingPrescription}
          onClose={() => setViewingPrescription(null)}
          prescription={viewingPrescription.prescription}
          consultation={viewingPrescription.consultation}
          patient={activePatient}
        />
      )}
    </div>
  );
};
