---
title: Can a MacBook Simulate Quantum Circuits Fast? Writing Custom Metal
  Kernels for Apple Silicon
slug: mettleq-on-apple-silicon
date: 2026-07-20
status: published
series: Systems & Performance
series_order: 1
excerpt: "Migrated from Medium: Can a MacBook Simulate Quantum Circuits Fast?
  Writing Custom Metal Kernels for Apple Silicon"
tags:
  - quantum simulation
  - Apple Silicon
  - MettleQ
  - GPU computing
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/mettleq-on-apple-silicon/
medium_url: https://medium.com/@_monitsharma/can-a-macbook-simulate-quantum-circuits-fast-writing-custom-metal-kernels-for-apple-silicon-03194f54923c?source=rss-f5df08a10024------2
draft: false
---

#### How I built MettleQ — a GPU-accelerated quantum simulator for Apple Silicon

![](https://cdn-images-1.medium.com/max/1024/1*blvVa_bpymCJbrRxfDxKIg.png)

_Almost every serious GPU quantum simulator assumes you have an NVIDIA card and CUDA. Some researchers type on a Mac. This is the story of closing that gap — honestly._

### The Premise

A datacenter has NVIDIA GPUs. Your laptop probably doesn’t. Yet the machine where quantum-computing research actually gets prototyped — the Jupyter notebook open right now — is very often a MacBook. There’s a real gap between where the fast simulators run and where the work happens.

Apple Silicon has one property that makes closing that gap worthwhile: _unified memory_. The CPU and GPU address the same physical pool, so there’s no PCIe round-trip to move data on and off the accelerator. A statevector simulator is, at its core, one enormous complex-valued array that gets hit repeatedly by structured passes. That’s a memory-bandwidth game, and unified memory changes its economics.

So I set myself a concrete, falsifiable goal: _get measurable GPU acceleration for quantum simulation on a MacBook — and prove it, rather than claim it_.

The result is **MettleQ**. This article is about what worked, what didn’t, and the discipline I tried to hold along the way.

> MettleQ is an independent, MIT-licensed fork of the [Qupertino](https://github.com/BoltzmannEntropy/Qupertino) project by Shlomo Kashani. I kept the MLX/Metal base and rebuilt the project around correctness, trust, and reproducible evidence.

![](https://cdn-images-1.medium.com/max/1024/1*EjAMpLzngXrgGXfaXBZ2iA.png)

Custom Metal kernels vs the pure-MLX GPU path: 29 workloads at 25 qubits on an M3 Pro. Median 10.2×, up to 32.6×.

### Why not just call \`matmul\` on the GPU?

The textbook way to apply a gate to a statevector is to build a matrix and multiply. It works, and MLX will happily run it on the Apple GPU. But it leaves an order of magnitude on the table, because **_real circuits aren’t made of arbitrary dense matrices — they’re made of structured layers_**:

1.  A Trotter step of a spin Hamiltonian is a layer of ZZ rotations. They all commute, and they’re all _diagonal_ — no matrix multiply needed at all.
2.  A layer of single-qubit rotations touches every qubit independently, so the whole layer factorizes.
3.  A QFT is a fixed ladder of Hadamards and controlled phases with a closed-form structure.

Each of these has structure you can exploit **_if you write the kernel by hand_**. That’s the core of MettleQ: hand-written Metal compute kernels — dispatched through MLX’s custom-kernel API — for exactly these patterns.

1.  **Fused ZZ Trotter layers.** Instead of looping over every bond and calling trig inside the kernel, each amplitude computes a parity with a \`_popcount_\` and looks up its phase in a tiny table. One GPU pass applies the entire layer.
2.  **Radix-16 single-qubit layers**. Because single-qubit gates on different wires commute, a full layer becomes \`_floor(n/4)_\` fused four-qubit passes plus a small tail — far fewer kernel launches than one-gate-at-a-time.
3.  **Radix-4 fused QFT stages.** Here’s the ZZ chain kernel — the actual Metal source, not pseudocode:

uint i = thread\_position\_in\_grid.x;
if (i >= n\_state) return;
uint mismatches = metal::popcount((i ^ (i >> 1)) & chain\_mask);
complex64\_t p = phase\_lut\[mismatches\];
complex64\_t a = state\[i\];
out\[i\] = complex64\_t(a.real \* p.real - a.imag \* p.imag,
                     a.real \* p.imag + a.imag \* p.real);

No per-bond loop. No trigonometry. One XOR, one popcount, one table lookup, one complex multiply — per amplitude. That’s the whole layer.

### The numbers

Benchmark claims in this space are frequently unfalsifiable. A “**_100× speedup_**” against an unnamed baseline on an undisclosed machine is marketing, not evidence. I held a stricter bar: **a result is only a “speedup” after it beats a named baseline on the same machine under the same protocol, with the raw data frozen next to the commit that produced it.**

The cleanest, most defensible result is the custom Metal path versus MettleQ’s own pure-MLX GPU path — an apples-to-apples ablation of “_did hand-writing the kernels actually help?_” On an M3 Pro, across 29 workloads at 25 qubits, with paired repeats that alternate the two paths inside each trial:

![](https://cdn-images-1.medium.com/max/1024/1*0tueM9630_qFON100sYwTQ.png)

Some representative absolute wall times:

![](https://cdn-images-1.medium.com/max/1024/1*nidvN9Lsoz1Ab-_G46eEjQ.png)

![](https://cdn-images-1.medium.com/max/1024/1*kJdikVBuHSVL6upZ761aHA.png)

The same 29 workloads as absolute wall time (log scale). Lower is better; the gap between the two bars is the story

Here’s the caveat I want to be scrupulous about: **_that speedup is over my own fallback path, not over Qiskit Aer or PennyLane Lightning, that will come later_**. It answers “**_were the custom kernels worth writing?_**” — emphatically yes — but it is **not** a claim that MettleQ is the fastest simulator in existence. Different question, different baseline. Conflating the two is how benchmark folklore gets started, and I’d rather not start any.

### It plugs into the tools you already use

A simulator nobody can call is a demo. MettleQ exposes real integration points:

1.  A native **Qiskit \`BackendV2\`**, plus **SamplerV2 / EstimatorV2** primitives — transpile and run unitary circuits, get native \`**Result**\` objects, device-sampled counts, and optional analytic convergence reports.
2.  A **registered PennyLane device** — a normal QNode with analytic or finite-shot measurements and framework-managed parameter-shift gradients.

import pennylane as qml

dev = qml.device("mettleq", wires=20)  # runs on the Apple GPU

@qml.qnode(dev)
def circuit(theta):
    qml.RX(theta, wires=0)
    for i in range(19):
        qml.CNOT(wires=\[i, i + 1\])
    return qml.expval(qml.PauliZ(0))

Both adapters route through one tested canonical operation layer, so Qiskit’s little-endian conventions and PennyLane’s wire ordering are covered by reference-parity tests rather than reimplemented per adapter.

![](https://cdn-images-1.medium.com/max/1024/1*YpvHuivL32Vfc4EBZzId5Q.png)

End-to-end timing through both SDKs, across statevector/MPS and CPU/GPU. CPU and GPU are independent alternatives, never summed and marketed as cooperative acceleration

### The part most write-ups leave out: where it’s slow

If I only showed you the winning numbers, you’d be right to distrust the rest. So here’s what \*doesn’t\* work well yet — straight from the project’s own “Known limits.”

**The MPS backend is currently slower than Qiskit Aer.** On matched matrix-product-state workloads through Qiskit’s EstimatorV2, MettleQ runs at roughly 0.1–0.2× of Aer’s speed on most topologies (i.e. several times slower), winning on only one grid case. That’s in the repo, with the CSVs.

![](https://cdn-images-1.medium.com/max/1024/1*r7ZgEq9l2jVT5dmt8sFFeA.png)

**GPU-side MPS is disabled — deliberately.** I tried running the MPS tensor contractions on the Apple GPU. The CPU beat it at every bond dimension from 8 to 128, because the SVD/truncation step stays on the CPU and forces round-trips (at D=64, SVD alone was ~98% of contraction-plus-SVD time). Rather than ship a “GPU MPS” checkbox that’s actually slower, I disabled it and wrote down exactly why. It should be revisited only once SVD can stay resident on the GPU.

This is the honest shape of the project: **the exact-statevector path with custom Metal kernels is genuinely fast; the approximate MPS path is correct but not yet competitive.**

### Trust as a feature, not an afterthought

That framing isn’t decoration. MettleQ began as a fork motivated by a technical audit.

**Incorrect simulation that runs quickly is worse than a correct baseline.** So MettleQ is built around a few non-negotiables:

1.  **Statevector preflight.** Before allocating a 2^n array, it checks the requested size against available unified memory and refuses (or demands an explicit override) instead of thrashing your machine into swap.
2.  **Capability-gated dispatch.** The Metal kernels run only on GPUs that pass a capability probe; everything falls back to a pure-MLX path you can force on with an environment variable for clean ablation.
3.  **Numerical parity tests.** 354 tests, including reference-parity checks against Qiskit and PennyLane on identical circuits — covering their opposite endianness and wire-order conventions.
4.  **A memory policy that pays for itself.** An adaptive checkpointing scheme cuts peak statevector memory by 65–95% versus the naive path _while running faster_— because fewer large temporaries means less allocator pressure in unified memory.

![](https://cdn-images-1.medium.com/max/1024/1*PiRcEg76xvtoq538g7i5hA.png)

### Taking on the Dedicated GPUs: M3 Pro vs. RTX 3070 (WSL2)

Up to this point, the baseline was internal — Metal kernels against pure MLX. But to answer the real-world question every developer asks (“_Can my MacBook actually replace a dedicated NVIDIA rig for prototyping?_”), I ran the exact same scaling benchmarks on a Windows machine running WSL2 with an **NVIDIA RTX 3070 (8 GB)**.

I benchmarked MettleQ on Apple Silicon against three major CUDA-backed frameworks: **CUDA-Q**, **PennyLane Lightning GPU**, and **Qiskit Aer GPU** across 15 to 28 qubits.

![](https://cdn-images-1.medium.com/max/1024/1*Rd988EZ1-0qwGrieLgIIxw.png)

Exact-width GPU Acceleration Scaling across 6 representative workloads. MettleQ (M3 Pro) vs CUDA-Q, PennyLane Lightning GPU, and Qiskit Aer GPU (RTX 3070).

The scaling plots reveal two fascinating regime shifts:

1.  **Unified Memory dominates at low-to-medium qubit counts (15≤n≤24)**

At lower qubit counts (15–20 qubits), dedicated GPUs suffer heavily from kernel launch overhead and memory transfer costs. CUDA-Q displays a near-flat latency floor (~60 ms) at 15 qubits across almost all algorithms.

Because Apple Silicon uses unified memory — and MettleQ avoids heavy memory movement — the M3 Pro stays well below 10 ms for 15–20 qubit circuits, often running **5× to 20× faster** than the RTX 3070 baselines in this regime.

2\. **Standard CUDA backends bottleneck early; CUDA-Q takes over at high width (n≥26)**

Across every workload tested — QFT, QAOA, GHZ, Grover, Phase Estimation, and TFIM Trotter — both **Qiskit Aer GPU**and **PennyLane Lightning GPU** scale significantly worse than MettleQ on the M3 Pro, even at 28 qubits.

However, **NVIDIA’s CUDA-Q** is a different beast. Once circuit size hits 26–28 qubits and compute density dominates memory overhead, CUDA-Q’s specialized CUDA kernels overtake MettleQ:

![](https://cdn-images-1.medium.com/max/1024/1*8AODqPnH71FHnpguTqt8Jw.png)

Direct head-to-head comparison between MettleQ (M3 Pro) and CUDA-Q (RTX 3070). MettleQ leads through 24 qubits, while CUDA-Q takes the lead at 28 qubits.

At 28 qubits:

1.  **CUDA-Q (RTX 3070)** achieves the absolute fastest runtimes, running **2.1× to 6.7× faster** than MettleQ depending on the workload (e.g., 6.7× faster on Phase Estimation, 6.0× on Grover).
2.  **MettleQ (M3 Pro)** consistently beats **Qiskit Aer GPU** and **PennyLane Lightning GPU** across the entire 15–28 qubit spectrum.

If you are running massive 28+ qubit heavy-compute workloads, a dedicated NVIDIA GPU paired with CUDA-Q remains unbeatable. But for interactive development, prototyping, and simulations up to 25 qubits, **a MacBook Pro running hand-written Metal kernels isn’t just viable — it actually beats standard desktop CUDA setups.**

### Try It

MettleQ is MIT-licensed and open source. If you work on quantum simulation, MLX/Metal, or Apple Silicon performance, I’d genuinely value your eyes on it — especially the MPS SVD path.

\- **Repo:** \[[github.com/MonitSharma/MettleQ](https://github.com/MonitSharma/MettleQ)\]
\- **Technical report + all frozen benchmark evidence:** in the repo

If you take one thing from this: on Apple Silicon, hand-written Metal kernels for structured quantum layers are worth roughly an order of magnitude over the generic GPU path — and the most useful thing you can publish next to a speedup is the honest list of things that are still slow.

_Built on top of Qupertino by Shlomo Kashani (MIT). MettleQ is an independent fork._
