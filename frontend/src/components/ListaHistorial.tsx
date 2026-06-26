import TarjetaRevision from "./TarjetaRevision";
import type { Revision } from "../types/vehiculo";

interface Props {
  revisiones: Revision[];
  /** Id de la última revisión, para destacarla dentro del listado completo. */
  idUltimaRevision?: number;
}

/** Listado cronológico (descendente) de todas las revisiones del vehículo. */
export default function ListaHistorial({ revisiones, idUltimaRevision }: Props) {
  if (revisiones.length === 0) {
    return (
      <p className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 text-center text-sm text-neutral-400">
        Este vehículo todavía no tiene revisiones registradas.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {revisiones.map((revision) => (
        <li key={revision.id}>
          <TarjetaRevision revision={revision} destacada={revision.id === idUltimaRevision} />
        </li>
      ))}
    </ul>
  );
}
