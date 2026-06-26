import { useState, type FormEvent } from "react";
import Spinner from "./Spinner";
import { SERVICIOS_TALLER } from "../data/servicios";
import type { SolicitudTurno } from "../types/turno";

interface Props {
  enviando: boolean;
  onEnviar: (datos: SolicitudTurno) => void;
}

type Errores = Partial<Record<"nombre" | "telefono" | "servicio" | "fechaDeseada", string>>;

/** Calcula el valor mínimo aceptado por el input datetime-local: el momento actual. */
function calcularMinimoFechaHora(): string {
  const ahora = new Date();
  ahora.setSeconds(0, 0);
  const offset = ahora.getTimezoneOffset();
  const ahoraLocal = new Date(ahora.getTime() - offset * 60_000);
  return ahoraLocal.toISOString().slice(0, 16);
}

/** Formulario de solicitud de turno: datos del cliente, servicio y fecha/hora deseada. */
export default function FormularioTurno({ enviando, onEnviar }: Props) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [patente, setPatente] = useState("");
  const [servicio, setServicio] = useState("");
  const [fechaDeseada, setFechaDeseada] = useState("");
  const [comentario, setComentario] = useState("");
  const [errores, setErrores] = useState<Errores>({});

  const minimoFechaHora = calcularMinimoFechaHora();

  function handleSubmit(evento: FormEvent) {
    evento.preventDefault();

    const nuevosErrores: Errores = {};
    if (!nombre.trim()) nuevosErrores.nombre = "Ingresá tu nombre.";
    if (!telefono.trim()) nuevosErrores.telefono = "Ingresá un teléfono de contacto.";
    if (!servicio) nuevosErrores.servicio = "Elegí un servicio.";
    if (!fechaDeseada) nuevosErrores.fechaDeseada = "Elegí una fecha y hora.";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});

    const datos: SolicitudTurno = {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      servicio,
      fechaDeseada: new Date(fechaDeseada).toISOString(),
      ...(patente.trim() && { patente: patente.trim().toUpperCase() }),
      ...(comentario.trim() && { comentario: comentario.trim() }),
    };

    onEnviar(datos);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="turno-nombre" className="mb-1.5 block text-sm font-medium text-neutral-300">
            Nombre
          </label>
          <input
            id="turno-nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            placeholder="Ej: Marcela Gómez"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            className="block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 placeholder:text-neutral-500 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/30"
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={errores.nombre ? "error-turno-nombre" : undefined}
          />
          {errores.nombre && (
            <p id="error-turno-nombre" className="mt-1.5 text-sm text-red-400">
              {errores.nombre}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="turno-telefono" className="mb-1.5 block text-sm font-medium text-neutral-300">
            Teléfono
          </label>
          <input
            id="turno-telefono"
            name="telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Ej: +5492604123456"
            value={telefono}
            onChange={(evento) => setTelefono(evento.target.value)}
            className="block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 placeholder:text-neutral-500 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/30"
            aria-invalid={Boolean(errores.telefono)}
            aria-describedby={errores.telefono ? "error-turno-telefono" : undefined}
          />
          {errores.telefono && (
            <p id="error-turno-telefono" className="mt-1.5 text-sm text-red-400">
              {errores.telefono}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="turno-patente" className="mb-1.5 block text-sm font-medium text-neutral-300">
          Patente <span className="font-normal text-neutral-500">(opcional)</span>
        </label>
        <input
          id="turno-patente"
          name="patente"
          type="text"
          placeholder="Ej: AB123CD (opcional)"
          value={patente}
          onChange={(evento) => setPatente(evento.target.value)}
          className="block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 placeholder:text-neutral-500 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/30"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="turno-servicio" className="mb-1.5 block text-sm font-medium text-neutral-300">
            Servicio
          </label>
          <select
            id="turno-servicio"
            name="servicio"
            value={servicio}
            onChange={(evento) => setServicio(evento.target.value)}
            className="block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/30"
            aria-invalid={Boolean(errores.servicio)}
            aria-describedby={errores.servicio ? "error-turno-servicio" : undefined}
          >
            <option value="">Elegí un servicio</option>
            {SERVICIOS_TALLER.map((servicioTaller) => (
              <option key={servicioTaller.id} value={servicioTaller.nombre}>
                {servicioTaller.nombre}
              </option>
            ))}
          </select>
          {errores.servicio && (
            <p id="error-turno-servicio" className="mt-1.5 text-sm text-red-400">
              {errores.servicio}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="turno-fecha"
            className="mb-1.5 block text-sm font-medium text-neutral-300"
          >
            Fecha y hora deseada
          </label>
          <input
            id="turno-fecha"
            name="fechaDeseada"
            type="datetime-local"
            min={minimoFechaHora}
            value={fechaDeseada}
            onChange={(evento) => setFechaDeseada(evento.target.value)}
            className="block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/30"
            aria-invalid={Boolean(errores.fechaDeseada)}
            aria-describedby={errores.fechaDeseada ? "error-turno-fecha" : undefined}
          />
          {errores.fechaDeseada && (
            <p id="error-turno-fecha" className="mt-1.5 text-sm text-red-400">
              {errores.fechaDeseada}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="turno-comentario"
          className="mb-1.5 block text-sm font-medium text-neutral-300"
        >
          Comentario <span className="font-normal text-neutral-500">(opcional)</span>
        </label>
        <textarea
          id="turno-comentario"
          name="comentario"
          rows={3}
          placeholder="Contanos algún detalle adicional sobre lo que necesitás"
          value={comentario}
          onChange={(evento) => setComentario(evento.target.value)}
          className="block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 placeholder:text-neutral-500 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/30"
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="mt-6 flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 font-medium text-neutral-950 transition-colors hover:bg-lime-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando && <Spinner className="h-5 w-5" />}
        {enviando ? "Enviando…" : "Solicitar turno"}
      </button>
    </form>
  );
}
