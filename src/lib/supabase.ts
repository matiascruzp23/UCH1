import { createClient } from '@supabase/supabase-js';
import { Player, PlayerEvaluation } from '../types';

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

// SQL Script ready to run in Supabase SQL Editor
export const SUPABASE_SQL_SCRIPT = `-- =======================================================
-- SCRIPT DE INICIALIZACIÓN: UNIVERSIDAD DE CHILE EN SUPABASE
-- Ejecuta este script en el "SQL Editor" de tu proyecto Supabase:
-- https://supabase.com/dashboard/project/ggilenmealydjwbxwdbb/sql
-- =======================================================

-- 1. Tabla de Jugadores
create table if not exists public.players (
  id text primary key,
  nombre text not null,
  apellido text not null,
  dorsal integer not null,
  posicion text not null,
  fecha_nacimiento text not null,
  nacionalidad text,
  pie_habil text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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

-- 3. Habilitar Row Level Security (RLS)
alter table public.players enable row level security;
alter table public.evaluations enable row level security;

-- 4. Crear Políticas de Acceso Público para la clave Anon
drop policy if exists "Acceso total a players" on public.players;
create policy "Acceso total a players" on public.players
  for all using (true) with check (true);

drop policy if exists "Acceso total a evaluations" on public.evaluations;
create policy "Acceso total a evaluations" on public.evaluations
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
    const payload = {
      id: player.id,
      nombre: player.nombre,
      apellido: player.apellido,
      dorsal: player.dorsal,
      posicion: player.posicion,
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
