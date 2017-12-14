var betErrorCodes = {
  FATAL_ERROR: -1,
  SESSION_NOT_FOUND: -2,
  INVALID_AMOUNT: -3,
  INSUFFICIENT_FUNDS: -4
};
var currentGameState = "";
var physicalMap =  [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8];
var shuffledMap = {}, finalShuffledMaps = {};

function isEmpty(obj) {
  for (var k in obj) if (obj.hasOwnProperty(k)) return false;
  return true;
}

function game_initialize() {
  var gameConfiguration = {};
  if (!context.gameConfiguration) {
    throw "GAME_NOT_CONFIGURED";
  }
  gameConfiguration = context.gameConfiguration;
  settings = context.loadSettings();
  if (isEmpty(settings)) {
    settings = {
      gameState: -1,
      history: [],
      roundId: context.roundCounter.current,
      startDate: null,
      endDate: null
    };
  }
  if (gameConfiguration.Mode === "Manual") {
    runtime.isProvablyFair = true;
  }
  runtime.isMultiplayer = false;
  runtime.gameTimeoutInSeconds = 0;
  currentGameState = settings.gameState;
  runtime.onServerMessage = OnServerMessage;
  context.debug("Game server initialized!");
}

function OnServerMessage(message) {
}
function createGame(sessionId) {
  shuffledMap[sessionId] = getRng(sessionId).shuffle(physicalMap);
}

var dispatcher = function messageDispatcher(sessionId, message) {
  var user, gameId;
  var betData, totalBet;

  context.debug("messageDispatcher...");
  context.debug(
    "type:" +
    message.type +
    " currentState: " +
    currentGameState +
    " sessionId: " +
    sessionId +
    " roundId: " +
    settings.roundId
  );
  user = context.getUserInfo(sessionId);
  if (!user) {
    return null;
  }
  gameId = sessionId;
  if (!settings.roundId) {
    settings.roundId = context.roundCounter.current;
  }
  switch (message.type) {
    case "spin":
      if(typeof shuffledMap[gameId] === 'undefined'){
        shuffledMap[gameId] = getRng(sessionId).shuffle(physicalMap);
      }
      finalShuffledMaps[gameId] = getRng(gameId).finalShuffle(shuffledMap[gameId]);
      totalBet = message.totalBet;
      if(validateBet(sessionId, totalBet)){
        betData = {
          amount: totalBet,
          type: "TotalBet"
        };
        var betResult = context.accountingHelper.registerBet(sessionId, settings.roundId, betData.amount, betData, "Bet at round " + settings.roundId);
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
        var bla = finalShuffledMaps[gameId].shift();
        shuffledMap[sessionId] = getRng(sessionId).shuffle(physicalMap);

        return {success: true, balance: user.balance, bla:bla};
      } else{
        throw "LIMIT_REACHED";
      }
    case "balance":
      return {success: true, balance: user.balance};
  }
};

/*function completeBets(sessionId) {
  var user = context.getUserInfo(sessionId);
  try {
    var completeResultCode = context.accountingHelper.completeBets(sessionId, settings.roundId, function() {
    }, function() {
      notifyUser(sessionId, {
        type: "error",
        message: "Complete bets failed.",
        balance: user.balance
      });
      context.logError("Complete bets failed.");
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
    notifyUser(sessionId, {
      type: "error",
      message: err
    });
    context.logError("Complete bets failed.");
    context.logError(err);
  }
}*/

function validateBet(sessionId, bet) {
  var isValid = true, userSettings, MinBet, maxLimit;
  userSettings = context.loadUserSettings(sessionId);
  if (userSettings && (userSettings.MinBet && userSettings.MaxBet )) {
    minBet = userSettings.MinBet;
    maxBet = userSettings.MaxBet;
  } else {
    minBet = context.gameConfiguration.MinBet;
    maxBet = context.gameConfiguration.MaxBet
  }

  if(bet > maxBet || bet < minBet ){
    isValid = false;
  }
  return isValid;
}

game_initialize();
setMessageDispatcher(dispatcher);
