import { DATOS_TALLER } from "../data/datosTaller";

/** Sección de la landing con la presentación del taller. */
export default function QuienesSomosSection() {
  return (
    <section id="quienes-somos" className="scroll-mt-20 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-neutral-50">Quiénes somos</h2>
        <p className="mt-3 text-neutral-400">{DATOS_TALLER.quienesSomos}</p>
      </div>
    </section>
  );
}
