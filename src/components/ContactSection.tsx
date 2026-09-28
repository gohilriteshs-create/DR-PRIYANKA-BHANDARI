import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  Navigation, 
  ExternalLink,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  Compass
} from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';

export const ContactSection: React.FC = () => {
  const { profile, clinicContact } = useMedicalData();
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const cleanPhone = clinicContact.phone.replace(/[^+\d]/g, '');
  const cleanWhatsApp = clinicContact.whatsapp.replace(/[^+\d]/g, '');

  const fullAddress = `${clinicContact.addressLine1}, ${clinicContact.addressLine2}, ${clinicContact.city}, ${clinicContact.stateZip}`;
  
  // High-accuracy Google Maps query embed for Shop Number 3, Divya CHS LTD, Malad East
  const mapEmbedUrl = clinicContact.googleMapsEmbedUrl || 
    `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  
  const directionsUrl = clinicContact.googleMapsDirectionsUrl || 
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50/70 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
            Clinic Access & Location
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Contact & Clinic Timings
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Get in touch with Dr. Priyanka Bhandari’s medical practice for appointment confirmations, location assistance, or patient queries.
          </p>
        </div>

        {/* Contact Info & Interactive Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact & Timing Cards */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Doctor Branding Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {profile.name}, <span className="text-sky-800">{profile.qualification}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {clinicContact.clinicName}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>

              {/* Contact Details List */}
              <div className="mt-5 space-y-4 text-sm">
                
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-700 shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider">
                      Clinic Location
                    </span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      {clinicContact.addressLine1}, {clinicContact.addressLine2}<br />
                      {clinicContact.city}, {clinicContact.stateZip}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-sky-700 shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider">
                      Clinic Desk Phone
                    </span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-sky-800 hover:text-sky-950 font-medium hover:underline mt-0.5 block"
                    >
                      {clinicContact.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider">
                      WhatsApp Inquiries
                    </span>
                    <a
                      href={`https://wa.me/${cleanWhatsApp.replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-medium hover:underline mt-0.5 block"
                    >
                      {clinicContact.whatsapp}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-sky-700 shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider">
                      Email Communication
                    </span>
                    <a
                      href={`mailto:${clinicContact.email}`}
                      className="text-slate-600 hover:text-sky-800 font-medium mt-0.5 block"
                    >
                      {clinicContact.email}
                    </a>
                  </div>
                </div>

              </div>

              {/* Three Quick Action Buttons */}
              <div className="mt-7 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2.5">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-sky-800 text-white font-semibold text-xs hover:bg-sky-900 transition-colors shadow-2xs text-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsApp.replace('+', '')}?text=Hello%20Dr.%20Priyanka%20Bhandari%20Clinic,%20I%20would%20like%20to%20inquire%20about%20a%20consultation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-2xs text-center"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={clinicContact.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-2xs text-center"
                >
                  <Navigation className="w-3.5 h-3.5 text-sky-700" />
                  <span>Directions</span>
                </a>
              </div>

            </div>

            {/* Consultation Hours Schedule Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Clock className="w-4 h-4 text-sky-700" />
                  <span>Weekly Consultation Schedule</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullSchedule(!showFullSchedule)}
                  className="text-xs text-sky-800 font-semibold hover:underline"
                >
                  {showFullSchedule ? 'Collapse' : 'View All Days'}
                </button>
              </div>

              <div className="mt-4 divide-y divide-slate-100 text-xs">
                {(showFullSchedule ? clinicContact.schedule : clinicContact.schedule.slice(0, 3)).map((item) => (
                  <div key={item.day} className="py-2.5 flex items-center justify-between">
                    <span className="font-semibold text-slate-800 w-24">{item.day}</span>
                    <div className="text-right text-slate-600">
                      {item.isOpen ? (
                        <div>
                          <span>{item.morningSlot}</span>
                          <span className="mx-1.5 text-slate-300">·</span>
                          <span>{item.eveningSlot}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">Sunday On-Call Only</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Google Maps Location Embed & Accessibility Guidance */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Malad East Clinic Map</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Shop Number 3, Divya CHS LTD
                  </h3>
                  <p className="text-xs text-slate-500">
                    Triveni Nagar Rd, Kurar Village, Malad East, Mumbai 400097
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                    title="Copy full address"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span className="text-teal-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-800 hover:bg-sky-900 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>

              {/* Google Maps Embed Container with Pin Overlay */}
              <div className="relative aspect-4/3 sm:aspect-[16/11] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                <iframe
                  title="Dr. Priyanka Bhandari Clinic Location - Shop Number 3, Divya CHS LTD, Malad East"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                />

                {/* Quiet Floating Clinic Badge on Map */}
                <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md flex items-center gap-2.5 max-w-[280px]">
                  <div className="w-7 h-7 rounded-lg bg-sky-700 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      Dr. Priyanka Bhandari Clinic
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Shop No. 3, Divya CHS, Malad East
                    </div>
                  </div>
                </div>
              </div>

              {/* Transit & Arrival Notes */}
              <div className="mt-5 space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Exact Address:</strong> Shop Number 3, Divya CHS LTD, Triveni Nagar Rd, Vaishet Pada, Kurar Village, Malad East, Mumbai 400097.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Accessibility:</strong> Easy vehicular approach from Western Express Highway and Malad railway station with street parking nearby.
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
