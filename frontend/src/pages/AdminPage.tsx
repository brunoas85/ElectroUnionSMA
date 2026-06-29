import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiPatch, apiPost, apiDelete, ApiError } from "../services/apiClient";
import type { TurnoPanel } from "../types/turno";
import type { Vehiculo } from "../types/vehiculo";

const SESSION_KEY = "adminToken";

type Pestana = "turnos" | "revision";
type FiltroEstado = "pendiente" | "confirmado" | "en revisión" | "completado" | "cancelado" | "";

const FILTROS: { valor: FiltroEstado; etiqueta: string }[] = [
  { valor: "pendiente", etiqueta: "Pendientes" },
  { valor: "confirmado", etiqueta: "Confirmados" },
  { valor: "en revisión", etiqueta: "En revisión" },
  { valor: "completado", etiqueta: "Completados" },
  { valor: "cancelado", etiqueta: "Cancelados" },
  { valor: "", etiqueta: "Todos" },
];

const COLORES_ESTADO: Record<string, string> = {
  pendiente: "bg-amber-900/60 text-amber-300 border border-amber-700",
  confirmado: "bg-blue-900/60 text-blue-300 border border-blue-700",
  "en revisión": "bg-orange-900/60 text-orange-300 border border-orange-700",
  completado: "bg-lime-900/60 text-lime-300 border border-lime-700",
  cancelado: "bg-neutral-800 text-neutral-400 border border-neutral-600",
};

function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  if (isNaN(fecha.getTime())) return iso;
  return (
    fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }) +
    " a las " +
    fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
  );
}

function linkWhatsappCliente(turno: TurnoPanel): string {
  const numero = turno.telefono.replace(/[^0-9]/g, "");
  const lineas = [
    `Hola ${turno.nombre}, le escribimos desde ElectroUniónSMA.`,
    `Su turno para "${turno.servicio}" está registrado para el ${formatearFecha(turno.fechaDeseada)}.`,
  ];
  if (turno.patente) lineas.push(`Vehículo: ${turno.patente}`);
  return `https://wa.me/${numero}?${new URLSearchParams({ text: lineas.join("\n") })}`;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// ─── Pantalla de login ────────────────────────────────────────────────────────

function PantallaLogin({ onAcceso }: { onAcceso: (token: string) => void }) {
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clave.trim()) return;
    setCargando(true);
    setError(null);
    try {
      await apiGet("/admin/verificar", authHeaders(clave));
      sessionStorage.setItem(SESSION_KEY, clave);
      onAcceso(clave);
    } catch (err) {
      setError(err instanceof ApiError && err.status === 401 ? "Clave incorrecta." : "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src="/iconoElectro.png" alt="ElectroUniónSMA" className="h-[90px] w-auto rounded-md" />
          <h1 className="text-xl font-semibold text-neutral-100">Panel del mecánico</h1>
          <p className="text-sm text-neutral-500">Ingresá la clave de acceso</p>
        </div>

        <form onSubmit={iniciarSesion} className="space-y-4">
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Contraseña"
            autoFocus
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={cargando || !clave.trim()}
            className="w-full rounded-xl bg-lime-400 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-lime-300 disabled:opacity-50"
          >
            {cargando ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Panel principal ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY));
  const [pestana, setPestana] = useState<Pestana>("turnos");

  const cerrarSesion = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setToken(null);
  };

  if (!token) {
    return <PantallaLogin onAcceso={setToken} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/iconoElectro.png" alt="ElectroUniónSMA" className="h-[90px] w-auto rounded-md" />
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Panel interno</p>
              <h1 className="text-lg font-semibold text-neutral-100">Panel del mecánico</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
            >
              Ir al sitio
            </Link>
            <button
              onClick={cerrarSesion}
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-red-400"
            >
              Salir
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl gap-1 px-4 pb-3 sm:px-6">
          {(["turnos", "revision"] as Pestana[]).map((p) => (
            <button
              key={p}
              onClick={() => setPestana(p)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${
                pestana === p
                  ? "bg-lime-400 text-neutral-950"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
              }`}
            >
              {p === "turnos" ? "Turnos" : "Nueva revisión"}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {pestana === "turnos" ? (
          <SeccionTurnos token={token} onSesionExpirada={cerrarSesion} />
        ) : (
          <SeccionNuevaRevision token={token} onSesionExpirada={cerrarSesion} />
        )}
      </main>
    </div>
  );
}

// ─── Sección turnos ───────────────────────────────────────────────────────────

function SeccionTurnos({ token, onSesionExpirada }: { token: string; onSesionExpirada: () => void }) {
  const [filtro, setFiltro] = useState<FiltroEstado>("pendiente");
  const [turnos, setTurnos] = useState<TurnoPanel[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarTurnos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const path = filtro ? `/turnos?estado=${filtro}` : "/turnos";
      const data = await apiGet<TurnoPanel[]>(path, authHeaders(token));
      setTurnos(data);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) { onSesionExpirada(); return; }
      setError(e instanceof Error ? e.message : "Error al cargar los turnos.");
    } finally {
      setCargando(false);
    }
  }, [filtro, token, onSesionExpirada]);

  useEffect(() => { cargarTurnos(); }, [cargarTurnos]);

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const actualizado = await apiPatch<TurnoPanel>(`/turnos/${id}`, { estado: nuevoEstado }, authHeaders(token));
      setTurnos((prev) => (filtro === "" ? prev.map((t) => (t.id === actualizado.id ? actualizado : t)) : prev.filter((t) => t.id !== actualizado.id)));
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) { onSesionExpirada(); return; }
      alert(e instanceof Error ? e.message : "Error al actualizar el turno.");
    }
  };

  const eliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar el turno de ${nombre}? Esta acción no se puede deshacer.`)) return;
    try {
      await apiDelete(`/turnos/${id}`, authHeaders(token));
      setTurnos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) { onSesionExpirada(); return; }
      alert(e instanceof Error ? e.message : "Error al eliminar el turno.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTROS.map(({ valor, etiqueta }) => (
          <button
            key={etiqueta}
            onClick={() => setFiltro(valor)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${
              filtro === valor
                ? "bg-neutral-700 text-neutral-100"
                : "border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      {cargando && <p className="text-center text-sm text-neutral-500">Cargando turnos...</p>}
      {error && <p className="rounded-xl bg-red-900/40 p-4 text-sm text-red-400">{error}</p>}
      {!cargando && !error && turnos.length === 0 && (
        <p className="text-center text-sm text-neutral-500">No hay turnos con ese estado.</p>
      )}

      <ul className="space-y-4">
        {turnos.map((turno) => (
          <li key={turno.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold text-neutral-100">{turno.nombre}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${COLORES_ESTADO[turno.estado] ?? "bg-neutral-800 text-neutral-400"}`}>
                    {turno.estado}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-lime-400">{turno.servicio}</p>
                <p className="mt-0.5 text-sm text-neutral-400">{formatearFecha(turno.fechaDeseada)}</p>
              </div>
              <div className="text-right text-sm text-neutral-500">
                <p>{turno.telefono}</p>
                {turno.patente && <p className="font-mono font-medium text-neutral-300">{turno.patente}</p>}
              </div>
            </div>

            {turno.comentario && (
              <p className="mt-3 rounded-lg bg-neutral-800 px-3 py-2 text-sm italic text-neutral-400">
                {turno.comentario}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {turno.estado === "pendiente" && (
                <>
                  <BotonAccion variante="primario" onClick={() => cambiarEstado(turno.id, "confirmado")}>Confirmar</BotonAccion>
                  <BotonAccion variante="peligro" onClick={() => cambiarEstado(turno.id, "cancelado")}>Cancelar</BotonAccion>
                </>
              )}
              {turno.estado === "confirmado" && (
                <>
                  <BotonAccion variante="primario" onClick={() => cambiarEstado(turno.id, "en revisión")}>Entra al taller</BotonAccion>
                  <BotonAccion variante="peligro" onClick={() => cambiarEstado(turno.id, "cancelado")}>Cancelar</BotonAccion>
                </>
              )}
              {turno.estado === "en revisión" && (
                <>
                  <BotonAccion variante="primario" onClick={() => cambiarEstado(turno.id, "completado")}>Marcar completado</BotonAccion>
                  <BotonAccion variante="peligro" onClick={() => cambiarEstado(turno.id, "cancelado")}>Cancelar</BotonAccion>
                </>
              )}
              <a
                href={linkWhatsappCliente(turno)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
              >
                <IconoWhatsapp className="h-4 w-4" />
                WhatsApp
              </a>
              <button
                onClick={() => eliminar(turno.id, turno.nombre)}
                className="ml-auto rounded-xl border border-neutral-700 px-3 py-2 text-sm text-neutral-500 transition-colors hover:border-red-800 hover:text-red-400"
                title="Eliminar turno"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Sección nueva revisión ───────────────────────────────────────────────────

function SeccionNuevaRevision({ token, onSesionExpirada }: { token: string; onSesionExpirada: () => void }) {
  const [patente, setPatente] = useState("");
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [errorVehiculo, setErrorVehiculo] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);

  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [descripcion, setDescripcion] = useState("");
  const [mecanico, setMecanico] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  const buscarVehiculo = async () => {
    if (!patente.trim()) return;
    setBuscando(true);
    setErrorVehiculo(null);
    setVehiculo(null);
    try {
      const resultados = await apiGet<Vehiculo[]>(`/vehiculos?patente=${encodeURIComponent(patente.trim())}`);
      setVehiculo(resultados[0] ?? null);
      if (!resultados[0]) setErrorVehiculo("No se encontró ningún vehículo con esa patente.");
    } catch (e) {
      setErrorVehiculo(e instanceof Error ? e.message : "Error al buscar el vehículo.");
    } finally {
      setBuscando(false);
    }
  };

  const registrarRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiculo) return;
    setEnviando(true);
    setExito(false);
    setErrorEnvio(null);
    try {
      await apiPost("/revisiones", { patente: vehiculo.patente, fecha, descripcion, mecanico }, authHeaders(token));
      setExito(true);
      setDescripcion("");
      setFecha(new Date().toISOString().slice(0, 10));
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) { onSesionExpirada(); return; }
      setErrorEnvio(e instanceof Error ? e.message : "Error al registrar la revisión.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="mb-6 text-lg font-semibold text-neutral-100">Registrar revisión</h2>

      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-neutral-300">Patente del vehículo</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={patente}
            onChange={(e) => { setPatente(e.target.value.toUpperCase()); setVehiculo(null); setErrorVehiculo(null); }}
            onKeyDown={(e) => e.key === "Enter" && buscarVehiculo()}
            placeholder="Ej: AB123CD"
            className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 font-mono text-sm text-neutral-100 placeholder-neutral-600 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
          />
          <button
            onClick={buscarVehiculo}
            disabled={buscando || !patente.trim()}
            className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-600 disabled:opacity-50"
          >
            {buscando ? "Buscando..." : "Buscar"}
          </button>
        </div>
        {errorVehiculo && <p className="mt-2 text-sm text-red-400">{errorVehiculo}</p>}
        {vehiculo && (
          <div className="mt-3 rounded-xl border border-lime-800 bg-lime-900/20 px-4 py-3">
            <p className="text-sm font-semibold text-lime-300">
              {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
            </p>
            <p className="text-xs text-neutral-400">{vehiculo.cliente.nombre} · {vehiculo.cliente.telefono}</p>
          </div>
        )}
      </div>

      {vehiculo && (
        <form onSubmit={registrarRevision} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">Fecha de la revisión</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              rows={4}
              placeholder="Qué se revisó, reparó o reemplazó..."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">Mecánico a cargo</label>
            <input
              type="text"
              value={mecanico}
              onChange={(e) => setMecanico(e.target.value)}
              required
              placeholder="Nombre del mecánico"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
            />
          </div>

          {errorEnvio && <p className="rounded-xl bg-red-900/40 px-4 py-3 text-sm text-red-400">{errorEnvio}</p>}
          {exito && <p className="rounded-xl bg-lime-900/40 px-4 py-3 text-sm text-lime-300">Revisión registrada correctamente.</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-xl bg-lime-400 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-lime-300 disabled:opacity-50"
          >
            {enviando ? "Registrando..." : "Registrar revisión"}
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Helpers de UI ────────────────────────────────────────────────────────────

function BotonAccion({ variante, onClick, children }: { variante: "primario" | "peligro"; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${
        variante === "primario"
          ? "bg-lime-400 text-neutral-950 hover:bg-lime-300"
          : "border border-red-800 text-red-400 hover:bg-red-900/40"
      }`}
    >
      {children}
    </button>
  );
}

function IconoWhatsapp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.07L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.25h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.09.81.83-3.01-.2-.31a8.2 8.2 0 0 1-1.26-4.4c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.46-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.15.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.02-.39.11-.51.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.04-.34-.04-.46-.08-.13-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38-.13-.01-.28-.01-.43-.01-.15 0-.39.06-.6.31-.2.25-.78.76-.78 1.85s.8 2.14.91 2.29c.11.15 1.55 2.37 3.76 3.23 1.87.74 2.25.6 2.66.56.41-.04 1.33-.54 1.51-1.07.19-.52.19-.97.13-1.07-.06-.1-.23-.15-.47-.27Z" />
    </svg>
  );
}
