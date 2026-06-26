// Validaciones simples de formato para los parámetros de búsqueda.
// No se valida contra un padrón oficial: solo se descartan formatos claramente inválidos.

const PATENTE_REGEX = /^[A-Z]{2,3}\d{3}[A-Z]{0,2}$/;
const TELEFONO_REGEX = /^\+?\d{8,15}$/;

export function normalizarPatente(patente: string): string {
  return patente.trim().toUpperCase().replace(/\s+/g, "");
}

export function esPatenteValida(patente: string): boolean {
  return PATENTE_REGEX.test(normalizarPatente(patente));
}

export function normalizarTelefono(telefono: string): string {
  return telefono.trim().replace(/[\s-]+/g, "");
}

export function esTelefonoValido(telefono: string): boolean {
  return TELEFONO_REGEX.test(normalizarTelefono(telefono));
}

export function esNombreValido(nombre: string): boolean {
  return nombre.trim().length >= 2;
}

export function esServicioValido(servicio: string): boolean {
  const longitud = servicio.trim().length;
  return longitud > 0 && longitud <= 100;
}

// Tolerancia para evitar falsos negativos por latencia de red o pequeños
// desajustes de reloj entre cliente y servidor.
const TOLERANCIA_FECHA_TURNO_MS = 60 * 1000;

export function esFechaTurnoValida(fechaIso: string): boolean {
  const fecha = new Date(fechaIso);
  if (isNaN(fecha.getTime())) {
    return false;
  }
  return fecha.getTime() >= Date.now() - TOLERANCIA_FECHA_TURNO_MS;
}
