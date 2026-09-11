export interface Player {
  id: string;
  nombre: string;
  apellido: string;
  dorsal: number;
  fechaNacimiento: string; // YYYY-MM-DD format
  posicion: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero';
  pieHabil?: 'Derecho' | 'Izquierdo' | 'Ambidiestro';
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

export type PlayerMatchCondition = 'Titular' | 'Suplente' | 'No convocado';

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
}

export interface PlayerAggregatedStats {
  jugador: Player;
  partidosJugados: number;
  titularidades: number;
  suplenciasConMinutos: number;
  suplenciasSinMinutos: number;
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
