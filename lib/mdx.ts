import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { DEFAULT_SCOPE } from "./config";

export interface DeliverableFrontmatter {
  title: string;
  owner: string;
  status: "staging" | "deployed";
  environment: "staging" | "prod";
  /** Scope this deliverable belongs to; absent files default to scope-1. */
  scope?: string;
}

export interface Deliverable {
  slug: string;
  frontmatter: DeliverableFrontmatter;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

export async function getAllDeliverables(scopeId?: string): Promise<Deliverable[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const mdxFiles = files.filter((f) => f.endsWith(".mdx") && f !== "commits.mdx");

    const deliverables = await Promise.all(
      mdxFiles.map(async (filename) => {
        const filePath = path.join(CONTENT_DIR, filename);
        const raw = await fs.readFile(filePath, "utf-8");
        const { data, content } = matter(raw);
        const frontmatter = data as DeliverableFrontmatter;
        // Normalize status: the Action may write "in-staging" but the UI expects "staging"
        if ((frontmatter.status as string) === "in-staging") {
          frontmatter.status = "staging";
        }
        // Untagged deliverables belong to the first phase.
        if (!frontmatter.scope) frontmatter.scope = DEFAULT_SCOPE;
        return {
          slug: filename.replace(/\.mdx$/, ""),
          frontmatter,
          content,
        };
      })
    );

    const scoped = scopeId
      ? deliverables.filter((d) => d.frontmatter.scope === scopeId)
      : deliverables;

    return scoped.sort((a, b) =>
      a.frontmatter.title.localeCompare(b.frontmatter.title)
    );
  } catch {
    return [];
  }
}

export async function getDeliverable(
  slug: string
): Promise<Deliverable | null> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    const raw = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = data as DeliverableFrontmatter;
    // Normalize status: the Action may write "in-staging" but the UI expects "staging"
    if ((frontmatter.status as string) === "in-staging") {
      frontmatter.status = "staging";
    }
    if (!frontmatter.scope) frontmatter.scope = DEFAULT_SCOPE;
    return {
      slug,
      frontmatter,
      content,
    };
  } catch {
    return null;
  }
}

export function groupByOwner(
  deliverables: Deliverable[]
): Record<string, Deliverable[]> {
  return deliverables.reduce(
    (acc, d) => {
      const owner = d.frontmatter.owner;
      if (!acc[owner]) acc[owner] = [];
      acc[owner].push(d);
      return acc;
    },
    {} as Record<string, Deliverable[]>
  );
}

export function groupByEnvironment(
  deliverables: Deliverable[]
): Record<string, Deliverable[]> {
  return deliverables.reduce(
    (acc, d) => {
      const env = d.frontmatter.environment;
      if (!acc[env]) acc[env] = [];
      acc[env].push(d);
      return acc;
    },
    {} as Record<string, Deliverable[]>
  );
}

export interface CommitEntry {
  message: string;
  author: string;
  date: string;
}

export async function getCommitLog(): Promise<CommitEntry[]> {
  try {
    const filePath = path.join(CONTENT_DIR, "commits.mdx");
    const raw = await fs.readFile(filePath, "utf-8");
    const entries: CommitEntry[] = [];
    let currentDate = "";

    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      const dateMatch = trimmed.match(/^### (\d{4}-\d{2}-\d{2})$/);
      if (dateMatch) {
        currentDate = dateMatch[1];
        continue;
      }
      if (!trimmed.startsWith("- ")) continue;
      const text = trimmed.slice(2);
      const match = text.match(/^(.+?)\s*—\s*\*(.+?)\*$/);
      if (match) {
        entries.push({ message: match[1].trim(), author: match[2].trim(), date: currentDate });
      } else {
        entries.push({ message: text, author: "", date: currentDate });
      }
    }

    return entries;
  } catch {
    return [];
  }
}
