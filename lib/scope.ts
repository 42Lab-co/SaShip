import { cookies } from "next/headers";
import {
  getConfig,
  getActiveScope,
  getScopeMeta,
  getScopes,
  type ProjectConfig,
} from "./config";
import { getStartDate } from "./schedule";
import { SCOPE_COOKIE } from "./scope-constants";

export { SCOPE_COOKIE };

function isValidScope(config: ProjectConfig, id: string | undefined): id is string {
  return !!id && getScopes(config).some((s) => s.id === id);
}

/**
 * Resolve the active scope for a request. Precedence:
 *   ?scope= (shareable, source of truth) → cookie (last choice) → the active phase.
 * Reading cookies() opts the calling page into dynamic rendering, which is fine here
 * (all data is request-time file reads).
 */
export async function resolveScope(searchParams?: { scope?: string }): Promise<string> {
  const config = await getConfig();

  if (isValidScope(config, searchParams?.scope)) return searchParams!.scope!;

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(SCOPE_COOKIE)?.value;
  if (isValidScope(config, fromCookie)) return fromCookie;

  return getActiveScope(config).id;
}

/** Default scope for the nav (server side): cookie memory → active phase. */
export function pickDefaultScope(
  cookieVal: string | undefined,
  config: ProjectConfig
): string {
  if (isValidScope(config, cookieVal)) return cookieVal;
  return getActiveScope(config).id;
}

/** Start date for a scope: its config startDate, falling back to the legacy top-level date. */
export async function getScopeStartDate(scopeId: string): Promise<string> {
  const config = await getConfig();
  const meta = getScopeMeta(config, scopeId);
  if (meta?.startDate) return meta.startDate;
  return getStartDate();
}
