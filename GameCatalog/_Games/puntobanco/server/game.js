var VOD_TIMEOUT = 1000;

var gameStatusCode = {
    CLOSED: "0",
    OPENED: "1",
    WINNUMBER: "2",
    WINSUM: "4",
    BET_CONFIRMED: "5"
};
var betErrorCodes = {
    FATAL_ERROR: -1,
    SESSION_NOT_FOUND: -2,
    INVALID_AMOUNT: -3,
    INSUFFICIENT_FUNDS: -4
};
var stakeType = {
    PLAYER: 0,
    TIE: 1,
    BANKER: 2
};
var cards = [
    "CA", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "CJ", "CQ", "CK",
    "DA", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "DJ", "DQ", "DK",
    "HA", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "HJ", "HQ", "HK",
    "SA", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "SJ", "SQ", "SK"
];
var currentGameState = {};
var currentGameRound = "";
var currentStakes = {};
var history = [];
var statistics = {};
var winners = {};
var bets = {};
var settings = {};
var tableCards = {};
var videoTimeout = 0;
var nextStateTime = 0;
var videoRng;
var shuffledMaps = {};
var finalShuffledMaps = {};
var stateTimeout;
var instanceEnabled = true;
function game_initialize() {
    videoRng = context.rng.createNew();
    settings = context.loadSettings();
    if (!context.gameConfiguration && !context.mediaHelper.vodData) {
        throw "GAME_NOT_CONFIGURED";
    }
    if ((!context.gameConfiguration.Mode)) {
        throw "GAME_MODE_NOT_SET";
    }
    if (!settings) {
        settings = { gameState: -1, statistics: {}, roundId: context.roundCounter.current, startDate: null, endDate: null };
    }
    if (context.gameConfiguration.Mode === "Auto") {
        currentGameState[context.gameConfiguration.Mode] = settings.gameState;
        bets[context.gameConfiguration.Mode] = [];
        winners[context.gameConfiguration.Mode] = {};
        statistics[context.gameConfiguration.Mode] = settings.statistics[context.gameConfiguration.Mode] ? settings.statistics[context.gameConfiguration.Mode] : [];
        gameStatusInterval(context.gameConfiguration.Mode);
        runtime.setGameMode({ "keepalive": true });
        runtime.keepAlive();
        runtime.isMultiplayer = true;
    } else if (context.gameConfiguration.Mode === "External") {
        var datasource = context.getExchangeData();
        datasource.onChangeEvent = onChangeGameState;
        runtime.setGameMode({ "keepalive": true });
        runtime.keepAlive();
        runtime.isMultiplayer = true;
        statistics[context.gameConfiguration.Mode] = [];
        bets[context.gameConfiguration.Mode] = [];
        winners[context.gameConfiguration.Mode] = [];

    } else {
        runtime.isMultiplayer = false;
        runtime.isProvablyFair = true;
        runtime.gameTimeoutInSeconds = 0;
    }
    runtime.onServerMessage = OnServerMessage;
    context.log("Game server initialized!");

}

function onChangeGameState(datasource) {
    var messages = datasource.pick();
    messages.forEach(function (message) {
        messages.forEach(function (message) {
            var gameState = message.state;
            switch (gameState) {
                case gameStatusCode.OPENED:
                    context.sendMediaCommand("puntobanco_show_winners", winners[context.gameConfiguration.Mode]);
                    context.sendMediaCommand("puntobanco_round_open", message.length);
                    break;
                case gameStatusCode.CLOSED:
                    context.sendMediaCommand("puntobanco_round_close");
                    break;
                case gameStatusCode.WINNUMBER:
                    tableCards = {};
                    tableCards.player = message.player.split(",").filter(function (n) { return n !== "" });;
                    tableCards.banker = message.banker.split(",").filter(function (n) { return n !== "" });;
                    var results = calculatePoints();
                    if (results.player > results.banker) {
                        message.winner = stakeType.PLAYER;
                    } else if (results.player < results.banker) {
                        message.winner = stakeType.BANKER;
                    } else {
                        message.winner = stakeType.TIE;
                    }
                    context.sendMediaCommand("puntobanco_show_winner", [message.winner, tableCards.player, tableCards.banker]);
                    break;
            }
            context.setTimeout(function () {
                changeGameState(message);
            }, runtime.externalDelay * 1000);
        });
  });
}

function OnServerMessage(message) {
    var roundId = context.roundCounter.current;
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
          case "cancel_round":
                if (context.gameConfiguration.Mode !== "External") {
                    throw "Game instance should be in External mode for this command.";
                }
                if (currentGameState[context.gameConfiguration.Mode] === gameStatusCode.OPENED) {
                    roundId = roundId - 1;
                }
                context.accountingHelper.cancelRound(roundId, true, function () {
                    console.log("Cancel round success");
                }, function () {
                    console.logError("Cancel round error");
                });
                break;
            case "close_round":
                if (context.gameConfiguration.Mode !== "External") {
                    throw "Game instance should be in External mode for this command.";
                }
                changeGameState({ state: gameStatusCode.CLOSED });
                break;
            case "disable_instance":
                instanceEnabled = false;
                if (context.gameConfiguration.Mode === "Manual") {
                    bets = [];
                } else {
                    bets[context.gameConfiguration.Mode] = [];
                }
                notifyAll({
                    type: "remove_bets",
                    message: {
                    }
                });
                break;
            case "enable_instance":
                instanceEnabled = true;
                break;
        }
    }
}

function gameStatusInterval(gameId) {
    var videoIndex = 0;
    shuffledMaps[gameId] = getRng(gameId).shuffle(cards);
    var files = context.mediaHelper.vodData.length_map["Part01"];
    files = Object.keys(files);
    videoIndex = files[videoRng.random(0, files.length - 1)];
    videoTimeout = (context.mediaHelper.getVODInfo("Place_Your_Bets").length + context.mediaHelper.getVODInfo("Part01/" + videoIndex).length) * 1000;
    context.mediaHelper.clearOverlay(null);
    stateTimeout = context.setTimeout(function() {
        context.mediaHelper.playVOD(null, ["Part01/" + videoIndex, "No_More_Bets"]);
        context.mediaHelper.showScreen(null, "WINNERS");
    }, context.mediaHelper.getVODInfo("Place_Your_Bets").length * 1000);
    stateTimeout = context.setTimeout(function() {
        context.mediaHelper.clearOverlay(null);
    }, videoTimeout - 5000);
    changeGameState({ gameId: gameId, length: videoTimeout / 1000, state: gameStatusCode.OPENED });
    nextStateTime = new Date(new Date().getTime() + videoTimeout);
    stateTimeout = context.setTimeout(function() {
        var winner = "", puntoLastCard = -1;
        finalShuffledMaps[gameId] = getRng(gameId).finalShuffle(shuffledMaps[gameId]);
        tableCards.banker = [];
        tableCards.player = [];
        tableCards.player.push(getCard(gameId));
        tableCards.banker.push(getCard(gameId));
        tableCards.player.push(getCard(gameId));
        tableCards.banker.push(getCard(gameId));
        var results = calculatePoints();
        if (results.player < 8 && results.banker < 8) {
            if (results.player < 6) {
                tableCards.player.push(getCard(gameId));
                puntoLastCard = getCardNominal(tableCards.player[2]);
            }
            if (results.banker < 3) {
                tableCards.banker.push(getCard(gameId));
            } else if (results.banker == 3 && puntoLastCard != 8) {
                tableCards.banker.push(getCard(gameId));
            } else if (results.banker == 4 && [-1, 2, 3, 4, 5, 6, 7].indexOf(puntoLastCard) > 0) {
                tableCards.banker.push(getCard(gameId));
            } else if (results.banker == 5 && [-1, 4, 5, 6, 7].indexOf(puntoLastCard) > 0) {
                tableCards.banker.push(getCard(gameId));
            } else if (results.banker == 6 && [6, 7].indexOf(puntoLastCard) > 0) {
                tableCards.banker.push(getCard(gameId));
            }
            results = calculatePoints();
        }
        var videoPath;
        if (results.player > results.banker) {
            winner = stakeType.PLAYER;
            videoPath = "Player";
        } else if (results.player < results.banker) { 
            winner = stakeType.BANKER;
            videoPath = "Bank";
        } else {
            winner = stakeType.TIE;
            videoPath = "Ties";
        }
        if (statistics[gameId].length > 120) {
            statistics[gameId].shift();
        }
        var p2Files = context.mediaHelper.vodData.length_map["Part02"][videoPath];
        p2Files = Object.keys(p2Files);
        videoIndex = p2Files[videoRng.random(0, p2Files.length - 1)];
        videoTimeout = context.mediaHelper.getVODInfo("No_More_Bets").length + context.mediaHelper.getVODInfo("Part02/" + videoPath + "/" + videoIndex).length * 1000;
        stateTimeout = context.setTimeout(function() {
            context.mediaHelper.playVOD(null, [{ name: "Part02/" + videoPath + "/" + videoIndex, wait_previous: 2 }, "Place_Your_Bets"]);
        }, context.mediaHelper.getVODInfo("No_More_Bets").length * 1000);
        changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED });
        nextStateTime = new Date(new Date().getTime() + videoTimeout);
        stateTimeout = context.setTimeout(function() {
            changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, winner: winner });
            nextStateTime = new Date(new Date().getTime() + 2000);
            stateTimeout = context.setTimeout(function() {
                gameStatusInterval(gameId);
            }, 2000 - VOD_TIMEOUT);
        }, videoTimeout - 2000);
    }, videoTimeout - VOD_TIMEOUT);
}

function gameStatusManual(gameId) {
    var videoIndex;
    finalShuffledMaps[gameId] = getRng(gameId).finalShuffle(shuffledMaps[gameId]);
    var winner = "", puntoLastCard = -1;
    tableCards.banker = [];
    tableCards.player = [];
    tableCards.player.push(getCard(gameId));
    tableCards.banker.push(getCard(gameId));
    tableCards.player.push(getCard(gameId));
    tableCards.banker.push(getCard(gameId));
    var results = calculatePoints();
    if (results.player < 8 && results.banker < 8) {
        if (results.player < 6) {
            tableCards.player.push(getCard(gameId));
            puntoLastCard = getCardNominal(tableCards.player[2]);
        }
        if (results.banker < 3) {
            tableCards.banker.push(getCard(gameId));
        } else if (results.banker == 3 && puntoLastCard != 8) {
            tableCards.banker.push(getCard(gameId));
        } else if (results.banker == 4 && [-1, 2, 3, 4, 5, 6, 7].indexOf(puntoLastCard) > 0) {
            tableCards.banker.push(getCard(gameId));
        } else if (results.banker == 5 && [-1, 4, 5, 6, 7].indexOf(puntoLastCard) > 0) {
            tableCards.banker.push(getCard(gameId));
        } else if (results.banker == 6 && [6, 7].indexOf(puntoLastCard) > 0) {
            tableCards.banker.push(getCard(gameId));
        }
        results = calculatePoints();
    }
    var videoPath;
    if (results.player > results.banker) {
        winner = stakeType.PLAYER;
        videoPath = "Player";
    } else if (results.player < results.banker) {
        winner = stakeType.BANKER;
        videoPath = "Bank";
    } else {
        winner = stakeType.TIE;
        videoPath = "Ties";
    }
    if (statistics[gameId].length > 120) {
        statistics[gameId].shift();
    }
    var p2Files = context.mediaHelper.vodData.length_map["Part02"][videoPath];
    p2Files = Object.keys(p2Files);
    videoIndex = p2Files[videoRng.random(0, p2Files.length - 1)];
    videoTimeout = context.mediaHelper.getVODInfo("Part02/" + videoPath + "/" + videoIndex).length * 1000;
    context.mediaHelper.playVOD(gameId, [{ name: "Part02/" + videoPath + "/" + videoIndex, wait_previous: 3 }]);
    changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED });
    stateTimeout = context.setTimeout(function() {
        changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, winner: winner });
        stateTimeout = context.setTimeout(function() {
            if (context.mediaHelper.getVODInfo("Idle")) {
                context.mediaHelper.playVOD(gameId, [{ name: "Idle", loop: true }]);
                changeGameState({ gameId: gameId, length: null, state: gameStatusCode.OPENED });
                shuffledMaps[gameId] = getRng(gameId).shuffle(cards);
            } else {
                context.mediaHelper.playVOD(gameId, ["Place_Your_Bets"]);
                videoTimeout = context.mediaHelper.getVODInfo("Place_Your_Bets").length * 1000;
                stateTimeout = context.setTimeout(function() {
                    changeGameState({ gameId: gameId, length: null, state: gameStatusCode.OPENED });
                    shuffledMaps[gameId] = getRng(gameId).shuffle(cards);
                    var user = context.getUserInfo(gameId);
                    context.mediaHelper.showScreen(gameId, "WinnersFullscreen");
                }, videoTimeout);
            }
        }, 2000 - VOD_TIMEOUT);
    }, videoTimeout - 2000);
}

function completeBets(sessionId) {
    var user = context.getUserInfo(sessionId);
    try {
        var completeResultCode = context.accountingHelper.completeBets(sessionId, settings.roundId, function() {
        }, function(sessionId) {
            context.logError("Complete bets failed.");
            var gameId;
            if (context.gameConfiguration.Mode === "Manual") {
                notifyUser(sessionId, {
                    type: "error",
                    target: "promt",
                    message: "Complete bets failed."
                });
                gameId = sessionId;
                restartGame(sessionId);
            } else {
                gameId = context.gameConfiguration.Mode;
                notifyUser(sessionId, {
                    type: "clearTable",
                    balance: user.balance
                });
                context.kick(sessionId);
            }
            for (var i in bets[gameId]) {
                if (bets[gameId][i].sessionId == sessionId) {
                    bets[gameId].splice(i, 1);;
                }
            }
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
        context.logError("Complete bets failed.");
        var gameId;
        if (context.gameConfiguration.Mode === "Manual") {
            gameId = sessionId;
            restartGame(sessionId);
            notifyUser(sessionId, {
                type: "error",
                target: "promt",
                message: "Complete bets failed."
            });
        } else {
            gameId = context.gameConfiguration.Mode;
            notifyUser(sessionId, {
                type: "clearTable",
                balance: user.balance
            });
            context.kick(sessionId);

        }
        for (var i in bets[gameId]) {
            if (bets[gameId][i].sessionId == sessionId) {
                bets[gameId].splice(i, 1);;
            }
        }
        context.logError(err);
    }
}

function getUserBets(sessionId) {
    var gameId, userBets = [];
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = sessionId;
    } else {
        gameId = context.gameConfiguration.Mode;
    }
    if (bets[gameId])
        bets[gameId].forEach(function(bet) {
            if (bet.sessionId == sessionId) {
                userBets.push(bet);
            }
        });
    return userBets;
}

function createGame(sessionId) {
    bets[sessionId] = [];
    winners[sessionId] = {};
    statistics[sessionId] = [];
    currentGameState[sessionId] = "";
    shuffledMaps[sessionId] = getRng(sessionId).shuffle(cards);
}

function clearUserData(sessionId) {
        if (currentGameState[sessionId] === gameStatusCode.OPENED && bets[sessionId].length>0) {
            try {
            var cancelResult = context.accountingHelper.cancelBetsByUser(sessionId, settings.roundId);
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
            bets[sessionId] = [];
        } catch (e) {
            context.logError(e);
        }
    }
    delete bets[sessionId];
    delete shuffledMaps[sessionId];
    delete finalShuffledMaps[sessionId];
    delete statistics[sessionId];
    delete currentGameState[sessionId];
}

function changeGameState(gameContext) {
    var gameState = gameContext.state;
    var gameId, sessionId = null;;
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = gameContext.gameId;
        sessionId = gameId;
    } else {
        gameId = context.gameConfiguration.Mode;
        runtime.keepAlive();
    }
    if (!settings.roundId) {
        settings.roundId = context.roundCounter.current;
    }
    if (currentGameState[gameId] != gameState) {
        currentGameState[gameId] = gameState;
        settings.gameState = gameState;
        if (gameState == gameStatusCode.OPENED) {
            if (context.gameConfiguration.Mode === "Manual") {
                notifyUser(gameContext.gameId, {
                    type: "status",
                    message: {
                        status: gameStatusCode.OPENED,
                        comment: "table open",
                        duration: Math.floor(gameContext.length)
                    }
                });
            } else {
                runtime.setRoundLength(gameContext.length);
                notifyAll({
                    type: "status",
                    message: {
                        status: gameStatusCode.OPENED,
                        comment: "table open",
                        duration: Math.floor(gameContext.length)
                    }
                });
            }
            if (!gameContext.oldSession) {
                bets[gameId] = [];
                winners[gameId] = {};
                currentStakes[gameId] = {};
                context.log("GameState: table open");
                runtime.setGameState(sessionId, "OPENED", "Opened round: " + settings.roundId);
                context.accountingHelper.registerRoundOpen(settings.roundId);
            }
        } else if (gameState == gameStatusCode.CLOSED) {
            if (context.gameConfiguration.Mode === "Manual") {
                notifyUser(gameContext.gameId, {
                    type: "status",
                    message: {
                        status: gameStatusCode.CLOSED,
                        comment: "table close"
                    }
                });
            } else {
                notifyAll({
                    type: "status",
                    message: {
                        status: gameStatusCode.CLOSED,
                        comment: "table close"
                    }
                });
            }
            var completeGames = [];
            bets[gameId].forEach(function(stake) {
                if (completeGames.indexOf(stake.sessionId) < 0) {
                    completeBets(stake.sessionId);
                    completeGames.push(stake.sessionId);
                }
            });
            context.log("GameState: table close");
            runtime.setGameState(sessionId, "CLOSED", "Closed round: " + settings.roundId);
        } else if (gameState == gameStatusCode.WINNUMBER) {
            var winner = gameContext.winner;
            statistics[gameId].push(winner);
            if (context.gameConfiguration.Mode === "Manual") {
                notifyUser(gameContext.gameId, {
                    type: "status",
                    message: {
                        status: gameStatusCode.WINNUMBER,
                        winner: winner,
                        comment: "winner"
                    }
                });
            } else {
                context.cleanupMessages();
                notifyAll({
                    type: "status",
                    message: {
                        status: gameStatusCode.WINNUMBER,
                        winner: winner,
                        comment: "winner"
                    }
                });
            }
            calculateWinSum(gameId, winner, bets[gameId]);
            runtime.setGameState(sessionId, "WINNING", "Winner: " + winner);
            context.accountingHelper.registerRoundResult(settings.roundId, winner);
            context.accountingHelper.finishRound(settings.roundId);
            settings.roundId = context.roundCounter.increase();
            bets[gameId] = [];
        }
        settings.statistics[gameId] = statistics[gameId];
        if (context.gameConfiguration.Mode != "Manual") {
            context.saveSettings(settings);
        }
    }
}

function validateBet(sessionId, bet) {
    var valid = true;
    var user = context.getUserInfo(sessionId);
    var userSettings = context.loadUserSettings(sessionId);
    var userLimits = {};
    if (userSettings && userSettings.limits) {
        for (var i = 0; i < context.gameConfiguration.Limits.length; i++) {
            var limit = context.gameConfiguration.Limits[i];
            if (limit.Id == userSettings.limits.Id) {
                userLimits = convertLimits([limit], user.locale.currencyMultiplier)[0];
            }
        }
    } else
        userLimits = convertLimits(context.gameConfiguration.Limits, user.locale.currencyMultiplier)[0];
    var bets = getUserBets(sessionId);
    var tableAmount = bet.amount;
    bets.forEach(function(userBet) {
        tableAmount += userBet.betInfo.amount;
    });
    tableAmount = parseFloat(tableAmount.toFixed(2));
    if (tableAmount > userLimits.Table.Max.replace(",", ".") || tableAmount < userLimits.Table.Min.replace(",", ".")) {
        valid = false;
    } else {
        var typeAmount = bet.amount;
        bets.forEach(function(userBet) {
            if (bet.type == userBet.betInfo.type) {
                typeAmount += userBet.betInfo.amount;
            }
        });
        typeAmount = parseFloat(typeAmount.toFixed(2));
        if (bet.type == stakeType.BANKER) {
            if (typeAmount > userLimits.Banker.Max.replace(",", ".") || typeAmount < userLimits.Banker.Min.replace(",", ".")) {
                valid = false;
            }
        } else if (bet.type == stakeType.TIE) {
            if (typeAmount > userLimits.Tie.Max.replace(",", ".") || typeAmount < userLimits.Tie.Min.replace(",", ".")) {
                valid = false;
            }
        } else if (bet.type == stakeType.PLAYER) {
            if (typeAmount > userLimits.Player.Max.replace(",", ".") || typeAmount < userLimits.Player.Min.replace(",", ".")) {
                valid = false;
            }
        }
    }
    return valid;
}

function restartGame(sessionId) {
    if (stateTimeout)
        context.clearTimeout(stateTimeout);
    shuffledMap[sessionId] = getRng(sessionId).shuffle(physicalMap);
    stateTimeout = context.setTimeout(function() {
        changeGameState({ gameId: sessionId, length: null, state: gameStatusCode.OPENED, videos: [] });
        if (context.mediaHelper.getVODInfo("Idle")) {
            context.mediaHelper.playVOD(sessionId, [{ name: "Idle", loop: true }]);
        } else {
            context.mediaHelper.showScreen(sessionId, "WinnersFullscreen");
        }
    }, 2000);
    bets[sessionId] = [];
}

function convertLimits(limits, multiplier) {
    for (var i = 0; i < limits.length; i++) {
        var limit = limits[i];
        limit["Banker"].Min = parseFloat(parseFloat(limit["Banker"].Min.replace(",", ".")) * multiplier).toFixed(2);
        limit["Banker"].Max = parseFloat(parseFloat(limit["Banker"].Max.replace(",", ".")) * multiplier).toFixed(2);
        limit["Tie"].Min = parseFloat(parseFloat(limit["Tie"].Min.replace(",", ".")) * multiplier).toFixed(2);
        limit["Tie"].Max = parseFloat(parseFloat(limit["Tie"].Max.replace(",", ".")) * multiplier).toFixed(2);
        limit["Player"].Min = parseFloat(parseFloat(limit["Player"].Min.replace(",", ".")) * multiplier).toFixed(2);
        limit["Player"].Max = parseFloat(parseFloat(limit["Player"].Max.replace(",", ".")) * multiplier).toFixed(2);
        limit["Table"].Min = parseFloat(parseFloat(limit["Table"].Min.replace(",", ".")) * multiplier).toFixed(2);
        limit["Table"].Max = parseFloat(parseFloat(limit["Table"].Max.replace(",", ".")) * multiplier).toFixed(2);
    }
    return limits;
}

var dispatcher = function messageDispatcher(sessionId, message) {
    var user = context.getUserInfo(sessionId);
    if (!user) {
        return null;
    }
    var gameId;
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = sessionId;
    } else {
        gameId = context.gameConfiguration.Mode;
    }
    context.log("type:" + message.type + " currentState:" + currentGameState[gameId] + " sessionId:" + user.sessionId);
    if (!settings.roundId) {
        settings.roundId = context.roundCounter.current;
    }

    switch (message.type) {
    case "get_limits":
        var userSettings = context.loadUserSettings(sessionId);
        var selectedLimits = {};
        if (userSettings && userSettings.limits)
            for (var i = 0; i < context.gameConfiguration.Limits.length; i++) {
                var limit = context.gameConfiguration.Limits[i];
                if (limit.Id == userSettings.limits.Id) {
                    selectedLimits = convertLimits([limit], user.locale.currencyMultiplier)[0];
                }
            }
        return { success: true, limits: convertLimits(context.gameConfiguration.Limits, user.locale.currencyMultiplier), selected: selectedLimits };
    case "put_limits":
        var userSettings = context.loadUserSettings(sessionId);
        if (!userSettings) {
            userSettings = {};
        }
        for (var i = 0; i < context.gameConfiguration.Limits.length; i++) {
            var limit = context.gameConfiguration.Limits[i];
            if (limit.Id == message.limits.Id) {
                userSettings.limits = limit;
            }
        }
        context.saveUserSettings(sessionId, userSettings);
        return { success: true };
    case "history":
        return { success: true, data: history };
    case "stats":
        return { success: true, data: statistics[gameId] };
    case "bet":
        var result, betResult = 0;
        try {
            if (currentGameState[gameId] != gameStatusCode.OPENED || !instanceEnabled) {
                throw "TABLE_CLOSED";
            }
            message.bets.forEach(function(bet) {
                if (validateBet(sessionId, bet)) {
                    var betObj = {
                        sessionId: sessionId,
                        betInfo: bet
                    };
                    var betResult = context.accountingHelper.registerBet(sessionId, settings.roundId, bet.amount, makeBetObject(betObj), "Bet at round " + settings.roundId);
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
                    betObj.roundBetId = betResult;
                    bets[gameId].push(betObj);
                    bet.wasMade = true;
                } else {
                    throw "LIMIT_REACHED";
                }
            });
            return { success: true, balance: user.balance, bets: message.bets };
        } catch (e) {
            context.logError(e);
            return { success: false, balance: user.balance, betResult: betResult, error: e.toString(), bets: message.bets };
        }
    case "cancel_all":
        if (currentGameState[gameId] != gameStatusCode.OPENED) {
            return { success: false, balance: user.balance, error: "TABLE_CLOSED", bets: bets };
        }
        try {
            var cancelResult = context.accountingHelper.cancelBetsByUser(sessionId, settings.roundId);
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
            var cancelBets = bets[gameId].filter(function(bet) {
                return bet.sessionId === sessionId;
            });
            cancelBets.forEach(function(bet) {
                if (bet.sessionId == sessionId) {
                    bets[gameId].splice(bets[gameId].indexOf(bet), 1);
                }
            });
        } catch (e) {
            return { success: false, balance: user.balance, error: e.toString(), bets: message.cancelBets };
        }
        return { success: true, balance: user.balance };
    case "cancel_last":
        if (currentGameState[gameId] != gameStatusCode.OPENED) {
            return { success: false, balance: user.balance, error: "TABLE_CLOSED", bets: bets };
        }
        try {
            var cancelBets = [];
            cancelBets = bets[gameId].filter(function(bet) {
                return bet.sessionId == sessionId;
            }).filter(function(bet) {
                return message.bet.type === bet.betInfo.type;
            });
            var cancelBet = cancelBets[cancelBets.length - 1];
            var cancelResult = context.accountingHelper.cancelBet(cancelBet.sessionId, settings.roundId, cancelBet.betInfo.amount, makeBetObject(cancelBet));
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
            if (cancelBet.betInfo.amount > message.bet.amount) {
                cancelBet.betInfo.amount -= message.bet.amount;
            } else {
                bets[gameId].splice(bets[gameId].indexOf(cancelBet), 1);
            }

            return { success: true, balance: user.balance, bets: message.bets };
        } catch (e) {
            result = { success: false, balance: user.balance, error: e.toString(), bets: message.cancelBets };
            return result;
        }
        result = { success: true, balance: user.balance };
        return result;
    case "balance":
        return { success: true, balance: user.balance, totalLost: user.totalLoss };
    case "refresh_user_data":
        return { success: true, user: user };
    case "start_game":
        if (currentGameState[gameId] != gameStatusCode.OPENED) {
            return { success: false, balance: user.balance, error: "GAME_ALREADY_BEGUN"};
        }
        if (context.gameConfiguration.Mode != "Manual") {
            return { success: false, balance: user.balance, error: "INCORRECT_MODE" };
        }
        if (!instanceEnabled) {
            return { success: false, balance: user.balance, error: "INSTANCE_DISABLED" };
        }
        gameStatusManual(gameId);
        context.keepSessionAlive(sessionId);
        return { success: true, balance: user.balance };
    }
};

function makeBetObject(bet) {
    return { type: bet.betInfo.type };
}

function getCard(gameId) {
    var card;
    try {
        card = finalShuffledMaps[gameId].shift();
    } catch (e) {
        context.logError("Shift failed.");
        context.logError(e);
    }
    return card;
}

function getCardNominal(card) {
    var nominal;
    var cardRank = card.substr(1, 2);
    if (cardRank == "A") {
        nominal = 1;
    } else if (cardRank === "K" || cardRank === "Q" || cardRank === "J" || cardRank === "10") {
        nominal = 0;
    } else {
        nominal = Math.floor(cardRank);
    }
    return nominal;
}

function calculatePoints() {
    var bankCardsValue = 0;
    var playerCardsValue = 0;
    for (var i = 0; i < tableCards.banker.length; i++) {
        bankCardsValue += getCardNominal(tableCards.banker[i]);
    }
    for (i = 0; i < tableCards.player.length; i++) {
        playerCardsValue += getCardNominal(tableCards.player[i]);
    }
    playerCardsValue = playerCardsValue > 9 ? playerCardsValue % 10 : playerCardsValue;
    bankCardsValue = bankCardsValue > 9 ? bankCardsValue % 10 : bankCardsValue;
    return { banker: bankCardsValue, player: playerCardsValue };
}

function calculateWinSum(gameId, winner, stakes) {
    var i = 0;
    var stake = {};
    for (i = 0; i < stakes.length; i++) {
        var winSum = 0;
        stake = stakes[i];
        var type = stake.betInfo.type;
        var value = stake.betInfo.amount;
        context.log("stake " + i + "  type:" + type + " value:" + value);
        if (winner == stakeType.PLAYER && type == stakeType.PLAYER) {
            winSum = value * 2;
        } else if (winner == stakeType.BANKER && type == stakeType.BANKER) {
            winSum = value * 2 - (value / 100 * 5);
        } else if (winner == stakeType.TIE) {
            if (type == stakeType.TIE)
                winSum = value * 9;
            else
                winSum = value;
        }
        var user = context.getUserInfo(stake.sessionId);
        if (winSum > 0) {
            try {
                var amount = winSum;
                var resultCode = context.accountingHelper.registerWin(stake.sessionId, settings.roundId, stake.roundBetId, amount, makeBetObject(stake), "Win bet at round " + settings.roundId,
                    function(seesionId, betObj, amount) {
                        context.log("Win:" + amount);
                        notifyUser(seesionId, {
                            type: "win",
                            message: {
                                status: gameStatusCode.WINSUM,
                                success: true,
                                winsum: amount,
                                balance: user.balance,
                                comment: "winsum"
                            }
                        });

                    }, function(seesionId) {
                        context.logError("Register win failed");
                        notifyUser(seesionId, {
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
                notifyUser(stake.sessionId, {
                    type: "win",
                    message: {
                        success: false,
                        winsum: winSum,
                        error: "REGISTER_WIN_ERROR",
                        balance: user.balance
                    }
                });
            }
        }
    }
}

game_initialize();
setMessageDispatcher(dispatcher);