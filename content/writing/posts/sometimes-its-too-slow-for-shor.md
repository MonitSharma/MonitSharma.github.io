---
title: Sometimes It’s Too Slow… for Shor!!
slug: sometimes-its-too-slow-for-shor
date: 2026-03-07
status: published
series: Quantum Factoring
series_order: 1
excerpt: "Factoring Numbers on a 133/156-Qubit Quantum Computer: A Deep Dive
  into Shor’s Algorithm on Quantum Hardware"
tags:
  - quantum factoring
  - Shor's algorithm
  - quantum hardware
  - IBM Quantum
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/sometimes-its-too-slow-for-shor/
medium_url: https://medium.com/@_monitsharma/sometimes-its-too-slow-for-shor-c01677032324
draft: false
---

#### Factoring Numbers on a 133/156-Qubit Quantum Computer: A Deep Dive into Shor’s Algorithm on Quantum Hardware

> **A comprehensive guide to implementing Shor’s factoring algorithm on IBM’s latest quantum hardware — covering the theory, the engineering decisions, the code, and the honest limits of what’s actually possible today.**

![](https://cdn-images-1.medium.com/max/1024/1*boBydVXa2LefrnxglEIRig.jpeg)

### Introduction

In 1994, mathematician Peter Shor published what would become one of the most consequential algorithms in computer science: a method for factoring integers in polynomial time on a quantum computer. The implications were staggering — RSA encryption, the backbone of internet security, relies on the assumption that factoring large numbers is computationally intractable. Shor’s algorithm showed that this assumption holds only so long as large-scale quantum computers don’t exist.

Three decades later, IBM’s 156-qubit Heron processors represent the cutting edge of publicly accessible quantum hardware. I set out to write a complete, working implementation of Shor’s algorithm targeting these machines, and to answer a deceptively simple question: _what is the biggest number a 156-qubit quantum computer can actually factor?_

The answer, as we’ll see, involves a tension between theoretical qubit capacity and the brutal realities of quantum noise. This post walks through every step: how Shor’s algorithm works, the engineering decisions behind the code, what the academic literature says about the state of the art, and where the limits really are.

### How Shor’s Algorithm Works

Shor’s algorithm elegantly reduces the problem of integer factoring to a problem quantum computers are naturally good at: **finding the period of a function.**

**The Classical Reduction**

Given a composite odd number N that the we want to factor, the algorithm proceeds as follows:

1.  **Pick a random integer** a where _1 < a < N_.
2.  **Compute _gcd(a,N)_** using the classical Euclidean algorithm. If the result is greater than _1_, you’ve found a factor (lucky shortcut).
3.  **Find the order r**, the smallest positive integer such that _a^r_ **_≡_** _1(mod N)_. This is the hard step classically, but efficient on a quantum computer.
4.  **If r is even**, and _a^(r/2) !≡ -1(mod N)_, then at least one of _gcd(a^(r/2) -1 , N)_ and _gcd(a^(r/2) + 1, N)_ will be a non-trivial factor of _N_ with high probability.

The hard part classically is finding the order _r_. Shor’s quantum speedup comes from the fact that order finding can be reformulated as a **phase estimation** problem for the modular multiplication unitary.

![](https://cdn-images-1.medium.com/max/1024/1*ervQTu1LeN_tvChTDBWmKw.png)

Quantum Phase Estimation extracts a phase related to _r_, and classical post-processing recovers the order.

**The Quantum Part: Phase Estimation**

The quantum part of Shor’s algorithm uses **phase estimation** to solve the order-finding problem.

For a chosen integer _a_ coprime to _N_, define the unitary operator

![](https://cdn-images-1.medium.com/max/1024/1*UX2A0s4MC6f-_DqIUN9bVA.png)

Because multiplication by _a mod N_ permutes the integers modulo _N_, this transformation is reversible and therefore unitary. The key fact is that the eigenvalues of _U\_a_​ are of the form

![](https://cdn-images-1.medium.com/max/1024/1*23r_PY08oV0iPxlm11DNMw.png)

where _r_ is the order of _a(mod N)_ and _s∈{0,1,…,r−1}_.

Shor’s algorithm uses **Quantum Phase Estimation (QPE)** to estimate one of these phases:

-   A counting register is prepared in an equal superposition using Hadamard gates.
-   A work register is initialized to _∣1⟩_, which can be expressed as a superposition of eigenstates of _U\_a_​.
-   Controlled powers _U\_a^{2k}​_ are applied, which imprint phase information onto the counting register.
-   The inverse Quantum Fourier Transform is applied to the counting register.
-   Measuring the counting register gives an integer _m_, such that the ratio

![](https://cdn-images-1.medium.com/max/1024/1*S6_4JO-KLg5fWEwVQOyEFA.png)

is a good approximation to

![](https://cdn-images-1.medium.com/max/1024/1*u4pOtfo-6KDNzR-SqtczDw.png)

A classical **continued fractions** procedure is then used to recover a candidate denominator from this approximation. If the recovered value does not yield the correct order, the algorithm is repeated.

At a high level, this gives Shor’s algorithm polynomial-time complexity in the number of bits of _N_, in dramatic contrast to the best known classical factoring algorithms, such as the General Number Field Sieve, which run in sub-exponential time.

### Why It Matters for Cryptography

RSA encryption typically uses 2048-bit or 4096-bit keys. [Gidney and Ekera](https://quantum-journal.org/papers/q-2021-04-15-433/) estimated in 2021 that factoring a 2048-bit RSA integer would require approximately 20 million noisy qubits running for about 8 hours. In a remarkable follow-up published in May 2025, [Gidney alone reduced this estimate to under a million noisy qubits](https://arxiv.org/abs/2505.15917), though the runtime increased to roughly a week. I[n a more recent paper by Webster et.al. , they further reduced the estimate to 100,000 physical qubits](https://arxiv.org/abs/2602.11457).

We are still orders of magnitude away from this capability. IBM’s entire deployed fleet of quantum systems totals well under 10,000 qubits but the trajectory of improvement is what motivates the ongoing transition to post-quantum cryptography.

![](https://cdn-images-1.medium.com/max/1024/1*3updJiRNwwafF7c6FQF22w.png)

#### The Hardware

### IBM’s 133-Qubit Heron r1

For the _N=15_ and _N=21_ experiments, I ran the circuits on **ibm\_torino**, a system built on IBM’s 133-qubit Heron r1 processor.

On paper, that sounds almost absurdly powerful for a toy factoring experiment. Shor’s algorithm for _15_ is supposed to be the baby example — the kind of thing people use to explain the algorithm, not stress-test one of IBM’s best machines. But that is exactly the point. In real hardware, the problem is not whether the device has _enough qubits_. The problem is whether it can survive the **depth, routing, and two-qubit error accumulation** created by modular arithmetic once the circuit is transpiled to actual hardware connectivity.

**That is where Heron matters.**

IBM introduced Heron r1 in late 2023 as the first processor in its new Heron family: 133 fixed-frequency superconducting qubits connected with tunable couplers. IBM presented it as a major step beyond the earlier Eagle generation, emphasizing better overall performance, lower cross-talk, and a shift away from the old race of “just add more qubits.” In other words, Heron was built to improve the quality of quantum computation, not just the headline qubit count.

And for a Shor experiment, that is exactly the hardware regime you want to probe.

Factoring circuits are nasty little monsters. They are not impressed by marketing numbers. They care about whether controlled modular multiplication can be compiled into a circuit that still has some coherent signal left by the time measurement happens. A processor can have more than a hundred qubits and still fail miserably if the transpiled circuit becomes too deep or if the two-qubit gates are not clean enough. Heron r1 is interesting precisely because it pushes that boundary farther than earlier superconducting chips, but not nearly far enough to make textbook period-finding easy.

IBM’s public system listings identify _ibm\_torino_ as a 133-qubit Heron r1 machine, with platform-level throughput metrics like CLOPS reported around _290K_. That makes it one of the most capable public superconducting systems available for this kind of experiment. But even here, the basic lesson is brutal: having a state-of-the-art chip does not magically make Shor practical. It just lets you see the limits more clearly.

That is why this hardware matters in the story. Heron r1 is not a weak device. It is one of the strongest public devices available. If even this machine struggles to produce clean period-finding structure for tiny composites, then the bottleneck is not hype, not bad luck, and not sloppy implementation. The bottleneck is the current reality of quantum hardware itself.

### IBM’s 156-Qubit Heron Processor

The IBM Quantum Heron processor, first unveiled at the IBM Quantum Summit in December 2023, is IBM’s highest-performance quantum processor, available to the public. The original version (r1) featured 133 qubits. In November 2024, IBM released the Heron r2 with 156 qubits in a heavy-hexagonal lattice topology with tunable couplers.

**Key Specifications**

The Heron r2 achieves a median two-qubit (CZ) gate error rate of approximately 3 × 10⁻³, which is roughly 10 times better than the previous generation 127-qubit Eagle processors. Its speed, measured in Circuit Layers Operations Per Second (CLOPS) reached 250,000, another 10x improvement. IBM has states that the Heron r2 can reliably execute quantum circuits with up to 5,000 two-qubit gate operations.

**Available Backends**

As of early 2026, the 156 qubit Heron processors are accessible through several IBM backends including `ibm_fez`, `ibm_marrakesh`, `ibm_pittsburgh`, `ibm_boston`, `ibm_miami`, and `ibm_kingston`. The 133-qubit Heron r1 is available through `ibm_torino`. In July 2025, IBM released the Heron r3 revision with further manufacturing improvements impacting coherence, gate fidelity, and readout performance.

### The Qubit Budget: How Big a Number Can We Factor?

This is where theory meets reality, and where most online discussions of Shor’s algorithm on real hardware get it wrong.

**Theoretical Maximum (Qubit Count Only)**

There are three main circuit architectures for Shor’s algorithm, each with a different qubit requirements for factoring an _n_\-bit number N:

![](https://cdn-images-1.medium.com/max/1024/1*K3zLp6fENdhdpOHW03H19w.png)

[The **Beauregard Circuit** is the standard reference, published in 2002](https://arxiv.org/abs/quant-ph/0205095). It performs all modular arithmetic in Fourier space, using phase rotations instead of explicit binary adders, achieving the factoring of an n-bit integer with only 2n+3 qubits. This means 156 qubits could theoretically handle numbers up to 76 bits ,roughly 7.5 ×10 ²².

The iterative QPE approach (also called the semiclassical QFT) uses Kitaev’s technique of recycling a single controlled qubit with mid circuit measurement and classical feed-forward, reducing the requirement to just n+1 qubits. This would push the theoretic limit to 155-bit numbers on 156 qubits. However, it requires dynamic circuits with classical control flow, which adds complexity in real hardware.

### The Real Bottleneck: Circuit Depth

Qubit count is only half the story. The other critical constraint is circuit depth — specifically, the number of two-qubit gates the circuit requires. Every two-qubit gate introduces error, and errors compound multiplicatively. On the IBM Heron r2 processor, with a median CZ gate error rate of approximately 0.3%, the probability that an entire circuit executes without any gate error is roughly (0.997)^g, where g is the total two-qubit gate count. This survival probability collapses exponentially.

The Heron r2 can reliably execute circuits with up to roughly 5,000 two-qubit gates. Beyond that threshold, noise overwhelms the signal and the hardware output becomes indistinguishable from uniform random noise.

Here is what that means in practice. The table below shows the measured and extrapolated two-qubit gate counts for factoring semiprimes of increasing size using the standard textbook QPE approach with precomputed permutation oracles:

![](https://cdn-images-1.medium.com/max/1024/1*GZldfPqyAXDER2g7kaR9hw.png)

The gate counts for N = 15, 21, and 35 are measured from actual hardware submissions after transpilation to the ISA gate set. The estimates for larger N are extrapolated from the observed scaling: each additional work qubit multiplies the gate count by roughly 4–5×, consistent with the exponential cost of decomposing larger permutation unitaries into native two-qubit gates.

Three things to notice:

First, N = 15 is the only semiprime whose circuit fits within the hardware reliability window, and even there the 11.3% survival probability means roughly 9 out of 10 shots are corrupted by at least one gate error. This is why our N = 15 run showed only marginal quantum signal.

Second, the gate counts grow exponentially with the number of work qubits, not with N itself. All 8-bit semiprimes (143, 221, 247, 253) require approximately the same number of gates (~2.5 million), because they all need 8 work qubits. The specific value of N matters only insofar as it determines the multiplier values, which affect how efficiently the transpiler can decompose each controlled-U gate.

Third, N = 221 — cited in several recent publications as the frontier of quantum factoring — requires an estimated 2.5 million two-qubit gates: 500 times the Heron r2’s reliability limit. No amount of error mitigation, qubit selection, or transpiler optimization can rescue a circuit that is 500× too deep. If those publications report successful factoring of N = 221 on similar hardware, the result is coming from the classical post-processing, not from quantum period-finding.

The honest answer: **N = 15 is the largest number that current quantum hardware can factor with genuine quantum contribution**, under the standard textbook QPE approach with permutation oracles.

In these runs, under this textbook-QPE-with-permutation-oracles setup and these metrics, N=15 is the only case showing even marginal non-random enrichment without visible period structure.

This statement comes with the caveat that N = 15 uses a hand-optimized SWAP-based oracle that is available only because of the special binary structure of 15, and that even the N = 15 result shows only marginal quantum signal (1.88× enrichment over random baseline, no visible period structure in the histogram). For N ≥ 21, the hardware output is noise.

### What the Literature Says: A History of Experimental Factoring

**The Pioneering Demonstration: N = 15 (2001)**

The first experimental implementation of Shor’s algorithm was performed at the IBM Almaden Research Center by Vandersypen, Steffen, Breyta, Yannoni, Sherwood, and Chuang. [Published in _Nature_ in December 2001](https://www.nature.com/articles/414883a), they factored 15 = 3 × 5 using a seven-qubit liquid-state nuclear magnetic resonance (NMR) quantum computer. The circuit was realized with approximately 300 spin selective radio frequency pulses. While NMR quantum computers were not a scalable path forward, the experiment was a landmark proof of principle.

**Photonic and Trapped-Ion Demonstrations (2007–2016)**

After the IBM NMR result, several groups demonstrated compiled versions of Shor’s algorithm on photonic platforms. [Lanyon et al. (2007)](https://www.scribd.com/document/932312927/Lanyon-Et-Al-2007-Experimental-Demonstration-of-Shor-s-Algorithm-Wit) and [Lu et al. (2007)](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.99.250504) independently used photonic qubits to factor 15, with important caveats: both used compiled circuits that leveraged prior knowledge of the answer. [In 2012, Martín-López et al.](https://arxiv.org/abs/1111.4147) demonstrated qubit recycling — an iterative approach using only a single photonic qubit that was measured and reused. That same year, [Lucero et al. factored 15](https://arxiv.org/abs/1202.5707) using a Josephson phase qubit.

A significant milestone came in 2016, when [Monz et al. demonstrated a scalable implementation of Shor’s algorithm](https://arxiv.org/abs/1507.08852) using trapped-ion qubits, also factoring 15 but with a circuit architecture designed to generalize to larger numbers.

**N = 21 on IBM Processors (2021)**

[Skosana and Tame published a proof-of-concept demonstration in Scientific Reports (2021) factoring 21 = 3× 7 on IBM quantum processors using only five qubits](https://www.nature.com/articles/s41598-021-95973-w). Their approach used a compiled version of the quantum phase estimation routine with approximate Toffoli gates that preserved functional correctness. They also verified entanglement between the control and work register qubits, a necessary condition for the algorithm’s quantum speedup.

**N = 91 on 127-Qubit Eagle (2025)**

[Saxena, Saini and Kushwaha implemented Shor’s algorithm to factor 91 = 7 × 13 on IBM’s 127-qubit Eagle](https://www.researchgate.net/publication/397062455_Quantum_Threat_to_Cryptographic_Security_Implementation_and_Analysis_of_Shor's_Algorithm_for_Integer_Factorization_Using_IBM_Qiskit) platform using three approaches: real quantum hardware, a noise-free simulator, and a simulated noisy device. Their results, published as part of the ICTIS 2025 conference proceedings, highlight the stark contrast between ideal and noisy execution — noise-free simulations succeeded readily while real hardware results were significantly degraded by decoherence.

**N = 221 on IBM Qiskit (2025)**

The most ambitious published claim I found is by [Ghugare, Rajoba, and Saini, presented at the ISBM 2025 conference](https://www.scilit.com/publications/86b6375be27cfb992a171323e8122db0) and published by Springer. They implemented Shor’s algorithm to factor 221 = 13 × 17 using IBM’s quantum resources and the Qiskit framework. The paper examines success probability and performance limitations on noisy hardware, representing what appears to be the current practical frontier for Shor’s algorithm on IBM systems.

**Important Caveats**

A critical observation, noted by multiple researchers: nearly all experimental demonstrations of Shor’s algorithm on real hardware use **compiled circuits** that are optimized using prior knowledge of the answer. The modular exponentiation operator, the most expensive part of the circuit, is typically implemented as a pre-computed permutation matrix rather than a generic arithmetic circuit. This means the “quantum” computation is partly doing classical work in disguise.

> A fully generic, scalable implementation of Shor’s algorithm that doesn’t use any prior knowledge of the factors remains an open challenge for the NISQ hardware. The noise levels are simply too high for the deep circuits that generic modular arithmetic requires.

#### The Implementation

### Code Architecture

The implementation is split into four modules, each handling one stage of the pipeline. This section walks through the engineering decisions and, more importantly, what those decisions reveal about the gap between textbook Shor and real hardware.

### The Oracle: Modular Multiplication (`modexp.py`)

The quantum heart of Shor’s algorithm is the modular exponentiation operator: given integers a and N, build a unitary that maps |_x⟩ → |a·x mod N⟩_. In a textbook presentation, this operator is constructed from reversible adders and modular arithmetic circuits. In practice, on NISQ hardware, nobody does that.

Many toy-scale demonstrations, including mine, of Shor’s algorithm on real hardware, from Vandersypen’s 2001 NMR experiment factoring 15 to the recent claims of factoring 221, use what amounts to a lookup table: compute the permutation that _a·x mod N_ induces on the computational basis states, build the corresponding permutation matrix, and hand it to the transpiler as a UnitaryGate. My implementation does the same.

This is the right engineering choice and also the most important caveat. The oracle is a classically precomputed permutation matrix. We know the full multiplication table of a modulo _N_ before we ever touch the quantum hardware. The quantum computer’s job is to find the period of this permutation using phase estimation. The oracle construction itself does not use any quantum advantage.

For _N = 15_ specifically, I implemented hand-optimized SWAP-based circuits (the `_build_mod15_rotation_gate` path) that exploit the fact that multiplication by 2, 4, and 8 modulo 15 are just cyclic bit rotations. These produce much shallower circuits than decomposing a 16×16 unitary gate. For all other _N_, the code falls back to the exact permutation matrix, which the transpiler then decomposes into native gates. This decomposition is where gate counts explode.

The key numbers: a permutation gate on n qubits produces a _2ⁿ × 2ⁿ_ dense complex matrix. For _n = 4 (N = 15),_ that is a 16×16 matrix: 4 KiB. For _n = 8 (N = 221)_, it is 256×256: 1 MiB. For _n = 10 (N = 1007)_, it is 1024×1024: 16 MiB. Each of these then needs to be controlled on a counting qubit, doubling the matrix dimension. Memory is not the bottleneck for the sizes we care about, but transpilation cost is. Decomposing a controlled 256×256 unitary into native CX + single-qubit gates produces tens of thousands of two-qubit gates.

### Phase Estimation (`qpe.py`)

The QPE circuit follows the textbook structure:

1.  Initialize the work register to |1⟩ by flipping work\[0\]. Qiskit uses little-endian bit ordering, so work\[0\] is the least-significant bit.
2.  Apply Hadamard gates to all counting qubits.
3.  For each counting qubit _j = 0, 1, …, t−1,_ apply a controlled-_U^(2^j)_ operation, where U is the modular multiplication gate. The multiplier for each controlled gate is _a^(2^j) mod N_, which is computed classically.
4.  Apply the inverse QFT to the counting register, without final swaps.

The no-swap inverse QFT is a deliberate choice. The textbook QFT includes swap gates at the end to reverse the qubit ordering, but these swaps add unnecessary depth. Instead, the measurement results may come out in reversed bit order. The post-processing layer handles this by testing both interpretations of each bitstring.

A practical optimization: the code caches controlled oracle gates by their effective multiplier. If two different exponent indices produce the same value of _a^(2^j) mod N_, the same gate object is reused. For bases with small multiplicative orders, this avoids redundant unitary decompositions.

### Post-Processing (`postprocess.py`)

This is where the subtlety lives, and where honest reporting requires the most care.

Given a measurement outcome _y_ from the _t_\-bit counting register, the textbook procedure is: compute the phase estimate _y/2^t_, apply the continued-fraction algorithm to find a rational approximation _p/q_ with small denominator, and test whether _q_ (or a divisor of _q_) is the multiplicative order of a modulo _N_.

My implementation adds one standard improvement and applies two layers of strictness.

The improvement: after recovering candidate denominators from continued fractions, test small multiples _kq_ for _k = 2, 3, 4_. This handles the case where QPE returned a phase _s/r_ with _gcd(s, r) > 1_. In that situation, the continued-fraction denominator is _r/gcd(s,r)_ rather than the true order _r_. Testing a few small multiples often recovers the true order. This is a legitimate algorithmic improvement described in the standard references.

The strictness: only convergents that satisfy the QPE approximation bound _|y/2^t − p/q| < 1/(2·2^t)_ are promoted to candidate denominators. This prevents the multiples expansion from turning every convergent into a fishing expedition. Without this filter, the pipeline becomes so permissive that it can extract factors from random bitstrings, which defeats the purpose of running a quantum computer.

Even with these controls, the post-processing is powerful. For small _N_ with small multiplicative orders, the false-positive rate (the probability that a uniformly random bitstring yields valid factors through the strict pipeline) can be significant. For _N = 15_ with _a = 7_, the strict-layer false-positive rate is about 5.8%. For _N = 35_ with _a = 4_, it drops to about 1.1%. Reporting these baselines is essential for interpreting the hardware results.

### Runtime and Error Mitigation (`runtime.py`)

The hardware execution layer manages IBM credential rotation, backend selection, and two forms of error mitigation:

Dynamical decoupling (DD) inserts compensating pulse sequences during idle periods in the circuit. I use the _XpXm_ sequence, which is effective against low-frequency noise. This is free in the sense that it does not add to the circuit’s logical depth.

Gate and measurement twirling randomize the noise channel so that errors are more uniform and predictable. This does not reduce the total error rate but makes the errors easier to characterize and mitigate.

Both are enabled by default through the Qiskit Runtime SamplerV2 options. They are standard best practice for any hardware execution on IBM systems and do not constitute “cheating” in any meaningful sense.

What I did not implement: full measurement error mitigation (M3/TREX), zero-noise extrapolation, or probabilistic error cancellation. These would improve the signal for shallow circuits but cannot rescue circuits that are fundamentally too deep for the hardware.

### Experimental scope and setup

These hardware results are not an exhaustive sweep over Shor’s algorithm. For each tested composite _N_, I chose one coprime base _an_ and ran the corresponding circuit with 1024 shots. So the goal here is not to prove an absolute best-case or worst-case performance for each N (that will come later), but to measure what a realistic, representative Shor run looks like on current hardware.

That caveat matters. The order-finding subroutine depends on the chosen base, and some bases are more forgiving than others. A larger study would sweep across many valid _a_ values and compare their output distributions. This post does not do that. It asks a narrower question: when you build a complete Shor pipeline, transpile it to real hardware, and run representative instances honestly, what survives?

#### The Hardware Results

### What Counts as Success?

Before presenting any results, I need to define what “success” means. This turns out to be the most important part of the entire analysis, because the choice of success metric can make the same experiment look like a triumph or a failure.

Previous Shor implementations, including all the published demonstrations I surveyed, typically report success if at least one bitstring among the most frequently observed outcomes yields valid factors through classical post-processing. I call this **_factor\_found\_in\_histogram_**: scan the top-k most common measurement outcomes, try continued-fraction postprocessing on each, and report success if any of them work.

The problem with this metric is that it conflates “the quantum hardware produced useful output” with “the classical post-processing is powerful enough to find factors in noisy data.” For small N, the post-processing pipeline has a significant false-positive rate. If you scan 20 bitstrings and each one has a ~5% chance of yielding factors even under uniform random input, the probability of at least one success is 1 − (0.95)²⁰ ≈ 64%. You would “succeed” most of the time even without a quantum computer.

I report three metrics instead:

**Top-1 success:** Does the single most frequently observed bitstring yield valid factors through strict (quality-filtered, bounded-multiples) postprocessing? This is the strongest individual-outcome test. If the quantum computer is producing meaningful output, the most common measurement should be near an ideal QPE peak, and that peak should resolve to a useful phase.

**Per-shot factor yield vs. null baseline:** What fraction of all 1,024 shots individually yield valid factors? Compare this against the false-positive rate of the same postprocessing pipeline applied to uniformly random bitstrings. If the hardware yield significantly exceeds the random baseline, the hardware distribution is genuinely enriched.

**Ideal-peak overlap:** Classically compute the true order _r_ of _a modulo N_, then calculate where the ideal QPE peaks should appear: _y ≈ s · 2^t / r_ for _s = 0, 1, …, r−1_. Measure how much of the observed shot mass falls near these predicted peak locations, compared to what uniform noise would produce. This directly tests whether the hardware output reflects the correct period, which is the entire point of the quantum computation.

These three metrics answer increasingly demanding questions: did the post-processing find factors? Is the hardware output better than random? Does the hardware output actually show the right period?

### The Runs

I executed Shor’s algorithm on IBM Quantum hardware for three semiprimes: N = 15 (the classic benchmark), N = 21, and N = 35.

#### N = 15 (a = 7): 727 Two-Qubit Gates on ibm\_torino

This is the only run where the circuit is plausibly within the hardware’s reliability window. With 727 two-qubit gates on the 133-qubit Heron r1 processor, the expected survival probability is roughly (1 − 0.003)⁷²⁷ ≈ 11%. That is low but nonzero: we might see some signal mixed with a lot of noise.

The results confirm this. The strict per-shot factor yield is 10.8%, compared to a strict null baseline of 5.8%. The hardware yield is 1.88 times the random baseline: a real but modest enrichment. The quantum hardware is producing an output distribution that is somewhat better than random noise at generating factor-yielding bitstrings.

However, the top-1 bitstring (the single most common outcome, observed 12 times out of 1024) does not yield factors under strict postprocessing. With 253 unique outcomes across 1024 shots, the distribution is broadly spread. And the ideal-peak overlap analysis shows that the fraction of shot mass near the theoretical QPE peak locations equals the uniform-noise expectation exactly: 4.7% observed versus 4.7% expected. The hardware output does not show visible period structure.

The honest summary: at 727 gates, some quantum signal survives. It manifests as a modest enrichment in the fraction of factor-yielding bitstrings (1.88x above random) but not as recognizable period structure in the histogram. The circuit is too noisy to produce clean QPE peaks, but not so noisy that the output is perfectly random.

#### N = 21 (a = 19): 23,054 Two-Qubit Gates on ibm\_torino

This circuit is roughly 4.6 times beyond the Heron processor’s reliable gate limit. The expected survival probability is (1 − 0.003)²³⁰⁵⁴ — a number so small it rounds to zero.

The factor yield data confirms this. The strict yield is 4.0% against a 2.2% baseline, giving a 1.82x ratio. The ideal-peak enrichment is 1.0x: the mass near peaks matches the uniform expectation exactly. The histogram is indistinguishable from noise.

Yet under the old scanning metric without quality filtering, this run ‘succeeds.’ The most common bitstring (observed 6 times out of 1024) itself yields factors through the unfiltered continued-fraction pipeline, because the convergent denominator 6 happens to be the true order, even though the approximation error is 5× above the strict quality threshold. This illustrates exactly why the quality filter matters: without it, numerically coincidental convergents get promoted into valid-looking results.

#### N = 35 (a = 4): 116,706 Two-Qubit Gates on ibm\_fez

This circuit has 116,706 two-qubit gates — roughly 23 times the hardware’s reliability limit. It was submitted primarily to establish the baseline behavior of a completely noise-dominated circuit.

The strict yield is 2.9% against a 1.1% baseline, giving a 2.6x ratio. This is the highest ratio among the three runs, which might seem surprising. But with only 1024 shots across 4096 possible outcomes, the statistical uncertainty is large. The ideal-peak enrichment is 1.56x, slightly above uniform but well within what noise fluctuations can produce.

The exploratory-layer analysis reveals the real story: with unbounded continued-fraction expansion, every single shot (100%) yields valid factors, and the random baseline is also 100%. When the post-processing net is wide enough, it catches everything. The “success” is entirely classical.

#### The Two-Layer Picture

The most instructive result of this experiment is not any individual factoring claim. It is the contrast between the strict and exploratory postprocessing layers.

The strict layer (quality-filtered convergents, bounded multiples k ≤ 4) produces factor yields that are modestly above the random baseline for all three runs. The enrichment ratios range from 1.82x to 2.61x. These numbers are real, but they do not constitute compelling evidence of quantum period-finding. They are consistent with a small amount of residual quantum signal mixed into a predominantly noise-dominated distribution.

![](https://cdn-images-1.medium.com/max/1024/1*hn03wv9R8rZaW2Cg9g4l9A.png)

The exploratory layer (all convergents, unbounded multiples) produces a 100% factor yield for all three runs and a 100% random baseline. This dramatically illustrates the danger of over-aggressive postprocessing: when the classical recovery pipeline is powerful enough, it can extract factors from literally any input. The quantum computer becomes irrelevant.

This two-layer comparison is the honest answer to the question every Shor demonstration must face: **did the quantum hardware contribute anything that the classical postprocessing could not have done on its own?**

For N = 15 at 727 gates: marginally yes. For N = 21 and N = 35: no.

![](https://cdn-images-1.medium.com/max/1024/1*v08-oUiCr86lstRuM0f1_A.png)

#### What the Histograms Actually Look Like

The ideal-peak overlay plots (included below) are perhaps the most revealing figures in this analysis. Each plot shows the observed measurement histogram with the theoretical QPE peak positions marked as vertical red lines.

![](https://cdn-images-1.medium.com/max/1024/1*4v5CJ-wv9DTD7Tcoe_S1tQ.png)

For a working quantum phase estimation, you would expect to see clear spikes at these red-line positions, with most of the probability mass concentrated near them. Instead, for all three runs, you see a distribution that is broadly flat. For N = 15, there is some non-uniformity in the distribution, but it does not align with the ideal peak positions. For N = 21 and N = 35, the histogram is nearly perfectly uniform — the hallmark of a completely decohered circuit.

![](https://cdn-images-1.medium.com/max/1024/1*RudR6GEM_mVcviOwlmpITA.png)

This is what noise looks like. The ideal QPE circuit would produce a handful of tall, narrow peaks. What the hardware produces is a near-flat distribution spread across all 2^t outcomes. The classical postprocessing then sifts through this flat distribution and finds bitstrings that happen to be close to useful phases, not because the quantum hardware directed probability there, but because the continued-fraction algorithm is remarkably good at extracting structure from arbitrary rational approximations.

![](https://cdn-images-1.medium.com/max/1024/1*n8WEf1CiuhKDqvlfdOEXiA.png)

#### Revisiting Previous Claims

These results raise uncomfortable questions about previously published factoring claims.

When Ghugare et al. report factoring N = 221 on IBM hardware, or when Saxena et al. report N = 91, what success metric did they use? If they used top-k histogram scanning with aggressive continued-fraction postprocessing (which the methodology sections of both papers suggest), then the same questions apply: what is the false-positive rate? What does the histogram actually look like compared to ideal peaks? Is the factor yield meaningfully above the random baseline?

I do not know the answers. But based on the circuit-depth analysis, factoring N=91 would require roughly 550,000 two-qubit gates after transpilation — 110 times the hardware’s reliability limit. For N=221, the estimate rises to 2.5 million gates. For any claim involving N≥91, I would want to see a clean ideal-peak overlay before taking ‘quantum period-finding’ seriously.

This is not a criticism of those researchers’ work. It is an observation about the field’s reporting standards. When the classical postprocessing pipeline has a significant false-positive rate, “found factors” and “the quantum computer found factors” are different claims. Distinguishing them requires the kind of null-baseline and peak-overlap analysis described here.

#### The Honest Answer

The biggest number that current quantum hardware can factor with genuine quantum contribution is, at most, N = 15. Even for N = 15, the evidence is marginal: a 1.88x enrichment in factor yield over the random baseline, with no visible period structure in the histogram.

Numbers larger than 15 can be “factored” in the sense that classical postprocessing of noisy quantum output can recover factors. But the same postprocessing would recover factors from random input at a comparable rate. The quantum hardware is not doing the work.

This is a disappointing answer if you were hoping for a dramatic factoring demonstration. But it is the scientifically honest one. And the picture it paints — of a technology that produces genuine but fragile quantum signal at very shallow circuit depths, rapidly overwhelmed by noise as circuits get deeper — is exactly what the NISQ era looks like from the inside.

So in the end, the title is not just a joke. **Sometimes it’s too slow… for Shor**. The mathematics is elegant, the algorithm is revolutionary, and the cryptographic stakes are enormous, but the hardware is not there yet.

Running this experiment on IBM’s Heron processors did not reveal a machine ready to threaten RSA. It revealed something more grounded and, in its own way, more important: where the edge actually is. Today, that edge sits uncomfortably close to N = 15. At 727 two-qubit gates, there is a faint quantum signal — a 1.88× enrichment in factor yield over random noise. At 23,000 gates, the signal is gone. The algorithm works. The physics works. The engineering is not there yet.

But this experiment also revealed something about the field itself. The metrics we use to evaluate quantum factoring are not keeping pace with the hardware claims being made. A top-20 histogram scan with aggressive continued-fraction expansion can “find factors” in pure noise. An unbounded multiples expansion can turn every bitstring into a success. These are not quantum results , they are classical artifacts dressed in quantum clothing. Until the community adopts honest baselines, peak-overlap analysis, and two-layer reporting as standard practice, every published claim of “**factoring N on a quantum computer**” deserves a raised eyebrow and a request for the raw histogram.

> Shor’s algorithm changed the future the moment it was discovered. But in the present, the future is still arriving one noisy gate at a time.

This post is the first in a series. The next installment applies the metrics developed here to every published experimental Shor result — from Vandersypen’s 2001 NMR factoring of 15 to the recent claims of 91 and 221 on IBM hardware, and the adiabatic “stunt” factorizations that have been inflating the field’s headline numbers for a decade. If those experiments cannot survive a null-baseline comparison and a peak-overlap test, the largest number genuinely factored by quantum period-finding may be even smaller than you think.

I’ve made the full implementation public, including the circuit construction, sweep runner, postprocessing pipeline, and analysis scripts: [Github Link Here](https://github.com/MonitSharma/medium_articles/tree/main/sometimes-too-slow-for-shor)

### Citation

If this code or analysis framework is useful in your work, please cite it as:

Monit Sharma. Sometimes It’s Too Slow… for Shor: Factoring Numbers on IBM Quantum Hardware with Honest Metrics.  
GitHub repository, 2026.  
\[[https://github.com/MonitSharma/medium\_articles/tree/main/sometimes-too-slow-for-shor](https://github.com/MonitSharma/medium_articles/tree/main/sometimes-too-slow-for-shor)\]

You can also use the following BibTeX entry:

```
@misc{sharma2026shorhonestmetrics,
 author = {Monit Sharma},
 title = {Sometimes It's Too Slow… for Shor: Factoring Numbers on IBM Quantum Hardware with Honest Metrics},
 year = {2026},
 howpublished = {\url{https://github.com/MonitSharma/medium_articles/tree/main/sometimes-too-slow-for-shor}},
 note = {GitHub repository}
```

#### References

#### Foundational Algorithm

1.  **Shor, P. W.** (1994). “Algorithms for quantum computation: discrete logarithms and factoring.” _Proceedings 35th Annual Symposium on Foundations of Computer Science_, pp. 124–134. Journal version: _SIAM Journal on Computing_, 26(5), 1484–1509 (1997). [arXiv:quant-ph/9508027](https://arxiv.org/abs/quant-ph/9508027)

#### Circuit Constructions

1.  **Beauregard, S.** (2003). “Circuit for Shor’s algorithm using 2n+3 qubits.” _Quantum Information and Computation_, 3(2), 175–185. [arXiv:quant-ph/0205095](https://arxiv.org/abs/quant-ph/0205095)
2.  **Vedral, V., Barenco, A., and Ekert, A.** (1996). “Quantum networks for elementary arithmetic operations.” _Physical Review A_, 54(1), 147–153. [arXiv:quant-ph/9511018](https://arxiv.org/abs/quant-ph/9511018)
3.  **Häner, T., Roetteler, M., and Svore, K. M.** (2017). “Factoring using 2n+2 qubits with Toffoli based modular multiplication.” _Quantum Information and Computation_, 17(7–8), 673–684. [arXiv:1611.07995](https://arxiv.org/abs/1611.07995)
4.  **Draper, T.** (2000). “Addition on a quantum computer.” [arXiv:quant-ph/0008033](https://arxiv.org/abs/quant-ph/0008033)
5.  **Kitaev, A. Yu.** (1995). “Quantum measurements and the Abelian Stabilizer Problem.” [arXiv:quant-ph/9511026](https://arxiv.org/abs/quant-ph/9511026)

#### Experimental Demonstrations

1.  **Vandersypen, L. M. K., Steffen, M., Breyta, G., Yannoni, C. S., Sherwood, M. H., and Chuang, I. L.** (2001). “Experimental realization of Shor’s quantum factoring algorithm using nuclear magnetic resonance.” _Nature_, 414, 883–887. [DOI:10.1038/414883a](https://doi.org/10.1038/414883a)
2.  **Skosana, U. and Tame, M.** (2021). “Demonstration of Shor’s factoring algorithm for N = 21 on IBM quantum processors.” _Scientific Reports_, 11, 16599. [DOI:10.1038/s41598–021–95973-w](https://doi.org/10.1038/s41598-021-95973-w)
3.  **Monz, T., et al.** (2016). “Realization of a scalable Shor algorithm.” _Science_, 351(6277), 1068–1070. [DOI:10.1126/science.aad9480](https://doi.org/10.1126/science.aad9480)
4.  **Martín-López, E., et al.** (2012). “Experimental realization of Shor’s quantum factoring algorithm using qubit recycling.” _Nature Photonics_, 6, 773–776.
5.  **Ghugare, A., Rajoba, A., and Saini, D. K.** (2026). “Breaking Integer Factorization Using Shor’s Algorithm: A Practical Approach with IBM Qiskit.” In: _Information Systems for Intelligent Systems. ISBM 2025_. Smart Innovation, Systems and Technologies, vol 467. Springer, Cham. [DOI:10.1007/978–3–032–12983–3\_3](https://doi.org/10.1007/978-3-032-12983-3_3)
6.  **Saxena, A., Saini, D. K., and Kushwaha, S. S.** (2026). “Quantum Threat to Cryptographic Security: Implementation and Analysis of Shor’s Algorithm for Integer Factorization Using IBM Qiskit.” In: _ICT for Intelligent Systems. ICTIS 2025_. Lecture Notes in Networks and Systems, vol 1519. Springer, Singapore. [DOI:10.1007/978–981–96–8901–9\_5](https://doi.org/10.1007/978-981-96-8901-9_5)

#### Resource Estimation for RSA

1.  **Gidney, C. and Ekerå, M.** (2021). “How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits.” _Quantum_, 5, 433. [DOI:10.22331/q-2021–04–15–433](https://doi.org/10.22331/q-2021-04-15-433). [arXiv:1905.09749](https://arxiv.org/abs/1905.09749)
2.  **Gidney, C.** (2025). “How to factor 2048 bit RSA integers with less than a million noisy qubits.” [arXiv:2505.15917](https://arxiv.org/abs/2505.15917)

#### IBM Hardware

1.  **IBM Quantum** (2024). “Processor types.” IBM Quantum Documentation. [https://quantum.cloud.ibm.com/docs/en/guides/processor-types](https://quantum.cloud.ibm.com/docs/en/guides/processor-types)
2.  **IBM Quantum** (2025). “Shor’s algorithm tutorial.” IBM Quantum Documentation. [https://quantum.cloud.ibm.com/docs/en/tutorials/shors-algorithm](https://quantum.cloud.ibm.com/docs/en/tutorials/shors-algorithm)
3.  **IBM and RIKEN** (2025). “IBM and RIKEN Unveil First IBM Quantum System Two Outside of the U.S.” IBM Newsroom, June 23, 2025. [https://newsroom.ibm.com/2025-06-23](https://newsroom.ibm.com/2025-06-23-ibm-and-riken-unveil-first-ibm-quantum-system-two-outside-of-the-u-s)

#### Software and Implementations

1.  **Assel, B.** (2025). “qiskit-shor: Full implementation of Shor factoring algorithm with Qiskit.” GitHub. [https://github.com/benjamin-assel/qiskit-shor](https://github.com/benjamin-assel/qiskit-shor). Accompanying blog post: “Where Are We with Shor’s Algorithm?” _Towards Data Science_, July 2025.
2.  **Sun, D., Zhang, N., and Franchetti, F.** (2023). “Optimization and Performance Analysis of Shor’s Algorithm in Qiskit.” _2023 IEEE High Performance Extreme Computing Conference (HPEC)_, pp. 1–7. [DOI:10.1109/HPEC58863.2023.10363522](https://doi.org/10.1109/HPEC58863.2023.10363522)
3.  **Qiskit Contributors** (2025). “Qiskit: An Open-Source Framework for Quantum Computing.” [https://github.com/Qiskit/qiskit](https://github.com/Qiskit/qiskit)

#### Additional Background

1.  **Nielsen, M. A. and Chuang, I. L.** (2010). _Quantum Computation and Quantum Information: 10th Anniversary Edition_. Cambridge University Press.
2.  **Preskill, J.** (2018). “Quantum computing in the NISQ era and beyond.” _Quantum_, 2, 79.
3.  **Willsch, D., et al.** (2024). “The state of factoring on quantum computers 2024.” [arXiv:2410.14397](https://arxiv.org/abs/2410.14397)
