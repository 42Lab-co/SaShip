# SaShip Roadmap — Claude Code Slash Command

## Installation

1. Nothing to copy: the command reads `content/roadmap.json` straight from the tracking repo, through an authenticated `gh` and the `TRACKING_REPO` / `TRACKING_BRANCH` Actions variables the digest already needs. For an offline fallback, commit a snapshot at `.saship/roadmap.json` in your **client dev repo**; the command says so whenever it falls back to it.

2. Create the file `.claude/commands/roadmap.md` in your **client dev repo**:

````markdown
Show where the project stands against its SaShip roadmap, cross-referenced with recent git activity.

The source of truth is `content/roadmap.json` on the SaShip tracking repo. `.saship/roadmap.json` in this repo is only a fallback snapshot, and it goes stale.

Steps:

1. Load the live roadmap and project config from the tracking repo. This repo's GitHub Actions variables say where they live (the SaShip digest uses the same ones):

   ```bash
   TRACKING_REPO=$(gh variable get TRACKING_REPO)
   TRACKING_BRANCH=$(gh variable get TRACKING_BRANCH)
   gh api "repos/$TRACKING_REPO/contents/content/roadmap.json?ref=$TRACKING_BRANCH" -H "Accept: application/vnd.github.raw+json"
   gh api "repos/$TRACKING_REPO/contents/project.config.json?ref=$TRACKING_BRANCH" -H "Accept: application/vnd.github.raw+json"
   ```

   If this fails (no `gh` auth, no access, offline), read `.saship/roadmap.json` instead, and say in your first line that it is a local snapshot, giving its last commit date (`git log -1 --format=%cs -- .saship/roadmap.json`).

2. Pick the scope. The roadmap comes in one of two shapes:
   - **Scopes**: `{ "scopes": [{ "id", "weeks": [...] }] }`. In `project.config.json`, `scopes[]` gives each scope's `label`, `startDate` and `status` (`done` or `active`). Use the `active` scope; if there are several, take the latest `startDate`. A scope with `"ownership": false` has a single `devs.team` bucket instead of one list per developer.
   - **Legacy**: `{ "startDate", "weeks": [...] }`, a single scope starting on `startDate`.

3. Find the current period in that scope:
   - An entry with a `dateLabel` (e.g. `"01–30/06"`, `"Oct–Déc"`) covers those dates. Take the year from the scope's `startDate`, and move to the next year when the labels wrap past December. The current period is the one that contains today.
   - Entries without a `dateLabel` are 7-day sprints counted from the scope's `startDate` (S1 = its first 7 days).
   - Before the first period, say when it starts. After the last one, say the scope is over and name the next scope if `project.config.json` lists one.

4. Get recent activity: `git fetch origin --quiet`, then `git log origin/main --no-merges --since="1 week ago" --format='%h %cs %an | %s'`. If the current period started less than a week ago, start from its first day instead.

5. Present a summary:
   - **Scope and period**, e.g. "Q3–Q4 2026 · Sept. (01–30/09) — Lancement communauté & automatisation", with the number of days left in the period.
   - **This period's plan**: every deliverable with its recorded `status` (`deployed` = shipped, `staging` = in validation, `dev` = in development, none = not started). Group by developer when the scope has ownership.
   - **Recent commits**: map each one to the deliverable it moves forward, by matching keywords in the message against deliverable titles and descriptions. Give unmatched commits as a count, not a list.
   - **Coverage**: flag the period's deliverables that have neither a status nor a matching commit (possible gaps), and those whose recorded status disagrees with the commits (e.g. still `staging` although it shipped on main).
   - **Sync**: highlight any `sync` milestone on the current or next period.

6. Arguments: `/roadmap <period>` (e.g. `/roadmap S3`, `/roadmap Sept.`, `/roadmap Q4`) shows that period instead of the current one. `/roadmap <scope-id>` (e.g. `/roadmap scope-1`) switches scope.

Keep the output concise and scannable. Use terminal-friendly formatting.
````

## Usage

From your client dev repo, run:

```bash
/roadmap
```

Claude will load the live roadmap, find the current period of the active scope, and cross-reference it with recent commits to highlight progress and gaps.

To view a specific period or scope:

```bash
/roadmap S3
/roadmap Sept.
/roadmap scope-1
```
