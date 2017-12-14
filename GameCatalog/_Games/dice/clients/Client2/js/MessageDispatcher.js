var GAMESTATE_CODE_TABLE_CLOSED = 0,
    GAMESTATE_CODE_TABLE_OPENED = 1,
    GAMESTATE_CODE_WINNING_NUMBER = 3,
    GAMESTATE_CODE_WINNING_SUM = 4,

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
        var text, status, winner, username;
        var gameInstance = game.state.states.Game;
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
                this.isSetWinNum = false;
                this.isTableOpen = true;
                gameInstance.resetTable();
                if (gameInstance.mode == "Manual")
                    gameInstance.restartGame();
                winAmount = 0;
                tableChips = [];
                text = $.client.getLocalizedString("Place your bet", true).toUpperCase();
                gameInstance.changeStatus(text, 0);
                if (self.timer)
                    self.timer.stop();
                var endTimer = function () {
                    self.isTableOpen = false;
                    self.isSetWinNum = false;
                    if (gameInstance.mode == "Manual")
                        text = $.client.getLocalizedString("Table closed", true).toUpperCase();
                    else
                        text = $.client.getLocalizedString("Table closed no more bets", true).toUpperCase();
                    gameInstance.changeStatus(text, 2);
                };
                var updateTimer = function (time) {
                    if (time == 10) {
                        gameInstance.changeStatus($.client.getLocalizedString('Final bets', true).toUpperCase(), 0);
                    }
                };
                if (msg.message.length) {
                    var timeToEnd = msg.message.length - 1;
                    if (self.timer) {
                        self.timer.start(timeToEnd, endTimer, updateTimer);
                    } else {
                        self.timer = gameInstance.createTimer(timeToEnd, endTimer, updateTimer);
                    }
                }
                self.userBets = [];
            } else if (status == GAMESTATE_CODE_WINNING_NUMBER) {
                var winnerText;
                this.isSetWinNum = true;
                this.winNumArr.push(winner);

                if (this.winNumArr.length > 9) {
                    this.winNumArr.shift();
                }
                if (betHistory.length > 3) {
                    betHistory.shift();
                }
                for (var i in game.criteria) {
                    for (var j in game.criteria[i].Items) {
                        if (game.criteria[i].Items[j].Value == msg.message.win_number) {
                            winner = game.criteria[i].Title;
                        }
                    }
                }
                text = $.client.getLocalizedString("Result", true).toUpperCase() + ': ' + winner;
                gameInstance.changeStatus(text, 0);
                betHistory.push({ winner: msg.message.win_number, betAmount: summaDeb, winAmount: 0 });
                if (self.timer)
                    self.timer.stop();
                if (gameInstance.clearWinAmout)
                    gameInstance.clearWinAmout();
                self.userBets = [];

            } else if (status == GAMESTATE_CODE_TABLE_CLOSED) {
                this.isTableOpen = false;
                this.isSetWinNum = false;
                if (self.timer)
                    self.timer.stop();
                if (gameInstance.mode == "Manual")
                    text = $.client.getLocalizedString("Table closed", true).toUpperCase();
                else
                    text = $.client.getLocalizedString("Table closed no more bets", true).toUpperCase();
                gameInstance.changeStatus(text, 2);
                if (gameInstance.saveRoundBet)
                    gameInstance.saveRoundBet();

            }
            } else if (msg.type == "win") {
                if (msg.message.success) {
                    winAmount += msg.message.win_sum;
                    USER_BALANCE = msg.message.balance;
                    game.state.states.Game.animateWinFactors(msg.message.win_factors);
                    headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                    text = $.client.getLocalizedString("You win", true).toUpperCase() + " " + $.client.UserData.CurrencySign + parseFloat(winAmount).toFixed(2);
                    betHistory[betHistory.length - 1].winAmount = parseFloat(winAmount).toFixed(2);
                    gameInstance.changeStatus(text, 1,false,2000);
                    if (gameInstance.showWinner)
                        gameInstance.showWinner(winAmount);
                } else {
                    if (msg.message.error)
                        gameInstance.changeStatus($.client.getLocalizedString(msg.message.error, true), 1);
                }
            } else if (msg.type == "user") {
            USER_NAME = msg.message.user.nick;
            USER_BALANCE = msg.message.balance;
            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
            var name = USER_NAME ? USER_NAME.toUpperCase().length < 15 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 15) + '...' : "";
            if (userNameText) userNameText.setText(name);

            self.userBets = msg.message.bets;
            if (gameInstance.drawBetsChip && msg.message.bets)
                gameInstance.drawBetsChip({ stake: { factors: msg.message.bets } });

            if (msg.message.user.isPlayingForFun) {
                gameInstance.showCashier(false);
            } else if ($.client.UserData.Features && $.client.UserData.Features.cashier) {
                gameInstance.showCashier(true);
            } else {
                gameInstance.showCashier(false);
            }
            gameInstance.isPlayingForFun = msg.message.user.isPlayingForFun;
            if (gameInstance.isPlayingForFun) {
                setInterval(function () {
                    text = $.client.getLocalizedString("PLAYING FOR FUN", true).toUpperCase();
                    gameInstance.changeStatus(text, 0, true, 1000);
                }, 5000);
            }
        } else if (msg.type == "config") {
            game.config = msg.message.configuration;
            game.criteria = msg.message.configuration.Criteria;
            var videoOnDemand = false;
            gameInstance.mode = msg.message.mode;
            if (msg.message.mode == "Auto" || msg.message.mode == "Manual") {
                videoOnDemand = true;
            }
            if (mode == modes.landscape) {
                $.client.getVideoPlayer('landscape_video', videoOnDemand);
                $('#landscape_video').show();
            } else {
                $.client.getVideoPlayer('portrait_video', videoOnDemand);
                $('#portrait_video').show();
            }
            if (msg.message.waitTime) {
                timeToEnd = parseInt(msg.message.waitTime) + 1;
                if (!self.timer) {
                    self.timer = gameInstance.createTimer(timeToEnd);
                }
            }
        } else if (msg.type == "refresh_user_data") {
            USER_BALANCE = msg.message.user.balance;
            USER_NAME = msg.message.user.nick;
            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
            var name = USER_NAME ? USER_NAME.toUpperCase().length < 15 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 15) + '...' : "";
            if (userNameText) userNameText.setText(name);
        } else if (msg.type == "balance") {
            console.log(msg);
            USER_BALANCE = msg.message.balance;
            TOTAL_LOST = parseFloat(msg.message.totalLost).toFixed(2);
            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
        }
        else if (msg.type == "error") {
            if (msg.message) {
                if (msg.target == "promt") {
                    $.client.showPromt($.client.getLocalizedString(msg.message, true), $.client.getLocalizedString("Ok", true), null, function () { });
                } else {
                    text = $.client.getLocalizedString(msg.message, true).toUpperCase();
                    gameInstance.changeStatus(text, 2, true);
                }
            }
        } else if (msg.type == "clearTable") {
            gameInstance.resetTable();
            self.winAmount = 0;
        }
        previousMsgType = msg.type;
    }
    }
};