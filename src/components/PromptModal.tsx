import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Terminal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const promptText = `Crea una aplicación web moderna en React y Tailwind CSS llamada "Universidad de Chile" para la gestión deportiva del club.

Requisitos específicos:
1. Identidad Visual:
   - Estilo temático del Club Universidad de Chile (El Romántico Viajero).
   - Fondo general azul oscuro/marino (#031533 / #002B7A) con tarjetas en azul rey (#071d44).
   - Bordes y detalles en rojo vibrante (#D00000 / border-red-600) de alto contraste.
   - Emblema estilizado con la emblemática letra "U" en rojo.

2. Navegación en 2 pestañas principales:
   - Pestaña 1 "Plantilla":
     * Listado de 10 jugadores con datos obligatorios: Nombre y Apellido, Dorsal y Fecha de Nacimiento (con cálculo dinámico de edad).
     * Posición en el campo (Arquero, Defensa, Mediocampista, Delantero).
     * Tarjetas atléticas responsivas con fondo azul y bordes rojos.
     * Capacidad para filtrar, buscar o ver ficha rápida del jugador.
   - Pestaña 2 "Evaluaciones":
     * Sistema de Historial de Evaluaciones para cada jugador:
       - Capacidad de registrar múltiples evaluaciones por jugador a lo largo del tiempo.
       - Cada registro histórico incluye: Fecha de la evaluación (YYYY-MM-DD), contexto de sesión (Partido Oficial, Entrenamiento Táctico, Control Físico, etc.) y observaciones.
       - Puntuaciones obligatorias del 1 al 5 en 3 ejes:
         1) Técnica (1 al 5)
         2) Táctica (1 al 5)
         3) Condicional / Física (1 al 5)
     * Resumen de promedios por jugador, última evaluación y promedios globales del equipo.
     * Ventana modal de historial detallado por jugador con línea de tiempo y edición/eliminación de registros.
     * Modal interactivo para registrar nuevas evaluaciones con selector de fecha y botones de 1 a 5.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`${
        isDark ? 'bg-[#041638] text-white' : 'bg-white text-slate-900'
      } border-2 border-red-600 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors`}>
        {/* Header */}
        <div className={`${
          isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
        } border-b-2 border-red-600 px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-black uppercase text-white font-athletic">
              Prompt Optimizado para AI Studio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white p-1.5 rounded-lg hover:bg-blue-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className={`border rounded-lg p-3 text-xs ${
            isDark ? 'bg-[#020e26] border-blue-800/80 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            <span className="font-bold">¡La aplicación ya está creada y funcionando en esta misma pantalla!</span> Si deseas guardar este prompt para volver a generarla o personalizarla en el futuro, puedes copiarlo a continuación:
          </div>

          <div className="relative">
            <pre className={`border-2 border-red-600/40 rounded-xl p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-red-600 selection:text-white ${
              isDark ? 'bg-[#020b1e] text-blue-100' : 'bg-slate-50 text-slate-800'
            }`}>
              {promptText}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className={`${
          isDark ? 'bg-[#031330]' : 'bg-slate-100'
        } border-t border-red-600/50 px-6 py-3.5 flex items-center justify-between transition-colors`}>
          <span className={`text-xs ${isDark ? 'text-blue-300' : 'text-slate-600'}`}>
            {copied ? '¡Copiado al portapapeles!' : 'Haz clic en copiar para llevarlo'}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-xs font-medium rounded-lg cursor-pointer ${
                isDark ? 'bg-transparent text-blue-200 hover:bg-blue-900/40' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Cerrar
            </button>
            <button
              id="btn-copy-prompt-action"
              onClick={handleCopy}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-red-400 flex items-center gap-2 shadow transition-all active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
              <span>{copied ? 'Copiado' : 'Copiar Prompt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
