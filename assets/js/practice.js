
  const exercises = [
    {
      id: 'bell-state', domain: 'Quantum Codebooks', title: 'Create a Bell pair',
      prompt: 'Complete the Qiskit circuit so qubits 0 and 1 are entangled and the final state is measured.',
      target: 'Prepare |Φ+⟩ = (|00⟩ + |11⟩)/√2 and measure both qubits. Equivalent circuits are accepted.',
      samples: [['Circuit width', 'QuantumCircuit(2)'], ['Entangling step', 'h(0) followed by cx(0, 1)']],
      starter: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\n# create entanglement and measure here\n',
      hints: ['The first gate creates an equal superposition on qubit 0.', 'The controlled gate should use qubit 0 as control and qubit 1 as target.', 'Finish with measure_all() or an equivalent measurement call.'],
      checks: []
    },
    {
      id: 'qft', domain: 'Quantum Codebooks', title: 'Build a three-qubit QFT',
      prompt: 'Write the circuit construction for a three-qubit quantum Fourier transform using Qiskit-style gates.',
      target: 'Implement the positive-sign QFT in Qiskit bit order, then measure all three qubits. The grader tests all eight basis inputs, including phases and output swaps.',
      samples: [['Register', 'QuantumCircuit(3)'], ['Phase structure', 'Hadamard + controlled phase rotation']],
      starter: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(3)\n# add the QFT structure here\n',
      hints: ['In this bit-order convention, start with H on qubit 2, then work down toward qubit 0.', 'Controlled phase rotations can be expressed with cp(angle, control, target); use π/2 and π/4 for the three-qubit transform.', 'A swap between qubits 0 and 2 reverses the output order.'],
      checks: []
    },
    {
      id: 'cuda-vector-add', domain: 'LeetGPU', title: 'Index a vector-add kernel',
      prompt: 'Complete the CUDA kernel so each thread computes one valid element of c = a + b.',
      target: 'Compute a global thread index and guard the write with an i < n bound check.',
      samples: [['Input', 'a = [1, 2], b = [3, 4]'], ['Expected output', 'c = [4, 6]']],
      starter: '__global__ void vector_add(const float* a, const float* b, float* c, int n) {\n  // compute the global index\n  // guard the write and add a[i] + b[i]\n}\n',
      hints: ['The global index combines blockIdx.x, blockDim.x, and threadIdx.x.', 'Threads beyond n must return without writing.', 'The assignment should read from both input arrays.'],
      checks: [
        ['Declares a CUDA kernel', code => /__global__\s+void/.test(code)],
        ['Uses a global thread index', code => /blockIdx\.x[\s\S]*blockDim\.x[\s\S]*threadIdx\.x|threadIdx\.x[\s\S]*blockDim\.x[\s\S]*blockIdx\.x/.test(code)],
        ['Guards the array access', code => /if\s*\([^)]*\bi\b[^)]*(<|<=)[^)]*n/.test(code)],
        ['Adds the two input vectors', code => /c\s*\[[^\]]+\]\s*=\s*a\s*\[[^\]]+\]\s*\+\s*b\s*\[[^\]]+\]/.test(code)]
      ]
    },
    {
      id: 'cuda-relu', domain: 'LeetGPU', title: 'Write a ReLU kernel',
      prompt: 'Implement the elementwise ReLU operation in a CUDA kernel: output max(0, input) for every valid index.',
      target: 'Use the CUDA thread index pattern, a bounds guard, and a non-negative output expression.',
      samples: [['Input', 'x = [-2.0, 0.5, 3.0]'], ['Expected output', 'y = [0.0, 0.5, 3.0]']],
      starter: '__global__ void relu(const float* x, float* y, int n) {\n  // find the index\n  // write max(0, x[i]) for valid i\n}\n',
      hints: ['Reuse the standard one-dimensional CUDA indexing pattern.', 'The output must never be negative.', 'fmaxf(0.0f, x[i]) and a conditional expression are both acceptable.'],
      checks: [
        ['Declares a CUDA kernel', code => /__global__\s+void/.test(code)],
        ['Computes a thread index', code => /blockIdx\.x[\s\S]*blockDim\.x[\s\S]*threadIdx\.x/.test(code)],
        ['Guards the index', code => /if\s*\([^)]*\bi\b[^)]*(<|<=)[^)]*n/.test(code)],
        ['Clamps negative values', code => /fmaxf\s*\(|max\s*\(|0\.0f\s*,|0\.0\s*\)|\?\s*0\s*:/.test(code)]
      ]
    },
    {
      id: 'two-sum', domain: 'LeetCode', title: 'Solve Two Sum in one pass',
      prompt: 'Complete a linear-time solution that returns the indices of two values adding to target.',
      target: 'Use a dictionary of previously seen values and return the matching pair of indices.',
      samples: [['Input', 'nums = [2, 7, 11, 15], target = 9'], ['Expected output', '[0, 1]']],
      starter: 'def two_sum(nums, target):\n    seen = {}\n    # scan nums once and return the matching indices\n',
      hints: ['Iterate with enumerate so you have both index and value.', 'Look up target - value before storing the current value.', 'Store value -> index in seen.'],
      checks: []
    },
    {
      id: 'prefix-max', domain: 'LeetCode', title: 'Track a running maximum',
      prompt: 'Implement a single-pass function that returns the running maximum after each value in nums.',
      target: 'Keep one running maximum, append it at every step, and return the output list.',
      samples: [['Input', 'nums = [2, 1, 5, 3]'], ['Expected output', '[2, 2, 5, 5]']],
      starter: 'def running_max(nums):\n    result = []\n    # keep the largest value seen so far\n    return result\n',
      hints: ['Initialize a value that can be compared with the first element.', 'Loop through nums and update the maximum when the current value is larger.', 'Append the current maximum on every iteration.'],
      checks: []
    },
    {
      id: 'superposition', domain: 'Quantum Codebooks', title: 'Prepare and measure superposition',
      prompt: 'Prepare |+⟩ = (|0⟩ + |1⟩)/√2, then measure it in the computational basis.',
      target: 'Create one qubit, apply H to it, and include a measurement operation.',
      samples: [['Initial state', '|0>'], ['Expected probabilities', 'P(0) = 0.5, P(1) = 0.5']],
      starter: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(1)\n# prepare and measure the qubit\n',
      hints: ['The equal superposition is created with a Hadamard gate.', 'The circuit only needs one qubit for this exercise.', 'Measure in the computational basis after applying H.'],
      checks: []
    },
    {
      id: 'phase-kickback', domain: 'Quantum Codebooks', title: 'Trace phase kickback',
      prompt: 'Set up the two-qubit scaffold used to demonstrate phase kickback with a controlled-X operation.',
      target: 'Prepare control |+⟩ and target |−⟩, apply CX(0, 1), then H on the control. Measure the control: it should be |1⟩ while the target remains |−⟩.',
      samples: [['Register', '2 qubits'], ['Core operation', 'cx(0, 1) between basis changes']],
      starter: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\n# prepare the target and build the phase-kickback scaffold\n',
      hints: ['The target is prepared in |1> before the controlled operation.', 'Use H gates to move between the computational and phase bases.', 'Keep qubit 0 as control and qubit 1 as target.'],
      checks: []
    },
    {
      id: 'cuda-matmul-index', domain: 'LeetGPU', title: 'Map threads to a matrix',
      prompt: 'Complete the 2D CUDA indexing for a matrix kernel that writes one output element per thread.',
      target: 'Derive row and column from block and thread coordinates, then guard both dimensions.',
      samples: [['Grid shape', 'rows = 4, cols = 8'], ['Expected mapping', 'row = blockIdx.y * blockDim.y + threadIdx.y']],
      starter: '__global__ void matrix_op(const float* a, float* out, int rows, int cols) {\n  // derive row and col from the 2D grid\n  // write one valid output element\n}\n',
      hints: ['Use .x for columns and .y for rows.', 'Each coordinate combines blockIdx, blockDim, and threadIdx.', 'The guard must prevent both row and col from exceeding the matrix shape.'],
      checks: [
        ['Declares a CUDA kernel', code => /__global__\s+void/.test(code)],
        ['Uses 2D thread coordinates', code => /blockIdx\.y[\s\S]*blockDim\.y[\s\S]*threadIdx\.y/.test(code) && /blockIdx\.x[\s\S]*blockDim\.x[\s\S]*threadIdx\.x/.test(code)],
        ['Guards rows and columns', code => /rows[\s\S]*cols|cols[\s\S]*rows/.test(code) && /if\s*\(/.test(code)],
        ['Writes an output element', code => /out\s*\[/.test(code)]
      ]
    },
    {
      id: 'cuda-shared-tile', domain: 'LeetGPU', title: 'Stage a shared-memory tile',
      prompt: 'Sketch the synchronization structure for a tiled matrix multiplication kernel.',
      target: 'Declare shared memory for tiles, load from global memory, synchronize, then compute.',
      samples: [['Memory space', '__shared__ tile'], ['Synchronization', '__syncthreads() after loads']],
      starter: '__global__ void tiled_matmul(const float* a, const float* b, float* c) {\n  // declare tiles and load one value per thread\n  // synchronize before using shared values\n}\n',
      hints: ['Shared arrays are declared with the __shared__ qualifier.', 'Both tiles need to be synchronized before the multiply-accumulate loop.', 'The barrier is written __syncthreads().'],
      checks: [
        ['Declares a CUDA kernel', code => /__global__\s+void/.test(code)],
        ['Uses shared memory', code => /__shared__/.test(code)],
        ['Synchronizes the block', code => /__syncthreads\s*\(\s*\)/.test(code)],
        ['Uses block-level indexing', code => /threadIdx\.[xy]/.test(code) && /blockIdx\.[xy]/.test(code)]
      ]
    },
    {
      id: 'valid-parentheses', domain: 'LeetCode', title: 'Validate nested brackets',
      prompt: 'Implement a stack-based validator for strings containing (), [], and {} brackets.',
      target: 'Push opening brackets, match each closer with the stack top, and accept only an empty stack.',
      samples: [['Input', 's = "({[]})"'], ['Expected output', 'True']],
      starter: 'def is_valid(s):\n    stack = []\n    # scan the string and validate matching brackets\n',
      hints: ['A dictionary can map each closing bracket to its opening partner.', 'A closing bracket is invalid when the stack is empty or mismatched.', 'Return true only when the stack is empty at the end.'],
      checks: []
    },
    {
      id: 'number-of-islands', domain: 'LeetCode', title: 'Count connected islands',
      starter: 'def num_islands(grid):\n    # count four-direction-connected land components\n    return 0\n',
      prompt: 'Implement num_islands(grid) for a rectangular grid of integer 0s and 1s. Count connected groups using four-direction adjacency.',
      target: 'Return an integer island count, including for empty grids, water-only grids, and diagonal land.',
      samples: [['Input', 'grid = [[1,1,0],[0,1,0],[0,0,1]]'], ['Expected output', '2']],
      hints: ['Start a search whenever you find an unvisited land cell.', 'A search should visit the four neighboring cells recursively or with a queue.', 'Mark cells as visited so each island is counted once.'],
      checks: []
    }
  ];

  const collections = [
    {
      value: 'Quantum Codebooks',
      inventory: '132 notebooks',
      repo: 'MonitSharma/Quantum-Codebooks',
      itemSingular: 'notebook',
      itemLabel: 'notebooks',
      copy: 'PennyLane codebook solutions, QuTiP demonstrations, circuits, pulse-level simulation, visualizations, and quantum-mechanics notebooks.',
      accepts: item => item.type === 'blob' && item.path.toLowerCase().endsWith('.ipynb')
    },
    {
      value: 'LeetCode',
      inventory: '552+ problems',
      repo: 'MonitSharma/LeetCode-Solutions',
      itemSingular: 'solution folder',
      itemLabel: 'solution folders',
      copy: 'Algorithm solutions across Python, C, C++, Java, JavaScript, Rust, and SQL. The collection reports 552+ solved problems; this reference browser loads every current top-level solution folder.',
      accepts: item => item.type === 'tree' && !item.path.includes('/') && !item.path.startsWith('.')
    },
    {
      value: 'LeetGPU',
      inventory: '5 kernels',
      repo: 'MonitSharma/LeetGPU-Solutions',
      itemSingular: 'CUDA kernel',
      itemLabel: 'CUDA kernels',
      copy: 'CUDA implementations for vector operations, image transforms, matrix operations, and tiled multiplication.',
      accepts: item => item.type === 'blob' && item.path.toLowerCase().endsWith('.cu')
    }
  ];
  const storageKey = 'quantum-classroom-practice-progress-v2';
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch (error) { progress = {}; }
  try {
    const old = progress['migration:v2'] ? {} : JSON.parse(localStorage.getItem('quantum-classroom-practice-progress-v1') || '{}');
    Object.entries(old).filter(([key]) => key.endsWith(':code')).forEach(([key,value]) => { if (!(key in progress)) progress[key] = value; });
  } catch (_) {}
  progress['migration:v2'] = true;
  let activeFilter = collections[0].value;
  let currentId = exercises[0].id;
  let hintIndex = 0;
  let lastResult = null;
  let lastMode = null;
  let catalogQuery = '';
  let catalogLimit = 24;
  const catalogCache = {};

  const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const activeCollection = () => collections.find(collection => collection.value === activeFilter);
  const visibleExercises = () => exercises.filter(exercise => exercise.domain === activeFilter);
  const currentExercise = () => exercises.find(exercise => exercise.id === currentId) || visibleExercises()[0];
  const encodePath = path => path.split('/').map(encodeURIComponent).join('/');
  const catalogName = path => path.replace(/\.ipynb$|\.cu$/i, '').replace(/[_-]+/g, ' ').replaceAll('/', ' / ');

  function saveProgress() { try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch (error) {} }
  function scrollToAssessment() {
    requestAnimationFrame(() => {
      const target = document.getElementById('assessment-workbench');
      const headerHeight = document.querySelector('.topbar').getBoundingClientRect().height;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  }
  function renderFilters() {
    const root = document.getElementById('filters');
    root.innerHTML = collections.map(collection => {
      return `<button class="filter-btn${activeFilter === collection.value ? ' active' : ''}" data-filter="${collection.value}" aria-pressed="${activeFilter === collection.value}"><span>${collection.value}</span><span class="filter-count">${collection.inventory}</span></button>`;
    }).join('');
    root.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      const next = visibleExercises();
      if (!next.some(exercise => exercise.id === currentId)) currentId = next[0].id;
      hintIndex = 0; lastResult = null; lastMode = null; catalogQuery = ''; catalogLimit = 24;
      document.getElementById('catalog-search').value = '';
      document.getElementById('source-catalog').open = false;
      render();
      renderCatalog();
      scrollToAssessment();
    }));
  }
  function renderProgress() {
    const list = visibleExercises();
    const completed = list.filter(exercise => progress[exercise.id]).length;
    const reviewOnly = activeFilter === 'LeetGPU';
    document.querySelector('.progress-label').textContent = reviewOnly ? 'Verification' : 'Collection progress';
    document.querySelector('.progress-track').hidden = reviewOnly;
    document.getElementById('progress-text').textContent = reviewOnly ? 'Review only' : `${completed} / ${list.length}`;
    document.getElementById('progress-bar').style.width = `${completed / list.length * 100}%`;
  }
  function renderCatalogItems() {
    const collection = activeCollection();
    const items = catalogCache[collection.value] || [];
    const query = catalogQuery.trim().toLowerCase();
    const filtered = query ? items.filter(item => catalogName(item.path).toLowerCase().includes(query)) : items;
    const visible = filtered.slice(0, catalogLimit);
    document.getElementById('catalog-list').innerHTML = visible.map((item, index) => {
      const kind = item.type === 'tree' ? 'tree' : 'blob';
      const href = `https://github.com/${collection.repo}/${kind}/main/${encodePath(item.path)}`;
      return `<li><a href="${href}" target="_blank" rel="noopener"><span class="catalog-index">${String(index + 1).padStart(3, '0')}</span><span class="catalog-name">${escapeHtml(catalogName(item.path))}</span></a></li>`;
    }).join('');
    const status = document.getElementById('catalog-status');
    const itemLabel = filtered.length === 1 ? collection.itemSingular : collection.itemLabel;
    status.textContent = items.length ? `${filtered.length} ${itemLabel}${query ? ' found' : ' loaded'}` : 'No source items found';
    const more = document.getElementById('catalog-more');
    more.hidden = visible.length >= filtered.length;
    more.textContent = `Show ${Math.min(24, filtered.length - visible.length)} more`;
  }
  async function renderCatalog() {
    const collection = activeCollection();
    const requestedCollection = collection.value;
    document.getElementById('catalog-title').textContent = `${collection.value} source library`;
    document.getElementById('catalog-summary').textContent = `${collection.inventory} · Browse files ↓`;
    document.getElementById('catalog-copy').textContent = collection.copy;
    document.getElementById('catalog-source').href = `https://github.com/${collection.repo}`;
    document.getElementById('catalog-status').textContent = 'Loading source catalog...';
    document.getElementById('catalog-list').innerHTML = '';
    document.getElementById('catalog-more').hidden = true;
    if (!document.getElementById('source-catalog').open) { document.getElementById('catalog-status').textContent = 'Open the reference panel to load the source files.'; return; }
    if (!catalogCache[collection.value]) {
      try {
        const response = await fetch(`https://api.github.com/repos/${collection.repo}/git/trees/main?recursive=1`, { headers: { Accept: 'application/vnd.github+json' } });
        if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
        const data = await response.json();
        catalogCache[collection.value] = (data.tree || []).filter(collection.accepts).sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }));
      } catch (error) {
        if (activeFilter === requestedCollection) {
          document.getElementById('catalog-status').textContent = 'Catalog unavailable - open the repository';
          document.getElementById('catalog-list').innerHTML = '';
        }
        return;
      }
    }
    if (activeFilter === requestedCollection) renderCatalogItems();
  }
  function render() {
    const exercise = currentExercise(), list = visibleExercises();
    const quantum = exercise.domain === 'Quantum Codebooks', review = exercise.domain === 'LeetGPU';
    const position = list.findIndex(item => item.id === exercise.id) + 1;
    document.getElementById('section-title').textContent = activeFilter;
    document.getElementById('exercise-position').innerHTML = `<label class="exercise-picker">Exercise <select id="exercise-select" aria-label="Choose exercise">${list.map((item,index)=>`<option value="${item.id}"${item.id===exercise.id?' selected':''}>${index+1}. ${item.title}</option>`).join('')}</select></label>`;
    document.getElementById('exercise-select').addEventListener('change', event => { currentId=event.target.value;hintIndex=0;lastResult=null;lastMode=null;render(); });
    const done = Boolean(progress[exercise.id]), attempts = Number(progress[`${exercise.id}:attempts`] || 0);
    const savedStatus = progress[`${exercise.id}:lastStatus`] || 'not-submitted';
    const savedStatusLabel = savedStatus === 'passed' ? 'Verified' : savedStatus === 'needs-work' ? 'Needs work' : savedStatus === 'reviewed' ? 'Reviewed · not executed' : 'Not submitted';
    const savedStatusClass = savedStatus === 'passed' ? 'pass' : savedStatus === 'needs-work' ? 'fail' : '';
    let results = '';
    if (lastResult) {
      const {checks,verified,reviewOnly,message} = lastResult;
      const title = reviewOnly ? 'Structure review' : lastMode==='sample' ? quantum?'Circuit feedback':'Sample feedback' : 'Verification feedback';
      const summary = reviewOnly ? 'Not execution-tested' : verified ? lastMode==='submit'?'Answer verified':'Checks passed · submit to verify' : 'Needs work';
      results = `<div class="results"><div class="results-head"><h3>${title}</h3><span class="result-summary ${!reviewOnly?(verified?'pass':'fail'):''}">${summary}</span></div>${message?`<p class="assessment-copy">${escapeHtml(message)}</p>`:''}<div class="test-list">${checks.map(check=>`<div class="test-item ${check.pass?'pass':'fail'}"><span class="test-icon">${check.pass?'✓':'×'}</span><div><span class="test-name">${escapeHtml(check.label)}</span><p class="test-detail">${escapeHtml(check.detail||'')}</p></div><span class="test-label">${reviewOnly?(check.pass?'found':'missing'):(check.pass?'pass':'fail')}</span></div>`).join('')}</div></div>`;
    }
    const hint = hintIndex ? `<div class="hint-box visible"><strong>Hint ${hintIndex}</strong> &nbsp; ${escapeHtml(exercise.hints[hintIndex - 1])}</div>` : '';
    const samples = (exercise.samples || []).map(([label, value]) => `<div class="sample-case"><span class="case-label">${label}</span><code>${escapeHtml(value)}</code></div>`).join('');
    const description = quantum ? 'Check the simulated quantum state, relative phase, entanglement, and final measurement. All essential checks run in both modes.' : review ? 'Review structural hints in CUDA source. This does not compile or execute a GPU kernel and cannot verify a correct solution.' : 'Run your Python function against actual input/output cases. Samples show two cases; verification includes edge cases. The first run downloads browser Python.';
    const syntax = quantum ? `<details class="supported-syntax"><summary>Supported circuit syntax</summary><p>Write straight-line Qiskit-style calls: QuantumCircuit(n) or QuantumCircuit(n, bits), h/x/y/z/s/t, rx/ry/rz/p, cx/cz/cp, swap, and final measure_all() or measure(qubits, bits). Angles support numbers, pi, and arithmetic. This circuit reader does not run arbitrary Python, loops, helper classes, or installed Qiskit.</p><a href="simulator.html">Explore these gates visually ↗</a></details>` : '';
    document.getElementById('exercise-root').innerHTML = `<article class="exercise-card"><div class="exercise-top"><div><div class="exercise-domain">${exercise.domain} · ${quantum?'State simulation':review?'Structure review':'Python execution'}</div><h3 class="exercise-title">${exercise.title}</h3><p class="exercise-prompt">${exercise.prompt}</p></div><div class="complete-mark${done?' done':''}">${done?'✓ Verified':'Open'}</div></div><div class="target-strip"><strong>Expected outcome</strong>${exercise.target}</div><div class="notebook"><div class="cell"><div class="cell-head"><span class="cell-meta">In [01] &nbsp; notebook cell</span><span class="cell-status" id="cell-status" aria-live="polite">${lastResult?lastResult.reviewOnly?'Structure reviewed':lastResult.verified?'Checks passed':'Needs work':'Ready to check'}</span></div><textarea id="code-input" spellcheck="false" aria-label="Code for ${exercise.title}">${escapeHtml(progress[`${exercise.id}:code`] ?? exercise.starter ?? '')}</textarea></div>${syntax}<div class="assessment-panel"><div class="assessment-head"><h3>${review?'Code review':'Assessment'}</h3><span class="assessment-meta">${attempts} verification attempt${attempts===1?'':'s'}</span></div><p class="assessment-copy">${description}</p><div class="sample-cases">${samples}</div><div class="assessment-actions"><button class="action-btn" id="check-btn">▶ ${quantum?'Check circuit':review?'Review structure':'Run sample tests'}</button>${review?'':'<button class="action-btn secondary" id="submit-btn">Verify answer</button>'}<span class="assessment-status ${savedStatusClass}">${savedStatusLabel}</span></div></div><div class="cell-actions"><button class="action-btn secondary" id="reset-btn">Reset cell</button><button class="action-btn secondary" id="hint-btn">Show hint</button><span class="hint-count">${hintIndex} / ${exercise.hints.length} hints used</span></div>${hint}<div id="results-root" aria-live="polite">${results}</div><div class="next-row"><button class="action-btn secondary" id="next-btn">Next exercise →</button></div></div></article>`;
    document.getElementById('code-input').addEventListener('input', event => {
      progress[`${exercise.id}:code`] = event.target.value; delete progress[exercise.id];progress[`${exercise.id}:lastStatus`]='not-submitted';lastResult=null;lastMode=null;saveProgress();renderProgress();
      document.getElementById('results-root').replaceChildren();
      document.querySelector('.complete-mark').classList.remove('done');document.querySelector('.complete-mark').textContent='Open';
      document.querySelector('.assessment-status').textContent='Edited · recheck';document.querySelector('.assessment-status').className='assessment-status';
      document.getElementById('cell-status').textContent='Edited · run checks again';
    });
    document.getElementById('check-btn').addEventListener('click', () => runChecks(exercise, 'sample'));
    document.getElementById('submit-btn')?.addEventListener('click', () => runChecks(exercise, 'submit'));
    document.getElementById('reset-btn').addEventListener('click', () => { delete progress[`${exercise.id}:code`];delete progress[exercise.id];delete progress[`${exercise.id}:attempts`];delete progress[`${exercise.id}:lastStatus`];hintIndex=0;lastResult=null;lastMode=null;saveProgress();render(); });
    document.getElementById('hint-btn').addEventListener('click', () => { if(hintIndex<exercise.hints.length)hintIndex++;render(); });
    document.getElementById('next-btn').addEventListener('click', () => {currentId=list[position%list.length].id;hintIndex=0;lastResult=null;lastMode=null;render();scrollToAssessment();});
    renderFilters();renderProgress();
  }
  async function runChecks(exercise, mode) {
    const code=document.getElementById('code-input').value;
    progress[`${exercise.id}:code`]=code;
    document.querySelectorAll('#exercise-root button,#filters button,#exercise-select').forEach(button=>button.disabled=true);
    document.getElementById('code-input').readOnly=true;
    try {
      if(exercise.domain==='Quantum Codebooks')lastResult=QuantumAssessment.assess(exercise.id,code);
      else if(exercise.domain==='LeetCode')lastResult=await PracticeRunner.runPython(code,exercise.id,mode,text=>document.getElementById('cell-status').textContent=text);
      else lastResult=PracticeRunner.reviewCuda(exercise,code);
    } catch(error) {lastResult={verified:false,checks:[{label:'Assessment ran',pass:false,detail:error.message}],message:'The answer was not verified.'};}
    lastMode=mode;
    if(mode==='submit') {
      progress[`${exercise.id}:attempts`]=Number(progress[`${exercise.id}:attempts`]||0)+1;
      progress[`${exercise.id}:lastStatus`]=lastResult.verified?'passed':lastResult.reviewOnly?'reviewed':'needs-work';
      if(lastResult.verified)progress[exercise.id]=true;else delete progress[exercise.id];
    }
    saveProgress();render();
  }
  document.getElementById('source-catalog').addEventListener('toggle',()=>{if(document.getElementById('source-catalog').open)renderCatalog();});
  document.getElementById('catalog-search').addEventListener('input', event => {
    catalogQuery = event.target.value;
    catalogLimit = 24;
    renderCatalogItems();
  });
  document.getElementById('catalog-more').addEventListener('click', () => {
    catalogLimit += 24;
    renderCatalogItems();
  });
  render();
  renderCatalog();
