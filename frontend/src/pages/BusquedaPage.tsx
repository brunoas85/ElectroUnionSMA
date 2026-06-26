import { useNavigate } from "react-router-dom";
import FormularioBusqueda from "../components/FormularioBusqueda";
import ListaVehiculos from "../components/ListaVehiculos";
import MensajeEstado from "../components/MensajeEstado";
import BotonWhatsapp from "../components/BotonWhatsapp";
import { useBusquedaVehiculos } from "../hooks/useBusquedaVehiculos";
import type { TipoBusqueda, Vehiculo } from "../types/vehiculo";

/** Pantalla principal: el usuario busca su vehículo por patente o teléfono. */
export default function BusquedaPage() {
  const { estado, vehiculos, mensajeError, buscar } = useBusquedaVehiculos();
  const navegar = useNavigate();

  function handleBuscar(tipo: TipoBusqueda, valor: string) {
    buscar(tipo, valor);
  }

  function handleSeleccionar(vehiculo: Vehiculo) {
    navegar(`/historial/${encodeURIComponent(vehiculo.patente)}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-neutral-50 sm:text-3xl">
          Consultá el historial de tu vehículo
        </h1>
        <p className="mt-2 text-neutral-400">
          Buscá por patente o por teléfono para ver las revisiones realizadas en el taller.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-sm sm:p-6">
        <FormularioBusqueda cargando={estado === "cargando"} onBuscar={handleBuscar} />
      </div>

      <div className="mt-6">
        {estado === "exito" && vehiculos.length === 1 && (
          <AvisoVehiculoUnico vehiculo={vehiculos[0]} onContinuar={handleSeleccionar} />
        )}

        {estado === "exito" && vehiculos.length > 1 && (
          <ListaVehiculos vehiculos={vehiculos} onSeleccionar={handleSeleccionar} />
        )}

        {estado === "no-encontrado" && (
          <MensajeEstado
            tipo="no-encontrado"
            titulo="No encontramos ningún vehículo"
            descripcion="Revisá que la patente o el teléfono estén bien escritos. Si el dato es correcto, contactanos por WhatsApp y te ayudamos."
          >
            <BotonWhatsapp variante="secundario" texto="Consultar por WhatsApp" />
          </MensajeEstado>
        )}

        {estado === "error" && (
          <MensajeEstado
            tipo="error"
            titulo="No pudimos completar la búsqueda"
            descripcion={mensajeError ?? "Intentá nuevamente en unos instantes."}
          />
        )}
      </div>
    </div>
  );
}

function AvisoVehiculoUnico({
  vehiculo,
  onContinuar,
}: {
  vehiculo: Vehiculo;
  onContinuar: (vehiculo: Vehiculo) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onContinuar(vehiculo)}
      className="flex w-full min-h-[64px] items-center justify-between gap-4 rounded-xl border border-lime-500/40 bg-lime-950/20 p-4 text-left transition-colors hover:border-lime-500/50 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
    >
      <div>
        <p className="font-semibold text-neutral-50">
          {vehiculo.marca} {vehiculo.modelo} · {vehiculo.anio}
        </p>
        <p className="mt-0.5 text-sm text-neutral-400">
          Patente {vehiculo.patente} — ver historial de revisiones
        </p>
      </div>
      <span aria-hidden="true" className="text-lime-400">
        →
      </span>
    </button>
  );
}
