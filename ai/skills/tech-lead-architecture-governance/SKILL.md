---
name: tech-lead-architecture-governance
description: Use when making architecture decisions, defining technical boundaries, approving implementation approach, reviewing cross-EPIC consistency, or resolving technical tradeoffs for any new EPIC or feature.
---

# Tech Lead Architecture Governance

## Mission
Keep implementation aligned with architecture decisions, security requirements, and long-term maintainability.

## Input Contract
- Feature objective and non-goals
- Functional and non-functional requirements
- Existing architecture constraints and ADRs
- Proposed implementation approach
- Risk profile and rollout expectations

## Workflow
1. Validate proposed changes against architecture constraints and non-negotiables.
2. Check domain boundaries, module ownership, and API contracts.
3. Approve or reject design with explicit rationale and tradeoffs.
4. Define technical acceptance gates before implementation starts.
5. Record unresolved decisions and required follow-up actions.

## Architecture Checks
- Security boundaries and least-privilege controls
- Clear domain/module boundaries and dependency direction
- Reuse constraints (config-driven behavior over hardcoded variants)
- Migration safety, compatibility, and rollback path
- Operational readiness (observability, incident handling, SLO impact)

## Decision Matrix
- If change violates existing ADR -> reject or require ADR update first.
- If tradeoff increases complexity without clear business value -> reject.
- If risk is high and uncertainty is high -> require spike or staged rollout.
- If security/compliance impact is unclear -> block until clarified.

## Extension Points
- Works with monolith, modular monolith, or service-based architectures.
- Works with any provider stack (database, auth, queue, cloud) if constraints are documented.
- Works for both greenfield features and legacy refactors.

## Output Contract
- Decision summary
- Approved approach and rejected alternatives
- Technical risks and mitigations
- Required implementation gates and verification checks
- Follow-up ADR or documentation updates if needed

## Guardrails
- Prefer explicit boundaries over implicit conventions.
- Avoid introducing new infrastructure unless current constraints are exceeded.
- Escalate any change that weakens security or data integrity controls.
