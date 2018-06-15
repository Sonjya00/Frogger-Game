//STATS ON MAIN MENU

var menuStats = {
  livesNumber: 5,
  gemsNumber: 0,
  victoriesNumber: 0
}

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

function enemyCollision() {
  player.resetPosition();
  menuStats.livesNumber --;
  document.getElementById('livesNumber').textContent = menuStats.livesNumber;
}

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var allEnemies = [];
var enemyLocation = [[175, 60], [0, 140], [175, 220]];

enemyLocation.forEach(function([positionX, positionY]) {
    enemy = new Enemy(positionX, positionY, 300);
    allEnemies.push(enemy);
});

//PLAYER
//Player constructor function. It starts with a default sprite.
var Player = function(x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = playerSprites[0];
}

//Code to change the sprite of the player.
  var playerSprites = ['images/char-boy.png',
          'images/char-cat-girl.png',
          'images/char-horn-girl.png',
          'images/char-pink-girl.png',
          'images/char-princess-girl.png'];

var avatars = document.querySelector('table');

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
  if (keyPressed === 'left' && player.x > 0) {
    player.x -= 101;
  }
  if (keyPressed === 'right' && player.x < 404) {
    player.x += 101;
  }
  if (keyPressed === 'up' && player.y > -10) {
    player.y -= 83;
  }
  if (keyPressed === 'down' && player.y < 405) {
    player.y += 83;
  }

  if (player.y === -10) {
    setTimeout(this.resetPosition, 500);
    menuStats.victoriesNumber ++;
    document.getElementById('victoriesNumber').textContent = menuStats.victoriesNumber;
    setTimeout(gem.reset, 500);
  }

  if (player.x >= gem.x -83
    && player.x <= gem.x + 83
    && player.y > gem.y
    && player.y<gem.y + 83) {
      menuStats.gemsNumber ++;
      document.getElementById('gemsNumber').textContent = menuStats.gemsNumber;
      gem.x = -1000;
  }
};

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


//OPTIONAL GEM
var Gem = function(x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
}

var gemStats = {
  gemPositionX : [0, 101, 202, 303, 404],
  gemPositionY : [50, 130, 210],
  gemSprites : ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png']
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.reset = function() {
  gem.x = gemStats.gemPositionX[Math.floor(Math.random() * 5) + 0];
  gem.y = gemStats.gemPositionY[Math.floor(Math.random() * 3) + 0];
  gem.sprite = gemStats.gemSprites[Math.floor(Math.random() * 3) + 0]
};

var gem = new Gem(gemStats.gemPositionX[Math.floor(Math.random() * 5) + 0], gemStats.gemPositionY[Math.floor(Math.random() * 3) + 0], gemStats.gemSprites[Math.floor(Math.random() * 3) + 0]);
