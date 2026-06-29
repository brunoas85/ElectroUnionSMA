import { Router } from "express";
import { crearRevision } from "../controllers/revisiones.controller";
import { requireAdmin } from "../middleware/autenticacion";

export const revisionesRouter = Router();

revisionesRouter.post("/", requireAdmin, crearRevision);
