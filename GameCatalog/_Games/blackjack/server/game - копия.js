var betErrorCodes = {
    FATAL_ERROR: -1,
    SESSION_NOT_FOUND: -2,
    INVALID_AMOUNT: -3,
    INSUFFICIENT_FUNDS: -4
}
var currentGameState = "";
var currentStakes = {}, settings = {}, winners = [], gameData = [];

var cardsValues = [
    11,2,3,4,5,6,7,8,9,10,10,10,10,
    11,2,3,4,5,6,7,8,9,10,10,10,10,
    11,2,3,4,5,6,7,8,9,10,10,10,10,
    11,2,3,4,5,6,7,8,9,10,10,10,10
];
var cards = [
    'AC','2C','3C','4C','5C','6C','7C','8C','9C', '10C', 'JC', 'QC', 'KC',
    'AD','2D','3D','4D','5D','6D','7D','8D','9D', '10D', 'JD', 'QD', 'KD',
    'AH','2H','3H','4H','5H','6H','7H','8H','9H', '10H', 'JH', 'QH', 'KH',
    'AS','2S','3S','4S','5S','6S','7S','8S','9S', '10S', 'JS', 'QS', 'KS'
];
var gUserCards = [], gDealerCards = [], gBets = [], duplicatCards =[];
var history = [], videoRng, part1Files;
var shuffledMaps= {}, finalShuffledMaps = {};

function playVideo(gameId, name){
    var part02Video;
    part02Video = '/Part02/' + name;
    context.mediaHelper.playVOD(gameId, [{ name: part02Video}]);
}

function introVideo(gameId){
    part1Files = context.mediaHelper.vodData.length_map['Part01'];
    var p1Index = videoRng.random(1, Object.keys(part1Files).length - 1);
    if(parseInt(p1Index, 10) <= 9){
        p1Index = '0' + p1Index;
    }
    part01Video = 'Part01/Wide%20' + p1Index;
    context.mediaHelper.playVOD(gameId, [{ name: part01Video, wait_previous: 3, loop:true }]);
}

function addIntroVideo(gameId, arr){
    var p1Index = videoRng.random(1, Object.keys(part1Files).length - 1);
    if(parseInt(p1Index, 10) <= 9){
        p1Index = '0' + p1Index;
    }
    part01Video = 'Part01/Wide%20' + p1Index;
    arr.push({ name: part01Video, loop:true });
}

function game_initialize() {
    var gameConfiguration = {};
    videoRng = context.rng.createNew();
    gameConfiguration = context.gameConfiguration;
    if(gameConfiguration.Limits.length == 0){
        throw "LIMIT_NOT_FOUND";
    }
    if (!context.gameConfiguration) {
        throw "GAME_NOT_CONFIGURED";
    }
    if ((!context.gameConfiguration.Mode)) {
        throw "GAME_MODE_NOT_SET";
    }
    settings = context.loadSettings();
    if (!settings) {
        settings = { gameState: -1,
            history: {},
            roundId: context.roundCounter.current,
            startDate: null,
            endDate: null
        };
    }
    runtime.isMultiplayer = false;
    runtime.isProvablyFair = true;
    runtime.gameTimeoutInSeconds = 0;
    runtime.onServerMessage = OnServerMessage;
    context.log("Game server initialized!");
}
function OnServerMessage(message) {
    if (message && message.type) {
        switch (message.type) {
            case "refresh_user_data":
                var user = context.getUserInfo(message.sessionId);
                notifyUser(message.sessionId, {
                    type: "balance",
                    message: {
                        balance: message.balance,
                        totalLost: message.totalLoss
                    }
                });
                break;
            case "enable_instance":
                instanceEnabled = true;
                break;
        }
    }
}
function isEmpty (obj) {
    for (var k in obj)
       if (obj.hasOwnProperty(k))
           return false;
    return true;
}

function createGame(sessionId) {
    gDealerCards[sessionId] = [];
    gUserCards[sessionId] = [];
    gBets[sessionId] = [];
    gameData[sessionId] = [];
    shuffledMaps[sessionId] = getRng(sessionId).shuffle(cards);
}

function clearUserData (sessionId){
    if(sessionId !== undefined){
        delete shuffledMaps[sessionId];
        delete finalShuffledMaps[sessionId];
        delete gDealerCards[sessionId];
        delete gUserCards[sessionId];
        delete gBets[sessionId];
        delete gameData[sessionId];

        gDealerCards = gDealerCards.filter(function (dCards){
            return dCards.sessionId !== sessionId;
        });
        gUserCards = gUserCards.filter(function (uCards){
            return uCards.sessionId !== sessionId;
        });
        gBets = gBets.filter(function (bet) {
            return bet.sessionId !== sessionId;
        });
        gameData = gameData.filter(function (data) {
            return data.sessionId !== sessionId;
        });
    }
}
function numRound(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function getCard(gameId) {
    var card;
    try {
        card = finalShuffledMaps[gameId].shift();
    } catch (e) {
        context.logError("Shift failed.");
        context.logError(e);
    }
    return card;
}
function completeBets(sessionId) {
    var user = context.getUserInfo(sessionId);
    try {
        var completeResultCode = context.accountingHelper.completeBets(sessionId, settings.roundId, function () {
        }, function () {
            notifyUser(sessionId, {
                type: "error",
                message: "Complete bets failed.",
                balance: user.balance
            });
            context.logError("Complete bets failed.");
        });
        switch (completeResultCode) {
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
    } catch (err) {
        notifyUser(sessionId, {
            type: "error",
            message: err
        });
        context.logError("Complete bets failed.");
        context.logError(err);
    }
}

var dispatcher = function messageDispatcher(sessionId, message) {
    var user, userCards = [], dealerCard, userCard, userCard2, otherOneCard, otherAllCards,
        points = 0, stake = [], sum = 0, firstPoint = 0, secondPoint = 0, isSuccess = true, getCards = false,
        hasWon = false, hasLost = false, hasPush = false, winRate = 1.5, winAmount = 0, position, insurance = 0, insuranceSum = 0,
        tmpUserCards, tmpUserCards2, splitItem = null, tmpVal = 0, filteredBet, filteredUserCards, filteredDealerCards,
        filteredData, stakeUserCards, betData, cancelBet, dealData, dealIdx, isExistInArray = false, alredySplired = [];
    var userSettings, selectedLimit = {};

    var gameId, videoOfCards=[], timerVideoOfCards = [], counter =0;
    var cancelResult, resultCode;

    context.debug("messageDispatcher...");
    context.debug("type:" + message.type + " currentState: " + currentGameState + " sessionId: " + sessionId + ' roundId: ' + settings.roundId);
    user = context.getUserInfo(sessionId);
    if (!user) {
        return null;
    }
    gameId = sessionId;
    if(!settings.roundId){
        settings.roundId = context.roundCounter.current;
    }
    switch (message.type) {
        case "get_data":{
            introVideo(gameId);
            filteredData = gameData.filter(function (data) {
                return data.sessionId === sessionId;
            });
            userSettings = context.loadUserSettings(sessionId);
            if (userSettings && userSettings.limit){
                selectedLimit = userSettings.limit;
            }
            return {success: true, limits: context.gameConfiguration.Limits, selectedLimit: selectedLimit, game: filteredData, gameData:gameData};
        }
        case "refresh_user_data":
            return { success: true, user: user };
        /*remove this after update*/
        case "get_limits":
            return { success: true, limits: context.gameConfiguration.Limits };
        case "put_limits":
            userSettings = context.loadUserSettings(sessionId);
            if (!userSettings) {
                userSettings = {};
            }
            userSettings.limit = message.limit;
            context.saveUserSettings(sessionId, userSettings);
            return { success: true, limit: userSettings.limit};
        case "history":
            return { success: true, data: history };
        case "bet":{

            filteredData = [];
            filteredData = gameData.filter(function (data) {
                return data.sessionId === sessionId;
            });
            try{

                if(validateBet(sessionId, message.bets[0].amount,  message.bets[0].pos)){
                    if(filteredData.length == 0){
                        gameData.push({
                            sessionId: sessionId,
                            type:'status',
                            status: 'bet',
                            idx: 0
                        });
                    }

                    if(message.bets.length>0){
                        message.bets.forEach(function(bet){
                            gBets.push({
                                sessionId: sessionId,
                                pos: bet.pos,
                                amount: bet.amount
                            });
                            betData = {
                                sessionId: sessionId,
                                pos: bet.pos,
                                amount: bet.amount
                            };
                            gameData.push({
                                sessionId: sessionId,
                                type:'bet',
                                value: bet['amount'],
                                pos: bet['pos'],
                                id: bet['id']
                            });
                            var betResult = context.accountingHelper.registerBet(sessionId, settings.roundId, bet.amount, betData, "Bet at round " + settings.roundId);
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
                            completeBets(sessionId);
                        });
                    } else {
                        throw "LIMIT_REACHED";
                    }
                }
            }catch(e){
                isSuccess = false;
                clearUserData(sessionId);
                context.debug(e);
            }
            return { success: isSuccess, balance: user.balance, betData:message.bets};
        }
        case "cancel_last":{
                filteredBet = [];
                filteredData = [];
            try{
                filteredBet = gBets.filter(function (bet) {
                    return bet.sessionId === sessionId && bet.pos == message.bet.type && bet.amount ==  message.bet.value;
                });
                filteredData = gameData.filter(function(data){
                    return data.sessionId === sessionId && data.type =='bet' && data.pos == message.bet.type && data.value ==  message.bet.value;
                });

                cancelBet = filteredBet.slice(-1)[0];
                cancelResult = context.accountingHelper.cancelBet(sessionId, settings.roundId, cancelBet.amount, cancelBet);
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
                gBets.splice(gBets.indexOf(cancelBet), 1);
                gameData.splice(gameData.indexOf(filteredData.slice(-1)[0]), 1);
                isSuccess = true;
            }catch(e){
                isSuccess = false;
                context.debug(e);
            }
            return{success: isSuccess, balance: user.balance};
        }
        case "cancel_all":{
                filteredBet = [];
                filteredData = [];
            try{
                filteredBet = gBets.filter(function (bet) {
                    return bet.sessionId === sessionId;
                });
                filteredData = gameData.filter(function(data){
                    return data.sessionId === sessionId && data.type =='bet';
                });
                cancelResult = context.accountingHelper.cancelBetsByUser(sessionId, settings.roundId);
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
                if(filteredBet.length > 0){
                    for (var i = 0; i < filteredBet.length; i++) {
                        gBets.splice(gBets.indexOf(filteredBet[i]), 1);
                    }
                }
                if(filteredData.length > 0){
                    for (var i = 0; i < filteredData.length; i++) {
                        gameData.splice(gameData.indexOf(filteredData[i]));
                    }
                }
                isSuccess = true;
            }catch(e){
                isSuccess = false;
                context.debug(e);
            }
            return {success: isSuccess, balance: user.balance};
        }
        case "stand":{
            filteredData = [];
            filteredData = gameData.filter(function (data) {
                return data.sessionId === sessionId && data.type == 'status';
            });
            if(filteredData.length > 0){
                gameData[gameData.indexOf(filteredData[0])]['idx'] = parseFloat(message.index);
            }

            return {success: true, filteredData: filteredData};
        }
        case "deal":{
            videoOfCards = [];
            finalShuffledMaps[gameId] = getRng(gameId).finalShuffle(shuffledMaps[gameId]);
            filteredBet = [];
            filteredData = [];
            dealerCard = getCard(gameId);
            videoOfCards.push({name: '/Part02/' + dealerCard});
            timerVideoOfCards.push(1 + context.mediaHelper.getVODInfo('/Part02/' + dealerCard).length);
            playVideo(gameId, dealerCard);
            points = cardsValues[cards.indexOf(dealerCard)];
            gDealerCards.push({
                sessionId: sessionId,
                points: points,
                totalPoints:0,
                count:0
            });
            gameData.push({
                sessionId: sessionId,
                type:'dealer',
                cards: dealerCard
            });
            filteredData = gameData.filter(function (data) {
                return data.sessionId === sessionId;
            });

            try{
                filteredBet = gBets.filter(function (bet) {
                    return bet.sessionId === sessionId;
                });
                dealData = [];
                dealIdx = 0;
                /*sum element with the same postion*/
                for(var a= 0; a < filteredBet.length; a++){
                    isExistInArray = false;
                    for(var b =0; b < dealData.length; b++){
                        if(dealData[b].pos == filteredBet[a].pos){
                            isExistInArray = true;
                            dealIdx = b;
                        }
                    }
                    if(isExistInArray){
                        if(dealIdx !== undefined){
                            dealData[dealIdx].amount += filteredBet[a].amount;
                        }
                    }else{
                        dealData.push(filteredBet[a]);
                    }
                }
                /*sort by position*/
                dealData.sort(function(a, b){
                    return a.pos - b.pos;
                });

                for(var d = 0; d < dealData.length; d++){
                    userCard = getCard(gameId);
                    userCard2 = getCard(gameId);
                    //del
                    if(d==0){
                        userCard = 'QH';
                        userCard2 = 'QH';
                    }

                    videoOfCards.push({name: '/Part02/' + userCard});
                    timerVideoOfCards.push(1 + context.mediaHelper.getVODInfo('/Part02/' + userCard).length);

                    firstPoint = cardsValues[cards.indexOf(userCard)];
                    secondPoint = cardsValues[cards.indexOf(userCard2)];
                    userCards.push({
                        first: userCard,
                        second : userCard2,
                        pos: dealData[d].pos
                    });

                    if ((firstPoint + secondPoint) > 21 && secondPoint == 11){
                        points = firstPoint +1;
                    }else{
                        points = firstPoint + secondPoint;
                    }
                    gUserCards.push({
                        sessionId: sessionId,
                        pos: dealData[d].pos,
                        points: points,
                        first: firstPoint,
                        second: secondPoint,
                        stack: dealData[d].amount,
                        insurance: 0
                    });
                    gameData.push({
                        sessionId: sessionId,
                        type:'user',
                        stack: dealData[d].amount,
                        pos: dealData[d].pos,
                        cards: userCard+','+ userCard2,
                        isSplit: false,
                        insurance: 0
                    });
                }
                if(filteredData.length > 0){
                    for (var i = 0; i < filteredData.length; i++) {
                        if(filteredData[i].type == 'status'){
                            gameData[gameData.indexOf(filteredData[i])].status = 'deal';
                        }
                    }
                }
                for (var i = 0; i < userCards.length; i++) {
                    videoOfCards.push({name: '/Part02/' + userCards[i].second});
                    timerVideoOfCards.push(1 + context.mediaHelper.getVODInfo('/Part02/' + userCards[i].second).length);
                }
                addIntroVideo(gameId, videoOfCards);
                counter = 0;
                function timerVideo(){
                    context.mediaHelper.playVOD(gameId, [videoOfCards[counter] ]);
                    counter +=1;
                    if(counter < videoOfCards.length){
                        context.setTimeout(timerVideo, (1 + context.mediaHelper.getVODInfo(videoOfCards[counter-1].name).length) * 1000);
                    }
                }

                timerVideo();
                isSuccess = true;
            }catch(e){
                isSuccess = false;
                clearUserData(sessionId);
                context.debug(e);
            }
            return {success: isSuccess, userCards: userCards,  dealerCard: dealerCard, videoTimer: timerVideoOfCards};
        }
        case "hit":
            filteredBet = [];
            tmpUserCards = [];
            filteredData = [];
            videoOfCards = [];
            timerVideoOfCards =[];
            if(Boolean(message.isSplit)){
                splitItem = parseInt(message.splitPos, 10);
                position = parseInt(message.chipPos, 10);
                if(splitItem == 1){
                    position += 0.2;
                }
            }else{
                position = parseInt(message.chipPos, 10);
            }
            tmpUserCards = gUserCards.filter(function(uCards){
                return uCards.sessionId === sessionId && uCards.pos == position;
            });


            if (tmpUserCards.length > 0){
                if(tmpUserCards[0]['points'] < 21) {
                    otherOneCard = getCard(gameId);
                    videoOfCards.push({name: '/Part02/' + otherOneCard});
                    timerVideoOfCards.push(1 + context.mediaHelper.getVODInfo('/Part02/' + otherOneCard).length);
                    points = cardsValues[cards.indexOf(otherOneCard)];

                    filteredData = gameData.filter(function (data) {
                        return data.sessionId === sessionId && (data.type == 'status' || data.type == 'user') ;
                    });

                    filteredData.forEach(function(data){
                        if(data.type == 'status'){
                            data.status = 'hit';
                        }else if(data.type == 'user'){
                            if (tmpUserCards[0]['pos'] == data.pos){
                                gameData[gameData.indexOf(data)].cards = data.cards + ',' + otherOneCard;
                            }
                        }
                    });

                    if((tmpUserCards[0]['points'] + points) > 21 && points == 11){
                        tmpUserCards[0]['points'] += 1;
                    }else{
                        tmpUserCards[0]['points'] += points;
                    }

                    for (var i = 0; i < gUserCards.length; i++) {
                        for(var key in gUserCards[i]){
                            if(gUserCards[i].hasOwnProperty(key)){
                                if (gUserCards[i].sessionId == sessionId &&  gUserCards[i].pos == tmpUserCards[0].pos){
                                    gUserCards[i].points = tmpUserCards[0]['points'];
                                }
                            }
                        }
                    }

                    addIntroVideo(gameId, videoOfCards);
                    counter = 0;
                    function timerVideo(){
                        context.mediaHelper.playVOD(gameId, [videoOfCards[counter] ]);
                        counter +=1;
                        if(counter < videoOfCards.length){
                            context.setTimeout(timerVideo, (1 + context.mediaHelper.getVODInfo(videoOfCards[counter-1].name).length) * 1000);
                        }
                    }

                    timerVideo();
                } else {
                    return {
                       success: false,
                    };
                }
                isSuccess = true;
            }else{
                isSuccess = false;
            }

            return {
                success: isSuccess,
                card: otherOneCard,
                filteredData:filteredData,
                tmpUserCards:tmpUserCards,
                gUserCards:gUserCards,
                videoTimer: timerVideoOfCards
            };

        case "split":
            filteredUserCards = [];
            tmpUserCards = [];
            videoOfCards = [];
            timerVideoOfCards =[];
            position = parseInt(message.chipPos, 10) ;
            filteredUserCards = gUserCards.filter(function(uCards){
                return uCards.sessionId === sessionId && uCards.pos == position;
            });
            alredySplired = gUserCards.filter(function(uCards){
                return uCards.sessionId === sessionId && uCards.pos == position + 0.2;
            });
            if(filteredUserCards.length >0) {
                if (filteredUserCards[0]['first'] == filteredUserCards[0]['second'] && alredySplired.length === 0) {
                    userCard = getCard(gameId);
                    userCard2 = getCard(gameId);
                    videoOfCards.push({name: '/Part02/' + userCard});
                    videoOfCards.push({name: '/Part02/' + userCard2});
                    timerVideoOfCards.push(1 + context.mediaHelper.getVODInfo('/Part02/' + userCard).length);
                    timerVideoOfCards.push(1 + context.mediaHelper.getVODInfo('/Part02/' + userCard2).length);
                    firstPoint = cardsValues[cards.indexOf(userCard)];
                    secondPoint = cardsValues[cards.indexOf(userCard2)];
                    points = parseFloat(filteredUserCards[0]['first']) + firstPoint;
                    sum = filteredUserCards[0]['stack'];
                    tmpUserCards.push({
                        sessionId: sessionId,
                        first: filteredUserCards[0]['first'],
                        second: firstPoint,
                        insurance: filteredUserCards[0]['insurance'],
                        pos: parseInt(filteredUserCards[0]['pos'], 10),
                        points: points,
                        stack: filteredUserCards[0]['stack']
                    });
                    filteredData = gameData.filter(function (data) {
                        return data.sessionId === sessionId && (data.type == 'status' || data.type == 'user');
                    });
                    points = parseFloat(filteredUserCards[0]['second']) + secondPoint;
                    tmpUserCards.push({
                        sessionId: sessionId,
                        first: filteredUserCards[0]['second'],
                        second: secondPoint,
                        insurance: filteredUserCards[0]['insurance'],
                        pos: parseInt(filteredUserCards[0]['pos'], 10) + 0.2,
                        points: points,
                        stack: filteredUserCards[0]['stack']
                    });
                    for (var i = 0; i < filteredData.length; i++) {
                        if(filteredData[i].type == 'status'){
                            filteredData[i].status = 'split';
                        }else if(filteredData[i].type == 'user'){
                            if(filteredData[i].pos == filteredUserCards[0]['pos']){
                                filteredData[i].cards = filteredUserCards[0]['first']+','+userCard;
                                filteredData[i].isSplit = true;
                            }
                        }
                    }
                    gameData.push({
                        sessionId: sessionId,
                        type: 'user',
                        stack: parseFloat(filteredUserCards[0]['stack']) + parseFloat(filteredUserCards[0]['insurance']),
                        pos: parseInt(filteredUserCards[0]['pos'], 10) + 0.2,
                        cards: filteredUserCards[0]['second']+','+userCard2,
                        isSplit: true,
                        insurance: parseFloat(filteredUserCards[0]['insurance'])
                    });
                    gameData.push({
                        sessionId: sessionId,
                        type:'bet',
                        value: parseFloat(filteredUserCards[0]['stack']) + parseFloat(filteredUserCards[0]['insurance']),
                        pos: position,
                        id: 0
                    });

                    gBets.push({
                        sessionId: sessionId,
                        pos: parseInt(filteredUserCards[0]['pos'], 10) + 0.2,
                        amount: parseFloat(filteredUserCards[0]['stack']) + parseFloat(filteredUserCards[0]['insurance']),
                    });
                    gUserCards.splice(gUserCards.indexOf(filteredUserCards[0]), 1);
                    for(var i = 0; i < tmpUserCards.length; i++){
                        gUserCards.push(tmpUserCards[i]);
                    }

                    addIntroVideo(gameId, videoOfCards);
                    counter = 0;
                    function timerVideo(){
                        context.mediaHelper.playVOD(gameId, [videoOfCards[counter] ]);
                        counter +=1;
                        if(counter < videoOfCards.length){
                            context.setTimeout(timerVideo, (1 + context.mediaHelper.getVODInfo(videoOfCards[counter-1].name).length) * 1000);
                        }
                    }

                    timerVideo();
                    try{
                        var betResult = context.accountingHelper.registerBet(sessionId, settings.roundId, sum, gBets, "Split cards at round " + settings.roundId);
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

                        completeBets(sessionId);
                            isSuccess = true;
                    }catch(e){
                        isSuccess = false;
                        context.debug(e);
                    }

                } else {
                    return {
                        success: false
                    }
                }
            }else{
                isSuccess = false;
            }
            return {
                success: isSuccess,
                card: userCard,
                card2: userCard2,
                balance:user.balance,
                stack:sum,
                insurance: tmpUserCards[0]['insurance'],
                videoTimer: timerVideoOfCards
            };
        case "double":
            tmpUserCards = [];
            filteredBet = [];
            filteredUserCards = [];
            videoOfCards = [];
            timerVideoOfCards =[];
            if(Boolean(message.isSplit)){
                splitItem = parseInt(message.splitPos, 10);
                position = parseInt(message.chipPos, 10);
                if(splitItem == 1){
                    filteredUserCards = gUserCards.filter(function(uCards){
                        return uCards.sessionId === sessionId && uCards.pos == position;
                    });
                    position += 0.2;
                    tmpVal = filteredUserCards[0]['stack'];
                }
            }else{
                position = parseInt(message.chipPos, 10);
            }

            tmpUserCards = gUserCards.filter(function(uCards){
                return uCards.sessionId === sessionId && uCards.pos == position;
            });

            if(tmpUserCards[0]['points'] < 11 ){
                otherOneCard = getCard(gameId);
                points = cardsValues[cards.indexOf(otherOneCard)];
                videoOfCards.push({name: '/Part02/' + otherOneCard});
                timerVideoOfCards.push(1 + context.mediaHelper.getVODInfo('/Part02/' + otherOneCard).length);

                filteredData = gameData.filter(function (data) {
                    return data.sessionId === sessionId && (data.type == 'status' || data.type == 'user') ;
                });

                tmpUserCards[0]['points'] += points;
                sum = tmpUserCards[0]['stack'];
                tmpUserCards[0]['stack'] = parseFloat(tmpUserCards[0]['stack']) * 2;

                gBets.push({
                    sessionId: sessionId,
                    pos: position,
                    amount: sum
                });

                filteredBet = gBets.filter(function (bet) {
                    return bet.sessionId === sessionId && bet.pos == position;
                });

                filteredData.forEach(function(gData){
                    if(gData.type == 'status'){
                        gData.status = 'double';
                    }else if(gData.type == 'user'){
                        if (tmpUserCards[0].pos == gData.pos){
                            gameData[gameData.indexOf(gData)].cards = gData.cards + ',' + otherOneCard;
                            gameData[gameData.indexOf(gData)].stack = tmpUserCards[0]['stack'] + gameData[gameData.indexOf(gData)].insurance
                        }
                    }
                });

                gameData.push({
                    sessionId: sessionId,
                    type:'bet',
                    value: sum,
                    pos: position,
                    id: 0
                });

                for (var i = 0; i < gUserCards.length; i++) {
                    for(var key in gUserCards[i]){
                        if(gUserCards[i].hasOwnProperty(key)){
                            if (gUserCards[i].sessionId == sessionId &&  gUserCards[i].pos == tmpUserCards[0].pos){
                                gUserCards[i].points = tmpUserCards[0]['points'];
                                gUserCards[i].stack = tmpUserCards[0]['stack'];
                            }
                        }
                    }
                };

                addIntroVideo(gameId, videoOfCards);
                counter = 0;
                function timerVideo(){
                    context.mediaHelper.playVOD(gameId, [videoOfCards[counter] ]);
                    counter +=1;
                    if(counter < videoOfCards.length){
                        context.setTimeout(timerVideo, (1 + context.mediaHelper.getVODInfo(videoOfCards[counter-1].name).length) * 1000);
                    }
                }

                timerVideo();
                try{
                    var betResult = context.accountingHelper.registerBet(sessionId, settings.roundId, sum, filteredBet, "Double bet at round " + settings.roundId);
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
                    completeBets(sessionId);
                    isSuccess = true;
                }catch(e){
                    isSuccess = false;
                    context.debug(e);
                }
                return {
                    success: isSuccess,
                    card: otherOneCard,
                    balance:user.balance,
                    stack: sum,
                    prevVal: tmpVal,
                    pos: tmpUserCards[0]['pos'],
                    insurance: tmpUserCards[0]['insurance'],
                    videoTimer: timerVideoOfCards
                };
            } else {
                return {
                    success:false
                };
            }



        case "insurance":
            filteredDealerCards = gDealerCards.filter(function(dCards){
                return dCards.sessionId === sessionId;
            });
            if(filteredDealerCards[0]['points'] == 11){
                if(Boolean(message.isSplit)){
                    splitItem = parseInt(message.splitPos, 10);
                    position = parseInt(message.chipPos, 10);
                    if(splitItem == 1){
                        filteredUserCards = gUserCards.filter(function(uCards){
                            return uCards.sessionId === sessionId && uCards.pos == position;
                        });
                        position += 0.2;
                        tmpVal = filteredUserCards[0]['stack'] + filteredUserCards[0]['insurance'];
                    }else if(splitItem == 0){
                        filteredUserCards = gUserCards.filter(function(uCards){
                            return uCards.sessionId === sessionId && uCards.pos == parseInt(position, 10) + 0.2;
                        });
                        tmpVal = filteredUserCards[0]['stack'] + filteredUserCards[0]['insurance'];
                    }else{
                        tmpVal = 0;
                    }

                }else{
                    position = parseInt(message.chipPos, 10);
                }

                tmpUserCards = gUserCards.filter(function(uCards){
                    return uCards.sessionId === sessionId && uCards.pos == position;
                });

                tmpUserCards[0]['insurance'] = tmpUserCards[0]['stack'] / 2;
                sum = tmpUserCards[0]['stack'] + tmpUserCards[0]['insurance'];

                filteredData = gameData.filter(function (data) {
                    return data.sessionId === sessionId && (data.type == 'status' || data.type == 'user');
                });

                filteredData.forEach(function(gData){
                    if(gData.type == 'status'){
                        gData.status = 'insurance';
                    }else if(gData.type == 'user'){
                        gameData[gameData.indexOf(gData)].stack = sum;
                        gameData[gameData.indexOf(gData)].insurance = tmpUserCards[0]['insurance'];
                    }
                });

                for (var i = 0; i < gUserCards.length; i++) {
                    for(var key in gUserCards[i]){
                        if(gUserCards[i].hasOwnProperty(key)){
                            if (gUserCards[i].sessionId == sessionId &&  gUserCards[i].pos == tmpUserCards[0].pos){
                                gUserCards[i].insurance = tmpUserCards[0]['insurance'];
                            }
                        }
                    }
                };

                try{
                    var betResult = context.accountingHelper.registerBet(sessionId, settings.roundId, tmpUserCards[0]['insurance'], null, "Insurance bet at round " + settings.roundId);
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
                    completeBets(sessionId);
                    gameData.push({
                        sessionId: sessionId,
                        type:'bet',
                        value: tmpUserCards[0]['insurance'],
                        pos: position,
                        id: 0
                    });
                    gBets.push({
                        sessionId: sessionId,
                        pos: position,
                        amount: tmpUserCards[0]['insurance']
                    });

                }catch(e){
                    isSuccess = false;
                    context.debug(e);
                }
                return {
                    success: isSuccess,
                    balance: user.balance,
                    insurance: tmpUserCards[0]['insurance'],
                    totalInsurance: sum,
                    pos: tmpUserCards[0]['pos'],
                    stack:tmpVal
                };
            }else{
                return {success: false};
            }
        case "get_dealer_cards":{
            otherAllCards = [];
            tmpUserCards = [];
            filteredUserCards = [];
            videoOfCards = [];
            timerVideoOfCards = [];
            filteredUserCards = gUserCards.filter(function(uCards){
                return uCards.sessionId === sessionId;
            });
            filteredDealerCards = gDealerCards.filter(function(dCards){
                return dCards.sessionId === sessionId;
            });

            for (var i = 0; i < filteredUserCards.length; i++) {
                if(filteredUserCards[i]['points'] > 21 && getCards == false){
                }else{
                    getCards = true;
                }
            }
            filteredDealerCards[0]['totalPoints'] = filteredDealerCards[0]['points'];
            if (getCards && filteredDealerCards[0]['totalPoints'] < 17){
                while(filteredDealerCards[0]['totalPoints'] < 17){
                    otherOneCard = getCard(gameId);
                    videoOfCards.push({name: '/Part02/' + otherOneCard});
                    timerVideoOfCards.push(1 + context.mediaHelper.getVODInfo('/Part02/' + otherOneCard).length);

                    points = cardsValues[cards.indexOf(otherOneCard)];
                    if((filteredDealerCards[0]['totalPoints'] + points) > 21 && points == 11){
                        points = 1;
                    }

                    filteredDealerCards[0]['totalPoints'] = filteredDealerCards[0]['totalPoints'] + points;
                    filteredDealerCards[0]['count'] = filteredDealerCards[0]['count'] + 1;
                    otherAllCards.push(otherOneCard);
                }
            }else{
                otherOneCard = getCard(gameId);
                videoOfCards.push({name: '/Part02/' + otherOneCard});
                timerVideoOfCards.push(1 + context.mediaHelper.getVODInfo('/Part02/' + otherOneCard).length);
                points = cardsValues[cards.indexOf(otherOneCard)];
                if((filteredDealerCards[0]['totalPoints'] + points) > 21 && points == 11){
                    points = 1;
                }

                filteredDealerCards[0]['totalPoints'] = filteredDealerCards[0]['totalPoints'] + points;
                filteredDealerCards[0]['count'] = filteredDealerCards[0]['count'] + 1;
                otherAllCards.push(otherOneCard);
            }

            addIntroVideo(gameId, videoOfCards);
            counter = 0;
            function timerVideo(){
                context.mediaHelper.playVOD(gameId, [videoOfCards[counter] ]);
                counter +=1;
                if(counter < videoOfCards.length){
                    context.setTimeout(timerVideo, (1 + context.mediaHelper.getVODInfo(videoOfCards[counter-1].name).length) * 1000);
                }
            }

            timerVideo();

            return {success: true, cards: otherAllCards, videoTimer: timerVideoOfCards};
        }
        case "stake":{
            sum = 0;
            winAmount = 0;

            filteredDealerCards = gDealerCards.filter(function(dCards){
                return dCards.sessionId === sessionId;
            });
            filteredUserCards = gUserCards.filter(function(uCards){
                return uCards.sessionId === sessionId;
            });
            for(var i=0; i < filteredUserCards.length; i++){
                stakeUserCards = filteredUserCards[i];
                if(filteredDealerCards[0]['points'] == 11 && filteredDealerCards[0]['totalPoints'] == 21){
                    insurance = stakeUserCards['insurance'] * 2;
                }
                if(stakeUserCards['points'] < 21){
                    winRate = 1;
                }

                if((filteredDealerCards[0]['points'] == 11 || filteredDealerCards[0]['points'] == 10) && filteredDealerCards[0]['totalPoints'] == 21 && filteredDealerCards[0]['count'] == 1){
                    if(stakeUserCards['first'] + stakeUserCards['second'] == 21 && stakeUserCards['points'] == 21){
                        sum += stakeUserCards['stack'];
                        stake.push({
                            status: 'push',
                            pos: stakeUserCards['pos'],
                            gainings: stakeUserCards['stack']
                        });
                        hasPush = true;
                    }else{
                        insuranceSum += insurance;
                        stake.push({
                            status: 'lose',
                            pos: stakeUserCards['pos'],
                            gainings: insurance,
                            lose: parseFloat(stakeUserCards['stack']) - insurance
                        });
                        hasLost = true;
                    }
                }else if(stakeUserCards['first'] + stakeUserCards['second'] == 21  && stakeUserCards['points'] == 21 ){
                    if(filteredDealerCards[0]['totalPoints'] == 21 && filteredDealerCards[0]['count'] == 1){
                        sum += stakeUserCards['stack'];
                        stake.push({
                            status: 'push',
                            pos: stakeUserCards['pos'],
                            gainings: stakeUserCards['stack']
                        });
                        hasPush = true;
                    }else{
                        winAmount += stakeUserCards['stack'];
                        stake.push({
                            status: 'win',
                            pos: stakeUserCards['pos'],
                            gainings: stakeUserCards['stack'] * winRate
                        });
                        hasWon = true;
                    }
                }else if(stakeUserCards['points'] <= 21 && filteredDealerCards[0]['totalPoints'] <= 21){
                    if(stakeUserCards['points'] > filteredDealerCards[0]['totalPoints']){
                        winAmount += stakeUserCards['stack'];
                        if(stakeUserCards['points'] < 21){
                            winRate = 1;
                        }
                        stake.push({
                            status: 'win',
                            pos: stakeUserCards['pos'],
                            gainings: stakeUserCards['stack'] * winRate
                        });
                        hasWon = true;

                    }else if(stakeUserCards['points'] == filteredDealerCards[0]['totalPoints']){
                        sum += stakeUserCards['stack'];
                        stake.push({
                            status: 'push',
                            pos: stakeUserCards['pos'],
                            gainings: stakeUserCards['stack']
                        });
                        hasPush = true;
                    }else{
                        insuranceSum += insurance;
                        stake.push({
                            status: 'lose',
                            pos: stakeUserCards['pos'],
                            gainings: insurance,
                            lose: parseFloat(stakeUserCards['stack']) - insurance
                        });
                        hasLost = true;
                    }

                }else if(stakeUserCards['points'] <= 21 && filteredDealerCards[0]['totalPoints'] > 21){
                    winAmount += stakeUserCards['stack'];
                    stake.push({
                        status: 'win',
                        pos: stakeUserCards['pos'],
                        gainings: stakeUserCards['stack'] * winRate
                    });
                    hasWon = true;
                }else if(stakeUserCards['points'] > 21 && filteredDealerCards[0]['totalPoints'] <= 21){
                    insuranceSum += insurance;
                    stake.push({
                        status: 'lose',
                        pos: stakeUserCards['pos'],
                        gainings: insurance,
                        lose: parseFloat(stakeUserCards['stack']) - insurance
                    });
                    hasLost = true;
                }
            }
            try {
                if (hasWon) {
                    winAmount = winAmount + (winAmount * winRate) + sum;
                    context.log('winAmount ' + typeof winAmount);
                    //registerWin(string sessionId, string roundId, string roundBetId, string amount, object winBetData, string comment, object successCallback, object failureCallback)
                    resultCode = context.accountingHelper.registerWin(sessionId, settings.roundId, 0, undefined, "Won = " + winAmount + 'at round ' + settings.roundId,
                        function (sessionId, betObj, sum) {
                           if (user != null) {
                               notifyUser(sessionId, {
                                   success: true,
                                   type: "win",
                                   message: {
                                       balance: user.balance
                                   }
                               });
                           }
                        }, function (sessionId) {
                            context.logError("Register win failed");
                            notifyUser(seesionId, {
                                type: "error",
                                message: "REGISTER_WIN_ERROR"
                            });
                       });
                    context.log('resultCode ', resultCode);
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
                } else if (hasPush) {
                    resultCode = context.accountingHelper.registerWin(sessionId, settings.roundId, sum, null, "Push = " + sum + 'at round ' + settings.roundId,
                    function (sessionId, gBets, winAmount) {
                       if (user != null) {
                           notifyUser(sessionId, {
                               success: true,
                               type: "push",
                               message: {
                                   balance: user.balance
                               }
                           });
                       }
                    }, function (sessionId) {
                        context.logError("Register push failed");
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
                } else if (hasLost) {
                    if (insuranceSum > 0) {
                        resultCode = context.accountingHelper.registerWin(sessionId, settings.roundId, insuranceSum, null, "Insurance = " + insuranceSum + 'at round ' + settings.roundId,
                       function (sessionId, gBets, winAmount) {
                           if (user != null) {
                               notifyUser(sessionId, {
                                   success: true,
                                   type: "win",
                                   message: {
                                       balance: user.balance
                                   }
                               });
                           }
                       }, function (sessionId) {
                           context.logError("Register win failed");
                           if (user != null) {
                               notifyUser(sessionId, {
                                   success: false,
                                   type: "win",
                                   message: {
                                       error: "REGISTER_WIN_ERROR",
                                       balance: user.balance
                                   }
                               });
                           }
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
                    }
                    if (user != null) {
                        notifyUser(sessionId, {
                            type: "lose",
                            message: {
                                balance: user.balance
                            }
                        });
                    }
                }

            } catch (e) {
                context.log('Find winners error:' + e);
                context.logError(e);
                notifyUser(sessionId, {
                    type: "win",
                    message: {
                        success: false,
                        error: "REGISTER_WIN_ERROR",
                        balance: user.balance
                    }
                });
            }
            settings.roundId = context.roundCounter.increase();
            clearUserData(sessionId);
            shuffledMaps[gameId] = getRng(gameId).shuffle(cards);
            introVideo(gameId);
            return {success: true, stake:stake, balance: user.balance};
        }
        case "balance":
            return { success: true, balance: user.balance };
    }
};

function finishUserRound (sessionId){
    var tmpUserCards, tmpDealerCards;

    tmpUserCards = gUserCards.filter(function (uCards){
        return uCards.sessionId == sessionId;
    });

    tmpDealerCards = gDealerCards.filter(function(dCards){
        return dCards.sessionId == sessionId;
    });

    if(tmpDealerCards && tmpDealerCards.length>0){
            if(tmpDealerCards[0]['count'] !== undefined && tmpDealerCards[0]['count'] == 0){
            dispatcher(sessionId, {type: 'get_dealer_cards', sessionId: sessionId});
            dispatcher(sessionId, {type: 'stake', sessionId: sessionId});
        }
    }
}

function validateBet (sessionId, bet, position) {
    var filteredBet, filteredBetLength, sum = 0, i, isValid = true;
    var userSettings, userLimits = {}, maxLimit;

    userSettings = context.loadUserSettings(sessionId);
    if (userSettings && userSettings.limit){
        userLimits = userSettings.limit;
    } else{
        userLimits = context.gameConfiguration.Limits[0];
    }
    maxLimit = userLimits.Bet.Max;
    filteredBet = gBets.filter(function (bet) {
      return bet.sessionId === sessionId && bet.pos == position;
    });
    filteredBetLength = filteredBet.length;
    sum = bet;

    if(filteredBetLength > 0){
        for (i =0; i < filteredBetLength; i++){
           sum += filteredBet[i].amount;
        }
    }

    if(sum > maxLimit){
        isValid = false;
    }
    return isValid;

}

game_initialize();
setMessageDispatcher(dispatcher);