/* ============================================================
   Site-wide command palette / fuzzy finder.
   Self-contained: injects its own styles and DOM, no dependencies.
   Paths in the index are root-relative (no leading slash). Each page
   computes its own prefix back to the site root by inspecting how
   THIS script was loaded — so it works identically under file://
   and http://, no server required.
   ============================================================ */

(function () {
  // Figure out how deep the current page is by looking at the src
  // attribute used to load this very script (e.g. "../../assets/search.js"
  // means we're 2 levels below the site root).
  const thisScript = document.currentScript || document.querySelector('script[src$="assets/search.js"]');
  const scriptSrc = thisScript ? thisScript.getAttribute('src') : 'assets/search.js';
  const ROOT_PREFIX = scriptSrc.replace(/assets\/search\.js(\?.*)?$/, '');

  const INDEX = [
    // ── Logic: lesson-level entries ──
    { term: 'Arguments, Validity & Soundness', kind: 'Lesson 1', topic: 'Logic', file: 'logic/lessons/0001-arguments-validity-soundness.html', desc: 'The ground floor — what makes reasoning logical at all.' },
    { term: 'Propositional Logic: Syntax & Connectives', kind: 'Lesson 2', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', desc: 'Symbolizing statements, connectives, well-formed formulas.' },
    { term: 'Truth Tables & Semantic Evaluation', kind: 'Lesson 3', topic: 'Logic', file: 'logic/lessons/0003-truth-tables.html', desc: 'Mechanically deciding validity.' },
    { term: 'Logical Equivalence & Normal Forms', kind: 'Lesson 4', topic: 'Logic', file: 'logic/lessons/0004-logical-equivalence-normal-forms.html', desc: "De Morgan's laws, CNF/DNF." },
    { term: 'Natural Deduction', kind: 'Lesson 5', topic: 'Logic', file: 'logic/lessons/0005-natural-deduction.html', desc: 'Propositional proofs, rules of inference.' },

    // ── Logic: term definitions (lesson 1) ──
    { term: 'Argument', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0001-arguments-validity-soundness.html', anchor: 'argument', desc: 'Premises offered as reasons for a conclusion.' },
    { term: 'Validity', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0001-arguments-validity-soundness.html', anchor: 'validity', desc: 'Structure guarantees the conclusion, if premises are true.' },
    { term: 'Soundness', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0001-arguments-validity-soundness.html', anchor: 'soundness', desc: 'Valid + all premises actually true.' },
    { term: 'Deductive vs Inductive', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0001-arguments-validity-soundness.html', anchor: 'deductive-inductive', desc: 'Certainty vs probability of the conclusion.' },

    // ── Logic: term definitions (lesson 2) ──
    { term: 'Atomic Proposition', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', anchor: 'atomic-proposition', desc: 'A statement that is either true or false, no internal structure.' },
    { term: 'The Five Connectives', kind: 'Reference', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', anchor: 'connectives', desc: '¬ ∧ ∨ → ↔, mapped to Rust/C boolean operators.', keywords: ['not', 'and', 'or', 'negation', 'conjunction', 'disjunction'] },
    { term: 'Antecedent', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', anchor: 'antecedent', desc: 'The "if" part of P → Q.' },
    { term: 'Consequent', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', anchor: 'consequent', desc: 'The "then" part of P → Q.' },
    { term: 'Affirming the Consequent', kind: 'Fallacy', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', anchor: 'affirming-the-consequent', desc: 'Invalid: P→Q, Q ⊢ P.' },
    { term: 'Denying the Antecedent', kind: 'Fallacy', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', anchor: 'denying-the-antecedent', desc: 'Invalid: P→Q, ¬P ⊢ ¬Q.' },
    { term: 'Well-Formed Formula (WFF)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', anchor: 'well-formed-formulas', desc: 'The recursive grammar for legal formulas.', keywords: ['wff', 'grammar'] },
    { term: 'Main Connective', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', anchor: 'main-connective', desc: 'The connective applied last — root of the parse tree.' },
    { term: 'Falsification Test', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', anchor: 'falsification-test', desc: 'Find the scenario that would make the sentence a lie.' },
    { term: 'Modal Words (may, can, must, should)', kind: 'Note', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', anchor: 'modal-words', desc: 'Watch for permission/obligation claims when symbolizing.', keywords: ['may', 'can', 'must', 'should', 'permission'] },
    { term: 'Necessary vs Sufficient', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', anchor: 'necessary-sufficient', desc: '"Only if" states necessary, not sufficient.' },
    { term: 'Only If vs If', kind: 'Note', topic: 'Logic', file: 'logic/lessons/0002-propositional-logic-syntax.html', anchor: 'only-if-necessary-sufficient', desc: 'One word flips the direction of the conditional.' },

    // ── Logic: term definitions (lesson 3) ──
    { term: 'Counterexample', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0003-truth-tables.html', anchor: 'counterexample', desc: 'A row where premises are true but the conclusion is false — disproves validity.' },
    { term: 'Tautology', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0003-truth-tables.html', anchor: 'tautology', desc: 'True in every row, no matter what.' },
    { term: 'Contradiction', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0003-truth-tables.html', anchor: 'contradiction', desc: 'False in every row, no matter what.' },
    { term: 'Contingency', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0003-truth-tables.html', anchor: 'contingency', desc: 'True in some rows, false in others.' },
    { term: 'Validity Test (truth tables)', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0003-truth-tables.html', anchor: 'validity-test', desc: 'Valid iff no row makes premises true and conclusion false.' },
    { term: 'Modus Ponens', kind: 'Rule', topic: 'Logic', file: 'logic/lessons/0003-truth-tables.html', anchor: 'modus-ponens', desc: 'P→Q, P ⊢ Q. Valid — proven by truth table.' },
    { term: 'Logical Equivalence', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0003-truth-tables.html', anchor: 'equivalence-preview', desc: 'Two formulas match on every row of their truth tables.' },

    // ── Logic: term definitions (lesson 4) ──
    { term: 'Equivalence Laws', kind: 'Reference', topic: 'Logic', file: 'logic/lessons/0004-logical-equivalence-normal-forms.html', anchor: 'equivalence-laws', desc: "De Morgan, commutativity, associativity, distributivity, contraposition..." },
    { term: "De Morgan's Laws", kind: 'Rule', topic: 'Logic', file: 'logic/lessons/0004-logical-equivalence-normal-forms.html', anchor: 'de-morgan-proven', desc: '¬(P∧Q) ≡ ¬P∨¬Q, and the mirror for ∨.', keywords: ['demorgan'] },
    { term: 'Normal Forms (CNF/DNF)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0004-logical-equivalence-normal-forms.html', anchor: 'normal-forms', desc: 'Standardized formula shapes.' },
    { term: 'Conjunctive Normal Form (CNF)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0004-logical-equivalence-normal-forms.html', anchor: 'cnf', desc: 'AND of ORs. Required input for SAT solvers.' },
    { term: 'Disjunctive Normal Form (DNF)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0004-logical-equivalence-normal-forms.html', anchor: 'dnf', desc: 'OR of ANDs. Mirror of CNF.' },

    // ── Logic: term definitions (lesson 5) ──
    { term: 'Rules of Inference', kind: 'Reference', topic: 'Logic', file: 'logic/lessons/0005-natural-deduction.html', anchor: 'core-inference-rules', desc: 'MP, MT, HS, DS, Conj, Simp, Add.' },
    { term: 'Turnstile (⊢)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0005-natural-deduction.html', anchor: 'turnstile', desc: '"Therefore" — a claim about an argument, not a connective.', keywords: ['therefore', 'entails', 'follows'] },
    { term: 'Modus Tollens', kind: 'Rule', topic: 'Logic', file: 'logic/lessons/0005-natural-deduction.html', anchor: 'modus-tollens', desc: 'P→Q, ¬Q ⊢ ¬P. Valid.' },
    { term: 'Hypothetical Syllogism', kind: 'Rule', topic: 'Logic', file: 'logic/lessons/0005-natural-deduction.html', anchor: 'hypothetical-syllogism', desc: 'P→Q, Q→R ⊢ P→R. Valid.' },
    { term: 'Disjunctive Syllogism', kind: 'Rule', topic: 'Logic', file: 'logic/lessons/0005-natural-deduction.html', anchor: 'disjunctive-syllogism', desc: 'P∨Q, ¬P ⊢ Q. Valid.' },
    { term: 'Reductio ad Absurdum', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0005-natural-deduction.html', anchor: 'reductio', desc: 'Proof by contradiction — assume the opposite, derive a contradiction.', keywords: ['proof by contradiction'] },

    // ── Logic: term definitions (lesson 6) ──
    { term: 'Predicate Logic: Quantifiers & Predicates', kind: 'Lesson 6', topic: 'Logic', file: 'logic/lessons/0006-predicate-logic-quantifiers.html', desc: '∀ and ∃ — reasoning about "all" and "some" formally.' },
    { term: 'Predicate', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0006-predicate-logic-quantifiers.html', anchor: 'predicate', desc: 'A property/relation with a blank — becomes a proposition once applied.' },
    { term: 'Domain of Discourse', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0006-predicate-logic-quantifiers.html', anchor: 'domain-of-discourse', desc: 'The set of things being quantified over.' },
    { term: 'Universal Quantifier (∀)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0006-predicate-logic-quantifiers.html', anchor: 'universal-quantifier', desc: '"For all x" — pairs with →, not ∧.', keywords: ['forall', 'for all'] },
    { term: 'Existential Quantifier (∃)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0006-predicate-logic-quantifiers.html', anchor: 'existential-quantifier', desc: '"There exists an x" — pairs with ∧, not →.', keywords: ['exists', 'there exists'] },
    { term: 'Negating Quantifiers', kind: 'Rule', topic: 'Logic', file: 'logic/lessons/0006-predicate-logic-quantifiers.html', anchor: 'quantifier-negation', desc: '¬∀x P(x) ≡ ∃x ¬P(x), and the mirror. De Morgan for quantifiers.' },

    // ── Logic: term definitions (lesson 7) ──
    { term: 'Symbolizing English Arguments in FOL', kind: 'Lesson 7', topic: 'Logic', file: 'logic/lessons/0007-symbolizing-fol.html', desc: 'Turning real sentences into precise first-order logic.' },
    { term: 'Multi-Place Predicates', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0007-symbolizing-fol.html', anchor: 'multi-place-predicates', desc: 'Relations like Loves(x,y) — argument order matters.', keywords: ['relations'] },
    { term: 'Quantifier Order', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0007-symbolizing-fol.html', anchor: 'quantifier-order', desc: '∀x∃y ≠ ∃y∀x — swapping order changes the claim entirely.' },

    // ── Logic: term definitions (lesson 8) ──
    { term: 'Proofs in Predicate Logic', kind: 'Lesson 8', topic: 'Logic', file: 'logic/lessons/0008-proofs-in-predicate-logic.html', desc: 'Universal/existential instantiation and generalization rules.' },
    { term: 'Universal Instantiation (UI)', kind: 'Rule', topic: 'Logic', file: 'logic/lessons/0008-proofs-in-predicate-logic.html', anchor: 'universal-instantiation', desc: '∀x P(x) ⊢ P(a). Always safe — no restrictions.' },
    { term: 'Existential Generalization (EG)', kind: 'Rule', topic: 'Logic', file: 'logic/lessons/0008-proofs-in-predicate-logic.html', anchor: 'existential-generalization', desc: 'P(a) ⊢ ∃x P(x). Always safe — no restrictions.' },
    { term: 'Existential Instantiation (EI)', kind: 'Rule', topic: 'Logic', file: 'logic/lessons/0008-proofs-in-predicate-logic.html', anchor: 'existential-instantiation', desc: '∃x P(x) ⊢ P(c). Requires c to be a fresh name.' },
    { term: 'Universal Generalization (UG)', kind: 'Rule', topic: 'Logic', file: 'logic/lessons/0008-proofs-in-predicate-logic.html', anchor: 'universal-generalization', desc: 'P(a) ⊢ ∀x P(x). Requires a to be truly arbitrary.' },

    // ── Logic: term definitions (lesson 9) ──
    { term: 'Soundness & Completeness', kind: 'Lesson 9', topic: 'Logic', file: 'logic/lessons/0009-soundness-completeness.html', desc: 'What a formal system actually guarantees you — and what it can\'t.' },
    { term: 'Semantic Entailment (⊨)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0009-soundness-completeness.html', anchor: 'semantic-entailment', desc: '"Entails" — true in every model, no counterexample row.', keywords: ['models'] },
    { term: 'Soundness (of a proof system)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0009-soundness-completeness.html', anchor: 'proof-system-soundness', desc: '⊢ → ⊨. Not the same as lesson 1\'s argument-level soundness.' },
    { term: 'Completeness (of a proof system)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0009-soundness-completeness.html', anchor: 'completeness', desc: '⊨ → ⊢. Every valid argument has a proof, guaranteed to exist.' },
    { term: 'Decidability', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0009-soundness-completeness.html', anchor: 'decidability', desc: 'Propositional logic is decidable; full FOL is complete but not decidable.' },

    // ── Logic: term definitions (lesson 10) ──
    { term: 'Modal Logic — Necessity & Possibility', kind: 'Lesson 10', topic: 'Logic', file: 'logic/lessons/0010-modal-logic.html', desc: '□ and ◇ — reasoning about what must be true vs what could be true.' },
    { term: 'Necessity (□)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0010-modal-logic.html', anchor: 'necessity', desc: '□P — true in every possible world.', keywords: ['must', 'necessarily'] },
    { term: 'Possibility (◇)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0010-modal-logic.html', anchor: 'possibility', desc: '◇P — true in at least one possible world.', keywords: ['may', 'can', 'might'] },
    { term: 'Possible Worlds Semantics', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0010-modal-logic.html', anchor: 'possible-worlds-semantics', desc: 'A possible world is a complete, self-consistent way things could be.' },
    { term: 'Modal Duality', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0010-modal-logic.html', anchor: 'modal-duality', desc: '¬□P ≡ ◇¬P and ¬◇P ≡ □¬P — mirrors quantifier negation.' },
    { term: 'Modal Scope Fallacy', kind: 'Fallacy', topic: 'Logic', file: 'logic/lessons/0010-modal-logic.html', anchor: 'modal-scope-fallacy', desc: '□(P→Q) ≠ P→□Q. Confusing a necessary conditional with a necessary consequent.' },

    // ── Logic: term definitions (lesson 11) ──
    { term: 'Gödel\'s Incompleteness Theorems', kind: 'Lesson 11', topic: 'Logic', file: 'logic/lessons/0011-godels-incompleteness-theorems.html', desc: 'What they actually say, and the popular claims that misuse them.', keywords: ['godel'] },
    { term: 'Hilbert\'s Program', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0011-godels-incompleteness-theorems.html', anchor: 'hilberts-program', desc: 'The early-1900s dream of a consistent, complete, decidable system for all of math.' },
    { term: 'First Incompleteness Theorem', kind: 'Theorem', topic: 'Logic', file: 'logic/lessons/0011-godels-incompleteness-theorems.html', anchor: 'first-incompleteness-theorem', desc: 'Any consistent system strong enough for arithmetic has true statements it can\'t prove.', keywords: ['godel'] },
    { term: 'Second Incompleteness Theorem', kind: 'Theorem', topic: 'Logic', file: 'logic/lessons/0011-godels-incompleteness-theorems.html', anchor: 'second-incompleteness-theorem', desc: 'Such a system can\'t prove its own consistency from within itself.', keywords: ['godel'] },
    { term: 'Gödel Theorem Misuse', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0011-godels-incompleteness-theorems.html', anchor: 'incompleteness-misuse', desc: 'Before citing Gödel outside math: which system, which statement, what\'s unprovable?', keywords: ['godel'] },
    { term: 'Proving Gödel: Arithmetization & the Diagonal Lemma', kind: 'Lesson 15', topic: 'Logic', file: 'logic/lessons/0015-godel-proof-diagonalization.html', desc: 'The actual construction of G — Gödel numbering, representability, and the diagonal lemma.', keywords: ['godel', 'mastery'] },
    { term: 'Gödel Numbering', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0015-godel-proof-diagonalization.html', anchor: 'godel-numbering', desc: 'Encoding every symbol, formula, and proof as a unique natural number via prime powers.', keywords: ['godel'] },
    { term: 'Representability / Prov(y)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0015-godel-proof-diagonalization.html', anchor: 'representability', desc: 'The provability predicate ∃x. Proof(x, y) — "y is provable" as an arithmetic formula.', keywords: ['godel'] },
    { term: 'Diagonal Lemma', kind: 'Theorem', topic: 'Logic', file: 'logic/lessons/0015-godel-proof-diagonalization.html', anchor: 'diagonal-lemma', desc: 'For any ψ(x), a sentence φ exists with φ ↔ ψ(⌜φ⌝) — the quine-like self-reference engine.', keywords: ['godel', 'fixed point'] },
    { term: 'Constructing G', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0015-godel-proof-diagonalization.html', anchor: 'constructing-g', desc: 'Applying the diagonal lemma to ¬Prov(x) to build G ↔ ¬Prov(⌜G⌝).', keywords: ['godel'] },
    { term: 'Intuitionistic Logic: What Changes Without Excluded Middle', kind: 'Lesson 16', topic: 'Logic', file: 'logic/lessons/0016-intuitionistic-logic.html', desc: 'BHK semantics, why double-negation elimination fails, and the Curry–Howard correspondence.', keywords: ['mastery', 'non-classical'] },
    { term: 'Law of Excluded Middle (LEM)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0016-intuitionistic-logic.html', anchor: 'law-of-excluded-middle', desc: 'P ∨ ¬P — a classical tautology that intuitionistic logic does not assume.' },
    { term: 'BHK Interpretation', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0016-intuitionistic-logic.html', anchor: 'bhk-interpretation', desc: 'Reading each connective as a specification for what counts as a constructive proof.' },
    { term: 'Double-Negation Elimination', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0016-intuitionistic-logic.html', anchor: 'double-negation', desc: '¬¬P ⊢ P — valid classically, not intuitionistically; interderivable with LEM.' },
    { term: 'Curry–Howard Correspondence', kind: 'Theorem', topic: 'Logic', file: 'logic/lessons/0016-intuitionistic-logic.html', anchor: 'intuitionistic-proof-system', desc: 'Propositions as types, proofs as programs — why your compiler already does intuitionistic logic.' },

    // ── Logic: term definitions (lesson 12) ──
    { term: 'Informal Fallacies', kind: 'Lesson 12', topic: 'Logic', file: 'logic/lessons/0012-informal-fallacies.html', desc: 'Ad hominem, strawman, slippery slope — where real debates actually break.' },
    { term: 'Formal vs. Informal Fallacies', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0012-informal-fallacies.html', anchor: 'formal-vs-informal', desc: 'Formal errors break structure regardless of content; informal errors are content-dependent.' },
    { term: 'Ad Hominem', kind: 'Fallacy', topic: 'Logic', file: 'logic/lessons/0012-informal-fallacies.html', anchor: 'ad-hominem', desc: 'Attacking the arguer instead of the argument.' },
    { term: 'Straw Man', kind: 'Fallacy', topic: 'Logic', file: 'logic/lessons/0012-informal-fallacies.html', anchor: 'straw-man', desc: 'Refuting a misrepresented version of the actual position.' },
    { term: 'Appeal to Authority', kind: 'Fallacy', topic: 'Logic', file: 'logic/lessons/0012-informal-fallacies.html', anchor: 'appeal-to-authority', desc: 'Citing irrelevant fame/status instead of relevant expertise.' },
    { term: 'Appeal to Popularity', kind: 'Fallacy', topic: 'Logic', file: 'logic/lessons/0012-informal-fallacies.html', anchor: 'appeal-to-popularity', desc: '"Many people believe it" as if that made it true.', keywords: ['ad populum'] },
    { term: 'False Dilemma', kind: 'Fallacy', topic: 'Logic', file: 'logic/lessons/0012-informal-fallacies.html', anchor: 'false-dilemma', desc: 'Presenting two options as the only ones when more exist.', keywords: ['false dichotomy'] },
    { term: 'Slippery Slope', kind: 'Fallacy', topic: 'Logic', file: 'logic/lessons/0012-informal-fallacies.html', anchor: 'slippery-slope', desc: 'Chaining conditionals to an extreme outcome without supporting each link.' },
    { term: 'Circular Reasoning', kind: 'Fallacy', topic: 'Logic', file: 'logic/lessons/0012-informal-fallacies.html', anchor: 'circular-reasoning', desc: 'The conclusion is quietly planted as a premise.', keywords: ['begging the question'] },
    { term: 'Hasty Generalization', kind: 'Fallacy', topic: 'Logic', file: 'logic/lessons/0012-informal-fallacies.html', anchor: 'hasty-generalization', desc: 'A universal claim from far too small a sample.' },

    // ── Logic: term definitions (lesson 13) ──
    { term: 'Argument Mapping & Reconstruction', kind: 'Lesson 13', topic: 'Logic', file: 'logic/lessons/0013-argument-mapping-reconstruction.html', desc: 'Turning a spoken argument you just heard into premises and a conclusion.' },
    { term: 'Conclusion Indicator Words', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0013-argument-mapping-reconstruction.html', anchor: 'conclusion-indicators', desc: 'therefore, thus, so, hence, this shows — and the conclusion isn\'t always last.' },
    { term: 'Premise Indicator Words', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0013-argument-mapping-reconstruction.html', anchor: 'premise-indicators', desc: 'because, since, given that — but not every premise gets one.' },
    { term: 'Enthymeme (Implicit Premise)', kind: 'Definition', topic: 'Logic', file: 'logic/lessons/0013-argument-mapping-reconstruction.html', anchor: 'implicit-premises', desc: 'An unstated premise the argument needs to actually be valid.' },
    { term: 'Standard Form', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0013-argument-mapping-reconstruction.html', anchor: 'standard-form', desc: 'Numbered premises and conclusion, with implicit premises marked.' },
    { term: 'Linked vs. Convergent Premises', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0013-argument-mapping-reconstruction.html', anchor: 'linked-convergent-premises', desc: 'Linked premises only work together; convergent premises each independently support the conclusion.' },
    { term: 'Chained Arguments', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0013-argument-mapping-reconstruction.html', anchor: 'chained-arguments', desc: 'A sub-conclusion becomes a premise for the next stage of the argument.' },

    // ── Logic: term definitions (lesson 14) ──
    { term: 'Evaluating Real Debates', kind: 'Lesson 14', topic: 'Logic', file: 'logic/lessons/0014-evaluating-real-debates.html', desc: 'Putting it all together — applying the full toolkit live.' },
    { term: 'Five-Step Evaluation Process', kind: 'Technique', topic: 'Logic', file: 'logic/lessons/0014-evaluating-real-debates.html', anchor: 'five-step-process', desc: 'Reconstruct, check structure, check informal fallacies, assess premise truth, verdict.' },
    { term: 'Full Worked Example — Remote Work Argument', kind: 'Example', topic: 'Logic', file: 'logic/lessons/0014-evaluating-real-debates.html', anchor: 'worked-example', desc: 'A complete five-step walkthrough on a real-style argument, start to finish.' },

    // ── Logic: reference docs ──
    { term: 'Propositional Logic Cheat Sheet', kind: 'Reference doc', topic: 'Logic', file: 'logic/reference/propositional-logic-cheatsheet.html', desc: 'Compressed summary of lessons 1–4.' },
    { term: 'Rules of Inference Cheat Sheet', kind: 'Reference doc', topic: 'Logic', file: 'logic/reference/rules-of-inference-cheatsheet.html', desc: 'Compressed summary of lesson 5.' },
    { term: 'Predicate Logic Cheat Sheet', kind: 'Reference doc', topic: 'Logic', file: 'logic/reference/predicate-logic-cheatsheet.html', desc: 'Compressed summary of lessons 6–8.' },
    { term: 'Modern Theory Cheat Sheet', kind: 'Reference doc', topic: 'Logic', file: 'logic/reference/modern-theory-cheatsheet.html', desc: 'Compressed summary of lessons 9–11 — soundness/completeness, modal logic, Gödel.' },
    { term: 'Real Arguments Cheat Sheet', kind: 'Reference doc', topic: 'Logic', file: 'logic/reference/real-arguments-cheatsheet.html', desc: 'Compressed summary of lessons 12–14 — fallacy catalog, reconstruction, evaluation checklist.' },

    // ── Philosophy: lesson-level entries ──
    { term: 'Deontic Logic — Obligation & Permission', kind: 'Lesson 10', topic: 'Philosophy', file: 'philosophy/lessons/0010-deontic-logic.html', desc: 'O, P, F operators, the is-ought gap, and why "should" needs its own logic.' },
    { term: 'Epistemic Logic — Knowledge & Belief', kind: 'Lesson 11', topic: 'Philosophy', file: 'philosophy/lessons/0011-epistemic-logic.html', desc: 'K and B operators, factivity, and what separates knowing from believing.' },
    { term: 'Transcendental Arguments', kind: 'Lesson 12', topic: 'Philosophy', file: 'philosophy/lessons/0012-transcendental-arguments.html', desc: "Kant's third argument form — arguing from what's undeniable to its preconditions." },

    // ── Philosophy: term definitions ──
    { term: 'Is-Ought Gap', kind: 'Definition', topic: 'Philosophy', file: 'philosophy/lessons/0010-deontic-logic.html', anchor: 'is-ought-gap', desc: "Hume's point: no purely descriptive premises validly entail a prescriptive conclusion." },
    { term: 'Deontic Operators (O, P, F)', kind: 'Definition', topic: 'Philosophy', file: 'philosophy/lessons/0010-deontic-logic.html', anchor: 'deontic-operators', desc: 'Obligatory, permissible, forbidden — modal logic reread normatively.' },
    { term: 'Deontic Duality', kind: 'Definition', topic: 'Philosophy', file: 'philosophy/lessons/0010-deontic-logic.html', anchor: 'deontic-duality', desc: 'Pp ≡ ¬O¬p — mirrors ◇p ≡ ¬□¬p from modal logic.' },
    { term: 'Good Samaritan Paradox', kind: 'Example', topic: 'Philosophy', file: 'philosophy/lessons/0010-deontic-logic.html', anchor: 'good-samaritan-paradox', desc: 'A famous open problem in standard deontic logic.' },
    { term: 'Epistemic Operators (K, B)', kind: 'Definition', topic: 'Philosophy', file: 'philosophy/lessons/0011-epistemic-logic.html', anchor: 'epistemic-operators', desc: 'Knowledge and belief, formalized with worlds consistent with what is known/believed.' },
    { term: 'Factivity of Knowledge', kind: 'Definition', topic: 'Philosophy', file: 'philosophy/lessons/0011-epistemic-logic.html', anchor: 'factivity', desc: 'Kp → p — you cannot know something false; belief carries no such guarantee.' },
    { term: 'Introspection Axioms', kind: 'Definition', topic: 'Philosophy', file: 'philosophy/lessons/0011-epistemic-logic.html', anchor: 'introspection-axioms', desc: 'Positive (Kp → KKp) and negative (¬Kp → K¬Kp) introspection.' },
    { term: 'Transcendental Argument Form', kind: 'Definition', topic: 'Philosophy', file: 'philosophy/lessons/0012-transcendental-arguments.html', anchor: 'transcendental-argument-form', desc: 'Arguing from an undeniable Y to a necessary precondition X.' },
    { term: 'Uniqueness Objection', kind: 'Definition', topic: 'Philosophy', file: 'philosophy/lessons/0012-transcendental-arguments.html', anchor: 'uniqueness-objection', desc: 'Is X really the only precondition for Y, or could a rival X′ also explain it?' },

    // ── Philosophy: reference docs ──
    { term: 'Logic Extensions Cheat Sheet', kind: 'Reference doc', topic: 'Philosophy', file: 'philosophy/reference/logic-extensions-cheatsheet.html', desc: 'Compressed summary of lessons 10–12 — deontic, epistemic, transcendental.' },

    // ── Rationality: lesson-level entries ──
    { term: 'Cognitive Biases — Catching Your Own Mind', kind: 'Lesson 1', topic: 'Rationality', file: 'rationality/lessons/0001-cognitive-biases.html', desc: 'Confirmation bias, motivated reasoning, and the shortcuts derailing your own arguments.' },
    { term: 'Probabilistic & Bayesian Reasoning', kind: 'Lesson 2', topic: 'Rationality', file: 'rationality/lessons/0002-probabilistic-bayesian-reasoning.html', desc: 'Base rates, updating on evidence, and why confidence should come in degrees.' },
    { term: 'Charitable Interpretation & Steelmanning', kind: 'Lesson 3', topic: 'Rationality', file: 'rationality/lessons/0003-charitable-interpretation-steelmanning.html', desc: 'Responding to the strongest version of what someone means, not the weakest.' },

    // ── Rationality: term definitions ──
    { term: 'Confirmation Bias', kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0001-cognitive-biases.html', anchor: 'confirmation-bias', desc: 'Noticing evidence that fits existing beliefs, missing what doesn’t.' },
    { term: 'Motivated Reasoning', kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0001-cognitive-biases.html', anchor: 'motivated-reasoning', desc: 'Working backward from a conclusion you want to be true.' },
    { term: 'Fundamental Attribution Error', kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0001-cognitive-biases.html', anchor: 'fundamental-attribution-error', desc: 'Character for their behavior, circumstance for your own.' },
    { term: 'Availability Heuristic', kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0001-cognitive-biases.html', anchor: 'availability-heuristic', desc: 'Vivid, memorable examples feel more frequent than they really are.' },
    { term: "Bayes' Theorem", kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0002-probabilistic-bayesian-reasoning.html', anchor: 'bayes-theorem', desc: 'P(H|E) = P(E|H) × P(H) / P(E) — updating belief by evidence and prior.' },
    { term: 'Base Rate Neglect', kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0002-probabilistic-bayesian-reasoning.html', anchor: 'base-rate-neglect', desc: 'Ignoring how rare something was beforehand; the classic test-accuracy trap.' },
    { term: 'Calibration', kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0002-probabilistic-bayesian-reasoning.html', anchor: 'calibration', desc: '"80% sure" should be right about 80% of the time.' },
    { term: 'Principle of Charity', kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0003-charitable-interpretation-steelmanning.html', anchor: 'principle-of-charity', desc: 'Interpret ambiguous statements in their strongest, most defensible form.' },
    { term: 'Steelmanning', kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0003-charitable-interpretation-steelmanning.html', anchor: 'steelmanning', desc: 'The deliberate opposite of a straw man.' },
    { term: 'Facts vs. Values', kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0003-charitable-interpretation-steelmanning.html', anchor: 'facts-vs-values', desc: "Facts are resolvable with evidence; values/feelings aren't." },
    { term: 'Calibration & Expected Value', kind: 'Lesson 4', topic: 'Rationality', file: 'rationality/lessons/0004-calibration-and-expected-value.html', desc: 'Turning "80% sure" into a real number — expected value, Brier scores, and when to bother.', keywords: ['mastery', 'confidence'] },
    { term: 'Expected Value', kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0004-calibration-and-expected-value.html', anchor: 'expected-value', desc: 'EV = Σ p(outcome) × value(outcome) — the average result if a decision repeated many times.' },
    { term: 'Expected Utility', kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0004-calibration-and-expected-value.html', anchor: 'expected-utility', desc: "Why a dollar lost and a dollar gained aren't always worth the same amount." },
    { term: 'Calibration Curve', kind: 'Technique', topic: 'Rationality', file: 'rationality/lessons/0004-calibration-and-expected-value.html', anchor: 'calibration-curve', desc: 'Checking whether your "70% sure" predictions come true about 70% of the time.' },
    { term: 'Brier Score', kind: 'Definition', topic: 'Rationality', file: 'rationality/lessons/0004-calibration-and-expected-value.html', anchor: 'brier-score', desc: '(1/N) Σ (p−o)² — a scoring rule that rewards honest calibration over false confidence.' },
    { term: 'When to Formalize a Decision', kind: 'Technique', topic: 'Rationality', file: 'rationality/lessons/0004-calibration-and-expected-value.html', anchor: 'when-to-formalize', desc: 'Repeatable, high-stakes, fact-based calls vs. one-off values calls or trivial stakes.' },

    // ── Rationality: reference docs ──
    { term: 'Practical Rationality Cheat Sheet', kind: 'Reference doc', topic: 'Rationality', file: 'rationality/reference/practical-rationality-cheatsheet.html', desc: 'Compressed summary of lessons 1–3 — biases, Bayesian updating, steelmanning.' },

    // ── Probability ──
    { term: 'Probability Spaces & Random Variables', kind: 'Lesson 1', topic: 'Probability', file: 'probability/lessons/0001-probability-spaces-random-variables.html', desc: 'Sample spaces, the Kolmogorov axioms, and why a "random variable" is a deterministic function.' },
    { term: 'Sample Space (Ω)', kind: 'Definition', topic: 'Probability', file: 'probability/lessons/0001-probability-spaces-random-variables.html', anchor: 'sample-space', desc: 'The set of every possible outcome of an experiment.' },
    { term: 'Kolmogorov Axioms', kind: 'Definition', topic: 'Probability', file: 'probability/lessons/0001-probability-spaces-random-variables.html', anchor: 'probability-axioms', desc: 'Non-negativity, normalization, and countable additivity — the three axioms probability is built from.' },
    { term: 'Random Variable', kind: 'Definition', topic: 'Probability', file: 'probability/lessons/0001-probability-spaces-random-variables.html', anchor: 'random-variable', desc: 'A deterministic function from outcomes to numbers, X : Ω → ℝ.' },
    { term: 'Distribution / PMF', kind: 'Definition', topic: 'Probability', file: 'probability/lessons/0001-probability-spaces-random-variables.html', anchor: 'distribution', desc: 'The assignment of probabilities to a random variable\'s possible values.' },
    { term: 'Expectation & Variance', kind: 'Lesson 2', topic: 'Probability', file: 'probability/lessons/0002-expectation-variance.html', desc: 'Linearity of expectation, and why the same mean can hide very different risk.' },
    { term: 'Expectation E[X]', kind: 'Definition', topic: 'Probability', file: 'probability/lessons/0002-expectation-variance.html', anchor: 'expectation', desc: 'E[X] = Σ x · p(x) — the formal version of Rationality\'s expected-value formula.' },
    { term: 'Linearity of Expectation', kind: 'Theorem', topic: 'Probability', file: 'probability/lessons/0002-expectation-variance.html', anchor: 'linearity-of-expectation', desc: 'E[X+Y] = E[X] + E[Y] always, even when X and Y are dependent.' },
    { term: 'Variance & Standard Deviation', kind: 'Definition', topic: 'Probability', file: 'probability/lessons/0002-expectation-variance.html', anchor: 'variance', desc: 'Var(X) = E[(X−E[X])²] — how spread out a distribution is around its mean.' },
    { term: 'Common Distributions', kind: 'Lesson 3', topic: 'Probability', file: 'probability/lessons/0003-common-distributions.html', desc: 'Binomial, Poisson, and the normal distribution — where they come from and when to use them.' },
    { term: 'Bernoulli & Binomial', kind: 'Definition', topic: 'Probability', file: 'probability/lessons/0003-common-distributions.html', anchor: 'bernoulli-binomial', desc: 'A single biased coin flip, and the count of successes across n independent trials.' },
    { term: 'Poisson Distribution', kind: 'Definition', topic: 'Probability', file: 'probability/lessons/0003-common-distributions.html', anchor: 'poisson-distribution', desc: 'Models rare, independent events over a fixed window — the limit of Binomial as n→∞, p→0.' },
    { term: 'Normal (Gaussian) Distribution', kind: 'Definition', topic: 'Probability', file: 'probability/lessons/0003-common-distributions.html', anchor: 'normal-distribution', desc: 'A continuous distribution — and why P(X=x)=0 for any exact value.' },
    { term: 'The Central Limit Theorem', kind: 'Lesson 4', topic: 'Probability', file: 'probability/lessons/0004-central-limit-theorem.html', desc: 'Why sums and averages trend Normal no matter what distribution they started from.' },
    { term: 'CLT Statement', kind: 'Theorem', topic: 'Probability', file: 'probability/lessons/0004-central-limit-theorem.html', anchor: 'clt-statement', desc: 'The standardized sum of any iid variables with finite mean/variance converges to standard Normal.' },
    { term: 'MGF Proof of CLT', kind: 'Technique', topic: 'Probability', file: 'probability/lessons/0004-central-limit-theorem.html', anchor: 'mgf-proof-sketch', desc: 'Moment generating functions and why the standardized sum\'s MGF converges to e^(t²/2).' },

    // ── Quantum Mechanics ──
    { term: 'State Vectors, Superposition & the Born Rule', kind: 'Lesson 1', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0001-state-vectors-superposition-born-rule.html', desc: 'What superposition actually means mathematically, and how measurement probabilities work.', keywords: ['qubit', 'physics'] },
    { term: 'State Vector / Ket Notation', kind: 'Definition', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0001-state-vectors-superposition-born-rule.html', anchor: 'state-vectors', desc: 'A quantum state as a vector |ψ⟩ in a complex vector space.' },
    { term: 'Superposition', kind: 'Definition', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0001-state-vectors-superposition-born-rule.html', anchor: 'superposition', desc: 'A single, well-defined vector — not two states happening at once.' },
    { term: 'Born Rule', kind: 'Theorem', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0001-state-vectors-superposition-born-rule.html', anchor: 'born-rule', desc: 'Measurement probability is the squared magnitude of a state\'s amplitude.' },
    { term: 'Quantum Claim Misuse Check', kind: 'Technique', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0001-state-vectors-superposition-born-rule.html', anchor: 'misuse-check', desc: 'Before citing "superposition" outside physics: what\'s the state vector, basis, and Born-rule prediction?' },
    { term: 'Entanglement & the EPR Puzzle', kind: 'Lesson 2', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0002-entanglement-epr-puzzle.html', desc: 'Tensor products, non-factorizable states, and why entanglement can\'t send a message.' },
    { term: 'Two-Qubit States / Tensor Product', kind: 'Definition', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0002-entanglement-epr-puzzle.html', anchor: 'two-qubit-states', desc: 'Two qubits together live in a 4-dimensional tensor-product space.' },
    { term: 'Product State vs. Entangled State', kind: 'Definition', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0002-entanglement-epr-puzzle.html', anchor: 'product-vs-entangled', desc: 'A product state factors as |ψ_A⟩⊗|ψ_B⟩; an entangled state provably cannot.' },
    { term: 'EPR Paradox', kind: 'Definition', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0002-entanglement-epr-puzzle.html', anchor: 'epr-correlations', desc: 'Einstein, Podolsky & Rosen\'s local hidden-variable worry about entangled correlations.' },
    { term: 'No-Communication Theorem', kind: 'Theorem', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0002-entanglement-epr-puzzle.html', anchor: 'no-signaling', desc: 'Why entanglement can never be used to send information faster than light.' },
    { term: "Bell's Theorem & the CHSH Inequality", kind: 'Lesson 3', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0003-bells-theorem-chsh.html', desc: 'The algebraic proof and experiment that actually ruled out local hidden variables.' },
    { term: 'Local Hidden Variables (LHV)', kind: 'Definition', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0003-bells-theorem-chsh.html', anchor: 'local-hidden-variables', desc: 'The formal EPR-style assumption Bell\'s theorem tests: predetermined, locally-fixed outcomes.' },
    { term: 'CHSH Inequality', kind: 'Theorem', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0003-bells-theorem-chsh.html', anchor: 'chsh-inequality-proof', desc: '|S| ≤ 2 for any local hidden-variable theory — a pure algebraic fact.' },
    { term: "Tsirelson's Bound", kind: 'Theorem', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0003-bells-theorem-chsh.html', anchor: 'chsh-quantum-violation', desc: 'Quantum mechanics predicts S = 2√2, violating the classical CHSH bound of 2.' },
    { term: 'The Schrödinger Equation', kind: 'Lesson 4', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0004-schrodinger-equation.html', desc: 'How quantum states evolve over time, and the fault line between evolution and measurement.' },
    { term: 'Schrödinger Equation (Definition)', kind: 'Definition', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0004-schrodinger-equation.html', anchor: 'schrodinger-equation', desc: 'iℏ d|ψ⟩/dt = H|ψ⟩ — the equation governing how a quantum state changes over time.' },
    { term: 'Unitary Time Evolution', kind: 'Definition', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0004-schrodinger-equation.html', anchor: 'unitary-time-evolution', desc: 'U(t)=e^(−iHt/ℏ) — deterministic, reversible evolution that automatically preserves normalization.' },
    { term: 'The Measurement Problem', kind: 'Definition', topic: 'Quantum Mechanics', file: 'quantum-mechanics/lessons/0004-schrodinger-equation.html', anchor: 'measurement-vs-evolution', desc: 'Why quantum mechanics has two incompatible-looking rules for how a state changes.' },

    // ── Category Theory ──
    { term: 'Categories, Objects & Morphisms', kind: 'Lesson 1', topic: 'Category Theory', file: 'category-theory/lessons/0001-categories-objects-morphisms.html', desc: 'The core definition, three genuinely different examples, and checking the laws by hand.' },
    { term: 'Category (Definition)', kind: 'Definition', topic: 'Category Theory', file: 'category-theory/lessons/0001-categories-objects-morphisms.html', anchor: 'category-definition', desc: 'Objects, morphisms, identity, and composition, subject to identity and associativity laws.' },
    { term: 'Examples of Categories', kind: 'Technique', topic: 'Category Theory', file: 'category-theory/lessons/0001-categories-objects-morphisms.html', anchor: 'examples-of-categories', desc: 'Set, a programming type system, and a preorder — three genuinely different categories.' },
    { term: 'Composition Laws', kind: 'Definition', topic: 'Category Theory', file: 'category-theory/lessons/0001-categories-objects-morphisms.html', anchor: 'composition-laws', desc: 'Checking the identity law and associativity on a tiny worked example.' },
    { term: 'Functors & Natural Transformations', kind: 'Lesson 2', topic: 'Category Theory', file: 'category-theory/lessons/0002-functors-natural-transformations.html', desc: 'Structure-preserving maps between categories, and maps between those maps.' },
    { term: 'Functor (Definition)', kind: 'Definition', topic: 'Category Theory', file: 'category-theory/lessons/0002-functors-natural-transformations.html', anchor: 'functor-definition', desc: 'A structure-preserving map between categories — preserves identity and composition.' },
    { term: 'Option::map as a Functor', kind: 'Technique', topic: 'Category Theory', file: 'category-theory/lessons/0002-functors-natural-transformations.html', anchor: 'functor-example', desc: 'Checking the functor laws on the Option/Maybe functor you already use.' },
    { term: 'Natural Transformation', kind: 'Definition', topic: 'Category Theory', file: 'category-theory/lessons/0002-functors-natural-transformations.html', anchor: 'natural-transformation', desc: 'A map between two functors, satisfying the naturality square for every morphism.' },
    { term: 'Universal Properties & Products', kind: 'Lesson 3', topic: 'Category Theory', file: 'category-theory/lessons/0003-universal-properties-products.html', desc: 'Defining a construction by what it does, not what it\'s made of.' },
    { term: 'Product (Universal Property)', kind: 'Definition', topic: 'Category Theory', file: 'category-theory/lessons/0003-universal-properties-products.html', anchor: 'product-universal-property', desc: 'An object with projections satisfying a unique-mediating-morphism property, for any category.' },
    { term: 'Terminal Object', kind: 'Definition', topic: 'Category Theory', file: 'category-theory/lessons/0003-universal-properties-products.html', anchor: 'terminal-object', desc: 'An object with exactly one morphism in from every other object — e.g. Rust\'s unit type ().' },
    { term: 'Uniqueness Up to Isomorphism', kind: 'Theorem', topic: 'Category Theory', file: 'category-theory/lessons/0003-universal-properties-products.html', anchor: 'uniqueness-up-to-isomorphism', desc: 'Why universal properties justify saying "the" product despite never naming one object.' },
    { term: 'Monads', kind: 'Lesson 4', topic: 'Category Theory', file: 'category-theory/lessons/0004-monads.html', desc: 'A monoid in the category of endofunctors — and why Option/Result already are one.' },
    { term: 'Monad (Definition)', kind: 'Definition', topic: 'Category Theory', file: 'category-theory/lessons/0004-monads.html', anchor: 'monad-definition', desc: 'An endofunctor T with natural transformations unit (η) and join (μ), satisfying monoid-like laws.' },
    { term: 'Bind / and_then', kind: 'Technique', topic: 'Category Theory', file: 'category-theory/lessons/0004-monads.html', anchor: 'bind-operation', desc: 'bind(m,f) = μ(T(f)(m)) — chaining fallible/contextual functions, derived from unit and join.' },
    { term: 'Monoid in the Category of Endofunctors', kind: 'Definition', topic: 'Category Theory', file: 'category-theory/lessons/0004-monads.html', anchor: 'monoid-in-endofunctors', desc: 'The famous joke, made literal: functor composition as the operation, Id as the identity.' },

    // ── Algorithmic Information Theory ──
    { term: 'Kolmogorov Complexity: What Does "Simple" Mean?', kind: 'Lesson 1', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0001-kolmogorov-complexity.html', desc: 'The shortest-program definition, algorithmic randomness, and why K is uncomputable.', keywords: ['information theory'] },
    { term: 'Kolmogorov Complexity K(x)', kind: 'Definition', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0001-kolmogorov-complexity.html', anchor: 'kolmogorov-complexity', desc: 'The length of the shortest program that outputs x and halts.' },
    { term: 'Algorithmic Randomness', kind: 'Definition', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0001-kolmogorov-complexity.html', anchor: 'algorithmic-randomness', desc: 'A string is incompressible if no significantly shorter description exists.' },
    { term: 'Uncomputability of K', kind: 'Theorem', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0001-kolmogorov-complexity.html', anchor: 'uncomputability-of-k', desc: 'No program can always compute K(x) — a diagonalization argument in the family of Gödel and the halting problem.', keywords: ['godel', 'halting problem'] },
    { term: 'Shannon vs. Kolmogorov', kind: 'Definition', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0001-kolmogorov-complexity.html', anchor: 'shannon-vs-kolmogorov', desc: 'Entropy measures a source distribution on average; K(x) measures one specific string.' },
    { term: "Chaitin's Ω: The Halting Probability", kind: 'Lesson 2', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0002-chaitins-omega.html', desc: 'A number that encodes the halting problem\'s answer, one uncomputable bit at a time.', keywords: ['halting problem'] },
    { term: 'Prefix-Free Codes / Kraft\'s Inequality', kind: 'Definition', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0002-chaitins-omega.html', anchor: 'prefix-free-codes', desc: 'Why self-delimiting programs make Ω\'s defining sum well-defined.' },
    { term: 'Chaitin\'s Ω (Definition)', kind: 'Definition', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0002-chaitins-omega.html', anchor: 'chaitins-omega', desc: 'Ω = Σ 2^(−|p|) over every self-delimiting program that halts — the halting probability.' },
    { term: 'Ω Encodes the Halting Problem', kind: 'Theorem', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0002-chaitins-omega.html', anchor: 'omega-encodes-halting', desc: 'Knowing N bits of Ω resolves the halting status of every program of length ≤ N.' },
    { term: 'Ω is Uncomputable & Random', kind: 'Theorem', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0002-chaitins-omega.html', anchor: 'omega-uncomputable-and-random', desc: 'Ω\'s digits have no shorter description than themselves, despite Ω\'s own short definition.' },
    { term: 'Algorithmic Statistics & Sophistication', kind: 'Lesson 3', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0003-algorithmic-statistics.html', desc: 'Separating an object\'s "structure" from its "noise" within Kolmogorov complexity.' },
    { term: 'Two-Part Codes', kind: 'Definition', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0003-algorithmic-statistics.html', anchor: 'two-part-codes', desc: 'Describing x via a model S plus x\'s index within S — K(S) + log|S|.' },
    { term: 'Sufficient Statistic (Algorithmic)', kind: 'Definition', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0003-algorithmic-statistics.html', anchor: 'sufficient-statistic', desc: 'A model S where K(S)+log|S| ≈ K(x) — capturing all of x\'s extractable structure.' },
    { term: 'Kolmogorov Structure Function', kind: 'Definition', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0003-algorithmic-statistics.html', anchor: 'kolmogorov-structure-function', desc: 'The trade-off curve between model complexity and how tightly it pins down x.' },
    { term: 'Sophistication', kind: 'Definition', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0003-algorithmic-statistics.html', anchor: 'sophistication', desc: 'Why both maximal-K random strings and minimal-K patterned strings have LOW sophistication.' },
    { term: 'Solomonoff Induction', kind: 'Lesson 4', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0004-solomonoff-induction.html', desc: 'The universal prior — a rigorous foundation for "the simplest explanation is most likely."', keywords: ['occam', 'bayes', 'prior'] },
    { term: 'Algorithmic Probability m(x)', kind: 'Definition', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0004-solomonoff-induction.html', anchor: 'algorithmic-probability', desc: 'The probability a randomly-generated program outputs x — Chaitin\'s Ω, restricted to one string.' },
    { term: 'Coding Theorem', kind: 'Theorem', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0004-solomonoff-induction.html', anchor: 'algorithmic-probability', desc: '−log₂ m(x) = K(x) + O(1) — algorithmic probability and Kolmogorov complexity, unified.' },
    { term: 'Solomonoff Induction (Definition)', kind: 'Definition', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/lessons/0004-solomonoff-induction.html', anchor: 'solomonoff-induction-definition', desc: 'Using m as a universal Bayesian prior — Occam\'s razor, formalized.' },

    // ── Topic indexes ──
    { term: 'Logic (topic home)', kind: 'Topic', topic: 'Logic', file: 'logic/index.html', desc: 'All Logic lessons and reference docs.' },
    { term: 'Philosophy (topic home)', kind: 'Topic', topic: 'Philosophy', file: 'philosophy/index.html', desc: 'All Philosophy lessons and reference docs.' },
    { term: 'Rationality (topic home)', kind: 'Topic', topic: 'Rationality', file: 'rationality/index.html', desc: 'All Rationality lessons and reference docs.' },
    { term: 'Music Theory & Keyboard (topic home)', kind: 'Topic', topic: 'Music Theory', file: 'music-theory/index.html', desc: 'All Music Theory lessons.' },
    { term: 'CS Interview Prep (topic home)', kind: 'Topic', topic: 'CS Interviews', file: 'cs-interviews/index.html', desc: 'All CS Interview Prep lessons.' },
    { term: 'Probability (topic home)', kind: 'Topic', topic: 'Probability', file: 'probability/index.html', desc: 'All Probability lessons.' },
    { term: 'Quantum Mechanics (topic home)', kind: 'Topic', topic: 'Quantum Mechanics', file: 'quantum-mechanics/index.html', desc: 'All Quantum Mechanics lessons.' },
    { term: 'Category Theory (topic home)', kind: 'Topic', topic: 'Category Theory', file: 'category-theory/index.html', desc: 'All Category Theory lessons.' },
    { term: 'Algorithmic Info Theory (topic home)', kind: 'Topic', topic: 'Algorithmic Info Theory', file: 'algorithmic-info-theory/index.html', desc: 'All Algorithmic Information Theory lessons.' },
    { term: 'Learning Hub (home)', kind: 'Home', topic: '', file: 'index.html', desc: 'All topics.' },
  ];

  // ── Fuzzy matching ──
  // Damerau-Levenshtein: insertions, deletions, substitutions, and adjacent
  // transpositions all count as 1 edit — covers the common typo shapes
  // (dropped letter, wrong letter, two letters swapped).
  function editDistance(a, b) {
    const al = a.length, bl = b.length;
    const d = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
    for (let i = 0; i <= al; i++) d[i][0] = i;
    for (let j = 0; j <= bl; j++) d[0][j] = j;
    for (let i = 1; i <= al; i++) {
      for (let j = 1; j <= bl; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(
          d[i - 1][j] + 1,       // deletion
          d[i][j - 1] + 1,       // insertion
          d[i - 1][j - 1] + cost // substitution
        );
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost); // transposition
        }
      }
    }
    return d[al][bl];
  }

  function fuzzyScore(query, target) {
    if (!query) return 0;
    query = query.toLowerCase();
    target = target.toLowerCase();

    // 1. Direct substring — best case, earlier position wins ties.
    const idx = target.indexOf(query);
    if (idx !== -1) return 1000 - idx;

    // 2. Subsequence match — query's letters appear in order, possibly
    //    with gaps. Naturally tolerant of a single dropped letter.
    let qi = 0, score = 0, consecutive = 0;
    for (let ti = 0; ti < target.length && qi < query.length; ti++) {
      if (target[ti] === query[qi]) {
        qi++;
        consecutive++;
        score += consecutive;
      } else {
        consecutive = 0;
      }
    }
    if (qi === query.length) return score;

    // 3. Typo tolerance — check edit distance against each word in the
    //    target individually, so "consquent" or "cosnequent" still finds
    //    "consequent" even though neither is a clean subsequence of it.
    const words = target.split(/[^a-z0-9]+/).filter(Boolean);
    const threshold = query.length <= 4 ? 1 : query.length <= 7 ? 2 : 3;
    let bestTypoScore = -1;
    for (const w of words) {
      if (Math.abs(w.length - query.length) > threshold + 1) continue; // cheap prefilter
      const dist = editDistance(query, w);
      if (dist <= threshold) {
        const s = 400 - dist * 80;
        if (s > bestTypoScore) bestTypoScore = s;
      }
    }
    return bestTypoScore;
  }

  function search(query) {
    if (!query.trim()) return [];
    const results = INDEX.map(entry => {
      const haystacks = [entry.term, entry.desc || '', ...(entry.keywords || [])];
      const best = Math.max(...haystacks.map(h => fuzzyScore(query, h)));
      return { entry, score: best };
    }).filter(r => r.score > -1);
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 8).map(r => r.entry);
  }

  // ── Styles (reads the shared design-system tokens from assets/theme.css,
  //    which every page that loads this script also loads) ──
  const style = document.createElement('style');
  style.textContent = `
    #cp-overlay {
      position: fixed; inset: 0; background: rgba(6,8,9,.72);
      z-index: 999; display: none; align-items: flex-start; justify-content: center;
      padding: 12vh 1rem 0;
    }
    #cp-overlay.open { display: flex; }
    #cp-panel {
      width: min(560px, 100%); background: var(--bg-raised, #1b2024); border: 1px solid var(--border, #333);
      border-radius: var(--radius-lg, 14px); box-shadow: 0 24px 70px rgba(0,0,0,.55);
      overflow: hidden; font-family: var(--font-ui, sans-serif);
    }
    #cp-input {
      width: 100%; background: var(--bg-sunken, #111); color: var(--ink, #eee); border: none;
      border-bottom: 1px solid var(--border, #333); padding: .95rem 1.1rem; font-size: 1rem;
      outline: none; box-sizing: border-box; font-family: var(--font-ui, sans-serif);
    }
    #cp-input::placeholder { color: var(--faint, #666); }
    #cp-results { max-height: 55vh; overflow-y: auto; -webkit-overflow-scrolling: touch; }
    #cp-empty { padding: 1.5rem 1.1rem; color: var(--muted, #888); font-size: .85rem; }
    .cp-item {
      display: flex; flex-direction: column; gap: .15rem;
      padding: .75rem 1.1rem; cursor: pointer; border-left: 3px solid transparent;
    }
    .cp-item.active { background: var(--bg-sunken, #141414); border-left-color: var(--accent, #4fae7d); }
    .cp-item-top { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
    .cp-item-term { color: var(--ink, #eee); font-size: .92rem; font-weight: 600; }
    .cp-item-kind {
      font-size: .66rem; text-transform: uppercase; letter-spacing: .05em;
      color: var(--accent-strong, #75d1a1); background: var(--accent-soft, #14271f);
      border: 1px solid var(--accent-border, #234); border-radius: 4px; padding: .1rem .4rem;
    }
    .cp-item-desc { color: var(--muted, #888); font-size: .8rem; }
    .cp-item-path { color: var(--faint, #555); font-size: .72rem; font-family: var(--font-mono, monospace); word-break: break-all; }
    @media (max-width: 560px) {
      #cp-overlay { padding-top: 4vh; }
      #cp-panel { border-radius: var(--radius, 10px); }
    }
  `;
  document.head.appendChild(style);

  // ── DOM: trigger + overlay ──
  // Mounted inside the page's .topnav when present (every page has one)
  // so it reads as part of the nav bar, not a floating extra. Falls back
  // to a small fixed button if a page somehow has no topnav.
  const searchIconSvg = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="6" r="4.5"/><line x1="9.6" y1="9.6" x2="13" y2="13"/></svg>';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'tn-search';
  trigger.setAttribute('aria-label', 'Search the Learning Hub');
  trigger.innerHTML = searchIconSvg + '<span class="tn-search-label">Search</span><kbd>⌘K</kbd>';

  const topnav = document.querySelector('.topnav');
  if (topnav) {
    topnav.appendChild(trigger);
  } else {
    trigger.classList.add('tn-search-floating');
    document.body.appendChild(trigger);
  }

  const overlay = document.createElement('div');
  overlay.id = 'cp-overlay';
  overlay.innerHTML = `
    <div id="cp-panel">
      <input id="cp-input" type="text" placeholder="Search terms, lessons, definitions..." autocomplete="off" spellcheck="false">
      <div id="cp-results"><div id="cp-empty">Type to search across the Learning Hub — e.g. "counterexample", "modus tollens", "CNF"</div></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('#cp-input');
  const resultsEl = overlay.querySelector('#cp-results');
  let activeIndex = 0;
  let currentResults = [];

  function render(results) {
    currentResults = results;
    activeIndex = 0;
    if (!results.length) {
      resultsEl.innerHTML = '<div id="cp-empty">No matches.</div>';
      return;
    }
    resultsEl.innerHTML = results.map((r, i) => `
      <div class="cp-item ${i === 0 ? 'active' : ''}" data-idx="${i}">
        <div class="cp-item-top">
          <span class="cp-item-term">${r.term}</span>
          <span class="cp-item-kind">${r.kind}</span>
        </div>
        <div class="cp-item-desc">${r.desc || ''}</div>
        <div class="cp-item-path">${r.topic ? r.topic + ' · ' : ''}${r.file}${r.anchor ? '#' + r.anchor : ''}</div>
      </div>
    `).join('');
    resultsEl.querySelectorAll('.cp-item').forEach(el => {
      el.addEventListener('click', () => navigate(currentResults[+el.dataset.idx]));
      el.addEventListener('mouseenter', () => setActive(+el.dataset.idx));
    });
  }

  function setActive(i) {
    activeIndex = i;
    resultsEl.querySelectorAll('.cp-item').forEach((el, idx) => {
      el.classList.toggle('active', idx === i);
    });
  }

  function navigate(entry) {
    if (!entry) return;
    closePalette();
    const relativeTarget = ROOT_PREFIX + entry.file;
    // Resolve against current location so this works under file:// too —
    // the URL API handles relative resolution identically for both schemes.
    const targetUrl = new URL(relativeTarget, window.location.href);
    const isSamePage = targetUrl.pathname === window.location.pathname;
    window.location.href = targetUrl.pathname + (entry.anchor ? '#' + entry.anchor : '');
    if (isSamePage && entry.anchor) {
      // Same-page anchor jumps don't reload, so the hash change alone won't
      // re-trigger scrolling if we're already on that hash. Force it.
      const el = document.getElementById(entry.anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function openPalette() {
    overlay.classList.add('open');
    input.value = '';
    input.focus();
    render([]);
  }
  function closePalette() {
    overlay.classList.remove('open');
  }

  trigger.addEventListener('click', openPalette);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closePalette(); });

  input.addEventListener('input', () => render(search(input.value)));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closePalette(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(activeIndex + 1, currentResults.length - 1)); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(activeIndex - 1, 0)); return; }
    if (e.key === 'Enter') { e.preventDefault(); navigate(currentResults[activeIndex]); }
  });

  document.addEventListener('keydown', (e) => {
    const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
    if (isCmdK) { e.preventDefault(); overlay.classList.contains('open') ? closePalette() : openPalette(); }
  });
})();
