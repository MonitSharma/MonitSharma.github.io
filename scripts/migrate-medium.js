const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const TurndownService = require('turndown');
const { gfm } = require('turndown-plugin-gfm');
const yaml = require('yaml');

const ROOT = path.resolve(__dirname, '..');
const POSTS = path.join(ROOT, 'content', 'writing', 'posts');
const REPORT = path.join(ROOT, 'reports', 'migration-report.md');
const MANIFEST = path.join(ROOT, 'content', 'writing', 'migration-manifest.yml');
const FEED = 'https://medium.com/feed/@_monitsharma';

const targets = [
  { match: 'Quantum Optimization on Real Hardware', slug: 'quantum-optimization-on-real-hardware', series: 'Quantum Hardware', series_order: 1, tags: ['quantum computing', 'quantum hardware', 'quantum optimization'] },
  { match: 'Can a MacBook Simulate Quantum Circuits Fast?', slug: 'mettleq-on-apple-silicon', series: 'Systems & Performance', series_order: 1, tags: ['quantum simulation', 'Apple Silicon', 'MettleQ', 'GPU computing'] },
  { match: 'The Key to the Quantum Garden', slug: 'quantum-garden-quantum-communication', series: 'Quantum in Public', series_order: 1, tags: ['quantum communication', 'quantum computing', 'public explainer'] }
];

function ensure(dir) { fs.mkdirSync(dir, { recursive: true }); }
function slugText(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function frontmatter(data) { return `---\n${yaml.stringify(data).trim()}\n---\n\n`; }

async function run() {
  ensure(POSTS); ensure(path.dirname(REPORT));
  const parser = new Parser({ customFields: { item: ['content:encoded'] } });
  let feed;
  try { feed = await parser.parseURL(FEED); } catch (error) {
    const manifest = targets.map(t => ({ medium_url: '', discovered_title: t.match, date: '', series: t.series, tags: t.tags, local_slug: t.slug, migration_status: 'blocked', image_status: 'unknown', link_status: 'not_checked', review_notes: `Medium RSS could not be fetched: ${error.message}` }));
    fs.writeFileSync(MANIFEST, yaml.stringify(manifest));
    fs.writeFileSync(REPORT, `# Medium migration report\n\nMigration was blocked while fetching ${FEED}. No source content was invented.\n\n${manifest.map(m => `- **${m.discovered_title}** — ${m.review_notes}`).join('\n')}\n`);
    return;
  }
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
  td.use(gfm);
  const manifest = [];
  const report = ['# Medium migration report', '', `Source feed: ${FEED}`, '', 'The three representative articles below were converted from the author’s public Medium RSS feed. Images retain their source URLs; blank source alt text is explicitly flagged for editorial review.', ''];
  for (const target of targets) {
    const item = feed.items.find(i => String(i.title || '').includes(target.match));
    if (!item) {
      manifest.push({ medium_url: '', discovered_title: target.match, date: '', series: target.series, tags: target.tags, local_slug: target.slug, migration_status: 'placeholder', image_status: 'unknown', link_status: 'requires_manual_review', review_notes: 'Article was not present in the fetched RSS feed.' });
      fs.writeFileSync(path.join(POSTS, `${target.slug}.md`), frontmatter({ title: target.match, slug: target.slug, date: new Date().toISOString().slice(0, 10), status: 'draft', excerpt: 'Placeholder created because the source was not present in the fetched Medium feed.', tags: target.tags, authors: ['Monit Sharma'], medium_url: '', draft: true }) + `> Migration placeholder. The source article was not present in the fetched feed; do not publish until reviewed.\n`);
      report.push(`- **${target.match}** — placeholder; source was not present in the fetched feed.`);
      continue;
    }
    const date = new Date(item.pubDate || Date.now()).toISOString().slice(0, 10);
    const html = item['content:encoded'] || item.content || '';
    const markdown = td.turndown(html).trim();
    const imagesMissingAlt = [...html.matchAll(/<img\b[^>]*\balt=["']\s*["'][^>]*>/gi)].length;
    const data = { title: item.title, slug: target.slug, date, status: 'published', series: target.series, series_order: target.series_order, excerpt: item.contentSnippet ? item.contentSnippet.slice(0, 220).replace(/\s+/g, ' ').trim() : `Migrated from Medium: ${item.title}`, tags: target.tags, authors: ['Monit Sharma'], canonical_url: `https://monitsharma.github.io/writing/${target.slug}/`, medium_url: item.link, draft: false };
    fs.writeFileSync(path.join(POSTS, `${target.slug}.md`), frontmatter(data) + markdown + '\n');
    const imageStatus = imagesMissingAlt ? `review_required (${imagesMissingAlt} blank alt text)` : 'ok';
    manifest.push({ medium_url: item.link, discovered_title: item.title, date, series: target.series, tags: target.tags, local_slug: target.slug, migration_status: 'migrated_from_rss', image_status: imageStatus, link_status: 'requires_manual_review', review_notes: imagesMissingAlt ? 'Source image alt text was empty; meaningful descriptions must be supplied by the author.' : 'Converted from RSS content; verify links and layout.' });
    report.push(`- **${item.title}** — migrated to content/writing/posts/${target.slug}.md; image status: ${imageStatus}; external links require a follow-up audit.`);
  }
  fs.writeFileSync(MANIFEST, yaml.stringify(manifest));
  fs.writeFileSync(REPORT, report.join('\n') + '\n');
  console.log(`Medium migration: ${manifest.filter(m => m.migration_status === 'migrated_from_rss').length}/${targets.length} articles migrated`);
}

if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { run, targets };
