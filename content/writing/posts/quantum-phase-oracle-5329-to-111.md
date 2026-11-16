---
title: "From 5,329 Layers to 111: How I Optimized a Quantum Phase Oracle"
slug: quantum-phase-oracle-5329-to-111
date: 2026-10-08T00:00:00.000Z
status: published
series: Circuit Design
series_order: 1
excerpt: Class codes, quantum interference, and the scheduling problem hidden
  between compute and uncompute
tags:
  - circuit optimization
  - Classiq
  - quantum arithmetic
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/quantum-phase-oracle-5329-to-111/
medium_url: https://medium.com/@_monitsharma/from-5-329-layers-to-111-how-i-optimized-a-quantum-phase-oracle-73c50fdcbeb9?source=rss-f5df08a10024------2
draft: false
---

#### Class codes, quantum interference, and the scheduling problem hidden between compute and uncompute

![](https://cdn-images-1.medium.com/max/554/1*yYxUYw8lVzQmOngkiUK7Zw.jpeg)

My final circuit for the Classiq Quantum Circuit Challenge had depth **111**, using **18 qubits, 557 CX gates, and 423 U3 gates**. The supplied baseline had depth 5,329. That is a **48.0-fold reduction in depth**, or about 97.9% fewer layers.

The result came from changing the representation of the problem, then optimizing the interfaces between the resulting circuit stages. The last few layers required more than finding a shorter encoder or removing another gate: they required arranging for the right information to arrive on the right wire at the right time.

The challenge is now over. [Classiq’s published recap](https://www.classiq.io/insights/wrapping-up-the-classiq-quantum-circuit-challenge) reports a best depth of 95, so 111 is not the best known result. It is my verified submission, and this article explains the construction and the experiments that led to it. The recap also gives several directions for continuing the optimization after the competition.

### The task: a picture encoded as phase

The input was a pair of six-bit coordinates, x and y, identifying one of the 4,096 pixels in a 64 × 64 image of the Classiq logo. The circuit had to change the sign of a basis state exactly when its pixel belonged to the logo:

|x, y⟩ |000000⟩ → exp(iφ) (−1)^f(x,y) |x, y⟩ |000000⟩

The global phase φ could be arbitrary, but it had to be the same for every input. The coordinates had to survive unchanged, and all six auxiliary qubits had to return to zero. Those requirements make the operation usable on a coherent superposition, as a phase oracle in a larger quantum algorithm.

The predicate was the union of a square, a horizontal bar, and two disks:

def logo(x, y):  
    return (  
        (2 <= x <= 26 and 29 <= y <= 53)  
        or (26 <= x <= 49 and 39 <= y <= 43)  
        or ((x - 55)\*\*2 + (y - 41)\*\*2 <= 42)  
        or ((x - 40)\*\*2 + (y - 19)\*\*2 <= 72)  
    )

There are 1,097 marked pixels. A classical program can evaluate that expression directly. A reversible quantum circuit has to implement the sign coherently while cleaning up its workspace.

The scoring model mattered throughout the project. Every U3 or CX gate occupied one layer; gates on disjoint wires could run together; connectivity was all-to-all. Depth was the primary objective and CX count broke ties. This was an abstract circuit synthesis benchmark. Depth 111 is not a claim about execution time or fidelity on a particular physical processor.

![](https://cdn-images-1.medium.com/max/1024/1*74Z9JHET_DxlgS76RUlWPg.png)

Figure 1. Target predicate, repeated row and column patterns, and phase-polynomial sizes.

_The image contains much less independent information than a general 12-bit truth table._

### Why my first circuits were still too deep

Several plausible representations produced working circuits without producing a sufficiently shallow one. Direct Boolean synthesis, geometry-based multiplexers, comparator identities, and distributed lookup all appeared in the exploration.

The direct phase representation was particularly revealing. A Boolean predicate can be expanded in bit parities, with phase rotations implementing the coefficients. Here, all 4,095 nonconstant parities of the original twelve coordinate bits have nonzero coefficients. Optimizing the traversal of that dense expansion leaves a very large circuit.

My intermediate results show how much the architecture changed:

![](https://cdn-images-1.medium.com/max/1024/1*ldgx9FeGTFjA5RXlodg7og.png)

Selected verified milestones. The final submission is highlighted: depth 111, 557 CX gates.

![](https://cdn-images-1.medium.com/max/1024/1*XLYLUePgccXy5Pt3u7j2fA.png)

Optimization history from the repository. Left: best verified depth on a log scale; the 5,329-layer baseline is not plotted. Right: depth versus CX count near the final circuits, with 111 / 557 highlighted.

These are selected verified milestones, rather than every search result. The progression also illustrates why fewer CX gates did not always mean lower depth: a substitution could save gates while making a critical wire wait longer.

### Compressing the information before compiling it

The important structural observation was that the logo has only **11 distinct column patterns and 11 distinct row patterns**.

If two x coordinates give the same column, no y coordinate can distinguish them through the predicate. They can share a column-class label. The same reasoning applies to rows. The phase decision can therefore be represented by a small class-pair table, provided the circuit also computes the coordinate-to-class mappings.

Four bits are enough to distinguish eleven classes. But assigning class numbers from zero to ten would optimize a classical data structure, not necessarily the reversible implementation. The label assignment changes both the cost of computing the labels and the phase polynomial needed to combine them.

I used four-bit codes of the form (p, L): one raw coordinate parity p, plus a three-bit label L. For x, the parity was x₄ XOR x₅; for y, it was y₅. Labels were assigned to the combinations of parity and pattern class so the code still determined the correct class.

The resulting x mapping reached 14 of the 16 code words; y reached 13. Together, only **182 of 256 eight-bit addresses** were reachable.

The other 74 addresses provided useful freedom. The oracle would never see them when the loaders began with clean ancillas, so their phase values could be selected to simplify the implementation. The best completion used a **63-term phase polynomial**, compared with 4,095 nonconstant terms in the direct coordinate representation.

The important cost was still the complete circuit. A beautifully sparse kernel could lose its advantage if its labels were expensive to compute.

### Loading labels through interference

The final architecture was compute–phase–uncompute:

coordinate loaders → phase kernel → inverse coordinate loaders

The x and y loaders each worked on nine wires: six coordinate inputs and three ancillas. The middle kernel acted on the eight code wires.

![](https://cdn-images-1.medium.com/max/1024/1*p2faYqEwACA2z0AJfLt4hA.png)

Figure 2. Compute–phase–uncompute with overlapping coordinate loaders and the central phase kernel.

_Individual wires can move into the kernel while other parts of a loader are still finishing._

To compute a Boolean label bit L onto a clean target, I used interference. A Hadamard opened the target into two branches. A diagonal circuit added a relative phase of πL between those branches. A second Hadamard converted that relative phase into the computational-basis value L.

For a fixed input, the essential identity is:

H · diag(1, (−1)^L) · H |0⟩ = |L⟩

The diagonal circuit itself was built from CX gates and parity rotations. A CX changes which parity a wire carries; a rotation applies a phase when that wire holds the required parity.

There was another useful freedom: a loader could introduce a phase depending only on its input coordinates. Its exact inverse later cancelled that phase. The loader therefore did not need to be a phase-perfect implementation of a standalone classical function, provided the complete sandwich remained correct.

### Let earlier labels help compute later ones

Computing all three label bits independently was wasteful. Once the first label was available, later encoders could use it as another input. They only needed to be correct on combinations of the coordinates and first label that actually occurred.

This conditional construction reduced the rotation support to 45 + 21 + 23 terms on x and 45 + 30 + 14 on y: 89 per side, down from roughly 170 in the earlier formulation.

All three target frames could open in the first layer. Their computations overlapped, with only genuinely dependent rotations waiting for the earlier label to close. This change helped bring the complete circuit from depth 185 to 151.

### Choose the output basis too

The outputs did not have to be the original three label bits themselves. Any suitable invertible combination could describe the same classes, if the kernel was changed consistently. One useful x basis was (L₀, L₁, L₁ XOR L₂).

This introduced a joint optimization: choose the labels, choose their output basis, and then synthesize both the loaders and kernel. Optimizing any one of those pieces in isolation missed opportunities in the others.

### The required phase is only defined modulo 2π

A relative phase of π and a relative phase of 3π produce the same sign. More generally, a loader only needed phase πL(x) modulo 2π. I could add an integer multiple of 2π independently at each input without changing the label produced by interference.

Those integer choices changed the Walsh coefficients of the phase function. Some choices removed rotations. For the six-bit angle representation used in the search, the constraints became a linear system modulo 64. I used Howell normal form to handle that arithmetic; ordinary Gaussian elimination over a field does not apply unchanged to a modulus that is a prime power.

Saving one or two rotations sounds small. Near the final schedules, it could decide whether a label closed early enough for the kernel to fit.

### The real objective: when each wire becomes usable

The most useful change in perspective was to stop treating a loader’s total depth as its score.

Suppose a code wire is ready after r layers and the whole circuit must finish in T layers. In a symmetric compute–uncompute picture, the inverse loader needs its corresponding r layers at the end. The middle operations have a window:

r + 1 ≤ kernel layer ≤ T − r

At T = 111, a wire ready at layer 45 has only layers 46 through 66 available: 21 layers. A different wire ready earlier has more room. Those windows matter more than the moment the last gate anywhere in the loader finishes.

The final design’s latest x and y code bits were ready at layers 43 and 45. The search tracked the entire vector of ready times because different code bits participate in different numbers of kernel operations.

![](https://cdn-images-1.medium.com/max/1024/1*6STDgjP7CunTbQFhPqw86A.png)

Figure 3. Availability windows for the eight code wires in the depth-111 circuit.

_The latest labels leave the narrowest windows. Improving an already-early wire may do little for the total depth._

A layer-synchronous beam search built CX matchings across the nine wires of each loader. It placed a rotation when a wire carried a required parity. A freeze action retired a wire once it held a completed code bit, but only when the remaining rotations were still representable using the other wires.

The kernel search then worked within the wire-specific windows. It had to visit its required phase parities and restore an appropriate final basis for the unloaders.

### Why the timing model needed to match the assembled circuit

The simple window formula explains the pressure, but the final implementation needed finer rules.

A phase rotation adjacent to a closing Hadamard could fuse with it into one U3 gate. A diagonal rotation could sometimes move across a commuting boundary operation. But a wire could not host a rotation in the same layer as a CX using that wire.

An optimistic timing model could therefore declare a candidate feasible even though its assembled U3/CX circuit was too deep. I replaced that approximation with an exact fused model and checked assembled schedules using a time-indexed mixed-integer program solved with HiGHS.

The constraints placed each gate exactly once, prevented wire conflicts, and preserved the order of noncommuting operations. This provided a rigorous scheduling check within the specified gate list and commutation model. It did not prove a lower bound over every possible circuit implementing the oracle.

### From 115 to 111: change what closes onto the wire

The final reductions used the boundary between phase loading and classical labels.

If a target closes with a Hadamard and the first kernel operation is a CX into that target, commuting the CX through the Hadamard turns it into a CZ before the close. In the phase-loading frame, that CZ changes the relative sign and therefore changes which Boolean label emerges.

This made it useful to load L₁ XOR L₀ rather than L₁, while changing the kernel’s starting basis to match. The logical class information stayed sufficient, but the kernel began from a more convenient set of parities.

For one x-loader relabeling, two existing rotation angles changed and one rotation was added in an idle slot. The CX and Hadamard schedule stayed the same. Yet the new starting basis let the middle circuit fit at depth 114.

Extending the relabeling to both coordinate registers gave 113. Making the y-parity target available earlier gave 112. For 111, I selected target functions with sparse rotation support and screened loader pairs against their exact kernel starting bases before spending the larger beam-search budget.

The first complete depth-111 circuit used 561 CX gates. A lower-CX x loader and local resynthesis produced the final 557-CX circuit. The recorded reconstruction recipe uses an x-loader ready-time profile of **39 / 40 / 41 / 43**, a kernel beam width of 12,000, and subsequent exact scheduling and three-qubit resynthesis.

### Saving gates without losing a layer

Local optimization was useful, but its acceptance criterion had to be depth-aware.

I used commutation-aware CX cancellation, fusion of neighbouring single-qubit gates, SAT searches for smaller parity-network windows, and numerical resynthesis of small three-qubit blocks. Numerical candidates were fitted and refined, then checked before insertion into the full circuit.

At depth 115, roughly 280 exact substitutions with fewer CX gates were available, but each increased the depth to at least 116. That was a concrete reminder that minimizing gate count and minimizing latency are different problems.

The final stage attribution was:

-   Stage: x loader · CX: 120 · U3: 91
-   Stage: y loader · CX: 120 · U3: 90
-   Stage: Phase kernel · CX: 79 · U3: 62
-   Stage: x unloader · CX: 119 · U3: 91
-   Stage: y unloader · CX: 119 · U3: 89
-   Stage: **Total** · CX: **557** · U3: **423**

Boundary fusion and local rewrites explain why the counts are not perfectly symmetric even though the architecture uses inverse loading operations. Counts are attributed using the recorded kernel windows.

![](https://cdn-images-1.medium.com/max/1024/1*5GuIIwYhe1LymU1JOv-XyA.png)

Figure 4. Gate-level schedule of the final 18-qubit circuit: depth 111, 557 CX, and 423 U3.

_The circuit’s 980 gates fit into 111 layers through parallel execution and careful ordering._

### Verification was part of every claimed improvement

A phase oracle can produce correct pixel values while still introducing unwanted relative phases. Checking only the Boolean predicate would miss that error.

For each reported circuit, I propagated all **4,096 clean-ancilla basis inputs** through the actual QASM. The check required the original coordinate state, clean ancillas, and the correct sign with one common global phase across every input.

The original final-circuit verifier reported a largest numerical deviation of **5.57 × 10⁻¹⁴**. The independent NumPy implementation reported about **6.66 × 10⁻¹⁴**, consistent with different floating-point evaluation paths. Both passed. The QASM’s SHA-256 is recorded with its verification report so the result identifies an exact artifact.

By linearity, agreement on every clean-ancilla basis input establishes the intended action on arbitrary superpositions of those inputs, within the numerical verification tolerance. It does not claim equivalent behaviour when the workspace starts in an arbitrary nonzero state.

The lightweight reproduction command is:

python scripts/verify\_circuit.py submission/submission.qasm

### What the winning circuits suggest next

Classiq’s recap provides a useful comparison with the approach I took. Its five published winning results were:

-   Depth: 95 · CX: 272
-   Depth: 95 · CX: 410
-   Depth: 106 · CX: 360
-   Depth: 108 · CX: 500
-   Depth: 109 · CX: 481

_Results and architecture descriptions:_ [_Classiq challenge recap_](https://www.classiq.io/insights/wrapping-up-the-classiq-quantum-circuit-challenge)_._

The geometry-based results motivate revisiting my earlier comparator experiments. An exact identity alone was insufficient in my work: its reversible encoders also needed to become cheaper.

The joint-encoding result motivates testing a smaller interface. The recap does not supply its feature maps or synthesis code, so reconstructing a similar circuit remains a new experiment.

The phase-loading results motivate extending my searches over encoder choices, phase corrections, and local substitutions.

These are descriptions of possible research directions, not claims that I have reproduced the winning circuits.

### What depth 111 does — and does not — establish

The depth-111 schedule contains a tight wire path: 45 loader layers, 21 kernel touches, and 45 unloader layers. My searches did not find a complete depth-110 construction. That says something about the explored gate lists and architectures; it does not establish 111 as an optimum. The published depth-95 results make the remaining room for improvement explicit.

The lesson I take from this project is that representation, reversible computation, and scheduling need to be designed together. Repeated patterns simplified the information. Interference made the labels cheaper to compute. Unreachable addresses and modulo-2π freedom simplified phase functions. Wire-level timing made those savings useful in the complete circuit.

The competition supplied a deadline. The remaining gap supplies a research question: which distinctions must the oracle retain, and how cheaply can a reversible circuit make them available?

### Code and technical details

The [repository](https://github.com/MonitSharma/classiq-quantum-circuit-challenge) includes the submitted QASM, verification reports, intermediate circuits, and reconstruction data. The [technical report](https://github.com/MonitSharma/classiq-quantum-circuit-challenge/blob/main/docs/technical-report.md) gives the derivation and scheduling details. The [final recipe](https://github.com/MonitSharma/classiq-quantum-circuit-challenge/tree/main/artifacts/111/recipes/cx557) records the loader and kernel reconstruction inputs.

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=73c50fdcbeb9)
