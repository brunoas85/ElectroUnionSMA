import { Router } from "express";
import { crearTurno } from "../controllers/turnos.controller";

export const turnosRouter = Router();

turnosRouter.post("/", crearTurno);
