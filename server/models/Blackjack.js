var Deck = require('./Deck');

class BlackjackGame{

    constructor(){
        this.deck = (new Deck()).shuffle();
        this.numPlayers = 1; //Don't count the dealer
        this.hands = [];
        this.hands[0] = this.deck.deal(2);
        this.hands[1] = this.deck.deal(1);
        this.currentPlayer = 0;

        // if(value(hands[0]) == 21) console.log("Player Blackjack");
        // if()
    }

    //Game methods
    hit(playerNum){
        if(!valid(playerNum,'hit'))
            throw new Error("Invalid Blackjack action"); //do better errors
        else{

        }
    }

    stand(playerNum){
        if(!valid(playerNum,'stand'))
            throw new Error("Invalid Blackjack action"); //do better errors
        else{
        }
    }

    //Game state methods
    valid(player, action){

    }

    playOutDealerHand(){

    }

    //Helper methods

    handValue(hand){
        var value = this.handMinValue(hand);
        if(value > 21){
            console.log("bust");
            this.currentPlayer ++;
            return value;
        }
        else if (this.containsAce(hand)){
            if((value + 10) <= 21){
                if(value + 10 == 21)
                    this.currentPlayer++;
                return value + 10;
            }  
        }
        return value;
    }

    handMinValue(hand){
        var value = 0;
        for(const i in hand)
            value += this.cardValue(hand[i]);
        return value;
    }

    cardValue(card){
        var cardinal = card[0];
        if(Number.parseInt(card))
            return Number.parseInt(card);
        else if(card == 'A')
            return 1;
        else
            return 10;
    }

    containsAce(hand){
        for (const i in hand)
            if(this.cardValue(hand[i]) == 1)
                return true;

        return false;
    }
}

module.exports = BlackjackGame;