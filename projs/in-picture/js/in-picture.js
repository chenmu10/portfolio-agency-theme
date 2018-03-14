'use strict';

var gQuests = createQuests();
var gCurrQuestIdx;
var gScore;
var gNextId = 1;
var gWrongClicked = false;

function initGame() {
    resetHide();
    gCurrQuestIdx = 0;
    gScore = 100;
    
    var questAmount = document.querySelector('.questAmount');
    questAmount.innerText = gQuests.length;

    createQuests();
    renderQuest();
}

function createQuests() {
    var quests = [];

    quests.push(createQuest(['Lighthouse', 'Cat'], 0));
    quests.push(createQuest(['Children', 'Guitar'], 1));
    quests.push(createQuest(['Dog', 'Snake'], 0));

    return quests;
}

function createQuest(opts, correctOptIndex) {
    return {
        id: gNextId++,
        opts: opts,
        correctOptIndex: correctOptIndex
    }
}

function renderQuest() {

    var currQuest = document.querySelector('.questCount');
    currQuest.innerText = gCurrQuestIdx + 1;

    // render pic
    var currPicIdx = gCurrQuestIdx + 1;
    var currQuestOpts = gQuests[gCurrQuestIdx].opts;
    var img = document.querySelector('.questImg');
    img.src = 'img/' + currPicIdx + '.jpg';


    // render options
    var strHtml = '';

    for (var i = 0; i < currQuestOpts.length; i++) {
        var option = currQuestOpts[i];
        strHtml += '<li><button class="option" onclick="checkAnswer(this,' + i + ')">' + option + '</button></li>';
    }

    // DOM
    var elOptions = document.querySelector('.options-list');
    elOptions.innerHTML = strHtml;
}

function checkAnswer(elButton, optIdx) {

    var isCorrect = (gQuests[gCurrQuestIdx].correctOptIndex === optIdx);

    if (isCorrect) {
        console.log('right score: ', gScore);
        gCurrQuestIdx++;


        if (gCurrQuestIdx === gQuests.length) {
            endGame();
        } else {

            renderQuest();
            gWrongClicked = false;
        }
    } else {

        if (gWrongClicked === false) {
            gScore -= 10;
            gWrongClicked = true;
        }
        console.log('wrong. score: ', gScore);
        // elButton.classList.toggle('wrong-color');
        elButton.style.backgroundColor = 'red';
        // for one second
        setTimeout(function () {
            //  elButton.classList.toggle('wrong-color');
            elButton.style.backgroundColor = 'black';
        }, 500);
    }

}

function endGame() {
    var strHtml = '';

    strHtml += '<h1>Your Score: <span class="score">' + gScore + '</span></h1><button class="resetBtn" onclick="initGame()">Play Again</button>';

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

function updateEl(selector, strHtml) {
    var el = document.querySelector(selector);
    el.innerHTML = strHtml
}