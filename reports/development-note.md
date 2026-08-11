# Development note

## Baseline

- Repository: `MonitSharma/MonitSharma.github.io` (nested Git repository in this workspace)
- Existing framework: legacy Gulp 3 + Pug; existing pages are pre-generated static HTML.
- Existing sections observed: Quantum Classroom landing page, project/program/competition pages, and a linked `/portfolio/` section outside this nested repository.
- Existing baseline `npm test`: failed because it was a placeholder (`Error: no test specified`).
- Existing baseline `gulp build`: unavailable before dependency installation because `node_modules` was absent.
- Existing working-tree changes preserved: `design-system.css`, `index.html`, `views/projects/ognet/index.pug`, and `practice.html`.

## Decision

Writing lives at `/writing/` with Markdown sources in `content/writing/posts/`. This fits the current static root layout, keeps the legacy Gulp/Pug pages intact, and gives the existing Quantum Classroom page a stable, discoverable writing link.

## Limitations recorded

- The three migrated Medium articles contain source images with empty alt text. They remain in the migrated Markdown with empty alt text and are listed in `content/writing/migration-manifest.yml` and `reports/migration-report.md` for author review; no alt text was invented.
- The legacy Gulp 3 dependency tree contains old packages and npm audit warnings. The writing build is standalone and does not require a server, but the legacy pages should eventually be upgraded separately.

## Verification

- `npm run build`: passed. The Node 22-compatible adapter renders the historical Pug trees without rewriting existing tracked HTML; the Quantum Classroom landing page is preserved.
- `npm test`: passed, 6 tests.
- `npm run audit:a11y`: completed with 32 review findings, all from migrated source images with empty alt text.
- `npm run audit:links`: 100 links checked: 61 available, 32 redirected, 4 blocked, 1 requiring manual review, and 2 confirmed/unavailable in this local environment (`/portfolio/` sibling route and a PIB source returning HTTP 401).
- Browser QA: writing landing page, article fixture, series page, tag page, search query, dark mode, Mermaid/KaTeX output, code controls, and a 390px viewport were inspected locally. The mobile page reported equal document and viewport widths (390px).
