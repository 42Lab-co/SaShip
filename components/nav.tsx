"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ScopeConfig } from "@/lib/config";
import { ScopeSwitcher } from "./scope-switcher";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Roadmap" },
  { href: "/commits", label: "Commits" },
  { href: "/extras", label: "Extras" },
  { href: "/issues", label: "Issues" },
];

export function Nav({
  projectName,
  lastSync,
  scopes,
  defaultScope,
}: {
  projectName: string;
  lastSync?: string;
  scopes: ScopeConfig[];
  defaultScope: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const scoped = scopes.length > 1;
  const activeScope = (scoped ? searchParams.get("scope") : null) ?? defaultScope;
  const withScope = (href: string) =>
    scoped ? `${href}?scope=${activeScope}` : href;

  return (
    <nav className="sticky top-0 z-50 border-b border-border-default bg-bg-base/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href={withScope("/")} className="flex shrink-0 items-center gap-3">
          <span className="flex shrink-0 items-center gap-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-42lab.svg" alt="42Lab.co" width={140} height={28} className="shrink-0 rounded-l" />
            <span className="rounded-r bg-[#D4F53C] px-2 py-[5px] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1a1a1a]">
              SaShip
            </span>
          </span>
          <span className="hidden whitespace-nowrap text-[10px] uppercase tracking-[0.15em] text-text-muted md:inline">
            / {projectName}
          </span>
        </Link>
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-x-5 gap-y-2">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={withScope(href)}
              className={`text-[11px] uppercase tracking-[0.12em] transition-colors ${
                pathname === href
                  ? "text-text-primary font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {label}
            </Link>
          ))}

          {scoped && (
            <>
              <span className="h-3 w-px bg-border-default" aria-hidden="true" />
              <ScopeSwitcher scopes={scopes} activeScope={activeScope} />
            </>
          )}

          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent border border-accent-text/50" style={{ animation: "pulse-dot 2s infinite" }} />
            <span className="text-[10px] uppercase tracking-[0.15em] text-accent-text">
              {lastSync ? `Synced ${timeAgo(lastSync)}` : "Live"}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
