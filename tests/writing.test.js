const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { validate, youtubeId, slugify, parsePosts } = require('../scripts/writing-build');

const post = (data, content = '') => ({ file: data.slug || 'fixture.md', data, content });

test('accepts the generated fixture posts', () => {
  const posts = parsePosts();
  assert.equal(posts.length, 3);
  assert.ok(!posts.some(item => item.data.slug === 'writing-on-this-site'));
  assert.equal(validate(posts, new Map([
    ['Quantum Hardware', {}], ['Systems & Performance', {}], ['Quantum in Public', {}]
  ])).errors.length, 0);
});

test('reports missing required front matter', () => {
  const result = validate([post({ slug:'fixture' })], new Map());
  assert.ok(result.errors.some(error => error.includes('missing required field "title"')));
});

test('reports duplicate slugs and invalid series', () => {
  const data = { title:'x', slug:'duplicate', date:'2026-01-01', excerpt:'x', tags:['x'], authors:['Monit'], series:'Missing' };
  const result = validate([post(data, ''), post({ ...data }, '')], new Map());
  assert.ok(result.errors.some(error => error.includes('duplicate slug')));
  assert.ok(result.errors.some(error => error.includes('invalid series reference')));
});

test('validates YouTube ids and slugs', () => {
  assert.equal(youtubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.equal(youtubeId('https://youtube.com/watch?v=short'), null);
  assert.equal(slugify('Quantum Hardware — Part 1'), 'quantum-hardware-part-1');
});

test('reports missing image alt text and missing local assets', () => {
  const result = validate([post({ title:'x', slug:'fixture', date:'2026-01-01', excerpt:'x', tags:['x'], authors:['Monit'] }, '![](missing.png)')], new Map());
  assert.ok(result.warnings.some(warning => warning.includes('meaningful alt text')));
  assert.ok(result.errors.some(error => error.includes('missing local image')));
});

test('generated output contains publishing features and metadata', () => {
  const fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'feature-fixture.md'), 'utf8');
  const html = require('../scripts/writing-build').renderArticle({
    file: 'feature-fixture.md',
    data: { title: 'Feature fixture', slug: 'feature-fixture', date: '2026-01-01', excerpt: 'Fixture covering supported Markdown features.', tags: ['fixture'], authors: ['Monit Sharma'] },
    content: fixture.replace(/^---[\s\S]*?---\s*/, '')
  }, [], new Map(), {});
  assert.match(html, /rel="canonical"/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="mermaid"/);
  assert.match(html, /data-copy-code/);
  assert.match(html, /class="footnotes"/);
  assert.match(html, /<table>/);
  assert.doesNotMatch(html, />## Tables/);
  assert.match(fs.readFileSync(path.join(__dirname, '..', 'writing', 'feed.xml'), 'utf8'), /<rss version="2.0">/);
  assert.doesNotMatch(fs.readFileSync(path.join(__dirname, '..', 'sitemap.xml'), 'utf8'), /writing-on-this-site/);
});

test('generated writing pages work from a local file preview', () => {
  const article = fs.readFileSync(path.join(__dirname, '..', 'writing', 'quantum-optimization-on-real-hardware', 'index.html'), 'utf8');
  const series = fs.readFileSync(path.join(__dirname, '..', 'writing', 'series', 'quantum-in-public', 'index.html'), 'utf8');
  const search = fs.readFileSync(path.join(__dirname, '..', 'writing', 'search', 'index.html'), 'utf8');
  assert.match(article, /href="\.\.\/\.\.\/design-system\.css"/);
  assert.match(article, /src="\.\.\/writing\.js"/);
  assert.doesNotMatch(article, /medium\.com\/_\/stat/);
  assert.match(series, /href="\.\.\/\.\.\/\.\.\/design-system\.css"/);
  assert.match(series, /href="\.\.\/\.\.\/quantum-garden-quantum-communication\/index\.html"/);
  assert.match(search, /src="\.\.\/search\.js"/);
});
