import { registerBundledSkill } from '../bundledSkills.js'

type WorkflowDefinition = {
  name: string
  description: string
  whenToUse: string
  argumentHint?: string
  reference: string
  instructions: string
}

const WORKFLOWS: WorkflowDefinition[] = [
  {
    name: 'alfred-plan',
    description: 'Create an implementation plan before coding, adapted from ECC planning workflows.',
    whenToUse:
      'Use when the task is multi-file, architectural, risky, or ambiguous and the user should confirm a plan before implementation.',
    argumentHint: '[task]',
    reference: `# ECC Planning Notes

- Restate the user request clearly.
- Identify risks, constraints, and dependencies.
- Break work into concrete phases.
- Wait for explicit confirmation before editing when the task is large or ambiguous.
- Suggest follow-up workflows such as TDD, review, and verification after planning.
`,
    instructions: `You are running Alfred's planning workflow, adapted from Everything Claude Code.

1. Restate the user's goal clearly.
2. Identify risks, blockers, and dependencies.
3. Produce a concise phase-by-phase implementation plan.
4. Call out what should be tested or validated.
5. If the task is substantial, end by asking for confirmation before implementation.
`,
  },
  {
    name: 'alfred-search',
    description: 'Research existing repo patterns, packages, MCPs, and tools before building something new.',
    whenToUse:
      'Use before adding a dependency, designing a new subsystem, or writing custom code for a common problem.',
    argumentHint: '[thing to research]',
    reference: `# ECC Search-First Notes

- Search the repo first for existing patterns.
- Check packages, MCPs, and external tools before building custom code.
- Compare adopt-vs-wrap-vs-build options.
- Prefer the smallest reliable solution that fits the task.
`,
    instructions: `Run Alfred's search-first workflow.

1. Search the current codebase for existing solutions.
2. Identify whether an external package, MCP, or upstream feature already solves the problem.
3. Compare the best options briefly.
4. Recommend adopt, wrap, compose, or build-custom with a reason.
5. Only then propose implementation.
`,
  },
  {
    name: 'alfred-tdd',
    description: 'Apply a focused test-driven workflow inspired by ECC TDD guidance.',
    whenToUse:
      'Use when implementing features, fixing bugs, or refactoring code that benefits from a red-green-refactor loop.',
    argumentHint: '[feature or bug]',
    reference: `# ECC TDD Notes

- Write tests before production code.
- Confirm a real RED state before implementing.
- Make the minimum change to reach GREEN.
- Refactor only after tests pass.
- Prefer focused tests over noisy test bloat.
`,
    instructions: `Apply Alfred's TDD workflow.

1. State the behavior to verify.
2. Define the smallest meaningful failing test or validation.
3. Keep implementation minimal until the failing case passes.
4. Refactor only while preserving green checks.
5. Report the exact tests or validations that prove the change.
`,
  },
  {
    name: 'alfred-review',
    description: 'Review changes for correctness, regressions, maintainability, and security.',
    whenToUse:
      'Use after implementation, before committing, or when the user explicitly asks for a review.',
    argumentHint: '[scope]',
    reference: `# ECC Review Notes

- Review local changes or a PR for correctness first.
- Prioritize security, data loss, auth, validation, and behavioral regressions.
- Then look at maintainability, missing tests, and risky complexity.
- Report findings by severity with actionable fixes.
`,
    instructions: `Run Alfred's review workflow.

1. Examine the changed behavior and likely risk areas.
2. Prioritize bugs, regressions, missing validation, and security issues.
3. Note missing tests or weak verification.
4. Report findings ordered by severity.
5. Keep summaries brief when findings exist.
`,
  },
  {
    name: 'alfred-verify',
    description: 'Run a release-readiness verification loop for builds, types, lint, tests, and changed files.',
    whenToUse:
      'Use after completing a change and before handing it off, committing, or releasing.',
    reference: `# ECC Verification Notes

- Verify build, typecheck, lint, tests, and changed-file review.
- Stop on failing build or type errors.
- Summarize what passed, failed, or was skipped.
- Decide whether the change is ready.
`,
    instructions: `Run Alfred's verification loop.

1. Check the relevant validation commands for the current project.
2. Review changed files for unintended edits or missing edge-case handling.
3. Summarize pass/fail/skipped results.
4. State clearly whether the work is ready or what still blocks it.
`,
  },
  {
    name: 'alfred-security',
    description: 'Apply a practical security checklist for auth, secrets, input validation, and sensitive operations.',
    whenToUse:
      'Use for auth flows, APIs, secrets, user input, file handling, payments, or third-party integrations.',
    reference: `# ECC Security Notes

- Never hardcode secrets.
- Validate all user input.
- Check auth and authorization before sensitive actions.
- Avoid XSS, injection, path traversal, and sensitive logging.
- Prefer generic user-facing error messages.
`,
    instructions: `Run Alfred's security review workflow.

1. Identify trust boundaries, user input, credentials, and sensitive actions.
2. Check for secrets handling, authz/authn gaps, injection, XSS, CSRF, and unsafe logging.
3. Call out the most serious risks first.
4. Recommend the minimum concrete fixes needed to make the change safer.
`,
  },
]

export function registerAlfredWorkflowSkills(): void {
  for (const workflow of WORKFLOWS) {
    registerBundledSkill({
      name: workflow.name,
      description: workflow.description,
      whenToUse: workflow.whenToUse,
      argumentHint: workflow.argumentHint,
      userInvocable: true,
      files: {
        'ECC.md': workflow.reference,
      },
      async getPromptForCommand(args) {
        const task = args.trim()
        const scope = task
          ? `User request or focus: ${task}\n\n`
          : ''

        return [
          {
            type: 'text',
            text: `${scope}${workflow.instructions}

Read the embedded ECC reference notes before deciding on the final response. Reuse repo-native patterns whenever possible instead of inventing a parallel workflow.`,
          },
        ]
      },
    })
  }
}
