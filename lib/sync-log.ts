import fs from "fs/promises";
import path from "path";

export interface SyncRun {
  timestamp: string;
  commitsProcessed: number;
  filesUpdated: number;
  deliverables: string;
}

export interface SyncLog {
  lastSync: string;
  runs: SyncRun[];
}

const SYNC_LOG_PATH = path.join(process.cwd(), "sync-log.json");

export async function getSyncLog(): Promise<SyncLog> {
  try {
    const raw = await fs.readFile(SYNC_LOG_PATH, "utf-8");
    return JSON.parse(raw) as SyncLog;
  } catch {
    return { lastSync: "", runs: [] };
  }
}
