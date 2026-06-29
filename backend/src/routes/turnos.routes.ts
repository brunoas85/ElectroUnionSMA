import { Router } from "express";
import { crearTurno, listarTurnos, actualizarEstadoTurno, eliminarTurno } from "../controllers/turnos.controller";
import { requireAdmin } from "../middleware/autenticacion";

export const turnosRouter = Router();

turnosRouter.get("/", requireAdmin, listarTurnos);
turnosRouter.post("/", crearTurno);
turnosRouter.patch("/:id", requireAdmin, actualizarEstadoTurno);
turnosRouter.delete("/:id", requireAdmin, eliminarTurno);
