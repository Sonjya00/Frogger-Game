//SELECT NEW CHARACTER MODAL
const MODAL = document.getElementById('gameModal');
const ESCAPE_MODAL_BTN = document.getElementsByClassName('modal__close-btn')[0];
const RESTART_MODAL_BTN = document.getElementsByClassName('modal__restart-btn')[0];

//Close the modal and restart the game when the player clicks on Restart.
RESTART_MODAL_BTN.onclick = function() {
  MODAL.style.display = 'none';
  gamePause = false;
};

//Close the modal when the player clicks on the cross button.
ESCAPE_MODAL_BTN.onclick = function() {
  MODAL.style.display = 'none';
};

//Close the modal when the player clicks anywhere outside of it.
window.onclick = function(event) {
  if (event.target == MODAL) {
    MODAL.style.display = 'none';
  }
};
