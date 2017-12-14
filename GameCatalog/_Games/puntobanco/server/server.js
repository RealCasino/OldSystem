
// Custom fields

var messages = [];
var dispatcherCallback;
// Custom functions come below 

function getRng(sessionId) {
    var rng;
    if (context.gameConfiguration.Mode == "Manual") {
        rng= context.getUserInfo(sessionId).rng;
    }else{
        rng = context.rng;
    }
    if (!rng) {
        throw "FATAL_ERROR_RNG_IS_NULL";
    }  
    return rng;
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
    var user = context.getUserInfo(sessionId);
    var userInfo = { nick: user.nick, balance: user.balance, isPlayingForFun: user.isPlayingForFun };
    var waitTime = context.gameConfiguration.Mode != "Manual"?(new Date(nextStateTime).getTime() - new Date().getTime()) / 1000:null;
    var userBets = getUserBets(sessionId);
    notifyUser(sessionId, { type: "user", message: { "sessionId": sessionId, balance: user.balance, user: userInfo, mode: context.gameConfiguration.Mode, waitTime: waitTime, bets: userBets } });
    notifyUser(sessionId, {
        type: "balance",
        message: {
            balance: user.balance,
            totalLost: user.totalLoss
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
                context.mediaHelper.playVOD(sessionId, [{ name: "Idle", loop: true }]);
            } else {
                context.mediaHelper.showScreen(sessionId, "WinnersFullscreen");
            }
        }
    }
}


function casinotv_callback(sessionId, data) {
    if (data) {
        if (dispatcherCallback) {
            return dispatcherCallback(sessionId, data);
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
