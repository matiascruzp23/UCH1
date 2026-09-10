import React from 'react';
import { Player } from '../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DeletePlayerConfirmModalProps {
  isOpen: boolean;
  player: Player | null;
  evaluationsCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeletePlayerConfirmModal: React.FC<DeletePlayerConfirmModalProps> = ({
  isOpen,
  player,
  evaluationsCount,
  onClose,
  onConfirm
}) => {
  const { isDark } = useTheme();

  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-delete-player-confirm"
        className={`${
          isDark ? 'bg-[#031533] text-white' : 'bg-white text-slate-900'
        } border-2 border-red-600 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transition-colors`}
      >
        {/* Header */}
        <div className={`${
          isDark ? 'bg-red-950/70' : 'bg-red-600'
        } border-b-2 border-red-600 px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2.5 text-white">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-white uppercase font-athletic tracking-wide">
              Confirmar Eliminación
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-black/20 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className={`text-sm leading-relaxed ${isDark ? 'text-blue-100' : 'text-slate-700'}`}>
            ¿Estás seguro de que deseas eliminar a{' '}
            <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {player.nombre} {player.apellido}
            </strong>{' '}
            (Dorsal #{player.dorsal} - {player.posicion}) de la plantilla de Universidad de Chile?
          </p>

          {evaluationsCount > 0 && (
            <div className={`p-3 border rounded-lg text-xs ${
              isDark
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}>
              Se eliminarán también sus <strong>{evaluationsCount} evaluación(es)</strong> registradas en el historial.
            </div>
          )}

          <p className={`text-xs ${isDark ? 'text-blue-300/80' : 'text-slate-500'}`}>
            Esta acción se sincronizará automáticamente con la base de datos de Supabase y el almacenamiento local.
          </p>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                isDark
                  ? 'bg-[#061d47] hover:bg-blue-900 text-blue-200 border-blue-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              Cancelar
            </button>
            <button
              id="btn-confirmar-eliminar-jugador"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-red-400 flex items-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar Jugador</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
