import React from 'react';
import {
  AlertTriangle,
  Users,
  Heart,
  Package,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useLanguage } from '../lib/LanguageContext';
import { Incident, DashboardStats, DistrictData, ResourceData } from '../lib/types';

interface DashboardProps {
  incidents: Incident[];
  stats: DashboardStats;
  districtData: DistrictData[];
  resourceData: ResourceData[];
}

export function Dashboard({ incidents, stats, districtData, resourceData }: DashboardProps) {
  const { t } = useLanguage();

  const priorityColors = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#eab308',
    Low: '#22c55e'
  };

  const statusColors = {
    Open: '#ef4444',
    Dispatching: '#f97316',
    'In Progress': '#3b82f6',
    Resolved: '#22c55e'
  };

  const categoryData = [
    { name: t('rescue'), value: incidents.filter(i => i.category === 'Rescue').length, color: '#ef4444' },
    { name: t('foodRations'), value: incidents.filter(i => i.category === 'Food & Rations').length, color: '#f97316' },
    { name: t('medicalSupport'), value: incidents.filter(i => i.category === 'Medical Support').length, color: '#3b82f6' },
    { name: t('shelter'), value: incidents.filter(i => i.category === 'Shelter').length, color: '#8b5cf6' },
    { name: t('infrastructure'), value: incidents.filter(i => i.category === 'Infrastructure').length, color: '#06b6d4' },
  ].filter(item => item.value > 0);

  const progressPercentage = Math.round((stats.reliefPacksDistributed / stats.reliefPacksTarget) * 100);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">{t('liveCommandCenter')}</h1>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-green-400 text-sm">Live</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Emergencies */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 relative overflow-hidden group hover:border-red-500/30 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <p className="text-slate-400 text-sm">{t('activeEmergencies')}</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.activeEmergencies}</p>
          </div>
        </div>

        {/* Families Displaced */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm">{t('familiesDisplaced')}</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.familiesDisplaced.toLocaleString()}</p>
          </div>
        </div>

        {/* Active Volunteers */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <Heart className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm">{t('activeVolunteers')}</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.activeVolunteers}</p>
          </div>
        </div>

        {/* Relief Packs */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-cyan-500/20 rounded-lg">
                <Package className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm">{t('reliefPacksDistributed')}</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-bold text-white">{stats.reliefPacksDistributed.toLocaleString()}</p>
              <p className="text-slate-400 text-sm">/ {stats.reliefPacksTarget.toLocaleString()}</p>
            </div>
            <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-cyan-400 text-xs mt-1">{progressPercentage}% complete</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Supply vs Demand */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t('resourceSupplyVsDemand')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resourceData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="supply" fill="#22c55e" name="Supply" radius={[4, 4, 0, 0]} />
              <Bar dataKey="demand" fill="#ef4444" name="Demand" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Incidents by Category */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Incidents by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incidents by District */}
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">{t('incidentsByDistrict')}</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={districtData} layout="vertical" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis dataKey="district" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="incidents" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            <Bar dataKey="displaced" fill="#f97316" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Critical Incidents */}
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Critical Incidents</h2>
        <div className="space-y-3">
          {incidents
            .filter(i => i.priority === 'Critical')
            .slice(0, 5)
            .map((incident) => (
              <div
                key={incident.id}
                className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-red-500/30 transition-all"
              >
                <div
                  className="w-2 h-12 rounded-full"
                  style={{ backgroundColor: priorityColors[incident.priority] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{incident.description.substring(0, 80)}...</p>
                  <p className="text-slate-400 text-sm">{incident.location} • {incident.district}</p>
                </div>
                <div className="text-right">
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${statusColors[incident.status]}20`,
                      color: statusColors[incident.status]
                    }}
                  >
                    {incident.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
