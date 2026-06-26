import type { Vehiculo } from "../types/vehiculo";

interface Props {
  vehiculo: Vehiculo;
  onSeleccionar: (vehiculo: Vehiculo) => void;
}

/** Tarjeta clickeable que representa un vehículo en una lista de selección. */
export default function TarjetaVehiculo({ vehiculo, onSeleccionar }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSeleccionar(vehiculo)}
      className="flex w-full min-h-[64px] items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-left transition-colors hover:border-lime-500/50 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
    >
      <div>
        <p className="font-semibold text-neutral-50">
          {vehiculo.marca} {vehiculo.modelo}{" "}
          <span className="text-neutral-400">· {vehiculo.anio}</span>
        </p>
        <p className="mt-0.5 text-sm text-neutral-400">
          Patente{" "}
          <span className="font-mono font-medium tracking-wide text-neutral-300">
            {vehiculo.patente}
          </span>
        </p>
      </div>
      <span aria-hidden="true" className="text-neutral-400">
        →
      </span>
    </button>
  );
}
