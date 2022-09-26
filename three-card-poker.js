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
    const WAGER_TYPES = {
        ANTE: {
            incrementWager: () => anteWager += wagerAmount,
            elementIdPrefix: "ante",
            getWagerCounter: () => anteWager,
        },
        PLAY: {
            incrementWager: () => playWager += wagerAmount,
            elementIdPrefix: "play",
            getWagerCounter: () => playWager,
        },
        PAIR_PLUS: {
            incrementWager: () => pairPlusWager += wagerAmount,
            elementIdPrefix: "pp",
            getWagerCounter: () => pairPlusWager,
        },
        SIX_CARD_BONUS: {
            incrementWager: () => sixCardBonusWager += wagerAmount,
            elementIdPrefix: "sixcb",
            getWagerCounter: () => sixCardBonusWager,
        },
    };
    WAGER_TYPES[wagerType].incrementWager();
    $(`#${WAGER_TYPES[wagerType].elementIdPrefix}-bet-chipstack`).css("visibility", "visible");
    $(`#${WAGER_TYPES[wagerType].elementIdPrefix}-chiptally`).css("visibility", "visible");
    $(`#${WAGER_TYPES[wagerType].elementIdPrefix}-chiptally`).html(`$${WAGER_TYPES[wagerType].getWagerCounter()}`);
}

function dealToPlayer() {
    if (anteWager === 0 || isRoundActive || playWager !== 0) {
        return;
    }
    isRoundActive = true;
    deck = getShuffledDeck();
    const playerHand = deck.slice(0, 3);
    displayHand(playerHand, "player");
}

function playGame() {
    if (!isRoundActive) {
        return;
    }
    placeWager(anteWager, "PLAY");
    $("#player-balance").html(`$${playerBalance}`);
    isRoundActive = false;
    const dealerHand = deck.slice(3, 6);
    displayHand(dealerHand, "dealer");
}

function fold() {
    if (!isRoundActive || playWager !== 0) {
        return;
    }
    isRoundActive = false;
    const dealerHand = deck.slice(3, 6);
    displayHand(dealerHand, "dealer");
    anteWager === 0;
    pairPlusWager === 0;
    sixCardBonusWager === 0;
    $("#anteWager").html(anteWager);
    $("#pairPlusWager").html(pairPlusWager);
    $("#sixCardBonusWager").html(sixCardBonusWager);
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