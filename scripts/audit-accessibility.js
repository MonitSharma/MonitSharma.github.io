const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'writing');
const REPORTS = path.join(ROOT, 'reports');
function files(dir) { return fs.readdirSync(dir, { withFileTypes:true }).flatMap(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
function run() {
  const findings = [];
  for (const file of files(DIR).filter(file => file.endsWith('.html'))) {
    const html = fs.readFileSync(file, 'utf8');
    const relative = path.relative(ROOT, file);
    const h1 = (html.match(/<h1\b/gi) || []).length;
    if (h1 !== 1) findings.push({ file:relative, severity:'error', issue:`expected one h1, found ${h1}` });
    if (!html.includes('class="skip-link"')) findings.push({ file:relative, severity:'error', issue:'missing skip link' });
    for (const match of html.matchAll(/<img\b([^>]*)>/gi)) if (!/\balt="[^"\s][^"]*"/i.test(match[1])) findings.push({ file:relative, severity:'review', issue:'image has missing or empty alt text' });
    for (const match of html.matchAll(/<iframe\b([^>]*)>/gi)) if (!/\btitle="[^"]+"/i.test(match[1])) findings.push({ file:relative, severity:'error', issue:'iframe missing title' });
    if (/<input\b/i.test(html) && !/<label\b/i.test(html)) findings.push({ file:relative, severity:'error', issue:'input without a label' });
  }
  fs.mkdirSync(REPORTS, { recursive:true });
  fs.writeFileSync(path.join(REPORTS, 'accessibility-audit.md'), ['# Accessibility audit', '', 'The audit checks generated writing pages for one h1, skip links, image alt attributes, iframe titles, and input labels.', '', ...findings.map(f => `- **${f.severity}** — ${f.file}: ${f.issue}`), findings.length ? '' : '- No findings.'].join('\n') + '\n');
  console.log(`Accessibility audit: ${findings.length} finding(s); migrated blank alt text is intentionally tracked for review.`);
}
if (require.main === module) run();
module.exports = { run };
