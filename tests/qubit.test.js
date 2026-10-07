const test = require('node:test');
const assert = require('node:assert/strict');
const qubit = require('../assets/js/qubit');

test('Hadamard creates equal probabilities and is its own inverse', () => {
  const plus = qubit.apply(qubit.initial(), 'H');
  assert.deepEqual(qubit.probabilities(plus), { zero: .5, one: .5 });
  assert.deepEqual(qubit.apply(plus, 'H'), qubit.initial());
});
test('X flips the computational basis; Z changes phase, not probabilities', () => {
  assert.deepEqual(qubit.probabilities(qubit.apply(qubit.initial(), 'X')), { zero: 0, one: 1 });
  const plus = qubit.apply(qubit.initial(), 'H');
  const minus = qubit.apply(plus, 'Z');
  assert.equal(minus.x, -1);
  assert.deepEqual(qubit.probabilities(minus), qubit.probabilities(plus));
  assert.deepEqual(qubit.probabilities(qubit.apply(minus, 'H')), { zero: 0, one: 1 });
});
test('gate sequences preserve a normalized pure state and total probability', () => {
  let state = qubit.initial();
  for (const gate of ['H', 'Z', 'H', 'X', 'H', 'X', 'Z', 'H']) {
    state = qubit.apply(state, gate);
    assert.equal(state.x ** 2 + state.y ** 2 + state.z ** 2, 1);
    const p = qubit.probabilities(state);
    assert.equal(p.zero + p.one, 1);
  }
});
