const test=require('node:test'),assert=require('node:assert/strict');
const A=require('../assets/js/quantum-assessment'),Q=require('../assets/js/quantum-engine');
const code=body=>`from qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\n${body}`;
test('screenshot regression: H plus measurement fails Bell assessment',()=>{
  const r=A.assess('bell-state',code('qc.h(0)\nqc.measure_all()'));assert.equal(r.verified,false);assert.ok(r.checks.some(c=>c.label.includes('entanglement')&&!c.pass));
});
test('comments, string literals, wrong variables, and malformed statements cannot pass',()=>{
  for(const body of ['# qc.h(0)\n# qc.cx(0,1)\nqc.measure_all()', '"qc.h(0); qc.cx(0,1)"\nqc.measure_all()','fake.h(0)\nfake.cx(0,1)\nqc.measure_all()','qc.h(0)\nqc.cx(0,1)\nnonsense\nqc.measure_all()'])assert.equal(A.assess('bell-state',code(body)).verified,false);
});
test('correct and physically equivalent Bell circuits pass',()=>{
  for(const body of ['qc.h(0)\nqc.cx(0,1)\nqc.measure_all()','qc.h(1)\nqc.cx(1,0)\nqc.measure_all()'])assert.equal(A.assess('bell-state',code(body)).verified,true);
  assert.equal(A.assess('bell-state','from qiskit import QuantumCircuit\nother = QuantumCircuit(2,2)\nother.h(0)\nother.cx(0,1)\nother.measure([0,1],[0,1])').verified,true);
});
test('missing, premature, duplicate, and incomplete measurements fail',()=>{
  for(const body of ['qc.h(0)\nqc.cx(0,1)','qc.measure_all()\nqc.h(0)\nqc.cx(0,1)','qc.h(0)\nqc.cx(0,1)\nqc.measure_all()\nqc.measure_all()','qc.h(0)\nqc.cx(0,1)\nqc.measure(0,0)'])assert.equal(A.assess('bell-state',code(body)).verified,false);
});
test('undoing entanglement and wrong relative phases fail despite gate keywords',()=>{
  for(const body of ['qc.h(0)\nqc.cx(0,1)\nqc.cx(0,1)\nqc.measure_all()','qc.cx(0,1)\nqc.h(0)\nqc.measure_all()','qc.h(0)\nqc.cx(0,1)\nqc.z(0)\nqc.measure_all()'])assert.equal(A.assess('bell-state',code(body)).verified,false);
});
test('all quantum presets round-trip through exported Qiskit and pass their assessments',()=>{
  for(const [preset,id] of [['bell','bell-state'],['qft','qft'],['phase','phase-kickback']])assert.equal(A.assess(id,Q.qiskit(Q.preset(preset))).verified,true);
});
test('QFT rejects H-only uniform output and phase errors across inputs',()=>{
  const wrong='from qiskit import QuantumCircuit\nqc=QuantumCircuit(3)\nqc.h(0)\nqc.h(1)\nqc.h(2)\nqc.measure_all()';assert.equal(A.assess('qft',wrong).verified,false);
  const qft=Q.preset('qft');qft.columns.unshift([{gate:'Z',targets:[0]}]);assert.equal(A.assess('qft',Q.qiskit(qft)).verified,false);
});
test('equal probabilities with the wrong phase fail |+> preparation',()=>{
  const s='from qiskit import QuantumCircuit\nqc=QuantumCircuit(1)\nqc.h(0)\nqc.z(0)\nqc.measure_all()';assert.equal(A.assess('superposition',s).verified,false);assert.equal(A.assess('superposition',s.replace('qc.z(0)\n','')).verified,true);
});
test('numeric expression reader accepts pi arithmetic and rejects injected code',()=>{
  assert.equal(A.number('pi / 2'),Math.PI/2);assert.equal(A.number('-math.pi/4'),-Math.PI/4);assert.throws(()=>A.number('alert(1)'));assert.throws(()=>A.number('1/0'));
});
