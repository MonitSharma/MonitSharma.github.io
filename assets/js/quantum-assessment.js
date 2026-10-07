/* A deliberately bounded Qiskit-style circuit reader, not a Python interpreter.
 * Only recognized, straight-line statements are accepted. Unknown code fails closed. */
(function(root){
  const Q=typeof module!=='undefined'&&module.exports?require('./quantum-engine'):root.QuantumEngine;
  function number(text, variables={}) {
    const source=text.replace(/\b(?:math|np)\.pi\b/g,'pi');
    const tokens=source.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[A-Za-z_]\w*|[()+*/-]/gi)||[];
    if(tokens.join('')!==source.replace(/\s/g,''))throw new Error('Use numeric angles, pi, or simple arithmetic.');
    let i=0;
    const atom=()=>{
      const token=tokens[i++];
      if(token==='+'||token==='-')return (token==='-'?-1:1)*atom();
      if(token==='('){const v=sum();if(tokens[i++]!==')')throw new Error('Unclosed angle expression.');return v;}
      if(token==='pi')return Math.PI;
      if(Object.hasOwn(variables,token))return variables[token];
      if(token!==undefined&&Number.isFinite(Number(token)))return Number(token);
      throw new Error(`Unknown numeric value: ${token||'empty expression'}.`);
    };
    const product=()=>{let v=atom();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++];const b=atom();v=op==='*'?v*b:v/b;}return v;};
    const sum=()=>{let v=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++];const b=product();v=op==='+'?v+b:v-b;}return v;};
    const value=sum();if(i!==tokens.length||!Number.isFinite(value))throw new Error('Invalid numeric expression.');return value;
  }
  function argumentsOf(text, variables) {
    if(!text.trim())return [];
    const values=[];let depth=0,start=0;
    for(let i=0;i<=text.length;i++){
      const c=text[i];if(c==='('||c==='[')depth++;if(c===')'||c===']')depth--;
      if(depth<0)throw new Error('Unbalanced argument brackets.');
      if((c===','&&depth===0)||i===text.length){const part=text.slice(start,i).trim();start=i+1;if(/^\[.*\]$/.test(part))values.push(argumentsOf(part.slice(1,-1),variables));else values.push(number(part,variables));}
    }
    if(depth!==0)throw new Error('Unbalanced argument brackets.');return values;
  }
  function parse(code) {
    if(typeof code!=='string'||code.length>12000)throw new Error('Keep the exercise under 12,000 characters.');
    const variables={};let name=null,circuit=null,classical=0,measuring=false;
    const measured=new Set(), classicalTargets=new Set();
    const source=code.replace(/#[^\n]*/g,'');
    const lines=source.split(/\n|;/);
    if(lines.length>200)throw new Error('Keep the exercise under 200 statements.');
    for(let lineIndex=0;lineIndex<lines.length;lineIndex++){
      const line=lines[lineIndex].trim();if(!line)continue;
      try {
        if(/^(?:from qiskit import QuantumCircuit|from math import pi|import math|import numpy as np)$/.test(line))continue;
        const init=line.match(/^([A-Za-z_]\w*)\s*=\s*QuantumCircuit\s*\((.*)\)$/);
        if(init){
          if(circuit)throw new Error('Use one circuit per exercise.');
          const args=argumentsOf(init[2],variables);
          if(args.length<1||args.length>2||!args.every(v=>Number.isInteger(v)&&v>=0))throw new Error('Use QuantumCircuit(qubits) or QuantumCircuit(qubits, classical_bits).');
          name=init[1];classical=args[1]||0;circuit={qubits:args[0],columns:[]};Q.validate(circuit);continue;
        }
        const assignment=line.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
        if(assignment){if(assignment[1]===name||assignment[1]==='pi')throw new Error('Do not overwrite the circuit or pi.');variables[assignment[1]]=number(assignment[2],variables);continue;}
        const call=line.match(/^([A-Za-z_]\w*)\.([A-Za-z_]\w*)\s*\((.*)\)$/);
        if(!call||!circuit||call[1]!==name)throw new Error('Use straight-line circuit calls. Loops, conditionals, strings, helpers, and arbitrary Python are not supported here.');
        const method=call[2],args=argumentsOf(call[3],variables);
        const validQ=q=>Number.isInteger(q)&&q>=0&&q<circuit.qubits;
        const index=q=>{if(!validQ(q))throw new Error('Qubit index is outside the register.');return q;};
        if(method==='barrier'){if(args.length&&args.some(a=>!(Array.isArray(a)?a:[a]).every(validQ)))throw new Error('Invalid barrier qubits.');continue;}
        if(method==='measure_all'){
          if(args.length)throw new Error('Use measure_all() without arguments.');
          if(measuring)throw new Error('Measure each qubit once at the end.');
          for(let q=0;q<circuit.qubits;q++)measured.add(q);measuring=true;continue;
        }
        if(method==='measure'){
          if(args.length!==2)throw new Error('measure needs a qubit and classical bit, or two lists.');
          const qs=Array.isArray(args[0])?args[0]:[args[0]],cs=Array.isArray(args[1])?args[1]:[args[1]];
          if(!qs.length||qs.length!==cs.length)throw new Error('Measurement lists must have the same nonzero length.');
          qs.forEach((q,i)=>{index(q);if(!Number.isInteger(cs[i])||cs[i]<0||cs[i]>=classical)throw new Error('Declare enough classical bits, or use measure_all().');if(measured.has(q)||classicalTargets.has(cs[i]))throw new Error('Measure each qubit into a distinct bit once.');measured.add(q);classicalTargets.add(cs[i]);});
          measuring=true;continue;
        }
        if(measuring)throw new Error('Put all measurements after the gates. Mid-circuit measurement is not supported in this exercise.');
        let op;
        const ordinary=['h','x','y','z','s','sdg','t','tdg'];
        if(ordinary.includes(method)){
          if(args.length!==1)throw new Error(`${method} needs one qubit or a list of qubits.`);
          const qs=Array.isArray(args[0])?args[0]:[args[0]];
          if(!qs.length||new Set(qs).size!==qs.length)throw new Error('Specify distinct qubits.');
          qs.forEach(q=>circuit.columns.push([{gate:method.toUpperCase(),targets:[index(q)]}]));continue;
        }
        if(['rx','ry','rz','p'].includes(method)){if(args.length!==2)throw new Error(`${method} needs an angle and a qubit.`);op={gate:method.toUpperCase(),angle:args[0],targets:[index(args[1])]};}
        else if(['cx','cz','cp','cu1'].includes(method)){
          const phase=method==='cp'||method==='cu1';if(args.length!==(phase?3:2))throw new Error('Controlled gate has the wrong number of arguments.');
          op={gate:phase?'P':method==='cx'?'X':'Z',controls:[index(args[phase?1:0])],targets:[index(args[phase?2:1])],...(phase?{angle:args[0]}:{})};
        } else if(method==='swap'){if(args.length!==2)throw new Error('swap needs two qubits.');op={gate:'SWAP',targets:args.map(index)};}
        else throw new Error(`Unsupported circuit call: ${method}.`);
        circuit.columns.push([op]);Q.validate(circuit);
      }catch(error){throw new Error(`Line ${lineIndex+1}: ${error.message}`);}
    }
    if(!circuit)throw new Error('Initialize a QuantumCircuit first.');
    Q.validate(circuit);return {circuit,measured};
  }
  function assess(id,code) {
    let program;
    try{program=parse(code);}catch(error){return {verified:false,checks:[{label:'Circuit can be interpreted',pass:false,detail:error.message}],message:error.message};}
    const {circuit,measured}=program, state=Q.simulate(circuit), ps=Q.probabilities(state);
    const width=id==='qft'?3:id==='superposition'?1:2;
    const checks=[{label:'Circuit can be interpreted',pass:true,detail:'Recognized gate calls were simulated in order.'},{label:`Uses ${width} qubit${width===1?'':'s'}`,pass:circuit.qubits===width,detail:`Your register has ${circuit.qubits}.`}];
    const measureOK=id==='phase-kickback'?measured.has(0):Array.from({length:width},(_,q)=>q).every(q=>measured.has(q));
    checks.push({label:id==='phase-kickback'?'Measures the control after the gates':'Measures every required qubit after the gates',pass:measureOK,detail:measureOK?'Measurement coverage is complete.':'Add final measurement calls for the required qubits.'});
    if(circuit.qubits!==width)return {verified:false,checks,message:'Correct the register width before checking the quantum state.'};
    let reference,score;
    if(id==='bell-state'){
      reference=Q.simulate(Q.preset('bell'));score=Q.fidelity(state,reference);
      const purity=Q.reduced(state,0).purity;
      checks.push({label:'Creates entanglement between the qubits',pass:Math.abs(purity-.5)<1e-8,detail:`Single-qubit purity is ${purity.toFixed(3)}; a Bell pair has purity 0.500. H alone creates a product state with purity 1.000.`});
      checks.push({label:'Prepares |Φ+⟩ = (|00⟩ + |11⟩)/√2',pass:score>1-1e-8,detail:`Fidelity to the target Bell state: ${(100*score).toFixed(2)}%. Both amplitudes must have the same relative phase.`});
    }else if(id==='superposition'){
      reference=Q.simulate({qubits:1,columns:[[{gate:'H',targets:[0]}]]});score=Q.fidelity(state,reference);
      checks.push({label:'Prepares |+⟩, including the relative phase',pass:score>1-1e-8,detail:`Fidelity to |+⟩: ${(100*score).toFixed(2)}%. Equal probabilities alone do not distinguish |+⟩ from |−⟩.`});
    }else if(id==='phase-kickback'){
      reference=Q.simulate(Q.preset('phase'));score=Q.fidelity(state,reference);
      checks.push({label:'Control ends in |1⟩ and target remains |−⟩',pass:score>1-1e-8,detail:`Fidelity to |−⟩₁|1⟩₀: ${(100*score).toFixed(2)}%. The final H on the control turns the phase into a bit.`});
    }else if(id==='qft'){
      const actualProcess=new Float64Array(128), expectedProcess=new Float64Array(128);
      for(let input=0;input<8;input++){
        const expected=new Float64Array(16);
        for(let out=0;out<8;out++){const phase=2*Math.PI*input*out/8;expected[2*out]=Math.cos(phase)/Math.sqrt(8);expected[2*out+1]=Math.sin(phase)/Math.sqrt(8);}
        const actual=Q.simulate(circuit,{basis:input});
        for(let k=0;k<16;k++){actualProcess[16*input+k]=actual[k]/Math.sqrt(8);expectedProcess[16*input+k]=expected[k]/Math.sqrt(8);}
      }
      score=Q.fidelity(actualProcess,expectedProcess);
      checks.push({label:'Implements the QFT, including phase relations across inputs',pass:score>1-1e-8,detail:`Process fidelity: ${(100*score).toFixed(2)}%. Compared the full eight-input transformation, including relative phases and output ordering.`});
    }else throw new Error('Unknown quantum assessment.');
    const observed=ps.map((p,i)=>p>1e-8?`|${i.toString(2).padStart(width,'0')}⟩ ${(100*p).toFixed(1)}%`:null).filter(Boolean).join(' · ');
    return {verified:checks.every(c=>c.pass),checks,circuit,probabilities:ps,message:`Observed ideal outcomes (${width===1?'q0':`q${width-1}…q0`}): ${observed}`};
  }
  const api={parse,assess,number};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.QuantumAssessment=api;
})(typeof window==='undefined'?globalThis:window);
