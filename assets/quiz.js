// Shared quiz engine — retry-until-correct with a per-option explanation.
//
// Pattern 1: static quiz blocks
//   <div class="q-block" id="q1">
//     <p>Question text</p>
//     <div class="options">
//       <button onclick="quizAnswer(this,false,'q1','why this option is wrong')">Option A</button>
//       <button onclick="quizAnswer(this,true,'q1','why this is right')">Option B</button>
//     </div>
//     <div class="feedback" id="q1-fb"></div>
//   </div>
//   ...
//   <div class="quiz-score" id="score"></div>
//
// Pattern 2: JS-array-driven mc-exercise cards, rendered with an id per card:
//   <div class="mc-card" id="mc-0">...<button onclick="mcAnswer(this,true,'mc-0','why')">...</div>
//
// In both patterns: a wrong click disables only that button and explains why it's
// wrong, leaving the remaining options open to try again. A correct click locks
// every button in the question and explains why it's right.

let quizScores = {};

function quizAnswer(btn, correct, qid, explain) {
  const block = document.getElementById(qid);
  const fb = document.getElementById(qid + '-fb');
  if (correct) {
    block.querySelectorAll('button').forEach(b => b.disabled = true);
    btn.classList.add('correct');
    fb.textContent = '✓ ' + (explain || 'Correct.');
    fb.className = 'feedback good';
    quizScores[qid] = 1;
  } else {
    btn.classList.add('wrong');
    btn.disabled = true;
    fb.textContent = '✗ ' + (explain || 'Not quite — try another option.');
    fb.className = 'feedback bad';
    quizScores[qid] = quizScores[qid] || 0;
  }
  updateQuizScore();
}

function updateQuizScore() {
  const scoreEl = document.getElementById('score');
  if (!scoreEl) return;
  const total = document.querySelectorAll('.q-block').length;
  const right = Object.values(quizScores).filter(Boolean).length;
  scoreEl.textContent = `${right} / ${total} correct`;
}

function mcAnswer(btn, correct, cardId, explain) {
  const card = document.getElementById(cardId);
  const fb = card.querySelector('.mc-fb');
  if (correct) {
    card.querySelectorAll('button').forEach(b => b.disabled = true);
    btn.classList.add('correct');
    fb.textContent = '✓ ' + (explain || 'Correct.');
    fb.className = 'mc-fb good';
  } else {
    btn.classList.add('wrong');
    btn.disabled = true;
    fb.textContent = '✗ ' + (explain || 'Not quite — try another option.');
    fb.className = 'mc-fb bad';
  }
}

// Renderer for the mc-exercise card pattern above. Builds the cards from a
// plain array so lessons don't each hand-roll the same DOM-building loop:
//
//   <div id="my-exercise" class="mc-exercise"></div>
//   renderMC('my-exercise', [
//     { prompt: 'A sentence to classify.', options: [
//         { text: 'Option A', correct: true, explain: 'why this is right' },
//         { text: 'Option B', explain: 'why this one is wrong' },
//     ]},
//   ]);
//
// Listeners are attached directly rather than via inline onclick, so prompts
// and option labels can contain apostrophes without escaping.
function renderMC(containerId, items) {
  const host = document.getElementById(containerId);
  if (!host) return;
  items.forEach((item, i) => {
    const cardId = containerId + '-card-' + i;
    const card = document.createElement('div');
    card.className = 'mc-card';
    card.id = cardId;

    const prompt = document.createElement('div');
    prompt.className = 'mc-formula';
    const en = document.createElement('span');
    en.className = 'en';
    en.textContent = item.prompt;
    prompt.appendChild(en);
    card.appendChild(prompt);

    const opts = document.createElement('div');
    opts.className = 'mc-options';
    item.options.forEach(o => {
      const btn = document.createElement('button');
      btn.textContent = o.text;
      btn.addEventListener('click', () => mcAnswer(btn, !!o.correct, cardId, o.explain));
      opts.appendChild(btn);
    });
    card.appendChild(opts);

    const fb = document.createElement('div');
    fb.className = 'mc-fb';
    card.appendChild(fb);

    host.appendChild(card);
  });
}
