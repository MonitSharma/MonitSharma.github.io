const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'writing');
const REPORTS = path.join(ROOT, 'reports');
const machine = [];

function ensure(dir) { fs.mkdirSync(dir, { recursive: true }); }
function files(dir) { return fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes:true }).flatMap(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]) : []; }
function classify(status, error) {
  if (error?.name === 'AbortError') return 'unavailable during check';
  if (status >= 200 && status < 300) return 'available';
  if (status >= 300 && status < 400) return 'redirected';
  if (status === 403 || status === 429) return 'blocked';
  if (status >= 400) return 'confirmed broken';
  return 'requires manual review';
}
function localTarget(href) {
  if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:|data:)/i.test(href)) return null;
  try { const url = new URL(href, 'https://monitsharma.github.io'); if (url.origin !== 'https://monitsharma.github.io') return null; return path.join(ROOT, url.pathname.replace(/^\//, ''), url.pathname.endsWith('/') ? 'index.html' : ''); } catch { return null; }
}
async function run() {
  ensure(REPORTS);
  const htmlFiles = files(OUT).filter(file => file.endsWith('.html'));
  const hrefs = new Map();
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) hrefs.set(match[1], file);
  }
  for (const [href, source] of hrefs) {
    const local = localTarget(href);
    if (local) machine.push({ source:path.relative(ROOT, source), target:href, kind:'internal', status:fs.existsSync(local) ? 'available' : 'confirmed broken' });
    else if (/^https?:\/\/[^/]+\/?$/i.test(href)) continue; // preconnect origins are not navigable links
    else if (/^https?:\/\//i.test(href)) {
      let response;
      try { response = await fetch(href, { method:'HEAD', redirect:'manual', signal:AbortSignal.timeout(8000), headers:{'user-agent':'MonitSharma-writing-link-audit/1.0'} }); machine.push({ source:path.relative(ROOT, source), target:href, kind:'external', status:classify(response.status), http_status:response.status }); }
      catch (error) { machine.push({ source:path.relative(ROOT, source), target:href, kind:'external', status:classify(0, error), error:error.message }); }
    }
  }
  const missingAlt = [];
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    for (const match of html.matchAll(/<img\b([^>]*)>/gi)) if (!/\balt="[^"]+"/i.test(match[1])) missingAlt.push(path.relative(ROOT, file));
  }
  const report = { generated_at:new Date().toISOString(), links:machine, missing_alt_pages:[...new Set(missingAlt)] };
  fs.writeFileSync(path.join(REPORTS, 'link-audit.json'), JSON.stringify(report, null, 2));
  const counts = machine.reduce((acc, item) => { acc[item.status] = (acc[item.status] || 0) + 1; return acc; }, {});
  const lines = ['# Link audit', '', `Generated: ${report.generated_at}`, '', '## Summary', '', ...Object.entries(counts).map(([key, value]) => `- ${key}: ${value}`), '', `Images requiring alt review in generated pages: ${report.missing_alt_pages.length}`, ''];
  for (const item of machine.filter(item => item.status !== 'available')) lines.push(`- **${item.status}** — ${item.source} → ${item.target}${item.http_status ? ` (HTTP ${item.http_status})` : ''}`);
  fs.writeFileSync(path.join(REPORTS, 'link-audit.md'), lines.join('\n') + '\n');
  console.log(`Link audit: ${machine.length} links checked; ${counts['confirmed broken'] || 0} confirmed broken`);
}
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { run, localTarget, classify };
