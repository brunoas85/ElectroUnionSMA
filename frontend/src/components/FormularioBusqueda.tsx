import { useState, type FormEvent } from "react";
import Spinner from "./Spinner";
import type { TipoBusqueda } from "../types/vehiculo";

interface Props {
  cargando: boolean;
  onBuscar: (tipo: TipoBusqueda, valor: string) => void;
}

/**
 * Formulario de búsqueda de vehículo por patente o teléfono.
 * El usuario elige el tipo de búsqueda y completa un único campo.
 */
export default function FormularioBusqueda({ cargando, onBuscar }: Props) {
  const [tipo, setTipo] = useState<TipoBusqueda>("patente");
  const [valor, setValor] = useState("");
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    const valorLimpio = valor.trim();

    if (!valorLimpio) {
      setErrorValidacion(
        tipo === "patente" ? "Ingresá una patente." : "Ingresá un teléfono."
      );
      return;
    }

    setErrorValidacion(null);
    const valorNormalizado = tipo === "patente" ? valorLimpio.toUpperCase() : valorLimpio;
    onBuscar(tipo, valorNormalizado);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <fieldset className="flex gap-1 rounded-lg bg-neutral-900 p-1" aria-label="Tipo de búsqueda">
        <legend className="sr-only">Elegí cómo querés buscar tu vehículo</legend>
        <BotonTipo
          activo={tipo === "patente"}
          onClick={() => setTipo("patente")}
          texto="Por patente"
        />
        <BotonTipo
          activo={tipo === "telefono"}
          onClick={() => setTipo("telefono")}
          texto="Por teléfono"
        />
      </fieldset>

      <div className="mt-4">
        <label htmlFor="valor-busqueda" className="mb-1.5 block text-sm font-medium text-neutral-300">
          {tipo === "patente" ? "Patente del vehículo" : "Teléfono del titular"}
        </label>
        <input
          id="valor-busqueda"
          name="valor-busqueda"
          type={tipo === "patente" ? "text" : "tel"}
          inputMode={tipo === "telefono" ? "tel" : "text"}
          autoComplete={tipo === "telefono" ? "tel" : "off"}
          placeholder={tipo === "patente" ? "Ej: AB123CD" : "Ej: +5492604123456"}
          value={valor}
          onChange={(evento) => setValor(evento.target.value)}
          className="block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 placeholder:text-neutral-500 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/30"
          aria-invalid={Boolean(errorValidacion)}
          aria-describedby={errorValidacion ? "error-busqueda" : undefined}
        />
        {errorValidacion && (
          <p id="error-busqueda" className="mt-1.5 text-sm text-red-400">
            {errorValidacion}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={cargando}
        className="mt-4 flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 font-medium text-neutral-950 transition-colors hover:bg-lime-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cargando && <Spinner className="h-5 w-5" />}
        {cargando ? "Buscando…" : "Buscar vehículo"}
      </button>
    </form>
  );
}

function BotonTipo({
  activo,
  onClick,
  texto,
}: {
  activo: boolean;
  onClick: () => void;
  texto: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`flex-1 min-h-[40px] rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        activo ? "bg-lime-400 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-neutral-100"
      }`}
    >
      {texto}
    </button>
  );
}
