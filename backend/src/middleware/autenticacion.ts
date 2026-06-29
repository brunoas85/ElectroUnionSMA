import { Request, Response, NextFunction } from "express";

/**
 * Middleware que protege rutas del panel del mecánico.
 * Espera el header: Authorization: Bearer <ADMIN_SECRET>
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    res.status(500).json({ error: "El servidor no tiene configurada la clave de administración." });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Acceso no autorizado." });
    return;
  }

  const token = authHeader.slice(7);
  if (token !== secret) {
    res.status(401).json({ error: "Clave incorrecta." });
    return;
  }

  next();
}
