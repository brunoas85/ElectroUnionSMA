import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { esPatenteValida, normalizarPatente } from "../utils/validadores";
import type { CrearRevisionInput, RevisionCreadaDTO } from "../types/api";

/**
 * POST /api/revisiones
 * Registra una revisión para un vehículo identificado por patente.
 */
export async function crearRevision(req: Request, res: Response): Promise<void> {
  const { patente, fecha, descripcion, mecanico } = req.body as Partial<CrearRevisionInput>;

  if (!patente || !esPatenteValida(patente)) {
    res.status(400).json({ error: "La patente es requerida y debe tener un formato válido." });
    return;
  }

  if (!fecha || isNaN(new Date(fecha).getTime())) {
    res.status(400).json({ error: "La fecha es requerida y debe ser una fecha válida." });
    return;
  }

  if (!descripcion || descripcion.trim().length === 0) {
    res.status(400).json({ error: "La descripción es requerida." });
    return;
  }

  if (!mecanico || mecanico.trim().length < 2) {
    res.status(400).json({ error: "El nombre del mecánico es requerido." });
    return;
  }

  const vehiculo = await prisma.vehiculo.findUnique({
    where: { patente: normalizarPatente(patente) },
  });

  if (!vehiculo) {
    res.status(404).json({ error: "No se encontró ningún vehículo con esa patente." });
    return;
  }

  const revision = await prisma.revision.create({
    data: {
      vehiculoId: vehiculo.id,
      fecha: new Date(fecha),
      descripcion: descripcion.trim(),
      mecanico: mecanico.trim(),
    },
  });

  const dto: RevisionCreadaDTO = {
    id: revision.id,
    vehiculoId: revision.vehiculoId,
    fecha: revision.fecha.toISOString(),
    descripcion: revision.descripcion,
    mecanico: revision.mecanico,
  };

  res.status(201).json(dto);
}
