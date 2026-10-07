/* Accessible click-to-place editor; drag-and-drop is an optional shortcut. */
(() => {
  const Q=QuantumEngine, presets={bell:'Bell pair',ghz:'GHZ state',interference:'Phase interference',phase:'Phase kickback',qft:'Three-qubit QFT',empty:'Start blank'};
  const labels={H:'Hadamard',X:'Bit flip',Y:'Pauli Y',Z:'Phase flip',S:'Quarter phase',T:'Eighth phase',RX:'X rotation',RY:'Y rotation',RZ:'Z rotation',CX:'Controlled X',CZ:'Controlled Z',CP:'Controlled phase',SWAP:'Swap',ERASE:'Eraser'};
  const clone=value=>JSON.parse(JSON.stringify(value));
  const ket=(i,n)=>i.toString(2).padStart(n,'0');
  const clean=n=>Math.abs(n)<1e-10?0:n;
  const amplitude=(state,i)=>`${clean(state[2*i]).toFixed(3)} ${state[2*i+1]<-1e-10?'−':'+'} ${Math.abs(clean(state[2*i+1])).toFixed(3)}i`;
  document.querySelectorAll('[data-simulator]').forEach(mount=>{
    const compact=mount.dataset.simulator==='compact';
    let circuit=Q.preset('bell'), selected='H',angle=Math.PI/2,pending=null,steps=circuit.columns.length,counts=null,undo=[],redo=[];
    if(!compact&&location.hash.startsWith('#circuit=')){
      try{const source=decodeURIComponent(location.hash.slice(9));if(source.length>20000)throw new Error('Circuit link is too large.');circuit=clone(Q.validate(JSON.parse(source)));steps=circuit.columns.length;}catch(error){mount.dataset.linkError=error.message;}
    }
    const gateNames=compact?['H','X','Z','CX','ERASE']:['H','X','Y','Z','S','T','RX','RY','RZ','CX','CZ','CP','SWAP','ERASE'];
    mount.innerHTML=`<div class="sim-heading"><div><p class="sim-kicker">${compact?'A real circuit. A live quantum state.':'Circuit workbench'}</p><h2>${compact?'What happens with two qubits?':'Make a small circuit. Explore a big idea.'}</h2></div>${compact?'<span class="sim-live">Live</span>':''}</div>
      <div class="sim-tools"><label><span class="sr-only">Circuit example</span><select data-example><option value="custom" disabled>Your circuit</option>${Object.entries(presets).filter(([id])=>!compact||['bell','empty'].includes(id)).map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></label>${compact?'':`<div class="sim-size"><button type="button" data-less aria-label="Remove a qubit">−</button><span data-qubits></span><button type="button" data-more aria-label="Add a qubit">+</button></div><button type="button" data-undo>Undo</button><button type="button" data-redo>Redo</button>`}<button type="button" data-clear>Clear</button></div>
      <div class="sim-palette" role="group" aria-label="Choose a gate">${gateNames.map(g=>`<button type="button" draggable="true" data-tool="${g}" title="${labels[g]}" aria-label="Select ${labels[g]} gate" aria-pressed="${g==='H'}">${g==='ERASE'?'⌫':g}</button>`).join('')}</div>
      ${compact?'':`<label class="sim-angle">Rotation angle (radians)<input type="number" data-angle value="${angle}" min="-1000" max="1000" step="0.01"><button type="button" data-angle-pi>π/2</button></label>`}
      <p class="sim-instructions" data-instructions>Select a gate, then click a wire slot. For CX, click the control, then the target in the same column.</p>
      <div class="sim-circuit-scroll"><div class="sim-circuit" data-circuit role="group" aria-label="Quantum circuit editor"></div></div>
      ${compact?'':`<div class="sim-step"><label for="sim-step-${mount.id}">Inspect after column <output data-step-label></output></label><input id="sim-step-${mount.id}" data-step type="range" min="0" value="2" max="2"><button type="button" data-column>Add column</button></div>`}
      <div class="sim-qubit-states" data-reduced></div>
      <div class="sim-output-head"><span class="sim-kicker">${compact?'Joint measurement probabilities':'Statevector · ideal probabilities'}</span><span data-order></span></div>
      <div class="sim-probabilities" data-probabilities></div>
      <p class="sim-insight" data-insight aria-live="polite"></p>
      ${compact?'<a class="sim-open" data-open href="simulator.html">Open the full circuit playground <span>↗</span></a>':`<div class="sim-actions"><button type="button" data-sample>Sample 1,024 shots</button><button type="button" data-copy>Copy Qiskit code</button><button type="button" data-share>Copy circuit link</button><a href="practice.html">Try a coding exercise ↗</a></div><p class="sim-message" data-message role="status"></p><details class="sim-code"><summary>Qiskit equivalent</summary><pre data-code></pre></details><p class="sim-limit">Ideal pure-state simulation · 1–6 qubits · H, X, Y, Z, S, T, rotations, controlled gates, and SWAP. The shot sampler reads the joint distribution at the inspected step. It does not insert measurement gates or collapse the state. Inspired by <a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk ↗</a>.</p>`}`;
    const get=selector=>mount.querySelector(selector);
    const message=text=>{if(get('[data-message]'))get('[data-message]').textContent=text;};
    function resetInspection(){steps=circuit.columns.length;counts=null;pending=null;}
    function change(update){undo.push(clone(circuit));if(undo.length>40)undo.shift();redo=[];update();Q.validate(circuit);resetInspection();render();}
    function removeAt(q,col){if(!circuit.columns[col])return;circuit.columns[col]=circuit.columns[col].filter(op=>![...op.targets,...(op.controls||[])].includes(q));}
    function place(q,col){
      if(selected==='ERASE'){change(()=>removeAt(q,col));return;}
      if(['CX','CZ','CP','SWAP'].includes(selected)){
        if(!pending||pending.col!==col){pending={q,col};renderGrid();get('[data-instructions]').textContent=`${selected}: now choose ${selected==='SWAP'?'the other wire':'the target'} in column ${col+1}. Escape cancels.`;return;}
        if(pending.q===q){pending=null;renderGrid();return;}
        const first=pending.q;
        change(()=>{
          while(circuit.columns.length<=col)circuit.columns.push([]);
          removeAt(q,col);removeAt(first,col);
          circuit.columns[col].push(selected==='SWAP'?{gate:'SWAP',targets:[first,q]}:{gate:selected==='CX'?'X':selected==='CZ'?'Z':'P',targets:[q],controls:[first],...(selected==='CP'?{angle}:{})});
        });
      }else change(()=>{while(circuit.columns.length<=col)circuit.columns.push([]);removeAt(q,col);circuit.columns[col].push({gate:selected,targets:[q],...(['RX','RY','RZ'].includes(selected)?{angle}:{})});});
    }
    function renderGrid(){
      const columns=Math.max(compact?5:8,circuit.columns.length),grid=get('[data-circuit]');
      const focused=grid.contains(document.activeElement)?{q:document.activeElement.dataset.q,col:document.activeElement.dataset.col}:null;
      grid.style.setProperty('--sim-cols',columns);
      grid.innerHTML=`<span class="sim-wire-label"></span>${Array.from({length:columns},(_,col)=>`<span class="sim-column-number">${col+1}</span>`).join('')}`;
      for(let q=0;q<circuit.qubits;q++){
        grid.insertAdjacentHTML('beforeend',`<span class="sim-wire-label">q${q} <small>|0⟩</small></span>`);
        for(let col=0;col<columns;col++){
          const ops=circuit.columns[col]||[],op=ops.find(op=>[...op.targets,...(op.controls||[])].includes(q));
          let name='',isControl=false;
          if(op){isControl=op.controls?.includes(q);name=isControl?'●':op.gate==='SWAP'?'×':op.gate;}
          const links=ops.filter(op=>op.controls?.length||op.gate==='SWAP').map(op=>[...op.targets,...(op.controls||[])]);
          const above=links.some(ends=>q>Math.min(...ends)&&q<=Math.max(...ends)),below=links.some(ends=>q>=Math.min(...ends)&&q<Math.max(...ends));
          const cell=document.createElement('button');cell.type='button';cell.className=`sim-slot ${op?'occupied':''} ${isControl?'control':''} ${pending?.q===q&&pending?.col===col?'pending':''} ${above?'link-above':''} ${below?'link-below':''} ${!compact&&col>=steps?'future':''}`;
          cell.dataset.q=q;cell.dataset.col=col;
          cell.setAttribute('aria-label',`Qubit ${q}, column ${col+1}: ${op?(isControl?'control for '+op.gate:op.gate+(op.angle!==undefined?` (${op.angle.toFixed(3)} radians)`:'')):'empty'}. Place ${labels[selected]}.`);
          cell.innerHTML=`<span>${name||'+'}</span>`;
          cell.addEventListener('click',()=>place(q,col));
          cell.addEventListener('dragover',event=>event.preventDefault());
          cell.addEventListener('drop',event=>{event.preventDefault();const tool=event.dataTransfer.getData('text/plain');if(gateNames.includes(tool)){selectTool(tool);place(q,col);}});
          grid.append(cell);
        }
      }
      if(focused?.q!==undefined)grid.querySelector(`[data-q="${focused.q}"][data-col="${focused.col}"]`)?.focus({preventScroll:true});
    }
    function render(){
      renderGrid();
      get('[data-example]').value=Object.keys(presets).find(id=>JSON.stringify(Q.preset(id))===JSON.stringify(circuit))||'custom';
      if(!compact){get('[data-qubits]').textContent=`${circuit.qubits} qubits`;get('[data-less]').disabled=circuit.qubits===1;get('[data-more]').disabled=circuit.qubits===Q.MAX_QUBITS;get('[data-column]').disabled=circuit.columns.length===Q.MAX_COLUMNS;get('[data-undo]').disabled=!undo.length;get('[data-redo]').disabled=!redo.length;get('[data-step]').max=circuit.columns.length;get('[data-step]').value=steps;get('[data-step-label]').textContent=`${steps} / ${circuit.columns.length}`;get('[data-code]').textContent=Q.qiskit(circuit);}
      const state=Q.simulate(circuit,{steps}),ps=Q.probabilities(state);
      get('[data-order]').textContent=circuit.qubits===1?'q0':`q${circuit.qubits-1}…q0`;
      get('[data-probabilities]').innerHTML=(compact?'':'<div class="sim-prob-row sim-prob-header"><span>State</span><span>Probability</span><span></span><span class="sim-amplitude">Amplitude</span><span title="Complex phase wheel">Phase</span><span class="sim-shots">'+(counts?'Samples':'')+'</span></div>')+ps.map((p,i)=>`<div class="sim-prob-row"><span class="sim-ket">|${ket(i,circuit.qubits)}⟩</span><span class="sim-prob-track"><span style="width:${p*100}%"></span></span><span>${(p*100).toFixed(p>0.999||p<1e-10?0:1)}%</span>${compact?'':`<span class="sim-amplitude" title="Complex amplitude">${amplitude(state,i)}</span><span class="sim-phase" title="Phase ${Math.atan2(state[2*i+1],state[2*i]).toFixed(3)} radians" style="opacity:${p>1e-10?1:.2};--phase:${Math.atan2(state[2*i+1],state[2*i])}rad"></span><span class="sim-shots">${counts?counts[i]+' shots':''}</span>`}</div>`).join('');
      const reduced=Array.from({length:circuit.qubits},(_,q)=>Q.reduced(state,q));
      get('[data-reduced]').innerHTML=reduced.map((r,q)=>{
        const x=50+32*(r.x*.85-r.y*.3),y=45-32*(r.z*.9+r.x*.15+r.y*.3);
        return `<div class="sim-reduced-card"><svg viewBox="0 0 100 92" role="img" aria-label="Qubit ${q} Bloch vector; purity ${r.purity.toFixed(3)}"><circle cx="50" cy="45" r="33" class="sim-sphere"/><ellipse cx="50" cy="45" rx="33" ry="10"/><path d="M50 12v66M17 45h66"/><line x1="50" y1="45" x2="${x}" y2="${y}" class="sim-vector"/><circle cx="${x}" cy="${y}" r="3" class="sim-tip"/><text x="44" y="8">|0⟩</text><text x="44" y="90">|1⟩</text></svg><span>q${q} <b>${r.purity<1-1e-8?'Mixed':'Pure'}</b></span>${compact?'':`<small>Purity ${r.purity.toFixed(3)} · entropy ${r.entropy.toFixed(3)} bits</small><small>x ${clean(r.x).toFixed(2)} · y ${clean(r.y).toFixed(2)} · z ${clean(r.z).toFixed(2)}</small>`}</div>`;
      }).join('');
      const entangled=reduced.some(r=>r.purity<1-1e-8);
      get('[data-insight]').textContent=entangled?'The circuit contains entanglement. A short local Bloch vector means a mixed reduced state; the joint state is still pure.':'Each qubit is in a pure state. Compare the amplitudes as well as the probabilities to see phase changes.';
      get('[data-instructions]').textContent='Select a gate, then click a wire slot. For controlled gates, click the control and then the target in the same column. Use the eraser to remove a gate.';
      if(compact)get('[data-open]').href=`simulator.html#circuit=${encodeURIComponent(JSON.stringify(circuit))}`;
    }
    function selectTool(tool){selected=tool;pending=null;mount.querySelectorAll('[data-tool]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tool===tool)));renderGrid();}
    mount.querySelectorAll('[data-tool]').forEach(button=>{button.addEventListener('click',()=>selectTool(button.dataset.tool));button.addEventListener('dragstart',event=>event.dataTransfer.setData('text/plain',button.dataset.tool));});
    get('[data-example]').addEventListener('change',event=>{change(()=>{circuit=Q.preset(event.target.value);});});
    get('[data-clear]').addEventListener('click',()=>change(()=>{circuit.columns=[];}));
    mount.addEventListener('keydown',event=>{if(event.key==='Escape'){pending=null;renderGrid();}});
    if(!compact){
      get('[data-angle]').addEventListener('change',event=>{const value=Number(event.target.value);if(!Number.isFinite(value)||Math.abs(value)>1000){event.target.value=angle;message('Use a finite angle between −1000 and 1000 radians.');}else angle=value;});
      get('[data-angle-pi]').addEventListener('click',()=>{angle=Math.PI/2;get('[data-angle]').value=angle;});
      get('[data-more]').addEventListener('click',()=>change(()=>circuit.qubits++));
      get('[data-less]').addEventListener('click',()=>change(()=>{const removed=--circuit.qubits;circuit.columns=circuit.columns.map(col=>col.filter(op=>![...op.targets,...(op.controls||[])].includes(removed)));}));
      get('[data-column]').addEventListener('click',()=>change(()=>circuit.columns.push([])));
      get('[data-undo]').addEventListener('click',()=>{redo.push(clone(circuit));circuit=undo.pop();resetInspection();render();});
      get('[data-redo]').addEventListener('click',()=>{undo.push(clone(circuit));circuit=redo.pop();resetInspection();render();});
      get('[data-step]').addEventListener('input',event=>{steps=Number(event.target.value);counts=null;render();});
      get('[data-sample]').addEventListener('click',()=>{counts=Q.sample(Q.simulate(circuit,{steps}),1024);render();message('Sampled 1,024 joint outcomes. Finite-shot counts fluctuate around the exact probabilities.');});
      get('[data-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(Q.qiskit(circuit));message('Qiskit code copied.');}catch(_){message('Clipboard unavailable. Select the code in “Qiskit equivalent” below.');}});
      get('[data-share]').addEventListener('click',async()=>{const url=new URL(location.href);url.hash=`circuit=${encodeURIComponent(JSON.stringify(circuit))}`;history.replaceState(null,'',url);try{await navigator.clipboard.writeText(url.href);message('Circuit link copied.');}catch(_){message('The circuit is saved in the address bar. Copy that URL to share.');}});
      if(mount.dataset.linkError)message(`Could not load circuit link: ${mount.dataset.linkError} Showing a Bell pair instead.`);
    }
    render();
  });
})();
