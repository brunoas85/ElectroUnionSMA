import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { esPatenteValida, esTelefonoValido, normalizarPatente, normalizarTelefono } from "../utils/validadores";
import type { VehiculoResumen, HistorialVehiculo, RevisionDTO } from "../types/api";

function aVehiculoResumen(vehiculo: {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  cliente: { nombre: string; telefono: string };
}): VehiculoResumen {
  return {
    id: vehiculo.id,
    patente: vehiculo.patente,
    marca: vehiculo.marca,
    modelo: vehiculo.modelo,
    anio: vehiculo.anio,
    cliente: {
      nombre: vehiculo.cliente.nombre,
      telefono: vehiculo.cliente.telefono,
    },
  };
}

/**
 * GET /api/vehiculos?patente=AB123CD
 * GET /api/vehiculos?telefono=+5492604123456
 * Busca vehículos por patente exacta o por teléfono del cliente asociado.
 */
export async function buscarVehiculos(req: Request, res: Response): Promise<void> {
  const { patente, telefono } = req.query;

  if (!patente && !telefono) {
    res.status(400).json({ error: "Debe indicar el parámetro 'patente' o 'telefono'." });
    return;
  }

  if (patente) {
    const patenteStr = String(patente);
    if (!esPatenteValida(patenteStr)) {
      res.status(400).json({ error: "El formato de la patente no es válido." });
      return;
    }

    const vehiculo = await prisma.vehiculo.findUnique({
      where: { patente: normalizarPatente(patenteStr) },
      include: { cliente: true },
    });

    if (!vehiculo) {
      res.status(404).json({ error: "No se encontró ningún vehículo con esa patente." });
      return;
    }

    res.json([aVehiculoResumen(vehiculo)]);
    return;
  }

  const telefonoStr = String(telefono);
  if (!esTelefonoValido(telefonoStr)) {
    res.status(400).json({ error: "El formato del teléfono no es válido." });
    return;
  }

  const cliente = await prisma.cliente.findUnique({
    where: { telefono: normalizarTelefono(telefonoStr) },
    include: { vehiculos: { include: { cliente: true } } },
  });

  if (!cliente || cliente.vehiculos.length === 0) {
    res.status(404).json({ error: "No se encontraron vehículos asociados a ese teléfono." });
    return;
  }

  res.json(cliente.vehiculos.map(aVehiculoResumen));
}

/**
 * GET /api/vehiculos/:patente/historial
 * Devuelve los datos del vehículo junto con su historial de revisiones,
 * ordenado de la más reciente a la más antigua.
 */
export async function obtenerHistorial(req: Request, res: Response): Promise<void> {
  const { patente } = req.params;

  if (!esPatenteValida(patente)) {
    res.status(400).json({ error: "El formato de la patente no es válido." });
    return;
  }

  const vehiculo = await prisma.vehiculo.findUnique({
    where: { patente: normalizarPatente(patente) },
    include: {
      cliente: true,
      revisiones: { orderBy: { fecha: "desc" } },
    },
  });

  if (!vehiculo) {
    res.status(404).json({ error: "No se encontró ningún vehículo con esa patente." });
    return;
  }

  const revisiones: RevisionDTO[] = vehiculo.revisiones.map((revision) => ({
    id: revision.id,
    fecha: revision.fecha.toISOString(),
    descripcion: revision.descripcion,
    mecanico: revision.mecanico,
  }));

  const historial: HistorialVehiculo = {
    ...aVehiculoResumen(vehiculo),
    ultimaRevision: revisiones[0] ?? null,
    revisiones,
  };

  res.json(historial);
}
