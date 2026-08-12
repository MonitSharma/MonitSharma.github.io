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
    groupOrder: ['notes_on_papers', 'Evidence for the utility of quantum computing before fault tolerance', 'CutQC', 'QRAO', 'quantum_volume', 'Quanvolutional_Neural_Networks', 'Virtual_two_qubits', 'Zero_noise_extrapolation'],
    groupLabels: { notes_on_papers: 'Research reading list', 'Evidence for the utility of quantum computing before fault tolerance': 'Evidence for the utility of quantum computing before fault tolerance', CutQC: 'CutQC: automatic circuit cutting', QRAO: 'Quantum random access optimization', quantum_volume: 'Quantum volume benchmark', Quanvolutional_Neural_Networks: 'Quanvolutional neural networks', Virtual_two_qubits: 'Virtual two-qubit gates', Zero_noise_extrapolation: 'Zero-noise extrapolation' },
    groupKickers: { notes_on_papers: 'Reading library', 'Evidence for the utility of quantum computing before fault tolerance': 'Paper reproduction', CutQC: 'Paper implementation', QRAO: 'Research method', quantum_volume: 'Hardware benchmark', Quanvolutional_Neural_Networks: 'Research method', Virtual_two_qubits: 'Paper implementation', Zero_noise_extrapolation: 'Error mitigation' },
    groupDescriptions: { notes_on_papers: 'A curated reading shelf of papers and study notes. Open a paper for the original argument; the project sections below connect selected ideas to code and results.', 'Evidence for the utility of quantum computing before fault tolerance': 'Reproduction notebooks for Kim et al. (Nature, 2023), organized around the paper’s zero-noise extrapolation, exact-verification, and beyond-exact-verification figures.', CutQC: 'An implementation of CutQC, which partitions circuits that are too wide for one device into smaller subcircuits and reconstructs the result classically.', QRAO: 'Quantum Random Access Optimization encodes several classical variables per qubit, then rounds the measured solution.', quantum_volume: 'A processor benchmark that tests representative random circuits as circuit width and depth grow.', Quanvolutional_Neural_Networks: 'Experiments that use quantum circuits as feature maps before a classical neural network.', Virtual_two_qubits: 'A study of how two-qubit operations can be decomposed and compared through channels and expectation values.', Zero_noise_extrapolation: 'Estimating a noise-free result by running deliberately noisier equivalent circuits.' },
    groupLinks: { 'Evidence for the utility of quantum computing before fault tolerance': [{ label: 'Read the Nature paper', href: 'https://www.nature.com/articles/s41586-023-06096-3' }], CutQC: [{ label: 'Read the CutQC paper', href: 'https://arxiv.org/abs/2012.02333' }], quantum_volume: [{ label: 'About the benchmark', href: 'https://quantum.cloud.ibm.com/docs/en/api/qiskit/1.4/qiskit.circuit.library.quantum_volume' }] },
    titleOverrides: {
      'README.md': 'Research map', 'CutQC/Readme.md': 'Circuit cutting guide', 'CutQC/tutorial_1_automatic_cut_finding.ipynb': 'Automatic cut finding', 'CutQC/tutorial_2_manual_cutting.ipynb': 'Manual circuit cutting', 'CutQC/tutorial_3_cutting_with_quantum_serverless.ipynb': 'Circuit cutting with serverless',
      'notes_on_papers/Barren Plateau_240210_093002.pdf': 'Barren plateaus', 'notes_on_papers/CircuitT Knitting with classical communication_240521_182309.pdf': 'Circuit knitting with classical communication', 'notes_on_papers/Classical complexity Review_240526_023628.pdf': 'Classical complexity review', 'notes_on_papers/Constructing a virtual two-qubit gate by Sampling_240125_181001.pdf': 'Constructing a virtual two-qubit gate', 'notes_on_papers/Generalization in Quantum Machine Learning_240210_092951.pdf': 'Generalization in QML', 'notes_on_papers/Globally optimal Quantum Control!_240229_011719.pdf': 'Globally optimal quantum control', 'notes_on_papers/Lesson 1 understanding quantum information_240511_114258.pdf': 'Lesson 1: Quantum information', 'notes_on_papers/Lesson 2 Multiple Systems_240512_014728.pdf': 'Lesson 2: Multiple systems', 'notes_on_papers/Lie Algebra and quantum machine Learning_240210_092937.pdf': 'Lie algebra and QML', 'notes_on_papers/Optimal of Quantum circuits Gate + wire_240227_225917.pdf': 'Optimal circuit gates and wires', 'notes_on_papers/optimal wire cutting with classical communication_240222_135108.pdf': 'Optimal wire cutting', 'notes_on_papers/overhead for simulating a non-local channel _240214_084044.pdf': 'Overhead of non-local channels', 'notes_on_papers/Overhead- constrained circuit knitting_240521_183813.pdf': 'Overhead-constrained circuit knitting', 'notes_on_papers/QAOA Results with Circuit cutting_240214_162942.pdf': 'QAOA with circuit cutting', 'notes_on_papers/Quantum and classical Decomposition For VRP_240429_162217.pdf': 'Quantum and classical VRP decomposition', 'notes_on_papers/Quantum computation Review_240526_023733.pdf': 'Quantum computation review', 'notes_on_papers/Quantum control Theory_240325_181509.pdf': 'Quantum control theory', 'notes_on_papers/Quantum optimization and the path forward_240302_005455.pdf': 'Quantum optimization: the path forward', 'notes_on_papers/Tensor Network An Introduction_240512_130625.pdf': 'Tensor networks: an introduction', 'notes_on_papers/The Adjoint is all you need.pdf': 'The adjoint is all you need', 'notes_on_papers/Toward Large scale Quantum Optimization with Pauli Correlation Encoding.pdf': 'Large-scale QRAO', 'notes_on_papers/Variational Quantum Optimization with MultiBasis Encoding.pdf': 'Variational optimization with multibasis encoding',
      'Evidence_of_utility/README.md': 'Paper reproduction guide', 'Evidence_of_utility_qc/README.md': 'Paper reproduction guide',
      'Evidence_of_utility/Jupyter Files/Fig2.ipynb': 'Figure 2 · Error mitigation', 'Evidence_of_utility/Jupyter Files/Fig3a.ipynb': 'Figure 3A · Exact benchmark', 'Evidence_of_utility/Jupyter Files/Fig3b.ipynb': 'Figure 3B · Experiment comparison', 'Evidence_of_utility/Jupyter Files/Fig3c.ipynb': 'Figure 3C · Wide-observable benchmark', 'Evidence_of_utility/Jupyter Files/Fig4a.ipynb': 'Figure 4A · Beyond exact verification', 'Evidence_of_utility/Jupyter Files/Fig4b.ipynb': 'Figure 4B · Classical comparison', 'Evidence_of_utility/Jupyter Files/small_scale_test.ipynb': 'Small-scale validation',
      'Evidence_of_utility_qc/Jupyter/Fig3a.ipynb': 'Figure 3A · Exact benchmark', 'Evidence_of_utility_qc/Jupyter/Fig3b.ipynb': 'Figure 3B · Experiment comparison', 'Evidence_of_utility_qc/Jupyter/Fig3c.ipynb': 'Figure 3C · Wide-observable benchmark', 'Evidence_of_utility_qc/Jupyter/Fig4a.ipynb': 'Figure 4A · Beyond exact verification', 'Evidence_of_utility_qc/Jupyter/Fig4b.ipynb': 'Figure 4B · Classical comparison'
    }
  },
  'Introduction-to-Quantum-Computing': {
    groupOrder: ['Root guide', 'lecture notes', 'jupyter_notebooks', 'Quantum Information Theory with Python', 'Quantum Complexity Theory', 'quantum_computing_papers'],
    groupLabels: { 'Root guide': 'Course overview', 'lecture notes': 'Theory notes', jupyter_notebooks: 'Hands-on notebooks', 'Quantum Information Theory with Python': 'Information theory with Python', 'Quantum Complexity Theory': 'Complexity theory', quantum_computing_papers: 'Reference papers' },
    titleOverrides: { 'README.md': 'Course overview', 'jupyter_notebooks/Getting_Started_with_Qiskit.ipynb': 'Getting started with Qiskit', "jupyter_notebooks/Hello Quantum World.ipynb": 'Hello, quantum world', "jupyter_notebooks/Hello Entangled World.ipynb": 'Entanglement in action', 'jupyter_notebooks/Circuit_Basics.ipynb': 'Circuit basics', "jupyter_notebooks/Grover's_Algoroithm.ipynb": "Grover's algorithm", 'jupyter_notebooks/Quantum Fourier Transfom.ipynb': 'Quantum Fourier transform', 'jupyter_notebooks/Quantum Phase Estimation.ipynb': 'Quantum phase estimation', "jupyter_notebooks/Shor's_Algorithm.ipynb": "Shor's algorithm", 'jupyter_notebooks/The CHSH game.ipynb': 'The CHSH game' }
  },
  'Learn-Quantum-Computing-For-Free': { groupOrder: ['Root guide'], groupLabels: { 'Root guide': 'Learning map' }, titleOverrides: { 'README.md': 'Quantum learning map' } },
  'Learn-Quantum-Computing-with-Qiskit': { groupOrder: ['Prerequisites', 'Quantum States and Qubits', 'Multiple Qubits and Entanglement', 'Quantum Protocols and Quantum Algorithms', 'Supplementary lessons', 'gifs'], groupLabels: { 'Prerequisites': 'Prerequisites', 'Quantum States and Qubits': 'Quantum states and qubits', 'Multiple Qubits and Entanglement': 'Multiple qubits and entanglement', 'Quantum Protocols and Quantum Algorithms': 'Quantum protocols and algorithms', 'Supplementary lessons': 'Additional lessons', gifs: 'Visuals' }, titleOverrides: { 'README.md': 'Course roadmap' } },
  'Learn-Quantum-Machine-Learning': { groupOrder: ['Root guide'], groupLabels: { 'Root guide': 'Course lessons' }, titleOverrides: { 'README.md': 'QML course roadmap' } },
  'Nielsen-Chuang-Solutions': { groupOrder: ['Root guide', 'Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5', 'Chapter 6', 'Chapter 7', 'Chapter 8', 'Chapter 9', 'Chapter 10', 'Chapter 11', 'Chapter 12'], groupLabels: { 'Root guide': 'Book and complete solutions', 'Chapter 1': 'Chapter 1 solutions', 'Chapter 2': 'Chapter 2 solutions', 'Chapter 3': 'Chapter 3 solutions', 'Chapter 4': 'Chapter 4 solutions', 'Chapter 5': 'Chapter 5 solutions', 'Chapter 6': 'Chapter 6 solutions', 'Chapter 7': 'Chapter 7 solutions', 'Chapter 8': 'Chapter 8 solutions', 'Chapter 9': 'Chapter 9 solutions', 'Chapter 10': 'Chapter 10 solutions', 'Chapter 11': 'Chapter 11 solutions', 'Chapter 12': 'Chapter 12 solutions' }, titleOverrides: { 'README.md': 'Book and solution guide', 'main.tex': 'Solution manual · LaTeX source' } },
  'Qiskit-Summer-School-and-Quantum-Challenges': { groupOrder: ['Root guide', 'IBM Quantum Summer School 2020', 'IBM Quantum Summer School 2021', 'IBM Quantum Summer School 2022', 'IBM Quantum Summer School 2023', 'IBM Quantum Summer School 2024', 'IBM Quantum Challenge Fall 2020', 'IBM Quantum Challenge Fall 2021', 'IBM Quantum Challenge Fall 2022', 'IBM Quantum Challenge Spring 2021', 'IBM Quantum Challenge Spring 2022', 'IBM Quantum Challenge Spring 2023', 'IBM Quantum Challenge 2024', 'IBM Quantum Challenge Africa 2021', 'IBM Quantum Open Science Prize 2021'], groupLabels: { 'Root guide': 'Challenge guide' }, titleOverrides: { 'README.md': 'Challenge roadmap' } },
  'Quantum-Codebooks': { groupOrder: ['Root guide', 'Qiskit Textbook', 'Microsoft Q# Codebook', 'QuTiP Codebooks', 'Xanadu Quantum Codebook', 'Xanadu-Codebook-Solutions'], groupLabels: { 'Root guide': 'Codebook guide', 'Microsoft Q# Codebook': 'Q# fundamentals and algorithms', 'QuTiP Codebooks': 'QuTiP codebooks', 'Xanadu-Codebook-Solutions': 'Xanadu solutions' }, titleOverrides: { 'README.md': 'Codebook roadmap' } },
  'Quantum-Finance-and-Numerical-Methods': { groupOrder: ['Root guide', 'Introduction to Finance with Python', 'Classical Use Cases', 'JP Morgan Python Training', 'Machine Learning For Finance', 'Quantum Finance', 'Quantum Machine Learning in Finance', 'Quantum Use Cases'], groupLabels: { 'Root guide': 'Finance lab guide' }, titleOverrides: { 'README.md': 'Finance lab roadmap' } },
  'Quantum-Machine-Learning-on-Near-Term-Quantum-Devices': { groupOrder: ['Root guide', 'Higgs_Classification', 'QCNN for Disease Detection', 'Quantum Convolutinal with Data Re-Uploadation', 'Quantum Convolutional Neural Networks', 'Quantum Support Vector Machine on QCD', 'Galaxy Detection using Quantum Machine Learning'], groupLabels: { 'Root guide': 'Project guide', 'Galaxy Detection using Quantum Machine Learning': 'Galaxy classification study' }, titleOverrides: { 'README.md': 'NISQ QML project guide', 'Quantum_Machine_Learning.pdf': 'Project report' } },
  'parallel_adventures': { groupOrder: ['Root guide', 'C', 'cuda_kernels', 'JAX', 'LeetGPU', 'PyTorch', 'images'], groupLabels: { 'Root guide': 'Systems roadmap', C: 'C and C++ foundations', cuda_kernels: 'CUDA kernels', JAX: 'JAX experiments', LeetGPU: 'GPU problem solving', PyTorch: 'PyTorch experiments', images: 'Visual references' }, titleOverrides: { 'README.md': 'Parallel programming roadmap' } },
  'Computational-Methods-in-Physics': { groupOrder: ['Root guide', 'Code tutorial in Jupyter', 'Notes', 'Problem Set 1', 'Problem Set 2', 'Problem Set 3', 'project1', 'project2', 'project3', 'project4', 'project5', 'project6', 'project7', 'project8', 'project9'], groupLabels: { 'Root guide': 'Course guide', 'Code tutorial in Jupyter': 'Python and numerical methods', Notes: 'Reference notes', 'Problem Set 1': 'Problem set 1: ODEs and integration', 'Problem Set 2': 'Problem set 2: numerical methods', 'Problem Set 3': 'Problem set 3: applications' }, titleOverrides: { 'README.md': 'Computational physics roadmap', 'Notes/Computational Problems for Physics With Guided Solutions Using Python by Rubin H. Landau, Manuel José Páez (z-lib.org).pdf': 'Computational physics · Guided solutions' } },
  'Numerical-Linear-Algebra': { groupOrder: ['Root guide', 'Basic Numerical Linear Algebra', 'Advanced Numerical Linear Algebra', 'GIFs'], groupLabels: { 'Root guide': 'Course guide', 'Basic Numerical Linear Algebra': 'Core linear algebra', 'Advanced Numerical Linear Algebra': 'Advanced methods' }, titleOverrides: { 'README.md': 'Linear algebra roadmap', 'A Tutorial on Data Representation - Integers, Floating-point numbers, and characters.pdf': 'How computers represent data' } },
  'LeetGPU-Solutions': { groupOrder: ['Root guide'], groupLabels: { 'Root guide': 'GPU problem library' }, titleOverrides: { 'README.md': 'GPU practice guide' } },
  'Computational-High-Energy-Physics': { groupOrder: ['Root guide', 'Coursera Course Solutions', 'Deep-Learning-in-High-Energy-Physics', 'EOS with Critical Point QCD', 'Lattice Based Equation Of State', 'Quantum Computing Demo @ CERN'], groupLabels: { 'Root guide': 'Research map', 'Deep-Learning-in-High-Energy-Physics': 'Deep learning for HEP', 'EOS with Critical Point QCD': 'Equation of state: critical QCD', 'Lattice Based Equation Of State': 'Lattice equation of state', 'Quantum Computing Demo @ CERN': 'Quantum computing at CERN' }, titleOverrides: { 'README.md': 'HEP research map' } },
  'qsvt-linear-solvers': { groupOrder: ['docs', 'primitives', 'solvers', 'applications', 'benchmarks', 'hardware', 'tests'], groupLabels: { docs: 'Results at a glance', primitives: 'QSVT building blocks', solvers: 'Linear-system solvers', applications: 'Applications', benchmarks: 'Accuracy and convergence', hardware: 'Quantum hardware runs', tests: 'Validation' }, groupKickers: { docs: 'Results', primitives: 'Implementation', solvers: 'Implementation', applications: 'Examples', benchmarks: 'Evaluation', hardware: 'Experiments', tests: 'Quality checks' }, groupDescriptions: { docs: 'The main result: the same linear system is recovered on an ideal simulator, IBM Kingston, and Quantinuum Helios. The figures also show the inverse-polynomial approximation used by QSVT.', primitives: 'Block encoding, quantum signal processing, QSVT, and amplitude amplification—the reusable pieces behind the solver.', solvers: 'End-to-end routines for solving A x = b, with an HHL baseline for comparison.', applications: 'Small examples that make the solver’s assumptions and limits concrete.', benchmarks: 'Experiments tracking approximation error, polynomial degree, conditioning, and success probability.', hardware: 'Runner code for IBM Quantum and Quantinuum. Three recorded IBM Kingston jobs underpin the result figures above.', tests: 'Regression tests for mathematical conventions, circuit behavior, and qubit ordering.' }, titleOverrides: { 'README.md': 'QSVT research guide', 'docs/figures/hardware_distribution.png': 'Success by backend', 'docs/figures/hardware_joint_counts.png': 'Where each device spends its shots', 'docs/figures/hardware_solution.png': 'Recovered solution', 'docs/figures/qsvt_polynomial.png': 'QSVT inverse polynomial', 'docs/figures/solver_convergence.png': 'Solver convergence', 'hardware/quantinuum_runner.py': 'Quantinuum runner', 'hardware/run_ibm.py': 'IBM runner', 'hardware/ibm_results/20260620T071053+0000_ibm_kingston_d8r3pvekodhs7383v6ag.json': 'IBM Kingston · Run 1', 'hardware/ibm_results/20260620T071104+0000_ibm_kingston_d8r3pvekodhs7383v6ag.json': 'IBM Kingston · Run 2', 'hardware/ibm_results/20260620T071117+0000_ibm_kingston_d8r3pvekodhs7383v6ag.json': 'IBM Kingston · Run 3' } },
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

const fullReadmeSlugs = new Set([
  'Learn-Quantum-Computing-with-Qiskit',
  'Qiskit-Summer-School-and-Quantum-Challenges',
  'Quantum-Codebooks'
]);

const qiskitLessonGroups = {
  'Installing Qiskit and Dependancies.ipynb': 'Prerequisites',
  'Complex Arithmetic.ipynb': 'Prerequisites',
  'Linear Algebra Background.ipynb': 'Prerequisites',
  'Atoms_of_Computation.ipynb': 'Quantum States and Qubits',
  'Represenitng_Qubit_States.ipynb': 'Quantum States and Qubits',
  'Single_Qubit_Gates.ipynb': 'Quantum States and Qubits',
  'Multiple_Qubits_and_Entanglement.ipynb': 'Multiple Qubits and Entanglement',
  'Phase_Kickback.ipynb': 'Multiple Qubits and Entanglement',
  'Basic_Circuit_Identities.ipynb': 'Multiple Qubits and Entanglement',
  'Proving_Universality.ipynb': 'Multiple Qubits and Entanglement',
  'Classical_Computation_on_a_Quantum_Computer.ipynb': 'Multiple Qubits and Entanglement',
  'Quantum_Circuits.ipynb': 'Quantum Protocols and Quantum Algorithms',
  'Deutsch_Jozsa_Algorithm.ipynb': 'Quantum Protocols and Quantum Algorithms',
  'Bernstein_Vazirani_Algorithm.ipynb': 'Quantum Protocols and Quantum Algorithms',
  'Simons_Algorithm.ipynb': 'Quantum Protocols and Quantum Algorithms',
  'Quantum_Fourier_Transform.ipynb': 'Quantum Protocols and Quantum Algorithms',
  'Quantum_Phase_Estimatoin.ipynb': 'Quantum Protocols and Quantum Algorithms',
  'The_Case_for_Quantum_Computers.ipynb': 'Supplementary lessons'
};

function groupLabel(name, slug) {
  const profile = profileFor(slug);
  if (profile.groupLabels && profile.groupLabels[name]) return profile.groupLabels[name];
  if (slug === 'Nielsen-Chuang-Solutions' && /^Chapter \d+$/i.test(name)) return `${name} solutions`;
  return humanize(name);
}

function labelFor(file, slug) {
  const profile = profileFor(slug);
  if (profile.titleOverrides && profile.titleOverrides[file]) return profile.titleOverrides[file];
  if (slug === 'Nielsen-Chuang-Solutions') {
    const chapter = file.match(/^Chapter (\d+)\//i);
    if (chapter && /\.tex$/i.test(file)) {
      const stem = humanize(path.basename(file));
      const cleaned = stem.replace(/^(Monit(?:sharma)?|Soham|Clausia)\s*/i, '').replace(/^Chapter \d+\s*/i, '').trim();
      if (!cleaned || /^Solution$/i.test(cleaned) || /^Solutions$/i.test(cleaned)) return `Chapter ${chapter[1]} solution`;
      if (/^Master$/i.test(cleaned)) return `Chapter ${chapter[1]} solution · compiled`;
      return `Chapter ${chapter[1]} solution · ${cleaned}`;
    }
    if (/^Nielsen_and_Chuang_book\.pdf$/i.test(file)) return 'Textbook · Nielsen and Chuang';
    if (/^Chapter 2\/chapter2_master\.(?:pdf|tex)$/i.test(file)) return 'Chapter 2 solutions · compiled';
    if (/Nielson_and_Chuang_Solutions updated @ 22042023\.pdf$/i.test(file)) return 'Complete solutions · April 2023';
    if (/Nielson_and_Chuang_Solutions updated @22012023\.pdf$/i.test(file)) return 'Complete solutions · January 2023';
    if (/^Chap2&4_Final\.pdf$/i.test(file)) return 'Compiled solutions · Chapters 2 and 4';
  }
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
      const baseName = path.basename(publicPath);
      if (/^(?:\.gitignore|license(?:\.[^.]+)?|__init__\.py|conftest\.py|pyproject\.toml|requirements(?:_[^.]+)?\.txt|setup(?:\.[^.]+)?|package-lock\.json|quantinuum_login\.py)$/i.test(baseName)) continue;
      // Root READMEs become the page introduction. Nested READMEs stay in the
      // content model so their prose can be rendered inline, never as cards.
      if (/^readme\.md$/i.test(baseName) && !publicPath.includes('/')) continue;
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

function readmeFile(dir) {
  const entry = fs.readdirSync(dir, { withFileTypes: true }).find((candidate) => candidate.isFile() && /^readme\.md$/i.test(candidate.name));
  return entry ? path.join(dir, entry.name) : null;
}

function inlineReadme(value) {
  let text = esc(value).replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|#[^)]+)\)/g, '<a href="$2">$1</a>');
  text = text.replace(/&lt;br\s*\/?&gt;/gi, ' · ').replace(/&lt;\/?[a-z][^&]*?&gt;/gi, '');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return text;
}

function readmeMarkup(file, className = 'project-readme') {
  if (file && fs.statSync(file).isDirectory()) file = readmeFile(file);
  if (!file) return '';
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const blocks = [];
  let paragraph = [];
  let inFence = false;
  let inHtmlTable = false;
  const flush = () => {
    const value = paragraph.join(' ').replace(/\s+/g, ' ').trim();
    if (value) blocks.push(`<p>${inlineReadme(value.slice(0, 720))}${value.length > 720 ? '…' : ''}</p>`);
    paragraph = [];
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (/back to homepage/i.test(line)) { flush(); continue; }
    if (line.startsWith('```')) { flush(); inFence = !inFence; continue; }
    if (/<table\b/i.test(line)) { flush(); inHtmlTable = true; continue; }
    if (inHtmlTable) { if (/<\/table>/i.test(line)) inHtmlTable = false; continue; }
    if (inFence || !line || /^!\[[^\]]*\]\(/.test(line) || /^<\/?(?:div|picture|source|img|tr|td|th|a|p|br)\b/i.test(line) || /^[-| :]+$/.test(line) || line.startsWith('|')) { if (!line) flush(); continue; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flush();
      if (heading[1].length > 1 && blocks.length < 5) blocks.push(`<h3>${inlineReadme(heading[2].replace(/\s+#*$/, ''))}</h3>`);
      continue;
    }
    paragraph.push(line);
    if (blocks.filter((block) => block.startsWith('<p>')).length >= 3) break;
  }
  flush();
  if (!blocks.length) return '';
  return `<section class="${className}" aria-label="Project notes"><div class="readme-label">${className === 'project-readme' ? 'About this project' : 'Section notes'}</div><div class="readme-copy">${blocks.slice(0, 5).join('')}</div></section>`;
}

function fullReadmeMarkup(file, options = {}) {
  if (file && fs.statSync(file).isDirectory()) file = readmeFile(file);
  if (!file) return '';
  const compact = Boolean(options.compact);
  const omitHeadings = new Set((options.omitHeadings || []).map((heading) => String(heading).toLowerCase()));
  const omitParagraphs = options.omitParagraphs || [];
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const blocks = [];
  let paragraph = [];
  let list = [];
  const flushParagraph = () => {
    const value = paragraph.join(' ').replace(/\s+/g, ' ').trim();
    if (value) {
      if (compact && omitParagraphs.some((pattern) => pattern.test(value))) {
        paragraph = [];
        return;
      }
      const sentences = value.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [value];
      const summary = compact && value.length > 320 ? sentences.slice(0, 2).join(' ').trim().slice(0, 320).replace(/\s+[^\s]*$/, '') + '…' : value;
      blocks.push(`<p>${inlineReadme(summary)}</p>`);
    }
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) blocks.push(`<ul>${list.map((item) => `<li><a href="${esc(item.href)}">${inlineReadme(item.title)}</a>${item.description ? `: ${inlineReadme(item.description)}` : ''}</li>`).join('')}</ul>`);
    list = [];
  };
  const headingId = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    const line = raw.trim();
    if (/back to homepage/i.test(line)) continue;
    if (!line) { flushParagraph(); flushList(); continue; }
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (heading) {
      flushParagraph(); flushList();
      const text = heading[2].trim();
      if (compact && omitHeadings.has(text.toLowerCase())) continue;
      if (/^table(?: of contents)?$/i.test(text)) {
        const toc = [];
        let cursor = index + 1;
        while (cursor < lines.length) {
          while (cursor < lines.length && !lines[cursor].trim()) cursor += 1;
          if (cursor >= lines.length) break;
          const item = lines[cursor].trim().match(/^[-*]\s*\[([^\]]+)\]\((#[^)]+)\)/);
          if (!item) break;
          toc.push(`<li><a href="${esc(item[2])}">${inlineReadme(item[1])}</a></li>`);
          cursor += 1;
        }
        if (toc.length) blocks.push(`<nav class="readme-inline-toc" aria-label="Table of contents"><div class="readme-label">Table of contents</div><ul>${toc.join('')}</ul></nav>`);
        index = cursor - 1;
        continue;
      }
      const level = Math.min(5, heading[1].length + 1);
      blocks.push(`<h${level} id="${esc(headingId(text))}">${inlineReadme(text)}</h${level}>`);
      continue;
    }
    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      flushParagraph(); flushList();
      const imageUrl = image[2]
        .replace('https://qiskit.org/images/learn/course/prerequisites/prerequisites.png', 'https://raw.githubusercontent.com/Qiskit/textbook/main/notebooks/ch-prerequisites/overview/environment-setup.png')
        .replace('https://qiskit.org/images/learn/course/quantum-states-and-qubits/bloch-sphere.png', 'https://raw.githubusercontent.com/Qiskit/textbook/main/notebooks/ch-states/images/bloch.png')
        .replace('https://qiskit.org/images/learn/course/multiple-qubits-and-entanglement/multiple-qubits-and-entanglement.png', 'https://raw.githubusercontent.com/Qiskit/textbook/main/notebooks/ch-gates/overview/multiple-qubits-entangled-states.png')
        .replace('https://qiskit.org/images/learn/course/quantum-protocols-and-quantum-algorithms/quantum-protocols-and-quantum-algorithms.png', 'https://raw.githubusercontent.com/Qiskit/textbook/main/notebooks/ch-algorithms/overview/header.png');
      blocks.push(`<figure class="readme-inline-figure"><img loading="lazy" src="${esc(imageUrl)}" alt="${esc(image[1] || 'Course illustration')}"><figcaption>${esc(image[1] || 'Course illustration')}</figcaption></figure>`);
      continue;
    }
    if (line.startsWith('|') || /^\|?\s*:?-{3,}/.test(line)) {
      flushParagraph(); flushList();
      continue;
    }
    const item = line.match(/^[-*]\s*\[([^\]]+)\]\((https?:\/\/[^)]+|#[^)]+)\)\s*:??\s*(.*)$/);
    if (item) {
      flushParagraph();
      if (compact) continue;
      list.push({ title: item[1].trim(), href: item[2], description: item[3].replace(/\s+/g, ' ').trim() });
      continue;
    }
    if (compact && /^\s+/.test(raw)) continue;
    if (/^\s+/.test(raw) && list.length) {
      if (compact) continue;
      list[list.length - 1].description = `${list[list.length - 1].description} ${line}`.trim();
      continue;
    }
    flushList();
    if (/^```|^<\/?(?:table|tr|td|th|div|img|br)\b/i.test(line)) continue;
    paragraph.push(line);
  }
  flushParagraph();
  flushList();
  return blocks.length ? `<section class="project-readme-full" aria-label="Complete repository guide"><div class="readme-label">Repository guide</div><div class="readme-full-copy">${blocks.join('')}</div></section>` : '';
}

function readmeResourceSections(file) {
  if (!file) return [];
  const sections = [];
  let current = null;
  let inFence = false;
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith('```')) { inFence = !inFence; continue; }
    if (inFence || !line || /back to homepage/i.test(line)) continue;
    const heading = line.match(/^#{1,3}\s+(.+?)\s*#*$/);
    if (heading) {
      const title = heading[1].trim();
      if (/table of contents|quantum computing learning resources/i.test(title)) { current = null; continue; }
      current = { title, items: [] };
      sections.push(current);
      continue;
    }
    const item = line.match(/^[-*]\s*\[([^\]]+)\]\((https?:\/\/[^)]+)\)\s*:?\s*(.*)$/);
    if (item && current) current.items.push({ title: item[1].trim(), href: item[2], description: item[3].replace(/\s+/g, ' ').trim() });
  }
  return sections.filter((section) => section.items.length);
}

function readmeResourceMarkup(file) {
  const sections = readmeResourceSections(file);
  if (!sections.length) return { navigation: '', markup: '' };
  const navigation = `<nav class="readme-toc" aria-label="Resource sections"><div class="readme-toc-label">Browse by source</div><div class="readme-toc-links">${sections.map((section, index) => `<a href="#readme-section-${index + 1}">${esc(section.title)}<span>${section.items.length}</span></a>`).join('')}</div></nav>`;
  const markup = `<div class="readme-resource-map">${sections.map((section, index) => `<section class="readme-resource-section" id="readme-section-${index + 1}"><div class="readme-resource-heading"><span>${String(index + 1).padStart(2, '0')}</span><h3>${esc(section.title)}</h3><small>${section.items.length} resources</small></div><div class="resource-grid">${section.items.map((item) => `<a class="external-resource-card resource-card" href="${esc(item.href)}" data-external-resource><span class="resource-link-top"><span class="resource-kind">External resource</span></span><span class="resource-title">${esc(item.title)}</span>${item.description ? `<span class="resource-summary">${inlineReadme(item.description)}</span>` : ''}<span class="resource-action">Open resource <span aria-hidden="true">↗</span></span></a>`).join('')}</div></section>`).join('')}</div>`;
  return { navigation, markup };
}

function groupReadmeFile(group) {
  return group.files.find((file) => /^readme\.md$/i.test(path.basename(file))) || '';
}

function notebookOutputMarkup(slug, files, limit = 6) {
  const gallery = [];
  for (const file of files.filter((candidate) => extension(candidate) === '.ipynb')) {
    if (gallery.length >= limit) break;
    try {
      const notebook = JSON.parse(fs.readFileSync(path.join(root, slug, file), 'utf8'));
      const images = (notebook.cells || []).flatMap((cell) => cell.outputs || []).map((output) => output.data && output.data['image/png']).filter(Boolean);
      // A notebook often emits intermediate plots before its final composite.
      // Feature one representative result per notebook to keep the page readable.
      const image = images.at(-1);
      if (!image) continue;
      const encoded = Array.isArray(image) ? image.join('') : image;
      gallery.push(`<figure><img loading="lazy" src="data:image/png;base64,${encoded.replace(/\s/g, '')}" alt="Saved result from ${esc(labelFor(file, slug))}"><figcaption>${esc(labelFor(file, slug))}</figcaption></figure>`);
    } catch (error) { /* malformed notebooks remain available through the normal resource path */ }
  }
  return gallery.length ? `<div class="module-results" aria-label="Saved notebook results">${gallery.join('')}</div>` : '';
}

function groupMediaMarkup(slug, files, limit = 6) {
  const images = files.filter((file) => imageExtensions.has(extension(file))).slice(0, limit);
  if (!images.length) return '';
  const mediaSrc = (file) => {
    const fullPath = path.join(root, slug, file);
    try {
      const header = fs.readFileSync(fullPath).subarray(0, 256).toString('utf8').trimStart();
      if (header.startsWith('<?xml') || header.startsWith('<svg')) {
        return `data:image/svg+xml;base64,${fs.readFileSync(fullPath).toString('base64')}`;
      }
    } catch (error) { /* keep the regular path for files that are not readable during generation */ }
    return href(file);
  };
  return `<div class="module-figures" aria-label="Figures and result images">${images.map((file) => `<figure><img loading="lazy" src="${esc(mediaSrc(file))}" alt="${esc(labelFor(file, slug))}"><figcaption>${esc(labelFor(file, slug))}</figcaption></figure>`).join('')}</div>`;
}

function inlineModuleContent(group, slug) {
  const notes = groupReadmeFile(group);
  const profile = profileFor(slug);
  const description = (profile.groupDescriptions && profile.groupDescriptions[group.name]) || '';
  const links = (profile.groupLinks && profile.groupLinks[group.name]) || [];
  const notesMarkup = notes ? readmeMarkup(path.join(root, slug, notes), 'module-notes') : '';
  const results = /quantum_volume|qsvt-linear-solvers|Evidence for the utility/i.test(`${slug}/${group.name}`) ? notebookOutputMarkup(slug, group.files) : '';
  const figures = results ? '' : groupMediaMarkup(slug, group.files);
  const linksMarkup = links.length ? `<div class="module-links">${links.map((link) => `<a href="${esc(link.href)}">${esc(link.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div>` : '';
  if (!description && !notesMarkup && !results && !figures && !linksMarkup) return '';
  return `<div class="module-inline">${description ? `<p class="module-description">${esc(description)}</p>` : ''}${linksMarkup}${notesMarkup}${results}${figures}</div>`;
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

function groupFiles(files, slug = '') {
  const map = new Map();
  for (const file of files) {
    const [first] = file.split('/');
    let key = file.includes('/') ? first : 'Root guide';
    if (slug === 'Learn-Quantum-Computing-with-Qiskit' && qiskitLessonGroups[fileName(file)]) {
      key = qiskitLessonGroups[fileName(file)];
    } else if (slug === 'Learn-Quantum-Computing-with-Qiskit' && extension(file) === '.ipynb') {
      key = 'Supplementary lessons';
    }
    if (slug === 'Quantum-Papers-Explained-with-Code' && /^(Evidence_of_utility|Evidence_of_utility_qc)$/.test(key)) {
      key = 'Evidence for the utility of quantum computing before fault tolerance';
    }
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(file);
  }
  return [...map.entries()].map(([name, groupedFiles]) => ({ name, files: groupedFiles }));
}

function isAuxiliaryFile(file) {
  const ext = extension(file);
  if (/generate_(?:readme_)?figures?\.py$/i.test(file)) return true;
  if (/\.(?:csv|json|lock|pkl|pickle|npy|npz|parquet|tsv|txt|yaml|yml)$/i.test(ext)) return true;
  return false;
}

function curatedFiles(group) {
  const paperFiles = group.name === 'Evidence for the utility of quantum computing before fault tolerance'
    ? group.files.filter((file) => !file.startsWith('Evidence_of_utility_qc/'))
    : group.files;
  const hasInlineFigures = paperFiles.some((file) => imageExtensions.has(extension(file)));
  return paperFiles.filter((file) => {
    if (/^readme\.md$/i.test(fileName(file))) return false;
    if (hasInlineFigures && imageExtensions.has(extension(file))) return false;
    return !isAuxiliaryFile(file);
  });
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
  const extra = options.problemFiles ? ` data-problem-files="${esc(JSON.stringify(options.problemFiles))}"` : '';
  const languageData = options.languages && options.languages.length ? ` data-languages="${esc(options.languages.join(','))}"` : '';
  const summaryMarkup = summary ? `<span class="resource-summary">${esc(summary)}</span>` : '';
  return `<a class="resource-link resource-card${kind === 'problem' ? ' problem-link' : ''}" href="${href(file)}" data-view-kind="${kind}" data-path="${esc(file)}" data-file-name="${esc(fileName(file))}" data-view-title="${esc(label)}"${extra}${languageData}><span class="resource-link-top"><span class="resource-kind">${kindLabel(kind)}</span><span class="resource-number">${esc(options.badge || '')}</span></span><span class="resource-title">${esc(label)}</span>${summaryMarkup}</a>`;
}

function legacyModuleSection(group, index) {
  const primary = preferredFiles(group.files, 8);
  const remaining = group.files.filter((file) => !primary.includes(file));
  const paperTone = /paper|evidence|qrao|cut|volume|noise|virtual|quanvolution/i.test(group.name) ? 'Research topic' : 'Module';
  return `<section class="module-section" id="${collectionId(group.name)}"><div class="module-heading"><span class="module-index">${String(index + 1).padStart(2, '0')}</span><div><span class="module-kicker">${paperTone}</span><h3>${esc(humanize(group.name))}</h3><p>${group.files.length} resource${group.files.length === 1 ? '' : 's'} · browse the guide, paper, or notebook below.</p></div></div><div class="resource-grid">${primary.map((file) => resourceCard(file)).join('')}</div>${remaining.length ? `<details class="module-more"><summary>More resources in ${esc(humanize(group.name))}<span>${remaining.length} items</span></summary><div class="resource-grid">${remaining.map((file) => resourceCard(file)).join('')}</div></details>` : ''}</section>`;
}

function legacyCuratedModuleSection(group, index, slug) {
  const primary = preferredFiles(group.files, 6);
  const remaining = group.files.filter((file) => !primary.includes(file));
  const paperTone = /paper|evidence|qrao|cut|volume|noise|virtual|quanvolution/i.test(group.name) ? 'Research topic' : 'Module';
  const title = groupLabel(group.name, slug);
  return `<section class="module-section" id="${collectionId(group.name)}"><div class="module-heading"><span class="module-index">${String(index + 1).padStart(2, '0')}</span><div><span class="module-kicker">${paperTone}</span><h3>${esc(title)}</h3><p>${group.files.length} resource${group.files.length === 1 ? '' : 's'} · browse the collection and supporting material.</p></div></div><div class="resource-grid">${primary.map((file) => resourceCard(file, { slug })).join('')}</div>${remaining.length ? `<details class="module-more"><summary>Supporting material in ${esc(title)}<span>${remaining.length} items</span></summary><div class="resource-grid">${remaining.map((file) => resourceCard(file, { slug })).join('')}</div></details>` : ''}</section>`;
}

function moduleSection(group, index, slug) {
  const curated = curatedFiles(group);
  const primary = preferredFiles(curated, 6);
  const remaining = curated.filter((file) => !primary.includes(file));
  const supporting = remaining.slice(0, 24);
  const overflow = remaining.length - supporting.length;
  const profile = profileFor(slug);
  const paperTone = (profile.groupKickers && profile.groupKickers[group.name]) || (/paper|evidence|qrao|cut|volume|noise|virtual|quanvolution/i.test(group.name) ? 'Research topic' : 'Module');
  const title = groupLabel(group.name, slug);
  const supportMarkup = remaining.length ? `<details class="module-more"><summary>Supporting material in ${esc(title)}<span>${remaining.length} items</span></summary><div class="resource-grid">${supporting.map((file) => resourceCard(file, { slug })).join('')}</div>${overflow > 0 ? `<p class="muted module-overflow">Showing 24 supporting items. Browse the complete repository for the remaining ${overflow} files.</p>` : ''}</details>` : '';
  const visibleCount = curated.length;
  const inlineCount = group.files.filter((file) => imageExtensions.has(extension(file))).length;
  const countText = visibleCount
    ? `${visibleCount} curated item${visibleCount === 1 ? '' : 's'}${inlineCount ? ` · ${inlineCount} result figure${inlineCount === 1 ? '' : 's'}` : ''}`
    : inlineCount ? `${inlineCount} result figure${inlineCount === 1 ? '' : 's'}` : 'Project notes and supporting data';
  const cards = primary.length ? `<div class="resource-grid">${primary.map((file) => resourceCard(file, { slug })).join('')}</div>` : '';
  return `<section class="module-section" id="${collectionId(group.name)}"><div class="module-heading"><span class="module-index">${String(index + 1).padStart(2, '0')}</span><div><span class="module-kicker">${esc(paperTone)}</span><h3>${esc(title)}</h3><p>${countText}</p></div></div>${inlineModuleContent(group, slug)}${cards}${supportMarkup}</section>`;
}

function legacyLeetCodeMarkup(files) {
  const problems = groupFiles(files, 'LeetCode-Solutions').filter((group) => group.name !== 'Root guide' && group.files.some((file) => /\.(md|c|cc|cpp|cu|go|java|js|py|rs|sql|ts)$/i.test(file)));
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
  const problems = groupFiles(files, 'LeetCode-Solutions').filter((group) => group.name !== 'Root guide' && group.files.some((file) => /\.(md|c|cc|cpp|cu|go|java|js|py|rs|sql|ts)$/i.test(file)));
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
  return groupFiles(files, 'LeetCode-Solutions')
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
  const groups = orderedGroups(groupFiles(files, slug), slug).filter((group) => !(fullReadmeSlugs.has(slug) && group.name === 'Root guide') && (curatedFiles(group).length || groupReadmeFile(group) || group.files.some((file) => imageExtensions.has(extension(file)))));
  const readmeMap = slug === 'Learn-Quantum-Computing-For-Free' ? { navigation: '<!-- full README -->', markup: fullReadmeMarkup(readmeFile(path.join(root, slug))) } : { navigation: '', markup: '' };
  const navigation = readmeMap.markup ? '<!-- full README -->' : slug === 'LeetCode-Solutions'
    ? '<a href="#problem-library"><span>01</span><strong>Problem library</strong><small>Search and filter</small></a>'
    : readmeMap.navigation || groups.map((group, index) => {
      const count = curatedFiles(group).length + group.files.filter((file) => imageExtensions.has(extension(file))).length;
      return `<a href="#${collectionId(group.name)}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${esc(groupLabel(group.name, slug))}</strong><small>${count} item${count === 1 ? '' : 's'}</small></a>`;
    }).join('');
  const guide = slug === 'LeetCode-Solutions' ? leetCodeStart(files) : '';
  const overview = readmeMap.markup ? '' : fullReadmeSlugs.has(slug) ? fullReadmeMarkup(readmeFile(path.join(root, slug)), {
    compact: true,
    omitHeadings: slug === 'Qiskit-Summer-School-and-Quantum-Challenges' ? [
      'Summer Schools',
      'Quantum Challenges Fall',
      'Quantum Challenges Spring',
      'Other Quantum Challenges'
    ] : [],
    omitParagraphs: slug === 'Qiskit-Summer-School-and-Quantum-Challenges' ? [/summer schools?/i, /quantum challenges?/i] : []
  }) : readmeMarkup(readmeFile(path.join(root, slug)));
  const body = slug === 'LeetCode-Solutions' ? leetCodeMarkup(files) : readmeMap.markup || groups.map((group, index) => moduleSection(group, index, slug)).join('');
  const collectionMarkup = readmeMap.markup ? '' : readmeMap.navigation ? `<div class="readme-map-nav">${readmeMap.navigation}</div>` : `<nav class="collection-nav" aria-label="Project collections">${navigation}</nav>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · Monit Sharma</title><meta name="description" content="${esc(description)}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="project-site.css"></head><body><header class="topbar"><div class="wrap topbar-inner"><a class="brand" data-classroom-link href="https://monitsharma.github.io/"><span class="dot"></span><span>Monit Sharma</span></a><nav><a data-classroom-link href="https://monitsharma.github.io/">Quantum Classroom</a><a data-portfolio-link href="https://monitsharma.github.io/portfolio/">Portfolio</a></nav></div></header><main><section class="wrap project-hero"><div class="crumb"><a data-classroom-link href="https://monitsharma.github.io/">Quantum Classroom</a><span>/</span><span>${esc(category)}</span></div><div class="label">${esc(category)}</div><h1>${esc(title)}</h1><p class="lead">${esc(description)}</p><div class="actions"><a class="button" href="https://github.com/MonitSharma/${encodeURIComponent(slug)}#readme">Open repository ↗</a><a class="text-link" href="#content">Explore the work ↓</a></div></section><section class="project-intro"><div class="wrap"><div class="intro-grid"><div><div class="eyebrow">Overview</div><h2>Understand the project, then explore the work.</h2></div><p>Resources open inside this site. Guides, papers, figures, notebooks, and source files are organized around the project’s story.</p></div>${overview}${guide ? `<div class="resource-grid start-grid">${guide}</div>` : ''}</div></section><section class="wrap project-content" id="content"><div class="eyebrow">Collections</div>${readmeMap.navigation ? `<div class="readme-map-nav">${readmeMap.navigation}</div>` : `<nav class="collection-nav" aria-label="Project collections">${navigation}</nav>`}${body}</section></main><footer><div class="wrap"><span>Monit Sharma · open work in progress</span><a href="https://github.com/MonitSharma/${encodeURIComponent(slug)}">GitHub ↗</a></div></footer><script>if(['127.0.0.1','localhost'].includes(location.hostname)){document.querySelectorAll('[data-classroom-link]').forEach(a=>a.href=location.origin+'/MonitSharma.github.io/');document.querySelectorAll('[data-portfolio-link]').forEach(a=>a.href=location.origin+'/portfolio/');}const search=document.querySelector('[data-problem-search]');if(search){const cards=[...document.querySelectorAll('[data-problem-grid] .problem-link')],count=document.querySelector('[data-problem-count]');search.addEventListener('input',()=>{const term=search.value.trim().toLowerCase();let shown=0;cards.forEach(card=>{const visible=!term||card.textContent.toLowerCase().includes(term);card.hidden=!visible;if(visible)shown++;});count.textContent=term?'Showing '+shown+' matching problem'+(shown===1?'':'s'):'Showing all '+cards.length+' problems';});}</script><script src="project-viewer.js"></script></body></html>`;
}

for (const [slug, meta] of Object.entries(projects)) {
  const directory = path.join(root, slug);
  if (!fs.existsSync(directory)) continue;
  fs.writeFileSync(path.join(directory, 'project-site.css'), css);
  fs.writeFileSync(path.join(directory, 'project-viewer.js'), viewer);
  fs.writeFileSync(path.join(directory, 'index.html'), page(slug, meta));
}
