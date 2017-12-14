var VOD_TIMEOUT = 500;
var gameStatusCode = {
    OPENED: "1",
    CLOSED: "0",
    WINNUMBER: "3",
    CANCELED: "6"
};

var blackNumbers = [ 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35 ];
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

function game_initialize() {

    videoRng = context.rng.createNew();

    if ((!context.gameConfiguration && !context.gameConfiguration.VOD && !context.gameConfiguration.VOD.length_map) ) {
        throw "GAME_NOT_CONFIGURED";
    }
    if ((!context.gameConfiguration.Mode) ) {
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
        statistics[context.gameConfiguration.Mode] = [];
        history[context.gameConfiguration.Mode] = settings.history[context.gameConfiguration.Mode];
        recalculateStatistics(context.gameConfiguration.Mode);
        runtime.setGameMode({"keepalive":true});
    }
    if (context.gameConfiguration.Mode === "External") {
        var datasource = context.getExchangeData();
        datasource.onChangeEvent = onChangeGameState;
    } else if (context.gameConfiguration.Mode === "Auto") {
        gameStatusInterval(context.gameConfiguration.Mode);
    }
    context.log("Roulette server initialized");
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
    return number == 0 ? 0 : blackNumbers.indexOf(number) >= 0 ? 2 : 1;
}

function createGame(sessionId) {
    currentGameState[sessionId] = "";
    bets[sessionId] = [];
    winners[sessionId] = [];
    statistics[sessionId] = [];
    history[sessionId] = [];
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
        frequencyMap.push({number: i, count: 0});
    }

    var nonZeroCount = 0;
    for (i = 0; i < count; i++) {
        var number = parseInt(history[gameId][i]);
        frequencyMap[number].count++;
        if (number != 0) {
            dozenMap[getDozen(number)]++;
            columnMap[getColumn(number)]++;
            nonZeroCount++;
        }
        evenOddsMap[getEvensOdds(number)]++;
        highLowMap[getHighLow(number)]++;
        colorMap[getColor(number)]++;
    }

    frequencyMap.sort(function compare(a, b) {
        return a.count == b.count ? 0 : a.count > b.count ? 1 : -1;
    });

    var hotField = frequencyMap.slice(-10);
    var coldField = frequencyMap.slice(0, 10);

    hotField.reverse();

    var highLowField = { zero: 33.3, high:33.3, low:33.3 };
    var evenOddsField = { zero: 33.3, even: 33.3, odds:33.3 };
    var colorField = { zero: 33.3, red:33.3, black:33.3 };
    var columnField = { first: 33.3, second: 33.3, third: 33.3 };
    var dozenField = { first: 33.3, second: 33.3, third: 33.3 };
    if (count > 0) {
        highLowField = { zero: 100 * highLowMap[0] / count, high: 100 * highLowMap[1] / count, low: 100 * highLowMap[2] / count };
        evenOddsField = { zero: 100 * evenOddsMap[0] / count, even: 100 * evenOddsMap[1] / count, odds: 100 * evenOddsMap[2] / count };
        colorField = { zero: 100 * colorMap[0] / count, red: 100 * colorMap[1] / count, black: 100 * colorMap[2] / count };
    }
    if (nonZeroCount != 0)
    {
        columnField = { first: 100 * columnMap[0] / nonZeroCount, second: 100 * columnMap[1] / nonZeroCount, third: 100 * columnMap[2] / nonZeroCount };
        dozenField = { first: 100 * dozenMap[0] / nonZeroCount, second: 100 * dozenMap[1] / nonZeroCount, third: 100 * dozenMap[2] / nonZeroCount };
    }

    statistics[gameId] = { count: count, hotNumbers: hotField, coldNumbers: coldField, colors: colorField, highLow: highLowField, evenOdds: evenOddsField, columns: columnField, dozens: dozenField };
}

function makeBetObject(bet) {
    return { type: bet.betInfo.type, items: bet.betInfo.items };
}
function clearUserData(sessionId) {
    if (currentGameState[sessionId] === gameStatusCode.OPENED) {
        try {
            var cancelBets = bets[sessionId].filter(function (bet) {
                return bet.sessionId === sessionId;
            });
            cancelBets.forEach(function(bet) {
                if (bet.sessionId == sessionId) {
                    if (context.accountingHelper.cancelBet(bet.sessionId, settings.roundId, bet.betInfo.amount, makeBetObject(bet)) != 0) {
                        throw "ROLLBACK_ERROR";
                    }
                    bets[sessionId].splice(bets[sessionId].indexOf(bet), 1);
                }
            });
        } catch(e) {
            context.logError(e);
        }
    }
    delete bets[sessionId];
    delete winners[sessionId];
    delete statistics[sessionId];
    delete history[sessionId];
    delete currentGameState[sessionId];
}

function findWinners(gameId, winNumber) {
    var winColumn = getColumn(winNumber);
    var winDozen = getDozen(winNumber);
    var winHighLow = getHighLow(winNumber) == 1 ? "high" : "low";
    var winEvensOdds = getEvensOdds(winNumber) == 1 ? "evens" : "odds";
    var winColor = getColor(winNumber) == 1 ? "red" : "black";
    try {
        bets[gameId].forEach(function (bet) {
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
                context.accountingHelper.registerWin(bet.sessionId, settings.roundId, winAmount, makeBetObject(bet), "Win bet at round " + settings.roundId);
                var user = context.getUserInfo(bet.sessionId);
                if (user != null) {
                    notifyUser(bet.sessionId, {
                        type: "win",
                        message: {
                            amount: winAmount,
                            balance: user.balance,
                            bet: betInfo
                        }
                    });
                }
            } 
        });
    }
    catch (e) {
        context.logError(e);
    }
    if (context.gameConfiguration.Mode === "Manual")
        context.accountingHelper.registerLossesForSession(gameId, settings.roundId, "Losses bet at round " + settings.roundId);
    else
        context.accountingHelper.registerLosses(settings.roundId, "Losses bet at round " + settings.roundId);
}

function gameStatusInterval(gameId) {
    spinDirection = spinDirection === "CW" ? "CCW" : "CW";
    var part01Video, part02Video, part03Video, p1Index, p2Index, p3Index, validVideos = [];
    var files = context.gameConfiguration.VOD.length_map[spinDirection]['Part01'];
    p1Index = videoRng.random(0, Object.keys(files).length-1);
    openRoundTime = (files[p1Index] + context.gameConfiguration.VOD.length_map['Place_Your_Bets']) * 1000;
    part01Video = spinDirection + '/Part01/' + p1Index;
    changeGameState({ gameId: gameId, length: openRoundTime / 1000, state: gameStatusCode.OPENED });
    context.mediaHelper.playVOD(null, ["Place_Your_Bets", part01Video]);
    nextStateTime = new Date(new Date().getTime() + openRoundTime) ;
    context.setTimeout(function () {
        var part2FileList = context.gameConfiguration.VOD.length_map[spinDirection]['Part02'];
        var part3FileList = context.gameConfiguration.VOD.length_map['Part03'];
        var number = getRng(gameId).random(0, 36);
        var part2Files = [];
        var numberIndex = (number + "").length > 1 ? number : "0" + number;
        for (key in part2FileList) {
            if (part2FileList.hasOwnProperty(key)) {
                if (key.split("_")[0] == numberIndex) {
                    part2Files.push(key);
                }
            }
        }

        p2Index = part2Files[videoRng.random(0, part2Files.length - 1)];
        p3Index = videoRng.random(0, Object.keys(part3FileList).length - 1);
        part02Video = spinDirection + '/Part02/' + p2Index;
        videoTimeout = Math.floor(part2FileList[p2Index] + context.gameConfiguration.VOD.length_map['No_More_Bets']) * 1000;
        part03Video = 'Part03/' + p3Index;
        changeGameState({ gameId: gameId, state: gameStatusCode.CLOSED });
        context.mediaHelper.playVOD(null, ["No_More_Bets", part02Video, part03Video]);
        nextStateTime = new Date(new Date().getTime() + videoTimeout);
        context.setTimeout(function () {
            videoTimeout = Math.floor(part3FileList[p3Index]) * 1000;
            changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, number: number});
            nextStateTime = new Date(new Date().getTime() + videoTimeout);
            context.setTimeout(function () {
                if (gameId=="Auto")
                    gameStatusInterval(gameId);
            }, videoTimeout - VOD_TIMEOUT);
        }, videoTimeout - VOD_TIMEOUT);
    }, openRoundTime - VOD_TIMEOUT);
}

function gameStatusManual(gameId) {
    spinDirection = spinDirection === "CW" ? "CCW" : "CW";
    var part02Video, part03Video, p2Index, p3Index;  
    var part2FileList = context.gameConfiguration.VOD.length_map[spinDirection]['Part02'];
    var part3FileList = context.gameConfiguration.VOD.length_map['Part03'];
    var number = getRng(gameId).random(0, 36);
    var part2Files = [];
    var numberIndex = (number + "").length > 1 ? number : "0" + number;
    for (key in part2FileList) {
        if (part2FileList.hasOwnProperty(key)) {
            if (key.split("_")[0] == numberIndex) {
                part2Files.push(key);
            }
        }
    }
    p2Index = part2Files[videoRng.random(0, part2Files.length - 1)];
    p3Index = videoRng.random(0, Object.keys(part3FileList).length - 1);
    part02Video = spinDirection + '/Part02/' + p2Index;
    part03Video = 'Part03/' + p3Index;
    videoTimeout = Math.floor(part2FileList[p2Index]) * 1000;
    changeGameState({gameId: gameId,state: gameStatusCode.CLOSED});
    context.mediaHelper.playVOD(gameId, [part02Video, part03Video]);
    context.setTimeout(function () {
        videoTimeout = Math.floor(part3FileList[p3Index]) * 1000;
        changeGameState({ gameId: gameId, state: gameStatusCode.WINNUMBER, number: number });
        context.setTimeout(function () {
            context.mediaHelper.playVOD(gameId, ["Place_Your_Bets"]);
            videoTimeout = context.mediaHelper.getVODInfo("Place_Your_Bets").length * 1000;
            context.setTimeout(function () {
                changeGameState({ gameId: gameId, length: null, state: gameStatusCode.OPENED });
                context.mediaHelper.showScreen(gameId, "WINNERS");
            }, videoTimeout);
        }, videoTimeout - VOD_TIMEOUT);
    }, videoTimeout - VOD_TIMEOUT);

}

function changeGameState(message) {
    var gameState = message.state;
    var gameId;
    if (context.gameConfiguration.Mode === "Manual") {
        gameId = message.gameId;
    } else {
        settings.history = history;
        gameId = context.gameConfiguration.Mode;
    }
    if(!settings.roundId){
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
                }
                runtime.setGameState('OPENED', "Opened round: " + settings.roundId);
                break;
            case gameStatusCode.CLOSED:
                context.log("Closed round " + settings.roundId);
                if (context.gameConfiguration.Mode === "Manual") {
                    notifyUser(message.gameId, {
                        type: "status",
                        message: {
                            status: gameStatusCode.CLOSED,
                            round_id: settings.roundId
                        }
                    });
                } else {
                    notifyAll({
                        type: "status",
                        message: {
                            status: gameStatusCode.CLOSED,
                            round_id: settings.roundId
                        }
                    });
                }
                runtime.setGameState('CLOSED', "Closed round: " + settings.roundId);
                break;
            case gameStatusCode.WINNUMBER:
                settings.endDate = context.date;
                var winNumber = message.number;
                if (winNumber > -1) {
                    history[gameId].unshift(message.number);
                    if (history[gameId].length > 99) {
                        history[gameId] = history[gameId].splice(0, 99);
                    }
                    recalculateStatistics(message.gameId);
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
                    findWinners(gameId, winNumber);
                    runtime.setGameState('WINNING', "Winning number: " + winNumber);
                    settings.roundId = context.roundCounter.increase()
                } else {
                    context.accountingHelper.cancelBets(settings.roundId, "Round cancelled.");
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
                                    balance: user.balance
                                }
                            });
                    }
                    bets[gameId] = [];
                    runtime.setGameState('CANCELLED', "Round cancelled. RoundID:" + settings.roundId);
                    context.log("Round cancelled. RoundID:" + settings.roundId);
                }
                break;
        }
        context.saveSettings(settings);
    }

}

function onChangeGameState(datasource) {
    var messages = datasource.pick();
    messages.forEach(function (message) {
        changeGameState(message);
    });
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
    if(!settings.roundId){
        settings.roundId = context.roundCounter.current;
    }
    switch (message.type) {
        case "get_limits":
            return { success: true, limits: context.gameConfiguration.Limits };
        case "put_limits":
            return { success: true };
        case "history":
            return { success: true, data: history[gameId] };
        case "stats":
            return { success: true, data: statistics[gameId] };
        case "bet":
            if (currentGameState[gameId] != gameStatusCode.OPENED) {
                return { success: false, balance: user.balance, error: "TABLE_CLOSED", bets: message.bets };
            }

            try {
                message.bets.forEach(function (bet) {
                    var betObj = { sessionId: sessionId, betInfo: bet };
                    if (context.accountingHelper.registerBet(sessionId, settings.roundId, bet.amount, makeBetObject(betObj), "Bet at round " + settings.roundId) != 0) {
                            throw "INSUFFICIENT_FUNDS";
                    }
                    bets[gameId].push(betObj);
                    bet.wasMade = true;
                });
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
            var cancelBets = bets[gameId].filter(function (bet) {
                return bet.sessionId === sessionId;
            });
            cancelBets.forEach(function (bet) {
                if (bet.sessionId == sessionId) {
                    if (context.accountingHelper.cancelBet(bet.sessionId, settings.roundId, bet.betInfo.amount, makeBetObject(bet)) != 0) {
                        throw "ROLLBACK_ERROR";
                    }
                    bets[gameId].splice(bets[gameId].indexOf(bet), 1);
                }
            });
        } catch (e) {
            result = { success: false, balance: user.balance, error: e.toString(), bets: message.cancelBets };
            return result;
            }
            result = { success: true, balance: user.balance};
            return result;
         case "cancel_last":
             if (currentGameState[gameId] != gameStatusCode.OPENED) {
                 return { success: false, balance: user.balance, error: "TABLE_CLOSED", bets: message.bets };
            }
         try {
             var cancelBets = [];
             cancelBets = bets[gameId].filter(function (bet) {
                 return bet.sessionId == sessionId;
             }).filter(function (bet) {
                 return message.bet.type === bet.betInfo.type;
             });
             var cancelBet = cancelBets[cancelBets.length - 1];
            if (cancelBet.betInfo.amount > message.bet.amount) {
               cancelBet.betInfo.amount -= message.bet.amount;
            } else {
                bets[gameId].splice(bets[gameId].indexOf(cancelBet), 1);
            }
            if (context.accountingHelper.cancelBet(cancelBet.sessionId, settings.roundId, cancelBet.betInfo.amount, makeBetObject(cancelBet)) != 0) {
               throw "ROLLBACK_ERROR";
           }
        } catch (e) {
            result = { success: false, balance: user.balance, error: e.toString(), bets: message.cancelBets };
            return result;
            }
            result = { success: true, balance: user.balance};
            return result;
         case "balance":
            return { success: true, balance: user.balance };
        case "start_game":
            if (currentGameState[gameId] === gameStatusCode.CLOSED && currentGameState[gameId] === gameStatusCode.WINNUMBER) {
                return { success: false, balance: user.balance, error: "GAME_ALREADY_BEGUN", bets: message.bets };
            }
            gameStatusManual(sessionId);
            return { success: true, balance: user.balance };
        
    }
};

game_initialize();
setMessageDispatcher(dispatcher);