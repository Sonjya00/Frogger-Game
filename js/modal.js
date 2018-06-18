//SELECT NEW CHARACTER MODAL
const CHARACTER_MODAL = document.getElementById('characterModal');
const ESCAPE_MODAL_BTN1 = document.getElementsByClassName('modal__close-btn')[0];
const NEW_GAME_BTN = document.getElementById('newGameBtn');

//Close the modal and restart the game when the player clicks on Restart.
NEW_GAME_BTN.onclick = function() {
  CHARACTER_MODAL.style.display = 'none';
  gamePause = false;
};

//Close the modal when the player clicks on the cross button.
ESCAPE_MODAL_BTN1.onclick = function() {
  CHARACTER_MODAL.style.display = 'none';
};

//GAMEOVER MODAL
const GAMEOVER_MODAL = document.getElementById('gameOverModal');
const ESCAPE_MODAL_BTN2 = document.getElementsByClassName('modal__close-btn')[1];
const RESTART_GAME_BTN = document.getElementById('restartGameBtn');

RESTART_GAME_BTN.onclick = function() {
  GAMEOVER_MODAL.style.display = 'none';
  CHARACTER_MODAL.style.display = 'block';
  menuStats.livesNumber = 5;
  menuStats.gemsNumber = 0;
  menuStats.victoriesNumber = 0;
  menuStats.score = 0;

  livesNumber.textContent = menuStats.livesNumber;
  gemsNumber.textContent = menuStats.gemsNumber;
  victoriesNumber.textContent = menuStats.victoriesNumber;
  score.textContent = menuStats.score;
};

//Close the modal when the player clicks on the cross button.
ESCAPE_MODAL_BTN2.onclick = function() {
  GAMEOVER_MODAL.style.display = 'none';
};
