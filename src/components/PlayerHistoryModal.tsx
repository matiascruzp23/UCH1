import React from 'react';
import { Player, PlayerEvaluation } from '../types';
import { X, Calendar, Plus, Edit3, Trash2, TrendingUp, Award, User, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PlayerHistoryModalProps {
  player: Player | null;
  evaluations: PlayerEvaluation[];
  isOpen: boolean;
  onClose: () => void;
  onAddNewEvaluation: (player: Player) => void;
  onEditEvaluation: (player: Player, evaluation: PlayerEvaluation) => void;
  onDeleteEvaluation: (playerId: string, evalId: string) => void;
}

export const PlayerHistoryModal: React.FC<PlayerHistoryModalProps> = ({
  player,
  evaluations,
  isOpen,
  onClose,
  onAddNewEvaluation,
  onEditEvaluation,
  onDeleteEvaluation
}) => {
  const { isDark } = useTheme();

  if (!isOpen || !player) return null;

  // Sort evaluations by date descending (most recent first)
  const sortedEvals = [...evaluations].sort((a, b) => {
    return new Date(b.fechaEvaluacion).getTime() - new Date(a.fechaEvaluacion).getTime();
  });

  const totalCount = sortedEvals.length;
  const avgTec = totalCount > 0 ? (sortedEvals.reduce((a, b) => a + b.tecnica, 0) / totalCount).toFixed(1) : '-';
  const avgTac = totalCount > 0 ? (sortedEvals.reduce((a, b) => a + b.tactica, 0) / totalCount).toFixed(1) : '-';
  const avgCon = totalCount > 0 ? (sortedEvals.reduce((a, b) => a + b.condicional, 0) / totalCount).toFixed(1) : '-';
  const overallAvg = totalCount > 0
    ? ((parseFloat(avgTec) + parseFloat(avgTac) + parseFloat(avgCon)) / 3).toFixed(1)
    : '-';

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

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div
        id={`modal-historial-${player.id}`}
        className={`${
          isDark ? 'bg-[#031533] text-white' : 'bg-white text-slate-900'
        } border-2 border-red-600 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors`}
      >
        {/* Header */}
        <div className={`${
          isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
        } border-b-2 border-red-600 px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-athletic font-extrabold text-2xl flex items-center justify-center border-2 border-red-400 shadow-md">
              {player.dorsal}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-red-600/30 text-red-200 border border-red-500/40 px-2 py-0.5 rounded">
                  Historial de Evaluaciones
                </span>
                <span className="text-xs text-blue-200 font-medium">
                  {player.posicion}
                </span>
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

        {/* Global Summary Stats for this Player */}
        <div className={`${
          isDark ? 'bg-[#071d44]' : 'bg-slate-50'
        } border-b-2 border-red-600/60 p-4 sm:p-5 transition-colors`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Total Records */}
            <div className={`${
              isDark ? 'bg-[#020d24] border-blue-900/80' : 'bg-white border-slate-200 shadow-2xs'
            } border rounded-xl p-3 text-center`}>
              <span className={`text-[10px] uppercase font-bold tracking-wider block ${
                isDark ? 'text-blue-300' : 'text-slate-500'
              }`}>
                Evaluaciones Totales
              </span>
              <span className={`font-athletic text-2xl font-black ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {totalCount}
              </span>
              <span className={`text-[10px] block ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>
                registros guardados
              </span>
            </div>

            {/* Avg Tecnica */}
            <div className={`${
              isDark ? 'bg-[#020d24] border-blue-900/80' : 'bg-white border-slate-200 shadow-2xs'
            } border rounded-xl p-3 text-center`}>
              <span className={`text-[10px] uppercase font-bold tracking-wider block ${
                isDark ? 'text-blue-300' : 'text-slate-500'
              }`}>
                Prom. Técnica
              </span>
              <span className={`font-athletic text-2xl font-black ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {avgTec} <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>/5</span>
              </span>
              <span className="text-[10px] text-red-500 block">histórico</span>
            </div>

            {/* Avg Tactica */}
            <div className={`${
              isDark ? 'bg-[#020d24] border-blue-900/80' : 'bg-white border-slate-200 shadow-2xs'
            } border rounded-xl p-3 text-center`}>
              <span className={`text-[10px] uppercase font-bold tracking-wider block ${
                isDark ? 'text-blue-300' : 'text-slate-500'
              }`}>
                Prom. Táctica
              </span>
              <span className={`font-athletic text-2xl font-black ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {avgTac} <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>/5</span>
              </span>
              <span className="text-[10px] text-red-500 block">histórico</span>
            </div>

            {/* Avg Condicional */}
            <div className={`${
              isDark ? 'bg-[#020d24] border-blue-900/80' : 'bg-white border-slate-200 shadow-2xs'
            } border rounded-xl p-3 text-center`}>
              <span className={`text-[10px] uppercase font-bold tracking-wider block ${
                isDark ? 'text-blue-300' : 'text-slate-500'
              }`}>
                Prom. Condicional
              </span>
              <span className={`font-athletic text-2xl font-black ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {avgCon} <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>/5</span>
              </span>
              <span className="text-[10px] text-red-500 block">histórico</span>
            </div>
          </div>
        </div>

        {/* Chronological History List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-blue-200' : 'text-slate-700'
            }`}>
              <Clock className="w-4 h-4 text-red-500" />
              Línea Temporal de Evaluaciones (Orden cronológico)
            </span>
            <span className={`text-xs ${isDark ? 'text-blue-300/80' : 'text-slate-500'}`}>
              Escala de puntuación del 1 al 5
            </span>
          </div>

          {sortedEvals.length === 0 ? (
            <div className={`${
              isDark ? 'bg-[#071d44]' : 'bg-slate-50'
            } border-2 border-red-600 rounded-xl p-8 text-center`}>
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
              {sortedEvals.map((ev, index) => {
                const sessionAvg = ((ev.tecnica + ev.tactica + ev.condicional) / 3).toFixed(1);
                const isLatest = index === 0;

                return (
                  <div
                    key={ev.id}
                    id={`eval-history-card-${ev.id}`}
                    className={`${
                      isDark
                        ? 'bg-[#071d44] border-2'
                        : 'bg-white border-2 shadow-xs'
                    } ${
                      isLatest ? 'border-red-500 shadow-md' : 'border-red-600/50'
                    } rounded-xl p-4 sm:p-5 transition-all hover:border-red-400`}
                  >
                    {/* Top Row: Date, Context & Actions */}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b ${
                      isDark ? 'border-blue-900/60' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono border ${
                          isDark
                            ? 'bg-[#020d24] text-white border-red-500/60'
                            : 'bg-slate-50 text-slate-900 border-slate-300'
                        }`}>
                          <Calendar className="w-3.5 h-3.5 text-red-500" />
                          {formatDateDisplay(ev.fechaEvaluacion)}
                        </span>
                        {isLatest && (
                          <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded">
                            Más Reciente
                          </span>
                        )}
                        {ev.tipoEvaluacion && (
                          <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${
                            isDark
                              ? 'bg-blue-900/40 text-blue-200 border-blue-700/60'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
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
                          <span className={`font-athletic text-lg font-black px-2 py-0.5 rounded border ${
                            isDark
                              ? 'bg-red-600/30 border-red-500 text-red-200'
                              : 'bg-red-50 border-red-300 text-red-700'
                          }`}>
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
                      <div className={`border rounded-lg p-2.5 text-center ${
                        isDark ? 'bg-[#020e26] border-blue-900/70' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                          isDark ? 'text-blue-300' : 'text-slate-600'
                        }`}>
                          Técnica
                        </span>
                        <span className={`font-athletic text-2xl font-black block my-0.5 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {ev.tecnica}
                          <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}> / 5</span>
                        </span>
                        <div className="flex justify-center mt-1">
                          {renderPillStars(ev.tecnica)}
                        </div>
                      </div>

                      {/* Táctica */}
                      <div className={`border rounded-lg p-2.5 text-center ${
                        isDark ? 'bg-[#020e26] border-blue-900/70' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                          isDark ? 'text-blue-300' : 'text-slate-600'
                        }`}>
                          Táctica
                        </span>
                        <span className={`font-athletic text-2xl font-black block my-0.5 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {ev.tactica}
                          <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}> / 5</span>
                        </span>
                        <div className="flex justify-center mt-1">
                          {renderPillStars(ev.tactica)}
                        </div>
                      </div>

                      {/* Condicional */}
                      <div className={`border rounded-lg p-2.5 text-center ${
                        isDark ? 'bg-[#020e26] border-blue-900/70' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                          isDark ? 'text-blue-300' : 'text-slate-600'
                        }`}>
                          Condicional
                        </span>
                        <span className={`font-athletic text-2xl font-black block my-0.5 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {ev.condicional}
                          <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}> / 5</span>
                        </span>
                        <div className="flex justify-center mt-1">
                          {renderPillStars(ev.condicional)}
                        </div>
                      </div>
                    </div>

                    {/* Observaciones y Evaluador */}
                    {(ev.notas || ev.evaluador) && (
                      <div className={`mt-2 border rounded-lg p-3 text-xs space-y-1 ${
                        isDark
                          ? 'bg-[#020e26]/90 border-blue-900/60'
                          : 'bg-slate-50 border-slate-200'
                      }`}>
                        {ev.notas && (
                          <div className={`italic ${isDark ? 'text-blue-100' : 'text-slate-700'}`}>
                            "{ev.notas}"
                          </div>
                        )}
                        {ev.evaluador && (
                          <div className={`text-[11px] font-medium flex items-center gap-1 pt-1 border-t ${
                            isDark ? 'text-blue-300/80 border-blue-950' : 'text-slate-500 border-slate-200'
                          }`}>
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

        {/* Footer */}
        <div className={`${
          isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
        } border-t-2 border-red-600 px-6 py-3.5 flex items-center justify-between`}>
          <span className="text-xs text-blue-200">
            {totalCount} registro(s) en el historial de {player.nombre} {player.apellido}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent hover:bg-blue-900/50 text-white text-xs font-semibold rounded-lg border border-blue-700 transition-colors cursor-pointer"
          >
            Cerrar Historial
          </button>
        </div>
      </div>
    </div>
  );
};
