var betErrorCodes = {
    FATAL_ERROR: -1,
    SESSION_NOT_FOUND: -2,
    INVALID_AMOUNT: -3,
    INSUFFICIENT_FUNDS: -4
};
var currentGameState = "";
var currentStakes = {}, settings = {}, winners = [], gameData = [];

var cardsValues = [
    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10
];
var cards = [
    "AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
    "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD",
    "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH",
    "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS"
];
var gUserCards = [], gDealerCards = [], Bets = {}, duplicatCards = [];
var history = [], videoRng, part1Files;
var shuffledMaps = {}, finalShuffledMaps = {};

function introVideo(gameId) {
    part1Files = context.mediaHelper.vodData.length_map["Part01"];
    var p1Index = videoRng.random(1, Object.keys(part1Files).length - 1);
    if (parseInt(p1Index, 10) <= 9) {
        p1Index = "0" + p1Index;
    }
    part01Video = "Part01/Wide%20" + p1Index;
    context.mediaHelper.playVOD(gameId, [{ name: part01Video, wait_previous: 3, loop: true }]);
}

function addIntroVideo(gameId, arr) {
    var p1Index = videoRng.random(1, Object.keys(part1Files).length - 1);
    if (parseInt(p1Index, 10) <= 9) {
        p1Index = "0" + p1Index;
    }
    part01Video = "Part01/Wide%20" + p1Index;
    arr.push({ name: part01Video, loop: true });
}

function game_initialize() {
    var gameConfiguration = {};
    videoRng = context.rng.createNew();
    gameConfiguration = context.gameConfiguration;
    if (gameConfiguration.Limits.length == 0) {
        throw "LIMIT_NOT_FOUND";
    }
     
    settings = context.loadSettings();
    if (isEmpty(settings)) {
        settings = { gameState: -1, history: [], roundId: context.roundCounter.current, startDate: null, endDate: null };
    }
    if (context.gameConfiguration.Mode === "Manual") {
        runtime.isProvablyFair = true;
    }
    runtime.isMultiplayer = false;
    runtime.gameTimeoutInSeconds = 0;
    currentGameState = settings.gameState;
    runtime.onServerMessage = OnServerMessage;
    context.debug("Game server initialized!");
}

function OnServerMessage(message) {
    if (message && message.type) {
        switch (message.type) {
        case "refresh_user_data":
            var user = context.getUserInfo(message.sessionId);
            notifyUser(message.sessionId, {
                type: "balance",
                message: {
                    balance: message.balance,
                    totalLost: message.totalLoss
                }
            });
            break;
        }
    }
}

function isEmpty(obj) {
    for (var k in obj)
        if (obj.hasOwnProperty(k))
            return false;
    return true;
}

function createGame(sessionId) {
    settings.roundId = context.roundCounter.increase();
    runtime.setGameState(sessionId, "OPENED", "Opened round: " + settings.roundId);
    Bets[sessionId] = [];
    gameData[sessionId] = {};
    shuffledMaps[sessionId] = getRng(sessionId).shuffle(cards);
}

function clearUserData(sessionId) {
    if (sessionId !== undefined) {
        delete shuffledMaps[sessionId];
        delete finalShuffledMaps[sessionId];
        Bets[sessionId] = [];
        gameData[sessionId] = {};
    }
}

function numRound(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

function getCard(gameId) {
    var card = finalShuffledMaps[gameId].shift();
    return card;
}

function getAce(cards) {
    var aceCard = cards.filter(function(card) {
        return cardsValues[cards.indexOf(card)] === 11;
    });
    var index = aceCard.length > 0 ? cards.indexOf(aceCard[0]) : -1;
    return index;
}

function completeBets(sessionId) {
    var user = context.getUserInfo(sessionId);
    try {
        var completeResultCode = context.accountingHelper.completeBets(sessionId, settings.roundId, function() {
        }, function() {
            notifyUser(sessionId, {
                type: "error",
                message: "Complete bets failed.",
                balance: user.balance
            });
            context.logError("Complete bets failed.");
        });
        switch (completeResultCode) {
        case betErrorCodes.FATAL_ERROR:
            {
                throw "FATAL_ERROR";
            }
            break;
        case betErrorCodes.INVALID_AMOUNT:
            {
                throw "INVALID_AMOUNT";
            }
            break;
        case betErrorCodes.SESSION_NOT_FOUND:
            {
                throw "SESSION_NOT_FOUND";
            }
            break;
        }
    } catch (err) {
        notifyUser(sessionId, {
            type: "error",
            message: err
        });
        context.logError("Complete bets failed.");
        context.logError(err);
    }
}

function calculateCardspoints(data) {
    var points = 0;
    for (var i = 0; i < data.length; i++) {
        points += cardsValues[cards.indexOf(data[i])];
    }
    if (points > 21) {
        for (var i = 0; i < data.length; i++) {
            if (cardsValues[cards.indexOf(data[i])] == 11 && points > 21)
                points -= 10;
        }
    }
    context.log(data);
    context.log(points);
    return points;
}

function calculateWinAmount(sessionId) {
    var winAmount = 0;
    completeBets(sessionId);
    for (var h = 0; h < gameData[sessionId]["user"].length; h++) {
        var handData = gameData[sessionId]["user"][h];
        for (var i = 0; i < Bets[sessionId].length; i++) {
            var state = "lose";
            if (Bets[sessionId][i].type == "bet" && Bets[sessionId][i].hand == h) {
                winAmount = 0;
                if (gameData[sessionId]["dealer"]["points"] > 21 && handData["points"] <= 21) {
                    winAmount = Bets[sessionId][i].amount + Bets[sessionId][i].amount;
                    state = "win";
                } else if ((handData["points"] === gameData[sessionId]["dealer"]["points"] && handData["points"]<=21) || (gameData[sessionId]["dealer"]["points"] > 21 && handData["points"] > 21)) {
                    winAmount = Bets[sessionId][i].amount;
                    state = "push";
                } else if (handData["points"] == 21 && handData["cards"].length == 2) {
                    winAmount = Bets[sessionId][i].amount + Bets[sessionId][i].amount * 1.5;
                    state = "blackjack";
                } else if (handData["points"] > gameData[sessionId]["dealer"]["points"] && handData["points"] <= 21 && gameData[sessionId]["dealer"]["points"]!=21) {
                    winAmount = Bets[sessionId][i].amount + Bets[sessionId][i].amount;
                    state = "win";
                }
                if (winAmount > 0) {
                    try {
                        var resultCode = context.accountingHelper.registerWin(sessionId, settings.roundId, Bets[sessionId][i].roundBetId, winAmount, Bets[sessionId][i], "Win bet at round " + settings.roundId,
                            function (sessionId, betObj, amount) {
                                notifyUser(sessionId, {
                                    type: "status",
                                    message: {
                                        state: betObj.amount == amount ? "push" : "win",
                                        round_id: settings.roundId,
                                        winAmount: amount,
                                        hand: betObj.hand,
                                        betData: betObj
                                    }
                                });

                            }, function(sessionId) {
                                context.logError("Register win failed");
                                notifyUser(sessionId, {
                                    type: "error",
                                    message: "REGISTER_WIN_ERROR"
                                });
                            });
                        switch (resultCode) {
                        case betErrorCodes.FATAL_ERROR:
                            {
                                throw "FATAL_ERROR";
                            }
                            break;
                        case betErrorCodes.INVALID_AMOUNT:
                            {
                                throw "INVALID_AMOUNT";
                            }
                            break;
                        case betErrorCodes.SESSION_NOT_FOUND:
                            {
                                throw "SESSION_NOT_FOUND";
                            }
                            break;
                        }
                    } catch (e) {
                        context.log("Find winners error:");
                        context.logError(e);
                        notifyUser(sessionId, {
                            type: "error",
                            message: {
                                winsum: winAmount,
                                error: "REGISTER_WIN_ERROR",
                            }
                        });
                    }
                } else {
                    notifyUser(sessionId, {
                        type: "status",
                        message: {
                            state: state,
                            round_id: settings.roundId,
                            hand: h,
                            betData: Bets[sessionId][i]
                        }
                    });
                }
            }
        }
    }
    context.accountingHelper.finishRound(settings.roundId);
    settings.roundId = context.roundCounter.increase();
    context.setTimeout(function() {
        clearUserData(sessionId);
        shuffledMaps[sessionId] = getRng(sessionId).shuffle(cards);
    }, 500);
    return winAmount;
}

var dispatcher = function messageDispatcher(sessionId, message) {
    var user,
        userCard,
        userCard2,
        otherOneCard,
        otherAllCards,
        userPoints = 0,
        dealerPoints = 0,
        isSuccess = true,
        getCards = true,
        position,
        filteredBet,
        filteredData,
        betData,
        cancelBet;
    var userSettings;
    var gameId, videoOfCards = [], timerVideoOfCards = [], counter = 0;
    var cancelResult, resultCode;

    context.debug("messageDispatcher...");
    context.debug("type:" + message.type + " currentState: " + currentGameState + " sessionId: " + sessionId + " roundId: " + settings.roundId);
    user = context.getUserInfo(sessionId);
    if (!user) {
        return null;
    }
    gameId = sessionId;
    if (!settings.roundId) {
        settings.roundId = context.roundCounter.current;
    }
    switch (message.type) {
    case "get_limits":
        return { success: true, limits: context.gameConfiguration.Limits };
    case "put_limits":
        userSettings = context.loadUserSettings(sessionId);
        if (!userSettings) {
            userSettings = {};
        }
        userSettings.limit = message.limit;
        context.saveUserSettings(sessionId, userSettings);
        return { success: true, limit: userSettings.limit };
    case "history":
        return { success: true, data: history };
    case "bet":
    {
        try {
            var amount = parseFloat(message.bet.amount);
            if (!gameData[sessionId]["user"]) {
                if (validateBet(sessionId, amount, message.bet.handIndex)) {
                    betData = {
                        amount: amount,
                        hand: 0,
                        type: "bet"
                    };
                    var betResult = context.accountingHelper.registerBet(sessionId, settings.roundId, betData.amount, betData, "Bet at round " + settings.roundId);
                    switch (betResult) {
                    case betErrorCodes.FATAL_ERROR:
                        {
                            throw "FATAL_ERROR";
                        }
                        break;
                    case betErrorCodes.INVALID_AMOUNT:
                        {
                            throw "INVALID_AMOUNT";
                        }
                        break;
                    case betErrorCodes.INSUFFICIENT_FUNDS:
                        {
                            throw "INSUFFICIENT_FUNDS";
                        }
                        break;
                    case betErrorCodes.SESSION_NOT_FOUND:
                        {
                            throw "SESSION_NOT_FOUND";
                        }
                        break;
                    }
                    betData.roundBetId = betResult;
                    Bets[sessionId].push(betData);
                } else {
                    throw "LIMIT_REACHED";
                }
            } else {
                context.log(gameData[sessionId]["user"]);
                throw "INCORRECT_GAME_STATE";
            }
        } catch (e) {
            isSuccess = false;
            context.logError(e);
        }
        return { success: isSuccess, balance: user.balance, betData: betData };
    }
    case "cancel_last":
    {
        try {
            if (gameData[sessionId]["dealer"] && gameData[sessionId]["dealer"]["cards"].length > 0) {
                throw "INCORRECT_GAME_STATE";
            }
            cancelBet = Bets[sessionId].slice(-1)[0];
            betData = {
                amount: cancelBet.amount,
                hand: cancelBet.hand,
                type: cancelBet.type
            };
            cancelResult = context.accountingHelper.cancelBet(sessionId, settings.roundId, cancelBet.amount, betData);
            switch (cancelResult) {
            case betErrorCodes.FATAL_ERROR:
                {
                    throw "FATAL_ERROR";
                }
                break;
            case betErrorCodes.INVALID_AMOUNT:
                {
                    throw "INVALID_AMOUNT";
                }
                break;
            case betErrorCodes.SESSION_NOT_FOUND:
                {
                    throw "SESSION_NOT_FOUND";
                }
                break;
            }
            Bets[sessionId].splice(Bets[sessionId].indexOf(cancelBet), 1);
            isSuccess = true;
        } catch (e) {
            isSuccess = false;
            context.debug(e);
        }
        return{ success: isSuccess, balance: user.balance };
    }
    case "cancel_all":
    {
        filteredBet = [];
        filteredData = [];
        try {
            if (gameData[sessionId]["dealer"] && gameData[sessionId]["dealer"]["cards"].length > 0) {
                throw "INCORRECT_GAME_STATE";
            }
            cancelResult = context.accountingHelper.cancelBetsByUser(sessionId, settings.roundId);
            switch (cancelResult) {
            case betErrorCodes.FATAL_ERROR:
                {
                    throw "FATAL_ERROR";
                }
                break;
            case betErrorCodes.INVALID_AMOUNT:
                {
                    throw "INVALID_AMOUNT";
                }
                break;
            case betErrorCodes.SESSION_NOT_FOUND:
                {
                    throw "SESSION_NOT_FOUND";
                }
                break;
            }
            Bets[sessionId] = [];
            isSuccess = true;
        } catch (e) {
            isSuccess = false;
            context.debug(e);
        }
        return { success: isSuccess, balance: user.balance };
    }
    case "stand":
    {
        if (message.handIndex <= gameData[sessionId]["user"].length - 1) {
            videoOfCards = [];
            timerVideoOfCards = [];
            otherAllCards = [];
            if (message.handIndex == gameData[sessionId]["user"].length - 1) {
                if (gameData[sessionId]["user"][message.handIndex]["points"] > 21) {
                    getCards = false;
                }

                otherOneCard = gameData[sessionId]["dealer"]["cards"][gameData[sessionId]["dealer"]["cards"].length - 1];
                videoOfCards.push({ name: "Part02/" + otherOneCard });
                var pts = cardsValues[cards.indexOf(otherOneCard)];

                gameData[sessionId]["dealer"]["count"] = gameData[sessionId]["dealer"]["cards"].length;
                otherAllCards.push(otherOneCard);

                if (getCards && gameData[sessionId]["dealer"]["points"] < 17) {
                    while (gameData[sessionId]["dealer"]["points"] < 17 && (gameData[sessionId]["dealer"]["points"] <= gameData[sessionId]["user"][0]["points"])) {
                        var newCard = getCard(gameId);
                        gameData[sessionId]["dealer"]["cards"].push(newCard);
                        videoOfCards.push({ name: "Part02/" + newCard });
                        gameData[sessionId]["dealer"]["points"] = calculateCardspoints(gameData[sessionId]["dealer"]["cards"]);
                        gameData[sessionId]["dealer"]["count"] = gameData[sessionId]["dealer"]["cards"].length;
                        otherAllCards.push(newCard);
                    }
                }
                var winTimeout = 1;
                for (var i = 0; i < videoOfCards.length; i++) {
                    winTimeout += context.mediaHelper.getVODInfo(videoOfCards[i].name).length;
                    timerVideoOfCards.push(context.mediaHelper.getVODInfo(videoOfCards[i].name).length);
                }
                addIntroVideo(gameId, videoOfCards);
                context.mediaHelper.playVOD(gameId, videoOfCards);
                context.setTimeout(function() {
                    calculateWinAmount(gameId);
                }, winTimeout * 1000);
            }
            return { success: true, dealerCards: otherAllCards, dealerTotal: gameData[sessionId]["dealer"]["points"], videoTimer: timerVideoOfCards };
        } else {
            return { success: false };
        }
    }
    case "deal":
    {
        if (Bets[sessionId].length > 0) {
            videoOfCards = [];
            timerVideoOfCards = [];
            otherAllCards = [];
            finalShuffledMaps[gameId] = getRng(gameId).finalShuffle(shuffledMaps[gameId]);
            var dealerCards = [];
            dealerCards.push(getCard(gameId));
            dealerCards.push(getCard(gameId));
            videoOfCards.push({ name: "Part02/" + dealerCards[0], wait_previous: 9 });
            dealerPoints = cardsValues[cards.indexOf(dealerCards[0])] + cardsValues[cards.indexOf(dealerCards[1])];
            gameData[sessionId]["dealer"] = {
                points: dealerPoints,
                cards: dealerCards,
                values: [cardsValues[cards.indexOf(dealerCards[0])], cardsValues[cards.indexOf(dealerCards[1])]],
                totalPoints: 0,
                count: 0
            };
            var handCards = [];
            handCards.push(getCard(gameId));
            handCards.push(getCard(gameId));
            videoOfCards.push({ name: "Part02/" + handCards[0], wait_previous: 9 });
            videoOfCards.push({ name: "Part02/" + handCards[1], wait_previous: 9 });
            userPoints = calculateCardspoints(handCards);
            gameData[sessionId]["user"] = [];
            gameData[sessionId]["user"].push({
                cards: handCards,
                points: userPoints
            });
            otherAllCards.push(dealerCards[0]);
            if (gameData[sessionId]["user"][0]["points"] == 21) {
                var secondCard = gameData[sessionId]["dealer"]["cards"][gameData[sessionId]["dealer"]["cards"].length - 1];
                videoOfCards.push({ name: "Part02/" + secondCard });
                gameData[sessionId]["dealer"]["count"] = gameData[sessionId]["dealer"]["cards"].length;
                otherAllCards.push(secondCard);
                var winTimeout = 2;
                for (var i = 0; i < videoOfCards.length; i++) {
                    winTimeout += context.mediaHelper.getVODInfo(videoOfCards[i].name).length;
                    if (context.mediaHelper.getVODInfo(videoOfCards[i].name))
                        timerVideoOfCards.push(context.mediaHelper.getVODInfo(videoOfCards[i].name).length);
                }
                context.setTimeout(function() {
                    calculateWinAmount(gameId);
                }, winTimeout * 1000);
            } else {
                for (var i = 0; i < videoOfCards.length; i++) {
                    if(context.mediaHelper.getVODInfo(videoOfCards[i].name))
                        timerVideoOfCards.push(context.mediaHelper.getVODInfo(videoOfCards[i].name).length);
                }
            }
            addIntroVideo(gameId, videoOfCards);
            context.mediaHelper.playVOD(gameId, videoOfCards);
            context.accountingHelper.registerRoundOpen(settings.roundId);
            runtime.setGameState(sessionId, "DEAL", "Deal at round: " + settings.roundId);
            return {
                success: true,
                user: { cards: handCards, points: userPoints },
                dealer: { cards: otherAllCards, points: calculateCardspoints(otherAllCards) },
                split:(cardsValues[cards.indexOf(gameData[sessionId]['user'][0]['cards'][0])] == cardsValues[cards.indexOf(gameData[sessionId]['user'][0]['cards'][1])]),
                videoTimer: timerVideoOfCards
            };
        } else {
            return {
                success: false
            };
        }
    }
    case "hit":
    {
        videoOfCards = [];
        timerVideoOfCards = [];
        otherAllCards = [];
        if (gameData[sessionId]["user"][message.handIndex]["points"] < 21) {
            otherOneCard = getCard(gameId);
            gameData[sessionId]["user"][message.handIndex]["cards"].push(otherOneCard);
            gameData[sessionId]["user"][message.handIndex]["points"] = calculateCardspoints(gameData[sessionId]["user"][message.handIndex]["cards"]); 
            videoOfCards.push({ name: "Part02/" + otherOneCard, wait_previous: 3 });
            if (message.handIndex == gameData[sessionId]["user"].length - 1) {
                if (gameData[sessionId]["user"][message.handIndex]["points"] > 21) {
                    getCards = false;
                }
                if (gameData[sessionId]["user"][message.handIndex]["points"] >= 21) {
                    var otherDealerOneCard = gameData[sessionId]["dealer"]["cards"][gameData[sessionId]["dealer"]["cards"].length - 1];
                    videoOfCards.push({ name: "Part02/" + otherDealerOneCard });
                    var pts = cardsValues[cards.indexOf(otherDealerOneCard)];

                    gameData[sessionId]["dealer"]["count"] = gameData[sessionId]["dealer"]["cards"].length;
                    otherAllCards.push(otherDealerOneCard);

                    if (getCards && gameData[sessionId]["dealer"]["points"] < 17 && (gameData[sessionId]["dealer"]["points"] <= gameData[sessionId]["user"][0]["points"])) {
                        while (gameData[sessionId]["dealer"]["points"] < 17 && (gameData[sessionId]["dealer"]["points"] <= gameData[sessionId]["user"][0]["points"])) {
                            var newCard = getCard(gameId);
                            gameData[sessionId]["dealer"]["cards"].push(newCard);
                            videoOfCards.push({ name: "Part02/" + newCard });
                            gameData[sessionId]["dealer"]["points"] = calculateCardspoints(gameData[sessionId]["dealer"]["cards"]);
                            gameData[sessionId]["dealer"]["count"] = gameData[sessionId]["dealer"]["cards"].length;
                            otherAllCards.push(newCard);
                        }
                    }

                    var winTimeout = 1;
                    for (var i = 0; i < videoOfCards.length; i++) {
                        winTimeout += context.mediaHelper.getVODInfo(videoOfCards[i].name).length;
                        timerVideoOfCards.push(context.mediaHelper.getVODInfo(videoOfCards[i].name).length);
                    }
                    context.setTimeout(function() {
                        calculateWinAmount(gameId);
                    }, winTimeout * 1000);
                }
            } else {
                for (var i = 0; i < videoOfCards.length; i++) {
                    timerVideoOfCards.push(context.mediaHelper.getVODInfo(videoOfCards[i].name).length);
                }
            }
            addIntroVideo(gameId, videoOfCards);
            context.mediaHelper.playVOD(gameId, videoOfCards);
            isSuccess = true;
        } else {
            isSuccess = false;
        }
        return { success: true, userCard: otherOneCard, userTotal: gameData[sessionId]["user"][message.handIndex]["points"], dealerCards: otherAllCards, dealerTotal: gameData[sessionId]["dealer"]["points"], videoTimer: timerVideoOfCards };
    }
    case "split":
    {
        videoOfCards = [];
        timerVideoOfCards = [];
        otherAllCards = [];
        position = parseInt(message.handIndex, 10);
        try{
        var betAmount = 0;
        if (cardsValues[cards.indexOf(gameData[sessionId]['user'][message.handIndex]['cards'][0])] == cardsValues[cards.indexOf(gameData[sessionId]['user'][message.handIndex]['cards'][1])] && gameData[sessionId]['user'].length <= 1) {
            for (var i = 0; i < Bets[sessionId].length; i++) {
                if (Bets[sessionId][i].type == "bet")
                    betAmount += Bets[sessionId][i].amount;
            }
            betAmount = parseFloat(parseFloat(betAmount).toFixed(2));

            if (betAmount <= user.balance) {
                betData = {
                    amount: betAmount,
                    hand: 1,
                    type: "bet"
                };
                var betResult = context.accountingHelper.registerBet(sessionId, settings.roundId, betData.amount, betData, "Split cards at round " + settings.roundId);
                switch (betResult) {
                case betErrorCodes.FATAL_ERROR:
                    {
                        throw "FATAL_ERROR";
                    }
                    break;
                case betErrorCodes.INVALID_AMOUNT:
                    {
                        throw "INVALID_AMOUNT";
                    }
                    break;
                case betErrorCodes.INSUFFICIENT_FUNDS:
                    {
                        throw "INSUFFICIENT_FUNDS";
                    }
                    break;
                case betErrorCodes.SESSION_NOT_FOUND:
                    {
                        throw "SESSION_NOT_FOUND";
                    }
                    break;
                }
                betData.roundBetId = betResult;
                Bets[sessionId].push(betData);
                userCard = getCard(gameId);
                userCard2 = getCard(gameId);
                videoOfCards.push({ name: "Part02/" + userCard });
                videoOfCards.push({ name: "Part02/" + userCard2 });

                gameData[sessionId]["user"][1] = {};
                gameData[sessionId]["user"][1]["cards"] = [gameData[sessionId]["user"][position]["cards"][1], userCard2];

                gameData[sessionId]["user"][0]["cards"][1] = userCard;
                for (var i = 0; i < gameData[sessionId]["user"].length; i++) {
                    gameData[sessionId]["user"][i]["points"] = calculateCardspoints(gameData[sessionId]["user"][i]["cards"]);
                }

                gameData[sessionId]["dealer"]["split"] = true;

                if (gameData[sessionId]["user"][0]["points"] >= 21 && gameData[sessionId]["user"][1]["points"] >= 21) {
                    if (gameData[sessionId]["user"][0]["points"] > 21 && gameData[sessionId]["user"][1]["points"] > 21) {
                        getCards = false;
                    }
                    var otherDealerOneCard = gameData[sessionId]["dealer"]["cards"][gameData[sessionId]["dealer"]["cards"].length - 1];
                    videoOfCards.push({ name: "Part02/" + otherDealerOneCard });
                    var pts = cardsValues[cards.indexOf(otherDealerOneCard)];

                    gameData[sessionId]["dealer"]["count"] = gameData[sessionId]["dealer"]["cards"].length;
                    otherAllCards.push(otherDealerOneCard);

                    if (getCards && gameData[sessionId]["dealer"]["points"] < 17) {
                        while (gameData[sessionId]["dealer"]["points"] < 17) {
                            var newCard = getCard(gameId);
                            gameData[sessionId]["dealer"]["cards"].push(newCard);
                            videoOfCards.push({ name: "Part02/" + newCard });
                            pts = cardsValues[cards.indexOf(newCard)];

                            gameData[sessionId]["dealer"]["values"].push(pts);
                            var totalPoints = calculateCardspoints(gameData[sessionId]["dealer"]["cards"]);
                            gameData[sessionId]["dealer"]["points"] = totalPoints;
                            gameData[sessionId]["dealer"]["count"] = gameData[sessionId]["dealer"]["cards"].length;
                            otherAllCards.push(newCard);
                        }
                    }
                    var winTimeout = 1;
                    for (var i = 0; i < videoOfCards.length; i++) {
                        winTimeout += context.mediaHelper.getVODInfo(videoOfCards[i].name).length;
                        timerVideoOfCards.push(context.mediaHelper.getVODInfo(videoOfCards[i].name).length);
                    }
                    context.setTimeout(function() {
                        calculateWinAmount(gameId);
                    }, winTimeout * 1000);
                } else {
                    for (var i = 0; i < videoOfCards.length; i++) {
                        timerVideoOfCards.push(context.mediaHelper.getVODInfo(videoOfCards[i].name).length);
                    }
                }

                addIntroVideo(gameId, videoOfCards);
                context.mediaHelper.playVOD(gameId, videoOfCards);

            } else {
                throw "INSUFFICIENT_FUNDS";
            }
            return {
                success: true,
                hands: [
                    { cards: gameData[sessionId]["user"][0]["cards"], points: gameData[sessionId]["user"][0]["points"] },
                    { cards: gameData[sessionId]["user"][1]["cards"], points: gameData[sessionId]["user"][1]["points"] }
                ],
                dealerCards: otherAllCards,
                dealerTotal: gameData[sessionId]["dealer"]["points"],
                amount: betData.amount,
                videoTimer: timerVideoOfCards
            };
        } else {
            return {
                success: false
            };
        }
           }catch(e){
                isSuccess = false;
                context.logError(e);
        }
    }
    case "double":
        {
            try {
                if (gameData[sessionId]["user"].length == 1) {
                    var amount = 0;
                    for (var i = 0; i < Bets[sessionId].length; i++) {
                        if (Bets[sessionId][i].type == "bet")
                            amount += Bets[sessionId][i].amount;
                    }
                    amount = parseFloat(parseFloat(amount).toFixed(2));
                    if (amount <= user.balance) {
                        otherAllCards = [];
                        videoOfCards = [];
                        timerVideoOfCards = [];
                        betData = {
                            amount: amount,
                            hand: message.bet.handIndex,
                            type: "bet"
                        };

                        var betResult = context.accountingHelper.registerBet(sessionId, settings.roundId, betData.amount, betData, "Bet at round " + settings.roundId);
                        switch (betResult) {
                        case betErrorCodes.FATAL_ERROR:
                            {
                                throw "FATAL_ERROR";
                            }
                            break;
                        case betErrorCodes.INVALID_AMOUNT:
                            {
                                throw "INVALID_AMOUNT";
                            }
                            break;
                        case betErrorCodes.INSUFFICIENT_FUNDS:
                            {
                                throw "INSUFFICIENT_FUNDS";
                            }
                            break;
                        case betErrorCodes.SESSION_NOT_FOUND:
                            {
                                throw "SESSION_NOT_FOUND";
                            }
                            break;
                        }
                        betData.roundBetId = betResult;
                        Bets[sessionId].push(betData);
                        if (gameData[sessionId]["user"][betData.hand]["points"] < 21) {
                            otherOneCard = getCard(gameId);
                            gameData[sessionId]["user"][betData.hand]["cards"].push(otherOneCard);
                            gameData[sessionId]["user"][betData.hand]["points"] = calculateCardspoints(gameData[sessionId]["user"][betData.hand]["cards"]);
                            videoOfCards.push({ name: "Part02/" + otherOneCard, wait_previous: 3 });

                            if (gameData[sessionId]["user"][betData.hand]["points"] > 21) {
                                getCards = false;
                            }
                            var otherDealerOneCard = gameData[sessionId]["dealer"]["cards"][gameData[sessionId]["dealer"]["cards"].length - 1];
                            videoOfCards.push({ name: "Part02/" + otherDealerOneCard });
                            var pts = cardsValues[cards.indexOf(otherDealerOneCard)];

                            gameData[sessionId]["dealer"]["count"] = gameData[sessionId]["dealer"]["cards"].length;
                            otherAllCards.push(otherDealerOneCard);

                            if (getCards && gameData[sessionId]["dealer"]["points"] < 17 && (gameData[sessionId]["dealer"]["points"] <= gameData[sessionId]["user"][0]["points"])) {
                                while (gameData[sessionId]["dealer"]["points"] < 17 && (gameData[sessionId]["dealer"]["points"] <= gameData[sessionId]["user"][0]["points"])) {
                                    var newCard = getCard(gameId);
                                    gameData[sessionId]["dealer"]["cards"].push(newCard);
                                    videoOfCards.push({ name: "Part02/" + newCard });
                                    gameData[sessionId]["dealer"]["points"] = calculateCardspoints(gameData[sessionId]["dealer"]["cards"]);
                                    gameData[sessionId]["dealer"]["count"] = gameData[sessionId]["dealer"]["cards"].length;
                                    otherAllCards.push(newCard);
                                }
                            }
                            var winTimeout = 1;
                            for (var i = 0; i < videoOfCards.length; i++) {
                                winTimeout += context.mediaHelper.getVODInfo(videoOfCards[i].name).length;
                                timerVideoOfCards.push(context.mediaHelper.getVODInfo(videoOfCards[i].name).length);
                            }
                            addIntroVideo(gameId, videoOfCards);
                            context.mediaHelper.playVOD(gameId, videoOfCards);
                            context.setTimeout(function() {
                                calculateWinAmount(gameId);
                            }, winTimeout * 1000);
                            isSuccess = true;

                            return { success: true, userCard: otherOneCard, userTotal: gameData[sessionId]["user"][betData.hand]["points"], amount: amount, dealerCards: otherAllCards, dealerTotal: gameData[sessionId]["dealer"]["points"], videoTimer: timerVideoOfCards };
                        } else {
                            isSuccess = false;
                            return { success: false };
                        }

                    } else {
                        throw "INSUFFICIENT_FUNDS";
                    }
                } else {
                    isSuccess = false;
                    return { success: false };
                }
            } catch (e) {
                isSuccess = false;
                context.logError(e);
                return { success: false };
            }
        }
        break;
    case "insurance":
        videoOfCards = [];
        timerVideoOfCards = [];
        otherAllCards = [];
        var betAmount = 0, dealerTotalPoints = 0;
        if (calculateCardspoints([gameData[sessionId]["dealer"]["cards"][0]]) == 11 && !gameData[sessionId]["dealer"]["insurance"] && !gameData[sessionId]["dealer"]["split"]) {
            try {
                for (var i = 0; i < Bets[sessionId].length; i++) {
                    if (Bets[sessionId][i].type == "bet")
                        betAmount += Bets[sessionId][i].amount;
                }
                if ( betAmount / 2<=user.balance) {
                    betData = {
                        amount: betAmount / 2,
                        type: "insurance"
                    };
                    var betResult = context.accountingHelper.registerBet(sessionId, settings.roundId, betData.amount, betData, "Insurance at round " + settings.roundId);
                    switch (betResult) {
                    case betErrorCodes.FATAL_ERROR:
                        {
                            throw "FATAL_ERROR";
                        }
                        break;
                    case betErrorCodes.INVALID_AMOUNT:
                        {
                            throw "INVALID_AMOUNT";
                        }
                        break;
                    case betErrorCodes.INSUFFICIENT_FUNDS:
                        {
                            throw "INSUFFICIENT_FUNDS";
                        }
                        break;
                    case betErrorCodes.SESSION_NOT_FOUND:
                        {
                            throw "SESSION_NOT_FOUND";
                        }
                        break;
                    }
                    betData.roundBetId = betResult;
                    Bets[sessionId].push(betData);
                    gameData[sessionId]["dealer"]["insurance"] = true;
                    if (calculateCardspoints(gameData[sessionId]["dealer"]["cards"]) == 21) {
                        gameData[sessionId]["dealer"]["points"] = calculateCardspoints(gameData[sessionId]["dealer"]["cards"]);
                        dealerTotalPoints = gameData[sessionId]["dealer"]["points"];
                        var resultCode = context.accountingHelper.registerWin(sessionId, settings.roundId, betResult, betData.amount * 3, 21, "Insurance bet at round " + settings.roundId,
                            function(sessionId, betObj, amount) {
                                notifyUser(sessionId, {
                                    type: "status",
                                    message: {
                                        state: "win",
                                        round_id: settings.roundId,
                                        winAmount: amount,
                                        betData: betObj
                                    }
                                });

                            }, function(sessionId) {
                                context.logError("Register win failed");
                                notifyUser(sessionId, {
                                    type: "error",
                                    message: "REGISTER_WIN_ERROR"
                                });
                            });
                        switch (resultCode) {
                        case betErrorCodes.FATAL_ERROR:
                            {
                                throw "FATAL_ERROR";
                            }
                            break;
                        case betErrorCodes.INVALID_AMOUNT:
                            {
                                throw "INVALID_AMOUNT";
                            }
                            break;
                        case betErrorCodes.SESSION_NOT_FOUND:
                            {
                                throw "SESSION_NOT_FOUND";
                            }
                            break;
                        }
                        context.accountingHelper.finishRound(settings.roundId);
                        settings.roundId = context.roundCounter.increase();
                        context.setTimeout(function() {
                            clearUserData(sessionId);
                            shuffledMaps[sessionId] = getRng(sessionId).shuffle(cards);
                        }, 500);
                        var otherDealerOneCard = gameData[sessionId]["dealer"]["cards"][gameData[sessionId]["dealer"]["cards"].length - 1];
                        videoOfCards.push({ name: "Part02/" + otherDealerOneCard });
                        var pts = cardsValues[cards.indexOf(otherDealerOneCard)];

                        gameData[sessionId]["dealer"]["count"] = gameData[sessionId]["dealer"]["cards"].length;
                        otherAllCards.push(otherDealerOneCard);

                        var winTimeout = 1;
                        for (var i = 0; i < videoOfCards.length; i++) {
                            winTimeout += context.mediaHelper.getVODInfo(videoOfCards[i].name).length;
                            timerVideoOfCards.push(context.mediaHelper.getVODInfo(videoOfCards[i].name).length);
                        }
                    }
                    isSuccess = true;
                    addIntroVideo(gameId, videoOfCards);
                    context.mediaHelper.playVOD(gameId, videoOfCards);
                } else {
                    isSuccess = false;
                    throw "LIMIT_REACHED";
                }
            } catch (e) {
                isSuccess = false;
                context.logError(e);
                return { success: false, error:e };
            }return {
                success: true,
                dealerCards: otherAllCards,
                dealerTotal: dealerTotalPoints,
                amount: betAmount,
                videoTimer: timerVideoOfCards
            };
        } else {
            return { success: false };
        }

    case "balance":
        return { success: true, balance: user.balance };
    }
};

function finishUserRound(sessionId) {
    var tmpUserCards, tmpDealerCards;

    tmpUserCards = gUserCards.filter(function(uCards) {
        return uCards.sessionId == sessionId;
    });

    tmpDealerCards = gDealerCards.filter(function(dCards) {
        return dCards.sessionId == sessionId;
    });

    if (tmpDealerCards && tmpDealerCards.length > 0) {
        if (tmpDealerCards[0]["count"] !== undefined && tmpDealerCards[0]["count"] == 0) {
            dispatcher(sessionId, { type: "get_dealer_cards", sessionId: sessionId });
            dispatcher(sessionId, { type: "stake", sessionId: sessionId });
        }
    }
}

function validateBet(sessionId, bet, position) {
    var filteredBetLength, sum = 0, i, isValid = true;
    var userSettings, userLimits = {}, maxLimit;
    userSettings = context.loadUserSettings(sessionId);
    if (userSettings && userSettings.limit) {
        userLimits = userSettings.limit;
    } else {
        userLimits = context.gameConfiguration.Limits[0];
    }
    maxLimit = userLimits.Bet.Max;
    filteredBetLength = Bets[sessionId].length;
    sum = bet;
    if (filteredBetLength > 0) {
        for (i = 0; i < filteredBetLength; i++) {
            sum += Bets[sessionId][i].amount;
        }
    }
    if (sum > maxLimit) {
        isValid = false;
    }
    return isValid;

}

game_initialize();
setMessageDispatcher(dispatcher);