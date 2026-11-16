---
title: When Cooking Gas Becomes a National Security Problem
slug: when-cooking-gas-becomes-a-national-security-problem
date: 2026-05-14T00:00:00.000Z
status: published
series: Optimization in the World
series_order: 1
excerpt: How to design energy supply networks for a world where maritime
  chokepoints close on you
tags:
  - optimization
  - energy security
  - public explainer
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/when-cooking-gas-becomes-a-national-security-problem/
medium_url: https://medium.com/@_monitsharma/when-cooking-gas-becomes-a-national-security-problem-c47babcea911?source=rss-f5df08a10024------2
draft: false
---

#### How to design energy supply networks for a world where maritime chokepoints close on you

> A non-technical walkthrough of our new paper, “Securing the Flow: Maritime Energy Resilience under Correlated and Decision-Dependent Disruptions”

### A 40% problem hiding in plain sight

Every day, roughly **40% of the world’s seaborne crude oil and LNG** funnels through three narrow stretches of water you’ve probably heard of without thinking much about: the **Strait of Hormuz** between Iran and Oman, the **Bab el-Mandeb** between Yemen and Djibouti, and the **Suez Canal** in Egypt.

When one of them closes, energy prices ripple across continents within hours.

We saw it in **2024**, when Houthi attacks in the Red Sea pushed shipping companies to reroute their tankers around the southern tip of Africa, adding two weeks to delivery times and tripling war-risk insurance premiums. We saw it again in **2026**, when tensions in the Persian Gulf spiked LPG and oil prices and triggered emergency rationing in several Asian economies.

These aren’t black-swan events anymore. They’re the new normal. The question for any nation that imports its energy is no longer _whether_ a chokepoint will be disrupted, but **which one, when, and what’s the right way to prepare**.

![](https://cdn-images-1.medium.com/max/1024/1*JTf7HYn8DTU8P7SfzmvV7g.jpeg)

India’s calibrated maritime energy network — 16 nodes, 28 arcs, four commodities. The colour-coded routes show how Gulf supply terminals connect to Indian demand ports through Hormuz, the Bab el-Mandeb / Suez corridor, the Cape of Good Hope, and the two pipeline bypasses through the UAE and Saudi Arabia.

### A nation built on a single chokepoint

For our case study we picked **India**, and not by accident.

India is the world’s third-largest energy consumer. It imports **4.5 million barrels of crude oil per day** from Gulf producers, the vast majority of which sails through Hormuz. Its **LNG imports — 17.5 million tonnes per year — are 69% Hormuz-linked**. Its **LPG**, which **290 million Indian households use to cook food every single day**, is 97% Middle East-sourced.

If Hormuz closes, India doesn’t just lose gasoline. It loses the gas that millions of families use to make breakfast.

So the question becomes practical: how should a country like India design its energy supply network so that, when (not if) a chokepoint disruption hits, the lights stay on and the kitchens stay warm?

### The model, in plain English

In our paper, we formulate this as what operations researchers call a **two-stage stochastic optimisation problem**. The phrase is intimidating; the structure is actually very intuitive.

**Stage 1 — _before_ any crisis happens.** The planner makes long-term, costly decisions:

-   Which shipping routes to lock in via long-term government-to-government contracts.
-   Which pipelines to sanction (the UAE Habshan–Fujairah pipeline that bypasses Hormuz, or Saudi Arabia’s East–West Petroline).
-   Where to stockpile strategic reserves of crude, LNG, LPG, and fertilizer.

These are the **here-and-now** decisions. The planner makes them _before_ knowing what disruption (if any) is coming.

**Stage 2 — _after_ a disruption happens.** Now the planner can see what’s broken. They route the surviving flows through whatever paths are still available, draw down strategic reserves, and absorb whatever shortages can’t be avoided.

The planner doesn’t get to redo Stage 1 once they see Stage 2. So Stage 1 has to be good across _every_ disruption scenario, not just the most likely one.

![](https://cdn-images-1.medium.com/max/1024/1*5fVT4zKAADqSYZAEtw_cXw.jpeg)

Left: business-as-usual flows in the baseline (no disruption) scenario. Right: how the same activated network reroutes flows when Hormuz and Bab el-Mandeb are simultaneously disrupted. The Cape and direct routes pick up the slack. The activated network is fixed in Stage 1; the flow pattern is the Stage 2 response.

The math gets more interesting when you add three twists that match how the real world actually works:

1.  **Disruptions are correlated.** A regional crisis tends to take out multiple chokepoints at once. Hormuz and Bab el-Mandeb don’t fail independently — they share political fault lines.
2.  **Choices change probabilities.** A nation that depends heavily on a fragile corridor doesn’t just face higher _exposure_ if that corridor fails — the political math changes too. Adversaries notice dependencies. So in our model, the very act of routing through a corridor shifts the planning probability of disruption scenarios involving that corridor.
3.  **The planner cares about tails.** A 5% chance of catastrophic shortage is worse than a 50% chance of a small inconvenience. A risk-averse planner needs to hedge against the worst-case scenarios, not just the average. We use a measure called **Conditional Value-at-Risk (CVaR)** to formalise this.

### Four findings policymakers should care about

We calibrated the model using public data from the **EIA** (US Energy Information Administration), **UNCTAD**, **World Bank**, **UKMTO** maritime advisories, and operational reports from the 2026 Hormuz crisis. The full calibration is documented in the paper’s appendix; here’s what came out.

### Finding 1 — Planning for the average is the wrong mental model

The most basic question we asked: does it actually matter that disruptions are uncertain? Or could the planner just optimise against an “average” disruption state and call it a day?

Answer: it matters a lot.

A network designed for the average disruption state costs **14.8% more** when evaluated against the actual distribution of possible disruptions, compared to a network designed using the full uncertainty.

The flip side is also interesting: once you do account for uncertainty, the value of _perfect foresight_ — knowing exactly which scenario will happen before it happens — is essentially **zero (0.02%)**. You don’t need a crystal ball. You just need to plan against the distribution of possibilities, not the average.

This sounds like a technicality. It isn’t. It’s the difference between “build the right pipeline” and “build the wrong pipeline” in the real-world infrastructure decisions that follow from a model like this.

### Finding 2 — Cooking gas, not gasoline, is the weak link

This was the surprise.

Common intuition says: in an oil crisis, _gasoline_ goes first. The reality, according to our optimised policy, is the opposite.

![](https://cdn-images-1.medium.com/max/719/1*NncUOm9f8F55hL2MiUxaJQ.png)

The reason LPG is exposed is _structural_. Unlike crude, there’s no big LPG bypass pipeline. Unlike fertilizer, there’s limited domestic substitution. And LPG isn’t an industrial input — it’s the energy that 290 million Indian households use to cook food. Every day.

If a country wanted to know where to spend its **next dollar** of resilience investment, our analysis points firmly to **LPG storage and LPG supplier diversification**. Not crude.

This is the kind of answer that an optimisation model gives you that a press release wouldn’t. The headlines focus on oil because oil is what global markets price. But the operational vulnerability sits one shelf over, in the kitchen.

![](https://cdn-images-1.medium.com/max/1024/1*MOO4KPcOe7jsvAULnc-o0g.jpeg)

Recourse cost across the nine disruption scenarios. The dual-disruption scenario (Hormuz + Bab el-Mandeb) is the worst case at ~$70K, dominated by LPG shortage costs. Hormuz-related single disruptions follow.

### Finding 3 — A good design hedges itself against correlation (the most surprising result)

This was the most surprising finding, and the one that took the most analysis to nail down.

When we looked at the calibrated network, the **value of modelling correlation** — how much you save by accounting for joint Hormuz + Bab el-Mandeb failures versus assuming they fail independently — was exactly **zero**.

At first, we assumed this had to be an artefact. So we stress-tested it. We forced joint disruption probabilities up to **0.87** (the independence baseline is 0.84). We swept across **11 different correlation strengths**. We tried **8 different amplification factors** that increasingly skewed probability mass toward joint-failure scenarios.

**The optimal design did not change. At all.**

![](https://cdn-images-1.medium.com/max/1024/1*zLGxrzKCIhybsOH0TcRhsg.jpeg)

Left: the value of modelling correlation stays at zero across all amplification factors. Right: meanwhile, the gap between correlated and independent joint-failure probabilities grows substantially. The probability distributions are meaningfully different; the optimal design is invariant.

The reason is _structural_. The diversified portfolio that the stochastic program selects to hedge against _single_ corridor disruptions — Cape of Good Hope alternatives, the two pipeline bypasses, direct routes from non-Gulf suppliers — is _automatically_ a hedge against _joint_ corridor disruptions too. The planner has already activated routes that bypass every corridor in the joint-failure scenario.

We call this property **structural joint-failure resilience**. The policy implication is direct and useful:

> Calibrating joint-disruption probabilities from historical data is notoriously hard, because joint events are rare. But for networks in this regime, **you don’t need to calibrate them precisely**. A well-designed marginal-risk-optimal portfolio will protect you anyway.

This is **good news** for planners. It says: spend less time arguing about the right correlation parameter, and more time getting the route portfolio right.

### Finding 4 — Risk aversion has a phase transition

Most stochastic optimisation analyses report a smooth, gradual tradeoff between expected cost and tail-risk protection. Ours doesn’t. It has a sharp jump.

When we vary the CVaR confidence level α — the parameter that says “how far into the tail do you care about?” — we find a **phase transition at α ≈ 0.75**.

-   **Below α = 0.75**: the optimal design uses 20 activated arcs. The tail contains enough scenarios that the planner can spread risk across them.
-   **At α ≈ 0.75 and above**: the optimal design jumps to **21** activated arcs. The tail collapses to a single scenario — the dual Hormuz + Bab el-Mandeb disruption — and the planner activates an additional bypass arc _specifically_ to hedge it.

That extra arc costs real money. But for a planner who genuinely cares about catastrophic outcomes — and a national energy security planner generally does — it’s worth it.

![](https://cdn-images-1.medium.com/max/1024/1*3WBiOvEeU9HvSBrjgtbBeQ.jpeg)

The mean–CVaR objective across a 6×6 grid of risk parameters. The bottom row (λ = 0) is the risk-neutral planner — flat across α by construction. The top-right corner is the most risk-averse planner. The total cost range across the grid is 52% — risk preferences shape the whole network design, not just a marginal parameter.

In the joint (λ, α) heatmap, the objective ranges from $47K (risk-neutral) to $72K (maximum risk aversion). A 52% spread. **Risk preferences aren’t a rounding error in this problem — they shape the whole network.**

### So what?

If you’re a policymaker, three takeaways:

1.  **Diversification dominates forecasting.** The hardest part of crisis planning isn’t predicting which corridor will fail — it’s building a portfolio that doesn’t care which one fails. Stochastic optimisation gives you that portfolio.
2.  **The weak link is rarely where you think.** In our calibration, the headline-grabbing commodity (oil) was the most resilient. The unsexy commodity that 290 million people cook with was the most exposed. **Resilience investment should follow the math, not the headlines.**
3.  **Tail-risk has a price, and it’s discontinuous.** Going from 75% to 95% confidence in tail protection isn’t a gradual increase in cost — it’s a jump that activates an entire additional piece of infrastructure. **Risk policy is a _design_ choice, not just a parameter.**

### A note for the OR / academic readers

The technical contribution of the paper, briefly: we integrate three features that have been studied separately but rarely together — **correlated arc failures across disruption groups, decision-dependent disruption probabilities** (Type 1 endogenous uncertainty in the Hellemo et al. taxonomy), and a **mean–CVaR risk-averse objective**. We prove that the resulting bilinear MILP admits an exact McCormick reformulation, that scenario-wise decomposability is preserved, and that a Benders decomposition with corridor-based group-failure cuts converges in finitely many iterations.

Empirically, our Benders implementation matches the extensive-form optimum to numerical precision (objective gap ≤ 7 × 10⁻¹¹) on every converged instance, with iteration count flat at **10–11 from |S| = 9 up to |S| = 729 scenarios**. The empirical content of the finite-convergence result holds along the scenario dimension

![](https://cdn-images-1.medium.com/max/1024/1*iRCt3ilbNkjYP5PO4t4J0w.jpeg)

Benders convergence trace on the calibrated instance. Lower bound from the master problem; upper bound from evaluating incumbent first-stage designs through the scenario subproblems. The two bounds meet in 11 iterations.

The full formulation, proofs, and experimental protocol are in the paper, along with detailed institutional and calibration documentation in the appendices.

### Where this goes next

Three open directions:

1.  **Learning the decision-dependent probability coefficients** from observable geopolitical and maritime-intelligence data streams (event-coded conflict indicators, war-risk insurance premia, AIS-derived transit volumes), rather than setting them by analyst judgment. This would convert the central calibration object of the model into an empirically grounded one.
2.  **Cut-pool management for large-scenario regimes.** At 729 scenarios, our implementation retains 5,670 cuts while only 10 iterations are productive. There’s a clear opportunity for cut scoring and pruning that we haven’t yet explored.
3.  **The comparative question.** The structural-resilience finding for the Indian network raises a natural question: which other national maritime energy networks exhibit the same property, and which don’t? What topological or capacity features distinguish the two regimes?

### Read the paper

**Title:** _Securing the Flow: Maritime Energy Resilience under Correlated and Decision-Dependent Disruptions_

**Authors:** Monit Sharma, Hoong Chuin Lau (Singapore Management University)

**arXiv:** [https://arxiv.org/abs/2605.11990](https://arxiv.org/abs/2605.11990)

_If you found this useful, a clap or a share goes a long way. And if you disagree with any of the findings, I’d love to hear why — that’s how this work gets sharper._

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=c47babcea911)
