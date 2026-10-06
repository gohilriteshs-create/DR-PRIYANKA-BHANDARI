import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check } from 'lucide-react';

interface GoogleMapSimpleProps {
  clinicName: string;
  address: string;
  embedUrl: string;
  directionsUrl: string;
}

export const GoogleMapSimple: React.FC<GoogleMapSimpleProps> = ({
  clinicName,
  address,
  embedUrl,
  directionsUrl
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
      {/* Map Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-200/70">
              <MapPin className="w-3.5 h-3.5 text-sky-700" />
              <span>Google Maps</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Shop No. 3, Divya CHS · Malad East
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            {clinicName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {address}
          </p>
        </div>

        {/* Quick Open in Google Maps Link */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-900 bg-sky-50 border border-sky-200/80 hover:bg-sky-100 hover:border-sky-300 transition-colors shadow-2xs shrink-0 self-start sm:self-center"
        >
          <ExternalLink className="w-3.5 h-3.5 text-sky-700" />
          <span>Open in Google Maps</span>
        </a>
      </div>

      {/* Google Map Simple Iframe Embed */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-100">
        <iframe
          title={`${clinicName} - Google Map`}
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>

      {/* Footer Actions */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-sm">
          <MapPin className="w-3.5 h-3.5 text-sky-700 shrink-0" />
          <span className="truncate">{address}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
            title="Copy clinic address"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Address</span>
              </>
            )}
          </button>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-800 hover:bg-sky-900 text-white font-semibold transition-colors shadow-2xs"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-200" />
            <span>Get Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
