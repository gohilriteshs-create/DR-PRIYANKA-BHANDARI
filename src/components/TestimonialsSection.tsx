import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  PenLine, 
  X, 
  ShieldCheck, 
  ThumbsUp, 
  Sparkles,
  MapPin,
  HeartHandshake
} from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';
import { PatientTestimonial } from '../types';
import { AnimatedSuccessCheckmark } from './AnimatedSuccessCheckmark';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, addTestimonial, settings } = useMedicalData();

  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Review Submission Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [useInitialsOnly, setUseInitialsOnly] = useState(false);
  const [consultationType, setConsultationType] = useState('General In-Clinic Consultation');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [location, setLocation] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  // Filter active testimonials
  const activeTestimonials = testimonials.filter(t => t.enabled);

  // Responsive Cards Per View
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalCards = activeTestimonials.length;
  const maxIndex = Math.max(0, totalCards - cardsPerView);

  // Keep currentIndex within bounds if cardsPerView changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Carousel Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev < maxIndex ? prev + 1 : 0));
  }, [maxIndex]);

  // Autoplay Effect (6 seconds interval, pauses on hover or when form is open)
  useEffect(() => {
    if (!isAutoPlaying || isHovered || isFormOpen || maxIndex === 0) return;

    const timer = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, isFormOpen, maxIndex, handleNext]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  // Calculate Average Rating
  const averageRating = totalCards > 0
    ? (activeTestimonials.reduce((acc, curr) => acc + curr.rating, 0) / totalCards).toFixed(1)
    : '5.0';

  // Handle Review Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!patientName.trim()) {
      setFormError('Please enter your name or initials.');
      return;
    }

    if (reviewText.trim().length < 20) {
      setFormError('Please write at least 20 characters describing your experience.');
      return;
    }

    if (!consentConfirmed) {
      setFormError('Please confirm the consent checkbox to share your patient review.');
      return;
    }

    // Compute Initials
    const nameParts = patientName.trim().split(/\s+/);
    let computedInitials = '';
    if (nameParts.length >= 2) {
      computedInitials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    } else {
      computedInitials = nameParts[0].substring(0, 2).toUpperCase();
    }

    // Format display name
    let finalDisplayName = patientName.trim();
    if (useInitialsOnly) {
      if (nameParts.length >= 2) {
        finalDisplayName = `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}`;
      } else {
        finalDisplayName = `${computedInitials}.`;
      }
    }

    // Format Current Date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const newTestimonialData: Omit<PatientTestimonial, 'id'> = {
      patientName: finalDisplayName,
      initials: computedInitials,
      location: location.trim() || 'Verified Clinic Patient',
      review: reviewText.trim(),
      rating: rating,
      date: formattedDate,
      consultationType: consultationType,
      enabled: true,
      verified: true,
      isDirectSubmission: true
    };

    addTestimonial(newTestimonialData);
    setLastSubmittedId(`submitted-${Date.now()}`);
    setSubmittedSuccess(true);

    // Reset form fields
    setPatientName('');
    setLocation('');
    setReviewText('');
    setRating(5);
    setConsentConfirmed(false);
    setUseInitialsOnly(false);

    // Scroll carousel to the start where the new review is placed
    setCurrentIndex(0);
  };

  const openFormAndScroll = () => {
    setIsFormOpen(true);
    setSubmittedSuccess(false);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  if (!settings.enableTestimonials) return null;

  return (
    <section 
      id="testimonials" 
      className="py-20 bg-slate-50/70 border-b border-slate-200/70 relative overflow-hidden"
      aria-label="Patient Feedback and Testimonials"
    >
      {/* Decorative ambient background accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-64 bg-gradient-to-r from-sky-100/40 via-teal-100/30 to-amber-100/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Summary Badges & CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100/80 text-sky-900 border border-sky-200/60 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sky-700" />
              <span>Patient Experience &amp; Reflections</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Verified Patient Testimonials
            </h2>
            
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Real reflections and experiences from patients who have consulted with Dr. Priyanka Bhandari for general health, preventive checkups, and family medical guidance.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/70">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-bold">{averageRating} / 5.0</span>
                <span className="text-amber-700">· Overall Care Rating</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200/70">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>{totalCards} Verified Consultations</span>
              </div>
            </div>
          </div>

          {/* Primary Action: Direct Review Submission Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (isFormOpen) {
                  setIsFormOpen(false);
                } else {
                  openFormAndScroll();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <PenLine className="w-4 h-4" />
              <span>{isFormOpen ? 'Close Review Form' : 'Share Your Experience'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Direct Patient Review Submission Section */}
        {isFormOpen && (
          <div 
            ref={formRef}
            className="mb-14 bg-white rounded-3xl p-6 sm:p-8 border border-sky-200/90 shadow-lg shadow-sky-950/5 relative transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center shrink-0 border border-sky-100">
                  <PenLine className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Share Your Consultation Feedback
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Existing patients and family members can submit their experience with Dr. Priyanka Bhandari.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Close review submission form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <AnimatedSuccessCheckmark size="lg" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">
                  Thank You for Your Review!
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your feedback has been successfully published to our testimonials carousel. It helps fellow patients make informed healthcare decisions.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setSubmittedSuccess(false);
                    }}
                    className="px-5 py-2.5 bg-sky-800 text-white rounded-xl text-xs font-semibold hover:bg-sky-900 transition-colors cursor-pointer"
                  >
                    View in Carousel
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmittedSuccess(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Submit Another Review
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-6 space-y-5">
                {formError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Patient Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Name / Display Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Patel or S. Verma"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                    />
                    <label className="flex items-center gap-2 mt-2 text-xs text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useInitialsOnly}
                        onChange={(e) => setUseInitialsOnly(e.target.checked)}
                        className="rounded text-sky-800 focus:ring-sky-600"
                      />
                      <span>Keep my identity private (display as initials only)</span>
                    </label>
                  </div>

                  {/* Consultation Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Consultation Received <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={consultationType}
                      onChange={(e) => setConsultationType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                    >
                      <option value="General In-Clinic Consultation">General In-Clinic Consultation</option>
                      <option value="Preventive Health Assessment">Preventive Health Assessment</option>
                      <option value="Women's Health Consultation">Women's Health Consultation</option>
                      <option value="Family & Child Health Guidance">Family &amp; Child Health Guidance</option>
                      <option value="Lifestyle & Nutrition Guidance">Lifestyle &amp; Nutrition Guidance</option>
                      <option value="Follow-up Consultation">Follow-up Consultation</option>
                      <option value="Online / Tele-Consultation">Online / Tele-Consultation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Rating <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 hover:scale-115 transition-transform cursor-pointer focus:outline-hidden"
                            aria-label={`Rate ${star} out of 5 stars`}
                          >
                            <Star
                              className={`w-6 h-6 ${
                                (hoverRating || rating) >= star
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <span className="text-xs font-semibold text-slate-600 ml-2">
                        {rating === 5 && 'Outstanding (5/5)'}
                        {rating === 4 && 'Very Good (4/5)'}
                        {rating === 3 && 'Good / Satisfactory (3/5)'}
                        {rating === 2 && 'Fair (2/5)'}
                        {rating === 1 && 'Needs Improvement (1/5)'}
                      </span>
                    </div>
                  </div>

                  {/* Location / Area */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      City / Area (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Malad East, Mumbai or Kandivali"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Your Feedback / Review <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {reviewText.length}/500 (min 20 characters)
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    maxLength={500}
                    placeholder="Describe your consultation experience with Dr. Priyanka Bhandari (bedside manner, explanation of treatment, clinic environment, ease of communication)..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Ethical reminder: To preserve patient confidentiality, please do not include sensitive diagnostic lab report numbers or confidential pathology findings.
                  </p>
                </div>

                {/* Consent Checkbox */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={consentConfirmed}
                      onChange={(e) => setConsentConfirmed(e.target.checked)}
                      className="mt-0.5 rounded text-sky-800 focus:ring-sky-600"
                    />
                    <span>
                      I confirm that I or my family member have consulted Dr. Priyanka Bhandari and consent to publishing this feedback to help other patients.
                    </span>
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Carousel Container */}
        {totalCards === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
            <Quote className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No testimonials are currently published.</p>
            <button
              type="button"
              onClick={openFormAndScroll}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-sky-800 text-white text-xs font-semibold rounded-lg"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Be the First to Review</span>
            </button>
          </div>
        ) : (
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Patient reviews carousel"
          >
            {/* Carousel Overflow Viewport */}
            <div 
              className="overflow-hidden py-3"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`
                }}
              >
                {activeTestimonials.map((item) => (
                  <div
                    key={item.id}
                    className="shrink-0 px-3 flex"
                    style={{
                      width: `${100 / cardsPerView}%`
                    }}
                  >
                    <div className="w-full bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group">
                      
                      {/* Highlight border on hover */}
                      <div className="absolute top-0 left-6 right-6 h-0.5 bg-sky-700/0 group-hover:bg-sky-700/60 rounded-full transition-colors duration-200" />

                      <div>
                        {/* Top Metadata Row: Stars + Verified Badge + Quote */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5 text-amber-500">
                              {Array.from({ length: item.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 ml-1">
                              {item.rating}.0
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.verified && (
                              <span 
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70"
                                title="Verified consultation at Hinduja Hospital / Divya CHS clinic"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Verified</span>
                              </span>
                            )}
                            <Quote className="w-5 h-5 text-slate-200 group-hover:text-sky-200 transition-colors stroke-[1.5]" />
                          </div>
                        </div>

                        {/* Consultation Type Badge */}
                        <div className="mb-3.5">
                          <span className="inline-block text-[11px] font-semibold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">
                            {item.consultationType}
                          </span>
                        </div>

                        {/* Review Content */}
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                          "{item.review}"
                        </p>
                      </div>

                      {/* Patient Attribution Footer */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-700 to-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {item.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {item.patientName}
                            </div>
                            <div className="text-[11px] text-slate-400 font-normal truncate flex items-center gap-1">
                              {item.location && <span>{item.location}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-400 shrink-0 font-medium">
                          {item.date}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Navigation Controls Bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Autoplay & Indicator Info */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(prev => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200/90 hover:bg-slate-50 transition-colors cursor-pointer"
                  title={isAutoPlaying ? 'Pause automatic slideshow' : 'Start automatic slideshow'}
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-sky-700" />
                      <span>Autoplay: On</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-slate-500" />
                      <span>Autoplay: Paused</span>
                    </>
                  )}
                </button>

                <span className="text-xs text-slate-500">
                  Showing {currentIndex + 1}–{Math.min(currentIndex + cardsPerView, totalCards)} of {totalCards} reviews
                </span>
              </div>

              {/* Indicator Dots */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Jump to review slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                      currentIndex === index
                        ? 'w-6 bg-sky-800'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next Action Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:bg-sky-50 hover:text-sky-900 hover:border-sky-300 shadow-2xs transition-all cursor-pointer disabled:opacity-40"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:bg-sky-50 hover:text-sky-900 hover:border-sky-300 shadow-2xs transition-all cursor-pointer disabled:opacity-40"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Ethical Transparency Note & Patient Trust */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-2xl mx-auto flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            Patient reviews are submitted voluntarily with informed consent. In compliance with medical ethics, testimonials represent individual health experiences and individual diagnostic outcomes vary.
          </span>
        </div>

      </div>
    </section>
  );
};
