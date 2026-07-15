import { ScopeEmpty } from "./scope-empty";

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

interface Sprint0 {
  label: string;
  title: string;
  description: string;
}

interface ScopeRoadmap {
  sprint0?: Sprint0;
  owners: OwnerSection[];
}

// Curated per-scope narrative. The roadmap grid is data-driven (roadmap.json);
// this owner view is hand-authored prose, so each scope needs its own entry.
const BY_SCOPE: Record<string, ScopeRoadmap> = {
  "scope-1": {
    sprint0: {
      label: "Quentin + Leonard — S1",
      title: "Socle Commun",
      description:
        "5 jours ensemble — schéma DB, Agent Guide (overlay IA réutilisable), système de crédits (Stripe + grille), conventions code, architecture",
    },
    owners: [
      {
        name: "Quentin",
        role: "CTO",
        blocks: [
          {
            id: "avatar-offre",
            title: "Avatar + Offre",
            weeks: "S2–3",
            description:
              "Fondations positionnement — client idéal via interview IA, 3 personas, offre irrésistible méthode Hormozi",
          },
          {
            id: "cmo-ai",
            title: "CMO AI",
            weeks: "S4–6",
            description:
              "Équipe 4 agents marketing — stratégie, copywriting Schwartz/Cialdini, calendrier, publication LinkedIn auto",
          },
          {
            id: "landing-pages",
            title: "Landing Pages AI",
            weeks: "S7–11",
            description:
              "Machine à funnels Dotcom Secrets — 8 types, builder Webflow simplifié, Agent AI editor, domaines custom",
          },
          {
            id: "branding-ai",
            title: "Branding AI",
            weeks: "S12–13",
            description:
              "Identité visuelle IA — colorimétrie, logos, brand board, application rétroactive sur tous les assets",
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
            weeks: "S2–5",
            description:
              "Cockpit financier — onboarding guidé, dashboard KPIs, alertes intelligentes, saisie mensuelle assistée",
          },
          {
            id: "brain-mvp",
            title: "Brain Client",
            weeks: "S6–8",
            description:
              "Intelligence business — veille marché auto, fiches concurrentielles, playbooks, profil enrichi post-coaching",
          },
          {
            id: "finances-p2",
            title: "Finances AI P2",
            weeks: "S9–10",
            description:
              "IA prédictive — prévisionnel 3 scénarios, simulations What-if, P&L auto, rapports partageables",
          },
          {
            id: "brain-v2",
            title: "Brain V2 + Agent V2",
            weeks: "S11–12",
            description:
              "Intelligence sectorielle — benchmarks, opportunités, recommandations proactives, navigation cross-module",
          },
        ],
      },
    ],
  },
  "scope-2": {
    owners: [
      {
        name: "Quentin",
        role: "CTO",
        blocks: [
          {
            id: "app-mobile",
            title: "App mobile iOS & Android",
            weeks: "Juin",
            description:
              "iOS & Android + push notifications natives — débloque le cockpit quotidien (accountability, relances par agents IA)",
          },
          {
            id: "communaute",
            title: "Communauté",
            weeks: "Août–Sept",
            description:
              "LMS maison (exit Circle), pré-lancement bêta fermée le 10 août puis lancement public — soirée Paris le 4 septembre",
          },
          {
            id: "proactivite",
            title: "Proactivité plateforme",
            weeks: "Juillet",
            description:
              "Push & nudges 3×/semaine, agent IA de relance, actions ciblées selon le programme et l'avancée du client",
          },
          {
            id: "frameworks",
            title: "Frameworks & méthodologie (MCP Admin)",
            weeks: "À cadrer",
            description:
              "Exploiter le Knowledge Graph (17 000+ coachings) pour une vraie méthodologie — refonte barre de menu par 10 piliers / 4 profils, logique Comprendre / Découvrir / Exécuter, livraison à 2 voies (< 1-2 M€ vs profils avancés MCP-in-cloud)",
          },
        ],
      },
      {
        name: "Leonard",
        role: "Dev Fullstack AI",
        blocks: [
          {
            id: "note-taker",
            title: "Note-taker — Engram AI",
            weeks: "Juil–Août",
            description:
              "Produit maison chiffré & souverain — coachs mi-juillet, sales en août · exit Claap + SuperSales, ~20 k€/an économisés",
          },
          {
            id: "live-agents",
            title: "Live Coaching & Sales Agent",
            weeks: "Q3 · livr. mi-août",
            description:
              "L'agent DRIVE le coach (proactif, imposé) — prépa 5 min avant + assistance live, rapport suivi par team leader · scoring des calls · ROI 3-4 M€/an",
          },
          {
            id: "monetisation",
            title: "Monétisation",
            weeks: "Q4",
            description:
              "Affiliation, partenariats (banques, assurances, SaaS), annuaire optimisé — cadrage avec Aziz",
          },
          {
            id: "moonshot",
            title: "Moonshot — Entrepreneur OS",
            weeks: "Q3–Q4",
            description:
              "Toute la data captée, un cerveau partagé accessible à l'équipe, dogfooding interne puis release clients",
          },
        ],
      },
    ],
  },
};

export function OwnerRoadmap({
  scopeId,
  scopeLabel,
}: {
  scopeId: string;
  scopeLabel: string;
}) {
  const data = BY_SCOPE[scopeId];
  if (!data) return <ScopeEmpty scopeLabel={scopeLabel} kind="parcours" />;

  return (
    <div className="space-y-8">
      {/* Sprint 0 — shared */}
      {data.sprint0 && (
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-text-primary">
              Sprint 0
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted">
              {data.sprint0.label}
            </span>
          </div>
          <div className="relative overflow-hidden border border-border-default bg-transparent p-4 transition-all duration-200 hover:border-neutral-900 hover:shadow-[0_2px_8px_rgba(26,26,20,0.06)]">
            <div
              className="absolute inset-y-0 left-0 w-[3px]"
              style={{ background: "var(--accent-primary)" }}
            />
            <h3 className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-primary">
              {data.sprint0.title}
            </h3>
            <p className="text-[11px] leading-relaxed text-text-secondary">
              {data.sprint0.description}
            </p>
          </div>
        </div>
      )}

      {/* Per-owner blocks */}
      {data.owners.map((owner) => (
        <div key={owner.name}>
          <div className="mb-2 flex items-center gap-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-text-primary">
              {owner.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted">
              {owner.role}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-px border border-border-default sm:grid-cols-2 lg:grid-cols-4">
            {owner.blocks.map((block) => (
              <div
                key={block.id}
                className="group/card relative overflow-hidden bg-transparent p-4 transition-all duration-200"
              >
                <div
                  className="absolute inset-y-0 left-0 w-[2px] opacity-0 transition-opacity duration-200 group-hover/card:opacity-100"
                  style={{ background: "var(--accent-primary)" }}
                />
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-primary">
                    {block.title}
                  </h3>
                  <span
                    className="shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-mono tracking-[0.1em] text-text-muted"
                    style={{ background: "var(--neutral-200)" }}
                  >
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
