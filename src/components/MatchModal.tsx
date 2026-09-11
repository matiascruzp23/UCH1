import React, { useState, useEffect } from 'react';
import { Player, Match, MatchPlayerStat, PlayerMatchCondition } from '../types';
import {
  X,
  Calendar,
  Trophy,
  Shield,
  Save,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  AlertCircle,
  LayoutGrid,
  ClipboardList,
  Wand2,
  Trash2,
  Check,
  AlertTriangle,
  Stethoscope,
  Ban
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Campograma } from './Campograma';
import { TACTICAL_FORMATIONS, DEFAULT_FORMATION } from '../utils/tacticalFormations';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMatch: (match: Match, stats: MatchPlayerStat[]) => void;
  players: Player[];
  editingMatch?: Match | null;
  matchToEdit?: Match | null;
  existingStats?: MatchPlayerStat[];
}

interface PlayerLineupDraft {
  jugadorId: string;
  condicion: PlayerMatchCondition;
  minutos: number;
  goles: number;
  asistencias: number;
  amarillas: number;
  rojas: number;
  slotId?: string;
  notas?: string;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  onClose,
  onSaveMatch,
  players,
  editingMatch,
  matchToEdit,
  existingStats = []
}) => {
  const activeMatch = matchToEdit || editingMatch;
  const { isDark } = useTheme();

  // Active sub-tab inside the modal
  const [modalTab, setModalTab] = useState<'campograma' | 'convocatoria'>('campograma');

  // Match Form State
  const [rival, setRival] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [torneo, setTorneo] = useState('Campeonato Nacional');
  const [condicion, setCondicion] = useState<'Local' | 'Visita'>('Local');
  const [golesFavor, setGolesFavor] = useState<number>(2);
  const [golesContra, setGolesContra] = useState<number>(0);
  const [estadio, setEstadio] = useState('Estadio Nacional');
  const [jornada, setJornada] = useState('Fecha 1');
  const [notas, setNotas] = useState('');

  // Tactical formation & pitch slots
  const [formacion, setFormacion] = useState<string>(DEFAULT_FORMATION);
  const [titularesSlots, setTitularesSlots] = useState<Record<string, string>>({});

  // Lineup state for all players
  const [lineup, setLineup] = useState<Record<string, PlayerLineupDraft>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PlayerMatchCondition>('all');

  // Initialize or reset form when modal opens or editingMatch changes
  useEffect(() => {
    if (!isOpen) return;

    if (activeMatch) {
      setRival(activeMatch.rival);
      setFecha(activeMatch.fecha);
      setTorneo(activeMatch.torneo);
      setCondicion(activeMatch.condicion);
      setGolesFavor(activeMatch.golesFavor);
      setGolesContra(activeMatch.golesContra);
      setEstadio(activeMatch.estadio || '');
      setJornada(activeMatch.jornada || '');
      setNotas(activeMatch.notas || '');

      const activeFormacion = activeMatch.formacion || DEFAULT_FORMATION;
      setFormacion(activeFormacion);

      // Load existing stats
      const draft: Record<string, PlayerLineupDraft> = {};
      const loadedSlots: Record<string, string> = { ...(activeMatch.titularesSlots || {}) };

      players.forEach((p) => {
        const found = existingStats.find((s) => s.partidoId === activeMatch.id && s.jugadorId === p.id);
        if (found) {
          // Normalize legacy condition names if needed
          let cond: PlayerMatchCondition = found.condicionJugador;
          if (cond === 'Suplente') {
            cond = found.minutosJugados > 0 ? 'Suplente que ingresa' : 'Suplente que no ingresa';
          } else if (cond === 'No convocado') {
            cond = 'No citado';
          }

          draft[p.id] = {
            jugadorId: p.id,
            condicion: cond,
            minutos: found.minutosJugados,
            goles: found.goles,
            asistencias: found.asistencias,
            amarillas: found.tarjetasAmarillas,
            rojas: found.tarjetasRojas,
            slotId: found.slotId,
            notas: found.notas
          };

          // If found as titular and has slot, register in loadedSlots
          if (cond === 'Titular' && found.slotId) {
            loadedSlots[found.slotId] = p.id;
          }
        } else {
          draft[p.id] = {
            jugadorId: p.id,
            condicion: 'No citado',
            minutos: 0,
            goles: 0,
            asistencias: 0,
            amarillas: 0,
            rojas: 0
          };
        }
      });

      // If activeMatch had no slot mapping but had starters, auto-assign them to formation slots
      const startersWithoutSlots = Object.values(draft).filter((d) => d.condicion === 'Titular');
      const formationDef = TACTICAL_FORMATIONS[activeFormacion] || TACTICAL_FORMATIONS[DEFAULT_FORMATION];

      if (Object.keys(loadedSlots).length === 0 && startersWithoutSlots.length > 0) {
        formationDef.slots.forEach((slot, idx) => {
          if (idx < startersWithoutSlots.length) {
            loadedSlots[slot.slotId] = startersWithoutSlots[idx].jugadorId;
            draft[startersWithoutSlots[idx].jugadorId].slotId = slot.slotId;
          }
        });
      }

      setTitularesSlots(loadedSlots);
      setLineup(draft);
    } else {
      // New match defaults
      setRival('');
      setFecha(new Date().toISOString().split('T')[0]);
      setTorneo('Campeonato Nacional');
      setCondicion('Local');
      setGolesFavor(2);
      setGolesContra(1);
      setEstadio('Estadio Nacional');
      setJornada('');
      setNotas('');
      setFormacion(DEFAULT_FORMATION);

      // Default lineup draft: auto-fill first 11 players into tactical formation
      const formationDef = TACTICAL_FORMATIONS[DEFAULT_FORMATION];
      const newSlots: Record<string, string> = {};
      const draft: Record<string, PlayerLineupDraft> = {};

      // Separate players by category
      const arqueros = players.filter((p) => p.posicion === 'Arquero');
      const defensas = players.filter((p) => p.posicion === 'Defensa');
      const medios = players.filter((p) => p.posicion === 'Mediocampista');
      const delanteros = players.filter((p) => p.posicion === 'Delantero');

      const usedPlayerIds = new Set<string>();

      // Assign slots matching category
      formationDef.slots.forEach((slot) => {
        let pool: Player[] = [];
        if (slot.categoria === 'Arquero') pool = arqueros;
        else if (slot.categoria === 'Defensa') pool = defensas;
        else if (slot.categoria === 'Mediocampista') pool = medios;
        else if (slot.categoria === 'Delantero') pool = delanteros;

        const candidate = pool.find((p) => !usedPlayerIds.has(p.id)) || players.find((p) => !usedPlayerIds.has(p.id));
        if (candidate) {
          usedPlayerIds.add(candidate.id);
          newSlots[slot.slotId] = candidate.id;
        }
      });

      players.forEach((p) => {
        const isStarter = usedPlayerIds.has(p.id);
        const slotKey = Object.entries(newSlots).find(([_, pId]) => pId === p.id)?.[0];

        draft[p.id] = {
          jugadorId: p.id,
          condicion: isStarter ? 'Titular' : 'Suplente que no ingresa',
          minutos: isStarter ? 90 : 0,
          goles: 0,
          asistencias: 0,
          amarillas: 0,
          rojas: 0,
          slotId: slotKey
        };
      });

      setTitularesSlots(newSlots);
      setLineup(draft);
    }
  }, [isOpen, activeMatch, players, existingStats]);

  if (!isOpen) return null;

  // Update draft for a player
  const updatePlayerDraft = (playerId: string, updates: Partial<PlayerLineupDraft>) => {
    setLineup((prev) => {
      const current = prev[playerId] || {
        jugadorId: playerId,
        condicion: 'No citado',
        minutos: 0,
        goles: 0,
        asistencias: 0,
        amarillas: 0,
        rojas: 0
      };
      return {
        ...prev,
        [playerId]: { ...current, ...updates }
      };
    });
  };

  // Change condition for a player
  const handleConditionChange = (playerId: string, newCond: PlayerMatchCondition) => {
    let defaultMins = 0;
    if (newCond === 'Titular') defaultMins = 90;
    else if (newCond === 'Suplente que ingresa') defaultMins = 25;
    else defaultMins = 0;

    // If changing from Titular to something else, remove from pitch slot
    if (newCond !== 'Titular') {
      setTitularesSlots((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((sKey) => {
          if (next[sKey] === playerId) {
            delete next[sKey];
          }
        });
        return next;
      });
      updatePlayerDraft(playerId, {
        condicion: newCond,
        minutos: defaultMins,
        slotId: undefined
      });
    } else {
      // If changed to Titular from outside the campograma, try to find an empty slot
      const currentFormationDef = TACTICAL_FORMATIONS[formacion] || TACTICAL_FORMATIONS[DEFAULT_FORMATION];
      const emptySlot = currentFormationDef.slots.find((s) => !titularesSlots[s.slotId]);
      if (emptySlot) {
        setTitularesSlots((prev) => ({ ...prev, [emptySlot.slotId]: playerId }));
        updatePlayerDraft(playerId, {
          condicion: 'Titular',
          minutos: defaultMins,
          slotId: emptySlot.slotId
        });
      } else {
        updatePlayerDraft(playerId, {
          condicion: 'Titular',
          minutos: defaultMins
        });
      }
    }
  };

  // Handle assigning / unassigning a player to a tactical slot on the campograma
  const handleAssignPlayerToSlot = (slotId: string, newPlayerId: string | null) => {
    const oldPlayerInSlot = titularesSlots[slotId];

    if (!newPlayerId) {
      // Player removed from slot
      if (oldPlayerInSlot) {
        updatePlayerDraft(oldPlayerInSlot, {
          condicion: 'Suplente que no ingresa',
          minutos: 0,
          slotId: undefined
        });
      }
      setTitularesSlots((prev) => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
      return;
    }

    // If this newPlayer was in another slot, clear that slot
    const prevSlotForNewPlayer = Object.entries(titularesSlots).find(([sId, pId]) => pId === newPlayerId)?.[0];

    // If another player was in this slot, mark them as 'Suplente que no ingresa'
    if (oldPlayerInSlot && oldPlayerInSlot !== newPlayerId) {
      updatePlayerDraft(oldPlayerInSlot, {
        condicion: 'Suplente que no ingresa',
        minutos: 0,
        slotId: undefined
      });
    }

    setTitularesSlots((prev) => {
      const next = { ...prev };
      if (prevSlotForNewPlayer && prevSlotForNewPlayer !== slotId) {
        delete next[prevSlotForNewPlayer];
      }
      next[slotId] = newPlayerId;
      return next;
    });

    updatePlayerDraft(newPlayerId, {
      condicion: 'Titular',
      minutos: 90,
      slotId
    });
  };

  // Auto-Fill all 11 slots in the current formation
  const handleAutoFillStarters = () => {
    const currentFormationDef = TACTICAL_FORMATIONS[formacion] || TACTICAL_FORMATIONS[DEFAULT_FORMATION];
    const newSlots: Record<string, string> = {};
    const usedIds = new Set<string>();

    const arqueros = players.filter((p) => p.posicion === 'Arquero');
    const defensas = players.filter((p) => p.posicion === 'Defensa');
    const medios = players.filter((p) => p.posicion === 'Mediocampista');
    const delanteros = players.filter((p) => p.posicion === 'Delantero');

    currentFormationDef.slots.forEach((slot) => {
      let pool: Player[] = [];
      if (slot.categoria === 'Arquero') pool = arqueros;
      else if (slot.categoria === 'Defensa') pool = defensas;
      else if (slot.categoria === 'Mediocampista') pool = medios;
      else if (slot.categoria === 'Delantero') pool = delanteros;

      const candidate = pool.find((p) => !usedIds.has(p.id)) || players.find((p) => !usedIds.has(p.id));
      if (candidate) {
        usedIds.add(candidate.id);
        newSlots[slot.slotId] = candidate.id;
        updatePlayerDraft(candidate.id, {
          condicion: 'Titular',
          minutos: 90,
          slotId: slot.slotId
        });
      }
    });

    // Mark previous starters who are no longer in newSlots as Suplente que no ingresa
    (Object.values(lineup) as PlayerLineupDraft[]).forEach((draft) => {
      if (draft.condicion === 'Titular' && !usedIds.has(draft.jugadorId)) {
        updatePlayerDraft(draft.jugadorId, {
          condicion: 'Suplente que no ingresa',
          minutos: 0,
          slotId: undefined
        });
      }
    });

    setTitularesSlots(newSlots);
  };

  // Clear all starters
  const handleClearStarters = () => {
    (Object.values(titularesSlots) as string[]).forEach((pId) => {
      if (pId) {
        updatePlayerDraft(pId, {
          condicion: 'Suplente que no ingresa',
          minutos: 0,
          slotId: undefined
        });
      }
    });
    setTitularesSlots({});
  };

  // Change formation
  const handleChangeFormation = (newForm: string) => {
    setFormacion(newForm);
    // When changing formation, we adapt existing slots if possible
    const newDef = TACTICAL_FORMATIONS[newForm];
    if (!newDef) return;

    const currentAssignedPlayers = (Object.values(titularesSlots) as string[]).filter(Boolean);
    const adaptedSlots: Record<string, string> = {};

    newDef.slots.forEach((slot, idx) => {
      if (idx < currentAssignedPlayers.length) {
        adaptedSlots[slot.slotId] = currentAssignedPlayers[idx];
        updatePlayerDraft(currentAssignedPlayers[idx], { slotId: slot.slotId });
      }
    });

    setTitularesSlots(adaptedSlots);
  };

  // Quick Action: Mark all unassigned as 'No citado'
  const handleMarkOthersAsNoCitado = () => {
    (Object.values(lineup) as PlayerLineupDraft[]).forEach((d) => {
      if (d.condicion !== 'Titular' && d.condicion !== 'Suplente que ingresa') {
        updatePlayerDraft(d.jugadorId, { condicion: 'No citado', minutos: 0 });
      }
    });
  };

  // Quick Action: Mark all unassigned as 'Suplente que no ingresa'
  const handleMarkOthersAsBanca = () => {
    (Object.values(lineup) as PlayerLineupDraft[]).forEach((d) => {
      if (d.condicion !== 'Titular' && d.condicion !== 'Suplente que ingresa') {
        updatePlayerDraft(d.jugadorId, { condicion: 'Suplente que no ingresa', minutos: 0 });
      }
    });
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rival.trim()) {
      alert('Por favor ingresa el nombre del equipo rival.');
      return;
    }

    const matchId = activeMatch?.id || `match-${Date.now()}`;
    const matchObj: Match = {
      id: matchId,
      rival: rival.trim(),
      fecha,
      torneo,
      condicion,
      golesFavor: Number(golesFavor),
      golesContra: Number(golesContra),
      estadio: estadio.trim() || undefined,
      jornada: jornada.trim() || undefined,
      notas: notas.trim() || undefined,
      formacion,
      titularesSlots
    };

    // Prepare player stats for all squad players
    const statsList: MatchPlayerStat[] = [];
    (Object.values(lineup) as PlayerLineupDraft[]).forEach((draft) => {
      const assignedSlotId = Object.entries(titularesSlots).find(([_, pId]) => pId === draft.jugadorId)?.[0];
      const slotDef = assignedSlotId
        ? TACTICAL_FORMATIONS[formacion]?.slots.find((s) => s.slotId === assignedSlotId)
        : undefined;

      statsList.push({
        id: `stat-${matchId}-${draft.jugadorId}`,
        partidoId: matchId,
        jugadorId: draft.jugadorId,
        condicionJugador: draft.condicion,
        minutosJugados: Number(draft.minutos) || 0,
        goles: Number(draft.goles) || 0,
        asistencias: Number(draft.asistencias) || 0,
        tarjetasAmarillas: Number(draft.amarillas) || 0,
        tarjetasRojas: Number(draft.rojas) || 0,
        slotId: assignedSlotId,
        posicionTactico: slotDef?.posicionTag,
        notas: draft.notas
      });
    });

    onSaveMatch(matchObj, statsList);
    onClose();
  };

  // Calculations for summary pills
  const allDrafts = Object.values(lineup) as PlayerLineupDraft[];
  const countTitulares = allDrafts.filter((l) => l.condicion === 'Titular').length;
  const countSubIngresa = allDrafts.filter((l) => l.condicion === 'Suplente que ingresa').length;
  const countSubNoIngresa = allDrafts.filter((l) => l.condicion === 'Suplente que no ingresa').length;
  const countNoCitados = allDrafts.filter((l) => l.condicion === 'No citado').length;
  const countSuspendidos = allDrafts.filter((l) => l.condicion === 'Suspendido').length;
  const countLesionados = allDrafts.filter((l) => l.condicion === 'Lesionado').length;
  const totalGoalsInLineup = allDrafts.reduce((acc, l) => acc + (l.goles || 0), 0);

  // Filtered players list for the Convocatoria tab
  const filteredPlayers = players.filter((p) => {
    const draft = lineup[p.id];
    if (statusFilter !== 'all' && draft?.condicion !== statusFilter) {
      return false;
    }
    const q = searchTerm.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.apellido.toLowerCase().includes(q) ||
      p.posicion.toLowerCase().includes(q) ||
      p.dorsal.toString().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-match-entry"
        className={`${
          isDark ? 'bg-[#031533] text-white' : 'bg-white text-slate-900'
        } border-2 border-red-600 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] transition-colors`}
      >
        {/* Header */}
        <div
          className={`${
            isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
          } border-b-2 border-red-600 px-5 py-3.5 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center border border-red-400 shadow">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600/30 text-red-200 border border-red-500/40 px-2 py-0.5 rounded">
                Planilla Oficial & Campograma
              </span>
              <h2 className="text-lg sm:text-xl font-black uppercase text-white font-athletic tracking-tight">
                {activeMatch ? 'Editar Registro de Partido' : 'Registrar Partido & Alineación'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-blue-300 hover:text-white p-2 rounded-lg hover:bg-blue-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Main scrollable body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {/* 1. Datos Generales del Partido y Marcador */}
            <div
              className={`p-3.5 rounded-xl border-2 ${
                isDark ? 'bg-[#071d44] border-red-600/60' : 'bg-slate-50 border-slate-200'
              } space-y-3`}
            >
              <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
                <span className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  1. Información del Encuentro & Marcador
                </span>
                <span className={`text-xs font-semibold ${isDark ? 'text-blue-300' : 'text-slate-600'}`}>
                  Club Universidad de Chile
                </span>
              </div>

              {/* Fila 1: Rival, Fecha, Torneo, Condición */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    Rival *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Colo-Colo, Cobresal..."
                    value={rival}
                    onChange={(e) => setRival(e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border ${
                      isDark
                        ? 'bg-[#031330] border-blue-900 text-white focus:border-red-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-red-500'
                    } outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border ${
                      isDark
                        ? 'bg-[#031330] border-blue-900 text-white focus:border-red-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-red-500'
                    } outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    Torneo *
                  </label>
                  <select
                    value={torneo}
                    onChange={(e) => setTorneo(e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border ${
                      isDark
                        ? 'bg-[#031330] border-blue-900 text-white focus:border-red-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-red-500'
                    } outline-none cursor-pointer`}
                  >
                    <option value="Campeonato Nacional">Campeonato Nacional</option>
                    <option value="Copa Chile">Copa Chile</option>
                    <option value="Copa Libertadores">Copa Libertadores</option>
                    <option value="Copa Sudamericana">Copa Sudamericana</option>
                    <option value="Supercopa Chile">Supercopa Chile</option>
                    <option value="Amistoso">Amistoso / Pretemporada</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    Condición *
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setCondicion('Local')}
                      className={`py-1.5 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                        condicion === 'Local'
                          ? 'bg-red-600 text-white border-red-500 shadow'
                          : isDark
                          ? 'bg-[#031330] text-blue-200 border-blue-900'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      Local
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondicion('Visita')}
                      className={`py-1.5 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                        condicion === 'Visita'
                          ? 'bg-red-600 text-white border-red-500 shadow'
                          : isDark
                          ? 'bg-[#031330] text-blue-200 border-blue-900'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      Visita
                    </button>
                  </div>
                </div>
              </div>

              {/* Fila 2: Marcador, Estadio, Jornada */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end pt-1">
                {/* Scoreboard Input */}
                <div
                  className={`p-2 rounded-xl border flex items-center justify-around ${
                    isDark ? 'bg-[#020d24] border-blue-900' : 'bg-white border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="text-center">
                    <span className="block text-[10px] font-bold uppercase text-red-500">U. de Chile</span>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={golesFavor}
                      onChange={(e) => setGolesFavor(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-14 text-center text-xl font-athletic font-extrabold bg-transparent outline-none text-white border-b-2 border-red-500"
                    />
                  </div>

                  <span className="text-lg font-bold text-slate-400">-</span>

                  <div className="text-center">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      {rival || 'Rival'}
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={golesContra}
                      onChange={(e) => setGolesContra(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-14 text-center text-xl font-athletic font-extrabold bg-transparent outline-none text-white border-b-2 border-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    Estadio
                  </label>
                  <input
                    type="text"
                    placeholder="Estadio Nacional, Santa Laura..."
                    value={estadio}
                    onChange={(e) => setEstadio(e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border ${
                      isDark
                        ? 'bg-[#031330] border-blue-900 text-white focus:border-red-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-red-500'
                    } outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    Jornada / Fase
                  </label>
                  <input
                    type="text"
                    placeholder="Fecha 1, Cuartos de Final..."
                    value={jornada}
                    onChange={(e) => setJornada(e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border ${
                      isDark
                        ? 'bg-[#031330] border-blue-900 text-white focus:border-red-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-red-500'
                    } outline-none`}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Tabs between Campograma and Full Squad */}
            <div className="flex items-center justify-between border-b pb-2 border-slate-700/50 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalTab('campograma')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    modalTab === 'campograma'
                      ? 'bg-red-600 text-white shadow-md'
                      : isDark
                      ? 'bg-[#031330] text-blue-200 hover:bg-blue-900/60 border border-blue-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Campograma (11 Titulares)</span>
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      countTitulares === 11 ? 'bg-emerald-500/30 text-emerald-300' : 'bg-red-900/40 text-red-300'
                    }`}
                  >
                    {countTitulares}/11
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab('convocatoria')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    modalTab === 'convocatoria'
                      ? 'bg-red-600 text-white shadow-md'
                      : isDark
                      ? 'bg-[#031330] text-blue-200 hover:bg-blue-900/60 border border-blue-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Convocatoria & Estadísticas</span>
                  <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-900/40 text-blue-300">
                    {players.length}
                  </span>
                </button>
              </div>

              {/* Status Counters Badge Bar */}
              <div className="flex items-center gap-1 flex-wrap text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                  Titulares: {countTitulares}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold">
                  Ingresan: {countSubIngresa}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-600/20 text-slate-300 border border-slate-500/40 font-semibold">
                  Banca: {countSubNoIngresa}
                </span>
                {countNoCitados > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-zinc-600/20 text-zinc-300 border border-zinc-500/40 font-semibold">
                    No citados: {countNoCitados}
                  </span>
                )}
                {countSuspendidos > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-600/20 text-amber-300 border border-amber-500/40 font-semibold">
                    Suspendidos: {countSuspendidos}
                  </span>
                )}
                {countLesionados > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-600/20 text-rose-300 border border-rose-500/40 font-semibold">
                    Lesionados: {countLesionados}
                  </span>
                )}
              </div>
            </div>

            {/* TAB 1: CAMPOGRAMA */}
            {modalTab === 'campograma' && (
              <div className="space-y-4">
                <Campograma
                  formation={formacion}
                  onChangeFormation={handleChangeFormation}
                  slotsAssignment={titularesSlots}
                  onAssignPlayerToSlot={handleAssignPlayerToSlot}
                  players={players}
                  isInteractive={true}
                  onAutoFillStarters={handleAutoFillStarters}
                  onClearStarters={handleClearStarters}
                />

                {/* Table of Starters currently positioned with quick stat inputs */}
                <div
                  className={`p-3.5 rounded-xl border ${
                    isDark ? 'bg-[#071d44] border-blue-900/80' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-2 flex items-center justify-between">
                    <span>Lista de Titulares en Cancha ({countTitulares}/11)</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Ajusta minutos jugados (90' por defecto) o goles si corresponde
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {TACTICAL_FORMATIONS[formacion]?.slots.map((slot) => {
                      const pId = titularesSlots[slot.slotId];
                      const player = pId ? players.find((p) => p.id === pId) : undefined;
                      const draft = pId ? lineup[pId] : undefined;

                      if (!player || !draft) {
                        return (
                          <div
                            key={slot.slotId}
                            className={`p-2 rounded-lg border border-dashed flex items-center justify-between text-xs ${
                              isDark ? 'bg-[#031330]/50 border-slate-700 text-slate-500' : 'bg-white border-slate-300 text-slate-400'
                            }`}
                          >
                            <span className="font-mono font-bold">[{slot.posicionTag}] {slot.label}</span>
                            <span className="italic text-[11px]">Sin asignar</span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={slot.slotId}
                          className={`p-2 rounded-lg border flex items-center justify-between gap-2 text-xs transition-colors ${
                            isDark ? 'bg-[#031330] border-blue-900/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded bg-red-600 text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                              {slot.posicionTag}
                            </span>
                            <span className="font-athletic font-bold text-red-500">#{player.dorsal}</span>
                            <span className="font-semibold truncate">
                              {player.nombre} {player.apellido}
                            </span>
                          </div>

                          {/* Quick inputs for starter: Minutos, Goles, Tarjetas */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1" title="Minutos jugados">
                              <span className="text-[10px] text-slate-400">Min:</span>
                              <input
                                type="number"
                                min={1}
                                max={120}
                                value={draft.minutos}
                                onChange={(e) =>
                                  updatePlayerDraft(player.id, {
                                    minutos: Math.max(0, parseInt(e.target.value) || 0)
                                  })
                                }
                                className="w-11 px-1 py-0.5 text-center text-xs font-bold rounded bg-black/20 border border-slate-600 outline-none"
                              />
                            </div>

                            <div className="flex items-center gap-1" title="Goles">
                              <span className="text-xs">⚽</span>
                              <input
                                type="number"
                                min={0}
                                max={10}
                                value={draft.goles}
                                onChange={(e) =>
                                  updatePlayerDraft(player.id, {
                                    goles: Math.max(0, parseInt(e.target.value) || 0)
                                  })
                                }
                                className="w-9 px-1 py-0.5 text-center text-xs font-bold rounded bg-black/20 border border-slate-600 outline-none"
                              />
                            </div>

                            {/* Yellow card button */}
                            <button
                              type="button"
                              onClick={() =>
                                updatePlayerDraft(player.id, {
                                  amarillas: draft.amarillas === 1 ? 0 : 1
                                })
                              }
                              className={`px-1.5 py-0.5 rounded text-[11px] border cursor-pointer ${
                                draft.amarillas > 0
                                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-300'
                                  : 'opacity-40 hover:opacity-100'
                              }`}
                              title="Tarjeta Amarilla"
                            >
                              🟨
                            </button>

                            {/* Red card button */}
                            <button
                              type="button"
                              onClick={() =>
                                updatePlayerDraft(player.id, {
                                  rojas: draft.rojas === 1 ? 0 : 1
                                })
                              }
                              className={`px-1.5 py-0.5 rounded text-[11px] border cursor-pointer ${
                                draft.rojas > 0
                                  ? 'bg-red-600 text-white font-bold border-red-400'
                                  : 'opacity-40 hover:opacity-100'
                              }`}
                              title="Tarjeta Roja"
                            >
                              🟥
                            </button>

                            {/* Remove from slot */}
                            <button
                              type="button"
                              onClick={() => handleAssignPlayerToSlot(slot.slotId, null)}
                              className="text-slate-400 hover:text-red-400 p-0.5 cursor-pointer"
                              title="Quitar titular del campograma"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONVOCATORIA & STATS */}
            {modalTab === 'convocatoria' && (
              <div className="space-y-3">
                {/* Search & Condition Filter Pills */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <input
                    type="text"
                    placeholder="Filtrar jugadores por nombre, apellido o dorsal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full sm:w-72 px-3 py-1.5 text-xs rounded-lg border ${
                      isDark
                        ? 'bg-[#031330] border-blue-900 text-white focus:border-red-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-red-500'
                    } outline-none`}
                  />

                  {/* Batch actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={handleMarkOthersAsBanca}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-[#031330] hover:bg-blue-900 text-blue-200 border-blue-900'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                      title="Marcar el resto de los jugadores como suplentes que no ingresan"
                    >
                      Resto a Banca
                    </button>
                    <button
                      type="button"
                      onClick={handleMarkOthersAsNoCitado}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-[#031330] hover:bg-slate-800 text-slate-300 border-blue-900'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                      title="Marcar el resto de los jugadores como No citados"
                    >
                      Resto No Citados
                    </button>
                  </div>
                </div>

                {/* Condition Filter Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === 'all'
                        ? 'bg-red-600 text-white shadow-xs'
                        : isDark
                        ? 'bg-[#031330] text-blue-200 border border-blue-900'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    Todos ({players.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('Titular')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === 'Titular'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isDark
                        ? 'bg-[#031330] text-emerald-300 border border-emerald-500/40'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    🟢 Titulares ({countTitulares})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('Suplente que ingresa')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === 'Suplente que ingresa'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isDark
                        ? 'bg-[#031330] text-blue-300 border border-blue-500/40'
                        : 'bg-blue-50 text-blue-800 border border-blue-300'
                    }`}
                  >
                    🔵 Suplentes que ingresan ({countSubIngresa})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('Suplente que no ingresa')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === 'Suplente que no ingresa'
                        ? 'bg-slate-600 text-white shadow-xs'
                        : isDark
                        ? 'bg-[#031330] text-slate-300 border border-slate-600'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    ⚪ Banca sin minutos ({countSubNoIngresa})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('No citado')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === 'No citado'
                        ? 'bg-zinc-700 text-white shadow-xs'
                        : isDark
                        ? 'bg-[#031330] text-zinc-300 border border-zinc-600'
                        : 'bg-zinc-100 text-zinc-700 border border-zinc-300'
                    }`}
                  >
                    🔘 No citados ({countNoCitados})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('Suspendido')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === 'Suspendido'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : isDark
                        ? 'bg-[#031330] text-amber-300 border border-amber-600/50'
                        : 'bg-amber-50 text-amber-800 border border-amber-300'
                    }`}
                  >
                    🟡 Suspendidos ({countSuspendidos})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('Lesionado')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === 'Lesionado'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : isDark
                        ? 'bg-[#031330] text-rose-300 border border-rose-600/50'
                        : 'bg-rose-50 text-rose-800 border border-rose-300'
                    }`}
                  >
                    🔴 Lesionados ({countLesionados})
                  </button>
                </div>

                {/* Players List with Condition Selectors */}
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {filteredPlayers.map((player) => {
                    const draft = lineup[player.id] || {
                      jugadorId: player.id,
                      condicion: 'No citado',
                      minutos: 0,
                      goles: 0,
                      asistencias: 0,
                      amarillas: 0,
                      rojas: 0
                    };

                    const isPlaying = draft.condicion === 'Titular' || draft.condicion === 'Suplente que ingresa';

                    return (
                      <div
                        key={player.id}
                        className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
                          draft.condicion === 'Titular'
                            ? isDark
                              ? 'bg-emerald-950/20 border-emerald-600/50'
                              : 'bg-emerald-50/50 border-emerald-300'
                            : draft.condicion === 'Suplente que ingresa'
                            ? isDark
                              ? 'bg-blue-950/20 border-blue-600/50'
                              : 'bg-blue-50/50 border-blue-300'
                            : draft.condicion === 'Suspendido'
                            ? isDark
                              ? 'bg-amber-950/20 border-amber-600/40'
                              : 'bg-amber-50/40 border-amber-300'
                            : draft.condicion === 'Lesionado'
                            ? isDark
                              ? 'bg-rose-950/20 border-rose-600/40'
                              : 'bg-rose-50/40 border-rose-300'
                            : isDark
                            ? 'bg-[#071d44] border-blue-900/60'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        {/* Player Basic Info */}
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <span className="w-8 h-8 rounded-full bg-red-600 text-white font-athletic font-extrabold text-sm flex items-center justify-center border border-red-400 shrink-0 shadow-xs">
                            #{player.dorsal}
                          </span>
                          <div>
                            <span className="font-bold text-sm block leading-tight">
                              {player.nombre} {player.apellido}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {player.posicionDetallada || player.posicion}
                            </span>
                          </div>
                        </div>

                        {/* Condition Selector Pills */}
                        <div className="flex items-center gap-1 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleConditionChange(player.id, 'Titular')}
                            className={`px-2 py-1 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                              draft.condicion === 'Titular'
                                ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                                : isDark
                                ? 'bg-[#031330] text-emerald-300 border-emerald-800 hover:bg-emerald-950'
                                : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            🟢 Titular
                          </button>

                          <button
                            type="button"
                            onClick={() => handleConditionChange(player.id, 'Suplente que ingresa')}
                            className={`px-2 py-1 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                              draft.condicion === 'Suplente que ingresa'
                                ? 'bg-blue-600 text-white border-blue-400 shadow-xs'
                                : isDark
                                ? 'bg-[#031330] text-blue-300 border-blue-800 hover:bg-blue-950'
                                : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-50'
                            }`}
                          >
                            🔵 Entra (Minutos)
                          </button>

                          <button
                            type="button"
                            onClick={() => handleConditionChange(player.id, 'Suplente que no ingresa')}
                            className={`px-2 py-1 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                              draft.condicion === 'Suplente que no ingresa'
                                ? 'bg-slate-600 text-white border-slate-400 shadow-xs'
                                : isDark
                                ? 'bg-[#031330] text-slate-300 border-slate-700 hover:bg-slate-900'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            ⚪ Banca (0')
                          </button>

                          <button
                            type="button"
                            onClick={() => handleConditionChange(player.id, 'No citado')}
                            className={`px-2 py-1 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                              draft.condicion === 'No citado'
                                ? 'bg-zinc-700 text-white border-zinc-500 shadow-xs'
                                : isDark
                                ? 'bg-[#031330] text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                            }`}
                          >
                            🔘 No citado
                          </button>

                          <button
                            type="button"
                            onClick={() => handleConditionChange(player.id, 'Suspendido')}
                            className={`px-2 py-1 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                              draft.condicion === 'Suspendido'
                                ? 'bg-amber-600 text-white border-amber-400 shadow-xs'
                                : isDark
                                ? 'bg-[#031330] text-amber-400 border-amber-800 hover:bg-amber-950'
                                : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
                            }`}
                          >
                            🟡 Suspendido
                          </button>

                          <button
                            type="button"
                            onClick={() => handleConditionChange(player.id, 'Lesionado')}
                            className={`px-2 py-1 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                              draft.condicion === 'Lesionado'
                                ? 'bg-rose-600 text-white border-rose-400 shadow-xs'
                                : isDark
                                ? 'bg-[#031330] text-rose-400 border-rose-800 hover:bg-rose-950'
                                : 'bg-white text-rose-800 border-rose-200 hover:bg-rose-50'
                            }`}
                          >
                            🔴 Lesionado
                          </button>
                        </div>

                        {/* Stats Inputs if Playing (Titular or Suplente que ingresa) */}
                        {isPlaying ? (
                          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                            {/* Minutos */}
                            <div className="flex items-center gap-1" title="Minutos jugados">
                              <span className="text-[11px] text-slate-400">Min:</span>
                              <input
                                type="number"
                                min={0}
                                max={120}
                                value={draft.minutos}
                                onChange={(e) =>
                                  updatePlayerDraft(player.id, {
                                    minutos: Math.max(0, parseInt(e.target.value) || 0)
                                  })
                                }
                                className="w-12 px-1.5 py-1 text-center text-xs font-bold rounded bg-black/20 border border-slate-600 outline-none"
                              />
                            </div>

                            {/* Goles */}
                            <div className="flex items-center gap-1" title="Goles anotados">
                              <span className="text-xs">⚽</span>
                              <input
                                type="number"
                                min={0}
                                max={10}
                                value={draft.goles}
                                onChange={(e) =>
                                  updatePlayerDraft(player.id, {
                                    goles: Math.max(0, parseInt(e.target.value) || 0)
                                  })
                                }
                                className="w-10 px-1.5 py-1 text-center text-xs font-bold rounded bg-black/20 border border-slate-600 outline-none"
                              />
                            </div>

                            {/* Asistencias */}
                            <div className="flex items-center gap-1" title="Asistencias">
                              <span className="text-xs">🅰️</span>
                              <input
                                type="number"
                                min={0}
                                max={10}
                                value={draft.asistencias}
                                onChange={(e) =>
                                  updatePlayerDraft(player.id, {
                                    asistencias: Math.max(0, parseInt(e.target.value) || 0)
                                  })
                                }
                                className="w-10 px-1.5 py-1 text-center text-xs font-bold rounded bg-black/20 border border-slate-600 outline-none"
                              />
                            </div>

                            {/* Tarjetas */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updatePlayerDraft(player.id, {
                                    amarillas: draft.amarillas === 1 ? 0 : 1
                                  })
                                }
                                className={`px-1.5 py-0.5 rounded text-xs border cursor-pointer ${
                                  draft.amarillas > 0
                                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-300'
                                    : 'opacity-40 hover:opacity-100'
                                }`}
                                title="Tarjeta Amarilla"
                              >
                                🟨
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updatePlayerDraft(player.id, {
                                    rojas: draft.rojas === 1 ? 0 : 1
                                  })
                                }
                                className={`px-1.5 py-0.5 rounded text-xs border cursor-pointer ${
                                  draft.rojas > 0
                                    ? 'bg-red-600 text-white font-bold border-red-400'
                                    : 'opacity-40 hover:opacity-100'
                                }`}
                                title="Tarjeta Roja"
                              >
                                🟥
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] italic text-slate-400">
                            {draft.condicion === 'Suplente que no ingresa' && 'Disponible en banca (0 minutos)'}
                            {draft.condicion === 'No citado' && 'No convocado para este partido'}
                            {draft.condicion === 'Suspendido' && 'Baja por sanción / suspensión'}
                            {draft.condicion === 'Lesionado' && 'Baja por lesión / parte médico'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Match Notas */}
            <div
              className={`p-3 rounded-xl border ${
                isDark ? 'bg-[#071d44] border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                Observaciones del Partido / Aspectos Tácticos
              </label>
              <textarea
                rows={2}
                placeholder="Notas sobre el funcionamiento, variantes tácticas, balón parado o incidencias..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className={`w-full px-3 py-1.5 text-xs rounded-lg border ${
                  isDark
                    ? 'bg-[#031330] border-blue-900 text-white focus:border-red-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-red-500'
                } outline-none resize-none`}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className={`px-5 py-3.5 border-t-2 border-red-600 flex items-center justify-between gap-3 ${
              isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`px-2.5 py-1 rounded font-bold border ${
                  countTitulares === 11
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-400'
                    : 'bg-red-600/30 text-red-300 border-red-400'
                }`}
              >
                Titulares: {countTitulares}/11
              </span>
              {totalGoalsInLineup > 0 && (
                <span className="text-white/80 hidden sm:inline">
                  ⚽ Goles registrados: <strong>{totalGoalsInLineup}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#031330] hover:bg-slate-800 text-slate-300 border-blue-900'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                Cancelar
              </button>

              <button
                type="submit"
                id="btn-guardar-partido"
                className="px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer border border-red-400"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Planilla y Campograma</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
