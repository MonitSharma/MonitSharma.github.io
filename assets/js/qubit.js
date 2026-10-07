/* Pure Bloch-vector transformations for the classroom's single-qubit explorer. */
(function (root) {
  const initial = () => ({ x: 0, y: 0, z: 1 });
  function apply(state, gate) {
    const { x, y, z } = state;
    if (gate === 'H') return { x: z, y: -y, z: x };
    if (gate === 'X') return { x, y: -y, z: -z };
    if (gate === 'Z') return { x: -x, y: -y, z };
    throw new Error(`Unknown gate: ${gate}`);
  }
  function probabilities(state) {
    const zero = Math.max(0, Math.min(1, (1 + state.z) / 2));
    return { zero, one: 1 - zero };
  }
  const api = { initial, apply, probabilities };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ClassroomQubit = api;
})(typeof window === 'undefined' ? globalThis : window);
