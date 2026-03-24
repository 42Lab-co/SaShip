import { getExtras } from "@/lib/extras";
import { getConfig } from "@/lib/config";

export default async function ExtrasPage() {
  const [config, extras] = await Promise.all([getConfig(), getExtras()]);

  const pending = extras.filter((e) => e.status === "pending");
  const done = extras.filter((e) => e.status === "done");

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="font-display text-[clamp(24px,4vw,40px)] font-bold uppercase leading-[0.9] tracking-tight text-neutral-900">
          Extras
        </h1>
        <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-text-muted">
          {config.project} — additional developments
        </p>
      </div>

      {extras.length === 0 ? (
        <div className="border border-border-default p-8 text-center">
          <p className="text-[12px] text-text-muted">
            No additional developments yet. Use <code>/extra</code> to add one.
          </p>
        </div>
      ) : (
        <>
          {/* Pending */}
          {pending.length > 0 && (
            <div className="border border-border-default">
              <div className="border-b border-border-default px-4 py-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-primary">
                  Pending
                </span>
                <span className="ml-3 text-[10px] uppercase tracking-[0.15em] text-text-muted">
                  {pending.length} items
                </span>
              </div>
              <div className="divide-y divide-border-default">
                {pending.map((item) => (
                  <div key={item.id} className="flex">
                    <div className="w-1 shrink-0 bg-accent/40" />
                    <div className="flex-1 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full border border-accent-text/50 bg-accent" />
                        <span className="text-[12px] font-semibold text-text-primary">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted">
                          — {item.owner}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-1 pl-4 text-[11px] leading-relaxed text-text-secondary">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Done */}
          {done.length > 0 && (
            <div className="border border-border-default">
              <div className="border-b border-border-default px-4 py-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-primary">
                  Done
                </span>
                <span className="ml-3 text-[10px] uppercase tracking-[0.15em] text-text-muted">
                  {done.length} items
                </span>
              </div>
              <div className="divide-y divide-border-default">
                {done.map((item) => (
                  <div key={item.id} className="flex">
                    <div className="w-1 shrink-0 bg-status-done/40" />
                    <div className="flex-1 px-4 py-3 opacity-60">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-status-done" />
                        <span className="text-[12px] font-semibold text-text-primary line-through">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted">
                          — {item.owner}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-1 pl-4 text-[11px] leading-relaxed text-text-secondary">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex justify-between pt-8">
        <span className="text-[10px] tracking-[0.1em] text-neutral-400">
          // SECTION: EXTRAS
        </span>
        <span className="text-[10px] tracking-[0.1em] text-neutral-400">
          004
        </span>
      </div>
    </div>
  );
}
