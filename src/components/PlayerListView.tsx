import React, { useState } from 'react';
import { Player, PlayerEvaluation } from '../types';
import {
  Calendar,
  Activity,
  History,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PlayerListViewProps {
  players: Player[];
  evaluations: Record<string, PlayerEvaluation[]>;
  onSelectPlayer: (player: Player) => void;
  onAddNewEvaluation: (player: Player) => void;
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (player: Player) => void;
}

type SortField = 'dorsal' | 'nombre' | 'posicion' | 'edad' | 'altura' | 'evaluaciones' | 'promedio';
type SortOrder = 'asc' | 'desc';

export const PlayerListView: React.FC<PlayerListViewProps> = ({
  players,
  evaluations,
  onSelectPlayer,
  onAddNewEvaluation,
  onEditPlayer,
  onDeletePlayer
}) => {
  const { isDark } = useTheme();
  const [sortField, setSortField] = useState<SortField>('dorsal');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Calculate age helper
  const calculateAge = (fechaNacimiento: string): number => {
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format date helper (DD/MM/AAAA)
  const formatDate = (fechaNacimiento: string): string => {
    const [year, month, day] = fechaNacimiento.split('-');
    if (day && month && year) return `${day}/${month}/${year}`;
    return fechaNacimiento;
  };

  // Format evaluation date (DD/MM/AAAA)
  const formatEvalDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  // Badge colors by position category
  const getPositionBadgeColor = (pos: string) => {
    switch (pos) {
      case 'Arquero':
        return isDark
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          : 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Defensa':
        return isDark
          ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
          : 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Mediocampista':
        return isDark
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
          : 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Delantero':
        return isDark
          ? 'bg-red-500/20 text-red-300 border-red-500/40'
          : 'bg-red-100 text-red-800 border-red-300';
      default:
        return isDark
          ? 'bg-slate-500/20 text-slate-300 border-slate-400/40'
          : 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  // Score color badge
  const getScoreBadge = (score: number) => {
    if (score >= 4) {
      return isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700' : 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
    if (score >= 3) {
      return isDark ? 'bg-blue-950/80 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-300';
    }
    return isDark ? 'bg-amber-950/80 text-amber-300 border-amber-700' : 'bg-amber-100 text-amber-800 border-amber-300';
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'promedio' || field === 'evaluaciones' ? 'desc' : 'asc');
    }
  };

  // Sorted players
  const sortedPlayers = [...players].sort((a, b) => {
    let comparison = 0;
    const aEvals = evaluations[a.id] || [];
    const bEvals = evaluations[b.id] || [];

    const aLatest = [...aEvals].sort((x, y) => new Date(y.fechaEvaluacion).getTime() - new Date(x.fechaEvaluacion).getTime())[0];
    const bLatest = [...bEvals].sort((x, y) => new Date(y.fechaEvaluacion).getTime() - new Date(x.fechaEvaluacion).getTime())[0];

    const aAvg = aLatest ? (aLatest.tecnica + aLatest.tactica + aLatest.condicional) / 3 : 0;
    const bAvg = bLatest ? (bLatest.tecnica + bLatest.tactica + bLatest.condicional) / 3 : 0;

    switch (sortField) {
      case 'dorsal':
        comparison = a.dorsal - b.dorsal;
        break;
      case 'nombre':
        comparison = a.apellido.localeCompare(b.apellido);
        break;
      case 'posicion':
        comparison = (a.posicionDetallada || a.posicion).localeCompare(b.posicionDetallada || b.posicion);
        break;
      case 'edad':
        comparison = new Date(a.fechaNacimiento).getTime() - new Date(b.fechaNacimiento).getTime();
        break;
      case 'altura':
        comparison = (a.altura || '').localeCompare(b.altura || '');
        break;
      case 'evaluaciones':
        comparison = aEvals.length - bEvals.length;
        break;
      case 'promedio':
        comparison = aAvg - bAvg;
        break;
      default:
        comparison = a.dorsal - b.dorsal;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-40 group-hover:opacity-100" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-red-500" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-red-500" />
    );
  };

  return (
    <div
      id="plantilla-list-view-container"
      className={`${
        isDark ? 'bg-[#071d44] border-red-600' : 'bg-white border-red-600 shadow-md'
      } border-2 rounded-xl overflow-hidden shadow-lg transition-colors`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr
              className={`border-b ${
                isDark
                  ? 'bg-[#031330] text-blue-200 border-blue-900/80'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              } select-none font-bold uppercase tracking-wider text-[11px]`}
            >
              {/* Dorsal */}
              <th
                onClick={() => handleSort('dorsal')}
                className="py-3 px-3.5 cursor-pointer group hover:text-red-500 transition-colors w-16 text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>#</span>
                  {renderSortIndicator('dorsal')}
                </div>
              </th>

              {/* Jugador */}
              <th
                onClick={() => handleSort('nombre')}
                className="py-3 px-4 cursor-pointer group hover:text-red-500 transition-colors min-w-[200px]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Jugador</span>
                  {renderSortIndicator('nombre')}
                </div>
              </th>

              {/* Posición */}
              <th
                onClick={() => handleSort('posicion')}
                className="py-3 px-4 cursor-pointer group hover:text-red-500 transition-colors min-w-[170px]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Posición</span>
                  {renderSortIndicator('posicion')}
                </div>
              </th>

              {/* Edad & Biografía */}
              <th
                onClick={() => handleSort('edad')}
                className="py-3 px-4 cursor-pointer group hover:text-red-500 transition-colors min-w-[150px]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Edad / Nacimiento</span>
                  {renderSortIndicator('edad')}
                </div>
              </th>

              {/* Biometría: Pie & Altura */}
              <th
                onClick={() => handleSort('altura')}
                className="py-3 px-4 cursor-pointer group hover:text-red-500 transition-colors min-w-[130px]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Pie / Altura</span>
                  {renderSortIndicator('altura')}
                </div>
              </th>

              {/* Última Evaluación */}
              <th
                onClick={() => handleSort('promedio')}
                className="py-3 px-4 cursor-pointer group hover:text-red-500 transition-colors min-w-[220px]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Última Evaluación (T-T-C)</span>
                  {renderSortIndicator('promedio')}
                </div>
              </th>

              {/* Historial Evals */}
              <th
                onClick={() => handleSort('evaluaciones')}
                className="py-3 px-3.5 cursor-pointer group hover:text-red-500 transition-colors text-center w-28"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Historial</span>
                  {renderSortIndicator('evaluaciones')}
                </div>
              </th>

              {/* Acciones */}
              <th className="py-3 px-4 text-right min-w-[180px]">
                <span>Acciones</span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={`divide-y ${isDark ? 'divide-blue-900/40' : 'divide-slate-200'}`}>
            {sortedPlayers.map((player) => {
              const playerEvals = evaluations[player.id] || [];
              const sortedPlayerEvals = [...playerEvals].sort(
                (a, b) => new Date(b.fechaEvaluacion).getTime() - new Date(a.fechaEvaluacion).getTime()
              );
              const latestEvaluation = sortedPlayerEvals[0];
              const historyCount = sortedPlayerEvals.length;
              const age = calculateAge(player.fechaNacimiento);
              const formattedBirthDate = formatDate(player.fechaNacimiento);

              const averageScore = latestEvaluation
                ? ((latestEvaluation.tecnica + latestEvaluation.tactica + latestEvaluation.condicional) / 3).toFixed(1)
                : null;

              return (
                <tr
                  key={player.id}
                  id={`player-row-${player.id}`}
                  onClick={() => onSelectPlayer(player)}
                  className={`group cursor-pointer transition-colors ${
                    isDark
                      ? 'hover:bg-[#0a275e]/70 text-slate-100'
                      : 'hover:bg-blue-50/70 text-slate-800'
                  }`}
                >
                  {/* Dorsal Badge */}
                  <td className="py-3 px-3.5 text-center">
                    <span className="inline-flex w-8 h-8 rounded-lg bg-red-600 text-white font-athletic font-extrabold text-base items-center justify-center border border-red-400 shadow-sm">
                      {player.dorsal}
                    </span>
                  </td>

                  {/* Nombre y Nacionalidad */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-athletic font-black text-sm uppercase tracking-wide">
                        {player.nombre} <span className="text-red-600">{player.apellido}</span>
                      </span>
                      {player.nacionalidad && (
                        <span className={`text-[11px] ${isDark ? 'text-blue-300/80' : 'text-slate-500'}`}>
                          {player.nacionalidad}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Posición & Posición Detallada */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPositionBadgeColor(
                          player.posicion
                        )}`}
                      >
                        {player.posicionDetallada || player.posicion}
                      </span>
                      {player.posicionDetallada && player.posicionDetallada !== player.posicion && (
                        <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Categoría: {player.posicion}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Edad & Nacimiento */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs">
                        {age} años
                      </span>
                      <span className={`text-[11px] font-mono ${isDark ? 'text-blue-300/70' : 'text-slate-500'}`}>
                        {formattedBirthDate}
                      </span>
                    </div>
                  </td>

                  {/* Pie Hábil & Altura */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-xs">
                        Pie: <strong className="font-semibold">{player.pieHabil || 'N/D'}</strong>
                      </span>
                      <span className={`text-[11px] font-mono ${isDark ? 'text-blue-300/70' : 'text-slate-500'}`}>
                        Alt: {player.altura || 'N/D'}
                      </span>
                    </div>
                  </td>

                  {/* Última Evaluación */}
                  <td className="py-3 px-4">
                    {latestEvaluation ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border font-mono ${getScoreBadge(
                              latestEvaluation.tecnica
                            )}`}
                            title="Técnica"
                          >
                            T: {latestEvaluation.tecnica}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border font-mono ${getScoreBadge(
                              latestEvaluation.tactica
                            )}`}
                            title="Táctica"
                          >
                            Tac: {latestEvaluation.tactica}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border font-mono ${getScoreBadge(
                              latestEvaluation.condicional
                            )}`}
                            title="Condicional"
                          >
                            C: {latestEvaluation.condicional}
                          </span>
                          <span className="text-red-600 font-extrabold text-xs ml-1 font-athletic">
                            ★ {averageScore}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono ${isDark ? 'text-blue-300/60' : 'text-slate-400'}`}>
                          {formatEvalDate(latestEvaluation.fechaEvaluacion)}
                        </span>
                      </div>
                    ) : (
                      <span className={`text-[11px] italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Sin evaluaciones aún
                      </span>
                    )}
                  </td>

                  {/* Evaluaciones Totales */}
                  <td className="py-3 px-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                        historyCount > 0
                          ? isDark
                            ? 'bg-blue-900/50 text-blue-200 border-blue-700/60'
                            : 'bg-blue-100 text-blue-800 border-blue-200'
                          : isDark
                          ? 'bg-slate-800/60 text-slate-400 border-slate-700'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      <History className="w-3 h-3 text-red-500" />
                      {historyCount}
                    </span>
                  </td>

                  {/* Botones de Acciones */}
                  <td className="py-3 px-4 text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Botón Ver Ficha / Historial */}
                      <button
                        type="button"
                        id={`btn-ver-ficha-list-${player.id}`}
                        onClick={() => onSelectPlayer(player)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-[#031330] hover:bg-blue-800 text-blue-200 hover:text-white border-blue-800 hover:border-red-400'
                            : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#002b7a] border-slate-300 hover:border-[#002b7a]'
                        }`}
                        title={`Ver ficha completa de ${player.nombre} ${player.apellido}`}
                      >
                        <Activity className="w-3.5 h-3.5 text-red-500" />
                        <span className="hidden xl:inline">Ficha</span>
                      </button>

                      {/* Botón Nueva Evaluación */}
                      <button
                        type="button"
                        id={`btn-evaluar-list-${player.id}`}
                        onClick={() => onAddNewEvaluation(player)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold border border-red-400 flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        title={`Evaluar a ${player.nombre} ${player.apellido}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Evaluar</span>
                      </button>

                      {/* Botón Editar */}
                      <button
                        type="button"
                        id={`btn-editar-list-${player.id}`}
                        onClick={() => onEditPlayer(player)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-[#031330] hover:bg-blue-800 text-blue-300 hover:text-white border-blue-800 hover:border-red-400'
                            : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#002b7a] border-slate-300 hover:border-[#002b7a]'
                        }`}
                        title={`Editar jugador ${player.nombre} ${player.apellido}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Botón Borrar */}
                      <button
                        type="button"
                        id={`btn-borrar-list-${player.id}`}
                        onClick={() => onDeletePlayer(player)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-[#031330] hover:bg-red-950 text-blue-300 hover:text-red-400 border-blue-800 hover:border-red-500'
                            : 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border-slate-300 hover:border-red-500'
                        }`}
                        title={`Eliminar jugador ${player.nombre} ${player.apellido}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer count indicator */}
      <div
        className={`px-4 py-3 border-t text-xs flex items-center justify-between ${
          isDark
            ? 'bg-[#031330]/80 border-blue-900/60 text-blue-300/80'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        <span>
          Mostrando <strong>{sortedPlayers.length}</strong> de <strong>{players.length}</strong> jugadores
        </span>
        <span className="text-[11px]">
          Haz clic en cualquier fila para abrir la <strong>ficha e historial</strong> del jugador.
        </span>
      </div>
    </div>
  );
};
