# Monit Sharma · Quantum Classroom

The source repository for [monitsharma.github.io](https://monitsharma.github.io/): an open learning space for quantum computing, scientific computing, mathematics, programming, and technical writing.

## What is here

- **Quantum Classroom** — curated learning paths, codebooks, worked solutions, projects, and the browser-based [Practice Lab](practice.html).
- **Personal writing** — Markdown-based articles under [`/writing/`](writing/), including article series, tags, search, RSS, and migrated Medium posts.
- **Portfolio links** — the classroom connects to Monit’s project and portfolio pages without requiring a server-side application.

The site is a static GitHub Pages project. There is no database, login, or server runtime required to read the published pages.

## Local development

Requires Node.js and npm.

```bash
npm install
npm run build
npm test
```

`npm run build` performs both build stages:

1. `build:writing` validates the Markdown sources and generates the writing pages, search index, RSS feed, sitemap, and robots file.
2. `build:legacy` renders the existing Pug-based project, program, and competition pages while preserving the hand-authored classroom homepage.

Useful checks:

```bash
npm run audit:links
npm run audit:a11y
```

These audits write reports under [`reports/`](reports/). Some migrated images intentionally remain flagged for alt-text review until meaningful descriptions are available.

## Writing workflow

Create a new article in [`content/writing/posts/`](content/writing/posts/) with front matter like:

```yaml
---
title: "A clear article title"
slug: a-clear-article-title
date: "2026-08-12"
status: published
excerpt: "One sentence used for cards, metadata, and the feed."
tags:
  - quantum computing
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/a-clear-article-title/
draft: false
---
```

Then run:

```bash
npm run build:writing
npm test
```

The publisher supports KaTeX equations, syntax-highlighted code blocks with copy buttons, Mermaid diagrams, tables, footnotes, citations, images with captions, YouTube embeds, article series, tags, search, and related-article navigation.

Do not edit generated files in [`writing/`](writing/) directly. Edit the Markdown source, series YAML, or tag descriptions and rebuild instead.

## Repository layout

```text
content/writing/       Markdown posts, series, tags, and migration data
writing/               Generated static writing pages and search assets
scripts/               Writing, legacy, migration, and audit build scripts
tests/                 Node test suite and Markdown feature fixtures
docs/                  Authoring and publishing notes
views/                 Existing Pug templates for legacy pages
index.html             Quantum Classroom homepage
practice.html          Browser-based Practice Lab
```

## Deployment

The repository is designed for GitHub Pages. Generated static output should be committed alongside its source files before publishing. The main branch is the deployment source for the public site.

## License and content

The repository contains personal educational material, migrated writing, project links, and generated site output. Please open an issue before reusing substantial content or changing the publishing structure.
