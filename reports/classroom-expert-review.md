# Quantum Classroom: independent product and teaching review

Reviewed 8 October 2026 against the local classroom, practice lab, and new circuit playground.

The visual identity is coherent. The strongest next investment is a structured learning experience connecting explanation, experiment, and code. A learner should know what they are investigating, make a prediction, change the circuit, and explain the result before moving on.

## Improvements implemented in this iteration

- An original browser statevector simulator, inspired by [Quirk](https://github.com/Strilanc/Quirk), with 1–6 qubits, 24 columns, controlled gates, rotations, SWAP, presets, undo/redo, circuit links, and Qiskit export.
- Both joint probabilities and complex amplitudes. Reduced Bloch vectors, purity, and entropy show why an entangled pair can have mixed local states while its joint state remains pure. The 1,024-shot sampler samples joint outcomes rather than each qubit independently.
- Quantum grading based on simulated states and measurement coverage. The Bell exercise rejects H without CX, wrong phase, undone entanglement, and misplaced measurements. Equivalent state preparations pass. QFT checks the entire eight-input transformation, including relative phases across inputs.
- Actual Python execution and input/output tests, including empty inputs, negatives, duplicate values, incorrect nesting, and diagonal island connectivity. Execution happens in a fresh worker and stops after two seconds.
- CUDA labeled as structural review, with no false verification or completion credit. Editing an answer invalidates its previous verification. Old drafts survive migration, while old keyword-based completion marks do not.
- Keyboard placement, responsive circuit scrolling, phase/amplitude labels, and lazy loading of optional source catalogs.

## Recommended next work, in priority order

| Priority | Improvement | Why it matters | Concrete first version |
| --- | --- | --- | --- |
| 1 | Guided experiment missions | Free exploration alone can leave beginners changing gates without understanding the result. | Three short missions: distinguish superposition from entanglement, reveal a relative phase with H, and predict Bell measurement correlations. Ask for a prediction before revealing the state; finish with a conceptual question. |
| 2 | A continuous path from visual circuits to code | The simulator and code lab currently require the learner to move their circuit manually. | “Continue in code” should transfer the circuit and task into a practice draft, preserve existing work, and connect failed checks back to the relevant visual state. Add a code-to-circuit preview for supported syntax. |
| 3 | Curate the beginner curriculum | Large source inventories communicate breadth, but are not the number of browser-graded exercises. Difficulty and prerequisites need to be explicit. | A six-lesson starting path with time estimates, prerequisite concepts, one worked example, one experiment, and one assessment per lesson. Label source-library counts separately from available exercises. Put QFT after phase and bit-order lessons. |
| 4 | Add measurement collapse and simple noise demonstrations | Ideal statevectors cannot explain classical mixtures, noisy devices, or intermediate measurement. | An explicit measurement action with seeded/replayable outcomes, then density-matrix examples comparing Bell entanglement with a classical 00/11 mixture. Clearly distinguish exact probabilities from finite-shot results. |
| 5 | Add execution infrastructure only where needed | CUDA structural hints cannot establish correct results, safe bounds, or synchronization. Arbitrary Qiskit programs also exceed the bounded reader. | Use an isolated, resource-limited backend for GPU compilation and numeric cases, and a pinned Qiskit environment for advanced exercises. Publish the verification method and avoid treating these practice checks as exam-grade security. |

## Scope and verification limits

- This is a small classroom simulator, not the complete Quirk feature set. No mid-circuit collapse, classical control, noise model, custom gate matrices, or hardware execution is included.
- The quantum code lab reads a documented subset of straight-line Qiskit-style calls. It does not execute arbitrary Python or import the real Qiskit package. Unsupported syntax fails with a diagnostic rather than receiving credit.
- State-preparation exercises verify the requested final state and final measurement. They accept physically equivalent preparations; they do not prove the learner used every operation described in a suggested derivation. QFT is verified as a transformation, rather than only on its default input.
- Python uses pinned [Pyodide in a Web Worker](https://pyodide.org/en/0.27.7/usage/webworker.html). The first run needs internet access to download it. Tests verify the tested behavior, not algorithmic complexity or every possible input. These are formative practice checks, not a secure adversarial examination environment.
- Circuit sharing encodes the circuit in the URL. A link copied from the local preview points to localhost; cross-device sharing needs the deployed classroom URL.
- CUDA remains a review tool until compilation and execution are available.

## Verification evidence

32 automated tests pass: statevector mathematics, full QFT agreement with the positive-sign DFT, grader regressions, Python grading against actual CPython functions, and existing writing/build checks.

Browser checks confirmed: missing-CX Bell rejection in both check and verification modes; valid Python acceptance; hardcoded-answer rejection; worker timeout recovery; running-maximum edge cases; CUDA review labels; Bell editing and undo; GHZ correlated shot sampling; column stepping; circuit-link reload; and responsive layouts. Test drafts were restored after verification.

The visual direction should remain consistent with the portfolio. Prioritize readable explanations and reliable feedback over adding decorative motion or more dashboard widgets.
