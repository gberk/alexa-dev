var Deck = require('./Deck');

class BlackjackGame{


    constructor(){
        this.startNewGame();
    }

    startNewGame(){

        this.deck = (new Deck()).shuffle();
        this.numPlayers = 1; //Don't count the dealer
        this.hands = [];
        this.hands[0] = this.deck.deal(2); //player hand
        this.hands[1] = this.deck.deal(); //dealer hand
        this.faceDownDealerCard = this.deck.deal();
        this.currentPlayer = 0;
        this.result = null;

        //Does player have blackjack?
        if(this.handValue(this.hands[0]) == 21){
            console.log("Player has blackjack");
            this.result = "Player has blackjack";
            return; //ignore tie for now
        }
        //Does the dealer have blackjack?
        var futureDealerHand = this.hands[1].concat(this.faceDownDealerCard);
        if(this.handValue(futureDealerHand) == 21){
            console.log("Dealer has blackjack");
            this.result = "Dealer has blackjack";
            return; //ignore tie for now
        }

        var response = 
        {
            dealerHand: this.hands[1].concat(this.faceDownDealerCard),
            playerHand: this.hands[0]
        };

        return response;

    }

    //Game methods
    hit(){
        if(!valid(playerNum,'hit'))
            throw new Error("Invalid Blackjack action"); //do better errors
        else{
            this.hands[0].push(this.deck.deal()[0]);
            if(this.handValue(this.hands[0]) == 21){
                this.currentPlayer++;
                this.playOutDealerHand();
            }
        }
    }

    stand(playerNum){
        if(!valid(playerNum,'stand'))
            throw new Error("Invalid Blackjack action"); //do better errors
        else{
            this.currentPlayer++;
            this.playOutDealerHand();
        }
    }

    //Game state methods
    valid(player, action){

    }

    playOutDealerHand(){
        this.hands[1].push(this.faceDownDealerCard[0]);
        while(this.handValue(this.hands[1]) <=16 ){
            this.hands[1].push(this.deck.deal()[0]);
        }
        if((this.handValue(this.hands[0]) > 21 && this.handValue(this.hands[1]) > 21)){
            this.result = "Push - both busted";
        }

        return;

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