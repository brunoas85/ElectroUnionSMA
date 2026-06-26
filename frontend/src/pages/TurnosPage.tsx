import { useEffect, useRef } from "react";
import FormularioTurno from "../components/FormularioTurno";
import MensajeEstado from "../components/MensajeEstado";
import { useSolicitudTurno } from "../hooks/useSolicitudTurno";
import { construirLinkWhatsappTurno } from "../services/whatsappService";
import type { SolicitudTurno } from "../types/turno";

/** Página de solicitud de turno: formulario + confirmación con aviso por WhatsApp. */
export default function TurnosPage() {
  const { estado, datosEnviados, mensajeError, enviar } = useSolicitudTurno();
  const yaAbrioWhatsapp = useRef(false);

  function handleEnviar(datos: SolicitudTurno) {
    enviar(datos);
  }

  useEffect(() => {
    if (estado === "exito" && datosEnviados && !yaAbrioWhatsapp.current) {
      yaAbrioWhatsapp.current = true;
      window.open(construirLinkWhatsappTurno(datosEnviados), "_blank");
    }

    if (estado !== "exito") {
      yaAbrioWhatsapp.current = false;
    }
  }, [estado, datosEnviados]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-neutral-50 sm:text-3xl">Pedir un turno</h1>
        <p className="mt-2 text-neutral-400">
          Completá tus datos y te confirmamos el turno a la brevedad.
        </p>
      </div>

      {estado === "exito" && datosEnviados ? (
        <div className="mt-8">
          <MensajeEstado
            tipo="exito"
            titulo="¡Solicitud enviada!"
            descripcion="Recibimos tu pedido de turno. Te abrimos WhatsApp para que nos lo confirmes directamente; si no se abrió, usá el botón de abajo."
          >
            <a
              href={construirLinkWhatsappTurno(datosEnviados)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Abrir WhatsApp
            </a>
          </MensajeEstado>
        </div>
      ) : (
        <>
          <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-sm sm:p-6">
            <FormularioTurno enviando={estado === "enviando"} onEnviar={handleEnviar} />
          </div>

          {estado === "error" && (
            <div className="mt-6">
              <MensajeEstado
                tipo="error"
                titulo="No pudimos enviar tu solicitud"
                descripcion={mensajeError ?? "Intentá nuevamente en unos instantes."}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
