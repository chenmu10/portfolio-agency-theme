'use strict';

var MINE_SYMBOL = '💣';
var FLAG_SYMBOL = '🚩';
var LOST_SYMBOL = '😞';
var WON_SYMBOL = '🎉';

var gBoard;
var gLevel;
var gTimerInterval;

var gState = {
    isGameOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

// called when page loads
function initGame() {
    gLevel = getLevel();
    gBoard = buildBoard();
    resetGstate();
    resetTimer();
    changeMsg('Good Luck!');
    renderBoard(gBoard);
}


// from radio.id to level {size:a mines:b}
function getLevel() {
    var elRadio = document.querySelector("input[name=level]:checked");
    var level;

    switch (elRadio.id) {
        case 'level1':
            level = {
                SIZE: 4,
                MINES: 2
            };
            break;
        case 'level2':
            level = {
                SIZE: 6,
                MINES: 5
            };
            break;
        case 'level3':
            level = {
                SIZE: 8,
                MINES: 15
            };
            break;
        default:
            break;
    }

    return level;
}

function resetGstate() {
    gState = {
        isGameOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
}

function changeMsg(msgStr) {
    var elEndTxt = document.querySelector('.end');
    elEndTxt.innerHTML = msgStr;
}

// builds the board by setting mines at random locations, and then calling the setMinesNegsCount() Then return the created board
function buildBoard() {
    var boardSize = gLevel.SIZE;
    var minesCount = gLevel.MINES;
    var board = [];

    // generate empty board
    for (var i = 0; i < boardSize; i++) {
        board[i] = [];

        for (var j = 0; j < boardSize; j++) {
            board[i][j] = '';
        }
    }

    // put mines in random cells
    for (i = 0; i < minesCount; i++) {
        var randI = getRandomIntInclusive(0, boardSize - 1);
        var randJ = getRandomIntInclusive(0, boardSize - 1);
        var randCell = board[randI][randJ];

        if (randCell !== MINE_SYMBOL) {
            board[randI][randJ] = MINE_SYMBOL;
        } else {
            i--;
        }
    }

    // put mines neighbors count for every cell
    var finishedBoard = setMinesNegsCount(board);

    return finishedBoard;
}

// Sets mines-count for all cells
function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {

            if (board[i][j] !== MINE_SYMBOL) {
                board[i][j] = getNeighborsCount(board, i, j);
            } else {
                continue;
            }
        }
    }

    return board;
}

// counts mines for specific cell
function getNeighborsCount(board, rowIdx, colIdx) {
    var minesCount = 0;

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (!(i >= 0 && i < board.length)) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            // If middle cell or out of mat - continue;
            if ((i === rowIdx && j === colIdx) ||
                (j < 0 || j >= board[i].length)) continue;

            if (board[i][j] === MINE_SYMBOL) minesCount++;
        }
    }
    return minesCount;
}

//  Print the board as a <table> to the page
function renderBoard(board) {
    var strHtml = '';

    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';

        for (var j = 0; j < row.length; j++) {
            var cellContent = row[j];
            var className = 'hidden';
            var tdId = 'cell-' + i + '-' + j;

            strHtml += '<td id="' + tdId + '" onclick="cellClicked(this)" oncontextmenu="cellMarked(this)" ' +
                'class="' + className + '"></td>';

        }
        strHtml += '</tr>';
    }

    // Update DOM
    var elTable = document.querySelector('.board');
    elTable.innerHTML = strHtml;
}

// Called when a cell (td) is clicked
function cellClicked(elCell) {
    if (!gState.isGameOn) return;

    // clicked a flag
    if (elCell.innerHTML === FLAG_SYMBOL) {
        gState.markedCount--;
        checkGameOver();
        // console.log('unmarked. now marked: ' + gState.markedCount);
        // console.log('unmarked. now shown: ' + gState.shownCount);
    }

    if (gState.secsPassed === 0) {
        gTimerInterval = setInterval(runTimer, 1000);
    }

    var cellCoord = getCellCoord(elCell.id); // uses object {i:x, j:y}
    var cellContent = gBoard[cellCoord.i][cellCoord.j]; // from MODEL

    // clicked an hidden cell
    if (!isCellShown(elCell)) {
        elCell.innerHTML = cellContent;
        elCell.classList.remove('hidden');

        if (cellContent === MINE_SYMBOL) {
            gState.isGameOn = false;
            lostGame();
            return;
        } else if (cellContent === 0) {
            // show two neighbors levels
            expandShown(cellCoord);
        }
        gState.shownCount++;
        // console.log('clicked. now marked: ' + gState.markedCount);
        // console.log('clicked. now shown: ' + gState.shownCount);
        checkGameOver();
    }
    // console.table(gBoard);
}

//  Called on right click to mark a cell as suspected to have a mine
function cellMarked(elCell) {
    if (elCell.innerHTML === '') {
        elCell.innerHTML = FLAG_SYMBOL;
        gState.markedCount++;

        if (gState.secsPassed === 0) {
            gTimerInterval = setInterval(runTimer, 1000);
        }

        // console.log('marked. now marked: ' + gState.markedCount);
        // console.log('marked. now shown: ' + gState.shownCount);
    }

    checkGameOver();
    // code added in html <body>: oncontextmenu="return false;". to disable the default popup menu on right click
}

// When user clicks an empty place (0 negs), we need to open not only that cell, but also its neighbors.
// Two levels around the cell
function expandShown(cellCoord) {
    var rowIdx = cellCoord.i;
    var colIdx = cellCoord.j;

    for (var i = rowIdx - 2; i <= rowIdx + 2; i++) {
        if (!(i >= 0 && i < gBoard.length)) continue;

        for (var j = colIdx - 2; j <= colIdx + 2; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            var selector = getSelector(i, j); // returns '#cell-i-j'
            var elCell = document.querySelector(selector);

            // uncover only if hidden without flag + no mine from model
            if (elCell.innerHTML === '' && gBoard[i][j] !== MINE_SYMBOL) {
                elCell.innerHTML = gBoard[i][j];
                elCell.classList.remove('hidden');
                gState.shownCount++;
            }
        }
    }
}

// When user clicks a mine show all cells and show lost message
function lostGame() {
    clearInterval(gTimerInterval);
    var elCells = document.querySelectorAll('td');

    for (var i = 0; i < elCells.length; i++) {
        var elCell = elCells[i];
        var cellCoord = getCellCoord(elCell.id); // uses object {i:x, j:y}
        elCell.innerHTML = gBoard[cellCoord.i][cellCoord.j];
        elCell.classList.add('lost');
    }
    changeMsg('You Lost ' + LOST_SYMBOL);
    
}

// Game ends when all mines are marked and all the other cells are shown
function checkGameOver() {
    var cellsCount = gBoard.length * gBoard.length;
    var cellsEndShown = gLevel.SIZE * gLevel.SIZE - gLevel.MINES;

    if (gState.markedCount === gLevel.MINES && gState.shownCount === cellsEndShown) {
        console.log(' ' + gState.shownCount + ' ' + gState.markedCount + ' ' + cellsCount);
        changeMsg('You Won ' + WON_SYMBOL);
        gState.isGameOn = false;
        clearInterval(gTimerInterval);
    }

}

// returns true if cell has number - not hidden/marked with flag
function isCellShown(elCell) {
    return (Number.isInteger(elCell.innerHTML) || elCell.innerHTML === 0);
}

// Gets a string such as: 'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    coord.i = +strCellId.substring(5, strCellId.lastIndexOf('-'));
    coord.j = +strCellId.substring(strCellId.lastIndexOf('-') + 1);

    return coord;
}

function getSelector(i, j) {
    return '#cell-' + i + '-' + j;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}


function runTimer() {
    document.querySelector('.seconds').innerHTML = pad(++gState.secsPassed % 60);
    document.querySelector('.minutes').innerHTML = pad(parseInt(gState.secsPassed / 60, 10));
}

// helper function for timer()
function pad(val) {
    return val > 9 ? val : "0" + val;
}

function resetTimer() {
    clearInterval(gTimerInterval);
    document.querySelector('.seconds').innerHTML = '00';
    document.querySelector('.minutes').innerHTML = '00';
}