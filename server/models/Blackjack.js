var Deck = require('./Deck');

class BlackjackGame{


    constructor(){
        //this.startNewGame();
    }

    buildHands(hands) {

        var response = 
        {
            dealerHand: hands[1],
            dealerValue: this.handValue(hands[1]),
            playerHand: hands[0],
            playerValue: this.handValue(hands[0]),
            gameStatus: this.gameStatus

        };

        return response;

    }

    checkBlackjack(hands) {
        //console.log("checking for blackjack...");

        var futureDealerHand = hands[1].concat(this.faceDownDealerCard);

        // Did player bust?
        if (this.handValue(hands[0]) > 21) {
            console.log("Player has busted...");
            this.gameStatus = "Dealer";
            return hands;
        }

        // Did dealer bust?
        if (this.handValue(hands[1]) > 21) {
            console.log("Dealer has busted...");
            this.gameStatus = "Player";
            return hands;
        }

        // Does player have blackjack?
        if (this.handValue(hands[0]) == 21) {
            console.log("Player has blackjack...");
            if (this.turn == 1) {
                this.gameStatus = "Player";
                return hands;
            } else {
                this.playOutDealerHand();
                if (this.handValue(hands[1]) == 21) {
                    this.gameStatus = "Push";
                    return hands;
                } else {
                    this.gameStatus = "Player";
                    return hands;
                }
            }
        }
        // Does the dealer have blackjack?
        if(this.handValue(futureDealerHand) == 21){
            console.log("Dealer has blackjack...");
            this.gameStatus = "Dealer";
            return hands;
        }
        return hands;
    }

    playOutDealerHand(){
        console.log("Playing out dealer hand...");
        this.hands[1].push(this.faceDownDealerCard[0]);
        while(this.handValue(this.hands[1]) <=16 ){
            this.hands[1].push(this.deck.deal()[0]);
        }
    }

    startNewGame(){

        this.deck = (new Deck()).shuffle();
        this.numPlayers = 1; //Don't count the dealer
        this.hands = [];
        this.hands[0] = this.deck.deal(2); //player hand
        this.hands[1] = this.deck.deal(); //dealer hand
        this.faceDownDealerCard = this.deck.deal();
        this.currentPlayer = 0;
        this.turn = 1;
        this.gameStatus = "InProgress";

        return this.buildHands(this.checkBlackjack(this.hands));

    }

    //Game methods
    hit(){
        this.turn++;
        this.hands[0].push(this.deck.deal()[0]);
        return this.buildHands(this.checkBlackjack(this.hands));
        // if(!valid(playerNum,'hit'))
        //     throw new Error("Invalid Blackjack action"); //do better errors
        // else{
            
        // }
    }

    stand(){
        this.turn++;
        this.playOutDealerHand();
        
        var finalPlayerScore = this.handValue(this.hands[0]);
        var finalDealerScore = this.handValue(this.hands[1]);

        if (finalPlayerScore == finalDealerScore) {
            this.gameStatus = "Push";
        }

        if (finalPlayerScore > finalDealerScore) {
            this.gameStatus = "Player";
        } else {
            this.gameStatus = "Dealer";
        }

        return this.buildHands(this.checkBlackjack(this.hands));
        // if(!valid(playerNum,'stand'))
        //     throw new Error("Invalid Blackjack action"); //do better errors
        // else{
        //     this.currentPlayer++;
        // }
    }

    //Game state methods
    valid(player, action){

    }



    goToNextPlayer(){

        //if nextPlayer == dealer 
    }

    //Helper methods

    handValue(hand){
        var value = this.handMinValue(hand);
        if(value > 21){
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
        else if(cardinal == 'A')
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