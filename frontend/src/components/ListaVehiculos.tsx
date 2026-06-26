import TarjetaVehiculo from "./TarjetaVehiculo";
import type { Vehiculo } from "../types/vehiculo";

interface Props {
  vehiculos: Vehiculo[];
  onSeleccionar: (vehiculo: Vehiculo) => void;
}

/** Lista de vehículos para elegir cuando una búsqueda devuelve más de uno. */
export default function ListaVehiculos({ vehiculos, onSeleccionar }: Props) {
  return (
    <div>
      <h2 className="text-base font-semibold text-neutral-50">
        Encontramos {vehiculos.length} vehículos asociados
      </h2>
      <p className="mt-1 text-sm text-neutral-400">
        Elegí el vehículo que querés consultar.
      </p>

      <ul className="mt-4 space-y-3">
        {vehiculos.map((vehiculo) => (
          <li key={vehiculo.id}>
            <TarjetaVehiculo vehiculo={vehiculo} onSeleccionar={onSeleccionar} />
          </li>
        ))}
      </ul>
    </div>
  );
}
