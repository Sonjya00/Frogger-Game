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
      console.log(this.speed);
    }
};

// Draw the enemy on the screen, required method for game
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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

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

Player.prototype.handleInput = function(keyPressed) {
  if (keyPressed === 'left' && player.x > 0) {
    player.x -= 101;
  }
  if (keyPressed === 'right' && player.x < 404) {
    player.x += 101;
  }
  if (keyPressed === 'up' && player.y > -10) {
    player.y -= 83;
    console.log(player.y);
  }
  if (keyPressed === 'down' && player.y < 405) {
    player.y += 83;
    console.log(player.y);
  }
  if (player.y === -10) {
    setTimeout(function() {
      player.x = 202;
      player.y = 405;
    }, 500);
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

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
