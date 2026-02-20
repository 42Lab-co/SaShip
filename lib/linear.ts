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

export async function getLinearIssues(teamKey: string): Promise<LinearIssuesResult> {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    return { issues: [], error: "LINEAR_API_KEY environment variable is not set" };
  }

  try {
    const client = new LinearClient({ apiKey });

    const teams = await client.teams({ filter: { key: { eq: teamKey } } });
    const team = teams.nodes[0];
    if (!team) {
      return { issues: [], error: `Team with key "${teamKey}" not found` };
    }

    // Fetch team labels once to avoid N+1
    const teamLabels = await team.labels();
    const labelMap = new Map(teamLabels.nodes.map((l) => [l.id, { name: l.name, color: l.color }]));

    // Fetch issues (exclude completed/cancelled by default for active view)
    const issueConnection = await team.issues({
      first: 100,
      orderBy: "updatedAt" as never,
    });

    const issues: LinearIssue[] = [];

    for (const issue of issueConnection.nodes) {
      const state = await issue.state;
      const assignee = await issue.assignee;

      const labelNames: string[] = [];
      const labelColors: string[] = [];
      for (const labelId of issue.labelIds) {
        const label = labelMap.get(labelId);
        if (label) {
          labelNames.push(label.name);
          labelColors.push(label.color);
        }
      }

      // Fetch Slack thread attachments
      const slackThreads: SlackThread[] = [];
      try {
        const attachments = await issue.attachments();
        for (const att of attachments.nodes) {
          if (att.sourceType === "slack") {
            const channel = att.subtitle ?? att.title ?? "Slack";
            slackThreads.push({ channel, url: att.url });
          }
        }
      } catch {
        // Attachments may fail if permissions are limited — skip silently
      }

      issues.push({
        id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        url: issue.url,
        priority: issue.priority,
        priorityLabel: issue.priorityLabel,
        stateName: state?.name ?? "Unknown",
        stateType: state?.type ?? "unstarted",
        stateColor: state?.color ?? "#888",
        assigneeName: assignee?.displayName ?? assignee?.name ?? null,
        labelNames,
        labelColors,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
        dueDate: issue.dueDate ?? null,
        slackThreads,
      });
    }

    return { issues };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error querying Linear";
    return { issues: [], error: message };
  }
}
