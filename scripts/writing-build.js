/* Static Markdown publisher for /writing/. The legacy Pug/Gulp site remains the
 * owner of the existing project pages; this script only owns writing output. */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const yaml = require('yaml');
const MarkdownIt = require('markdown-it');
const anchor = require('markdown-it-anchor');
const footnote = require('markdown-it-footnote');
const katex = require('markdown-it-katex');
const hljs = require('highlight.js');

const ROOT = path.resolve(__dirname, '..');
const CONTENT = path.join(ROOT, 'content', 'writing');
const POSTS = path.join(CONTENT, 'posts');
const SERIES = path.join(CONTENT, 'series');
const TAGS = path.join(CONTENT, 'tags.yml');
const OUT = path.join(ROOT, 'writing');
const SITE = 'https://monitsharma.github.io';

function pagePaths(depth = 0) {
  const root = '../'.repeat(depth + 1);
  const writing = '../'.repeat(depth);
  return {
    home: `${root}index.html`,
    writing: `${writing}index.html`,
    designSystem: `${root}design-system.css`,
    writingCss: `${writing}writing.css`,
    writingJs: `${writing}writing.js`,
    searchJs: `${writing}search.js`,
    searchIndex: `${writing}search-index.json`,
    portfolio: `${SITE}/portfolio/`,
    post: slug => `${writing}${slug}/index.html`,
    series: slug => `${writing}series/${slug}/index.html`,
    tag: slug => `${writing}tags/${slug}/index.html`,
    search: `${writing}search/index.html`,
  };
}

function ensure(dir) { fs.mkdirSync(dir, { recursive: true }); }
function write(file, data) { ensure(path.dirname(file)); fs.writeFileSync(file, data); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function esc(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
function slugify(value) { return String(value).toLowerCase().trim().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, ''); }
function stripMarkdown(value) { return String(value || '').replace(/[`*_>#\[\]()]/g, '').replace(/\s+/g, ' ').trim(); }
function words(value) { return stripMarkdown(value).split(/\s+/).filter(Boolean).length; }
function dateText(value) { return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric', timeZone:'UTC' }); }
function iso(value) { return new Date(`${value}T00:00:00Z`).toISOString(); }
function dateValue(value) { return value instanceof Date ? value.toISOString().slice(0, 10) : String(value || ''); }

function loadSeries() {
  const map = new Map();
  if (!fs.existsSync(SERIES)) return map;
  for (const file of fs.readdirSync(SERIES).filter(f => /\.ya?ml$/.test(f))) {
    const data = yaml.parse(read(path.join(SERIES, file))) || {};
    const key = data.name || path.basename(file, path.extname(file));
    map.set(key, { ...data, slug: data.slug || slugify(key), articles: data.articles || [] });
  }
  return map;
}

function loadTags() {
  if (!fs.existsSync(TAGS)) return {};
  return yaml.parse(read(TAGS)) || {};
}

function localAssetExists(url) {
  if (!url || /^https?:\/\//i.test(url)) return true;
  return fs.existsSync(path.join(ROOT, url.replace(/^\//, '')));
}

function isTrackingImage(url) {
  return /(?:^|\/)medium\.com\/_\/stat(?:\?|$)/i.test(String(url || ''));
}

function validate(posts, series) {
  const errors = [];
  const warnings = [];
  const slugs = new Set();
  const ids = new Set();
  for (const post of posts) {
    const d = post.data;
    for (const field of ['title', 'slug', 'date', 'excerpt', 'tags', 'authors']) {
      if (d[field] === undefined || d[field] === '' || (Array.isArray(d[field]) && d[field].length === 0)) errors.push(`${post.file}: missing required field "${field}"`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d.date || ''))) errors.push(`${post.file}: date must use YYYY-MM-DD`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(d.slug || ''))) errors.push(`${post.file}: slug must be lowercase kebab-case`);
    if (slugs.has(d.slug)) errors.push(`${post.file}: duplicate slug "${d.slug}"`);
    if (ids.has(d.id || d.slug)) errors.push(`${post.file}: duplicate article id "${d.id || d.slug}"`);
    slugs.add(d.slug); ids.add(d.id || d.slug);
    if (d.series && !series.has(d.series)) errors.push(`${post.file}: invalid series reference "${d.series}"`);
    if (d.hero_image && !localAssetExists(d.hero_image)) errors.push(`${post.file}: missing hero image "${d.hero_image}"`);
    if (d.youtube_url && !youtubeId(d.youtube_url)) errors.push(`${post.file}: invalid YouTube URL`);
    const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    while ((match = imagePattern.exec(post.content))) {
      if (!match[1].trim()) warnings.push(`${post.file}: image needs meaningful alt text: ${match[2]}`);
      if (!localAssetExists(match[2].split(' ')[0])) errors.push(`${post.file}: missing local image "${match[2]}"`);
    }
  }
  return { errors, warnings };
}

function youtubeId(url) {
  const match = String(url || '').match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match && match[1];
}

function makeMarkdown() {
  const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
    .use(anchor, { slugify, permalink: anchor.permalink.ariaHidden({ placement: 'after', class: 'heading-anchor' }) })
    .use(footnote)
    .use(katex, { throwOnError: false, errorColor: '#b42318' });
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const info = token.info.trim().split(/\s+/)[0] || 'text';
    if (info.toLowerCase() === 'mermaid') return `<div class="mermaid" role="img" aria-label="Mermaid diagram">${esc(token.content)}</div>`;
    const language = hljs.getLanguage(info) ? info : 'plaintext';
    const highlighted = language === 'plaintext' ? esc(token.content) : hljs.highlight(token.content, { language }).value;
    return `<div class="code-block"><div class="code-toolbar"><span>${esc(info)}</span><button class="copy-code" type="button" data-copy-code>Copy</button></div><pre tabindex="0"><code class="language-${esc(info)}">${highlighted}</code></pre></div>`;
  };
  md.renderer.rules.image = (tokens, idx) => {
    const token = tokens[idx];
    const src = token.attrGet('src');
    if (isTrackingImage(src)) return '';
    const alt = token.content || token.attrGet('alt') || '';
    const title = token.attrGet('title');
    return `<figure class="article-figure"><a href="${esc(src)}" data-lightbox><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">${title ? `<figcaption>${esc(title)}</figcaption>` : ''}</a></figure>`;
  };
  const imageOnly = (tokens, idx) => tokens[idx + 1]?.type === 'inline' && tokens[idx + 1].children?.length === 1 && tokens[idx + 1].children[0].type === 'image';
  md.renderer.rules.paragraph_open = (tokens, idx, options, env, slf) => imageOnly(tokens, idx) ? '' : '<p>';
  md.renderer.rules.paragraph_close = (tokens, idx) => imageOnly(tokens, idx - 2) ? '' : '</p>';
  return md;
}

function embedYouTube(body) {
  return body.replace(/^\s*(https?:\/\/[^\s]+)\s*$/gmi, (line, url) => {
    const id = youtubeId(url);
    if (!id) return line;
    return `\n<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><a href="${esc(url)}">Watch this video on YouTube</a></div>\n`;
  });
}

function toc(body) {
  const items = [];
  for (const match of body.matchAll(/^#{2,3}\s+(.+)$/gm)) {
    const title = stripMarkdown(match[1].replace(/\s+#+\s*$/, ''));
    items.push({ title, id: slugify(title), level: match[0].startsWith('###') ? 3 : 2 });
  }
  return items;
}

function parsePosts() {
  ensure(POSTS);
  return fs.readdirSync(POSTS).filter(f => f.endsWith('.md')).map(file => {
    const parsed = matter(read(path.join(POSTS, file)));
    parsed.data.date = dateValue(parsed.data.date);
    if (parsed.data.updated) parsed.data.updated = dateValue(parsed.data.updated);
    return { file: path.join(POSTS, file), filename: file, data: parsed.data, content: parsed.content };
  }).filter(post => post.data.draft !== true && post.data.status !== 'draft').sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)));
}

function card(post) {
  const d = post.data;
  return `<article class="writing-card"><div class="card-kicker">${esc(d.series || 'Field notes')} · ${esc(dateText(d.date))}</div><h3><a href="/writing/${esc(d.slug)}/">${esc(d.title)}</a></h3><p>${esc(d.excerpt)}</p><div class="card-footer"><span>${words(post.content) ? Math.max(1, Math.ceil(words(post.content) / 200)) : 1} min read</span>${(d.tags || []).slice(0, 2).map(tag => `<a class="tag" href="/writing/tags/${slugify(tag)}/">${esc(tag)}</a>`).join('')}</div></article>`;
}

function layout({ title, description, canonical, body, extraHead = '', scripts = '' }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)} · Monit Sharma</title><meta name="description" content="${esc(description)}"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><link rel="icon" href="/favicon.ico"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"><link rel="stylesheet" href="/design-system.css"><link rel="stylesheet" href="/writing/writing.css">${extraHead}</head><body><a class="skip-link" href="#main">Skip to content</a><header class="writing-topbar"><div class="writing-nav"><a class="writing-brand" href="/">Monit Sharma<span></span></a><nav aria-label="Primary"><a href="/">Quantum Classroom</a><a href="/portfolio/">Portfolio</a><a class="active" href="/writing/">Writing</a><button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle dark mode">◐</button></nav></div></header>${body}<footer class="writing-footer"><div><a href="/writing/">Writing</a><span> · </span><a href="/">Quantum Classroom</a><span> · </span><a href="/portfolio/">Portfolio</a></div><small>Static pages, open research notes, and technical writing by Monit Sharma.</small></footer><script src="/writing/writing.js" defer></script>${scripts}</body></html>`;
}

function localizeMarkup(markup, paths) {
  return String(markup)
    .replace(/href="\/portfolio\/"/g, `href="${paths.portfolio}"`)
    .replace(/href="\/writing\/series\/([^"/]+)\/"/g, (_, slug) => `href="${paths.series(slug)}"`)
    .replace(/href="\/writing\/tags\/([^"/]+)\/"/g, (_, slug) => `href="${paths.tag(slug)}"`)
    .replace(/href="\/writing\/([^"/]+)\/"/g, (_, slug) => `href="${paths.post(slug)}"`)
    .replace(/href="\/writing\/"/g, `href="${paths.writing}"`)
    .replace(/href="\/"/g, `href="${paths.home}"`)
    .replace(/action="\/writing\/search\/"/g, `action="${paths.search}"`)
    .replace(/src="\/writing\/search\.js"/g, `src="${paths.searchJs}"`);
}

function relativeLayout({ title, description, canonical, body, paths, extraHead = '', scripts = '' }) {
  const favicon = paths.home.replace(/index\.html$/, 'favicon.ico');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)} · Monit Sharma</title><meta name="description" content="${esc(description)}"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><link rel="icon" href="${favicon}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;0,6..72,500&family=IBM+Plex+Mono:wght@400;0,6..72,500&family=IBM+Plex+Sans:wght@400;0,6..72,500;0,6..72,600&display=swap" rel="stylesheet"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"><link rel="stylesheet" href="${paths.designSystem}"><link rel="stylesheet" href="${paths.writingCss}">${extraHead}</head><body><a class="skip-link" href="#main">Skip to content</a><header class="writing-topbar"><div class="writing-nav"><a class="writing-brand" href="${paths.home}">Monit Sharma<span></span></a><nav aria-label="Primary"><a href="${paths.home}">Quantum Classroom</a><a href="${paths.portfolio}">Portfolio</a><a class="active" href="${paths.writing}">Writing</a><button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle dark mode">◐</button></nav></div></header>${body}<footer class="writing-footer"><div><a href="${paths.writing}">Writing</a><span> · </span><a href="${paths.home}">Quantum Classroom</a><span> · </span><a href="${paths.portfolio}">Portfolio</a></div><small>Static pages, open research notes, and technical writing by Monit Sharma.</small></footer><script src="${paths.writingJs}" defer></script>${scripts}</body></html>`;
}

function renderLayout({ title, description, canonical, body, paths, extraHead = '', scripts = '' }) {
  const favicon = paths.home.replace(/index\.html$/, 'favicon.ico');
  const content = localizeMarkup(body, paths);
  const headExtras = localizeMarkup(extraHead, paths);
  const pageScripts = localizeMarkup(scripts, paths);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)} · Monit Sharma</title><meta name="description" content="${esc(description)}"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><link rel="icon" href="${favicon}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"><link rel="stylesheet" href="${paths.designSystem}"><link rel="stylesheet" href="${paths.writingCss}">${headExtras}</head><body><a class="skip-link" href="#main">Skip to content</a><header class="writing-topbar"><div class="writing-nav"><a class="writing-brand" href="${paths.home}">Monit Sharma<span></span></a><nav aria-label="Primary"><a href="${paths.home}">Quantum Classroom</a><a href="${paths.portfolio}">Portfolio</a><a class="active" href="${paths.writing}">Writing</a><button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle dark mode">◐</button></nav></div></header>${content}<footer class="writing-footer"><div><a href="${paths.writing}">Writing</a><span> · </span><a href="${paths.home}">Quantum Classroom</a><span> · </span><a href="${paths.portfolio}">Portfolio</a></div><small>Static pages, open research notes, and technical writing by Monit Sharma.</small></footer><script src="${paths.writingJs}" defer></script>${pageScripts}</body></html>`;
}

function renderLanding(posts, series, tags) {
  const featured = posts[0];
  const latest = posts.slice(0, 6);
  const seriesHtml = [...series.values()].map(s => `<a class="series-row" href="/writing/series/${esc(s.slug)}/"><span>${esc(s.name)}</span><small>${posts.filter(p => p.data.series === s.name).length} article${posts.filter(p => p.data.series === s.name).length === 1 ? '' : 's'}</small></a>`).join('');
  const tagNames = [...new Set(posts.flatMap(p => p.data.tags || []))].sort((a, b) => a.localeCompare(b));
  const tagHtml = tagNames.map(tag => `<a class="tag" href="/writing/tags/${slugify(tag)}/">${esc(tag)}</a>`).join('');
  const body = `<main id="main"><section class="writing-hero"><div class="writing-wrap"><p class="eyebrow">Technical writing · ${posts.length} published</p><h1>Notes from the edge of <em>quantum systems.</em></h1><p class="writing-lead">Research, software, hardware, and the engineering details that sit between an idea and a result.</p><form class="search-form" action="/writing/search/" role="search"><label for="writing-search">Search the writing</label><div><input id="writing-search" name="q" type="search" placeholder="Try “hardware” or “MettleQ”"><button type="submit">Search</button></div></form></div></section><section class="writing-wrap writing-section"><div class="section-heading"><p class="eyebrow">Featured</p></div>${featured ? `<div class="featured-card"><div><span class="card-kicker">${esc(featured.data.series || 'Field notes')} · ${esc(dateText(featured.data.date))}</span><h2><a href="/writing/${esc(featured.data.slug)}/">${esc(featured.data.title)}</a></h2><p>${esc(featured.data.excerpt)}</p><a class="text-link" href="/writing/${esc(featured.data.slug)}/">Read the article →</a></div></div>` : '<p>No published articles yet.</p>'}</section><section class="writing-wrap writing-section"><div class="section-heading"><p class="eyebrow">Latest</p><h2>Recent writing</h2></div><div class="writing-grid">${latest.map(card).join('')}</div></section><section class="writing-wrap writing-section split-section"><div><p class="eyebrow">Series</p><h2>Follow a thread</h2><div class="series-list">${seriesHtml || '<p>No series yet.</p>'}</div></div><div><p class="eyebrow">Tags</p><h2>Browse by subject</h2><div class="tag-list">${tagHtml}</div></div></section></main>`;
  return renderLayout({ title: 'Writing', description: 'Technical writing by Monit Sharma on quantum systems, software, hardware, and research engineering.', canonical: `${SITE}/writing/`, body, paths: pagePaths(0) });
}

function renderArticle(post, posts, series, tags) {
  const d = post.data;
  const canonical = d.canonical_url || `${SITE}/writing/${d.slug}/`;
  const md = makeMarkdown();
  const body = embedYouTube(post.content);
  const content = md.render(body);
  const headings = toc(post.content);
  const currentIndex = posts.findIndex(p => p.data.slug === d.slug);
  const previous = posts[currentIndex + 1];
  const next = posts[currentIndex - 1];
  const related = posts.filter(p => p !== post && (p.data.tags || []).some(t => (d.tags || []).includes(t))).slice(0, 3);
  const tocHtml = headings.length ? `<aside class="article-toc" aria-label="Table of contents"><p class="eyebrow">On this page</p><ol>${headings.map(h => `<li class="toc-${h.level}"><a href="#${esc(h.id)}">${esc(h.title)}</a></li>`).join('')}</ol></aside>` : '';
  const seriesHtml = d.series ? `<a href="/writing/series/${esc(series.get(d.series)?.slug || slugify(d.series))}/">${esc(d.series)}${d.series_order ? ` · Part ${esc(d.series_order)}` : ''}</a>` : '';
  const links = [['Medium', d.medium_url], ['GitHub', d.github_url], ['Paper', d.paper_url]].filter(([, url]) => url).map(([label, url]) => `<a class="meta-link" href="${esc(url)}" rel="noopener">${label} ↗</a>`).join('');
  const jsonLd = { '@context':'https://schema.org', '@type':'Article', headline:d.title, description:d.excerpt, datePublished:d.date, dateModified:d.updated || d.date, author:(d.authors || []).map(name => ({ '@type':'Person', name })), mainEntityOfPage:canonical, url:canonical };
  const firstImage = post.content.match(/!\[[^\]]*\]\(([^\s)]+)/);
  const imageMeta = firstImage ? `<meta property="og:image" content="${esc(firstImage[1])}"><meta name="twitter:image" content="${esc(firstImage[1])}">` : '';
  const sourceHtml = d.medium_url ? `<p class="article-source">Originally published on <a href="${esc(d.medium_url)}">Medium</a>.</p>` : '';
  const article = `<main id="main" class="article-page"><header class="article-header writing-wrap"><a class="back-link" href="/writing/">← Back to writing</a><p class="eyebrow">${seriesHtml || 'Technical notes'}</p><h1>${esc(d.title)}</h1><p class="article-dek">${esc(d.excerpt)}</p><div class="article-meta"><span>Published ${esc(dateText(d.date))}</span>${d.updated ? `<span>Updated ${esc(dateText(d.updated))}</span>` : ''}<span>${Math.max(1, Math.ceil(words(post.content) / 200))} min read</span></div><div class="tag-list">${(d.tags || []).map(t => `<a class="tag" href="/writing/tags/${slugify(t)}/">${esc(t)}</a>`).join('')}</div>${links ? `<div class="meta-links">${links}</div>` : ''}</header><div class="article-layout writing-wrap">${tocHtml}<article class="article-content">${d.youtube_url ? `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${youtubeId(d.youtube_url)}" title="${esc(d.youtube_title || d.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><a href="${esc(d.youtube_url)}">Watch this video on YouTube</a></div>` : ''}${content}${sourceHtml}</article></div><nav class="article-nav writing-wrap" aria-label="Article navigation">${previous ? `<a href="/writing/${esc(previous.data.slug)}/"><small>Previous</small><span>← ${esc(previous.data.title)}</span></a>` : '<span></span>'}${next ? `<a class="next" href="/writing/${esc(next.data.slug)}/"><small>Next</small><span>${esc(next.data.title)} →</span></a>` : '<span></span>'}</nav>${related.length ? `<section class="writing-wrap related-section"><p class="eyebrow">Keep reading</p><div class="writing-grid"><article class="writing-card"><div class="card-kicker">${esc(related[0].data.series || 'Field notes')}</div><h3><a href="/writing/${esc(related[0].data.slug)}/">${esc(related[0].data.title)}</a></h3><p>${esc(related[0].data.excerpt)}</p></article></div></section>` : ''}</main>`;
  return renderLayout({ title:d.title, description:d.excerpt, canonical, body:article, paths:pagePaths(1), extraHead:`${imageMeta}<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` });
}

function renderSeries(name, posts, seriesData) {
  const list = seriesData.articles.length ? seriesData.articles.map(slug => posts.find(p => p.data.slug === slug)).filter(Boolean) : posts.filter(p => p.data.series === name).sort((a,b) => (a.data.series_order || 99) - (b.data.series_order || 99));
  const known = new Set(list.map(p => p.data.slug));
  const upcoming = (seriesData.upcoming || []).map(item => `<li class="upcoming"><span>${esc(item.order || '—')}</span><div><strong>${esc(item.title)}</strong><small>Upcoming</small></div></li>`).join('');
  const body = `<main id="main"><header class="series-header writing-wrap"><a class="back-link" href="/writing/">← Back to writing</a><p class="eyebrow">Series · ${list.length} article${list.length === 1 ? '' : 's'}</p><h1>${esc(name)}</h1><p class="writing-lead">${esc(seriesData.description || '')}</p></header><section class="writing-wrap series-section"><ol class="series-progress">${list.map((p, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><div><a href="/writing/${esc(p.data.slug)}/">${esc(p.data.title)}</a><small>${esc(dateText(p.data.date))}</small></div></li>`).join('')}${upcoming}</ol></section></main>`;
  return renderLayout({ title:name, description:seriesData.description || `Articles in the ${name} series.`, canonical:`${SITE}/writing/series/${seriesData.slug}/`, body, paths:pagePaths(2) });
}

function renderTag(tag, posts, tagInfo) {
  const matches = posts.filter(p => (p.data.tags || []).some(t => t.toLowerCase() === tag.toLowerCase()));
  const body = `<main id="main"><header class="tag-header writing-wrap"><a class="back-link" href="/writing/">← Back to writing</a><p class="eyebrow">Tag · ${matches.length} article${matches.length === 1 ? '' : 's'}</p><h1>${esc(tag)}</h1><p class="writing-lead">${esc(tagInfo?.description || `Writing tagged ${tag}.`)}</p></header><section class="writing-wrap writing-section"><div class="writing-grid">${matches.map(card).join('') || '<p>No articles have been published with this tag yet.</p>'}</div></section></main>`;
  return renderLayout({ title:`${tag} writing`, description:tagInfo?.description || `Writing tagged ${tag}.`, canonical:`${SITE}/writing/tags/${slugify(tag)}/`, body, paths:pagePaths(2) });
}

function renderSearch() {
  const body = `<main id="main"><section class="writing-wrap search-page"><p class="eyebrow">Search</p><h1>Find a note.</h1><form class="search-form" data-search-form><label for="search-input">Search titles, excerpts, tags, series, and article text</label><div><input id="search-input" type="search" autocomplete="off" placeholder="Try “Qiskit”"><button type="submit">Search</button></div></form><p class="search-status" data-search-status>Loading the search index…</p><div class="search-results" data-search-results></div></section></main>`;
  return renderLayout({ title:'Search', description:'Search Monit Sharma’s technical writing.', canonical:`${SITE}/writing/search/`, body, paths:pagePaths(1), scripts:'<script src="/writing/search.js" defer></script>' });
}

function buildFeed(posts) {
  const items = posts.map(p => `<item><title><![CDATA[${p.data.title}]]></title><link>${SITE}/writing/${p.data.slug}/</link><guid isPermaLink="true">${SITE}/writing/${p.data.slug}/</guid><pubDate>${new Date(`${p.data.date}T00:00:00Z`).toUTCString()}</pubDate><description><![CDATA[${p.data.excerpt}]]></description></item>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Monit Sharma · Writing</title><link>${SITE}/writing/</link><description>Technical writing on quantum systems, software, hardware, and research engineering.</description>${items}</channel></rss>`;
}

function build() {
  const series = loadSeries();
  const tags = loadTags();
  const posts = parsePosts();
  const result = validate(posts, series);
  ensure(OUT);
  if (result.errors.length) throw new Error(result.errors.join('\n'));
  const postSlugs = new Set(posts.map(post => post.data.slug));
  const seriesSlugs = new Set([...series.values()].map(item => item.slug));
  const tagSlugs = new Set([...new Set(posts.flatMap(post => post.data.tags || []))].map(slugify));
  for (const entry of fs.readdirSync(OUT, { withFileTypes: true })) {
    if (entry.isDirectory() && !['search', 'series', 'tags'].includes(entry.name) && !postSlugs.has(entry.name)) fs.rmSync(path.join(OUT, entry.name), { recursive: true, force: true });
  }
  for (const [folder, allowed] of [['series', seriesSlugs], ['tags', tagSlugs]]) {
    const directory = path.join(OUT, folder);
    if (!fs.existsSync(directory)) continue;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && !allowed.has(entry.name)) fs.rmSync(path.join(directory, entry.name), { recursive: true, force: true });
    }
  }
  write(path.join(OUT, 'index.html'), renderLanding(posts, series, tags));
  write(path.join(OUT, 'search', 'index.html'), renderSearch());
  write(path.join(OUT, 'feed.xml'), buildFeed(posts));
  write(path.join(OUT, 'search-index.json'), JSON.stringify(posts.map(p => ({ title:p.data.title, excerpt:p.data.excerpt, tags:p.data.tags || [], series:p.data.series || '', date:p.data.date, url:`/writing/${p.data.slug}/`, text:stripMarkdown(p.content) })), null, 2));
  for (const post of posts) write(path.join(OUT, post.data.slug, 'index.html'), renderArticle(post, posts, series, tags));
  for (const s of series.values()) write(path.join(OUT, 'series', s.slug, 'index.html'), renderSeries(s.name, posts, s));
  for (const tag of [...new Set(posts.flatMap(p => p.data.tags || []))]) write(path.join(OUT, 'tags', slugify(tag), 'index.html'), renderTag(tag, posts, tags[tag]));
  const urls = [`${SITE}/`, `${SITE}/writing/`, ...posts.map(p => `${SITE}/writing/${p.data.slug}/`), ...[...series.values()].map(s => `${SITE}/writing/series/${s.slug}/`), ...[...new Set(posts.flatMap(p => p.data.tags || []))].map(t => `${SITE}/writing/tags/${slugify(t)}/`)];
  write(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>`);
  write(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
  write(path.join(ROOT, 'reports', 'writing-build-report.md'), `# Writing build report\n\n- Published posts: ${posts.length}\n- Series: ${series.size}\n- Tags: ${new Set(posts.flatMap(p => p.data.tags || [])).size}\n- Warnings: ${result.warnings.length}\n\n${result.warnings.map(w => `- ${w}`).join('\n') || 'No warnings.'}\n`);
  console.log(`Writing build: ${posts.length} posts, ${series.size} series, ${result.warnings.length} warnings`);
}

if (require.main === module) build();
module.exports = { build, parsePosts, validate, youtubeId, slugify, renderArticle };
