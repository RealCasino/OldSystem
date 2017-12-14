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
var currentGameState = {};
var currentGameRound = "";
var roundId = 0;
var currentStakes = {};
var history = {};
var winners = [];
var settings = {};
var bets = {};
var nextStateTime = 0;
var criteria = context.gameConfiguration.Criteria;
var videoRng;

function game_initialize() {

    videoRng = context.rng.createNew();

    if ((!context.gameConfiguration && !context.gameConfiguration.VOD && !context.gameConfiguration.VOD.length_map)) {
        throw "GAME_NOT_CONFIGURED";
    }
    if ((!context.gameConfiguration.Mode)) {
        throw "GAME_MODE_NOT_SET";
    }
    settings = context.loadSettings();
    if (!settings) {
        settings = { gameState: -1, history: {}, roundId: 0, startDate: null, endDate: null };
    }
    if (context.gameConfiguration.Mode === "External" || context.gameConfiguration.Mode === "Auto") {
        currentGameState[context.gameConfiguration.Mode] = settings.gameState;
        bets[context.gameConfiguration.Mode] = [];
        winners[context.gameConfiguration.Mode] = [];
    }
    if (context.gameConfiguration.Mode === "External") {
        var datasource = context.getExchangeData();
        datasource.onChangeEvent = onChangeGameState;
    } else if (context.gameConfiguration.Mode === "Auto") {
        gameStatusInterval(context.gameConfiguration.Mode);
    }
    context.log("Game server initialized!");
}

function onChangeGameState(datasource) {
    var messages = datasource.pick();
    messages.forEach(function(message) {
        changeGameState(message);
    });
}

function gameStatusInterval(gameId) {
    var videoTimeout;
    var part01Video, part02Video, p1Index, p2Index;
    var part1Files = context.gameConfiguration.VOD.length_map['Part01'];
    p1Index = videoRng.random(0, Object.keys(part1Files).length - 1);
    var openRoundTime = (part1Files[p1Index] + context.gameConfiguration.VOD.length_map['Place_Your_Bets']) * 1000;
    part01Video = '/Part01/' + p1Index;
    changeGameState({ gameId: gameId, length: openRoundTime, state: gameStatusCode.OPENED});
    context.mediaHelper.playVOD(null, ["Place_Your_Bets", part01Video]);
    nextStateTime = new Date(new Date().getTime() + openRoundTime);
    context.setTimeout(function() {
        var part2FileList = context.gameConfiguration.VOD.length_map['Part02'];
        var part2Files = [];
        var factors = [];
        criteria.forEach(function(f) {
            f.Items.forEach(function(item) {
                factors.push(item.Value);
            });
        });
        var number = factors[getRng(gameId).random(0, factors.length - 1)];
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
        videoTimeout = Math.floor(context.gameConfiguration.VOD.length_map['No_More_Bets'] + Math.floor(part2FileList[p2Index])) * 1000;
        changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED});
        context.mediaHelper.playVOD(null, ["No_More_Bets", part02Video]);
        nextStateTime = new Date(new Date().getTime() + videoTimeout);
        context.setTimeout(function () {
            changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, number: number });
            nextStateTime = new Date(new Date().getTime() + 1500);
            context.setTimeout(function () {
                if (gameId == "Auto")
                    gameStatusInterval(gameId);
            }, 1500);
        }, videoTimeout - 2000);
    }, openRoundTime - 500);
}

function gameStatusManual(gameId) {
    var videoTimeout;
    var part02Video, p2Index;
    var part2FileList = context.gameConfiguration.VOD.length_map['Part02'];
    var part2Files = [];
    var factors = [];
    criteria.forEach(function(f) {
        f.Items.forEach(function(item) {
            factors.push(item.Value);
        });
    });
    var number = factors[getRng(gameId).random(0, factors.length - 1)];
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
        var part1Files = context.gameConfiguration.VOD.length_map['Part01'];
        var p1Index = videoRng.random(0, Object.keys(part1Files).length - 1);
        videoTimeout += part1Files[p1Index] * 1000;
        var part01Video = '/Part01/' + p1Index;
        context.mediaHelper.playVOD(null, [part01Video, part02Video]);
    } else {
        context.mediaHelper.playVOD(null, [part02Video]);
    }
    
    context.setTimeout(function () {
        changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, number: number });
        context.setTimeout(function() {
            context.mediaHelper.playVOD(gameId, ["Place_Your_Bets"]);
            videoTimeout = context.mediaHelper.getVODInfo("Place_Your_Bets").length * 1000;
            context.setTimeout(function () {
                changeGameState({ gameId: gameId, length: null, state: gameStatusCode.OPENED });
                context.mediaHelper.showScreen(gameId, "WINNERS");
            }, videoTimeout);
        }, 1500);
    }, videoTimeout - 2000);
}


function findWinners(gameId, winNumber, gameContext) {
    for (var userSessionId in currentStakes) {
        var totalWin = 0;
        if (currentStakes.hasOwnProperty(userSessionId)) {
            var stake = currentStakes[userSessionId].stake;
            var winFacors = [];
            if (stake.round_id == settings.roundId) {
                var user = context.getUserInfo(userSessionId);
                stake.factors.forEach(function(factor) {
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
                        }
                        if (item.CriteriaType == "Less") {
                            result = gameContext[item.Field] < item.Value;
                        }
                    });
                    if (result) {
                        winSum = factor.amount * criteriaItem.WinRate;
                        totalWin += winSum;
                        context.registerWin(userSessionId, winSum, factor, "Win bet at round " + settings.roundId);
                        winFacors.push(criteriaItem);
                        winners.push({ name: user.nick, winSum: winSum });
                    }
                    factor.win_sum = winSum;
                });
                if (totalWin > 0) {
                    context.log("win:", totalWin + "userSessionId:" + userSessionId);
                    notifyUser(userSessionId, {
                        type: "win",
                        message: {
                            factors: stake.factors,
                            status: stakeResultCodes.WIN,
                            round_id: settings.roundId,
                            win_sum: totalWin,
                            win_number: winNumber,
                            win_facors: winFacors,
                            balance: user.balance
                        }
                    });
                }
            }
        }
        delete currentStakes[userSessionId];
    }
    context.registerLosses();
    if (context.gameConfiguration.Mode === "Manual")
        context.registerLossesForSession(gameId);
    else
        context.registerLosses();
}

function changeGameState(gameContext) {
    var gameState = gameContext.state;
    var gameId;
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = gameContext.gameId;
    } else {
        gameId = context.gameConfiguration.Mode;
    }
    if (currentGameState[gameId] != gameState) {
        context.log("Game status changed! Notify All. Status:" + gameState);
        settings.gameState = gameState;
        currentGameState[gameId] = gameState;
        runtime.keepAlive();
        if (gameState == gameStatusCode.OPENED) {
            var length = null;
            if (roundId != settings.roundId)
                bets[gameId] = [];
            roundId = settings.roundId?settings.roundId:0;
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
            runtime.setGameState('OPENED', "Opened round: " + settings.roundId);
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
            runtime.setGameState('CLOSED', "Closed round: " + settings.roundId);
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
            findWinners(gameId, winNumber, gameContext);
            showWinners(winners);
            winners = [];
            runtime.setGameState('WINNING', "Winning number: " + winNumber);
            settings.roundId = parseInt(roundId) + 1;
        }
        context.saveSettings(settings);
    }
}

function createGame(sessionId) {
    currentGameState[sessionId] = "";
    bets[sessionId] = [];
    if (!settings.history) {
        settings.history = {};
    }
    settings.history[sessionId] = [];
}

function clearUserData(sessionId) {
    delete bets[sessionId];
    delete settings.history[sessionId];
    delete currentGameState[sessionId];
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
    if (message.type == "stake") {
        if (currentGameState[gameId] == gameStatusCode.OPENED) {
            message.factors.forEach(function(f) {
                if (!currentStakes[sessionId]) {
                    currentStakes[sessionId] = {
                        stake: {
                            round_id: settings.roundId,
                            factors: message.factors
                        }
                    };
                } else {
                    var factors = currentStakes[sessionId].stake.factors.filter(function(el) {
                        return el.Id == f.Id;
                    });
                    if (factors.length > 0) {
                        factors[0].amount += f.amount;
                    } else {
                        currentStakes[sessionId].stake.factors.push(f);
                    }
                }
                try {
                    if (context.registerBet(sessionId, f.amount, makeBetObject(f), "Bet at round " + settings.roundId) != 0) {
                        throw "INSUFFICIENT_FUNDS";
                    }
                } catch(e) {
                    var result = { success: false, status: stakeResultCodes.FAILED, balance: user.balance, error: e.toString(), factors: message.factors };
                    return result;
                }
            });
            return {
                success: true,
                status: stakeResultCodes.CONFIRMED,
                factors: message.factors,
                balance: user.balance
            }
        } else {
            return {
                success: true,
                status: stakeResultCodes.FAILED,
                factors: message.factors,
                balance: user.balance
            };
        }
    } else if (message.type == "cancel_last") {
        if (currentGameState[gameId] != gameStatusCode.OPENED) {
            return { success: false, balance: user.balance, error: "TABLE_CLOSED" };
        }
        if (currentStakes[sessionId] && currentStakes[sessionId].stake.factors.length > 0) {
            var factors = currentStakes[sessionId].stake.factors.filter(function(f) {
                return f.Id == message.bet.Id;
            });
            try {
                if (context.cancelBet(sessionId, message.bet.amount, makeBetObject(message.bet)) != 0) {
                    throw "ROLLBACK_ERROR";
                }
                if (factors[0].amount > message.bet.amount) {
                    factors[0].amount -= message.bet.amount;
                } else {
                    currentStakes[sessionId].stake.factors.splice(currentStakes[sessionId].stake.factors.indexOf(factors[0], 1));
                }
            } catch(e) {
                return { success: false, balance: user.balance, error: e.toString(), bets: factor };
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
        if (currentStakes[sessionId] && currentStakes[sessionId].stake.factors.length > 0) {
            currentStakes[sessionId].stake.factors.forEach(function(f, i) {
                try {
                    if (context.cancelBet(sessionId, f.amount, makeBetObject(f)) != 0) {
                        throw "ROLLBACK_ERROR";
                    }
                } catch(e) {
                    return { success: false, balance: user.balance, error: e.toString(), bets: f };
                }
            });
            delete currentStakes[sessionId];
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
    } else if (message.type == "start_game") {
        if (currentGameState[gameId] === gameStatusCode.OPEN || currentGameState[gameId] === gameStatusCode.CLOSED) {
            return { success: false, balance: user.balance, error: "GAME_ALREADY_BEGUN", bets: message.bets };
        }
        gameStatusManual(sessionId);
        return { success: true, balance: user.balance };
    }
};

game_initialize();
setMessageDispatcher(dispatcher);