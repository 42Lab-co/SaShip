import fs from "fs/promises";
import path from "path";

export interface DeliverableEntry {
  title: string;
  description: string;
}

export interface WeekSchedule {
  week: string;
  label: string;
  sync?: string;
  devs: Record<string, DeliverableEntry[]>;
}

const SCHEDULE_PATH = path.join(process.cwd(), "content", "schedule.json");

let cachedSchedule: WeekSchedule[] | null = null;

export async function getSchedule(): Promise<WeekSchedule[]> {
  if (cachedSchedule) return cachedSchedule;
  try {
    const raw = await fs.readFile(SCHEDULE_PATH, "utf-8");
    cachedSchedule = JSON.parse(raw) as WeekSchedule[];
    return cachedSchedule;
  } catch {
    return [];
  }
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
