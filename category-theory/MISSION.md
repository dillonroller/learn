# Mission: Category Theory

## Why
One of three "modern, rigorous, not-widely-known" directions the user chose (alongside [[../quantum-mechanics/MISSION.md|Quantum Mechanics]] and [[../algorithmic-info-theory/MISSION.md|Algorithmic Information Theory]]) after finishing Logic and Rationality's core curricula and specifically enjoying [[../logic/lessons/0015-godel-proof-diagonalization.html|Logic lesson 15]]'s proof-heavy style. Category theory is sometimes called "the math of math" — an extremely abstract, symbol-heavy language for structure and composition that shows up everywhere from type systems (the user's own Rust/C background) to physics to logic itself. It's a natural next step for someone who likes rigor and proofs, applied to structure-finding rather than to a specific domain.

## Success looks like
- Define a category (objects, morphisms, identity, composition, associativity) precisely and give at least three genuinely different examples (not just "sets and functions" three times with different names)
- Explain what a functor is and why "a structure-preserving map between categories" is the right way to think about it, with a concrete example from programming (e.g. `Option`/`Maybe` or a container type)
- Read a categorical diagram and verify whether it commutes
- Connect category theory back to something already known — e.g. how function composition and type signatures in Rust/C relate to morphisms and composition in a category

## Constraints
- No prior abstract algebra or category theory background, but very strong technical/CS background (Rust/C, comfortable with types, generics, and formal notation) — lean on programming-language analogies as the primary intuition pump, the way Bartosz Milewski's "Category Theory for Programmers" does, rather than starting from abstract algebra prerequisites
- Self-study with an AI teacher
- Move quickly through pure definitions once a pattern is established — spend the saved time on worked examples and diagrams, same pacing preference as Logic

## Out of scope
- Advanced categorical machinery (topos theory, higher category theory, enriched categories) — foundations (categories, functors, natural transformations, maybe universal properties) are the mission, not research-level material
- A full functional-programming curriculum — programming examples are illustrations of the math, not the point of the topic
- Applications to physics or logic beyond a passing mention — those connections are real and worth noting, but going deep on any one of them belongs to that application's own topic
