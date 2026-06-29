import { Link, useLocation } from "react-router-dom";
import { useTema } from "../context/TemaContext";

const LINKS_ANCLA = [
  { href: "/", texto: "Inicio" },
  { href: "/#servicios", texto: "Servicios" },
  { href: "/#quienes-somos", texto: "Quiénes somos" },
  { href: "/#contacto", texto: "Contacto" },
];

/** Barra de navegación superior con logo, links a la landing y CTAs principales. */
export default function Nav() {
  const { tema, toggleTema } = useTema();
  const { pathname } = useLocation();

  const enLanding = pathname === "/";
  const enHistorial = pathname.startsWith("/historial");
  const enTurnos = pathname === "/turnos";

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <img
            src="/iconoElectro.png"
            alt="ElectroUniónSMA — Taller electromecánico"
            className="h-[140px] w-auto rounded-md -scale-x-100"
          />
        </Link>

        <nav
          aria-label="Secciones del sitio"
          className="order-3 flex w-full gap-4 overflow-x-auto text-sm font-medium text-neutral-400 sm:order-none sm:w-auto sm:overflow-visible"
        >
          {LINKS_ANCLA.map((link) => {
            const activo = enLanding && link.href === "/";
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`whitespace-nowrap rounded-md px-1 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
                  activo
                    ? "text-lime-400 underline underline-offset-4 [text-shadow:0_0_10px_rgba(163,230,53,0.8)]"
                    : "hover:text-lime-400 hover:[text-shadow:0_0_10px_rgba(163,230,53,0.6)]"
                }`}
              >
                {link.texto}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/historial"
            className={`inline-flex min-h-[44px] items-center justify-center rounded-xl border px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
              enHistorial
                ? "border-lime-400 bg-neutral-800 text-lime-400 shadow-[0_0_14px_rgba(163,230,53,0.35)]"
                : "border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:border-lime-400 hover:text-lime-400 hover:shadow-[0_0_14px_rgba(163,230,53,0.35)]"
            }`}
          >
            Consultar historial
          </Link>
          <Link
            to="/turnos"
            className={`inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 text-sm font-medium text-neutral-950 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
              enTurnos
                ? "bg-lime-300 ring-2 ring-lime-400 ring-offset-1 ring-offset-neutral-950 shadow-[0_0_18px_rgba(163,230,53,0.55)]"
                : "bg-lime-400 hover:bg-lime-300 shadow-[0_0_14px_rgba(163,230,53,0.4)] hover:shadow-[0_0_22px_rgba(163,230,53,0.65)]"
            }`}
          >
            Pedir turno
          </Link>
          <button
            onClick={toggleTema}
            className="inline-flex min-h-[44px] w-11 items-center justify-center rounded-xl border border-neutral-700 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            title={tema === "oscuro" ? "Cambiar a tema industrial" : "Cambiar a tema oscuro"}
            aria-label={tema === "oscuro" ? "Cambiar a tema industrial" : "Cambiar a tema oscuro"}
          >
            {tema === "oscuro" ? <IconoBolt className="h-4 w-4" /> : <IconoLuna className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

function IconoBolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function IconoLuna({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
