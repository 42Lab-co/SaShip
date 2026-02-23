import type { DeliverableFrontmatter } from "@/lib/mdx";

const statusConfig: Record<
  DeliverableFrontmatter["status"],
  { label: string; color: string; dotColor: string }
> = {
  staging: {
    label: "STAGING",
    color: "text-status-staging",
    dotColor: "bg-status-staging",
  },
  deployed: {
    label: "SHIPPED",
    color: "text-accent-text",
    dotColor: "bg-accent",
  },
};

export function StatusBadge({
  status,
}: {
  status: DeliverableFrontmatter["status"];
}) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 ${config.color}`}>
      <span
        className={`inline-block h-[6px] w-[6px] rounded-full ${config.dotColor}`}
        style={
          status === "staging"
            ? { animation: "pulse-dot 2s infinite" }
            : undefined
        }
      />
      <span className="text-[10px] font-medium tracking-[0.15em]">
        {config.label}
      </span>
    </span>
  );
}
