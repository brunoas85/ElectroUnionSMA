/**
 * Tipos del dominio de turnos, alineados con el contrato de la API del
 * backend (POST /api/turnos — ver CLAUDE.md en la raíz del repo).
 */

export interface SolicitudTurno {
  nombre: string;
  telefono: string;
  patente?: string;
  servicio: string;
  fechaDeseada: string;
  comentario?: string;
}

export interface TurnoCreado extends SolicitudTurno {
  id: number;
  estado: string;
}
