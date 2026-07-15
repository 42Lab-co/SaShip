"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ScopeConfig } from "@/lib/config";
import { writeScopeCookie } from "@/lib/scope-constants";

const STATUS_META: Record<
  ScopeConfig["status"],
  { pill: string; className: string; sub: string }
> = {
  active: {
    pill: "Active",
    className:
      "border-accent-text/25 bg-accent-glow text-accent-text",
    sub: "en cours",
  },
  upcoming: {
    pill: "Soon",
    className: "border-border-default text-text-muted",
    sub: "à venir",
  },
  done: {
    pill: "Done",
    className: "border-status-done/35 bg-status-done/15 text-[#2f7a48]",
    sub: "terminé",
  },
};

export function ScopeSwitcher({
  scopes,
  activeScope,
}: {
  scopes: ScopeConfig[];
  activeScope: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Only render when there's an actual choice to make.
  if (scopes.length <= 1) return null;

  const current = scopes.find((s) => s.id === activeScope) ?? scopes[0];

  function select(id: string) {
    writeScopeCookie(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("scope", id);
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded border px-2 py-1.5 text-[10px] uppercase tracking-[0.15em] transition-colors ${
          open
            ? "border-accent text-text-primary"
            : "border-border-default text-text-secondary hover:border-accent hover:text-text-primary"
        }`}
      >
        <span className="text-text-muted">Scope:</span>
        {/* Compact button label (text before the em-dash); full label lives in the dropdown */}
        <span className="font-semibold text-text-primary">{current.label.split("—")[0].trim()}</span>
        <span
          className={`text-[9px] text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Choisir la phase"
          className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[240px] rounded-md border border-border-default bg-bg-panel p-1 shadow-[0_16px_34px_-22px_rgba(26,26,20,0.6)]"
        >
          <div className="px-2.5 py-2 text-[9px] uppercase tracking-[0.16em] text-text-muted">
            Phase
          </div>
          {scopes.map((s) => {
            const selected = s.id === activeScope;
            const meta = STATUS_META[s.status];
            return (
              <button
                key={s.id}
                role="option"
                aria-selected={selected}
                onClick={() => select(s.id)}
                className="relative flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-left hover:bg-bg-surface"
              >
                <span
                  className="absolute inset-y-2 left-[3px] w-[3px] rounded-sm"
                  style={{ background: selected ? "var(--accent-primary)" : "transparent" }}
                  aria-hidden="true"
                />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span
                    className={`text-[12px] tracking-[0.02em] ${selected ? "text-text-primary" : "text-text-secondary"}`}
                  >
                    {s.label}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.08em] text-text-muted">
                    {meta.sub}
                    {s.startDate ? ` · ${s.startDate}` : ""}
                  </span>
                </span>
                <span
                  className={`ml-auto shrink-0 rounded-sm border px-1.5 py-0.5 text-[8.5px] uppercase tracking-[0.14em] ${meta.className}`}
                >
                  {meta.pill}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
