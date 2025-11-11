/**
 * Un wrapper para la función fetch que asegura que las rutas de la API
 * sean relativas al dominio actual.
 * 
 * En desarrollo (con `vercel dev`), las llamadas a `/api/session`
 * serán manejadas por el servidor de desarrollo local.
 * 
 * En producción, las llamadas a `/api/session` serán manejadas por
 * las Vercel Serverless Functions desplegadas.
 * 
 * Esto elimina la necesidad de una variable de entorno VITE_API_URL.
 */
export const apiFetch: typeof fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  // Aseguramos que `input` sea un string para poder manipularlo.
  const path = typeof input === 'string' ? input : input.toString();

  // No es necesario construir una URL base. Fetch usará el host actual por defecto.
  // Las rutas que empiezan con '/' son relativas al dominio raíz.
  return fetch(path, init);
};