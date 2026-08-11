---
title: "Quantum Optimization on Real Hardware: What 247 Experiments on IBM Heron
  Revealed"
slug: quantum-optimization-on-real-hardware
date: 2026-08-10
status: published
series: Quantum Hardware
series_order: 1
excerpt: "Migrated from Medium: Quantum Optimization on Real Hardware: What 247
  Experiments on IBM Heron Revealed"
tags:
  - quantum computing
  - quantum hardware
  - quantum optimization
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/quantum-optimization-on-real-hardware/
medium_url: https://medium.com/@_monitsharma/quantum-optimization-on-real-hardware-what-247-experiments-on-ibm-heron-revealed-49c6f53a7cc9?source=rss-f5df08a10024------2
draft: false
---

#### Why qubit count and simulator performance are not enough — and what VQE, QAOA, PCE and QRAO look like after compilation, hardware noise and classical recovery.

![](https://cdn-images-1.medium.com/max/1024/1*B9W-1s4kMCZOIBGw5RerAA.png)

_From abstract quantum circuits to hardware-native execution: compilation, connectivity and noise can materially reshape a quantum optimization algorithm._

Our paper, **“**[**From Circuits to Hardware: Benchmarking Standard and Qubit-Efficient Quantum Optimization on Real Hardware**](https://arxiv.org/abs/2607.11637)View on alphaXiv**,”** has been accepted for publication in [_Quantum Science and Technology_](https://iopscience.iop.org/article/10.1088/2058-9565/ae94a4).

The study began with a simple concern: quantum optimization algorithms are often assessed before the most consequential parts of real execution have occurred.

A method may use fewer qubits than another method. It may perform well in a simulator. Its circuit may appear shallow before compilation. Yet none of these facts alone establishes how the method will behave on a real quantum processor.

Before execution, a circuit must be mapped to a physical device. Nonlocal interactions must be routed through the processor’s connectivity graph. Gates must be decomposed into the device’s native basis. Two-qubit operations accumulate error. Finite-shot measurements produce uncertain estimates. Finally, measured outputs must be converted back into valid solutions to the original optimization problem.

The object that matters is therefore not merely a quantum algorithm. It is the complete chain:

> **_problem formulation → encoding → optimization → compilation → hardware execution → classical recovery_**

Our goal was to benchmark that complete chain.

### A broader quantum optimization benchmark

The study evaluates seven quantum optimization methods:

-   [Variational Quantum Eigensolver, or VQE](https://www.nature.com/articles/ncomms5213);
-   [Conditional Value-at-Risk VQE](https://quantum-journal.org/papers/q-2020-04-20-256/);
-   [standard QAOA](https://arxiv.org/abs/1411.4028)View on alphaXivView on alphaXiv;
-   multi-angle QAOA;
-   warm-start QAOA;
-   [Pauli Correlation Encoding, or PCE](https://arxiv.org/abs/2401.09421)View on alphaXivView on alphaXiv; and
-   [Quantum Random Access Optimization, or QRAO](https://arxiv.org/abs/2111.03167)View on alphaXivView on alphaXiv.

These methods span conventional variational algorithms, structured QAOA-style methods and qubit-efficient encodings.

We tested them across four structurally different NP-hard optimization problems:

-   the [Multi-Dimensional Knapsack Problem](https://link.springer.com/chapter/10.1007/978-3-540-24777-7_9);
-   [Maximum Independent Set](https://perso.limos.fr/~palafour/PAPERS/PDF/Garey-Johnson79.pdf);
-   [the Quadratic Assignment Problem](https://www.econometricsociety.org/publications/econometrica/1957/01/01/assignment-problems-and-location-economic-activities); and
-   [the Market Share Problem](https://dl.acm.org/doi/10.5555/2700758.2700763).

In total, the benchmark covers **247 method–instance combinations** on IBM Heron r1/r2 processors, together with shot-based simulator references, backend-resolved compilation records, feasibility checks, classical comparisons and hardware-execution diagnostics.

To our knowledge, the study includes the first real-hardware results on the multi-problem instances.

The aim was not to identify one universally superior method. Different optimization problems create different circuit structures, coefficient scales, feasible spaces and recovery challenges. A meaningful benchmark must therefore examine how methods behave across multiple problem regimes.

![](https://cdn-images-1.medium.com/max/1024/1*5n3tF05zMfHKfPzWxx_MeQ.png)

Figure 7 from the paper: the fraction of feasible hardware outcomes varies sharply across both problem classes and method families. MDKP remains broadly feasible, MIS exhibits a feasibility cliff, and no reported QAP hardware run returns a feasible solution.

### Why simulator performance is only part of the story

Simulation remains essential for quantum algorithm development. It allows researchers to test circuit construction, optimization behaviour and sampling strategies without device noise or queueing.

But simulation does not reproduce the full cost of hardware execution.

A circuit that looks manageable at the algorithmic level may become substantially larger after it is mapped to a real processor. Sparse hardware connectivity can require additional routing. Native-gate decomposition can increase circuit depth. The resulting circuit may experience far greater cumulative two-qubit-gate error than its original description suggests.

This distinction was especially visible in our QAOA-family audit.

For 12 representative circuits covering QAOA, multi-angle QAOA and warm-start QAOA across all four problem families, post-transpilation two-qubit-gate counts were between **4.47 and 6.24 times** their algorithm-level values.

For the representative QAP case, the median QAOA-family circuit grew from approximately 14,310 algorithm-level two-qubit gates to 79,027 transpiled two-qubit gates. For the representative MSP case, the corresponding count grew from 6,300 to 39,227.

These are not minor implementation changes. Two-qubit gates are a major source of accumulated error on current superconducting quantum processors.

![](https://cdn-images-1.medium.com/max/1024/1*2C0pqp70_BDb2xTFwSogLQ.png)

Figure 4 from the paper: every representative QAOA-family circuit experiences substantial growth in two-qubit-gate count after backend-aware transpilation.

The practical lesson is straightforward:

> _The circuit designed by the algorithm is not necessarily the circuit executed by the hardware._

Quantum optimization studies should therefore report both algorithm-level and post-transpilation resources. Qubit count and abstract depth alone do not describe the device-native execution burden.

The Quadratic Assignment Problem produced the clearest negative result in the benchmark.

QAP assigns facilities to locations while minimizing a cost determined by flows between facilities and distances between locations. In the direct formulation used in our study, an nn-facility problem requires n2n2 binary variables.

There are 2^n^2 possible binary strings, but only n!n! of them describe valid permutations.

![](https://cdn-images-1.medium.com/max/1024/1*RymM_2UIOPaH5ugM2dp67g.png)

To place these numbers in context, we compared QAP with a same-width binary model that requires only the correct Hamming weight. Full row-and-column permutation consistency makes the QAP feasible space an additional 6.68 and 8.34 orders of magnitude smaller at widths 100 and 144, respectively.

This extremely sparse feasible manifold is only one part of the difficulty. The direct QAP encoding also produces dense flow–distance interactions, row-and-column one-hot penalties, high interaction degrees and broad coefficient ranges.

No reported QAP hardware run returned a feasible assignment.

In simulation, PCE recovered feasible candidates on several QAP instances, although with large optimality gaps. VQE and CVaR-VQE remained infeasible on the tested QAP instances even in the simulator.

The distinction matters. QAP’s hardware failure cannot be reduced to a claim that the circuit simply used too many qubits. It arose from the interaction of restrictive feasibility geometry, dense couplings, coefficient scaling, compilation overhead, hardware noise and sensitivity in the recovery process.

![](https://cdn-images-1.medium.com/max/1024/1*ROHNtQkEuxORp84_Z9SF6w.png)

Figure 3 from the paper: PCE recovers feasible QAP candidates in simulation for several tested instances, while the reported hardware executions remain infeasible.

Negative results of this kind are scientifically useful. They identify where current end-to-end pipelines fail and clarify what future methods must improve.

### Estimating a hardware fidelity budget

To connect transpiled circuit size with hardware behaviour, we introduced an independent-error gate-count fidelity proxy:

![](https://cdn-images-1.medium.com/max/392/1*fdhOpa0HLQ-l0iFTo1Q9dA.png)

where N\_{2Q}​ is the transpiled two-qubit-gate count and ϵ\_{2Q}​ is a representative two-qubit-gate error rate.

This quantity is not a measured circuit fidelity. It does not capture coherent errors, crosstalk, readout effects, single-qubit errors or calibration drift. It is a diagnostic approximation of cumulative exposure to two-qubit-gate error.

Within the tested MDKP and MIS regimes, the hardware data showed an empirical operating point near:

![](https://cdn-images-1.medium.com/max/228/1*aj5wtBbWSpXaNgStZau84w.png)

At the median Heron-r2 CZ error rate used in the study, this corresponds to approximately **770 two-qubit gates**.

Beyond this region, the benchmark increasingly entered a noise-dominated execution regime. This does not make F\_est=0.1 a universal threshold. The value will change with the processor, calibration state, circuit structure, measurement budget and recovery procedure.

Its value is methodological: it gives practitioners an explicit way to relate compiled circuit burden to the hardware regime in which the method is being evaluated.

![](https://cdn-images-1.medium.com/max/1024/1*w5VHrmycbnnXqsjlytmDKQ.png)

Figure 6 from the paper: feasible MDKP and MIS outcomes plotted against the gate-count fidelity proxy, separating deeply noise-dominated and higher-fidelity execution regimes.

A quantum optimization method should not be labelled hardware-efficient solely because it uses fewer circuit wires. Its compiled two-qubit-gate burden must also remain within a regime in which useful structure survives execution.

### Testing low-fidelity QAOA against a random baseline

A very small fidelity proxy does not, by itself, prove that a hardware output distribution is uniform.

To investigate the practical meaning of the deeply compiled QAOA-family results, we constructed a matched uniform-random control for 106 low-fidelity hardware runs.

The control matched the relevant decision-space dimension, candidate budget, trajectory-level selection procedure, tie-breaking rule and shared one-round local-improvement stage.

Among the feasible runs with finite matched random-quality distributions, most hardware outcomes fell within the random range or performed worse than the random baseline. One warm-start-QAOA MIS run produced a feasible candidate while none of its 300 matched random replicates did; we retained this result as a finite-sample exception.

The interpretation must remain narrow.

The result does not prove that every low-fidelity QAOA output was uniformly random. Nor does it show that QAOA as an algorithmic framework is incapable of performing well.

It shows that the **tested implementations**, after compilation at the reported problem scales, predominantly operated in a regime compatible with best-of-budget random candidate selection.

Alternative mixers, parameter schedules, problem encodings, routing strategies and future processors may produce different outcomes.

### Qubit-efficient encoding: access versus solution quality

PCE and QRAO materially reduced circuit width.

For some instances, this compression changed whether a problem could be mapped to available hardware at all. Qubit-efficient encoding is therefore valuable as an access-enabling resource reduction.

But width reduction did not consistently improve recovered solution quality.

The MSP results provide the strongest example. PCE and QRAO compressed the tested instances to approximately 7–11 qubits, compared with 48–156 qubits for the direct formulations. Yet the compressed methods generally produced larger target deviations than the best full-width methods.

A compressed quantum representation can transfer difficulty into other parts of the pipeline:

-   measured correlators may be noisy;
-   rounding may be sensitive;
-   reconstruction can amplify small estimation errors;
-   the compressed circuit may still incur compilation overhead; and
-   classical recovery may dominate final quality.

![](https://cdn-images-1.medium.com/max/1024/1*oQvEQtREr3Tndynr2aoA5w.png)

Figure 8 from the paper: lower algorithm-level qubit count does not consistently correspond to better recovered hardware solution quality.

The relevant question is therefore not:

> _How many qubits does the method save?_

It is:

> _Does the compression remain useful after compilation, execution, decoding and feasibility recovery?_

This distinction matters because qubit count is often the most visible resource metric in quantum optimization. It is important, but incomplete.

### What the benchmark does not claim

The paper does not claim practical quantum advantage.

Strong classical solvers remain superior for the tested instance sizes. The purpose of the study is to characterize the current quantum execution pipeline and establish a reproducible baseline against which future algorithms and hardware can be compared.

The study also does not establish a seed-averaged statistical ranking of all seven methods.

Each headline method–instance result comes from the documented fixed-budget protocol rather than an exhaustive multi-start optimization. A reduced sensitivity analysis showed that initialization could materially alter some decoded outcomes. In one warm-start-QAOA example, gaps ranged from 8.33% to 50.00% across three seeds.

Consequently, fine-grained differences between individual solution-quality values should not be interpreted as formal evidence of statistical superiority.

The conclusions supported most strongly by the study are the repeated structural and execution-level patterns:

-   transpilation can multiply two-qubit-gate burden;
-   QAP’s direct encoding creates an exceptionally sparse feasible manifold;
-   the tested QAOA-family circuits frequently entered deeply noise-dominated regimes;
-   matched random controls are necessary for interpreting low-fidelity outcomes;
-   qubit compression alone does not predict recovered quality; and
-   hardware performance depends jointly on the problem, encoding, optimizer, compilation and recovery procedure.

### Toward better quantum optimization benchmarks

Quantum optimization is often discussed as a competition between algorithms: VQE versus QAOA, standard encoding versus compression, or simulation versus hardware.

Our results suggest that this framing is too narrow.

The appropriate unit of analysis is a **problem–method–hardware system**.

The same algorithm can behave differently across sparse graph problems, dense assignment problems, packing problems and target-balancing problems. The same circuit can acquire a radically different execution cost after transpilation. The same width reduction can help one problem while degrading recovery on another.

Future benchmarks should therefore report more than the best objective value. At minimum, a hardware-facing quantum optimization study should document:

-   original-problem feasibility;
-   algorithm-level circuit width;
-   transpiled circuit depth;
-   transpiled two-qubit-gate count;
-   backend and calibration context;
-   mitigation and final-sampling settings;
-   classical decoding and recovery procedures;
-   suitable classical or random controls; and
-   sensitivity to initialization where solution quality is being compared.

![](https://cdn-images-1.medium.com/max/1024/1*aZy0pXa2H1fjsVtpZeEKuQ.png)

Figure 5 from the paper: backend-native circuit complexity, feasibility and recovered hardware quality must be interpreted together.

As quantum processors improve, the numerical boundaries observed in this study will move. Better connectivity, lower two-qubit-gate error and more effective compilation will allow deeper circuits to preserve useful signal.

The evaluation framework should remain relevant.

Progress should not be measured only by whether an algorithm can be expressed as a quantum circuit. It should be measured by whether its intended advantage survives the complete journey from formulation to a valid solution returned by real hardware.

### Paper and code

**Paper:** [https://iopscience.iop.org/article/10.1088/2058-9565/ae94a4](https://iopscience.iop.org/article/10.1088/2058-9565/ae94a4)
**Preprint:** [https://arxiv.org/abs/2607.11637](https://arxiv.org/abs/2607.11637)
**Open-source code and benchmark artifacts:** [https://github.com/SMU-Quantum/quantum-optimization-benchmarks](https://github.com/SMU-Quantum/quantum-optimization-benchmarks)
