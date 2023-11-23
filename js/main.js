//This is the source code for Chinese chess
//1=black,2=red,9=border(prevent index out of range error),1=king,2=advisor,3=elephant,4=horse,5=chariot,6=cannon,7=pawn

let board = [
	[9,9,9,9,9,9,9,9,9,9,9],
    [9,15,14,13,12,11,12,13,14,15,9],
    [9,0,0,0,0,0,0,0,0,0,9],
    [9,0,16,0,0,0,0,0,16,0,9],
    [9,17,0,17,0,17,0,17,0,17,9],
    [9,0,0,0,0,0,0,0,0,0,9],
    [9,0,0,0,0,0,0,0,0,0,9],
    [9,27,0,27,0,27,0,27,0,27,9],
    [9,0,26,0,0,0,0,0,26,0,9],
    [9,0,0,0,0,0,0,0,0,0,9],
    [9,25,24,23,22,21,22,23,24,25,9],
    [9,9,9,9,9,9,9,9,9,9,9]
];

//declare global variables
var MoveCount = 0;
var color = '';
var target = 0;
var ValidMoveList = [];
var LastExe = '';
var NextMove = [];
var posArray = [];
var chessID = '';
var stoneSelected = false;

//cannon tends to jump over a stone. so variable jump is to determine whether a stone has been found
var jump = false;

//some pieces' moves are restricted
const kiRegionR = [[8,4],[8,5],[8,6],[9,4],[9,5],[9,6],[10,4],[10,5],[10,6]];
const kiRegionB = [[1,4],[1,5],[1,6],[2,4],[2,5],[2,6],[3,4],[3,5],[3,6]];
const advRegionR = [[8,4],[8,6],[9,5],[10,4],[10,6]];
const advRegionB = [[1,4],[1,6],[2,5],[3,4],[3,6]];
const eleRegionR = [[10,3],[10,7],[8,1],[8,5],[8,9],[6,3],[6,7]];
const eleRegionB = [[1,3],[1,7],[3,1],[3,5],[3,9][5,3],[5,7]];

//a function used to check whether two arrays are the same
function contains(a,b) {
    if (JSON.stringify(a) === JSON.stringify(b)) {
        return true
    } else {
        return false
    }
}

//define rules for simple moves, including move horizontal and vertical for 1 unit
function left(pos) {
    let NextC = pos[1] - 1;
    if (NextC <= 0) {
        return false
    } else {
        let NextMove = [pos[0],NextC];
        return NextMove
    }
}

function right(pos) {
    let NextC = pos[1] + 1;
    if (NextC >= 10) {
        return false
    } else {
        let NextMove = [pos[0],NextC];
        return NextMove
    }
}

function up(pos) {
    let NextR = pos[0] - 1;
    if (NextR <= 0) {
        return false
    } else {
        let NextMove = [NextR,pos[1]];
        return NextMove
    }
}

function down(pos) {
    let NextR = pos[0] + 1;
    if (NextR >= 11) {
        return false
    } else {
        let NextMove = [NextR,pos[1]];
        return NextMove
    }
}

//define rules for simple moves, including move diagonal for 1 unit
function topLeft(pos) {
    let NextR = pos[0] - 1;
    let NextC = pos[1] - 1;
    if (NextR <= 0 || NextC <= 0) {
        return false
    } else {
        let NextMove = [NextR,NextC]
        return NextMove
    }
}

function topRight(pos) {
    let NextR = pos[0] - 1;
    let NextC = pos[1] + 1;
    if (NextR <= 0 || NextC >= 10) {
        return false
    } else {
        let NextMove = [NextR,NextC]
        return NextMove
    }
}

function botLeft(pos) {
    let NextR = pos[0] + 1;
    let NextC = pos[1] - 1;
    if (NextR >= 11 || NextC <= 0) {
        return false
    } else {
        let NextMove = [NextR,NextC]
        return NextMove
    }
}

function botRight(pos) {
    let NextR = pos[0] + 1;
    let NextC = pos[1] + 1;
    if (NextR >= 11 || NextC >= 10) {
        return false
    } else {
        let NextMove = [NextR,NextC]
        return NextMove
    }
}

//check all vertical and horizontal path
function CheckAllPath(pos) {
    NextMove = left(pos);
	LastExe = 'left';
    if (NextMove !== false) {
        CheckValidity(NextMove)
    }
    NextMove = right(pos);
	LastExe = 'right';
    if (NextMove !== false) {
        CheckValidity(NextMove)
    }
    NextMove = up(pos);
	LastExe = 'up';
    if (NextMove !== false) {
        CheckValidity(NextMove)
    }
    NextMove = down(pos);
	LastExe = 'down';
    if (NextMove !== false) {
        CheckValidity(NextMove)
    }
}

//check all diagonal path, record previous execution due to the slight difference between elephant and advisor movement
function CheckAllDiagonal(pos) {
    NextMove = topLeft(pos);
    LastExe = 'topLeft';
    if (NextMove) {
        CheckValidity(NextMove)
    }
    NextMove = topRight(pos);
    LastExe = 'topRight';
    if (NextMove) {
        CheckValidity(NextMove)
    }
    NextMove = botLeft(pos);
    LastExe = 'botLeft';
    if (NextMove) {
        CheckValidity(NextMove)
    }
    NextMove = botRight(pos);
    LastExe = 'botRight';
    if (NextMove) {
        CheckValidity(NextMove)
    }
}

//Recursive function that keeps going in one direction until it finds a stone or reaches the border
function KeepLeft(pos) {
    NextMove = left(pos);
	if (NextMove !== false) {
		let r = NextMove[0];
		let c = NextMove[1];
		if (board[r][c] === 0) {
			if (!jump) {
				ValidMoveList.push(NextMove)
			}
			return KeepLeft(NextMove)
		} else {
			LastExe = 'KeepLeft';
			return CheckValidity(NextMove)
		}
	}
}

function KeepRight(pos) {
    NextMove = right(pos);
	if (NextMove !== false) {
		let r = NextMove[0];
		let c = NextMove[1];
		if (board[r][c] === 0) {
			if (!jump) {
				ValidMoveList.push(NextMove)
			}
			return KeepRight(NextMove)
		} else {
			LastExe = 'KeepRight';
			return CheckValidity(NextMove)
		}
	}
}

function KeepDown(pos) {
    NextMove = down(pos);
	if (NextMove !== false) {
		let r = NextMove[0];
		let c = NextMove[1];
		if (board[r][c] === 0) {
			if (!jump) {
				ValidMoveList.push(NextMove)
			}
			return KeepDown(NextMove)
		} else {
			LastExe = 'KeepDown';
			return CheckValidity(NextMove)
		}
    }
}

function KeepUp(pos) {
    NextMove = up(pos);
	if (NextMove !== false) {
		let r = NextMove[0];
		let c = NextMove[1];
		if (board[r][c] === 0) {
			if (!jump) {
				ValidMoveList.push(NextMove)
			}
			return KeepUp(NextMove)
		} else {
			LastExe = 'KeepUp';
			return CheckValidity(NextMove)
		}
    }
}

function KeepCheckAllPath(pos) {
	jump = false;
    KeepLeft(pos);
	jump = false;
    KeepRight(pos);
	jump = false;
    KeepDown(pos);
	jump = false;
    KeepUp(pos);
}

function HorseCheckAllPath(pos) {
	var NextPos = [];
	NextPos = left(pos);
	if (NextPos !== false) {
		let r = NextPos[0];
		let c = NextPos[1];
		if (board[r][c] === 0) {
			NextMove = topLeft(NextPos);
			if (NextMove) {
				CheckValidity(NextMove);
			}
			NextMove = botLeft(NextPos);
			if (NextMove) {
				CheckValidity(NextMove);
			}
		}
	}
	NextPos = right(pos);
	if (NextPos !== false) {
		let r = NextPos[0];
		let c = NextPos[1];
		if (board[r][c] === 0) {
			NextMove = topRight(NextPos);
			if (NextMove) {
				CheckValidity(NextMove);
			}
			NextMove = botRight(NextPos);
			if (NextMove) {
				CheckValidity(NextMove);
			}
		}
	}
	NextPos = up(pos);
	if (NextPos !== false) {
		let r = NextPos[0];
		let c = NextPos[1];
		if (board[r][c] === 0) {
			NextMove = topLeft(NextPos);
			if (NextMove) {
				CheckValidity(NextMove);
			}
			NextMove = topRight(NextPos);
			if (NextMove) {
				CheckValidity(NextMove);
			}
		}
	}
	NextPos = down(pos);
	if (NextPos !== false) {
		let r = NextPos[0];
		let c = NextPos[1];
		if (board[r][c] === 0) {
			NextMove = botLeft(NextPos);
			if (NextMove) {
				CheckValidity(NextMove);
			}
			NextMove = botRight(NextPos);
			if (NextMove) {
				CheckValidity(NextMove);
			}
		}
	}
}

//check color first if there is a stone, a general check. If stone with same color found, return false
function GeneralCheck(NextMove) {
	let r = NextMove[0];
	let c = NextMove[1];
	if (board[r][c] !== (0 & 9)) {
		let NextStone = board[r][c];
		if (parseInt(NextStone/10) === 2 && color === 'red') {
			return false;
		} else if (parseInt(NextStone/10) === 1 && color === 'black') {
			return false;
		}
	}
	return true;
}

//check whether a move is valid based on what the stone is
function CheckValidity(NextMove) {
	
	//cannon is a special case because it jumps over stones
	if (!GeneralCheck(NextMove) && chessID !== 'cannon') {
		return;
	}
	
	let r = NextMove[0];
	let c = NextMove[1];
	
	//specific check based on what the stone is
    if (chessID === 'king' && color === 'red') {
        for (const item of kiRegionR) {
            if (contains(item,NextMove)) {
                ValidMoveList.push(NextMove)
                break
            }
        }
    } else if (chessID === 'king' && color === 'black') {
        for (const item of kiRegionB) {
            if (contains(item,NextMove)) {
                ValidMoveList.push(NextMove)
                break
            }
        }
    } else if (chessID === "advisor" && color ==='red') {
        for (const item of advRegionR) {
            if (contains(item,NextMove)) {
                ValidMoveList.push(NextMove)
                break
            }
        }
    } else if (chessID === "advisor" && color ==='black') {
        for (const item of advRegionB) {
            if (contains(item,NextMove)) {
                ValidMoveList.push(NextMove)
                break
            }
        }
    } else if (chessID === "elephant" && color ==='red') {
        //check if there is a stone blocking the elephant's path)
        if (board[r][c] === 0) {
            if (LastExe === 'topLeft') {
                NextMove = topLeft(NextMove);
            } else if (LastExe === 'topRight') {
                NextMove = topRight(NextMove);
            } else if (LastExe === 'botLeft') {
                NextMove = botLeft(NextMove);
            } else if (LastExe === 'botRight') {
                NextMove = botRight(NextMove);
            }
			for (const item of eleRegionR) {
				if (contains(item,NextMove)) {
					if (GeneralCheck(NextMove)) {
						ValidMoveList.push(NextMove);
						break
					}
				}
			}
        }

    } else if (chessID === "elephant" && color ==='black') {
        if (board[r][c] === 0) {
            if (LastExe === 'topLeft') {
                NextMove = topLeft(NextMove);
            } else if (LastExe === 'topRight') {
                NextMove = topRight(NextMove);
            } else if (LastExe === 'botLeft') {
                NextMove = botLeft(NextMove);
            } else if (LastExe === 'botRight') {
                NextMove = botRight(NextMove);
            }
			for (const item of eleRegionB) {
				if (contains(item,NextMove)) {
					if (GeneralCheck(NextMove)) {
						ValidMoveList.push(NextMove);
						break
					}
				}
			}
        }

    } else if (chessID === "horse") {
		ValidMoveList.push(NextMove)
    } else if (chessID === "chariot") {
        ValidMoveList.push(NextMove)
    } else if (chessID === "cannon") {
		if (!jump) {
			jump = true;
			if (LastExe === 'KeepLeft') {
				KeepLeft(NextMove)
			} else if (LastExe === 'KeepRight') {
				KeepRight(NextMove)
			} else if (LastExe === 'KeepDown') {
				KeepDown(NextMove)
			} else if (LastExe === 'KeepUp') {
				KeepUp(NextMove)
			}
		} else {
			ValidMoveList.push(NextMove);
		}
    } else if (chessID === "pawn" && color ==='red' && LastExe !== 'down') {
        if (board[r][c] !== 9) {
            ValidMoveList.push(NextMove)
        }
    } else if (chessID === "pawn" && color ==='black' && LastExe !== 'up') {
        if (board[r][c] !== 9) {
            ValidMoveList.push(NextMove)
        }
    }
}

//find the next move move for a certain stone
function FindNextMove(pos) {
    if (chessID === "king") {
        CheckAllPath(pos)
    } else if (chessID === "advisor") {
        CheckAllDiagonal(pos)
    } else if (chessID === "elephant") {
        CheckAllDiagonal(pos)
    } else if (chessID === "horse") {
		HorseCheckAllPath(pos)
    } else if (chessID === "chariot") {
        KeepCheckAllPath(pos)
    } else if (chessID === "cannon") {
        KeepCheckAllPath(pos)
    } else if (chessID === "pawn" && color ==='red') {
        if (pos[0] === 6 || pos[0] === 7) {
            let ValidMove = up(pos);
            ValidMoveList.push(ValidMove)
        } else {
            CheckAllPath(pos)
        }
    } else if (chessID === "pawn" && color ==='black') {
        if (pos[0] === 4 || pos[0] === 5) {
            let ValidMove = down(pos);
            ValidMoveList.push(ValidMove)
        } else {
            CheckAllPath(pos)
        }
    }
}

//a function that updates the displayed chess board
function DisplayRefresh(oldPos,newPos) {
	//remove label on old button
	const oldBtn = document.getElementById(JSON.stringify(oldPos))
	oldBtn.value = " ";
	oldBtn.class = "";
	
	//add label on new button
	const newBtn = document.getElementById(JSON.stringify(newPos))
	if (chessID === "king") {
		newBtn.value = "将";
	} else if (chessID === "advisor") {
		newBtn.value = "士";
	} else if (chessID === "elephant") {
		newBtn.value = "象";
	} else if (chessID === "horse") {
		newBtn.value = "马";
	} else if (chessID === "chariot") {
		newBtn.value = "車";
	} else if (chessID === "cannon") {
		newBtn.value = "炮";
	} else if (chessID === "pawn") {
		newBtn.value = "卒";
	}
	
	if (color === "black") {
		newBtn.className = "black";
	} else if (color === "red") {
		newBtn.className = "red";
	}
}

// a function that receives user press keys signal
function ReadValue(val) {
	//case 1: the user hasn't selected the stone and it is time for the player to make a move
	if (!stoneSelected) {
		let MoveCheck = false;
		target = 0;
		chessID = '';
		posArray = val;
		color = 'unknown'
		ValidMoveList = []

		//if it is red's turn
		if (MoveCount%2 === 0) {
			color = "red";
			//check selected red piece
			let r = posArray[0];
			let c = posArray[1];
			target = board[r][c];
			if (parseInt(target/10) === 2) {
				MoveCheck = true;
			}

		//if it is black's turn
		} else if (MoveCount%2 === 1) {
			color = "black";
		//check select black piece
			let r = posArray[0];
			let c = posArray[1];
			target = board[r][c];
			if (parseInt(target/10) === 1) {
				MoveCheck = true;
			}
		}
		
		document.getElementById("result").value = color
		document.getElementById("result").value += String(target)
		//if the move is valid. find potential next moves
		if (MoveCheck) {
			//Highlight valid next move, store in a list
			if (target%10 === 1) {
				chessID = "king";
			} else if (target%10 === 2) {
				chessID = "advisor";
			} else if (target%10 === 3) {
				chessID = "elephant";
			} else if (target%10 === 4) {
				chessID = "horse";
			} else if (target%10 === 5) {
				chessID = "chariot";
			} else if (target%10 === 6) {
				chessID = "cannon";
			} else if (target%10 === 7) {
				chessID = "pawn";
			}
			FindNextMove(posArray);
			stoneSelected = true;
			document.getElementById("result").value = chessID
			document.getElementById("result").value += JSON.stringify(ValidMoveList)
		}
    } else if (stoneSelected) {
		//case 2: player selected a stone
		let NewMove = val;
		let LastMove = posArray;
		//check if the next move is valid
		for (const item of ValidMoveList) {
			if (contains(NewMove,item)) {
				let nr = NewMove[0];
				let nc = NewMove[1];
				let r = LastMove[0];
				let c = LastMove[1];
				board[nr][nc] = target;
				board[r][c] = 0;
				MoveCount ++;
				DisplayRefresh(LastMove,NewMove);
				break
			}
		}
		//if next move is invalid, return to case 1 asking for input without changing movecount
		stoneSelected = false;

		//coditions for games ending
		//King facing each other; king checkmated; 

	}
}