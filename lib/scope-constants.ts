// Client-safe scope constants. Kept in their own module (no fs / next/headers)
// so both the client ScopeSwitcher and the server-side scope resolver can import them.

export const SCOPE_COOKIE = "saship-scope";
export const SCOPE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Persist the chosen scope as a UI-preference cookie (client-side only). */
export function writeScopeCookie(id: string): void {
  document.cookie = `${SCOPE_COOKIE}=${id}; path=/; max-age=${SCOPE_COOKIE_MAX_AGE}; samesite=lax`;
}
