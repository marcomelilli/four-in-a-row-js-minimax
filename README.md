# Four in a row - AI
This project is an implementation in javascript of the algorithm [minimax](https://en.wikipedia.org/wiki/Minimax) with [Alpha-Beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) applied to the game `Connect Four`.

It uses [EaselJs](https://www.createjs.com/easeljs) for drawing the board, as support for working with the HTML5 Canvas element.

# Example
You can find here a [live demo](http://connectfour.marcomelilli.com)!

![game screenshot](https://github.com/marcomelilli/four-in-a-row-js-minimax/raw/master/img/game-screen.png)

# Running Locally
The AI is runned in background in another thread thanks to [WebWorkers](https://en.wikipedia.org/wiki/Web_worker). For this reason, if you are using Chrome to run the project, be sure to close all the tabs and run it as:
`"C:\path\Chrome.exe" --allow-file-access-from-files`

Or alternatively you should run an http server locally.

# How it works

The AI searches the best move through algorithm **minimax**: 

> It is a recursive algorithm for choosing the next move in an n-player game. 
> A value is associated with each position or state of the game. 
> This value is computed... and it indicates how good it would be for a player to reach that position. 
> The player then makes the move that maximizes the minimum value of the position resulting from the opponent's possible following moves"

In this game I assumed a number of arbitrary points for each position of checkers on the board, and so I was able to calculate the state of the game in each iteration. 
The AI searches all the possible moves try to minimize the score of the board, and at the same time it tries to prevent the opponent maximizing his score.

Above the board you can see the live score of the board and you can set the **depth** of the algorithm. 

# Copyright
Licensed under the MIT license.



