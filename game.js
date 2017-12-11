
function Game() {

    this.turn = Config.HUMAN_PLAYER;
	this.computerIsThinking = false;
    this.Board = new CanvasBoard(null, this);
}


Game.prototype.placeHumanMove = function(evt) {
	var Game = this;

	var checkerSpace = evt.currentTarget.name;
	var columnIndex = checkerSpace[checkerSpace.length -1];

    var isValidMove = Game.Board.placeMove(Game.turn, columnIndex);

	if(isValidMove){
        Game.switchTurn();
	}
}

Game.prototype.generateComputerMove = function() {
	var game = this;
    //TODO: record time

    var deferred = jQuery.Deferred();	
	var depth = $("#depthSelect").val();
    var board = new CanvasBoard(game.Board.matrixBoard, game);

	game.worker.addEventListener('message', function handler(e) {
        var bestMove = e.data;

        console.log(bestMove);
        game.Board.placeMove(game.turn, bestMove.columnMove);
		game.worker.removeEventListener('message', handler);
        deferred.resolve();
	}, false);

	var workerParams = {
		matrixBoard : board.matrixBoard,
		depth : depth,
		maximizingPlayer : false
	}
	game.worker.postMessage(JSON.stringify(workerParams));

	return deferred.promise();
}

Game.prototype.resetGame = function() {
    this.Board.resetBoard();
    this.turn = Config.HUMAN_PLAYER;
    $("#winningAlert").hide();
    $("#scoreAlert").show();
    document.getElementById("score").innerHTML = 0;
    this.Board.enableClick();
}


Game.prototype.switchTurn = function(){
    var game = this;
    game.Board.refreshBoard()

    game.turn = game.turn == Config.HUMAN_PLAYER ? Config.COMPUTER_AI : Config.HUMAN_PLAYER;

    if (game.turn == Config.COMPUTER_AI ){
        game.computerIsThinking = true;
        game.Board.disableClick();
        $("#waitingAlert").show();
    } else if(game.turn == Config.HUMAN_PLAYER) {
        game.computerIsThinking = false;
        game.Board.enableClick();
        $("#waitingAlert").hide();
    }

    var score = game.Board.getScore();
    var isDrawn = game.Board.isFull()
    document.getElementById("score").innerHTML = score;
    
    if( isDrawn || score > Config.WINNING_SCORE - 100 || score < -Config.WINNING_SCORE + 100){
        $("#winningAlert").show(); $("#scoreAlert").hide(); $("#waitingAlert").hide();
        document.getElementById("winningAlert").innerHTML = isDrawn ? "The game is drawn!" : ( score > 0 ? "You Win!" : "AI Wins!");

        game.Board.disableClick();
    } else {
        if (game.turn == Config.COMPUTER_AI ){
            game.generateComputerMove().done(function(){
                game.switchTurn();
            }); 
        }
    }
}

/**
 * Start game
 */
function Init() {
    var game = new Game();

	game.worker = new Worker('minimax.js');

    game.Board.initBoard();
    $("#restartGame").on('click', function(e) {
        game.resetGame();
    });
}


window.onload = function() {
    Init()
};