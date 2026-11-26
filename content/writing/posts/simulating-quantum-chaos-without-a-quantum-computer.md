---
title: "Simulating Quantum Chaos Without a Quantum Computer: 2560/3000 in the BlueQubit Midwest Quantum Hackathon"
slug: simulating-quantum-chaos-without-a-quantum-computer
date: 2026-11-22
status: published
series: Systems & Performance
series_order: 2
excerpt: "How we estimated out-of-time-order correlators on 30–38 qubit circuits with classical simulators, $57.80 of cloud credit, and a lot of calibration."
tags:
  - quantum simulation
  - GPU computing
  - quantum computing
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/simulating-quantum-chaos-without-a-quantum-computer/
medium_url: https://medium.com/@_monitsharma/simulating-quantum-chaos-without-a-quantum-computer-2560-3000-in-the-bluequbit-midwest-quantum-608d2e5913cc
draft: false
---

*How we estimated out-of-time-order correlators on 30–38 qubit circuits with classical simulators, $57.80 of cloud credit, and a lot of calibration.*

![G3 estimates of the Z expectation on the 6×6 grid, with the butterfly circled, beside the final score of 2560 out of 3000](https://cdn-images-1.medium.com/max/1024/1*FFadfddNXRq2XZX3jGdIgg.png)

---

## TL;DR

- The challenge: predict ⟨Z⟩ at the end of 183 "echo" circuits that measure **out-of-time-order correlators (OTOCs)**, a standard probe of quantum chaos and information scrambling. The circuits are up to 38 qubits, beyond brute-force simulation on a laptop.
- We scored **2560 of 3000 points**: 100% on the three samples and G1, 90% on G2 and G3, 70% on G4.
- We used **no quantum hardware**. Everything ran on classical simulators: exact statevector, matrix product states (MPS) and Pauli-path propagation.
- Two findings mattered most. Running Pauli-path on a **GPU** was 233× faster than on a CPU for the same answer. Turning on the simulator's **heaviest circuit pre-processing (transpilation level 3)** lifted G3 from 400 → 720 and G4 from 500 → 700.
- The method that got us there: **never trust a simulator setting until it has been checked on a circuit with a known answer.** We built look-alike circuits small enough to solve exactly and used them to pick every setting.

![Total score after each submission, rising in steps from 0 to 2560 out of 3000](https://cdn-images-1.medium.com/max/1024/1*zLqy7TtYv4rmLF5zAzB3bQ.png)

---

## 1. The challenge

The [BlueQubit](https://app.bluequbit.io) Midwest Quantum Hackathon posed one question in seven sizes. Each problem is a family of circuits, one per qubit *q*. For each circuit you submit a single number, the expectation value ⟨Z_q⟩ at the end.

| Problem | Qubits | Circuit family | Points |
|---|---|---|---|
| S1, S2, S3 | 4, 16, 25 | open samples | 100 each |
| G1 | 30 | 1D chain of random (Haar) two-qubit gates | 300 |
| G2 | 36 | 1D Haar chain with *secret* weak bonds, two butterflies | 600 |
| G3 | 36 | 6×6 grid, Clifford gates plus non-Clifford rotations | 800 |
| G4 | 38 | Google-style fSim grid, 10 layers, values within ±0.1 | 1000 |

**Scoring:** for each problem, the squared Pearson correlation (corr²) between your 36 numbers and the true ones, floored at 0.1 and multiplied by the problem's points. You get up to 10 submissions per problem and the best one counts.

Correlation-based scoring has a useful property. **A method that gets every value too small by the same factor still scores perfectly.** What hurts is getting the *ranking and relative shape* wrong. That fact shaped much of our strategy.

### What the circuits compute

![The double-echo circuit U, X on the butterfly, U dagger, Z on the probe, then U, X, U dagger again, measured as the Z expectation](https://cdn-images-1.medium.com/max/1024/1*ouNNkOV0PIbjKdOKgq63CA.png)

Every circuit has the same five-part structure: `U · X_b · U† · Z_q · U · X_b · U†`, followed by a measurement of Z on qubit *q*.

- **U** is a scrambling circuit (the part that differs between problems).
- **X_b** flips a "butterfly" qubit *b*.
- **Z_q** probes qubit *q*.

Writing **B = U† X_b U** for the butterfly operator after it has spread through the system, the measured number equals

  **⟨Z_q⟩ = ⟨0| (Z_q B)⁴ |0⟩**,

a fourth-order out-of-time-order correlator, OTOC(2). It asks: *has the disturbance at qubit b reached qubit q?*

- If it hasn't, Z_q and B commute and the value stays near 1.
- If it has, and the dynamics are chaotic, the value decays toward 0.

OTOCs are central to studying quantum chaos, black-hole information scrambling and the "butterfly velocity" of quantum many-body systems. They are also the workload in Google's recent *Quantum Echoes* experiment, which is why G4 uses Google-style fSim gates.

The catch for classical simulation is that the circuit runs **U four times**. A 10-layer U becomes a 40-layer circuit, and an exact 36-qubit statevector needs about 1 TB of memory.

---

## 2. The toolbox: three ways to simulate

BlueQubit exposes several simulators through one Python call, `bq.run(circuit, device=..., pauli_sum=[("…Z…", 1.0)])`. The hidden challenge circuits are stored on the server and referenced by name, so we never saw their gates. Every experiment on them had to go through the API.

| Method | Device | What it does | Where it breaks |
|---|---|---|---|
| **Exact statevector** | `cpu` (free, ≤34 qubits) | Tracks all 2ⁿ amplitudes | Memory: impossible past ~34 qubits |
| **Matrix product state** | `mps.cpu` / `mps.gpu` | Compresses the state as a chain of tensors, bond dimension χ | Entanglement: 2D grids and deep circuits need huge χ |
| **Pauli-path propagation** | `pauli-path` / `pauli-path.gpu` | Evolves the *observable* Z_q backward through the circuit as a sum of Pauli strings, dropping terms with coefficient below a threshold δ | Non-Clifford gates make the sum branch exponentially; truncation loses weight |

Pauli-path is the least familiar of the three, so here is a short explanation.

- **Clifford gates** (CZ, Hadamard, S, π/2 rotations) map one Pauli string to exactly one other. They cost nothing.
- **Each non-Clifford rotation** splits a string into two, weighted by cos θ and sin θ.
- Over many layers, the number of strings explodes. The simulator keeps only terms with |coefficient| > δ.
- Smaller δ means more accuracy, more memory and more time. The server's minimum is δ = 1e-5.

**Real-world constraints we had to work around:**

- At most 5 parallel jobs, and at most **1 GPU job** at a time.
- Billing *reserves* each pending job's worst-case cost: $25 for a CPU Pauli-path job, which blocked new jobs even though the actual charges were $0.
- CPU Pauli-path requires a balance of at least $25 for circuits over 1000 gates.
- A **server-side memory check rejects thresholds that are "too small" for a given circuit**. Rejected attempts were not billed, but each one cost a round trip in a one-job-at-a-time GPU queue.
- The budget was **$57.80 of coupon credit**: a $30 hackathon coupon plus $27.80 of opening credit on the account.

---

## 3. The method: calibrate on circuits with known answers

You can't see the hidden circuits or their answers. So the only way to know whether a setting helps is to test it on circuits that **look like** the hidden ones but are **small enough to solve exactly**.

We built four look-alike families:

| Look-alike | Mimics | Size | Exact answers from |
|---|---|---|---|
| **S3** (official sample) | G3 | 25 qubits, 5×5 grid | Qiskit Aer statevector on a laptop |
| **Y4** | G4 | 25 qubits, 5×5 fSim grid, 8 cycles | Aer statevector |
| **P3** | G3 | 30 qubits, 5×6 grid, random 2-qubit Cliffords + random-angle Rz | BlueQubit's free 30-qubit `cpu` device |
| **P4** | G4 | 30 qubits, 5×6 fSim grid, 10 cycles | BlueQubit's free `cpu` device |

To build P3 we first analysed the S3 sample. Each scrambling block U has about 234 CZs and 48 arbitrary-angle rotations on a snake-ordered grid. We then generated a larger random circuit with the same statistics.

P4 turned out to be an excellent stand-in for G4. Pauli-path at our best settings scored corr² 0.50 on its first 22 circuits and 0.76 on all 30, the same range G4 itself scored on the leaderboard (about 0.5).

![Squared correlation against exact values for each method on each look-alike circuit family](https://cdn-images-1.medium.com/max/1024/1*edVAIU8nNNTmEBh7AQ21ug.png)

![Estimate versus exact value for Y4, P3 and P4, one dot per circuit, with the diagonal marking perfect agreement](https://cdn-images-1.medium.com/max/1024/1*xDGfQbr4gVjMcb4ykmSPCw.png)

These checks drove every decision that followed:

- **(a) The tighter GPU configuration was more accurate on Y4.** On the same 12 probes, corr² rose from 0.958 to 0.988, and root mean square error fell from 0.0540 to 0.0167. We changed both the backend and the truncation threshold, so this comparison measures their combined effect. The Y4 plots above show the available results for each configuration, covering 19 CPU probes and 12 GPU probes.
- **(b) MPS is the wrong tool for the grid circuits.** On P3, MPS at χ = 128 reported −0.009 for a circuit whose true value is −0.47. Pauli-path got −0.471. MPS's corr² looks fine on six points only because it happens to preserve the ranking. The values are 50× too small, so we dropped MPS for G3.
- **(c) G4-like circuits stay hard.** On P4, even the tightest Pauli-path settings shrink the values by 2–5×, with a few outright errors.

---

## 4. Problem by problem

### S1–S3 and G1: exact simulation (600/600)

Up to 25 qubits, the samples fit in a laptop's memory, so we simulated them exactly with Qiskit Aer. G1 has 30 qubits, which is within the free exact `cpu` device's 34-qubit limit. Thirty jobs at about 2.5 minutes each gave the exact answer and a perfect score.

### G2: MPS on a chain (540/600)

A 1D chain is MPS's home turf: entanglement grows slowly along a line. Our tests on small Haar chains showed MPS truncation biases values **upward, toward 1**, and converges once χ is large enough. At χ = 128, all 36 circuits ran in about 7 minutes each, within BlueQubit's free 15-minute tier.

![Z expectation along the G1 and G2 chains, with butterfly positions marked and a shielded region in G2](https://cdn-images-1.medium.com/max/1024/1*ZUtmTivnuCxuneI7wz3hcw.png)

The G2 profile shows the "secret weak bonds" directly. Qubits 12–21 keep high OTOC values because weak couplings shield them from both butterflies (qubits 2 and 31), so the scrambling front never fully reaches them.

A χ = 256 run might have closed the last 10%. But the server estimated 13.5 hours per job, and the reservation it held would have frozen our GPU work, so we left G2 at 540.

### G3: Clifford + rotations on a 6×6 grid (240 → 400 → 720/800)

G3 is the textbook Pauli-path case: mostly Clifford gates, which are free, plus some rotations that branch. It took three rounds:

1. **CPU, δ = 1e-4: 240/800.** Many circuits came back as exactly 0.0, meaning every Pauli path had been truncated away.
2. **GPU, tightest threshold per circuit: 400/800.** We wrote an "adaptive" runner. It submits each circuit at δ = 1e-5 and, if the server's memory check rejects it, steps up to 2e-5, 3e-5, 5e-5, then 1e-4.
3. **Same, plus `pauli_path_circuit_transpilation_level=3`: 720/800.**

![Truncation threshold used for each circuit of G3 and G4 at transpilation levels 2 and 3](https://cdn-images-1.medium.com/max/1024/1*nHk697GU5mQUU9pq9ELW6g.png)

### G4: Google-style fSim (400 → 500 → 700/1000)

G4 is the hardest. It has 38 qubits, 10 fSim layers that are *all* non-Clifford, and tiny values (|⟨Z⟩| < 0.05).

1. A partial submission scored 400 (17 of 36 circuits, the rest set to 0).
2. The full GPU run at δ = 1e-4, and again at tight thresholds, scored 500.
3. **Transpilation level 3 at a fixed δ = 5e-5 scored 700.**

---

## 5. The two findings that moved the score

### Finding 1: the GPU was 233× faster for the same answer

![Server run time for the same G3 circuit: 2,475 seconds on CPU and 11 seconds on GPU](https://cdn-images-1.medium.com/max/1024/1*7c1cMi7VnAzrkoTe8NnReA.png)

One G3 circuit at δ = 3e-5 took **41 minutes** on the CPU Pauli-path device and **11 seconds** on `pauli-path.gpu`, returning the identical value (−0.1085). At $0.20 per GPU job, a full 36-circuit sweep took minutes and cost about $7. The CPU equivalent would have taken about 22 hours, longer than the time we had left. Every later experiment depended on this.

### Finding 2: transpilation level 3

![Per-circuit G3 and G4 estimates at transpilation level 2 and level 3](https://cdn-images-1.medium.com/max/1024/1*G-ap9TvZrBzhgIs5P4W0FQ.png)

BlueQubit's Pauli-path converts each circuit into rotation gates before propagating. Level 2 is the default. Level 3 runs "extensive, potentially time consuming" passes with different gate bases to minimise gate count.

We had tested level 3 on our P4 look-alike and seen no gain (0.78 vs 0.79). But we had built P4 with Qiskit's optimiser, which **had already merged the single-qubit gates**. The hidden circuits had not. The sample QASMs contain long runs of redundant single-qubit gates, for example `u3(π/2,0,π) · u3(0,0,π/2) · u3(π/2,0,π)`.

Every extra gate is another place the Pauli sum is rotated and truncated. Merging them at level 3 cuts the number of truncation steps, so less weight is lost. The effect on the hidden circuits was large:

- several G3 values moved from about 0 to −0.6;
- G4's strongest signals grew by up to 4×;
- the scores rose by 320 and 200 points.

**The lesson:** a look-alike is only as good as its resemblance to the real thing, *including how its gates are written down*.

---

## 6. What didn't work (so you don't have to try it)

| Idea | Result |
|---|---|
| MPS on the 2D grids (G3 look-alike) | Lost the largest values; misses by 50× |
| Richardson-style extrapolation of δ → 0 from two thresholds | Made corr² *worse* on P4 (0.78 → 0.59 at α = 1) |
| `pauli_path_weight_cutoff` (cap on Pauli-string length) to fit δ = 1e-5 in memory | Same circuits still rejected; values almost unchanged |
| Blending δ = 1e-4 and tight-δ estimates | Gains on P4 came from a single outlier circuit, which is noise |
| MPS χ = 256 for G2 | Server reserved about $13 per job and blocked the GPU queue; cancelled |
| Tighter thresholds (2e-5) at level 3 on G4's 7 strongest circuits, with the last $1.40 of credit | Values grew 15–45% in magnitude; score unchanged at 700/1000 |
| Running heavy simulations on the laptop | Can't load the hidden circuits; useful only for exact look-alike answers up to about 25 qubits |

---

## 7. Resources and cost

![Completed GPU jobs by purpose: 115 for G4, 75 for G3 and 89 for calibration](https://cdn-images-1.medium.com/max/1024/1*54mXIaz770ZVi_dV2RNzTQ.png)

- **Compute:**
    - 279 completed GPU Pauli-path jobs: 115 for G4, 75 for G3 and 89 for calibration.
    - Roughly 280 free-tier CPU jobs: exact, MPS and CPU Pauli-path.
    - Local Qiskit Aer runs on a 12-core MacBook for the ≤25-qubit exact references.
- **Rejected attempts:** 190 submissions bounced off the memory check. They were not billed, but each cost queue time, so later runs started each circuit at its previously accepted threshold.
- **Money:** $56.60 of the $57.80 coupon credit ($30 hackathon coupon + $27.80 opening credit), for 283 billed GPU jobs at $0.20 each: 1 h 59 min on an NVIDIA A100 80GB. Nothing was charged beyond the coupons.
- **Software:** BlueQubit Python SDK (0.19 beta), Qiskit 1.x and Qiskit Aer, NumPy, Matplotlib. Our own code was a small set of Python scripts:
    - a resumable job runner;
    - an adaptive-threshold GPU runner;
    - look-alike circuit generators;
    - comparison and plotting scripts.
- **Wall-clock:** roughly one long day of work, much of it waiting in a one-GPU-job queue.

---

## 8. Takeaways

1. **Calibrate before you trust.** Every setting we used was first checked against exact answers. Each time we skipped that step (MPS on a grid), the data told us we were wrong.
2. **Know what the metric rewards.** Correlation forgives a uniform shrink. Truncated simulators shrink everything, so only *uneven* shrinkage costs points.
3. **Check the boring knobs.** The single biggest gain came from a pre-processing flag, not a cleverer algorithm.
4. **Your proxy must match the data's quirks, including its file format.** Our look-alike was "too clean" to reveal the transpilation gain.
5. **Budget is part of the algorithm.** Cost reservations, the one-GPU-job limit and a $25 minimum balance for CPU Pauli-path shaped the plan as much as the physics did.

---

## Reproducing this

All the code is on GitHub: [github.com/MonitSharma/bluequbit-otoc-hackathon](https://github.com/MonitSharma/bluequbit-otoc-hackathon). The repository contains:

- `src/runner.py`: a resumable BlueQubit runner;
- `src/adaptive.py`: the per-circuit tightest-threshold GPU runner;
- `src/make_proxy.py` and `src/synth.py`: look-alike circuit generators;
- `src/compare.py` and `src/subcmp.py`: corr² against exact values;
- `src/blog_plots.py`: every figure in this post.

*No quantum hardware was used. All results come from classical simulation on BlueQubit's cloud simulators and a laptop. The engineering was done together with an AI coding assistant (Claude Code).*
