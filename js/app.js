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
      setTimeout(function () {
        player.resetPosition();
      }, 100);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var allEnemies = [];
var enemyLocation = [[175, 60], [0, 140], [175, 220]];

enemyLocation.forEach(function([positionX, positionY]) {
    enemy = new Enemy(positionX, positionY, 30);
    allEnemies.push(enemy);
});

//PLAYER

var Player = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/char-princess-girl.png';
}

Player.prototype.update = function() {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.resetPosition = function() {
    player.x = 202;
    player.y = 405;
};

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
