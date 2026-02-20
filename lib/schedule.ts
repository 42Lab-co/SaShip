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

export interface Roadmap {
  startDate: string;
  weeks: WeekSchedule[];
}

const ROADMAP_PATH = path.join(process.cwd(), "content", "roadmap.json");

let cachedRoadmap: Roadmap | null = null;

async function getRoadmap(): Promise<Roadmap> {
  if (cachedRoadmap) return cachedRoadmap;
  try {
    const raw = await fs.readFile(ROADMAP_PATH, "utf-8");
    cachedRoadmap = JSON.parse(raw) as Roadmap;
    return cachedRoadmap;
  } catch {
    return { startDate: "", weeks: [] };
  }
}

export async function getSchedule(): Promise<WeekSchedule[]> {
  const roadmap = await getRoadmap();
  return roadmap.weeks;
}

export async function getStartDate(): Promise<string> {
  const roadmap = await getRoadmap();
  return roadmap.startDate;
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
