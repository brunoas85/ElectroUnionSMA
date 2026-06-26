/**
 * Catálogo de servicios ofrecidos por el taller.
 * Se reutiliza tanto en la sección "Servicios" de la landing como en el
 * <select> del formulario de turnos.
 */

export interface ServicioTaller {
  id: string;
  nombre: string;
  descripcion: string;
}

export const SERVICIOS_TALLER: ServicioTaller[] = [
  {
    id: "electrico-electromecanico-general",
    nombre: "Eléctrico / electromecánico general",
    descripcion:
      "Diagnóstico y reparación de sistema eléctrico, batería, motor de arranque, alternador.",
  },
  {
    id: "frenos-suspension",
    nombre: "Frenos y suspensión",
    descripcion: "Pastillas, discos, amortiguadores, alineación y balanceo.",
  },
  {
    id: "mantenimiento-service",
    nombre: "Mantenimiento y service",
    descripcion: "Cambio de aceite y filtros, revisión general, correas, líquidos.",
  },
];
