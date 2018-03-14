'use strict';
/*
Touch numbers game:
- get difficulty with radio buttons
- get nums into array
- render nums to table
- user clicks the first number, game time starts and presented. start interval. 
^ show timer in seconds
- when finished - stop interval
^ stop timer
*/

var gBoardSize;
var gGameTimeInterval;
var gStartTime = 0;
var gNums;
var gNextNum;

resetBoard();

function resetBoard(elRadio) {
  
    gBoardSize =  (elRadio) ? elRadio.value : 4;
    gNums = getNumsInRange(gBoardSize);
    renderTable(gBoardSize);
    gNextNum = 1;
    resetTimer();
}

function renderTable(gBoardSize) {

    var elTblNums = document.querySelector('.tbl-nums');
    var strHtml = '';
    var k = 0;

    for (var i = 0; i < gBoardSize; i++) {
        strHtml += '<tr>';

        for (var j = 0; j < gBoardSize; j++) {
            var num = gNums.pop(); // with pop
            strHtml += '<td onclick="cellClicked(this,' + num + ')">' + num + '</td>';
            k++;
        }
        strHtml += '</tr>';

    }

    elTblNums.innerHTML = strHtml;

}

function cellClicked(elCell, num) {

    if (num === gNextNum) {
        elCell.classList.add('clicked');
        gNextNum++;
        if (num === 1) {
            gStartTime = new Date().getTime();
            var elTimer = document.querySelector('.timer');
            startTimer(elTimer);
        }
        if (num === gBoardSize * gBoardSize) {
            clearTimeout(gGameTimeInterval);
            document.querySelector('.done').innerHTML='Finished!';
        }
    }

}

function startTimer(elTimer) {
    var currTime = new Date().getTime();
    elTimer.innerHTML = ((currTime - gStartTime) / 1000).toFixed(2);
    gGameTimeInterval = setTimeout(startTimer, 10, elTimer); // uses itself

}

function resetTimer() {
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = '0.00';
    clearTimeout(gGameTimeInterval);
}


function getNumsInRange(gBoardSize) {
    gNums = [];
    var maxNum = gBoardSize * gBoardSize;
    for (var i = 1; i <= maxNum; i++) {
        gNums.push(i);
    }
    return shuffle(gNums);
}

function shuffle(items) {
    var j, tempItem, i;
    for (i = items.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tempItem = items[i];
        items[i] = items[j];
        items[j] = tempItem;
    }
    return items;
}