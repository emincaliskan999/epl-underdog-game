const matches = [
  {
    teamA: 'The MongolZ',
    teamB: 'Natus Vincere',
    logoA: 'logos/themongolz.png',
    logoB: 'logos/navi.png',
    oddsA: 2.207,
    oddsB: 1.69,
    correct: 'A'
  },
  {
    teamA: 'Legacy',
    teamB: 'Aurora Gaming',
    logoA: 'logos/legacy.png',
    logoB: 'logos/aurora.png',
    oddsA: 2.02,
    oddsB: 1.81,
    correct: 'A'
  },
  {
    teamA: 'FUT Esports',
    teamB: 'MOUZ',
    logoA: 'logos/fut.png',
    logoB: 'logos/mouz.png',
    oddsA: 3.09,
    oddsB: 1.39,
    correct: 'A'
  },
  {
    teamA: 'Team Spirit',
    teamB: 'Astralis',
    logoA: 'logos/spirit.png',
    logoB: 'logos/astralis.png',
    oddsA: 1.21,
    oddsB: 4.605,
    correct: 'B'
  }
];

let currentIndex = 0;
let score = 0;
let hasAnswered = false;
let countAnimationFrameA = null;
let countAnimationFrameB = null;

const teamAButton = document.getElementById('teamAButton');
const teamBButton = document.getElementById('teamBButton');
const teamALogo = document.getElementById('teamALogo');
const teamBLogo = document.getElementById('teamBLogo');
const teamAOdds = document.getElementById('teamAOdds');
const teamBOdds = document.getElementById('teamBOdds');
const roundNumber = document.getElementById('roundNumber');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const feedbackBox = document.getElementById('feedbackBox');
const nextButton = document.getElementById('nextButton');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');
const finalScore = document.getElementById('finalScore');
const finalMessage = document.getElementById('finalMessage');
const restartFromEnd = document.getElementById('restartFromEnd');

const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');

correctSound.preload = 'auto';
wrongSound.preload = 'auto';

function formatOdds(value) {
  return value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

function safePlay(audio) {
  try {
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  } catch (error) {}
}

function showFlash(type) {
  const overlay = document.createElement('div');
  overlay.className = `flash-overlay ${type}`;
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.remove();
  }, 500);
}

function animateOdds(element, targetValue, duration = 900) {
  const startTime = performance.now();

  function step(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = targetValue * eased;
    element.textContent = formatOdds(currentValue);

    if (progress < 1) {
      return requestAnimationFrame(step);
    }
    element.textContent = formatOdds(targetValue);
    return null;
  }

  return requestAnimationFrame(step);
}

function resetVisualState() {
  hasAnswered = false;

  [teamAButton, teamBButton].forEach((button) => {
    button.disabled = false;
    button.classList.remove('correct', 'wrong', 'flipped');
  });

  feedbackBox.className = 'feedback-box hidden';
  feedbackBox.textContent = '';
  nextButton.classList.add('hidden');

  if (countAnimationFrameA) cancelAnimationFrame(countAnimationFrameA);
  if (countAnimationFrameB) cancelAnimationFrame(countAnimationFrameB);

  teamAOdds.textContent = '0.00';
  teamBOdds.textContent = '0.00';
}

function loadMatch() {
  const match = matches[currentIndex];

  resetVisualState();

  roundNumber.textContent = currentIndex + 1;
  progressText.textContent = `Match ${currentIndex + 1} / ${matches.length}`;
  progressFill.style.width = `${((currentIndex + 1) / matches.length) * 100}%`;

  teamALogo.src = match.logoA;
  teamBLogo.src = match.logoB;
  teamALogo.alt = `${match.teamA} logo`;
  teamBLogo.alt = `${match.teamB} logo`;
}

function revealAnimatedOdds(match) {
  countAnimationFrameA = animateOdds(teamAOdds, match.oddsA, 950);
  countAnimationFrameB = animateOdds(teamBOdds, match.oddsB, 950);
}

function handleSelection(side) {
  if (hasAnswered) return;

  hasAnswered = true;

  const match = matches[currentIndex];
  const isCorrect = side === match.correct;

  teamAButton.disabled = true;
  teamBButton.disabled = true;

  const chosenButton = side === 'A' ? teamAButton : teamBButton;
  const correctButton = match.correct === 'A' ? teamAButton : teamBButton;

  if (isCorrect) {
    score += 1;
    chosenButton.classList.add('correct');
    feedbackBox.textContent = 'Correct. You spotted the underdog.';
    feedbackBox.className = 'feedback-box good';
    showFlash('good');
    safePlay(correctSound);
  } else {
    chosenButton.classList.add('wrong');
    correctButton.classList.add('correct');
    const correctTeam = match.correct === 'A' ? match.teamA : match.teamB;
    feedbackBox.textContent = `${correctTeam} was the underdog with the higher odds.`;
    feedbackBox.className = 'feedback-box bad';
    showFlash('bad');
    safePlay(wrongSound);
  }

  teamAButton.classList.add('flipped');
  teamBButton.classList.add('flipped');

  setTimeout(() => {
    revealAnimatedOdds(match);
  }, 240);

  if (currentIndex === matches.length - 1) {
    setTimeout(showFinalScreen, 3400);
  } else {
    nextButton.classList.remove('hidden');
  }
}

function nextMatch() {
  currentIndex += 1;
  loadMatch();
}

function showFinalScreen() {
  gameScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');

  finalScore.textContent = `${score}/${matches.length}`;

  if (score === matches.length) {
    finalMessage.textContent = 'Perfect run. You read every playoff matchup like a true odds expert.';
  } else if (score >= 3) {
    finalMessage.textContent = 'Strong finish. You clearly know how to spot the underdog.';
  } else if (score >= 2) {
    finalMessage.textContent = 'Solid try. One more run and you can improve the score.';
  } else {
    finalMessage.textContent = 'Tough bracket. Run it back and beat the odds.';
  }
}

function restartGame() {
  currentIndex = 0;
  score = 0;
  endScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  loadMatch();
}

teamAButton.addEventListener('click', () => handleSelection('A'));
teamBButton.addEventListener('click', () => handleSelection('B'));
nextButton.addEventListener('click', nextMatch);
restartFromEnd.addEventListener('click', restartGame);

loadMatch();
