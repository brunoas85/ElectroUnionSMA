import BotonWhatsapp from "./BotonWhatsapp";
import { DATOS_TALLER } from "../data/datosTaller";

/** Sección de la landing con los datos de contacto y el acceso a WhatsApp. */
export default function ContactoSection() {
  return (
    <section id="contacto" className="scroll-mt-20 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-neutral-50">Contacto</h2>
        <p className="mt-3 text-neutral-400">{DATOS_TALLER.direccion}</p>

        <ul className="mt-2 space-y-1 text-sm text-neutral-400">
          {DATOS_TALLER.horarios.map((horario) => (
            <li key={horario.dias}>
              {horario.dias}: {horario.horario}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-center">
          <BotonWhatsapp />
        </div>
      </div>
    </section>
  );
}
