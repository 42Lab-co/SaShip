import fs from "fs/promises";
import path from "path";

export interface ProjectConfig {
  project: string;
  devs: string[];
  environments: ("staging" | "prod")[];
  commitPrefix: string;
  linearTeamKey?: string;
}

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
