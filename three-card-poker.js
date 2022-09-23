const initialPlayerBalance = 1000;
const testWagerAmount = 1;
let playerBalance = initialPlayerBalance;
let anteWager = 0;
let playWager = 0;
let pairPlusWager = 0;
let sixCardBonusWager = 0;

function placeWager(wagerAmount, wagerType) {
    playerBalance -= wagerAmount;
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

function _defineClickBehaviorOfAnteDiamond() {
    $("#ante-diamond").click(function () {
        placeWager(testWagerAmount, "ANTE");
    });
};

function _defineClickBehaviorOfPairPlusCircle() {
    $("#pair-plus-wager-circle").click(function () {
        placeWager(testWagerAmount, "PAIR_PLUS");
    });
};

function _defineClickBehaviorOfSixCardBonusCircle() {
    $("#six-card-wager-circle").click(function () {
        placeWager(testWagerAmount, "SIX_CARD_BONUS");
    });
};

window.onload = () => {
    _defineClickBehaviorOfAnteDiamond();
    _defineClickBehaviorOfPairPlusCircle();
    _defineClickBehaviorOfSixCardBonusCircle();
}