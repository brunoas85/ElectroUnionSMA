import { useCallback, useState } from "react";
import { ApiError } from "../services/apiClient";
import { buscarVehiculos } from "../services/vehiculosService";
import type { TipoBusqueda, Vehiculo } from "../types/vehiculo";

type EstadoBusqueda = "inactivo" | "cargando" | "exito" | "no-encontrado" | "error";

interface ResultadoHook {
  estado: EstadoBusqueda;
  vehiculos: Vehiculo[];
  mensajeError: string | null;
  buscar: (tipo: TipoBusqueda, valor: string) => Promise<void>;
  reiniciar: () => void;
}

/** Maneja la búsqueda de vehículos por patente o teléfono y sus estados de UI. */
export function useBusquedaVehiculos(): ResultadoHook {
  const [estado, setEstado] = useState<EstadoBusqueda>("inactivo");
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const buscar = useCallback(async (tipo: TipoBusqueda, valor: string) => {
    setEstado("cargando");
    setMensajeError(null);

    try {
      const resultado = await buscarVehiculos(tipo, valor);
      setVehiculos(resultado);
      setEstado("exito");
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setVehiculos([]);
        setEstado("no-encontrado");
        return;
      }

      const mensaje =
        error instanceof ApiError
          ? error.message
          : "Ocurrió un error inesperado. Intentá nuevamente.";
      setMensajeError(mensaje);
      setVehiculos([]);
      setEstado("error");
    }
  }, []);

  const reiniciar = useCallback(() => {
    setEstado("inactivo");
    setVehiculos([]);
    setMensajeError(null);
  }, []);

  return { estado, vehiculos, mensajeError, buscar, reiniciar };
}
