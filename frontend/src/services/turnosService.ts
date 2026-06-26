import { apiPost } from "./apiClient";
import type { SolicitudTurno, TurnoCreado } from "../types/turno";

/** Envía una solicitud de turno al backend. */
export async function crearTurno(datos: SolicitudTurno): Promise<TurnoCreado> {
  return apiPost<TurnoCreado>("/turnos", datos);
}
