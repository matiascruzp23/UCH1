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

export type TabType = 'plantilla' | 'evaluaciones';
