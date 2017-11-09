var BlackjackGame = require('../models/Blackjack');

var game = new BlackjackGame();

// var testHands = [
//     ['A','K'], //21
//     ['A', 'A'],  //12
//     ['K', 'Q'], //20
//     ['A', 'A', '3'], //15
//     ['3', '4', '5'], //12
//     ['A', '2', '3', '4', '5'] //15
// ]

// for (hand in testHands){
//     var cards = testHands[hand];
//     var value = game.handValue(cards);
//     var containsAce = game.containsAce(cards);
//     console.log("Hand: " + cards + " Value: " + value + " Contains Ace: " + containsAce);
// }

console.log(game.hands[0]);
console.log(game.handValue(game.hands[0]));
game.playOutDealerHand();
console.log(game.hands[1]);
console.log(game.handValue(game.hands[1]));
console.log(game.currentPlayer +" is the currentPlayer");

