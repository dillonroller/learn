# Mission: Cryptography & Number Theory

## Why
Direct spinoff of the [[../quantum-computing/MISSION.md|Quantum Computing]] course's Shor's algorithm lesson (queued as lesson 7 there) — understanding exactly what Shor's algorithm breaks requires understanding what RSA actually is and why factoring is hard in the first place, which opens onto the broader, genuinely elegant number theory and cryptography underlying essentially all of modern computer security.

## Success looks like
- Explain RSA end to end (key generation, encryption, decryption) and prove correctness using Euler's theorem / modular exponentiation, worked with real (small) numbers
- Explain why factoring large numbers is believed to be hard classically, and connect that directly to why Shor's algorithm threatens it
- Explain Diffie-Hellman key exchange and the discrete log problem, and why it rests on a different hardness assumption than factoring
- Describe at least one post-quantum cryptography approach (e.g. lattice-based) well enough to state what hardness assumption it relies on instead

## Constraints
- Strong CS background; comfortable with modular arithmetic and basic group theory (can lean on the user's [[../category-theory/MISSION.md|Category Theory]] course for algebraic intuition where useful)
- Self-study with an AI teacher
- Builds toward, and cross-links directly with, the [[../quantum-computing/MISSION.md|Quantum Computing]] course's Shor's algorithm material

## Out of scope
- Implementing production-grade cryptographic code (side-channel resistance, constant-time implementations) — this is the math/theory, not applied crypto engineering
- Symmetric cryptography (AES) or hash functions in depth as a primary focus — the mission is public-key crypto and its number-theoretic foundations, since that's the thread connecting to quantum computing; hash functions may get a brief treatment near the end but aren't the core
