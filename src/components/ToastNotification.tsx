import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, X, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { AnimatedSuccessCheckmark } from './AnimatedSuccessCheckmark';

export interface ToastData {
  referenceNumber: string;
  patientName: string;
  consultationType: string;
  dateTime: string;
}

interface ToastNotificationProps {
  show: boolean;
  data: ToastData | null;
  onClose: () => void;
  onViewSlip?: () => void;
  duration?: number; // in milliseconds, default 7000
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  show,
  data,
  onClose,
  onViewSlip,
  duration = 7500
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);

  useEffect(() => {
    if (!show || !data) {
      setProgress(100);
      return;
    }

    remainingTimeRef.current = duration;
    startTimeRef.current = Date.now();
    setProgress(100);

    const interval = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTimeRef.current;
        const newRemaining = Math.max(0, remainingTimeRef.current - elapsed);
        const percent = (newRemaining / duration) * 100;
        setProgress(percent);

        if (newRemaining <= 0) {
          clearInterval(interval);
          onClose();
        }
      } else {
        startTimeRef.current = Date.now();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [show, data, duration, isPaused, onClose]);

  if (!show || !data) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        remainingTimeRef.current = (progress / 100) * duration;
        startTimeRef.current = Date.now();
        setIsPaused(false);
      }}
      className="fixed top-5 left-4 right-4 sm:left-auto sm:right-6 sm:top-20 z-50 max-w-md w-auto sm:w-96 bg-white rounded-2xl shadow-xl border border-teal-200/80 overflow-hidden animate-in fade-in slide-in-from-top-4 sm:slide-in-from-top-2 duration-300"
    >
      <div className="p-4 sm:p-4.5">
        <div className="flex items-start gap-3">
          {/* Subtle Animated Checkmark Badge */}
          <div className="shrink-0 mt-0.5">
            <AnimatedSuccessCheckmark size="sm" variant="teal" withHalo={true} />
          </div>

          {/* Toast Body */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase tracking-wider font-bold text-teal-700">
                Request Confirmed
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-[11px] font-mono font-semibold text-slate-500 truncate">
                {data.referenceNumber}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
              Consultation Queued for {data.patientName}
            </h4>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Dr. Priyanka Bhandari's clinic desk will review and confirm your slot for{' '}
              <span className="font-semibold text-slate-800">{data.dateTime}</span>.
            </p>

            {/* Quick Actions inside Toast */}
            {onViewSlip && (
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    onViewSlip();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-800 hover:text-sky-950 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>View Details & Slip</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>

                <span className="text-[10px] text-slate-400">
                  {isPaused ? 'Paused' : 'Auto-closing'}
                </span>
              </div>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Auto-dismiss progress bar */}
      <div 
        className="h-1 w-full bg-slate-100 overflow-hidden" 
        role="progressbar" 
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-teal-500 via-sky-600 to-sky-700 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
