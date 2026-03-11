const matches = [
  {
    teamA: 'The MongolZ',
    teamB: 'Natus Vincere',
    logoA: 'https://liquipedia.net/commons/images/2/2b/The_MongolZ_2024_03_allmode.png',
    logoB: 'https://liquipedia.net/commons/images/3/3f/Natus_Vincere_2021_lightmode.png',
    oddsA: 2.207,
    oddsB: 1.69,
    correct: 'A'
  },
  {
    teamA: 'Legacy',
    teamB: 'Aurora Gaming',
    logoA: 'https://liquipedia.net/commons/images/9/98/Legacy_full_lightmode.png',
    logoB: 'https://liquipedia.net/commons/images/3/32/Aurora_Gaming_2025_full_allmode.png',
    oddsA: 2.02,
    oddsB: 1.81,
    correct: 'A'
  },
  {
    teamA: 'FUT Esports',
    teamB: 'MOUZ',
    logoA: 'https://liquipedia.net/commons/images/9/90/Futbolist_2021_lightmode.png',
    logoB: 'https://liquipedia.net/commons/images/a/a5/MOUZ_2021_full_allmode.png',
    oddsA: 3.09,
    oddsB: 1.39,
    correct: 'A'
  },
  {
    teamA: 'Team Spirit',
    teamB: 'Astralis',
    logoA: 'https://liquipedia.net/commons/images/f/f2/Team_Spirit_2022_full_lightmode.png',
    logoB: 'https://liquipedia.net/commons/images/b/b5/Astralis_2020_full_allmode.png',
    oddsA: 1.21,
    oddsB: 4.605,
    correct: 'B'
  }
];

let currentIndex = 0;
let score = 0;
let hasAnswered = false;

const teamAButton = document.getElementById('teamAButton');
const teamBButton = document.getElementById('teamBButton');
const teamAName = document.getElementById('teamAName');
const teamBName = document.getElementById('teamBName');
const teamALogo = document.getElementById('teamALogo');
const teamBLogo = document.getElementById('teamBLogo');
const roundNumber = document.getElementById('roundNumber');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const feedbackBox = document.getElementById('feedbackBox');
const oddsPanel = document.getElementById('oddsPanel');
const oddsAName = document.getElementById('oddsAName');
const oddsBName = document.getElementById('oddsBName');
const oddsAValue = document.getElementById('oddsAValue');
const oddsBValue = document.getElementById('oddsBValue');
const nextButton = document.getElementById('nextButton');
const restartButton = document.getElementById('restartButton');
const revealButton = document.getElementById('revealButton');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');
const finalScore = document.getElementById('finalScore');
const finalMessage = document.getElementById('finalMessage');
const restartFromEnd = document.getElementById('restartFromEnd');

function loadMatch() {
  const match = matches[currentIndex];

  hasAnswered = false;
  resetVisualState();

  roundNumber.textContent = currentIndex + 1;
  progressText.textContent = `Match ${currentIndex + 1} / ${matches.length}`;
  progressFill.style.width = `${((currentIndex + 1) / matches.length) * 100}%`;

  teamAName.textContent = match.teamA;
  teamBName.textContent = match.teamB;
  teamALogo.src = match.logoA;
  teamBLogo.src = match.logoB;
  teamALogo.alt = `${match.teamA} logo`;
  teamBLogo.alt = `${match.teamB} logo`;

  oddsAName.textContent = match.teamA;
  oddsBName.textContent = match.teamB;
  oddsAValue.textContent = match.oddsA.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
  oddsBValue.textContent = match.oddsB.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

function resetVisualState() {
  [teamAButton, teamBButton].forEach((button) => {
    button.disabled = false;
    button.classList.remove('correct', 'wrong');
  });

  feedbackBox.className = 'feedback-box hidden';
  feedbackBox.textContent = '';
  oddsPanel.classList.add('hidden');
  nextButton.classList.add('hidden');
  restartButton.classList.add('hidden');
  revealButton.classList.add('hidden');
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

  chosenButton.classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) correctButton.classList.add('correct');

  if (isCorrect) {
    score += 1;
    feedbackBox.textContent = 'Correct. That team is the underdog based on the higher 1XBET odds.';
    feedbackBox.className = 'feedback-box good';
  } else {
    const correctTeam = match.correct === 'A' ? match.teamA : match.teamB;
    feedbackBox.textContent = `Not this time. ${correctTeam} is the underdog based on the higher 1XBET odds.`;
    feedbackBox.className = 'feedback-box bad';
  }

  revealButton.classList.remove('hidden');
}

function revealOdds() {
  if (!hasAnswered) return;

  oddsPanel.classList.remove('hidden');
  revealButton.classList.add('hidden');

  if (currentIndex === matches.length - 1) {
    restartButton.classList.remove('hidden');
    setTimeout(showFinalScreen, 700);
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
    finalMessage.textContent = 'Perfect run. You read every matchup like a true odds expert.';
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
revealButton.addEventListener('click', revealOdds);
nextButton.addEventListener('click', nextMatch);
restartButton.addEventListener('click', restartGame);
restartFromEnd.addEventListener('click', restartGame);

loadMatch();
