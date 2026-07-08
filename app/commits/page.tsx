import { getCommitLog } from "@/lib/mdx";
import {
  getConfig,
  getScopeMeta,
  getScopeWindows,
  hasMultipleScopes,
} from "@/lib/config";
import { resolveScope } from "@/lib/scope";
import { ScopeEmpty } from "@/components/scope-empty";

export default async function CommitsPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string }>;
}) {
  const scopeId = await resolveScope(await searchParams);
  const [config, allCommits] = await Promise.all([getConfig(), getCommitLog()]);

  const multi = hasMultipleScopes(config);
  let commits = allCommits;
  if (multi) {
    const win = getScopeWindows(config).find((w) => w.id === scopeId);
    if (win) {
      commits = allCommits.filter((c) => {
        // Undated commits fall into the earliest (left-open) window.
        if (!c.date) return win.start === null;
        const afterStart = win.start === null || c.date >= win.start;
        const beforeEnd = win.end === null || c.date < win.end;
        return afterStart && beforeEnd;
      });
    }
  }
  const scopeLabel = getScopeMeta(config, scopeId)?.label ?? scopeId;

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="font-display text-[clamp(24px,4vw,40px)] font-bold uppercase leading-[0.9] tracking-tight text-neutral-900">
          Commits
        </h1>
        <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-text-muted">
          {config.project} — {multi ? scopeLabel : "all commits"}
        </p>
      </div>

      {commits.length === 0 ? (
        multi ? (
          <ScopeEmpty scopeLabel={scopeLabel} kind="commit" />
        ) : (
          <div className="border border-border-default p-8 text-center">
            <p className="text-[12px] text-text-muted">No commits recorded yet.</p>
          </div>
        )
      ) : (
        <div className="border border-border-default">
          <div className="border-b border-border-default px-4 py-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-primary">
              Commit Log
            </span>
            <span className="ml-3 text-[10px] uppercase tracking-[0.15em] text-text-muted">
              {commits.length} commits
            </span>
          </div>
          <div className="divide-y divide-border-default">
            {commits.map((commit, i) => {
              const prevDate = i > 0 ? commits[i - 1].date : null;
              const showDate = commit.date && commit.date !== prevDate;
              return (
                <div key={i}>
                  {showDate && (
                    <div className="border-b border-border-default bg-neutral-50 px-4 py-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                        {commit.date}
                      </span>
                    </div>
                  )}
                  <div className="flex">
                    <div className="w-1 shrink-0 bg-accent/40" />
                    <div className="flex-1 px-4 py-3">
                      <p className="text-[12px] leading-relaxed text-text-secondary">
                        {commit.message}
                        {commit.author && (
                          <span className="ml-2 text-[10px] uppercase tracking-[0.15em] text-text-muted">
                            — {commit.author}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-8">
        <span className="text-[10px] tracking-[0.1em] text-neutral-400">
          // SECTION: COMMIT_LOG
        </span>
        <span className="text-[10px] tracking-[0.1em] text-neutral-400">
          003
        </span>
      </div>
    </div>
  );
}
