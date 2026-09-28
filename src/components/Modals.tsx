import React from 'react';
import { X, CheckCircle2, Clock, Calendar, ShieldCheck, Heart, FileText, AlertCircle } from 'lucide-react';
import { MedicalService, DoctorProfile } from '../types';
import { DynamicMedicalIcon } from './DynamicMedicalIcon';

interface ServiceDetailModalProps {
  service: MedicalService | null;
  onClose: () => void;
  onBookService: (serviceName: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookService
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState<number>(0);
  const [isScrollable, setIsScrollable] = React.useState<boolean>(false);

  // Recalculate progress when service changes or modal mounts
  React.useEffect(() => {
    if (!service) return;
    setScrollProgress(0);

    const checkScrollable = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current;
        const canScroll = scrollHeight > clientHeight + 10;
        setIsScrollable(canScroll);
        if (!canScroll) {
          setScrollProgress(100);
        } else {
          setScrollProgress(0);
        }
      }
    };

    // Use requestAnimationFrame to ensure layout has rendered
    const animId = requestAnimationFrame(checkScrollable);
    return () => cancelAnimationFrame(animId);
  }, [service]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      setScrollProgress(progress);
    } else {
      setScrollProgress(100);
    }
  };

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
      >
        {/* Service Hero Image Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900 shrink-0">
          <img
            src={service.imageUrl || `/services/${service.id}.svg`}
            alt={`${service.name} consultation at Hinduja Hospital`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/services/general-consultation.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/20" />
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-slate-900/60 hover:bg-slate-900/90 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/95 text-sky-800 flex items-center justify-center shrink-0 backdrop-blur-xs shadow-md border border-white/40">
                <DynamicMedicalIcon name={service.iconName} className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-sky-300">
                    {service.category}
                  </span>
                  <span aria-hidden="true" className="text-white/40">·</span>
                  <span className="text-xs text-slate-300 font-medium">Hinduja Hospital</span>
                  {isScrollable && (
                    <>
                      <span aria-hidden="true" className="text-white/40">·</span>
                      <span className="text-[11px] font-medium text-slate-300 tabular-nums">
                        {Math.round(scrollProgress)}% read
                      </span>
                    </>
                  )}
                </div>
                <h3 id="service-modal-title" className="text-xl sm:text-2xl font-bold text-white mt-0.5 leading-tight">
                  {service.name}
                </h3>
              </div>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-xs font-semibold text-slate-100 border border-white/10 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-sky-300" />
              <span>{service.estimatedDuration}</span>
            </div>
          </div>

          {/* Reading Progress Indicator */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(scrollProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Content reading progress"
          >
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-sky-400 to-sky-200 transition-all duration-150 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>

        {/* Content Body */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="p-6 overflow-y-auto space-y-6 text-sm"
        >
          {/* Full description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Clinical Overview
            </h4>
            <p className="text-slate-700 leading-relaxed">
              {service.fullDescription}
            </p>
          </div>

          {/* What to Expect */}
          {service.whatToExpect && service.whatToExpect.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                What to Expect During the Consultation
              </h4>
              <ul className="space-y-2">
                {service.whatToExpect.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preparation Tips */}
          {service.preparationTips && service.preparationTips.length > 0 && (
            <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-700" />
                <span>Patient Preparation Tips</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-sky-900">
                {service.preparationTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Duration & Confidentiality Notice */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Estimated Duration: {service.estimatedDuration}</span>
            <span>All consultations held in private examination rooms</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onBookService(service.name);
              onClose();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-sky-800 hover:bg-sky-900 rounded-lg shadow-2xs transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Consultation for this Service</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface DoctorProfileModalProps {
  profile: DoctorProfile;
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: () => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onBookAppointment
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-modal-title"
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold">
              Medical Credentials & Background
            </span>
            <h3 id="doctor-modal-title" className="text-2xl font-bold tracking-tight text-white mt-1">
              {profile.name}, {profile.qualification}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Primary Care & General Medical Practice · {profile.registrationNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Medical Education & Clinical Qualifications
            </h4>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1">
                <div className="font-bold text-sm text-sky-900">
                  BAMS · Bachelor of Ayurvedic Medicine & Surgery
                </div>
                <p className="text-slate-600">
                  Rigorous medical training in clinical examination, internal medicine, pharmacology, systemic pathology, and holistic patient health management.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 text-xs text-slate-800 space-y-1">
                  <div className="font-bold text-sky-900">
                    CGO · Certificate in Gynecology & Obstetrics
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Specialized clinical training in female reproductive health, prenatal/postnatal guidance, hormonal balance, and maternal wellness.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-slate-800 space-y-1">
                  <div className="font-bold text-teal-900">
                    PGDEMS · Post Graduate Diploma in Emergency Medical Services
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Advanced certification in acute trauma triage, resuscitation, cardiac life support, and rapid clinical emergency protocols.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span className="font-semibold">Hospital Consultation Affiliation:</span>
                <span className="font-bold">Hinduja Hospital · General Physician Consultant</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Professional Approach & Clinical Philosophy
            </h4>
            <div className="space-y-3 text-slate-600 leading-relaxed text-xs sm:text-sm">
              <p>{profile.approachToCare}</p>
              <p>{profile.philosophy}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Patient Care Standards
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Transparent explanation of all proposed diagnostics and prescribed medications.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Active patient involvement in personal preventive health planning.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Strict adherence to patient privacy and digital health record confidentiality.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onBookAppointment();
              onClose();
            }}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-800 hover:bg-sky-900 rounded-lg shadow-2xs transition-colors"
          >
            Request Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

interface TextModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const TextModal: React.FC<TextModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {children}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
