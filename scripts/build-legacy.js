/* Node 22-compatible adapter for the existing Pug page generation. It leaves
 * the hand-authored Quantum Classroom index.html untouched; the historical
 * Gulp `index` task would otherwise overwrite that page with its old template. */
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const moment = require('moment');

const ROOT = path.resolve(__dirname, '..');
const VIEWS = path.join(ROOT, 'views');
function ensure(dir) { fs.mkdirSync(dir, { recursive: true }); }
function entries(dir) { return fs.readdirSync(dir, { withFileTypes:true }).flatMap(entry => entry.isDirectory() ? entries(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
function renderTree(folder, locals = {}) {
  const sourceRoot = path.join(VIEWS, folder);
  for (const file of entries(sourceRoot).filter(file => file.endsWith('.pug'))) {
    const relative = path.relative(sourceRoot, file).replace(/\.pug$/, '.html');
    const target = path.join(ROOT, folder, relative);
    ensure(path.dirname(target));
    const rendered = pug.renderFile(file, { ...locals, basedir: ROOT, filename: file });
    if (!fs.existsSync(target)) fs.writeFileSync(target, rendered);
  }
}
function build() {
  renderTree('projects');
  renderTree('programs');
  for (const comp of ['mura', 'chexpert', 'mrnet', 'chexphoto']) {
    const resultFile = path.join(ROOT, 'competitions', comp, 'results.json');
    const locals = { moment };
    if (fs.existsSync(resultFile)) locals.test = require(resultFile);
    renderTree(path.join('competitions', comp), locals);
  }
  console.log('Legacy build: rendered project, program, and competition Pug pages; preserved Quantum Classroom index.html');
}
if (require.main === module) build();
module.exports = { build };
