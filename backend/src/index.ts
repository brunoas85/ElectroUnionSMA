import "dotenv/config";
import express from "express";
import cors from "cors";
import { vehiculosRouter } from "./routes/vehiculos.routes";
import { turnosRouter } from "./routes/turnos.routes";
import { revisionesRouter } from "./routes/revisiones.routes";
import { requireAdmin } from "./middleware/autenticacion";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use("/api/vehiculos", vehiculosRouter);
app.use("/api/turnos", turnosRouter);
app.use("/api/revisiones", revisionesRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/admin/verificar", requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API de ElectroUniónSMA corriendo en http://localhost:${PORT}`);
});
