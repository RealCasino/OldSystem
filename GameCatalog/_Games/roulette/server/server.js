
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
    var user = context.getUserInfo(sessionId);
    var waitTime = nextStateTime ? (new Date(nextStateTime).getTime() - new Date().getTime()) / 1000 : 0;
    var userBets = getUserBets(sessionId);
    notifyUser(sessionId, {
        type: "user",
        message: {
            sessionId: sessionId,
            balance: user.balance,
            videoDisabled: context.mediaHelper.isEmpty,
            user: user,
            currencyMultiplier:user.locale.currencyMultiplier,
            mode: context.gameConfiguration.Mode,
            waitTime: waitTime,
            roundId: context.roundCounter.current,
            serverDate:context.date,
            bets: userBets
        }
    });
    sendUsersBets(bets[context.gameConfiguration.Mode], sessionId);
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
                changeGameState({ gameId: sessionId, length: null, state: currenState, videos: [], oldSession: true  });
            }
        } else {
            changeGameState({ gameId: sessionId, length: null, state: gameStatusCode.OPENED, videos: [] });
            if (!context.mediaHelper.isEmpty) {
                if (context.mediaHelper.getVODInfo(context.mediaHelper.randomFile("Idle"))) {
                    context.mediaHelper.playVOD(sessionId, [{ name: context.mediaHelper.randomFile("Idle"), loop: true }]);
                } else {
                    context.mediaHelper.showScreen(sessionId, "WinnersFullscreen");
                }
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
