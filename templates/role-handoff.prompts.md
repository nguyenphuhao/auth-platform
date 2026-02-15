# Role Handoff Prompt Templates

## Backend Implementation
```text
$senior-backend-engineer
Scope: <US IDs>
Source plan: <plan file path>
Constraints: <security/performance/compatibility>
Return:
- endpoint changes
- migration/policy changes
- integration tests mapped to AC
- risks and follow-up tasks
```

## Frontend Implementation
```text
$senior-frontend-engineer
Scope: <US IDs>
Source design: <tech design file path>
Constraints: <token system/accessibility/responsive>
Return:
- screen/component changes
- loading/empty/error/success handling
- accessibility checklist
- risks and follow-up tasks
```

## QA Validation
```text
$qa-integration-engineer
Scope: <US IDs>
Environment: <local/CI/staging>
Return:
- pass/fail by AC
- defect list (severity + owner)
- go/no-go recommendation with rationale
```

## Tech Lead Final Sign-off
```text
$tech-lead-architecture-governance
Review scope: <US IDs>
Inputs: <BE output + FE output + QA output>
Return:
- approve/reject
- unresolved risks
- required gates before release
```
