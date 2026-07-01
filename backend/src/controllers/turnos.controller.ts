import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import {
  esFechaTurnoValida,
  esNombreValido,
  esPatenteValida,
  esServicioValido,
  esTelefonoValido,
  normalizarPatente,
  normalizarTelefono,
} from "../utils/validadores";
import type { CrearTurnoInput, TurnoDTO } from "../types/api";

function aTurnoDTO(turno: {
  id: number;
  nombre: string;
  telefono: string;
  patente: string | null;
  servicio: string;
  fechaDeseada: Date;
  comentario: string | null;
  estado: string;
}): TurnoDTO {
  return {
    id: turno.id,
    nombre: turno.nombre,
    telefono: turno.telefono,
    patente: turno.patente,
    servicio: turno.servicio,
    fechaDeseada: turno.fechaDeseada.toISOString(),
    comentario: turno.comentario,
    estado: turno.estado,
  };
}

const ESTADOS_VALIDOS = ["pendiente", "confirmado", "en revisión", "completado", "cancelado"];

/**
 * GET /api/turnos?estado=<estado>
 * Lista todos los turnos, con filtro opcional por estado.
 */
export async function listarTurnos(req: Request, res: Response): Promise<void> {
  const { estado } = req.query;

  if (estado && (typeof estado !== "string" || !ESTADOS_VALIDOS.includes(estado))) {
    res.status(400).json({ error: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(", ")}.` });
    return;
  }

  const turnos = await prisma.turno.findMany({
    where: estado ? { estado: estado as string } : undefined,
    orderBy: { fechaDeseada: "asc" },
  });

  res.json(turnos.map(aTurnoDTO));
}

/**
 * PATCH /api/turnos/:id
 * Actualiza el estado de un turno.
 */
export async function actualizarEstadoTurno(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID de turno inválido." });
    return;
  }

  const { estado } = req.body as { estado?: string };
  if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
    res.status(400).json({ error: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(", ")}.` });
    return;
  }

  const turno = await prisma.turno.findUnique({ where: { id } });
  if (!turno) {
    res.status(404).json({ error: "Turno no encontrado." });
    return;
  }

  const actualizado = await prisma.turno.update({ where: { id }, data: { estado } });
  res.json(aTurnoDTO(actualizado));
}

/**
 * DELETE /api/turnos/:id
 * Elimina un turno permanentemente.
 */
export async function eliminarTurno(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID de turno inválido." });
    return;
  }

  const turno = await prisma.turno.findUnique({ where: { id } });
  if (!turno) {
    res.status(404).json({ error: "Turno no encontrado." });
    return;
  }

  await prisma.turno.delete({ where: { id } });
  res.status(204).send();
}

/**
 * POST /api/turnos
 * Crea una solicitud de turno para un cliente.
 */
export async function crearTurno(req: Request, res: Response): Promise<void> {
  const { nombre, telefono, patente, servicio, fechaDeseada, comentario } = req.body as Partial<CrearTurnoInput>;

  if (!nombre || !esNombreValido(nombre)) {
    res.status(400).json({ error: "El nombre es requerido y debe tener al menos 2 caracteres." });
    return;
  }

  if (!telefono || !esTelefonoValido(telefono)) {
    res.status(400).json({ error: "El teléfono es requerido y su formato no es válido." });
    return;
  }

  if (!servicio || !esServicioValido(servicio)) {
    res.status(400).json({ error: "El servicio es requerido y no puede superar los 100 caracteres." });
    return;
  }

  if (!fechaDeseada || !esFechaTurnoValida(fechaDeseada)) {
    res.status(400).json({ error: "La fecha deseada es requerida y debe ser una fecha futura válida." });
    return;
  }

  if (patente && !esPatenteValida(patente)) {
    res.status(400).json({ error: "El formato de la patente no es válido." });
    return;
  }

  if (comentario !== undefined && typeof comentario !== "string") {
    res.status(400).json({ error: "El comentario debe ser un texto." });
    return;
  }

  const turno = await prisma.turno.create({
    data: {
      nombre: nombre.trim(),
      telefono: normalizarTelefono(telefono),
      patente: patente ? normalizarPatente(patente) : null,
      servicio: servicio.trim(),
      fechaDeseada: new Date(fechaDeseada),
      comentario: comentario?.trim() || null,
    },
  });

  res.status(201).json(aTurnoDTO(turno));
}
