import type { Revision } from "../types/vehiculo";
import { formatearFecha } from "../utils/fecha";

interface Props {
  revision: Revision;
  destacada?: boolean;
}

/** Tarjeta que muestra una revisión individual del historial. */
export default function TarjetaRevision({ revision, destacada = false }: Props) {
  return (
    <article
      className={`rounded-xl border p-4 sm:p-5 ${
        destacada ? "border-lime-500/40 bg-lime-950/20" : "border-neutral-800 bg-neutral-900"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <time dateTime={revision.fecha} className="text-sm font-semibold text-neutral-50">
          {formatearFecha(revision.fecha)}
        </time>
        {destacada && (
          <span className="rounded-full bg-lime-400 px-2.5 py-0.5 text-xs font-medium text-neutral-950">
            Última revisión
          </span>
        )}
      </div>
      <p className="mt-2 text-neutral-300">{revision.descripcion}</p>
      <p className="mt-2 text-sm text-neutral-400">Mecánico: {revision.mecanico}</p>
    </article>
  );
}
