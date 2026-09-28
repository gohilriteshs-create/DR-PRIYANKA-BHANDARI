import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Layers, 
  Train, 
  Bus, 
  Car, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Copy, 
  Check, 
  ExternalLink,
  Phone,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

interface ClinicInteractiveMapProps {
  clinicName: string;
  doctorName: string;
  qualification: string;
  address: string;
  phone: string;
  directionsUrl: string;
  googleMapsEmbedUrl?: string;
}

// Clinic GPS Coordinates (Shop No. 3, Divya CHS, Kurar Village, Malad East, Mumbai 400097)
const CLINIC_COORDS: [number, number] = [19.1865, 72.8624];

interface Landmark {
  id: string;
  name: string;
  type: 'metro' | 'train' | 'highway' | 'bus';
  coords: [number, number];
  distance: string;
  travelTime: string;
  description: string;
}

const NEARBY_LANDMARKS: Landmark[] = [
  {
    id: 'metro-kurar',
    name: 'Kurar Metro Station (Line 7)',
    type: 'metro',
    coords: [19.1882, 72.8572],
    distance: '1.2 km',
    travelTime: '4-5 mins by auto',
    description: 'Direct Metro Line 7 (Andheri East - Dahisar East). Exit east toward Kurar Village.'
  },
  {
    id: 'station-malad',
    name: 'Malad Railway Station (Western Line)',
    type: 'train',
    coords: [19.1860, 72.8488],
    distance: '2.5 km',
    travelTime: '10-12 mins by auto',
    description: 'Western Suburban Railway hub. Take an auto-rickshaw from Malad East auto stand directly to Divya CHS.'
  },
  {
    id: 'highway-weh',
    name: 'Western Express Highway (WEH)',
    type: 'highway',
    coords: [19.1870, 72.8590],
    distance: '800 m',
    travelTime: '2-3 mins by car/bike',
    description: 'Immediate access from WEH via Triveni Nagar Road into Kurar Village.'
  },
  {
    id: 'bus-triveni',
    name: 'Kurar / Triveni Nagar Bus Stop',
    type: 'bus',
    coords: [19.1858, 72.8615],
    distance: '150 m',
    travelTime: '2 mins walk',
    description: 'Frequent BEST feeder buses (348, 281, 460) running from Malad station.'
  }
];

// Tile Layer Configurations
const MAP_LAYERS = {
  standard: {
    name: 'Street View',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  },
  detailed: {
    name: 'Transit & Details',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/" target="_blank">CARTO</a>'
  }
};

export const ClinicInteractiveMap: React.FC<ClinicInteractiveMapProps> = ({
  clinicName,
  doctorName,
  qualification,
  address,
  phone,
  directionsUrl,
  googleMapsEmbedUrl
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const landmarkMarkersRef = useRef<L.Marker[]>([]);
  const clinicMarkerRef = useRef<L.Marker | null>(null);

  // Component State
  const [activeLayer, setActiveLayer] = useState<'standard' | 'detailed' | 'satellite'>('detailed');
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTransitTab, setActiveTransitTab] = useState<'metro' | 'train' | 'road' | 'parking'>('metro');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map is already initialized
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: CLINIC_COORDS,
      zoom: 16,
      minZoom: 12,
      maxZoom: 19,
      zoomControl: false,
      scrollWheelZoom: false
    });

    mapInstanceRef.current = map;

    // Add Tile Layer
    const layerConfig = activeLayer === 'satellite' ? MAP_LAYERS.standard : MAP_LAYERS[activeLayer];
    const tiles = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: 19
    }).addTo(map);
    tileLayerRef.current = tiles;

    // Custom Clinic Pin Icon
    const clinicIconHtml = `
      <div class="relative flex items-center justify-center cursor-pointer group">
        <div class="absolute -inset-2 bg-sky-500/30 rounded-full animate-ping opacity-75"></div>
        <div class="relative w-11 h-11 bg-gradient-to-tr from-sky-800 to-sky-600 rounded-2xl shadow-xl border-2 border-white flex items-center justify-center transform -translate-y-2 hover:scale-110 transition-transform">
          <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
            <circle cx="20" cy="10" r="2"/>
          </svg>
        </div>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-sky-900 rotate-45 border-r border-b border-white"></div>
      </div>
    `;

    const clinicIcon = L.divIcon({
      html: clinicIconHtml,
      className: 'clinic-map-pin',
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -42]
    });

    // Create Clinic Marker with Popup
    const popupContent = document.createElement('div');
    popupContent.className = 'p-4 max-w-xs';
    popupContent.innerHTML = `
      <div class="space-y-2 font-sans text-left">
        <div class="flex items-center gap-1.5 text-[11px] font-bold text-sky-800 uppercase tracking-wider">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Open Clinic Location</span>
        </div>
        <h4 class="text-sm font-bold text-slate-900 leading-tight">
          ${clinicName}
        </h4>
        <p class="text-xs text-slate-600 font-medium">
          ${doctorName} (${qualification})
        </p>
        <p class="text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
          📍 ${address}
        </p>
        <div class="pt-2 flex items-center gap-2">
          <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" 
            class="flex-1 text-center px-3 py-1.5 bg-sky-800 hover:bg-sky-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors">
            Get Directions
          </a>
          <a href="tel:${phone.replace(/[^+\d]/g, '')}" 
            class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors">
            Call Clinic
          </a>
        </div>
      </div>
    `;

    const clinicMarker = L.marker(CLINIC_COORDS, { icon: clinicIcon })
      .addTo(map)
      .bindPopup(popupContent, { minWidth: 260, closeButton: true });

    clinicMarkerRef.current = clinicMarker;

    // Circle radius highlighting the clinic zone (150m walking radius)
    L.circle(CLINIC_COORDS, {
      radius: 120,
      color: '#0284c7',
      fillColor: '#38bdf8',
      fillOpacity: 0.12,
      weight: 1.5,
      dashArray: '4, 4'
    }).addTo(map);

    // Initial timeout to open clinic popup for immediate clarity
    const timer = setTimeout(() => {
      clinicMarker.openPopup();
    }, 600);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run on mount

  // Update Tile Layer dynamically when activeLayer changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (activeLayer === 'satellite') return; // Handled by iframe toggle

    const config = MAP_LAYERS[activeLayer];
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(config.url);
    }
  }, [activeLayer]);

  // Update Landmark Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing landmark markers
    landmarkMarkersRef.current.forEach(m => m.remove());
    landmarkMarkersRef.current = [];

    if (!showLandmarks) return;

    NEARBY_LANDMARKS.forEach((landmark) => {
      const getBgColor = () => {
        switch (landmark.type) {
          case 'metro': return 'bg-amber-600';
          case 'train': return 'bg-emerald-600';
          case 'highway': return 'bg-indigo-600';
          default: return 'bg-purple-600';
        }
      };

      const getIconSvg = () => {
        switch (landmark.type) {
          case 'metro':
            return '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>';
          case 'train':
            return '<rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/>';
          case 'highway':
            return '<path d="m4 19 4-14"/><path d="m16 5 4 14"/><path d="M12 5v2"/><path d="M12 11v2"/><path d="M12 17v2"/>';
          default:
            return '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="15" cy="18" r="2"/>';
        }
      };

      const landmarkHtml = `
        <div class="relative cursor-pointer group transform hover:scale-115 transition-transform">
          <div class="w-8 h-8 ${getBgColor()} text-white rounded-xl shadow-md border-2 border-white flex items-center justify-center">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${getIconSvg()}
            </svg>
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 ${getBgColor()} rotate-45 border-r border-b border-white"></div>
        </div>
      `;

      const icon = L.divIcon({
        html: landmarkHtml,
        className: 'landmark-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30]
      });

      const popup = document.createElement('div');
      popup.className = 'p-3 max-w-[220px] font-sans';
      popup.innerHTML = `
        <div class="text-left space-y-1">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Transit Landmark</div>
          <div class="text-xs font-bold text-slate-900">${landmark.name}</div>
          <div class="text-[11px] font-medium text-sky-800">
            ${landmark.distance} · ${landmark.travelTime}
          </div>
          <div class="text-[10px] text-slate-500 pt-1 leading-snug">
            ${landmark.description}
          </div>
        </div>
      `;

      const marker = L.marker(landmark.coords, { icon })
        .addTo(map)
        .bindPopup(popup);

      marker.on('click', () => {
        setSelectedLandmark(landmark);
      });

      landmarkMarkersRef.current.push(marker);
    });
  }, [showLandmarks]);

  // Center on Clinic Handler
  const handleRecenter = useCallback(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(CLINIC_COORDS, 16, { duration: 1.2 });
    clinicMarkerRef.current?.openPopup();
    setSelectedLandmark(null);
  }, []);

  // Zoom Handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  // Fly to Landmark
  const handleSelectLandmark = (landmark: Landmark) => {
    setSelectedLandmark(landmark);
    if (!mapInstanceRef.current) return;

    // Fly to midpoint between landmark and clinic
    const midLat = (landmark.coords[0] + CLINIC_COORDS[0]) / 2;
    const midLng = (landmark.coords[1] + CLINIC_COORDS[1]) / 2;
    mapInstanceRef.current.flyTo([midLat, midLng], 15, { duration: 1.2 });
  };

  // Copy GPS Coordinates
  const handleCopyGPS = () => {
    navigator.clipboard.writeText('19.1865, 72.8624');
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col transition-all duration-300">
      
      {/* Map Header & View Controls Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-200/70">
              <Compass className="w-3.5 h-3.5 text-sky-700" />
              <span>Interactive Clinic Map</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Malad East, Mumbai</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Shop Number 3, Divya CHS LTD
          </h3>
          <p className="text-xs text-slate-500">
            Triveni Nagar Rd, Kurar Village, Malad East, Mumbai, Maharashtra 400097
          </p>
        </div>

        {/* View Switchers & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Mode Picker */}
          <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveLayer('detailed')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLayer === 'detailed'
                  ? 'bg-sky-800 text-white shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Street &amp; Transit
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('standard')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLayer === 'standard'
                  ? 'bg-sky-800 text-white shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Clean Map
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('satellite')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLayer === 'satellite'
                  ? 'bg-sky-800 text-white shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Recenter Button */}
          <button
            type="button"
            onClick={handleRecenter}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-sky-800 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            title="Re-center on Clinic"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Map Viewport Container */}
      <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : 'h-[380px] sm:h-[440px]'}`}>
        
        {/* Leaflet Map Canvas */}
        <div 
          ref={mapContainerRef} 
          className={`w-full h-full z-0 ${activeLayer === 'satellite' ? 'hidden' : 'block'}`}
          style={{ minHeight: '380px' }}
        />

        {/* High-definition Google Satellite Embed View (shown when satellite tab is active) */}
        {activeLayer === 'satellite' && (
          <div className="w-full h-full relative bg-slate-900">
            <iframe
              title="Google Maps Satellite Imagery - Shop Number 3, Divya CHS, Malad East"
              src={googleMapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent('Shop Number 3, Divya CHS LTD, Kurar Village, Malad East, Mumbai 400097')}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}

        {/* Floating Quick Action Overlay Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
          {/* Clinic Status Pin Tag */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-md flex items-center gap-2.5 max-w-[280px]">
            <div className="w-7 h-7 rounded-xl bg-sky-800 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                Dr. Priyanka Bhandari Clinic
              </div>
              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                <span>Shop No. 3, Divya CHS</span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold">Kurar Village</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Top Right Controls: Landmarks & Fullscreen */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {/* Toggle Transit Markers */}
          <button
            type="button"
            onClick={() => setShowLandmarks(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md shadow-md border transition-all cursor-pointer flex items-center gap-1.5 ${
              showLandmarks 
                ? 'bg-sky-800 text-white border-sky-900' 
                : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>{showLandmarks ? 'Transit Pins: On' : 'Transit Pins: Off'}</span>
          </button>

          {/* Fullscreen Expand/Collapse */}
          <button
            type="button"
            onClick={() => setIsFullscreen(prev => !prev)}
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-sky-800 shadow-md transition-colors self-end cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Floating Custom Zoom Controls on Bottom Right */}
        <div className="absolute bottom-4 right-3 z-10 flex flex-col gap-1">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-md flex items-center justify-center text-base font-bold transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-md flex items-center justify-center text-base font-bold transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            −
          </button>
        </div>

        {/* Selected Landmark Info Toast */}
        {selectedLandmark && (
          <div className="absolute bottom-4 left-3 right-16 sm:right-auto sm:max-w-sm z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-sky-200 shadow-lg text-xs animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">
                  Selected Route Hub
                </span>
                <h4 className="font-bold text-slate-900 mt-0.5">
                  {selectedLandmark.name}
                </h4>
                <p className="text-slate-600 mt-0.5">
                  <strong>{selectedLandmark.distance}</strong> away ({selectedLandmark.travelTime})
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {selectedLandmark.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLandmark(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Transit Landmarks Quick-Select Ribbon */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200/80">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Train className="w-3.5 h-3.5 text-sky-700" />
            <span>Nearby Transit Points &amp; Driving Distance to Clinic:</span>
          </div>
          <span className="text-[11px] text-slate-400">Click point to view route</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {NEARBY_LANDMARKS.map((landmark) => {
            const isSelected = selectedLandmark?.id === landmark.id;
            return (
              <button
                key={landmark.id}
                type="button"
                onClick={() => handleSelectLandmark(landmark)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 shadow-xs ring-1 ring-sky-300'
                    : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {landmark.type === 'metro' && <Train className="w-3.5 h-3.5 text-amber-600" />}
                    {landmark.type === 'train' && <Train className="w-3.5 h-3.5 text-emerald-600" />}
                    {landmark.type === 'highway' && <Car className="w-3.5 h-3.5 text-indigo-600" />}
                    {landmark.type === 'bus' && <Bus className="w-3.5 h-3.5 text-purple-600" />}
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {landmark.name.split(' (')[0]}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {landmark.distance}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>{landmark.travelTime}</span>
                  <span className="text-sky-700 font-semibold group-hover:underline text-[10px]">
                    Focus Map →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Patient Directions & Navigation Links Footer */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* GPS Coordinates & Copy */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">GPS:</span>
          <code className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-mono text-[11px]">
            19.1865° N, 72.8624° E
          </code>
          <button
            type="button"
            onClick={handleCopyGPS}
            className="p-1 text-slate-500 hover:text-sky-800 transition-colors cursor-pointer"
            title="Copy Coordinates"
          >
            {copiedCoords ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Google Maps External Link */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>

          {/* Apple Maps External Link */}
          <a
            href={`https://maps.apple.com/?daddr=19.1865,72.8624&q=${encodeURIComponent('Dr. Priyanka Bhandari Clinic')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            title="Open in Apple Maps"
          >
            <span>Apple Maps</span>
          </a>
        </div>

      </div>

    </div>
  );
};
