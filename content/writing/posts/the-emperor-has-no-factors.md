---
title: The Emperor Has No Factors
slug: the-emperor-has-no-factors
date: 2026-03-22
status: published
series: Quantum Factoring
series_order: 2
excerpt: What Happens When You Apply Honest Metrics to Every Published Shor’s Result
tags:
  - quantum factoring
  - Shor's algorithm
  - benchmarking
  - quantum hardware
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/the-emperor-has-no-factors/
medium_url: https://medium.com/@_monitsharma/the-emperor-has-no-factors-9eaec0d9bd0d
draft: false
---

#### What Happens When You Apply Honest Metrics to Every Published Shor’s Result

![](https://cdn-images-1.medium.com/max/1024/1*bhTkK0hjhAauKGPMwv6Wwg.png)

#### Introduction: The Two-Qubit Trick

In 2013, John Smolin, Graeme Smith, and Alexander Vargo published a short, devastating paper in _Nature_ titled “[Oversimplifying quantum factoring](https://www.nature.com/articles/nature12290)”. They built a quantum circuit that “factors” RSA-768; a 232-digit number that had taken teams of researchers coordinating hundred of machines over two years to crack classically. Their circuit used two qubits and one gate.

![](https://cdn-images-1.medium.com/max/1024/1*W8Cv8jl3Ya9FHgK0hEMgGA.png)

The circuit for the fully-compiled Shor’s algorithm. The modular exponentiation is the single controlled-NOT, and the quantum Fourier transform is a Hadamard gate. Image taken from \[1\].

The trick is simple. If the compiler is allowed to know the factors of the number being factored, the entire quantum computation collapses to a trivial verification step. The 2-qubit circuit doesn’t discover the factors, it confirms them, using a structure that was designed with the answers already embedded. Smolin, Smith, and Vargo showed that this reduction applies to any product of unequal primes, regardless of the size. They could “factor” a 20,000-bit number just that easily.

This is the RSA-768 number they factored:

```
1230186684530117755130494958384962720772853569595334792197322
4521517264005072636575187452021997864693899564749427740638459
2519255732630345373154826850791702612214291346167042921431160
2221240479274737794080665351419597459856902143413 
=
3347807169895689878604416984821269081770479498371376856891243
388982883793878002287614711652531743087737814467999489
×
3674604366679959042824463379962795263227915816434308764267
6032283815739666511279233373417143396810270092798736308917
```

Their point was not merely academic. They were responding to a growing body of experimental papers, each one announcing a new quantum factoring “milestone”, that all relied on exactly this type of compiled circuit. In every case, the modular exponentiation oracle, the computationally hard core of Shor’s algorithm, was replaced by a hand-designed shortcut built from prior knowledge of the prime factors. The quantum hardware wasn’t computing anything unknown. It was executing a lookup table.

In [Part 1](/writing/sometimes-its-too-slow-for-shor/) of this series, I ran Shor’s algorithm on IBM’s 156-qubit Heron processor and discovered something uncomfortable: my “successful” factorizations were being recovered by a forging classical post-processing pipeline, not by genuine quantum signal. Even when the quantum circuit output looked like noise, the continued-fractions machinery frequently extracted the correct factors anyway.

This post extends that investigation to the published literature. I built a computational framework: the “scorecard engine”, that evaluates the major gate-model Shor experiments from 2001 through 2021 against a standardized null baseline. I also examine the adiabatic/Ising “stunt” factorizations and the controversial [Yan et al. lattice-QAOA](https://arxiv.org/pdf/2212.12372) claim. The results are quantitative, reproducible and in several cases startling.

#### Part 1: Why Null Baselines Matter

### The Missing Control Experiment

Every branch of empirical science has a concept of null hypothesis: what would we observe if the effect we’re testing for were absent? In drug trials, this is the placebo group. In particle physics, it’s the background event rate. In quantum factoring, the natural null hypothesis is: **what happens if we replace the quantum computer with a source of uniformly random bits and feed those bits through the same classical post-processing?**

If random input succeeds at producing the correct factors with high probability, then the experiment has not demonstrated that the quantum hardware contributed anything. The measured “success rate” would need to significantly exceed the null baseline to constitute evidence of quantum computation.

Among the major published gate-model Shor experiments I surveyed-[Vandersypen (2001)](https://www.nature.com/articles/414883a), [Lu (2007)](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.99.250504), [Lanyon (2007)](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.99.250505), [Martin-Lopez (2012)](https://www.nature.com/articles/nphoton.2012.259), [Lucero (2012)](https://arxiv.org/abs/1202.5707), [Monz (2016)](https://arxiv.org/abs/1507.08852), [Amico, Saleem & Kumph (2019)](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.100.012305), and [Skosana & Tame (2021)](https://www.nature.com/articles/s41598-021-95973-w) — not a single one reports this comparison.

### How the Continued Fractions Pipeline Works

To understand why the null baseline matters so much for small numbers, let me walk through the classical post-processing step by step.

After the quantum phase estimation (QPE) circuit runs, we measure the _t-_qubit control register, obtaining an integer y ∈ {0, 1, …, 2^t − 1}. The algorithm then:

1.  **Computes the phase fraction:** φ = y / 2^t. This approximates some rational number s/r, where r is the multiplicative order we seek and s is an unknown integer.
2.  **Expands as continued fraction:** The continued fraction algorithm decomposes φ into a sequence of increasingly precise rational approximations called _convergents_. For example, 5/8 has convergents 0/1, 1/1, 1/2, 2/3, 5/8.
3.  **Tests each convergent denominator:** For each convergent p/q, the algorithm checks whether q (or a small multiple of q) is a valid multiplicative order: does a^q ≡ 1 (mod N)? If so, it attempts factor extraction via gcd(a^(q/2) ± 1, N).
4.  **Accepts or rejects:** If a non-trivial factor emerges, the algorithm succeeds. Otherwise, it tries the next convergent.

The critical observation is that with only 2^t possible measurement outcomes and multiple convergents per outcome, the pipeline has many chances to stumble into the correct answer. For t=3, there are only 8 possible y-values. Each one generates 2–5 convergent denominators. If even a few of those denominators happen to coincide with the true order (or a multiple of it that still yields factors), the pipeline reports success, regardless of whether the quantum circuit produced those specific y-values with any preference.

### The Scorecard Engine

I built `scorecard_engine.py` to compute this exhaustively. For each published experiment with parameters (N,a,t) the engine:

1.  Enumerates all 2^t possible measurement outcomes.
2.  For each outcome y, runs the standard continued fractions pipeline.
3.  Checks whether the pipeline produces the correct prime factors.
4.  Computes the fraction of outcomes that succeed; the **strict null false-positive rate.**

This is a clean, well-defined quantity: the probability that a uniform random measurement from a t-qubit register yields correct factors through continued fractions post-processing, for a given (N,a). No quantum mechanics involved.

I also compute a separate **adversarial expanded rate** that additionally tries adjacent outcomes (y ± 1, y ± 2) and multiples of candidate orders. This models an aggressive experimenter scanning beyond the standard pipeline. It is _not_ a faithful reconstruction of any single paper’s published protocol — different papers use different success metrics, and some (like Amico et al.) bypass continued fractions entirely in favor of statistical overlap measures. The adversarial rate is an upper bound on how forgiving the number-theoretic structure can be.

### Computing the Ideal QPE Distribution Correctly

To compare the null baseline against what a perfect quantum computer would achieve, I need the exact ideal QPE probability distribution. For order r that evenly divides 2^t (like r = 4, t = 3), all probability mass concentrates on sharp peaks and the calculation is straightforward. But for r that _doesn’t_ evenly divide 2^t (like r = 3, t = 3, which is the case for N = 21 with a = 4), probability mass spreads across multiple outcomes in a characteristic sinc-like pattern.

The standard QPE probability of measuring outcome y given eigenvalue phase s/r is:

P(y|s) = sin²(π Δ · 2^t) / (2^(2t) · sin²(π Δ))

where Δ = s/r − y/2^t, and P(y|s) = 1 when Δ is an integer (exact peak). The overall probability is then averaged over the r eigenvalue indices:

P(y) = (1/r) · Σ\_{s=0}^{r−1} P(y|s)

This gives the true per-shot success probability under ideal QPE, correctly handling the spreading that occurs when r does not divide 2^t. The code in `scorecard_engine.py` implements this formula exactly and uses it to weight the factor-extraction check across all outcomes.

#### Part 2: The Results, Experiment by Experiment

#### N=15: The Workhorse

The integer 15 = 3 × 5 has been the testing ground for quantum factoring since 2001. It has several properties that make it particularly forgiving for small demonstrations:

-   With base a = 7, the order is r = 4, which divides 2^t for any t ≥ 2. This means the ideal QPE distribution has _perfect_ peaks with zero leakage.
-   With base a = 2, the order is also r = 4.
-   With base a = 11, the order is r = 2 — the smallest possible non-trivial order, which makes factor extraction almost automatic.
-   N = 15 has only two non-trivial factors, and they’re both small single-digit primes.

These properties conspire to make N = 15 extraordinarily vulnerable to false positives.

### Vandersypen et al. (2001) — The Original

The first experimental demonstration used a 7-qubit liquid-state NMR system. The control register had t = 3 qubits (8 possible outcomes) with base a = 7.

_Null baseline analysis:_ Of the 8 possible uniformly random outcomes, **6 yield correct factors** through the continued-fractions pipeline. The strict null FP rate is **75%**. A random number generator would “factor” 15 three-quarters of the time.

Why is it so high? Because with r = 4 and t = 3, the convergent denominators from most outcomes include 4 or a divisor of 4 (namely 2), and gcd(7² ± 1, 15) = gcd(48, 15) or gcd(50, 15) gives factors in either case. Only outcomes y = 0 and y = 4 fail — the former trivially (measuring zero gives no information) and the latter because its only convergent denominators are 1 and 2, and r = 2 yields a^(r/2) = 7 ≡ 7 (mod 15), where gcd(6, 15) = 3 and gcd(8, 15) = 1… actually that _does_ work. Let me be precise: under the generalized factor extraction in my pipeline (which tries gcd(a^k − 1, N) for divisors of r), 6 of 8 succeed.

The ideal QPE success rate is 50.0%. This means the ideal quantum distribution is actually _worse_ than random at producing factors, because the quantum peaks concentrate probability on outcomes that don’t always include order-4 convergents, while the broad random distribution happens to hit more factor-yielding outcomes. This is a genuinely surprising result that illustrates how a forgiving post-processing pipeline can invert our intuitions about signal quality.

This does not mean the Vandersypen experiment was scientifically worthless. It was a landmark demonstration that seven nuclear spins could be coherently manipulated to execute an algorithm. But as a demonstration of _factoring_ — of discovering unknown information — it is indistinguishable from a well-crafted random number generator.

### Lu et al. (2007) and Lanyon et al. (2007) — Photonic Compilations

Both experiments used 4-photon systems with t = 2 qubits in the control register, using base a = 2.

With only 4 possible outcomes, the null baseline is brutally high: **50%**. A coin flip. The ideal QPE rate is also 50%. There is mathematically no way to distinguish quantum signal from random noise at this resolution.

### Martin-Lopez et al. (2012) — Qubit Recycling

This experiment introduced an architecturally important innovation: the semiclassical QFT with qubit recycling, which reduces the control register to a single physical qubit that is measured and reused iteratively. This technique, based on Kitaev’s iterative phase estimation, is genuinely important for scaling. But the factoring result itself — N = 15, a = 2, effective t = 3 — has the same **75%** null FP rate as Vandersypen.

### Monz et al. (2016) — Trapped Ions, “Scalable”

The Innsbruck trapped-ion team used 5 qubits with t = 4 in the control register and base a = 2. With 16 possible outcomes, the null baseline drops to **37.5%** — better than earlier experiments, but still alarmingly high. The ideal QPE rate is 50.0%.

The paper’s claim of “scalable” architecture (referring to the in-sequence measurement capability) is architecturally defensible — the hardware could in principle be extended to longer iterative sequences. But the factoring result remains firmly in the high-false-positive regime.

### Amico, Saleem & Kumph (2019) — The N = 35 Attempt

This paper is critically important for our analysis because it studied three numbers (15, 21, and 35) on IBM’s ibmqx5 16-qubit processor, using split-circuit iterative execution with the semiclassical QFT. Notably, Amico et al. used the square of the statistical overlap (SSO) as their success metric rather than continued-fraction-based factor recovery, so the “same pipeline” framing doesn’t apply literally to their work.

For **N = 15 with a = 11**: The order is r = 2, which makes the continued-fractions pipeline almost trivially successful. The null FP rate is **87.5%** — seven of eight random outcomes yield correct factors.

For **N = 21 with a = 4**: Same as other N = 21 experiments — **25%** null FP.

For **N = 35 with a = 4**: This is where things get interesting. The order of 4 mod 35 is r = 6. With t = 3 qubits giving only 8 possible outcomes, the continued-fractions pipeline cannot extract r = 6 from _any_ single outcome under my standardized post-processing test. The strict null FP rate is **0.0%**.

This does not mean that every conceivable classical recovery strategy would fail on these 8 outcomes — only that the standard Shor-style continued-fractions pipeline, as implemented in my scorecard engine, finds no path from any y ∈ {0,…,7} to the correct factors of 35. The problem is that 6 doesn’t divide 8, so the ideal QPE peaks don’t land on integer positions, and with only 3 bits of phase resolution, the continued fractions can’t resolve s/6 accurately enough.

Amico et al. reported that the N = 35 experiment largely failed, with roughly 14% success where success is measured by their SSO metric. The high cumulative gate errors from the deep N = 35 circuits overwhelmed the quantum signal. This is the most informative data point in the entire survey: it shows where compiled Shor hits the wall on real hardware, and the 0% null FP rate under the standard pipeline means that any genuine success at this point _would_ be attributable to quantum computation.

![](https://cdn-images-1.medium.com/max/1024/1*iwPzjGW0EbOKBE0xKeTG2w.png)

#### N = 21: The Current Frontier

### **Lucero et al. (2012) — First N = 21 on Superconducting Hardware**

Using a Josephson phase qubit processor with about 11 CX gates in the compiled circuit, this was the first factorization of 21 on superconducting hardware. The null baseline analysis gives **25%** strict FP rate.

### Skosana & Tame (2021) — The Most Rigorous N = 21 Demonstration

This paper deserves detailed attention because it is, to my knowledge, the most carefully characterized compiled Shor demonstration published to date.

Skosana and Tame used a 5-qubit circuit (3 control, 2 work) on IBM’s ibmq\_casablanca (7Q) and ibmq\_toronto (27Q) processors. The key innovation was replacing standard Toffoli gates with Margolus gates (relative-phase Toffoli gates), which halve the CX count per Toffoli from 6 to 3. This brought the total circuit down to **25 CX gates** with circuit depth 35.

Their characterization was rigorous:

-   **Kolmogorov distance** from ideal: 0.169 (toronto) and 0.178 (casablanca), compared to 0.435 for uniform noise.
-   **State fidelity** via tomography: ~0.70 on both processors.
-   **Entanglement verification**: A projector-based witness confirmed non-separability between control and work registers across most bipartitions.

These metrics genuinely demonstrate that the hardware is operating coherently in the quantum regime. The Kolmogorov distance in particular shows the output distribution is far from uniform noise and close to the ideal. This is real physics.

But the factoring claim itself? The null baseline is **25%** strict FP. The ideal QPE success rate, correctly computed from the exact probability distribution, is **47.1%**. The quantum signal is roughly 22 percentage points above the null baseline — meaningful but modest, and critically, _never reported as a comparison_ in the paper. No reviewer asked for it.

![](https://cdn-images-1.medium.com/max/1024/1*PPsis8a-QEn8_zjRRNHoag.png)

Here is the outcome-by-outcome breakdown:

![](https://cdn-images-1.medium.com/max/1024/1*KnHkgpZ36DaeeYj1jwKp8w.png)

Outcomes 3 and 5 are the only successes. Their continued fraction expansions happen to produce 3 as a convergent denominator, which is the true order. Since a = 4 is a perfect square (4 = ²²), factor extraction works despite r = 3 being odd: we compute √a^r = ²³ = 8, then gcd(8 − 1, 21) = 7 and gcd(8 + 1, 21) = 3.

The ideal QPE distribution places about 35% probability on y = 0 (a failure mode, since it gives no phase information), and roughly 25% each on y = 3 and y = 5 (the successful outcomes). This is why the ideal success rate is 47.1%, not 50% — the y = 0 peak wastes significant probability.

#### The Comprehensive Scorecard

The table below shows three null baselines at increasing levels of post-processing generosity, plus the ideal QPE success rate for comparison. The “textbook” column uses pure Shor: continued fractions only, even-r required, standard gcd extraction. The “liberal” column adds the perfect-square-base rescue (used by Skosana & Tame for a = 4, r = 3), divisor scanning, and multiples of candidate orders. Both are computed by exhaustive enumeration over all 2^t outcomes.

![](https://cdn-images-1.medium.com/max/1024/1*Kux6RukxfrGnCSqlO-gK1w.png)

### A Methodological Surprise: What the Dual Baseline Reveals

The most interesting finding in this table is the gap between textbook and liberal rates for N = 21.

Under pure textbook Shor, the null FP rate for N = 21 with a = 4 is **0%**. The reason: the true order r = 3 is odd, and textbook Shor’s algorithm says “if r is odd, discard this base and restart with a new random choice of a.” No outcome from a 3-bit register can produce a correct even-order candidate through continued fractions alone, because the true order is odd and no false even order happens to work.

The 25% liberal rate exists entirely because of the perfect-square-base rescue strategy. Since a = 4 = 2², we can compute √a^r = 2³= 8 even though r = 3 is odd. Then gcd(8 ± 1, 21) gives the factors. This is the strategy Skosana & Tame explicitly use — and it’s a legitimate mathematical technique — but it goes beyond the textbook algorithm.

This creates a subtle interpretive question: which null baseline is the right comparison? The answer depends on what claim you’re evaluating:

-   If the claim is “Shor’s algorithm as described in Nielsen & Chuang successfully factors 21,” then the textbook baseline (0%) is the right comparison, and the 47.1% ideal success rate represents a substantial quantum signal.
-   If the claim is “our post-processing pipeline recovers factors from the quantum output,” then the liberal baseline (25%) is the right comparison, because the pipeline _does_ use the perfect-square trick. The 47.1% ideal rate is still above 25%, but the margin is narrower.

Neither framing makes the experiment invalid. But the gap between 0% and 25% illustrates why precise methodology labeling matters. The qualitative conclusion — that there is genuine quantum signal for N = 21 above the appropriate null baseline — holds under both framings. The quantitative margin differs substantially.

For N = 15, the textbook rates are lower than the liberal rates but still high: 25–50% depending on the base and t. The qualitative conclusion there is unaffected — these are high false-positive rates under either definition.

#### Part 3: The Compilation Problem

### What “Compiled” Actually Means

In standard software engineering, a compiler translates human-readable code into machine-executable instructions without altering the program’s logic. The compiler does not need to know the program’s output to produce correct machine code.

In experimental quantum factoring, “compilation” means something categorically different. The circuit designer knows the prime factors of N in advance and uses that knowledge to construct a dramatically simplified modular exponentiation oracle. Rather than building a general-purpose circuit that computes a^x mod N for arbitrary x in superposition, the compiled circuit hardcodes the specific cyclic permutation structure of a^x mod N for the known (a, N) pair.

For N = 21 with a = 4:

-   The full modular exponentiation sequence is 4^x mod 21 for x = 0, 1, 2, …, which cycles through {1, 4, 16, 1, 4, 16, …} with period 3.
-   A compiled circuit only needs to implement the 3-element cyclic permutation {1 → 4 → 16 → 1} in the work register, controlled by the counting register.
-   Skosana & Tame encode these three states in a 2-qubit work register as |00⟩, |01⟩, |10⟩ (a log-compression of the full 5-qubit register that would be needed to represent integers up to 21).

The resulting 25 CX-gate circuit is a remarkable piece of engineering. But it is engineering the _answer into the question_. [Craig Gidney](https://x.com/CraigGidney) has estimated that a general-purpose, uncompiled circuit for N = 21 would require approximately 2,405 two-qubit gates (this is a CX-equivalent estimate from circuit synthesis, not an experimentally measured count; the exact number depends on the compilation strategy used). The ~96× gap between 25 and 2,405 represents work done by the classical compiler, not the quantum processor.

![](https://cdn-images-1.medium.com/max/1024/1*r4qYpG09_WxfhxIBh0wTHA.png)

### The Smolin-Smith-Vargo Argument in Detail

Smolin, Smith, and Vargo’s 2013 _Nature_ paper formalized this critique. Their key contribution was proving that for _any_ composite N = pq with p ≠ q, there exists a base _a_ with order r = 2. For such a base, the QPE circuit reduces to a single controlled-NOT, and the factor extraction is automatic: a^(r/2) = a, and gcd(a ± 1, N) gives the factors.

To find such a base, one needs to know the factors — which is precisely the information the algorithm is supposed to discover. But in a compiled experiment, the factors are already known. So the experimenter can always choose the easiest possible base, build the smallest possible circuit, and report “success.”

Smolin et al. demonstrated this by providing explicit circuits to “factor” RSA-768 and a synthetic 20,000-bit number, each using only 2 qubits. Their paper concluded that the correct measure of difficulty in Shor’s algorithm is not the size of the number factored, but the length of the period found and the precision of the phase estimation.

### The Gate Count Reality

The gap between compiled and uncompiled circuits is enormous and grows rapidly:

![](https://cdn-images-1.medium.com/max/1024/1*SvsNQMFK4Qc4mUqmxauXwQ.png)

![](https://cdn-images-1.medium.com/max/1024/1*95UEOaVFzs-A7Oc7HKP_FA.png)

For N = 51, Geller and Zhou’s theoretical circuits use only 4 CNOT gates because 51 = 3 × 17 is a product of [Fermat primes](https://mathworld.wolfram.com/FermatPrime.html), which guarantees all multiplicative orders are powers of 2. This is the most extreme case of structural exploitation in the literature. Their paper has never been experimentally realized.

Current NISQ hardware can reliably execute circuits with roughly 50–100 two-qubit gates before noise overwhelms the signal (this threshold varies by platform and is improving). Compiled circuits for N = 15 and N = 21 fall comfortably within this budget. Uncompiled circuits for even N = 21 exceed it by an order of magnitude. This is why no genuine, uncompiled factoring has been demonstrated on quantum hardware — not because the algorithms are wrong, but because the circuits are too deep for current noise levels

#### Part 4: The Taxonomy of Non-Shor Claims

### Category B: Adiabatic/Ising Factorizations

Parallel to the gate-model Shor experiments, a completely different approach to quantum factoring emerged: reformulating the problem as an Ising energy minimization suitable for adiabatic quantum annealers. This approach does not use Shor’s algorithm at all — no QPE, no QFT, no modular exponentiation. Instead, the binary multiplication table p × q = N is encoded as a quadratic pseudo-Boolean function, and the quantum device searches for the ground state of the corresponding Hamiltonian.

The critical issue is that classical preprocessing can eliminate most of the binary variables before the quantum device is even involved. For any odd semiprime N = p × q, we know immediately that both p and q are odd (LSBs = 1) and that their most significant bits are 1. Further constraints cascade through the multiplication table, progressively fixing variables.

When the prime factors are close together — specifically, when |p − q| is small relative to √N — the classical preprocessing eliminates _almost everything_, leaving the quantum device with zero to two effective free variables.

**N = 143 = 11 × 13** ([Xu et al. 2012](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.108.130501), 4-qubit NMR)

The factors differ by only 2 and have identical bit-lengths (4 bits each). Fermat’s classical method factors 143 in exactly one step: ⌈√143⌉ = 12, and 12² − 143 = 1 = 1², giving p = 12 + 1 = 13 and q = 12 − 1 = 11. The “quantum” computation had effectively ~1 free variable to solve.

**N = 56,153 = 233 × 241** (D[attani & Bryans 2014](https://arxiv.org/abs/1411.6758), theoretical/4-qubit)

Dattani and Bryans made a crucial mathematical observation: the reduced Ising Hamiltonian for 56,153 has the same structure as the one for 143. Their paper provides the formal proof of this equivalence. My analysis code verifies the _consequence_ — that 56,153 is equally trivially factorable by Fermat’s method (1 step) — but does not independently reproduce the Hamiltonian equivalence proof.

Fermat’s method: ⌈√56153⌉ = 237, and 237² − 56153 = 16 = 4², giving p = 237 + 4 = 241 and q = 237 − 4 = 233.

**N = 4,088,459 = 2,017 × 2,027** ([Dash et al.](https://arxiv.org/pdf/1805.10478) 2018, 2-qubit IBM Q)

Twin-prime-like proximity. Fermat’s method: 1 step.

**N = 1,099,551,473,989 = 1,048,589 × 1,048,601** ([Q2B Conference 2019](https://www.newscientist.com/article/2227387-quantum-computer-sets-new-record-for-finding-prime-number-factors/), 3 qubits)

The factors differ by only 12 across a trillion-scale number. Fermat’s method: 1 step.

The pattern is unmistakable: as the “record” N grows exponentially, the qubit count stays constant or _decreases_, and Fermat’s classical method always factors the number in a single step. The claimed numbers get bigger, but the actual computational difficulty doesn’t change. Each of these numbers was specifically chosen (or found) to have factors that are absurdly close together, making the classical preprocessing eliminate all of the hard work.

![](https://cdn-images-1.medium.com/max/1024/1*1eCi02GGp37ZkiUjOpWJYQ.png)

A modern laptop running Fermat’s method can factor all of these “record-breaking” numbers in microseconds.

### Category C: The Yan et al. Lattice-QAOA Controversy

In late 2022, a team led by [Bao Yan published a paper](https://arxiv.org/abs/2212.12372) claiming to factor a 48-bit number (261,980,999,226,229 = 15,538,213 × 16,860,433) using only 10 qubits on a superconducting processor. The approach combined Schnorr’s classical lattice-based factoring method with the Quantum Approximate Optimization Algorithm (QAOA) to solve a specific sub-problem.

The alarm came from the paper’s scaling claim: under their theoretical model, a 2048-bit RSA key could be broken with merely a few hundred qubits. This directly contradicted the established consensus (based on [Gidney and Ekerå’s 2021](https://quantum-journal.org/papers/q-2021-04-15-433/) analysis) that roughly 20 million noisy physical qubits would be needed.

The cryptographic community identified the fatal flaw quickly: Schnorr’s classical algorithm itself requires lattice dimensions that grow exponentially with the target integer’s bit length. The quantum QAOA subroutine operates _within_ the lattice framework and cannot bypass this classical scaling barrier. The 48-bit factorization succeeded because the lattice dimension for a 48-bit number is tiny — not because the algorithm had found a shortcut around the fundamental complexity.

The consensus among cryptographers is that the lattice-QAOA approach does not constitute a near-term or long-term threat to RSA. The quantum component provides modest optimization within a framework whose classical foundation collapses at scale

#### Part 5: Geller and Zhou’s Theoretical Circuits for N = 51 and N = 85

The [2013 paper by Geller and Zhou](https://arxiv.org/abs/1304.0128) deserves separate attention because it illustrates the extreme end of structural exploitation

The integers 51 = 3 × 17 and 85 = 5 × 17 are products of Fermat primes (primes of the form 2^(2^k) + 1). This guarantees that the multiplicative order of any coprime base a mod N is a power of 2. When all orders are powers of 2, the QPE peaks land on exact integer positions in the measurement register, eliminating the rounding error that plagues non-power-of-2 orders.

The compressed modular exponentiation circuits for these numbers require at most **4 CNOT gates** (no Toffoli gates needed), because the modular exponentiation reduces to a simple bit-copy operation after compression. The total circuit uses 8 qubits: 4 in each register.

My null baseline analysis for representative bases:

![](https://cdn-images-1.medium.com/max/1024/1*AazJgdAy7tv6uYKygkaz9g.png)

Even with 16 possible outcomes (t = 4), most base choices yield null FP rates above 25%. Only the r = 4 cases drop below 20%.

Geller and Zhou acknowledged honestly in their paper that they “do not regard the factorization of products of Fermat primes to be genuine implementations of Shor’s algorithm.” They viewed their circuits as “quasi-legitimate implementations of quantum order finding” — a more careful framing than many other papers in the field.

#### Part 6: What Would Genuine Progress Look Like?

After this survey, I want to be constructive. The field is not stuck — hardware is genuinely improving. But the reporting standards need to catch up with the hardware. Here is a concrete checklist that a credible future factoring result should satisfy:

### Minimum Reporting Requirements

1.  **Null baseline comparison.** Compute and report the strict null FP rate for the exact (N, a, t) parameters used. Compare the observed per-shot factor yield against this baseline with appropriate statistical testing. This is the single most important missing metric in the entire field.
2.  **Raw measurement histogram with ideal overlay.** Show the complete distribution of measurement outcomes alongside the theoretical ideal. Let readers visually assess signal quality. Skosana & Tame did this well; most earlier papers did not.
3.  **Per-shot factor yield.** Report what fraction of individual measurements, when fed through the post-processing pipeline, produce correct factors. Do not report only “the correct factors were obtained” without shot-level statistics.
4.  **Peak enrichment metric.** Compute the ratio of measured probability mass within ±1 of ideal peak locations to the uniform expectation. This quantifies how much the quantum device concentrates probability where it should, independent of whether those peaks happen to yield factors.
5.  **Multiple coprime bases.** Run the algorithm with several randomly selected bases and report aggregate statistics. A single lucky base choice can produce misleading results, especially for small N where some bases have trivially small orders.
6.  **Honest gate count disclosure.** Report both the compiled circuit’s gate count and an estimate of what the uncompiled circuit would require, with a source for the estimate. This makes transparent how much computational work the classical compiler is performing.
7.  **Separation of quantum signal from post-processing artifacts.** Demonstrate that the factor-extraction success rate significantly exceeds what a random input source would achieve through the same pipeline. For N = 21 with t = 3, this means showing per-shot success significantly above 25%, with enough shots for statistical confidence.

![](https://cdn-images-1.medium.com/max/1024/1*Tb1OUqaj8Vj4EPIVGTgXiA.png)

### The N = 35 Frontier

The Amico et al. N = 35 result is the clearest signpost for where to aim. Under the standard Shor-style pipeline with t = 3, no random outcome produces correct factors (0% null FP). The problem is genuinely hard at this resolution. Any compiled experiment that reliably factors 35 with clear evidence of factor recovery exceeding the null baseline would represent meaningful progress beyond N = 21.

Better still: an experiment using a number whose factors were chosen by someone other than the circuit designer — a truly blind trial — would constitute an even stronger demonstration, though this requires uncompiled circuits that are currently too deep for hardware.

### The Long Road to Cryptographic Relevance

For context on where the field stands relative to practical significance: Gidney and Ekerå (2021) estimate that factoring a 2048-bit RSA key with Shor’s algorithm would require approximately 20 million noisy physical qubits running for about 8 hours, using surface code error correction.

In a remarkable follow-up published in May 2025, [Gidney alone reduced this estimate to under a million noisy qubits](https://arxiv.org/abs/2505.15917), though the runtime increased to roughly a week. I[n a more recent paper by Webster et.al. , they further reduced the estimate to 100,000 physical qubits](https://arxiv.org/abs/2602.11457).

![](https://cdn-images-1.medium.com/max/1024/1*hOr-AV317o5f3ysoiJHwpQ.png)

Current hardware has roughly 1,000 noisy qubits with error rates orders of magnitude too high for the required error correction overhead. The gap between “factor 35” and “factor a 2048-bit key” is not a matter of incremental improvement — it requires breakthroughs in physical qubit quality, error correction scaling, and classical control systems operating at microsecond latency across millions of qubits.

#### Part 7: What the Experiments _Do_ Demonstrate

I want to be clear about what I am and am not arguing. I am not claiming these experiments are scientifically worthless, nor that the researchers were dishonest. Every one of these papers advanced our understanding of quantum hardware in important ways:

-   **Vandersypen (2001)** proved that coherent multi-qubit manipulation was physically possible.
-   **Martin-Lopez (2012)** demonstrated qubit recycling, a technique essential for future scaling.
-   **Monz (2016)** showed that trapped-ion hardware could perform in-sequence measurements with feed-forward.
-   **Skosana & Tame (2021)** demonstrated that approximate Toffoli gates could reduce circuit depth while preserving functional correctness, and their entanglement verification is the most thorough in the literature.
-   **Amico et al. (2019)** pushed to N = 35 and honestly reported the failure, providing the most informative negative result in the field.

These are genuine hardware milestones. They demonstrate improving gate fidelities, growing qubit counts, novel error-mitigation techniques, and increasingly sophisticated classical-quantum integration. What they do not demonstrate is quantum factoring in the sense of discovering unknown information through quantum speedup.

The distinction matters because conflating hardware characterization with computational capability leads to confused public understanding. When a press release says “quantum computer factors 21,” a reasonable reader imagines a machine that was given 21 and returned 3 × 7 without knowing the answer in advance. That is not what happened. What happened is that a team of physicists designed a circuit _from_ the answer 3 × 7, ran it on noisy hardware, and showed the hardware was operating coherently enough to approximately reproduce the designed output.

Both narratives are scientifically valuable. But they answer different questions, and pretending they answer the same question is how the field’s credibility erodes.

#### Conclusion

Among the compiled gate-model hardware demonstrations with clear factor recovery that I surveyed, N = 21 remains the strongest successful case. Amico et al. (2019) also attempted N = 35, but with poor success (~14%) due to cumulative gate errors. The “record-breaking” large numbers in the Ising/adiabatic category (143 through 1.1 trillion) don’t use Shor’s algorithm and are trivially factorable by Fermat’s classical method.

The null baseline analysis reveals a systematic gap in the literature’s reporting. For most N = 15 experiments, random noise succeeds at producing correct factors 50–87% of the time under a standardized Shor-style post-processing test. For N = 21, the null rate is 25% against an ideal QPE rate of 47.1% — quantum signal exists but has never been compared to the baseline. For N = 35 with t = 3, the null rate drops to 0% under the standard pipeline — the problem is genuinely hard at that resolution, which is exactly where hardware failed.

The honest framing is what lets us recognize genuine progress. The N = 35 case points the way: when someone demonstrates reliable factor recovery for a problem where the null baseline is near zero, using a circuit that doesn’t embed the answer, we’ll know the field has turned a corner. The metrics to recognize that moment now exist. The experiments that demonstrate it do not yet.

All code for the scorecard engine, figure generation, and Ising tractability analysis is available in the accompanying repository. Every number in this post is reproducible from the scripts.

> [Part 1](/writing/sometimes-its-too-slow-for-shor/) covered my own implementation on IBM’s 156-qubit Heron processor. Part 3 will explore what modifications to the algorithm and post-processing could genuinely demonstrate quantum advantage in period finding.

#### Citation

If this code or analysis framework is useful in your work, please cite it as:

Monit Sharma. The Emperor Has No Factors:What Happens When You Apply Honest Metrics to Every Published Shor’s Result  
GitHub repository, 2026.  
\[[https://github.com/MonitSharma/medium\_articles/tree/main/sometimes-too-slow-for-shor](https://github.com/MonitSharma/medium_articles/tree/main/sometimes-too-slow-for-shor)\]

You can also use the following BibTeX entry:

```
@misc{sharma2026shorhonestmetrics,
 author = {Monit Sharma},
 title = {The Emperor Has No Factors:What Happens When You Apply Honest Metrics to Every Published Shor's Result},
 year = {2026},
 howpublished = {\url{https://github.com/MonitSharma/medium_articles/tree/main/sometimes-too-slow-for-shor}},
 note = {GitHub repository}
```

#### Appendix A: Methodology and Limitations

### Null Baseline Computation

For each experiment with parameters (N, a, t), the strict null FP rate is computed by exhaustive enumeration: for each y ∈ {0, …, 2^t − 1}, run the standard continued-fractions pipeline and check whether it produces the correct prime factors. The rate is the fraction of y-values that succeed.

The “adversarial expanded” rate additionally tries y ± 1, y ± 2, and multiples of candidate orders. **This is an upper-bound stress test, not a faithful reconstruction of any specific paper’s published protocol.** Different papers use different success metrics — continued fractions, statistical overlap (SSO), top-k scanning, etc. — and my adversarial model does not replicate any one of these exactly.

### Ideal QPE Success Rate

Computed from the exact formula P(y|s) = sin²(πΔ·2^t) / (2^{2t} · sin²(πΔ)), averaged over eigenvalue indices s with weight 1/r. This correctly handles non-power-of-2 orders. The code implementation in `scorecard_engine.py` uses this formula directly.

### Ising Classical Tractability Analysis

The Ising analysis script (`ising_stunt_analysis.py`) computes:

-   Fermat’s method step counts (trial from ⌈√N⌉ upward)
-   Binary variable counts for the multiplication table
-   Effective free variables via a heuristic based on log₂(number of valid factorizations)

It does **not**:

-   Derive the reduced Ising Hamiltonians used in the original papers
-   Formally prove equivalence between different semiprimes’ Hamiltonians
-   Reproduce the Dattani-Bryans argument in full

The Fermat tractability results are independently verifiable. The Hamiltonian equivalence claims cite Dattani & Bryans (2014) but are not reproduced here.

![](https://cdn-images-1.medium.com/max/1024/1*qYrOzpC1GnCKuqArxEEZFQ.png)

### Coverage Limitations

This survey covers the major published gate-model Shor experiments and adiabatic factorizations that I identified through primary literature review. It is not exhaustive. Additional demonstrations may exist in conference proceedings, preprints, or less-cited journals. Recent claims (e.g., Saxena et al. on N = 91, Ghugare et al. on N = 221) were not included because I could not obtain sufficient circuit-level details for null baseline computation.

#### References:

1.  Smolin, J., Smith, G. & Vargo, A. **Oversimplifying quantum factoring**. _Nature_ **499**, 163–165 (2013). [https://doi.org/10.1038/nature12290](https://doi.org/10.1038/nature12290)
2.  Monit Sharma. **Sometimes It’s Too Slow… for Shor: Factoring Numbers on IBM Quantum Hardware with Honest Metrics,** 2026**.** [https://medium.com/@\_monitsharma/sometimes-its-too-slow-for-shor-c01677032324](/writing/sometimes-its-too-slow-for-shor/), Code: [https://github.com/MonitSharma/medium\_articles/tree/main/sometimes-too-slow-for-shor](https://github.com/MonitSharma/medium_articles/tree/main/sometimes-too-slow-for-shor)
3.  Yan, B., Tan, Z., Wei, S., Jiang, H., Wang, W., Wang, H., Luo, L., Duan, Q., Liu, Y., Shi, W. and Fei, Y., 2022. **Factoring integers with sublinear resources on a superconducting quantum processor**. _arXiv preprint arXiv:2212.12372_.
4.  Vandersypen, L., Steffen, M., Breyta, G. _et al._ **Experimental realization of Shor’s quantum factoring algorithm using nuclear magnetic resonance.** _Nature_ **414**, 883–887 (2001). [https://doi.org/10.1038/414883a](https://doi.org/10.1038/414883a)
5.  Lu, C.-Y. et al. “**Demonstration of a compiled version of Shor’s quantum factoring algorithm using photonic qubit**s.” _Phys. Rev. Lett._ 99, 250504 (2007).
6.  Lanyon, B.P. et al. “**Experimental demonstration of a compiled version of Shor’s algorithm with quantum entanglement.**” _Phys. Rev. Lett._ 99, 250505 (2007).
7.  Martin-Lopez, E. et al. “**Experimental realization of Shor’s quantum factoring algorithm using qubit recycling**.” _Nature Photonics_ 6, 773–776 (2012).
8.  Lucero, E. et al. “**Computing prime factors with a Josephson phase qubit quantum processor**.” _Nature Physics_ 8, 719–723 (2012).
9.  Monz, T. et al. “**Realization of a scalable Shor algorithm.**” _Science_ 351, 1068–1070 (2016).
10.  Amico, M., Saleem, Z.H. & Kumph, M. “**Experimental study of Shor’s factoring algorithm using the IBM Q Experience**.” _Phys. Rev. A_ 100, 012305 (2019).
11.  Skosana, U. & Tame, M. “**Demonstration of Shor’s factoring algorithm for N = 21 on IBM quantum processors.**” _Scientific Reports_ 11, 16599 (2021).
12.  Xu, N. et al. “**Quantum factorization of 143 on a dipolar-coupling nuclear magnetic resonance system.**” _Phys. Rev. Lett._108, 130501 (2012).
13.  Dattani, N. & Bryans, N. “**Quantum factorization of 56153 with only 4 qubits.**” arXiv:1411.6758 (2014).
14.  Yan, B. et al. “**Factoring integers with sublinear resources on a superconducting quantum processor**.” arXiv:2212.12372 (2022).
15.  Gidney, C. & Ekerå, M. “**How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits**.” _Quantum_ 5, 433 (2021).
