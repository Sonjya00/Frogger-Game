# Arcade Game Project

## Project Description

This Arcade Game is a project made for the completion of the [Udacity's Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001?v=fe1).

### Instructions

Build an arcade game clone using JavaScript object-oriented programming features. Detailed instructions are found on this [rubric](https://review.udacity.com/#!/projects/2696458597/rubric) and [here](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true).

## How to play

To start the game, download this project and open the file index.html. A modal will appear explaining the instructions of the game, and prompting you to choose one character among the 5 characters provided. Once you hit the button "Start a new game!", the game will start.

The game requires the use of the keyboard to be played, as the character is moved by pressing the arrow keys.

## Overview

The objective of the game is to bring the character to the other side of the board where the **river tiles** are. Every time the player can do so, the level increases. If the player reaches **level 40**, s/he will win the game.

The player can control the character by pressing on the **arrow keys** on the keyboard.

While attempting to reach the river, the player must avoid the **bugs** that are constantly running across the road from left to right. If they hit the character, one life is lost, and the character goes back to the starting position. When all the lives are lost, the game is over.

The player can't wait too much to make moves, and must keep track of the **timer** too. S/he has to complete the 40 levels in 250 seconds or less. If the timer goes down to zero, it will be an automatic game over.

The player can collect several **items** to gain some advantage: hearts increase the lives number; gems increase the score by 100, 250, or 500 points, and stars slow down the bugs.

Every time the player wins, the bugs gets faster, which makes the game increasingly hard. Also, every 5 levels, a **rock** will spawn on the board, preventing the player from taking the most obvious paths to win.

### Game Mechanics

### Board
The board is composed by 5x6 tiles: 2 rows of grass tiles, 3 rows of stone tiles, and one single row of water tiles.
The character always starts in the middle of the lower grass tile row. The bugs position is set to always be on the three rows made of stone tiles. There is always one bug per row.
The water tiles are the goal of the character: once the player lands in any of them, s/he can go to the next level. The character then goes back to the original position, and the player can repeat the same process.

### Enemies
The bugs run from left to right at a random speed, which at the beginning is set to be between 50 and 80. Every time the player wins, the minimum and maximum speed will be both increased by 5, resulting in the game being harder.

### Collectible items
Once a new game is started, and every time the player wins, a new random item will be spawned on the board. This may be a heart, a star, or a gem of three colors (blue, green, orange). Hearts restore 1 life. Stars reduce the max and min speed of the bugs by 20. Gems can give 100, 250, or 500 points, depending on their color.
The items position is generated randomly, but they will only spawn on the stone tiles, where the bugs are running.
The items have different probabilities of being spawned, with more valuable items being less common:
- **blue gems:** 3/8 probability;
- **green gems:** 2/8 probability;
- **orange gems:** 1/8 probability;
- **hearts:** 1/8 probability;
- **stars:** 1/8 probability.

### Rocks
Every 5 levels, a new rock will appear on the board, preventing the player from moving across certain tiles. A maximum of 7 rocks can be present at the same time. They are positioned on the same tiles, to avoid possible overlapping with the randomly generated items, and to force the player to take alternative paths and not the easiest ones.

### Stats menu
It is possible to check how many lives are left, how many gems and stars have been collected, what the current level is, how much time is left, and the current score so far on the menu on top of the board.

### Victory and game over
The player can win the game by reaching level 40, and will lose if the lives number drops down to zero or if s/he runs out of time. Either way, a game over modal will appear with the stats displayed on the menu (final level, total of gems and stars collected, elapsed time, and final score). The modal will ask if the player wants to start a new game. If the player clicks on the "Start a new game!" button, the initial modal (the one containing the instructions and the character selection) will appear.

### Restart button
The player can restart a game at any time by clicking the restart button. The game will be paused, and a modal will ask the player if s/he wants to restart the game. If the player clicks on "Yes", either the game over modal, or the initial modal  will appear depending on whether a new game had already been started. If the player clicks on "No", the game will simply restart from its pause.

## Credits

- Body font: [Google Font](https://fonts.google.com/)
- Background brick pattern: [https://www.heropatterns.com/](https://www.heropatterns.com/)
- Icons: [BootstrapCDN](https://www.bootstrapcdn.com/)
