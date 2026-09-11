import React, { useState, useEffect, useCallback } from 'react';
import { Player, PlayerEvaluation, TabType, Match, MatchPlayerStat } from './types';
import { INITIAL_PLAYERS, INITIAL_EVALUATIONS, INITIAL_MATCHES, INITIAL_MATCH_STATS } from './data/initialData';
import { Header } from './components/Header';
import { PlayerCard } from './components/PlayerCard';
import { EvaluationsView } from './components/EvaluationsView';
import { EvaluationModal } from './components/EvaluationModal';
import { PlayerHistoryModal } from './components/PlayerHistoryModal';
import { PlayerModal } from './components/PlayerModal';
import { DeletePlayerConfirmModal } from './components/DeletePlayerConfirmModal';
import { PromptModal } from './components/PromptModal';
import { SupabaseSyncModal } from './components/SupabaseSyncModal';
import { StatsView } from './components/StatsView';
import { MatchModal } from './components/MatchModal';
import { useTheme } from './context/ThemeContext';
import {
  SupabaseStatus,
  checkSupabaseStatus,
  fetchPlayersFromSupabase,
  fetchEvaluationsFromSupabase,
  saveEvaluationToSupabase,
  deleteEvaluationFromSupabase,
  savePlayerToSupabase,
  deletePlayerFromSupabase,
  fetchMatchesFromSupabase,
  fetchMatchStatsFromSupabase,
  saveMatchToSupabase,
  deleteMatchFromSupabase,
  saveMatchStatsToSupabase,
  deleteMatchStatsByMatchId
} from './lib/supabase';
import { Search, Filter, Database, CheckCircle2, AlertTriangle, UserPlus } from 'lucide-react';

export default function App() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('plantilla');

  // Players state with localStorage persistence
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('uch_players');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error loading players from localStorage', e);
      }
    }
    return INITIAL_PLAYERS;
  });

  // Evaluations history state: map of player ID to an array of PlayerEvaluation
  const [evaluations, setEvaluations] = useState<Record<string, PlayerEvaluation[]>>(() => {
    const saved = localStorage.getItem('uch_evaluations_history') || localStorage.getItem('uch_evaluations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const map: Record<string, PlayerEvaluation[]> = {};
        let validRecordsCount = 0;

        for (const key of Object.keys(parsed)) {
          const item = parsed[key];
          if (Array.isArray(item)) {
            map[key] = item;
            validRecordsCount += item.length;
          } else if (item && typeof item === 'object') {
            // Migrate single evaluation to array
            map[key] = [item];
            validRecordsCount += 1;
          }
        }

        if (validRecordsCount > 0) {
          return map;
        }
      } catch (e) {
        console.error('Error loading evaluations history', e);
      }
    }

    // Default initial seed: group INITIAL_EVALUATIONS by jugadorId
    const initialMap: Record<string, PlayerEvaluation[]> = {};
    INITIAL_EVALUATIONS.forEach((ev) => {
      if (!initialMap[ev.jugadorId]) {
        initialMap[ev.jugadorId] = [];
      }
      initialMap[ev.jugadorId].push(ev);
    });
    return initialMap;
  });

  // Matches and Lineup Statistics State with localStorage fallback
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('uch_matches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error loading matches from localStorage', e);
      }
    }
    return INITIAL_MATCHES;
  });

  const [matchStats, setMatchStats] = useState<MatchPlayerStat[]>(() => {
    const saved = localStorage.getItem('uch_match_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error loading match stats from localStorage', e);
      }
    }
    return INITIAL_MATCH_STATS;
  });

  // Filters for Plantilla view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('TODOS');

  // Modals state for Evaluations
  const [selectedPlayerForEval, setSelectedPlayerForEval] = useState<Player | null>(null);
  const [selectedEvaluationToEdit, setSelectedEvaluationToEdit] = useState<PlayerEvaluation | null>(null);
  const [selectedPlayerForHistory, setSelectedPlayerForHistory] = useState<Player | null>(null);

  // Modals state for Matches
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [selectedMatchToEdit, setSelectedMatchToEdit] = useState<Match | null>(null);

  // Modals state for Player Add / Edit / Delete
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [selectedPlayerToEdit, setSelectedPlayerToEdit] = useState<Player | null>(null);
  const [isDeletePlayerModalOpen, setIsDeletePlayerModalOpen] = useState(false);
  const [selectedPlayerToDelete, setSelectedPlayerToDelete] = useState<Player | null>(null);

  // Modals state for Info & Supabase
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Supabase Status State
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null);

  // Check Supabase connection and tables on mount
  const refreshSupabaseStatus = useCallback(async () => {
    const status = await checkSupabaseStatus();
    setSupabaseStatus(status);

    // If tables already exist in Supabase, attempt to pull latest data
    if (status.tablesExist) {
      const remotePlayers = await fetchPlayersFromSupabase();
      if (remotePlayers && remotePlayers.length > 0) {
        setPlayers(remotePlayers);
      }
      const remoteEvals = await fetchEvaluationsFromSupabase();
      if (remoteEvals && Object.keys(remoteEvals).length > 0) {
        setEvaluations(remoteEvals);
      }
      const remoteMatches = await fetchMatchesFromSupabase();
      if (remoteMatches && remoteMatches.length > 0) {
        setMatches(remoteMatches);
      }
      const remoteMatchStats = await fetchMatchStatsFromSupabase();
      if (remoteMatchStats && remoteMatchStats.length > 0) {
        setMatchStats(remoteMatchStats);
      }
    }
  }, []);

  useEffect(() => {
    refreshSupabaseStatus();
  }, [refreshSupabaseStatus]);

  // Persist players to localStorage
  useEffect(() => {
    localStorage.setItem('uch_players', JSON.stringify(players));
  }, [players]);

  // Save evaluations history to localStorage as reliable backup
  useEffect(() => {
    localStorage.setItem('uch_evaluations_history', JSON.stringify(evaluations));
  }, [evaluations]);

  // Save matches to localStorage
  useEffect(() => {
    localStorage.setItem('uch_matches', JSON.stringify(matches));
  }, [matches]);

  // Save match stats to localStorage
  useEffect(() => {
    localStorage.setItem('uch_match_stats', JSON.stringify(matchStats));
  }, [matchStats]);

  // Total count of all evaluations recorded in history
  const totalEvaluationsCount = Object.values(evaluations).reduce(
    (acc: number, curr: PlayerEvaluation[]) => acc + curr.length,
    0
  );

  // ================= PLAYER MANAGEMENT HANDLERS =================

  // Open modal to add a new player
  const handleOpenAddPlayer = () => {
    setSelectedPlayerToEdit(null);
    setIsPlayerModalOpen(true);
  };

  // Open modal to edit existing player
  const handleOpenEditPlayer = (player: Player) => {
    setSelectedPlayerToEdit(player);
    setIsPlayerModalOpen(true);
  };

  // Open modal to confirm player deletion
  const handleOpenDeletePlayer = (player: Player) => {
    setSelectedPlayerToDelete(player);
    setIsDeletePlayerModalOpen(true);
  };

  // Save Player (Create new or update existing)
  const handleSavePlayer = async (playerData: Omit<Player, 'id'> & { id?: string }) => {
    let savedPlayer: Player;

    if (playerData.id) {
      // Edit existing player
      savedPlayer = { ...playerData, id: playerData.id } as Player;
      setPlayers((prev) => prev.map((p) => (p.id === playerData.id ? savedPlayer : p)));
    } else {
      // Create new player with unique ID
      const newId = `uch-${Date.now()}`;
      savedPlayer = {
        ...playerData,
        id: newId
      } as Player;
      setPlayers((prev) => [savedPlayer, ...prev]);
    }

    // Sync to Supabase if connected
    if (supabaseStatus?.tablesExist) {
      await savePlayerToSupabase(savedPlayer);
    }
  };

  // Confirm player deletion
  const handleConfirmDeletePlayer = async () => {
    if (!selectedPlayerToDelete) return;
    const pId = selectedPlayerToDelete.id;

    // 1. Remove from players
    setPlayers((prev) => prev.filter((p) => p.id !== pId));

    // 2. Remove player's evaluations
    setEvaluations((prev) => {
      const copy = { ...prev };
      delete copy[pId];
      return copy;
    });

    // 3. Delete from Supabase if connected
    if (supabaseStatus?.tablesExist) {
      await deletePlayerFromSupabase(pId);
    }

    setSelectedPlayerToDelete(null);
  };

  // ================= EVALUATION MANAGEMENT HANDLERS =================

  // Open modal to add a brand new evaluation for a player
  const handleOpenAddEvaluation = (player: Player) => {
    setSelectedPlayerForEval(player);
    setSelectedEvaluationToEdit(null);
  };

  // Open modal to edit an existing evaluation
  const handleOpenEditEvaluation = (player: Player, evaluation: PlayerEvaluation) => {
    setSelectedPlayerForEval(player);
    setSelectedEvaluationToEdit(evaluation);
  };

  // Save evaluation (create new or edit existing in history, and sync to Supabase)
  const handleSaveEvaluation = async (evalData: Omit<PlayerEvaluation, 'id'> & { id?: string }) => {
    const pId = evalData.jugadorId;
    let savedRecord: PlayerEvaluation;

    if (evalData.id) {
      savedRecord = { ...evalData, id: evalData.id } as PlayerEvaluation;
    } else {
      savedRecord = {
        ...evalData,
        id: `eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      };
    }

    // Update Local State
    setEvaluations((prev) => {
      const currentList = prev[pId] || [];
      if (evalData.id) {
        return {
          ...prev,
          [pId]: currentList.map((item) => (item.id === evalData.id ? savedRecord : item))
        };
      } else {
        return {
          ...prev,
          [pId]: [savedRecord, ...currentList]
        };
      }
    });

    // Asynchronously sync to Supabase if tables exist
    if (supabaseStatus?.tablesExist) {
      await saveEvaluationToSupabase(savedRecord);
    }
  };

  // Delete evaluation from history and from Supabase
  const handleDeleteEvaluation = async (playerId: string, evalId: string) => {
    setEvaluations((prev) => {
      const currentList = prev[playerId] || [];
      return {
        ...prev,
        [playerId]: currentList.filter((item) => item.id !== evalId)
      };
    });

    // Delete from Supabase if tables exist
    if (supabaseStatus?.tablesExist) {
      await deleteEvaluationFromSupabase(evalId);
    }
  };

  // ================= MATCH AND STATISTICS HANDLERS =================

  // Open modal to add a new match
  const handleOpenNewMatch = () => {
    setSelectedMatchToEdit(null);
    setIsMatchModalOpen(true);
  };

  // Open modal to edit existing match
  const handleOpenEditMatch = (match: Match) => {
    setSelectedMatchToEdit(match);
    setIsMatchModalOpen(true);
  };

  // Save match and its lineup / statistics
  const handleSaveMatch = async (matchData: Match, statsData: MatchPlayerStat[]) => {
    // 1. Update matches state
    setMatches((prev) => {
      const exists = prev.some((m) => m.id === matchData.id);
      if (exists) {
        return prev.map((m) => (m.id === matchData.id ? matchData : m));
      }
      return [matchData, ...prev];
    });

    // 2. Update matchStats state: remove old stats for this match, add new ones
    setMatchStats((prev) => {
      const filtered = prev.filter((s) => s.partidoId !== matchData.id);
      return [...filtered, ...statsData];
    });

    // 3. Sync to Supabase if connected
    if (supabaseStatus?.tablesExist) {
      await saveMatchToSupabase(matchData);
      await deleteMatchStatsByMatchId(matchData.id);
      if (statsData.length > 0) {
        await saveMatchStatsToSupabase(statsData);
      }
    }
  };

  // Delete match and all its associated player stats
  const handleDeleteMatch = async (matchId: string) => {
    // 1. Remove from local matches
    setMatches((prev) => prev.filter((m) => m.id !== matchId));

    // 2. Remove all stats for this match
    setMatchStats((prev) => prev.filter((s) => s.partidoId !== matchId));

    // 3. Remove from Supabase if tables exist
    if (supabaseStatus?.tablesExist) {
      await deleteMatchStatsByMatchId(matchId);
      await deleteMatchFromSupabase(matchId);
    }
  };

  // Pull latest data from Supabase manually
  const handlePullFromSupabase = async () => {
    const remotePlayers = await fetchPlayersFromSupabase();
    if (remotePlayers && remotePlayers.length > 0) {
      setPlayers(remotePlayers);
    }
    const remoteEvals = await fetchEvaluationsFromSupabase();
    if (remoteEvals && Object.keys(remoteEvals).length > 0) {
      setEvaluations(remoteEvals);
    }
    const remoteMatches = await fetchMatchesFromSupabase();
    if (remoteMatches && remoteMatches.length > 0) {
      setMatches(remoteMatches);
    }
    const remoteMatchStats = await fetchMatchStatsFromSupabase();
    if (remoteMatchStats && remoteMatchStats.length > 0) {
      setMatchStats(remoteMatchStats);
    }
  };

  // Filter players for Plantilla tab
  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      `${player.nombre} ${player.apellido}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.dorsal.toString().includes(searchQuery);

    const matchesPosition =
      selectedPosition === 'TODOS' || player.posicion.toUpperCase() === selectedPosition;

    return matchesSearch && matchesPosition;
  });

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-[#031533] text-slate-100' : 'bg-slate-100 text-slate-900'
    } flex flex-col selection:bg-red-600 selection:text-white transition-colors duration-200`}>
      {/* Header with Blue Background, Red Border & Supabase Connection */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        playerCount={players.length}
        evaluationsCount={totalEvaluationsCount}
        matchCount={matches.length}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        supabaseStatus={supabaseStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banner with Club Info and Supabase Cloud Indicator */}
        <div className={`mb-6 ${
          isDark ? 'bg-[#061d47] text-white' : 'bg-white text-slate-900 shadow-sm'
        } border-2 border-red-600 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg transition-colors`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600 text-white font-athletic text-2xl font-black flex items-center justify-center border border-red-400 shrink-0">
              U
            </div>
            <div>
              <h2 className={`text-lg font-bold font-athletic uppercase tracking-wide ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {activeTab === 'plantilla'
                  ? `Plantel Profesional (${players.length} Jugadores)`
                  : 'Sistema de Historial de Evaluaciones Deportivas'}
              </h2>
              <p className={`text-xs ${isDark ? 'text-blue-200/80' : 'text-slate-600'}`}>
                {activeTab === 'plantilla'
                  ? 'Plantilla oficial con opciones para agregar, editar y eliminar jugadores, además de acceder al historial.'
                  : 'Historial de evaluaciones con Fecha y puntuaciones de Técnica, Táctica y Condicional (1 al 5).'}
              </p>
            </div>
          </div>

          {/* Supabase Status Pill */}
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-red-600/60 transition-colors cursor-pointer ${
              isDark
                ? 'text-blue-100 bg-[#020e26] hover:bg-blue-950'
                : 'text-slate-800 bg-slate-50 hover:bg-slate-200 shadow-xs'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Supabase:</span>
            {supabaseStatus?.tablesExist ? (
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sincronizado
              </span>
            ) : supabaseStatus?.connected ? (
              <span className="text-amber-500 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Tablas pendientes
              </span>
            ) : (
              <span className={isDark ? 'text-blue-300' : 'text-slate-500'}>Conectando...</span>
            )}
          </button>
        </div>

        {/* TAB 1: PLANTILLA */}
        {activeTab === 'plantilla' && (
          <div className="space-y-6">
            {/* Filter, Search Bar & Add Player Action */}
            <div className={`${
              isDark ? 'bg-[#071d44]' : 'bg-white shadow-sm'
            } border-2 border-red-600 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md transition-colors`}>
              {/* Search and Add Player Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-blue-300' : 'text-slate-400'
                  }`} />
                  <input
                    id="input-search-plantilla"
                    type="text"
                    placeholder="Buscar por nombre, apellido o dorsal..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full ${
                      isDark
                        ? 'bg-[#031330] border-blue-900 text-white placeholder-blue-300/50'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    } border focus:border-red-500 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none transition-colors`}
                  />
                </div>

                {/* BOTÓN AGREGAR JUGADOR */}
                <button
                  id="btn-agregar-jugador"
                  onClick={handleOpenAddPlayer}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-red-400 flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Agregar Jugador</span>
                </button>
              </div>

              {/* Position Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto justify-start md:justify-end">
                <span className={`text-xs mr-1 flex items-center gap-1 ${
                  isDark ? 'text-blue-300' : 'text-slate-600'
                }`}>
                  <Filter className="w-3.5 h-3.5 text-red-500" />
                  Posición:
                </span>
                {['TODOS', 'ARQUERO', 'DEFENSA', 'MEDIOCAMPISTA', 'DELANTERO'].map((pos) => {
                  const isSelected = selectedPosition === pos;
                  return (
                    <button
                      key={pos}
                      onClick={() => setSelectedPosition(pos)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors border ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-400 shadow-sm'
                          : isDark
                            ? 'bg-[#031330] text-blue-200 border-blue-900 hover:border-red-500/50 hover:text-white'
                            : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-red-500/50 hover:text-slate-900'
                      }`}
                    >
                      {pos}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid of Players */}
            {filteredPlayers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredPlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    evaluations={evaluations[player.id] || []}
                    onSelectPlayer={(p) => setSelectedPlayerForHistory(p)}
                    onAddNewEvaluation={(p) => handleOpenAddEvaluation(p)}
                    onEditPlayer={(p) => handleOpenEditPlayer(p)}
                    onDeletePlayer={(p) => handleOpenDeletePlayer(p)}
                  />
                ))}
              </div>
            ) : (
              <div className={`${
                isDark ? 'bg-[#071d44] text-blue-200' : 'bg-white text-slate-700 shadow-md'
              } border-2 border-red-600 rounded-xl p-10 text-center transition-colors`}>
                <p className="text-base font-semibold">No se encontraron jugadores con ese criterio.</p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedPosition('TODOS');
                    }}
                    className={`px-4 py-2 ${
                      isDark
                        ? 'bg-[#031330] hover:bg-blue-900 text-blue-200 border-blue-800'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    } rounded-lg text-xs font-bold uppercase tracking-wider border`}
                  >
                    Restablecer filtros
                  </button>
                  <button
                    onClick={handleOpenAddPlayer}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-red-400 flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Agregar Jugador</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EVALUACIONES (Historial con Fecha y Técnica, Táctica y Condicional del 1 al 5) */}
        {activeTab === 'evaluaciones' && (
          <EvaluationsView
            players={players}
            evaluations={evaluations}
            onAddNewEvaluation={handleOpenAddEvaluation}
            onEditEvaluation={handleOpenEditEvaluation}
            onViewHistory={(player) => setSelectedPlayerForHistory(player)}
            onDeleteEvaluation={handleDeleteEvaluation}
          />
        )}

        {/* TAB 3: PARTIDOS Y REGISTRO ESTADÍSTICO */}
        {activeTab === 'estadisticas' && (
          <StatsView
            players={players}
            matches={matches}
            matchStats={matchStats}
            evaluations={(Object.values(evaluations) as PlayerEvaluation[][]).flat()}
            onOpenNewMatchModal={handleOpenNewMatch}
            onEditMatch={handleOpenEditMatch}
            onDeleteMatch={handleDeleteMatch}
            onOpenPlayerHistory={(player) => setSelectedPlayerForHistory(player)}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`${
        isDark
          ? 'bg-[#020f26] border-red-600/60 text-blue-300/70'
          : 'bg-white border-red-600 text-slate-600 shadow-inner'
      } border-t-2 py-6 mt-12 text-center text-xs transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-red-600 text-white font-athletic font-bold flex items-center justify-center text-xs">
              U
            </span>
            <span className={`font-bold uppercase tracking-wider font-athletic ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Club Universidad de Chile
            </span>
            <span>• Plantel Profesional, Estadísticas & Historial</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{players.length} Jugadores</span>
            <span>•</span>
            <span>{matches.length} Partidos</span>
            <span>•</span>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="text-emerald-500 hover:text-emerald-600 font-semibold underline cursor-pointer flex items-center gap-1"
            >
              <Database className="w-3 h-3" />
              <span>Base de Datos Supabase</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPromptModalOpen(true)}
              className="text-red-600 hover:text-red-500 font-semibold underline cursor-pointer"
            >
              Ver Prompt AI Studio
            </button>
          </div>
        </div>
      </footer>

      {/* Player Add / Edit Modal */}
      <PlayerModal
        isOpen={isPlayerModalOpen}
        playerToEdit={selectedPlayerToEdit}
        onClose={() => {
          setIsPlayerModalOpen(false);
          setSelectedPlayerToEdit(null);
        }}
        onSavePlayer={handleSavePlayer}
      />

      {/* Delete Player Confirmation Modal */}
      <DeletePlayerConfirmModal
        isOpen={isDeletePlayerModalOpen}
        player={selectedPlayerToDelete}
        evaluationsCount={selectedPlayerToDelete ? (evaluations[selectedPlayerToDelete.id] || []).length : 0}
        onClose={() => {
          setIsDeletePlayerModalOpen(false);
          setSelectedPlayerToDelete(null);
        }}
        onConfirm={handleConfirmDeletePlayer}
      />

      {/* Evaluation Add / Edit Modal */}
      <EvaluationModal
        isOpen={Boolean(selectedPlayerForEval)}
        player={selectedPlayerForEval}
        evaluationToEdit={selectedEvaluationToEdit}
        onClose={() => {
          setSelectedPlayerForEval(null);
          setSelectedEvaluationToEdit(null);
        }}
        onSaveEvaluation={handleSaveEvaluation}
      />

      {/* Player History Detailed Modal (Evolution chart + Match participation) */}
      <PlayerHistoryModal
        isOpen={Boolean(selectedPlayerForHistory)}
        player={selectedPlayerForHistory}
        evaluations={selectedPlayerForHistory ? evaluations[selectedPlayerForHistory.id] || [] : []}
        matches={matches}
        matchStats={matchStats}
        onClose={() => setSelectedPlayerForHistory(null)}
        onAddNewEvaluation={(player) => {
          handleOpenAddEvaluation(player);
        }}
        onEditEvaluation={(player, evaluation) => {
          handleOpenEditEvaluation(player, evaluation);
        }}
        onDeleteEvaluation={handleDeleteEvaluation}
      />

      {/* Match and Lineup Statistics Modal */}
      <MatchModal
        isOpen={isMatchModalOpen}
        onClose={() => {
          setIsMatchModalOpen(false);
          setSelectedMatchToEdit(null);
        }}
        matchToEdit={selectedMatchToEdit}
        existingStats={selectedMatchToEdit ? matchStats.filter((s) => s.partidoId === selectedMatchToEdit.id) : []}
        players={players}
        onSaveMatch={handleSaveMatch}
      />

      {/* Supabase Sync and Management Modal */}
      <SupabaseSyncModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        status={supabaseStatus}
        onRefreshStatus={refreshSupabaseStatus}
        players={players}
        evaluations={evaluations}
        onPullFromSupabase={handlePullFromSupabase}
      />

      {/* Recommended Prompt Modal */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />
    </div>
  );
}
