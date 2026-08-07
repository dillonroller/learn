# Mission: Quantum Computing

## Why
Direct follow-on from [[../quantum-mechanics/MISSION.md|Quantum Mechanics]], whose own scope note flagged quantum computing as "a natural future topic" once the physics formalism (state vectors, the Born rule, entanglement, unitary evolution) was in place. The user has now asked for a comprehensive, intuitive-but-rigorous course on quantum computing itself: not "quantum is weird and powerful" hand-waving, but a real, fundamental understanding of what a quantum computer is, why entanglement and interference make certain algorithms faster, and how the famous results (Grover's, Shor's) actually work.

## Success looks like
- Represent single- and multi-qubit states, apply standard gates (X, Y, Z, H, S, T, CNOT, Toffoli) as matrices, and read/write a quantum circuit diagram
- Explain *precisely* why quantum computers can outperform classical ones on some problems — interference amplifying correct answers and cancelling wrong ones — not "trying all answers in parallel," which is the popular misconception this course should specifically correct
- Walk through the Deutsch-Jozsa and Grover's algorithms step by step and explain what each one's speedup actually comes from
- Explain the period-finding core of Shor's algorithm well enough to say why it breaks RSA, and place quantum computers correctly on the complexity map (BQP) — powerful for specific structured problems, not a magic solver for NP-hard problems in general
- Give a working account of why real quantum computers are hard to build (decoherence, noise) and what error correction buys you, in outline

## Constraints
- Strong existing foundation from [[../quantum-mechanics/MISSION.md|Quantum Mechanics]] (state vectors, Born rule, tensor products, entanglement, unitary evolution via Schrödinger's equation) — this course builds directly on that rather than re-deriving it from scratch
- Very strong technical/CS background (linear algebra, complex numbers, algorithms, complexity theory) — a computer-science-flavored treatment (circuits, gates, algorithms, complexity classes), not a hardware-engineering or experimental-physics one
- Self-study with an AI teacher
- Same rigor-over-rhetoric standard as Quantum Mechanics and Logic: be explicit about what's a genuine computational advantage vs. popular oversimplification ("quantum computers try every answer at once")

## Out of scope
- Building or programming on real hardware (Qiskit/Cirq setup, cloud QPU access) — this is a conceptual/mathematical course, not a lab course; may become a natural follow-on later
- Deep quantum error-correction theory (stabilizer formalism, surface codes in full) — the course covers *why* error correction is needed and the core idea in outline, not a full coding-theory treatment
- Quantum field theory or relativistic extensions — out of scope here just as it was for Quantum Mechanics
