import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import InfoVehiculo from "../components/InfoVehiculo";
import ListaHistorial from "../components/ListaHistorial";
import MensajeEstado from "../components/MensajeEstado";
import BotonWhatsapp from "../components/BotonWhatsapp";
import Spinner from "../components/Spinner";
import { useHistorialVehiculo } from "../hooks/useHistorialVehiculo";

const LINK_VOLVER = (
  <Link
    to="/historial"
    className="inline-flex items-center gap-1 text-sm font-medium text-lime-400 transition-colors hover:text-lime-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded-md"
  >
    ← Volver a la búsqueda
  </Link>
);

/** Pantalla de historial de revisiones de un vehículo puntual. */
export default function HistorialPage() {
  const { patente } = useParams<{ patente: string }>();
  const { estado, historial, mensajeError, cargar } = useHistorialVehiculo();

  useEffect(() => {
    if (patente) cargar(patente);
  }, [patente, cargar]);

  if (estado === "cargando" || estado === "inactivo") {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-4 py-16 text-neutral-400">
        <Spinner className="h-8 w-8" />
        <p>Cargando historial…</p>
      </div>
    );
  }

  if (estado === "no-encontrado") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-4">{LINK_VOLVER}</div>
        <MensajeEstado
          tipo="no-encontrado"
          titulo="No encontramos ese vehículo"
          descripcion="Puede que la patente haya cambiado o que no esté registrada en el taller. Si creés que es un error, contactanos."
        >
          <BotonWhatsapp variante="secundario" texto="Consultar por WhatsApp" />
        </MensajeEstado>
      </div>
    );
  }

  if (estado === "error" || !historial) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-4">{LINK_VOLVER}</div>
        <MensajeEstado
          tipo="error"
          titulo="No pudimos cargar el historial"
          descripcion={mensajeError ?? "Intentá nuevamente en unos instantes."}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-4">{LINK_VOLVER}</div>
      <InfoVehiculo vehiculo={historial} />

      <div className="mt-6">
        <BotonWhatsapp patente={historial.patente} className="w-full sm:w-auto" />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-50">Historial de revisiones</h2>
        {historial.ultimaRevision ? (
          <p className="mt-1 text-sm text-neutral-400">
            La última revisión se destaca al inicio del listado.
          </p>
        ) : (
          <p className="mt-1 text-sm text-neutral-400">
            Todavía no hay revisiones registradas para este vehículo.
          </p>
        )}

        <div className="mt-4">
          <ListaHistorial
            revisiones={historial.revisiones}
            idUltimaRevision={historial.ultimaRevision?.id}
          />
        </div>
      </section>
    </div>
  );
}
