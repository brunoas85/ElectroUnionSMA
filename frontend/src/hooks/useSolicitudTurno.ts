import { useCallback, useState } from "react";
import { ApiError } from "../services/apiClient";
import { crearTurno } from "../services/turnosService";
import type { SolicitudTurno, TurnoCreado } from "../types/turno";

type EstadoSolicitudTurno = "inactivo" | "enviando" | "exito" | "error";

interface ResultadoHook {
  estado: EstadoSolicitudTurno;
  turnoCreado: TurnoCreado | null;
  datosEnviados: SolicitudTurno | null;
  mensajeError: string | null;
  enviar: (datos: SolicitudTurno) => Promise<void>;
}

/** Maneja el envío de una solicitud de turno y sus estados de UI. */
export function useSolicitudTurno(): ResultadoHook {
  const [estado, setEstado] = useState<EstadoSolicitudTurno>("inactivo");
  const [turnoCreado, setTurnoCreado] = useState<TurnoCreado | null>(null);
  const [datosEnviados, setDatosEnviados] = useState<SolicitudTurno | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const enviar = useCallback(async (datos: SolicitudTurno) => {
    setEstado("enviando");
    setMensajeError(null);

    try {
      const resultado = await crearTurno(datos);
      setTurnoCreado(resultado);
      setDatosEnviados(datos);
      setEstado("exito");
    } catch (error) {
      const mensaje =
        error instanceof ApiError
          ? error.message
          : "Ocurrió un error inesperado. Intentá nuevamente.";
      setMensajeError(mensaje);
      setTurnoCreado(null);
      setEstado("error");
    }
  }, []);

  return { estado, turnoCreado, datosEnviados, mensajeError, enviar };
}
