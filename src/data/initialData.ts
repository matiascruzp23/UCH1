import { Player, PlayerEvaluation, Match, MatchPlayerStat } from '../types';

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 'uch-1',
    nombre: 'Charles',
    apellido: 'Aránguiz',
    dorsal: 29,
    fechaNacimiento: '1989-04-17',
    posicion: 'Mediocampista',
    pieHabil: 'Derecho',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-2',
    nombre: 'Marcelo',
    apellido: 'Díaz',
    dorsal: 21,
    fechaNacimiento: '1986-12-30',
    posicion: 'Mediocampista',
    pieHabil: 'Derecho',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-3',
    nombre: 'Lucas',
    apellido: 'Assadi',
    dorsal: 10,
    fechaNacimiento: '2004-01-08',
    posicion: 'Mediocampista',
    pieHabil: 'Derecho',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-4',
    nombre: 'Leandro',
    apellido: 'Fernández',
    dorsal: 9,
    fechaNacimiento: '1991-03-12',
    posicion: 'Delantero',
    pieHabil: 'Derecho',
    nacionalidad: 'Argentino'
  },
  {
    id: 'uch-5',
    nombre: 'Matías',
    apellido: 'Zaldivia',
    dorsal: 22,
    fechaNacimiento: '1991-01-22',
    posicion: 'Defensa',
    pieHabil: 'Derecho',
    nacionalidad: 'Chileno-Argentino'
  },
  {
    id: 'uch-6',
    nombre: 'Cristopher',
    apellido: 'Toselli',
    dorsal: 1,
    fechaNacimiento: '1988-06-15',
    posicion: 'Arquero',
    pieHabil: 'Derecho',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-7',
    nombre: 'Franco',
    apellido: 'Calderón',
    dorsal: 2,
    fechaNacimiento: '1995-05-13',
    posicion: 'Defensa',
    pieHabil: 'Derecho',
    nacionalidad: 'Argentino'
  },
  {
    id: 'uch-8',
    nombre: 'Marcelo',
    apellido: 'Morales',
    dorsal: 14,
    fechaNacimiento: '2003-06-06',
    posicion: 'Defensa',
    pieHabil: 'Izquierdo',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-9',
    nombre: 'Fabián',
    apellido: 'Hormazábal',
    dorsal: 17,
    fechaNacimiento: '1996-04-26',
    posicion: 'Defensa',
    pieHabil: 'Derecho',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-10',
    nombre: 'Cristian',
    apellido: 'Palacios',
    dorsal: 30,
    fechaNacimiento: '1990-09-02',
    posicion: 'Delantero',
    pieHabil: 'Derecho',
    nacionalidad: 'Uruguayo'
  }
];

export const INITIAL_EVALUATIONS: PlayerEvaluation[] = [
  // Charles Aránguiz
  {
    id: 'eval-1a',
    jugadorId: 'uch-1',
    tecnica: 5,
    tactica: 4,
    condicional: 3,
    fechaEvaluacion: '2025-01-15',
    tipoEvaluacion: 'Pretemporada',
    evaluador: 'Preparador Físico UdeC',
    notas: 'Inicio de reacondicionamiento aeróbico tras receso. Precisión técnica intacta.'
  },
  {
    id: 'eval-1b',
    jugadorId: 'uch-1',
    tecnica: 5,
    tactica: 5,
    condicional: 4,
    fechaEvaluacion: '2025-02-02',
    tipoEvaluacion: 'Amistoso Formal',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Dominio absoluto de los tiempos del partido y cambios de frente precisos.'
  },
  {
    id: 'eval-1c',
    jugadorId: 'uch-1',
    tecnica: 5,
    tactica: 5,
    condicional: 4,
    fechaEvaluacion: '2025-02-15',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Precisión de pase superlativa (94%), lectura de juego e intensidad constante en transición.'
  },

  // Marcelo Díaz
  {
    id: 'eval-2a',
    jugadorId: 'uch-2',
    tecnica: 5,
    tactica: 5,
    condicional: 3,
    fechaEvaluacion: '2025-01-16',
    tipoEvaluacion: 'Pretemporada',
    evaluador: 'Preparador Físico UdeC',
    notas: 'Liderazgo innato. Cuidado dosificado de cargas musculares en ejercicios de alta intensidad.'
  },
  {
    id: 'eval-2b',
    jugadorId: 'uch-2',
    tecnica: 5,
    tactica: 5,
    condicional: 4,
    fechaEvaluacion: '2025-02-15',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Distribución magistral, posicionamiento impecable frente a centrales y salida limpia.'
  },

  // Lucas Assadi
  {
    id: 'eval-3a',
    jugadorId: 'uch-3',
    tecnica: 4,
    tactica: 3,
    condicional: 4,
    fechaEvaluacion: '2025-01-20',
    tipoEvaluacion: 'Control Físico',
    evaluador: 'Área de Fisiología UdeC',
    notas: 'Excelente agilidad y cambios de ritmo. Trabajo enfocado en decisiones tácticas bajo presión.'
  },
  {
    id: 'eval-3b',
    jugadorId: 'uch-3',
    tecnica: 5,
    tactica: 4,
    condicional: 4,
    fechaEvaluacion: '2025-02-14',
    tipoEvaluacion: 'Entrenamiento Táctico',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Regate en espacio reducido y desequilibrio individual sobresaliente con llegada al gol.'
  },

  // Leandro Fernández
  {
    id: 'eval-4a',
    jugadorId: 'uch-4',
    tecnica: 4,
    tactica: 4,
    condicional: 4,
    fechaEvaluacion: '2025-01-22',
    tipoEvaluacion: 'Control Físico',
    evaluador: 'Preparador Físico UdeC',
    notas: 'Potencia de tren inferior notable en tests de aceleración y fuerza explosiva.'
  },
  {
    id: 'eval-4b',
    jugadorId: 'uch-4',
    tecnica: 4,
    tactica: 4,
    condicional: 5,
    fechaEvaluacion: '2025-02-14',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Potencia de remate de media distancia, movilidad constante y presión asfixiante al rival.'
  },

  // Matías Zaldivia
  {
    id: 'eval-5a',
    jugadorId: 'uch-5',
    tecnica: 3,
    tactica: 5,
    condicional: 4,
    fechaEvaluacion: '2025-01-18',
    tipoEvaluacion: 'Pretemporada',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Mando defensivo y coordinación de la línea de 4 defensores.'
  },
  {
    id: 'eval-5b',
    jugadorId: 'uch-5',
    tecnica: 4,
    tactica: 5,
    condicional: 4,
    fechaEvaluacion: '2025-02-12',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Solidez en duelos aéreos (100% ganados), anticipación limpia y salida prolija con balón.'
  },

  // Cristopher Toselli
  {
    id: 'eval-6a',
    jugadorId: 'uch-6',
    tecnica: 4,
    tactica: 4,
    condicional: 3,
    fechaEvaluacion: '2025-01-25',
    tipoEvaluacion: 'Entrenamiento Específico',
    evaluador: 'Preparador de Arqueros UdeC',
    notas: 'Buenas respuestas en blocaje y juego con los pies bajo presión.'
  },
  {
    id: 'eval-6b',
    jugadorId: 'uch-6',
    tecnica: 4,
    tactica: 4,
    condicional: 4,
    fechaEvaluacion: '2025-02-10',
    tipoEvaluacion: 'Control Físico',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Gran seguridad bajo los tres postes, reflejos en achiques y liderazgo verbal.'
  },

  // Franco Calderón
  {
    id: 'eval-7a',
    jugadorId: 'uch-7',
    tecnica: 3,
    tactica: 4,
    condicional: 4,
    fechaEvaluacion: '2025-01-21',
    tipoEvaluacion: 'Pretemporada',
    evaluador: 'Preparador Físico UdeC',
    notas: 'Firme en el choque y agresividad positiva en la marca zonal.'
  },
  {
    id: 'eval-7b',
    jugadorId: 'uch-7',
    tecnica: 4,
    tactica: 4,
    condicional: 5,
    fechaEvaluacion: '2025-02-11',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Fortaleza física destacada en el marcaje individual cuerpo a cuerpo y cierre de espacios.'
  },

  // Marcelo Morales
  {
    id: 'eval-8a',
    jugadorId: 'uch-8',
    tecnica: 3,
    tactica: 3,
    condicional: 5,
    fechaEvaluacion: '2025-01-19',
    tipoEvaluacion: 'Control Físico',
    evaluador: 'Área de Rendimiento UdeC',
    notas: 'Excelente resistencia intermitente y velocidad sostenida en banda.'
  },
  {
    id: 'eval-8b',
    jugadorId: 'uch-8',
    tecnica: 4,
    tactica: 4,
    condicional: 5,
    fechaEvaluacion: '2025-02-13',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Recorrido incansable por banda izquierda, centros con veneno y balance en retroceso.'
  },

  // Fabián Hormazábal
  {
    id: 'eval-9a',
    jugadorId: 'uch-9',
    tecnica: 3,
    tactica: 4,
    condicional: 4,
    fechaEvaluacion: '2025-01-24',
    tipoEvaluacion: 'Entrenamiento Táctico',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Buen entendimiento del carril derecho y sincronización con volantes.'
  },
  {
    id: 'eval-9b',
    jugadorId: 'uch-9',
    tecnica: 4,
    tactica: 4,
    condicional: 5,
    fechaEvaluacion: '2025-02-13',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Velocidad en desdoble, resistencia aeróbica sobresaliente y repliegue veloz.'
  },

  // Cristian Palacios
  {
    id: 'eval-10a',
    jugadorId: 'uch-10',
    tecnica: 4,
    tactica: 3,
    condicional: 4,
    fechaEvaluacion: '2025-01-20',
    tipoEvaluacion: 'Entrenamiento de Definición',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Definición a un toque en el área chica y remates cruzados de primera.'
  },
  {
    id: 'eval-10b',
    jugadorId: 'uch-10',
    tecnica: 4,
    tactica: 4,
    condicional: 4,
    fechaEvaluacion: '2025-02-14',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Olfato goleador intacto, desmarques de ruptura oportunos y gran anticipación a los centrales.'
  }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match-1',
    rival: 'Colo-Colo',
    fecha: '2025-02-16',
    torneo: 'Campeonato Nacional',
    condicion: 'Local',
    golesFavor: 2,
    golesContra: 1,
    estadio: 'Estadio Nacional',
    jornada: 'Fecha 1',
    notas: 'Superclásico chileno. Gran victoria en el Estadio Nacional con tantos de Palacios y Fernández.'
  },
  {
    id: 'match-2',
    rival: 'Cobreloa',
    fecha: '2025-02-23',
    torneo: 'Campeonato Nacional',
    condicion: 'Visita',
    golesFavor: 3,
    golesContra: 1,
    estadio: 'Zorros del Desierto',
    jornada: 'Fecha 2',
    notas: 'Sólido triunfo en la altura con destacada actuación colectiva y contragolpes fulminantes.'
  },
  {
    id: 'match-3',
    rival: 'Coquimbo Unido',
    fecha: '2025-03-02',
    torneo: 'Campeonato Nacional',
    condicion: 'Local',
    golesFavor: 1,
    golesContra: 0,
    estadio: 'Estadio Nacional',
    jornada: 'Fecha 3',
    notas: 'Victoria trabajada con arco en cero gracias a intervenciones clave de Toselli y Zaldivia.'
  }
];

export const INITIAL_MATCH_STATS: MatchPlayerStat[] = [
  // --- PARTIDO 1: vs Colo-Colo (2 - 1) ---
  {
    id: 'stat-m1-p6',
    partidoId: 'match-1',
    jugadorId: 'uch-6', // Toselli
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p9',
    partidoId: 'match-1',
    jugadorId: 'uch-9', // Hormazábal
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 1,
    tarjetasAmarillas: 1,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p7',
    partidoId: 'match-1',
    jugadorId: 'uch-7', // Calderón
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p5',
    partidoId: 'match-1',
    jugadorId: 'uch-5', // Zaldivia
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 1,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p8',
    partidoId: 'match-1',
    jugadorId: 'uch-8', // Morales
    condicionJugador: 'Titular',
    minutosJugados: 82,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p2',
    partidoId: 'match-1',
    jugadorId: 'uch-2', // Díaz
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p1',
    partidoId: 'match-1',
    jugadorId: 'uch-1', // Aránguiz
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p4',
    partidoId: 'match-1',
    jugadorId: 'uch-4', // Fernández
    condicionJugador: 'Titular',
    minutosJugados: 88,
    goles: 1,
    asistencias: 0,
    tarjetasAmarillas: 1,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p10',
    partidoId: 'match-1',
    jugadorId: 'uch-10', // Palacios
    condicionJugador: 'Titular',
    minutosJugados: 75,
    goles: 1,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p3',
    partidoId: 'match-1',
    jugadorId: 'uch-3', // Assadi
    condicionJugador: 'Suplente',
    minutosJugados: 15,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },

  // --- PARTIDO 2: vs Cobreloa (3 - 1) ---
  {
    id: 'stat-m2-p6',
    partidoId: 'match-2',
    jugadorId: 'uch-6', // Toselli
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p9',
    partidoId: 'match-2',
    jugadorId: 'uch-9', // Hormazábal
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 1,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p7',
    partidoId: 'match-2',
    jugadorId: 'uch-7', // Calderón
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 1,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p5',
    partidoId: 'match-2',
    jugadorId: 'uch-5', // Zaldivia
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p8',
    partidoId: 'match-2',
    jugadorId: 'uch-8', // Morales
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p2',
    partidoId: 'match-2',
    jugadorId: 'uch-2', // Díaz
    condicionJugador: 'Titular',
    minutosJugados: 78,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p1',
    partidoId: 'match-2',
    jugadorId: 'uch-1', // Aránguiz
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 1,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p4',
    partidoId: 'match-2',
    jugadorId: 'uch-4', // Fernández
    condicionJugador: 'Titular',
    minutosJugados: 70,
    goles: 1,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p10',
    partidoId: 'match-2',
    jugadorId: 'uch-10', // Palacios
    condicionJugador: 'Titular',
    minutosJugados: 85,
    goles: 0,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p3',
    partidoId: 'match-2',
    jugadorId: 'uch-3', // Assadi
    condicionJugador: 'Suplente',
    minutosJugados: 20,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },

  // --- PARTIDO 3: vs Coquimbo Unido (1 - 0) ---
  {
    id: 'stat-m3-p6',
    partidoId: 'match-3',
    jugadorId: 'uch-6', // Toselli
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p9',
    partidoId: 'match-3',
    jugadorId: 'uch-9', // Hormazábal
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p7',
    partidoId: 'match-3',
    jugadorId: 'uch-7', // Calderón
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 1,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p5',
    partidoId: 'match-3',
    jugadorId: 'uch-5', // Zaldivia
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p8',
    partidoId: 'match-3',
    jugadorId: 'uch-8', // Morales
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 1,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p2',
    partidoId: 'match-3',
    jugadorId: 'uch-2', // Díaz
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p1',
    partidoId: 'match-3',
    jugadorId: 'uch-1', // Aránguiz
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p3',
    partidoId: 'match-3',
    jugadorId: 'uch-3', // Assadi
    condicionJugador: 'Titular',
    minutosJugados: 68,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p4',
    partidoId: 'match-3',
    jugadorId: 'uch-4', // Fernández
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 1,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p10',
    partidoId: 'match-3',
    jugadorId: 'uch-10', // Palacios
    condicionJugador: 'Titular',
    minutosJugados: 75,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  }
];
