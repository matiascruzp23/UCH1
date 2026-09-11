import React, { useState } from 'react';
import { Player, MatchPlayerStat } from '../types';
import { TACTICAL_FORMATIONS, DEFAULT_FORMATION } from '../utils/tacticalFormations';
import { UserCheck, UserX, Wand2, Shield, User, X, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CampogramaProps {
  formation?: string;
  onChangeFormation?: (formation: string) => void;
  // slotId -> jugadorId mapping
  slotsAssignment: Record<string, string>;
  onAssignPlayerToSlot?: (slotId: string, playerId: string | null) => void;
  players: Player[];
  matchStats?: MatchPlayerStat[];
  isInteractive?: boolean;
  onOpenPlayerFicha?: (player: Player) => void;
  onAutoFillStarters?: () => void;
  onClearStarters?: () => void;
  // Optional extra CSS classes
  className?: string;
}

export const Campograma: React.FC<CampogramaProps> = ({
  formation = DEFAULT_FORMATION,
  onChangeFormation,
  slotsAssignment,
  onAssignPlayerToSlot,
  players,
  matchStats = [],
  isInteractive = false,
  onOpenPlayerFicha,
  onAutoFillStarters,
  onClearStarters,
  className = ''
}) => {
  const { isDark } = useTheme();
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [slotPickerSearch, setSlotPickerSearch] = useState('');

  const currentFormation = TACTICAL_FORMATIONS[formation] || TACTICAL_FORMATIONS[DEFAULT_FORMATION];

  // Helper map for quick player lookup
  const playerMap = React.useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  // Map of stats per player
  const statsMap = React.useMemo(() => {
    const map = new Map<string, MatchPlayerStat>();
    matchStats.forEach((s) => map.set(s.jugadorId, s));
    return map;
  }, [matchStats]);

  // Count assigned starters
  const assignedCount = Object.values(slotsAssignment).filter(Boolean).length;

  // Currently active slot info
  const activeSlot = currentFormation.slots.find((s) => s.slotId === activeSlotId);

  // Available players for active slot
  const availablePlayersForActiveSlot = React.useMemo(() => {
    if (!activeSlot) return [];
    const alreadyAssignedIds = new Set(
      Object.entries(slotsAssignment)
        .filter(([sId, pId]) => sId !== activeSlot.slotId && Boolean(pId))
        .map(([_, pId]) => pId)
    );

    return players
      .filter((p) => {
        const query = slotPickerSearch.toLowerCase();
        const matchesQuery =
          p.nombre.toLowerCase().includes(query) ||
          p.apellido.toLowerCase().includes(query) ||
          p.dorsal.toString().includes(query) ||
          p.posicion.toLowerCase().includes(query) ||
          (p.posicionDetallada && p.posicionDetallada.toLowerCase().includes(query));
        return matchesQuery;
      })
      .sort((a, b) => {
        // Priority to same category as slot
        const aMatches = a.posicion === activeSlot.categoria;
        const bMatches = b.posicion === activeSlot.categoria;
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;

        // Then priority to non-assigned
        const aAssigned = alreadyAssignedIds.has(a.id);
        const bAssigned = alreadyAssignedIds.has(b.id);
        if (!aAssigned && bAssigned) return -1;
        if (aAssigned && !bAssigned) return 1;

        return a.dorsal - b.dorsal;
      });
  }, [players, activeSlot, slotsAssignment, slotPickerSearch]);

  const handleSlotClick = (slotId: string) => {
    if (!isInteractive) {
      const assignedPlayerId = slotsAssignment[slotId];
      if (assignedPlayerId && onOpenPlayerFicha) {
        const p = playerMap.get(assignedPlayerId);
        if (p) onOpenPlayerFicha(p);
      }
      return;
    }

    setActiveSlotId((prev) => (prev === slotId ? null : slotId));
    setSlotPickerSearch('');
  };

  const handleSelectPlayer = (playerId: string | null) => {
    if (activeSlotId && onAssignPlayerToSlot) {
      onAssignPlayerToSlot(activeSlotId, playerId);
    }
    setActiveSlotId(null);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Interactive Controls Header */}
      {isInteractive && (
        <div
          className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDark ? 'bg-[#031330] border-blue-900/80' : 'bg-slate-100 border-slate-300'
          }`}
        >
          {/* Formation Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold ${isDark ? 'text-blue-300' : 'text-slate-700'}`}>
              Esquema Táctico:
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {Object.keys(TACTICAL_FORMATIONS).map((fKey) => {
                const isSelected = formation === fKey;
                return (
                  <button
                    key={fKey}
                    type="button"
                    onClick={() => onChangeFormation && onChangeFormation(fKey)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-400 shadow-sm'
                        : isDark
                        ? 'bg-[#061838] text-blue-200 border-blue-900 hover:border-red-500/50'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-red-500/50'
                    }`}
                  >
                    {fKey}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions & Titulares Counter */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                assignedCount === 11
                  ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500'
                  : 'bg-red-600/20 text-red-400 border-red-500'
              }`}
            >
              {assignedCount}/11 Titulares
            </span>

            {onAutoFillStarters && (
              <button
                type="button"
                onClick={onAutoFillStarters}
                className="px-2.5 py-1 rounded-md bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 border border-blue-500 shadow-xs cursor-pointer"
                title="Completar titulares automáticamente según posición"
              >
                <Wand2 className="w-3 h-3 text-amber-300" />
                <span className="hidden sm:inline">Auto-Alinear</span>
              </button>
            )}

            {onClearStarters && assignedCount > 0 && (
              <button
                type="button"
                onClick={onClearStarters}
                className={`p-1 rounded-md border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#061838] hover:bg-red-950 text-slate-300 hover:text-red-400 border-blue-900'
                    : 'bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border-slate-300'
                }`}
                title="Limpiar posiciones del campo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Field Container with authentic grass & pitch markings */}
      <div className="relative w-full overflow-hidden rounded-2xl border-4 border-emerald-900/60 shadow-2xl select-none">
        {/* Pitch Graphic Background (Rich turf pattern with alternating grass strips) */}
        <div
          className="relative w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] max-h-[580px] bg-emerald-800"
          style={{
            background:
              'repeating-linear-gradient(0deg, #1e7039, #1e7039 36px, #1a6433 36px, #1a6433 72px)'
          }}
        >
          {/* Subtle grass vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/35 pointer-events-none" />

          {/* SVG Pitch Markings */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 130"
            preserveAspectRatio="none"
          >
            {/* Outer Boundary line */}
            <rect
              x="5"
              y="5"
              width="90"
              height="120"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.8"
            />

            {/* Halfway line */}
            <line
              x1="5"
              y1="65"
              x2="95"
              y2="65"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.8"
            />

            {/* Center Circle */}
            <circle
              cx="50"
              cy="65"
              r="12"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.8"
            />
            {/* Center Spot */}
            <circle cx="50" cy="65" r="0.8" fill="rgba(255, 255, 255, 0.9)" />

            {/* TOP GOAL & PENALTY AREA (Rival Side) */}
            {/* Top Penalty Box */}
            <rect
              x="22"
              y="5"
              width="56"
              height="20"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.8"
            />
            {/* Top 6-yard box */}
            <rect
              x="34"
              y="5"
              width="32"
              height="7"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.8"
            />
            {/* Top Penalty Spot */}
            <circle cx="50" cy="17" r="0.7" fill="rgba(255, 255, 255, 0.9)" />
            {/* Top Penalty Arc */}
            <path
              d="M 40 25 A 10 10 0 0 0 60 25"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.8"
            />
            {/* Top Goal Frame */}
            <rect
              x="42"
              y="2.5"
              width="16"
              height="2.5"
              fill="rgba(255, 255, 255, 0.2)"
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth="0.8"
            />

            {/* BOTTOM GOAL & PENALTY AREA (Our Goal - Portería U. de Chile) */}
            {/* Bottom Penalty Box */}
            <rect
              x="22"
              y="105"
              width="56"
              height="20"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.8"
            />
            {/* Bottom 6-yard box */}
            <rect
              x="34"
              y="118"
              width="32"
              height="7"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.8"
            />
            {/* Bottom Penalty Spot */}
            <circle cx="50" cy="113" r="0.7" fill="rgba(255, 255, 255, 0.9)" />
            {/* Bottom Penalty Arc */}
            <path
              d="M 40 105 A 10 10 0 0 1 60 105"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.8"
            />
            {/* Bottom Goal Frame */}
            <rect
              x="42"
              y="125"
              width="16"
              height="2.5"
              fill="rgba(255, 255, 255, 0.2)"
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth="0.8"
            />

            {/* Corner Arcs */}
            <path d="M 5 8 A 3 3 0 0 0 8 5" fill="none" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="0.8" />
            <path d="M 95 8 A 3 3 0 0 1 92 5" fill="none" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="0.8" />
            <path d="M 5 122 A 3 3 0 0 1 8 125" fill="none" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="0.8" />
            <path d="M 95 122 A 3 3 0 0 0 92 125" fill="none" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="0.8" />
          </svg>

          {/* Tactical Formation Tag Watermark */}
          <div className="absolute top-2 left-3 pointer-events-none opacity-40 text-[10px] font-athletic font-extrabold uppercase tracking-widest text-white/90">
            {currentFormation.name}
          </div>

          {/* 11 Tactical Player Slots */}
          {currentFormation.slots.map((slot) => {
            const assignedPlayerId = slotsAssignment[slot.slotId];
            const player = assignedPlayerId ? playerMap.get(assignedPlayerId) : undefined;
            const stat = assignedPlayerId ? statsMap.get(assignedPlayerId) : undefined;
            const isActive = activeSlotId === slot.slotId;

            return (
              <div
                key={slot.slotId}
                style={{
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute z-10"
              >
                <button
                  type="button"
                  id={`campograma-slot-${slot.slotId}`}
                  onClick={() => handleSlotClick(slot.slotId)}
                  className={`group relative flex flex-col items-center transition-all ${
                    isInteractive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-pointer hover:scale-105'
                  }`}
                  title={
                    player
                      ? `${player.nombre} ${player.apellido} (#${player.dorsal}) - ${slot.label}`
                      : `${slot.label} (${slot.posicionTag}) - Clic para asignar titular`
                  }
                >
                  {/* Slot Token Circle */}
                  <div
                    className={`relative flex items-center justify-center rounded-full transition-all ${
                      player
                        ? slot.categoria === 'Arquero'
                          ? 'w-9 h-9 sm:w-11 sm:h-11 bg-amber-500 text-slate-950 font-athletic font-extrabold text-xs sm:text-base border-2 border-white shadow-xl'
                          : 'w-9 h-9 sm:w-11 sm:h-11 bg-red-600 text-white font-athletic font-extrabold text-xs sm:text-base border-2 border-white shadow-xl'
                        : 'w-8 h-8 sm:w-10 sm:h-10 bg-black/40 hover:bg-black/60 text-white/70 border-2 border-dashed border-white/60 hover:border-white shadow-md'
                    } ${isActive ? 'ring-4 ring-amber-300 ring-offset-2 ring-offset-emerald-900 scale-110' : ''}`}
                  >
                    {player ? (
                      <span>{player.dorsal}</span>
                    ) : (
                      <span className="text-[10px] sm:text-xs font-mono font-bold">{slot.posicionTag}</span>
                    )}

                    {/* Incidents badges in match view */}
                    {!isInteractive && stat && (
                      <div className="absolute -top-1.5 -right-1.5 flex items-center gap-0.5">
                        {stat.goles > 0 && (
                          <span
                            className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center border border-white shadow-xs"
                            title={`${stat.goles} gol(es)`}
                          >
                            ⚽{stat.goles > 1 ? stat.goles : ''}
                          </span>
                        )}
                        {stat.tarjetasAmarillas > 0 && (
                          <span className="text-[9px]" title="Tarjeta Amarilla">
                            🟨
                          </span>
                        )}
                        {stat.tarjetasRojas > 0 && (
                          <span className="text-[9px]" title="Tarjeta Roja">
                            🟥
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Player Name & Tag Badge */}
                  <div className="mt-1 flex flex-col items-center pointer-events-none">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold max-w-[70px] sm:max-w-[90px] truncate shadow-md ${
                        player
                          ? 'bg-[#031330]/90 text-white border border-blue-400/40'
                          : 'bg-black/60 text-white/80 border border-white/20'
                      }`}
                    >
                      {player ? player.apellido : slot.posicionTag}
                    </span>

                    {/* Minutes or Position detail */}
                    {!isInteractive && stat && (
                      <span className="text-[8px] font-mono font-semibold text-emerald-200 drop-shadow">
                        {stat.minutosJugados}'
                      </span>
                    )}
                    {isInteractive && (
                      <span className="text-[8px] font-mono text-white/70 drop-shadow">
                        {slot.posicionTag}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Slot Player Picker Popover / Modal */}
      {isInteractive && activeSlot && (
        <div
          className={`p-3 rounded-xl border animate-in fade-in duration-150 ${
            isDark ? 'bg-[#031330] border-red-500 shadow-xl' : 'bg-white border-red-500 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-blue-900/60">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                {activeSlot.posicionTag}
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-500">
                  Asignar {activeSlot.label}
                </h4>
                <p className={`text-[10px] ${isDark ? 'text-blue-300/80' : 'text-slate-500'}`}>
                  Posición requerida: <strong>{activeSlot.categoria}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {slotsAssignment[activeSlot.slotId] && (
                <button
                  type="button"
                  onClick={() => handleSelectPlayer(null)}
                  className="px-2 py-1 rounded bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/50 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Quitar de este puesto
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveSlotId(null)}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-blue-900 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search in picker */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="Buscar jugador por nombre, apellido o dorsal..."
              value={slotPickerSearch}
              onChange={(e) => setSlotPickerSearch(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-lg border text-xs ${
                isDark
                  ? 'bg-[#061838] border-blue-900 text-white placeholder-blue-300/50 focus:border-red-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-red-500'
              } outline-none`}
            />
          </div>

          {/* List of eligible players */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
            {availablePlayersForActiveSlot.map((p) => {
              const isCurrentForThisSlot = slotsAssignment[activeSlot.slotId] === p.id;
              const isAssignedElsewhere = Object.entries(slotsAssignment).find(
                ([sId, pId]) => sId !== activeSlot.slotId && pId === p.id
              );
              const matchesCategory = p.posicion === activeSlot.categoria;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPlayer(p.id)}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isCurrentForThisSlot
                      ? 'bg-red-600 text-white border-red-400 shadow-xs'
                      : isDark
                      ? 'bg-[#061838] hover:bg-blue-900/80 text-slate-100 border-blue-900/60'
                      : 'bg-slate-50 hover:bg-blue-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-athletic font-extrabold text-xs w-6 text-center text-red-500 group-hover:text-white">
                      #{p.dorsal}
                    </span>
                    <span className="font-semibold text-xs">
                      {p.nombre} <strong>{p.apellido}</strong>
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded border ${
                        matchesCategory
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : isDark
                          ? 'bg-slate-700 text-slate-300 border-slate-600'
                          : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {p.posicionDetallada || p.posicion}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px]">
                    {isCurrentForThisSlot ? (
                      <span className="flex items-center gap-0.5 font-bold">
                        <Check className="w-3.5 h-3.5" /> Titular aquí
                      </span>
                    ) : isAssignedElsewhere ? (
                      <span className="text-amber-400 italic">Mover de otro slot</span>
                    ) : (
                      <span className={isDark ? 'text-blue-300/70' : 'text-slate-500'}>Seleccionar</span>
                    )}
                  </div>
                </button>
              );
            })}

            {availablePlayersForActiveSlot.length === 0 && (
              <p className={`text-center py-4 text-xs italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No se encontraron jugadores que coincidan con la búsqueda.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
