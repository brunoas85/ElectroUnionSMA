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
export async function apiGet<T>(path: string, headers?: Record<string, string>): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, { headers });
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
export async function apiPost<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
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

/**
 * Realiza un PATCH contra la API con el body serializado en JSON y devuelve
 * el JSON parseado de la respuesta.
 */
export async function apiPatch<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
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

/**
 * Realiza un DELETE contra la API. Devuelve void (espera 204 sin body).
 */
export async function apiDelete(path: string, headers?: Record<string, string>): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, { method: "DELETE", headers });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor. Verificá tu conexión a internet.");
  }

  if (!response.ok) {
    const mensaje = await extraerMensajeError(response);
    throw new ApiError(response.status, mensaje);
  }
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
  if (response.status === 401) return "Clave incorrecta.";
  return "Ocurrió un error al consultar el servidor.";
}
