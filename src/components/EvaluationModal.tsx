import React, { useState, useEffect } from 'react';
import { Player, PlayerEvaluation } from '../types';
import { X, Calendar, Save, Award, ClipboardCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface EvaluationModalProps {
  player: Player | null;
  evaluationToEdit?: PlayerEvaluation | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveEvaluation: (evaluationData: Omit<PlayerEvaluation, 'id'> & { id?: string }) => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  player,
  evaluationToEdit,
  isOpen,
  onClose,
  onSaveEvaluation
}) => {
  const { isDark } = useTheme();
  const [tecnica, setTecnica] = useState<number>(3);
  const [tactica, setTactica] = useState<number>(3);
  const [condicional, setCondicional] = useState<number>(3);
  const [fechaEvaluacion, setFechaEvaluacion] = useState<string>('');
  const [tipoEvaluacion, setTipoEvaluacion] = useState<string>('Partido Oficial');
  const [notas, setNotas] = useState<string>('');
  const [evaluador, setEvaluador] = useState<string>('Cuerpo Técnico UdeC');

  useEffect(() => {
    if (evaluationToEdit) {
      setTecnica(evaluationToEdit.tecnica);
      setTactica(evaluationToEdit.tactica);
      setCondicional(evaluationToEdit.condicional);
      setFechaEvaluacion(evaluationToEdit.fechaEvaluacion);
      setTipoEvaluacion(evaluationToEdit.tipoEvaluacion || 'Partido Oficial');
      setNotas(evaluationToEdit.notas || '');
      setEvaluador(evaluationToEdit.evaluador || 'Cuerpo Técnico UdeC');
    } else {
      setTecnica(3);
      setTactica(3);
      setCondicional(3);
      setFechaEvaluacion(new Date().toISOString().split('T')[0]);
      setTipoEvaluacion('Partido Oficial');
      setNotas('');
      setEvaluador('Cuerpo Técnico UdeC');
    }
  }, [evaluationToEdit, player, isOpen]);

  if (!isOpen || !player) return null;

  const average = ((tecnica + tactica + condicional) / 3).toFixed(1);

  const getScoreDescription = (val: number) => {
    switch (val) {
      case 1:
        return '1 - En Desarrollo (Muy bajo)';
      case 2:
        return '2 - Básico / En adaptación';
      case 3:
        return '3 - Aceptable / Nivel estándar';
      case 4:
        return '4 - Destacado / Alto rendimiento';
      case 5:
        return '5 - Sobresaliente / Nivel Élite';
      default:
        return `${val} / 5`;
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEvaluation({
      id: evaluationToEdit?.id,
      jugadorId: player.id,
      tecnica,
      tactica,
      condicional,
      fechaEvaluacion: fechaEvaluacion || new Date().toISOString().split('T')[0],
      tipoEvaluacion,
      evaluador,
      notas
    });
    onClose();
  };

  const renderRatingPills = (
    label: string,
    currentValue: number,
    setValue: (val: number) => void,
    fieldId: string
  ) => {
    return (
      <div className={`border rounded-xl p-4 transition-colors ${
        isDark ? 'bg-[#020e26] border-red-600/30' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <label className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}>
              {label}
            </label>
            <p className={`text-[11px] ${isDark ? 'text-blue-300/80' : 'text-slate-500'}`}>
              Escala obligatoria del 1 al 5
            </p>
          </div>
          <span className="font-athletic text-2xl font-black text-red-500">
            {currentValue} <span className={`text-xs font-normal ${isDark ? 'text-blue-400' : 'text-slate-400'}`}>/ 5</span>
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 my-2" id={`rating-group-${fieldId}`}>
          {[1, 2, 3, 4, 5].map((num) => {
            const isSelected = currentValue === num;
            return (
              <button
                key={num}
                type="button"
                id={`btn-rate-${fieldId}-${num}`}
                onClick={() => setValue(num)}
                className={`py-2.5 rounded-lg font-athletic font-black text-lg transition-all border-2 cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-400 shadow-md scale-105'
                    : isDark
                      ? 'bg-[#061e47] text-blue-200 border-blue-900/80 hover:border-red-500/60 hover:text-white'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-red-500/60 hover:text-slate-900'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <p className={`text-xs font-medium italic mt-1 ${isDark ? 'text-blue-200/90' : 'text-slate-600'}`}>
          {getScoreDescription(currentValue)}
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-evaluacion"
        className={`${
          isDark ? 'bg-[#041638] text-white' : 'bg-white text-slate-900'
        } border-2 border-red-600 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors`}
      >
        {/* Modal Header */}
        <div className={`${
          isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
        } border-b-2 border-red-600 px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600 text-white font-athletic font-extrabold text-xl flex items-center justify-center border border-red-400">
              {player.dorsal}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase text-white font-athletic">
                {evaluationToEdit ? 'Editar Registro de Evaluación' : 'Registrar Nueva Evaluación al Historial'}
              </h3>
              <p className="text-xs text-blue-200">
                {player.nombre} {player.apellido} • {player.posicion}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white p-1.5 rounded-lg hover:bg-blue-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Average Banner */}
          <div className={`${
            isDark ? 'bg-[#07245c] border-red-500/80' : 'bg-blue-50 border-red-500/80'
          } border-2 rounded-xl p-3 flex items-center justify-between`}>
            <div>
              <span className="text-xs uppercase font-bold text-red-500 block">
                Puntaje Promedio de la Evaluación
              </span>
              <span className={`text-[11px] ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
                Cálculo de Técnica, Táctica y Condicional
              </span>
            </div>
            <div className="font-athletic text-3xl font-black text-white px-3 py-1 bg-red-600 rounded-lg border border-red-400 shadow">
              {average} <span className="text-sm font-normal text-red-100">/ 5.0</span>
            </div>
          </div>

          {/* Fecha de la Evaluación & Tipo de Sesión */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded-xl p-3.5 ${
            isDark ? 'bg-[#020e26] border-blue-900/80' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${
                isDark ? 'text-blue-200' : 'text-slate-700'
              }`}>
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                Fecha de la Evaluación *
              </label>
              <input
                id="input-fecha-evaluacion"
                type="date"
                required
                value={fechaEvaluacion}
                onChange={(e) => setFechaEvaluacion(e.target.value)}
                className={`w-full ${
                  isDark
                    ? 'bg-[#041638] text-white border-red-600/60'
                    : 'bg-white text-slate-900 border-slate-300'
                } border focus:border-red-500 rounded-lg p-2 text-xs focus:outline-none transition-colors`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${
                isDark ? 'text-blue-200' : 'text-slate-700'
              }`}>
                <ClipboardCheck className="w-3.5 h-3.5 text-red-500" />
                Contexto / Tipo de Sesión
              </label>
              <select
                id="select-tipo-evaluacion"
                value={tipoEvaluacion}
                onChange={(e) => setTipoEvaluacion(e.target.value)}
                className={`w-full ${
                  isDark
                    ? 'bg-[#041638] text-white border-blue-800'
                    : 'bg-white text-slate-900 border-slate-300'
                } border focus:border-red-500 rounded-lg p-2 text-xs focus:outline-none cursor-pointer transition-colors`}
              >
                <option value="Partido Oficial">Partido Oficial</option>
                <option value="Entrenamiento Táctico">Entrenamiento Táctico</option>
                <option value="Control Físico">Control Físico</option>
                <option value="Pretemporada">Pretemporada</option>
                <option value="Amistoso Formal">Amistoso Formal</option>
                <option value="Control Rutinario">Control Rutinario</option>
              </select>
            </div>
          </div>

          {/* 1. Técnica (1 al 5) */}
          {renderRatingPills('1. Evaluación Técnica', tecnica, setTecnica, 'tecnica')}

          {/* 2. Táctica (1 al 5) */}
          {renderRatingPills('2. Evaluación Táctica', tactica, setTactica, 'tactica')}

          {/* 3. Condicional (1 al 5) */}
          {renderRatingPills('3. Evaluación Condicional (Física)', condicional, setCondicional, 'condicional')}

          {/* Observaciones y Evaluador */}
          <div className="space-y-3 pt-1">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-blue-200' : 'text-slate-700'
              }`}>
                Observaciones del Rendimiento
              </label>
              <textarea
                id="input-notas-evaluacion"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={2}
                placeholder="Detalle sobre control de balón, visión táctica, resistencia o ritmo de juego..."
                className={`w-full ${
                  isDark
                    ? 'bg-[#020e26] border-blue-800 text-white placeholder-blue-300/40'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                } border focus:border-red-500 rounded-lg p-2.5 text-xs focus:outline-none transition-colors`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-blue-200' : 'text-slate-700'
              }`}>
                Responsable de la Evaluación
              </label>
              <input
                id="input-evaluador"
                type="text"
                value={evaluador}
                onChange={(e) => setEvaluador(e.target.value)}
                className={`w-full ${
                  isDark
                    ? 'bg-[#020e26] border-blue-800 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                } border focus:border-red-500 rounded-lg p-2 text-xs focus:outline-none transition-colors`}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className={`flex items-center justify-end gap-3 pt-4 border-t ${
            isDark ? 'border-blue-900/60' : 'border-slate-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-transparent hover:bg-blue-900/40 text-blue-200 border-blue-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              Cancelar
            </button>
            <button
              id="btn-guardar-evaluacion"
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg border-2 border-red-400 flex items-center gap-2 shadow-lg shadow-red-900/40 transition-transform active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{evaluationToEdit ? 'Guardar Cambios' : 'Guardar en Historial'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
