import React, { useState, useCallback } from 'react';
import {
  Send,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../lib/LanguageContext';
import { districts } from '../lib/translations';
import { parseSituationText, ParsedIncident } from '../lib/nlp';
import { Incident } from '../lib/types';

// Custom marker icon for map
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background: #ef4444; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; border: 3px solid white; transform: rotate(-45deg); box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Sri Lanka center coordinates
const SRI_LANKA_CENTER: [number, number] = [7.8731, 80.7718];

interface LocationPickerProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}

function LocationPicker({ position, setPosition }: LocationPickerProps) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
}

interface ReportEmergencyProps {
  onSubmit: (incident: Omit<Incident, 'id' | 'reported_at'>) => void;
}

export function ReportEmergency({ onSubmit }: ReportEmergencyProps) {
  const { t, language } = useLanguage();
  const [senderName, setSenderName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [situation, setSituation] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedIncident | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Map center based on selected district
  const getMapCenter = useCallback((): [number, number] => {
    if (coordinates) return coordinates;

    const districtCoords: Record<string, [number, number]> = {
      'Badulla': [6.9932, 81.0555],
      'Nuwara Eliya': [6.9497, 80.7891],
      'Kandy': [7.2964, 80.6350],
      'Polonnaruwa': [7.9333, 81.0167],
      'Matale': [7.4675, 80.6234],
      'Kurunegala': [7.4863, 80.3647],
      'Colombo': [6.9271, 79.8612],
      'Gampaha': [7.0873, 79.9960],
      'Kalutara': [6.5805, 79.9612],
      'Ratnapura': [6.7056, 80.3847],
      'Kegalle': [7.2514, 80.3467],
      'Anuradhapura': [8.3114, 80.4037],
    };

    return districtCoords[district] || SRI_LANKA_CENTER;
  }, [district, coordinates]);

  // Analyze situation text in real-time
  const handleSituationChange = (text: string) => {
    setSituation(text);
    if (text.length > 10) {
      const result = parseSituationText(text);
      setParsedResult(result);
    } else {
      setParsedResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderName || !contactNumber || !district || !situation) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const incident: Omit<Incident, 'id' | 'reported_at'> = {
      sender_name: senderName,
      contact_number: contactNumber,
      location: district,
      district: district,
      coordinates: coordinates ? { lat: coordinates[0], lng: coordinates[1] } : undefined,
      category: parsedResult?.category || 'Other',
      priority: parsedResult?.priority || 'Medium',
      description: situation,
      status: 'Open',
    };

    onSubmit(incident);

    // Reset form
    setSenderName('');
    setContactNumber('');
    setDistrict('');
    setSituation('');
    setCoordinates(null);
    setParsedResult(null);
    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const priorityColors = {
    Critical: 'text-red-400 bg-red-500/20',
    High: 'text-orange-400 bg-orange-500/20',
    Medium: 'text-yellow-400 bg-yellow-500/20',
    Low: 'text-green-400 bg-green-500/20'
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">{t('reportAnEmergency')}</h1>

      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500/90 backdrop-blur-lg border border-emerald-400 rounded-xl p-4 flex items-center gap-3 shadow-lg animate-pulse">
          <CheckCircle className="w-6 h-6 text-white" />
          <p className="text-white font-medium">{t('reportSubmitted')}</p>
        </div>
      )}

      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sender Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('senderName')} *
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="e.g., Kamala Perera"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('contactNumber')} *
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="e.g., 077-1234567"
                required
              />
            </div>
          </div>

          {/* District Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('selectDistrict')} *
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              required
            >
              <option value="">{t('selectDistrict')}</option>
              {districts.map(d => (
                <option key={d.en} value={d.en}>
                  {language === 'si' ? d.si : d.en}
                </option>
              ))}
            </select>
          </div>

          {/* Map for Location Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('selectExactLocation')}
              </div>
            </label>
            <p className="text-slate-400 text-sm mb-3">{t('clickToMarkLocation')}</p>
            <div className="h-64 rounded-lg overflow-hidden border border-slate-600">
              <MapContainer
                center={getMapCenter()}
                zoom={8}
                style={{ height: '100%', width: '100%' }}
                key={district}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <LocationPicker position={coordinates} setPosition={setCoordinates} />
              </MapContainer>
            </div>
            {coordinates && (
              <p className="text-cyan-400 text-sm mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('coordinates')}: {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
              </p>
            )}
          </div>

          {/* Situation Details */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('situationDetails')} *
            </label>
            <textarea
              value={situation}
              onChange={(e) => handleSituationChange(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
              placeholder={t('describeSituation')}
              required
            />

            {/* NLP Detection Results */}
            {parsedResult && (
              <div className="mt-3 p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{t('detectedCategory')}:</span>
                    <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 font-medium">
                      {parsedResult.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{t('detectedPriority')}:</span>
                    <span className={`px-2 py-1 rounded font-medium ${priorityColors[parsedResult.priority]}`}>
                      {parsedResult.priority}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !senderName || !contactNumber || !district || !situation}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t('submitReport')}
                </>
              )}
            </button>
          </div>

          {/* Important Notice */}
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-200 text-sm">
              {language === 'si'
                ? 'හදිසි තත්ත්වයකදී, කරුණාකර ප්‍රමාද නොවී තොරතුරු සපයන්න. ඔබගේ වාර්තාව සෘජුවම ආපදා කළමනාකරණ මධ්‍යස්ථානයට යවනු ලැබේ.'
                : 'In case of emergency, please provide information without delay. Your report will be sent directly to the Disaster Management Centre.'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
