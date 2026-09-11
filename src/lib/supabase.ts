import { createClient } from '@supabase/supabase-js';
import { Player, PlayerEvaluation, Match, MatchPlayerStat } from '../types';

// Default configuration with the user's provided Supabase credentials
const RAW_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ggilenmealydjwbxwdbb.supabase.co';
// Sanitize URL by removing /rest/v1 or trailing slashes to match Supabase SDK expectations
export const SUPABASE_URL = RAW_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnaWxlbm1lYWx5ZGp3Ynh3ZGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNTU5MDYsImV4cCI6MjEwNDYzMTkwNn0.oppPi33a457ga0llZL_wKTrKZJDspx2XLsvwLcW6uqY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseStatus {
  connected: boolean;
  tablesExist: boolean;
  message: string;
  lastChecked: Date;
}

// SQL Script specifically to update the 23 players and add new columns
export const SUPABASE_PLAYERS_UPDATE_SQL = `-- ==============================================================================
-- SCRIPT SQL: ACTUALIZACIÓN DE PLANTEL UNIVERSIDAD DE CHILE (23 JUGADORES)
-- Agrega columnas 'posicion_detallada' y 'altura' y actualiza la información completa
-- Ejecutar en: https://supabase.com/dashboard/project/ggilenmealydjwbxwdbb/sql
-- ==============================================================================

-- 1. Crear tabla si no existe
create table if not exists public.players (
  id text primary key,
  nombre text not null,
  apellido text not null,
  dorsal integer not null,
  posicion text not null,
  posicion_detallada text,
  fecha_nacimiento text not null,
  nacionalidad text,
  pie_habil text,
  altura text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Asegurar que las nuevas columnas existan si la tabla ya estaba creada
alter table public.players add column if not exists posicion_detallada text;
alter table public.players add column if not exists altura text;

-- 3. Habilitar RLS y política de acceso público
alter table public.players enable row level security;
drop policy if exists "Acceso total a players" on public.players;
create policy "Acceso total a players" on public.players
  for all using (true) with check (true);

-- 4. Insertar o Actualizar los 23 Jugadores Oficiales
insert into public.players (
  id, nombre, apellido, dorsal, posicion, posicion_detallada,
  fecha_nacimiento, nacionalidad, pie_habil, altura
) values
  -- Arqueros
  ('uch-25', 'Gabriel', 'Castellón', 25, 'Arquero', 'Portero', '1993-09-08', 'Chileno', 'Derecho', '1,88m'),
  ('uch-1', 'Cristopher', 'Toselli', 1, 'Arquero', 'Portero', '1988-06-15', 'Chileno / Italiano', 'Derecho', '1,83m'),

  -- Defensas
  ('uch-3', 'Igor', 'Lichnovsky', 3, 'Defensa', 'Defensa central', '1994-03-07', 'Chileno / Austríaco', 'Derecho', '1,87m'),
  ('uch-5', 'Nicolás', 'Ramírez', 5, 'Defensa', 'Defensa central', '1997-05-01', 'Chileno', 'Derecho', '1,82m'),
  ('uch-31', 'Bianneider', 'Tamayo', 31, 'Defensa', 'Defensa central', '2005-01-13', 'Venezolano', 'Izquierdo', '1,84m'),
  ('uch-22', 'Matías', 'Zaldivia', 22, 'Defensa', 'Defensa central', '1991-01-22', 'Chileno / Argentino', 'Derecho', '1,81m'),
  ('uch-14', 'Marcelo', 'Morales', 14, 'Defensa', 'Lateral izquierdo', '2003-06-06', 'Chileno', 'Izquierdo', '1,76m'),
  ('uch-4', 'Diego', 'Vargas', 4, 'Defensa', 'Lateral izquierdo', '2006-08-31', 'Chileno', 'Izquierdo', '1,74m'),
  ('uch-17', 'Fabián', 'Hormazábal', 17, 'Defensa', 'Lateral derecho', '1996-04-26', 'Chileno', 'Derecho', '1,76m'),
  ('uch-6', 'Nicolás', 'Fernández', 6, 'Defensa', 'Lateral derecho', '1999-08-03', 'Chileno', 'Derecho', '1,73m'),

  -- Mediocampistas
  ('uch-29', 'Lucas', 'Barrera', 29, 'Mediocampista', 'Pivote', '2006-04-21', 'Argentino', 'Derecho', '1,82m'),
  ('uch-21', 'Marcelo', 'Díaz', 21, 'Mediocampista', 'Pivote', '1986-12-30', 'Chileno', 'Derecho', '1,67m'),
  ('uch-8', 'Israel', 'Poblete', 8, 'Mediocampista', 'Mediocentro', '1995-06-22', 'Chileno', 'Derecho', '1,72m'),
  ('uch-15', 'Tobías', 'Reinhart', 15, 'Mediocampista', 'Mediocentro', '2000-05-21', 'Argentino / Italiano', 'Derecho', '1,76m'),
  ('uch-20', 'Charles', 'Aránguiz', 20, 'Mediocampista', 'Mediocentro', '1989-04-17', 'Chileno', 'Derecho', '1,72m'),
  ('uch-19', 'Javier', 'Altamirano', 19, 'Mediocampista', 'Mediocentro ofensivo', '1999-08-21', 'Chileno', 'Izquierdo', '1,73m'),
  ('uch-28', 'Agustín', 'Arce', 28, 'Mediocampista', 'Mediocentro ofensivo', '2005-01-24', 'Chileno', 'Derecho', '1,80m'),

  -- Delanteros
  ('uch-23', 'Ignacio', 'Vásquez', 23, 'Delantero', 'Extremo izquierdo', '2006-05-22', 'Chileno', 'Derecho', '1,71m'),
  ('uch-7', 'Maximiliano', 'Guerrero', 7, 'Delantero', 'Extremo derecho', '2000-01-15', 'Chileno', 'Derecho', '1,72m'),
  ('uch-32', 'Gonzalo', 'Reyna', 32, 'Delantero', 'Extremo derecho', '2006-07-23', 'Argentino', 'Izquierdo', '1,71m'),
  ('uch-18', 'Juan Martín', 'Lucero', 18, 'Delantero', 'Delantero centro', '1991-10-10', 'Argentino', 'Derecho', '1,83m'),
  ('uch-9', 'Octavio', 'Rivero', 9, 'Delantero', 'Delantero centro', '1992-01-24', 'Uruguayo / Español', 'Derecho', '1,84m'),
  ('uch-11', 'Eduardo', 'Vargas', 11, 'Delantero', 'Delantero centro', '1989-11-20', 'Chileno', 'Derecho', '1,73m')
on conflict (id) do update set
  nombre = excluded.nombre,
  apellido = excluded.apellido,
  dorsal = excluded.dorsal,
  posicion = excluded.posicion,
  posicion_detallada = excluded.posicion_detallada,
  fecha_nacimiento = excluded.fecha_nacimiento,
  nacionalidad = excluded.nacionalidad,
  pie_habil = excluded.pie_habil,
  altura = excluded.altura;
`;

// SQL Script ONLY for the Statistics & Matches tables
export const SUPABASE_STATS_SQL_SCRIPT = `-- =======================================================
-- SCRIPT SQL: REGISTRO ESTADÍSTICO Y PARTIDOS (SUPABASE)
-- Universidad de Chile - Módulo de Estadísticas y Minutos
-- Ejecuta este script en: https://supabase.com/dashboard/project/ggilenmealydjwbxwdbb/sql
-- =======================================================

-- 1. Tabla de Partidos (Matches)
create table if not exists public.matches (
  id text primary key,
  rival text not null,
  fecha date not null,
  torneo text not null,
  condicion text not null check (condicion in ('Local', 'Visita')),
  goles_favor integer not null default 0 check (goles_favor >= 0),
  goles_contra integer not null default 0 check (goles_contra >= 0),
  estadio text,
  jornada text,
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabla de Estadísticas de Jugadores por Partido (Match Player Stats)
create table if not exists public.match_player_stats (
  id text primary key,
  partido_id text not null references public.matches(id) on delete cascade,
  jugador_id text not null references public.players(id) on delete cascade,
  condicion_jugador text not null check (condicion_jugador in ('Titular', 'Suplente que ingresa', 'Suplente que no ingresa', 'No citado', 'Suspendido', 'Lesionado', 'Suplente', 'No convocado')),
  minutos_jugados integer not null default 0 check (minutos_jugados >= 0),
  goles integer not null default 0 check (goles >= 0),
  asistencias integer not null default 0 check (asistencias >= 0),
  tarjetas_amarillas integer not null default 0 check (tarjetas_amarillas >= 0),
  tarjetas_rojas integer not null default 0 check (tarjetas_rojas >= 0),
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_partido_jugador unique (partido_id, jugador_id)
);

-- Actualización segura si la tabla ya existía con el constraint anterior
alter table public.match_player_stats drop constraint if exists match_player_stats_condicion_jugador_check;
alter table public.match_player_stats add constraint match_player_stats_condicion_jugador_check 
  check (condicion_jugador in ('Titular', 'Suplente que ingresa', 'Suplente que no ingresa', 'No citado', 'Suspendido', 'Lesionado', 'Suplente', 'No convocado'));

-- 3. Índices para acelerar consultas y ordenamientos
create index if not exists idx_matches_fecha on public.matches(fecha desc);
create index if not exists idx_match_stats_partido on public.match_player_stats(partido_id);
create index if not exists idx_match_stats_jugador on public.match_player_stats(jugador_id);

-- 4. Habilitar Row Level Security (RLS)
alter table public.matches enable row level security;
alter table public.match_player_stats enable row level security;

-- 5. Crear Políticas de Acceso Público para la clave Anon
drop policy if exists "Acceso total a matches" on public.matches;
create policy "Acceso total a matches" on public.matches
  for all using (true) with check (true);

drop policy if exists "Acceso total a match_player_stats" on public.match_player_stats;
create policy "Acceso total a match_player_stats" on public.match_player_stats
  for all using (true) with check (true);
`;

// Complete Unified SQL Script for ALL tables (Players + Evaluations + Matches + Stats)
export const SUPABASE_SQL_SCRIPT = `-- =======================================================
-- SCRIPT COMPLETO UNIFICADO: UNIVERSIDAD DE CHILE EN SUPABASE
-- Incluye: Plantel, Evaluaciones y Registro Estadístico de Partidos
-- Ejecuta en el SQL Editor: https://supabase.com/dashboard/project/ggilenmealydjwbxwdbb/sql
-- =======================================================

-- 1. Tabla de Jugadores
create table if not exists public.players (
  id text primary key,
  nombre text not null,
  apellido text not null,
  dorsal integer not null,
  posicion text not null,
  posicion_detallada text,
  fecha_nacimiento text not null,
  nacionalidad text,
  pie_habil text,
  altura text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Migración segura si la tabla ya existía
alter table public.players add column if not exists posicion_detallada text;
alter table public.players add column if not exists altura text;

-- 2. Tabla de Evaluaciones con Historial (1 al 5)
create table if not exists public.evaluations (
  id text primary key,
  jugador_id text not null references public.players(id) on delete cascade,
  tecnica integer not null check (tecnica between 1 and 5),
  tactica integer not null check (tactica between 1 and 5),
  condicional integer not null check (condicional between 1 and 5),
  fecha_evaluacion date not null,
  tipo_evaluacion text,
  evaluador text,
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabla de Partidos (Matches)
create table if not exists public.matches (
  id text primary key,
  rival text not null,
  fecha date not null,
  torneo text not null,
  condicion text not null check (condicion in ('Local', 'Visita')),
  goles_favor integer not null default 0 check (goles_favor >= 0),
  goles_contra integer not null default 0 check (goles_contra >= 0),
  estadio text,
  jornada text,
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabla de Estadísticas de Jugadores por Partido
create table if not exists public.match_player_stats (
  id text primary key,
  partido_id text not null references public.matches(id) on delete cascade,
  jugador_id text not null references public.players(id) on delete cascade,
  condicion_jugador text not null check (condicion_jugador in ('Titular', 'Suplente', 'No convocado')),
  minutos_jugados integer not null default 0 check (minutos_jugados >= 0),
  goles integer not null default 0 check (goles >= 0),
  asistencias integer not null default 0 check (asistencias >= 0),
  tarjetas_amarillas integer not null default 0 check (tarjetas_amarillas >= 0),
  tarjetas_rojas integer not null default 0 check (tarjetas_rojas >= 0),
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_partido_jugador unique (partido_id, jugador_id)
);

-- 5. Habilitar Row Level Security (RLS)
alter table public.players enable row level security;
alter table public.evaluations enable row level security;
alter table public.matches enable row level security;
alter table public.match_player_stats enable row level security;

-- 6. Crear Políticas de Acceso Público para la clave Anon
drop policy if exists "Acceso total a players" on public.players;
create policy "Acceso total a players" on public.players
  for all using (true) with check (true);

drop policy if exists "Acceso total a evaluations" on public.evaluations;
create policy "Acceso total a evaluations" on public.evaluations
  for all using (true) with check (true);

drop policy if exists "Acceso total a matches" on public.matches;
create policy "Acceso total a matches" on public.matches
  for all using (true) with check (true);

drop policy if exists "Acceso total a match_player_stats" on public.match_player_stats;
create policy "Acceso total a match_player_stats" on public.match_player_stats
  for all using (true) with check (true);
`;

/**
 * Check if connection works and whether players & evaluations tables exist
 */
export async function checkSupabaseStatus(): Promise<SupabaseStatus> {
  try {
    const { error: playersErr } = await supabase.from('players').select('id').limit(1);

    if (playersErr) {
      if (playersErr.code === 'PGRST205' || playersErr.message.includes('Could not find the table')) {
        return {
          connected: true,
          tablesExist: false,
          message: 'Conectado a Supabase, pero falta ejecutar el script SQL para crear las tablas "players" y "evaluations".',
          lastChecked: new Date()
        };
      }
      return {
        connected: false,
        tablesExist: false,
        message: `Error al conectar: ${playersErr.message}`,
        lastChecked: new Date()
      };
    }

    return {
      connected: true,
      tablesExist: true,
      message: 'Conexión activa con Supabase. Tablas sincronizadas.',
      lastChecked: new Date()
    };
  } catch (err: any) {
    return {
      connected: false,
      tablesExist: false,
      message: err?.message || 'Error inesperado al conectar con Supabase.',
      lastChecked: new Date()
    };
  }
}

/**
 * Fetch all players from Supabase
 */
export async function fetchPlayersFromSupabase(): Promise<Player[] | null> {
  try {
    const { data, error } = await supabase.from('players').select('*').order('dorsal', { ascending: true });
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      nombre: row.nombre,
      apellido: row.apellido,
      dorsal: row.dorsal,
      posicion: row.posicion,
      posicionDetallada: row.posicion_detallada || row.posicion,
      altura: row.altura || undefined,
      fechaNacimiento: row.fecha_nacimiento,
      nacionalidad: row.nacionalidad,
      pieHabil: row.pie_habil
    }));
  } catch (err) {
    console.error('Error fetching players from Supabase', err);
    return null;
  }
}

/**
 * Save / Upsert a player to Supabase
 */
export async function savePlayerToSupabase(player: Player): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: any = {
      id: player.id,
      nombre: player.nombre,
      apellido: player.apellido,
      dorsal: player.dorsal,
      posicion: player.posicion,
      posicion_detallada: player.posicionDetallada || player.posicion,
      altura: player.altura || null,
      fecha_nacimiento: player.fechaNacimiento,
      nacionalidad: player.nacionalidad || null,
      pie_habil: player.pieHabil || null
    };

    const { error } = await supabase.from('players').upsert(payload);
    if (error) {
      console.warn('Supabase player upsert error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al guardar jugador en Supabase' };
  }
}

/**
 * Delete a player from Supabase
 */
export async function deletePlayerFromSupabase(playerId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('players').delete().eq('id', playerId);
    if (error) {
      console.warn('Supabase player delete error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al eliminar jugador de Supabase' };
  }
}

/**
 * Fetch all evaluations from Supabase grouped by player ID
 */
export async function fetchEvaluationsFromSupabase(): Promise<Record<string, PlayerEvaluation[]> | null> {
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .order('fecha_evaluacion', { ascending: false });

    if (error || !data) return null;

    const map: Record<string, PlayerEvaluation[]> = {};
    data.forEach((row: any) => {
      const pId = row.jugador_id;
      if (!map[pId]) {
        map[pId] = [];
      }
      map[pId].push({
        id: row.id,
        jugadorId: row.jugador_id,
        tecnica: row.tecnica,
        tactica: row.tactica,
        condicional: row.condicional,
        fechaEvaluacion: row.fecha_evaluacion,
        tipoEvaluacion: row.tipo_evaluacion,
        evaluador: row.evaluador,
        notas: row.notas
      });
    });

    return map;
  } catch (err) {
    console.error('Error fetching evaluations from Supabase', err);
    return null;
  }
}

/**
 * Save / Upsert a single evaluation to Supabase
 */
export async function saveEvaluationToSupabase(evaluation: PlayerEvaluation): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: evaluation.id,
      jugador_id: evaluation.jugadorId,
      tecnica: evaluation.tecnica,
      tactica: evaluation.tactica,
      condicional: evaluation.condicional,
      fecha_evaluacion: evaluation.fechaEvaluacion,
      tipo_evaluacion: evaluation.tipoEvaluacion || null,
      evaluador: evaluation.evaluador || null,
      notas: evaluation.notas || null
    };

    const { error } = await supabase.from('evaluations').upsert(payload);
    if (error) {
      console.warn('Supabase evaluation upsert warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al guardar en Supabase' };
  }
}

/**
 * Delete an evaluation from Supabase
 */
export async function deleteEvaluationFromSupabase(evalId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('evaluations').delete().eq('id', evalId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al eliminar de Supabase' };
  }
}

/**
 * Seed initial dataset (10 players and all historical evaluations) to Supabase
 */
export async function seedInitialDataToSupabase(
  players: Player[],
  evaluations: PlayerEvaluation[]
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Insert players
    const playersPayload = players.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      apellido: p.apellido,
      dorsal: p.dorsal,
      posicion: p.posicion,
      posicion_detallada: p.posicionDetallada || p.posicion,
      altura: p.altura || null,
      fecha_nacimiento: p.fechaNacimiento,
      nacionalidad: p.nacionalidad || null,
      pie_habil: p.pieHabil || null
    }));

    const { error: playersErr } = await supabase.from('players').upsert(playersPayload);
    if (playersErr) {
      return { success: false, message: `Error al guardar jugadores: ${playersErr.message}` };
    }

    // 2. Insert evaluations
    const evalPayload = evaluations.map((e) => ({
      id: e.id,
      jugador_id: e.jugadorId,
      tecnica: e.tecnica,
      tactica: e.tactica,
      condicional: e.condicional,
      fecha_evaluacion: e.fechaEvaluacion,
      tipo_evaluacion: e.tipoEvaluacion || null,
      evaluador: e.evaluador || null,
      notas: e.notas || null
    }));

    const { error: evalErr } = await supabase.from('evaluations').upsert(evalPayload);
    if (evalErr) {
      return { success: false, message: `Jugadores guardados, pero hubo un error con las evaluaciones: ${evalErr.message}` };
    }

    return { success: true, message: '¡Plantilla y evaluaciones sincronizadas exitosamente con Supabase!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Error inesperado durante la sincronización' };
  }
}

/**
 * Fetch all matches from Supabase
 */
export async function fetchMatchesFromSupabase(): Promise<Match[] | null> {
  try {
    const { data, error } = await supabase.from('matches').select('*').order('fecha', { ascending: false });
    if (error || !data) return null;

    return data.map((row: any) => {
      let formacion = row.formacion || '4-3-3';
      let titularesSlots = row.titulares_slots || undefined;
      let rawNotas = row.notas || '';

      // Check if tactical metadata is stored inside notas
      const matchMeta = rawNotas.match(/\[TACTICA:(.+?)\]/);
      if (matchMeta && matchMeta[1]) {
        try {
          const parsed = JSON.parse(matchMeta[1]);
          if (parsed.formacion) formacion = parsed.formacion;
          if (parsed.slots) titularesSlots = parsed.slots;
        } catch (e) {
          // Ignore parse errors
        }
      }
      const cleanNotas = rawNotas.replace(/\[TACTICA:.+?\]/, '').trim() || undefined;

      return {
        id: row.id,
        rival: row.rival,
        fecha: row.fecha,
        torneo: row.torneo,
        condicion: row.condicion,
        golesFavor: row.goles_favor ?? 0,
        golesContra: row.goles_contra ?? 0,
        estadio: row.estadio || undefined,
        jornada: row.jornada || undefined,
        notas: cleanNotas,
        formacion,
        titularesSlots
      };
    });
  } catch (err) {
    console.error('Error fetching matches from Supabase', err);
    return null;
  }
}

/**
 * Save / Upsert a single match to Supabase
 */
export async function saveMatchToSupabase(match: Match): Promise<{ success: boolean; error?: string }> {
  try {
    let notasPayload = match.notas || '';
    if (match.formacion || match.titularesSlots) {
      const meta = JSON.stringify({
        formacion: match.formacion || '4-3-3',
        slots: match.titularesSlots || {}
      });
      notasPayload = `${notasPayload ? notasPayload + '\n' : ''}[TACTICA:${meta}]`;
    }

    const payload = {
      id: match.id,
      rival: match.rival,
      fecha: match.fecha,
      torneo: match.torneo,
      condicion: match.condicion,
      goles_favor: match.golesFavor,
      goles_contra: match.golesContra,
      estadio: match.estadio || null,
      jornada: match.jornada || null,
      notas: notasPayload || null
    };

    const { error } = await supabase.from('matches').upsert(payload);
    if (error) {
      console.warn('Supabase match upsert warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al guardar partido en Supabase' };
  }
}

/**
 * Delete a match from Supabase
 */
export async function deleteMatchFromSupabase(matchId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('matches').delete().eq('id', matchId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al eliminar partido de Supabase' };
  }
}

/**
 * Fetch all match player stats from Supabase
 */
export async function fetchMatchStatsFromSupabase(): Promise<MatchPlayerStat[] | null> {
  try {
    const { data, error } = await supabase.from('match_player_stats').select('*');
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      partidoId: row.partido_id,
      jugadorId: row.jugador_id,
      condicionJugador: row.condicion_jugador,
      minutosJugados: row.minutos_jugados ?? 0,
      goles: row.goles ?? 0,
      asistencias: row.asistencias ?? 0,
      tarjetasAmarillas: row.tarjetas_amarillas ?? 0,
      tarjetasRojas: row.tarjetas_rojas ?? 0,
      notas: row.notas || undefined
    }));
  } catch (err) {
    console.error('Error fetching match stats from Supabase', err);
    return null;
  }
}

/**
 * Save / Upsert match player stats to Supabase
 */
export async function saveMatchStatsToSupabase(stats: MatchPlayerStat[]): Promise<{ success: boolean; error?: string }> {
  try {
    if (!stats || stats.length === 0) return { success: true };

    const payload = stats.map((s) => ({
      id: s.id,
      partido_id: s.partidoId,
      jugador_id: s.jugadorId,
      condicion_jugador: s.condicionJugador,
      minutos_jugados: s.minutosJugados,
      goles: s.goles,
      asistencias: s.asistencias,
      tarjetas_amarillas: s.tarjetasAmarillas,
      tarjetas_rojas: s.tarjetasRojas,
      notas: s.notas || null
    }));

    let { error } = await supabase.from('match_player_stats').upsert(payload);
    if (error && error.message && error.message.includes('condicion_jugador')) {
      // Graceful fallback for legacy database check constraint
      const fallbackPayload = payload.map((p) => {
        let cond = p.condicion_jugador;
        if (cond === 'Suplente que ingresa' || cond === 'Suplente que no ingresa') cond = 'Suplente';
        if (cond === 'No citado' || cond === 'Suspendido' || cond === 'Lesionado') cond = 'No convocado';
        return { ...p, condicion_jugador: cond };
      });
      const res = await supabase.from('match_player_stats').upsert(fallbackPayload);
      error = res.error;
    }

    if (error) {
      console.warn('Supabase match stats upsert warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al guardar estadísticas en Supabase' };
  }
}

/**
 * Delete player stats for a given match from Supabase
 */
export async function deleteMatchStatsByMatchId(matchId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('match_player_stats').delete().eq('partido_id', matchId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al eliminar estadísticas del partido' };
  }
}
