import React, { useState } from 'react';
import { Player, PlayerEvaluation } from '../types';
import {
  BarChart3,
  Search,
  ArrowUpDown,
  Calendar,
  History,
  Plus,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  Activity,
  Layers,
  Clock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface EvaluationsViewProps {
  players: Player[];
  evaluations: Record<string, PlayerEvaluation[]>;
  onAddNewEvaluation: (player: Player) => void;
  onEditEvaluation: (player: Player, evaluation: PlayerEvaluation) => void;
  onViewHistory: (player: Player) => void;
  onDeleteEvaluation: (playerId: string, evalId: string) => void;
}

export const EvaluationsView: React.FC<EvaluationsViewProps> = ({
  players,
  evaluations,
  onAddNewEvaluation,
  onEditEvaluation,
  onViewHistory,
  onDeleteEvaluation
}) => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'promedio' | 'evaluaciones' | 'tecnica' | 'tactica' | 'condicional' | 'dorsal' | 'nombre'>('promedio');
  const [expandedPlayerIds, setExpandedPlayerIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedPlayerIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Helper to get sorted evaluations for a player
  const getPlayerEvals = (playerId: string): PlayerEvaluation[] => {
    const list = evaluations[playerId] || [];
    return [...list].sort((a, b) => new Date(b.fechaEvaluacion).getTime() - new Date(a.fechaEvaluacion).getTime());
  };

  // Get latest evaluation for a player
  const getLatestEval = (playerId: string): PlayerEvaluation | undefined => {
    const list = getPlayerEvals(playerId);
    return list[0];
  };

  // Calculate player historical overall average
  const getPlayerAverage = (playerId: string): number => {
    const list = getPlayerEvals(playerId);
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + (curr.tecnica + curr.tactica + curr.condicional) / 3, 0);
    return parseFloat((sum / list.length).toFixed(1));
  };

  // Compute team aggregates across latest evaluations
  const allLatestEvals: PlayerEvaluation[] = players
    .map((p) => getLatestEval(p.id))
    .filter((e): e is PlayerEvaluation => Boolean(e));

  const totalEvaluationsCount = Object.values(evaluations).reduce(
    (acc: number, curr: PlayerEvaluation[]) => acc + curr.length,
    0
  );
  const totalLatest = allLatestEvals.length || 1;

  const avgTecnica = (allLatestEvals.reduce((acc, curr) => acc + curr.tecnica, 0) / totalLatest).toFixed(1);
  const avgTactica = (allLatestEvals.reduce((acc, curr) => acc + curr.tactica, 0) / totalLatest).toFixed(1);
  const avgCondicional = (allLatestEvals.reduce((acc, curr) => acc + curr.condicional, 0) / totalLatest).toFixed(1);
  const avgOverall = (
    (parseFloat(avgTecnica) + parseFloat(avgTactica) + parseFloat(avgCondicional)) / 3
  ).toFixed(1);

  // Filter players
  const filteredPlayers = players.filter((player) => {
    const fullName = `${player.nombre} ${player.apellido}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || player.dorsal.toString().includes(searchTerm);
  });

  // Sort players
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortBy === 'dorsal') return a.dorsal - b.dorsal;
    if (sortBy === 'nombre') return a.apellido.localeCompare(b.apellido);

    const evalsA = getPlayerEvals(a.id);
    const evalsB = getPlayerEvals(b.id);

    if (sortBy === 'evaluaciones') return evalsB.length - evalsA.length;

    const latestA = evalsA[0];
    const latestB = evalsB[0];

    if (sortBy === 'promedio') return getPlayerAverage(b.id) - getPlayerAverage(a.id);
    if (sortBy === 'tecnica') return (latestB?.tecnica || 0) - (latestA?.tecnica || 0);
    if (sortBy === 'tactica') return (latestB?.tactica || 0) - (latestA?.tactica || 0);
    if (sortBy === 'condicional') return (latestB?.condicional || 0) - (latestA?.condicional || 0);

    return 0;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  const renderDots = (score: number) => {
    return (
      <div className="flex items-center gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((val) => (
          <span
            key={val}
            className={`w-2 h-2 rounded-full ${
              val <= score
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

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards - Blue Backgrounds with Red Borders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Historical Records */}
        <div className={`${
          isDark ? 'bg-[#071d44] text-white' : 'bg-white text-slate-900 shadow-md'
        } border-2 border-red-600 rounded-xl p-4 shadow-lg relative overflow-hidden transition-colors`}>
          <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-blue-300' : 'text-slate-600'
          }`}>
            <History className="w-3.5 h-3.5 text-red-500" />
            Total Evaluaciones en Historial
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-athletic text-3xl sm:text-4xl font-black ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {totalEvaluationsCount}
            </span>
            <span className="text-xs text-red-500 font-semibold">registros acumulados</span>
          </div>
          <p className={`text-[11px] mt-1 ${isDark ? 'text-blue-200/80' : 'text-slate-500'}`}>
            {players.length} jugadores con seguimiento periódico
          </p>
        </div>

        {/* Avg Técnica */}
        <div className={`${
          isDark ? 'bg-[#071d44] text-white' : 'bg-white text-slate-900 shadow-md'
        } border-2 border-red-600 rounded-xl p-4 shadow-lg relative overflow-hidden transition-colors`}>
          <div className={`text-xs font-bold uppercase tracking-wider ${
            isDark ? 'text-blue-300' : 'text-slate-600'
          }`}>
            Promedio Técnica Actual
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-athletic text-3xl sm:text-4xl font-black ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {avgTecnica}
            </span>
            <span className="text-xs text-red-500 font-semibold">/ 5.0 máx</span>
          </div>
          <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden border ${
            isDark ? 'bg-[#020d24] border-red-900/40' : 'bg-slate-200 border-slate-300'
          }`}>
            <div
              className="bg-red-500 h-full rounded-full transition-all"
              style={{ width: `${(parseFloat(avgTecnica) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Avg Táctica */}
        <div className={`${
          isDark ? 'bg-[#071d44] text-white' : 'bg-white text-slate-900 shadow-md'
        } border-2 border-red-600 rounded-xl p-4 shadow-lg relative overflow-hidden transition-colors`}>
          <div className={`text-xs font-bold uppercase tracking-wider ${
            isDark ? 'text-blue-300' : 'text-slate-600'
          }`}>
            Promedio Táctica Actual
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-athletic text-3xl sm:text-4xl font-black ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {avgTactica}
            </span>
            <span className="text-xs text-red-500 font-semibold">/ 5.0 máx</span>
          </div>
          <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden border ${
            isDark ? 'bg-[#020d24] border-red-900/40' : 'bg-slate-200 border-slate-300'
          }`}>
            <div
              className="bg-red-500 h-full rounded-full transition-all"
              style={{ width: `${(parseFloat(avgTactica) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Avg Condicional & Global */}
        <div className={`${
          isDark ? 'bg-[#0a265c] border-red-500' : 'bg-blue-50/80 border-red-600 shadow-md'
        } border-2 rounded-xl p-4 shadow-lg relative overflow-hidden transition-colors`}>
          <div className="text-xs font-bold uppercase tracking-wider text-red-500">
            Prom. Condicional / Global
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-athletic text-3xl sm:text-4xl font-black ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {avgCondicional}
            </span>
            <span className={`text-xs font-semibold ${isDark ? 'text-red-200' : 'text-slate-600'}`}>
              Física • Global: {avgOverall}
            </span>
          </div>
          <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden border ${
            isDark ? 'bg-[#020d24] border-red-900/40' : 'bg-slate-200 border-slate-300'
          }`}>
            <div
              className="bg-red-500 h-full rounded-full transition-all"
              style={{ width: `${(parseFloat(avgCondicional) / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control Bar: Search and Sort */}
      <div className={`${
        isDark ? 'bg-[#071d44]' : 'bg-white shadow-sm'
      } border-2 border-red-600 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md transition-colors`}>
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
            isDark ? 'text-blue-300' : 'text-slate-400'
          }`} />
          <input
            id="input-search-evaluaciones"
            type="text"
            placeholder="Buscar por jugador o dorsal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${
              isDark
                ? 'bg-[#031330] border-blue-900 text-white placeholder-blue-300/50'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
            } border focus:border-red-500 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none transition-colors`}
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <ArrowUpDown className="w-4 h-4 text-red-500" />
          <span className={`text-xs font-medium ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
            Ordenar por:
          </span>
          <select
            id="select-sort-evaluaciones"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`${
              isDark
                ? 'bg-[#031330] border-red-600 text-white'
                : 'bg-white border-red-600 text-slate-900 shadow-2xs'
            } border text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-red-400 cursor-pointer transition-colors`}
          >
            <option value="promedio">Mayor Promedio Global</option>
            <option value="evaluaciones">Más Evaluaciones en Historial</option>
            <option value="tecnica">Mayor Técnica Última Sesión</option>
            <option value="tactica">Mayor Táctica Última Sesión</option>
            <option value="condicional">Mayor Condicional Última Sesión</option>
            <option value="dorsal">Número de Dorsal</option>
            <option value="nombre">Apellido del Jugador</option>
          </select>
        </div>
      </div>

      {/* Player Evaluations List & History */}
      <div className={`${
        isDark ? 'bg-[#071d44]' : 'bg-white shadow-lg'
      } border-2 border-red-600 rounded-xl shadow-xl overflow-hidden transition-colors`}>
        <div className={`px-6 py-4 border-b ${
          isDark ? 'bg-[#041638] border-red-600/40 text-white' : 'bg-[#002b7a] border-red-600 text-white'
        } flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-extrabold uppercase tracking-wide text-white font-athletic">
              Historial de Evaluaciones por Jugador (Escala 1 al 5)
            </h2>
          </div>
          <div className={`text-xs ${
            isDark ? 'text-blue-200 bg-[#020e26] border-blue-900' : 'text-blue-100 bg-blue-950/50 border-blue-800'
          } px-3 py-1 rounded-full border flex items-center gap-2 self-start sm:self-auto`}>
            <span>Haz clic en <strong>"Historial"</strong> o <strong>"+"</strong> para registrar una nueva fecha</span>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${
                isDark
                  ? 'bg-[#031330] text-blue-200 border-blue-900/80'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              } text-[11px] font-bold uppercase tracking-wider border-b transition-colors`}>
                <th className="py-3.5 px-4 w-14">Dorsal</th>
                <th className="py-3.5 px-4">Jugador</th>
                <th className="py-3.5 px-4 text-center">Historial</th>
                <th className="py-3.5 px-4 text-center">Última Fecha</th>
                <th className="py-3.5 px-4 text-center">Técnica (1-5)</th>
                <th className="py-3.5 px-4 text-center">Táctica (1-5)</th>
                <th className="py-3.5 px-4 text-center">Condicional (1-5)</th>
                <th className="py-3.5 px-4 text-center">Promedio</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className={`text-xs divide-y ${
              isDark ? 'divide-blue-950/80' : 'divide-slate-200'
            }`}>
              {sortedPlayers.map((player) => {
                const playerHistory = getPlayerEvals(player.id);
                const latest = playerHistory[0];
                const historyCount = playerHistory.length;
                const isExpanded = Boolean(expandedPlayerIds[player.id]);
                const overallAvg = getPlayerAverage(player.id);

                return (
                  <React.Fragment key={player.id}>
                    <tr
                      id={`eval-row-${player.id}`}
                      className={`transition-colors ${
                        isDark
                          ? isExpanded
                            ? 'bg-[#082252]'
                            : 'hover:bg-[#092556]'
                          : isExpanded
                            ? 'bg-blue-50'
                            : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Dorsal */}
                      <td className="py-3.5 px-4">
                        <span className="w-8 h-8 rounded-md bg-red-600 text-white font-athletic font-extrabold text-base flex items-center justify-center border border-red-400 shadow-xs">
                          {player.dorsal}
                        </span>
                      </td>

                      {/* Jugador */}
                      <td className="py-3.5 px-4">
                        <div className={`font-semibold font-athletic text-base tracking-wide uppercase ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {player.nombre} <span className="text-red-500">{player.apellido}</span>
                        </div>
                        <div className={`text-[11px] font-sans ${isDark ? 'text-blue-300/80' : 'text-slate-500'}`}>
                          {player.posicion}
                        </div>
                      </td>

                      {/* Historial Badge & Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          id={`btn-toggle-expand-${player.id}`}
                          onClick={() => toggleExpand(player.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                            isExpanded
                              ? 'bg-red-600 text-white border-red-400 shadow-xs'
                              : isDark
                                ? 'bg-[#020e26] text-blue-200 border-red-600/60 hover:border-red-400 hover:text-white'
                                : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-red-500 hover:text-red-600'
                          }`}
                          title="Expandir historial de evaluaciones de este jugador"
                        >
                          <History className="w-3.5 h-3.5 text-red-500" />
                          <span>{historyCount} eval.</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                          )}
                        </button>
                      </td>

                      {/* Última Fecha */}
                      <td className={`py-3.5 px-4 text-center font-mono ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                        {latest ? (
                          <div className="flex flex-col items-center">
                            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {formatDate(latest.fechaEvaluacion)}
                            </span>
                            {latest.tipoEvaluacion && (
                              <span className={`text-[10px] ${isDark ? 'text-blue-300/70' : 'text-slate-500'}`}>
                                {latest.tipoEvaluacion}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">Sin datos</span>
                        )}
                      </td>

                      {/* Técnica (1 al 5) */}
                      <td className="py-3.5 px-4 text-center">
                        {latest ? (
                          <div className="inline-flex flex-col items-center">
                            <span className={`font-athletic text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {latest.tecnica}
                              <span className={`text-[10px] font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}> / 5</span>
                            </span>
                            {renderDots(latest.tecnica)}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* Táctica (1 al 5) */}
                      <td className="py-3.5 px-4 text-center">
                        {latest ? (
                          <div className="inline-flex flex-col items-center">
                            <span className={`font-athletic text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {latest.tactica}
                              <span className={`text-[10px] font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}> / 5</span>
                            </span>
                            {renderDots(latest.tactica)}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* Condicional (1 al 5) */}
                      <td className="py-3.5 px-4 text-center">
                        {latest ? (
                          <div className="inline-flex flex-col items-center">
                            <span className={`font-athletic text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {latest.condicional}
                              <span className={`text-[10px] font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}> / 5</span>
                            </span>
                            {renderDots(latest.condicional)}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* Promedio */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`font-athletic text-xl font-black px-2.5 py-0.5 rounded-lg border ${
                          isDark
                            ? 'bg-red-600/30 border-red-500/60 text-red-200'
                            : 'bg-red-50 border-red-300 text-red-600'
                        }`}>
                          {overallAvg > 0 ? overallAvg.toFixed(1) : '-'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón Ver Historial Modal */}
                          <button
                            id={`btn-ver-historial-${player.id}`}
                            onClick={() => onViewHistory(player)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border ${
                              isDark
                                ? 'bg-[#031533] hover:bg-blue-900/60 text-blue-100 hover:text-white border-red-500/60'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#002b7a] border-slate-300'
                            }`}
                            title="Ver ventana completa de historial"
                          >
                            <History className="w-3.5 h-3.5 text-red-500" />
                            <span className="hidden sm:inline">Historial</span>
                          </button>

                          {/* Botón Agregar Evaluación */}
                          <button
                            id={`btn-add-eval-${player.id}`}
                            onClick={() => onAddNewEvaluation(player)}
                            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white border border-red-400 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                            title="Registrar nueva evaluación para este jugador"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Evaluar</span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Accordion Row showing all records in history for this player */}
                    {isExpanded && (
                      <tr className={`${isDark ? 'bg-[#020e26]' : 'bg-slate-100/90'} border-b-2 border-red-600/40`}>
                        <td colSpan={9} className="p-4 sm:p-5">
                          <div className={`${
                            isDark ? 'bg-[#041638] text-white' : 'bg-white text-slate-900 shadow-sm'
                          } border-2 border-red-600/60 rounded-xl p-4 transition-colors`}>
                            <div className={`flex items-center justify-between pb-3 mb-3 border-b ${
                              isDark ? 'border-blue-900/60' : 'border-slate-200'
                            }`}>
                              <div className="flex items-center gap-2">
                                <History className="w-4 h-4 text-red-500" />
                                <h4 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
                                  isDark ? 'text-white' : 'text-slate-900'
                                }`}>
                                  Historial Completo de Evaluaciones: {player.nombre} {player.apellido} ({historyCount} registros)
                                </h4>
                              </div>
                              <button
                                onClick={() => onAddNewEvaluation(player)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-red-400 flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Añadir Registro</span>
                              </button>
                            </div>

                            {playerHistory.length === 0 ? (
                              <p className={`text-xs italic ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>
                                No se registran evaluaciones previas para este jugador.
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {playerHistory.map((ev) => {
                                  const sAvg = ((ev.tecnica + ev.tactica + ev.condicional) / 3).toFixed(1);
                                  return (
                                    <div
                                      key={ev.id}
                                      className={`${
                                        isDark
                                          ? 'bg-[#020d24] border-red-600/40 hover:border-red-500 text-white'
                                          : 'bg-slate-50 border-red-600/40 hover:border-red-500 text-slate-900 shadow-2xs'
                                      } border rounded-lg p-3 space-y-2 relative transition-colors`}
                                    >
                                      {/* Header of history card */}
                                      <div className={`flex items-center justify-between border-b pb-2 ${
                                        isDark ? 'border-blue-900/50' : 'border-slate-200'
                                      }`}>
                                        <span className={`flex items-center gap-1 text-xs font-bold font-mono ${
                                          isDark ? 'text-white' : 'text-slate-900'
                                        }`}>
                                          <Calendar className="w-3 h-3 text-red-500" />
                                          {formatDate(ev.fechaEvaluacion)}
                                        </span>
                                        <span className={`font-athletic text-sm font-bold px-2 py-0.5 rounded border ${
                                          isDark
                                            ? 'text-red-300 bg-red-950/60 border-red-700/60'
                                            : 'text-red-700 bg-red-50 border-red-300'
                                        }`}>
                                          Prom: {sAvg} / 5
                                        </span>
                                      </div>

                                      {ev.tipoEvaluacion && (
                                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                                          isDark
                                            ? 'text-blue-200 bg-blue-900/40'
                                            : 'text-blue-800 bg-blue-100'
                                        }`}>
                                          {ev.tipoEvaluacion}
                                        </span>
                                      )}

                                      {/* 3 scores */}
                                      <div className={`grid grid-cols-3 gap-1.5 text-center text-[11px] p-1.5 rounded border ${
                                        isDark
                                          ? 'bg-[#031533] border-blue-900/40'
                                          : 'bg-white border-slate-200'
                                      }`}>
                                        <div>
                                          <span className={`text-[10px] block ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>Técnica</span>
                                          <span className={`font-athletic font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {ev.tecnica}<span className={`text-[9px] font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>/5</span>
                                          </span>
                                        </div>
                                        <div>
                                          <span className={`text-[10px] block ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>Táctica</span>
                                          <span className={`font-athletic font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {ev.tactica}<span className={`text-[9px] font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>/5</span>
                                          </span>
                                        </div>
                                        <div>
                                          <span className={`text-[10px] block ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>Condic.</span>
                                          <span className={`font-athletic font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {ev.condicional}<span className={`text-[9px] font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>/5</span>
                                          </span>
                                        </div>
                                      </div>

                                      {/* Notes */}
                                      {ev.notas && (
                                        <p className={`text-[11px] italic line-clamp-2 ${
                                          isDark ? 'text-blue-200/90' : 'text-slate-600'
                                        }`}>
                                          "{ev.notas}"
                                        </p>
                                      )}

                                      {/* Actions */}
                                      <div className={`flex items-center justify-between pt-1 border-t text-[10px] ${
                                        isDark ? 'border-blue-950 text-blue-300/70' : 'border-slate-200 text-slate-500'
                                      }`}>
                                        <span className="truncate max-w-[120px]">
                                          {ev.evaluador || 'Cuerpo Técnico'}
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <button
                                            title="Editar"
                                            onClick={() => onEditEvaluation(player, ev)}
                                            className={`p-1 rounded transition-colors cursor-pointer ${
                                              isDark
                                                ? 'hover:bg-red-600 text-blue-200 hover:text-white'
                                                : 'hover:bg-blue-100 text-slate-600 hover:text-[#002b7a]'
                                            }`}
                                          >
                                            <Edit3 className="w-3 h-3" />
                                          </button>
                                          <button
                                            title="Eliminar registro"
                                            onClick={() => {
                                              if (confirm(`¿Eliminar evaluación del ${formatDate(ev.fechaEvaluacion)}?`)) {
                                                onDeleteEvaluation(player.id, ev.id);
                                              }
                                            }}
                                            className={`p-1 rounded transition-colors cursor-pointer ${
                                              isDark
                                                ? 'hover:bg-red-900 text-red-400 hover:text-red-200'
                                                : 'hover:bg-red-50 text-red-500 hover:text-red-700'
                                            }`}
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
