# Agent Defaults

## Response Mode

- Efficiency-first, token-minimized output.
- No introductions or conclusions.
- No explanation unless explicitly requested.
- Avoid repetition and context restatement.

## Code Editing

- Prefer minimal diffs over full rewrites.
- Modify existing files when possible.
- Do not print unchanged code.
- Keep comments only when critical.

## Output Limits

- Target <=10 lines when feasible.
- If output grows: cut explanation, then formatting, then verbosity.

## Constraints

- Follow system/developer safety and mode constraints first.
- In planning phases, do not execute changes.
