'use strict';

var FLOOR = 'floor';
var WALL = 'wall';
var TARGET = 'target';
var BOX = '📦';
var PLAYER = '👩';
var WON_SYMBOL = '🎉';

var gBoard;
var gGamerPos;
var gSteps = 0;
var gTargetsSum = 0;
var gBoxOnTargetCount = 0;
var boardSize = 10;
var gIsGameOn;
// var gTimeInterval;

function initGame() {
    gIsGameOn = true;
    gSteps = 0;
    gBoxOnTargetCount = 0;
    gTargetsSum = 0;
    updateSteps();
    updateMsg('');
    gBoard = createBoard();
    updateCompleted();
    renderBoard(gBoard);
}

function createCell(type, content) {
    return {
        type: type, // wall,floor,target
        contains: content // player, box
    };
}

function createBoard() {

    var mask = [
        [WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL],
        [WALL, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, WALL],
        [WALL, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, WALL],
        [WALL, PLAYER, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, WALL],
        [WALL, FLOOR, BOX, FLOOR, TARGET, FLOOR, FLOOR, FLOOR, FLOOR, WALL],
        [WALL, FLOOR, BOX, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, FLOOR, WALL],
        [WALL, FLOOR, FLOOR, FLOOR, WALL, FLOOR, FLOOR, FLOOR, FLOOR, WALL],
        [WALL, FLOOR, FLOOR, TARGET, WALL, FLOOR, FLOOR, FLOOR, FLOOR, WALL],
        [WALL, FLOOR, FLOOR, FLOOR, WALL, FLOOR, FLOOR, FLOOR, FLOOR, WALL],
        [WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL]
    ];

    var board = [];

    // build the model
    for (var i = 0; i < mask.length; i++) {
        board[i] = [];
        for (var j = 0; j < mask.length; j++) {
            switch (mask[i][j]) {
                case WALL:
                    board[i][j] = createCell(WALL, '');
                    break;
                case BOX:
                    board[i][j] = createCell(FLOOR, BOX);
                    break;
                case TARGET:
                    board[i][j] = createCell(TARGET, '');
                    gTargetsSum++;
                    break;
                case PLAYER:
                    board[i][j] = createCell(FLOOR, PLAYER);
                    gGamerPos = {
                        i: i,
                        j: j
                    };
                    break;
                default:
                    board[i][j] = createCell(FLOOR, '');
                    break;
            }
        }

    }
    return board;
}


function renderBoard(board) {
    var strHtml = '';

    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';

        for (var j = 0; j < row.length; j++) {
            var cell = row[j];

            var cellContent = cell.contains; // empty/player/box
            var className = cell.type; // floor/wall/target
            var tdId = 'cell-' + i + '-' + j;

            strHtml += '<td id="' + tdId + '" onclick="cellClicked(this)" ' +
                'class="' + className + '">' + cellContent +
                '</td>';
        }
        strHtml += '</tr>';
    }

    // build the DOM
    var elTable = document.querySelector('.board');
    elTable.innerHTML = strHtml;
}


function movePiece(fromCoord, toCoord) {
    if (gBoard[toCoord.i][toCoord.j].type === WALL ||
        gBoard[toCoord.i][toCoord.j].contains === BOX) return;

    // get DOM fromCell
    var elFromCellSelector = getSelector(fromCoord);
    var elFromCell = document.querySelector(elFromCellSelector);

    // get DOM toCell
    var elToCellSelector = getSelector(toCoord);
    var elToCell = document.querySelector(elToCellSelector);

    if (gBoard[toCoord.i][toCoord.j].type === TARGET && gBoard[fromCoord.i][fromCoord.j].contains === BOX) {
        gBoxOnTargetCount++;
        updateCompleted();
        elToCell.classList.add('box-on-target');
        checkGameOver();
    }

    var piece = gBoard[fromCoord.i][fromCoord.j].contains; // player or box

    // Update the Model
    gBoard[fromCoord.i][fromCoord.j].contains = '';
    gBoard[toCoord.i][toCoord.j].contains = piece;

    // Update the DOM
    elToCell.innerText = piece;
    elFromCell.innerText = '';
}


/*
This function checks the 4 cells around the clickedCell.
          j-1                 j                   j+1
i-1                       [checkMe]               
i      [checkMe]   ->[elClickedCell #i-j]<-    [checkMe]
i+1                      [checkMe]          

*[elToCell #i-j] = box -> move in right direction
*[checkMe]= player -> move to clicked cell
*/
function cellClicked(elClickedCell) {
    // get the MODEL cell
    var clickedCellCoord = getCellCoord(elClickedCell.id); // {i,j}
    var clickedCell = gBoard[clickedCellCoord.i][clickedCellCoord.j];

    if (clickedCell.type === WALL || !gIsGameOn) return;

    if (clickedCell.type === TARGET &&
        clickedCell.contains === BOX) return;

    var aboveCellCoord = {
        i: clickedCellCoord.i - 1,
        j: clickedCellCoord.j
    };
    var underCellCoord = {
        i: clickedCellCoord.i + 1,
        j: clickedCellCoord.j
    };
    var leftCellCoord = {
        i: clickedCellCoord.i,
        j: clickedCellCoord.j - 1
    };
    var rightCellCoord = {
        i: clickedCellCoord.i,
        j: clickedCellCoord.j + 1
    };

    var isBox = (clickedCell.contains === BOX);
    var isPlayerAround;

    /* checks the 4 cells around the clickedCell */
    // the player is ABOVE the clicked cell
    if (gGamerPos.i === aboveCellCoord.i && gGamerPos.j === aboveCellCoord.j) {
        if (isBox) movePiece(clickedCellCoord, underCellCoord);
        isPlayerAround = true;
        // the player is UNDER the clicked cell  
    } else if (gGamerPos.i === underCellCoord.i && gGamerPos.j === underCellCoord.j) {
        if (isBox) movePiece(clickedCellCoord, aboveCellCoord);
        isPlayerAround = true;
        // the player is RIGHT to the clicked cell  
    } else if (gGamerPos.i === rightCellCoord.i && gGamerPos.j === rightCellCoord.j) {
        if (isBox) movePiece(clickedCellCoord, leftCellCoord);
        isPlayerAround = true;
        // the player is LEFT to the clicked cell  
    } else if (gGamerPos.i === leftCellCoord.i && gGamerPos.j === leftCellCoord.j) {
        if (isBox) movePiece(clickedCellCoord, rightCellCoord);
        isPlayerAround = true;
    }

    // move player. notice when you try to push box to a wall - movePiece(box) returns false. clickedCell.contains==='' checks that.
    if (isPlayerAround && clickedCell.contains === '') {
        movePiece(gGamerPos, clickedCellCoord);
        gGamerPos = clickedCellCoord;
        gSteps++;
        updateSteps();
    }

    checkGameOver();
    // if (gSteps === 1) {
    //     gTimeInterval = setInterval(addBonus, 3000);
    // }

}

function checkGameOver() {
    if (gBoxOnTargetCount === gTargetsSum) {
        updateMsg(WON_SYMBOL + ' You did it! Score: ' + (100 - gSteps));
        gIsGameOn = false;
    }
}

function updateMsg(txt) {
    var elTxt = document.querySelector('.msg');
    elTxt.innerText = txt;
}

function updateCompleted() {
    var elCompleted = document.querySelector('.completed');
    elCompleted.innerText = gBoxOnTargetCount + '/' + gTargetsSum;
}

function updateSteps() {
    var elSteps = document.querySelector('.steps');
    elSteps.innerText = gSteps;
}

// bonus 1: enable keyboard
document.onkeydown = function (e) {
    var cellCoord;
    switch (e.keyCode) {
        case 37: // LEFT
            cellCoord = {
                i: gGamerPos.i,
                j: gGamerPos.j - 1
            };
            break;
        case 38: // UP
            cellCoord = {
                i: gGamerPos.i - 1,
                j: gGamerPos.j
            };
            break;
        case 39: // RIGHT
            cellCoord = {
                i: gGamerPos.i,
                j: gGamerPos.j + 1
            };
            break;
        case 40: // DOWN
            cellCoord = {
                i: gGamerPos.i + 1,
                j: gGamerPos.j
            };
            break;
    }
    var elCellSelector = getSelector(cellCoord);
    var elCell = document.querySelector(elCellSelector);
    cellClicked(elCell);
};

// function addBonus() {
//     //var bonuses = [CLOCK_BONUS,MAGNET_BONUS,GOLD_BONUS]
//     var isBonus = false;
//     while (!isBonus) {
//         var randI = getRandomIntInclusive(0, boardSize - 1);
//         var randJ = getRandomIntInclusive(0, boardSize - 1);

//         var randCell = gBoard[randI][randJ];

//         if (randCell.type === FLOOR && randCell.contains === '') {
//             randCell.contains = 'C';
//             var elrandCell = document.querySelector('#cell-'+randI+'-'+randJ);
//             elrandCell.innerHTML = randCell.contains;
//             isBonus = true;
//             clearInterval(gTimeInterval);
//         }
//     }
// }


function getRandCell() {
    var randI = getRandomIntInclusive(0, boardSize - 1);
    var randJ = getRandomIntInclusive(0, boardSize - 1);
    return gBoard[randI][randJ];
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}


// Gets a string such as: 'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    coord.i = +strCellId.substring(5, strCellId.lastIndexOf('-'));
    coord.j = +strCellId.substring(strCellId.lastIndexOf('-') + 1);
    return coord;
}

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j;
}