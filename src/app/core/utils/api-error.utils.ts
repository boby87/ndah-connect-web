import { isApiError } from '../api/models/error.model';

/**
 * Extrait un message lisible d'une erreur HTTP en concaténant le message
 * principal et les détails de validation par champ.
 *
 * Backend → `{ message: "Donnees invalides", details: { founders: ["ne doit pas être vide"] } }`
 * Résultat → `"Donnees invalides — founders : ne doit pas être vide"`
 *
 * @param error  Erreur capturée (HttpErrorResponse, ApiError, ou inconnue).
 * @param fallback Message à afficher si on n'arrive pas à extraire d'info.
 */
export function formatApiError(error: unknown, fallback = 'Une erreur est survenue.'): string {
  const payload = (error as { error?: unknown })?.error ?? error;

  if (!isApiError(payload)) {
    return fallback;
  }

  const detailLines = formatDetails(payload.details);
  if (detailLines.length === 0) {
    return payload.message || fallback;
  }
  return `${payload.message} — ${detailLines.join(' ; ')}`;
}

function formatDetails(details: Record<string, string[]> | undefined): string[] {
  if (!details) return [];
  return Object.entries(details).map(
    ([field, messages]) => `${field} : ${messages.join(', ')}`,
  );
}
