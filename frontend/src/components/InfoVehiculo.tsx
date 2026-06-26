import type { HistorialVehiculo } from "../types/vehiculo";

interface Props {
  vehiculo: HistorialVehiculo;
}

/** Encabezado con los datos del vehículo y su titular. */
export default function InfoVehiculo({ vehiculo }: Props) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-semibold text-neutral-50">
          {vehiculo.marca} {vehiculo.modelo}
        </h1>
        <span className="font-mono text-sm font-medium tracking-wide text-neutral-400">
          {vehiculo.patente}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-neutral-400">Año</dt>
          <dd className="font-medium text-neutral-50">{vehiculo.anio}</dd>
        </div>
        <div>
          <dt className="text-neutral-400">Titular</dt>
          <dd className="font-medium text-neutral-50">{vehiculo.cliente.nombre}</dd>
        </div>
        <div>
          <dt className="text-neutral-400">Teléfono</dt>
          <dd className="font-medium text-neutral-50">{vehiculo.cliente.telefono}</dd>
        </div>
      </dl>
    </div>
  );
}
