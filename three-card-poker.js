const initialPlayerBalance = 1000;
const testWagerAmount = 1;
let playerHand = [];
let dealerHand = [];
let playerBalance = initialPlayerBalance;
let totalWagerAmount = 0;
let isRoundActive = false;
let deck = [];

class Counter {
    constructor(array) {
        array.forEach(val => this[val] = (this[val] || 0) + 1);
    }
}

const CARD_RANKS = {
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3,
    "6": 4,
    "7": 5,
    "8": 6,
    "9": 7,
    "T": 8,
    "J": 9,
    "Q": 10,
    "K": 11,
    "A": 12,
}

const WAGER_COUNTERS = {
    anteWager: 0,
    playWager: 0,
    pairPlusWager: 0,
    sixCardBonusWager: 0,
}

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
    const WAGER_TYPES = {
        ANTE: {
            elementIdPrefix: "ante",
            wagerCounter: "anteWager",
        },
        PLAY: {
            elementIdPrefix: "play",
            wagerCounter: "playWager",
        },
        PAIR_PLUS: {
            elementIdPrefix: "pp",
            wagerCounter: "pairPlusWager",
        },
        SIX_CARD_BONUS: {
            elementIdPrefix: "sixcb",
            wagerCounter: "sixCardBonusWager",
        },
    };
    WAGER_COUNTERS[WAGER_TYPES[wagerType].wagerCounter] += wagerAmount;
    $(`#${WAGER_TYPES[wagerType].elementIdPrefix}-bet-chipstack`).css("visibility", "visible");
    $(`#${WAGER_TYPES[wagerType].elementIdPrefix}-chiptally`).css("visibility", "visible");
    $(`#${WAGER_TYPES[wagerType].elementIdPrefix}-chiptally`).html(`$${WAGER_COUNTERS[WAGER_TYPES[wagerType].wagerCounter]}`);
}

function dealToPlayer() {
    if (WAGER_COUNTERS.anteWager === 0 || isRoundActive) {
        return;
    }
    isRoundActive = true;
    deck = getShuffledDeck();
    playerHand = deck.slice(0, 3);
    displayHand(playerHand, "player");
}

function reset() {
    isRoundActive = false;
    WAGER_COUNTERS.anteWager = 0;
    WAGER_COUNTERS.pairPlusWager = 0;
    WAGER_COUNTERS.sixCardBonusWager = 0;
}

function didPlayerWinHighCardTieBreaker(pHand, dHand) {
    const playerCardRanks = pHand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => b - a);
    const dealerCardRanks = dHand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => b - a);
    for (let i = 0; i < playerCardRanks.length; i++) {
        if (playerCardRanks[i] > dealerCardRanks[i]) {
            return true;
        }
        if (playerCardRanks[i] < dealerCardRanks[i]) {
            return false;
        }
    }
    return false;
}

function isTheHandAPair(hand) {
    return new Set(hand.map(card => card.charAt(0))).size === 2;
}

function isTheHandAFlush(hand) {
    return new Set(hand.map(card => card.charAt(1))).size === 1;
}

function _isTheHandAWheelStraight(hand) {
    const orderedRanks = hand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => a - b);
    return orderedRanks.includes(0) && orderedRanks.includes(1) && orderedRanks.includes(12);
}

function isTheHandAStraight(hand) {
    const orderedRanks = hand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => a - b);
    if (_isTheHandAWheelStraight(hand)) {
        return true;
    }
    return orderedRanks[1] === orderedRanks[0] + 1 && orderedRanks[2] === orderedRanks[1] + 1;
}

function isTheHandAThreeOfAKind(hand) {
    return new Set(hand.map(card => card.charAt(0))).size === 1;
}

function didPlayerHaveBetterHand(pHand, dHand) {
    if (isTheHandAThreeOfAKind(pHand) && !isTheHandAThreeOfAKind(dHand)) {
        return true;
    }
    if (!isTheHandAThreeOfAKind(pHand) && isTheHandAThreeOfAKind(dHand)) {
        return false;
    }
    if (isTheHandAStraight(pHand) && !isTheHandAStraight(dHand)) {
        return true;
    }
    if (!isTheHandAStraight(pHand) && isTheHandAStraight(dHand)) {
        return false;
    }
    if (isTheHandAStraight(pHand) && isTheHandAStraight(dHand)) {
        if (!_isTheHandAWheelStraight(pHand) && _isTheHandAWheelStraight(dHand)) {
            return true;
        }
        if (_isTheHandAWheelStraight(pHand) && !_isTheHandAWheelStraight(dHand) || _isTheHandAWheelStraight(pHand) && _isTheHandAWheelStraight(dHand)) {
            return false;
        }
    }
    if (isTheHandAFlush(pHand) && !isTheHandAFlush(dHand)) {
        return true;
    }
    if (!isTheHandAFlush(pHand) && isTheHandAFlush(dHand)) {
        return false;
    }
    if (isTheHandAFlush(pHand) && isTheHandAFlush(dHand)) {
        return didPlayerWinHighCardTieBreaker(pHand, dHand);
    }
    if (isTheHandAPair(pHand) && !isTheHandAPair(dHand)) {
        return true;
    }
    if (!isTheHandAPair(pHand) && isTheHandAPair(dHand)) {
        return false;
    }
    if (isTheHandAPair(pHand) && isTheHandAPair(dHand)) {
        const playerPair = CARD_RANKS[Object.entries(new Counter(pHand.map(card => card.charAt(0)))).filter(rank => rank[1] === 2).toString(10)[0]];
        const dealerPair = CARD_RANKS[Object.entries(new Counter(dHand.map(card => card.charAt(0)))).filter(rank => rank[1] === 2).toString(10)[0]];
        if (playerPair > dealerPair) {
            return true;
        }
        if (playerPair < dealerPair) {
            return false;
        }
    }
    return didPlayerWinHighCardTieBreaker(pHand, dHand);
}

function playGame() {
    if (!isRoundActive) {
        return;
    }
    placeWager(WAGER_COUNTERS.anteWager, "PLAY");
    $("#player-balance").html(`$${playerBalance}`);
    dealerHand = deck.slice(3, 6);
    displayHand(dealerHand, "dealer");
    const didPlayerWin = didPlayerHaveBetterHand(playerHand, dealerHand);
    const winnerMessage = didPlayerWin ? "Player wins!" : "Dealer wins.";
    $("#infoBox").html(winnerMessage);
    reset();
}

function fold() {
    if (!isRoundActive) {
        return;
    }
    dealerHand = deck.slice(3, 6);
    displayHand(dealerHand, "dealer");
    $("#anteWager").html(WAGER_COUNTERS.anteWager);
    $("#pairPlusWager").html(WAGER_COUNTERS.pairPlusWager);
    $("#sixCardBonusWager").html(WAGER_COUNTERS.sixCardBonusWager);
    $("#infoBox").html("You folded.");
    reset();
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
    const CLICK_BEHAVIORS = {
        "#ante-diamond": "ANTE",
        "#pair-plus-wager-circle": "PAIR_PLUS",
        "#six-card-wager-circle": "SIX_CARD_BONUS",
    };
    Object.keys(CLICK_BEHAVIORS).forEach(elementId => {
        $(elementId).click(function () {
            if (isRoundActive) {
                return;
            }
            placeWager(_getSelectedWagerAmount(), CLICK_BEHAVIORS[elementId]);
        });
    });
    $("#player-balance-display").html(`$${playerBalance}`);
    $("#total-wager-display").html(`$${totalWagerAmount}`);
    $("#deal-button").click(() => dealToPlayer());
    $("#play-button").click(() => playGame());
    $("#fold-button").click(() => fold());
}

// TESTS

console.log(didPlayerHaveBetterHand(["TD", "JS", "9C"], ["6C", "6H", "6S"]) === false); // player has straight, dealer has trips
console.log(didPlayerHaveBetterHand(["4D", "4S", "4C"], ["6C", "7H", "8S"]) === true); // dealer has straight, player has trips
console.log(didPlayerHaveBetterHand(["8D", "8S", "8C"], ["7C", "7H", "7S"]) === true); // both have trips, player's is higher
console.log(didPlayerHaveBetterHand(["JD", "JS", "JC"], ["QC", "QH", "QS"]) === false); // both have trips, dealer's is higher
console.log(didPlayerHaveBetterHand(["TD", "JS", "9C"], ["KC", "6H", "9S"]) === true); // player has mid straight, dealer does not
console.log(didPlayerHaveBetterHand(["3D", "AS", "9C"], ["7C", "8H", "9S"]) === false); // dealer has mid straight, player does not
console.log(didPlayerHaveBetterHand(["3D", "2S", "AC"], ["KC", "6H", "9S"]) === true); // player has wheel straight, dealer has none
console.log(didPlayerHaveBetterHand(["3D", "2S", "AC"], ["8C", "7H", "9S"]) === false); // player has wheel straight, dealer has mid straight
console.log(didPlayerHaveBetterHand(["8C", "TH", "9S"], ["3D", "2S", "AC"]) === true); // player has mid straight, dealer has wheel straight
console.log(didPlayerHaveBetterHand(["4D", "JS", "9C"], ["3C", "AD", "2S"]) === false); // dealer has wheel straight, player has none
console.log(didPlayerHaveBetterHand(["AD", "KS", "QC"], ["8C", "TH", "9S"]) === true); // both have straights, player's is higher
console.log(didPlayerHaveBetterHand(["TD", "JS", "9C"], ["KC", "JH", "QS"]) === false); // both have straights, dealer's is higher
console.log(didPlayerHaveBetterHand(["3C", "7C", "9C"], ["4C", "TH", "2S"]) === true); // player has flush, dealer does not
console.log(didPlayerHaveBetterHand(["7C", "7S", "9D"], ["4H", "TH", "2H"]) === false); // dealer has flush, player does not
console.log(didPlayerHaveBetterHand(["JC", "7C", "9C"], ["4H", "TH", "2H"]) === true); // player has higher flush than dealer
console.log(didPlayerHaveBetterHand(["3C", "7C", "9C"], ["4H", "TH", "2H"]) === false); // dealer has higher flush than player
console.log(didPlayerHaveBetterHand(["3C", "7C", "9C"], ["3H", "7H", "9H"]) === false); // both have tied flush, player has better high card
console.log(didPlayerHaveBetterHand(["3C", "7H", "9S"], ["4C", "TH", "2S"]) === false); //dealer has highest card
console.log(didPlayerHaveBetterHand(["3C", "QH", "9S"], ["4C", "TH", "2S"]) === true); //player has highest card
console.log(didPlayerHaveBetterHand(["TC", "4H", "2D"], ["4C", "TH", "2S"]) === false); //both have equal cards
console.log(didPlayerHaveBetterHand(["3C", "7H", "9S"], ["4C", "8H", "8S"]) === false); // dealer has pair, player has highest card
console.log(didPlayerHaveBetterHand(["3C", "3H", "9S"], ["4C", "TH", "2S"]) === true); // player has pair, dealer has highest card
console.log(didPlayerHaveBetterHand(["2C", "4H", "4D"], ["4C", "4S", "7S"]) === false); // both have equal pairs, dealer has high card outside of pair
console.log(didPlayerHaveBetterHand(["7C", "4H", "4D"], ["4C", "4S", "2S"]) === true); // both have equal pairs, player has high card outside of pair
console.log(didPlayerHaveBetterHand(["TC", "4H", "4D"], ["4C", "4S", "TS"]) === false); // both have equal pairs, equal high cards
console.log(didPlayerHaveBetterHand(["7C", "3H", "3D"], ["8C", "2D", "2S"]) === true); // both have pairs, player's pair is higher
console.log(didPlayerHaveBetterHand(["8C", "2D", "2S"], ["7C", "3H", "3D"]) === false); // both have pairs, dealer's pair is higher