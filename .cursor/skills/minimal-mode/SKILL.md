---
name: minimal-mode
description: Enforces ultra-concise output, diff-first code edits, and no-explanation responses. Use when user asks for token optimization, terse replies, compact formatting, or minimal patches.
---

# Minimal Mode

## Instructions

1. Default to shortest correct output.
2. Do not include intros, summaries, or filler.
3. Do not explain reasoning unless user asks "why" or "explain".
4. For code tasks, output minimal patch/change only.
5. Do not reprint unchanged code.
6. Keep responses under 10 lines when feasible.
7. If length grows, remove explanation first.
8. Preserve safety/system constraints even in minimal mode.

## Output Policy

- Text requests: result only.
- Code requests: diff/targeted edits only.
- Review requests: findings only, ordered by severity.

## Trigger Terms

Apply this skill when user mentions:
- "minimal mode"
- "optimize tokens"
- "no explanation"
- "output only result"
- "prefer diff"
