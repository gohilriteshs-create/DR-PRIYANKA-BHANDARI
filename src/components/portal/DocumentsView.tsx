import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  FileCheck, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  Calendar, 
  User, 
  Microscope,
  Activity,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { MedicalDocument, MedicalDocumentType } from '../../types/portal';

export const DocumentsView: React.FC = () => {
  const { documents, currentPatient, uploadDocument, recordAuditLog } = usePortal();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewingDoc, setViewingDoc] = useState<MedicalDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadDocType, setUploadDocType] = useState<MedicalDocumentType>('Lab Report');
  const [uploadSummary, setUploadSummary] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const filteredDocuments = documents.filter((doc) => {
    if (selectedType === 'all') return true;
    return doc.documentType === selectedType;
  });

  const handleOpenDoc = (doc: MedicalDocument) => {
    setViewingDoc(doc);
    recordAuditLog('DOCUMENT_ACCESSED', `documents/${doc.id}`, `Patient accessed document: ${doc.documentName}`);
  };

  const handleDownloadDoc = (doc: MedicalDocument) => {
    const content = doc.mockContent || `${doc.documentName}\nType: ${doc.documentType}\nUploaded By: ${doc.uploadedBy}\nDate: ${doc.uploadedAt}\nSummary: ${doc.summaryNotes || 'None'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.documentName.endsWith('.pdf') ? doc.documentName.replace('.pdf', '.txt') : `${doc.documentName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    recordAuditLog('DOCUMENT_ACCESSED', `documents/${doc.id}/download`, `Downloaded document: ${doc.documentName}`);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocName.trim() || !currentPatient) return;

    setIsUploading(true);
    try {
      await uploadDocument({
        patientId: currentPatient.id,
        documentType: uploadDocType,
        documentName: uploadDocName.trim().endsWith('.pdf') ? uploadDocName.trim() : `${uploadDocName.trim()}.pdf`,
        uploadedBy: `${currentPatient.fullName} (Self-Uploaded)`,
        fileSize: '480 KB',
        summaryNotes: uploadSummary.trim() || 'Patient uploaded past investigative report for Dr. Priyanka Bhandari review.',
        mockContent: `Document: ${uploadDocName}\nType: ${uploadDocType}\nPatient: ${currentPatient.fullName}\nNotes: ${uploadSummary}`
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setUploadSuccess(false);
        setUploadDocName('');
        setUploadSummary('');
      }, 1200);
    } catch {
      // error
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            My Medical Documents & Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified laboratory panels, diagnostic imaging findings, and clinical certificates stored in your confidential vault.
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Past Report</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {['all', 'Prescription', 'Lab Report', 'Scan/Imaging Report', 'Medical Certificate'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              selectedType === t
                ? 'bg-sky-800 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t === 'all' ? 'All Documents' : t}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center shrink-0">
                    {doc.documentType === 'Lab Report' ? (
                      <Microscope className="w-5 h-5" />
                    ) : doc.documentType === 'Scan/Imaging Report' ? (
                      <Activity className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {doc.fileSize}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
                    {doc.documentType}
                  </span>
                  <strong className="text-slate-900 font-bold text-sm block mt-0.5 line-clamp-2">
                    {doc.documentName}
                  </strong>
                </div>

                {doc.summaryNotes && (
                  <p className="text-xs text-slate-500 line-clamp-2 italic">
                    "{doc.summaryNotes}"
                  </p>
                )}

                <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                  <div>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div>By: {doc.uploadedBy}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenDoc(doc)}
                  className="flex-1 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleDownloadDoc(doc)}
                  className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
            No medical documents found in this category.
          </div>
        )}
      </div>

      {/* View Document Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-sky-700" />
                <div>
                  <span className="text-[10px] font-bold text-sky-700 uppercase">{viewingDoc.documentType}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{viewingDoc.documentName}</h3>
                </div>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Source: {viewingDoc.uploadedBy}</span>
                <span>Date: {new Date(viewingDoc.uploadedAt).toLocaleDateString()}</span>
              </div>
              <div className="font-mono text-[10px] text-slate-400 bg-white p-2 rounded border border-slate-200 break-all">
                {viewingDoc.secureFileReference}
              </div>
              {viewingDoc.summaryNotes && (
                <div className="pt-2 border-t border-slate-200 text-slate-700">
                  <strong>Clinical Summary / Findings:</strong>
                  <p className="mt-1 leading-relaxed">{viewingDoc.summaryNotes}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-sky-50 rounded-xl text-xs text-sky-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected Health Information Verified</span>
              </div>
              <p className="text-[11px] text-sky-800">
                This diagnostic record is securely signed and linked with patient number {currentPatient?.patientNumber}.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleDownloadDoc(viewingDoc)}
                className="px-4 py-2 bg-sky-800 text-white rounded-xl text-xs font-semibold hover:bg-sky-900 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Past Report Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  Upload Medical Report for Doctor Review
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-6 text-center text-xs space-y-2 text-emerald-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm">Report Successfully Uploaded!</div>
                <p>Dr. Priyanka Bhandari will have access to this document during your consultation.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Document Title / Report Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadDocName}
                    onChange={(e) => setUploadDocName(e.target.value)}
                    placeholder="e.g. Thyroid Panel & HbA1c (Sep 2026)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Document Classification <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden font-medium"
                  >
                    <option value="Lab Report">Lab Report (Blood / Urine / Pathology)</option>
                    <option value="Scan/Imaging Report">Scan/Imaging Report (X-Ray, Ultrasound, CT, MRI)</option>
                    <option value="Prescription">Previous Prescription</option>
                    <option value="Consultation Summary">Previous Hospital / Discharge Summary</option>
                    <option value="Other Medical Document">Other Medical Document</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Summary Notes for Dr. Bhandari (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={uploadSummary}
                    onChange={(e) => setUploadSummary(e.target.value)}
                    placeholder="e.g. Fasting glucose noted at 112 mg/dL; test performed at Apollo Clinic."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden resize-none"
                  />
                </div>

                {/* Simulated File Selection */}
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-500 space-y-1 bg-slate-50">
                  <HardDrive className="w-6 h-6 text-slate-400 mx-auto" />
                  <div className="font-semibold text-slate-700">Simulated Secure File Upload</div>
                  <div className="text-[10px] text-slate-400">PDF, JPG, PNG up to 15 MB accepted</div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-4 py-2 bg-sky-800 text-white rounded-xl font-semibold hover:bg-sky-900 disabled:opacity-50"
                  >
                    {isUploading ? 'Securing & Storing...' : 'Submit Document'}
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
