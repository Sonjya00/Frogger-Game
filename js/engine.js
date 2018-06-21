/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on the player and enemy objects (defined in the app.js).
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
  /* Predefine the variables used within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  var doc = global.document,
  win = global.window,
  canvas = doc.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  lastTime;
  canvas.width = 505;
  canvas.height = 606;
  document.getElementById('gameCanvas').appendChild(canvas);

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    /* Get the time delta information, which is required if the game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is).
     */
    var now = Date.now(),
        dt = (now - lastTime) / 1000.0;

    /* Call the update/render functions, pass along the time delta to
     * the update function since it may be used for smooth animation.
     */
    update(dt);
    render();

    /* Set the lastTime variable, which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    win.requestAnimationFrame(main);
  } // End of main()

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
  function init() {
      reset();
      lastTime = Date.now();
      main();
  }

  /* This function is called by main (the game loop) and itself calls all
   * of the functions which may need to update entity's data.
   */
  function update(dt) {
    if (gamePause === false) {
      updateEntities(dt);
    }
  }

  /* This is called by the update function and loops through all of the
   * objects within the allEnemies and the allItems arrays, and calls
   * their update() methods. It will then call the update function for
   * the player object.
   */
  function updateEntities(dt) {
      allEnemies.forEach(function(enemy) {
          enemy.update(dt);
      });
      allItems.forEach(function(item) {
        item.update();
      });
      player.update();
  }

  /* This function initially draws the "game level", it will then call
   * the renderEntities function. This function is called every game tick
   * (or loop of the game engine).
   */
  function render() {
    /* Array of the relative URL to the image used for all the rows.*/
    var rowImages = [
      'images/water-block.png',   // Top row is water
      'images/stone-block.png',   // Row 1 of 3 of stone
      'images/stone-block.png',   // Row 2 of 3 of stone
      'images/stone-block.png',   // Row 3 of 3 of stone
      'images/grass-block.png',   // Row 1 of 2 of grass
      'images/grass-block.png'    // Row 2 of 2 of grass
    ],
    numRows = 6,
    numCols = 5,
    row, col;

    // Before drawing, clear existing canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    /* Loop through the number of rows and columns defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* The drawImage function of the canvas' context element
         * requires 3 parameters: the image to draw, the x coordinate
         * to start drawing and the y coordinate to start drawing.
         * The Resources helpers is used to refer to the images, which is useful
         * since we're using them over and over.
         */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderEntities();
  }// End of render()

  /* This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the render functions defined
   * on the enemy and player entities within app.js
   */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function.
     */
    displayedRocks.forEach(function(rock) {
       rock.render();
     });
     if (randomItem.onscreen) {
       randomItem.render();
     }

     allEnemies.forEach(function(enemy) {
       enemy.render();
     });

     player.render();
   } // End of renderEntities()

   function reset() {

   }

  /* Load all of the images needed to draw the game.
   * Then set init as the callback method, so that when
   * all of the images are loaded, the game will start.
   */
  Resources.load([
      //sprites for the environment
      'images/stone-block.png',
      'images/water-block.png',
      'images/grass-block.png',
      //sprite for the enemies
      'images/enemy-bug.png',
      //sprites for the player
      'images/char-boy.png',
      'images/char-cat-girl.png',
      'images/char-horn-girl.png',
      'images/char-pink-girl.png',
      'images/char-princess-girl.png',
      //sprites for the collectibles
      'images/Gem-Blue.png',
      'images/Gem-Green.png',
      'images/Gem-Orange.png',
      'images/Heart.png',
      'images/Star.png',
      //sprite for the rocks
      'images/Rock.png'
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
})(this);// End of Engine
