import { useCallback, useState } from "react";
import { ApiError } from "../services/apiClient";
import { obtenerHistorial } from "../services/vehiculosService";
import type { HistorialVehiculo } from "../types/vehiculo";

type EstadoHistorial = "inactivo" | "cargando" | "exito" | "no-encontrado" | "error";

interface ResultadoHook {
  estado: EstadoHistorial;
  historial: HistorialVehiculo | null;
  mensajeError: string | null;
  cargar: (patente: string) => Promise<void>;
}

/** Maneja la carga del historial de revisiones de un vehículo y sus estados de UI. */
export function useHistorialVehiculo(): ResultadoHook {
  const [estado, setEstado] = useState<EstadoHistorial>("inactivo");
  const [historial, setHistorial] = useState<HistorialVehiculo | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const cargar = useCallback(async (patente: string) => {
    setEstado("cargando");
    setMensajeError(null);

    try {
      const resultado = await obtenerHistorial(patente);
      setHistorial(resultado);
      setEstado("exito");
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setHistorial(null);
        setEstado("no-encontrado");
        return;
      }

      const mensaje =
        error instanceof ApiError
          ? error.message
          : "Ocurrió un error inesperado. Intentá nuevamente.";
      setMensajeError(mensaje);
      setHistorial(null);
      setEstado("error");
    }
  }, []);

  return { estado, historial, mensajeError, cargar };
}
