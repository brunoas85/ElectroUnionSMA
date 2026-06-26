import type { ReactNode } from "react";

interface Props {
  tipo: "error" | "no-encontrado" | "exito";
  titulo: string;
  descripcion?: string;
  children?: ReactNode;
}

const ESTILOS_POR_TIPO = {
  error: {
    contenedor: "border-red-800 bg-red-950/40",
    titulo: "text-red-300",
    descripcion: "text-red-400",
    role: "alert" as const,
  },
  "no-encontrado": {
    contenedor: "border-amber-800 bg-amber-950/40",
    titulo: "text-amber-300",
    descripcion: "text-amber-400",
    role: "status" as const,
  },
  exito: {
    contenedor: "border-emerald-800 bg-emerald-950/40",
    titulo: "text-emerald-300",
    descripcion: "text-emerald-400",
    role: "status" as const,
  },
};

/**
 * Mensaje de estado para "no encontrado", "error de conexión" o "éxito".
 * Pensado para mostrarse en el lugar de los resultados de búsqueda o envío.
 */
export default function MensajeEstado({ tipo, titulo, descripcion, children }: Props) {
  const estilos = ESTILOS_POR_TIPO[tipo];

  return (
    <div
      role={estilos.role}
      className={`rounded-xl border p-5 text-center sm:text-left ${estilos.contenedor}`}
    >
      <p className={`font-semibold ${estilos.titulo}`}>{titulo}</p>
      {descripcion && <p className={`mt-1 text-sm ${estilos.descripcion}`}>{descripcion}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
