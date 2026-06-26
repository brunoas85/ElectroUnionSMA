import { DATOS_TALLER } from "../data/datosTaller";

/** Pie de página con resumen de contacto, horarios y atribución. */
export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div>
          <img
            src="/iconoElectro.png"
            alt="ElectroUniónSMA"
            className="h-[90px] w-auto rounded-md"
          />
          <p className="mt-3 text-sm text-neutral-400">{DATOS_TALLER.direccion}</p>
          <ul className="mt-3 space-y-1 text-sm text-neutral-400">
            {DATOS_TALLER.horarios.map((horario) => (
              <li key={horario.dias}>
                {horario.dias}: {horario.horario}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-xs text-neutral-500">
          © {new Date().getFullYear()} ElectroUniónSMA. Todos los derechos reservados.
        </p>
        <p className="mt-1 text-xs text-neutral-500">Desarrollado por bRuno`s</p>
      </div>
    </footer>
  );
}
