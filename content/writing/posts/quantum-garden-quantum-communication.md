---
title: "The Key to the Quantum Garden: India’s 1,000 km Leap Into Un-hackable
  Communication"
slug: quantum-garden-quantum-communication
date: 2026-04-10
status: published
series: Quantum in Public
series_order: 1
excerpt: "Migrated from Medium: The Key to the Quantum Garden: India’s 1,000 km
  Leap Into Un-hackable Communication"
tags:
  - quantum communication
  - quantum computing
  - public explainer
authors:
  - Monit Sharma
canonical_url: https://monitsharma.github.io/writing/quantum-garden-quantum-communication/
medium_url: https://medium.com/@_monitsharma/the-key-to-the-quantum-garden-indias-1-000-km-leap-into-un-hackable-communication-ab6277f0f98e?source=rss-f5df08a10024------2
draft: false
---

#### Can you eavesdrop on a conversation that rewrites itself the moment you listen?

![](https://cdn-images-1.medium.com/max/1024/1*Tw8egxWjN8QBQYuVOWebgQ.png)

On April 8, 2026, India’s Department of Science and Technology quietly announced something remarkable: under the National Quantum Mission, a 1,000-kilometer quantum communication network had been demonstrated, one of the longest quantum key distribution (QKD) deployments in the world, achieved in under two years of the mission’s launch. The technology was built entirely in-house by QNu Labs, a Bengaluru-based startup incubated at IIT Madras Research Park.

![](https://cdn-images-1.medium.com/max/1024/1*LJdlh6T-ZZg0myI6Ko2pOQ.png)

Source: [https://www.pib.gov.in/PressReleasePage.aspx?PRID=2250162&reg=3&lang=2](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2250162&reg=3&lang=2)

This isn’t a physics experiment confined to a university lab. It’s a working network designed for defense communications, banking infrastructure, and critical systems, deployed over standard telecom fiber. And it forces a question that cuts to the heart of modern cybersecurity: can we build communication channels that are physically impossible to eavesdrop on?

The answer, as with everything in quantum mechanics, is _almost._

### What Is Quantum Key Distribution?

Let’s start with the problem QKD solves. Every encrypted message you send, every bank transfer, every classified memo, every WhatsApp text, relies on mathematical difficulty as its security foundation. RSA encryption assumes nobody can factor very large numbers efficiently. Diffie-Hellman assumes nobody can solve the discrete logarithm problem fast enough to matter.

These assumptions have held for decades. But they are _assumptions_, not laws of physics. Shor’s algorithm, running on a sufficiently powerful quantum computer, would break both of them. And even before such a computer exists, adversaries are already running “harvest now, decrypt later” operations, capturing encrypted traffic today to crack it once quantum hardware matures.

QKD takes a fundamentally different approach. Instead of relying on mathematical hardness, it uses the laws of quantum mechanics to distribute encryption keys. The security guarantee isn’t computational, it’s physical. An eavesdropper doesn’t just face a hard math problem; they face the no-cloning theorem and the measurement disturbance principle.

### The BB84 Protocol: Security from Physics

The workhorse protocol behind most deployed QKD systems is BB84, proposed by Charles Bennett and Gilles Brassard in 1984. Here’s how it works:

**Alice** wants to send a secret key to **Bob**. She encodes random bits as quantum states (photon polarizations) using one of two randomly chosen bases; call them rectilinear (+) and diagonal (×). Each basis has two states representing 0 and 1.

**Bob** measures each incoming photon using a randomly chosen basis. When his basis matches Alice’s, he recovers the correct bit. When it doesn’t, he gets a random result.

After transmission, Alice and Bob publicly compare which bases they used (not the bit values) and keep only the bits where their bases matched. This is called **sifting**, and it gives them a shared string, the sifted key, that should be identical on both sides.

Here’s where quantum mechanics earns its keep: if an eavesdropper (**Eve**) intercepts a photon, she must measure it to learn anything. But measurement in the wrong basis irreversibly disturbs the state. When she re-sends the photon to Bob, that disturbance shows up as errors in the sifted key.

Alice and Bob check this by publicly comparing a random subset of their sifted bits. If the error rate, the **Quantum Bit Error Rate (QBER)** exceeds a threshold (approximately 11% for BB84), they know someone was listening, and they abort. If it’s below the threshold, they proceed with error correction and privacy amplification to extract a shorter, provably secure key.

![](https://cdn-images-1.medium.com/max/1024/1*NnE50qdYc7AqpFz4KFucFg.png)

**Figure 1** shows this in action from our simulation. With no eavesdropper, the QBER distribution is tightly centered at 0%. With a full intercept-resend attack, it jumps to ~25% — well above the security threshold. Eve cannot listen without being caught.

![](https://cdn-images-1.medium.com/max/1024/1*1AbwgWKof-vSUw4S-7B7SA.png)

**Figure 2** maps the relationship explicitly: QBER scales linearly with the fraction of qubits Eve intercepts. Even a partial eavesdropping attempt (intercepting just 44% of qubits) pushes the error rate above the security threshold.

This is the fundamental promise of QKD: eavesdropping is not merely difficult — it is _detectable by the laws of physics_.

### The Fiber Loss Wall

QKD’s theoretical security is elegant. Its engineering reality is less forgiving.

Photons traveling through optical fiber are absorbed and scattered. Standard telecom fiber loses about 0.2 dB per kilometer — which means that after 100 km, only about 1% of photons arrive at the detector. After 200 km, it’s 0.01%. The secure key rate drops exponentially with distance.

This is quantified by the **PLOB bound** (Pirandola, Laurenza, Ottaviani, and Banchi, 2017), which establishes the ultimate rate-loss tradeoff for point-to-point QKD without quantum repeaters: no protocol can generate keys faster than R = -log₂(1 — η), where η is the channel transmittance. For standard fiber, this sets a hard ceiling that makes direct QKD beyond ~300–400 km impractical.

Two solutions exist:

1.  **Trusted relays** — intermediate nodes that receive, decrypt, and re-encrypt keys along the path. This is how China’s Beijing-Shanghai backbone and India’s QNu Labs network operate. The trade-off: security at each relay node depends on the physical security of that node. A compromised relay compromises the entire chain.
2.  **Twin-Field QKD (TF-QKD)** — proposed by Lucamarini et al. in 2018, this protocol achieves key rates that scale as √η instead of η, effectively doubling the achievable distance. Experimental demonstrations have reached beyond 500 km of fiber without trusted relays.

![](https://cdn-images-1.medium.com/max/1024/1*3JrpdhNy8IqxTm35hd0mMQ.png)

**Figure 3** shows these scaling regimes with real-world deployment markers.

QNu Labs’ ARMOS platform, validated independently by VIAVI Solutions, demonstrated secure key generation at up to 200 km per hop with approximately 200 secure bits per second at that range — operating on standard telecom fiber alongside 10 Gbps classical data traffic. Their 1,000 km network achieves its span through trusted relay nodes spaced approximately 150–200 km apart — notably wider than the conventional 80–100 km spacing, which they attribute to their proprietary decoy-state Differential Phase Shift (DPS) protocol tolerating up to 40 dB of channel loss.

### Where India Stands on the Global Scoreboard

Let’s be honest about the numbers.

China’s quantum communication program is in a different league. The Beijing-Shanghai backbone, completed in 2017, spans 2,032 km with 32 trusted relays. In 2021, Pan Jianwei’s team at USTC integrated this with the Micius satellite to demonstrate a 4,600-km space-to-ground QKD network serving over 150 users across banks, power grids, and government agencies (Chen et al., _Nature_ 589, 214, 2021). By 2025, China’s CN-QCN had expanded to over 12,000 km of fiber with 145 backbone nodes across 20 metropolitan networks and 80 cities, as reported by Yang et al. in _npj Quantum Information_ (2025).

India’s 1,000 km demonstration is roughly where China was around 2015–2016 in terms of fiber distance. But context matters. India achieved this in under two years of the NQM’s launch (October 2024), using entirely indigenous technology, and with a fraction of China’s cumulative investment. The mission targets 2,000 km by 2032 — a pace that, if maintained, could establish India as the third-largest QKD network operator after China and the EU (whose EuroQCI aims for pan-continental coverage by 2030).

![](https://cdn-images-1.medium.com/max/1024/1*C4ej07h24KL2fOuoiuW0xw.png)

**Figure 4** puts the scale in perspective.

![](https://cdn-images-1.medium.com/max/1024/1*KqzWEETKRllCem0vSRE0Lw.png)

**Figure 5** tracks India’s NQM progress against its own targets.

### Can QKD Be Hacked? Yes, But Not The Way You Think

Here’s where the honest analysis lives. QKD’s _theoretical_ security proof is airtight, under the assumptions of the proof. In practice, every deployed QKD system deviates from those assumptions, and those deviations create attack surfaces.

The peer-reviewed literature documents a rich taxonomy of attacks on real QKD hardware. These don’t break quantum mechanics — they exploit the gap between the mathematical model and the physical implementation.

#### Protocol-Level Attacks

**Photon Number Splitting (PNS)**: Real QKD systems don’t use perfect single-photon sources. They use attenuated lasers (weak coherent sources) that occasionally emit multi-photon pulses. An eavesdropper can split off the extra photons, store them in a quantum memory, wait for basis reconciliation, and measure them in the correct basis — gaining information without introducing errors. _Countermeasure_: the decoy-state protocol (Hwang, 2003; Lo, Ma, Chen, 2005) uses multiple intensity levels to detect PNS attacks statistically.

**Intercept-resend**: The textbook attack, demonstrated in our simulation. Eve measures and re-sends each qubit. Easily detectable via QBER monitoring, but establishes the baseline that QKD must check against.

#### Implementation Attacks (The Real Threat)

**Detector blinding** (Lydersen et al., _Nature Photonics_ 4, 686, 2010): By shining a bright continuous-wave laser at Bob’s single-photon detectors, Eve can force them out of Geiger mode into linear mode. She then controls which detector clicks by sending bright tailored pulses, effectively choosing Bob’s measurement outcomes. This attack was demonstrated against commercial QKD systems from ID Quantique and MagiQ Technologies — recovering the full secret key with _zero_ increase in QBER.

**Laser damage attack (LDA)**: A recent analysis by Ponosova et al. (_Scientific Reports_, 2025) showed that high-power radiation (0.3–5 W) can permanently alter optical attenuators by up to 10–14.5 dB, increasing the mean photon number beyond the security regime of decoy-state protocols. Combined with unambiguous state discrimination (USD), this allows full key recovery using only linear optical elements.

**Trojan horse attack**: Eve sends bright probe pulses back into Alice’s modulator, and the back-reflected light leaks information about Alice’s encoding choices. No access to the quantum channel required — the attack enters through the same fiber.

**Phase remapping**: In plug-and-play QKD systems where Bob sends light pulses to Alice for modulation, Eve can shift the timing of arriving pulses to remap Alice’s phase encoding, partially distinguishing between quantum states that should be indistinguishable.

#### Infrastructure Attacks

**Trusted relay compromise**: Every trusted relay node in a QKD network has access to the key in plaintext. This is the Achilles’ heel of all current long-distance QKD networks, including China’s and India’s. The NSA’s critique of QKD specifically highlights this: trusted relays create “increased infrastructure costs and heightened insider threat risks.”

**Denial of service**: QKD’s eavesdropper-detection mechanism is also its DoS vulnerability. Any disturbance on the quantum channel — from Eve or from environmental noise — triggers an abort. An adversary who can’t read your messages can prevent you from communicating at all.

![](https://cdn-images-1.medium.com/max/1024/1*HTmva1sy4LeHFeO2iuc_Mw.png)

### The Path to Closing the Gap

The most promising countermeasure is **measurement-device-independent QKD (MDI-QKD)**, which eliminates all detector-side attacks by having Alice and Bob send states to an untrusted central node that performs Bell state measurements. Even if Eve controls this node completely, she cannot extract key information. MDI-QKD has been demonstrated experimentally and removes the entire class of detector blinding and efficiency mismatch attacks.

The ultimate goal is **device-independent QKD (DI-QKD)**, which requires only minimal assumptions about the quantum devices. Security is verified through Bell inequality violations, making it robust against _any_ hardware compromise. In January 2026, Lu et al. published in _Science_ a demonstration of DI-QKD over 100 km of fiber using trapped rubidium atoms — a 3,000× improvement in attainable distance over previous DI-QKD demonstrations.

### The PQC vs QKD Debate: A False Binary

The global cybersecurity community is split on whether QKD is worth the investment. The NSA explicitly does not support QKD for protecting national security systems, preferring post-quantum cryptography (PQC) — mathematical algorithms designed to resist quantum attacks. The UK’s NCSC, France’s ANSSI, and Germany’s BSI have taken similar positions.

Meanwhile, China has deployed the world’s largest QKD network. The EU is building EuroQCI across all 27 member states. India, South Korea, Japan, and Singapore are investing aggressively.

![](https://cdn-images-1.medium.com/max/1024/1*6jEULaEz8ADpwK9ckK2QnQ.png)

The honest assessment: both camps have a point. PQC is cheaper, software-deployable, and doesn’t require new physical infrastructure. But its security relies on mathematical assumptions that _could_ be broken — and the history of cryptanalysis (from Enigma to MD5 to SHA-1) suggests that hardness assumptions have a shelf life. QKD offers physics-based security but is expensive, distance-limited, and vulnerable to implementation attacks.

The emerging consensus — articulated by Xu et al. (_Reviews of Modern Physics_ 92, 025002, 2020) and increasingly adopted in EU and Asian deployments — is that the right answer is **both**. A QKD-distributed key used to encrypt a PQC-authenticated channel provides defense-in-depth: even if PQC algorithms fall to a future mathematical breakthrough, the QKD layer remains. Even if QKD hardware has implementation flaws, the PQC layer provides a safety net.

### What This Means for India

India’s 1,000 km milestone is real progress, built on indigenous technology with demonstrated hardware (ARMOS has been deployed across the Indian Army, Navy, and banking sector). QNu Labs’ approach of wider relay spacing (4 nodes for 500 km, vs. the conventional 10) could be a meaningful infrastructure cost advantage if it holds at scale.

But intellectual honesty requires acknowledging what the press release doesn’t say:

**The network uses trusted relays.** Every relay node is a potential single point of failure for security. Until quantum repeaters are practical (which requires quantum memory technology that doesn’t yet exist at the required fidelity and storage time), this is an engineering trade-off, not a physics guarantee.

**1,000 km with relays is a different achievement than 1,000 km of continuous QKD.** China’s TF-QKD demonstrations have pushed direct (relay-free) QKD to ~500 km. India’s achievement is about network scale, not about pushing the physics frontier of single-link distance.

**The 2,000 km target by 2032 is achievable** at the current pace — but the real challenge is making the network operationally useful at scale, not just demonstrating the distance. China’s CN-QCN paper (2025) reports operational key rates and uptime statistics. India will need to publish comparable data to establish credibility.

The National Quantum Mission’s ₹6,003 crore (~$720 million) budget over eight years is a serious commitment, but it’s a fraction of China’s cumulative investment. The mission’s expansion to 17 supported startups, including ventures in quantum biosensors, photon sensing, and atomic memory, suggests India is building breadth across the quantum technology stack, not just depth in QKD.

### The Bottom Line

Quantum key distribution is the only known method of distributing encryption keys whose security is guaranteed by physics rather than mathematical conjecture. India’s 1,000 km deployment is a genuine milestone that positions the country in the top tier of QKD-deploying nations.

But “quantum-secured” doesn’t mean “unhackable.” The implementation gap between theoretical security proofs and deployed hardware is real, well-documented in the peer-reviewed literature, and actively exploited in laboratory demonstrations. Detector blinding attacks have recovered full keys from commercial systems. Trusted relays introduce classical vulnerabilities into quantum networks. And the entire enterprise competes for resources with PQC, which offers cheaper, more immediately deployable protection against the same threat.

The key — pun fully intended — is that quantum security is not a binary. It’s a spectrum, and India just moved substantially along it.

### Code & Figures

All figures in this post were generated by the accompanying Python script [qkd\_blog\_figures.py](https://github.com/MonitSharma/medium_articles/blob/main/quantum_garden/qkd_blog_figures.py), which includes:

-   A full BB84 protocol simulation with configurable eavesdropping
-   QBER analysis showing eavesdropper detectability
-   Key rate vs. distance modeling (BB84, PLOB bound, TF-QKD)
-   Global QKD network comparison
-   Attack taxonomy visualization
-   India NQM progress timeline

The simulation confirms the theoretical prediction: full intercept-resend attack produces QBER ≈ 25%, well above the BB84 security threshold of ~11%. Even intercepting just 44% of qubits is detectable.

### References

1.  Bennett, C.H. & Brassard, G. “Quantum cryptography: Public key distribution and coin tossing.” _Proceedings of IEEE International Conference on Computers, Systems, and Signal Processing_, 175–179 (1984).
2.  Scarani, V. et al. “The security of practical quantum key distribution.” _Reviews of Modern Physics_ 81, 1301 (2009).
3.  Chen, Y.-A. et al. “An integrated space-to-ground quantum communication network over 4,600 kilometres.” _Nature_589, 214–219 (2021).
4.  Pirandola, S. et al. “Fundamental limits of repeaterless quantum communications.” _Nature Communications_ 8, 15043 (2017).
5.  Lucamarini, M. et al. “Overcoming the rate–distance limit of quantum key distribution without quantum repeaters.” _Nature_ 557, 400–403 (2018).
6.  Lydersen, L. et al. “Hacking commercial quantum cryptography systems by tailored bright illumination.” _Nature Photonics_ 4, 686–689 (2010).
7.  Xu, F. et al. “Secure quantum key distribution with realistic devices.” _Reviews of Modern Physics_ 92, 025002 (2020).
8.  Hwang, W.-Y. “Quantum key distribution with high loss: Toward global secure communication.” _Physical Review Letters_ 91, 057901 (2003).
9.  Lo, H.-K., Ma, X. & Chen, K. “Decoy state quantum key distribution.” _Physical Review Letters_ 94, 230504 (2005).
10.  Ponosova, A. et al. “Realistic vulnerabilities of decoy-state quantum key distribution.” _Scientific Reports_ 15, Article 29144 (2025).
11.  Yang, H. et al. “Implementation of carrier-grade quantum communication networks over 10,000 km.” _npj Quantum Information_ 11, 89 (2025).
12.  Lu, B.-W. et al. “Device-independent quantum key distribution over 100 km of fiber.” _Science_ (2026).
13.  Alléaume, R. et al. “The debate over QKD: A rebuttal to the NSA’s objections.” arXiv:2307.15116 (2023).
14.  NSA, “Quantum Key Distribution (QKD) and Quantum Cryptography (QC).” NSA Cybersecurity Guidance (2020).
15.  Pljonkin, A. et al. “A Review of Security Evaluation of Practical Quantum Key Distribution System.” _Entropy_ 24, 246 (2022).
