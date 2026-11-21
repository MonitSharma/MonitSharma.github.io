---
title: The Fault in our Qubits
slug: the-fault-in-our-qubits
date: 2026-03-29T00:00:00.000Z
status: published
series: Quantum Factoring
series_order: 3
excerpt: What It Would Actually Take to Break RSA with a Quantum Computer
tags:
  - quantum factoring
  - Shor's algorithm
  - resource estimation
  - public explainer
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/the-fault-in-our-qubits/
medium_url: https://medium.com/@_monitsharma/the-fault-in-our-qubits-8c66ef11f0c5?source=rss-f5df08a10024------2
draft: false
---

#### What It Would Actually Take to Break RSA with a Quantum Computer

![](https://cdn-images-1.medium.com/max/1024/1*dTv69OJVbyQhm5A61NQkXA.png)

> Part 3 of a three-part series on Shor’s algorithm and quantum factoring. [Part 1: “Sometimes it’s too Slow…, For Shor](https://medium.com/@_monitsharma/sometimes-its-too-slow-for-shor-c01677032324)”, covered our hardware results on IBM Heron processors. [Part 2: “The Emperor Has No Factors”](https://medium.com/@_monitsharma/the-emperor-has-no-factors-9eaec0d9bd0d) demonstrated that every published quantum factoring experiment has a null false-positive rate so high that random measurement outcomes would have succeeded.

### Where We Left Off

In [Part 1](https://medium.com/@_monitsharma/sometimes-its-too-slow-for-shor-c01677032324), we ran Shor’s algorithm on IBM’s best available hardware, Heron processors on ibm\_torino and ibm\_fez , and watched it struggle to factor 15. In [Part 2](https://medium.com/@_monitsharma/the-emperor-has-no-factors-9eaec0d9bd0d), we showed that it doesn't much matter: every published quantum factoring experiment from Vandersypen (2001) through Skosana & Tame (2021) has null false-positive rates so high that the classical post-processing, not the quantum computation, is doing the heavy lifting. Skosana and Tame's factorization of 21 literally cannot fail — all eight possible measurement outcomes yield correct factors under standard continued-fractions recovery.

So: the toy experiments don’t work well on real hardware, and even when they do “work,” they aren’t demonstrating what they claim to demonstrate.

The natural question is: _what would it actually take?_

Not to factor 15. Not to factor 21. But to factor an RSA-2048 key — the kind of number whose intractability underwrites the security of the internet. This is the question that turns quantum factoring from a physics curiosity into an engineering specification. And the answer, as we’ll see, is sobering.

### The Scaling Wall

Shor’s algorithm is polynomially efficient in theory. Factoring an _n_\-bit number requires O(_n_³) gates in the textbook construction, or O(_n_² log _n_) with the optimizations of [Gidney and Ekerå (2021)](https://quantum-journal.org/papers/q-2021-04-15-433/). Polynomial scaling sounds manageable. It is not.

The polynomial sits on top of enormous constants, and even polynomial growth becomes punishing when the base input is 2,048 bits and every logical operation must be protected by layers of error correction. Here is what the resource curve looks like when you actually compute it:

![](https://cdn-images-1.medium.com/max/1024/1*5Gq7txAnWTdKLQKARHzqYg.png)

Physical qubits, gate counts, and estimated runtime for factoring numbers of increasing size using optimized Shor’s algorithm with surface code error correction. The dashed red lines mark current hardware capabilities. Note: this is polynomial scaling in the complexity-theoretic sense, but the constants and error-correction overhead make it formidable in practice.

The three panels tell the same story from different angles. Current superconducting platforms range from roughly 100 to 1,000 physical qubits, depending on whether one prioritizes performance or raw scale — IBM’s highest-fidelity Heron processors sit at 133–156 qubits, while their largest chip (Condor) reached 1,121 qubits with reduced per-qubit performance. Factoring an RSA-2048 key requires, by the most careful estimates, somewhere between 100,000 and 20 million physical qubits depending on the error correction architecture assumed (more on this shortly). Current circuits decohere after about 100 operations. RSA-2048 demands billions of Toffoli gates. The ratio between where we are and where we need to be is not a gentle slope — it spans multiple orders of magnitude in every dimension.

This table makes the scaling concrete. Throughout this post, we use the Gidney-Ekerå 2021 resource model as our primary reference point for consistency, it remains the most widely cited and carefully validated estimate, and its assumptions are transparent. We’ll address more recent (and more aggressive) estimates below.

![](https://cdn-images-1.medium.com/max/1024/1*OzlDWJ0JC8bTEruoVK3FqQ.png)

Estimates from our simplified scaling model (optimized Shor’s-style arithmetic, surface code at p = 10⁻³). These are lower bounds: the model counts Toffoli gates and QEC cycle time but does not model magic state factory throughput, lattice surgery routing, or repeated-attempt overhead. For RSA-2048, the full Gidney-Ekerå 2021 analysis — which does account for these factors — gives ~20M physical qubits, ~2.7B Toffoli gates, and ~8 hours of runtime. Our model’s 41.5 minutes and 27.5M qubits differ because it trades a cruder factory model for transparency across the full range of bit sizes.

A few things to notice. First, the jump from 4-bit to 2048-bit factoring isn’t a matter of “scaling up” in any normal engineering sense. You need roughly 17,000× more physical qubits, and your gate count goes from single digits to tens of millions. Second, even the 256-bit entry, which would be trivially factorable classically, already demands nearly a million physical qubits. The quantum advantage over classical factoring doesn’t even begin to matter until numbers exceed roughly 800–1000 bits, by which point the quantum machine is a warehouse-scale installation.

### A Moving Target: Newer Estimates

The 20-million-qubit figure from Gidney-Ekerå 2021 is not the last word. Resource estimates have been falling as algorithmic and error-correction techniques improve, a trend worth tracking honestly.

In M[ay 2025, Craig Gidney published an updated](https://arxiv.org/abs/2505.15917) analysis showing that RSA-2048 could be factored with fewer than one million noisy qubits in under a week, a 20× reduction in qubit count from his 2021 estimate. The reduction comes from three innovations: approximate residue arithmetic that avoids storing full 2048-bit numbers in quantum registers, yoked surface codes that triple the storage density of idle qubits, and magic state cultivation that dramatically reduces the overhead of producing the non-Clifford resource states needed for Toffoli gates. The tradeoff is longer runtime, roughly a week instead of eight hours, but a week is still operationally relevant for an attacker.

More recently, in February 2026, [Webster et al. proposed the “Pinnacle Architecture”](https://arxiv.org/abs/2602.11457) using quantum LDPC codes instead of surface codes, arguing that RSA-2048 could be factored with fewer than 100,000 physical qubits and a runtime of about one month. This is another order-of-magnitude reduction, but it relies on QLDPC codes that have not been demonstrated in hardware and require non-local qubit connectivity that current superconducting platforms do not support.

These estimates move in one direction — down — and they deserve to be taken seriously. But two things remain constant across all of them. First, every estimate assumes a uniform physical error rate of 10⁻³ sustained across the entire machine for the full duration of the computation. Second, every estimate requires fault-tolerant quantum error correction operating reliably at scale, which no experiment has yet demonstrated. The qubit count is falling; the engineering difficulty is not.

### Mind the Gap

With that context, here is what the gap looks like using the Gidney-Ekerå 2021 reference point:

![](https://cdn-images-1.medium.com/max/1024/1*-uF1IEYxnJeh_CUEzEv0Ow.png)

Current quantum hardware capabilities (blue) compared to the requirements for factoring RSA-2048 (red), plotted on a logarithmic scale using the Gidney-Ekerå 2021 estimate. “QEC Round Depth” measures sequential error-correction rounds (~3 per Toffoli via lattice surgery), distinct from raw Toffoli count. Under the more recent Gidney 2025 estimate, the qubit gap shrinks from 4.3 to ~2.9 orders of magnitude — still enormous, but meaningfully smaller.

The qubit gap against the 2021 estimate is 4.3 orders of magnitude. Against the 2025 estimate, it’s ~2.9 orders of magnitude. Against the (as yet theoretical) Pinnacle architecture, it’s ~1.9. The QEC depth gap, measuring sequential error-correction rounds, not raw gate count — is 7.9 orders of magnitude. These are not gaps that close with a generation or two of hardware improvement, though the algorithmic progress is clearly working to narrow them.

Consider an analogy. In 1903, the Wright brothers flew 120 feet. A Boeing 787 flies 7,600 miles, a factor of about 330,000×, or 5.5 orders of magnitude. That gap was closed in 110 years of sustained aerospace engineering. Even the most aggressive current quantum factoring estimate (Pinnacle, ~100K qubits) still requires roughly a 100× improvement over the largest current hardware — and that gap must be closed in a fundamentally different technological regime where scaling is constrained by quantum coherence, not just structural engineering.

### The Error Correction Tax

The raw qubit and gate counts are only half the story. Every logical qubit in a fault-tolerant quantum computer is not a single physical qubit, it’s an elaborately encoded structure of many physical qubits, designed to detect and correct errors faster than they accumulate.

The leading approach is the surface code, which arranges physical qubits on a 2D grid and uses repeated “syndrome measurements” to catch errors. The code’s error-correcting power is governed by its _distance_ d: a distance-d surface code can correct up to ⌊(d-1)/2⌋ errors per round. Higher distance means better protection, but also more physical qubits — roughly 2d² per logical qubit.

![](https://cdn-images-1.medium.com/max/1024/1*EXKEeMbdfKr_tidtZKXdqg.png)

Left: Logical error rate as a function of surface code distance for different physical error rates. Crossing below the RSA-2048 target (~10⁻¹⁵ per round) requires distance 17–27 depending on physical error rate. Right: The physical qubit overhead per logical qubit. At distance 27, each logical qubit costs 1,458 physical qubits.

Here is the key tension. Current hardware achieves physical error rates around 10⁻³ (0.1%) on the best qubit pairs. This is below the surface code threshold (~1%), which means error correction can in principle work. But “in principle” does a lot of heavy lifting in that sentence. At p = 10⁻³, achieving the per-round logical error rate needed for RSA-2048 factoring requires code distance ~27. That’s 1,458 physical qubits per logical qubit — before accounting for magic state distillation factories, routing overhead, and ancilla qubits.

The multiplication is unforgiving: 14,532 logical qubits × 1,458 physical/logical × 1.3 factory overhead ≈ 27.5 million physical qubits.

And this assumes that the physical error rate holds at 10⁻³ across all those qubits simultaneously. Current hardware can sustain this error rate on individual qubit pairs in carefully calibrated devices of ~100–1000 qubits. Whether it can be sustained across a million-qubit machine — let alone 20 million, is an open and deeply non-trivial engineering question. Error rates tend to degrade as systems scale: crosstalk, frequency collisions, control line interference, and thermal management all get worse with size. The assumption of a uniform 10⁻³ across a large machine is not a physical law. It is an engineering aspiration with no current evidence behind it.

Newer approaches like QLDPC codes (used in the Pinnacle architecture) promise to reduce this overhead dramatically by encoding more logical information per physical qubit. But they introduce their own challenges — notably requiring non-local qubit connectivity that no current superconducting platform provides.

### When Might We Get There?

It’s tempting to extrapolate historical trends and declare a timeline. Let’s do it, with full acknowledgment that such extrapolations are worth approximately what you pay for them.

![](https://cdn-images-1.medium.com/max/1024/1*i1cFLojO5vIsU4bzYOyF9g.png)

Left: Historical qubit counts with exponential extrapolation fitted to achieved systems only (blue circles). Planned/roadmap systems (orange diamond) are shown separately. Three target lines correspond to three resource estimates for RSA-2048 factoring. Right: Two-qubit gate error rate trajectory, with rates already approaching the assumed 10⁻³ threshold.

The qubit count has been roughly doubling every 1.1 years among achieved systems since 2016. If this trend continues; a large “if”, we’d reach the Gidney 2025 target of one million physical qubits around 2035, or the 2021 target of 20 million around 2040. Error rates have been halving roughly every 1.3 years, with the best reported two-qubit gate errors on select qubit pairs now at or slightly below 10⁻³.

But these extrapolations smuggle in assumptions that deserve scrutiny.

**Qubit count scaling is not just “more of the same.”** Going from 1,000 to 1,000,000 qubits isn’t like going from 1 to 1,000 transistors on a chip. Quantum systems face qualitatively different scaling challenges: maintaining coherence across a large system, distributing control signals without introducing crosstalk, managing the classical processing needed for real-time error correction decoding, and physically cooling the entire apparatus to 15 millikelvin. These are not problems that yield to Moore’s Law extrapolation.

**Error rates must be sustained, not just achieved.** The best reported two-qubit error rates come from hand-picked qubit pairs on small devices. The median error rate across a full 1,000-qubit chip is considerably worse. Scaling to millions of qubits while maintaining uniformly low error rates is a materials science, fabrication, and control engineering challenge of a fundamentally different character than achieving low error rates on a few qubits.

**The timeline assumes no plateaus.** Exponential trends in technology famously hit walls, clock speeds plateaued in the mid-2000s, Dennard scaling ended, and many quantum hardware metrics have already shown signs of leveling off at certain technology nodes. Extrapolating the 2016–2023 trend line out by another decade or more assumes uninterrupted exponential improvement, which is historically unusual for any technology.

A realistic assessment: the _earliest_ plausible date for a cryptographically relevant quantum factoring demonstration depends heavily on which resource estimate you believe. Under the Gidney 2025 model, if everything goes well, the hardware might exist by the late 2030s. Under the 2021 model, the early 2040s. Under more conservative assumptions about scaling, later still. Whether current superconducting architectures can scale all the way to this regime, sustaining the required error rates across millions of qubits for days of continuous operation, remains an open question.

### What the Experiments Actually Show

Let’s be fair to the experimentalists. Published quantum factoring experiments, for all their limitations as factoring demonstrations, are not scientifically worthless. They serve a different purpose than what their titles claim.

![](https://cdn-images-1.medium.com/max/1024/1*S53xWOqv6pLIAMbeXBvgkw.png)

Published factoring experiments (blue circles, sized by year) plotted against the resource requirements for meaningful factoring targets (diamonds) and RSA-2048 (stars — red for the 2021 estimate, green for 2025). The dashed diagonal line is an illustrative guide, not a precise boundary. The gap between the experimental cluster in the bottom-left and the targets is vast — but the experiments were never really competing on this axis.

The cluster of published experiments in the bottom-left corner of this figure lives in a completely different regime from even the most modest useful factoring target. Every published experiment uses fewer than 10 qubits and fewer than 300 gates. The nearest meaningful target (16-bit factoring, which is still trivially classical) requires 21,000 physical qubits.

But these experiments do demonstrate gate calibration quality, qubit connectivity in specific topologies, control system precision for textbook quantum algorithms, and measurement readout fidelity. These are legitimate hardware characterization milestones. The problem is not the experiments themselves, it’s the framing. When a paper’s title says “Factoring N=21 on a quantum computer,” readers (and journalists, and policymakers, and investors) understandably interpret this as progress toward breaking cryptography. As we showed in [Part 2](https://medium.com/@_monitsharma/the-emperor-has-no-factors-9eaec0d9bd0d), it is nothing of the sort. A more honest framing would be: “Demonstrating a 5-qubit circuit of depth 20 on superconducting hardware, using the Shor factoring circuit for N=21 as a benchmark.”

### An Illustrative Scorecard

How close are we, really? The following radar chart gives a rough visual summary. A caveat: three of the six axes (gate fidelity, connectivity, and error correction) are editorial estimates rather than computed ratios, so this figure should be read as an illustration of relative maturity across dimensions, not as a precise measurement.

![](https://cdn-images-1.medium.com/max/1024/1*D3Ks62qvAcaGfR9t6_hO-Q.png)

Current quantum hardware capabilities as an approximate fraction of RSA-2048 requirements across six dimensions. Axes labeled “log ratio” are computed from log₁₀(current/required); axes labeled “estimated” are editorial assessments. Gate fidelity is the closest to target; error correction capability is the furthest.

The chart illustrates a pattern of deeply uneven progress. Gate fidelity, the dimension that gets the most attention in press releases, is the closest to where it needs to be. Individual two-qubit gates on the best devices are within an order of magnitude of the Gidney-Ekerå requirement. This is a real achievement.

But gate fidelity is the easier part. The dimensions that matter most for practical error-corrected computation, circuit depth, connectivity, coherence time, and above all error correction at scale, lag far behind. And these are the dimensions where progress is hardest, because they involve systems-level engineering challenges rather than individual-component optimization.

On error correction specifically: Google’s Willow chip showed below-threshold scaling for a memory-style surface-code experiment, logical error rates decreasing with increasing code distance, which is an important step. But a memory experiment and a computation are very different things. Demonstrating logical error suppression during storage is not the same as maintaining it through a long algorithmic computation with real-time decoding and feed-forward. The gap between “error correction works on a stored state” and “error correction works throughout a multi-billion-gate algorithm” remains large and largely unexplored experimentally.

### What Would a Meaningful Demonstration Look Like?

Given everything we’ve established across this series, what would it take for a quantum factoring experiment to actually mean something? Here are the criteria:

**1\. Factor a number that’s too large for the null test to save you.** As we showed in [Part 2](https://medium.com/@_monitsharma/the-emperor-has-no-factors-9eaec0d9bd0d), the continued-fractions post-processing pipeline is so forgiving that random measurement outcomes succeed with high probability for small numbers. A meaningful experiment needs to factor a number large enough that the null false-positive rate is negligible, which means using enough precision qubits that random guessing would almost certainly fail. For N=15, you’d need at least t=8 precision qubits to get the null rate below 5%. For larger N, even more.

**2\. Factor a number whose factors weren’t used to build the circuit.** Every published experiment compiles the modular exponentiation circuit using knowledge of the factors. This is necessary for circuit optimization in the near term, but it means the factors are baked into the hardware before a single qubit is measured. A truly meaningful demonstration would use a general-purpose modular exponentiation circuit, which is exactly the circuit that requires millions of qubits.

**3\. Demonstrate that the quantum computation is doing work that a classical null model cannot.** Report the null false-positive rate alongside the experimental success rate. Show that the experiment outperforms random guessing through the same post-processing pipeline. This is such a basic scientific control that its absence from two decades of literature is remarkable.

**4\. Beat classical factoring.** Ultimately, the only meaningful benchmark for quantum factoring is factoring a number that classical algorithms cannot. [The current classical factoring record is RSA-250 (829 bits), achieved in 2020 using roughly 2,700 CPU-core-years](https://phys.org/news/2020-03-cryptographic.html). Any quantum factoring demonstration on a number below ~800 bits is, by definition, slower than a classical computer, so it’s a demonstration of quantum hardware, not quantum advantage.

No current or near-term experiment meets any of these criteria. Nor is any expected to within the next decade.

### What This Means for Cryptography

Should we be worried about Shor’s algorithm breaking RSA? The honest answer depends on your time horizon.

**In the next 10 years (2025–2035):** No. Even the most aggressive resource estimates (Pinnacle’s ~100K qubits) describe hardware that does not exist and requires error-correction architectures that have not been demonstrated. NIST’s ongoing migration to post-quantum cryptographic standards is prudent and well-timed, but it is driven by the “harvest now, decrypt later” threat model, where adversaries collect encrypted data today to decrypt it when quantum computers eventually arrive, not by any imminent capability.

**In the next 20 years (2035–2045):** Possibly, but far from certain. If qubit counts and error rates continue improving at historical rates, and if architectural breakthroughs in error correction close the gap faster than surface code scaling suggests, a demonstration on a number in the hundreds-of-bits range might become feasible. This would be scientifically momentous but not yet cryptographically relevant. The falling resource estimates (20M → <1M → <100K) suggest that algorithmic progress may close the gap faster on the qubit-count axis than hardware alone would predict.

**In the next 30+ years (2045+):** Unknown. Predicting technology three decades out is a fool’s errand. It’s possible that entirely different quantum computing architectures (topological qubits, photonic systems, new error correction schemes) will change the calculus in ways we can’t anticipate. It’s also possible that quantum computing will hit fundamental scaling walls that make fault-tolerant computation at the required scale permanently impractical.

The responsible conclusion is: migrate to post-quantum cryptography because it’s cheap insurance, not because the threat is imminent. And be deeply skeptical of anyone claiming quantum computers will break RSA by 2030. They won’t.

### Conclusions: Honesty as a Service

Across three blog posts, I’ve tried to do something simple: be honest about quantum factoring.

In [Part 1](https://medium.com/@_monitsharma/sometimes-its-too-slow-for-shor-c01677032324), I showed that Shor’s algorithm on real hardware produces noisy, unreliable results — even for numbers small enough to factor on a pocket calculator. In [Part 2](https://medium.com/@_monitsharma/the-emperor-has-no-factors-9eaec0d9bd0d), I showed that two decades of published “quantum factoring” experiments are undermined by a null hypothesis that nobody checked: classical post-processing succeeds on random input with probability 25–100%, making the quantum computation irrelevant. And in this post, I’ve shown that the gap between these toy experiments and anything cryptographically meaningful spans multiple orders of magnitude in every relevant dimension, even as algorithmic improvements steadily narrow it.

None of this means quantum computing is a fraud or a dead end. Quantum hardware has made real, impressive progress on metrics that matter: gate fidelities, qubit counts, coherence times, and initial error correction demonstrations. Headline qubit estimates for quantum factoring have fallen by roughly two orders of magnitude in five years, from 20 million (Gidney-Ekerå 2021, surface codes) to under 100,000 (Pinnacle 2026, QLDPC codes), driven by genuine algorithmic and architectural innovation across increasingly aggressive assumptions. These are legitimate achievements. But they are achievements in understanding how to _design_ a future quantum computer, not achievements in _building_ one that can factor cryptographically relevant numbers. The persistent conflation of “we ran a circuit” with “we factored a number” has done the field no favors.

The path from factoring 15 to factoring an RSA key is not a path you walk. It’s a path you build, one breakthrough at a time, and we are very early in the construction. Recognizing this is not pessimism. It’s the kind of clear-eyed engineering assessment that good work requires. The quantum computing community has earned enough real achievements to afford honesty about the ones it hasn’t.

All code, data, and figures for this series are available at \[[Github](https://github.com/MonitSharma/medium_articles/tree/main/sometimes-too-slow-for-shor)\]. The resource estimation engine (resource\_estimation.py) and figure generation script (generate\_figures.py) are fully reproducible. We welcome corrections.

**Series Navigation:**

-   **Part 1:** Sometimes It’s too Slow…For Shor→ _\[_[_link_](https://medium.com/@_monitsharma/sometimes-its-too-slow-for-shor-c01677032324)_\]_
-   **Part 2:** The Emperor Has No Factors → _\[_[_link\]_](https://medium.com/@_monitsharma/the-emperor-has-no-factors-9eaec0d9bd0d)
-   **Part 3:** The Fault in Our Qubits ← _You are here_

### Citation

If this code or analysis framework is useful in your work, please cite it as:

Monit Sharma. “The Fault in our Qubits: What It Would Actually Take to Break RSA with a Quantum Computer”, GitHub repository,2026 \[[https://github.com/MonitSharma/medium\_articles/tree/main/sometimes-too-slow-for-shor](https://github.com/MonitSharma/medium_articles/tree/main/sometimes-too-slow-for-shor)\]

You can also use the following BibTeX entry:

@misc{sharma2026shorfault,  
 author = {Monit Sharma},  
 title = {The Fault in our Qubits: What It Would Actually Take to Break RSA with a Quantum Computer},  
 year = {2026},  
 howpublished = {\\url{https://github.com/MonitSharma/medium\_articles/tree/main/sometimes-too-slow-for-shor}},  
 note = {GitHub repository}

### References

1.  Gidney, Craig, and Martin Ekerå. “**How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits**.” _Quantum_ 5 (2021): 433.
2.  Gidney, Craig. “**How to factor 2048 bit rsa integers with less than a million noisy qubits (2025).**” _arXiv preprint arXiv:2505.15917_.
3.  Webster, Paul, et al. “**The Pinnacle Architecture: Reducing the cost of breaking RSA-2048 to 100 000 physical qubits using quantum LDPC codes.**” _arXiv preprint arXiv:2602.11457_(2026).
4.  Monit Sharma. “**Sometimes It’s Too Slow… for Shor: Factoring Numbers on IBM Quantum Hardware with Honest Metrics.”**  
    [GitHub repository, 2026](https://github.com/MonitSharma/medium_articles/tree/main/sometimes-too-slow-for-shor).
5.  Monit Sharma. “**The Emperor Has No Factors:What Happens When You Apply Honest Metrics to Every Published Shor’s Result**”  
    [GitHub repository, 2026](https://github.com/MonitSharma/medium_articles/tree/main/sometimes-too-slow-for-shor).

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=8c66ef11f0c5)
