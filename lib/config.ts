import fs from "fs/promises";
import path from "path";

export type ScopeStatus = "done" | "active" | "upcoming";

export interface ScopeConfig {
  id: string;
  label: string;
  startDate: string;
  status: ScopeStatus;
  /** Optional Linear label used to filter the Issues page to this phase. */
  linearLabel?: string;
  /**
   * Whether deliverables are attributed per developer. Defaults to true (legacy
   * scopes ship a column per dev). Set false for scopes delivered as one team:
   * the roadmap then renders a single unattributed track.
   */
  ownership?: boolean;
}

export interface ProjectConfig {
  project: string;
  devs: string[];
  environments: ("staging" | "prod")[];
  commitPrefix: string;
  linearTeamKey?: string;
  /** Sequential project scopes. Absent on un-migrated branches (treated as a single scope-1). */
  scopes?: ScopeConfig[];
}

/** Scope any untagged record defaults to. */
export const DEFAULT_SCOPE = "scope-1";

const CONFIG_PATH = path.join(process.cwd(), "project.config.json");

let cachedConfig: ProjectConfig | null = null;

export async function getConfig(): Promise<ProjectConfig> {
  if (cachedConfig) return cachedConfig;
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf-8");
    cachedConfig = JSON.parse(raw) as ProjectConfig;
    return cachedConfig;
  } catch {
    return {
      project: "project-x",
      devs: [],
      environments: ["staging", "prod"],
      commitPrefix: "[project-x]",
    };
  }
}

export function hasMultipleEnvironments(config: ProjectConfig): boolean {
  return config.environments.length > 1;
}

/** Scope key for any record; untagged records belong to the first phase. */
export const scopeOf = (x: { scope?: string }): string => x.scope ?? DEFAULT_SCOPE;

/** The declared scopes; synthesizes a single active scope-1 for un-migrated configs. */
export function getScopes(config: ProjectConfig): ScopeConfig[] {
  if (config.scopes && config.scopes.length > 0) return config.scopes;
  return [{ id: DEFAULT_SCOPE, label: "Scope 1", startDate: "", status: "active" }];
}

/** The phase currently being built (status:"active"), falling back to the first. */
export function getActiveScope(config: ProjectConfig): ScopeConfig {
  const scopes = getScopes(config);
  return scopes.find((s) => s.status === "active") ?? scopes[0];
}

export function getScopeMeta(config: ProjectConfig, id: string): ScopeConfig | undefined {
  return getScopes(config).find((s) => s.id === id);
}

export function hasMultipleScopes(config: ProjectConfig): boolean {
  return getScopes(config).length > 1;
}

/** Per-developer attribution is on unless a scope explicitly opts out. */
export function scopeHasOwnership(config: ProjectConfig, id: string): boolean {
  return getScopeMeta(config, id)?.ownership !== false;
}

/**
 * Time windows per scope, sorted by startDate. The earliest window is left-open
 * (start=null) so commits predating the first scope never orphan; the latest is right-open.
 * Used to attribute the flat commit log to a phase by date.
 */
export function getScopeWindows(
  config: ProjectConfig
): { id: string; start: string | null; end: string | null }[] {
  const sorted = [...getScopes(config)].sort((a, b) => a.startDate.localeCompare(b.startDate));
  return sorted.map((s, i) => ({
    id: s.id,
    start: i === 0 ? null : s.startDate,
    end: sorted[i + 1]?.startDate ?? null,
  }));
}
