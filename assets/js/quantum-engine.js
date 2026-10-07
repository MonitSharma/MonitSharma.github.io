/* Small ideal statevector simulator. q0 is the least-significant bit (Qiskit order). */
(function (root) {
  const MAX_QUBITS = 6, MAX_COLUMNS = 24;
  const singleGates = ['H', 'X', 'Y', 'Z', 'S', 'SDG', 'T', 'TDG', 'RX', 'RY', 'RZ', 'P'];
  function matrix(gate, angle = Math.PI / 2) {
    const c = Math.cos(angle / 2), s = Math.sin(angle / 2), h = Math.SQRT1_2;
    const phase = a => [1, 0, 0, 0, 0, 0, Math.cos(a), Math.sin(a)];
    const matrices = {
      H: [h,0,h,0,h,0,-h,0], X: [0,0,1,0,1,0,0,0], Y: [0,0,0,-1,0,1,0,0],
      Z: [1,0,0,0,0,0,-1,0], S: phase(Math.PI/2), SDG: phase(-Math.PI/2),
      T: phase(Math.PI/4), TDG: phase(-Math.PI/4), P: phase(angle),
      RX: [c,0,0,-s,0,-s,c,0], RY: [c,0,-s,0,s,0,c,0],
      RZ: [c,-s,0,0,0,0,c,s]
    };
    if (!matrices[gate]) throw new Error(`Unsupported gate: ${gate}`);
    return matrices[gate];
  }
  function validate(circuit) {
    if (!circuit || !Number.isInteger(circuit.qubits) || circuit.qubits < 1 || circuit.qubits > MAX_QUBITS) throw new Error('Choose between 1 and 6 qubits.');
    if (!Array.isArray(circuit.columns) || circuit.columns.length > MAX_COLUMNS) throw new Error('A circuit can have at most 24 columns.');
    for (const column of circuit.columns) {
      if (!Array.isArray(column)) throw new Error('Invalid circuit column.');
      const occupied = new Set();
      for (const op of column) {
        if (!op || !Array.isArray(op.targets) || !Array.isArray(op.controls || [])) throw new Error('Invalid gate.');
        if (op.gate !== 'SWAP' && !singleGates.includes(op.gate)) throw new Error('Unsupported gate.');
        if (op.targets.length !== (op.gate === 'SWAP' ? 2 : 1) || (op.controls || []).length > 1 || (op.gate === 'SWAP' && op.controls?.length)) throw new Error('Invalid gate targets or controls.');
        if (op.controls?.length && !['X', 'Z', 'P'].includes(op.gate)) throw new Error('Supported controlled gates are CX, CZ, and CP.');
        if (op.angle !== undefined && (typeof op.angle !== 'number' || !Number.isFinite(op.angle))) throw new Error('Gate angles must be finite numbers.');
        if (['RX', 'RY', 'RZ', 'P'].includes(op.gate) && op.angle === undefined) throw new Error('Rotation and phase gates require an angle.');
        if (!['RX', 'RY', 'RZ', 'P'].includes(op.gate) && op.angle !== undefined) throw new Error('This gate does not take an angle.');
        for (const q of [...op.targets, ...(op.controls || [])]) {
          if (!Number.isInteger(q) || q < 0 || q >= circuit.qubits || occupied.has(q)) throw new Error('Gates in a column must use distinct, valid qubits.');
          occupied.add(q);
        }
      }
    }
    return circuit;
  }
  function apply(state, op) {
    const target = op.targets[0], bit = 1 << target;
    if (op.gate === 'SWAP') {
      const other = 1 << op.targets[1];
      for (let i = 0; i < state.length / 2; i++) {
        if (!(i & bit) && (i & other)) {
          const j = i ^ bit ^ other;
          [state[2*i], state[2*j]] = [state[2*j], state[2*i]];
          [state[2*i+1], state[2*j+1]] = [state[2*j+1], state[2*i+1]];
        }
      }
      return;
    }
    const controlMask = (op.controls || []).reduce((mask,q) => mask | (1 << q),0);
    const m = matrix(op.gate, op.angle);
    for (let i = 0; i < state.length / 2; i++) {
      if ((i & bit) || (i & controlMask) !== controlMask) continue;
      const j = i | bit, ar = state[2*i], ai = state[2*i+1], br = state[2*j], bi = state[2*j+1];
      state[2*i] = m[0]*ar-m[1]*ai+m[2]*br-m[3]*bi;
      state[2*i+1] = m[0]*ai+m[1]*ar+m[2]*bi+m[3]*br;
      state[2*j] = m[4]*ar-m[5]*ai+m[6]*br-m[7]*bi;
      state[2*j+1] = m[4]*ai+m[5]*ar+m[6]*bi+m[7]*br;
    }
  }
  function simulate(circuit, options = {}) {
    validate(circuit);
    const size = 1 << circuit.qubits, basis = options.basis ?? 0;
    if (!Number.isInteger(basis) || basis < 0 || basis >= size) throw new Error('Invalid input basis state.');
    const state = new Float64Array(2 * size); state[2*basis] = 1;
    const steps = options.steps ?? circuit.columns.length;
    if (!Number.isInteger(steps) || steps < 0 || steps > circuit.columns.length) throw new Error('Invalid step.');
    for (const column of circuit.columns.slice(0,steps)) for (const op of column) apply(state,op);
    return state;
  }
  function probabilities(state) { return Array.from({length:state.length/2}, (_,i) => state[2*i]**2+state[2*i+1]**2); }
  function reduced(state, qubit) {
    let zero = 0, one = 0, re = 0, im = 0;
    const mask = 1 << qubit;
    for (let i = 0; i < state.length/2; i++) {
      if (i & mask) continue;
      const j = i | mask, ar=state[2*i], ai=state[2*i+1], br=state[2*j], bi=state[2*j+1];
      zero+=ar*ar+ai*ai; one+=br*br+bi*bi; re+=ar*br+ai*bi; im+=ai*br-ar*bi;
    }
    const x=2*re, y=-2*im, z=zero-one, length=Math.min(1, Math.sqrt(x*x+y*y+z*z));
    const eigenvalues=[(1+length)/2,(1-length)/2];
    return {x,y,z,zero,one,purity:(1+length*length)/2,entropy:-eigenvalues.reduce((sum,p)=>sum+(p>1e-12?p*Math.log2(p):0),0)};
  }
  function fidelity(a,b) {
    if (a.length !== b.length) return 0;
    let re=0, im=0;
    for(let i=0;i<a.length;i+=2){re+=a[i]*b[i]+a[i+1]*b[i+1];im+=a[i]*b[i+1]-a[i+1]*b[i];}
    return re*re+im*im;
  }
  function sample(state, shots=1024, random=Math.random) {
    if (!Number.isInteger(shots) || shots < 1 || shots > 10000) throw new Error('Choose 1–10,000 shots.');
    const ps=probabilities(state), counts=Array(ps.length).fill(0);
    for(let k=0;k<shots;k++) {
      const r=random(); let sum=0, chosen=ps.length-1;
      for(let i=0;i<ps.length;i++){sum+=ps[i];if(r<sum){chosen=i;break;}}
      counts[chosen]++;
    }
    return counts;
  }
  function preset(name) {
    const gate=(g,q,control,angle)=>({gate:g,targets:[q],...(control===undefined?{}:{controls:[control]}),...(angle===undefined?{}:{angle})});
    if(name==='bell') return {qubits:2,columns:[[gate('H',0)],[gate('X',1,0)]]};
    if(name==='ghz') return {qubits:3,columns:[[gate('H',0)],[gate('X',1,0)],[gate('X',2,1)]]};
    if(name==='phase') return {qubits:2,columns:[[gate('X',1)],[gate('H',0),gate('H',1)],[gate('X',1,0)],[gate('H',0)]]};
    if(name==='interference') return {qubits:1,columns:[[gate('H',0)],[gate('Z',0)],[gate('H',0)]]};
    if(name==='qft') {
      const columns=[];
      for(let j=2;j>=0;j--){columns.push([gate('H',j)]);for(let k=j-1;k>=0;k--)columns.push([gate('P',k,j,Math.PI/(2**(j-k)))]);}
      columns.push([{gate:'SWAP',targets:[0,2]}]);
      return {qubits:3,columns};
    }
    if(name==='empty') return {qubits:2,columns:[]};
    throw new Error('Unknown circuit example.');
  }
  function qiskit(circuit) {
    validate(circuit);
    const lines=['from qiskit import QuantumCircuit','from math import pi','',`qc = QuantumCircuit(${circuit.qubits})`];
    for(const column of circuit.columns)for(const op of column){
      const q=op.targets[0], ctrl=op.controls?.[0];
      const name=ctrl===undefined?op.gate.toLowerCase():({X:'cx',Z:'cz',P:'cp'}[op.gate]);
      if(!name) throw new Error('Controlled gate cannot be exported.');
      const args=[...(op.angle===undefined?[]:[String(op.angle)]),...(ctrl===undefined?[]:[ctrl]),...op.targets];
      lines.push(`qc.${name}(${args.join(', ')})`);
    }
    lines.push('qc.measure_all()'); return lines.join('\n');
  }
  const api={MAX_QUBITS,MAX_COLUMNS,singleGates,matrix,validate,simulate,probabilities,reduced,fidelity,sample,preset,qiskit};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.QuantumEngine=api;
})(typeof window==='undefined'?globalThis:window);
