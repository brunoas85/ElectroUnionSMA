import { DATOS_TALLER } from "../data/datosTaller";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-900">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="text-sm text-neutral-400">
          <p>{DATOS_TALLER.direccion}</p>
          <ul className="mt-1 space-y-0.5">
            {DATOS_TALLER.horarios.map((horario) => (
              <li key={horario.dias}>
                {horario.dias}: {horario.horario}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} ElectroUniónSMA.</p>
          <p>Todos los derechos reservados.</p>
          <p className="mt-1">Desarrollado por bRuno`s</p>
        </div>

        <img
          src="/iconoElectro.png"
          alt="ElectroUniónSMA"
          className="h-[100px] w-auto rounded-md"
        />
      </div>
    </footer>
  );
}
