/**
 * Helpers para armar el link de contacto por WhatsApp (wa.me).
 * El número del taller es configurable vía variable de entorno
 * VITE_WHATSAPP_NUMBER (formato internacional, sin "+" ni espacios).
 */

import type { SolicitudTurno } from "../types/turno";

const NUMERO_TALLER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "5492604000000";

/**
 * Construye la URL de wa.me con un mensaje prearmado.
 * Si se pasa una patente, se incluye en el mensaje para que el mecánico
 * sepa de inmediato a qué vehículo se refiere el cliente.
 */
export function construirLinkWhatsapp(patente?: string): string {
  const mensaje = patente
    ? `Hola, me comunico desde la web de ElectroUniónSMA por el vehículo con patente ${patente}.`
    : "Hola, me comunico desde la web de ElectroUniónSMA.";

  const params = new URLSearchParams({ text: mensaje });
  return `https://wa.me/${NUMERO_TALLER}?${params.toString()}`;
}

/** Formatea una fecha/hora ISO al formato "día de mes de año a las HH:mm" en español. */
function formatearFechaHora(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return fechaIso;

  const fechaFormateada = fecha.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const horaFormateada = fecha.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${fechaFormateada} a las ${horaFormateada}`;
}

/**
 * Construye la URL de wa.me con un mensaje detallado a partir de una
 * solicitud de turno, para que el cliente pueda confirmar/avisar al taller
 * apenas envía el formulario de turnos.
 */
export function construirLinkWhatsappTurno(datos: SolicitudTurno): string {
  const lineas = [
    "Hola, acabo de solicitar un turno desde la web de ElectroUniónSMA.",
    `Nombre: ${datos.nombre}`,
    `Servicio: ${datos.servicio}`,
    `Fecha y hora deseada: ${formatearFechaHora(datos.fechaDeseada)}`,
  ];

  if (datos.patente) {
    lineas.push(`Patente: ${datos.patente}`);
  }

  if (datos.comentario) {
    lineas.push(`Comentario: ${datos.comentario}`);
  }

  const mensaje = lineas.join("\n");
  const params = new URLSearchParams({ text: mensaje });
  return `https://wa.me/${NUMERO_TALLER}?${params.toString()}`;
}
