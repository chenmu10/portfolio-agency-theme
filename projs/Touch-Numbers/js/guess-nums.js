'use strict';

var randNum = getRandomIntInclusive(1, 5);

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function startGame() {
    var userGuess = +prompt('Enter your guess:');
    var res;
    
    if (userGuess === randNum) {
        res = userGuess + ' is Correct!';
    } else {
        res = (userGuess > randNum) ?
            userGuess + ' is too high.' :
            userGuess + ' is too low.';
    }

    document.querySelector('.feedback').innerHTML = res;

}