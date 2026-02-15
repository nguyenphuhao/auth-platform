# Idea-to-Delivery Cheatsheet (AI Agent Workflow)

Use this when you have a new idea and want role-based execution with minimal manual coordination.

## Quick Flow
1. Discovery mode (idea is still vague).
2. Choose one solution option.
3. Planning mode (generate requirements + design + implementation plan).
4. Role execution (BE/FE).
5. QA go/no-go.

## Step 1 - Discovery Mode (Vague Idea)
Copy/paste:

```text
$feature-orchestrator
Mode: discovery
Idea: <your idea in 1-2 sentences>
Business goal: <why this matters>
```

Expected output:
- 2-3 solution options
- assumptions, risks, confidence
- blocker questions
- recommended option

## Step 2 - Pick Option
Reply with:
- chosen option (`A/B/C`)
- non-negotiable constraints (deadline, security, compatibility)

## Step 3 - Planning Mode
Copy/paste:

```text
$feature-orchestrator
Mode: planning
Selected option: <A/B/C or option name>
Constraints: <security/performance/timeline constraints>
Artifacts:
/Users/haonguyen/Projects/auth-platform/docs/adr/adr-0001-auth-platform-architecture.md
/Users/haonguyen/Projects/auth-platform/AGENTS.md
Done criteria: <what must be delivered>
```

Expected output:
- new EPIC requirements file
- tech-design file
- implementation plan
- QA matrix and go/no-go criteria

## Step 4 - Save Artifacts
Use this instruction after planning output:

```text
Save outputs to:
- /Users/haonguyen/Projects/auth-platform/docs/requirements/<epic-file>.md
- /Users/haonguyen/Projects/auth-platform/docs/tech-design/<epic-tech-design-file>.md
- /Users/haonguyen/Projects/auth-platform/docs/plans/<epic-plan-file>.md
```

## Step 5 - Execution by Role

### Backend
```text
$senior-backend-engineer
Implement <US IDs> from <plan file>. Return API/migration/test coverage mapped to AC.
```

### Frontend
```text
$senior-frontend-engineer
Implement <US IDs> from <tech design file>. Return UI states + accessibility checklist.
```

### QA
```text
$qa-integration-engineer
Execute integration/smoke tests for <US IDs>. Return go/no-go with risk rationale.
```

## Step 6 - Final Sign-off
Copy/paste:

```text
$tech-lead-architecture-governance
Review final BE/FE/QA outputs for <US IDs>. Return approve/reject and unresolved risks.
```

## Minimal Prompt (When You Are Busy)
If you only have 15 seconds, use this:

```text
$feature-orchestrator
Mode: discovery
Idea: <your idea>
Business goal: <target outcome>
```
