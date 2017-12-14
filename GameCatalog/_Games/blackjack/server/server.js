
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
    var user = { sessionId: sessionId, nick: nick, accountId: userInfo.accountId, balance: userInfo.balance, isPlayingForFun: userInfo.isPlayingForFun, userData: userInfo.UserData };
    context.log("User joined with sesionId:" + sessionId);
    notifyUser(sessionId, { type: "user", message: { "sessionId": sessionId, balance: user.balance, user: user, gameId: context.roundCounter.current} });
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

/*function showWinners(winners) {
    var command = "theGameCtrl.showWinners([";
    if (winners.length > 0) {
        for (var i = 0; i < winners.length; i++)
            command += "[" + winners[i].name + "," + winners[i].winSum + "]";
    } else {
        command += "[]";
    }
    command += "])";
    context.sendMediaCommand(command);
}*/