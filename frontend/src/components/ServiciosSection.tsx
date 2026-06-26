import TarjetaServicio from "./TarjetaServicio";
import { SERVICIOS_TALLER } from "../data/servicios";

/** Sección de la landing con la grilla de servicios ofrecidos por el taller. */
export default function ServiciosSection() {
  return (
    <section id="servicios" className="scroll-mt-20 px-4 py-12 sm:px-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-neutral-50">Nuestros servicios</h2>
        <p className="mt-2 text-neutral-400">
          Trabajamos con repuestos de calidad y diagnóstico preciso.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {SERVICIOS_TALLER.map((servicio) => (
          <TarjetaServicio key={servicio.id} servicio={servicio} />
        ))}
      </div>
    </section>
  );
}
