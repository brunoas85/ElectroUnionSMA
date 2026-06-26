/** Formatea una fecha ISO al formato "día de mes de año" en español. */
export function formatearFecha(fechaIso: string): string {
  const fecha = new Date(fechaIso);

  if (Number.isNaN(fecha.getTime())) return fechaIso;

  return fecha.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
