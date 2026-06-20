import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Eye,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../lib/LanguageContext';
import { Incident } from '../lib/types';

// Fix for default marker icons in react-leaflet
const defaultIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const priorityIcons: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e'
};

interface IncidentsFeedProps {
  incidents: Incident[];
  onSelectIncident?: (incident: Incident) => void;
}

export function IncidentsFeed({ incidents, onSelectIncident }: IncidentsFeedProps) {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      const matchesSearch = !search ||
        incident.description.toLowerCase().includes(search.toLowerCase()) ||
        incident.location.toLowerCase().includes(search.toLowerCase()) ||
        incident.sender_name.toLowerCase().includes(search.toLowerCase()) ||
        incident.id.toLowerCase().includes(search.toLowerCase());

      const matchesPriority = priorityFilter === 'all' || incident.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
      const matchesDistrict = districtFilter === 'all' || incident.district === districtFilter;

      return matchesSearch && matchesPriority && matchesStatus && matchesDistrict;
    }).sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pDiff !== 0) return pDiff;
      return new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime();
    });
  }, [incidents, search, priorityFilter, statusFilter, districtFilter]);

  const uniqueDistricts = useMemo(() =>
    [...new Set(incidents.map(i => i.district))].sort(),
  [incidents]);

  const handleViewOnMap = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowMapModal(true);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">{t('incidentsFeed')}</h1>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchIncidents')}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="all">{t('allPriorities')}</option>
            <option value="Critical">{t('critical')}</option>
            <option value="High">{t('high')}</option>
            <option value="Medium">{t('medium')}</option>
            <option value="Low">{t('low')}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="all">{t('allStatuses')}</option>
            <option value="Open">{t('open')}</option>
            <option value="Dispatching">{t('dispatching')}</option>
            <option value="In Progress">{t('inProgress')}</option>
            <option value="Resolved">{t('resolved')}</option>
          </select>

          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="all">{t('allDistricts')}</option>
            {uniqueDistricts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('incidentId')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('location')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('category')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('priority')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('reportedTime')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('status')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-cyan-400 font-mono text-sm">{incident.id}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white text-sm">{incident.location}</p>
                        <p className="text-slate-400 text-xs">{incident.district}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300">
                      {incident.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${priorityIcons[incident.priority]}20`,
                        color: priorityIcons[incident.priority]
                      }}
                    >
                      {incident.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {formatTime(incident.reported_at)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: incident.status === 'Open' ? '#ef444420' :
                          incident.status === 'Dispatching' ? '#f9731620' :
                            incident.status === 'In Progress' ? '#3b82f620' : '#22c55e20',
                        color: incident.status === 'Open' ? '#ef4444' :
                          incident.status === 'Dispatching' ? '#f97316' :
                            incident.status === 'In Progress' ? '#3b82f6' : '#22c55e'
                      }}
                    >
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {incident.coordinates && (
                        <button
                          onClick={() => handleViewOnMap(incident)}
                          className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                          title={t('viewOnMap')}
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onSelectIncident?.(incident)}
                        className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                        title={t('viewDetails')}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredIncidents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No incidents found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map Modal */}
      {showMapModal && selectedIncident && selectedIncident.coordinates && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{t('victimLocation')}</h3>
                <p className="text-slate-400 text-sm">{selectedIncident.id} - {selectedIncident.location}</p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-96">
              <MapContainer
                center={[selectedIncident.coordinates.lat, selectedIncident.coordinates.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker
                  position={[selectedIncident.coordinates.lat, selectedIncident.coordinates.lng]}
                  icon={defaultIcon}
                >
                  <Popup>
                    <div className="text-slate-900">
                      <strong>{selectedIncident.id}</strong>
                      <p className="text-sm">{selectedIncident.description.substring(0, 100)}...</p>
                      <p className="text-xs text-gray-500 mt-1">{t('coordinates')}: {selectedIncident.coordinates.lat.toFixed(4)}, {selectedIncident.coordinates.lng.toFixed(4)}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="p-4 bg-slate-900/50 border-t border-slate-700">
              <p className="text-white text-sm">{selectedIncident.description}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
                <span>{t('coordinates')}: {selectedIncident.coordinates.lat.toFixed(4)}, {selectedIncident.coordinates.lng.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
