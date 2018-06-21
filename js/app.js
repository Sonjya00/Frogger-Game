/*jshint esversion: 6 */
/*
 * HELPER FUNCTIONS
 */

// helper function to generate a random number
function randomNum(max, min) {
  return Math.floor(Math.random() * max) + min;
}

// Function that disables arrow keys scrolling on the webpage,
// which could interfere with the gameplay
window.addEventListener("keydown", function(e) {
  // space and arrow keys
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
  }
}, false);

/*
 * GENERAL SETTINGS
 */
// Stats on the main menu
let menuStats = {
  livesNumber: 5,
  gemsNumber: 0,
  starsNumber: 0,
  levelNumber: 1,
  score: 0
};

// The maximum level, if reached it is an automatic victory
const LEVEL_MAX = 40;
// The total time, if down to 0 it is an automatic gameOver
let timeMax = 250;

// Variable to check whether a new game have started or not (for the modal)
// Useful to decide which modal to open with the restart btn
let newGameStarted = false;

// Code to restart the game using the button on the top right corner
// The variable is also used to temporarily pause the game in case of victory/gameover
let gamePause = true;
const RESTART_BTN = document.getElementById('restartBtn');
RESTART_BTN.onclick = function() {
  gamePause = true;
  clearTimer();
  if (newGameStarted === true) {
    CONFIRMATION_MODAL.style.display = 'block';
  } else {
    INITIAL_MODAL.style.display = 'block';
  }
};

/*
 * TIMER
 */
 // Code to start, pause, and clear the countdown
let timer;
let sec = timeMax;

function startTimer() {
  timer = setInterval(countseconds, 1000);
}
function countseconds() {
  sec--;
  document.getElementById('secondsElapsed').textContent = sec;
  if (sec === 0) {
    gamePause = true;
    gameOver();
  }
}
function clearTimer() {
  clearInterval(timer);
}

/*
 * ENEMIES
 */

// Constructor function for the enemies
class Enemy {
  constructor(x, y, speed, sprite) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  // Make the enemies move, resets their position when they reach the right border,
  // and sets their speed to a random number between 2 given numbers
  update(dt) {
    this.x += this.speed * dt;
    if (this.x > 505) {
      this.x = -100;
      this.speed = randomNum(enemyStats.speedMax, enemyStats.speedMin);
    }
    // Detect collision with player
    if (player.x >= this.x - 75 // player hit from left
      && player.x <= this.x + 70 // player hit from right
      && player.y > this.y // player on the same column of the bug
      && player.y < this.y + 75) { //same as above
        enemyCollision();
    }
  }
  // Reset position and speed for all enemies
  resetPosition(enemy) {
    allEnemies = [];
    enemyLocation.forEach(function([positionX, positionY]) {
      enemy = new Enemy(positionX, positionY, randomNum(enemyStats.speedMax, enemyStats.speedMin));
      allEnemies.push(enemy);
    });
  }
} // End of Enemy class

// Variables used to update the enemies speed
let enemyStats = {
  speedMax: 180,
  speedMin: 150,
  speedIncremental: 5,
  speedDecrmStar: -20
};

//Code to create enemies at the beginning
let allEnemies = [];
let enemyLocation = [[175, 60], [0, 140], [175, 220]];
enemyLocation.forEach(function([positionX, positionY]) {
  enemy = new Enemy(positionX, positionY, randomNum(enemyStats.speedMax, enemyStats.speedMin));
  allEnemies.push(enemy);
});

/*
 * PLAYER
 */

//Player constructor function. It starts with a default sprite.
class Player {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = PLAYER_SPRITES[0];
    this.movesLeft = -101;
    this.movesRight = 101;
    this.movesUp = -83;
    this.movesDown = 83;
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  update() {
  }
  // The default position of the player is in the middle of the lower row.
  resetPosition() {
    this.x = 202;
    this.y = 405;
  }
  // Function to move the characters with the keyboard.
  // It works only if the game isn't paused.
  // It also contains the condition of victory.
  handleInput(keyPressed) {
    if (keyPressed === 'left' && this.x > 0) {
      checkRockLeft();
      if (isThereRock.rockLeft === false) {
        this.x += this.movesLeft;
      }
    }
    if (keyPressed === 'right' && this.x < 404) {
      checkRockRight();
      if (isThereRock.rockRight === false) {
        this.x += this.movesRight;
      }
    }
    if (keyPressed === 'down' && this.y < 405) {
        checkRockBelow();
        if (isThereRock.rockBelow === false) {
        this.y += this.movesDown;
      }
    }
    if (keyPressed === 'up' && this.y > -10) {
      checkRockAbove();
      if (isThereRock.rockAbove === false) {
          this.y += this.movesUp;
          if (this.y === -10) {
            gamePause = true;
            setTimeout(victory, 500);
          }
      }
    }
  }
} // End of Player class

//Code for the initial modal, to change the sprite of the player.
const PLAYER_SPRITES = [
  'images/char-boy.png',
  'images/char-cat-girl.png',
  'images/char-horn-girl.png',
  'images/char-pink-girl.png',
  'images/char-princess-girl.png'
];

const FORM = document.querySelector("form");
const CHAR_SEL_RADIO = document.getElementsByName('charSelection');

FORM.addEventListener("submit", function(event) {
  for (let i = 0; i < PLAYER_SPRITES.length; i++) {
    if(CHAR_SEL_RADIO[i].checked) {
      player.sprite = PLAYER_SPRITES[i];
    }
  } event.preventDefault();
}, false);

// Player is initialized
let player = new Player(202, 405);

// This listens for key presses and sends the keys to
// Player.handleInput() method (only if game isn't paused)
document.addEventListener('keyup', function(e) {
  let allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };
  if (gamePause === false) {
    player.handleInput(allowedKeys[e.keyCode]);
  }
});

/*
 * COLLECTIBLE ITEMS
 */

// Constructor function for all collectibles
class Items {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  // change the currently shown item's position to a random one and hides it
  // used in case of victory (player reaches the river) or gameover.
  reset() {
    let randomPosition = ITEMS_POS_XY[randomNum(11, 0)];
    this.x = randomPosition[0];
    this.y = randomPosition[1];
    this.onscreen = false;
  }
  // check if the player picks up an item by moving the character on the board
  checkIfPicked() {
    if (player.x >= this.x - 83
    && player.x <= this.x + 83
    && player.y > this.y
    && player.y < this.y + 83
    && this.onscreen === true) {
      return true;
    }
  }
} // End of Items class

// Constructor function for hearts
class Heart extends Items {
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.sprite = 'images/Heart.png';
    this.points = 100;
    this.onscreen = false;
  }
  // If it's picked, +1 life and +100 points
  update() {
    if (this.checkIfPicked()) {
      menuStats.livesNumber ++;
      document.getElementById('livesNumber').textContent = menuStats.livesNumber;

      menuStats.score += this.points;
      document.getElementById('score').textContent = menuStats.score;

      this.onscreen = false;
    }
  }
} // End of Heart class

// Constructor function for stars
class Star extends Items {
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.sprite = 'images/Star.png';
    this.points = 100;
    this.onscreen = false;
  }
  // If it's picked, -30 enemies speed and +100 points
  update() {
    if (this.checkIfPicked()) {

      enemyStats.speedMax += enemyStats.speedDecrmStar;
      enemyStats.speedMin -= enemyStats.speedDecrmStar;
      allEnemies.forEach(function(enemy) {
        enemy.speed -= enemyStats.speedDecrmStar;
      });

      menuStats.starsNumber ++;
      document.getElementById('starsNumber').textContent = menuStats.starsNumber;

      menuStats.score += this.points;
      document.getElementById('score').textContent = menuStats.score;

      this.onscreen = false;
    }
  }
} // End of Star class

// Constructor function for gems
class Gem extends Items {
  constructor(x, y, sprite, points) {
    super(x, y, sprite);
    this.sprite = sprite;
    this.points = points;
    this.onscreen = false;
  }
  // If it's picked, +1 gem collected and +100, +250, or +500 points
  update() {
    if (this.checkIfPicked()) {

      menuStats.gemsNumber ++;
      document.getElementById('gemsNumber').textContent = menuStats.gemsNumber;

      menuStats.score += this.points;
      document.getElementById('score').textContent = menuStats.score;

      this.onscreen = false;
    }
  }
} // End of Gem class

// Object with arrays containing all the possible positions for the items
// Some are commented out to avoid overlapping items with rocks
// (whose positions are already set)
const ITEMS_POS_XY = [
  [0, 50], [0, 130], [0, 210],
  [101, 50], [101, 130], /*[101, 210],*/
  [202, 50], [202, 130], [202, 210],
  [303, 50], /*[303, 130],*/ [303, 210],
  [303, 50], [303, 130], [303, 210]];

// Generate random position for the initial item displayed
let itemRandomPosition = ITEMS_POS_XY[randomNum(11, 0)];

// Initialize all items
let blueGem1 = new Gem(itemRandomPosition[0], itemRandomPosition[1], 'images/Gem-Blue.png', 100);
let blueGem2 = new Gem(itemRandomPosition[0], itemRandomPosition[1], 'images/Gem-Blue.png', 100);
let blueGem3 = new Gem(itemRandomPosition[0], itemRandomPosition[1], 'images/Gem-Blue.png', 100);
let greenGem1 = new Gem(itemRandomPosition[0], itemRandomPosition[1], 'images/Gem-Green.png', 250);
let greenGem2 = new Gem(itemRandomPosition[0], itemRandomPosition[1], 'images/Gem-Green.png', 250);
let orangeGem = new Gem(itemRandomPosition[0], itemRandomPosition[1], 'images/Gem-Orange.png', 500);
let heart = new Heart(itemRandomPosition[0], itemRandomPosition[1]);
let star = new Star(itemRandomPosition[0], itemRandomPosition[1]);

// Create an array with all the items to get a random one each time
let allItems = [blueGem1, blueGem2, blueGem3, greenGem1, greenGem2, orangeGem, heart, star];
let randomItem = {};

function spawnRandomItem() {
  randomItem = allItems[randomNum(8, 0)];
  randomItem.onscreen = true;
}
spawnRandomItem();

/*
 * ROCKS
 */
// Constructor function for rocks
class Rock {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Rock.png';
    this.upperCorner = this.y;
    this.bottomCorner = this.y + 90;
    this.leftCorner = this.x;
    this.rightCorner= this.x + 90;
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
} // End of Rock class

// Possible coordinates for the rocks. Not all of them are used, but with this objects
// the rock positions are easy to change if it's needed
const ROCK_POS = {
  x: [0, 101, 202, 303, 404],
  y: [-20, 55, 135, 215, 305]
};

// Rocks are initialized
let rock1 = new Rock(ROCK_POS.x[2], ROCK_POS.y[4]);
let rock2 = new Rock(ROCK_POS.x[4], ROCK_POS.y[4]);
let rock3 = new Rock(ROCK_POS.x[1], ROCK_POS.y[0]);
let rock4 = new Rock(ROCK_POS.x[3], ROCK_POS.y[2]);
let rock5 = new Rock(ROCK_POS.x[4], ROCK_POS.y[0]);
let rock6 = new Rock(ROCK_POS.x[1], ROCK_POS.y[3]);
let rock7 = new Rock(ROCK_POS.x[3], ROCK_POS.y[0]);

// Array with all rocks
let allRocks = [rock1, rock2, rock3, rock4, rock5, rock6, rock7];
// Array that contains all the rocks currently displayed (1 is added each level)
let displayedRocks = [];

// Object that hold variables that check if a rock is in the player's way in any directions
let isThereRock = {
  rockLeft: false,
  rockRight: false,
  rockAbove: false,
  rockBelow: false
};

/*
 * GAMEPLAY FUNCTIONS
 */

 // It pauses the game, decreases lives number, and calls function to check if gameover
 function enemyCollision() {
   gamePause = true;
   menuStats.livesNumber --;
   document.getElementById('livesNumber').textContent = menuStats.livesNumber;
   setTimeout(checkIfGameover, 500);
 }

 // If there are no more lives left, a gameover modal appears
 // Else, the player and the enemies get back to the original position and the game restarts
 function checkIfGameover() {
   if (menuStats.livesNumber < 1) {
     gameOver();
   } else {
     // Reset items
     randomItem.reset();
     spawnRandomItem();
     // Resume game
     gamePause = false;
   }
   // Reset player and enemies position.
   player.resetPosition();
   enemy.resetPosition();
 } // End of checkIfGameover function

 // It mainly writes the content of the gameOver modal to show
 // according to the game stats. It also clears the timer.
 function gameOver() {
   // Stop timer
   clearTimer();

   // Write modal content with final stats
   document.getElementById('finalGemsNumber').textContent = menuStats.gemsNumber;
   document.getElementById('finalStarsNumber').textContent = menuStats.starsNumber;
   document.getElementById('finalLevelNumber').textContent = menuStats.levelNumber;
   document.getElementById('finalTime').textContent = sec;
   document.getElementById('finalScore').textContent = menuStats.score;

   // Write modal's title and message according to the reason of gameover
   if (menuStats.levelNumber === LEVEL_MAX) {
     document.getElementById('gameOverTitle').textContent = 'You won the game!';
     document.getElementById('gameOverReason').textContent = 'Congratulations! You reached the maximum level!';
   } else if (menuStats.livesNumber === 0) {
     document.getElementById('gameOverTitle').textContent = 'Game Over!';
     document.getElementById('gameOverReason').textContent = 'You ran out of lives!';
   } else if (sec === 0) {
     document.getElementById('gameOverTitle').textContent = 'Game Over!';
     document.getElementById('gameOverReason').textContent = 'You ran out of time!';
   } else {
     document.getElementById('gameOverTitle').textContent = 'Game Over!';
     document.getElementById('gameOverReason').textContent = 'You quit the game.';
   }
   // display the modal
   GAMEOVER_MODAL.style.display = 'block';
 }// End of gameOver function

// In case of victory, the game momentarily pauses and the level increases.
// If the max level has been reached, the game is over.
// Else, the random item is reset (a new one will appear),
// the enemies speed increases to make the next level harder,
// a rock is added (only each 5 levels),
// and the game restarts
function victory() {
  player.resetPosition();

  menuStats.levelNumber ++;
  document.getElementById('levelNumber').textContent = menuStats.levelNumber;

  if (menuStats.levelNumber === LEVEL_MAX) {
    setTimeout(gameOver, 500);

  } else {

    randomItem.reset();
    spawnRandomItem();

    enemyStats.speedMax += enemyStats.speedIncremental;
    enemyStats.speedMin += enemyStats.speedIncremental;

    if (menuStats.levelNumber %5 === 0) {
      addRocks();
    }
      gamePause = false;
  }
} // End of victory function

// Looks for the rock to added in the allRock array searching by index
// (for levels that are multiples of 5)
function addRocks() {
  let rockTBAdded = allRocks[menuStats.levelNumber/5-1];
  displayedRocks.push(rockTBAdded);
  }

// 4 functions to check if there is a rock in any directions
function checkRockLeft() {
  let count = 0;
  for (let i = 0; i < displayedRocks.length; i++) {
    if (player.y < displayedRocks[i].upperCorner
    || player.y > displayedRocks[i].bottomCorner
    || player.x + player.movesLeft > displayedRocks[i].rightCorner
    || player.x < displayedRocks[i].leftCorner) {
      count++;
    }
    if (count === displayedRocks.length) {
      isThereRock.rockLeft = false;
    } else if (count !== displayedRocks.length) {
      isThereRock.rockLeft = true;
    }
  }
}

function checkRockRight() {
  let count = 0;
  for (let i = 0; i < displayedRocks.length; i++) {
    if (player.y < displayedRocks[i].upperCorner
    || player.y > displayedRocks[i].bottomCorner
    || player.x + player.movesRight < displayedRocks[i].leftCorner
    || player.x > displayedRocks[i].rightCorner) {
      count++;
    }
    if (count === displayedRocks.length) {
      isThereRock.rockRight = false;
    } else if (count !== displayedRocks.length) {
      isThereRock.rockRight = true;
    }
  }
}

function checkRockAbove() {
  let count = 0;
  for (let i = 0; i< displayedRocks.length; i++) {
    if (player.x < displayedRocks[i].leftCorner
    || player.x > displayedRocks[i].rightCorner
    || player.y + player.movesUp > displayedRocks[i].bottomCorner
    || player.y < displayedRocks[i].upperCorner) {
      count++;
    }
    if (count === displayedRocks.length) {
      isThereRock.rockAbove = false;
    } else if (count !== displayedRocks.length) {
      isThereRock.rockAbove = true;
    }
  }
}

function checkRockBelow() {
  let count = 0;
  for (let i = 0; i< displayedRocks.length; i++) {
    if (player.x < displayedRocks[i].leftCorner
    || player.x > displayedRocks[i].rightCorner
    || player.y + player.movesDown < displayedRocks[i].upperCorner
    || player.y > displayedRocks[i].bottomCorner) {
      count++;
    }
    if (count === displayedRocks.length) {
      isThereRock.rockBelow = false;
    } else if (count !== displayedRocks.length) {
      isThereRock.rockBelow = true;
    }
  }
}
