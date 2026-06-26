import { apiGet } from "./apiClient";
import type { HistorialVehiculo, Vehiculo } from "../types/vehiculo";

/**
 * Busca vehículos por patente o por teléfono del cliente.
 * Por patente la API devuelve un único vehículo; por teléfono puede
 * devolver varios (todos los vehículos asociados al cliente).
 */
export async function buscarVehiculos(
  tipo: "patente" | "telefono",
  valor: string
): Promise<Vehiculo[]> {
  const params = new URLSearchParams({ [tipo]: valor });
  const resultado = await apiGet<Vehiculo | Vehiculo[]>(`/vehiculos?${params.toString()}`);
  return Array.isArray(resultado) ? resultado : [resultado];
}

/** Obtiene el historial completo de revisiones de un vehículo por su patente. */
export async function obtenerHistorial(patente: string): Promise<HistorialVehiculo> {
  return apiGet<HistorialVehiculo>(`/vehiculos/${encodeURIComponent(patente)}/historial`);
}
