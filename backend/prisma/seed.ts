import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Limpiar datos previos para que el seed sea idempotente
  await prisma.revision.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.cliente.deleteMany();

  const cliente1 = await prisma.cliente.create({
    data: {
      nombre: "Marcela Gómez",
      telefono: "+5492604123456",
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      nombre: "Roberto Díaz",
      telefono: "+5492604987654",
    },
  });

  const vehiculo1 = await prisma.vehiculo.create({
    data: {
      patente: "AB123CD",
      marca: "Volkswagen",
      modelo: "Gol Trend",
      anio: 2015,
      clienteId: cliente1.id,
    },
  });

  const vehiculo2 = await prisma.vehiculo.create({
    data: {
      patente: "AC456EF",
      marca: "Fiat",
      modelo: "Cronos",
      anio: 2021,
      clienteId: cliente2.id,
    },
  });

  const vehiculo3 = await prisma.vehiculo.create({
    data: {
      patente: "AD789GH",
      marca: "Chevrolet",
      modelo: "Onix",
      anio: 2019,
      clienteId: cliente2.id,
    },
  });

  await prisma.revision.createMany({
    data: [
      {
        vehiculoId: vehiculo1.id,
        fecha: new Date("2025-11-10"),
        descripcion: "Cambio de aceite y filtro, revisión de frenos delanteros.",
        mecanico: "Juan Pérez",
      },
      {
        vehiculoId: vehiculo1.id,
        fecha: new Date("2026-03-22"),
        descripcion: "Reparación de sistema eléctrico, cambio de batería.",
        mecanico: "Juan Pérez",
      },
      {
        vehiculoId: vehiculo2.id,
        fecha: new Date("2026-01-15"),
        descripcion: "Alineación y balanceo, revisión de suspensión.",
        mecanico: "Carlos Fernández",
      },
      {
        vehiculoId: vehiculo3.id,
        fecha: new Date("2025-09-05"),
        descripcion: "Revisión general previa a viaje largo: frenos, líquidos y correas.",
        mecanico: "Carlos Fernández",
      },
      {
        vehiculoId: vehiculo3.id,
        fecha: new Date("2026-05-30"),
        descripcion: "Cambio de pastillas de freno y discos traseros.",
        mecanico: "Juan Pérez",
      },
    ],
  });

  console.log("Seed completado: 2 clientes, 3 vehículos, 5 revisiones.");
}

main()
  .catch((error) => {
    console.error("Error al ejecutar el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
