import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  CheckCircle,
  X,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { districts } from '../lib/translations';
import { Incident, DonorSupply } from '../lib/types';

interface DonorHubProps {
  incidents: Incident[];
  donorSupplies: DonorSupply[];
  onAddSupply: (supply: Omit<DonorSupply, 'id' | 'created_at' | 'matched'>) => void;
}

export function DonorHub({ incidents, donorSupplies, onAddSupply }: DonorHubProps) {
  const { t, language } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [matchResults, setMatchResults] = useState<{ incidentId: string; supplyId: string }[]>([]);
  const [hasMatched, setHasMatched] = useState(false);

  // Resource requests from open incidents
  const resourceRequests = useMemo(() => {
    return incidents
      .filter(i => i.status === 'Open' || i.status === 'Dispatching')
      .map(incident => ({
        incidentId: incident.id,
        resourceType: incident.category === 'Food & Rations' ? 'Food' :
          incident.category === 'Medical Support' ? 'Medical' :
            incident.category === 'Shelter' ? 'Shelter' :
              incident.category === 'Rescue' ? 'Rescue Equipment' : 'Other',
        location: incident.district,
        urgency: incident.priority,
        description: incident.description.substring(0, 50) + '...'
      }));
  }, [incidents]);

  // Smart Match Algorithm
  const handleSmartMatch = () => {
    const matches: { incidentId: string; supplyId: string }[] = [];

    resourceRequests.forEach(request => {
      donorSupplies.forEach(supply => {
        if (supply.matched) return;

        // Match by category
        const requestCategory = request.resourceType.toLowerCase();
        const supplyCategory = supply.category.toLowerCase();
        const matchesCategory = requestCategory.includes(supplyCategory) ||
          supplyCategory.includes(requestCategory);

        // Match by district (same district gets priority)
        const sameDistrict = request.location === supply.district;

        if (matchesCategory) {
          matches.push({
            incidentId: request.incidentId,
            supplyId: supply.id
          });
        }
      });
    });

    setMatchResults(matches);
    setHasMatched(true);
  };

  // Check if item is matched
  const isMatched = (supplyId: string) => {
    return matchResults.some(m => m.supplyId === supplyId);
  };

  const getMatchedIncident = (supplyId: string) => {
    const match = matchResults.find(m => m.supplyId === supplyId);
    if (match) {
      return incidents.find(i => i.id === match.incidentId);
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">{t('donorHubTitle')}</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSmartMatch}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold rounded-lg flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {t('smartMatch')}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('addDonation')}
          </button>
        </div>
      </div>

      {/* Match Results Banner */}
      {hasMatched && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-emerald-300 font-medium">Smart Match Complete</p>
              <p className="text-emerald-400/70 text-sm">
                Found {matchResults.length} potential {t('matches')} between requests and available supplies
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Resource Requests */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 bg-slate-900/50">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              {t('activeRequests')} ({resourceRequests.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-700/50 max-h-[600px] overflow-y-auto">
            {resourceRequests.map((request, idx) => (
              <div key={request.incidentId || idx} className="p-4 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-cyan-400 font-mono text-xs">{request.incidentId}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${request.urgency === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        request.urgency === 'High' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {request.urgency}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium">{request.resourceType}</p>
                    <p className="text-slate-400 text-xs mt-1">{request.description}</p>
                    <p className="text-slate-500 text-xs mt-1">{request.location}</p>
                  </div>
                </div>
              </div>
            ))}
            {resourceRequests.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No active resource requests
              </div>
            )}
          </div>
        </div>

        {/* Available Donor Supplies */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 bg-slate-900/50">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" />
              {t('availableSupplies')} ({donorSupplies.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-700/50 max-h-[600px] overflow-y-auto">
            {donorSupplies.map((supply) => {
              const matched = isMatched(supply.id);
              const matchedIncident = matched ? getMatchedIncident(supply.id) : null;

              return (
                <div
                  key={supply.id}
                  className={`p-4 transition-all ${matched ? 'bg-emerald-500/10 border-l-4 border-emerald-500' : 'hover:bg-slate-700/20'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-emerald-400 font-mono text-xs">{supply.id}</span>
                        {matched && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Matched
                          </span>
                        )}
                      </div>
                      <p className="text-white text-sm font-medium">{supply.item_name}</p>
                      <p className="text-slate-400 text-xs">
                        {supply.quantity} {supply.unit} from {supply.donor_name}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">{supply.location} - {supply.district}</p>
                      {matched && matchedIncident && (
                        <div className="mt-2 p-2 bg-slate-900/50 rounded text-xs text-slate-400">
                          <span className="text-emerald-400">→</span> {t('matches')} {matchedIncident.id} ({matchedIncident.district})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Donation Modal */}
      {showAddModal && (
        <AddDonationModal
          onClose={() => setShowAddModal(false)}
          onSubmit={(supply) => {
            onAddSupply(supply);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function AddDonationModal({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (supply: Omit<DonorSupply, 'id' | 'created_at' | 'matched'>) => void;
}) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    donor_name: '',
    organization: '',
    contact: '',
    location: '',
    district: '',
    item_name: '',
    category: 'Food & Rations',
    quantity: 0,
    unit: 'units'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{t('addDonation')}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('donorName')} *</label>
              <input
                type="text"
                required
                value={formData.donor_name}
                onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('organization')}</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Contact *</label>
              <input
                type="text"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('selectDistrict')} *</label>
              <select
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="">Select...</option>
                {districts.map(d => (
                  <option key={d.en} value={d.en}>{language === 'si' ? d.si : d.en}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">{t('itemName')} *</label>
            <input
              type="text"
              required
              value={formData.item_name}
              onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm"
              placeholder="e.g., Water Bottles"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="Food & Rations">Food & Rations</option>
                <option value="Medical Support">Medical Support</option>
                <option value="Shelter">Shelter</option>
                <option value="Rescue Equipment">Rescue Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">{t('quantity')} *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Unit *</label>
              <select
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="units">Units</option>
                <option value="packs">Packs</option>
                <option value="kg">Kg</option>
                <option value="liters">Liters</option>
                <option value="bottles">Bottles</option>
                <option value="kits">Kits</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg transition-all"
            >
              Add Donation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
