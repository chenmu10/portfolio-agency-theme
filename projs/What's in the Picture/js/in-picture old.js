'use strict';

var gQuests;
var gCurrQuestIdx;
var gScore;

initGame();

function initGame() {
    resetHide();
    gCurrQuestIdx = 0;
    gScore = 0;
    createQuests();
    renderQuest();
}

function createQuests() {
    var quest1 = {
        id: 1, opts: ['Lighthouse', 'Cat'], correctOptIndex: 0
    };
    var quest2 = {
        id: 2, opts: ['Childern', 'Guitar'], correctOptIndex: 1
    };
    var quest3 = {
        id: 3, opts: ['Dog', 'Snake'], correctOptIndex: 0
    };
    gQuests = [quest1, quest2, quest3];
}

function renderQuest() {
    var currPic = gCurrQuestIdx + 1;
    var currQuestOpts = gQuests[gCurrQuestIdx].opts;
    var pic = document.querySelector('.questImg');
    pic.src = '../img/in-picture/' + currPic + '.jpg';

    var strHtml = '';

    for (var i = 0; i < currQuestOpts.length; i++) {
        var option = currQuestOpts[i];
        strHtml += '<li><button class="option" onclick="checkAnswer(this,' + i + ')">' + option + '</button></li>';
    }

    var elOptions = document.querySelector('.options-list');
    elOptions.innerHTML = strHtml;
}

function checkAnswer(elButton, optIdx) {

    var isCorrect = (gQuests[gCurrQuestIdx].correctOptIndex === optIdx);

    if (isCorrect) {
        console.log('right');
        gCurrQuestIdx++;
        gScore++;

        if (gCurrQuestIdx === gQuests.length) {
            endGame();
        } else {
            renderQuest();
        }
    } else {
        console.log('wrong');
        gScore--;
        elButton.classList.toggle('wrong-color');
        setTimeout(function () {
            elButton.classList.toggle('wrong-color');
        }, 1000);
    }

}

function endGame() {
    var strHtml = '';

    strHtml += '<h1>Your Score: <span>' + gScore + '</span></h1><button class="resetBtn" onclick="initGame()">Play Again</button>';

    var elEndScreen = document.querySelector('.endScreen');
    elEndScreen.innerHTML = strHtml;
    elEndScreen.classList.toggle('hidden');
    var elQuestScreen = document.querySelector('.questScreen');
    elQuestScreen.classList.toggle('hidden');
}

function resetHide() {
    var elEndScreen = document.querySelector('.endScreen');
    elEndScreen.classList.add('hidden');
    var elQuestScreen = document.querySelector('.questScreen');
    elQuestScreen.classList.remove('hidden');
    
}






