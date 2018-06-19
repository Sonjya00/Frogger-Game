frontend-nanodegree-arcade-game
===============================

Students should use this [rubric](https://review.udacity.com/#!/projects/2696458597/rubric) for self-checking their submission. Make sure the functions you write are **object-oriented** - either class functions (like Player and Enemy) or class prototype functions such as Enemy.prototype.checkCollisions, and that the keyword 'this' is used appropriately within your class and class prototype functions to refer to the object the function is called upon. Also be sure that the **readme.md** file is updated with your instructions on both how to 1. Run and 2. Play your arcade game.

For detailed instructions on how to get started, check out this [guide](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true).

# Arcade Game Project

## Project Description

This Arcade Game is a project made for the completion of the [Udacity's Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001?v=fe1).

### Instructions

Build an arcade game clone using JavaScript object-oriented programming features. Detailed instructions are found on this [rubric](https://review.udacity.com/#!/projects/2696458597/rubric)

## How to play

To start the game, open the file index.html. A modal will appear explaining the instructions of the game, and prompting you to choose one character among the 5 characters provided. Once you hit the button "Start a new game!", the game will start.

The game requires the use of the keyboard to be played, as the character is moved by pressing on the arrow keys.

## Overview

The objective of the game is to bring the character to the other side of the board where the river tiles are. The player can control the character by pressing on the arrow keys on the keyboard.

While attempting to do so, the player must avoid the bugs that are constantly running across the road from left to right. If they hit the character, one life is lost, and the character goes back to the start position. When all the lives are lost, the game is over.

The player can restore the lives number by picking up the hearts that randomly spawn on the board.

The player can also collect gems on the board to get more points. Each gem gives a different amount of point.

Every time the player wins, the bugs gets faster, to make the game increasingly hard.

### Game Mechanics

### Board
The board is composed by 5x5 tiles. The character starts in the middle grass tile of the lower row.
The bugs position is set to always be on the three rows made of stone tiles, one per row.
The water tiles is the goal of the character: once it is reached, a victory is added, and the player goes back to the original position.

### Enemies
The bugs run from left to right at a random speed, which at the beginning is set to be between 150 and 400. Every time the player wins, the minimum and maximum speed will be both increased by 10, resulting in the game being harder.

### Collectible items
Once a new game has started, and every time the player wins, a new item will be spawned on the board. This may be a heart, a star, or a gem of three colors (blue, green, orange). Hearts restore 1 life. Stars reduce the max and min speed of the bugs by 30. Gems can give 100, 250, or 500 points, depending on their color.
Items position is generated randomly, but they will only spawn on the stone tiles, where the bugs are running.
The items have different probabilities of being spawned, with more valuable items being less common:
- **blue gems:** 3/8 probability;
- **green gems:** 2/8 probability;
- **orange gems:** 1/8 probability;
- **hearts:** 1/8 probability;
- **stars:** 1/8 probability.

### Stats menu
It is possible to check how many lives are left, how many gems have been collected, how many times the player has won, and the current score so far on the menu on top of the board.

### Game over modal
If the player loses the game, a game over modal will appear with the stats displayed on the menu (total of gems collected, total of victories, and final score). The modal will ask if the player wants to start a new game. If the player clicks on the "Start a new game!" button, the initial modal (the one containing the instructions and the character selection) will appear.

### Restart button
The player can restart a game any time by clicking the restart button. The game will be paused, and a modal will ask the player if s/he wants to restart the game. If the player clicks on yes, either the game over modal, or the initial modal  will appear depending on whether a new game had already been started or not. If the player clicks on no, the game will simply restart from the pause.

## Credits

- Body font: [Google Font](https://fonts.google.com/)
- Background brick pattern: [https://www.heropatterns.com/](https://www.heropatterns.com/)
- Icons: [BootstrapCDN](https://www.bootstrapcdn.com/)
