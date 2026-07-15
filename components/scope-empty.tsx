export function ScopeEmpty({
  scopeLabel,
  kind,
}: {
  scopeLabel: string;
  kind: string;
}) {
  return (
    <div className="border border-dashed border-border-default p-10 text-center">
      <span className="mb-3 inline-block rounded-sm border border-border-default px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-text-muted">
        {scopeLabel}
      </span>
      <h3 className="text-[14px] font-semibold uppercase tracking-[0.04em] text-text-primary">
        Pas encore démarré
      </h3>
      <p className="mx-auto mt-2 max-w-md text-[12px] leading-relaxed text-text-muted">
        Aucun {kind} pour ce périmètre pour l&apos;instant.
      </p>
    </div>
  );
}
