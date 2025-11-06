const card = document.querySelector('.card');
const catScene = document.querySelector('.cat-scene');
const song = document.getElementById('birthday-song');
let confettiInterval;

card.addEventListener('click', () => {
  card.classList.add('hidden');
  catScene.classList.remove('hidden');

  // show cat with animation
  setTimeout(() => {
    catScene.classList.add('show');
  }, 400);

  song.play();
  startConfetti();
});

function createConfettiPiece() {
  const confettiContainer = document.getElementById('confetti');
  const confetti = document.createElement('div');
  confetti.classList.add('confetti-piece');

  // pastel hues
  const pastelHues = [330, 200, 120, 50, 260]; // pink, blue, mint, yellow, lavender
  const hue = pastelHues[Math.floor(Math.random() * pastelHues.length)];

  confetti.style.setProperty('--hue', hue);
  confetti.style.left = Math.random() * 100 + 'vw';
  confetti.style.setProperty('--duration', (3 + Math.random() * 3) + 's');
  confetti.style.animationDelay = Math.random() * 1 + 's';

  confettiContainer.appendChild(confetti);
  setTimeout(() => confetti.remove(), 6000);
}

function startConfetti() {
  if (!confettiInterval) {
    confettiInterval = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        createConfettiPiece();
      }
    }, 250);
  }
}
