import React, { useState, useMemo } from 'react';
import { Player, Match, MatchPlayerStat, PlayerEvaluation, PlayerAggregatedStats } from '../types';
import {
  Trophy,
  Calendar,
  Users,
  Plus,
  Edit3,
  Trash2,
  TrendingUp,
  Search,
  Shield,
  Clock,
  Flame,
  Award,
  Database,
  ArrowUpDown,
  FileText,
  LayoutGrid,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Campograma } from './Campograma';
import { TACTICAL_FORMATIONS, DEFAULT_FORMATION } from '../utils/tacticalFormations';

interface StatsViewProps {
  players: Player[];
  matches: Match[];
  matchStats: MatchPlayerStat[];
  evaluations: PlayerEvaluation[];
  onOpenNewMatchModal: () => void;
  onEditMatch: (match: Match) => void;
  onDeleteMatch: (matchId: string) => void;
  onOpenPlayerHistory: (player: Player) => void;
  onOpenSupabaseModal: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  players,
  matches,
  matchStats,
  evaluations,
  onOpenNewMatchModal,
  onEditMatch,
  onDeleteMatch,
  onOpenPlayerHistory,
  onOpenSupabaseModal
}) => {
  const { isDark } = useTheme();
  const [subTab, setSubTab] = useState<'partidos' | 'tablaJugadores'>('partidos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'minutos' | 'goles' | 'asistencias' | 'partidos' | 'dorsal'>('minutos');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedPitchMatchId, setExpandedPitchMatchId] = useState<string | null>(null);

  // Format Date DD/MM/YYYY
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Helper to derive slot assignment for a match
  const getMatchSlots = (match: Match, mStats: MatchPlayerStat[]): Record<string, string> => {
    if (match.titularesSlots && Object.keys(match.titularesSlots).length > 0) {
      return match.titularesSlots;
    }
    const formKey = match.formacion || DEFAULT_FORMATION;
    const formationDef = TACTICAL_FORMATIONS[formKey] || TACTICAL_FORMATIONS[DEFAULT_FORMATION];
    const starters = mStats.filter((s) => s.condicionJugador === 'Titular');
    const starterPlayers = starters.map((s) => players.find((p) => p.id === s.jugadorId)).filter(Boolean) as Player[];

    const assigned: Record<string, string> = {};
    const used = new Set<string>();

    formationDef.slots.forEach((slot) => {
      const matchCat = starterPlayers.find((p) => !used.has(p.id) && p.posicion === slot.categoria);
      if (matchCat) {
        assigned[slot.slotId] = matchCat.id;
        used.add(matchCat.id);
      }
    });

    formationDef.slots.forEach((slot) => {
      if (!assigned[slot.slotId]) {
        const remaining = starterPlayers.find((p) => !used.has(p.id));
        if (remaining) {
          assigned[slot.slotId] = remaining.id;
          used.add(remaining.id);
        }
      }
    });

    return assigned;
  };

  // Aggregated Player Statistics
  const aggregatedStats: PlayerAggregatedStats[] = useMemo(() => {
    return players.map((player) => {
      const pStats = matchStats.filter((s) => s.jugadorId === player.id);
      const titularidades = pStats.filter((s) => s.condicionJugador === 'Titular').length;
      const suplenciasConMinutos = pStats.filter(
        (s) =>
          (s.condicionJugador === 'Suplente que ingresa' || s.condicionJugador === 'Suplente') &&
          s.minutosJugados > 0
      ).length;
      const suplenciasSinMinutos = pStats.filter(
        (s) =>
          s.condicionJugador === 'Suplente que no ingresa' ||
          (s.condicionJugador === 'Suplente' && s.minutosJugados === 0)
      ).length;
      const noCitado = pStats.filter(
        (s) => s.condicionJugador === 'No citado' || s.condicionJugador === 'No convocado'
      ).length;
      const suspendido = pStats.filter((s) => s.condicionJugador === 'Suspendido').length;
      const lesionado = pStats.filter((s) => s.condicionJugador === 'Lesionado').length;
      const partidosJugados = titularidades + suplenciasConMinutos;
      const minutosTotales = pStats.reduce((acc, s) => acc + (s.minutosJugados || 0), 0);
      const golesTotales = pStats.reduce((acc, s) => acc + (s.goles || 0), 0);
      const asistenciasTotales = pStats.reduce((acc, s) => acc + (s.asistencias || 0), 0);
      const tarjetasAmarillasTotales = pStats.reduce((acc, s) => acc + (s.tarjetasAmarillas || 0), 0);
      const tarjetasRojasTotales = pStats.reduce((acc, s) => acc + (s.tarjetasRojas || 0), 0);

      // Average evaluations
      const pEvals = evaluations.filter((e) => e.jugadorId === player.id);
      const countEvals = pEvals.length;
      const avgTec = countEvals > 0 ? pEvals.reduce((a, b) => a + b.tecnica, 0) / countEvals : undefined;
      const avgTac = countEvals > 0 ? pEvals.reduce((a, b) => a + b.tactica, 0) / countEvals : undefined;
      const avgCon = countEvals > 0 ? pEvals.reduce((a, b) => a + b.condicional, 0) / countEvals : undefined;

      return {
        jugador: player,
        partidosJugados,
        titularidades,
        suplenciasConMinutos,
        suplenciasSinMinutos,
        noCitado,
        suspendido,
        lesionado,
        minutosTotales,
        golesTotales,
        asistenciasTotales,
        tarjetasAmarillasTotales,
        tarjetasRojasTotales,
        promedioTecnica: avgTec ? Number(avgTec.toFixed(1)) : undefined,
        promedioTactica: avgTac ? Number(avgTac.toFixed(1)) : undefined,
        promedioCondicional: avgCon ? Number(avgCon.toFixed(1)) : undefined
      };
    });
  }, [players, matchStats, evaluations]);

  // Overall Club Match Record
  const totalMatches = matches.length;
  const wins = matches.filter((m) => m.golesFavor > m.golesContra).length;
  const draws = matches.filter((m) => m.golesFavor === m.golesContra).length;
  const losses = matches.filter((m) => m.golesFavor < m.golesContra).length;
  const totalGolesFavor = matches.reduce((acc, m) => acc + m.golesFavor, 0);
  const totalGolesContra = matches.reduce((acc, m) => acc + m.golesContra, 0);
  const goalDiff = totalGolesFavor - totalGolesContra;

  // Top Performers
  const topScorer = useMemo(() => {
    return [...aggregatedStats].sort((a, b) => b.golesTotales - a.golesTotales)[0];
  }, [aggregatedStats]);

  const topAssister = useMemo(() => {
    return [...aggregatedStats].sort((a, b) => b.asistenciasTotales - a.asistenciasTotales)[0];
  }, [aggregatedStats]);

  const topMinutes = useMemo(() => {
    return [...aggregatedStats].sort((a, b) => b.minutosTotales - a.minutosTotales)[0];
  }, [aggregatedStats]);

  // Sorted and filtered player stats
  const filteredAndSortedStats = useMemo(() => {
    return aggregatedStats
      .filter((item) => {
        const q = searchTerm.toLowerCase();
        return (
          item.jugador.nombre.toLowerCase().includes(q) ||
          item.jugador.apellido.toLowerCase().includes(q) ||
          item.jugador.posicion.toLowerCase().includes(q) ||
          item.jugador.dorsal.toString().includes(q)
        );
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortBy === 'minutos') {
          valA = a.minutosTotales;
          valB = b.minutosTotales;
        } else if (sortBy === 'goles') {
          valA = a.golesTotales;
          valB = b.golesTotales;
        } else if (sortBy === 'asistencias') {
          valA = a.asistenciasTotales;
          valB = b.asistenciasTotales;
        } else if (sortBy === 'partidos') {
          valA = a.partidosJugados;
          valB = b.partidosJugados;
        } else if (sortBy === 'dorsal') {
          valA = a.jugador.dorsal;
          valB = b.jugador.dorsal;
        }
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [aggregatedStats, searchTerm, sortBy, sortOrder]);

  const handleSort = (field: 'minutos' | 'goles' | 'asistencias' | 'partidos' | 'dorsal') => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div
        className={`${
          isDark ? 'bg-[#041638]' : 'bg-white'
        } border-2 border-red-600 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-red-600/30 text-red-200 border border-red-500/40 px-2 py-0.5 rounded">
              Estadísticas y Competencia
            </span>
            <span className="text-xs text-blue-400 font-medium">Temporada 2025</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-athletic tracking-tight">
            Registro Estadístico de Partidos y Minutos
          </h2>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
            Control de partidos oficiales, minutos disputados por titulares y suplentes, goles, asistencias y tarjetas
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btn-ver-sql-stats"
            onClick={onOpenSupabaseModal}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center gap-2 cursor-pointer transition-all ${
              isDark
                ? 'bg-[#020d24] text-blue-200 hover:text-white border-blue-800 hover:border-red-500'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>SQL Supabase</span>
          </button>

          <button
            id="btn-agregar-partido"
            onClick={onOpenNewMatchModal}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-red-400 shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nuevo Partido</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid: Overall Performance */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Record General */}
        <div
          className={`${
            isDark ? 'bg-[#031533] border-red-600/70' : 'bg-white border-slate-200 shadow-xs'
          } border-2 rounded-2xl p-4 transition-colors`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>
              Balance de Partidos
            </span>
            <Trophy className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-athletic text-2xl sm:text-3xl font-black text-white">
              {totalMatches}
            </span>
            <span className="text-xs font-semibold text-emerald-400">{wins}G</span>
            <span className="text-xs font-semibold text-amber-400">{draws}E</span>
            <span className="text-xs font-semibold text-red-400">{losses}P</span>
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
            Goles: {totalGolesFavor} favor / {totalGolesContra} contra ({goalDiff >= 0 ? `+${goalDiff}` : goalDiff})
          </div>
        </div>

        {/* Top Scorer */}
        <div
          className={`${
            isDark ? 'bg-[#031533] border-red-600/70' : 'bg-white border-slate-200 shadow-xs'
          } border-2 rounded-2xl p-4 transition-colors`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>
              Goleador del Plantel
            </span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-athletic text-2xl sm:text-3xl font-black text-red-500">
              {topScorer?.golesTotales || 0}
            </span>
            <span className="text-xs text-slate-400">goles</span>
          </div>
          <div className="text-xs font-bold text-white truncate mt-1">
            {topScorer ? `${topScorer.jugador.nombre} ${topScorer.jugador.apellido}` : 'Sin registros'}
          </div>
        </div>

        {/* Top Assister */}
        <div
          className={`${
            isDark ? 'bg-[#031533] border-red-600/70' : 'bg-white border-slate-200 shadow-xs'
          } border-2 rounded-2xl p-4 transition-colors`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>
              Máximo Asistente
            </span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-athletic text-2xl sm:text-3xl font-black text-blue-500">
              {topAssister?.asistenciasTotales || 0}
            </span>
            <span className="text-xs text-slate-400">asistencias</span>
          </div>
          <div className="text-xs font-bold text-white truncate mt-1">
            {topAssister ? `${topAssister.jugador.nombre} ${topAssister.jugador.apellido}` : 'Sin registros'}
          </div>
        </div>

        {/* Top Minutes */}
        <div
          className={`${
            isDark ? 'bg-[#031533] border-red-600/70' : 'bg-white border-slate-200 shadow-xs'
          } border-2 rounded-2xl p-4 transition-colors`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-blue-300' : 'text-slate-500'}`}>
              Mayor Presencia
            </span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-athletic text-2xl sm:text-3xl font-black text-emerald-400">
              {topMinutes?.minutosTotales || 0}'
            </span>
            <span className="text-xs text-slate-400">minutos</span>
          </div>
          <div className="text-xs font-bold text-white truncate mt-1">
            {topMinutes ? `${topMinutes.jugador.nombre} ${topMinutes.jugador.apellido}` : 'Sin registros'}
          </div>
        </div>
      </div>

      {/* Subtabs: Partidos Disputados vs Tabla General de Jugadores */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b-2 border-red-600/70 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('partidos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-2 ${
              subTab === 'partidos'
                ? 'bg-red-600 text-white border-red-400 shadow-md'
                : isDark
                  ? 'bg-[#031533] text-blue-200 border-blue-900 hover:text-white'
                  : 'bg-white text-slate-700 border-slate-300 hover:text-slate-900'
            }`}
          >
            Partidos Disputados ({matches.length})
          </button>

          <button
            onClick={() => setSubTab('tablaJugadores')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-2 ${
              subTab === 'tablaJugadores'
                ? 'bg-red-600 text-white border-red-400 shadow-md'
                : isDark
                  ? 'bg-[#031533] text-blue-200 border-blue-900 hover:text-white'
                  : 'bg-white text-slate-700 border-slate-300 hover:text-slate-900'
            }`}
          >
            Tabla Acumulada de Jugadores ({players.length})
          </button>
        </div>

        {/* Search for players / matches */}
        <div className="w-full sm:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={subTab === 'partidos' ? 'Buscar partido o rival...' : 'Buscar jugador por nombre o dorsal...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                isDark
                  ? 'bg-[#020d24] text-white border-blue-900'
                  : 'bg-white text-slate-900 border-slate-300'
              } focus:border-red-500 focus:outline-none`}
            />
          </div>
        </div>
      </div>

      {/* SUBTAB 1: LISTADO DE PARTIDOS */}
      {subTab === 'partidos' && (
        <div className="space-y-4">
          {matches.length === 0 ? (
            <div
              className={`${
                isDark ? 'bg-[#041638]' : 'bg-white'
              } border-2 border-red-600 rounded-2xl p-10 text-center space-y-3`}
            >
              <Trophy className="w-12 h-12 text-red-500 mx-auto opacity-80" />
              <h3 className="text-lg font-bold uppercase text-white font-athletic">
                No hay partidos registrados aún
              </h3>
              <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
                Comienza agregando el primer partido oficial o amistoso para registrar qué jugadores fueron titulares, suplentes y sus minutos jugados.
              </p>
              <button
                onClick={onOpenNewMatchModal}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-red-400 cursor-pointer"
              >
                + Registrar Primer Partido
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {matches
                .filter((m) => m.rival.toLowerCase().includes(searchTerm.toLowerCase()) || m.torneo.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((match) => {
                  const mStats = matchStats.filter((s) => s.partidoId === match.id);
                  const titulares = mStats.filter((s) => s.condicionJugador === 'Titular');
                  const suplentesIngresan = mStats.filter(
                    (s) =>
                      (s.condicionJugador === 'Suplente que ingresa' || s.condicionJugador === 'Suplente') &&
                      s.minutosJugados > 0
                  );
                  const suplentesNoIngresan = mStats.filter(
                    (s) =>
                      s.condicionJugador === 'Suplente que no ingresa' ||
                      (s.condicionJugador === 'Suplente' && s.minutosJugados === 0)
                  );
                  const noCitados = mStats.filter(
                    (s) => s.condicionJugador === 'No citado' || s.condicionJugador === 'No convocado'
                  );
                  const suspendidos = mStats.filter((s) => s.condicionJugador === 'Suspendido');
                  const lesionados = mStats.filter((s) => s.condicionJugador === 'Lesionado');
                  const goleadores = mStats.filter((s) => s.goles > 0);
                  const amonestados = mStats.filter((s) => s.tarjetasAmarillas > 0);
                  const expulsados = mStats.filter((s) => s.tarjetasRojas > 0);

                  // Result indicator
                  const isWin = match.golesFavor > match.golesContra;
                  const isDraw = match.golesFavor === match.golesContra;
                  const isPitchOpen = expandedPitchMatchId === match.id;
                  const formationKey = match.formacion || DEFAULT_FORMATION;

                  return (
                    <div
                      key={match.id}
                      className={`${
                        isDark ? 'bg-[#031533] border-red-600/70' : 'bg-white border-slate-200 shadow-md'
                      } border-2 rounded-2xl p-4 sm:p-5 transition-all hover:border-red-500`}
                    >
                      {/* Top Bar: Match Metadata & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/50">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-bold font-mono border ${
                              isDark
                                ? 'bg-[#020d24] text-white border-red-500/60'
                                : 'bg-slate-100 text-slate-800 border-slate-300'
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5 inline mr-1 text-red-500" />
                            {formatDateDisplay(match.fecha)}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              isDark
                                ? 'bg-blue-900/40 text-blue-200 border-blue-700'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                          >
                            {match.torneo}
                          </span>

                          {match.jornada && (
                            <span className="text-xs text-slate-400 font-medium">
                              • {match.jornada}
                            </span>
                          )}

                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase border ${
                              match.condicion === 'Local'
                                ? 'bg-red-600/30 text-red-200 border-red-500/50'
                                : 'bg-blue-600/30 text-blue-200 border-blue-500/50'
                            }`}
                          >
                            {match.condicion}
                          </span>

                          {match.estadio && (
                            <span className="text-xs text-slate-400">
                              📍 {match.estadio}
                            </span>
                          )}

                          {/* Tactical Formation Badge */}
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-600/20 text-red-300 border border-red-500/40">
                            {formationKey}
                          </span>
                        </div>

                        {/* Action buttons: Campograma, Edit, Delete */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
                          <button
                            type="button"
                            title="Ver u ocultar campograma táctico"
                            onClick={() => setExpandedPitchMatchId(isPitchOpen ? null : match.id)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isPitchOpen
                                ? 'bg-red-600 text-white border-red-400 shadow-sm'
                                : isDark
                                ? 'bg-[#020d24] text-blue-200 hover:text-white border-blue-900 hover:border-red-500'
                                : 'bg-slate-100 text-slate-700 hover:text-[#002b7a] border-slate-300'
                            }`}
                          >
                            <LayoutGrid className="w-3.5 h-3.5 text-red-400" />
                            <span>{isPitchOpen ? 'Ocultar Campograma' : 'Ver Campograma'}</span>
                            {isPitchOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            title="Editar partido y planilla"
                            onClick={() => onEditMatch(match)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isDark
                                ? 'bg-[#020d24] hover:bg-red-600 text-blue-200 hover:text-white border-red-500/50'
                                : 'bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-[#002b7a] border-slate-300'
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>

                          <button
                            title="Eliminar partido"
                            onClick={() => {
                              if (confirm(`¿Estás seguro de eliminar el partido contra ${match.rival}?`)) {
                                onDeleteMatch(match.id);
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

                      {/* Scoreboard Row */}
                      <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* Club Name & Escudo */}
                          <div className="flex items-center gap-2.5">
                            <img
                              src="/uchile_escudo.png"
                              alt="U. de Chile"
                              className="w-7 h-9 object-contain drop-shadow-sm flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="text-left min-w-[100px]">
                              <span className="font-athletic font-extrabold text-lg sm:text-xl uppercase block text-white">
                                U. de Chile
                              </span>
                              <span className="text-[10px] text-blue-300 font-medium">Club Universidad de Chile</span>
                            </div>
                          </div>

                          {/* Score Badge */}
                          <div
                            className={`px-4 py-2 rounded-xl font-athletic text-2xl sm:text-3xl font-black tracking-wider border-2 flex items-center gap-3 ${
                              isWin
                                ? 'bg-emerald-600/30 text-emerald-400 border-emerald-500 shadow-md'
                                : isDraw
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500 shadow-md'
                                  : 'bg-red-600/30 text-red-400 border-red-500 shadow-md'
                            }`}
                          >
                            <span>{match.golesFavor}</span>
                            <span className="text-base text-slate-400">-</span>
                            <span>{match.golesContra}</span>
                          </div>

                          {/* Rival Name */}
                          <div className="min-w-[120px]">
                            <span className="font-athletic font-extrabold text-lg sm:text-xl uppercase block text-red-400">
                              {match.rival}
                            </span>
                            <span className="text-[10px] text-slate-400">Rival</span>
                          </div>
                        </div>

                        {/* Match Goleadores / Incidents summary */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {goleadores.length > 0 && (
                            <div className="flex items-center gap-1.5 bg-red-600/20 text-red-200 border border-red-500/40 px-2.5 py-1 rounded-lg">
                              <span>⚽</span>
                              {goleadores.map((g) => {
                                const p = players.find((x) => x.id === g.jugadorId);
                                return (
                                  <span key={g.id} className="font-semibold">
                                    {p?.apellido} {g.goles > 1 ? `(${g.goles})` : ''}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {amonestados.length > 0 && (
                            <div className="flex items-center gap-1 bg-amber-400/20 text-amber-200 border border-amber-400/40 px-2 py-1 rounded-lg text-[11px]">
                              <span>🟨</span>
                              <span>{amonestados.length} amarillas</span>
                            </div>
                          )}

                          {expulsados.length > 0 && (
                            <div className="flex items-center gap-1 bg-red-600/30 text-red-200 border border-red-600/60 px-2 py-1 rounded-lg text-[11px]">
                              <span>🟥</span>
                              <span>{expulsados.length} expulsado(s)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CAMPOGRAMA TACTICO EXPANDIBLE */}
                      {isPitchOpen && (
                        <div className="my-3 p-3.5 rounded-2xl border-2 border-red-600/50 bg-[#020f26]/90 shadow-inner">
                          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-700/60 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-athletic">
                                Campograma Táctico: Formación {formationKey}
                              </h4>
                            </div>
                            <span className="text-[11px] text-blue-200">
                              11 Titulares alineados sobre el terreno de juego
                            </span>
                          </div>

                          <Campograma
                            formation={formationKey}
                            slotsAssignment={getMatchSlots(match, mStats)}
                            players={players}
                            matchStats={mStats}
                            isInteractive={false}
                          />
                        </div>
                      )}

                      {/* Lineup & Participation Accordion / Badges */}
                      <div
                        className={`mt-2 pt-3 border-t text-xs space-y-2.5 ${
                          isDark ? 'border-slate-800' : 'border-slate-200'
                        }`}
                      >
                        {/* Titulares */}
                        <div>
                          <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 text-emerald-400`}>
                            Titulares ({titulares.length}):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {titulares.map((t) => {
                              const p = players.find((x) => x.id === t.jugadorId);
                              if (!p) return null;
                              return (
                                <button
                                  key={t.id}
                                  onClick={() => onOpenPlayerHistory(p)}
                                  title={`Ver ficha de ${p.nombre} ${p.apellido}`}
                                  className={`px-2 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                                    isDark
                                      ? 'bg-[#020d24] text-blue-200 hover:text-white border-blue-900 hover:border-red-500'
                                      : 'bg-slate-100 text-slate-800 hover:bg-blue-50 border-slate-300'
                                  }`}
                                >
                                  <span className="font-athletic font-bold text-red-500">#{p.dorsal}</span>
                                  <span>{p.apellido}</span>
                                  <span className="text-[10px] text-slate-400">({t.minutosJugados}')</span>
                                  {t.goles > 0 && <span className="text-red-400">⚽{t.goles}</span>}
                                  {t.asistencias > 0 && <span className="text-blue-400">🅰️{t.asistencias}</span>}
                                  {t.tarjetasAmarillas > 0 && <span>🟨</span>}
                                  {t.tarjetasRojas > 0 && <span>🟥</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Suplentes que ingresaron */}
                        {suplentesIngresan.length > 0 && (
                          <div>
                            <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 text-blue-400`}>
                              Suplentes que ingresaron ({suplentesIngresan.length}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {suplentesIngresan.map((s) => {
                                const p = players.find((x) => x.id === s.jugadorId);
                                if (!p) return null;
                                return (
                                  <button
                                    key={s.id}
                                    onClick={() => onOpenPlayerHistory(p)}
                                    title={`Ver ficha de ${p.nombre} ${p.apellido}`}
                                    className={`px-2 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                                      isDark
                                        ? 'bg-[#020d24] text-blue-200 hover:text-white border-blue-900 hover:border-blue-400'
                                        : 'bg-blue-50 text-slate-800 hover:bg-blue-100 border-blue-300'
                                    }`}
                                  >
                                    <span className="font-athletic font-bold text-red-500">#{p.dorsal}</span>
                                    <span>{p.apellido}</span>
                                    <span className="text-[10px] text-slate-400">({s.minutosJugados}')</span>
                                    {s.goles > 0 && <span className="text-red-400">⚽{s.goles}</span>}
                                    {s.asistencias > 0 && <span className="text-blue-400">🅰️{s.asistencias}</span>}
                                    {s.tarjetasAmarillas > 0 && <span>🟨</span>}
                                    {s.tarjetasRojas > 0 && <span>🟥</span>}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Suplentes que no ingresaron (Banca) */}
                        {suplentesNoIngresan.length > 0 && (
                          <div>
                            <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 text-slate-400`}>
                              En banca sin minutos ({suplentesNoIngresan.length}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {suplentesNoIngresan.map((s) => {
                                const p = players.find((x) => x.id === s.jugadorId);
                                if (!p) return null;
                                return (
                                  <button
                                    key={s.id}
                                    onClick={() => onOpenPlayerHistory(p)}
                                    title={`Ver ficha de ${p.nombre} ${p.apellido}`}
                                    className={`px-2 py-0.5 rounded-lg border text-[10px] flex items-center gap-1 cursor-pointer opacity-80 hover:opacity-100 transition-opacity ${
                                      isDark
                                        ? 'bg-[#020d24]/60 text-slate-400 hover:text-white border-slate-800'
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}
                                  >
                                    <span className="font-mono text-slate-400">#{p.dorsal}</span>
                                    <span>{p.apellido}</span>
                                    <span className="text-[9px] text-slate-500">(0')</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Bajas / No convocados / Suspendidos / Lesionados */}
                        {(noCitados.length > 0 || suspendidos.length > 0 || lesionados.length > 0) && (
                          <div className="flex flex-wrap gap-4 pt-1 border-t border-slate-800/40">
                            {suspendidos.length > 0 && (
                              <div>
                                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                                  🟡 Suspendidos ({suspendidos.length}):
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {suspendidos.map((s) => {
                                    const p = players.find((x) => x.id === s.jugadorId);
                                    if (!p) return null;
                                    return (
                                      <span
                                        key={s.id}
                                        className="px-1.5 py-0.5 rounded text-[10px] bg-amber-900/30 text-amber-300 border border-amber-600/40"
                                      >
                                        #{p.dorsal} {p.apellido}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {lesionados.length > 0 && (
                              <div>
                                <span className="text-[10px] uppercase font-bold text-rose-400 block mb-0.5">
                                  🔴 Lesionados ({lesionados.length}):
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {lesionados.map((s) => {
                                    const p = players.find((x) => x.id === s.jugadorId);
                                    if (!p) return null;
                                    return (
                                      <span
                                        key={s.id}
                                        className="px-1.5 py-0.5 rounded text-[10px] bg-rose-900/30 text-rose-300 border border-rose-600/40"
                                      >
                                        #{p.dorsal} {p.apellido}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {noCitados.length > 0 && (
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                                  🔘 No citados ({noCitados.length}):
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {noCitados.map((s) => {
                                    const p = players.find((x) => x.id === s.jugadorId);
                                    if (!p) return null;
                                    return (
                                      <span
                                        key={s.id}
                                        className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-900/40 text-zinc-400 border border-zinc-700/40"
                                      >
                                        #{p.dorsal} {p.apellido}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {match.notas && (
                          <div
                            className={`p-2.5 rounded-lg italic text-[11px] border ${
                              isDark ? 'bg-[#020d24]/60 text-slate-300 border-blue-950' : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            "{match.notas}"
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: TABLA ACUMULADA DE JUGADORES */}
      {subTab === 'tablaJugadores' && (
        <div
          className={`${
            isDark ? 'bg-[#031533] border-red-600/70' : 'bg-white border-slate-200 shadow-md'
          } border-2 rounded-2xl overflow-hidden transition-colors`}
        >
          <div className="p-4 sm:p-5 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500" />
                Planilla Acumulada de Estadísticas y Evaluaciones
              </h3>
              <p className={`text-xs ${isDark ? 'text-blue-200' : 'text-slate-500'}`}>
                Haz clic en los encabezados para ordenar por Minutos, Goles, Asistencias o Partidos Jugados
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {filteredAndSortedStats.length} jugador(es)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`${
                  isDark ? 'bg-[#00205b] text-blue-200' : 'bg-slate-100 text-slate-700'
                } font-bold uppercase tracking-wider border-b border-red-600/60`}
              >
                <tr>
                  <th
                    onClick={() => handleSort('dorsal')}
                    className="p-3 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>Dorsal / Jugador</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3">Posición</th>
                  <th
                    onClick={() => handleSort('partidos')}
                    className="p-3 text-center cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>PJ</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3 text-center">TIT / SUP</th>
                  <th
                    onClick={() => handleSort('minutos')}
                    className="p-3 text-center cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>MIN</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('goles')}
                    className="p-3 text-center cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>GOL</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('asistencias')}
                    className="p-3 text-center cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>ASI</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3 text-center">TA</th>
                  <th className="p-3 text-center">TR</th>
                  <th className="p-3 text-center">TÉC / TÁC / COND</th>
                  <th className="p-3 text-right">Ficha Individual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {filteredAndSortedStats.map((item) => {
                  const p = item.jugador;
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-red-600/10 transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {/* Dorsal & Nombre */}
                      <td className="p-3 font-medium">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-red-600 text-white font-athletic font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                            {p.dorsal}
                          </span>
                          <div>
                            <span className="font-bold block">
                              {p.nombre} {p.apellido}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {p.nacionalidad || 'Chile'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Posición */}
                      <td className="p-3 text-slate-400">{p.posicion}</td>

                      {/* PJ */}
                      <td className="p-3 text-center font-athletic font-bold text-sm text-emerald-400">
                        {item.partidosJugados}
                      </td>

                      {/* TIT / SUP */}
                      <td
                        className="p-3 text-center text-[11px]"
                        title={`Titular: ${item.titularidades} | Entra de suplente: ${item.suplenciasConMinutos} | En banca sin min: ${item.suplenciasSinMinutos} | No citado: ${item.noCitado} | Suspendido: ${item.suspendido} | Lesionado: ${item.lesionado}`}
                      >
                        <span className="text-emerald-400 font-bold">{item.titularidades}T</span>
                        <span className="text-slate-500 mx-0.5">/</span>
                        <span className="text-blue-400 font-semibold">{item.suplenciasConMinutos}S</span>
                        {item.suplenciasSinMinutos > 0 && (
                          <span className="text-[10px] text-slate-400 ml-1 font-mono">({item.suplenciasSinMinutos}b)</span>
                        )}
                      </td>

                      {/* MIN */}
                      <td className="p-3 text-center font-athletic font-black text-sm">
                        {item.minutosTotales}'
                      </td>

                      {/* GOL */}
                      <td className="p-3 text-center font-athletic font-bold text-sm text-red-500">
                        {item.golesTotales > 0 ? item.golesTotales : '-'}
                      </td>

                      {/* ASI */}
                      <td className="p-3 text-center font-athletic font-bold text-sm text-blue-400">
                        {item.asistenciasTotales > 0 ? item.asistenciasTotales : '-'}
                      </td>

                      {/* TA */}
                      <td className="p-3 text-center text-amber-400 font-bold">
                        {item.tarjetasAmarillasTotales > 0 ? item.tarjetasAmarillasTotales : '-'}
                      </td>

                      {/* TR */}
                      <td className="p-3 text-center text-red-600 font-bold">
                        {item.tarjetasRojasTotales > 0 ? item.tarjetasRojasTotales : '-'}
                      </td>

                      {/* Promedios Evaluaciones */}
                      <td className="p-3 text-center">
                        {item.promedioTecnica !== undefined ? (
                          <div className="flex items-center justify-center gap-1 font-bold text-[11px]">
                            <span className="text-blue-400">{item.promedioTecnica}</span>
                            <span className="text-slate-500">/</span>
                            <span className="text-amber-400">{item.promedioTactica}</span>
                            <span className="text-slate-500">/</span>
                            <span className="text-red-400">{item.promedioCondicional}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Sin eval.</span>
                        )}
                      </td>

                      {/* Action to open Player History Modal with evolution chart */}
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onOpenPlayerHistory(p)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Ver Gráfico
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
