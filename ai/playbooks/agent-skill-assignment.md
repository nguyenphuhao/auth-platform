# Agent Skill Assignment Guide

Related quick process:
- `ai/playbooks/idea-to-delivery-cheatsheet.md`

## Role to Skill Mapping
- Product/PM -> `pm-delivery-planning`
- Tech Lead -> `tech-lead-architecture-governance`
- Senior Back End -> `senior-backend-engineer`
- Senior Front End -> `senior-frontend-engineer`
- QA -> `qa-integration-engineer`
- Auto orchestration (all roles) -> `feature-orchestrator`

## Suggested Usage Pattern
1. Start each task with an explicit input contract:
   - `goal`, `scope`, `constraints`, `artifacts`, `done_criteria`
2. Trigger a role skill explicitly by name in prompt.
3. Require output to include AC/outcome status (`met` or `not met`).
4. Handoff to next role with unresolved items, risks, and dependency notes.
5. Reuse the same role chain for new EPICs or completely new features.
6. If you want full automatic coordination, use `feature-orchestrator` only.

## Prompt Templates

### PM
Use `$pm-delivery-planning` to convert any feature scope into sprint-ready tasks with dependency mapping and acceptance tracking.

### Tech Lead
Use `$tech-lead-architecture-governance` to review proposed approach and return approve/reject with architecture and security gates.

### Senior Back End
Use `$senior-backend-engineer` to implement backend changes including APIs, data changes, authorization checks, and integration tests.

### Senior Front End
Use `$senior-frontend-engineer` to implement UI with token-driven theming, accessibility checks, and complete state handling.

### QA
Use `$qa-integration-engineer` to execute integration/smoke tests and provide go/no-go recommendation with risk rationale.

### Auto Mode (All Roles)
Use `$feature-orchestrator` when you only have an idea and want PM + Tech Lead + BE + FE + QA coordination automatically.
