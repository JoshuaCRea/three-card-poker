const initialPlayerBalance = 1000;
const testWagerAmount = 1;
let playerHand = [];
let dealerHand = [];
let playerBalance = initialPlayerBalance;
let totalWagerAmount = 0;
let isRoundActive = false;
let deck = [];

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

function didPlayerWinHighCardTieBreaker() {
    const playerCardRanks = playerHand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => a - b);
    const dealerCardRanks = dealerHand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => a - b);
    const orderToCheck = [2, 1, 0];
    for (let i of orderToCheck) {
        if (playerCardRanks[i] > dealerCardRanks[i]) {
            return true;
        }
        if (playerCardRanks[i] < dealerCardRanks[i]) {
            return false;
        }
    }
    return false;
}

function playGame() {
    if (!isRoundActive) {
        return;
    }
    placeWager(WAGER_COUNTERS.anteWager, "PLAY");
    $("#player-balance").html(`$${playerBalance}`);
    dealerHand = deck.slice(3, 6);
    displayHand(dealerHand, "dealer");
    const didPlayerWin = didPlayerWinHighCardTieBreaker();
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