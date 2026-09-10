import React from 'react';
import { Player, PlayerEvaluation } from '../types';
import { Calendar, Activity, ChevronRight, History, Plus, Pencil, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PlayerCardProps {
  player: Player;
  evaluations?: PlayerEvaluation[];
  onSelectPlayer: (player: Player) => void;
  onAddNewEvaluation?: (player: Player) => void;
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (player: Player) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  evaluations = [],
  onSelectPlayer,
  onAddNewEvaluation,
  onEditPlayer,
  onDeletePlayer
}) => {
  const { isDark } = useTheme();

  // Sort evaluations by date descending
  const sortedEvals = [...evaluations].sort(
    (a, b) => new Date(b.fechaEvaluacion).getTime() - new Date(a.fechaEvaluacion).getTime()
  );
  const latestEvaluation = sortedEvals[0];
  const historyCount = sortedEvals.length;

  // Calculate age from birth date
  const birthDate = new Date(player.fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Format date display (DD/MM/YYYY)
  const [year, month, day] = player.fechaNacimiento.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  const averageScore = latestEvaluation
    ? ((latestEvaluation.tecnica + latestEvaluation.tactica + latestEvaluation.condicional) / 3).toFixed(1)
    : null;

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

  const formatEvalDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  return (
    <div
      id={`player-card-${player.id}`}
      className={`${
        isDark
          ? 'bg-[#071d44] border-red-600 hover:border-red-400 text-slate-100'
          : 'bg-white border-red-600 hover:border-red-500 text-slate-900 shadow-md hover:shadow-xl'
      } border-2 rounded-xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between group relative overflow-hidden`}
    >
      {/* Background Accent Crest Overlay */}
      <div className={`absolute -right-6 -bottom-6 ${isDark ? 'opacity-5 text-white' : 'opacity-[0.03] text-[#002b7a]'} pointer-events-none select-none font-athletic text-9xl font-black`}>
        U
      </div>

      <div>
        {/* Top bar: Position and Dorsal */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPositionBadgeColor(player.posicion)}`}>
            {player.posicion}
          </span>
          <div className="flex items-center gap-1.5">
            {/* Botón Editar Jugador */}
            <button
              id={`btn-editar-jugador-${player.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onEditPlayer(player);
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#031330] hover:bg-blue-800 text-blue-300 hover:text-white border-blue-800 hover:border-red-400'
                  : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#002b7a] border-slate-300 hover:border-[#002b7a]'
              }`}
              title={`Editar datos de ${player.nombre} ${player.apellido}`}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            {/* Botón Borrar Jugador */}
            <button
              id={`btn-borrar-jugador-${player.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onDeletePlayer(player);
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#031330] hover:bg-red-950 text-blue-300 hover:text-red-400 border-blue-800 hover:border-red-500'
                  : 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border-slate-300 hover:border-red-500'
              }`}
              title={`Eliminar a ${player.nombre} ${player.apellido}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <span className="w-9 h-9 rounded-lg bg-red-600 text-white font-athletic font-extrabold text-xl flex items-center justify-center border border-red-400 shadow-md">
              {player.dorsal}
            </span>
          </div>
        </div>

        {/* Player Name and Nationality */}
        <div className="mb-4">
          <h3 className={`text-xl sm:text-2xl font-black tracking-tight uppercase font-athletic transition-colors ${
            isDark ? 'text-white group-hover:text-red-300' : 'text-slate-900 group-hover:text-red-600'
          }`}>
            {player.nombre} <span className="text-red-600">{player.apellido}</span>
          </h3>
          {player.nacionalidad && (
            <p className={`text-xs font-medium ${isDark ? 'text-blue-200/70' : 'text-slate-500'}`}>
              {player.nacionalidad} {player.pieHabil ? `• Perfil ${player.pieHabil}` : ''}
            </p>
          )}
        </div>

        {/* Vital Data: Fecha de Nacimiento */}
        <div className={`border rounded-lg p-3 mb-4 text-xs space-y-1.5 ${
          isDark ? 'bg-[#031330] border-blue-900/60' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-blue-300/80' : 'text-slate-600'}`}>
              <Calendar className="w-3.5 h-3.5 text-red-500" />
              Fecha de Nacimiento:
            </span>
            <span className={`font-semibold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{formattedDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={isDark ? 'text-blue-300/80' : 'text-slate-600'}>Edad calculada:</span>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{age} años</span>
          </div>
        </div>

        {/* Evaluations summary with History Count */}
        <div className={`border rounded-lg p-3 mb-4 ${
          isDark ? 'bg-[#041638] border-red-600/40' : 'bg-slate-50 border-red-600/30'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-blue-200' : 'text-slate-800'
            }`}>
              <Activity className="w-3.5 h-3.5 text-red-500" />
              Última Evaluación
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${
              isDark
                ? 'bg-blue-900/60 text-blue-200 border-blue-700/60'
                : 'bg-blue-100 text-blue-800 border-blue-200'
            }`}>
              <History className="w-3 h-3 text-red-500" />
              {historyCount} en historial
            </span>
          </div>

          {latestEvaluation && (
            <div className={`text-[11px] mb-2 font-mono flex items-center justify-between ${
              isDark ? 'text-blue-300/70' : 'text-slate-500'
            }`}>
              <span>Fecha: {formatEvalDate(latestEvaluation.fechaEvaluacion)}</span>
              {averageScore && (
                <span className="text-red-600 font-bold">
                  Prom: {averageScore} / 5
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Técnica */}
            <div className={`border rounded p-1.5 ${
              isDark ? 'bg-[#020d24] border-blue-900/50' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <span className={`text-[10px] block font-medium ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>Técnica</span>
              <span className={`font-athletic font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {latestEvaluation ? latestEvaluation.tecnica : '-'}
                <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>/5</span>
              </span>
            </div>

            {/* Táctica */}
            <div className={`border rounded p-1.5 ${
              isDark ? 'bg-[#020d24] border-blue-900/50' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <span className={`text-[10px] block font-medium ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>Táctica</span>
              <span className={`font-athletic font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {latestEvaluation ? latestEvaluation.tactica : '-'}
                <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>/5</span>
              </span>
            </div>

            {/* Condicional */}
            <div className={`border rounded p-1.5 ${
              isDark ? 'bg-[#020d24] border-blue-900/50' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <span className={`text-[10px] block font-medium ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>Condicional</span>
              <span className={`font-athletic font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {latestEvaluation ? latestEvaluation.condicional : '-'}
                <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>/5</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons: Ver Historial / Evaluar */}
      <div className="grid grid-cols-2 gap-2">
        <button
          id={`btn-historial-${player.id}`}
          onClick={() => onSelectPlayer(player)}
          className={`py-2.5 px-3 font-semibold text-xs uppercase tracking-wider rounded-lg border flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow cursor-pointer ${
            isDark
              ? 'bg-[#082252] hover:bg-blue-900 text-white border-red-500/60'
              : 'bg-[#002b7a] hover:bg-[#001f5c] text-white border-red-500'
          }`}
        >
          <History className="w-3.5 h-3.5 text-red-400" />
          <span>Historial ({historyCount})</span>
        </button>

        <button
          id={`btn-evaluar-${player.id}`}
          onClick={() => onAddNewEvaluation ? onAddNewEvaluation(player) : onSelectPlayer(player)}
          className="py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-red-400 flex items-center justify-center gap-1 transition-all active:scale-98 shadow cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Evaluar</span>
        </button>
      </div>
    </div>
  );
};
