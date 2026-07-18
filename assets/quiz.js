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
