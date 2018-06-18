/*
 * MODAL TO SELECT NEW CHARACTER
 */
const CHARACTER_MODAL = document.getElementById('characterModal');
const ESCAPE_MODAL_BTN1 = document.getElementsByClassName('modal__close-btn')[0];
const NEW_GAME_BTN = document.getElementById('newGameBtn');

//Close the modal and restart the game if the user clicks on "Start a new game"
NEW_GAME_BTN.onclick = function() {
  CHARACTER_MODAL.style.display = 'none';
  gamePause = false;
  newGameStarted = true;
  startTimer();
};

//Close the modal when the player clicks on the cross button.
ESCAPE_MODAL_BTN1.onclick = function() {
  CHARACTER_MODAL.style.display = 'none';
};

/*
 * GAMEOVER MODAL
 */
const GAMEOVER_MODAL = document.getElementById('gameOverModal');
const ESCAPE_MODAL_BTN2 = document.getElementsByClassName('modal__close-btn')[1];
const RESTART_GAME_BTN = document.getElementById('restartGameBtn');

// Close the modal and opens the initial modal if the user clicks on "Start a new game"
RESTART_GAME_BTN.onclick = function() {
  GAMEOVER_MODAL.style.display = 'none';
  CHARACTER_MODAL.style.display = 'block';

  // Resetting all the main menu stats to initial values
  menuStats.livesNumber = 5;
  menuStats.gemsNumber = 0;
  menuStats.victoriesNumber = 0;
  menuStats.score = 0;
  sec = 0;

  livesNumber.textContent = menuStats.livesNumber;
  gemsNumber.textContent = menuStats.gemsNumber;
  victoriesNumber.textContent = menuStats.victoriesNumber;
  secondsElapsed.textContent = sec;
  score.textContent = menuStats.score;
};

// Close the modal when the player clicks on the cross button.
ESCAPE_MODAL_BTN2.onclick = function() {
  GAMEOVER_MODAL.style.display = 'none';
};

/*
 * CONFIRMATION MODAL
 */
 const CONFIRMATION_MODAL = document.getElementById('confirmationModal');
 const ESCAPE_MODAL_BTN3 = document.getElementsByClassName('modal__close-btn')[2];
 const CONF_YES_BTN = document.getElementById('confirmYesBtn');
 const CONF_NO_BTN = document.getElementById('confirmNoBtn');

 CONF_YES_BTN.onclick = function() {
   GAMEOVER_MODAL.style.display = 'block';
   CONFIRMATION_MODAL.style.display = 'none';
   newGameStarted = false;
   gameOver();
 }

  CONF_NO_BTN.onclick = function() {
    CONFIRMATION_MODAL.style.display = 'none';
    gamePause = false;
    startTimer()
  }

  ESCAPE_MODAL_BTN3.onclick = function() {
    CONFIRMATION_MODAL.style.display = 'none';
    gamePause = false;
    startTimer()
  };
