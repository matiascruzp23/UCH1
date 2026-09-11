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
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  condicion: PlayerMatchCondition | 'No Convocado';
  minutos: number;
  goles: number;
  asistencias: number;
  amarillas: number;
  rojas: number;
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

  // Lineup state for all players
  const [lineup, setLineup] = useState<Record<string, PlayerLineupDraft>>({});
  const [searchTerm, setSearchTerm] = useState('');

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

      // Load existing stats
      const draft: Record<string, PlayerLineupDraft> = {};
      players.forEach((p) => {
        const found = existingStats.find((s) => s.partidoId === activeMatch.id && s.jugadorId === p.id);
        if (found) {
          draft[p.id] = {
            jugadorId: p.id,
            condicion: found.condicionJugador,
            minutos: found.minutosJugados,
            goles: found.goles,
            asistencias: found.asistencias,
            amarillas: found.tarjetasAmarillas,
            rojas: found.tarjetasRojas
          };
        } else {
          draft[p.id] = {
            jugadorId: p.id,
            condicion: 'No Convocado',
            minutos: 0,
            goles: 0,
            asistencias: 0,
            amarillas: 0,
            rojas: 0
          };
        }
      });
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

      // Default lineup draft: first 11 as starters (or default all to Titular / No convocado)
      const draft: Record<string, PlayerLineupDraft> = {};
      players.forEach((p, idx) => {
        if (idx < 11) {
          draft[p.id] = {
            jugadorId: p.id,
            condicion: 'Titular',
            minutos: 90,
            goles: 0,
            asistencias: 0,
            amarillas: 0,
            rojas: 0
          };
        } else {
          draft[p.id] = {
            jugadorId: p.id,
            condicion: 'Suplente',
            minutos: 0,
            goles: 0,
            asistencias: 0,
            amarillas: 0,
            rojas: 0
          };
        }
      });
      setLineup(draft);
    }
  }, [isOpen, editingMatch, players, existingStats]);

  if (!isOpen) return null;

  const updatePlayerDraft = (playerId: string, updates: Partial<PlayerLineupDraft>) => {
    setLineup((prev) => {
      const current = prev[playerId] || {
        jugadorId: playerId,
        condicion: 'No Convocado',
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

  const handleConditionChange = (playerId: string, newCond: PlayerMatchCondition | 'No Convocado') => {
    let defaultMins = 0;
    if (newCond === 'Titular') defaultMins = 90;
    if (newCond === 'Suplente') defaultMins = 20;

    updatePlayerDraft(playerId, {
      condicion: newCond,
      minutos: defaultMins
    });
  };

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
      notas: notas.trim() || undefined
    };

    // Prepare player stats for those who were Titular or Suplente
    const statsList: MatchPlayerStat[] = [];
    (Object.values(lineup) as PlayerLineupDraft[]).forEach((draft) => {
      if (draft.condicion === 'Titular' || draft.condicion === 'Suplente') {
        statsList.push({
          id: `stat-${matchId}-${draft.jugadorId}`,
          partidoId: matchId,
          jugadorId: draft.jugadorId,
          condicionJugador: draft.condicion,
          minutosJugados: Number(draft.minutos) || 0,
          goles: Number(draft.goles) || 0,
          asistencias: Number(draft.asistencias) || 0,
          tarjetasAmarillas: Number(draft.amarillas) || 0,
          tarjetasRojas: Number(draft.rojas) || 0
        });
      }
    });

    onSaveMatch(matchObj, statsList);
    onClose();
  };

  // Filtered players list
  const filteredPlayers = players.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.apellido.toLowerCase().includes(q) ||
      p.posicion.toLowerCase().includes(q) ||
      p.dorsal.toString().includes(q)
    );
  });

  const allDrafts = Object.values(lineup) as PlayerLineupDraft[];
  const countTitulares = allDrafts.filter((l) => l.condicion === 'Titular').length;
  const countSuplentes = allDrafts.filter((l) => l.condicion === 'Suplente').length;
  const totalGoalsInLineup = allDrafts.reduce((acc, l) => acc + (l.goles || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-match-entry"
        className={`${
          isDark ? 'bg-[#031533] text-white' : 'bg-white text-slate-900'
        } border-2 border-red-600 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] transition-colors`}
      >
        {/* Header */}
        <div
          className={`${
            isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
          } border-b-2 border-red-600 px-6 py-4 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center border border-red-400 shadow">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-red-600/30 text-red-200 border border-red-500/40 px-2 py-0.5 rounded">
                Planilla Oficial de Partido
              </span>
              <h2 className="text-xl font-black uppercase text-white font-athletic tracking-tight">
                {editingMatch ? 'Editar Partido y Rendimiento' : 'Registrar Nuevo Partido y Minutos'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white p-2 rounded-lg hover:bg-blue-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* 1. Datos del Partido y Marcador */}
            <div
              className={`p-4 rounded-xl border-2 ${
                isDark ? 'bg-[#071d44] border-red-600/60' : 'bg-slate-50 border-slate-200'
              } space-y-4`}
            >
              <div className="flex items-center justify-between border-b pb-2 border-slate-700/40">
                <span className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  1. Información del Encuentro & Marcador
                </span>
                <span className={`text-xs ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>
                  U. de Chile vs Rival
                </span>
              </div>

              {/* Fila 1: Rival, Fecha, Torneo, Condición */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    Rival *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Colo-Colo, Cobreloa..."
                    value={rival}
                    onChange={(e) => setRival(e.target.value)}
                    className={`w-full p-2 text-xs rounded-lg border ${
                      isDark
                        ? 'bg-[#020d24] text-white border-blue-800'
                        : 'bg-white text-slate-900 border-slate-300'
                    } focus:border-red-500 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className={`w-full p-2 text-xs rounded-lg border font-mono ${
                      isDark
                        ? 'bg-[#020d24] text-white border-blue-800'
                        : 'bg-white text-slate-900 border-slate-300'
                    } focus:border-red-500 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    Torneo
                  </label>
                  <select
                    value={torneo}
                    onChange={(e) => setTorneo(e.target.value)}
                    className={`w-full p-2 text-xs rounded-lg border ${
                      isDark
                        ? 'bg-[#020d24] text-white border-blue-800'
                        : 'bg-white text-slate-900 border-slate-300'
                    } focus:border-red-500 focus:outline-none cursor-pointer`}
                  >
                    <option value="Campeonato Nacional">Campeonato Nacional</option>
                    <option value="Copa Chile">Copa Chile</option>
                    <option value="Copa Libertadores">Copa Libertadores</option>
                    <option value="Copa Sudamericana">Copa Sudamericana</option>
                    <option value="Supercopa de Chile">Supercopa de Chile</option>
                    <option value="Amistoso Formal">Amistoso Formal</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    Condición
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCondicion('Local');
                        if (!estadio || estadio === 'Estadio Rival') setEstadio('Estadio Nacional');
                      }}
                      className={`py-2 text-xs font-bold uppercase rounded-lg border cursor-pointer transition-colors ${
                        condicion === 'Local'
                          ? 'bg-red-600 text-white border-red-400 shadow'
                          : isDark
                            ? 'bg-[#020d24] text-blue-200 border-blue-900'
                            : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      Local
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondicion('Visita')}
                      className={`py-2 text-xs font-bold uppercase rounded-lg border cursor-pointer transition-colors ${
                        condicion === 'Visita'
                          ? 'bg-red-600 text-white border-red-400 shadow'
                          : isDark
                            ? 'bg-[#020d24] text-blue-200 border-blue-900'
                            : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      Visita
                    </button>
                  </div>
                </div>
              </div>

              {/* Fila 2: Marcador (Goles Favor vs Contra), Estadio, Jornada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
                {/* Marcador */}
                <div
                  className={`col-span-1 sm:col-span-2 p-3 rounded-xl border flex items-center justify-around ${
                    isDark ? 'bg-[#020d24] border-red-600/60' : 'bg-white border-red-300 shadow-2xs'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-[11px] font-bold uppercase block text-blue-400">
                      U. de Chile
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={golesFavor}
                      onChange={(e) => setGolesFavor(parseInt(e.target.value) || 0)}
                      className="font-athletic text-3xl font-black w-14 text-center bg-transparent text-white border-b-2 border-red-500 focus:outline-none"
                    />
                  </div>

                  <span className="font-athletic text-2xl font-black text-slate-500">VS</span>

                  <div className="text-center">
                    <span className="text-[11px] font-bold uppercase block text-slate-400 truncate max-w-[100px]">
                      {rival || 'Rival'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={golesContra}
                      onChange={(e) => setGolesContra(parseInt(e.target.value) || 0)}
                      className="font-athletic text-3xl font-black w-14 text-center bg-transparent text-white border-b-2 border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    Estadio
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Estadio Nacional"
                    value={estadio}
                    onChange={(e) => setEstadio(e.target.value)}
                    className={`w-full p-2 text-xs rounded-lg border ${
                      isDark
                        ? 'bg-[#020d24] text-white border-blue-800'
                        : 'bg-white text-slate-900 border-slate-300'
                    } focus:border-red-500 focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                    Jornada / Fase
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Fecha 1, Cuartos"
                    value={jornada}
                    onChange={(e) => setJornada(e.target.value)}
                    className={`w-full p-2 text-xs rounded-lg border ${
                      isDark
                        ? 'bg-[#020d24] text-white border-blue-800'
                        : 'bg-white text-slate-900 border-slate-300'
                    } focus:border-red-500 focus:outline-none`}
                  />
                </div>
              </div>

              {/* Notas del Partido */}
              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>
                  Comentarios / Crónica del Partido
                </label>
                <input
                  type="text"
                  placeholder="Resumen del planteamiento táctico, incidentes o figuras destacadas..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className={`w-full p-2 text-xs rounded-lg border ${
                    isDark
                      ? 'bg-[#020d24] text-white border-blue-800'
                      : 'bg-white text-slate-900 border-slate-300'
                  } focus:border-red-500 focus:outline-none`}
                />
              </div>
            </div>

            {/* 2. Plantilla de Jugadores: Titulares, Suplentes, Minutos y Estadísticas */}
            <div
              className={`p-4 rounded-xl border-2 ${
                isDark ? 'bg-[#071d44] border-red-600/60' : 'bg-slate-50 border-slate-200'
              } space-y-3`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-700/40">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    2. Jugadores, Minutos, Goles y Tarjetas
                  </span>
                  <p className={`text-[11px] ${isDark ? 'text-blue-200' : 'text-slate-500'}`}>
                    Asigna quiénes jugaron como titulares (con sus minutos), suplentes y registra sus incidencias
                  </p>
                </div>

                {/* Badges de control */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-600/30 text-emerald-400 border border-emerald-500/50">
                    Titulares: {countTitulares} / 11
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/50">
                    Suplentes: {countSuplentes}
                  </span>
                  {totalGoalsInLineup !== golesFavor && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-600/30 text-red-300 border border-red-500/50 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      Goles plantel ({totalGoalsInLineup}) ≠ Goles U ({golesFavor})
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Search */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar jugador por nombre, apellido o dorsal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full p-2 text-xs rounded-lg border ${
                    isDark
                      ? 'bg-[#020d24] text-white border-blue-900'
                      : 'bg-white text-slate-900 border-slate-300'
                  } focus:border-red-500 focus:outline-none`}
                />
              </div>

              {/* Player Row Cards */}
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {filteredPlayers.map((player) => {
                  const draft = lineup[player.id] || {
                    jugadorId: player.id,
                    condicion: 'No Convocado',
                    minutos: 0,
                    goles: 0,
                    asistencias: 0,
                    amarillas: 0,
                    rojas: 0
                  };

                  const isPlaying = draft.condicion === 'Titular' || draft.condicion === 'Suplente';

                  return (
                    <div
                      key={player.id}
                      className={`p-3 rounded-xl border transition-all ${
                        draft.condicion === 'Titular'
                          ? isDark
                            ? 'bg-[#001744] border-emerald-500/60 shadow-xs'
                            : 'bg-emerald-50/50 border-emerald-300'
                          : draft.condicion === 'Suplente'
                            ? isDark
                              ? 'bg-[#021133] border-amber-500/60'
                              : 'bg-amber-50/50 border-amber-300'
                            : isDark
                              ? 'bg-[#020d24]/60 border-slate-800 opacity-70'
                              : 'bg-white border-slate-200 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Player Basic Info */}
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-athletic font-extrabold text-base flex items-center justify-center flex-shrink-0">
                            {player.dorsal}
                          </div>
                          <div>
                            <span className="font-bold text-xs uppercase tracking-tight block">
                              {player.nombre} {player.apellido}
                            </span>
                            <span className="text-[10px] text-slate-400">{player.posicion}</span>
                          </div>
                        </div>

                        {/* Condition Selector: Titular / Suplente / No Convocado */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleConditionChange(player.id, 'Titular')}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                              draft.condicion === 'Titular'
                                ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                                : isDark
                                  ? 'bg-[#020d24] text-slate-400 border-slate-700 hover:text-white'
                                  : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
                            }`}
                          >
                            Titular
                          </button>

                          <button
                            type="button"
                            onClick={() => handleConditionChange(player.id, 'Suplente')}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                              draft.condicion === 'Suplente'
                                ? 'bg-amber-500 text-white border-amber-400 shadow'
                                : isDark
                                  ? 'bg-[#020d24] text-slate-400 border-slate-700 hover:text-white'
                                  : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
                            }`}
                          >
                            Suplente
                          </button>

                          <button
                            type="button"
                            onClick={() => handleConditionChange(player.id, 'No Convocado')}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                              draft.condicion === 'No Convocado'
                                ? 'bg-slate-700 text-white border-slate-500'
                                : isDark
                                  ? 'bg-[#020d24] text-slate-400 border-slate-700'
                                  : 'bg-white text-slate-600 border-slate-300'
                            }`}
                          >
                            No Juega
                          </button>
                        </div>

                        {/* Match Stats Inputs if playing */}
                        {isPlaying ? (
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            {/* Minutos */}
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Min:</span>
                              <input
                                type="number"
                                min="0"
                                max="120"
                                value={draft.minutos}
                                onChange={(e) =>
                                  updatePlayerDraft(player.id, {
                                    minutos: parseInt(e.target.value) || 0
                                  })
                                }
                                className={`w-14 p-1 text-center font-bold text-xs rounded border ${
                                  isDark
                                    ? 'bg-[#020d24] text-white border-blue-800'
                                    : 'bg-white text-slate-900 border-slate-300'
                                } focus:border-red-500 focus:outline-none`}
                              />
                            </div>

                            {/* Goles */}
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Gol:</span>
                              <div className="flex items-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updatePlayerDraft(player.id, {
                                      goles: Math.max(0, draft.goles - 1)
                                    })
                                  }
                                  className="w-5 h-6 bg-slate-700 text-white rounded-l flex items-center justify-center hover:bg-slate-600 cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center font-athletic font-bold text-sm bg-red-600 text-white">
                                  {draft.goles}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updatePlayerDraft(player.id, {
                                      goles: draft.goles + 1
                                    })
                                  }
                                  className="w-5 h-6 bg-slate-700 text-white rounded-r flex items-center justify-center hover:bg-slate-600 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Asistencias */}
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Asis:</span>
                              <div className="flex items-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updatePlayerDraft(player.id, {
                                      asistencias: Math.max(0, draft.asistencias - 1)
                                    })
                                  }
                                  className="w-5 h-6 bg-slate-700 text-white rounded-l flex items-center justify-center hover:bg-slate-600 cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center font-athletic font-bold text-sm bg-blue-600 text-white">
                                  {draft.asistencias}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updatePlayerDraft(player.id, {
                                      asistencias: draft.asistencias + 1
                                    })
                                  }
                                  className="w-5 h-6 bg-slate-700 text-white rounded-r flex items-center justify-center hover:bg-slate-600 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Tarjeta Amarilla */}
                            <button
                              type="button"
                              title="Tarjeta Amarilla"
                              onClick={() =>
                                updatePlayerDraft(player.id, {
                                  amarillas: (draft.amarillas + 1) % 3
                                })
                              }
                              className={`px-2 py-0.5 rounded text-xs font-bold border cursor-pointer transition-colors ${
                                draft.amarillas > 0
                                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                                  : isDark
                                    ? 'bg-[#020d24] text-slate-500 border-slate-700'
                                    : 'bg-white text-slate-400 border-slate-300'
                              }`}
                            >
                              🟨 {draft.amarillas}
                            </button>

                            {/* Tarjeta Roja */}
                            <button
                              type="button"
                              title="Tarjeta Roja"
                              onClick={() =>
                                updatePlayerDraft(player.id, {
                                  rojas: (draft.rojas + 1) % 2
                                })
                              }
                              className={`px-2 py-0.5 rounded text-xs font-bold border cursor-pointer transition-colors ${
                                draft.rojas > 0
                                  ? 'bg-red-600 text-white border-red-400 font-black'
                                  : isDark
                                    ? 'bg-[#020d24] text-slate-500 border-slate-700'
                                    : 'bg-white text-slate-400 border-slate-300'
                              }`}
                            >
                              🟥 {draft.rojas}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">No suma estadísticas</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer with Submit */}
          <div
            className={`${
              isDark ? 'bg-[#00205b]' : 'bg-[#002b7a]'
            } border-t-2 border-red-600 px-6 py-4 flex items-center justify-between flex-wrap gap-2`}
          >
            <span className="text-xs text-blue-200">
              {countTitulares} Titulares • {countSuplentes} Suplentes convocados
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-transparent hover:bg-blue-900/50 text-white text-xs font-semibold rounded-lg border border-blue-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-red-400 shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingMatch ? 'Guardar Cambios' : 'Registrar Partido y Estadísticas'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
