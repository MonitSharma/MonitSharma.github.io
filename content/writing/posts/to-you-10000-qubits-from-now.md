---
title: To You, 10,000 Qubits From Now
slug: to-you-10000-qubits-from-now
date: 2026-04-01T00:00:00.000Z
status: published
series: Quantum Factoring
series_order: 4
excerpt: Inside the Most Ambitious Resource Estimate for Quantum Factoring Ever
  Published
tags:
  - quantum factoring
  - Shor's algorithm
  - resource estimation
  - neutral atoms
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/to-you-10000-qubits-from-now/
medium_url: https://medium.com/@_monitsharma/to-you-10-000-qubits-from-now-9ba48f323ecb?source=rss-f5df08a10024------2
draft: false
---

#### Inside the Most Ambitious Resource Estimate for Quantum Factoring Ever Published

![](https://cdn-images-1.medium.com/max/1024/1*fECLrsjke0RZxozcirLgWg.png)

> This is Part 4 of my series on Shor’s algorithm and the state of quantum factoring. [Part 1: “Sometimes its too slow…,For Shor](https://medium.com/@_monitsharma/sometimes-its-too-slow-for-shor-c01677032324)”, established that current hardware can barely factor 15. [Part 2: “The Emperor Has No Factors”](https://medium.com/@_monitsharma/the-emperor-has-no-factors-9eaec0d9bd0d) showed that most published quantum factoring claims can’t survive a null-baseline test. [Part 3: “The Fault in Our Qubits”](https://medium.com/@_monitsharma/the-fault-in-our-qubits-8c66ef11f0c5) quantified the engineering gap between today’s machines and cryptographically relevant factoring. This post examines a new paper that claims to dramatically narrow that gap.

On March 31, 2026 — after I published Part 3 of this series about the vast engineering chasm separating current quantum hardware from useful factoring — a team from [Oratomic](https://www.oratomic.com/) and Caltech [dropped a paper claiming Shor’s algorithm is possible with “as few as 10,000 reconfigurable atomic qubits.”](https://arxiv.org/abs/2603.28627v1)

**Ten thousand.**

In Part 3, I anchored my scaling analysis to Gidney’s 2025 estimate of roughly one million qubits for RSA-2048 factoring, noting Webster et al.’s 2026 Pinnacle architecture had pushed that down to around 100,000 qubits with quantum LDPC codes. The trajectory was clear: the number was falling, but the gap to reality remained enormous.

Now Cain, Xu, King, and collaborators — a team including [John Preskill](https://scholar.google.com/citations?user=K2BMBtcAAAAJ&hl=en) and several researchers behind some of the most important neutral-atom quantum computing results of the past three years — are claiming another order-of-magnitude reduction. If true, this would place the qubit count for breaking real cryptography within shouting distance of systems that have _already been demonstrated_ in the lab, at least in raw qubit count.

> That’s an extraordinary claim. It deserves extraordinary scrutiny.

Here’s the punchline up front: the paper contains genuinely impressive theoretical contributions in quantum error-correcting code construction, architecture design, and compilation. The authors are transparent about their assumptions to a degree that is, frankly, refreshing. But the “10,000 qubits” headline, the number that will circulate on social media, get cited in policy briefs, and alarm cryptographers, tells a story that the paper’s own tables contradict. The full picture is more nuanced, more interesting, and more honest than the headline.

Let’s read the fine print.

### What the Paper Actually Claims

The paper, “**Shor’s algorithm is possible with as few as 10,000 reconfigurable atomic qubits**,” proposes fault-tolerant quantum computing architectures built on reconfigurable neutral-atom arrays. The core technical contributions are:

1.  **High-rate quantum error-correcting codes.** The authors develop new constructions of lifted-product (LP) codes with encoding rates of approximately 30%, meaning roughly 30% of the physical qubits carry logical information, compared to about 4% for the bi-variate bicycle codes used in other recent proposals, and effectively less than 1% for surface codes. They present three main memory codes: a \[\[2610, 744, ≤16\]\] code, a \[\[4350, 1224, ≤20\]\] code, and a \[\[5278, 1480, ≤24\]\] code. These are substantial codes, encoding over a thousand logical qubits each, with extrapolated block error rates reaching 10⁻¹¹ per cycle at 0.1% physical error rates.
2.  **A zoned architecture.** The proposed quantum computer is divided into four functional zones: a **memory zone** for storing logical qubits during computation, a **processor zone** for active computation on smaller code blocks, an **operation zone** containing ancilla qubits for performing code surgery (the mechanism by which logical operations are executed), and a **resource zone** for generating the magic states needed for non-Clifford operations. This is a clean, modular design that leverages the reconfigurability of neutral-atom arrays — atoms can be physically moved between zones during computation.
3.  **A compilation strategy.** Circuits are broken into sub-circuits that fit inside the processor code, teleported from memory to processor, computed upon, and teleported back. This is clever because it means the expensive code surgery operations scale with the processor code size, not the memory code size.
4.  **Resource estimates for RSA-2048 and ECC-256.** The paper evaluates several architectures with different space-time tradeoffs, using state-of-the-art circuit constructions from the literature.

So far, so good. The technical machinery is serious, the code constructions are novel, and the architecture is thoughtfully designed. Now let’s look at the numbers.

### The Headline vs. The Table: A Space-Time Tradeoff You Can’t Ignore

Here is the central tension of this paper, laid out in the authors’ own data. The paper presents four classes of architecture for each cryptographic target. Let me reconstruct the key numbers from their Figure 3 and Extended Data Table IV:

![](https://cdn-images-1.medium.com/max/1024/1*kfQiESIdu4_OWTnQ-5wbpQ.jpeg)

The “_as few as 10,000 qubits_” claim corresponds to the **space-efficient ECC-256 architecture** with **9,739 qubits**. That’s technically correct. But the runtime for this architecture is approximately 1,000 days, nearly three years of continuously error-corrected, sustained fault-tolerant quantum computation.

For the problem most people actually care about, RSA-2048; the 10,000-qubit regime means a runtime of 118 years.

The more time-relevant scenarios in the paper, weeks to months rather than years or decades, require roughly 26,000 qubits for ECC-256 and 102,000 for RSA-2048, though the authors explicitly describe those time-efficient estimates as preliminary. These are still remarkable numbers, far below the million-qubit estimates that dominated the literature until recently. But they are not 10,000.

This is not a minor distinction. The difference between “_we need 10,000 qubits_” and “_we need 100,000 qubits_” is the difference between a system that looks tantalizingly close to demonstrated capabilities ([6,100 trapped atoms have been shown in a single array](https://www.nature.com/articles/s41586-025-09641-4)) and one that requires significant further scaling. The paper is transparent about all of this, the tables are right there. But the title, abstract, and framing all lead with the small number.

To be clear, the authors do note in the abstract that “_increasing the number of physical qubits improves time efficiency by enabling greater parallelism_” and provide the 26,000-qubit ECC-256 figure alongside the headline. The data is honestly presented. The framing choices, however, are worth examining.

### The Assumption Stack

Every resource estimate is only as strong as its assumptions. This paper is built on several layers of assumptions, each of which deserves individual examination. I’ll organise them from most to least well-established.

#### Assumption 1: 0.1% Physical Error Rates Across the Full System

The paper’s code performance analysis assumes a uniform depolarizing noise model with physical error rate _p = 0.1_% on entangling gates, state preparations, and measurements. The most aggressive architectures require physical error rates as low as _p = 0.048%_.

**Where does current hardware stand?** The paper itself cites [Bluvstein et al. (2026)](https://www.nature.com/articles/s41586-025-09848-5), which demonstrated below-threshold fault-tolerant operation on systems of up to _~448 atoms, “with a path to 10× below threshold_.” But below-threshold operation on hundreds of atoms is not the same as demonstrating the paper’s assumed ~0.1% physical error regime across a 10,000+ qubit system. The threshold depends on the code, decoder, circuit context, and noise model, it is not a simple conversion to a universal physical error rate number.

Critically, high-fidelity entangling operations have only been demonstrated on regions of a few hundred qubits. The paper acknowledges this: “_increasing laser power could directly enable operation on thousands of qubits._” But going from demonstrated fidelity at hundreds of qubits to sustained 0.1% error rates across 10,000+ qubits is not merely a matter of turning up the laser power. It requires maintaining coherence, calibration, and crosstalk suppression at a scale that hasn’t been attempted.

The paper makes an interesting argument about duty cycle: current systems use continuous-wave lasers with only 0.1% duty cycle (~200 ns gates separated by ≥200 μs idle periods), and rastering the beam dynamically could increase the number of addressable atoms by three orders of magnitude. This is a plausible path. It is not a demonstrated capability.

**Verdict:** The 0.1% assumption is aspirational but not unreasonable as a target for a purpose-built system. It requires a substantial improvement over current demonstrated fault-tolerant operation, extended from hundreds of active fault-tolerant qubits to systems in the 10,000+ range. The p = 0.048% required for some configurations is more aggressive still.

#### Assumption 2: 1 ms Stabilizer Measurement Cycle Time

The paper assumes a _1_ _ms_ cycle time for stabilizer measurements. Current neutral-atom systems require several milliseconds per cycle, bottlenecked by readout and atomic motion. The paper notes that “_realizing this in practice may require technological development_” — a diplomatic understatement.

This assumption matters because, at fixed fault-tolerant workload, runtime scales roughly linearly with cycle time. As a simple sensitivity check: the 97-day RSA-2048 figure at _1 ms_ would stretch to roughly 970 days at 10 ms, or about 2.7 years. The 10-day ECC-256 estimate would become 100 days. These rescalings are mine, not the paper’s stated estimates, but they illustrate how sensitive the runtime numbers are to this single parameter.

The paper’s outlook section discusses far more aggressive speedups: microsecond-scale readout (reducing measurement times by 1000×) and constant-velocity atom transport (potentially hundreds of times faster). If even a fraction of these improvements materialize, the 1 ms assumption would be conservative. But these are future hardware developments, not current capabilities.

**Verdict:** Optimistic but within reach. The 1 ms cycle time represents a moderate improvement over current systems, and the paper identifies concrete technical paths to achieving it.

#### Assumption 3: Block Error Rate Extrapolations

This is where things get more subtle. The paper’s resource estimates depend on extrapolating code performance to physical error rates that cannot be directly simulated. The extrapolation method is power-law fitting of the form y = ax^b, using data points from Monte Carlo simulations at higher error rates.

The authors are commendably transparent about the limitations here. For two of their three memory codes (lp₂₀ and lp₂₄), the fitted exponent b exceeds d/2, which is the theoretical maximum as p → 0. This means the standard fitting procedure produces unphysically optimistic extrapolations. The authors address this by conservatively fitting y = ax^(d/2) from the single smallest simulated error rate — a reasonable correction, but one that means the extrapolated performance rests on a single data point.

The lp₂₄ code’s extrapolated block error rate of ~10⁻¹¹ per cycle at p = 0.1% is what enables the extremely large Toffoli counts required for RSA-2048. If the actual performance at p = 0.1% is worse than extrapolated by even an order of magnitude, the required physical error rate tightens significantly.

**Verdict:** The extrapolation methodology is standard in the field and the authors handle the anomalous fits responsibly. But extrapolating over an order of magnitude in error rate from a handful of data points introduces genuine uncertainty that is difficult to quantify.

#### Assumption 4: Code Surgery Performance at Scale

The paper’s compilation strategy relies on code surgery, a technique for performing logical measurements by temporarily merging code blocks with ancilla systems. The authors construct and numerically benchmark surgery gadgets for their smallest processor code (the \[\[248, 10, ≤18\]\] bivariate bicycle code), demonstrating that surgery error rates are within an order of magnitude of the code’s idling error rate.

However, the larger surgery systems required for the balanced and time-efficient architectures are not numerically benchmarked. The paper states: “_We expect similar behavior for the larger gadgets… and leave detailed simulations to future work._” The operation zone construction relies on an algebraic framework from an _upcoming paper \[113\]_ that provides low-weight logical operator bases for LP codes. This is a critical dependency on unpublished work.

**Verdict:** The surgery framework is theoretically well-motivated and the small-scale benchmarks are encouraging. But the key resource cost estimates for larger architectures rest on extrapolation from small instances and unpublished constructions.

#### Assumption 5: Time-Efficient Architecture Viability

The most dramatic runtime reductions come from the “time-efficient” architectures, which assume highly parallel Toffoli gate execution. This requires:

1.  Parallel high-rate code surgery measuring many logical operators simultaneously, which has been demonstrated on ~10 PPMs for distance-~10 codes.
2.  Carry-lookahead adders replacing ripple-carry adders, reducing Toffoli depth from O(n) to O(log n).
3.  Factory codes encoding hundreds of logical qubits with 20–30% rates, referenced to codes in “_upcoming work \[125\]._”

The paper is explicit that these estimates are “preliminary and can be optimized in future work.” The parallel surgery techniques are referenced to prior work that has been benchmarked only at small scale. The carry-lookahead adder speedup estimate is computed as a proxy — the full circuit compilation has not been performed.

**Verdict:** The time-efficient architecture is the least mature component of the paper. It represents a plausible roadmap rather than a concrete proposal.

### The Code Constructions: What’s Genuinely New

With the caveats above established, let me give credit where it’s substantial. The lifted-product code constructions in this paper are a real contribution.

The key insight is that reconfigurable atom arrays provide exactly the kind of non-local connectivity that high-rate qLDPC codes need. Surface codes, the workhorses of most prior resource estimates, achieve less than 1% encoding rate because they require only local (nearest-neighbor) connectivity. Bivariate bicycle codes, used in IBM’s recent work and in the Pinnacle architecture, achieve about 4% rates with slightly more connectivity. The LP codes in this paper achieve ~30% encoding rates by exploiting the fully nonlocal, reconfigurable connectivity of atom arrays.

The numbers are striking. The lp₂₄ code (\[\[5278, 1480, ≤24\]\]) encodes 1,480 logical qubits in 5,278 physical qubits. A surface code with the same distance and number of logical qubits would require 161× more physical qubits, roughly 850,000. That’s where most of the qubit savings come from.

The codes are found using what the paper describes as an “_LLM-assisted heuristic computer search_” — an interesting methodological note suggesting that large language models were used in the code discovery process. The seed matrices for each code are explicitly provided (Appendix A), which is important for reproducibility.

The decoder design also leverages LLM-assisted search, using an ensemble of five belief propagation with localized statistics (BP-LSD) decoder instances, each operating under different noise assumptions. The ensemble approach, running decoders with optimistic, pessimistic, nominal, randomized, and perturbed probability models, is clever and practical.

### Where This Sits in the Resource Estimate Trajectory

The paper’s Figure 1b tells a remarkable story.

![](https://cdn-images-1.medium.com/max/453/1*cui60wl1uBxBF4nY_jxnPQ.png)

Figure 1b from the paper.

Resource estimates for cryptographically relevant Shor’s algorithm have dropped five orders of magnitude over two decades:

-   **2012 (Jones et al.):** ~10⁹ physical qubits
-   **2012 (Fowler et al.):** ~10⁸ physical qubits
-   **2017 (O’Gorman & Campbell):** ~10⁸ physical qubits
-   **2019 (Gidney & Ekerå):** ~2 × 10⁷ physical qubits
-   **2025 (Gidney):** ~10⁶ physical qubits
-   **2026 (Webster et al.):** ~10⁵ physical qubits (with non-local connectivity)
-   **2026 (This work):** ~10⁴ physical qubits (most space-efficient) to ~10⁵ (time-efficient)

Each step down involves a different category of improvement. The early reductions came from better surface code constructions and magic state distillation. Gidney’s 2025 work optimized within the surface code paradigm to reach ~1 million qubits. Webster et al. introduced qLDPC codes with small block sizes (~10 logical qubits per block) and quasi-local connectivity. This paper goes further with high-rate codes (hundreds to thousands of logical qubits per block) and fully nonlocal connectivity.

The critical observation from my [Part 3](https://medium.com/@_monitsharma/the-fault-in-our-qubits-8c66ef11f0c5) analysis still holds, but the landscape has shifted: the gap between “_qubits demonstrated in a lab_” and “_qubits needed for cryptography_” has narrowed from roughly four orders of magnitude to roughly one.

But, and this is essential, narrowing the gap in qubit _count_ does not proportionally narrow the gap in _engineering difficulty_. The 6,100-atom trapping array demonstrated by Manetsch et al. (2025) did not perform quantum computation. The fault-tolerant demonstrations by Bluvstein et al. (2026) achieved below-threshold operation on up to ~448 atoms, not the deep-below-threshold performance needed for the codes in this paper. Closing the remaining gap in qubit count while simultaneously achieving substantially better error rates across a far larger system, implementing novel code surgery protocols with only limited benchmarking so far, and sustaining all of this for days to months of continuous operation, that is a fundamentally different challenge than simply scaling up a trapping array.

### The Neutral-Atom Platform Argument

This paper is, at its core, an argument for neutral-atom quantum computing as the platform most likely to achieve utility-scale fault-tolerant computation. The case rests on several genuine advantages:

1.  **Reconfigurability.** Atoms can be physically moved during computation, enabling the non-local connectivity that high-rate codes require. This is a real structural advantage over superconducting qubits, which are fixed in place and limited to nearest-neighbor (or short-range) interactions. The paper’s entire architecture, with its memory, processor, operation, and resource zones, is designed around this mobility.
2.  **Identical qubits.** Unlike superconducting qubits, which must be individually calibrated and whose parameters drift, neutral atoms are fundamentally identical. This simplifies error correction protocols and enables global parallel control.
3.  **Scalable trapping.** Arrays of thousands of atoms have been demonstrated, and metasurface-based approaches could potentially scale to hundreds of thousands of traps.

These are legitimate advantages. They are also not the whole story. **Neutral-atom systems have significant disadvantages in clock speed (millisecond-scale operations vs. microsecond-scale for superconducting systems)**, **readout fidelity and speed, and the engineering complexity of maintaining a large-scale ultra-high-vacuum system with precision laser control over thousands of individual atoms for extended periods**.

The paper addresses clock speed by noting that hardware improvements (microsecond readout, constant-velocity transport) could eventually bring cycle times down by orders of magnitude. The outlook section even suggests that “_runtimes on the scale of hours or even minutes_” could be achievable with sufficient hardware development. These are aspirational projections, not engineering commitments, and should be understood as such.

### The Conflict of Interest Question

All nine authors of this paper are shareholders of Oratomic, Inc. Six are full-time employees, and three (including John Preskill and Manuel Endres) are part-time employees. Oratomic is developing fault-tolerant neutral-atom quantum computers. The paper concludes that “**appropriately designed neutral-atom architectures could support cryptographically relevant implementations of Shor’s algorithm**” — a conclusion directly aligned with Oratomic’s business thesis.

I want to be precise about what this does and does not mean.

It does _not_ mean the results are wrong. The technical contributions, the code constructions, the decoder design, the architecture, are presented with sufficient detail for independent verification. The authors are transparent about their affiliations, their assumptions, and the limitations of their estimates. The paper explicitly uses phrases like “s_ubstantial engineering challenges remain_,” “_although realizing this in practice may require technological development,_” and “_we emphasize that these estimates are preliminary._”

What it _does_ mean is that the framing choices, which number goes in the title, which runtime gets emphasized, how the comparison to existing hardware is drawn, should be read with awareness of this alignment. “_10,000 qubits_” in the title rather than “_26,000 to 102,000 qubits for time-relevant scenarios_” is a framing choice. It’s not dishonest, the 10,000-qubit architecture exists in their analysis, but it is the most optimistic credible framing of their results. This does not invalidate the analysis, but it does raise the importance of separating what the calculations show from how the results are packaged.

In the quantum computing space, these framing choices matter. The strongest version of this paper, the one most useful to the research community, leads with the space-time tradeoff matrix, not the minimum qubit count.

### What This Means for Cryptographic Risk

Throughout this series, I’ve been tracking how close quantum computers are to breaking real-world cryptography. Let me update the assessment with this paper’s data.

**ECC-256 (elliptic curve cryptography):** This is the more immediate target. The paper’s most credible attack scenario, the time-efficient architecture with ~26,000 qubits and ~10 days, requires:

-   26,000 physical qubits at 0.1% error rates, sustained for 10 continuous days
-   A 1 ms cycle time
-   Fully functional parallel high-rate code surgery at scale
-   Carry-look-ahead adder circuits that have been compiled but not fully benchmarked in this framework

If all assumptions are met, ECC-256 could fall within a few years of a purpose-built system becoming operational. The Babbush et al. (2026) compilation this relies on is itself very recent, suggesting the circuit-level optimization is still maturing.

**RSA-2048:** The paper’s fastest RSA-2048 attack requires ~102,000 qubits and 97 days, relying on the time-efficient architecture with P = 1,160 parallel Toffoli gates. Even the balanced architecture takes ~27 years. RSA-2048 remains substantially harder than ECC-256 — roughly two orders of magnitude more Toffoli gates (6.5 × 10⁹ vs. 9 × 10⁷) — and this paper doesn’t fundamentally change that ratio.

#### **Should cryptographers panic?**

No. But they should continue migrating to post-quantum standards, and this paper weakens the complacent view that cryptographically relevant Shor implementations are necessarily a distant-2040s issue under all architectures. The theoretical path from demonstrated hardware to cryptographic break has shortened dramatically. Whether the engineering can follow the theory is the open question, and it’s not one that any single paper can answer.

#### The honest assessment:

Under the stricter standard of a non-vacuous Shor implementation with genuine quantum contribution, the largest number factored on real hardware remains 15. The most credible path to breaking real cryptography requires sustained operation of tens of thousands of qubits at error rates substantially better than current demonstrations, for days at a time, using codes and surgery protocols that have been designed but not built. That’s a serious path. It’s not a short one.

### What I Would Want to See Next

As someone who has spent this series building tools to evaluate quantum factoring claims, here’s what I’d want to see to increase confidence in these estimates:

1.  **Large-scale code surgery benchmarks.** The paper benchmarks surgery on the smallest processor code (\[\[248, 10, ≤18\]\]). Benchmarking the larger surgery systems (the lp₂₀ processor code and the inter-zone operations) would substantially strengthen the resource estimates. The paper acknowledges this as future work.
2.  **End-to-end compiled circuits.** The amortized time-per-Toffoli estimates (Extended Data Table V) are computed from the dominant subroutines (adders and lookups), not from a full circuit compilation. An end-to-end compilation of even a small instance would validate the compilation strategy and time estimates.
3.  **Experimental demonstration of high-rate codes.** The LP codes are elegant in theory. Running even a small instance (say, the \[\[248, 10, ≤18\]\] bivariate bicycle code that’s used as a processor/factory code) on actual neutral-atom hardware would be a major milestone.
4.  **Independent reproduction of the code search.** The seed matrices are provided, which is excellent. Independent verification of the distance estimates (which use randomized algorithms and are upper bounds) would be valuable.
5.  **Publication of the upstream dependencies.** Several critical results reference papers “_in preparation_” — particularly **\[113\] (low-weight logical operator bases for LP codes)** and **\[125\] (atlas of fault-tolerant quantum memory codes)**. These do not invalidate the estimates, but they do mean some critical ingredients are not yet independently checkable in full detail.

### The Bigger Picture

I started this series by running Shor’s algorithm on real quantum hardware and finding that 15 was the largest number it could genuinely factor. In Part 2, I showed that most published quantum factoring “records” can’t survive a null-baseline test. In Part 3, I quantified the engineering gap — and found it enormous.

This paper represents the most serious theoretical effort to close that gap I’ve seen. The authors are some of the best in the field. The code constructions are novel. The architecture is thoughtful. The analysis is, by the standards of quantum computing resource estimates, unusually transparent about its assumptions and limitations.

And yet, the distance between this paper and a working quantum computer that breaks cryptography remains measured in fundamental engineering challenges, not incremental improvements. The codes haven’t been built. The large-scale parallel surgery assumptions underlying the fastest estimates have only limited numerical benchmarking so far. The error rates haven’t been achieved on large systems. The cycle times haven’t been demonstrated. The continuous operation for days hasn’t been attempted.

In [_Attack on Titan_](https://www.imdb.com/title/tt2560140/), the message sent across 2,000 years is a warning and a promise — proof that the future has already happened, that the path is determined, that the struggle matters precisely because its outcome is real. This paper is something similar: a message from a future that the authors can clearly see, built on physics and mathematics that are sound, transmitted through the noise of assumptions and engineering unknowns.

The question is not whether 10,000 qubits will eventually suffice — the trajectory of the field makes that increasingly plausible. The question is how many of the assumptions in the stack will survive contact with reality, and how long that contact will take. The paper itself, read honestly, suggests the answer is “_most of them, eventually_” and “_longer than the title implies._”

In the meantime, under the standard I’ve applied throughout this series — a non-vacuous Shor implementation with genuine quantum contribution — the largest number a quantum computer has factored remains 15. The gap is narrowing. The future is still arriving one noisy gate at a time.

### Appendix

#### Key Numbers at a Glance

![](https://cdn-images-1.medium.com/max/680/1*wJuvpeTcodd-dYFwy8Ti1g.png)

_The paper analyzed in this post is:_ [_Madelyn Cain, Qian Xu, Robbie King, Lewis R. B. Picard, Harry Levine, Manuel Endres, John Preskill, Hsin-Yuan Huang, Dolev Bluvstein, “Shor’s algorithm is possible with as few as 10,000 reconfigurable atomic qubits,” arXiv:2603.28627v1 \[quant-ph\], March 31, 2026._](https://arxiv.org/pdf/2603.28627v1)

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=9ba48f323ecb)
