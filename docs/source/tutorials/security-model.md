---
title: Security Model
---

LiquidJS provides DoS-oriented limits (`parseLimit`, `renderLimit`, `memoryLimit`) to reduce risk, but these limits are cooperative safeguards, not strict runtime isolation.

## `memoryLimit` is cooperative

`memoryLimit` tracks memory-sensitive allocations inside LiquidJS code paths that explicitly account for them. It is best-effort mitigation for template-driven abuse, not a strict heap cap.

- It does **not** equal process RSS/heap usage.
- It does **not** sandbox JavaScript execution.
- It should be combined with process/container limits and request timeouts for production defense-in-depth.

## What it limits (and what it does not)

`memoryLimit` only limits operations that LiquidJS itself counts.

- Counted: memory-sensitive LiquidJS operations that call internal memory accounting.
- Not guaranteed counted: arbitrary user object behavior such as custom `toValue()`/`toString()` chains, or other host-side code that allocates outside LiquidJS accounting points.

In other words, `memoryLimit` limits what LiquidJS counts, not every byte your process may allocate.

## Guidance for online services

If you run an online service, avoid rendering fully user-defined templates whenever possible.

- Prefer curated templates or a restricted template subset.
- If user-defined templates are required, isolate rendering (worker/process/container), enforce OS/container memory and CPU limits, and apply request rate limits.
- Treat `parseLimit`/`renderLimit`/`memoryLimit` as one layer in a broader DoS defense strategy.

## DoS limits quick reference

LiquidJS provides 3 DoS-oriented options:

- [parseLimit][parseLimit]: limit total template size per `parse()` call.
- [renderLimit][renderLimit]: limit total render time per `render()` call.
- [memoryLimit][memoryLimit]: cooperatively limit memory-sensitive allocations counted by LiquidJS.

For heavy single-template operations, process-level isolation is still recommended (for example with [paralleljs][paralleljs]).

[paralleljs]: https://www.npmjs.com/package/paralleljs
[parseLimit]: /api/interfaces/LiquidOptions.html#parseLimit
[renderLimit]: /api/interfaces/LiquidOptions.html#renderLimit
[memoryLimit]: /api/interfaces/LiquidOptions.html#memoryLimit
