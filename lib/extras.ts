import fs from "fs/promises";
import path from "path";

export interface Extra {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: "pending" | "done";
}

const EXTRAS_PATH = path.join(process.cwd(), "content", "extras.json");

let cachedExtras: Extra[] | null = null;

export async function getExtras(): Promise<Extra[]> {
  if (cachedExtras) return cachedExtras;
  try {
    const raw = await fs.readFile(EXTRAS_PATH, "utf-8");
    cachedExtras = JSON.parse(raw) as Extra[];
    return cachedExtras;
  } catch {
    return [];
  }
}
