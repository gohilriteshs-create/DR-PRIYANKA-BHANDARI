import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Navigation, 
  ExternalLink,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  Compass,
  Train,
  Car
} from 'lucide-react';
import { useMedicalData } from '../context/MedicalDataContext';
import { ClinicInteractiveMap } from './ClinicInteractiveMap';
import { ClinicPhotoCarousel } from './ClinicPhotoCarousel';
import { WhatsAppIcon } from './WhatsAppIcon';

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
        <div className="max-w-3xl mx-auto text-center mb-10">
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

        {/* Clinic Recognition Photo Carousel: Exterior, Reception, Consultation & Examination Rooms */}
        <div className="mb-12">
          <ClinicPhotoCarousel directionsUrl={directionsUrl} />
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
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
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
                  <WhatsAppIcon className="w-3.5 h-3.5" />
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

          {/* Right Column: Interactive Clinic Map & Transit Navigation */}
          <div className="lg:col-span-6 space-y-6">
            <ClinicInteractiveMap
              clinicName={clinicContact.clinicName}
              doctorName={profile.name}
              qualification={profile.qualification}
              address={fullAddress}
              phone={clinicContact.phone}
              directionsUrl={directionsUrl}
              googleMapsEmbedUrl={mapEmbedUrl}
            />

            {/* Practical Arrival & Landmark Guide */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Visitor &amp; Patient Arrival Notes</span>
                </span>
                <span className="text-[11px] text-slate-400">Ground floor access</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                  <Train className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block text-[11px]">Via Metro or Local Train</strong>
                    <span>Get off at Kurar Metro (Line 7) or Malad Railway Station (East exit). Direct auto-rickshaws available to Divya CHS.</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block text-[11px]">By Car / Two-Wheeler</strong>
                    <span>Direct turn from Western Express Highway into Triveni Nagar Road. Two-wheeler &amp; patient drop-off parking available outside Divya CHS.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
