const test=require('node:test'),assert=require('node:assert/strict');
const Q=require('../assets/js/quantum-engine');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('Bell pair has correlated outcomes and maximally mixed local states',()=>{
  const s=Q.simulate(Q.preset('bell')),p=Q.probabilities(s);near(p[0],.5);near(p[3],.5);near(p[1],0);near(p[2],0);
  for(let q=0;q<2;q++){const r=Q.reduced(s,q);near(r.purity,.5);near(r.entropy,1);near(r.x,0);near(r.y,0);near(r.z,0);}
});
test('H without CX is not entangled',()=>{
  const s=Q.simulate({qubits:2,columns:[[{gate:'H',targets:[0]}]]});near(Q.reduced(s,0).purity,1);near(Q.probabilities(s)[1],.5);
});
test('phase interference, kickback, and GHZ outcomes',()=>{
  near(Q.probabilities(Q.simulate(Q.preset('interference')))[1],1);
  const phase=Q.simulate(Q.preset('phase'));near(Q.reduced(phase,0).one,1);near(Q.reduced(phase,1).x,-1);
  const ghz=Q.probabilities(Q.simulate(Q.preset('ghz')));near(ghz[0],.5);near(ghz[7],.5);
});
test('rotation gates and SWAP preserve norm and signs',()=>{
  for(const gate of Q.singleGates){const s=Q.simulate({qubits:1,columns:[[{gate,targets:[0],...(['RX','RY','RZ','P'].includes(gate)?{angle:.37}:{})}]]});near(Q.probabilities(s).reduce((a,b)=>a+b),1);}
  const s=Q.simulate({qubits:2,columns:[[{gate:'X',targets:[0]}],[{gate:'SWAP',targets:[0,1]}]]});near(Q.probabilities(s)[2],1);
  const r=Q.reduced(Q.simulate({qubits:1,columns:[[{gate:'H',targets:[0]}],[{gate:'S',targets:[0]}]]}),0);near(r.y,1);
});
test('QFT agrees with the positive-sign DFT on every input',()=>{
  for(let input=0;input<8;input++){const s=Q.simulate(Q.preset('qft'),{basis:input});for(let out=0;out<8;out++){near(s[2*out],Math.cos(2*Math.PI*input*out/8)/Math.sqrt(8));near(s[2*out+1],Math.sin(2*Math.PI*input*out/8)/Math.sqrt(8));}}
});
test('step zero is the initial state and stepping H removes Bell correlations',()=>{
  near(Q.probabilities(Q.simulate(Q.preset('bell'),{steps:0}))[0],1);
  near(Q.reduced(Q.simulate(Q.preset('bell'),{steps:1}),0).purity,1);
});
test('shot samples preserve correlations',()=>{
  let k=0;const counts=Q.sample(Q.simulate(Q.preset('bell')),100,()=>(k+++.5)/100);assert.deepEqual(counts,[50,0,0,50]);
});
test('invalid links and circuit overlaps fail explicitly',()=>{
  assert.throws(()=>Q.validate({qubits:7,columns:[]}));assert.throws(()=>Q.validate({qubits:2,columns:[[{gate:'X',targets:[1],controls:[1]}]]}));
  assert.throws(()=>Q.validate({qubits:1,columns:[[{gate:'RX',targets:[0],angle:Infinity}]]}));
  assert.throws(()=>Q.validate({qubits:2,columns:[[{gate:'H',targets:[1],controls:[0]}]]}));
  assert.throws(()=>Q.validate({qubits:1,columns:[[{gate:'RX',targets:[0]}]]}));
  assert.throws(()=>Q.validate({qubits:1,columns:[[{gate:'H',targets:[0],angle:1}]]}));
});
