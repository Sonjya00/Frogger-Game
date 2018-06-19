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
}

// Variables for the gameover modal
const F_GEMS_NUM = document.getElementById('finalGemsNumber');
const F_STARS_NUM = document.getElementById('finalStarsNumber');
const F_LEVEL_NUM = document.getElementById('finalLevelNumber');
const F_TIME = document.getElementById('finalTime');
const F_SCORE = document.getElementById('finalScore');

// helper function to generate a random number
function randomNum(max, min) {
  return Math.floor(Math.random() * max) + min;
}

// Variable to check whether a new game have started or not (for the modal)
// Useful to decide which modal to open with the restart btn
var newGameStarted = false;

// Code to pause the game if a button is clicked
// The variable is also used to temporarily pause the game in case of victory/gameover
var gamePause = true;
var pauseBtn = document.getElementById('pauseBtn');

var restartBtn = document.getElementById('restartBtn');
restartBtn.onclick = function() {
  gamePause = true;
  clearTimer();
  if (newGameStarted === true) {
    CONFIRMATION_MODAL.style.display = 'block';
  } else {
    INITIAL_MODAL.style.display = 'block';
  }
}

/*
 * TIMER
 */
var timer;
var sec = 0;
var secondsElapsed = document.getElementById('secondsElapsed');

function startTimer() {
  timer = setInterval(countseconds, 1000);
}

function countseconds() {
  sec++;
  secondsElapsed.textContent = sec;
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

  reset() {
    this.x = COLLECTIBLES_POS.positionX[randomNum(5, 0)];
    this.y = COLLECTIBLES_POS.positionY[randomNum(3, 0)];
    this.onscreen = false;
  }

  update(dt) {
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
  }

  resetPosition(enemy) {
    allEnemies = [];
    enemyLocation.forEach(function([positionX, positionY]) {
      enemy = new Enemy(positionX, positionY, randomNum(enemyStats.speedMax, enemyStats.speedMin));
      allEnemies.push(enemy);
    })
  }
}

// Variables used to update the enemies speed
var enemyStats = {
  speedMax: 40,
  speedMin: 15
}

//Code to create enemies at the beginning
var allEnemies = [];
var enemyLocation = [[175, 60], [0, 140], [175, 220]];
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
    gameOver();
  } else {
    lifeLost();
  }
}

function gameOver() {
  // Reset player position
  player.resetPosition();
  // Reset enemies position and speed
  enemy.resetPosition();
  enemyStats.speedMax = 400;
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
  F_GEMS_NUM.textContent = menuStats.gemsNumber;
  F_STARS_NUM.textContent = menuStats.starsNumber;
  F_LEVEL_NUM.textContent = menuStats.levelNumber;
  F_TIME.textContent = sec;
  F_SCORE.textContent = menuStats.score;
  GAMEOVER_MODAL.style.display = 'block';
}

// Reset player/enemies position, and restarts current game
function lifeLost() {
  setTimeout(player.resetPosition, 500);
  setTimeout(enemy.resetPosition, 500);
  setTimeout(function() {
    return gamePause = false;
  }, 500);
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
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  update() {
  }

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
        if (this.y < rock1.upperCorner
          || this.y > rock1.bottomCorner
          || this.x < rock1.leftCorner
          || this.x - 101 > rock1.rightCorner) {
          this.x -= 101;
        }
      }
      if (keyPressed === 'right' && this.x < 404) {
        if (this.y < rock1.upperCorner
          || this.y > rock1.bottomCorner
          || this.x > rock1.rightCorner
          || this.x + 101 < rock1.leftCorner) {
          this.x += 101;
        }
      }
      if (keyPressed === 'down' && this.y < 405) {
        if (this.x < rock1.leftCorner
          || this.x > rock1.rightCorner
          || this.y + 83 < rock1.upperCorner
          || this.y > rock1.bottomCorner) {
          this.y += 83;
        }
      }
      if (keyPressed === 'up' && this.y > -10) {
        if (this.x < rock1.leftCorner
          || this.x > rock1.rightCorner
          || this.y - 83 > rock1.bottomCorner
          || this.y < rock1.upperCorner) {
            this.y -= 83;
            if (this.y === -10) {
              victory();
          }
        }
      }
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

/*
var avatars = document.getElementById('avatars');
avatars.addEventListener('click', function(evt) {
  if (evt.target.nodeName === 'IMG') {
    switch (evt.target.getAttribute('src')) {
      case 'images/char-boy.png':
      player.sprite = PLAYER_SPRITES[0];
      break;
      case 'images/char-cat-girl.png':
      player.sprite = PLAYER_SPRITES[1];
      break;
      case 'images/char-horn-girl.png':
      player.sprite = PLAYER_SPRITES[2];
      break;
      case 'images/char-pink-girl.png':
      player.sprite = PLAYER_SPRITES[3];
      break;
      case 'images/char-princess-girl.png':
      player.sprite = PLAYER_SPRITES[4];
      break;
    }
  }
});
*/

// In case of victory, the game momentarily pauses, victory n. increases,
// the random item is reset (a new one will appear),
// and the enemies speed will be increased to make each level harder.
// Finally, the game restarts
function victory() {
  gamePause = true;
  setTimeout(player.resetPosition, 500);

  menuStats.levelNumber ++;
  document.getElementById('levelNumber').textContent = menuStats.levelNumber;

  setTimeout(function() {
    allItems.forEach(function(item) {
      item.reset();
    });
    randomItem = allItems[randomNum(8, 0)];
    randomItem.onscreen = true;
  }, 500)

    enemyStats.speedMax += 10;
    enemyStats.speedMin += 10;

  addRocks();

  setTimeout(function() {
    return gamePause = false;
  }, 500);
}

function addRocks() {
  switch (menuStats.levelNumber) {
    case 2:
      setTimeout(function() {
        displayedRocks.push(rock2);
      }, 500);
    break;
    case 4:
      setTimeout(function() {
        displayedRocks.push(rock3);
      }, 500);
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
  reset() {
    this.x = COLLECTIBLES_POS.positionX[randomNum(5, 0)];
    this.y = COLLECTIBLES_POS.positionY[randomNum(3, 0)];
    this.onscreen = false;
  }
}

class Heart extends Items {
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.sprite = 'images/Heart.png';
    this.points = 100;
    this.onscreen = false;
  }
  update() {
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
  }
}

class Star extends Items {
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.sprite = 'images/Star.png';
    this.points = 100;
    this.onscreen = false;
  }
  update() {
    if (player.x >= this.x -83
      && player.x <= this.x + 83
      && player.y > this.y
      && player.y < this.y + 83
      && this.onscreen === true) {

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

class Gem extends Items {
  constructor(x, y, sprite, points) {
    super(x, y, sprite);
    this.sprite = sprite;
    this.points = points;
    this.onscreen = false;
  }
  update() {
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
  }
}

// Object with arrays containing all the possible positions for the items
const COLLECTIBLES_POS = {
  positionX : [0, 101, 202, 303, 404],
  positionY : [50, 130, 210],
}

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
  Gem.x = COLLECTIBLES_POS.positionX[randomNum(5, 0)];
  Gem.y = COLLECTIBLES_POS.positionY[randomNum(3, 0)];
  Gem.onscreen = false;
};

Heart.prototype.reset = function() {
  heart.x = COLLECTIBLES_POS.positionX[randomNum(5, 0)];
  heart.y = COLLECTIBLES_POS.positionY[randomNum(3, 0)];
  heart.onscreen = false;
};*/

// Initialize all items
let blueGem1 = new Gem(COLLECTIBLES_POS.positionX[randomNum(5, 0)], COLLECTIBLES_POS.positionY[randomNum(3, 0)], 'images/Gem Blue.png', 100);

let blueGem2 = new Gem(COLLECTIBLES_POS.positionX[randomNum(5, 0)], COLLECTIBLES_POS.positionY[randomNum(3, 0)], 'images/Gem Blue.png', 100);

let blueGem3 = new Gem(COLLECTIBLES_POS.positionX[randomNum(5, 0)], COLLECTIBLES_POS.positionY[randomNum(3, 0)], 'images/Gem Blue.png', 100);

let greenGem1 = new Gem(COLLECTIBLES_POS.positionX[randomNum(5, 0)], COLLECTIBLES_POS.positionY[randomNum(3, 0)], 'images/Gem Green.png', 250);

let greenGem2 = new Gem(COLLECTIBLES_POS.positionX[randomNum(5, 0)], COLLECTIBLES_POS.positionY[randomNum(3, 0)], 'images/Gem Green.png', 250);

let orangeGem = new Gem(COLLECTIBLES_POS.positionX[randomNum(5, 0)], COLLECTIBLES_POS.positionY[randomNum(3, 0)], 'images/Gem Orange.png', 500);

let heart = new Heart(COLLECTIBLES_POS.positionX[randomNum(5, 0)], COLLECTIBLES_POS.positionY[randomNum(3, 0)]);

let star = new Star(COLLECTIBLES_POS.positionX[randomNum(5, 0)], COLLECTIBLES_POS.positionY[randomNum(3, 0)]);

// Create an array with all the items to get a random one each time
let allItems = [blueGem1, blueGem2, blueGem3, greenGem1, greenGem2, orangeGem, heart, star];
let randomItem = allItems[randomNum(8, 0)];
randomItem.onscreen = true;


/*
 * ROCKS
 */

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

let rock1 = new Rock(303, 220);
let rock2 = new Rock(202, 135);
let rock3 = new Rock(404, 50);
let rock4 = new Rock(101, 220);
let rock5 = new Rock(0, 135);

let displayedRocks = [rock1];

/*
let allRocks = [rock1, rock2, rock3, rock4, rock5];
let randomRock = allRocks[randomNum(5, 0)];
randomRock.onscreen = true;*/
