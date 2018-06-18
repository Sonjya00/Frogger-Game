/*
 * GLOBAL
 */
// Stats on the main menu
var menuStats = {
  livesNumber: 5,
  gemsNumber: 0,
  victoriesNumber: 0,
  score: 0
}

// Variables for the gameover modal
var finalGemsNumber = document.getElementById('finalGemsNumber');
var finalVictoriesNumber = document.getElementById('finalVictoriesNumber');
var finalTime = document.getElementById('finalTime');
var finalScore = document.getElementById('finalScore');

// helper function to generate a random number
function randomNum(max, min) {
  return Math.floor(Math.random() * max) + min;
}

// Code to pause the game if a button is clicked
// The variable is also used to temporarily pause the game in case of victory/gameover
var gamePause = true;
var pauseBtn = document.getElementById('pauseBtn');
/*
pauseBtn.addEventListener('click', function() {
  gamePause = !gamePause;
})*/

var restartBtn = document.getElementById('restartBtn');
restartBtn.onclick = function() {
  gamePause = true;
  clearTimer();
  CONFIRMATION_MODAL.style.display = 'block';
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
var Enemy = function(x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.sprite = 'images/enemy-bug.png';
};

// Variables used to update the enemies speed
var enemyStats = {
  speedMax: 400,
  speedMin: 150
}

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
  // Reset player/enemies position, and enemies speed
  player.resetPosition();
  enemy.resetPosition();
  enemyStats.speedMax = 400;
  enemyStats.speedMin = 150;
  clearTimer();

  // Write modal content with final stats
  finalGemsNumber.textContent = menuStats.gemsNumber;
  finalVictoriesNumber.textContent = menuStats.victoriesNumber;
  finalTime.textContent = sec;
  finalScore.textContent = menuStats.score;
  GAMEOVER_MODAL.style.display = 'block';
}

function lifeLost() {
  // Reset player/enemies position, and restarts current game
  setTimeout(player.resetPosition, 500);
  setTimeout(enemy.resetPosition, 500);
  setTimeout(function() {
    return gamePause = false;
  }, 500);
}

//Code to create enemies at the beginning
var allEnemies = [];
var enemyLocation = [[175, 60], [0, 140], [175, 220]];
enemyLocation.forEach(function([positionX, positionY]) {
    enemy = new Enemy(positionX, positionY, randomNum(enemyStats.speedMax, enemyStats.speedMin));
    allEnemies.push(enemy);
});

//Code to recreate enemies if gameover
Enemy.prototype.resetPosition = function(enemy) {
    allEnemies = [];
    enemyLocation.forEach(function([positionX, positionY]) {
        enemy = new Enemy(positionX, positionY, randomNum(enemyStats.speedMax, enemyStats.speedMin));
        allEnemies.push(enemy);
    });
};

/*
 * PLAYER
 */

//Player constructor function. It starts with a default sprite.
var Player = function(x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = playerSprites[0];
}

//Code for the initial modal, to change the sprite of the player.
var playerSprites = [
  'images/char-boy.png',
  'images/char-cat-girl.png',
  'images/char-horn-girl.png',
  'images/char-pink-girl.png',
  'images/char-princess-girl.png'
];

var form = document.querySelector("form");
var charSelection = document.getElementsByName('charSelection');

form.addEventListener("submit", function(event) {
  for (var i = 0; i < playerSprites.length; i++) {
    if(charSelection[i].checked) {
      player.sprite = playerSprites[i];
    }
  } event.preventDefault();
}, false);

/*var avatars = document.getElementById('avatars');

avatars.addEventListener('click', function(evt) {
  if (evt.target.nodeName === 'IMG') {
    switch (evt.target.getAttribute('src')) {
      case 'images/char-boy.png':
      player.sprite = playerSprites[0];
      break;
      case 'images/char-cat-girl.png':
      player.sprite = playerSprites[1];
      break;
      case 'images/char-horn-girl.png':
      player.sprite = playerSprites[2];
      break;
      case 'images/char-pink-girl.png':
      player.sprite = playerSprites[3];
      break;
      case 'images/char-princess-girl.png':
      player.sprite = playerSprites[4];
      break;
    }
  }
});*/

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

// Player is initialized
var player = new Player(202, 405);

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

// In case of victory, the game momentarily pauses, victory n. increases,
// the random item is reset (a new one will appear),
// and the enemies speed will be increased to make each level harder.
// Finally, the game restarts
function victory() {
  gamePause = true;
  setTimeout(player.resetPosition, 500);

  menuStats.victoriesNumber ++;
  document.getElementById('victoriesNumber').textContent = menuStats.victoriesNumber;

  setTimeout(allItems.forEach(function(item) {
    item.reset();
  }), 500);
  setTimeout(function() {
    randomItem = allItems[randomNum(6, 0)];
    randomItem.onscreen = true;
  }, 500)

    enemyStats.speedMax += 10;
    enemyStats.speedMin += 10;

  setTimeout(function() {
    return gamePause = false;
  }, 500);
}

// This listens for key presses and sends the keys to
// Player.handleInput() method.

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

/*
//OPTIONAL ROCK
var Rock = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/Rock.png';
}

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var rock1 = new Rock(101, 220);
var rock2 = new Rock(202, 220);

var allRocks = [rock1, rock2]
*/


/*
 * COLLECTIBLE ITEMS
 */

// Constructor function for hearts
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

// Object with arrays containing all the possible positions for the items
var collectibleStats = {
  positionX : [0, 101, 202, 303, 404],
  positionY : [50, 130, 210],
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
  Gem.x = collectibleStats.positionX[randomNum(5, 0)];
  Gem.y = collectibleStats.positionY[randomNum(3, 0)];
  Gem.onscreen = false;
};

Heart.prototype.reset = function() {
  heart.x = collectibleStats.positionX[randomNum(5, 0)];
  heart.y = collectibleStats.positionY[randomNum(3, 0)];
  heart.onscreen = false;
};

// Initialize all items
var blueGem1 = new Gem(collectibleStats.positionX[randomNum(5, 0)], collectibleStats.positionY[randomNum(3, 0)], 'images/Gem Blue.png', 100);

var blueGem2 = new Gem(collectibleStats.positionX[randomNum(5, 0)], collectibleStats.positionY[randomNum(3, 0)], 'images/Gem Blue.png', 100);

var greenGem1 = new Gem(collectibleStats.positionX[randomNum(5, 0)], collectibleStats.positionY[randomNum(3, 0)], 'images/Gem Green.png', 250);

var greenGem2 = new Gem(collectibleStats.positionX[randomNum(5, 0)], collectibleStats.positionY[randomNum(3, 0)], 'images/Gem Green.png', 250);

var orangeGem = new Gem(collectibleStats.positionX[randomNum(5, 0)], collectibleStats.positionY[randomNum(3, 0)], 'images/Gem Orange.png', 500);

var heart = new Heart(collectibleStats.positionX[randomNum(5, 0)], collectibleStats.positionY[randomNum(3, 0)]);

// Create an array with all the items to get a random one each time
var allItems = [blueGem1, blueGem2, greenGem1, greenGem2, orangeGem, heart];
var randomItem = allItems[randomNum(6, 0)];
randomItem.onscreen = true;
