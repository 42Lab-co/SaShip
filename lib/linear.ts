import { LinearClient } from "@linear/sdk";

export interface SlackThread {
  channel: string;
  url: string;
}

export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  url: string;
  priority: number;
  priorityLabel: string;
  stateName: string;
  stateType: string;
  stateColor: string;
  assigneeName: string | null;
  labelNames: string[];
  labelColors: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate: string | null;
  slackThreads: SlackThread[];
}

export interface LinearIssuesResult {
  issues: LinearIssue[];
  error?: string;
}

const STATE_TYPE_ORDER: Record<string, number> = {
  started: 0,
  unstarted: 1,
  backlog: 2,
  completed: 3,
  cancelled: 4,
  triage: 5,
};

export function groupByStateType(issues: LinearIssue[]) {
  const groups: Record<string, LinearIssue[]> = {};
  for (const issue of issues) {
    const key = issue.stateType;
    if (!groups[key]) groups[key] = [];
    groups[key].push(issue);
  }

  return Object.entries(groups)
    .sort(([a], [b]) => (STATE_TYPE_ORDER[a] ?? 99) - (STATE_TYPE_ORDER[b] ?? 99));
}

const TEAM_ISSUES_QUERY = `
  query TeamIssues($teamKey: String!, $first: Int!, $after: String) {
    teams(filter: { key: { eq: $teamKey } }, first: 1) {
      nodes {
        id
        labels(first: 250) {
          nodes { id name color }
        }
        issues(first: $first, after: $after, orderBy: updatedAt) {
          pageInfo { hasNextPage endCursor }
          nodes {
            id
            identifier
            title
            url
            priority
            priorityLabel
            labelIds
            createdAt
            updatedAt
            dueDate
            state { name type color }
            assignee { displayName name }
            attachments {
              nodes { sourceType subtitle title url }
            }
          }
        }
      }
    }
  }
`;

interface RawAttachment {
  sourceType: string | null;
  subtitle: string | null;
  title: string | null;
  url: string;
}

interface RawIssue {
  id: string;
  identifier: string;
  title: string;
  url: string;
  priority: number;
  priorityLabel: string;
  labelIds: string[];
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  state: { name: string; type: string; color: string } | null;
  assignee: { displayName: string | null; name: string | null } | null;
  attachments: { nodes: RawAttachment[] };
}

interface RawTeam {
  id: string;
  labels: { nodes: { id: string; name: string; color: string }[] };
  issues: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: RawIssue[];
  };
}

interface RawResponse {
  teams: { nodes: RawTeam[] };
}

export async function getLinearIssues(
  teamKey: string,
  opts?: { labelName?: string }
): Promise<LinearIssuesResult> {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    return { issues: [], error: "LINEAR_API_KEY environment variable is not set" };
  }

  try {
    const client = new LinearClient({ apiKey });

    const rawIssues: RawIssue[] = [];
    let labelNodes: { id: string; name: string; color: string }[] = [];
    let after: string | null = null;

    while (true) {
      const variables: Record<string, unknown> = { teamKey, first: 250, after };
      const { data } = await client.client.rawRequest<RawResponse, typeof variables>(
        TEAM_ISSUES_QUERY,
        variables,
      );

      const team = data?.teams.nodes[0];
      if (!team) {
        return { issues: [], error: `Team with key "${teamKey}" not found` };
      }

      if (after === null) {
        labelNodes = team.labels.nodes;
      }
      rawIssues.push(...team.issues.nodes);

      if (!team.issues.pageInfo.hasNextPage || !team.issues.pageInfo.endCursor) break;
      after = team.issues.pageInfo.endCursor;
    }

    const labelMap = new Map(labelNodes.map((l) => [l.id, { name: l.name, color: l.color }]));

    const issues: LinearIssue[] = rawIssues.map((issue) => {
      const labelNames: string[] = [];
      const labelColors: string[] = [];
      for (const labelId of issue.labelIds) {
        const label = labelMap.get(labelId);
        if (label) {
          labelNames.push(label.name);
          labelColors.push(label.color);
        }
      }

      const slackThreads: SlackThread[] = [];
      for (const att of issue.attachments.nodes) {
        if (att.sourceType === "slack") {
          const channel = att.subtitle ?? att.title ?? "Slack";
          slackThreads.push({ channel, url: att.url });
        }
      }

      return {
        id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        url: issue.url,
        priority: issue.priority,
        priorityLabel: issue.priorityLabel,
        stateName: issue.state?.name ?? "Unknown",
        stateType: issue.state?.type ?? "unstarted",
        stateColor: issue.state?.color ?? "#888",
        assigneeName: issue.assignee?.displayName ?? issue.assignee?.name ?? null,
        labelNames,
        labelColors,
        createdAt: new Date(issue.createdAt),
        updatedAt: new Date(issue.updatedAt),
        dueDate: issue.dueDate ?? null,
        slackThreads,
      };
    });

    const filtered = opts?.labelName
      ? issues.filter((i) => i.labelNames.includes(opts.labelName!))
      : issues;
    return { issues: filtered };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error querying Linear";
    return { issues: [], error: message };
  }
}
