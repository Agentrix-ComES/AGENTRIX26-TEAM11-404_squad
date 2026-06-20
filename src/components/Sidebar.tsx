import React from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  FileWarning,
  Package,
  LogOut,
  Shield,
  Globe
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';
import { Language } from '../lib/types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard'), emoji: '' },
    { id: 'incidents', icon: AlertTriangle, label: t('incidents'), emoji: '' },
    { id: 'report', icon: FileWarning, label: t('reportEmergency'), emoji: '' },
    { id: 'donor', icon: Package, label: t('donorHub'), emoji: '' },
  ];

  const toggleLanguage = () => {
    const newLang: Language = language === 'en' ? 'si' : 'en';
    setLanguage(newLang);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900/95 backdrop-blur-lg border-r border-slate-700/50 flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">{t('appTitle')}</h1>
            <p className="text-slate-400 text-xs">{t('appSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentPage === item.id ? 'text-cyan-400' : ''}`} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Language Toggle */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all"
        >
          <Globe className="w-5 h-5" />
          <div className="flex-1 flex items-center justify-between">
            <span className="text-sm font-medium">{language === 'en' ? 'English' : 'සිංහල'}</span>
            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">
              {language === 'en' ? 'SI' : 'EN'}
            </span>
          </div>
        </button>
      </div>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.full_name || 'User'}</p>
            <p className="text-slate-400 text-xs truncate">{user?.role || 'coordinator'}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}
