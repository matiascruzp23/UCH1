import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  UploadCloud,
  DownloadCloud,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import {
  SUPABASE_URL,
  SUPABASE_SQL_SCRIPT,
  SUPABASE_STATS_SQL_SCRIPT,
  SUPABASE_PLAYERS_UPDATE_SQL,
  SupabaseStatus,
  checkSupabaseStatus,
  seedInitialDataToSupabase
} from '../lib/supabase';
import { Player, PlayerEvaluation } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: SupabaseStatus | null;
  onRefreshStatus: () => Promise<void>;
  players: Player[];
  evaluations: Record<string, PlayerEvaluation[]>;
  onPullFromSupabase: () => Promise<void>;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefreshStatus,
  players,
  evaluations,
  onPullFromSupabase
}) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [sqlTab, setSqlTab] = useState<'players' | 'stats' | 'full'>('players');
  const [isSeeding, setIsSeeding] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const currentSqlScript =
    sqlTab === 'players'
      ? SUPABASE_PLAYERS_UPDATE_SQL
      : sqlTab === 'stats'
      ? SUPABASE_STATS_SQL_SCRIPT
      : SUPABASE_SQL_SCRIPT;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(currentSqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setActionMessage(null);
    try {
      const allEvaluations: PlayerEvaluation[] = (Object.values(evaluations) as PlayerEvaluation[][]).flat();
      const res = await seedInitialDataToSupabase(players, allEvaluations);
      if (res.success) {
        setActionMessage({ type: 'success', text: res.message });
        await onRefreshStatus();
      } else {
        setActionMessage({ type: 'error', text: res.message });
      }
    } catch (e: any) {
      setActionMessage({ type: 'error', text: e?.message || 'Error al sincronizar' });
    } finally {
      setIsSeeding(false);
    }
  };

  const handlePullData = async () => {
    setIsPulling(true);
    setActionMessage(null);
    try {
      await onPullFromSupabase();
      setActionMessage({ type: 'success', text: 'Datos cargados exitosamente desde Supabase.' });
    } catch (e: any) {
      setActionMessage({ type: 'error', text: e?.message || 'Error al obtener datos' });
    } finally {
      setIsPulling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-supabase-sync"
        className={`${
          isDark ? 'bg-[#031533] text-white' : 'bg-white text-slate-900'
        } border-2 border-red-600 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors`}
      >
        {/* Header */}
        <div className={`${
          isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
        } border-b-2 border-red-600 px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center border border-emerald-400 shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase text-white font-athletic tracking-wide">
                Integración con Supabase
              </h2>
              <p className="text-xs text-blue-200">
                Almacenamiento en la nube de Plantilla e Historial de Evaluaciones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white p-2 rounded-lg hover:bg-blue-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status Box */}
          <div className={`${
            isDark ? 'bg-[#071d44] border-red-600/70' : 'bg-slate-50 border-red-600/70 shadow-2xs'
          } border-2 rounded-xl p-4 space-y-3 transition-colors`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-blue-200' : 'text-slate-700'
                }`}>
                  Estado de Conexión:
                </span>
                {status?.tablesExist ? (
                  <span className="px-2.5 py-0.5 bg-emerald-600/30 text-emerald-500 border border-emerald-500 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sincronizado y Operativo
                  </span>
                ) : status?.connected ? (
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-500 border border-amber-500/50 rounded-full text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Conectado (Tablas Pendientes en SQL)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-red-600/30 text-red-500 border border-red-500 rounded-full text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Verificando Conexión...
                  </span>
                )}
              </div>

              <button
                onClick={() => onRefreshStatus()}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  isDark
                    ? 'bg-[#020e26] hover:bg-blue-900 text-blue-200 hover:text-white border-blue-800'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-2xs'
                }`}
              >
                <RefreshCw className="w-3 h-3 text-red-500" />
                <span>Comprobar Estado</span>
              </button>
            </div>

            {/* Connection Details */}
            <div className={`rounded-lg p-3 text-xs space-y-1 font-mono border ${
              isDark
                ? 'bg-[#020e26] text-blue-200 border-blue-900/60'
                : 'bg-white text-slate-700 border-slate-200 shadow-2xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-blue-400' : 'text-slate-500'}>Endpoint:</span>
                <span className={`font-semibold truncate max-w-[280px] sm:max-w-md ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {SUPABASE_URL}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-blue-400' : 'text-slate-500'}>Autenticación:</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Clave pública Anon configurada
                </span>
              </div>
              {status?.message && (
                <div className={`pt-1 text-[11px] border-t font-sans ${
                  isDark ? 'text-blue-300 border-blue-900/50' : 'text-slate-500 border-slate-200'
                }`}>
                  {status.message}
                </div>
              )}
            </div>
          </div>

          {/* Action Message Alert */}
          {actionMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                actionMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-red-50 border-red-500 text-red-800'
              }`}
            >
              {actionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{actionMessage.text}</span>
            </div>
          )}

          {/* Step 1: SQL Setup */}
          <div className={`${
            isDark ? 'bg-[#071d44] border-red-600/70' : 'bg-slate-50 border-red-600/70 shadow-2xs'
          } border-2 rounded-xl p-4 space-y-3 transition-colors`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-red-500" />
                <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Paso 1: Estructura de Tablas en Supabase
                </h3>
              </div>
              <a
                href="https://supabase.com/dashboard/project/ggilenmealydjwbxwdbb/sql/new"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold underline"
              >
                Abrir SQL Editor
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-blue-200/90' : 'text-slate-600'}`}>
              Ejecuta el script en el <strong>SQL Editor</strong> de Supabase para crear las tablas con claves foráneas e índices optimizados:
            </p>

            {/* SQL Script Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSqlTab('players')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                  sqlTab === 'players'
                    ? 'bg-red-600 text-white border-red-400 shadow-xs'
                    : isDark
                      ? 'bg-[#020d24] text-blue-300 border-blue-900'
                      : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                ⭐ Actualizar Plantel (23 Jugadores)
              </button>

              <button
                type="button"
                onClick={() => setSqlTab('stats')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                  sqlTab === 'stats'
                    ? 'bg-red-600 text-white border-red-400 shadow-xs'
                    : isDark
                      ? 'bg-[#020d24] text-blue-300 border-blue-900'
                      : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                Tablas Estadísticas & Partidos
              </button>

              <button
                type="button"
                onClick={() => setSqlTab('full')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                  sqlTab === 'full'
                    ? 'bg-red-600 text-white border-red-400 shadow-xs'
                    : isDark
                      ? 'bg-[#020d24] text-blue-300 border-blue-900'
                      : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                Script Completo
              </button>
            </div>

            {/* Code Block with Copy Button */}
            <div className="relative">
              <pre className={`border rounded-lg p-3 text-[11px] font-mono overflow-x-auto max-h-48 ${
                isDark ? 'bg-[#020e26] border-blue-900 text-blue-100' : 'bg-white border-slate-300 text-slate-800'
              }`}>
                {currentSqlScript}
              </pre>
              <button
                onClick={handleCopySQL}
                className="absolute top-2 right-2 px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>
          </div>

          {/* Step 2: Sincronización y Subida */}
          <div className={`${
            isDark ? 'bg-[#071d44] border-red-600/70' : 'bg-slate-50 border-red-600/70 shadow-2xs'
          } border-2 rounded-xl p-4 space-y-3 transition-colors`}>
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-red-500" />
              <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Paso 2: Acciones de Sincronización de Datos
              </h3>
            </div>
            <p className={`text-xs ${isDark ? 'text-blue-200/90' : 'text-slate-600'}`}>
              Una vez creadas las tablas, puedes enviar todo el plantel actual de la Universidad de Chile (23 jugadores) y su historial de evaluaciones directamente a la base de datos Supabase:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                id="btn-subir-a-supabase"
                onClick={handleSeedData}
                disabled={isSeeding}
                className="px-4 py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-red-400 flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98 cursor-pointer"
              >
                <UploadCloud className={`w-4 h-4 ${isSeeding ? 'animate-bounce' : ''}`} />
                <span>{isSeeding ? 'Guardando en Supabase...' : 'Subir Plantel e Historial a Supabase'}</span>
              </button>

              <button
                id="btn-cargar-de-supabase"
                onClick={handlePullData}
                disabled={isPulling}
                className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#020e26] hover:bg-blue-900/70 text-blue-100 border-blue-700'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-2xs'
                }`}
              >
                <DownloadCloud className={`w-4 h-4 text-red-500 ${isPulling ? 'animate-spin' : ''}`} />
                <span>{isPulling ? 'Obteniendo...' : 'Recargar Datos desde Supabase'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${
          isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
        } border-t-2 border-red-600 px-6 py-4 flex items-center justify-between`}>
          <span className="text-xs text-blue-200">
            Fondo Azul & Bordes Rojos • Base de Datos Supabase
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-red-400 transition-colors cursor-pointer"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
