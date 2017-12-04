
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
	var Game = this;
    //TODO: record time

    var deferred = jQuery.Deferred();	

    setTimeout(function() {
        var depth = $("#depthSelect").val();
        var board = new CanvasBoard(Game.Board.matrixBoard, Game);
        var bestMove = Minimax.alphabeta(board, depth, {"score": -99999}, {"score": 99999}, false);

        console.log(bestMove);
        Game.Board.placeMove(Game.turn, bestMove.columnMove);

        deferred.resolve();
    }, 500);

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
    var Game = this;
    Game.Board.refreshBoard()

    Game.turn = Game.turn == Config.HUMAN_PLAYER ? Config.COMPUTER_AI : Config.HUMAN_PLAYER;

    if (Game.turn == Config.COMPUTER_AI ){
        Game.computerIsThinking = true;
        Game.Board.disableClick();
        $("#waitingAlert").show();
    } else if(Game.turn == Config.HUMAN_PLAYER) {
        Game.computerIsThinking = false;
        Game.Board.enableClick();
        $("#waitingAlert").hide();
    }

    var score = Game.Board.getScore();
    document.getElementById("score").innerHTML = score;
    
    if(score > Config.WINNING_SCORE - 100 || score < -Config.WINNING_SCORE + 100){
        $("#winningAlert").show()
       document.getElementById("winningAlert").innerHTML = score>0 ? "You Win!" : "AI Wins!";
        $("#scoreAlert").hide();
        Game.Board.disableClick();
    } else {
        if (Game.turn == Config.COMPUTER_AI ){
            Game.generateComputerMove().done(function(){
                Game.switchTurn();
            }); 
        }
    }
}

/**
 * Start game
 */
function Init() {
    var game = new Game();

    game.Board.initBoard();
    $("#restartGame").on('click', function(e) {
        game.resetGame();
    });
}


window.onload = function() {
    Init()
};