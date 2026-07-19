# Mission: Logic

## Why
To understand logic from the ground up, at a technical level — the formal machinery of valid reasoning, not just intuitions about "makes sense" vs "doesn't." The immediate driver is following philosophical and public debates more rigorously: hearing an argument and being able to say precisely why it holds together or falls apart, independent of whether the conclusion is agreeable. Applications may include evaluating specific claims (including religious ones) but the discipline itself — not any single target — is the goal.

## Success looks like
- Formally distinguish a valid argument from an invalid one, independent of whether premises or conclusion are true
- Symbolize natural-language arguments in propositional and predicate logic
- Construct and check formal proofs (natural deduction)
- Name and recognize the standard formal and informal fallacies on sight
- Explain what soundness, completeness, and consistency mean for a formal system, and why Gödel's results matter
- Reconstruct a real spoken argument (e.g. from a debate) into premise/conclusion form and evaluate it

The core 14-lesson curriculum above is complete. As of 2026-07-19 the mission entered a **mastery phase**: the user explicitly asked to go deeper rather than move to a new topic — "getting to really know it," specifically citing the rigor of symbols and proofs as what they enjoy most. Phase 2 success looks like:
- Actually walk through Gödel's First Incompleteness Theorem's proof sketch (arithmetization of syntax, the diagonalization lemma, constructing G) rather than stopping at the conceptual/what-it-means treatment lesson 11 gave
- Read and reason about at least one non-classical logic beyond modal logic's light touch (e.g. intuitionistic/constructive logic) well enough to state how its proof rules differ from classical logic and why

## Constraints
- No prior formal logic background, but strong technical/CS background (comfortable with formal notation, proofs-as-code intuitions, Rust/C)
- Can move quickly through symbolic formalism — don't over-explain syntax once the pattern is established
- Self-study with an AI teacher
- Mastery-phase lessons should number onward from 0015 in the same `lessons/` directory — this is a deeper pass on the same topic, not a new one

## Out of scope
- Building this course around any single debate topic (religion or otherwise) — logic is the subject, not the application
- Full metalogic *research* (original open problems) — mastery phase is about rigorously understanding established results, not doing novel proof theory
- An exhaustive tour of non-classical logics — go deep on one or two (Gödel's proof, intuitionistic logic), not a survey of every variant
