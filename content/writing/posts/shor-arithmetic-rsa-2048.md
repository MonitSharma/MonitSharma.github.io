---
title: How we cut the cost of Shor’s arithmetic for RSA-2048
slug: shor-arithmetic-rsa-2048
date: 2026-11-09T00:00:00.000Z
status: published
series: Quantum Factoring
series_order: 5
excerpt: One quantum table lookup can serve several primes. At 1,806 logical
  qubits, that idea helped us cut the estimated Toffoli count by 46%.
tags:
  - quantum factoring
  - Shor's algorithm
  - resource estimation
  - quantum arithmetic
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/shor-arithmetic-rsa-2048/
medium_url: https://medium.com/@_monitsharma/how-we-cut-the-cost-of-shors-arithmetic-for-rsa-2048-8eca041d1408?source=rss-f5df08a10024------2
draft: false
---

#### One quantum table lookup can serve several primes. At 1,806 logical qubits, that idea helped us cut the estimated Toffoli count by 46%.

![RSA-2048 runtime versus physical qubits. Four blue stars show our surface-code, neutral-atom, Pinnacle 1.0 and cat-qubit estimates. The table pairs each with its reference.](https://cdn-images-1.medium.com/max/1024/1*Y9-3xwW_nnOX2HfFEwDqWw.png)

The stars mark four conditional hardware estimates using three circuits from our family. Each model uses its own timing, error and layout assumptions. The rows below the chart pair each scenario with the reference used in our paper. For cat qubits, varying the assumed overhead moves our estimate from 1.21 to 1.70 days, a range that includes the published two-engine estimate of 1.59 days.

Imagine asking a database for the same row eight times, once for each column you need. You could ask for all eight columns in one query. A similar opportunity turned up in the quantum arithmetic used to factor RSA-2048. The circuit was repeatedly looking up the same address in different tables. We packed the answers together.

We applied this idea to Craig Gidney’s 2025 construction for Shor’s algorithm in our paper, _Shared Lookups and Lazy Residues_. We also changed how the circuit stores and cleans up intermediate results. The goal was to lower the cost of the arithmetic that a fault-tolerant quantum computer would have to run. [Gidney’s reference construction](https://arxiv.org/abs/2505.15917)

### One address, several answers

Shor’s algorithm needs to work with powers of a number modulo the integer being factored. The reference circuit makes that arithmetic manageable by working with remainders modulo many small primes. Each prime has its own table, but in one costly stage, every table is addressed by the same chunk of exponent bits.

A Toffoli gate flips a target qubit when its two controls are both 1. Toffolis are costly to implement in many error-corrected architectures, so they’re a useful unit for comparing circuits.

In this construction, the Toffoli cost of the lookup itself is driven mainly by the number of possible addresses. The lookup can return a wider answer at roughly the same Toffoli cost. We put the entries for several primes side by side in each row and split the returned word into its pieces. The wider answer still takes extra workspace and has to be moved and used.

We isolated this change in a matched comparison. With the same lookup window, register trimming, and checkpoint settings, sharing one lookup across three primes reduced the estimated Toffoli count by **28.8%**.

### Keep the intermediate results and reduce once

Quantum arithmetic has a cleanup bill. Temporary registers have to be returned to zero while preserving the computation’s output and relative phases. In one stage of the reference circuit, the cleanup recomputes intermediate remainders. We keep those remainders as checkpoints instead. That uses extra qubits and lets us subtract the same values we added on the way forward.

Keeping the checkpoints also lets us postpone modular reduction. For example, 17 and 2 represent the same remainder modulo 5. If a register has room for the larger value, the circuit can carry it forward and reduce it when the next stage needs the usual remainder. These are our _lazy residues_. The paper proves that, under the stated register-width conditions, the changes preserve the reference output and its quantum phases.

![Flow diagram of the reference arithmetic. Shared lookups target loop 1. Checkpoints and lazy residues target loop 3 and its cleanup.](https://cdn-images-1.medium.com/max/1024/1*0mFCi6SI07PJjDUJ34HC1A.png)

From the paper. The reference circuit spends 55% of its Toffoli gates on the first lookup stage and 30% on cleaning up loop 3. The blue boxes show where the changes apply.

### What happens at the same qubit budget?

Giving the reference circuit more qubits can also reduce its gate count. We evaluated its published cost model over 534,240 retained parameter settings and used the cheapest reference setting that fit each budget. We estimated the costs of our circuits with a benchmark built on the reference simulator.

-   **1,461 logical qubits.** An estimated 5.08 billion Toffoli gates per factoring, down from 5.98 billion for the best reference setting in that budget. That’s a 15% reduction.
-   **1,806 logical qubits.** An estimated 2.55 billion Toffoli gates per factoring, down from 4.74 billion. That’s a 46% reduction.

Those figures count logical gates and include the expected cost of repeated shots. They come from resource estimates for RSA-2048. The paper reports sampling checks and validation on smaller circuits.

![The new circuit frontier is below the reference curve at the highlighted budgets, saving 15 percent at 1,461 logical qubits and 46 percent at 1,806.](https://cdn-images-1.medium.com/max/1024/1*V7lfYVDPfXBAdrWKwfpkbw.png)

From the paper. At a given logical qubit budget, the grey curve is the cheapest reference setting and the blue curve is the best circuit we benchmarked. The vertical gap shows the Toffoli savings.

### What would it take to run Shor’s algorithm on RSA-2048?

The numbers above describe the circuit: how many error-protected _logical qubits_ it needs and how many Toffoli gates it uses. A hardware estimate adds the _physical qubits_ needed to encode those logical qubits, detect errors, and supply the resources for gates. It also estimates elapsed time from the device’s speed, how much work can run in parallel, and how often the circuit has to be repeated. These studies model a future machine running the full computation. None reports an RSA-2048 factorization performed on hardware.

-   **Surface codes.** Gidney and Ekerå estimated about 20 million physical qubits and eight hours in 2021. Gidney’s 2025 design estimated fewer than a million physical qubits and less than a week under the same basic hardware assumptions. The later circuit uses more Toffoli gates and fewer factories to supply them, trading time for a smaller machine. [2021 study](https://quantum-journal.org/papers/q-2021-04-15-433/) · [2025 study](https://arxiv.org/abs/2505.15917)
-   **Neutral atoms.** Cain and colleagues model RSA-2048 designs with about 11,000–13,000 atoms whose runtimes stretch into decades. Their faster design projects 97 days with about 102,000 atoms by doing much more work in parallel. The models assume an error correction cycle of 1 millisecond. [Cain et al.](https://arxiv.org/html/2603.28627v1)
-   **Pinnacle 1.2.** Iceberg Quantum reports 72,000 physical qubits and 3.7 days at a 0.1% physical error rate and a 1 microsecond code cycle. At a tenfold lower error rate, its model gives 48,000 qubits and just under a day. These estimates combine a compiled circuit with simulated error correction. [Pinnacle 1.2 release](https://www.iceberg-quantum.com/blog/releases/pinnacle-1-2/)
-   **Superconducting cat qubits.** Pappalardo and colleagues estimate 22,593 physical cat qubits and 3.14 days for their compiled layout, under a model with strongly suppressed bit flips. A more parallel layout in the same study uses about 611,000 cat qubits to bring the estimate down to 1.25 hours. [Pappalardo et al.](https://arxiv.org/abs/2610.37839)

A qubit count makes sense alongside the runtime, error model, and layout it comes with. The cat-qubit study makes this especially clear: the same team can estimate a run in hours or days by choosing how much hardware to devote to parallel work.

The earlier stories in this series look at these hardware trade-offs in more detail. [Quantum Factoring series](https://medium.com/@_monitsharma/list/quantum-factoring-8d25eddc0b4d)

### The hardware decides how much time you save

A wide lookup is attractive when the processor can handle the output efficiently. On a space-efficient neutral-atom processor, the same output is expensive to deliver in pieces. These comparisons start from the same residue arithmetic, but each hardware model prices lookups and workspace differently. In our simplified surface-code allocation, the six-prime circuit takes 1.46 days at 1.33 million physical qubits. The reference in the same model takes 3.48 days at 0.98 million qubits. In Cain et al.’s balanced model, the two-prime circuit fits the published memory and takes an estimated 22.9 years versus 28.3 years for the tuned reference. On the space-efficient neutral-atom processor, the eight-prime circuit takes about 37% longer than the tuned reference, even with an assumed memory expansion. [The neutral-atom architecture study](https://arxiv.org/abs/2603.28627)

![The eight-prime circuit takes 0.40 times the reference runtime in the surface-code model and 1.37 times in the compact neutral-atom model, which assumes extra memory.](https://cdn-images-1.medium.com/max/1024/1*cmsVyF76Og3OjDW6tpEFmg.png)

From the paper. Each bar compares a circuit with the reference tuned for the same architecture. Below 1× is faster. Hatched bars assume additional memory whose physical cost was not estimated.

We also estimate how the arithmetic might transfer to the published Pinnacle 1.0 and cat-qubit designs. In the Pinnacle 1.0 model, at a budget of 142,260 physical qubits, the eight-prime circuit takes an estimated 5.07 days versus 6.01 days for the best reference setting in the disclosed parameter and parallelism grid. This assumes the timing and error models still apply to a wider processing unit. Pinnacle 1.2 and Cain et al.’s 97-day design use their own circuits and hardware assumptions. A head-to-head hardware comparison would require compiling the circuits for the same machine and accounting for routing and retries on the same terms. [Pinnacle 1.0 study](https://arxiv.org/abs/2602.11457)

### What this paper is useful for

If you’re designing a fault-tolerant machine, our circuits give you several ways to spend the same logical qubit budget. A processor with room for wide lookups can test larger groups of primes. A processor that moves small chunks of data can test smaller groups or keep checkpoints without sharing. The next step is to compile those choices for the target machine and measure how much time and workspace each needs.

If you’re building resource estimates, the open benchmark lets you rerun the comparisons, tune the reference at the same qubit budget, and price the same arithmetic on another architecture. That gives people assessing the long-term risk to RSA a better input to their estimates: a smaller logical circuit whose hardware cost can be tested explicitly.

_Preprint on arXiv_ [https://arxiv.org/pdf/2611.08907](https://arxiv.org/pdf/2611.08907)_._ The benchmark code, candidate circuits, and results are in the [rsabench archive on Zenodo](https://zenodo.org/records/23991044).

Website: [https://monitsharma.github.io/portfolio/work/shor-quantum-factoring/](https://monitsharma.github.io/portfolio/work/shor-quantum-factoring/)

Cite:

@misc{sharma2026sharedlookupslazyresidues,  
      title={Shared Lookups and Lazy Residues: Fewer Toffoli Gates for Factoring RSA-2048},   
      author={Monit Sharma and Hoong Chuin Lau},  
      year={2026},  
      eprint={2611.08907},  
      archivePrefix={arXiv},  
      primaryClass={quant-ph},  
      url={https://arxiv.org/abs/2611.08907},   
}

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=8eca041d1408)
