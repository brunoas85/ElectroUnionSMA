/**
 * Tipos del dominio, alineados con el contrato de la API del backend
 * (ver CLAUDE.md en la raíz del repo para el detalle completo de endpoints).
 */

export interface Cliente {
  nombre: string;
  telefono: string;
}

export interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  cliente: Cliente;
}

export interface Revision {
  id: number;
  fecha: string;
  descripcion: string;
  mecanico: string;
}

export interface HistorialVehiculo extends Vehiculo {
  ultimaRevision: Revision | null;
  revisiones: Revision[];
}

/** Tipo de búsqueda que puede realizar el usuario desde el formulario. */
export type TipoBusqueda = "patente" | "telefono";
