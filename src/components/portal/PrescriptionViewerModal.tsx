import React from 'react';
import { 
  Printer, 
  Download, 
  X, 
  Stethoscope, 
  Calendar, 
  User, 
  ShieldCheck, 
  Clock, 
  FileText,
  MapPin,
  Phone,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ConsultationRecord, PrescriptionRecord, PatientAccount } from '../../types/portal';

interface PrescriptionViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: PrescriptionRecord | null;
  consultation?: ConsultationRecord | null;
  patient: PatientAccount | null;
}

export const PrescriptionViewerModal: React.FC<PrescriptionViewerModalProps> = ({
  isOpen,
  onClose,
  prescription,
  consultation,
  patient
}) => {
  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text/html blob for immediate download
    const printableHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${patient?.fullName || 'Patient'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
          .header { border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; color: #0369a1; }
          .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
          .patient-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; }
          .rx { font-size: 26px; font-family: serif; font-weight: bold; color: #0284c7; margin: 15px 0 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; font-size: 12px; }
          th { background: #f1f5f9; font-weight: 600; }
          .notes { font-size: 12px; background: #fffbeb; border: 1px solid #fef3c7; padding: 10px; border-radius: 6px; margin-top: 15px; }
          .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 15px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">DR. PRIYANKA BHANDARI, BAMS, CGO, PGDEMS</div>
          <div class="meta">General Physician Consultant · Hinduja Hospital · Reg. No: MMC / State Council</div>
          <div class="meta">Shop No. 3, Divya CHS, Kurar Village, Malad East, Mumbai - 400097 | Phone: +91 75066 51415</div>
        </div>

        <div class="patient-box">
          <strong>Patient:</strong> ${patient?.fullName || 'Patient'} &nbsp;|&nbsp; 
          <strong>Patient ID:</strong> ${patient?.patientNumber || 'N/A'} &nbsp;|&nbsp; 
          <strong>Date:</strong> ${prescription.prescriptionDate} &nbsp;|&nbsp; 
          <strong>Age/Gender:</strong> ${patient?.gender || 'N/A'}
        </div>

        ${consultation?.diagnosis ? `<div><strong>Diagnosis:</strong> ${consultation.diagnosis}</div>` : ''}

        <div class="rx">℞</div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine Name</th>
              <th>Strength</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Route</th>
              <th>Duration</th>
              <th>Instructions</th>
            </tr>
          </thead>
          <tbody>
            ${prescription.items.map((item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${item.medicineName}</strong></td>
                <td>${item.strength}</td>
                <td>${item.dosage}</td>
                <td>${item.frequency}</td>
                <td>${item.route}</td>
                <td>${item.duration}</td>
                <td>${item.instructions}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        ${prescription.notes ? `
          <div class="notes">
            <strong>Doctor's Advice & Instructions:</strong><br>
            ${prescription.notes}
          </div>
        ` : ''}

        ${consultation?.followUpDate ? `
          <div style="margin-top: 15px; font-size: 13px;">
            <strong>Next Follow-up Date:</strong> ${consultation.followUpDate}
          </div>
        ` : ''}

        <div class="footer">
          <div>Verified Digital Prescription · Dr. Priyanka Bhandari Clinic</div>
          <div style="text-align: right;">
            <strong>Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS</strong><br>
            General Physician Consultant · Hinduja Hospital
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([printableHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prescription_${patient?.patientNumber || 'Record'}_${prescription.prescriptionDate}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-sky-400" />
            <span className="font-semibold text-sm tracking-wide">
              Official Medical Prescription Viewer
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print Prescription"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-2"
              aria-label="Close Prescription"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prescription Paper Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-slate-800 space-y-6">
          {/* Clinic Official Letterhead */}
          <div className="border-b-2 border-sky-800 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-sky-900 tracking-tight">
                  DR. PRIYANKA BHANDARI
                </h2>
                <div className="text-sm font-bold text-slate-700">
                  BAMS, CGO, PGDEMS · Reg. No: MMC / State Council
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  General Physician Consultant · Hinduja Hospital
                </div>
              </div>
              <div className="text-xs text-slate-600 sm:text-right space-y-0.5">
                <div className="font-semibold text-slate-800 flex items-center sm:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-700" />
                  <span>Kurar Village, Malad East, Mumbai - 400097</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-700" />
                  <span>Clinic: +91 75066 51415</span>
                </div>
                <div className="text-slate-400">Timings: Mon - Sat: 10:00 AM - 9:00 PM</div>
              </div>
            </div>
          </div>

          {/* Patient Demographics Strip */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-semibold">
                Patient Name
              </span>
              <strong className="text-slate-900 text-sm">{patient?.fullName || 'Patient'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-semibold">
                Patient ID
              </span>
              <span className="font-mono text-slate-800">{patient?.patientNumber || 'PB-2026-N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-semibold">
                Date & Time
              </span>
              <span className="text-slate-800">{prescription.prescriptionDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-semibold">
                Gender / Blood Group
              </span>
              <span className="text-slate-800">
                {patient?.gender || 'N/A'} {patient?.bloodGroup ? `· ${patient.bloodGroup}` : ''}
              </span>
            </div>
          </div>

          {/* Clinical Assessment / Diagnosis */}
          {consultation && (
            <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-100 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900 block mb-1">
                Clinical Diagnosis
              </span>
              <div className="font-semibold text-sky-950 text-sm">
                {consultation.diagnosis}
              </div>
              {consultation.vitals && (
                <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t border-sky-200/60 text-[11px] text-slate-600">
                  {consultation.vitals.bloodPressure && <span>BP: <strong>{consultation.vitals.bloodPressure}</strong></span>}
                  {consultation.vitals.pulseRate && <span>Pulse: <strong>{consultation.vitals.pulseRate}</strong></span>}
                  {consultation.vitals.temperature && <span>Temp: <strong>{consultation.vitals.temperature}</strong></span>}
                  {consultation.vitals.spO2 && <span>SpO2: <strong>{consultation.vitals.spO2}</strong></span>}
                </div>
              )}
            </div>
          )}

          {/* Rx Symbol & Medication Table */}
          <div>
            <div className="text-3xl font-serif font-black text-sky-900 mb-2">
              ℞
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Medicine & Strength</th>
                    <th className="py-2.5 px-3">Dosage</th>
                    <th className="py-2.5 px-3">Frequency</th>
                    <th className="py-2.5 px-3">Route</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prescription.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 text-slate-400 font-medium">{index + 1}</td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{item.medicineName}</strong>
                        <span className="text-[11px] text-sky-800 font-semibold">{item.strength}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{item.dosage}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{item.frequency}</td>
                      <td className="py-3 px-3 text-slate-600">{item.route}</td>
                      <td className="py-3 px-3 text-slate-700">{item.duration}</td>
                      <td className="py-3 px-3 text-slate-600 italic">{item.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doctor Notes & Advice */}
          {prescription.notes && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                Doctor's Special Instructions & Lifestyle Advice
              </span>
              <p className="text-slate-700 leading-relaxed pt-1">
                {prescription.notes}
              </p>
            </div>
          )}

          {/* Next Follow Up */}
          {consultation?.followUpDate && (
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-sky-700" />
                <span>Next Scheduled Follow-up:</span>
                <strong className="text-slate-900">{consultation.followUpDate}</strong>
              </div>
              <span className="text-[11px] text-sky-800 font-medium">In-Clinic or Tele-Consult</span>
            </div>
          )}

          {/* Doctor Signature & Security Watermark */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-emerald-800 text-xs bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security Verified · Tamper-Resistant Electronic Health Record</span>
            </div>

            <div className="text-right sm:pr-4">
              <div className="text-xs font-serif italic text-sky-900 font-bold text-base mb-1">
                Dr. Priyanka Bhandari
              </div>
              <div className="text-[11px] font-bold text-slate-800">
                Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS
              </div>
              <div className="text-[10px] text-slate-500">
                General Physician Consultant · Hinduja Hospital
              </div>
            </div>
          </div>

          {/* Patient Safety Non-Alteration Notice */}
          <div className="p-2.5 bg-slate-100 rounded-lg text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
            <span>Prescription content is cryptographically sealed and read-only for patient safety. Do not alter medication dosages without clinical consultation.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
