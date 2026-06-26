-- CreateTable
CREATE TABLE "Turno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "patente" TEXT,
    "servicio" TEXT NOT NULL,
    "fechaDeseada" DATETIME NOT NULL,
    "comentario" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
