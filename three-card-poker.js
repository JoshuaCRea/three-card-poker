const initialPlayerBalance = 1000;
const testWagerAmount = 1;
let playerBalance = initialPlayerBalance;
let totalWagerAmount = 0;
let anteWager = 0;
let playWager = 0;
let pairPlusWager = 0;
let sixCardBonusWager = 0;
let isRoundActive = false;
let deck = [];

function _getSelectedWagerAmount() {
    const radioButtons = document.getElementsByName("wager-amount");
    const wagerValue = parseInt(Array.from(radioButtons).find((x) => x.checked).value, 10);
    return wagerValue;
}

function placeWager(wagerAmount, wagerType) {
    playerBalance -= wagerAmount;
    totalWagerAmount += wagerAmount;
    $("#player-balance-display").html(`$${playerBalance}`);
    $("#total-wager-display").html(`$${totalWagerAmount}`);
    if (wagerType === "ANTE") {
        anteWager += wagerAmount;
        $("#ante-bet-chipstack").css("visibility", "visible");
        $("#ante-chiptally").html(`$${anteWager}`);
        $("#ante-chiptally").css("visibility", "visible");
    }
    if (wagerType === "PLAY") {
        playWager += wagerAmount;
        $("#play-bet-chipstack").css("visibility", "visible");
        $("#play-chiptally").html(`$${playWager}`);
        $("#play-chiptally").css("visibility", "visible");
    }
    if (wagerType === "PAIR_PLUS") {
        pairPlusWager += wagerAmount;
        $("#pp-bet-chipstack").css("visibility", "visible");
        $("#pp-chiptally").html(`$${pairPlusWager}`);
        $("#pp-chiptally").css("visibility", "visible");
    }
    if (wagerType === "SIX_CARD_BONUS") {
        sixCardBonusWager += wagerAmount;
        $("#sixcb-bet-chipstack").css("visibility", "visible");
        $("#sixcb-chiptally").html(`$${sixCardBonusWager}`);
        $("#sixcb-chiptally").css("visibility", "visible");
    }
}

function dealToPlayer() {
    if (anteWager === 0 || isRoundActive) {
        return;
    }
    isRoundActive = true;
    deck = getShuffledDeck();
    const playerHand = deck.slice(0, 3);
    displayHand(playerHand, "player");
}

function displayHand(hand, person) {
    const handDisplay = hand.map(card => `<img class='card' src='cards/${card}.svg'></img>`);
    $(`#${person}-card-display`).html(handDisplay);
}

function getShuffledDeck() {
    const newDeck = [
        '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', 'TC', 'JC', 'QC', 'KC', 'AC',
        '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', 'TH', 'JH', 'QH', 'KH', 'AH',
        '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', 'TS', 'JS', 'QS', 'KS', 'AS',
        '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', 'TD', 'JD', 'QD', 'KD', 'AD'
    ];
    for (let i = 0; i < newDeck.length; i++) {
        const tempCard = newDeck[i];
        const randomIndex = Math.floor(Math.random() * newDeck.length);
        newDeck[i] = newDeck[randomIndex];
        newDeck[randomIndex] = tempCard;
    }
    return newDeck;
}

window.onload = () => {
    $("#ante-diamond").click(function () {
        if (isRoundActive) {
            return;
        }
        placeWager(_getSelectedWagerAmount(), "ANTE");
    });
    $("#pair-plus-wager-circle").click(function () {
        if (isRoundActive) {
            return;
        }
        placeWager(_getSelectedWagerAmount(), "PAIR_PLUS");
    });
    $("#six-card-wager-circle").click(function () {
        if (isRoundActive) {
            return;
        }
        placeWager(_getSelectedWagerAmount(), "SIX_CARD_BONUS");
    });
    $("#player-balance-display").html(`$${playerBalance}`);
    $("#total-wager-display").html(`$${totalWagerAmount}`);
    $("#deal-button").click(() => dealToPlayer());
}