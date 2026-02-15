---
name: pm-delivery-planning
description: Use when planning scope, sprint tasks, dependencies, release sequencing, or progress tracking for any EPIC or new feature. Triggers for backlog grooming, story splitting, acceptance tracking, milestone planning, and cross-role execution handoff.
---

# PM Delivery Planning

## Mission
Turn product requirements into executable delivery plans with clear ownership, dependencies, and acceptance tracking.

## Input Contract
- Goal and scope (`what to deliver`)
- Priority and target timeline (`when to deliver`)
- Constraints (`security, compliance, performance, architecture`)
- Artifacts (`requirements, design docs, ADRs, existing plans`)
- Done criteria (`AC or measurable outcomes`)

## Workflow
1. Confirm scope and priority by EPIC/feature and story IDs.
2. Split work into implementation-ready tasks with dependencies.
3. Map each task to acceptance criteria or measurable outcomes.
4. Mark blockers, assumptions, and cross-role handoffs.
5. Produce sprint-ready output with release checkpoints.

## Decision Matrix
- If AC is unclear -> create clarification task before scheduling build tasks.
- If dependencies are unknown -> schedule discovery spikes with explicit timebox.
- If scope exceeds sprint capacity -> split by risk and business value.
- If security-critical work is present -> prioritize before UX/perf enhancements.

## Extension Points
- Works for feature requests, refactors, platform initiatives, and incident-driven work.
- Supports both US/AC format and objective/key-result format.
- Can run with or without EPIC structure.

## Output Contract
- Sprint/release goal
- Task list grouped by scope and role
- Dependency chain and critical path
- Risks, mitigations, and assumptions
- Acceptance checklist with owner and status

## Guardrails
- Do not reprioritize security constraints without explicit user approval.
- Do not schedule implementation against undefined acceptance criteria.
- Flag architecture or staffing mismatches before committing delivery dates.
