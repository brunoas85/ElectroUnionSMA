// Tipos compartidos por las respuestas de la API

export interface VehiculoResumen {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  cliente: {
    nombre: string;
    telefono: string;
  };
}

export interface RevisionDTO {
  id: number;
  fecha: string;
  descripcion: string;
  mecanico: string;
}

export interface HistorialVehiculo extends VehiculoResumen {
  ultimaRevision: RevisionDTO | null;
  revisiones: RevisionDTO[];
}

export interface ErrorResponse {
  error: string;
}

export interface CrearRevisionInput {
  patente: string;
  fecha: string;
  descripcion: string;
  mecanico: string;
}

export interface RevisionCreadaDTO {
  id: number;
  vehiculoId: number;
  fecha: string;
  descripcion: string;
  mecanico: string;
}

export interface CrearTurnoInput {
  nombre: string;
  telefono: string;
  patente?: string;
  servicio: string;
  fechaDeseada: string;
  comentario?: string;
}

export interface TurnoDTO {
  id: number;
  nombre: string;
  telefono: string;
  patente: string | null;
  servicio: string;
  fechaDeseada: string;
  comentario: string | null;
  estado: string;
}
