---
title: The Hidden Arithmetic Behind Quantum Finance
slug: the-hidden-arithmetic-behind-quantum-finance
date: 2026-11-04T00:00:00.000Z
status: published
series: Circuit Design
series_order: 2
excerpt: How compact state and language-model-assisted design reduced the
  arithmetic behind two complex financial contracts.
tags:
  - quantum finance
  - quantum arithmetic
  - circuit optimization
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/the-hidden-arithmetic-behind-quantum-finance/
medium_url: https://medium.com/@_monitsharma/the-hidden-arithmetic-behind-quantum-finance-dcd6f4c5aa47?source=rss-f5df08a10024------2
draft: false
---

#### How compact state and language-model-assisted design reduced the arithmetic behind two complex financial contracts.

![Workflow from contract rules and encoded market shocks to compact state, temporary payoff arithmetic and a payoff angle. A language model proposes circuit designs; tools evaluate them; final candidates undergo separate validation. Matched TQ reductions are 2.39-fold for the autocallable and 4.84-fold for TARF. The HHL angle circuit has a 14.1 percent lower TQ than Gu et al.’s published point, using eleven more logical qubits.](https://cdn-images-1.medium.com/max/1024/1*yLpbrAD542WKLgveCQnwXA.png)

Our approach at a glance: fix the contract, explore compact circuit designs, then assess their cost and correctness separately. The savings shown cover arithmetic components, not a complete pricing system.

A financial contract can fit on a few pages and still be surprisingly expensive to calculate. Its payment might depend on three assets, a barrier crossed months ago, and whether the contract should have ended early. Today’s price alone does not tell you what the investor receives.

Now imagine evaluating those rules across a large collection of possible futures. That is the work hiding inside many derivative-pricing problems. The final answer is an average; producing each term in that average can be the difficult part.

In our new paper, we study this arithmetic inside quantum pricing. We use a language model to help design smaller circuits, and find **2.39× and 4.84× reductions in a logical resource metric** for two fixed finance benchmarks. We also improve the gate–qubit product of an HHL angle circuit reported by [Gu et al.](https://arxiv.org/html/2610.22367v1)

The idea connecting these results is quite practical: reconsider what the circuit needs to remember. Before getting to the circuits, though, it helps to understand the contracts they are trying to calculate.

### A contract that can end before maturity

An autocallable is a structured contract that can terminate automatically on a scheduled observation date if its underlying assets meet a specified condition. The payment depends on the contract’s rules, and the possibility of an early exit changes the paths we need to track.

Our benchmark is a three-asset, worst-of autocallable. “Worst-of” means that the weakest-performing asset matters. Imagine each asset starts at a relative price of 100. At a call date, all three must be at least 110 for the early-payment condition to be met. Prices of 112, 115 and 111 meet it; prices of 112, 115 and 109 do not.

There is also a downside barrier at 70. If any asset falls below it at a monitoring date, that event can activate a terminal loss if the contract survives without being called and the worst asset finishes below its starting level. A later recovery does not erase the earlier barrier event.

So the computation has to remember more than the latest prices. It needs to know whether a call has occurred and whether the downside barrier has been breached. Our benchmark has **20 monitoring dates and five scheduled call dates**. These are fixed research rules, not a calibrated market product.

### A contract with a running target

A target accrual redemption forward, or TARF, has a different kind of memory. It makes a sequence of payments and keeps a running total. Once that total reaches a target, the contract ends. A separate knockout condition can end it earlier.

In our 26-date benchmark, the underlying starts at 20 and the accrual target is 5. Prices between 20 and the knockout level of 30 generate positive payments; prices from 15 up to 20 generate none; below 15, the payment is negative, with twice the exposure to the difference from 20. Reaching 30 knocks the contract out before that date’s payment.

The target clips the last payment. If 3 has already accrued and the next eligible payment would be 4, the contract pays only 2 and stops at 5. Negative payments, meanwhile, reduce the running total. They are not silently replaced with zero.

This gives us a second path-dependent problem. The same current asset price can lead to different remaining payments depending on what has already accrued and whether the contract is still alive.

### Why a quantum algorithm still has to do the bookkeeping

To price either contract under a chosen model, we average its discounted payments over possible market paths. Classical Monte Carlo does this by sampling paths, evaluating the payments and averaging them.

Quantum amplitude estimation offers a better dependence on the desired precision in the ideal query model: it can use quadratically fewer calls to a payoff calculation than Monte Carlo. But every call needs an actual implementation of the contract rules. [Chakrabarti et al.](https://quantum-journal.org/papers/q-2021-06-01-463/) studied the resources required for quantum pricing with autocallable and TARF benchmarks, providing the setting we build on.

Those calls have an extra constraint. In ordinary software, we can overwrite temporary values. A coherent quantum circuit must clear its workspace correctly so that leftover information does not interfere with the larger computation. Updating a price, testing a barrier, and undoing temporary calculations can all cost gates and qubits.

Our question is about that work: can we make the reversible payoff arithmetic cheaper while understanding the approximation errors it introduces?

### Keep the running total, reconstruct the detail

Think about tracking your spending. If the next question only needs your total, you probably keep a running sum. You do not rebuild it from every receipt each time. You retain extra details when another rule needs them.

The market model in our benchmarks offers a similar opportunity. Each random shock is selected by a five-bit integer index. The shock grid is equally spaced, the model coefficients are fixed, and the observation dates are uniformly spaced. Together, these choices mean that current log-returns can be reconstructed from cumulative sums of the indices.

For the autocallable, the factor-sum design keeps **three exact 10-bit market-state counters**, alongside the contract’s history. It reconstructs weighted quantities temporarily when a barrier decision or terminal payoff needs them. For TARF, one index sum, accrual tracking and date-dependent lookup tables avoid much of the repeated price reconstruction.

The contract memory stays. A sum describing the current market state cannot tell us whether an earlier barrier was crossed or how much has already been paid. What changes is the amount of wide arithmetic state carried between dates.

At the end, the arithmetic produces a payoff angle: a number that a later quantum rotation can use to encode the payment. We study the arithmetic after the market inputs have been loaded and before that rotation and the estimation algorithm.

### The language model proposes; the circuit has to pass the checks

Our design process follows the evaluator-guided approach of [Gu et al.](https://arxiv.org/abs/2610.22367) A language model proposes circuit programs, tools evaluate them, and feedback guides revisions. We used Claude Opus 5.5 to help explore representations, write circuit-building code and refine implementations.

The useful output is a program we can inspect and measure. Separate tools recount its resources and check its behavior. The authors set the tasks and rules and interpret the results. A convincing explanation from the model does not establish that the circuit is correct.

This was an assisted design process. Early runs included human hints and full-repository access, some early exact model identifiers are unavailable, and the six retained TARF programs share one design lineage. These details matter when deciding what the results say about the circuits and what they say about the reliability of the search method.

### Reading the resource plots

The plots below have two axes: Toffoli-equivalent gate count on the horizontal axis and peak live logical qubits on the vertical axis. Moving left means less arithmetic work; moving down means less workspace. The gate axis is logarithmic, so equal horizontal distances represent equal ratios.

We combine the two resources into **TQ = Toffoli-equivalent count × peak logical qubits**. The dashed curves join designs with the same product. A Pareto frontier captures another useful idea: designs for which improving one resource requires giving up something in the other. A resource frontier does not, by itself, rank financial accuracy.

![Three resource tradeoff panels from the paper. In the original autocallable, factor-sum uses 7,551 Toffoli-equivalent gates and 518 logical qubits versus 16,810 and 556 for the reference, reducing TQ 2.39-fold. TARF separates a 199.5-fold representation change from a subsequent 4.84-fold search improvement. In the second autocallable setting, generic transfer loses its advantage and fresh lattice-form designs recover smaller savings. Hollow circles denote screening-only evidence.](https://cdn-images-1.medium.com/max/1024/1*CnL8GiUEVz3VNSFjxXWYJQ.png)

Finance resource plots from the paper. Horizontal: Toffoli-equivalent gates; vertical: peak live logical qubits. Hollow search circles have empirical screening only; filled search circles have held-out validation. R compares the named reference product with the candidate product. The frontiers rank resources, not accuracy. The bottom panel shows the second parameter setting discussed below.

For the autocallable, the log-return reference uses 16,810 Toffoli-equivalent gates and 556 logical qubits. The factor-sum circuit uses 7,551 and 518. That lowers the product from 9,346,360 to 3,911,418: a 2.39× reduction, or about 58%.

For TARF, the lookup reference uses 28,428 gates and 384 qubits. The final windowed circuit uses 8,381 and 269. Its product falls from 10,916,352 to 2,254,489: a 4.84× reduction, or about 79%.

The two arrows in the TARF plot tell different stories. Moving from the expensive price-space reconstruction to the lookup reference gives a roughly 199.5× representation saving. The 4.84× improvement then starts from that already cheaper lookup reference. Keeping those comparisons separate makes it clear where the gains come from.

These are logical arithmetic costs. The counts exclude market-distribution loading, payoff rotations, amplitude estimation and physical error correction. They give us better components to work with; establishing a complete pricing advantage requires the rest of the system too.

### An HHL improvement, with a visible tradeoff

We also used a separate arithmetic calibration from HHL, the [Harrow–Hassidim–Lloyd algorithm for linear systems](https://arxiv.org/abs/0811.3171). Here the task is to calculate a rotation angle from an encoded input. It is a compact way to test numerical circuit design outside the two financial contracts.

For this angle task, the best published point in [Gu et al.’s resource table](https://arxiv.org/html/2610.22367v1) uses **1,348 Toffoli gates and 115 qubits**, giving a product of 155,020. Our Booth-polynomial circuit uses **1,057 gates and 126 qubits**, giving 133,182. That is a **14.1% lower product**.

![HHL angle resource plot with logarithmic Toffoli gate axis and peak logical-qubit axis. Gu et al.’s orange diamond is at 1,348 gates and 115 qubits. Our filled teal Booth-polynomial point is at 1,057 gates and 126 qubits, with a 14.1 percent lower product but eleven more qubits. The HRS reconstruction and dyadic reference are also shown. Hollow teal points have screening evidence only.](https://cdn-images-1.medium.com/max/1024/1*qccRP57Vbsn7_FMHXM-oZw.png)

The paper’s HHL angle-calibration plot. Our Booth-polynomial point is left of and above Gu et al.’s orange diamond: fewer Toffoli gates, eleven more logical qubits, and a 14.1% lower product. Hollow teal points have screening evidence only. The dashed curves have equal TQ; the frontier ranks resources, not accuracy. This comparison covers the angle component.

The geometry is useful here. Our point moves left but also slightly up: it uses fewer gates and more qubits. It improves the product without dominating Gu et al.’s point on both axes. Which design is preferable can depend on how a larger implementation values work and memory.

The HHL circuit’s integer action has exact all-input logical checks. A separate exhaustive comparison over 2,031,616 inputs finds a maximum angle error of about 9.72 × 10⁻⁸ radians, below the 10⁻⁷ target. That accuracy comparison is numerical, without a certified enclosure. The resource improvement belongs to this angle task, not to a complete implementation of HHL.

### A million successful tests can still miss the interesting cases

The most important verification lesson is that two questions need different answers. Does the circuit execute its intended integer calculation correctly? And does that calculation approximate the financial payment closely enough?

For the factor-sum autocallable, we prove the coherent integer action for every encoded input, every incoming output-accumulator value and every measurement record, including clean workspace and cancellation of unwanted phases. The proof uses computational certificates under the stated ideal circuit semantics.

That calculation still approximates the contract. Rounded coefficients can shift a barrier decision, some early barrier tests are omitted, and finite-width terminal arithmetic can wrap. Executing the integer specification perfectly does not remove those financial errors.

The factor-sum circuit had zero violations in a million-path independent high-precision study and in a separate million-path task-reference holdout. Yet 241 of 900 deliberately selected stress paths exceed the tolerance. Those paths were chosen to expose problems; their failure fraction is not a loading-law frequency.

A separate lattice calculation follows probability through states that recombine, allowing rare cases to be assessed more directly. Under the benchmark’s specified discrete loading law, it numerically estimates an angle-tolerance-violation probability of about 6.248 × 10⁻⁸, roughly one in sixteen million, and evaluates the pricing bias. The angle tolerance is 10⁻⁵ radians.

This is a numerical estimate with bounded omitted probability mass, not a fully certified numerical interval covering all rounding and function-evaluation errors. It is also a result for the declared discrete model. The final TARF circuit passed its separate million-path reference studies, but retains selected counterexamples and does not have the same all-input coherent-action proof.

### The result that did not travel

The bottom panel of the finance plot is a useful check on the enthusiasm. When we changed the autocallable’s volatility and correlation parameters, a generic adaptation of the factor-sum approach became 5.58 times more expensive in TQ than the transferred log-return reference. The original favorable structure did not automatically survive the change.

Fresh bounded search found a shift-add lattice-form design with a 1.35× lower product than that reference. That is a recovery at one further setting. It also shows why the original savings should not be assumed to extend to arbitrary contracts, precisions or model parameters.

### What I hope this makes easier to see

Quantum finance is often introduced through the number of samples an algorithm can save. This work looks inside one of those calls, where representations, temporary values and contract memory determine how expensive the arithmetic becomes.

A language model helped us explore those choices. Resource recounts, logical verification and financial-error analysis made the resulting circuits assessable. The next step is to connect components like these to complete pricing implementations and understand how the tradeoffs change as the problems grow.

For me, the useful design lesson is the running total: keep the information the next step needs, reconstruct the detail when required, and be precise about what gets forgotten. That is a good question to ask of a quantum circuit — and a productive place to involve a language model.

The Paper: [https://arxiv.org/pdf/2611.04431](https://arxiv.org/pdf/2611.04431)

Cite:

@misc{sharma2026reducingarithmeticcostquantum,  
      title={Reducing the arithmetic cost of quantum derivative pricing with language-model circuit design},   
      author={Monit Sharma and Hoong Chun Lau},  
      year={2026},  
      eprint={2611.04431},  
      archivePrefix={arXiv},  
      primaryClass={quant-ph},  
      url={https://arxiv.org/abs/2611.04431},   
}

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=dcd6f4c5aa47)
