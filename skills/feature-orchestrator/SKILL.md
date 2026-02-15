---
name: feature-orchestrator
description: Use when a user provides a new idea or feature and wants automatic multi-role execution. This skill orchestrates PM, Tech Lead, Senior Back End, Senior Front End, and QA workflows end-to-end with cross-review and final delivery artifacts.
---

# Feature Orchestrator

## Mission
Convert a raw feature idea into a trusted execution package by coordinating role-based workflows with explicit review gates.

## Role Skills Used
- `pm-delivery-planning`
- `tech-lead-architecture-governance`
- `senior-backend-engineer`
- `senior-frontend-engineer`
- `qa-integration-engineer`

## Trigger Conditions
Use this skill when:
- The user gives a new product/technical idea and asks to “plan/build this”.
- The user wants automatic role coordination without manually prompting each role.
- The scope spans requirements, architecture, implementation, and QA readiness.

## Input Contract
Require or infer these fields:
- `idea`: one-paragraph problem/feature statement
- `goal`: desired outcome
- `scope`: in/out of scope boundaries
- `constraints`: security, timeline, performance, compliance
- `artifacts`: docs/code paths to anchor decisions
- `done_criteria`: acceptance outcomes

If fields are missing, proceed with reasonable assumptions and list them explicitly.

## Orchestration Pipeline (Default)
1. PM pass
   - Generate scope breakdown, stories/tasks, dependency chain, risks.
2. Tech Lead pass
   - Validate architecture fit, approve/reject approach, define technical gates.
3. Senior Back End pass
   - Propose backend/API/data/migration plan and test implications.
4. Senior Front End pass
   - Propose UI/layout/token/state handling and accessibility plan.
5. QA pass
   - Build test matrix, release risks, and go/no-go criteria.
6. Tech Lead final sign-off
   - Resolve conflicts, enforce gates, approve final approach.
7. PM publish pass
   - Produce final implementation plan and handoff package.

## Cross-Role Discussion Rules
- Every role must provide:
  - assumptions
  - risks
  - confidence score (`0.0` to `1.0`)
  - unresolved questions
- If role outputs conflict:
  1. capture conflict explicitly,
  2. run one rebuttal pass,
  3. escalate to Tech Lead for final decision.
- Security and data integrity disagreements are always blocker-level until resolved.

## Output Contract
Return a package with:
1. Feature brief
2. Story/task breakdown (owner + dependency)
3. Architecture decision summary (approved/rejected alternatives)
4. Backend plan
5. Frontend plan
6. QA plan and go/no-go criteria
7. Open risks and mitigation actions
8. Final acceptance mapping (`met/not met` target per story)

## Artifact Targets
When writing files, prefer:
- `docs/requirements/` for new feature scope
- `docs/tech-design/` for technical design
- `docs/plans/` for implementation plan
- `docs/adr/` only when architecture decision changes

## Guardrails
- Do not bypass role review order unless user explicitly asks.
- Do not mark output “ready” if critical security risks are unresolved.
- Do not invent acceptance criteria; flag and propose.
