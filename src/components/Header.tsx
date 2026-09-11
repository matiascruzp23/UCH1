import React from 'react';
import { TabType } from '../types';
import { Users, BarChart3, Shield, Check, Database, CheckCircle2, AlertTriangle, Sun, Moon, Trophy } from 'lucide-react';
import { SupabaseStatus } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  playerCount: number;
  evaluationsCount: number;
  matchCount?: number;
  onOpenPromptModal?: () => void;
  onOpenSupabaseModal: () => void;
  supabaseStatus: SupabaseStatus | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  playerCount,
  evaluationsCount,
  matchCount = 0,
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
            {/* Escudo Real Club Universidad de Chile */}
            <div 
              id="uch-club-crest" 
              className="w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center relative flex-shrink-0 transition-transform duration-200 hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            >
              <img
                src="/uchile_escudo.png"
                alt="Escudo Oficial Club Universidad de Chile"
                className="w-full h-full object-contain filter drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-red-600 text-white rounded border border-red-500 shadow-xs">
                  Club Universidad de Chile
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

          {/* Quick Actions: Theme Toggle & Supabase Connection */}
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm sm:text-base uppercase tracking-wider font-athletic transition-all cursor-pointer border-2 whitespace-nowrap ${
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

          <button
            id="tab-estadisticas"
            onClick={() => setActiveTab('estadisticas')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm sm:text-base uppercase tracking-wider font-athletic transition-all cursor-pointer border-2 whitespace-nowrap ${
              activeTab === 'estadisticas'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/40'
                : isDark
                  ? 'bg-[#061e47] text-blue-200 hover:text-white hover:bg-[#0a2b66] border-red-600/40'
                  : 'bg-[#001f5c] text-blue-100 hover:text-white hover:bg-[#001642] border-red-600/50'
            }`}
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>3. Partidos y Estadísticas</span>
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-sans font-bold ${
              activeTab === 'estadisticas' ? 'bg-white/20 text-white' : 'bg-blue-900/60 text-blue-200'
            }`}>
              {matchCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

