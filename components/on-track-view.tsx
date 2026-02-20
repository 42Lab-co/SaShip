import type { Deliverable } from "@/lib/mdx";
import { StatusBadge } from "./status-badge";
import Link from "next/link";

interface OnTrackViewProps {
  devNames: string[];
  plannedByDev: Record<string, string[]>;
  deliverables: Deliverable[];
}

export function OnTrackView({ devNames, plannedByDev, deliverables }: OnTrackViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {devNames.map((devName) => {
        const plannedList = plannedByDev[devName] || [];
        const devDeliverables = deliverables.filter(
          (d) => d.frontmatter.owner === devName
        );
        const planned = plannedList.length;
        const shipped = devDeliverables.filter(
          (d) => d.frontmatter.status === "deployed"
        ).length;
        const inProgress = devDeliverables.filter(
          (d) => d.frontmatter.status === "in-staging"
        ).length;
        const notStarted = planned - shipped - inProgress;
        const pct = planned > 0 ? Math.round((shipped / planned) * 100) : 0;

        return (
          <div key={devName} className="border border-border-default">
            {/* Dev header */}
            <div className="flex items-center justify-between border-b border-border-default bg-bg-panel px-4 py-3">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-primary">
                {devName}
              </span>
              <span className="font-mono text-[24px] font-bold leading-none text-neutral-900">
                {pct}
                <span className="text-[12px] text-neutral-400">%</span>
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 border-b border-border-default">
              <div className="border-r border-border-default px-3 py-2.5 text-center">
                <span className="block text-[10px] uppercase tracking-[0.12em] text-text-muted">Shipped</span>
                <span className="font-mono text-[16px] font-bold text-accent-text">{shipped}</span>
              </div>
              <div className="border-r border-border-default px-3 py-2.5 text-center">
                <span className="block text-[10px] uppercase tracking-[0.12em] text-text-muted">Staging</span>
                <span className="font-mono text-[16px] font-bold text-text-primary">{inProgress}</span>
              </div>
              <div className="px-3 py-2.5 text-center">
                <span className="block text-[10px] uppercase tracking-[0.12em] text-text-muted">Pending</span>
                <span className="font-mono text-[16px] font-bold text-neutral-400">{notStarted}</span>
              </div>
            </div>

            {/* Segmented progress bar */}
            <div className="flex gap-[2px] px-4 py-3 border-b border-border-default">
              {plannedList.map((name) => {
                const match = devDeliverables.find(
                  (d) => d.frontmatter.title.toLowerCase() === name.toLowerCase()
                );
                const status = match?.frontmatter.status;
                const color =
                  status === "deployed"
                    ? "bg-accent"
                    : status === "in-staging"
                      ? "bg-neutral-400"
                      : "bg-neutral-300";
                return (
                  <div
                    key={name}
                    className={`h-2 flex-1 ${color}`}
                    title={`${name}: ${status ?? "not started"}`}
                  />
                );
              })}
            </div>

            {/* Deliverable rows */}
            <div className="divide-y divide-border-default">
              {plannedList.map((name) => {
                const match = devDeliverables.find(
                  (d) => d.frontmatter.title.toLowerCase() === name.toLowerCase()
                );
                const inner = (
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span
                      className={`text-[11px] ${
                        match ? "text-text-primary" : "text-neutral-400"
                      }`}
                    >
                      {name}
                    </span>
                    {match ? (
                      <StatusBadge status={match.frontmatter.status} />
                    ) : (
                      <span className="text-[10px] tracking-[0.12em] text-neutral-400">
                        —
                      </span>
                    )}
                  </div>
                );

                return match ? (
                  <Link
                    key={name}
                    href={`/deliverable/${match.slug}`}
                    className="block hover:bg-bg-surface transition-colors"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={name}>{inner}</div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex justify-between border-t border-border-default px-4 py-2">
              <span className="text-[10px] tracking-[0.1em] text-neutral-400">
                // {devName.toUpperCase()}
              </span>
              <span className="text-[10px] tracking-[0.1em] text-neutral-400">
                {shipped}/{planned}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
