export interface Player {
  id: string;
  nombre: string;
  apellido: string;
  dorsal: number;
  fechaNacimiento: string; // YYYY-MM-DD format
  posicion: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero';
  posicionDetallada?: string; // e.g., 'Portero', 'Defensa central', 'Lateral derecho', 'Pivote', 'Delantero centro', etc.
  pieHabil?: 'Derecho' | 'Izquierdo' | 'Ambidiestro';
  altura?: string; // e.g., '1,88m'
  nacionalidad?: string;
  fotoUrl?: string;
}

export interface PlayerEvaluation {
  id: string;
  jugadorId: string;
  tecnica: number;    // 1 to 5
  tactica: number;    // 1 to 5
  condicional: number; // 1 to 5
  fechaEvaluacion: string; // YYYY-MM-DD
  evaluador?: string;
  tipoEvaluacion?: string; // e.g., 'Partido Oficial', 'Entrenamiento', 'Control Físico', 'Pretemporada'
  notas?: string;
}

export interface Match {
  id: string;
  rival: string;
  fecha: string; // YYYY-MM-DD
  torneo: string; // e.g., 'Campeonato Nacional', 'Copa Chile', 'Copa Libertadores', 'Amistoso'
  condicion: 'Local' | 'Visita';
  golesFavor: number;
  golesContra: number;
  estadio?: string;
  jornada?: string; // e.g., 'Fecha 1', 'Fecha 2', 'Clásico'
  notas?: string;
}

export type PlayerMatchCondition =
  | 'Titular'
  | 'Suplente que ingresa'
  | 'Suplente que no ingresa'
  | 'No citado'
  | 'Suspendido'
  | 'Lesionado'
  | 'Suplente'
  | 'No convocado';

export interface PitchSlot {
  slotId: string;
  posicionTag: string; // 'PO', 'DFC', 'LD', 'LI', 'MCD', 'MC', 'MCO', 'ED', 'EI', 'DC'
  label: string;
  x: number; // Percentage 0 - 100
  y: number; // Percentage 0 - 100
  jugadorId?: string;
}

export interface Match {
  id: string;
  rival: string;
  fecha: string; // YYYY-MM-DD
  torneo: string; // e.g., 'Campeonato Nacional', 'Copa Chile', 'Copa Libertadores', 'Amistoso'
  condicion: 'Local' | 'Visita';
  golesFavor: number;
  golesContra: number;
  estadio?: string;
  jornada?: string; // e.g., 'Fecha 1', 'Fecha 2', 'Clásico'
  notas?: string;
  formacion?: string; // e.g., '4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2', '3-4-3'
  titularesSlots?: Record<string, string>; // slotId -> jugadorId
}

export interface MatchPlayerStat {
  id: string;
  partidoId: string;
  jugadorId: string;
  condicionJugador: PlayerMatchCondition;
  minutosJugados: number; // 0-90+
  goles: number;
  asistencias: number;
  tarjetasAmarillas: number; // 0, 1, 2
  tarjetasRojas: number; // 0, 1
  notas?: string;
  slotId?: string;
  posicionTactico?: string;
  minutoIngreso?: number;
}

export interface PlayerAggregatedStats {
  jugador: Player;
  partidosJugados: number;
  titularidades: number;
  suplenciasConMinutos: number;
  suplenciasSinMinutos: number;
  noCitado: number;
  suspendido: number;
  lesionado: number;
  minutosTotales: number;
  golesTotales: number;
  asistenciasTotales: number;
  tarjetasAmarillasTotales: number;
  tarjetasRojasTotales: number;
  promedioTecnica?: number;
  promedioTactica?: number;
  promedioCondicional?: number;
}

export type TabType = 'plantilla' | 'evaluaciones' | 'estadisticas';
