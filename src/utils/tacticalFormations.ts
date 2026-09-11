import { PitchSlot } from '../types';

export interface TacticalFormation {
  id: string;
  name: string;
  slots: {
    slotId: string;
    posicionTag: string;
    label: string;
    categoria: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero';
    x: number; // 0 to 100
    y: number; // 0 to 100
  }[];
}

export const TACTICAL_FORMATIONS: Record<string, TacticalFormation> = {
  '4-3-3': {
    id: '4-3-3',
    name: '4-3-3 (Ofensivo)',
    slots: [
      { slotId: 'slot-1', posicionTag: 'PO', label: 'Arquero', categoria: 'Arquero', x: 50, y: 88 },
      { slotId: 'slot-2', posicionTag: 'LI', label: 'Lateral Izquierdo', categoria: 'Defensa', x: 18, y: 72 },
      { slotId: 'slot-3', posicionTag: 'DFC', label: 'Central Izquierdo', categoria: 'Defensa', x: 38, y: 75 },
      { slotId: 'slot-4', posicionTag: 'DFC', label: 'Central Derecho', categoria: 'Defensa', x: 62, y: 75 },
      { slotId: 'slot-5', posicionTag: 'LD', label: 'Lateral Derecho', categoria: 'Defensa', x: 82, y: 72 },
      { slotId: 'slot-6', posicionTag: 'MCD', label: 'Volante Pivote', categoria: 'Mediocampista', x: 50, y: 56 },
      { slotId: 'slot-7', posicionTag: 'MC', label: 'Interior Izquierdo', categoria: 'Mediocampista', x: 30, y: 46 },
      { slotId: 'slot-8', posicionTag: 'MC', label: 'Interior Derecho', categoria: 'Mediocampista', x: 70, y: 46 },
      { slotId: 'slot-9', posicionTag: 'EI', label: 'Extremo Izquierdo', categoria: 'Delantero', x: 20, y: 22 },
      { slotId: 'slot-10', posicionTag: 'DC', label: 'Delantero Centro', categoria: 'Delantero', x: 50, y: 15 },
      { slotId: 'slot-11', posicionTag: 'ED', label: 'Extremo Derecho', categoria: 'Delantero', x: 80, y: 22 },
    ]
  },
  '4-4-2': {
    id: '4-4-2',
    name: '4-4-2 (Clásico)',
    slots: [
      { slotId: 'slot-1', posicionTag: 'PO', label: 'Arquero', categoria: 'Arquero', x: 50, y: 88 },
      { slotId: 'slot-2', posicionTag: 'LI', label: 'Lateral Izquierdo', categoria: 'Defensa', x: 18, y: 72 },
      { slotId: 'slot-3', posicionTag: 'DFC', label: 'Central Izquierdo', categoria: 'Defensa', x: 38, y: 75 },
      { slotId: 'slot-4', posicionTag: 'DFC', label: 'Central Derecho', categoria: 'Defensa', x: 62, y: 75 },
      { slotId: 'slot-5', posicionTag: 'LD', label: 'Lateral Derecho', categoria: 'Defensa', x: 82, y: 72 },
      { slotId: 'slot-6', posicionTag: 'MI', label: 'Volante Izquierdo', categoria: 'Mediocampista', x: 18, y: 48 },
      { slotId: 'slot-7', posicionTag: 'MC', label: 'Mediocentro Izquierdo', categoria: 'Mediocampista', x: 38, y: 52 },
      { slotId: 'slot-8', posicionTag: 'MC', label: 'Mediocentro Derecho', categoria: 'Mediocampista', x: 62, y: 52 },
      { slotId: 'slot-9', posicionTag: 'MD', label: 'Volante Derecho', categoria: 'Mediocampista', x: 82, y: 48 },
      { slotId: 'slot-10', posicionTag: 'DC', label: 'Delantero Izquierdo', categoria: 'Delantero', x: 38, y: 20 },
      { slotId: 'slot-11', posicionTag: 'DC', label: 'Delantero Derecho', categoria: 'Delantero', x: 62, y: 20 },
    ]
  },
  '4-2-3-1': {
    id: '4-2-3-1',
    name: '4-2-3-1 (Equilibrio)',
    slots: [
      { slotId: 'slot-1', posicionTag: 'PO', label: 'Arquero', categoria: 'Arquero', x: 50, y: 88 },
      { slotId: 'slot-2', posicionTag: 'LI', label: 'Lateral Izquierdo', categoria: 'Defensa', x: 18, y: 72 },
      { slotId: 'slot-3', posicionTag: 'DFC', label: 'Central Izquierdo', categoria: 'Defensa', x: 38, y: 75 },
      { slotId: 'slot-4', posicionTag: 'DFC', label: 'Central Derecho', categoria: 'Defensa', x: 62, y: 75 },
      { slotId: 'slot-5', posicionTag: 'LD', label: 'Lateral Derecho', categoria: 'Defensa', x: 82, y: 72 },
      { slotId: 'slot-6', posicionTag: 'MCD', label: 'Doble Pivote Izq', categoria: 'Mediocampista', x: 38, y: 58 },
      { slotId: 'slot-7', posicionTag: 'MCD', label: 'Doble Pivote Der', categoria: 'Mediocampista', x: 62, y: 58 },
      { slotId: 'slot-8', posicionTag: 'MI', label: 'Mediapunta Izq', categoria: 'Mediocampista', x: 22, y: 36 },
      { slotId: 'slot-9', posicionTag: 'MCO', label: 'Enganche Central', categoria: 'Mediocampista', x: 50, y: 35 },
      { slotId: 'slot-10', posicionTag: 'MD', label: 'Mediapunta Der', categoria: 'Mediocampista', x: 78, y: 36 },
      { slotId: 'slot-11', posicionTag: 'DC', label: 'Delantero Centro', categoria: 'Delantero', x: 50, y: 16 },
    ]
  },
  '3-5-2': {
    id: '3-5-2',
    name: '3-5-2 (Línea de 3)',
    slots: [
      { slotId: 'slot-1', posicionTag: 'PO', label: 'Arquero', categoria: 'Arquero', x: 50, y: 88 },
      { slotId: 'slot-2', posicionTag: 'DFC', label: 'Stopper Izquierdo', categoria: 'Defensa', x: 30, y: 74 },
      { slotId: 'slot-3', posicionTag: 'LIB', label: 'Líbero / Central', categoria: 'Defensa', x: 50, y: 76 },
      { slotId: 'slot-4', posicionTag: 'DFC', label: 'Stopper Derecho', categoria: 'Defensa', x: 70, y: 74 },
      { slotId: 'slot-5', posicionTag: 'CAI', label: 'Carrilero Izquierdo', categoria: 'Mediocampista', x: 15, y: 50 },
      { slotId: 'slot-6', posicionTag: 'MC', label: 'Volante Izquierdo', categoria: 'Mediocampista', x: 35, y: 53 },
      { slotId: 'slot-7', posicionTag: 'MCD', label: 'Pivote Central', categoria: 'Mediocampista', x: 50, y: 58 },
      { slotId: 'slot-8', posicionTag: 'MC', label: 'Volante Derecho', categoria: 'Mediocampista', x: 65, y: 53 },
      { slotId: 'slot-9', posicionTag: 'CAD', label: 'Carrilero Derecho', categoria: 'Mediocampista', x: 85, y: 50 },
      { slotId: 'slot-10', posicionTag: 'DC', label: 'Delantero Izquierdo', categoria: 'Delantero', x: 38, y: 20 },
      { slotId: 'slot-11', posicionTag: 'DC', label: 'Delantero Derecho', categoria: 'Delantero', x: 62, y: 20 },
    ]
  },
  '5-3-2': {
    id: '5-3-2',
    name: '5-3-2 (Sólido)',
    slots: [
      { slotId: 'slot-1', posicionTag: 'PO', label: 'Arquero', categoria: 'Arquero', x: 50, y: 88 },
      { slotId: 'slot-2', posicionTag: 'LI', label: 'Lateral Izquierdo', categoria: 'Defensa', x: 15, y: 71 },
      { slotId: 'slot-3', posicionTag: 'DFC', label: 'Central Izquierdo', categoria: 'Defensa', x: 34, y: 75 },
      { slotId: 'slot-4', posicionTag: 'DFC', label: 'Central Medio', categoria: 'Defensa', x: 50, y: 77 },
      { slotId: 'slot-5', posicionTag: 'DFC', label: 'Central Derecho', categoria: 'Defensa', x: 66, y: 75 },
      { slotId: 'slot-6', posicionTag: 'LD', label: 'Lateral Derecho', categoria: 'Defensa', x: 85, y: 71 },
      { slotId: 'slot-7', posicionTag: 'MC', label: 'Interior Izquierdo', categoria: 'Mediocampista', x: 30, y: 48 },
      { slotId: 'slot-8', posicionTag: 'MCD', label: 'Volante Central', categoria: 'Mediocampista', x: 50, y: 53 },
      { slotId: 'slot-9', posicionTag: 'MC', label: 'Interior Derecho', categoria: 'Mediocampista', x: 70, y: 48 },
      { slotId: 'slot-10', posicionTag: 'DC', label: 'Delantero Izquierdo', categoria: 'Delantero', x: 38, y: 19 },
      { slotId: 'slot-11', posicionTag: 'DC', label: 'Delantero Derecho', categoria: 'Delantero', x: 62, y: 19 },
    ]
  },
  '3-4-3': {
    id: '3-4-3',
    name: '3-4-3 (Presión Alta)',
    slots: [
      { slotId: 'slot-1', posicionTag: 'PO', label: 'Arquero', categoria: 'Arquero', x: 50, y: 88 },
      { slotId: 'slot-2', posicionTag: 'DFC', label: 'Central Izquierdo', categoria: 'Defensa', x: 30, y: 74 },
      { slotId: 'slot-3', posicionTag: 'DFC', label: 'Central Líbero', categoria: 'Defensa', x: 50, y: 76 },
      { slotId: 'slot-4', posicionTag: 'DFC', label: 'Central Derecho', categoria: 'Defensa', x: 70, y: 74 },
      { slotId: 'slot-5', posicionTag: 'MI', label: 'Carrilero Izquierdo', categoria: 'Mediocampista', x: 18, y: 50 },
      { slotId: 'slot-6', posicionTag: 'MC', label: 'Pivote Izquierdo', categoria: 'Mediocampista', x: 38, y: 54 },
      { slotId: 'slot-7', posicionTag: 'MC', label: 'Pivote Derecho', categoria: 'Mediocampista', x: 62, y: 54 },
      { slotId: 'slot-8', posicionTag: 'MD', label: 'Carrilero Derecho', categoria: 'Mediocampista', x: 82, y: 50 },
      { slotId: 'slot-9', posicionTag: 'EI', label: 'Extremo Izquierdo', categoria: 'Delantero', x: 20, y: 22 },
      { slotId: 'slot-10', posicionTag: 'DC', label: 'Delantero Centro', categoria: 'Delantero', x: 50, y: 16 },
      { slotId: 'slot-11', posicionTag: 'ED', label: 'Extremo Derecho', categoria: 'Delantero', x: 80, y: 22 },
    ]
  }
};

export const DEFAULT_FORMATION = '4-3-3';
