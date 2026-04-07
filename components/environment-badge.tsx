const envConfig: Record<
  "dev" | "staging" | "prod",
  { className: string }
> = {
  dev: { className: "border-status-dev/40 text-text-muted" },
  staging: { className: "border-accent-text/40 text-accent-text" },
  prod: { className: "border-status-prod/40 text-status-prod" },
};

export function EnvironmentBadge({
  environment,
}: {
  environment: "dev" | "staging" | "prod";
}) {
  const config = envConfig[environment] ?? envConfig.staging;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] ${config.className}`}
    >
      {environment}
    </span>
  );
}
