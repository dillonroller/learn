# Teaching Notes

- This topic's scaffold (MISSION.md, index.html placeholders 01–09) predates this session — it was set up as a broad "epistemology, ethics, metaphysics, key thinkers" umbrella but never actually taught.
- The user's first real request into this topic came sideways, from a question in the Logic curriculum (lesson 13's "we should ban the additive" example) about what "should" means logically and whether that was covered. That opened onto deontic logic, then epistemic logic and transcendental arguments as a natural cluster of "logic extensions classical logic doesn't cover."
- Decision: build a new "Logic Extensions" section (lessons 10–12) ahead of the original placeholders 01–09, since that's the actual entry point the user arrived through. The placeholders (What is Philosophy, Epistemology, Ethics, Metaphysics, Existentialism, etc.) remain queued for later — don't renumber them, just add after.
- Keep the same secular constraint carried over from Logic: don't center examples on religion. The transcendental arguments lesson uses Kant's own causality/experience example as primary; the "transcendental argument for God" (TAG) is mentioned only as a known application, not the focus.
- User has just finished the full 14-lesson Logic curriculum, so: don't re-explain propositional/predicate logic, validity/soundness, or the deductive/inductive distinction from scratch — link back to Logic's anchors instead ([[../logic/lessons/0001-arguments-validity-soundness.html]], etc.).
- Follows the split with [[../rationality/NOTES.md]] — Philosophy houses the more formal/theoretical extensions of logic; Rationality houses the practical, everyday-life-and-relationships reasoning (biases, probability, charitable interpretation).

## Session: core branches 1–9 built out

- The nine placeholder cards (01–09) are now real lessons. Ordering note from the previous session still holds:
  they were added *after* 10–12 in creation order but sit before them in the index, which is intentional — the
  index reads as a curriculum, the numbering records what was taught when.
- **Lesson 5 is not a Logic repeat.** The original placeholder desc was "valid vs sound arguments, fallacies" —
  all of which the user already has from the full Logic curriculum. It was rewritten as the five philosophical
  *methods* (counterexample, thought experiment, charity, reductio, reflective equilibrium) with links back to
  Logic for the formal parts. Don't re-teach validity/soundness/fallacies here.
- **Retrieval scaffolding added**: lessons 3 and 5 open with a "From memory first" callout asking the user to
  recall a prior lesson's content unprompted, and lesson 9 is built as a spaced review of 1–8. If the user finds
  these annoying, drop them — but they are the main storage-strength mechanism in this topic.
- **Quiz option lengths were deliberately equalized** (mean spread now ~5 characters per question, and the
  correct answer is the longest option in only 3 of 36 questions). Before this pass the correct answer was the
  longest in 33 of 36 — a pure formatting tell. Keep this discipline when adding questions; there's a checker
  pattern in this session's history worth re-running.
- **Two shared components were extracted** rather than inlined again: `.mc-exercise` card styles now live in
  `/assets/theme.css`, and a `renderMC(containerId, items)` helper in `/assets/quiz.js` replaces the
  hand-rolled DOM loop that 58 older lessons each carry a copy of. New lessons should use both. The older
  lessons keep their inline copies and are unaffected — worth migrating opportunistically, not in a big pass.
- Secular constraint maintained: Kierkegaard's religious resolution is named and set aside in lesson 6;
  Camus' "leap" is discussed as a move he rejects, not as a religious topic.
- **Known inconsistency flagged, not fixed**: the topic index blurb promises "Western and Eastern philosophical
  traditions" and the curriculum is entirely Western. Either gather Eastern sources or narrow the blurb — ask
  the user which, rather than quietly deleting the promise.
