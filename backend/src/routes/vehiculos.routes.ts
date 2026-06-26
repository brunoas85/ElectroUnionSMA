import { Router } from "express";
import { buscarVehiculos, obtenerHistorial } from "../controllers/vehiculos.controller";

export const vehiculosRouter = Router();

vehiculosRouter.get("/", buscarVehiculos);
vehiculosRouter.get("/:patente/historial", obtenerHistorial);
