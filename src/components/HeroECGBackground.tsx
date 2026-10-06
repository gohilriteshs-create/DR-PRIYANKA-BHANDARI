import React from 'react';

/**
 * Generates an anatomically structured ECG rhythm waveform path (P-Q-R-S-T complexes).
 * Period is repeated seamlessly across a 1920px width.
 */
const generateTrace1Path = (): string => {
  let d = 'M 0 50';
  for (let i = 0; i < 8; i++) {
    const x = i * 240;
    // Isoelectric baseline -> P wave -> PR interval -> Q dip -> R spike -> S wave -> ST segment -> T wave -> Baseline
    d += ` L ${x + 35} 50 C ${x + 42} 50, ${x + 50} 42, ${x + 58} 42 C ${x + 66} 42, ${x + 74} 50, ${x + 82} 50 L ${x + 96} 50 L ${x + 102} 56 L ${x + 110} 6 L ${x + 118} 76 L ${x + 126} 50 L ${x + 142} 50 C ${x + 150} 50, ${x + 160} 36, ${x + 172} 36 C ${x + 184} 36, ${x + 194} 50, ${x + 204} 50 L ${x + 240} 50`;
  }
  return d;
};

const generateTrace2Path = (): string => {
  let d = 'M 0 50';
  const period = 274;
  for (let i = 0; i < 7; i++) {
    const x = i * period;
    // Alternative lead morphology (slightly softer R spike, wider ST interval)
    d += ` L ${x + 45} 50 C ${x + 53} 50, ${x + 62} 43, ${x + 72} 43 C ${x + 82} 43, ${x + 91} 50, ${x + 100} 50 L ${x + 116} 50 L ${x + 122} 55 L ${x + 130} 14 L ${x + 138} 70 L ${x + 146} 50 L ${x + 164} 50 C ${x + 174} 50, ${x + 185} 38, ${x + 198} 38 C ${x + 211} 38, ${x + 222} 50, ${x + 234} 50 L ${x + period} 50`;
  }
  d += ' L 1920 50';
  return d;
};

const TRACE_1_D = generateTrace1Path();
const TRACE_2_D = generateTrace2Path();

export const HeroECGBackground: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
      data-testid="ecg-traces"
    >
      {/* Subtle fine medical coordinate grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#0284c7_1px,transparent_1px),linear-gradient(to_bottom,#0284c7_1px,transparent_1px)] bg-[size:40px_40px]" 
      />

      {/* SVG Definitions for luminous pulses & gradients */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Linear gradient for Trace 1 traveling pulse */}
          <linearGradient id="ecgGlow1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.9" />
            <stop offset="92%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          {/* Linear gradient for Trace 2 traveling pulse */}
          <linearGradient id="ecgGlow2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0f766e" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#14b8a6" stopOpacity="0.9" />
            <stop offset="92%" stopColor="#2dd4bf" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* =========================================================================
          TRACE 1 (Primary Lead II Rhythm): Upper-Mid Section
         ========================================================================= */}
      <div className="absolute top-[22%] sm:top-[26%] left-0 right-0 w-full h-24 sm:h-28">
        {/* Subtle Channel Identifier */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-wider text-sky-800/40 uppercase mb-0.5 select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500/60 animate-pulse" />
            <span>LEAD II · 72 BPM</span>
          </span>
          <span className="hidden md:inline text-sky-700/30">NORMO-SINUS RHYTHM</span>
        </div>

        <svg 
          viewBox="0 0 1920 100" 
          preserveAspectRatio="none" 
          className="w-full h-full overflow-visible"
        >
          {/* Static subtle baseline ECG track */}
          <path
            d={TRACE_1_D}
            fill="none"
            stroke="#0369a1"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-[0.16]"
          />

          {/* Active animated traveling pulse running along the trace */}
          <path
            d={TRACE_1_D}
            fill="none"
            stroke="url(#ecgGlow1)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ecg-travel active drop-shadow-[0_0_6px_rgba(14,165,233,0.7)]"
          />
        </svg>
      </div>

      {/* =========================================================================
          TRACE 2 (Secondary Lead V1 Rhythm): Lower Section
         ========================================================================= */}
      <div className="absolute bottom-[8%] sm:bottom-[12%] left-0 right-0 w-full h-24 sm:h-28">
        {/* Subtle Channel Identifier */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-wider text-teal-800/35 uppercase mb-0.5 select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-pulse" />
            <span>LEAD V1 · CONTINUOUS CARDIAC MONITOR</span>
          </span>
          <span className="hidden md:inline text-teal-700/30">MONITOR ACTIVE</span>
        </div>

        <svg 
          viewBox="0 0 1920 100" 
          preserveAspectRatio="none" 
          className="w-full h-full overflow-visible"
        >
          {/* Static subtle baseline ECG track */}
          <path
            d={TRACE_2_D}
            fill="none"
            stroke="#0f766e"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-[0.13]"
          />

          {/* Active animated traveling pulse running along the trace (offset timing) */}
          <path
            d={TRACE_2_D}
            fill="none"
            stroke="url(#ecgGlow2)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ecg-travel active trace-2 drop-shadow-[0_0_6px_rgba(20,184,166,0.65)]"
          />
        </svg>
      </div>
    </div>
  );
};
