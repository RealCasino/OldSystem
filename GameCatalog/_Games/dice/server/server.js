
// Custom fields
 
var messages = []; 
var dispatcherCallback;
// Custom functions come below 

function getRng(sessionId) {
    if (context.gameConfiguration.Mode == "Manual") {
        return context.getUserInfo(sessionId).rng;
    }

    return context.rng;
}

function notifyAll(data) {
    context.sendAll(data);
}

function notifyUser(sessionId, data) {
    context.send(sessionId, data);
}

// Standard functions come below


function casinotv_initialize() {
    context.include("game.js");
}


function casinotv_before_restart() {
    //Perform any preparations if needed
    //Called only if script is reloaded in run-time
    context.log("Before restart!");
}

function casinotv_after_restart() {  
    //Perform any re-initialize if needed
    //Called only if script is reloaded in run-time
    context.log("After restart!");
} 

function casinotv_join(sessionId, isOldSession) {
    var userInfo = context.getUserInfo(sessionId);
    var nick = userInfo.nick;
    var userBets = getUserBets(sessionId);
    var user = { sessionId: sessionId, nick: nick, accountId: userInfo.accountId, balance: userInfo.balance, isPlayingForFun: userInfo.isPlayingForFun, userData: userInfo.UserData };
    context.log("User joined with sesionId:" + sessionId); 
    var waitTime = (new Date(nextStateTime).getTime() - new Date().getTime()) / 1000;
    var cfg = context.gameConfiguration;
    cfg.Criteria.forEach(function (criteriaItem) {
        criteriaItem.MinBet = parseFloat(parseFloat(criteriaItem.MinBet) * userInfo.locale.currencyMultiplier).toFixed(2);
        criteriaItem.MaxBet = parseFloat(parseFloat(criteriaItem.MaxBet) * userInfo.locale.currencyMultiplier).toFixed(2);
    });
    cfg.MinBet = parseFloat(parseFloat(cfg.MinBet) * userInfo.locale.currencyMultiplier).toFixed(2);
    cfg.MaxBet = parseFloat(parseFloat(cfg.MaxBet) * userInfo.locale.currencyMultiplier).toFixed(2);
    notifyUser(sessionId, { type: "config", message: { configuration: cfg, mode: context.gameConfiguration.Mode, waitTime: waitTime } });
    notifyUser(sessionId, { type: "user", message: { "sessionId": sessionId, balance: user.balance, user: user, bets: userBets } });
    notifyUser(sessionId, {
        type: "balance",
        message: {
            balance: userInfo.balance,
            totalLost: userInfo.totalLoss
        }
    });
    if (!isOldSession) {
        if (context.gameConfiguration.Mode == "Manual") {
            createGame(sessionId);
        }
    }
    if (context.gameConfiguration.Mode == "Manual") {
        if (isOldSession) {
            if (currentGameState[sessionId] != gameStatusCode.WINNUMBER) {
                var currenState = currentGameState[sessionId];
                currentGameState[sessionId] = "";
                changeGameState({ gameId: sessionId, length: null, state: currenState, videos: [], oldSession: true });
            }
        } else {
            changeGameState({ gameId: sessionId, length: null, state: gameStatusCode.OPENED, videos: [] });
            if (context.mediaHelper.getVODInfo("Idle")) {
                if (context.mediaHelper.mode == "VOD") {
                    context.mediaHelper.playVOD(sessionId, [{ name: "Idle", loop: true }]);
                } 
            } else {
                if (context.mediaHelper.mode == "VOD") {
                    context.mediaHelper.showScreen(sessionId, "WINNERS");
                }else{
                    context.mediaHelper.sendVirtualCommand(sessionId, {
                         "type": "unity",
                         "state": 0
                  });
                }
            }
        }

    }
}

 
function casinotv_callback(sessionId, data) {
    if (data) {
        if (dispatcherCallback) {
            return dispatcherCallback(sessionId,data);
        }
    }
}

function casinotv_leave(sessionId) {
    if (context.gameConfiguration.Mode == "Manual") {
        clearUserData(sessionId);
    }
}

function casinotv_terminate() {
    notifyAll({ "type": "shutdown" });
}

function setMessageDispatcher(dispatcher) {
    dispatcherCallback = dispatcher;
}

function showWinners(winners) {
    var command = "theGameCtrl.showWinners([";
    if (winners.length > 0) {
        for (var i = 0; i < winners.length; i++)
            command += "[" + winners[i].name + "," + winners[i].winSum + "]";
    } else {
        command += "[]";
    }
    command += "])";
    context.sendMediaCommand(command);
}
