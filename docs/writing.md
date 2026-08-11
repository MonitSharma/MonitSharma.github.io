# Writing on this site

The publishing system is a static extension of the existing Gulp/Pug site. Source Markdown lives in `content/writing/posts/`; generated pages live in `writing/`. No server or account is required to read or search the output.

## Local workflow

```bash
npm install
npm run build:writing
npm test
npm run audit:links
```

The existing project pages can still be regenerated with `gulp build`. `npm run build` runs the writing build first and then the legacy Gulp build. The legacy Gulp build may need its historical competition data and package environment; it does not own `/writing/`.

## New article

Create `content/writing/posts/my-article.md`:

```yaml
---
title: "A clear title"
slug: my-article
date: "2026-08-11"
updated: "2026-08-11"
status: published
series: Quantum Hardware
series_order: 2
excerpt: "One sentence used on cards, metadata, and the feed."
tags:
  - quantum computing
authors:
  - "Monit Sharma"
canonical_url: "https://monitsharma.github.io/writing/my-article/"
medium_url: "https://medium.com/@_monitsharma/..."
github_url: "https://github.com/..."
paper_url: "https://doi.org/..."
youtube_url: "https://www.youtube.com/watch?v=VIDEO_ID"
draft: false
---
```

Required fields are `title`, `slug`, `date`, `excerpt`, `tags`, and `authors`. Slugs must be unique lowercase kebab case. Series names must have a matching YAML file in `content/writing/series/`. Drafts are validated but not published.

## Markdown features

- KaTeX: use `$...$` inline and `$$...$$` for display equations. Wide display equations scroll on small screens.
- Images: `![meaningful alt text](/path/image.png "Caption")`. Images are lazy-loaded, clickable, and rendered as figures. Do not invent alt text; leave a migration warning for review when the description is unknown.
- YouTube: put a normal YouTube URL on its own line, or use `youtube_url` in front matter. Output uses `youtube-nocookie.com`, has a title, lazy loading, no autoplay, and a fallback link.
- Fenced code: use a language label such as `python`, `javascript`, `typescript`, `bash`, `json`, `yaml`, `cpp`, `cuda`, `qiskit`, or `pennylane`. Blocks include a language label, keyboard-focusable scrolling, and Copy.
- Mermaid: use a `mermaid` fenced block. The browser loads Mermaid only on pages that contain a diagram.
- Tables and footnotes use standard Markdown and `[^note]` definitions.
- Citations are normal explicit links to DOI, arXiv, GitHub, documentation, datasets, or related articles. Do not fabricate sources.

## Series and tags

Add or edit a series file under `content/writing/series/`. `name`, `slug`, and `description` are the core fields; `articles` controls order, and `upcoming` can document planned parts without publishing them. Tags are plain front-matter strings. Optional descriptions live in `content/writing/tags.yml`.

## Medium migration

`npm run migrate:medium` reads the author’s public Medium RSS feed and converts the three configured representative articles with Turndown. It writes Markdown, `content/writing/migration-manifest.yml`, and `reports/migration-report.md`. The migration does not edit Medium or publish externally. Review image alt text, links, figures, and wording before migrating additional stories.

## Audits and deployment

`npm run audit:links` checks generated internal paths and reachable external links, classifying failures as confirmed broken, redirected, blocked, unavailable during check, or requiring manual review. It writes `reports/link-audit.json` and `reports/link-audit.md`.

The build generates `writing/feed.xml`, `writing/search-index.json`, root `sitemap.xml`, and root `robots.txt`. Commit generated writing output with its Markdown sources when deploying to GitHub Pages. No push is performed by this task.
