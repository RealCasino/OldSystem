var VOD_TIMEOUT = 1000;
var gameStatusCode = {
    OPENED: "1",
    CLOSED: "0",
    WINNUMBER: "3",
    CANCELED: "6"
};
var betErrorCodes = {
    FATAL_ERROR: -1,
    SESSION_NOT_FOUND: -2,
    INVALID_AMOUNT: -3,
    INSUFFICIENT_FUNDS: -4
};
var blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
var physicalMap = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
var currentGameState = {};
var bets = {};
var winners = {};
var settings = {};
var statistics = {};
var videoTimeout = 0;
var nextStateTime = 0;
var openRoundTime = 0;
var roundId = context.roundCounter.current;
var spinDirection = "CW";
var history = {};
var videoRng;
var shuffledMap = {};
var stateTimeout;
var instanceEnabled = true;

function game_initialize() {
     
    videoRng = context.rng.createNew();

    if (!context.gameConfiguration && !context.mediaHelper.vodData) {
        throw "GAME_NOT_CONFIGURED";
    }
    if ((!context.gameConfiguration.Mode)) {
        throw "GAME_MODE_NOT_SET";
    }
    settings = context.loadSettings();
    if (!settings) {
        settings = { gameState: -1, history: {}, roundId: context.roundCounter.current, startDate: null, endDate: null };
    }
    if (context.gameConfiguration.Mode === "External" || context.gameConfiguration.Mode === "Auto") {
        if (!settings.gameState || settings.gameState < 0) {
            currentGameState[context.gameConfiguration.Mode] = gameStatusCode.CLOSED;
        } else {
            currentGameState[context.gameConfiguration.Mode] = settings.gameState;
        }
        bets[context.gameConfiguration.Mode] = [];
        winners[context.gameConfiguration.Mode] = [];
        statistics[context.gameConfiguration.Mode] = [];
        history[context.gameConfiguration.Mode] = settings.history[context.gameConfiguration.Mode];
        recalculateStatistics(context.gameConfiguration.Mode);
        runtime.setGameMode({ "keepalive": true });
        runtime.keepAlive();
        runtime.isMultiplayer = true;
    } else {
        runtime.isMultiplayer = false;
    }
    if (context.gameConfiguration.Mode === "External") {
        if (currentGameState[context.gameConfiguration.Mode] == gameStatusCode.OPENED) {
            runtime.setGameState(null, "OPENED", "Opened round: " + settings.roundId);
        } else if (currentGameState[context.gameConfiguration.Mode] == gameStatusCode.CLOSED) {
            runtime.setGameState(null, "CLOSED", "Closed round: " + settings.roundId);
        } else if (currentGameState[context.gameConfiguration.Mode] == gameStatusCode.WINNUMBER) {
            runtime.setGameState(null, "WINNING", "Winning number:");
        } else if (currentGameState[context.gameConfiguration.Mode] == gameStatusCode.CANCELED) {
            runtime.setGameState(null, "CANCELLED", "Round cancelled. RoundID:" + settings.roundId);
        }
        var datasource = context.getExchangeData();
        datasource.onChangeEvent = onChangeGameState;
    } else if (context.gameConfiguration.Mode === "Auto") {
        gameStatusInterval(context.gameConfiguration.Mode);
    } else {
        runtime.isProvablyFair = true;
    }
    context.log("Roulette server initialized");
    context.log(runtime.externalDelay);

    runtime.onServerMessage = OnServerMessage;
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
            if (message.roundId) {
                roundId = message.roundId;
            }
            var roundBets = context.accountingHelper.getRoundBets(roundId);
            context.accountingHelper.cancelRound(roundId, false, function() {
                var calcutaledBets = [];
                roundBets.forEach(function(bet) {
                    bet.betData.amount = bet.amount;
                    calcutaledBets.push({ sessionId: bet.sessionId, betInfo: bet.betData });
                });
                findWinners("External", roundId, message.result, calcutaledBets);
                context.accountingHelper.registerRoundResult(roundId, message.result);
            }, function() {
                console.logError("Overide round error");
            });
            break;
        case "cancel_round":
            if (context.gameConfiguration.Mode !== "External") {
                throw "Game instance should be in External mode for this command.";
            }
            if (message.roundId) {
                roundId = message.roundId;
            }
            context.accountingHelper.cancelRound(roundId, true, function() {
                context.log("Cancel round success");
            }, function() {
                context.logError("Cancel round error");
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
            var user = context.getUserInfo(message.sessionId);
            context.log(message);
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

function getColumn(number) {
    return (number - 1) % 3;
}

function getDozen(number) {
    return Math.floor((number - 1) / 12);
}

function getEvensOdds(number) {
    return number == 0 ? 0 : number % 2 == 1 ? 2 : 1;
}

function getHighLow(number) {
    return number == 0 ? 0 : number > 18 ? 2 : 1;
}

function getColor(number) {
    return number == 0 ? 0 : (blackNumbers.indexOf(number) >= 0 ? 2 : 1);
}

function createGame(sessionId) {
    currentGameState[sessionId] = "";
    bets[sessionId] = [];
    winners[sessionId] = [];
    statistics[sessionId] = [];
    history[sessionId] = [];
    shuffledMap[sessionId] = getRng(sessionId).spin(physicalMap);
    recalculateStatistics(sessionId);
    for (var i = 0; i < 300; i++) {
        var number = physicalMap[getRng(sessionId).random(0, physicalMap.length - 1)];
        history[sessionId].push(number);
    }
    recalculateStatistics(sessionId);
}

function recalculateStatistics(gameId) {
    var frequencyMap = [];
    var columnMap = [0, 0, 0];
    var dozenMap = [0, 0, 0];
    var colorMap = [0, 0, 0];
    var highLowMap = [0, 0, 0];
    var evenOddsMap = [0, 0, 0];
    if (!history[gameId])
        history[gameId] = [];
    var count = history[gameId].length;
    for (var i = 0; i < 37; i++) {
        frequencyMap.push({ number: i, count: 0, lastHit: 0 });
    }

    var nonZeroCount = 0;
    for (var i = 0; i < count; i++) {
        var number = parseInt(history[gameId][i]);
        if (number >= 0 && number < 37) {
            frequencyMap[number].count++;
            frequencyMap[number].lastHit = (i < frequencyMap[number].lastHit || frequencyMap[number].lastHit == 0) ? i + 1 : frequencyMap[number].lastHit;
            if (number != 0) {
                dozenMap[getDozen(number)]++;
                columnMap[getColumn(number)]++;
                nonZeroCount++;
            }
            evenOddsMap[getEvensOdds(number)]++;
            highLowMap[getHighLow(number)]++;
            colorMap[getColor(number)]++;
        }
    }
    frequencyMap.sort(function compare(a, b) {
        return a.count == b.count ? 0 : a.count > b.count ? 1 : -1;
    });
    var hotField = frequencyMap.splice(-10);
    frequencyMap.sort(function compare(a, b) {
        return a.lastHit == b.lastHit ? 0 : a.lastHit < b.lastHit ? 1 : -1;
    });
    var coldField = frequencyMap.slice(0, 10);
    hotField.reverse();

    var highLowField = { zero: 33.3, high: 33.3, low: 33.3 };
    var evenOddsField = { zero: 33.3, even: 33.3, odds: 33.3 };
    var colorField = { zero: 33.3, red: 33.3, black: 33.3 };
    var columnField = { first: 33.3, second: 33.3, third: 33.3 };
    var dozenField = { first: 33.3, second: 33.3, third: 33.3 };
    if (count > 0) {
        highLowField = { zero: 100 * highLowMap[0] / count, high: 100 * highLowMap[2] / count, low: 100 * highLowMap[1] / count };
        evenOddsField = { zero: 100 * evenOddsMap[0] / count, even: 100 * evenOddsMap[1] / count, odds: 100 * evenOddsMap[2] / count };
        colorField = { zero: 100 * colorMap[0] / count, red: 100 * colorMap[1] / count, black: 100 * colorMap[2] / count };
    }
    if (nonZeroCount != 0) {
        columnField = { first: 100 * columnMap[0] / nonZeroCount, second: 100 * columnMap[1] / nonZeroCount, third: 100 * columnMap[2] / nonZeroCount };
        dozenField = { first: 100 * dozenMap[0] / nonZeroCount, second: 100 * dozenMap[1] / nonZeroCount, third: 100 * dozenMap[2] / nonZeroCount };
    }

    statistics[gameId] = { count: count, hotNumbers: hotField, coldNumbers: coldField, colors: colorField, highLow: highLowField, evenOdds: evenOddsField, columns: columnField, dozens: dozenField };
}

function makeBetObject(bet) {
    return { type: bet.betInfo.type, items: bet.betInfo.items };
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
    delete shuffledMap[sessionId];
    delete winners[sessionId];
    delete statistics[sessionId];
    delete history[sessionId];
    delete currentGameState[sessionId];
}

function findWinners(gameId, roundId, winNumber, currentBets) {
    winners[gameId] = [];
    winNumber = parseInt(winNumber);
    var winColumn = getColumn(winNumber);
    var winDozen = getDozen(winNumber);
    var winHighLow;
    if (getHighLow(winNumber) == 1)
        winHighLow = "low";
    else if (getHighLow(winNumber) == 2)
        winHighLow = "high";
    else
        winHighLow = "zero";
    var winEvensOdds;
    if (getEvensOdds(winNumber) == 1)
        winEvensOdds = "evens";
    else if (getEvensOdds(winNumber) == 2)
        winEvensOdds = "odds";
    else
        winEvensOdds = "zero";
    var winColor;
    if (getColor(winNumber) == 1)
        winColor = "red";
    else if (getColor(winNumber) == 2)
        winColor = "black";
    else
        winColor = "zero";
    currentBets.forEach(function(bet) {
        try {
            var user = context.getUserInfo(bet.sessionId);
            var hasWon = false;
            var winRate = 0;
            var betInfo = bet.betInfo;
            switch (betInfo.type) {
            case "straight":
                winRate = 36;
                break;
            case "split":
                winRate = 18;
                break;
            case "corner":
                winRate = 9;
                break;
            case "street":
                winRate = 12;
                break;
            case "line":
                winRate = 6;
                break;
            }

            switch (betInfo.type) {
            case "straight":
            case "split":
            case "street":
            case "line":
                if (betInfo.items.indexOf(winNumber) != -1) {
                    hasWon = true;
                }
                break;
            case "corner":
                if (betInfo.items.indexOf(winNumber) != -1) {
                    hasWon = winNumber - betInfo.items[0] < 2 || betInfo.items[betInfo.items.length - 1] - winNumber < 2;
                }
                break;
            default:
                var specialBet = betInfo.items[0];
                if (winNumber > 0) {
                    switch (betInfo.type) {
                    case "column":
                        winRate = 3;
                        hasWon = specialBet == winColumn;
                        break;
                    case "dozen":
                        winRate = 3;
                        hasWon = specialBet == winDozen;
                        break;
                    case "high_low":
                        winRate = 2;
                        hasWon = specialBet == winHighLow;
                        break;
                    case "evens_odds":
                        winRate = 2;
                        hasWon = specialBet == winEvensOdds;
                        break;
                    case "color":
                        winRate = 2;
                        hasWon = specialBet == winColor;
                        break;
                    }
                }
                break;
            }

            if (hasWon) {
                var winAmount = betInfo.amount * winRate;
                var amount = winAmount;
                context.log("Register win:" + winAmount);
                winners[gameId].push([user.nick, user.locale.currencySign + amount]);
                var resultCode = context.accountingHelper.registerWin(bet.sessionId, settings.roundId, bet.roundBetId, amount, makeBetObject(bet), "Win bet at round " + settings.roundId,
                    function(seesionId, betObj, amount) {
                        context.log("Win:" + amount);
                        notifyUser(seesionId, {
                            type: "win",
                            message: {
                                amount: amount,
                                balance: user.balance,
                                bets: bet
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
            } else {
                if (user != null) {
                    notifyUser(bet.sessionId, {
                        type: "balance",
                        message: {
                            balance: user.balance,
                            totalLost: user.totalLoss
                        }
                    });
                }
            }
        } catch (e) {
            context.log("Find winners error:");
            context.logError(e);
            notifyUser(bet.sessionId, {
                type: "win",
                message: {
                    success: false,
                    error: "REGISTER_WIN_ERROR",
                    balance: user.balance
                }
            });
        }
    });
}

function restartGame(sessionId) {
    if (stateTimeout)
        context.clearTimeout(stateTimeout);
    shuffledMap[sessionId] = getRng(sessionId).spin(physicalMap);
    stateTimeout = context.setTimeout(function() {
        changeGameState({ gameId: sessionId, length: null, state: gameStatusCode.OPENED, videos: [] });
        if (context.mediaHelper.getVODInfo(context.mediaHelper.randomFile("Idle"))) {
            if (context.mediaHelper.mode == "VOD") {
                context.mediaHelper.playVOD(sessionId, [{ name: context.mediaHelper.randomFile("Idle"), loop: true }]);
            }
        } else {
            if (!context.mediaHelper.isEmpty) {
                if (context.mediaHelper.getVODInfo(context.mediaHelper.randomFile("Idle"))) {
                    context.mediaHelper.playVOD(sessionId, [{ name: context.mediaHelper.randomFile("Idle"), loop: true }]);
                } else {
                    context.mediaHelper.showScreen(sessionId, "WinnersFullscreen");
                }
            }
        }
    }, 2000);
    bets[sessionId] = [];
}

function completeBets(sessionId) {
    context.accountingHelper.completeBets(sessionId, settings.roundId, function() {
    }, function() {
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
                type: "clearTable"
            });
            context.kick(sessionId);
        }
        for (var i in bets[gameId]) {
            if (bets[gameId][i].sessionId == sessionId) {
                bets[gameId].splice(i, 1);;
            }
        }
    });
}

function gameStatusInterval(gameId) {
    if (!context.mediaHelper.isEmpty) {
        spinDirection = spinDirection === "CW" ? "CCW" : "CW";
        var part01Video, part02Video, part03Video, p1Index, p2Index, p3Index, validVideos = [];
        var files = context.mediaHelper.vodData.length_map[spinDirection]["Part01"];
        files = Object.keys(files);
        p1Index = files[videoRng.random(0, files.length - 1)];
        part01Video = spinDirection + "/Part01/" + p1Index;
        openRoundTime = (context.mediaHelper.getVODInfo(context.mediaHelper.randomFile("Place_Your_Bets")).length + context.mediaHelper.getVODInfo(part01Video).length) * 1000;
        shuffledMap[gameId] = getRng(gameId).spin(physicalMap);
        changeGameState({ gameId: gameId, length: openRoundTime / 1000, state: gameStatusCode.OPENED });
        stateTimeout = context.setTimeout(function() {
            context.mediaHelper.playVOD(null, [part01Video, context.mediaHelper.randomFile("No_More_Bets")]);
            stateTimeout = context.setTimeout(function() {
                context.mediaHelper.showScreen(null, "WINNERS");
            }, 1000);
            stateTimeout = context.setTimeout(function() {
                context.mediaHelper.clearOverlay(null);
            }, context.mediaHelper.getVODInfo(part01Video).length * 1000 / 2);
        }, context.mediaHelper.getVODInfo(context.mediaHelper.randomFile("Place_Your_Bets")).length * 1000 + 1000);
        context.mediaHelper.clearOverlay(null);
        nextStateTime = new Date(new Date().getTime() + openRoundTime);
        stateTimeout = context.setTimeout(function() {
            var part2FileList = context.mediaHelper.vodData.length_map[spinDirection]["Part02"];
            var part3FileList = context.mediaHelper.vodData.length_map["Part03"];
            var number = shuffledMap[gameId][0];
            var part2Files = [];
            var numberIndex = (number + "").length > 1 ? number : "0" + number;
            for (key in part2FileList) {
                if (part2FileList.hasOwnProperty(key)) {
                    if (key.split("_")[0] == numberIndex) {
                        part2Files.push(key);
                    }
                }
            }
            context.mediaHelper.clearOverlay(null);
            if (!!context.mediaHelper.vodData["stream_data"]["has_voice_result"]) {
                var part3Files = [];
                for (key in part3FileList) {
                    if (part3FileList.hasOwnProperty(key)) {
                        if (key.split("_")[0] == numberIndex) {
                            part3Files.push(key);
                        }
                    }
                }
                p3Index = part3Files[videoRng.random(0, part3Files.length - 1)];
            } else {
                part3FileList = Object.keys(part3FileList);
                p3Index = part3FileList[videoRng.random(0, part3FileList.length - 1)];
            }
            p2Index = part2Files[videoRng.random(0, part2Files.length - 1)];
            part02Video = spinDirection + "/Part02/" + p2Index;
            videoTimeout = Math.floor(part2FileList[p2Index] + context.mediaHelper.getVODInfo(context.mediaHelper.randomFile("No_More_Bets")).length) * 1000;
            part03Video = "Part03/" + p3Index;
            changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED, number: number });
            context.setTimeout(function() {
                notifyAll({
                    type: "spin",
                    message: {
                        win_number: number
                    }
                });
            }, videoTimeout - 10000);
            stateTimeout = context.setTimeout(function() {
                context.mediaHelper.playVOD(null, [{ name: part02Video, wait_previous: 3 }, part03Video, context.mediaHelper.randomFile("Place_Your_Bets")]);
            }, context.mediaHelper.getVODInfo(context.mediaHelper.randomFile("No_More_Bets")).length * 1000);
            nextStateTime = new Date(new Date().getTime() + videoTimeout);
            stateTimeout = context.setTimeout(function() {
                videoTimeout = context.mediaHelper.getVODInfo(part03Video).length * 1000;
                context.setTimeout(function() {
                    changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, number: number });
                }, 3000);
                context.mediaHelper.showOverlay(null, { name: "WinningNumbers/" + number });
                nextStateTime = new Date(new Date().getTime() + videoTimeout);
                stateTimeout = context.setTimeout(function() {
                    context.mediaHelper.hideOverlay(null, "WinningNumbers/" + number);
                    gameStatusInterval(gameId);
                }, videoTimeout - VOD_TIMEOUT);
            }, videoTimeout - VOD_TIMEOUT);
        }, openRoundTime - VOD_TIMEOUT);
    } else {
        stateTimeout = null;
        shuffledMap[gameId] = getRng(gameId).spin(physicalMap);
        changeGameState({ gameId: gameId, length: context.mediaHelper.streamConfig["round_data"]["round_length"], state: gameStatusCode.OPENED });
        stateTimeout = context.setTimeout(function () {
            var number = shuffledMap[gameId][0];
            changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED, number: number });
            context.setTimeout(function() {
                notifyAll({
                    type: "spin",
                    message: {
                        win_number: number
                    }
                });
            }, 4000);
            stateTimeout = context.setTimeout(function() {
                stateTimeout = context.setTimeout(function() {
                    changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, number: number });
                }, 3000);
                stateTimeout = context.setTimeout(function() {
                    context.mediaHelper.hideOverlay(null, "WinningNumbers/" + number);
                    gameStatusInterval(gameId);
                }, 5000);
            }, 8000);
        }, context.mediaHelper.streamConfig["round_data"]["round_length"]*1000); 
    }
}

function gameStatusManual(gameId, vod) {
    if (vod) {
        spinDirection = spinDirection === "CW" ? "CCW" : "CW";
        var part02Video, part03Video, p2Index, p3Index;
        var part2FileList = context.mediaHelper.vodData.length_map[spinDirection]["Part02"];
        var part3FileList = context.mediaHelper.vodData.length_map["Part03"];
        var finalShuffledMap = getRng(gameId).finalSpin(shuffledMap[gameId]);
        var number = finalShuffledMap[0];
        context.mediaHelper.clearOverlay(null);
        var part2Files = [];
        var numberIndex = (number + "").length > 1 ? number : "0" + number;
        for (key in part2FileList) {
            if (part2FileList.hasOwnProperty(key)) {
                if (key.split("_")[0] == numberIndex) {
                    part2Files.push(key);
                }
            }
        }
        if (!!context.mediaHelper.vodData["stream_data"]["has_voice_result"]) {
            var part3Files = [];
            for (key in part3FileList) {
                if (part3FileList.hasOwnProperty(key)) {
                    if (key.split("_")[0] == numberIndex) {
                        part3Files.push(key);
                    }
                }
            }
            p3Index = part3Files[videoRng.random(0, part3Files.length - 1)];
        } else {
            part3FileList = Object.keys(part3FileList);
            p3Index = part3FileList[videoRng.random(0, part3FileList.length - 1)];
        }
        p2Index = part2Files[videoRng.random(0, part2Files.length - 1)];
        part02Video = spinDirection + "/Part02/" + p2Index;
        part03Video = "Part03/" + p3Index;
        videoTimeout = Math.floor(part2FileList[p2Index]) * 1000;
        stateTimeout = context.setTimeout(function() {
            changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED, number: number });
            context.setTimeout(function() {
                notifyUser(gameId, {
                    type: "spin",
                    message: {
                        win_number: number
                    }
                });
            }, videoTimeout - 10000);
            context.mediaHelper.playVOD(gameId, [{ name: part02Video, wait_previous: 3 }, part03Video]);
            stateTimeout = context.setTimeout(function() {
                videoTimeout = context.mediaHelper.getVODInfo(part03Video).length * 1000;
                context.setTimeout(function() {
                    changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, number: number });
                }, 3000);
                context.mediaHelper.showOverlay(gameId, { name: "WinningNumbers/" + number });
                stateTimeout = context.setTimeout(function() {
                    context.mediaHelper.hideOverlay(gameId, "WinningNumbers/" + number);
                    context.mediaHelper.playVOD(gameId, [context.mediaHelper.randomFile("Place_Your_Bets")]);
                    videoTimeout = context.mediaHelper.getVODInfo(context.mediaHelper.randomFile("Place_Your_Bets")).length * 1000;
                    stateTimeout = context.setTimeout(function() {
                        changeGameState({ gameId: gameId, length: null, state: gameStatusCode.OPENED });
                        stateTimeout = null;
                        shuffledMap[gameId] = getRng(gameId).spin(physicalMap);
                        var user = context.getUserInfo(gameId);
                        if (user.features && user.features.singleplayer_winners)
                            context.mediaHelper.showScreen(gameId, "WinnersFullscreen");
                        else {
                            if (context.mediaHelper.getVODInfo(context.mediaHelper.randomFile("Idle"))) {
                                context.mediaHelper.playVOD(gameId, [{ name: context.mediaHelper.randomFile("Idle"), loop: true }]);
                            }
                        }
                    }, videoTimeout - VOD_TIMEOUT);
                }, videoTimeout - VOD_TIMEOUT);
            }, videoTimeout - VOD_TIMEOUT);
        }, 1500);
    } else {
        var finalShuffledMap = getRng(gameId).finalSpin(shuffledMap[gameId]);
        var number = finalShuffledMap[0];
        changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED, number: number });
        context.setTimeout(function() {
            notifyUser(gameId, {
                type: "spin",
                message: {
                    win_number: number
                }
            });
        }, 4000);
        stateTimeout = context.setTimeout(function() {
            stateTimeout = context.setTimeout(function() {
                changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, number: number });
            }, 3000);
            stateTimeout = context.setTimeout(function() {
                changeGameState({ gameId: gameId, length: null, state: gameStatusCode.OPENED });
                stateTimeout = null;
                shuffledMap[gameId] = getRng(gameId).spin(physicalMap);
            }, 5000);
        }, 8000);
    }
}

function changeGameState(message) {
    var gameState = message.state;
    var gameId, sessionId = null;
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = message.gameId;
        sessionId = message.gameId;
    } else {
        settings.history = history;
        gameId = context.gameConfiguration.Mode;
    }
    if (!settings.roundId) {
        settings.roundId = context.roundCounter.current;
    }

    if (gameState != currentGameState[gameId]) {
        currentGameState[gameId] = gameState;
        settings.gameState = gameState;
        runtime.keepAlive();
        switch (gameState) {
        case gameStatusCode.OPENED:
            if (roundId != settings.roundId)
                bets[gameId] = [];
            var length = null;
            roundId = settings.roundId;
            if (message.length) {
                length = message.length;
            }
            if (context.gameConfiguration.Mode !== "Manual") {
                runtime.setRoundLength(length);
            }

            settings.startDate = context.date;
            settings.endDate = length ? new Date(settings.startDate.getTime() + 1000 * length) : null;
            context.log("Opened round " + settings.roundId);
            if (context.gameConfiguration.Mode === "Manual") {
                notifyUser(message.gameId, {
                    type: "status",
                    message: {
                        status: gameStatusCode.OPENED,
                        round_id: settings.roundId,
                        startDate: settings.startDate,
                        endDate: settings.endDate,
                        length: length
                    }
                });
                context.setTimeout(function() {
                    notifyUser(message.gameId, {
                        type: "overlay",
                        message: {
                            visible: true
                        }
                    });
                }, 5000);
            } else {
                notifyAll({
                    type: "status",
                    message: {
                        status: gameStatusCode.OPENED,
                        round_id: settings.roundId,
                        startDate: settings.startDate,
                        endDate: settings.endDate,
                        length: length
                    }
                });
                if (context.gameConfiguration.Mode != "External") {
                    context.setTimeout(function() {
                        notifyAll({
                            type: "overlay",
                            message: {
                                visible: true
                            }
                        });
                    }, 5000);
                }
            }
            if (!message.oldSession) {
                runtime.setGameState(sessionId, "OPENED", "Opened round: " + settings.roundId);
                context.accountingHelper.registerRoundOpen(roundId);
            }
            break;
        case gameStatusCode.CLOSED:
            context.log("Closed round " + settings.roundId);
            var completeGames = [];
            bets[gameId].forEach(function(stake) {
                if (completeGames.indexOf(stake.sessionId) < 0) {
                    completeBets(stake.sessionId);
                    completeGames.push(stake.sessionId);
                }
            });
            if (context.gameConfiguration.Mode === "Manual") {
                notifyUser(message.gameId, {
                    type: "status",
                    message: {
                        status: gameStatusCode.CLOSED,
                        round_id: settings.roundId,
                        win_number: message.number
                    }
                });
                notifyUser(message.gameId, {
                    type: "overlay",
                    message: {
                        visible: false
                    }
                });
            } else {
                notifyAll({
                    type: "status",
                    message: {
                        status: gameStatusCode.CLOSED,
                        round_id: settings.roundId,
                        win_number: message.number
                    }
                });
                if (context.gameConfiguration.Mode != "External") {
                    notifyAll({
                        type: "overlay",
                        message: {
                            visible: false
                        }
                    });
                }
            }
            runtime.setGameState(sessionId, "CLOSED", "Closed round: " + settings.roundId);
            break;
        case gameStatusCode.WINNUMBER:
            settings.endDate = context.date;
            var winNumber = message.number;
            if (winNumber > -1) {
                history[gameId].unshift(message.number);
                if (history[gameId].length > 300) {
                    history[gameId] = history[gameId].splice(0, 300);
                }
                recalculateStatistics(gameId);
                context.log("Registered winning number " + winNumber + " for round " + settings.roundId);
                if (context.gameConfiguration.Mode === "Manual") {
                    notifyUser(message.gameId, {
                        type: "status",
                        message: {
                            status: gameStatusCode.WINNUMBER,
                            round_id: settings.roundId,
                            win_number: winNumber
                        }
                    });
                } else {
                    context.cleanupMessages();
                    notifyAll({
                        type: "status",
                        message: {
                            status: gameStatusCode.WINNUMBER,
                            round_id: settings.roundId,
                            win_number: winNumber
                        }
                    });
                }
                findWinners(gameId, settings.roundId, winNumber, bets[gameId]);
                runtime.setGameState(sessionId, "WINNING", "Winning number: " + winNumber);
                context.accountingHelper.registerRoundResult(settings.roundId, winNumber);
                context.accountingHelper.finishRound(settings.roundId);
                settings.roundId = context.roundCounter.increase();
                bets[gameId] = [];
            } else {
                context.accountingHelper.cancelRound(settings.roundId, true, function() {
                    context.log("Cancel round success");
                    if (context.gameConfiguration.Mode === "Manual") {
                        notifyUser(message.gameId, {
                            type: "status",
                            message: {
                                status: gameStatusCode.CANCELED,
                                round_id: settings.roundId
                            }
                        });
                    } else {
                        notifyAll({
                            type: "status",
                            message: {
                                status: gameStatusCode.CANCELED,
                                round_id: settings.roundId
                            }
                        });
                    }
                    for (var i in bets[gameId]) {
                        var user = context.getUserInfo(bets[gameId][i].sessionId);
                        notifyUser(bets[gameId][i].sessionId, {
                            type: "balance",
                            message: {
                                balance: user.balance,
                                totalLost: user.totalLoss
                            }
                        });
                    }
                    bets[gameId] = [];
                }, function() {
                    context.logError("Cancel round error");
                });
                runtime.setGameState(sessionId, "CANCELLED", "Round cancelled. RoundID:" + settings.roundId);
                context.log("Round cancelled. RoundID:" + settings.roundId);
            }
            break;
        }
        if (context.gameConfiguration.Mode != "Manual") {
            context.saveSettings(settings);
        }
    }

}

function onChangeGameState(datasource) {
    var messages = datasource.pick();
    messages.forEach(function(message) {
        var gameState = message.state;
        switch (gameState) {
        case gameStatusCode.OPENED:
            context.sendMediaCommand("roulette_show_winners", winners[context.gameConfiguration.Mode]);
            context.sendMediaCommand("roulette_round_open", message.length);
            break;
        case gameStatusCode.CLOSED:
            context.sendMediaCommand("roulette_round_close");
            break;
        case gameStatusCode.WINNUMBER:
            context.sendMediaCommand("roulette_show_winner", message.number);
            break;
        }
        context.setTimeout(function() {
            changeGameState(message);
        }, runtime.externalDelay * 1000);
    });
}

function getUserBets(sessionId) {
    var gameId, userBets = [];
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = sessionId;
    } else {
        settings.history = history;
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

function sendUsersBets(bets, sessionId) {
    if (sessionId) {
        notifyUser(sessionId, {
            type: "new_bets",
            message: {
                bets: bets
            }
        });
    } else {
        notifyAll({
            type: "new_bets",
            message: {
                bets: bets
            }
        });
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
        tableAmount += userBet.amount;
    });
    tableAmount = parseFloat(tableAmount.toFixed(2));
    if (tableAmount > userLimits.Table.Max.replace(",", ".") || tableAmount < userLimits.Table.Min.replace(",", ".")) {
        valid = false;
    } else {
        var typeAmount = bet.amount;
        bets.forEach(function(userBet) {
            if (bet.name == userBet.betInfo.name) {
                typeAmount += userBet.betInfo.amount;
            }
        });
        typeAmount = parseFloat(typeAmount.toFixed(2));
        if (["column", "dozen"].indexOf(bet.type) > -1) {
            if (typeAmount > userLimits.Column_Dozen.Max.replace(",", ".") || typeAmount < userLimits.Column_Dozen.Min.replace(",", ".")) {
                valid = false;
            }
        } else if (["high_low", "evens_odds", "color"].indexOf(bet.type) > -1) {
            if (typeAmount > userLimits.Fifty_Fifty.Max.replace(",", ".") || typeAmount < userLimits.Fifty_Fifty.Min.replace(",", ".")) {
                valid = false;
            }
        } else if (["straight"].indexOf(bet.type) > -1) {
            if (typeAmount > userLimits.Straight.Max.replace(",", ".") || typeAmount < userLimits.Straight.Min.replace(",", ".")) {
                valid = false;
            }
        } else if (["corner"].indexOf(bet.type) > -1) {
            if (typeAmount > userLimits.Corner.Max.replace(",", ".") || typeAmount < userLimits.Corner.Min.replace(",", ".")) {
                valid = false;
            }
        } else if (["split"].indexOf(bet.type) > -1) {
            if (typeAmount > userLimits.Split.Max.replace(",", ".") || typeAmount < userLimits.Split.Min.replace(",", ".")) {
                valid = false;
            }
        } else if (["line"].indexOf(bet.type) > -1) {
            if (typeAmount > userLimits.Line.Max.replace(",", ".") || typeAmount < userLimits.Line.Min.replace(",", ".")) {
                valid = false;
            }
        } else if (["street"].indexOf(bet.type) > -1) {
            if (typeAmount > userLimits.Street.Max.replace(",", ".") || typeAmount < userLimits.Street.Min.replace(",", ".")) {
                valid = false;
            }
        }
    }

    return valid;
}

function convertLimits(limits, multiplier) {
    for (var i = 0; i < limits.length; i++) {
        var limit = limits[i];
        limit["Table"].Min = parseFloat(parseFloat(limit["Table"].Min.replace(",", ".")) * multiplier).toFixed(2);
        limit["Table"].Max = parseFloat(parseFloat(limit["Table"].Max.replace(",", ".")) * multiplier).toFixed(2);
        limit["Straight"].Min = parseFloat(parseFloat(limit["Straight"].Min.replace(",", ".")) * multiplier).toFixed(2);
        limit["Straight"].Max = parseFloat(parseFloat(limit["Straight"].Max.replace(",", ".")) * multiplier).toFixed(2);
        limit["Column_Dozen"].Min = parseFloat(parseFloat(limit["Column_Dozen"].Min.replace(",", ".")) * multiplier).toFixed(2);
        limit["Column_Dozen"].Max = parseFloat(parseFloat(limit["Column_Dozen"].Max.replace(",", ".")) * multiplier).toFixed(2);
        limit["Fifty_Fifty"].Min = parseFloat(parseFloat(limit["Fifty_Fifty"].Min.replace(",", ".")) * multiplier).toFixed(2);
        limit["Fifty_Fifty"].Max = parseFloat(parseFloat(limit["Fifty_Fifty"].Max.replace(",", ".")) * multiplier).toFixed(2);
        limit["Split"].Min = parseFloat(parseFloat(limit["Split"].Min.replace(",", ".")) * multiplier).toFixed(2);
        limit["Split"].Max = parseFloat(parseFloat(limit["Split"].Max.replace(",", ".")) * multiplier).toFixed(2);
        limit["Corner"].Min = parseFloat(parseFloat(limit["Corner"].Min.replace(",", ".")) * multiplier).toFixed(2);
        limit["Corner"].Max = parseFloat(parseFloat(limit["Corner"].Max.replace(",", ".")) * multiplier).toFixed(2);
        limit["Street"].Min = parseFloat(parseFloat(limit["Street"].Min.replace(",", ".")) * multiplier).toFixed(2);
        limit["Street"].Max = parseFloat(parseFloat(limit["Street"].Max.replace(",", ".")) * multiplier).toFixed(2);
        limit["Line"].Min = parseFloat(parseFloat(limit["Line"].Min.replace(",", ".")) * multiplier).toFixed(2);
        limit["Line"].Max = parseFloat(parseFloat(limit["Line"].Max.replace(",", ".")) * multiplier).toFixed(2);
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
        return { success: true, data: history[gameId] };
    case "stats":
        return { success: true, data: statistics[gameId] };
    case "bet":
        if (currentGameState[gameId] != gameStatusCode.OPENED || !instanceEnabled) {
            return { success: false, balance: user.balance, error: "TABLE_CLOSED", bets: message.bets };
        }
        try {
            var newBets = [];
            message.bets.forEach(function(bet) {
                if (validateBet(sessionId, bet)) {
                    var betObj = { sessionId: sessionId, betInfo: bet, userName: user.nick };
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
                    newBets.push(betObj);
                    bet.wasMade = true;
                } else {
                    throw "LIMIT_REACHED";
                }
            });
            sendUsersBets(newBets);
        } catch (e) {
            var result = { success: false, balance: user.balance, error: e.toString(), bets: message.bets };
            return result;
        }
        var result = { success: true, balance: user.balance, bets: message.bets };
        return result;
    case "cancel_all":
        if (currentGameState[gameId] != gameStatusCode.OPENED) {
            return { success: false, balance: user.balance, error: "TABLE_CLOSED", bets: message.bets };
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
            notifyAll({
                type: "remove_bets",
                message: {
                    bets: cancelBets
                }
            });
        } catch (e) {
            result = { success: false, balance: user.balance, error: e.toString(), bets: message.cancelBets };
            return result;
        }
        result = { success: true, balance: user.balance };
        return result;
    case "cancel_last":
        if (currentGameState[gameId] != gameStatusCode.OPENED) {
            return { success: false, balance: user.balance, error: "TABLE_CLOSED", bets: message.bets };
        }
        try {
            var cancelBets = [];
            cancelBets = bets[gameId].filter(function(bet) {
                return bet.sessionId == sessionId;
            }).filter(function(bet) {
                return (message.bet.type === bet.betInfo.type && message.bet.amount === bet.betInfo.amount);
            });
            var cancelBet = cancelBets[cancelBets.length - 1];
            var cancelResult = context.accountingHelper.cancelBet(sessionId, settings.roundId, cancelBet.betInfo.amount, makeBetObject(cancelBet));
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
            notifyAll({
                type: "remove_bets",
                message: {
                    bets: [cancelBet]
                }
            });
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
            return { success: false, balance: user.balance, error: "GAME_ALREADY_BEGUN", bets: message.bets };
        }
        if (context.gameConfiguration.Mode != "Manual") {
            return { success: false, balance: user.balance, error: "INCORRECT_MODE", bets: message.bets };
        }
        if (!instanceEnabled) {
            return { success: false, balance: user.balance, error: "INSTANCE_DISABLED", bets: message.bets };
        }
        gameStatusManual(sessionId, !context.mediaHelper.isEmpty);
        context.keepSessionAlive(sessionId);
        return { success: true, balance: user.balance };

    }
};

game_initialize();
setMessageDispatcher(dispatcher);