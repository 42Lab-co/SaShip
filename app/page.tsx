import { getAllDeliverables } from "@/lib/mdx";
import { getConfig, getScopeMeta } from "@/lib/config";
import { FullRoadmap } from "@/components/full-roadmap";
import { ScopeEmpty } from "@/components/scope-empty";
import { getScopeWeeks } from "@/lib/schedule";
import { getScopeStartDate, resolveScope } from "@/lib/scope";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string }>;
}) {
  const scopeId = await resolveScope(await searchParams);
  const [config, deliverables, weeks, startDate] = await Promise.all([
    getConfig(),
    getAllDeliverables(scopeId),
    getScopeWeeks(scopeId),
    getScopeStartDate(scopeId),
  ]);

  const devNames = config.devs;
  const scopeMeta = getScopeMeta(config, scopeId);
  const scopeLabel = scopeMeta?.label ?? scopeId;
  const scopeDone = scopeMeta?.status === "done";

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="font-display text-[clamp(24px,4vw,40px)] font-bold uppercase leading-[0.9] tracking-tight text-neutral-900">
          Roadmap — {scopeLabel}
        </h1>
        <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-text-muted">
          {config.project} — {devNames.join(" + ")}
        </p>
      </div>

      {weeks.length === 0 ? (
        <ScopeEmpty scopeLabel={scopeLabel} kind="jalon" />
      ) : (
        <FullRoadmap
          schedule={weeks}
          deliverables={deliverables}
          devNames={devNames}
          startDate={startDate}
          scopeDone={scopeDone}
        />
      )}
    </div>
  );
}
