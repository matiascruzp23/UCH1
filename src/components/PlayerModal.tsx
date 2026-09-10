import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { X, UserPlus, Edit3, User, Calendar, Award, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PlayerModalProps {
  isOpen: boolean;
  playerToEdit: Player | null;
  onClose: () => void;
  onSavePlayer: (playerData: Omit<Player, 'id'> & { id?: string }) => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  isOpen,
  playerToEdit,
  onClose,
  onSavePlayer
}) => {
  const { isDark } = useTheme();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dorsal, setDorsal] = useState<number>(1);
  const [posicion, setPosicion] = useState<Player['posicion']>('Mediocampista');
  const [fechaNacimiento, setFechaNacimiento] = useState('2000-01-01');
  const [pieHabil, setPieHabil] = useState<Player['pieHabil']>('Derecho');
  const [nacionalidad, setNacionalidad] = useState('Chilena');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (playerToEdit) {
      setNombre(playerToEdit.nombre);
      setApellido(playerToEdit.apellido);
      setDorsal(playerToEdit.dorsal);
      setPosicion(playerToEdit.posicion);
      setFechaNacimiento(playerToEdit.fechaNacimiento);
      setPieHabil(playerToEdit.pieHabil || 'Derecho');
      setNacionalidad(playerToEdit.nacionalidad || 'Chilena');
    } else {
      setNombre('');
      setApellido('');
      setDorsal(10);
      setPosicion('Mediocampista');
      setFechaNacimiento('2001-01-01');
      setPieHabil('Derecho');
      setNacionalidad('Chilena');
    }
    setErrorMsg('');
  }, [playerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorMsg('Por favor ingresa el nombre del jugador.');
      return;
    }
    if (!apellido.trim()) {
      setErrorMsg('Por favor ingresa el apellido del jugador.');
      return;
    }
    if (!dorsal || dorsal < 1 || dorsal > 99) {
      setErrorMsg('El dorsal debe ser un número entre 1 y 99.');
      return;
    }
    if (!fechaNacimiento) {
      setErrorMsg('Por favor selecciona la fecha de nacimiento.');
      return;
    }

    onSavePlayer({
      id: playerToEdit ? playerToEdit.id : undefined,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dorsal: Number(dorsal),
      posicion,
      fechaNacimiento,
      pieHabil,
      nacionalidad: nacionalidad.trim() || 'Chilena'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-player-form"
        className={`${
          isDark ? 'bg-[#031533] text-white' : 'bg-white text-slate-900'
        } border-2 border-red-600 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors`}
      >
        {/* Header */}
        <div className={`${
          isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
        } border-b-2 border-red-600 px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center border border-red-400 shadow-md">
              {playerToEdit ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-black uppercase text-white font-athletic tracking-wide">
                {playerToEdit ? 'Editar Jugador' : 'Agregar Nuevo Jugador'}
              </h2>
              <p className="text-xs text-blue-200">
                {playerToEdit
                  ? `Modificando datos de ${playerToEdit.nombre} ${playerToEdit.apellido}`
                  : 'Ficha de inscripción de jugador para Universidad de Chile'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500 text-red-200 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-blue-200' : 'text-slate-700'
              }`}>
                Nombre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-blue-400' : 'text-slate-400'
                }`} />
                <input
                  id="input-player-nombre"
                  type="text"
                  required
                  placeholder="Ej: Marcelo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={`w-full ${
                    isDark
                      ? 'bg-[#061d47] border-blue-800 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  } border focus:border-red-500 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none transition-colors`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-blue-200' : 'text-slate-700'
              }`}>
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                id="input-player-apellido"
                type="text"
                required
                placeholder="Ej: Díaz"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className={`w-full ${
                  isDark
                    ? 'bg-[#061d47] border-blue-800 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                } border focus:border-red-500 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors`}
              />
            </div>
          </div>

          {/* Dorsal y Posición */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-blue-200' : 'text-slate-700'
              }`}>
                Dorsal (#) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Award className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-blue-400' : 'text-slate-400'
                }`} />
                <input
                  id="input-player-dorsal"
                  type="number"
                  min="1"
                  max="99"
                  required
                  value={dorsal}
                  onChange={(e) => setDorsal(parseInt(e.target.value) || 1)}
                  className={`w-full ${
                    isDark
                      ? 'bg-[#061d47] border-blue-800 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  } border focus:border-red-500 rounded-lg pl-9 pr-3 py-2 text-sm font-athletic font-bold text-lg focus:outline-none transition-colors`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-blue-200' : 'text-slate-700'
              }`}>
                Posición en Cancha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Shield className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-blue-400' : 'text-slate-400'
                }`} />
                <select
                  id="select-player-posicion"
                  value={posicion}
                  onChange={(e) => setPosicion(e.target.value as Player['posicion'])}
                  className={`w-full ${
                    isDark
                      ? 'bg-[#061d47] border-blue-800 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  } border focus:border-red-500 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none cursor-pointer transition-colors`}
                >
                  <option value="Arquero">Arquero</option>
                  <option value="Defensa">Defensa</option>
                  <option value="Mediocampista">Mediocampista</option>
                  <option value="Delantero">Delantero</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
              isDark ? 'text-blue-200' : 'text-slate-700'
            }`}>
              Fecha de Nacimiento <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-blue-400' : 'text-slate-400'
              }`} />
              <input
                id="input-player-fecha-nacimiento"
                type="date"
                required
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className={`w-full ${
                  isDark
                    ? 'bg-[#061d47] border-blue-800 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                } border focus:border-red-500 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none transition-colors`}
              />
            </div>
          </div>

          {/* Pie Hábil y Nacionalidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-blue-200' : 'text-slate-700'
              }`}>
                Pie Hábil
              </label>
              <select
                id="select-player-pie"
                value={pieHabil}
                onChange={(e) => setPieHabil(e.target.value as Player['pieHabil'])}
                className={`w-full ${
                  isDark
                    ? 'bg-[#061d47] border-blue-800 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                } border focus:border-red-500 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer transition-colors`}
              >
                <option value="Derecho">Derecho</option>
                <option value="Izquierdo">Izquierdo</option>
                <option value="Ambidiestro">Ambidiestro</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-blue-200' : 'text-slate-700'
              }`}>
                Nacionalidad
              </label>
              <input
                id="input-player-nacionalidad"
                type="text"
                placeholder="Ej: Chilena"
                value={nacionalidad}
                onChange={(e) => setNacionalidad(e.target.value)}
                className={`w-full ${
                  isDark
                    ? 'bg-[#061d47] border-blue-800 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                } border focus:border-red-500 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className={`pt-4 flex items-center justify-end gap-3 border-t ${
            isDark ? 'border-blue-900/60' : 'border-slate-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#020e26] hover:bg-blue-900/50 text-blue-200 border-blue-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              Cancelar
            </button>
            <button
              id="btn-guardar-jugador"
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-red-400 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {playerToEdit ? 'Guardar Cambios' : 'Registrar Jugador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
