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

    // ── Logic: reference docs ──
    { term: 'Propositional Logic Cheat Sheet', kind: 'Reference doc', topic: 'Logic', file: 'logic/reference/propositional-logic-cheatsheet.html', desc: 'Compressed summary of lessons 1–4.' },
    { term: 'Rules of Inference Cheat Sheet', kind: 'Reference doc', topic: 'Logic', file: 'logic/reference/rules-of-inference-cheatsheet.html', desc: 'Compressed summary of lesson 5.' },

    // ── Topic indexes ──
    { term: 'Logic (topic home)', kind: 'Topic', topic: 'Logic', file: 'logic/index.html', desc: 'All Logic lessons and reference docs.' },
    { term: 'Music Theory & Keyboard (topic home)', kind: 'Topic', topic: 'Music Theory', file: 'music-theory/index.html', desc: 'All Music Theory lessons.' },
    { term: 'CS Interview Prep (topic home)', kind: 'Topic', topic: 'CS Interviews', file: 'cs-interviews/index.html', desc: 'All CS Interview Prep lessons.' },
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

  // ── Styles (self-contained, hardcoded dark palette) ──
  const style = document.createElement('style');
  style.textContent = `
    #cp-trigger {
      position: fixed; top: 8px; right: 1.5rem; z-index: 998;
      background: #1c1c1c; color: #999; border: 1px solid #333;
      border-radius: 8px; padding: .3rem .65rem; font-size: .78rem;
      font-family: 'Helvetica Neue', Arial, sans-serif; cursor: pointer;
      display: flex; align-items: center; gap: .4rem;
    }
    #cp-trigger:hover { border-color: #4ade80; color: #e8e6e1; }
    #cp-trigger kbd {
      background: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 4px;
      padding: .05rem .35rem; font-size: .72rem; color: #aaa;
    }
    #cp-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.6);
      z-index: 999; display: none; align-items: flex-start; justify-content: center;
      padding-top: 12vh;
    }
    #cp-overlay.open { display: flex; }
    #cp-panel {
      width: min(560px, 92vw); background: #1a1a1a; border: 1px solid #333;
      border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.5);
      overflow: hidden; font-family: 'Helvetica Neue', Arial, sans-serif;
    }
    #cp-input {
      width: 100%; background: #141414; color: #e8e6e1; border: none;
      border-bottom: 1px solid #333; padding: .9rem 1.1rem; font-size: 1rem;
      outline: none; box-sizing: border-box;
    }
    #cp-input::placeholder { color: #666; }
    #cp-results { max-height: 50vh; overflow-y: auto; }
    #cp-empty { padding: 1.5rem 1.1rem; color: #666; font-size: .85rem; }
    .cp-item {
      display: flex; flex-direction: column; gap: .15rem;
      padding: .7rem 1.1rem; cursor: pointer; border-left: 3px solid transparent;
    }
    .cp-item.active { background: #202020; border-left-color: #4ade80; }
    .cp-item-top { display: flex; align-items: center; gap: .5rem; }
    .cp-item-term { color: #e8e6e1; font-size: .92rem; font-weight: 600; }
    .cp-item-kind {
      font-size: .68rem; text-transform: uppercase; letter-spacing: .05em;
      color: #4ade80; background: #16261c; border: 1px solid #234; border-radius: 4px;
      padding: .1rem .4rem;
    }
    .cp-item-desc { color: #888; font-size: .8rem; }
    .cp-item-path { color: #555; font-size: .72rem; font-family: monospace; }
  `;
  document.head.appendChild(style);

  // ── DOM: trigger button + overlay ──
  const trigger = document.createElement('button');
  trigger.id = 'cp-trigger';
  trigger.innerHTML = '🔍 Search <kbd>⌘K</kbd>';
  document.body.appendChild(trigger);

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
