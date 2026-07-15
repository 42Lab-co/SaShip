import fs from "fs/promises";
import path from "path";
import { DEFAULT_SCOPE } from "./config";

export interface Extra {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: "pending" | "done";
  /** Scope this extra belongs to; absent items default to scope-1. */
  scope?: string;
}

const EXTRAS_PATH = path.join(process.cwd(), "content", "extras.json");

let cachedExtras: Extra[] | null = null;

async function loadExtras(): Promise<Extra[]> {
  if (cachedExtras) return cachedExtras;
  try {
    const raw = await fs.readFile(EXTRAS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Extra[];
    cachedExtras = parsed.map((e) => ({ ...e, scope: e.scope ?? DEFAULT_SCOPE }));
    return cachedExtras;
  } catch {
    cachedExtras = [];
    return cachedExtras;
  }
}

/** All extras, or only those in the given scope when scopeId is provided. */
export async function getExtras(scopeId?: string): Promise<Extra[]> {
  const extras = await loadExtras();
  return scopeId ? extras.filter((e) => e.scope === scopeId) : extras;
}
