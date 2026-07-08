import { getAllDeliverables } from "@/lib/mdx";
import { getConfig, getScopeMeta, hasMultipleEnvironments } from "@/lib/config";
import { getStats } from "@/lib/stats";
import { getScopeWeeks } from "@/lib/schedule";
import { resolveScope } from "@/lib/scope";
import { PipelineView } from "@/components/pipeline-view";
import { HorizonRoadmap } from "@/components/horizon-roadmap";
import { LinesChart } from "@/components/lines-chart";
import { OwnerRoadmap } from "@/components/owner-roadmap";
import { ScopeEmpty } from "@/components/scope-empty";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string }>;
}) {
  const scopeId = await resolveScope(await searchParams);
  const [config, deliverables, stats, weeks] = await Promise.all([
    getConfig(),
    getAllDeliverables(scopeId),
    getStats(),
    getScopeWeeks(scopeId),
  ]);

  const showPipeline = hasMultipleEnvironments(config);
  const scopeLabel = getScopeMeta(config, scopeId)?.label ?? scopeId;
  const scopeEmpty = weeks.length === 0 && deliverables.length === 0;

  return (
    <div className="space-y-8 animate-enter">
      {/* Header */}
      <div className="relative">
        <h1 className="font-display text-[clamp(36px,6vw,64px)] font-bold uppercase leading-[0.9] tracking-tight text-neutral-900">
          {config.project}
        </h1>
        <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-text-muted">
          Shipping visibility — {scopeLabel}
        </p>
      </div>

      {scopeEmpty ? (
        <ScopeEmpty scopeLabel={scopeLabel} kind="livrable" />
      ) : (
        <>
          {/* Horizontal roadmap overview */}
          <section>
            <HorizonRoadmap schedule={weeks} deliverables={deliverables} devNames={config.devs} />
          </section>

          {/* Pipeline View (if dev+prod) */}
          {showPipeline && (
            <section>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-primary">
                  Pipeline
                </h2>
                <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted">
                  STAGING → PROD
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-[6px] w-[6px] rounded-full bg-status-error"
                    style={{ animation: "pulse-dot 2s infinite" }}
                  />
                  <span className="text-[10px] tracking-[0.12em] text-text-muted">
                    Waiting for Fabrice&apos;s review
                  </span>
                </span>
              </div>
              <PipelineView deliverables={deliverables} />
            </section>
          )}

          {/* Lines shipped per dev */}
          <section>
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-primary">
              Output
            </h2>
            <LinesChart stats={stats} />
          </section>

          {/* Roadmap by Owner */}
          <section>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-primary">
              Roadmap by Owner
            </h2>
            <OwnerRoadmap scopeId={scopeId} scopeLabel={scopeLabel} />
          </section>

          {/* Footer section label */}
          <div className="flex justify-between pt-8">
            <span className="text-[10px] tracking-[0.1em] text-neutral-400">
              // SECTION: ROADMAP_OVERVIEW
            </span>
            <span className="text-[10px] tracking-[0.1em] text-neutral-400">001</span>
          </div>
        </>
      )}
    </div>
  );
}
