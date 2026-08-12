const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const css = fs.readFileSync(path.join(__dirname, 'project-site.css'), 'utf8');
const viewer = fs.readFileSync(path.join(__dirname, 'project-viewer.js'), 'utf8');

const projects = {
  'Computational-High-Energy-Physics': ['Computational High Energy Physics', 'Simulation, numerical methods, and computational tools for exploring particle physics.', 'Foundations'],
  'Computational-Methods-in-Physics': ['Computational Methods in Physics', 'A practical collection of numerical methods, simulations, and scientific programming exercises.', 'Foundations'],
  'dwave_projects': ['D-Wave Projects', 'Hands-on experiments in quantum annealing and combinatorial optimization with Ocean.', 'Quantum applications'],
  'Introduction-to-Quantum-Computing': ['Introduction to Quantum Computing', 'A structured first course in quantum information, circuits, and algorithms.', 'Quantum foundations'],
  'Learn-Quantum-Computing-For-Free': ['Learn Quantum Computing for Free', 'A curated, open path through free quantum-computing resources.', 'Quantum foundations'],
  'Learn-Quantum-Computing-with-Qiskit': ['Learn Quantum Computing with Qiskit', 'A notebook-first introduction to quantum computing using Qiskit.', 'Quantum foundations'],
  'Learn-Quantum-Machine-Learning': ['Learn Quantum Machine Learning', 'A notebook-based course connecting quantum models with modern machine learning.', 'Quantum machine learning'],
  'LeetCode-Solutions': ['LeetCode Solutions', 'A searchable library of solved algorithmic problems, with statements, notes, and multi-language implementations.', 'Programming practice'],
  'LeetGPU-Solutions': ['LeetGPU Solutions', 'GPU programming solutions covering CUDA kernels, memory, and parallel computation.', 'Systems & performance'],
  'medium_articles': ['Medium Articles Code', 'Code, walkthroughs, and experiments from Monit’s technical writing and research.', 'Research notebook'],
  'Nielsen-Chuang-Solutions': ['Nielsen & Chuang Solutions', 'Worked solutions and notes for Quantum Computation and Quantum Information.', 'Quantum foundations'],
  'Numerical-Linear-Algebra': ['Numerical Linear Algebra', 'Learn linear algebra through programming, numerical experiments, and quantum-computing applications.', 'Foundations'],
  'parallel_adventures': ['Parallel Adventures', 'A practical tour of parallel programming with C/C++, CUDA, JAX, and PyTorch.', 'Systems & performance'],
  'Qiskit-Hindi-Tutorials': ['Qiskit Hindi Tutorials', 'Quantum-computing notebooks and explanations for Hindi-speaking learners.', 'Quantum foundations'],
  'qiskit-projects': ['Qiskit Projects', 'Applied quantum-computing experiments built with IBM Qiskit.', 'Quantum applications'],
  'Qiskit-Summer-School-and-Quantum-Challenges': ['Qiskit Summer School & Challenges', 'Solutions and learning notes from IBM Quantum challenges and summer schools.', 'Quantum applications'],
  'qsvt-linear-solvers': ['QSVT Linear Solvers', 'Research code exploring quantum singular value transformation for linear-system solving.', 'Research notebook'],
  'Quantum-Codebooks': ['Quantum Codebooks', 'Guided examples and walkthroughs for popular quantum-computing frameworks.', 'Quantum foundations'],
  'Quantum-Finance-and-Numerical-Methods': ['Quantum Finance & Numerical Methods', 'Numerical labs at the intersection of finance, economics, and quantum computing.', 'Quantum applications'],
  'Quantum-Machine-Learning-on-Near-Term-Quantum-Devices': ['QML on Near-Term Devices', 'Projects and case studies exploring quantum machine learning on today’s constrained hardware.', 'Quantum machine learning'],
  'Quantum-Papers-Explained-with-Code': ['Quantum Papers, Explained with Code', 'Readable research notes and runnable notebooks for quantum-computing papers.', 'Research notebook']
};

const excluded = new Set(['.git', '.github', 'node_modules', '__pycache__', '.ipynb_checkpoints']);
const codeExtensions = new Set(['.c', '.cc', '.cpp', '.cu', '.go', '.h', '.hpp', '.java', '.jl', '.js', '.m', '.py', '.r', '.rs', '.sh', '.ts']);
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const videoExtensions = new Set(['.m4v', '.mov', '.mp4', '.ogv', '.webm']);
const audioExtensions = new Set(['.mp3', '.ogg', '.wav']);
const textExtensions = new Set(['.cfg', '.css', '.csv', '.html', '.ini', '.json', '.lock', '.md', '.rst', '.tex', '.toml', '.tsv', '.txt', '.yaml', '.yml']);

const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const href = (file) => file.split('/').map(encodeURIComponent).join('/');
const extension = (file) => path.extname(file).toLowerCase();
const fileName = (file) => path.basename(file);
const humanize = (value) => {
  const raw = String(value || 'Untitled');
  const stem = raw.startsWith('.') ? raw.slice(1) : raw.replace(/\.[^.]+$/, '');
  return stem.replace(/^\d{1,4}[-_ ]/, '').replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
};
const collectionId = (value) => `module-${String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'root'}`;

function collectFiles(dir, relative = '') {
  const output = [];
  for (const entry of fs.readdirSync(path.join(dir, relative), { withFileTypes: true })) {
    if (excluded.has(entry.name) || ['index.html', 'project-site.css', 'project-viewer.js'].includes(entry.name)) continue;
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) output.push(...collectFiles(dir, child));
    else output.push(child.replaceAll(path.sep, '/'));
  }
  return output.sort((a, b) => a.localeCompare(b));
}

function kindFor(file) {
  const ext = extension(file);
  if (ext === '.ipynb') return 'ipynb';
  if (ext === '.md' || ext === '.rst') return 'markdown';
  if (ext === '.pdf') return 'pdf';
  if (imageExtensions.has(ext)) return 'image';
  if (videoExtensions.has(ext)) return 'video';
  if (audioExtensions.has(ext)) return 'audio';
  return codeExtensions.has(ext) || textExtensions.has(ext) ? 'code' : 'code';
}

function kindLabel(kind) {
  return ({ ipynb: 'Notebook', markdown: 'Guide', pdf: 'Paper', image: 'Figure', video: 'Video', audio: 'Audio', code: 'Source', problem: 'Problem' })[kind] || 'Resource';
}

function groupFiles(files) {
  const map = new Map();
  for (const file of files) {
    const [first] = file.split('/');
    const key = file.includes('/') ? first : 'Root guide';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(file);
  }
  return [...map.entries()].map(([name, groupedFiles]) => ({ name, files: groupedFiles }));
}

function preferredFiles(files, limit = 6) {
  const score = (file) => {
    const name = fileName(file).toLowerCase();
    if (name === 'readme.md') return 0;
    if (extension(file) === '.ipynb') return 1;
    if (extension(file) === '.pdf') return 2;
    if (extension(file) === '.md') return 3;
    if (imageExtensions.has(extension(file))) return 4;
    return 5;
  };
  return [...files].sort((a, b) => score(a) - score(b) || a.localeCompare(b)).slice(0, limit);
}

function resourceCard(file, options = {}) {
  const kind = options.kind || kindFor(file);
  const label = options.label || humanize(fileName(file));
  const summary = options.summary || '';
  const action = options.action || (kind === 'ipynb' ? 'Open lesson' : kind === 'markdown' ? 'Read guide' : kind === 'pdf' ? 'Read paper' : kind === 'image' ? 'View figure' : 'Open resource');
  const extra = options.problemFiles ? ` data-problem-files="${esc(JSON.stringify(options.problemFiles))}"` : '';
  const summaryMarkup = summary ? `<span class="resource-summary">${esc(summary)}</span>` : '';
  return `<a class="resource-link resource-card${kind === 'problem' ? ' problem-link' : ''}" href="${href(file)}" data-view-kind="${kind}" data-path="${esc(file)}" data-file-name="${esc(fileName(file))}" data-view-title="${esc(label)}"${extra}><span class="resource-link-top"><span class="resource-kind">${kindLabel(kind)}</span><span class="resource-number">${esc(options.badge || '')}</span></span><span class="resource-title">${esc(label)}</span>${summaryMarkup}<span class="resource-action">${esc(action)} <span aria-hidden="true">→</span></span></a>`;
}

function moduleSection(group, index) {
  const primary = preferredFiles(group.files, 8);
  const remaining = group.files.filter((file) => !primary.includes(file));
  const paperTone = /paper|evidence|qrao|cut|volume|noise|virtual|quanvolution/i.test(group.name) ? 'Research topic' : 'Module';
  return `<section class="module-section" id="${collectionId(group.name)}"><div class="module-heading"><span class="module-index">${String(index + 1).padStart(2, '0')}</span><div><span class="module-kicker">${paperTone}</span><h3>${esc(humanize(group.name))}</h3><p>${group.files.length} resource${group.files.length === 1 ? '' : 's'} · start with the guide, paper, or notebook below.</p></div></div><div class="resource-grid">${primary.map((file) => resourceCard(file)).join('')}</div>${remaining.length ? `<details class="module-more"><summary>More resources in ${esc(humanize(group.name))}<span>${remaining.length} items</span></summary><div class="resource-grid">${remaining.map((file) => resourceCard(file)).join('')}</div></details>` : ''}</section>`;
}

function leetCodeMarkup(files) {
  const problems = groupFiles(files).filter((group) => group.name !== 'Root guide' && group.files.some((file) => /\.(md|c|cc|cpp|cu|go|java|js|py|rs|ts)$/i.test(file)));
  const cards = problems.map((group) => {
    const readme = group.files.find((file) => /^.+\/README\.md$/i.test(file));
    const source = group.files.find((file) => codeExtensions.has(extension(file)));
    const entry = readme || source || group.files[0];
    const filesForProblem = group.files.filter((file) => /\.(md|c|cc|cpp|cu|go|java|js|py|rs|ts)$/i.test(file));
    const languages = [...new Set(group.files.filter((file) => codeExtensions.has(extension(file))).map((file) => extension(file).slice(1).toUpperCase()))];
    const number = (group.name.match(/^\d+/) || [])[0] || '—';
    return resourceCard(entry, { kind: 'problem', label: humanize(group.name), summary: languages.length ? languages.join(' · ') : 'Problem statement and notes', action: 'Open problem', badge: `#${number}`, problemFiles: filesForProblem });
  }).join('');
  return `<section class="problem-library" id="problem-library"><div class="module-heading"><span class="module-index">01</span><div><span class="module-kicker">Problem library</span><h3>Choose a problem. Read the approach. Compare the code.</h3><p>${problems.length} problem workspaces, each with its statement, notes, and available language implementations.</p></div></div><label class="problem-search"><span>Search problems</span><input type="search" placeholder="Try ‘median’, ‘tree’, or a problem number" data-problem-search></label><p class="problem-count" data-problem-count>Showing all ${problems.length} problems</p><div class="resource-grid problem-grid" data-problem-grid>${cards}</div></section>`;
}

function page(slug, meta) {
  const [title, description, category] = meta;
  const files = collectFiles(path.join(root, slug));
  const groups = groupFiles(files);
  const navigation = groups.map((group, index) => `<a href="#${collectionId(group.name)}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${esc(humanize(group.name))}</strong><small>${group.files.length} items</small></a>`).join('');
  const guide = preferredFiles(files, 4).map((file) => resourceCard(file, { badge: 'Start here' })).join('');
  const body = slug === 'LeetCode-Solutions' ? leetCodeMarkup(files) : groups.map(moduleSection).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · Monit Sharma</title><meta name="description" content="${esc(description)}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="project-site.css"></head><body><header class="topbar"><div class="wrap topbar-inner"><a class="brand" data-classroom-link href="https://monitsharma.github.io/"><span class="dot"></span><span>Monit Sharma</span></a><nav><a data-classroom-link href="https://monitsharma.github.io/">Quantum Classroom</a><a data-portfolio-link href="https://monitsharma.github.io/portfolio/">Portfolio</a></nav></div></header><main><section class="wrap project-hero"><div class="crumb"><a data-classroom-link href="https://monitsharma.github.io/">Quantum Classroom</a><span>/</span><span>${esc(category)}</span></div><div class="label">${esc(category)}</div><h1>${esc(title)}</h1><p class="lead">${esc(description)}</p><div class="actions"><a class="button" href="https://github.com/MonitSharma/${encodeURIComponent(slug)}#readme">Open repository ↗</a><a class="text-link" href="#content">Explore the work ↓</a></div></section><section class="project-intro"><div class="wrap"><div class="intro-grid"><div><div class="eyebrow">Start here</div><h2>Navigate the work as a learning collection.</h2></div><p>Each item opens within this site. Guides render as reading pages, papers and figures use a focused viewer, and notebooks retain their narrative, code, and saved outputs.</p></div><div class="resource-grid start-grid">${guide}</div></div></section><section class="wrap project-content" id="content"><div class="eyebrow">Collections</div><nav class="collection-nav" aria-label="Project collections">${navigation}</nav>${body}</section></main><footer><div class="wrap"><span>Monit Sharma · open work in progress</span><a href="https://github.com/MonitSharma/${encodeURIComponent(slug)}">GitHub ↗</a></div></footer><script>if(['127.0.0.1','localhost'].includes(location.hostname)){document.querySelectorAll('[data-classroom-link]').forEach(a=>a.href=location.origin+'/MonitSharma.github.io/');document.querySelectorAll('[data-portfolio-link]').forEach(a=>a.href=location.origin+'/portfolio/');}const search=document.querySelector('[data-problem-search]');if(search){const cards=[...document.querySelectorAll('[data-problem-grid] .problem-link')],count=document.querySelector('[data-problem-count]');search.addEventListener('input',()=>{const term=search.value.trim().toLowerCase();let shown=0;cards.forEach(card=>{const visible=!term||card.textContent.toLowerCase().includes(term);card.hidden=!visible;if(visible)shown++;});count.textContent=term?'Showing '+shown+' matching problem'+(shown===1?'':'s'):'Showing all '+cards.length+' problems';});}</script><script src="project-viewer.js"></script></body></html>`;
}

for (const [slug, meta] of Object.entries(projects)) {
  const directory = path.join(root, slug);
  if (!fs.existsSync(directory)) continue;
  fs.writeFileSync(path.join(directory, 'project-site.css'), css);
  fs.writeFileSync(path.join(directory, 'project-viewer.js'), viewer);
  fs.writeFileSync(path.join(directory, 'index.html'), page(slug, meta));
}
