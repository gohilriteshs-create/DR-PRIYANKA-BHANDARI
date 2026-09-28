import React from 'react';

interface AnimatedSuccessCheckmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'teal' | 'emerald' | 'sky';
  className?: string;
  withHalo?: boolean;
}

const sizeConfig = {
  sm: {
    container: 'w-10 h-10',
    halo: 'w-10 h-10',
    svg: 'w-10 h-10',
    strokeWidth: 3.5,
  },
  md: {
    container: 'w-12 h-12',
    halo: 'w-12 h-12',
    svg: 'w-12 h-12',
    strokeWidth: 3.5,
  },
  lg: {
    container: 'w-16 h-16',
    halo: 'w-16 h-16',
    svg: 'w-16 h-16',
    strokeWidth: 3.8,
  },
  xl: {
    container: 'w-20 h-20',
    halo: 'w-20 h-20',
    svg: 'w-20 h-20',
    strokeWidth: 4,
  },
};

const variantConfig = {
  teal: {
    bg: 'bg-teal-600 text-white',
    halo: 'bg-teal-500/25 border border-teal-500/40',
    stroke: '#ffffff',
  },
  emerald: {
    bg: 'bg-emerald-600 text-white',
    halo: 'bg-emerald-500/25 border border-emerald-500/40',
    stroke: '#ffffff',
  },
  sky: {
    bg: 'bg-sky-600 text-white',
    halo: 'bg-sky-500/25 border border-sky-500/40',
    stroke: '#ffffff',
  },
};

export const AnimatedSuccessCheckmark: React.FC<AnimatedSuccessCheckmarkProps> = ({
  size = 'lg',
  variant = 'teal',
  className = '',
  withHalo = true,
}) => {
  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];

  return (
    <div
      className={`relative inline-flex items-center justify-center ${currentSize.container} ${className}`}
      role="img"
      aria-label="Success confirmation"
    >
      {/* Subtle expanding halo ripple */}
      {withHalo && (
        <span
          className={`absolute inset-0 rounded-full animate-checkmark-halo pointer-events-none ${currentVariant.halo}`}
          aria-hidden="true"
        />
      )}

      {/* Main growing badge container */}
      <div
        className={`relative z-10 rounded-full flex items-center justify-center shadow-md animate-checkmark-pop ${currentSize.container} ${currentVariant.bg}`}
      >
        <svg
          viewBox="0 0 48 48"
          className={`${currentSize.svg} overflow-visible`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Subtle perimeter highlight circle */}
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Smooth drawn checkmark path */}
          <path
            d="M14 25.5 L21.5 32.5 L34 17.5"
            stroke={currentVariant.stroke}
            strokeWidth={currentSize.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-checkmark-stroke"
          />
        </svg>
      </div>
    </div>
  );
};
