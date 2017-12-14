var gameStatusCode = {
    CLOSED: 0,
    OPENED: 1,
    WINNUMBERS: 2,
    CURRENTNUMBERS: 3,
    BET_CONFIRMED: 5,
    NO_MORE_BETS: 6
};
var stakeResultCodes = {
    CONFIRMED: 0,
    FAILED: 1,
    LOSS: 2,
    WIN: 3
};
var betErrorCodes = {
    FATAL_ERROR: -1,
    SESSION_NOT_FOUND: -2,
    INVALID_AMOUNT: -3,   
    INSUFFICIENT_FUNDS: -4
};
var roundId = context.roundCounter.current;
var currentGameState = {};
var history = {};
var winners = {};
var settings = {};
var lastNumbers = [];
var bets = {};
var physicalMap = [];
var shuffledMap = {};
var instanceEnabled = true;

function game_initialize() { 
    if (!context.gameConfiguration) {
        throw "GAME_NOT_CONFIGURED"; 
    }
    if ((!context.gameConfiguration.Mode)) {
        throw "GAME_MODE_NOT_SET";
    }
    settings = context.loadSettings();
    if (!settings) {
        settings = { gameState: -1, history: {}, roundId: context.roundCounter.current, startDate: null, endDate: null };
    }
    for (var i = 1; i <= 80; i++) {
        physicalMap.push(i);
    }
    if (context.gameConfiguration.Mode === "External" || context.gameConfiguration.Mode === "Auto") {
        currentGameState[context.gameConfiguration.Mode] = settings.gameState;
        bets[context.gameConfiguration.Mode] = [];
        winners[context.gameConfiguration.Mode] = [];
        runtime.setGameMode({ "keepalive": true });
        runtime.keepAlive();
        runtime.isMultiplayer = true;
    } else { 
        runtime.isMultiplayer = false;
    }
    if (context.gameConfiguration.Mode === "External") {
        var datasource = context.getExchangeData();
        datasource.onChangeEvent = onChangeGameState;
    } else {  
        runtime.isProvablyFair = true;
    }
    runtime.onServerMessage = OnServerMessage;
    context.log("Game server initialized!");
}

function OnServerMessage(message) {
    if (message && message.type) {
        switch (message.type) {
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
        case "refresh_user_data":
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

function onChangeGameState(datasource) {
    var messages = datasource.pick();
    messages.forEach(function (message) {
        message.state = parseInt(message.state);
        context.log(message);
        var gameState = message.state;
        switch (gameState) {
            case gameStatusCode.OPENED:
                context.sendMediaCommand("keno_show_winners", winners[context.gameConfiguration.Mode]);
                context.sendMediaCommand("keno_round_open", message.length);
                break;
            case gameStatusCode.CLOSED:
                context.sendMediaCommand("keno_round_close");
                break;
            case gameStatusCode.CURRENTNUMBERS:
                var curNumbers = [];
                for (var i = 0; i < message.numbers.split(",").length; i++) {
                    curNumbers[i] = parseInt(message.numbers.split(",")[i]);
                }
                lastNumbers = curNumbers;
                message.numbers = curNumbers;
                break;
            case gameStatusCode.WINNUMBERS:
                var winNumbers = [];
                for (var i = 0; i < message.numbers.split(",").length; i++) {
                    winNumbers[i] = parseInt(message.numbers.split(",")[i]);
                }
                if (winNumbers.length > 0) {
                    message.numbers =winNumbers;
                    lastNumbers = winNumbers;
                    context.sendMediaCommand("keno_show_winner", message.numbers);
                } else {
                    if (currentGameState[context.gameConfiguration.Mode] != gameStatusCode.OPENED) {
                        context.accountingHelper.cancelRound(settings.roundId, true, function() {
                            context.log("Cancel round success");
                        }, function() {
                            context.logError("Cancel round error");
                        });
                    }
                    bets[context.gameConfiguration.Mode] = [];
                    notifyAll({
                        type: "error",
                        target: "promt",
                        message: "Error! All bets canceled."
                    });
                }
                break;
        }
        context.setTimeout(function () {
            changeGameState(message);
        }, runtime.externalDelay * 1000);
    });
}

function changeGameState(gameContext) {
    var gameState = gameContext.state;
    var gameId, sessionId = null;
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = gameContext.gameId;
        sessionId = gameContext.gameId;
    } else {
        gameId = context.gameConfiguration.Mode;
    }
    if (!settings.roundId) {
        settings.roundId = context.roundCounter.current;
    }
    if (currentGameState[gameId] != gameState || gameState == gameStatusCode.CURRENTNUMBERS) {
        context.log("Game status changed! Status:" + gameState);
        settings.gameState = gameState;
        currentGameState[gameId] = gameState;
        runtime.keepAlive();
        if (gameState == gameStatusCode.OPENED) {
            var length = null;
            if (roundId != settings.roundId)
                bets[gameId] = [];
            roundId = settings.roundId ? settings.roundId : context.roundCounter.current;
            if (gameContext.length) {
                length = gameContext.length;
            }
            settings.startDate = context.date;
            settings.endDate = length ? new Date(settings.startDate.getTime() + length*1000) : null;
            if (context.gameConfiguration.Mode === "Manual") {
                notifyUser(gameContext.gameId, {
                    type: "status",
                    message: {
                        status: gameStatusCode.OPENED,
                        round_id: roundId,
                        startDate: settings.startDate,
                        endDate: settings.endDate,
                        length: length
                    }
                });
            } else {
                runtime.setRoundLength(length);
                notifyAll({
                    type: "status",
                    message: {
                        status: gameStatusCode.OPENED,
                        round_id: roundId,
                        startDate: settings.startDate,
                        endDate: settings.endDate,
                        length: length
                    }
                });
            }
            if (!gameContext.oldSession) {
                runtime.setGameState(sessionId, 'OPENED', "Opened round: " + settings.roundId);
                context.accountingHelper.registerRoundOpen(settings.roundId);
            }
        } else if (gameState == gameStatusCode.CLOSED) {
            if (context.gameConfiguration.Mode === "Manual") {
                notifyUser(gameContext.gameId, {
                    type: "status",
                    message: {
                        status: gameStatusCode.CLOSED,
                        round_id: roundId
                    }
                });
            } else {
                notifyAll({
                    type: "status",
                    message: {
                        status: gameStatusCode.CLOSED,
                        round_id: roundId
                    }
                });
            }
            var completeGames = [];
            runtime.setGameState(sessionId, 'CLOSED', "Closed round: " + settings.roundId);
            for (var i in bets[gameId]) {
                if (completeGames.indexOf(bets[gameId][i].sessionId) < 0) {
                    completeBets(bets[gameId][i].sessionId);
                    completeGames.push(bets[gameId][i].sessionId);
                }
            };
        } else if (gameState == gameStatusCode.CURRENTNUMBERS) {
            notifyAll({
                type: "status",
                message: {
                    status: gameStatusCode.CURRENTNUMBERS,
                    win_numbers: gameContext.numbers,
                    round_id: settings.roundId
                }
            });
        }else if (gameState == gameStatusCode.WINNUMBERS) {
            settings.endDate = context.date;
            if (context.gameConfiguration.Mode === "Manual") {
                notifyUser(gameContext.gameId, {
                    type: "status",
                    message: {
                        status: gameStatusCode.WINNUMBERS,
                        win_numbers: gameContext.numbers,
                        round_id: settings.roundId
                    }
                });
            } else {
                context.cleanupMessages();
                notifyAll({
                    type: "status",
                    message: {
                        status: gameStatusCode.WINNUMBERS,
                        win_numbers: gameContext.numbers,
                        round_id: settings.roundId
                    }
                });
            }
            findWinners(gameId, gameContext.numbers, gameContext, bets[gameId]);
            showWinners(winners);
            winners = [];
            runtime.setGameState(sessionId, 'WINNING', "Winning numbers: " + gameContext.numbers);
            context.accountingHelper.registerRoundResult(settings.roundId, gameContext.numbers);
            context.accountingHelper.finishRound(settings.roundId);
            settings.roundId = context.roundCounter.increase();
            bets[gameId] = [];
        }
        context.saveSettings(settings);
    }
}

function findWinners(gameId, winNumbers, gameContext, roundBets) {
    winners[gameId] = [];
    for (var i in roundBets) {
        if (roundBets.hasOwnProperty(i)) {
            var bet = roundBets[i];
            var matchCount = 0;
            var winAmount = 0;
            var win;
            var amount = bet.amount;
            for (var i = 0; i < bet.numbers.length; i++) {
                if (winNumbers.indexOf(bet.numbers[i]) != -1) {
                    matchCount++;
                } 
            }
            for (var i in context.gameConfiguration.WinRates) {
                if (context.gameConfiguration.WinRates[i].Num == bet.numbers.length) {
                    var rates = context.gameConfiguration.WinRates[i].Rates;
                    if (rates[matchCount - 1] > 0) {
                        winAmount = amount * rates[matchCount - 1];
                        win = true;
                    }
                }
            }
            if (win) {
                var user = context.getUserInfo(bet.sessionId);
                try {
                    var resultCode = context.accountingHelper.registerWin(bet.sessionId, settings.roundId, bet.betId, winAmount, winNumbers, "Win bet at round " + settings.roundId,
                        function (seesionId, betObj, amount) {
                            notifyUser(seesionId, {
                                type: "win",
                                message: {
                                    success: true,
                                    status: stakeResultCodes.WIN,
                                    round_id: settings.roundId, 
                                    win_sum: amount,
                                    numbers: betObj,
                                    balance: user.balance
                                }
                            });

                        }, function (seesionId) {
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
                    winners[gameId].push([user.nick, user.locale.currencySign + winAmount]);
                } catch (e) {
                    context.log("Find winners error:");
                    context.logError(e);
                    notifyUser(bet.sessionId, {
                        type: "win",
                        message: {
                            success: false,
                            winsum: winAmount,
                            error: "REGISTER_WIN_ERROR",
                            balance: user.balance
                        }
                    });
                }
            }
        }
    }
}

function calculateWinAmount(gameId, amount, numbers, winNumbers, roundId) {
    var matchCount = 0;
    var winAmount = 0;
    for (var i = 0; i < numbers.length; i++) {
        if (winNumbers.indexOf(numbers[i]) != -1) {
            matchCount++;
        }
    }
    for (var i in context.gameConfiguration.WinRates) {
        if (context.gameConfiguration.WinRates[i].Num == numbers.length) {
            var rates = context.gameConfiguration.WinRates[i].Rates;
            if (rates[matchCount - 1] > 0) {
                winAmount = amount * rates[matchCount - 1];
            }
        }
    }
    if (winAmount > 0) {
        try {
            var resultCode = context.accountingHelper.registerWin(gameId, settings.roundId, roundId, winAmount, winNumbers, "Win bet at round " + settings.roundId,
                function(seesionId, betObj, amount) {
                    notifyUser(seesionId, {
                        type: "win",
                        message: {
                            success: true,
                            status: stakeResultCodes.WIN,
                            round_id: settings.roundId,
                            win_sum: amount,
                            numbers: betObj,
                            balance: user.balance
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
            notifyUser(factor.sessionId, {
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
    return winAmount;
}

function completeBets(sessionId) {
    var user = context.getUserInfo(sessionId);
    try {
        context.accountingHelper.completeBets(sessionId, settings.roundId, function() {
        }, function() {
            context.logError("Complete bets failed.");
            var gameId;
            if (context.gameConfiguration.Mode === "Manual") {
                notifyUser(sessionId, {
                    type: "error",
                    target: "promt",
                    message: "Complete bets failed.",
                    balance: user.balance
                });
                gameId = sessionId;
                restartGame(sessionId);
            }
        });

    } catch (err) {
        context.logError("Complete bets failed.");
        context.logError(err);
    }
}

function createGame(sessionId) {
    bets[sessionId] = [];
    shuffledMap[sessionId] = getRng(sessionId).shuffle(physicalMap);
    if (!settings.history) {
        settings.history = {};
    }
    settings.history[sessionId] = [];
}

function getUserBets(sessionId) {
    var gameId, userBets = [];
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = sessionId;
    } else {
        gameId = context.gameConfiguration.Mode;
    }
    if (bets[gameId])
        bets[gameId].forEach(function (bet) {
            if (bet.sessionId == sessionId) {
                userBets.push(bet);
            }
        });
    return userBets;
}
function clearUserData(sessionId) {
    delete bets[sessionId];
    delete shuffledMap[sessionId];
    delete settings.history[sessionId];
}

var dispatcher = function messageDispatcher(sessionId, message) {
    var user = context.getUserInfo(sessionId);
    var gameId;
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = sessionId;
    } else {
        gameId = context.gameConfiguration.Mode;
    }
    if (!settings.roundId) {
        settings.roundId = context.roundCounter.current;
    }
    if (message.type == "bet") {
        if (!instanceEnabled) {
            return { success: false, balance: user.balance, error: "INSTANCE_DISABLED" };
        }
        var winNumbers = [];
        var winAmount = 0;
        var balance = user.balance;
        try {
            var amount = message.amount;
            var numbers = message.numbers;
            if (amount < (context.gameConfiguration.MinBet * user.locale.currencyMultiplier) || amount > (context.gameConfiguration.MaxBet * user.locale.currencyMultiplier)) {
                throw "LIMIT_REACHED";
            }
            var betResult = context.accountingHelper.registerBet(sessionId, settings.roundId, amount, numbers, "Bet at round " + settings.roundId);
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
            bets[gameId].push({
                round_id: settings.roundId,
                sessionId: sessionId,
                amount: amount,
                numbers: numbers,
                betId: betResult
            });
            balance = user.balance;
            if (context.gameConfiguration.Mode === "External" || context.gameConfiguration.Mode === "Auto") {

            } else {
                changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED });
                shuffledMap[gameId] = getRng(gameId).shuffle(physicalMap);
                winNumbers = shuffledMap[gameId].slice(0, 20);
                context.setTimeout(function () {
                    changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBERS, numbers: winNumbers });
                }, 30000);
            }

        } catch (e) {
            var result = { success: false, status: stakeResultCodes.FAILED, balance: user.balance, error: e.toString() };
            return result;
        }
        context.keepSessionAlive(sessionId);
        return {
            success: true, 
            status: stakeResultCodes.CONFIRMED,
            winNumbers: winNumbers,
            balance: balance,
            gameId: settings.roundId
        };
    }else if (message.type == "cancel_bet") {
        if (currentGameState[gameId] != gameStatusCode.OPENED) {
            return { success: false, balance: user.balance, error: "TABLE_CLOSED", bets: message.bets };
        }
        try {
            var cancelBets = [];
            cancelBets = bets[gameId].filter(function (bet) {
                return bet.sessionId == sessionId;
            }).filter(function (bet) {
                var eqNumbers = bet.numbers.length == message.bet.numbers.length && bet.numbers.every(function (v, i) { return v === message.bet.numbers[i] });
                return (eqNumbers && message.bet.amount === bet.amount);
            });
            var cancelBet = cancelBets[cancelBets.length - 1];
            context.log(cancelBet);
            var cancelResult = context.accountingHelper.cancelBet(sessionId, settings.roundId, cancelBet.amount, cancelBet.numbers);
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
            bets[gameId].splice(bets[gameId].indexOf(cancelBet), 1);  
        } catch (e) {
            return { success: false, balance: user.balance, error: e.toString(), bets: message.cancelBets };
        }
        return { success: true, balance: user.balance };
    }
};

game_initialize();
setMessageDispatcher(dispatcher);