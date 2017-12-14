var gameStatusCode = {
    CLOSED: 0,
    OPENED: 1,
    WINNUMBER: 3,
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
}
var currentGameState = {};
var currentGameRound = "";
var roundId = context.roundCounter.current;
var history = {};
var winners = {};
var settings = {};
var bets = {};
var nextStateTime = 0;
var criteria = context.gameConfiguration.Criteria;
var videoRng;
var physicalMap=[];
var shuffledMap = {};
var stateTimeout;
var instanceEnabled = true;
function game_initialize() {
    videoRng = context.rng.createNew();
    if (!context.gameConfiguration && !context.mediaHelper.vodData) {
        throw "GAME_NOT_CONFIGURED";
    }
    if (context.gameConfiguration.PhysicalMap) {
        var pMap = context.gameConfiguration.PhysicalMap.split(',');
        criteria.forEach(function(criteriaItem) {
            var exist = false;
            criteriaItem.Items.forEach(function(item) {
                pMap.forEach(function(pM) {
                    if (item.Value === pM.trim()) {
                        exist = true;
                    }
                });
            });
            if (!exist)
                throw "INCORRECT_PHYSICAL_MAP";
        });
        pMap.forEach(function(pM) {
            var exist = false;
            criteria.forEach(function(criteriaItem) {
                criteriaItem.Items.forEach(function(item) {
                    if (item.Value === pM.trim()) {
                        exist = true;
                    }
                });
            });
            if (!exist)
                throw "INCORRECT_PHYSICAL_MAP";
        });
        physicalMap = context.gameConfiguration.PhysicalMap.split(',');
    } else {
        criteria.forEach(function (f) {
            f.Items.forEach(function (item) {
                physicalMap.push(item.Value);
            });
        });
    }
    if ((!context.gameConfiguration.Mode)) {
        throw "GAME_MODE_NOT_SET";
    }
    settings = context.loadSettings();
    if (!settings) {
        settings = { gameState: -1, history: {}, roundId: context.roundCounter.current, startDate: null, endDate: null };
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
    } else if (context.gameConfiguration.Mode === "Auto") {
        gameStatusInterval(context.gameConfiguration.Mode);
    } else {
        runtime.isProvablyFair = true;
    }
    runtime.onServerMessage = OnServerMessage;
    context.log("Game server initialized!");
}
function OnServerMessage(message) {
    var roundId = context.roundCounter.current;
    if (currentGameState[context.gameConfiguration.Mode] === gameStatusCode.OPENED) {
        roundId = roundId - 1;
    }
    if (message && message.type) {
        switch (message.type) {
            case "override_round":
                if (context.gameConfiguration.Mode !== "External") {
                    throw "Game instance should be in External mode for this command.";
                }
                var roundBets = context.accountingHelper.getRoundBets(roundId);
                context.accountingHelper.cancelRound(roundId, false, function () {
                    var calcutaledBets = [];
                    calcutaledBets[gameId] = [];
                    roundBets.forEach(function (bet) {
                        calcutaledBets[gameId].push();
                        calcutaledBets[gameId].push({
                            round_id: settings.roundId,
                            sessionId: bet.sessionId,
                            factor: bet
                        });
                    });
                    findWinners("External", roundId, message.number, calcutaledBets);
                }, function () {
                    console.logError("Overide round error");
                });
                break;
            case "cancel_round":
                if (context.gameConfiguration.Mode !== "External") {
                    throw "Game instance should be in External mode for this command.";
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
        var gameState = message.state;
        switch (gameState) {
            case gameStatusCode.OPENED:
                context.sendMediaCommand("dice_show_winners", winners[context.gameConfiguration.Mode]);
                context.sendMediaCommand("dice_round_open", message.length);
                break;
            case gameStatusCode.CLOSED:
                context.sendMediaCommand("dice_round_close");
                break;
            case gameStatusCode.WINNUMBER:
                context.sendMediaCommand("dice_show_winner", message.number);
                break;
        }
        context.setTimeout(function () {
            changeGameState(message);
        }, runtime.externalDelay * 1000);
    });
}

function gameStatusInterval(gameId) {
    if (context.mediaHelper.mode == "VOD") {
        var videoTimeout;
        var part01Video, part02Video, p1Index, p2Index;
        var part1Files = context.mediaHelper.vodData.length_map['Part01'];
        part1Files = Object.keys(part1Files);
        p1Index = part1Files[videoRng.random(0, part1Files.length - 1)];
        part01Video = '/Part01/' + p1Index;
        var openRoundTime = (context.mediaHelper.getVODInfo(part01Video).length + context.mediaHelper.vodData.length_map['Place_Your_Bets']) * 1000;
        shuffledMap[gameId] = getRng(gameId).spin(physicalMap);
        changeGameState({ gameId: gameId, length: openRoundTime, state: gameStatusCode.OPENED });
        context.mediaHelper.playVOD(null, [part01Video, "No_More_Bets"]);
        nextStateTime = new Date(new Date().getTime() + openRoundTime);
        stateTimeout= context.setTimeout(function () {
            var part2FileList = context.mediaHelper.vodData.length_map['Part02'];
            var part2Files = [];
            var number = shuffledMap[gameId][0].trim();
            var numberIndex;
            if ((number + "").length == 1) {
                numberIndex = "00" + number;
            } else if ((number + "").length == 2)
                numberIndex = "0" + number;
            else {
                numberIndex = number;
            }
            for (key in part2FileList) {
                if (part2FileList.hasOwnProperty(key)) {
                    if (key.split("_")[0] == numberIndex) {
                        part2Files.push(key);
                    }
                }
            }
            p2Index = part2Files[videoRng.random(0, part2Files.length - 1)];
            part02Video = '/Part02/' + p2Index;
            videoTimeout = Math.floor(context.mediaHelper.vodData.length_map['No_More_Bets'] + Math.floor(part2FileList[p2Index])) * 1000;
            changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED });
            context.mediaHelper.playVOD(null, [{ name: part02Video, wait_previous: 3 }, "Place_Your_Bets"]);
            nextStateTime = new Date(new Date().getTime() + videoTimeout);
            stateTimeout=  context.setTimeout(function () {
                changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, number: number });
                nextStateTime = new Date(new Date().getTime() + 1500);
                stateTimeout=  context.setTimeout(function () {
                    if (gameId == "Auto")
                        gameStatusInterval(gameId);
                }, 1500);
            }, videoTimeout);
        }, openRoundTime - 500);
    } else {
        var openRoundTime = context.mediaHelper.virtualData.betsLength * 1000;
        var playTime = context.mediaHelper.virtualData.gameLength * 1000;
        shuffledMap[gameId] = getRng(gameId).spin(physicalMap);
        changeGameState({ gameId: gameId, length: openRoundTime, state: gameStatusCode.OPENED });
        context.mediaHelper.sendVirtualCommand(null, {
            "type": "unity",
            "state": 0
        });
        stateTimeout=  context.setTimeout(function () {
            var number = shuffledMap[gameId][0].trim();
            context.mediaHelper.sendVirtualCommand(null, {
                "state": 1,
                "time": context.mediaHelper.virtualData.gameLength - 3,
                "result": number
            });
            changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED });
            stateTimeout=    context.setTimeout(function () {
                changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, number: number });
                stateTimeout=    context.setTimeout(function () {
                     gameStatusInterval(gameId);
                }, 2000);
            }, playTime);
        }, openRoundTime);
    }
}

function gameStatusManual(gameId) {
    if (context.mediaHelper.mode == "VOD") {
        var videoTimeout;
        var part02Video, p2Index;
        var part2FileList = context.mediaHelper.vodData.length_map['Part02'];
        var part2Files = [];
        var finalShuffledMap = getRng(gameId).finalSpin(shuffledMap[gameId]);
        var number = finalShuffledMap[0].trim();
        var numberIndex;
        if ((number + "").length == 1) {
            numberIndex = "00" + number;
        } else if ((number + "").length == 2)
            numberIndex = "0" + number;
        else {
            numberIndex = number;
        }
        for (key in part2FileList) {
            if (part2FileList.hasOwnProperty(key)) {
                if (key.split("_")[0] == numberIndex) {
                    part2Files.push(key);
                }
            }
        }
        p2Index = part2Files[videoRng.random(0, part2Files.length - 1)];
        part02Video = '/Part02/' + p2Index;
        videoTimeout = Math.floor(part2FileList[p2Index]) * 1000;
        changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED });

        if (context.gameConfiguration.HasSpinVideo) {
            var part1Files =context.mediaHelper.vodData.length_map['Part01'];
            part1Files = Object.keys(part1Files);
            var p1Index = part1Files[videoRng.random(0, part1Files.length - 1)];
            videoTimeout += context.mediaHelper.getVODInfo("No_More_Bets").length * 1000;
            var part01Video = '/Part01/' + p1Index;
            videoTimeout += context.mediaHelper.getVODInfo(part01Video).length * 1000;
            context.mediaHelper.playVOD(gameId, [part01Video,"No_More_Bets", { name: part02Video, wait_previous: 3 }]);
        } else {
            context.mediaHelper.playVOD(gameId, [{ name: part02Video, wait_previous: 3 }]);
        }

        stateTimeout= context.setTimeout(function () {
            changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, number: number });
            stateTimeout= context.setTimeout(function () {
                if (context.mediaHelper.getVODInfo("Idle")) {
                    context.mediaHelper.playVOD(gameId, [{ name: "Idle", loop: true }]);
                    changeGameState({ gameId: gameId, length: null, state: gameStatusCode.OPENED });
                    shuffledMap[gameId] = getRng(gameId).spin(physicalMap);
                } else {
                    context.mediaHelper.playVOD(gameId, ["Place_Your_Bets"]);
                    videoTimeout = context.mediaHelper.getVODInfo("Place_Your_Bets").length * 1000;
                    stateTimeout = context.setTimeout(function () {
                        stateTimeout = null;
                        changeGameState({ gameId: gameId, length: null, state: gameStatusCode.OPENED });
                        shuffledMap[gameId] = getRng(gameId).spin(physicalMap);
                        var user = context.getUserInfo(gameId);
                         context.mediaHelper.showScreen(gameId, "WINNERS");
                    }, videoTimeout);
                }
            }, 1500);
        }, videoTimeout);
    } else {
        var playTimeout = context.mediaHelper.virtualData.gameLength * 1000;
        var finalShuffledMap = getRng(gameId).finalSpin(shuffledMap[gameId]);
        var number = finalShuffledMap[0].trim();
        changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED });
        context.mediaHelper.sendVirtualCommand(gameId, {
            "state": 1,
            "time": context.mediaHelper.virtualData.gameLength - 3,
            "result": number
        });
        stateTimeout = context.setTimeout(function () {
            changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, number: number });
            stateTimeout = context.setTimeout(function () {
                changeGameState({ gameId: gameId, length: null, state: gameStatusCode.OPENED });
                stateTimeout = null;
                shuffledMap[gameId] = getRng(gameId).spin(physicalMap);
                context.mediaHelper.sendVirtualCommand(gameId, {
                    "state": 0
                });
            }, 2000);
        }, playTimeout);
    }
}

function findWinners(gameId, winNumber, gameContext,roundBets) {
    winners[gameId] = [];
    for (var i in roundBets) {
        if (roundBets.hasOwnProperty(i)) {
            var factor = roundBets[i].factor;
            var winFactors = [];
            var user = context.getUserInfo(roundBets[i].sessionId);
                    var winSum = 0;
                    var criteriaItem;
                    criteria.forEach(function(v) {
                        if (v.Id == factor.criteria.Id) {
                            criteriaItem = v;
                        }
                    });
                    var result = false;
                    criteriaItem.Items.forEach(function(item) {
                        if (item.CriteriaType == "Equal") {
                            result = gameContext[item.Field] == item.Value;
                        } else if (item.CriteriaType == "More") {
                            result = gameContext[item.Field] > item.Value;
                        }else if (item.CriteriaType == "Less") {
                            result = gameContext[item.Field] < item.Value;
                        }
                    });
                    if (result) {
                        winSum = factor.amount * criteriaItem.WinRate;
                        if (winSum > 0) {
                            try {
                                var amount = winSum;
                                winFactors.push(criteriaItem);
                                var resultCode = context.accountingHelper.registerWin(roundBets[i].sessionId, settings.roundId, factor.roundBetId, amount, factor, "Win bet at round " + settings.roundId,
                                 function (seesionId, betObj, amount) {
                                     notifyUser(seesionId, {
                                        type: "win",
                                        message: {
                                            success: true,
                                            factors: [betObj],
                                            status: stakeResultCodes.WIN,
                                            round_id: settings.roundId,
                                            win_sum: amount,
                                            win_number: winNumber,
                                            win_factors: [betObj],
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
                                    case betErrorCodes.FATAL_ERROR: {
                                        throw "FATAL_ERROR";
                                    }
                                        break;
                                    case betErrorCodes.INVALID_AMOUNT: {
                                        throw "INVALID_AMOUNT";
                                    }
                                        break;
                                    case betErrorCodes.SESSION_NOT_FOUND: {
                                        throw "SESSION_NOT_FOUND";
                                    }
                                        break;
                                }
                            } catch (e) {
                                context.log('Find winners error:');
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

                        winners[gameId].push([user.nick, user.locale.currencySign + winSum]);
                    } 
                    factor.win_sum = winSum;
        }      
    }
}
function completeBets(sessionId) {
    var user = context.getUserInfo(sessionId);
    try {
        context.accountingHelper.completeBets(sessionId, settings.roundId, function() {
        }, function() {
            context.logError("Complete bets failed.")
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

    } catch (err) {
        context.logError("Complete bets failed.");
        context.logError(err);
    }
}
function changeGameState(gameContext) {
    var gameState = gameContext.state;
    var gameId,sessionId=null;
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = gameContext.gameId;
        sessionId = gameContext.gameId;
    } else {
        gameId = context.gameConfiguration.Mode;
    }
    if(!settings.roundId){
        settings.roundId = context.roundCounter.current;
    }
    if (currentGameState[gameId] != gameState) {
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
            settings.endDate = length ? new Date(settings.startDate.getTime() + length) : null;
            if (context.gameConfiguration.Mode === "Manual") {
                notifyUser(gameContext.gameId, {
                    type: "status",
                    message: {
                        status: gameStatusCode.OPENED,
                        round_id: roundId,
                        startDate: settings.startDate,
                        endDate: settings.endDate,
                        length: length / 1000
                    }
                });
            } else {
                runtime.setRoundLength(length / 1000);
                notifyAll({
                    type: "status",
                    message: {
                        status: gameStatusCode.OPENED,
                        round_id: roundId,
                        startDate: settings.startDate,
                        endDate: settings.endDate,
                        length: length / 1000
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
        } else if (gameState == gameStatusCode.WINNUMBER) {
            settings.endDate = context.date;
            var winNumber = gameContext.number;
            settings.winNumber = winNumber;

            if (context.gameConfiguration.Mode === "Manual") {
                notifyUser(gameContext.gameId, {
                    type: "status",
                    message: {
                        status: gameStatusCode.WINNUMBER,
                        win_number: winNumber,
                        round_id: settings.roundId
                    }
                });
            } else {
                context.cleanupMessages();
                notifyAll({
                    type: "status",
                    message: {
                        status: gameStatusCode.WINNUMBER,
                        win_number: winNumber,
                        round_id: settings.roundId
                    }
                });
            }
            findWinners(gameId, winNumber, gameContext, bets[gameId]);
            showWinners(winners);
            winners = [];
            runtime.setGameState(sessionId, 'WINNING', "Winning number: " + winNumber);
            context.accountingHelper.registerRoundResult(settings.roundId, winNumber);
            context.accountingHelper.finishRound(settings.roundId);
            settings.roundId = context.roundCounter.increase();
            bets[gameId] = [];
        }
        if (context.gameConfiguration.Mode != "Manual") {
            context.saveSettings(settings);
        }
    }
}

function createGame(sessionId) {
    currentGameState[sessionId] = "";
    bets[sessionId] = [];
    shuffledMap[sessionId] = getRng(sessionId).spin(physicalMap);
    if (!settings.history) {
        settings.history = {};
    }
    settings.history[sessionId] = [];
}

function clearUserData(sessionId) {
    if (currentGameState[sessionId] === gameStatusCode.OPENED && bets[sessionId].length > 0) {
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
    delete shuffledMap[sessionId];
    delete settings.history[sessionId];
    delete currentGameState[sessionId];
}

function getUserBets(sessionId) {
    var gameId, userBets = [];
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = sessionId;
    } else {
        settings.history = history;
        gameId = context.gameConfiguration.Mode;
    }
    if(bets[gameId])
     bets[gameId].forEach(function (bet) {
        if (bet.sessionId == sessionId) {
            userBets.push(bet.factor);
        }
       });
    return userBets;
}
function restartGame(sessionId) {
        if (stateTimeout)
            context.clearTimeout(stateTimeout);
        shuffledMap[sessionId] = getRng(sessionId).spin(physicalMap);
        stateTimeout = context.setTimeout(function () {
            changeGameState({ gameId: sessionId, length: null, state: gameStatusCode.OPENED, videos: [] });
            if (context.mediaHelper.getVODInfo("Idle")) {
                if (context.mediaHelper.mode == "VOD") {
                    context.mediaHelper.playVOD(sessionId, [{ name: "Idle", loop: true }]);
                }
            } else {
                if (context.mediaHelper.mode == "VOD") {
                    context.mediaHelper.showScreen(sessionId, "WINNERS");
                } else {
                    context.mediaHelper.sendVirtualCommand(sessionId, {
                        "type": "unity",
                        "state": 0
                    });
                }
            }
        }, 2000);
        bets[sessionId] = {};
    }
function makeBetObject(bet) {
    return { Id: bet.Id, Title: bet.criteria.Title, Items: bet.criteria.Items };
}

var dispatcher = function messageDispatcher(sessionId, message) {
    var user = context.getUserInfo(sessionId);
    var gameId;
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = sessionId;
    } else {
        gameId = context.gameConfiguration.Mode;
    }
    if(!settings.roundId){
        settings.roundId = context.roundCounter.current;
    }
    if (message.type == "stake") {
        if (currentGameState[gameId] == gameStatusCode.OPENED || !instanceEnabled) {
            try {
                var criteriaItem, factorAmount = message.factor.amount;
                criteria.forEach(function (v) {
                    if (v.Id == message.factor.criteria.Id) {
                        criteriaItem = v;
                    }
                });
                if (factorAmount < (criteriaItem.MinBet * user.locale.currencyMultiplier) || factorAmount > (criteriaItem.MaxBet*user.locale.currencyMultiplier)) {
                        throw "LIMIT_REACHED";
                }
                var betResult = context.accountingHelper.registerBet(sessionId, settings.roundId, message.factor.amount, makeBetObject(message.factor), "Bet at round " + settings.roundId);
                switch (betResult) {
                    case betErrorCodes.FATAL_ERROR: {
                        throw "FATAL_ERROR";
                    }
                        break;
                    case betErrorCodes.INVALID_AMOUNT: {
                        throw "INVALID_AMOUNT";
                    }
                        break;
                    case betErrorCodes.INSUFFICIENT_FUNDS: {
                        throw "INSUFFICIENT_FUNDS";
                    }
                        break;
                    case betErrorCodes.SESSION_NOT_FOUND: {
                        throw "SESSION_NOT_FOUND";
                    }
                        break;
                }
                message.factor.roundBetId = betResult;
                bets[gameId].push({
                    round_id: settings.roundId,
                    sessionId: sessionId,
                    factor: message.factor
                });
                } catch(e) {
                    var result = { success: false, status: stakeResultCodes.FAILED, balance: user.balance, error: e.toString(), factors: message.factors };
                    return result;
                }
                return {
                    success: true,
                    status: stakeResultCodes.CONFIRMED,
                    factors: message.factor,
                    balance: user.balance
                }
        } else {
            return {
                success: false,
                status: stakeResultCodes.FAILED,
                factors: message.factors,
                balance: user.balance
            };
        }
    }
    else if (message.type == "cancel_last") {
        if (currentGameState[gameId] != gameStatusCode.OPENED) {
            return { success: false, balance: user.balance, error: "TABLE_CLOSED" };
        }
        var userBets = [];
        if (bets[gameId])
            bets[gameId].forEach(function (bet) {
                if (bet.sessionId == sessionId) {
                    userBets.push(bet);
                }
            });
        if (userBets.length > 0) {
            try {
                var cancelResult = context.accountingHelper.cancelBet(sessionId, settings.roundId, message.bet.amount, makeBetObject(message.bet));
                switch (cancelResult) {
                    case betErrorCodes.FATAL_ERROR: {
                        throw "FATAL_ERROR";
                    }
                        break;
                    case betErrorCodes.INVALID_AMOUNT: {
                        throw "INVALID_AMOUNT";
                    }
                        break;
                    case betErrorCodes.SESSION_NOT_FOUND: {
                        throw "SESSION_NOT_FOUND";
                    }
                        break;
                }
                bets[gameId].splice(bets[gameId].length-1, 1);
            } catch (e) {
                return { success: false, balance: user.balance, error: e.toString(), bets: factors};
            }
            return {
                success: true,
                balance: user.balance
            };
        } else {
            return {
                success: false,
                balance: user.balance
            };
        }
    } else if (message.type == "cancel_all") {
        if (currentGameState[gameId] != gameStatusCode.OPENED) {
            return { success: false, balance: user.balance, error: "TABLE_CLOSED"};
        }
        var  userBets = [];
         if (bets[gameId])
            bets[gameId].forEach(function (bet) {
                if (bet.sessionId == sessionId) {
                    userBets.push(bet);
                }
            });
         if (userBets.length > 0) {
            try {
                var cancelResult = context.accountingHelper.cancelBetsByUser(sessionId, settings.roundId);
                switch (cancelResult) {
                    case betErrorCodes.FATAL_ERROR: {
                        throw "FATAL_ERROR";
                    }
                        break;
                    case betErrorCodes.INVALID_AMOUNT: {
                        throw "INVALID_AMOUNT";
                    }
                        break;
                    case betErrorCodes.SESSION_NOT_FOUND: {
                        throw "SESSION_NOT_FOUND";
                    }
                        break;
                }
                userBets.forEach(function (bet) {
                    if (bet.sessionId == sessionId) {
                        bets[gameId].splice(bets[gameId].indexOf(bet), 1);
                    }
                });
            } catch (e) {
                return { success: false, balance: user.balance, error: e.toString(), bets: f };
            }
            return {
                success: true,
                balance: user.balance
            };
        } else {
            return {
                success: false,
                balance: user.balance
            };
        }
    } else if (message.type == "refresh_user_data") {
        return { success: true, user: user };
    } else if (message.type == "start_game") {
        if (currentGameState[gameId] != gameStatusCode.OPENED) {
            return { success: false, balance: user.balance, error: "GAME_ALREADY_BEGUN", bets: message.bets };
        }
        if (context.gameConfiguration.Mode != "Manual") {
            return { success: false, balance: user.balance, error: "INCORRECT_MODE", bets: message.bets };
        }
        if (!instanceEnabled) {
            return { success: false, balance: user.balance, error: "INSTANCE_DISABLED", bets: message.bets };
        }
        gameStatusManual(sessionId);
        context.keepSessionAlive(sessionId);
        return { success: true, balance: user.balance };
    }
};

game_initialize();
setMessageDispatcher(dispatcher);