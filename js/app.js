/*
 * GLOBAL
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

// helper function to generate a random number
function randomNum(max, min) {
  return Math.floor(Math.random() * max) + min;
}

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
 // Code to start, pause, and clear the timer
let timer;
let sec = 0;
const SEC_ELAPSED = document.getElementById('secondsElapsed');

function startTimer() {
  timer = setInterval(countseconds, 1000);
}
function countseconds() {
  sec++;
  SEC_ELAPSED.textContent = sec;
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
} // end of Enemy class

// Variables used to update the enemies speed
let enemyStats = {
  speedMax: 200,
  speedMin: 150
};

//Code to create enemies at the beginning
let allEnemies = [];
let enemyLocation = [[175, 60], [0, 140], [175, 220]];
enemyLocation.forEach(function([positionX, positionY]) {
  enemy = new Enemy(positionX, positionY, randomNum(enemyStats.speedMax, enemyStats.speedMin));
  allEnemies.push(enemy);
});

// It pauses the game, decreases lives number, and calls function to check if gameover
function enemyCollision() {
  gamePause = true;
  menuStats.livesNumber --;
  document.getElementById('livesNumber').textContent = menuStats.livesNumber;
  checkIfGameover();
}

//If there are no more lives left, a gameover modal appears.
//Else, the player and the enemies get back to the original position and the game restarts
function checkIfGameover() {
  if (menuStats.livesNumber < 1) {
    setTimeout(gameOver, 500);
  } else {
    setTimeout(lifeLost, 500);
  }
}

function gameOver() {
  // Reset player position
  player.resetPosition();
  // Reset enemies position and speed
  enemy.resetPosition();
  enemyStats.speedMax = 200;
  enemyStats.speedMin = 150;
  // Reset items
  allItems.forEach(function(item) {
    item.reset();
  });
  randomItem = allItems[randomNum(8, 0)];
  randomItem.onscreen = true;
  // Stop timer
  clearTimer();

  // Write modal content with final stats
  document.getElementById('finalGemsNumber').textContent = menuStats.gemsNumber;
  document.getElementById('finalStarsNumber').textContent = menuStats.starsNumber;
  document.getElementById('finalLevelNumber').textContent = menuStats.levelNumber;
  document.getElementById('finalTime').textContent = sec;
  document.getElementById('finalScore').textContent = menuStats.score;

  if (menuStats.levelNumber === LEVEL_MAX) {
    document.getElementById('gameOverTitle').textContent = 'You won the game!';
    document.getElementById('gameOverReason').textContent = 'Congratulations! You reached the maximum level!';
  } else if (menuStats.livesNumber === 0) {
    document.getElementById('gameOverTitle').textContent = 'Game Over!';
    document.getElementById('gameOverReason').textContent = 'You ran out of lives!';
  } else {
    document.getElementById('gameOverTitle').textContent = 'Game Over!';
    document.getElementById('gameOverReason').textContent = 'You quit the game.';
  }

  GAMEOVER_MODAL.style.display = 'block';
}

// Reset player/enemies position, and restarts current game
function lifeLost() {
  player.resetPosition();
  enemy.resetPosition();
  gamePause = false;
}

// OLD CODE for earlier JS
/*
var Enemy = function(x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the enemies position. It moves them to the right and if they reach
// the right border, it resets their position. Also, it checks for collision.
// Parameter: dt, a time delta between ticks
// Any movement is multiplied by the dt parameter
// which will ensure the game runs at the same speed for all computers.

Enemy.prototype.update = function(dt) {

  this.x += this.speed * dt;
  if (this.x > 505) {
    this.x = -100;
    this.speed = randomNum(enemyStats.speedMax, enemyStats.speedMin);
  }

  if (player.x >= this.x - 83
    && player.x <= this.x + 83
    && player.y > this.y
    && player.y < this.y + 83) {
      enemyCollision();
  }
};

//Code to recreate enemies if gameover
Enemy.prototype.resetPosition = function(enemy) {
    allEnemies = [];
    enemyLocation.forEach(function([positionX, positionY]) {
        enemy = new Enemy(positionX, positionY, randomNum(enemyStats.speedMax, enemyStats.speedMin));
        allEnemies.push(enemy);
    });
};
*/

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
    player.x = 202;
    player.y = 405;
  }

  // Function to move the characters with the keyboard.
  // It works only if the game isn't paused.
  // It also contains the condition of victory.
  handleInput(keyPressed) {
    if (gamePause === false) {
      if (keyPressed === 'left' && this.x > 0) {
        checkRockLeft();
        if (isThereRock.rockLeft === false) {
          this.x += player.movesLeft;
        }
      }
      if (keyPressed === 'right' && this.x < 404) {
        checkRockRight();
        if (isThereRock.rockRight === false) {
          this.x += player.movesRight;
        }
      }
      if (keyPressed === 'down' && this.y < 405) {
          checkRockBelow();
          if (isThereRock.rockBelow === false) {
          this.y += player.movesDown;
        }
      }
      if (keyPressed === 'up' && this.y > -10) {
        checkRockAbove();
        if (isThereRock.rockAbove === false) {
            this.y += player.movesUp;
            if (this.y === -10) {
              gamePause = true;
              setTimeout(victory, 500);
          }}
        }
      }
    }
  } // end of Player class


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

// OLD CODE for earlier JS
/*
var Player = function(x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = PLAYER_SPRITES[0];
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function() {
};

// Function that resets the position of the player in case of gameover.
Player.prototype.resetPosition = function() {
  player.x = 202;
  player.y = 405;
};

// Function to move the characters with the keyboard.
// It works only if the game isn't paused.
// It also contains the condition of victory.
Player.prototype.handleInput = function(keyPressed) {
  if (gamePause === false) {
    if (keyPressed === 'left' && player.x > 0) {
      player.x -= 101;
    }
    if (keyPressed === 'right' && player.x < 404) {
      player.x += 101;
    }
    if (keyPressed === 'down' && player.y < 405) {
      player.y += 83;
    }
    if (keyPressed === 'up' && player.y > -10) {
      player.y -= 83;
      if (player.y === -10) {
        victory();
      }
    }
  }
};
*/

// In case of victory, the game momentarily pauses, victory n. increases,
// the random item is reset (a new one will appear),
// and the enemies speed will be increased to make each level harder.
// Finally, the game restarts
function victory() {
  player.resetPosition();

  menuStats.levelNumber ++;
  document.getElementById('levelNumber').textContent = menuStats.levelNumber;

  if (menuStats.levelNumber === LEVEL_MAX) {
    setTimeout(gameOver, 500);
  } else {

      allItems.forEach(function(item) {
        item.reset();
      });
      randomItem = allItems[randomNum(8, 0)];
      randomItem.onscreen = true;

      enemyStats.speedMax += 10;
      enemyStats.speedMin += 10;

    if (menuStats.levelNumber %5 === 0) {
      addRocks();
    }
      gamePause = false;
  }
}

function addRocks() {
  switch (menuStats.levelNumber) {
    case 5:
        displayedRocks.push(rock1);
    break;
    case 10:
        displayedRocks.push(rock2);
    break;
    case 15:
        displayedRocks.push(rock3);
    break;
    case 20:
        displayedRocks.push(rock4);
    break;
    case 25:
        displayedRocks.push(rock5);
    break;
    case 30:
        displayedRocks.push(rock6);
    break;
    case 35:
        displayedRocks.push(rock7);
    break;
  }
}

// This listens for key presses and sends the keys to
// Player.handleInput() method.

document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

/*
 * COLLECTIBLE ITEMS
 */

// Constructor function for hearts
class Items {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  // change the currently show item's position to a random one and hides it
  reset() {
    let randomPosition = ITEMS_POS_XY[randomNum(11, 0)]
    this.x = randomPosition[0];
    this.y = randomPosition[1];
    this.onscreen = false;
  }
  // check if the player picks up an item by moving on the board
  checkIfPicked() {
    if (player.x >= this.x - 83
      && player.x <= this.x + 83
      && player.y > this.y
      && player.y < this.y + 83
      && this.onscreen === true)
      {return true;}
  }
}

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
}

// Constructor function for the stars
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

      enemyStats.speedMax -=30;
      enemyStats.speedMin -=30;

      menuStats.starsNumber ++;
      document.getElementById('starsNumber').textContent = menuStats.starsNumber;

      menuStats.score += this.points;
      document.getElementById('score').textContent = menuStats.score;

      this.onscreen = false;
    }
  }
}

// Constructor function for the gems
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
}

// Object with arrays containing all the possible positions for the items
/*const ITEMS_POS = {
  x: [0, 101, 202, 303, 404],
  y: [50, 130, 210]
};*/

// Object with arrays containing all the possible positions for the items
const ITEMS_POS_XY = [
  [0, 50], [0, 130], [0, 210],
  [101, 50], [101, 130], /*[101, 210],*/
  [202, 50], [202, 130], [202, 210],
  [303, 50], /*[303, 130],*/ [303, 210],
  [303, 50], [303, 130], [303, 210]];

// OLD CODE for earlier version of JS
/*
var Heart = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/Heart.png';
  this.points = 100;
  this.onscreen = false;
}

// Constructor function for gems
var Gem = function(x, y, sprite, points) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.points = points;
  this.onscreen = false;
}

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//If player grabs the gem, it adds a gem to the menu, adds points, and makes the gem disappear
Gem.prototype.update = function() {
  if (player.x >= this.x -83
    && player.x <= this.x + 83
    && player.y > this.y
    && player.y < this.y + 83
    && this.onscreen === true) {

      menuStats.gemsNumber ++;
      document.getElementById('gemsNumber').textContent = menuStats.gemsNumber;

      menuStats.score += this.points;
      document.getElementById('score').textContent = menuStats.score;

      this.onscreen = false;
  }
};

//If player grabs the heart, it adds a life to the menu, adds points, and makes the heart disappear
Heart.prototype.update = function() {
  if (player.x >= this.x -83
    && player.x <= this.x + 83
    && player.y > this.y
    && player.y < this.y + 83
    && this.onscreen === true) {

      menuStats.livesNumber ++;
      document.getElementById('livesNumber').textContent = menuStats.livesNumber;

      menuStats.score += this.points;
      document.getElementById('score').textContent = menuStats.score;

      this.onscreen = false;
  }
};

Gem.prototype.reset = function() {
  Gem.x = ITEMS_POS.x[randomNum(5, 0)];
  Gem.y = ITEMS_POS.y[randomNum(3, 0)];
  Gem.onscreen = false;
};

Heart.prototype.reset = function() {
  heart.x = ITEMS_POS.x[randomNum(5, 0)];
  heart.y = ITEMS_POS.y[randomNum(3, 0)];
  heart.onscreen = false;
};*/

// Generate random position for the initial item displayed
let itemRandomPosition = ITEMS_POS_XY[randomNum(11, 0)];

// Initialize all items
let blueGem1 = new Gem(itemRandomPosition[0], itemRandomPosition[1], 'images/Gem Blue.png', 100);

let blueGem2 = new Gem(itemRandomPosition[0], itemRandomPosition[1], 'images/Gem Blue.png', 100);

let blueGem3 = new Gem(itemRandomPosition[0], itemRandomPosition[1], 'images/Gem Blue.png', 100);

let greenGem1 = new Gem(itemRandomPosition[0], itemRandomPosition[1], 'images/Gem Green.png', 250);

let greenGem2 = new Gem(itemRandomPosition[0], itemRandomPosition[1], 'images/Gem Green.png', 250);

let orangeGem = new Gem(itemRandomPosition[0], itemRandomPosition[1], 'images/Gem Orange.png', 500);

let heart = new Heart(itemRandomPosition[0], itemRandomPosition[1]);

let star = new Star(itemRandomPosition[0], itemRandomPosition[1]);

// Create an array with all the items to get a random one each time
let allItems = [blueGem1, blueGem2, blueGem3, greenGem1, greenGem2, orangeGem, heart, star];
let randomItem = allItems[randomNum(8, 0)];
randomItem.onscreen = true;

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
}

// Possible coordinates for the rocks. Not all of them are used, but with this objects
// the rock positions are easily editable
const ROCK_POS = {
  x: [0, 101, 202, 303, 404],
  y: [-20, 55, 135, 215, 305]
}

// Rocks are initialized
let rock1 = new Rock(ROCK_POS.x[2], ROCK_POS.y[4]);
let rock2 = new Rock(ROCK_POS.x[4], ROCK_POS.y[4]);
let rock3 = new Rock(ROCK_POS.x[1], ROCK_POS.y[0]);
let rock4 = new Rock(ROCK_POS.x[3], ROCK_POS.y[2]);
let rock5 = new Rock(ROCK_POS.x[4], ROCK_POS.y[0]);
let rock6 = new Rock(ROCK_POS.x[1], ROCK_POS.y[3]);
let rock7 = new Rock(ROCK_POS.x[3], ROCK_POS.y[0]);

// Array that contains all the rocks currently displayed (added each level)
let displayedRocks = [];

// Object that hold variables that check if a rock is in the player's way in any directions
let isThereRock = {
  rockLeft: false,
  rockRight: false,
  rockAbove: false,
  rockBelow: false
};

/*
let allRocks = [rock1, rock2, rock3, rock4, rock5];
let randomRock = allRocks[randomNum(5, 0)];
randomRock.onscreen = true;*/
