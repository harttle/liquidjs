# LiquidJS

A simple, expressive, extensible Liquid template engine for JavaScript — Shopify, Jekyll and GitHub Pages compatible, for Node.js, browsers, and the CLI, with TypeScript support. TypeScript in `src/`, bundles in `dist/`. Docs site in `docs/` (Hexo, `navy` theme).

## Layout

| Path | Contents |
| --- | --- |
| `src/parser`, `src/render`, `src/tags`, `src/filters` | Template parse and render |
| `src/context`, `src/template`, `src/tokens` | Scope, templates, token stream |
| `src/util/async.ts` | `toPromise`, `toValueSync`, `toLiquidAsync` |
| `test/` | Jest |
| `docs/source/` | Doc markdown; sidebar in `docs/source/_data/sidebar.yml` |
| `docs/themes/navy/` | Layout, CSS, JS |
| `.local/` | Scratch, repro, PoC (gitignored) |

## Commands

```
npm run build          # after src/ changes, before npm test
npm test
npm run lint
npm run check          # build + build:docs + test + lint + perf:diff (manual)
npm run build:docs
cd docs && npm start   # http://localhost:4000
npm run perf:diff
```

PR CI (`pull_request`): build, lint, test, coverage, performance. Docs build runs on push to `master` only.

PR titles: conventional format (`feat:`, `fix:`, `docs:`, …) — checked by CI. Releases on `master` use semantic-release from merged commits.

Backward-compatible API changes expected unless doing an intentional major break.

## Architecture

All core logic is one `function *` per feature. Use `yield` where you'd normally `await` a potentially async value.

- `toPromise(generator)` — async driver; awaits yielded promises
- `toValueSync(generator)` — sync driver; passes yielded values through as-is

Never duplicate logic into separate async and sync methods. One generator serves both paths.

When wrapping an async+sync pair (e.g. `contains`/`containsSync`, `readFile`/`readFileSync`), use `toLiquidAsync(asyncFn, syncFn?)` — returns a `LiquidAsync<F>` that picks sync or async via a leading `sync: boolean` arg. `yield` the result inside a generator. See `src/util/async.ts`.

## Style

Make minimal changes only. Avoid sweeping edits. Always check after you made changes.

- Change only what the task requires. No drive-by refactors, test harnesses, or extra files unless asked.
- Match existing patterns in the file you edit.
- Repro, PoC, and scratch files go in `.local/` — not tracked `poc/` folders or one-off scripts under `docs/`.

### Comments

- Do not add narrative comments. Code should be clear from structure and naming; if it needs explanation, refactor instead.
- Comments follow existing repo usage only: non-obvious invariants, `@deprecated`, JSDoc on public API where TypeDoc needs it. Not for explaining changes to the author, migration history, or restating what the code already says.
- Comments document the code; they do not fix unclear code.

### Tests

- Assert observable behavior, not internal implementation details.
- Avoid duplicate coverage; keep test diffs minimal.
- **E2E** (`test/e2e/`): import from the package root (resolves to `dist/` via `package.json`). Do not import from `src/` — e2e must match what npm consumers get.
- **Integration/unit** (`test/integration/`, etc.): may import from `src/` against current TypeScript sources.

### Docs site

- Reuse existing asset paths under `docs/source/` and `docs/themes/navy/` — no new asset directories unless asked.
- Front matter `title:` is plain text (no backticks).
- `docs/source/llms.txt` — deployed to https://liquidjs.com/llms.txt for web agents (llms.txt spec).
- After theme/markdown changes: build or serve locally, check in a browser (light and dark), not only curl or editor preview.

### README

- Research original sources before reordering contributors, logos, or lists.

## Verify

- Do not commit, push, amend, or open a PR unless asked.
- After changes: verify yourself via CLI or UI (tests, `cd docs && npm start`, browser) before reporting done. Do not tell the user to check instead.
- Before push on sweeping changes: run `npm run check`.
- Confirm facts from `.github/workflows`, `package.json`, and library docs — not stale human docs or assumptions.
- When replacing or integrating a library: read its docs and understand what the previous setup did before changing behavior.

### Security fixes

- Reproduce on current `master` first. Smallest fix that addresses the reported issue.
- If Shopify/Ruby Liquid behaves the same, document unsafe usage in filter/docs instead of changing behavior.

## Docs

- Published: https://liquidjs.com
- Repo agent instructions: this file (`AGENTS.md`)
