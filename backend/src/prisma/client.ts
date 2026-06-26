import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

// Prisma 7 requiere un Driver Adapter explícito para conectarse a la base de datos.
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

// Instancia única del cliente de Prisma, compartida por toda la app
export const prisma = new PrismaClient({ adapter });
