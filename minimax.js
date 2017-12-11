// proper initialization
if( 'function' === typeof importScripts) {
   
	importScripts('config.js');
	importScripts('board.js');

	this.addEventListener('message', function(ev) {
		var params = JSON.parse(ev.data);
		var Board = new CanvasBoard(params.matrixBoard);
		var newmove = Minimax.alphabeta(Board, params.depth, {"score": -9999999}, {"score": 9999999}, params.maximizingPlayer);
		this.postMessage(newmove);
	}, false);

}

var Minimax = Minimax || {};

Minimax.max= function(x, y){
	return x.score > y.score ? JSON.parse(JSON.stringify(x)) : JSON.parse(JSON.stringify(y))
}


Minimax.min = function(x, y){
	return x.score < y.score ? JSON.parse(JSON.stringify(x)) : JSON.parse(JSON.stringify(y));
}

Minimax.alphabeta = function(board, depth, a, b, maximizingPlayer) {
    var currentScore = board.getScore();
    var nodes = [];

    //Check all possible moves
    var player = maximizingPlayer ? Config.HUMAN_PLAYER : Config.COMPUTER_AI;
    for(var column=0; column<Config.COLUMNS_SIZE; column++){
        var nextPossibleBoard = board.placeMove(player, column, true);
        if(nextPossibleBoard) nodes[column] = nextPossibleBoard;   
    };  

    var isDrawn = nodes.length == 0;

    if (depth == 0 || isDrawn || currentScore <= -Config.WINNING_SCORE  || currentScore >= Config.WINNING_SCORE){
        var leaf = {
            "columnMove" : null,
            "score" : currentScore
        };
        return leaf
    }
    
    if (maximizingPlayer){
        var v = {
            "columnMove" : null,
            "score" : -99999
        }
        for( var i=0 ; i <= nodes.length-1 ; i++){
            if(!nodes[i]) continue;
            var nextmove = this.alphabeta(nodes[i], depth-1, a, b, false);
            if(nextmove.score > v.score || v.columnMove == null){
                v.columnMove = i;
                v.score = nextmove.score;
            }
            a = this.max(a, nextmove);
            if(b.score <= a.score){
                break; //(* b cut-off *)
            }   
        };
        return v;
    } else {
        var v = {
            "columnMove" : null,
            "score" : 99999
        }
        for( var i=0 ; i <= nodes.length-1 ; i++){
            if(!nodes[i]) continue;
            var nextmove = this.alphabeta(nodes[i], depth-1, a, b, true);
            if(nextmove.score < v.score || v.columnMove == null){
                v.columnMove = i;
                v.score = nextmove.score;
            }
            b = this.min(b, nextmove);
            if(b.score <= a.score){
                break; //(* a cut-off *)
            }                
        };
        return v;
    }
}



