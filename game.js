
function Game() {
    this.HUMAN_PLAYER = 1;
	this.COMPUTER_AI = 2;
    
    this.turn = this.HUMAN_PLAYER;
	this.computerIsThinking = false;
    this.Board = new CanvasBoard(null, this);
}


Game.prototype.placeHumanMove = function(evt) {
	var Game = this;

    // //Block click after human move
    // if(Game.computerIsThinking) return;

	var checkerSpace = evt.currentTarget.name;
	var columnIndex = checkerSpace[checkerSpace.length -1];

    var isValidMove = Game.Board.placeMove(Game.turn, columnIndex);

	if(isValidMove){
        Game.switchTurn();
	}
	// // clear the text if this is the first listener:
	// if (evt.currentTarget == this.stage && (evt.eventPhase == 1 || evt.eventPhase == 2)) {
	// 	// this.text.text = "";
	// }
	// if (evt.eventPhase != lastPhase) {
	// 	// this.text.text += ">> " + ["capture", "target", "bubble"][evt.eventPhase - 1] + " phase:\n";
	// 	lastPhase = evt.eventPhase;
	// }
	// text.text += "type=" + evt.type + " target=" + evt.target.name + " eventPhase=" + evt.eventPhase + " currentTarget=" + evt.currentTarget.name + "\n";
}

Game.prototype.generateComputerMove = function() {
	var Game = this;
    //TODO: record time

    var deferred = jQuery.Deferred();	

    setTimeout(function() {
        var depth = 0;
        var board = new CanvasBoard(Game.Board.matrixBoard, Game);
        var newMove = Minimax.alphabeta(board, 4, {"score": -99999}, {"score": 99999}, false);

        console.log(newMove);
        Game.Board.placeMove(Game.turn, newMove.columnMove);

        deferred.resolve();
    }, 500);

	return deferred.promise();
}

Game.prototype.resetGame = function() {
    this.Board.resetBoard();
    this.turn = this.HUMAN_PLAYER;
    $("#winningAlert").hide();
    $("#scoreAlert").show();
    document.getElementById("score").innerHTML = 0;
    this.Board.enableClick();
}


Game.prototype.switchTurn = function(){
    var Game = this;
    Game.Board.refreshBoard()

    Game.turn = Game.turn == Game.HUMAN_PLAYER ? Game.COMPUTER_AI : Game.HUMAN_PLAYER;

    if (Game.turn == Game.COMPUTER_AI ){
        Game.computerIsThinking = true;
        Game.Board.disableClick();
        $("#waitingAlert").show();
    } else if(Game.turn == Game.HUMAN_PLAYER) {
        Game.computerIsThinking = false;
        Game.Board.enableClick();
        $("#waitingAlert").hide();
    }

    var score = Game.Board.getScore();
    document.getElementById("score").innerHTML = score;
    
    if(score > Game.Board.WINNING_SCORE - 100 || score < -Game.Board.WINNING_SCORE + 100){
        $("#winningAlert").show()
       document.getElementById("winningAlert").innerHTML = score>0 ? "You Win!" : "AI Wins!";
        $("#scoreAlert").hide();
        Game.Board.disableClick();
    } else {
        if (Game.turn == Game.COMPUTER_AI ){
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