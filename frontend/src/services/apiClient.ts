/**
 * Cliente HTTP base de la app. Centraliza la URL de la API y el manejo
 * de errores para que los servicios no tengan que repetir lógica de fetch.
 */

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

/** Error de la API con el código de estado HTTP asociado. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Realiza un GET contra la API y devuelve el JSON parseado.
 * Lanza ApiError si la respuesta no es exitosa.
 */
export async function apiGet<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`);
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor. Verificá tu conexión a internet.");
  }

  if (!response.ok) {
    const mensaje = await extraerMensajeError(response);
    throw new ApiError(response.status, mensaje);
  }

  return response.json() as Promise<T>;
}

/**
 * Realiza un POST contra la API con el body serializado en JSON y devuelve
 * el JSON parseado de la respuesta. Lanza ApiError si la respuesta no es
 * exitosa, con el mismo manejo de errores que apiGet.
 */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor. Verificá tu conexión a internet.");
  }

  if (!response.ok) {
    const mensaje = await extraerMensajeError(response);
    throw new ApiError(response.status, mensaje);
  }

  return response.json() as Promise<T>;
}

async function extraerMensajeError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;
  } catch {
    // El cuerpo no es JSON o está vacío; se usa un mensaje genérico.
  }

  if (response.status === 404) return "No se encontraron resultados.";
  if (response.status === 400) return "La búsqueda ingresada no es válida.";
  return "Ocurrió un error al consultar el servidor.";
}
