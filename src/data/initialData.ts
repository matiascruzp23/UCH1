import { Player, PlayerEvaluation, Match, MatchPlayerStat } from '../types';

export const INITIAL_PLAYERS: Player[] = [
  // Arqueros
  {
    id: 'uch-25',
    nombre: 'Gabriel',
    apellido: 'Castellón',
    dorsal: 25,
    fechaNacimiento: '1993-09-08',
    posicion: 'Arquero',
    posicionDetallada: 'Portero',
    pieHabil: 'Derecho',
    altura: '1,88m',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-1',
    nombre: 'Cristopher',
    apellido: 'Toselli',
    dorsal: 1,
    fechaNacimiento: '1988-06-15',
    posicion: 'Arquero',
    posicionDetallada: 'Portero',
    pieHabil: 'Derecho',
    altura: '1,83m',
    nacionalidad: 'Chileno / Italiano'
  },

  // Defensas
  {
    id: 'uch-3',
    nombre: 'Igor',
    apellido: 'Lichnovsky',
    dorsal: 3,
    fechaNacimiento: '1994-03-07',
    posicion: 'Defensa',
    posicionDetallada: 'Defensa central',
    pieHabil: 'Derecho',
    altura: '1,87m',
    nacionalidad: 'Chileno / Austríaco'
  },
  {
    id: 'uch-5',
    nombre: 'Nicolás',
    apellido: 'Ramírez',
    dorsal: 5,
    fechaNacimiento: '1997-05-01',
    posicion: 'Defensa',
    posicionDetallada: 'Defensa central',
    pieHabil: 'Derecho',
    altura: '1,82m',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-31',
    nombre: 'Bianneider',
    apellido: 'Tamayo',
    dorsal: 31,
    fechaNacimiento: '2005-01-13',
    posicion: 'Defensa',
    posicionDetallada: 'Defensa central',
    pieHabil: 'Izquierdo',
    altura: '1,84m',
    nacionalidad: 'Venezolano'
  },
  {
    id: 'uch-22',
    nombre: 'Matías',
    apellido: 'Zaldivia',
    dorsal: 22,
    fechaNacimiento: '1991-01-22',
    posicion: 'Defensa',
    posicionDetallada: 'Defensa central',
    pieHabil: 'Derecho',
    altura: '1,81m',
    nacionalidad: 'Chileno / Argentino'
  },
  {
    id: 'uch-14',
    nombre: 'Marcelo',
    apellido: 'Morales',
    dorsal: 14,
    fechaNacimiento: '2003-06-06',
    posicion: 'Defensa',
    posicionDetallada: 'Lateral izquierdo',
    pieHabil: 'Izquierdo',
    altura: '1,76m',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-4',
    nombre: 'Diego',
    apellido: 'Vargas',
    dorsal: 4,
    fechaNacimiento: '2006-08-31',
    posicion: 'Defensa',
    posicionDetallada: 'Lateral izquierdo',
    pieHabil: 'Izquierdo',
    altura: '1,74m',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-17',
    nombre: 'Fabián',
    apellido: 'Hormazábal',
    dorsal: 17,
    fechaNacimiento: '1996-04-26',
    posicion: 'Defensa',
    posicionDetallada: 'Lateral derecho',
    pieHabil: 'Derecho',
    altura: '1,76m',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-6',
    nombre: 'Nicolás',
    apellido: 'Fernández',
    dorsal: 6,
    fechaNacimiento: '1999-08-03',
    posicion: 'Defensa',
    posicionDetallada: 'Lateral derecho',
    pieHabil: 'Derecho',
    altura: '1,73m',
    nacionalidad: 'Chileno'
  },

  // Mediocampistas
  {
    id: 'uch-29',
    nombre: 'Lucas',
    apellido: 'Barrera',
    dorsal: 29,
    fechaNacimiento: '2006-04-21',
    posicion: 'Mediocampista',
    posicionDetallada: 'Pivote',
    pieHabil: 'Derecho',
    altura: '1,82m',
    nacionalidad: 'Argentino'
  },
  {
    id: 'uch-21',
    nombre: 'Marcelo',
    apellido: 'Díaz',
    dorsal: 21,
    fechaNacimiento: '1986-12-30',
    posicion: 'Mediocampista',
    posicionDetallada: 'Pivote',
    pieHabil: 'Derecho',
    altura: '1,67m',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-8',
    nombre: 'Israel',
    apellido: 'Poblete',
    dorsal: 8,
    fechaNacimiento: '1995-06-22',
    posicion: 'Mediocampista',
    posicionDetallada: 'Mediocentro',
    pieHabil: 'Derecho',
    altura: '1,72m',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-15',
    nombre: 'Tobías',
    apellido: 'Reinhart',
    dorsal: 15,
    fechaNacimiento: '2000-05-21',
    posicion: 'Mediocampista',
    posicionDetallada: 'Mediocentro',
    pieHabil: 'Derecho',
    altura: '1,76m',
    nacionalidad: 'Argentino / Italiano'
  },
  {
    id: 'uch-20',
    nombre: 'Charles',
    apellido: 'Aránguiz',
    dorsal: 20,
    fechaNacimiento: '1989-04-17',
    posicion: 'Mediocampista',
    posicionDetallada: 'Mediocentro',
    pieHabil: 'Derecho',
    altura: '1,72m',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-19',
    nombre: 'Javier',
    apellido: 'Altamirano',
    dorsal: 19,
    fechaNacimiento: '1999-08-21',
    posicion: 'Mediocampista',
    posicionDetallada: 'Mediocentro ofensivo',
    pieHabil: 'Izquierdo',
    altura: '1,73m',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-28',
    nombre: 'Agustín',
    apellido: 'Arce',
    dorsal: 28,
    fechaNacimiento: '2005-01-24',
    posicion: 'Mediocampista',
    posicionDetallada: 'Mediocentro ofensivo',
    pieHabil: 'Derecho',
    altura: '1,80m',
    nacionalidad: 'Chileno'
  },

  // Delanteros
  {
    id: 'uch-23',
    nombre: 'Ignacio',
    apellido: 'Vásquez',
    dorsal: 23,
    fechaNacimiento: '2006-05-22',
    posicion: 'Delantero',
    posicionDetallada: 'Extremo izquierdo',
    pieHabil: 'Derecho',
    altura: '1,71m',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-7',
    nombre: 'Maximiliano',
    apellido: 'Guerrero',
    dorsal: 7,
    fechaNacimiento: '2000-01-15',
    posicion: 'Delantero',
    posicionDetallada: 'Extremo derecho',
    pieHabil: 'Derecho',
    altura: '1,72m',
    nacionalidad: 'Chileno'
  },
  {
    id: 'uch-32',
    nombre: 'Gonzalo',
    apellido: 'Reyna',
    dorsal: 32,
    fechaNacimiento: '2006-07-23',
    posicion: 'Delantero',
    posicionDetallada: 'Extremo derecho',
    pieHabil: 'Izquierdo',
    altura: '1,71m',
    nacionalidad: 'Argentino'
  },
  {
    id: 'uch-18',
    nombre: 'Juan Martín',
    apellido: 'Lucero',
    dorsal: 18,
    fechaNacimiento: '1991-10-10',
    posicion: 'Delantero',
    posicionDetallada: 'Delantero centro',
    pieHabil: 'Derecho',
    altura: '1,83m',
    nacionalidad: 'Argentino'
  },
  {
    id: 'uch-9',
    nombre: 'Octavio',
    apellido: 'Rivero',
    dorsal: 9,
    fechaNacimiento: '1992-01-24',
    posicion: 'Delantero',
    posicionDetallada: 'Delantero centro',
    pieHabil: 'Derecho',
    altura: '1,84m',
    nacionalidad: 'Uruguayo / Español'
  },
  {
    id: 'uch-11',
    nombre: 'Eduardo',
    apellido: 'Vargas',
    dorsal: 11,
    fechaNacimiento: '1989-11-20',
    posicion: 'Delantero',
    posicionDetallada: 'Delantero centro',
    pieHabil: 'Derecho',
    altura: '1,73m',
    nacionalidad: 'Chileno'
  }
];

export const INITIAL_EVALUATIONS: PlayerEvaluation[] = [
  // Charles Aránguiz (#20)
  {
    id: 'eval-20a',
    jugadorId: 'uch-20',
    tecnica: 5,
    tactica: 4,
    condicional: 3,
    fechaEvaluacion: '2025-01-15',
    tipoEvaluacion: 'Pretemporada',
    evaluador: 'Preparador Físico UdeC',
    notas: 'Inicio de reacondicionamiento aeróbico. Precisión técnica intacta.'
  },
  {
    id: 'eval-20b',
    jugadorId: 'uch-20',
    tecnica: 5,
    tactica: 5,
    condicional: 4,
    fechaEvaluacion: '2025-02-02',
    tipoEvaluacion: 'Amistoso Formal',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Dominio absoluto de los tiempos del partido y cambios de frente precisos.'
  },
  {
    id: 'eval-20c',
    jugadorId: 'uch-20',
    tecnica: 5,
    tactica: 5,
    condicional: 4,
    fechaEvaluacion: '2025-02-15',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Precisión de pase superlativa (94%), lectura de juego e intensidad constante.'
  },

  // Marcelo Díaz (#21)
  {
    id: 'eval-21a',
    jugadorId: 'uch-21',
    tecnica: 5,
    tactica: 5,
    condicional: 3,
    fechaEvaluacion: '2025-01-16',
    tipoEvaluacion: 'Pretemporada',
    evaluador: 'Preparador Físico UdeC',
    notas: 'Eje organizador, salida limpia bajo presión.'
  },
  {
    id: 'eval-21b',
    jugadorId: 'uch-21',
    tecnica: 5,
    tactica: 5,
    condicional: 4,
    fechaEvaluacion: '2025-02-10',
    tipoEvaluacion: 'Entrenamiento Táctico',
    evaluador: 'Entrenador Principal',
    notas: 'Voz de mando, ubicación posicional de élite y coberturas defensivas impecables.'
  },

  // Gabriel Castellón (#25)
  {
    id: 'eval-25a',
    jugadorId: 'uch-25',
    tecnica: 4,
    tactica: 4,
    condicional: 4,
    fechaEvaluacion: '2025-01-20',
    tipoEvaluacion: 'Entrenamiento de Arqueros',
    evaluador: 'Preparador de Arqueros',
    notas: 'Excelente juego con los pies, reflejos bajo los tres palos y seguridad aérea.'
  },
  {
    id: 'eval-25b',
    jugadorId: 'uch-25',
    tecnica: 5,
    tactica: 5,
    condicional: 5,
    fechaEvaluacion: '2025-02-16',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico',
    notas: 'Valla invicta clave con 4 atajadas determinantes en el clásico.'
  },

  // Igor Lichnovsky (#3)
  {
    id: 'eval-3a',
    jugadorId: 'uch-3',
    tecnica: 4,
    tactica: 5,
    condicional: 4,
    fechaEvaluacion: '2025-01-22',
    tipoEvaluacion: 'Control Táctico',
    evaluador: 'Cuerpo Técnico',
    notas: 'Liderazgo en la zaga central, anticipación en balones divididos y salida limpia.'
  },
  {
    id: 'eval-3b',
    jugadorId: 'uch-3',
    tecnica: 4,
    tactica: 5,
    condicional: 5,
    fechaEvaluacion: '2025-02-12',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico',
    notas: 'Jerarquía total, neutralizó al delantero rival en todos los duelos aéreos.'
  },

  // Matías Zaldivia (#22)
  {
    id: 'eval-22a',
    jugadorId: 'uch-22',
    tecnica: 4,
    tactica: 5,
    condicional: 4,
    fechaEvaluacion: '2025-01-18',
    tipoEvaluacion: 'Pretemporada',
    evaluador: 'Preparador Físico UdeC',
    notas: 'Excelente estado físico, contundencia en los duelos individuales.'
  },
  {
    id: 'eval-22b',
    jugadorId: 'uch-22',
    tecnica: 4,
    tactica: 5,
    condicional: 4,
    fechaEvaluacion: '2025-02-15',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico UdeC',
    notas: 'Pilar defensivo, 7 intercepciones y liderazgo en los cierres de banda.'
  },

  // Eduardo Vargas (#11)
  {
    id: 'eval-11a',
    jugadorId: 'uch-11',
    tecnica: 5,
    tactica: 4,
    condicional: 4,
    fechaEvaluacion: '2025-01-25',
    tipoEvaluacion: 'Entrenamiento Específico de Definición',
    evaluador: 'Cuerpo Técnico',
    notas: 'Instinto goleador intacto, diagonales letales al espacio y remate de primera.'
  },
  {
    id: 'eval-11b',
    jugadorId: 'uch-11',
    tecnica: 5,
    tactica: 5,
    condicional: 5,
    fechaEvaluacion: '2025-02-16',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico',
    notas: 'Doblete decisivo con excelente desmarque a las espaldas de los centrales.'
  },

  // Juan Martín Lucero (#18)
  {
    id: 'eval-18a',
    jugadorId: 'uch-18',
    tecnica: 4,
    tactica: 4,
    condicional: 4,
    fechaEvaluacion: '2025-01-28',
    tipoEvaluacion: 'Entrenamiento Táctico',
    evaluador: 'Cuerpo Técnico',
    notas: 'Capacidad de descarga asociativa de espaldas y movilidad en el área.'
  },
  {
    id: 'eval-18b',
    jugadorId: 'uch-18',
    tecnica: 4,
    tactica: 5,
    condicional: 4,
    fechaEvaluacion: '2025-02-14',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico',
    notas: 'Gol clave y constante desgaste físico a los defensas rivales.'
  },

  // Octavio Rivero (#9)
  {
    id: 'eval-9a',
    jugadorId: 'uch-9',
    tecnica: 4,
    tactica: 4,
    condicional: 4,
    fechaEvaluacion: '2025-02-01',
    tipoEvaluacion: 'Control Físico y Táctico',
    evaluador: 'Cuerpo Técnico',
    notas: 'Potente juego aéreo (1,84m), fijación de centrales y remate potente.'
  },

  // Maximiliano Guerrero (#7)
  {
    id: 'eval-7a',
    jugadorId: 'uch-7',
    tecnica: 4,
    tactica: 4,
    condicional: 5,
    fechaEvaluacion: '2025-01-30',
    tipoEvaluacion: 'Prueba de Velocidad y Resistencia',
    evaluador: 'Preparador Físico',
    notas: 'Velocidad punta sobresaliente y aceleración en banda derecha.'
  },
  {
    id: 'eval-7b',
    jugadorId: 'uch-7',
    tecnica: 4,
    tactica: 4,
    condicional: 5,
    fechaEvaluacion: '2025-02-15',
    tipoEvaluacion: 'Partido Oficial',
    evaluador: 'Cuerpo Técnico',
    notas: 'Desborde punzante, 2 asistencias y retroceso defensivo comprometido.'
  },

  // Marcelo Morales (#14)
  {
    id: 'eval-14a',
    jugadorId: 'uch-14',
    tecnica: 4,
    tactica: 4,
    condicional: 4,
    fechaEvaluacion: '2025-01-20',
    tipoEvaluacion: 'Pretemporada',
    evaluador: 'Preparador Físico',
    notas: 'Gran volumen de juego por banda izquierda y precisión en centros en carrera.'
  },

  // Fabián Hormazábal (#17)
  {
    id: 'eval-17a',
    jugadorId: 'uch-17',
    tecnica: 4,
    tactica: 4,
    condicional: 5,
    fechaEvaluacion: '2025-01-21',
    tipoEvaluacion: 'Pretemporada',
    evaluador: 'Preparador Físico',
    notas: 'Intensidad constante ida y vuelta, buena agresividad defensiva.'
  },

  // Israel Poblete (#8)
  {
    id: 'eval-8a',
    jugadorId: 'uch-8',
    tecnica: 4,
    tactica: 4,
    condicional: 5,
    fechaEvaluacion: '2025-01-24',
    tipoEvaluacion: 'Control Físico',
    evaluador: 'Preparador Físico',
    notas: 'Despliegue mixto incansable y presión alta tras pérdida.'
  },

  // Javier Altamirano (#19)
  {
    id: 'eval-19a',
    jugadorId: 'uch-19',
    tecnica: 5,
    tactica: 4,
    condicional: 4,
    fechaEvaluacion: '2025-01-27',
    tipoEvaluacion: 'Entrenamiento con Balón',
    evaluador: 'Cuerpo Técnico',
    notas: 'Perfil zurdo de altísima calidad asociativa, visión entre líneas.'
  },

  // Ignacio Vásquez (#23)
  {
    id: 'eval-23a',
    jugadorId: 'uch-23',
    tecnica: 5,
    tactica: 3,
    condicional: 4,
    fechaEvaluacion: '2025-01-29',
    tipoEvaluacion: 'Control Juvenil',
    evaluador: 'Cuerpo Técnico',
    notas: 'Gran uno contra uno, encarador nato y desequilibrio individual.'
  },

  // Gonzalo Reyna (#32)
  {
    id: 'eval-32a',
    jugadorId: 'uch-32',
    tecnica: 4,
    tactica: 3,
    condicional: 4,
    fechaEvaluacion: '2025-02-05',
    tipoEvaluacion: 'Entrenamiento Táctico',
    evaluador: 'Cuerpo Técnico',
    notas: 'Zurdo desequilibrante a perfil cambiado, velocidad y cambio de ritmo.'
  }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match-1',
    rival: 'Colo-Colo',
    fecha: '2025-02-09',
    torneo: 'Campeonato Nacional',
    condicion: 'Visita',
    golesFavor: 2,
    golesContra: 1,
    estadio: 'Estadio Monumental',
    jornada: 'Fecha 4',
    notas: 'Histórica victoria en el Superclásico con planteamiento de alta presión y contundencia.'
  },
  {
    id: 'match-2',
    rival: 'Universidad Católica',
    fecha: '2025-02-16',
    torneo: 'Campeonato Nacional',
    condicion: 'Local',
    golesFavor: 3,
    golesContra: 0,
    estadio: 'Estadio Nacional',
    jornada: 'Fecha 5',
    notas: 'Clásico Universitario perfecto: dominio territorial absoluto, valla invicta y eficacia.'
  },
  {
    id: 'match-3',
    rival: 'Audax Italiano',
    fecha: '2025-02-23',
    torneo: 'Campeonato Nacional',
    condicion: 'Local',
    golesFavor: 2,
    golesContra: 0,
    estadio: 'Estadio Nacional',
    jornada: 'Fecha 6',
    notas: 'Sólida victoria con rotación táctica en el mediocampo y delantera.'
  }
];

export const INITIAL_MATCH_STATS: MatchPlayerStat[] = [
  // --- PARTIDO 1: Superclásico vs Colo-Colo (2 - 1) ---
  {
    id: 'stat-m1-p25',
    partidoId: 'match-1',
    jugadorId: 'uch-25', // Castellón
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0,
    notas: 'Gran seguridad en balones cruzados'
  },
  {
    id: 'stat-m1-p17',
    partidoId: 'match-1',
    jugadorId: 'uch-17', // Hormazábal
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 1,
    tarjetasAmarillas: 1,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p3',
    partidoId: 'match-1',
    jugadorId: 'uch-3', // Lichnovsky
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p22',
    partidoId: 'match-1',
    jugadorId: 'uch-22', // Zaldivia
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 1,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p14',
    partidoId: 'match-1',
    jugadorId: 'uch-14', // Morales
    condicionJugador: 'Titular',
    minutosJugados: 85,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p21',
    partidoId: 'match-1',
    jugadorId: 'uch-21', // Díaz
    condicionJugador: 'Titular',
    minutosJugados: 75,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p20',
    partidoId: 'match-1',
    jugadorId: 'uch-20', // Aránguiz
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 1,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p8',
    partidoId: 'match-1',
    jugadorId: 'uch-8', // Poblete
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 1,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p7',
    partidoId: 'match-1',
    jugadorId: 'uch-7', // Guerrero
    condicionJugador: 'Titular',
    minutosJugados: 80,
    goles: 0,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p11',
    partidoId: 'match-1',
    jugadorId: 'uch-11', // Vargas
    condicionJugador: 'Titular',
    minutosJugados: 70,
    goles: 1,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p18',
    partidoId: 'match-1',
    jugadorId: 'uch-18', // Lucero
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p19',
    partidoId: 'match-1',
    jugadorId: 'uch-19', // Altamirano
    condicionJugador: 'Suplente',
    minutosJugados: 15,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m1-p9',
    partidoId: 'match-1',
    jugadorId: 'uch-9', // Rivero
    condicionJugador: 'Suplente',
    minutosJugados: 20,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },

  // --- PARTIDO 2: vs Universidad Católica (3 - 0) ---
  {
    id: 'stat-m2-p25',
    partidoId: 'match-2',
    jugadorId: 'uch-25', // Castellón
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p17',
    partidoId: 'match-2',
    jugadorId: 'uch-17', // Hormazábal
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 1,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p3',
    partidoId: 'match-2',
    jugadorId: 'uch-3', // Lichnovsky
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p22',
    partidoId: 'match-2',
    jugadorId: 'uch-22', // Zaldivia
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p14',
    partidoId: 'match-2',
    jugadorId: 'uch-14', // Morales
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p21',
    partidoId: 'match-2',
    jugadorId: 'uch-21', // Díaz
    condicionJugador: 'Titular',
    minutosJugados: 70,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p20',
    partidoId: 'match-2',
    jugadorId: 'uch-20', // Aránguiz
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 1,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p8',
    partidoId: 'match-2',
    jugadorId: 'uch-8', // Poblete
    condicionJugador: 'Titular',
    minutosJugados: 80,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p7',
    partidoId: 'match-2',
    jugadorId: 'uch-7', // Guerrero
    condicionJugador: 'Titular',
    minutosJugados: 85,
    goles: 0,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p11',
    partidoId: 'match-2',
    jugadorId: 'uch-11', // Vargas
    condicionJugador: 'Titular',
    minutosJugados: 75,
    goles: 1,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p18',
    partidoId: 'match-2',
    jugadorId: 'uch-18', // Lucero
    condicionJugador: 'Titular',
    minutosJugados: 85,
    goles: 0,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p15',
    partidoId: 'match-2',
    jugadorId: 'uch-15', // Reinhart
    condicionJugador: 'Suplente',
    minutosJugados: 20,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m2-p23',
    partidoId: 'match-2',
    jugadorId: 'uch-23', // Vásquez
    condicionJugador: 'Suplente',
    minutosJugados: 15,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },

  // --- PARTIDO 3: vs Audax Italiano (2 - 0) ---
  {
    id: 'stat-m3-p25',
    partidoId: 'match-3',
    jugadorId: 'uch-25', // Castellón
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p6',
    partidoId: 'match-3',
    jugadorId: 'uch-6', // Fernández
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p5',
    partidoId: 'match-3',
    jugadorId: 'uch-5', // Ramírez
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 1,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p22',
    partidoId: 'match-3',
    jugadorId: 'uch-22', // Zaldivia
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p4',
    partidoId: 'match-3',
    jugadorId: 'uch-4', // Vargas Diego
    condicionJugador: 'Titular',
    minutosJugados: 80,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p21',
    partidoId: 'match-3',
    jugadorId: 'uch-21', // Díaz
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p20',
    partidoId: 'match-3',
    jugadorId: 'uch-20', // Aránguiz
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p19',
    partidoId: 'match-3',
    jugadorId: 'uch-19', // Altamirano
    condicionJugador: 'Titular',
    minutosJugados: 75,
    goles: 1,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p7',
    partidoId: 'match-3',
    jugadorId: 'uch-7', // Guerrero
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
    jugadorId: 'uch-9', // Rivero
    condicionJugador: 'Titular',
    minutosJugados: 70,
    goles: 1,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p18',
    partidoId: 'match-3',
    jugadorId: 'uch-18', // Lucero
    condicionJugador: 'Titular',
    minutosJugados: 90,
    goles: 0,
    asistencias: 1,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p32',
    partidoId: 'match-3',
    jugadorId: 'uch-32', // Reyna
    condicionJugador: 'Suplente',
    minutosJugados: 20,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  },
  {
    id: 'stat-m3-p28',
    partidoId: 'match-3',
    jugadorId: 'uch-28', // Arce
    condicionJugador: 'Suplente',
    minutosJugados: 15,
    goles: 0,
    asistencias: 0,
    tarjetasAmarillas: 0,
    tarjetasRojas: 0
  }
];
