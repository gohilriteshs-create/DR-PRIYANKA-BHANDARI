import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  MapPin, 
  Navigation, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Pause,
  DoorOpen,
  Armchair,
  Stethoscope,
  Activity,
  Compass,
  CheckCircle2
} from 'lucide-react';

export interface ClinicPhotoItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Exterior' | 'Reception' | 'Consultation' | 'Examination' | 'Street Access';
  badge: string;
  locationTag: string;
  recognitionTip: string;
  imageUrl: string;
  thumbnailUrl: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CLINIC_PHOTOS: ClinicPhotoItem[] = [
  {
    id: 'exterior-facade',
    title: 'Clinic Entrance & Street Facade',
    subtitle: 'Shop Number 3, Ground Floor, Divya CHS LTD',
    category: 'Exterior',
    badge: 'Street Level Entrance',
    locationTag: 'Triveni Nagar Road, Kurar Village',
    recognitionTip: 'Look for Divya CHS on Triveni Nagar Road. Dr. Priyanka Bhandari Clinic is directly on the ground floor (Shop #3) with step-free entrance for easy access.',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=300&q=80',
    icon: DoorOpen
  },
  {
    id: 'reception-lounge',
    title: 'Patient Waiting Lounge & Reception Desk',
    subtitle: 'Air-Conditioned, Sanitized Waiting Area',
    category: 'Reception',
    badge: 'Waiting Lounge',
    locationTag: 'Clinic Reception Area',
    recognitionTip: 'Hygienic, comfortable waiting area. Check in with the clinic assistant at the reception desk; drinking water and sanitized seating are readily available.',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=300&q=80',
    icon: Armchair
  },
  {
    id: 'consultation-room',
    title: 'Doctor Consultation Chamber',
    subtitle: 'Private & Confidential Clinical Room',
    category: 'Consultation',
    badge: 'Consultation Room',
    locationTag: 'Chamber 1 · Dr. Priyanka Bhandari',
    recognitionTip: 'Private, quiet chamber where Dr. Priyanka Bhandari conducts thorough patient history taking, preventive assessments, and compassionate medical care.',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80',
    icon: Stethoscope
  },
  {
    id: 'examination-area',
    title: 'Patient Examination & Vitals Bed',
    subtitle: 'Sanitized Bed with Privacy Curtains & Diagnostic Instruments',
    category: 'Examination',
    badge: 'Examination & Diagnostics',
    locationTag: 'Clinical Examination Suite',
    recognitionTip: 'Equipped with a sanitized clinical examination bed, privacy curtains, digital blood pressure monitor, pulse oximeter, and diagnostic instruments.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=300&q=80',
    icon: Activity
  },
  {
    id: 'street-access',
    title: 'Arrival Corridor & Street Approach',
    subtitle: 'Convenient Vehicular Access off Western Express Highway',
    category: 'Street Access',
    badge: 'Street Approach',
    locationTag: 'Near Kurar Metro & Malad Station',
    recognitionTip: 'Easily accessible via auto-rickshaws and cabs from Malad East station and Kurar Metro (Line 7). Two-wheeler parking space available outside Divya CHS.',
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=300&q=80',
    icon: Compass
  }
];

interface ClinicPhotoCarouselProps {
  directionsUrl: string;
}

export const ClinicPhotoCarousel: React.FC<ClinicPhotoCarouselProps> = ({ directionsUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});
  const touchStartXRef = useRef<number | null>(null);

  const activePhoto = CLINIC_PHOTOS[currentIndex];

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : CLINIC_PHOTOS.length - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < CLINIC_PHOTOS.length - 1 ? prev + 1 : 0));
  }, []);

  // Autoplay Effect (6.5s)
  useEffect(() => {
    if (!isPlaying || isHovered || lightboxOpen) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, lightboxOpen, handleNext]);

  // Touch Swipe Support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape' && lightboxOpen) setLightboxOpen(false);
  };

  return (
    <div 
      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Clinic photo gallery and location recognition"
    >
      {/* Header bar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-200/70">
              <Camera className="w-3.5 h-3.5 text-sky-700" />
              <span>Location Recognition Photos</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Shop No. 3, Divya CHS · Malad East</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Clinic Exterior &amp; Interior Gallery
          </h3>
          <p className="text-xs text-slate-500">
            High-resolution visual tour of the clinic building entrance, waiting lounge, and consultation chamber so you can easily spot the practice on arrival.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsPlaying(prev => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-sky-700" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-500" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-sky-800 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            title="Open Fullscreen View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Photographic Display Area */}
      <div 
        className="relative w-full h-[340px] sm:h-[420px] overflow-hidden bg-slate-900 select-none group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Active Photographic Image with Crossfade */}
        {CLINIC_PHOTOS.map((photo, index) => {
          const isCurrent = currentIndex === index;
          return (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={photo.imageUrl}
                alt={`${photo.title} - ${photo.subtitle}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                onLoad={() => setImageLoaded(prev => ({ ...prev, [photo.id]: true }))}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-102 transition-transform duration-1000 ease-out"
              />

              {/* Shading Gradients for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
            </div>
          );
        })}

        {/* Top Badges (Category & Counter) */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-lg backdrop-blur-md border border-slate-200 flex items-center gap-1.5">
            <activePhoto.icon className="w-3.5 h-3.5 text-sky-800" />
            <span>{activePhoto.badge}</span>
          </span>
          <span className="px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
            {currentIndex + 1} / {CLINIC_PHOTOS.length}
          </span>
        </div>

        {/* Top Right Clinic Location Pin */}
        <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-xs">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px]">{activePhoto.locationTag}</span>
        </div>

        {/* Prev / Next Floating Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bottom Banner overlay on the picture: Title & Recognition Tip */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-6 pt-10 text-white">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-300">
                {activePhoto.category}
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-[11px] text-slate-300">
                {activePhoto.subtitle}
              </span>
            </div>

            <h4 className="text-base sm:text-xl font-bold text-white leading-tight">
              {activePhoto.title}
            </h4>

            {/* Arrival Tip callout card */}
            <div className="mt-2.5 text-xs text-slate-200 flex items-start gap-2 bg-slate-900/80 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/15 shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Patient Arrival Tip: </span>
                <span className="text-slate-200">{activePhoto.recognitionTip}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Photo Thumbnail Strip */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200/80">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
          {CLINIC_PHOTOS.map((photo, index) => {
            const isSelected = currentIndex === index;
            const IconComponent = photo.icon;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`p-1.5 sm:p-2 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-sky-50 border-sky-500 shadow-xs ring-2 ring-sky-300'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                }`}
              >
                {/* Mini Image Preview */}
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative bg-slate-100">
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-sky-600/30 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  )}
                </div>

                {/* Text descriptor */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <IconComponent className={`w-3 h-3 shrink-0 ${isSelected ? 'text-sky-800' : 'text-slate-500'}`} />
                    <span className={`text-[11px] font-bold truncate ${isSelected ? 'text-sky-950' : 'text-slate-700'}`}>
                      {photo.category}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {photo.badge}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close bar */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white bg-slate-900/80">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-sky-400">{activePhoto.title}</span>
                <span className="text-xs text-slate-400">· {activePhoto.subtitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Image Viewport */}
            <div className="relative flex-1 min-h-[360px] sm:min-h-[500px] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-full object-contain max-h-[70vh]"
              />

              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{activePhoto.recognitionTip}</span>
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-800 text-white rounded-xl font-semibold hover:bg-sky-900 transition-colors shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions to Clinic</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
