import type { ServicioTaller } from "../data/servicios";

interface Props {
  servicio: ServicioTaller;
}

/** Tarjeta informativa de un servicio del taller (sin interacción). */
export default function TarjetaServicio({ servicio }: Props) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-sm transition-colors hover:border-lime-500/50 hover:bg-neutral-800">
      <h3 className="font-semibold text-neutral-50">{servicio.nombre}</h3>
      <p className="mt-2 text-sm text-neutral-400">{servicio.descripcion}</p>
    </div>
  );
}
