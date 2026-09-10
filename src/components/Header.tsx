import React from 'react';
import { TabType } from '../types';
import { Users, BarChart3, Shield, Copy, Check, Database, CheckCircle2, AlertTriangle, Sun, Moon } from 'lucide-react';
import { SupabaseStatus } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  playerCount: number;
  evaluationsCount: number;
  onOpenPromptModal: () => void;
  onOpenSupabaseModal: () => void;
  supabaseStatus: SupabaseStatus | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  playerCount,
  evaluationsCount,
  onOpenPromptModal,
  onOpenSupabaseModal,
  supabaseStatus
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`${isDark ? 'bg-[#041638]' : 'bg-[#002b7a]'} border-b-4 border-red-600 shadow-xl relative z-10 transition-colors duration-200`}>
      {/* Top Club Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:py-6 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-4">
            {/* Universidad de Chile Emblem Badge */}
            <div 
              id="uch-club-crest" 
              className={`w-16 h-16 sm:w-20 sm:h-20 ${isDark ? 'bg-[#002B7A]' : 'bg-[#001f5c]'} border-2 border-red-600 rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden flex-shrink-0`}
            >
              {/* Inner red ring and iconic 'U' */}
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg ${isDark ? 'bg-[#001f5c]' : 'bg-[#001744]'} border border-red-500/60 flex flex-col items-center justify-center`}>
                <span className="font-athletic font-extrabold text-3xl sm:text-4xl text-red-600 tracking-tighter leading-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  U
                </span>
                <span className="text-[9px] font-bold text-slate-300 tracking-wider uppercase mt-0.5">
                  1927
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-red-600 text-white rounded border border-red-500">
                  Club Universidad de Chile
                </span>
                <span className="hidden sm:inline-block text-xs font-medium text-blue-200/90">
                  El Romántico Viajero
                </span>
              </div>
              <h1 id="app-main-title" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-athletic uppercase">
                Universidad de Chile
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                Sistema Oficial de Plantel Profesional y Evaluaciones Deportivas
              </p>
            </div>
          </div>

          {/* Quick Actions, Theme Toggle, Supabase Connection & Prompt button */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            {/* BOTÓN MODO CLARO / OSCURO */}
            <button
              id="btn-toggle-theme"
              onClick={toggleTheme}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 border-2 transition-all cursor-pointer shadow-md active:scale-95 ${
                isDark
                  ? 'bg-[#082252] hover:bg-[#0c3175] text-amber-300 border-amber-400/80 hover:border-amber-300'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-900 border-amber-500 font-extrabold shadow-amber-900/20'
              }`}
              title={isDark ? 'Cambiar a Versión Clara' : 'Cambiar a Versión Oscura'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Versión Clara</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-900" />
                  <span>Versión Oscura</span>
                </>
              )}
            </button>

            {/* Supabase Indicator Button */}
            <button
              id="btn-supabase-status"
              onClick={onOpenSupabaseModal}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border-2 transition-all cursor-pointer ${
                supabaseStatus?.tablesExist
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 hover:bg-emerald-900'
                  : isDark
                    ? 'bg-[#082252] text-amber-300 border-amber-500/80 hover:bg-amber-950/60'
                    : 'bg-[#001f5c] text-amber-300 border-amber-400 hover:bg-[#001847]'
              }`}
              title="Ver estado y sincronización con Supabase"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase</span>
              {supabaseStatus?.tablesExist ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            <button
              id="btn-view-prompt"
              onClick={onOpenPromptModal}
              className={`px-3 py-2 ${
                isDark ? 'bg-[#082252] hover:bg-[#0c3175]' : 'bg-[#001f5c] hover:bg-[#001744]'
              } text-blue-100 hover:text-white border-2 border-red-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer`}
              title="Ver el prompt optimizado para AI Studio"
            >
              <Copy className="w-3.5 h-3.5 text-red-400" />
              <span>Prompt AI Studio</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-blue-900/60 pt-3 pb-2 gap-3 overflow-x-auto">
          <button
            id="tab-plantilla"
            onClick={() => setActiveTab('plantilla')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm sm:text-base uppercase tracking-wider font-athletic transition-all cursor-pointer border-2 ${
              activeTab === 'plantilla'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/40'
                : isDark
                  ? 'bg-[#061e47] text-blue-200 hover:text-white hover:bg-[#0a2b66] border-red-600/40'
                  : 'bg-[#001f5c] text-blue-100 hover:text-white hover:bg-[#001642] border-red-600/50'
            }`}
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>1. Plantilla</span>
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-sans font-bold ${
              activeTab === 'plantilla' ? 'bg-white/20 text-white' : 'bg-blue-900/60 text-blue-200'
            }`}>
              {playerCount}
            </span>
          </button>

          <button
            id="tab-evaluaciones"
            onClick={() => setActiveTab('evaluaciones')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm sm:text-base uppercase tracking-wider font-athletic transition-all cursor-pointer border-2 ${
              activeTab === 'evaluaciones'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/40'
                : isDark
                  ? 'bg-[#061e47] text-blue-200 hover:text-white hover:bg-[#0a2b66] border-red-600/40'
                  : 'bg-[#001f5c] text-blue-100 hover:text-white hover:bg-[#001642] border-red-600/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>2. Evaluaciones (1 al 5)</span>
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-sans font-bold ${
              activeTab === 'evaluaciones' ? 'bg-white/20 text-white' : 'bg-blue-900/60 text-blue-200'
            }`}>
              {evaluationsCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

