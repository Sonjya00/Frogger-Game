//STATS ON MAIN MENU

var menuStats = {
  livesNumber: 5,
  gemsNumber: 0,
  victoriesNumber: 0,
  score: 0
}

var finalGemsNumber = document.getElementById('finalGemsNumber');
var finalVictoriesNumber = document.getElementById('finalVictoriesNumber');
var finalScore = document.getElementById('finalScore');

//Code to pause the game if a btn is clicked
//The variable is used also to temporarily pause the game in case of gameover
var gamePause = true;
var pauseBtn = document.getElementById('pauseBtn');
pauseBtn.addEventListener('click', function() {
  gamePause = !gamePause;
  console.log('pause');
})

// ENEMIES
//Constructor function for the enemies
var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > 505) {
      this.x = -100;
      this.speed = Math.floor(Math.random() * 400) + 150;
    }

    if (player.x >= this.x -83
      && player.x <= this.x + 83
      && player.y > this.y
      && player.y<this.y + 83) {
        enemyCollision();
    }
};

//If there are no more lives left, gameover modal appears.
//Else, the player gets back to original position and the game restarts
function checkIfGameover() {
  if (menuStats.livesNumber < 0) {
    /*gamePause === true;*/

    livesNumber.textContent = 0;
    finalGemsNumber.textContent = menuStats.gemsNumber;
    finalVictoriesNumber.textContent = menuStats.victoriesNumber;
    finalScore.textContent = menuStats.score;

    GAMEOVER_MODAL.style.display = 'block';
    player.resetPosition();
    enemy.resetPosition();
  } else {
    setTimeout(player.resetPosition, 500);
    setTimeout(enemy.resetPosition, 500);
    setTimeout(function() {
      return gamePause = false;
    }, 500);
  }
}

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Pauses the game, decreases lives, and calls fun to check if gameover
function enemyCollision() {
  gamePause = true;
  menuStats.livesNumber --;
  document.getElementById('livesNumber').textContent = menuStats.livesNumber;
  checkIfGameover();
}

//Code to create enemies at the beginning
var allEnemies = [];
var enemyLocation = [[175, 60], [0, 140], [175, 220]];
enemyLocation.forEach(function([positionX, positionY]) {
    enemy = new Enemy(positionX, positionY, 300);
    allEnemies.push(enemy);
});

//Code to recreate enemies once gameover
Enemy.prototype.resetPosition = function(enemy) {
    allEnemies = [];
    enemyLocation.forEach(function([positionX, positionY]) {
        enemy = new Enemy(positionX, positionY, 300);
        allEnemies.push(enemy);
    });
};

//PLAYER
//Player constructor function. It starts with a default sprite.
var Player = function(x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = playerSprites[0];
}

//Code to change the sprite of the player.
  var playerSprites = [
          'images/char-boy.png',
          'images/char-cat-girl.png',
          'images/char-horn-girl.png',
          'images/char-pink-girl.png',
          'images/char-princess-girl.png'];

var avatars = document.getElementById('avatars');

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
});

//Player prototype functions
Player.prototype.update = function() {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Function that resets the position of the player in case of gameover.
Player.prototype.resetPosition = function() {
    player.x = 202;
    player.y = 405;
};

//Function to move the characters with the keyboard.
//It also contains the condition of victory, and the gem.
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
  setTimeout(function() {
    return gamePause = false;
  }, 500);
}

var player = new Player(202, 405);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

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


//Items (gems and heart)

var Heart = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/Heart.png';
  this.points = 100;
  this.onscreen = false;
}

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

var collectibleStats = {
  positionX : [0, 101, 202, 303, 404],
  positionY : [50, 130, 210],
}

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

//helper function to randomize
function randomNum(max, min) {
  return Math.floor(Math.random() * max) + min;
}

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

var blueGem1 = new Gem(collectibleStats.positionX[randomNum(5, 0)], collectibleStats.positionY[randomNum(3, 0)], 'images/Gem Blue.png', 100);

var blueGem2 = new Gem(collectibleStats.positionX[randomNum(5, 0)], collectibleStats.positionY[randomNum(3, 0)], 'images/Gem Blue.png', 100);

var greenGem1 = new Gem(collectibleStats.positionX[randomNum(5, 0)], collectibleStats.positionY[randomNum(3, 0)], 'images/Gem Green.png', 250);

var greenGem2 = new Gem(collectibleStats.positionX[randomNum(5, 0)], collectibleStats.positionY[randomNum(3, 0)], 'images/Gem Green.png', 250);

var orangeGem = new Gem(collectibleStats.positionX[randomNum(5, 0)], collectibleStats.positionY[randomNum(3, 0)], 'images/Gem Orange.png', 500);

var heart = new Heart(collectibleStats.positionX[randomNum(5, 0)], collectibleStats.positionY[randomNum(3, 0)]);

var allItems = [blueGem1, blueGem2, greenGem1, greenGem2, orangeGem, heart];
var randomItem = allItems[randomNum(6, 0)];
randomItem.onscreen = true;
