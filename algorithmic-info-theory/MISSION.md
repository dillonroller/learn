# Mission: Algorithmic Information Theory

## Why
The third of three "modern, rigorous, not-widely-known" directions chosen alongside [[../quantum-mechanics/MISSION.md|Quantum Mechanics]] and [[../category-theory/MISSION.md|Category Theory]]. This topic asks a deceptively simple question with a rigorous, formal answer: what does it mean for something to be "simple," "random," or "compressible" at all? It's the direct mathematical descendant of the same self-reference machinery the user just mastered in [[../logic/lessons/0015-godel-proof-diagonalization.html|Logic lesson 15]] (Gödel numbering, diagonalization) and lesson 9's Turing/decidability material — genuinely obscure outside specialists, despite underpinning ideas (data compression, "true randomness," the limits of explanation) that come up constantly.

## Success looks like
- Define Kolmogorov complexity K(x) — the length of the shortest program that outputs x — and explain why this is a rigorous, if uncomputable, definition of "simplicity"
- Explain why a string is "algorithmically random" if K(x) is close to its own length (no shorter description exists), and connect this to intuitions about compressibility
- Prove (or follow a proof of) why K is uncomputable, and recognize the proof as a diagonalization argument in the same family as Gödel's and the halting problem's
- State the relationship between Kolmogorov complexity and Shannon entropy/classical information theory clearly enough to say what each one is actually measuring and why they're not the same thing despite both being called "information"

## Constraints
- No prior information theory or computability background beyond what Logic already covered (Turing/Church material in lesson 9, Gödel's proof in lesson 15) — build directly on that rather than re-deriving computability from scratch
- Very strong technical/CS background — comfortable with formal proofs, algorithms, and the diagonalization pattern already
- Self-study with an AI teacher

## Out of scope
- Full classical (Shannon) information theory as its own multi-lesson arc — covered only as much as needed to contrast with Kolmogorov complexity, not a complete treatment of channel capacity, coding theory, etc.
- Applications to specific compression algorithms (gzip, etc.) beyond illustrative mention — the mission is the theory of what's possible in principle, not engineering practice
- Advanced topics (Chaitin's constant Ω in full depth, algorithmic statistics) — a light mention is fine, full treatment is not the goal of the initial mission
