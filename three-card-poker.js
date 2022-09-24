const initialPlayerBalance = 1000;
const testWagerAmount = 1;
let playerBalance = initialPlayerBalance;
let totalWagerAmount = 0;
let anteWager = 0;
let playWager = 0;
let pairPlusWager = 0;
let sixCardBonusWager = 0;

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

window.onload = () => {
    $("#ante-diamond").click(function () {
        placeWager(_getSelectedWagerAmount(), "ANTE");
    });
    $("#pair-plus-wager-circle").click(function () {
        placeWager(_getSelectedWagerAmount(), "PAIR_PLUS");
    });
    $("#six-card-wager-circle").click(function () {
        placeWager(_getSelectedWagerAmount(), "SIX_CARD_BONUS");
    });
    $("#player-balance-display").html(`$${playerBalance}`);
    $("#total-wager-display").html(`$${totalWagerAmount}`);
}