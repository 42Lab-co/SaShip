interface RoadmapBlock {
  id: string;
  title: string;
  weeks: string;
  description: string;
}

interface OwnerSection {
  name: string;
  role: string;
  blocks: RoadmapBlock[];
}

const OWNERS: OwnerSection[] = [
  {
    name: "Quentin",
    role: "CTO",
    blocks: [
      {
        id: "avatar-offre",
        title: "Avatar + Offre",
        weeks: "S2\u20133",
        description:
          "Fondations positionnement \u2014 client id\u00e9al via interview IA, 3 personas, offre irr\u00e9sistible m\u00e9thode Hormozi",
      },
      {
        id: "cmo-ai",
        title: "CMO AI",
        weeks: "S4\u20136",
        description:
          "\u00c9quipe 4 agents marketing \u2014 strat\u00e9gie, copywriting Schwartz/Cialdini, calendrier, publication LinkedIn auto",
      },
      {
        id: "landing-pages",
        title: "Landing Pages AI",
        weeks: "S7\u201311",
        description:
          "Machine \u00e0 funnels Dotcom Secrets \u2014 8 types, builder Webflow simplifi\u00e9, Agent AI editor, domaines custom",
      },
      {
        id: "branding-ai",
        title: "Branding AI",
        weeks: "S12\u201313",
        description:
          "Identit\u00e9 visuelle IA \u2014 colorim\u00e9trie, logos, brand board, application r\u00e9troactive sur tous les assets",
      },
    ],
  },
  {
    name: "Leonard",
    role: "Dev Fullstack AI",
    blocks: [
      {
        id: "finances-p1",
        title: "Finances AI P1",
        weeks: "S2\u20135",
        description:
          "Cockpit financier \u2014 onboarding guid\u00e9, dashboard KPIs, alertes intelligentes, saisie mensuelle assist\u00e9e",
      },
      {
        id: "brain-mvp",
        title: "Brain Client",
        weeks: "S6\u20138",
        description:
          "Intelligence business \u2014 veille march\u00e9 auto, fiches concurrentielles, playbooks, profil enrichi post-coaching",
      },
      {
        id: "finances-p2",
        title: "Finances AI P2",
        weeks: "S9\u201310",
        description:
          "IA pr\u00e9dictive \u2014 pr\u00e9visionnel 3 sc\u00e9narios, simulations What-if, P&L auto, rapports partageables",
      },
      {
        id: "brain-v2",
        title: "Brain V2 + Agent V2",
        weeks: "S11\u201312",
        description:
          "Intelligence sectorielle \u2014 benchmarks, opportunit\u00e9s, recommandations proactives, navigation cross-module",
      },
    ],
  },
];

export function OwnerRoadmap() {
  return (
    <div className="space-y-8">
      {/* Sprint 0 — shared */}
      <div>
        <div className="mb-2 flex items-center gap-3">
          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-text-primary">
            Sprint 0
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted">
            Quentin + Leonard &mdash; S1
          </span>
        </div>
        <div className="border border-border-default bg-bg-panel p-4">
          <h3 className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-primary">
            Socle Commun
          </h3>
          <p className="text-[11px] leading-relaxed text-text-secondary">
            5 jours ensemble &mdash; sch&eacute;ma DB, Agent Guide (overlay IA
            r&eacute;utilisable), syst&egrave;me de cr&eacute;dits (Stripe +
            grille), conventions code, architecture
          </p>
        </div>
      </div>

      {/* Per-owner blocks */}
      {OWNERS.map((owner) => (
        <div key={owner.name}>
          <div className="mb-2 flex items-center gap-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-text-primary">
              {owner.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted">
              {owner.role}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-px border border-border-default bg-border-default sm:grid-cols-2">
            {owner.blocks.map((block) => (
              <div key={block.id} className="bg-bg-panel p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-primary">
                    {block.title}
                  </h3>
                  <span className="shrink-0 text-[10px] font-mono tracking-[0.1em] text-text-muted">
                    {block.weeks}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-text-secondary">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
