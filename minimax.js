var Minimax = Minimax || {};

Minimax.max= function(x, y){
        return x.score > y.score ? JSON.parse(JSON.stringify(x)) : JSON.parse(JSON.stringify(y))
    }


Minimax.min = function(x, y){
        return x.score < y.score ? JSON.parse(JSON.stringify(x)) : JSON.parse(JSON.stringify(y));
    }

Minimax.alphabeta = function(board, depth, a, b, maximizingPlayer) {
    var currentScore = board.getScore();
    if (depth == 0 || currentScore <= -board.WINNING_SCORE  || currentScore >= board.WINNING_SCORE){ //|| TODO: board is full)
        var leaf = {
            "score" : board.getScore()
        };
        return leaf
    }
    
    //Set all valid moves in the current node (TODO: spostare in boardCanvas?)
    var nodes = [];
    var player = maximizingPlayer ? board.HUMAN_PLAYER : board.COMPUTER_AI;
    for(var column=0; column<board.COLUMNS_SIZE; column++){
        var nextPossibleBoard = board.placeMove(player, column, true);
        if(nextPossibleBoard) nodes[column] = nextPossibleBoard;   
    };  

    //TODO: Sort Nodes by best-child first

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