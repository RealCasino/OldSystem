var GAMESTATE_CODE_TABLE_CLOSED = 0,
    GAMESTATE_CODE_TABLE_OPENED = 1,
    GAMESTATE_CODE_PLACE_YOUR_BET = 2,
    GAMESTATE_CODE_WINNING_NUMBER = 3,
    GAMESTATE_CODE_NO_MORE_BETS = 4,
    GAMESTATE_CODE_BALL_IN_RIM = 5,

MessageDispatcher = {
    winNumArr: [],
    previousMsgType: "",
    isSetWinNum: false,
    isTableOpen: false,
    gameStatus: "",
    winAmount: 0,
    timer:null,
    betHistory:[],
    videoCallBack:null,
	messages:[],
    handle: function (msg,old) {
		var self = this;
        var text, status, winNumber, videoTimeout;
        var gameInstance = game.state.states.MainMenu;
        if (!gameInstance.ready) {
            if (!old)
                self.messages.push(msg);
            if (!self.queueTimer)
                self.queueTimer = setInterval(function () {
                    if (gameInstance.ready && self.messages.length > 0) {
                        for (var i = 0; i < self.messages.length; i++) {
                            self.handle(self.messages[i], true);
                        }
                        self.messages = [];
                        clearInterval(self.queueTimer);
                        self.queueTimer = null;
                    }
                }, 200);
        } else if (self.messages.length > 0 && !old) {
            self.messages.push(msg);
            if (gameInstance.ready && self.messages.length > 0)
                for (var i = 0; i < self.messages.length; i++) {
                    self.handle(self.messages[i], true);
                }
            self.messages = [];
            clearInterval(self.queueTimer);
            self.queueTimer = null;
        } else {
            if (msg.type == "status") {
                status = msg.message.status;
                if (status == GAMESTATE_CODE_TABLE_OPENED) {
                    if (gameInstance.mode == "Manual")
                        gameInstance.restartGame();
                    self.isSetWinNum = false;
                    self.isTableOpen = true;
                    gameInstance.resetTable();
                    if (gameInstance.drawBetsChip)
                        gameInstance.drawBetsChip(self.userBets);
                    self.winAmount = 0;
                    text = '';
                    text +=$.client.getLocalizedString("TEXT_DISPLAY_MSG_WAITING_BET",true);
                    gameInstance.changeStatus(text,0);
                        var endTimer = function () {
                            self.isTableOpen = false;
                            self.isSetWinNum = false;
                            if (gameInstance.mode == "Manual")
                                text = $.client.getLocalizedString("Table closed", true).toUpperCase();
                            else
                                text = $.client.getLocalizedString("TEXT_TABLE_CLOSED_NO_MORE_BETS", true);
                            gameInstance.changeStatus(text, 2);
                        };
                        var updateTimer = function (time) {
                            if (time == 10) {
                                gameInstance.changeStatus($.client.getLocalizedString('TEXT_FINAL_BETS', true), 0);
                            }
                        };
                        if (msg.message.duration) {
                            var timeToEnd = msg.message.duration - 1;
                            if (self.timer) {
                                self.timer.start(timeToEnd, endTimer, updateTimer);
                            } else {
                                self.timer = gameInstance.createTimer(timeToEnd, endTimer, updateTimer);
                            }
                        }
                        self.userBets = [];
                }
                else if (status == GAMESTATE_CODE_WINNING_NUMBER) {
                    var winnerText;
                    self.winner = parseInt(msg.message.winner);
                    gameInstance.removeLossesBet(msg.message.winner);
                    if (self.winner == betType.punto)
                        winnerText = $.client.getLocalizedString("Punto", true);
                    else if (self.winner == betType.tie)
                        winnerText = $.client.getLocalizedString("Tie", true);
                    else if (self.winner == betType.banco)
                        winnerText = $.client.getLocalizedString("Banco", true);
                    text = $.client.getLocalizedString("TEXT_WIN_NUMBER", true) + ' ' + winnerText.toUpperCase();
                    self.isSetWinNum = true;
                    self.winNumArr.push(self.winner);

                    if (self.winNumArr.length > 9) {
                        self.winNumArr.shift();
                    }
                    gameInstance.changeStatus(text, 0);
                    if (betHistory.length > 2) {
                        betHistory.shift();
                    }

                    betHistory.push({ winner: winnerText, betAmount: summaDeb, winAmount: 0 });
                    gameInstance.updateStatistics();
                    if (gameInstance.clearWinAmout)
                        gameInstance.clearWinAmout();
                    self.userBets = [];
                }
                else if (status == GAMESTATE_CODE_TABLE_CLOSED) {
                    self.isTableOpen = false; 
                    self.isSetWinNum = false;
                    timeToEnd = 0;
                    if (self.timer)
                        self.timer.stop();
                    if (gameInstance.mode == "Manual")
                        text = $.client.getLocalizedString("Table closed",true).toUpperCase();
                    else
                        text = $.client.getLocalizedString("TEXT_TABLE_CLOSED_NO_MORE_BETS", true);
                    gameInstance.changeStatus(text,2);
                    if (tableStatus != undefined) {
                        tableStatus.loadTexture('statusBg', 2);
                    }
                    if (gameInstance.saveRoundBet)
                        gameInstance.saveRoundBet();
                    gameInstance.updateStatistics();
                    gameInstance.clearAllBet();
                }
            } else if (msg.type == "win") {
                if (msg.message.success) {
                    self.winAmount += msg.message.winsum;
                    USER_BALANCE = msg.message.balance;
                    headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                    betHistory[betHistory.length - 1].winAmount = parseFloat(self.winAmount).toFixed(2);
                    text = $.client.getLocalizedString("TEXT_DISPLAY_MSG_PLAYER_WIN", true) + $.client.UserData.CurrencySign + parseFloat(self.winAmount).toFixed(2);
                    gameInstance.changeStatus(text, 1,false,2000);
                    if (gameInstance.showWinner)
                        gameInstance.showWinner(self.winAmount);
                } else {
                    if (msg.message.error)
                        gameInstance.changeStatus($.client.getLocalizedString(msg.message.error, true), 1);
                }

            } else if (msg.type == "user") {
                if (msg.message.waitTime) {
                    timeToEnd = parseInt(msg.message.waitTime) + 1;
                    if (!self.timer) {
                        self.timer = gameInstance.createTimer(timeToEnd);
                    }
                }
                var videoOnDemand = false;
                if (msg.message.mode == "Auto" || msg.message.mode == "Manual") {
                    videoOnDemand = true;
                }
                if (msg.message.user.isPlayingForFun) {
                    gameInstance.showCashier(false);
                } else if ($.client.UserData.Features && $.client.UserData.Features.cashier) {
                    gameInstance.showCashier(true);
                } else {
                    gameInstance.showCashier(false);
                }
                gameInstance.mode = msg.message.mode;
                gameInstance.isPlayingForFun = msg.message.user.isPlayingForFun;
                if (gameInstance.isPlayingForFun) {
                    setInterval(function () {
                        text = $.client.getLocalizedString("PLAYING FOR FUN", true).toUpperCase();
                        gameInstance.changeStatus(text, 0, true, 1500);
                    }, 6000);
                }
                if (mode == modes.landscape) {
                    $.client.getVideoPlayer('landscape_video', videoOnDemand);
                    $('#landscape_video').show();
                } else {
                    $.client.getVideoPlayer('portrait_video', videoOnDemand);
                    $('#portrait_video').show();
                }
                self.userBets = msg.message.bets;
                console.log(self.userBets);
                if (gameInstance.drawBetsChip)
                    gameInstance.drawBetsChip(msg.message.bets);
                USER_NAME = msg.message.user.nick;
                USER_BALANCE = msg.message.balance;
                headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                var name = USER_NAME ? USER_NAME.toUpperCase().length < 12 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 12) + '...' : "";
                if (userNameText) userNameText.setText(name);

            } else if (msg.type == "refresh_user_data") {
                USER_BALANCE = msg.message.user.balance;
                USER_NAME = msg.message.user.nick;
                headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                var name = USER_NAME ? USER_NAME.toUpperCase().length < 12 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 12) + '...' : "";
                if (userNameText) userNameText.setText(name);
            } else if (msg.type == "balance") {
                USER_BALANCE = msg.message.balance;
                TOTAL_LOST = msg.message.totalLost;
                headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
            } else if (msg.type == "error") {
                if (msg.message) {
                    if (msg.target == "promt") {
                        $.client.showPromt($.client.getLocalizedString(msg.message, true), $.client.getLocalizedString("Ok", true), null, function () { });
                    } else {
                        text = $.client.getLocalizedString(msg.message, true).toUpperCase();
                        gameInstance.changeStatus(text, 2, true, 3000);
                    }
                }
            }
            else if (msg.type == "clearTable") {
                gameInstance.resetTable();
                self.winAmount = 0;
            }
            self.previousMsgType = msg.type;
        }
    }
};