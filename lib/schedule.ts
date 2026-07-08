import fs from "fs/promises";
import path from "path";
import { DEFAULT_SCOPE } from "./config";

export interface DeliverableEntry {
  title: string;
  description: string;
  /** Manual status for entries without an MDX file (e.g. monthly scopes). */
  status?: "deployed" | "staging";
}

export interface WeekSchedule {
  week: string;
  label: string;
  sync?: string;
  /** Overrides the computed 6-day date range (e.g. a month span for monthly scopes). */
  dateLabel?: string;
  devs: Record<string, DeliverableEntry[]>;
}

export interface ScopeSchedule {
  id: string;
  weeks?: WeekSchedule[];
}

export interface Roadmap {
  scopes: ScopeSchedule[];
}

/** Legacy pre-scope shape: { startDate, weeks }. Still read for backward compatibility. */
interface RoadmapFile {
  startDate?: string;
  weeks?: WeekSchedule[];
  scopes?: ScopeSchedule[];
}

const ROADMAP_PATH = path.join(process.cwd(), "content", "roadmap.json");

let cachedRoadmap: Roadmap | null = null;
let legacyStartDate = "";

async function getRoadmap(): Promise<Roadmap> {
  if (cachedRoadmap) return cachedRoadmap;
  try {
    const raw = await fs.readFile(ROADMAP_PATH, "utf-8");
    const parsed = JSON.parse(raw) as RoadmapFile;
    if (parsed.scopes && parsed.scopes.length > 0) {
      cachedRoadmap = { scopes: parsed.scopes };
    } else {
      // Normalize the legacy { startDate, weeks } shape into a single default scope.
      legacyStartDate = parsed.startDate ?? "";
      cachedRoadmap = { scopes: [{ id: DEFAULT_SCOPE, weeks: parsed.weeks ?? [] }] };
    }
    return cachedRoadmap;
  } catch {
    cachedRoadmap = { scopes: [] };
    return cachedRoadmap;
  }
}

/** Weeks for a specific scope (empty if the scope has none or doesn't exist). */
export async function getScopeWeeks(scopeId: string): Promise<WeekSchedule[]> {
  const roadmap = await getRoadmap();
  return roadmap.scopes.find((s) => s.id === scopeId)?.weeks ?? [];
}

/** Back-compat: the first scope's weeks. */
export async function getSchedule(): Promise<WeekSchedule[]> {
  const roadmap = await getRoadmap();
  return roadmap.scopes[0]?.weeks ?? [];
}

/** Back-compat: the legacy top-level startDate (empty once migrated to per-scope dates). */
export async function getStartDate(): Promise<string> {
  await getRoadmap();
  return legacyStartDate;
}

export function getWeekDateRange(startDate: string, weekIndex: number): string {
  const start = new Date(startDate);
  start.setDate(start.getDate() + weekIndex * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 5); // Mon → Sat
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `${fmt(start)} – ${fmt(end)}`;
}

export function getDeliverablesByDev(
  schedule: WeekSchedule[]
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const week of schedule) {
    for (const [dev, entries] of Object.entries(week.devs)) {
      if (!result[dev]) result[dev] = [];
      for (const entry of entries) {
        if (!result[dev].includes(entry.title)) {
          result[dev].push(entry.title);
        }
      }
    }
  }
  return result;
}
