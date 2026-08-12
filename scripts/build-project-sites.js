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

// These labels are intentionally short and learner-facing. Repository paths remain
// available inside the viewer, but they should not be the primary interface.
const profiles = {
  'Quantum-Papers-Explained-with-Code': {
    groupOrder: ['Root guide', 'notes_on_papers', 'Evidence_of_utility_qc', 'Evidence_of_utility', 'CutQC', 'QRAO', 'quantum_volume', 'Quanvolutional_Neural_Networks', 'Virtual_two_qubits', 'Zero_noise_extrapolation'],
    groupLabels: { 'Root guide': 'Overview', notes_on_papers: 'Paper notes', Evidence_of_utility_qc: 'QC evidence', Evidence_of_utility: 'Utility experiments', CutQC: 'Circuit cutting', QRAO: 'QRAO', quantum_volume: 'Quantum volume', Quanvolutional_Neural_Networks: 'Quanvolutional networks', Virtual_two_qubits: 'Virtual two-qubit gates', Zero_noise_extrapolation: 'Zero-noise extrapolation' },
    titleOverrides: {
      'README.md': 'Research map', 'CutQC/Readme.md': 'Circuit cutting guide', 'CutQC/tutorial_1_automatic_cut_finding.ipynb': 'Automatic cut finding', 'CutQC/tutorial_2_manual_cutting.ipynb': 'Manual circuit cutting', 'CutQC/tutorial_3_cutting_with_quantum_serverless.ipynb': 'Circuit cutting with serverless',
      'notes_on_papers/Barren Plateau_240210_093002.pdf': 'Barren plateaus', 'notes_on_papers/CircuitT Knitting with classical communication_240521_182309.pdf': 'Circuit knitting with classical communication', 'notes_on_papers/Classical complexity Review_240526_023628.pdf': 'Classical complexity review', 'notes_on_papers/Constructing a virtual two-qubit gate by Sampling_240125_181001.pdf': 'Constructing a virtual two-qubit gate', 'notes_on_papers/Generalization in Quantum Machine Learning_240210_092951.pdf': 'Generalization in QML', 'notes_on_papers/Globally optimal Quantum Control!_240229_011719.pdf': 'Globally optimal quantum control', 'notes_on_papers/Lesson 1 understanding quantum information_240511_114258.pdf': 'Lesson 1: Quantum information', 'notes_on_papers/Lesson 2 Multiple Systems_240512_014728.pdf': 'Lesson 2: Multiple systems', 'notes_on_papers/Lie Algebra and quantum machine Learning_240210_092937.pdf': 'Lie algebra and QML', 'notes_on_papers/Optimal of Quantum circuits Gate + wire_240227_225917.pdf': 'Optimal circuit gates and wires', 'notes_on_papers/optimal wire cutting with classical communication_240222_135108.pdf': 'Optimal wire cutting', 'notes_on_papers/overhead for simulating a non-local channel _240214_084044.pdf': 'Overhead of non-local channels', 'notes_on_papers/Overhead- constrained circuit knitting_240521_183813.pdf': 'Overhead-constrained circuit knitting', 'notes_on_papers/QAOA Results with Circuit cutting_240214_162942.pdf': 'QAOA with circuit cutting', 'notes_on_papers/Quantum and classical Decomposition For VRP_240429_162217.pdf': 'Quantum and classical VRP decomposition', 'notes_on_papers/Quantum computation Review_240526_023733.pdf': 'Quantum computation review', 'notes_on_papers/Quantum control Theory_240325_181509.pdf': 'Quantum control theory', 'notes_on_papers/Quantum optimization and the path forward_240302_005455.pdf': 'Quantum optimization: the path forward', 'notes_on_papers/Tensor Network An Introduction_240512_130625.pdf': 'Tensor networks: an introduction', 'notes_on_papers/The Adjoint is all you need.pdf': 'The adjoint is all you need', 'notes_on_papers/Toward Large scale Quantum Optimization with Pauli Correlation Encoding.pdf': 'Large-scale QRAO', 'notes_on_papers/Variational Quantum Optimization with MultiBasis Encoding.pdf': 'Variational optimization with multibasis encoding',
      'Evidence_of_utility/README.md': 'Utility experiments guide', 'Evidence_of_utility_qc/README.md': 'QC evidence guide', 'Evidence_of_utility/Jupyter Files/Fig2.ipynb': 'Fig. 2: Bootstrap comparison', 'Evidence_of_utility/Jupyter Files/Fig3a.ipynb': 'Fig. 3A: Exact magnetization', 'Evidence_of_utility/Jupyter Files/Fig3b.ipynb': 'Fig. 3B: Experiment comparison', 'Evidence_of_utility/Jupyter Files/Fig3c.ipynb': 'Fig. 3C: MPS comparison', 'Evidence_of_utility/Jupyter Files/Fig4a.ipynb': 'Fig. 4A: Mitigation results', 'Evidence_of_utility/Jupyter Files/Fig4b.ipynb': 'Fig. 4B: Noise-model comparison', 'Evidence_of_utility/Jupyter Files/small_scale_test.ipynb': 'Small-scale validation'
    }
  },
  'Introduction-to-Quantum-Computing': {
    groupOrder: ['Root guide', 'lecture notes', 'jupyter_notebooks', 'Quantum Information Theory with Python', 'Quantum Complexity Theory', 'quantum_computing_papers'],
    groupLabels: { 'Root guide': 'Course overview', 'lecture notes': 'Theory notes', jupyter_notebooks: 'Hands-on notebooks', 'Quantum Information Theory with Python': 'Information theory with Python', 'Quantum Complexity Theory': 'Complexity theory', quantum_computing_papers: 'Reference papers' },
    titleOverrides: { 'README.md': 'Course overview', 'jupyter_notebooks/Getting_Started_with_Qiskit.ipynb': 'Getting started with Qiskit', "jupyter_notebooks/Hello Quantum World.ipynb": 'Hello, quantum world', "jupyter_notebooks/Hello Entangled World.ipynb": 'Entanglement in action', 'jupyter_notebooks/Circuit_Basics.ipynb': 'Circuit basics', "jupyter_notebooks/Grover's_Algoroithm.ipynb": "Grover's algorithm", 'jupyter_notebooks/Quantum Fourier Transfom.ipynb': 'Quantum Fourier transform', 'jupyter_notebooks/Quantum Phase Estimation.ipynb': 'Quantum phase estimation', "jupyter_notebooks/Shor's_Algorithm.ipynb": "Shor's algorithm", 'jupyter_notebooks/The CHSH game.ipynb': 'The CHSH game' }
  },
  'Learn-Quantum-Computing-For-Free': { groupOrder: ['Root guide'], groupLabels: { 'Root guide': 'Learning map' }, titleOverrides: { 'README.md': 'Quantum learning map' } },
  'Learn-Quantum-Computing-with-Qiskit': { groupOrder: ['Root guide', 'gifs'], groupLabels: { 'Root guide': 'Course lessons', gifs: 'Visuals' }, titleOverrides: { 'README.md': 'Course roadmap' } },
  'Learn-Quantum-Machine-Learning': { groupOrder: ['Root guide'], groupLabels: { 'Root guide': 'Course lessons' }, titleOverrides: { 'README.md': 'QML course roadmap' } },
  'Nielsen-Chuang-Solutions': { groupOrder: ['Root guide', 'Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5', 'Chapter 6', 'Chapter 7', 'Chapter 8', 'Chapter 9', 'Chapter 10', 'Chapter 11', 'Chapter 12'], groupLabels: { 'Root guide': 'Book guide' }, titleOverrides: { 'README.md': 'Book and solution guide' } },
  'Qiskit-Summer-School-and-Quantum-Challenges': { groupOrder: ['Root guide', 'IBM Quantum Summer School 2020', 'IBM Quantum Summer School 2021', 'IBM Quantum Summer School 2022', 'IBM Quantum Summer School 2023', 'IBM Quantum Summer School 2024', 'IBM Quantum Challenge Fall 2020', 'IBM Quantum Challenge Spring 2021', 'IBM Quantum Challenge Spring 2022', 'IBM Quantum Challenge Spring 2023', 'IBM Quantum Challenge Fall 2021', 'IBM Quantum Challenge Fall 2022', 'IBM Quantum Challenge 2024', 'IBM Quantum Challenge Africa 2021', 'IBM Quantum Open Science Prize 2021'], groupLabels: { 'Root guide': 'Challenge guide' }, titleOverrides: { 'README.md': 'Challenge roadmap' } },
  'Quantum-Codebooks': { groupOrder: ['Root guide', 'Qiskit Textbook', 'Microsoft Q# Codebook', 'QuTiP Codebooks', 'Xanadu Quantum Codebook', 'Xanadu-Codebook-Solutions'], groupLabels: { 'Root guide': 'Codebook guide', 'Microsoft Q# Codebook': 'Q# fundamentals and algorithms', 'Xanadu-Codebook-Solutions': 'Xanadu solutions' }, titleOverrides: { 'README.md': 'Codebook roadmap' } },
  'Quantum-Finance-and-Numerical-Methods': { groupOrder: ['Root guide', 'Introduction to Finance with Python', 'Classical Use Cases', 'JP Morgan Python Training', 'Machine Learning For Finance', 'Quantum Finance', 'Quantum Machine Learning in Finance', 'Quantum Use Cases'], groupLabels: { 'Root guide': 'Finance lab guide' }, titleOverrides: { 'README.md': 'Finance lab roadmap' } },
  'Quantum-Machine-Learning-on-Near-Term-Quantum-Devices': { groupOrder: ['Root guide', 'Higgs_Classification', 'QCNN for Disease Detection', 'Quantum Convolutinal with Data Re-Uploadation', 'Quantum Convolutional Neural Networks', 'Quantum Support Vector Machine on QCD', 'Galaxy Detection using Quantum Machine Learning'], groupLabels: { 'Root guide': 'Project guide', 'Galaxy Detection using Quantum Machine Learning': 'Galaxy classification study' }, titleOverrides: { 'README.md': 'NISQ QML project guide', 'Quantum_Machine_Learning.pdf': 'Project report' } },
  'parallel_adventures': { groupOrder: ['Root guide', 'C', 'cuda_kernels', 'JAX', 'LeetGPU', 'PyTorch', 'images'], groupLabels: { 'Root guide': 'Systems roadmap', C: 'C and C++ foundations', cuda_kernels: 'CUDA kernels', JAX: 'JAX experiments', LeetGPU: 'GPU problem solving', PyTorch: 'PyTorch experiments', images: 'Visual references' }, titleOverrides: { 'README.md': 'Parallel programming roadmap' } },
  'Computational-Methods-in-Physics': { groupOrder: ['Root guide', 'Code tutorial in Jupyter', 'Notes', 'Problem Set 1', 'Problem Set 2', 'Problem Set 3', 'project1', 'project2', 'project3', 'project4', 'project5', 'project6', 'project7', 'project8', 'project9'], groupLabels: { 'Root guide': 'Course guide', 'Code tutorial in Jupyter': 'Python and numerical methods', Notes: 'Reference notes', 'Problem Set 1': 'Problem set 1: ODEs and integration', 'Problem Set 2': 'Problem set 2: numerical methods', 'Problem Set 3': 'Problem set 3: applications' }, titleOverrides: { 'README.md': 'Computational physics roadmap' } },
  'Numerical-Linear-Algebra': { groupOrder: ['Root guide', 'Basic Numerical Linear Algebra', 'Advanced Numerical Linear Algebra', 'GIFs'], groupLabels: { 'Root guide': 'Course guide', 'Basic Numerical Linear Algebra': 'Core linear algebra', 'Advanced Numerical Linear Algebra': 'Advanced methods' }, titleOverrides: { 'README.md': 'Linear algebra roadmap' } },
  'LeetGPU-Solutions': { groupOrder: ['Root guide'], groupLabels: { 'Root guide': 'GPU problem library' }, titleOverrides: { 'README.md': 'GPU practice guide' } },
  'Computational-High-Energy-Physics': { groupOrder: ['Root guide', 'Coursera Course Solutions', 'Deep-Learning-in-High-Energy-Physics', 'EOS with Critical Point QCD', 'Lattice Based Equation Of State', 'Quantum Computing Demo @ CERN'], groupLabels: { 'Root guide': 'Research map', 'Deep-Learning-in-High-Energy-Physics': 'Deep learning for HEP', 'EOS with Critical Point QCD': 'Equation of state: critical QCD', 'Lattice Based Equation Of State': 'Lattice equation of state', 'Quantum Computing Demo @ CERN': 'Quantum computing at CERN' }, titleOverrides: { 'README.md': 'HEP research map' } },
  'qsvt-linear-solvers': { groupOrder: ['Root guide', 'docs', 'primitives', 'solvers', 'applications', 'benchmarks', 'hardware', 'tests'], groupLabels: { 'Root guide': 'Research guide', docs: 'Figures and documentation', primitives: 'QSVT primitives', solvers: 'Linear solvers', applications: 'Applications', benchmarks: 'Benchmarks', hardware: 'Hardware runs', tests: 'Validation' }, titleOverrides: { 'README.md': 'QSVT research guide' } },
  'medium_articles': { groupOrder: ['Root guide', 'quantum_garden', 'quantum_benchmarking', 'sometimes-too-slow-for-shor', 'quantum_machine_learning', 'transformers_rl'], groupLabels: { 'Root guide': 'Article index', quantum_garden: 'Quantum communication', quantum_benchmarking: 'Quantum optimization benchmarks', 'sometimes-too-slow-for-shor': 'The cost of Shor', quantum_machine_learning: 'Quantum machine learning', transformers_rl: 'Transformers and reinforcement learning' }, titleOverrides: { 'README.md': 'Article code index' } }
};

const excluded = new Set(['.git', '.github', 'node_modules', '__pycache__', '.ipynb_checkpoints']);
const codeExtensions = new Set(['.c', '.cc', '.cpp', '.cu', '.go', '.h', '.hpp', '.java', '.jl', '.js', '.m', '.py', '.r', '.rs', '.sh', '.sql', '.ts']);
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const videoExtensions = new Set(['.m4v', '.mov', '.mp4', '.ogv', '.webm']);
const audioExtensions = new Set(['.mp3', '.ogg', '.wav']);
const slideExtensions = new Set(['.key', '.ppt', '.pptx']);
const textExtensions = new Set(['.cfg', '.css', '.csv', '.html', '.ini', '.json', '.lock', '.md', '.rst', '.tex', '.toml', '.tsv', '.txt', '.yaml', '.yml']);
const languageName = (value) => ({ C: 'C', CC: 'C++', CPP: 'C++', CU: 'CUDA', GO: 'Go', JAVA: 'Java', JS: 'JavaScript', PY: 'Python', RS: 'Rust', SQL: 'SQL', TS: 'TypeScript' }[value] || value);

const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const href = (file) => file.split('/').map(encodeURIComponent).join('/');
const extension = (file) => path.extname(file).toLowerCase();
const fileName = (file) => path.basename(file);
const humanize = (value) => {
  const raw = String(value || 'Untitled');
  const stem = raw.startsWith('.') ? raw.slice(1) : raw.replace(/\.[^.]+$/, '');
  const cleanStem = stem.replace(/(?:[_ -]\d{6}){1,2}$/, '');
  const spaced = cleanStem.replace(/^\d{1,4}[-_ ]/, '').replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Za-z])(\d)/g, '$1 $2').replace(/(\d)([A-Za-z])/g, '$1 $2');
  const title = spaced.replace(/\s+/g, ' ').trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
  return title.replace(/\bQc\b/g, 'QC').replace(/\bQrao\b/g, 'QRAO').replace(/\bQml\b/g, 'QML').replace(/\bGpu\b/g, 'GPU').replace(/\bCpu\b/g, 'CPU').replace(/\bCuda\b/g, 'CUDA');
};
const collectionId = (value) => `module-${String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'root'}`;
const profileFor = (slug) => profiles[slug] || {};

function groupLabel(name, slug) {
  const profile = profileFor(slug);
  return (profile.groupLabels && profile.groupLabels[name]) || humanize(name);
}

function labelFor(file, slug) {
  const profile = profileFor(slug);
  if (profile.titleOverrides && profile.titleOverrides[file]) return profile.titleOverrides[file];
  const name = fileName(file);
  if (/^readme(?:\.md)?$/i.test(name)) {
    const parts = file.split('/');
    return parts.length > 1 ? `${groupLabel(parts[0], slug)} guide` : groupLabel('Root guide', slug);
  }
  if (/^license$/i.test(name)) return 'License';
  if (/^requirements(?:_mac)?\.txt$/i.test(name)) return 'Environment setup';
  if (/^fig\d/i.test(name)) return `Figure ${humanize(name).replace(/^Fig\s*/i, '')}`;
  if (/^lab[-_ ]?\d/i.test(name)) return humanize(name).replace(/^Lab\s*/i, 'Lab ');
  if (/^challenge[-_ ]?\d/i.test(name)) return humanize(name).replace(/^Challenge\s*/i, 'Challenge ');
  return humanize(name);
}

function orderedGroups(groups, slug) {
  const order = profileFor(slug).groupOrder || [];
  return [...groups].sort((a, b) => {
    const ai = order.indexOf(a.name);
    const bi = order.indexOf(b.name);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) || a.name.localeCompare(b.name);
  });
}

function collectFiles(dir, relative = '') {
  const output = [];
  for (const entry of fs.readdirSync(path.join(dir, relative), { withFileTypes: true })) {
    if (excluded.has(entry.name) || entry.name.startsWith('.') || ['index.html', 'project-site.css', 'project-viewer.js'].includes(entry.name)) continue;
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) output.push(...collectFiles(dir, child));
    else {
      const publicPath = child.replaceAll(path.sep, '/');
      if (/ibm_credentials|(^|\/)(credentials?|secrets?|\.env)(\/|\.|$)/i.test(publicPath)) continue;
      if (/\.(bin|ckpt|h5|hdf5|npy|npz|parquet|pkl|pickle|pt|pth|root|weights)$/i.test(publicPath)) continue;
      if (/\.png$/i.test(publicPath)) {
        const signature = fs.readFileSync(path.join(dir, child)).subarray(0, 8);
        if (!signature.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) continue;
      }
      output.push(publicPath);
    }
  }
  return output.sort((a, b) => a.localeCompare(b));
}

function kindFor(file) {
  const ext = extension(file);
  if (ext === '.ipynb') return 'ipynb';
  if (ext === '.md' || ext === '.rst') return 'markdown';
  if (ext === '.pdf') return 'pdf';
  if (slideExtensions.has(ext)) return 'slides';
  if (imageExtensions.has(ext)) return 'image';
  if (videoExtensions.has(ext)) return 'video';
  if (audioExtensions.has(ext)) return 'audio';
  return codeExtensions.has(ext) || textExtensions.has(ext) ? 'code' : 'unsupported';
}

function kindLabel(kind) {
  return ({ ipynb: 'Notebook', markdown: 'Guide', pdf: 'Paper', slides: 'Slides', image: 'Figure', video: 'Video', audio: 'Audio', code: 'Source', unsupported: 'Unavailable', problem: 'Problem' })[kind] || 'Resource';
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
    if (name === 'readme.md') return file.includes('/') ? 3 : 0;
    if (extension(file) === '.ipynb') return 1;
    if (extension(file) === '.pdf') return 2;
    if (extension(file) === '.md') return 3;
    if (imageExtensions.has(extension(file))) return 4;
    if (/^(license|requirements|setup|pyproject|package-lock)/i.test(name)) return 9;
    if (/\.(csv|json|pkl|npy|npz|zip|hdf5|txt)$/i.test(name)) return 8;
    return 5;
  };
  return [...files].sort((a, b) => score(a) - score(b) || a.localeCompare(b)).slice(0, limit);
}

function resourceCard(file, options = {}) {
  const kind = options.kind || kindFor(file);
  const label = options.label || labelFor(file, options.slug);
  const summary = (options.summary || '').replace(/\bCPP\b/g, 'C++').replace(/\bPY\b/g, 'Python').replace(/\bJAVA\b/g, 'Java').replace(/\bJS\b/g, 'JavaScript').replace(/\bRS\b/g, 'Rust').replace(/\bSQL\b/g, 'SQL');
  const action = options.action || (kind === 'ipynb' ? 'Open lesson' : kind === 'markdown' ? 'Read guide' : kind === 'pdf' ? 'Read paper' : kind === 'slides' ? 'View slides' : kind === 'image' ? 'View figure' : kind === 'unsupported' ? 'Preview unavailable' : 'Open resource');
  const extra = options.problemFiles ? ` data-problem-files="${esc(JSON.stringify(options.problemFiles))}"` : '';
  const languageData = options.languages && options.languages.length ? ` data-languages="${esc(options.languages.join(','))}"` : '';
  const summaryMarkup = summary ? `<span class="resource-summary">${esc(summary)}</span>` : '';
  return `<a class="resource-link resource-card${kind === 'problem' ? ' problem-link' : ''}" href="${href(file)}" data-view-kind="${kind}" data-path="${esc(file)}" data-file-name="${esc(fileName(file))}" data-view-title="${esc(label)}"${extra}${languageData}><span class="resource-link-top"><span class="resource-kind">${kindLabel(kind)}</span><span class="resource-number">${esc(options.badge || '')}</span></span><span class="resource-title">${esc(label)}</span>${summaryMarkup}<span class="resource-action">${esc(action)} <span aria-hidden="true">→</span></span></a>`;
}

function legacyModuleSection(group, index) {
  const primary = preferredFiles(group.files, 8);
  const remaining = group.files.filter((file) => !primary.includes(file));
  const paperTone = /paper|evidence|qrao|cut|volume|noise|virtual|quanvolution/i.test(group.name) ? 'Research topic' : 'Module';
  return `<section class="module-section" id="${collectionId(group.name)}"><div class="module-heading"><span class="module-index">${String(index + 1).padStart(2, '0')}</span><div><span class="module-kicker">${paperTone}</span><h3>${esc(humanize(group.name))}</h3><p>${group.files.length} resource${group.files.length === 1 ? '' : 's'} · start with the guide, paper, or notebook below.</p></div></div><div class="resource-grid">${primary.map((file) => resourceCard(file)).join('')}</div>${remaining.length ? `<details class="module-more"><summary>More resources in ${esc(humanize(group.name))}<span>${remaining.length} items</span></summary><div class="resource-grid">${remaining.map((file) => resourceCard(file)).join('')}</div></details>` : ''}</section>`;
}

function legacyCuratedModuleSection(group, index, slug) {
  const primary = preferredFiles(group.files, 6);
  const remaining = group.files.filter((file) => !primary.includes(file));
  const paperTone = /paper|evidence|qrao|cut|volume|noise|virtual|quanvolution/i.test(group.name) ? 'Research topic' : 'Module';
  const title = groupLabel(group.name, slug);
  return `<section class="module-section" id="${collectionId(group.name)}"><div class="module-heading"><span class="module-index">${String(index + 1).padStart(2, '0')}</span><div><span class="module-kicker">${paperTone}</span><h3>${esc(title)}</h3><p>${group.files.length} resource${group.files.length === 1 ? '' : 's'} · open a recommended item below, or browse the supporting material.</p></div></div><div class="resource-grid">${primary.map((file) => resourceCard(file, { slug })).join('')}</div>${remaining.length ? `<details class="module-more"><summary>Supporting material in ${esc(title)}<span>${remaining.length} items</span></summary><div class="resource-grid">${remaining.map((file) => resourceCard(file, { slug })).join('')}</div></details>` : ''}</section>`;
}

function moduleSection(group, index, slug) {
  const primary = preferredFiles(group.files, 6);
  const remaining = group.files.filter((file) => !primary.includes(file));
  const supporting = remaining.slice(0, 24);
  const overflow = remaining.length - supporting.length;
  const paperTone = /paper|evidence|qrao|cut|volume|noise|virtual|quanvolution/i.test(group.name) ? 'Research topic' : 'Module';
  const title = groupLabel(group.name, slug);
  const supportMarkup = remaining.length ? `<details class="module-more"><summary>Supporting material in ${esc(title)}<span>${remaining.length} items</span></summary><div class="resource-grid">${supporting.map((file) => resourceCard(file, { slug })).join('')}</div>${overflow > 0 ? `<p class="muted module-overflow">Showing 24 supporting items. Browse the complete repository for the remaining ${overflow} files.</p>` : ''}</details>` : '';
  return `<section class="module-section" id="${collectionId(group.name)}"><div class="module-heading"><span class="module-index">${String(index + 1).padStart(2, '0')}</span><div><span class="module-kicker">${paperTone}</span><h3>${esc(title)}</h3><p>${group.files.length} resource${group.files.length === 1 ? '' : 's'} · open a recommended item below, or browse the supporting material.</p></div></div><div class="resource-grid">${primary.map((file) => resourceCard(file, { slug })).join('')}</div>${supportMarkup}</section>`;
}

function legacyLeetCodeMarkup(files) {
  const problems = groupFiles(files).filter((group) => group.name !== 'Root guide' && group.files.some((file) => /\.(md|c|cc|cpp|cu|go|java|js|py|rs|sql|ts)$/i.test(file)));
  const cards = problems.map((group) => {
    const readme = group.files.find((file) => /^.+\/README\.md$/i.test(file));
    const source = group.files.find((file) => codeExtensions.has(extension(file)));
    const entry = readme || source || group.files[0];
    const filesForProblem = group.files.filter((file) => /\.(md|c|cc|cpp|cu|go|java|js|py|rs|sql|ts)$/i.test(file));
    const languages = [...new Set(group.files.filter((file) => codeExtensions.has(extension(file))).map((file) => extension(file).slice(1).toUpperCase()))];
    const number = (group.name.match(/^\d+/) || [])[0] ? String(Number((group.name.match(/^\d+/) || [])[0])) : '—';
    return resourceCard(entry, { kind: 'problem', label: humanize(group.name), summary: languages.length ? languages.join(' · ') : 'Problem statement and notes', action: 'Open problem', badge: `#${number}`, problemFiles: filesForProblem, languages, slug: 'LeetCode-Solutions' });
  }).join('');
  return `<section class="problem-library" id="problem-library"><div class="module-heading"><span class="module-index">01</span><div><span class="module-kicker">Problem library</span><h3>Choose a problem. Read the approach. Compare the code.</h3><p>${problems.length} problem workspaces, each with its statement, notes, and available language implementations.</p></div></div><label class="problem-search"><span>Search problems</span><input type="search" aria-label="Search LeetCode problems" placeholder="Try ‘median’, ‘tree’, or a problem number" data-problem-search></label><p class="problem-count" data-problem-count>Showing all ${problems.length} problems</p><div class="resource-grid problem-grid" data-problem-grid>${cards}</div></section>`;
}

function leetCodeMarkup(files) {
  const problems = groupFiles(files).filter((group) => group.name !== 'Root guide' && group.files.some((file) => /\.(md|c|cc|cpp|cu|go|java|js|py|rs|sql|ts)$/i.test(file)));
  const cards = problems.map((group) => {
    const readme = group.files.find((file) => /^.+\/README\.md$/i.test(file));
    const source = group.files.find((file) => codeExtensions.has(extension(file)));
    const entry = readme || source || group.files[0];
    const filesForProblem = group.files.filter((file) => /\.(md|c|cc|cpp|cu|go|java|js|py|rs|sql|ts)$/i.test(file));
    const languages = [...new Set(group.files.filter((file) => codeExtensions.has(extension(file))).map((file) => extension(file).slice(1).toUpperCase()))];
    const number = (group.name.match(/^\d+/) || [])[0] ? String(Number((group.name.match(/^\d+/) || [])[0])) : '—';
    return resourceCard(entry, { kind: 'problem', label: humanize(group.name), summary: languages.length ? languages.join(' · ') : 'Problem statement and notes', action: 'Open problem', badge: `#${number}`, problemFiles: filesForProblem, languages, slug: 'LeetCode-Solutions' });
  }).join('');
  const languageOptions = [...new Set(problems.flatMap((group) => group.files.filter((file) => codeExtensions.has(extension(file))).map((file) => extension(file).slice(1).toUpperCase())))].sort();
  const languageSelect = `<label class="problem-filter"><span>Language</span><select aria-label="Filter by language" data-language-filter><option value="all">All languages</option>${languageOptions.map((language) => `<option value="${esc(language)}">${esc(languageName(language))}</option>`).join('')}</select></label>`;
  return `<section class="problem-library" id="problem-library"><div class="module-heading"><span class="module-index">01</span><div><span class="module-kicker">Problem library</span><h3>Choose a problem. Read the approach. Compare the code.</h3><p>${problems.length} problem workspaces, each with its statement, notes, and available language implementations.</p></div></div><div class="problem-tools"><label class="problem-search"><span>Search problems</span><input type="search" aria-label="Search LeetCode problems" placeholder="Try ‘median’, ‘tree’, or a problem number" data-problem-search></label>${languageSelect}</div><p class="problem-count" data-problem-count>Showing the first 24 of ${problems.length} problems</p><div class="resource-grid problem-grid" data-problem-grid>${cards}</div><button class="problem-more" type="button" data-problem-more>Show more problems</button></section>`;
}

function leetCodeStart(files) {
  return groupFiles(files)
    .filter((group) => group.name !== 'Root guide' && group.files.some((file) => /\.(md|c|cc|cpp|cu|go|java|js|py|rs|sql|ts)$/i.test(file)))
    .slice(0, 4)
    .map((group) => {
      const readme = group.files.find((file) => /^.+\/README\.md$/i.test(file));
      const source = group.files.find((file) => codeExtensions.has(extension(file)));
      const entry = readme || source || group.files[0];
      const problemFiles = group.files.filter((file) => /\.(md|c|cc|cpp|cu|go|java|js|py|rs|sql|ts)$/i.test(file));
      const number = (group.name.match(/^\d+/) || [])[0] || '—';
      return resourceCard(entry, { kind: 'problem', label: humanize(group.name), action: 'Open problem', badge: `#${number}`, problemFiles });
    })
    .join('');
}

function page(slug, meta) {
  const [title, description, category] = meta;
  const files = collectFiles(path.join(root, slug));
  const groups = orderedGroups(groupFiles(files), slug);
  const navigation = slug === 'LeetCode-Solutions'
    ? '<a href="#problem-library"><span>01</span><strong>Problem library</strong><small>Search and filter</small></a>'
    : groups.map((group, index) => `<a href="#${collectionId(group.name)}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${esc(groupLabel(group.name, slug))}</strong><small>${group.files.length} items</small></a>`).join('');
  const guide = slug === 'LeetCode-Solutions' ? leetCodeStart(files) : preferredFiles(files, 4).map((file) => resourceCard(file, { slug })).join('');
  const body = slug === 'LeetCode-Solutions' ? leetCodeMarkup(files) : groups.map((group, index) => moduleSection(group, index, slug)).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · Monit Sharma</title><meta name="description" content="${esc(description)}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="project-site.css"></head><body><header class="topbar"><div class="wrap topbar-inner"><a class="brand" data-classroom-link href="https://monitsharma.github.io/"><span class="dot"></span><span>Monit Sharma</span></a><nav><a data-classroom-link href="https://monitsharma.github.io/">Quantum Classroom</a><a data-portfolio-link href="https://monitsharma.github.io/portfolio/">Portfolio</a></nav></div></header><main><section class="wrap project-hero"><div class="crumb"><a data-classroom-link href="https://monitsharma.github.io/">Quantum Classroom</a><span>/</span><span>${esc(category)}</span></div><div class="label">${esc(category)}</div><h1>${esc(title)}</h1><p class="lead">${esc(description)}</p><div class="actions"><a class="button" href="https://github.com/MonitSharma/${encodeURIComponent(slug)}#readme">Open repository ↗</a><a class="text-link" href="#content">Explore the work ↓</a></div></section><section class="project-intro"><div class="wrap"><div class="intro-grid"><div><div class="eyebrow">Start here</div><h2>Navigate the work as a learning collection.</h2></div><p>Each item opens within this site. Guides render as reading pages, papers and figures use a focused viewer, and notebooks retain their narrative, code, and saved outputs.</p></div><div class="resource-grid start-grid">${guide}</div></div></section><section class="wrap project-content" id="content"><div class="eyebrow">Collections</div><nav class="collection-nav" aria-label="Project collections">${navigation}</nav>${body}</section></main><footer><div class="wrap"><span>Monit Sharma · open work in progress</span><a href="https://github.com/MonitSharma/${encodeURIComponent(slug)}">GitHub ↗</a></div></footer><script>if(['127.0.0.1','localhost'].includes(location.hostname)){document.querySelectorAll('[data-classroom-link]').forEach(a=>a.href=location.origin+'/MonitSharma.github.io/');document.querySelectorAll('[data-portfolio-link]').forEach(a=>a.href=location.origin+'/portfolio/');}const search=document.querySelector('[data-problem-search]');if(search){const cards=[...document.querySelectorAll('[data-problem-grid] .problem-link')],count=document.querySelector('[data-problem-count]');search.addEventListener('input',()=>{const term=search.value.trim().toLowerCase();let shown=0;cards.forEach(card=>{const visible=!term||card.textContent.toLowerCase().includes(term);card.hidden=!visible;if(visible)shown++;});count.textContent=term?'Showing '+shown+' matching problem'+(shown===1?'':'s'):'Showing all '+cards.length+' problems';});}</script><script src="project-viewer.js"></script></body></html>`;
}

for (const [slug, meta] of Object.entries(projects)) {
  const directory = path.join(root, slug);
  if (!fs.existsSync(directory)) continue;
  fs.writeFileSync(path.join(directory, 'project-site.css'), css);
  fs.writeFileSync(path.join(directory, 'project-viewer.js'), viewer);
  fs.writeFileSync(path.join(directory, 'index.html'), page(slug, meta));
}
