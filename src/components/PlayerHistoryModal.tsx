import React, { useState } from 'react';
import { Player, PlayerEvaluation, Match, MatchPlayerStat } from '../types';
import {
  X,
  Calendar,
  Plus,
  Edit3,
  Trash2,
  TrendingUp,
  Clock,
  User,
  Shield,
  Activity,
  Trophy,
  Flame,
  Award,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface PlayerHistoryModalProps {
  player: Player | null;
  evaluations: PlayerEvaluation[];
  matches?: Match[];
  matchStats?: MatchPlayerStat[];
  isOpen: boolean;
  onClose: () => void;
  onAddNewEvaluation: (player: Player) => void;
  onEditEvaluation: (player: Player, evaluation: PlayerEvaluation) => void;
  onDeleteEvaluation: (playerId: string, evalId: string) => void;
}

export const PlayerHistoryModal: React.FC<PlayerHistoryModalProps> = ({
  player,
  evaluations,
  matches = [],
  matchStats = [],
  isOpen,
  onClose,
  onAddNewEvaluation,
  onEditEvaluation,
  onDeleteEvaluation
}) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'evaluaciones' | 'estadisticas'>('evaluaciones');

  if (!isOpen || !player) return null;

  // Chronologically sorted evaluations:
  // For the chart: oldest first -> newest last
  const chronologicalEvals = [...evaluations].sort(
    (a, b) => new Date(a.fechaEvaluacion).getTime() - new Date(b.fechaEvaluacion).getTime()
  );

  // For the history list: newest first -> oldest last
  const descEvals = [...evaluations].sort(
    (a, b) => new Date(b.fechaEvaluacion).getTime() - new Date(a.fechaEvaluacion).getTime()
  );

  const totalCount = evaluations.length;
  const avgTec = totalCount > 0 ? (evaluations.reduce((a, b) => a + b.tecnica, 0) / totalCount).toFixed(1) : '-';
  const avgTac = totalCount > 0 ? (evaluations.reduce((a, b) => a + b.tactica, 0) / totalCount).toFixed(1) : '-';
  const avgCon = totalCount > 0 ? (evaluations.reduce((a, b) => a + b.condicional, 0) / totalCount).toFixed(1) : '-';
  const overallAvg =
    totalCount > 0
      ? ((parseFloat(avgTec) + parseFloat(avgTac) + parseFloat(avgCon)) / 3).toFixed(1)
      : '-';

  // Format Date DD/MM/YYYY
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Prepare chart dataset
  const chartData = chronologicalEvals.map((ev) => {
    const parts = ev.fechaEvaluacion.split('-');
    const shortDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : ev.fechaEvaluacion;
    return {
      id: ev.id,
      fechaFull: formatDateDisplay(ev.fechaEvaluacion),
      fechaCorta: shortDate,
      tecnica: ev.tecnica,
      tactica: ev.tactica,
      condicional: ev.condicional,
      promedio: Number(((ev.tecnica + ev.tactica + ev.condicional) / 3).toFixed(1)),
      tipo: ev.tipoEvaluacion || 'Sesión',
      evaluador: ev.evaluador || 'Cuerpo Técnico'
    };
  });

  // Calculate Match Stats for this player
  const playerMatchStats = matchStats.filter((s) => s.jugadorId === player.id);
  const totalMatchesPlayed = playerMatchStats.filter(
    (s) => s.condicionJugador === 'Titular' || (s.condicionJugador === 'Suplente' && s.minutosJugados > 0)
  ).length;
  const totalStarter = playerMatchStats.filter((s) => s.condicionJugador === 'Titular').length;
  const totalSub = playerMatchStats.filter(
    (s) => s.condicionJugador === 'Suplente' && s.minutosJugados > 0
  ).length;
  const totalMinutes = playerMatchStats.reduce((acc, s) => acc + (s.minutosJugados || 0), 0);
  const totalGoals = playerMatchStats.reduce((acc, s) => acc + (s.goles || 0), 0);
  const totalAssists = playerMatchStats.reduce((acc, s) => acc + (s.asistencias || 0), 0);
  const totalYellowCards = playerMatchStats.reduce((acc, s) => acc + (s.tarjetasAmarillas || 0), 0);
  const totalRedCards = playerMatchStats.reduce((acc, s) => acc + (s.tarjetasRojas || 0), 0);

  // Match lookup map
  const matchMap = new Map<string, Match>();
  matches.forEach((m) => matchMap.set(m.id, m));

  const renderPillStars = (score: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            className={`w-2 h-2 rounded-full ${
              s <= score
                ? 'bg-red-500'
                : isDark
                  ? 'bg-slate-700'
                  : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Custom Tooltip for Recharts
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`p-3 rounded-xl border-2 shadow-2xl text-xs space-y-1.5 font-sans z-50 ${
            isDark
              ? 'bg-[#020d24] border-red-500 text-white'
              : 'bg-white border-red-600 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b pb-1 border-slate-700">
            <span className="font-bold flex items-center gap-1 text-red-400">
              <Calendar className="w-3 h-3 text-red-500" />
              {data.fechaFull}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-600/30 text-red-300 border border-red-500/40">
              {data.tipo}
            </span>
          </div>

          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-blue-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Técnica:
              </span>
              <span className="font-black text-sm">{data.tecnica} / 5</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Táctica:
              </span>
              <span className="font-black text-sm">{data.tactica} / 5</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-red-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Condicional:
              </span>
              <span className="font-black text-sm">{data.condicional} / 5</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-700 font-bold">
              <span className="text-slate-300">Promedio:</span>
              <span className="text-red-400 text-sm font-black">{data.promedio} / 5.0</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div
        id={`modal-historial-${player.id}`}
        className={`${
          isDark ? 'bg-[#031533] text-white' : 'bg-white text-slate-900'
        } border-2 border-red-600 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] transition-colors`}
      >
        {/* Header */}
        <div
          className={`${
            isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
          } border-b-2 border-red-600 px-5 sm:px-6 py-4 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-athletic font-extrabold text-2xl flex items-center justify-center border-2 border-red-400 shadow-md">
              {player.dorsal}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-red-600/30 text-red-200 border border-red-500/40 px-2 py-0.5 rounded">
                  Ficha Individual y Rendimiento
                </span>
                <span className="text-xs text-blue-200 font-medium">{player.posicion}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-athletic tracking-tight mt-0.5">
                {player.nombre} <span className="text-red-400">{player.apellido}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-modal-add-eval"
              onClick={() => onAddNewEvaluation(player)}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-red-400 flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
              title="Registrar nueva evaluación (presente o pasada)"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nueva Evaluación</span>
            </button>
            <button
              onClick={onClose}
              className="text-blue-300 hover:text-white p-2 rounded-lg hover:bg-blue-900/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside the Player Profile */}
        <div
          className={`flex border-b-2 border-red-600/70 px-5 pt-2 gap-2 ${
            isDark ? 'bg-[#001744]' : 'bg-slate-100'
          }`}
        >
          <button
            id="tab-sub-evaluaciones"
            onClick={() => setActiveTab('evaluaciones')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors cursor-pointer border-t-2 border-x-2 ${
              activeTab === 'evaluaciones'
                ? isDark
                  ? 'bg-[#071d44] text-white border-red-500'
                  : 'bg-white text-slate-900 border-red-600 shadow-xs'
                : isDark
                  ? 'text-blue-300 hover:text-white border-transparent'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-red-500" />
            <span>Evolución y Evaluaciones ({totalCount})</span>
          </button>

          <button
            id="tab-sub-estadisticas"
            onClick={() => setActiveTab('estadisticas')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors cursor-pointer border-t-2 border-x-2 ${
              activeTab === 'estadisticas'
                ? isDark
                  ? 'bg-[#071d44] text-white border-red-500'
                  : 'bg-white text-slate-900 border-red-600 shadow-xs'
                : isDark
                  ? 'text-blue-300 hover:text-white border-transparent'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Activity className="w-4 h-4 text-red-500" />
            <span>Partidos y Minutos Jugados ({totalMatchesPlayed})</span>
          </button>
        </div>

        {/* Global Summary Stats for this Player */}
        <div
          className={`${
            isDark ? 'bg-[#071d44]' : 'bg-slate-50'
          } border-b-2 border-red-600/60 p-3 sm:p-4 transition-colors`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            {/* Avg Tecnica */}
            <div
              className={`${
                isDark ? 'bg-[#020d24] border-blue-900/80' : 'bg-white border-slate-200 shadow-2xs'
              } border rounded-xl p-2.5 text-center`}
            >
              <span
                className={`text-[10px] uppercase font-bold tracking-wider block ${
                  isDark ? 'text-blue-300' : 'text-slate-500'
                }`}
              >
                Prom. Técnica
              </span>
              <span className={`font-athletic text-xl sm:text-2xl font-black text-blue-500`}>
                {avgTec} <span className="text-xs font-normal text-slate-400">/5</span>
              </span>
            </div>

            {/* Avg Tactica */}
            <div
              className={`${
                isDark ? 'bg-[#020d24] border-blue-900/80' : 'bg-white border-slate-200 shadow-2xs'
              } border rounded-xl p-2.5 text-center`}
            >
              <span
                className={`text-[10px] uppercase font-bold tracking-wider block ${
                  isDark ? 'text-blue-300' : 'text-slate-500'
                }`}
              >
                Prom. Táctica
              </span>
              <span className={`font-athletic text-xl sm:text-2xl font-black text-amber-500`}>
                {avgTac} <span className="text-xs font-normal text-slate-400">/5</span>
              </span>
            </div>

            {/* Avg Condicional */}
            <div
              className={`${
                isDark ? 'bg-[#020d24] border-blue-900/80' : 'bg-white border-slate-200 shadow-2xs'
              } border rounded-xl p-2.5 text-center`}
            >
              <span
                className={`text-[10px] uppercase font-bold tracking-wider block ${
                  isDark ? 'text-blue-300' : 'text-slate-500'
                }`}
              >
                Prom. Condicional
              </span>
              <span className={`font-athletic text-xl sm:text-2xl font-black text-red-500`}>
                {avgCon} <span className="text-xs font-normal text-slate-400">/5</span>
              </span>
            </div>

            {/* Partidos Jugados */}
            <div
              className={`${
                isDark ? 'bg-[#020d24] border-blue-900/80' : 'bg-white border-slate-200 shadow-2xs'
              } border rounded-xl p-2.5 text-center`}
            >
              <span
                className={`text-[10px] uppercase font-bold tracking-wider block ${
                  isDark ? 'text-blue-300' : 'text-slate-500'
                }`}
              >
                Partidos (PJ)
              </span>
              <span className={`font-athletic text-xl sm:text-2xl font-black text-emerald-500`}>
                {totalMatchesPlayed}{' '}
                <span className="text-[11px] font-sans font-normal text-slate-400">
                  ({totalStarter} Tit / {totalSub} Sup)
                </span>
              </span>
            </div>

            {/* Minutos Jugados */}
            <div
              className={`${
                isDark ? 'bg-[#020d24] border-blue-900/80' : 'bg-white border-slate-200 shadow-2xs'
              } border rounded-xl p-2.5 text-center`}
            >
              <span
                className={`text-[10px] uppercase font-bold tracking-wider block ${
                  isDark ? 'text-blue-300' : 'text-slate-500'
                }`}
              >
                Minutos Jugados
              </span>
              <span
                className={`font-athletic text-xl sm:text-2xl font-black ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {totalMinutes}'
              </span>
            </div>

            {/* Goles y Asistencias */}
            <div
              className={`${
                isDark ? 'bg-[#020d24] border-blue-900/80' : 'bg-white border-slate-200 shadow-2xs'
              } border rounded-xl p-2.5 text-center`}
            >
              <span
                className={`text-[10px] uppercase font-bold tracking-wider block ${
                  isDark ? 'text-blue-300' : 'text-slate-500'
                }`}
              >
                Goles / Asistencias
              </span>
              <span className={`font-athletic text-xl sm:text-2xl font-black text-red-500`}>
                {totalGoals} G <span className="text-xs font-normal text-slate-400">/</span> {totalAssists} A
              </span>
            </div>
          </div>
        </div>

        {/* Modal Main Body Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: EVALUACIONES & GRÁFICO */}
          {activeTab === 'evaluaciones' && (
            <>
              {/* SECTION: GRÁFICO DE EVOLUCIÓN TEMPORAL (Técnica, Táctica y Condicional) */}
              <div
                id="section-grafico-evolucion"
                className={`${
                  isDark ? 'bg-[#071d44] border-red-600/70' : 'bg-slate-50 border-red-600/60 shadow-xs'
                } border-2 rounded-xl p-4 sm:p-5 transition-colors`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <h3
                      className={`text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 text-red-500" />
                      Evolución Temporal de las 3 Variables (Escala 1 al 5)
                    </h3>
                    <p className={`text-[11px] ${isDark ? 'text-blue-200/80' : 'text-slate-500'}`}>
                      Progresión cronológica de Técnica, Táctica y Condicional a través de las fechas
                    </p>
                  </div>

                  {/* Leyenda de colores rápida */}
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="flex items-center gap-1 text-blue-500">
                      <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                      Técnica
                    </span>
                    <span className="flex items-center gap-1 text-amber-500">
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                      Táctica
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                      Condicional
                    </span>
                  </div>
                </div>

                {/* Contenedor del Gráfico con Recharts */}
                {chartData.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No hay evaluaciones registradas para mostrar el gráfico.
                  </div>
                ) : (
                  <div className="h-64 sm:h-72 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={isDark ? '#1e3a8a' : '#cbd5e1'}
                          opacity={0.6}
                        />
                        <XAxis
                          dataKey="fechaCorta"
                          stroke={isDark ? '#93c5fd' : '#475569'}
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[1, 5]}
                          ticks={[1, 2, 3, 4, 5]}
                          stroke={isDark ? '#93c5fd' : '#475569'}
                          fontSize={11}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomChartTooltip />} />
                        <Legend
                          wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }}
                          formatter={(value) => {
                            switch (value) {
                              case 'tecnica':
                                return 'Técnica';
                              case 'tactica':
                                return 'Táctica';
                              case 'condicional':
                                return 'Condicional';
                              default:
                                return value;
                            }
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="tecnica"
                          name="tecnica"
                          stroke="#2563eb"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#2563eb', strokeWidth: 1, stroke: '#ffffff' }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="tactica"
                          name="tactica"
                          stroke="#f59e0b"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#f59e0b', strokeWidth: 1, stroke: '#ffffff' }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="condicional"
                          name="condicional"
                          stroke="#dc2626"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#dc2626', strokeWidth: 1, stroke: '#ffffff' }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {chartData.length === 1 && (
                  <div className="mt-2 text-center text-xs text-amber-500 font-medium flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>
                      1 evaluación registrada. Agrega evaluaciones pasadas o posteriores para ver la curva de tendencia temporal completa.
                    </span>
                  </div>
                )}
              </div>

              {/* Chronological History List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      isDark ? 'text-blue-200' : 'text-slate-700'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-red-500" />
                    Historial Cronológico de Evaluaciones ({descEvals.length})
                  </span>
                  <button
                    onClick={() => onAddNewEvaluation(player)}
                    className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Evaluación en Fecha Pasada</span>
                  </button>
                </div>

                {descEvals.length === 0 ? (
                  <div
                    className={`${
                      isDark ? 'bg-[#071d44]' : 'bg-slate-50'
                    } border-2 border-red-600 rounded-xl p-8 text-center`}
                  >
                    <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                      No hay evaluaciones registradas en el historial de este jugador.
                    </p>
                    <button
                      onClick={() => onAddNewEvaluation(player)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-red-400 cursor-pointer"
                    >
                      Registrar Primera Evaluación
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {descEvals.map((ev, index) => {
                      const sessionAvg = ((ev.tecnica + ev.tactica + ev.condicional) / 3).toFixed(1);
                      const isLatest = index === 0;

                      return (
                        <div
                          key={ev.id}
                          id={`eval-history-card-${ev.id}`}
                          className={`${
                            isDark ? 'bg-[#071d44] border-2' : 'bg-white border-2 shadow-xs'
                          } ${
                            isLatest ? 'border-red-500 shadow-md' : 'border-red-600/50'
                          } rounded-xl p-4 transition-all hover:border-red-400`}
                        >
                          {/* Top Row: Date, Context & Actions */}
                          <div
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b ${
                              isDark ? 'border-blue-900/60' : 'border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono border ${
                                  isDark
                                    ? 'bg-[#020d24] text-white border-red-500/60'
                                    : 'bg-slate-50 text-slate-900 border-slate-300'
                                }`}
                              >
                                <Calendar className="w-3.5 h-3.5 text-red-500" />
                                {formatDateDisplay(ev.fechaEvaluacion)}
                              </span>
                              {isLatest && (
                                <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded">
                                  Más Reciente
                                </span>
                              )}
                              {ev.tipoEvaluacion && (
                                <span
                                  className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${
                                    isDark
                                      ? 'bg-blue-900/40 text-blue-200 border-blue-700/60'
                                      : 'bg-blue-100 text-blue-800 border-blue-200'
                                  }`}
                                >
                                  {ev.tipoEvaluacion}
                                </span>
                              )}
                            </div>

                            {/* Promedio & Edit/Delete actions */}
                            <div className="flex items-center gap-3 self-end sm:self-auto">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[11px] font-medium ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>
                                  Promedio:
                                </span>
                                <span
                                  className={`font-athletic text-lg font-black px-2 py-0.5 rounded border ${
                                    isDark
                                      ? 'bg-red-600/30 border-red-500 text-red-200'
                                      : 'bg-red-50 border-red-300 text-red-700'
                                  }`}
                                >
                                  {sessionAvg} / 5.0
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  title="Editar esta evaluación"
                                  onClick={() => onEditEvaluation(player, ev)}
                                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                    isDark
                                      ? 'bg-[#020d24] hover:bg-red-600 text-blue-200 hover:text-white border-red-500/50'
                                      : 'bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-[#002b7a] border-slate-300'
                                  }`}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  title="Eliminar registro"
                                  onClick={() => {
                                    if (confirm(`¿Eliminar la evaluación del ${formatDateDisplay(ev.fechaEvaluacion)}?`)) {
                                      onDeleteEvaluation(player.id, ev.id);
                                    }
                                  }}
                                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                    isDark
                                      ? 'bg-[#020d24] hover:bg-red-900 text-red-400 hover:text-red-200 border-red-700/50'
                                      : 'bg-slate-100 hover:bg-red-50 text-red-500 hover:text-red-700 border-slate-300'
                                  }`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Scores Matrix (Técnica, Táctica, Condicional 1 al 5) */}
                          <div className="grid grid-cols-3 gap-2 sm:gap-3 py-3">
                            {/* Técnica */}
                            <div
                              className={`border rounded-lg p-2.5 text-center ${
                                isDark ? 'bg-[#020e26] border-blue-900/70' : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wider block ${
                                  isDark ? 'text-blue-300' : 'text-slate-600'
                                }`}
                              >
                                Técnica
                              </span>
                              <span
                                className={`font-athletic text-2xl font-black block my-0.5 text-blue-500`}
                              >
                                {ev.tecnica}
                                <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>
                                  {' '}
                                  / 5
                                </span>
                              </span>
                              <div className="flex justify-center mt-1">{renderPillStars(ev.tecnica)}</div>
                            </div>

                            {/* Táctica */}
                            <div
                              className={`border rounded-lg p-2.5 text-center ${
                                isDark ? 'bg-[#020e26] border-blue-900/70' : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wider block ${
                                  isDark ? 'text-blue-300' : 'text-slate-600'
                                }`}
                              >
                                Táctica
                              </span>
                              <span
                                className={`font-athletic text-2xl font-black block my-0.5 text-amber-500`}
                              >
                                {ev.tactica}
                                <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>
                                  {' '}
                                  / 5
                                </span>
                              </span>
                              <div className="flex justify-center mt-1">{renderPillStars(ev.tactica)}</div>
                            </div>

                            {/* Condicional */}
                            <div
                              className={`border rounded-lg p-2.5 text-center ${
                                isDark ? 'bg-[#020e26] border-blue-900/70' : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wider block ${
                                  isDark ? 'text-blue-300' : 'text-slate-600'
                                }`}
                              >
                                Condicional
                              </span>
                              <span
                                className={`font-athletic text-2xl font-black block my-0.5 text-red-500`}
                              >
                                {ev.condicional}
                                <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>
                                  {' '}
                                  / 5
                                </span>
                              </span>
                              <div className="flex justify-center mt-1">{renderPillStars(ev.condicional)}</div>
                            </div>
                          </div>

                          {/* Observaciones y Evaluador */}
                          {(ev.notas || ev.evaluador) && (
                            <div
                              className={`mt-2 border rounded-lg p-3 text-xs space-y-1 ${
                                isDark ? 'bg-[#020e26]/90 border-blue-900/60' : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              {ev.notas && (
                                <div className={`italic ${isDark ? 'text-blue-100' : 'text-slate-700'}`}>
                                  "{ev.notas}"
                                </div>
                              )}
                              {ev.evaluador && (
                                <div
                                  className={`text-[11px] font-medium flex items-center gap-1 pt-1 border-t ${
                                    isDark ? 'text-blue-300/80 border-blue-950' : 'text-slate-500 border-slate-200'
                                  }`}
                                >
                                  <User className="w-3 h-3 text-red-500" />
                                  <span>Evaluador: {ev.evaluador}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: REGISTRO DE PARTIDOS Y MINUTOS DEL JUGADOR */}
          {activeTab === 'estadisticas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-red-500" />
                    Participación y Estadísticas en Partidos Oficiales
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-blue-200/80' : 'text-slate-500'}`}>
                    Registro de partidos jugados como titular o suplente, minutos en cancha, goles y tarjetas
                  </p>
                </div>
              </div>

              {playerMatchStats.length === 0 ? (
                <div
                  className={`${
                    isDark ? 'bg-[#071d44]' : 'bg-slate-50'
                  } border-2 border-red-600 rounded-xl p-8 text-center`}
                >
                  <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    No hay partidos registrados aún con participación de {player.nombre} {player.apellido}.
                  </p>
                  <p className={`text-xs ${isDark ? 'text-blue-300/80' : 'text-slate-500'}`}>
                    Puedes registrar nuevos partidos y la planilla de jugadores en la pestaña "3. Partidos y Estadísticas".
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {playerMatchStats.map((stat) => {
                    const match = matchMap.get(stat.partidoId);
                    return (
                      <div
                        key={stat.id}
                        className={`${
                          isDark ? 'bg-[#071d44] border-red-600/60' : 'bg-white border-slate-200 shadow-xs'
                        } border-2 rounded-xl p-4 transition-all hover:border-red-500`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-700/40">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase font-mono border ${
                                isDark
                                  ? 'bg-[#020d24] text-white border-red-500/50'
                                  : 'bg-slate-100 text-slate-800 border-slate-300'
                              }`}
                            >
                              {match ? formatDateDisplay(match.fecha) : 'Fecha sin definir'}
                            </span>
                            <span className="font-bold text-sm">
                              U. de Chile {match ? `${match.golesFavor} - ${match.golesContra}` : 'vs'}{' '}
                              <span className="text-red-500 font-extrabold">{match ? match.rival : 'Rival'}</span>
                            </span>
                            {match?.torneo && (
                              <span
                                className={`text-[11px] px-2 py-0.5 rounded-full border ${
                                  isDark
                                    ? 'bg-blue-900/40 text-blue-200 border-blue-700'
                                    : 'bg-blue-50 text-blue-800 border-blue-200'
                                }`}
                              >
                                {match.torneo}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                stat.condicionJugador === 'Titular'
                                  ? 'bg-emerald-600/30 text-emerald-400 border-emerald-500'
                                  : stat.condicionJugador === 'Suplente'
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/60'
                                    : 'bg-slate-600/30 text-slate-400 border-slate-500'
                              }`}
                            >
                              {stat.condicionJugador}
                            </span>
                            <span
                              className={`font-athletic text-base font-black px-2 py-0.5 rounded border ${
                                isDark
                                  ? 'bg-[#020d24] text-white border-blue-900'
                                  : 'bg-slate-100 text-slate-900 border-slate-300'
                              }`}
                            >
                              {stat.minutosJugados}' jugados
                            </span>
                          </div>
                        </div>

                        {/* Match Stats Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-center">
                          <div
                            className={`p-2 rounded-lg border ${
                              isDark ? 'bg-[#020d24] border-blue-900/60' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className={`text-[10px] uppercase font-bold block text-slate-400`}>Goles</span>
                            <span className="font-athletic text-xl font-black text-red-500">
                              {stat.goles > 0 ? `⚽ ${stat.goles}` : '0'}
                            </span>
                          </div>

                          <div
                            className={`p-2 rounded-lg border ${
                              isDark ? 'bg-[#020d24] border-blue-900/60' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className={`text-[10px] uppercase font-bold block text-slate-400`}>
                              Asistencias
                            </span>
                            <span className="font-athletic text-xl font-black text-blue-500">
                              {stat.asistencias > 0 ? `🎯 ${stat.asistencias}` : '0'}
                            </span>
                          </div>

                          <div
                            className={`p-2 rounded-lg border ${
                              isDark ? 'bg-[#020d24] border-blue-900/60' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className={`text-[10px] uppercase font-bold block text-slate-400`}>
                              Tarjetas Amarillas
                            </span>
                            <span className="font-athletic text-xl font-black text-amber-500">
                              {stat.tarjetasAmarillas > 0 ? `🟨 ${stat.tarjetasAmarillas}` : '0'}
                            </span>
                          </div>

                          <div
                            className={`p-2 rounded-lg border ${
                              isDark ? 'bg-[#020d24] border-blue-900/60' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className={`text-[10px] uppercase font-bold block text-slate-400`}>
                              Tarjetas Rojas
                            </span>
                            <span className="font-athletic text-xl font-black text-red-600">
                              {stat.tarjetasRojas > 0 ? `🟥 ${stat.tarjetasRojas}` : '0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`${
            isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
          } border-t-2 border-red-600 px-6 py-3.5 flex items-center justify-between`}
        >
          <span className="text-xs text-blue-200">
            Ficha Oficial • Universidad de Chile • {player.nombre} {player.apellido}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent hover:bg-blue-900/50 text-white text-xs font-semibold rounded-lg border border-blue-700 transition-colors cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
